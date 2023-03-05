<template>
<slot></slot>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
// Needed types
import { getCurrentInstance, onBeforeUnmount, useAttrs, defineProps } from "vue"

// Props
const props = defineProps({
  constructor: { type: Function, required: true },
  arguments: { type: Array, required: false },
  cleanup:  { type: Function, required: false },
  isFunction:  { type: Boolean, default: false },
  modelValue:  { type: Object, required: false },
  append:  { type: Function, required: false },
  isParent:  { type: Boolean, required: false },
})

// Create the object
type Constructable = { new(...args: any[]): any }
const constructor = props.constructor as Constructable
const hasArguments = props.arguments && props.arguments.length > 0
const object = props.modelValue ? props.modelValue : props.isFunction ?
  ( hasArguments ? props.constructor(...props.arguments as any) : props.constructor() ) :
  ( hasArguments ? new constructor(...props.arguments as any) : new constructor() )

// Apply attributes to value
const attrs = useAttrs()
for(const key in attrs) {
  (object as any)[key] = attrs[key]
}

// parenting if it is a child
const instance = getCurrentInstance()
if (
  props.append
  && instance && instance.parent
  && instance.parent.exposed
  && instance.parent.exposed.object
) {
  props.append(instance.parent.exposed.object, object)
}

// expose our object and emit our model update
const emit = defineEmits<{ (e: 'update:modelValue', value: Object): void }>()
defineExpose({ object })
emit('update:modelValue', object)

// potential cleanup
onBeforeUnmount(function () {
  if (props.cleanup) {
    props.cleanup()
  }
})

</script>

<style scoped>

</style>

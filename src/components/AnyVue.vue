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
import { getCurrentInstance, onBeforeUnmount, useAttrs, PropType } from "vue";

// Props
type Constructable = { new(...args: any[]): any }
type Creator = (...args: any[]) => Object
const props = defineProps({
  construct: { type: Object as PropType<Creator | Constructable>, required: true },
  arguments: { type: Array, required: false },
  cleanup:  { type: Function, required: false },
  isFunction:  { type: Boolean, default: false },
  modelValue:  { type: Object, required: false },
  append:  { type: Function, required: false },
  isParent:  { type: Boolean, required: false },
})

// Create the object
const construct: Constructable | Creator = props.construct as Constructable | Creator
const hasArguments = props.arguments && props.arguments.length > 0
const object = props.modelValue ? props.modelValue : props.isFunction ?
    ( hasArguments ? (props.construct as Creator)(...props.arguments as any) : (props.construct as Creator)() ) :
    ( hasArguments ? new (construct as Constructable)(...props.arguments as any) : new (construct as Constructable)() )

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

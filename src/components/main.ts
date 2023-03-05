import type { App } from 'vue';
import { AnyVue } from "@/components";

export default {
    install: (app: App) => {
        app.component('AnyVue', AnyVue);
    }
};

export { AnyVue };
import { defineCustomElement } from "./CustomElement/apiCustomElement";
import { addImmersiveMenuEntry, addMainMenuEntry } from "./api/MenuEntry";
import { PluginAPI } from "./api/PluginAPI";
import { customElementName } from "./utils";
import config from './plugin.config.ts'
import { _amOT } from "./imported/port.js";
import "./imported/style.scss";
import PluginSettings from "./components/PluginSettings.vue";

/**
 * Custom Elements that will be registered in the app
 */
export const CustomElements
    = {
    'plugin-settings':
        defineCustomElement(PluginSettings, {
            shadowRoot: false,
        }),
}

export default {
    name: 'Butterchurn Visualizer',
    identifier: config.identifier,
    /**
     * Defining our custom settings panel element
     */
    SettingsElement: customElementName('plugin-settings'),
    /**
     * Initial setup function that is executed when the plugin is loaded
     */
    setup() {
        // Temp workaround
        // @ts-ignore
        window.__VUE_OPTIONS_API__ = true

        for (const [key, value] of Object.entries(CustomElements)) {
            const _key = key as keyof typeof CustomElements;
            customElements.define(customElementName(_key), value)
        }
        addMainMenuEntry({
            label: "Open Visualizer",
            onClick() {
                // goToPage({
                //     name: 'page-helloworld'
                // });
                _amOT.VizToggle();
            },
        })

        addImmersiveMenuEntry({
            label: "Toggle Visualizer",
            onClick() {
                _amOT.VizToggle();

                if (!_amOT.viz.running) {
                    document.querySelector('.player-modal')?.classList.remove('force-transparent')
                    document.querySelector('.blurmap')?.classList.remove('hidden')
                } else {
                    document.querySelector('.player-modal')?.classList.add('force-transparent')
                    document.querySelector('.blurmap')?.classList.add('hidden')
                }

            },
        })

        addImmersiveMenuEntry({
            label: "Configure Visualizer",
            onClick() {
                _amOT.VizConfig();
            },
        })

    },
} as PluginAPI
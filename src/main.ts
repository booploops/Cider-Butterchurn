import { defineCustomElement } from "vue";
import { addImmersiveMenuEntry, addMainMenuEntry } from "@ciderapp/pluginkit";
import { definePluginContext } from "@ciderapp/pluginkit";
import { _amOT } from "./imported/port.js";
import "./imported/style.scss";
import PluginSettings from "./components/PluginSettings.vue";
import VizSettings from "./components/VizSettings.vue";
import { subscribeEvent } from "@ciderapp/pluginkit";
import { addImmersiveLayout } from "@ciderapp/pluginkit"
import CustomImmersiveLayout from "./components/CustomImmersiveLayout.vue";
import pluginConfig from "./plugin.config.ts";

/**
 * Custom Elements that will be registered in the app
 */
export const CustomElements
    = {
    'plugin-settings':
        defineCustomElement(PluginSettings, {
            shadowRoot: false,
        }),
    'viz-settings':
        defineCustomElement(VizSettings, {
            shadowRoot: false,
        }),
    'immersive-layout': defineCustomElement(CustomImmersiveLayout, {
        shadowRoot: false,
    })
}

const { plugin, setupConfig, customElementName, goToPage, useCPlugin } = definePluginContext({
    ...pluginConfig,
    CustomElements,
    /**
     * Initial setup function that is executed when the plugin is loaded
     */
    setup() {

        for (const [key, value] of Object.entries(CustomElements)) {
            const _key = key as keyof typeof CustomElements;
            customElements.define(customElementName(_key), value)
        }

        this.SettingsElement = customElementName('plugin-settings');

        subscribeEvent('immersive:closed', () => {
            if (_amOT.viz.running) {
                _amOT.StopViz();
            }
        })

        // useMusicKit().addEventListener(MusicKit.Events.nowPlayingItemDidChange, (e) => {
        //     if(!_amOT.viz.running) return;
        //     // @ts-ignore
        //     _amOT.viz.visualizer?.launchSongTitleAnim(e?.item?.title)
        // })

        addImmersiveLayout({
            name: "Visualizer Centered",
            identifier: "booploops-butterchurn-visualizer",
            component: customElementName('immersive-layout'),
            type: 'normal',
        })

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
})

/**
 * Exporting the plugin and functions
 */
export { setupConfig, customElementName, goToPage, useCPlugin };

/**
 * Exporting the plugin, Cider will use this to load the plugin
 */
export default plugin;
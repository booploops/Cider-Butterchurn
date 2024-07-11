import { defineCustomElement } from "./CustomElement/apiCustomElement";
import { addImmersiveMenuEntry, addMainMenuEntry } from "./api/MenuEntry";
import { PluginAPI } from "./api/PluginAPI";
import { customElementName } from "./utils";
import config from './plugin.config.ts'
import { _amOT } from "./imported/port.js";
import "./imported/style.scss";
import PluginSettings from "./components/PluginSettings.vue";
import VizSettings from "./components/VizSettings.vue";
import { subscribeEvent } from "./api/Events.ts";
import { addImmersiveLayout } from "./api/ImmersiveLayout.ts";
import CustomImmersiveLayout from "./components/CustomImmersiveLayout.vue";
import { useMusicKit } from "./api/MusicKit.ts";

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

        for (const [key, value] of Object.entries(CustomElements)) {
            const _key = key as keyof typeof CustomElements;
            customElements.define(customElementName(_key), value)
        }

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
} as PluginAPI

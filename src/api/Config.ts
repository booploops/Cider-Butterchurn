import { Ref, ref, watch } from "vue";
import { useCPlugin } from "./CPlugin";
import { useCider } from "./Std";
import { clone, merge } from 'lodash'


/**
 * Setup the configuration section for the plugin in the Cider config.
 * @param defaults The default configuration for the plugin.
 * @returns Usable configuration object.
 */
export function setupConfig<T extends Record<string, any>>(defaults: T): Ref<T> {
    const cfg = { ...defaults };
    const config = useCider().config.getRef();
    const { identifier } = useCPlugin();

    if (!config['plugins']) {
        config['plugins'] = {};
    }
    if (!config['plugins'][identifier]) {
        config['plugins'][identifier] = {};
    }

    const pluginConfig = config['plugins'][identifier];
    config['plugins'][identifier] = merge(cfg, pluginConfig);

    const cfgRef = ref(clone(config['plugins'][identifier]));

    watch(() => cfgRef, (newVal) => {
        config['plugins'][identifier] = newVal;
    }, {
        deep: true,
    })

    return cfgRef;
}

export async function saveConfig() {
    return useCider().config.saveConfig();
}
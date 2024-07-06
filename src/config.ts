/**
 * Example for how you may want to setup your configuration.
 */

import { setupConfig } from "./api/Config";

export const cfg = setupConfig({
    favoriteColor: <'red' | 'green' | 'blue'>'blue',
    count: <number>0,
    booleanOption: <boolean>false,
});

export function useConfig() {
    return cfg.value;
}
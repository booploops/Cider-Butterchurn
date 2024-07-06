export type PluginAPI = {
    setup(): void;
    name: string;
    identifier: string;
    SettingsElement?: string;
}
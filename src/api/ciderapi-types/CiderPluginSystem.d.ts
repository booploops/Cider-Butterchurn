declare namespace __PLUGINSYS__ {
    const Components: {
        MainMenu: {
            addMenuItem(item: import("../MenuEntry").MenuItem): import("../MenuEntry").MenuItem
            removeMenuItem(item: import("../MenuEntry").MenuItem): void
            items: import("../MenuEntry").MenuItem[]
        },
        ImmersiveMenu: {
            addMenuItem(item: import("../MenuEntry").MenuItem): import("../MenuEntry").MenuItem
            removeMenuItem(item: import("../MenuEntry").MenuItem): void
            items: import("../MenuEntry").MenuItem[]
        },
        MediaItemContextMenu: {
            addMenuItem(item: import("../MenuEntry").MenuItem): import("../MenuEntry").MenuItem
            removeMenuItem(item: import("../MenuEntry").MenuItem): void
            items: import("../MenuEntry").MenuItem[]
        },
        CustomButtons: {
            addCustomButton(opts: import("../CustomButton").CustomButtonOptions): void
            removeCustomButton(opts: import("../CustomButton").CustomButtonOptions): void
            buttons: import("../CustomButton").CustomButtonOptions[]
        }
    }

    const Quasar: {
        Dialog: any;
    }

    const PAPIInstance: {
        addEventListener(event: import('./PAPIEvents').PAPIEvents, cb: (e: any) => void, opts?: Partial<{ once: boolean, passive: boolean, capture: boolean }>): void
        removeEventListener(event: import('./PAPIEvents').PAPIEvents, cb: (e: any) => void): void
    }
}
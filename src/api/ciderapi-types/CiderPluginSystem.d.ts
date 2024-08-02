interface RenderComponentOptions {
    component: import('../ComponentNames').ComponentNames;
    props?: Record<string, any>;
    element: Element;
}


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
        ImmersiveLayouts: {
            addLayout(layout: import("../ImmersiveLayout.ts").CustomImmersiveLayout): void
            removeLayout(layout: import("../ImmersiveLayout.ts").CustomImmersiveLayout): void
            layouts: import("../ImmersiveLayout.ts").CustomImmersiveLayout[]
        },
        MediaItemContextMenu: {
            addMenuItem(item: import("../MenuEntry").MenuItem): import("../MenuEntry").MenuItem
            removeMenuItem(item: import("../MenuEntry").MenuItem): void
            removeLayoutByIdentifier(identifier: string): void
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

    const App: {
        Components: import('../ComponentNames').ComponentNames[]
        RenderComponent: (opts: RenderComponentOptions) => void
        vue: {
            render: (component: any, element: Element) => void
            h: (component: any, props: Record<string, any>, children: any) => void
        }
    }
}
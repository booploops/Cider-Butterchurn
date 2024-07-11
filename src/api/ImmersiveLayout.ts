export type CustomImmersiveLayout = {
    name: string;
    identifier: string;
    component: string;
    type?: 'normal' | 'portrait';
  }

export function addImmersiveLayout(layout: CustomImmersiveLayout) {
    return __PLUGINSYS__.Components.ImmersiveLayouts.addLayout(layout)
}

export function removeImmersiveLayout(layout: CustomImmersiveLayout) {
    return __PLUGINSYS__.Components.ImmersiveLayouts.removeLayout(layout)
}

export function removeImmersiveLayoutById(identifier: string) {
    return __PLUGINSYS__.Components.MediaItemContextMenu.removeLayoutByIdentifier(identifier)
}
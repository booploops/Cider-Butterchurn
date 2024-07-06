export type MenuItem = {
    label: string,
    icon?: string,
    onClick: (item: any) => void
}

/**
 * Add a new entry to the main menu
 * 
 * @returns a function that removes the entry from the main menu
 */
export function addMainMenuEntry(item: MenuItem) {
    const _item = __PLUGINSYS__.Components.MainMenu.addMenuItem(item);

    // return a removal function
    return () => {
        __PLUGINSYS__.Components.MainMenu.removeMenuItem(_item);
    }
}

/**
 *  Add a new entry to the media item context menu
 * 
 * @returns a function that removes the entry from the media item context menu 
 */
export function addMediaItemContextMenuEntry(item: MenuItem) {
    const _item = __PLUGINSYS__.Components.MediaItemContextMenu.addMenuItem(item);

    // return a removal function
    return () => {
        __PLUGINSYS__.Components.MediaItemContextMenu.removeMenuItem(_item);
    }
}

export function addImmersiveMenuEntry(item: MenuItem) {
    const _item = __PLUGINSYS__.Components.ImmersiveMenu.addMenuItem(item);

    // return a removal function
    return () => {
        __PLUGINSYS__.Components.ImmersiveMenu.removeMenuItem(_item);
    }
}

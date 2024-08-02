export type CustomButtonOptions = {
    location: 'chrome-top/right' | 'mojave/player/right'
    /**
     * Will be sent to innerHTML of the button
     */
    element: string;
    menuElement?: string;
    ctxMenuElement?: string;
    title: string;
    onClick?: (e: MouseEvent) => void;
    onContextMenu?: (e: MouseEvent) => void;
  }
  



export function addCustomButton(opts: CustomButtonOptions) {
    __PLUGINSYS__.Components.CustomButtons.addCustomButton(opts)
}
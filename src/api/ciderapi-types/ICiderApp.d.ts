import {App} from "vue"
/**
 * This is the global CiderApp object, for debugging and plugin purposes.
 */
interface ICiderApp {
    /**
     * AppFS file system.
     */
    AppFS: {
      /**
       * Read a file from the AppFS.
       */
      readFile(fileName: string): Promise<string>,
      /**
       * Write a file to the AppFS.
       */
      writeFile(fileName: string, contents: string): Promise<void>,
    },
    /**
     * CiderFirebase class
     */
    CiderFirebase: any,
    /**
     * CiderCompose class
     */
    CiderCompose: any,
    /**
     * CiderPlaylists class
     */
    CiderPlaylists: any,
    /**
     * CiderStripe class
     */
    CiderStripe: any,
    /**
     * ClientDB
     */
    DexieDB: any,
    /**
     * PouchDB object
     */
    PouchDb: any,
    /**
     * Apple Music URL functions
     */
    amURL: {
      /**
       * Open an Apple Music URL in the app.
       * @param url
       */
      openAppleMusicURL(url: string): void,
    },
    /**
     * Vue app instance
     */
    app: App,
    /**
     * Pinia App state
     */
    appState: any,
    /**
     * Cider config
     */
    config: any,
    /**
     * Dialogs
     */
    dialogs: {
      /**
       * Immersive modal
       */
      immersive(): void,
      /**
       * Settings Modal
       */
      settings(): void,
    },
    /**
     * Force the platform to a specific value.
     * @param platform
     */
    forcePlatform(platform: undefined | null | "win32" | "linux" | "darwin"): void,
    /**
     * Handle a protocol URL.
     * @param url
     */
    handleProtocolURL(url: string): void,
    /**
     * MusicKit Store
     */
    musicKitStore: any,
    /**
     * Vue router instance
     */
    router: any,
    /**
     * Pinia store
     */
    store: any,
    /**
     * URI handler
     */
    uriHandler: {
      /**
        * Call all functions that have been added to the onUri event.
        * This is called by the main process when the app receives a URI.
      */
      onUri(uri: string): void,
    },
  }
  
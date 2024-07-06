/**
 * This is the global CiderApp object, for debugging and plugin purposes.
 */
declare namespace CiderApp {
    /**
     * AppFS file system.
     */
    const AppFS: {
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
      openAppleMusicURL(url: string): void
    }
    /**
     * Quasar
     */
    const quasar: typeof import("quasar")
    /**
     * Vue app instance
     */
    const app: import("vue").App
    /**
     * Pinia App state
     */
    const appState: any
    /**
     * Cider config
     */
    const config: any
    /**
     * Dialogs
     */
    const dialogs: {
      /**
       * Immersive modal
       */
      immersive(): void
      /**
       * Settings Modal
       */
      settings(): void
    }
    /**
     * Force the platform to a specific value.
     * @param platform
     */
    function forcePlatform(platform: undefined | null | "win32" | "linux" | "darwin"): void
    /**
     * Handle a protocol URL.
     * @param url
     */
    function handleProtocolURL(url: string): void
    /**
     * MusicKit Store
     */
    const musicKitStore: any
    /**
     * Vue router instance
     */
    const router: import("vue-router").Router
    /**
     * Pinia store
     */
    const store: import("pinia").Pinia
    /**
     * URI handler
     */
    const uriHandler: {
      /**
        * Call all functions that have been added to the onUri event.
        * This is called by the main process when the app receives a URI.
      */
      onUri(uri: string): void
    }
  }
  
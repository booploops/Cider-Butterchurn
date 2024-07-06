interface Window {
  /**
   * Global object for the Cider app.
   *
   * Intended for debugging and plugin purposes.
   */
  // CiderApp: ICiderApp
  /**
   * .NET Bindings
   * @suspended
   */
  chrome: {
    webview: any
  }
  /**
   * @deprecated
   */
  go: any,
  /**
   * @deprecated
   */
  runtime: any,
  /**
   * The build info of the app.
   */
  __BUILDINFO__: BUILD_INFO
  /**
   * Tauri global object
   */
  __TAURI__: any,
  /**
   * The version of the app.
   */
  APP_VERSION: string,

  MusicKit: any,

}

/**
 * MusicKit JS API
 * 
 * Learn more at https://developer.apple.com/documentation/musickitjs
 */
declare const MusicKit: any;

interface BUILD_INFO {
  BUILD_DATE: string,
  APP_VERSION: string,
  GIT_COMMIT: string,
}
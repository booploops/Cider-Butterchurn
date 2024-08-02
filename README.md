<div align="center">
 <img src="./repo_assets/header-preivew.png" style="width: 600px;"/> 
 </div>

# Butterchurn Visualizer Plugin for [Cider](https://cider.sh/)

⚠️ **Requires Cider 2.5.0 or later**

⚠️ **Requires Cider Audio Enabled**

## Available Commands
- `npm run dev` - Start development server, Cider can then listen to this server when you select "Enable Vite" from the main menu
- `npm run build` - Build the plugin to `dist/dev.booploops.butterchurn-visualizer/`

## How to install after build
- Copy the `dist/dev.booploops.butterchurn-visualizer/` folder to the `/plugins` directory of your Cider app data directory
    - On Windows, this is `%APPDATA%\C2Windows\plugins`
    - On macOS, this is `~/Library/Application Support/sh.cider.electron/plugins`
    - On Linux, this is `~/.config/sh.cider.electron/plugins`

## More Information

For more information on how to build your own plugin check out: https://github.com/ciderapp/plugin-template-wip

## Technical Information

This plugin has been ported from Apple Music Electron to Cider 1.x to Cider 2.x.  

The code around this is of *questionable* quality.  Mainly ported as proof of concept but will be improved over time as the Cider Plugin API and this plugin matures.  As most of the code is a straight import from a JS only project a lot of TS rules have been disabled.


## Credits

Butterchurn: https://github.com/jberg/butterchurn

Butterchurn Presets: https://github.com/jberg/butterchurn-presets

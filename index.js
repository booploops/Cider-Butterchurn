const path = require("path")


module.exports = class ButterchurnVisualizer {
    constructor(env) {
        // Define plugin enviornment within the class
        this.env = env
    }

    // Called when the backend is ready
    onReady(win) {
        console.log("=== Visualizer Loaded ===")
    }

    // Called when the renderer is ready (app.init())
    onRendererReady(win) {
        // Load the frontend plugin
        this.env.utils.loadJSFrontend(path.join(this.env.dir, "index.frontend.js"))
        this.env.utils.loadJSFrontend(path.join(this.env.dir, "plugin-visualizer-butterchurn.js"))
        this.env.utils.loadJSFrontend(path.join(this.env.dir, "plugin-visualizer-butterchurnExtraImages.js"))
        this.env.utils.loadJSFrontend(path.join(this.env.dir, "full-presets.js"))
    }
}

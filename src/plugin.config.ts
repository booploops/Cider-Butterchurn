import { createId } from "@paralleldrive/cuid2"

export default {
    ce_prefix: createId(),
    identifier: 'dev.booploops.butterchurn-visualizer',
    name: 'Butterchurn Visualizer for Cider',
    description: 'Adds a visualizer to the app.',
    version: '0.0.2',
    author: 'booploops',
    repo: 'https://github.com/booploops/Cider-Butterchurn',
    entry: {
        'plugin.js': {
            type: 'main',
        }
    }
}
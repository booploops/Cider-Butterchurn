declare namespace PAPITypes {
    declare namespace App {
        type Ready = {}
    }
    declare namespace Shell {
        type LayoutTypeChanged = {
            type: 'immersive' | 'miniplayer' | 'browser'
        }
        type ImmersiveOpened = {}
        type ImmersiveClosed = {}
        type MiniplayerOpened = {}
        type MiniplayerClosed = {}
    }
}

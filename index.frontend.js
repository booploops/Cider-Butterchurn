// Excuse the ugliness. This plugin is ported from AME and needs some cleanup.
var AMEx = {
    context: new AudioContext(),
    result: {},
}
// Viz & EQ
var _amOT = {
    viz: {
        visualizer: "",
        preset: {},
        presetName: "",
        presets: {},
        renderSize: [1600, 1200],
        running: false,
        ready: false,
        chromeVisible: false,
        scale: 1.0,
        canvas: document.createElement("canvas"),
        lyrics: document.createElement("div")
    },
    Start() {
        const menuEntry = new CiderFrontAPI.Objects.MenuEntry()
        menuEntry.name = "Toggle Visualizer"
        menuEntry.onClick = ()=>{
            _amOT.VizToggle()
        }
        CiderFrontAPI.AddMenuEntry(menuEntry)
        
    },
    VizToggle: function () {
        if(CiderAudio.context) {
            _amOT.amplifyMedia()
            if (_amOT.viz.running) {
                _amOT.StopViz()
            } else {
                _amOT.StartViz()
            }
        }else{
            bootbox.alert("Audio Context not ready yet")
        }
    },
    StopViz: function () {
        chromeBottom.style.position = ""
        chromeBottom.style.bottom = ""
        chromeBottom.style.left = ""
        appNavigation.style.marginTop = ""
        _amOT.viz.canvas.style.display = "none"
        _amOT.viz.running = false
        _amOT.SetAppChromeVisibility(false)
        document.querySelector("#app-main").removeAttribute("vis-style")
    },
    ToggleFullscreen: function () {
        var element = document.body
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    },
    VizConfig: async function () {
        let favorites = await CiderCache.getCache("viz-favorites")
        if(!favorites) {
            favorites = []
        }
        let content = document.createElement("div")
        let preLabel = document.createElement("label")
        let preSelect = document.createElement("select")
        let favLabel = document.createElement("label")
        let favSelect = document.createElement("select")
        let fullscreenBtn = document.createElement("button")
        let closeVizBtn = document.createElement("button")
        let scaleInput = document.createElement("input")
        let scaleLabel = document.createElement("label")
        let addFavoriteBtn = document.createElement("button")
        let removeFavoriteBtn = document.createElement("button")

        scaleLabel.innerHTML = "Render Scale: <br>"
        scaleLabel.appendChild(scaleInput)

        scaleInput.type = "number"
        scaleInput.min = 10
        scaleInput.max = 100
        scaleInput.style.fontSize = "25px"
        scaleInput.style.width = "100%"
        scaleInput.value = parseFloat(localStorage.getItem("bc-scale")) * 100
        scaleInput.addEventListener("change", function () {
            localStorage.setItem("bc-scale", parseFloat(this.value) / 100)
            _amOT.RedrawViz()
        })

        fullscreenBtn.innerHTML = "Fullscreen"
        fullscreenBtn.addEventListener("click", function () {
            _amOT.ToggleFullscreen()
        })
        fullscreenBtn.classList.add("md-btn")
        fullscreenBtn.classList.add("md-btn-primary")
        fullscreenBtn.classList.add("md-btn-block")
        fullscreenBtn.style.margin = "12px 0px 0px 0px"

        closeVizBtn.innerHTML = "Close Visualizer"
        closeVizBtn.addEventListener("click", function () {
            btwin.remove()
            _amOT.VizToggle()
        })
        closeVizBtn.classList.add("md-btn")
        closeVizBtn.classList.add("md-btn-primary")
        closeVizBtn.classList.add("md-btn-block")

        closeVizBtn.style.margin = "12px 0px 0px 0px"

        // Presets
        preLabel.innerHTML = "Preset: <br>"
        preLabel.appendChild(preSelect)
        Object.keys(_amOT.viz.presets).forEach(function (b, a) {
            let opt = document.createElement("option")
            opt.innerHTML = b
            opt.value = b
            preSelect.appendChild(opt)
        });

        preLabel.style.width = "100%"
        preSelect.size = 20
        preSelect.style.fontFamily = "inherit"
        preSelect.style.outline = "none!important"
        preSelect.style.fontSize = "18px"
        preSelect.style.width = "100%"
        preSelect.style.height = "200px";
        preSelect.value = localStorage.getItem("bc-selected")
        preSelect.addEventListener("change", function () {
            _amOT.viz.visualizer.loadPreset(_amOT.viz.presets[this.value])
            //_amOT.viz.presetName = this.value
            localStorage.setItem("bc-selected", this.value)
        })

        // Favorites
        favLabel.innerHTML = "Favorites: <br>"
        favLabel.appendChild(favSelect)
        function drawFavorites() {
            favSelect.innerHTML = ""
            favorites.forEach(function (b, a) {
                let opt = document.createElement("option")
                opt.innerHTML = b
                opt.value = b
                favSelect.appendChild(opt)
            });
        }
        drawFavorites()

        favLabel.style.width = "100%"
        favSelect.size = 20
        favSelect.style.fontFamily = "inherit"
        favSelect.style.outline = "none!important"
        favSelect.style.fontSize = "18px"
        favSelect.style.width = "100%"
        favSelect.style.height = "200px";
        favSelect.value = localStorage.getItem("bc-selected")
        favSelect.addEventListener("change", function () {
            _amOT.viz.visualizer.loadPreset(_amOT.viz.presets[this.value])
            //_amOT.viz.presetName = this.value
            localStorage.setItem("bc-selected", this.value)
        })

        addFavoriteBtn.classList.add("md-btn")
        addFavoriteBtn.classList.add("md-btn-small")
        addFavoriteBtn.style.width = "100%"
        addFavoriteBtn.innerText = "Add Favorite"
        addFavoriteBtn.addEventListener("click", ()=>{
            favorites.push(localStorage.getItem("bc-selected"))
            drawFavorites()
            CiderCache.putCache("viz-favorites", favorites)
        })

        removeFavoriteBtn.classList.add("md-btn")
        removeFavoriteBtn.classList.add("md-btn-small")
        removeFavoriteBtn.style.width = "100%"
        removeFavoriteBtn.innerText = "Remove Favorite"
        removeFavoriteBtn.addEventListener("click", ()=>{
            favorites.splice(favorites.indexOf(favSelect.value), 1)
            drawFavorites()
            CiderCache.putCache("viz-favorites", favorites)
        })

        let grid = {
            row: document.createElement("div"),
            col1: document.createElement("div"),
            col2: document.createElement("div"),
        }
        grid.row.classList.add("row")
        grid.col1.classList.add("col-md-6")
        grid.col2.classList.add("col-md-6")

        grid.row.appendChild(grid.col1)
        grid.row.appendChild(grid.col2)
        grid.col1.appendChild(preLabel)
        grid.col1.appendChild(addFavoriteBtn)
        grid.col2.appendChild(favLabel)
        grid.col2.appendChild(removeFavoriteBtn)

        content.appendChild(grid.row)
        content.appendChild(scaleLabel)
        content.appendChild(document.createElement("br"))
        content.appendChild(fullscreenBtn)
        content.appendChild(closeVizBtn)
        var btwin = _amOT.popup_generic({
            title: "Butterchurn Visualizer",
            content: content,
            transparentBg: true,
            backdropStyle: {
                justifyContent: "left"
            },
            windowStyle: {
                "margin-left": "16px"
            }
        })
    },
    RedrawViz: function () {
        _amOT.viz.canvas.width = window.innerWidth * parseFloat(localStorage.getItem("bc-scale"))
        _amOT.viz.canvas.height = window.innerHeight * parseFloat(localStorage.getItem("bc-scale"))
        _amOT.viz.visualizer.setRendererSize(window.innerWidth * parseFloat(localStorage.getItem("bc-scale")), window.innerHeight * parseFloat(localStorage.getItem("bc-scale")))
    },
    SetAppChromeVisibility(visible) {
        document.querySelectorAll(".app-chrome").forEach(function (b, a) {
            if (!visible) {
                _amOT.viz.chromeVisible = false
                b.style.zIndex = ""
                b.style.backdropFilter = ""
            } else {
                _amOT.viz.chromeVisible = true
                b.style.zIndex = "9999"
                b.style.backdropFilter = "blur(16px)"
            }
        })
    },
    ToggleAppChromeVisibility() {
        if (_amOT.viz.chromeVisible) {
            _amOT.SetAppChromeVisibility(false)
        }
        else {
            _amOT.SetAppChromeVisibility(true)
        }
    },
    StartViz: function () {
        if (!localStorage.getItem("bc-notice")) {
            let about = document.createElement("p")
            about.innerHTML = `<b>Single click</b> - Show controls<br><b>Double click / Right click</b> - Show settings`
            _amOT.popup_generic({
                title: "Butterchurn Visualizer",
                content: about,
                closefn: function () {
                    localStorage.setItem("bc-notice", "1")
                }
            })
        }

        if (!localStorage.getItem("bc-scale")) {
            localStorage.setItem("bc-scale", "1.0")
        }

        const appNavigation = document.querySelector(".app-navigation")
        appNavigation.style.marginTop = "var(--chromeHeight1)"
        const chromeBottom = document.querySelector(".app-chrome.chrome-bottom")
        chromeBottom.style.position = "fixed"
        chromeBottom.style.bottom = "0px"
        chromeBottom.style.left = "0px"

        _amOT.viz.scale = parseFloat(localStorage.getItem("bc-scale"))
        _amOT.viz.running = true
        _amOT.viz.canvas.style.display = ""
        document.querySelector("#app-main").setAttribute("vis-style", 1)
        if (!_amOT.viz.ready) {
            window.onresize = function (event) {
                _amOT.RedrawViz()
            };
            if (!localStorage.getItem("bc-selected")) {
                localStorage.setItem("bc-selected", 'Flexi, martin + geiss - dedicated to the sherwin maxawow')
            }
            _amOT.viz.canvas.style.width = "100%"
            _amOT.viz.canvas.style.height = "100%"
            _amOT.viz.canvas.style.position = "fixed"
            _amOT.viz.canvas.style.zIndex = "9998"
            _amOT.viz.canvas.style.bottom = "0px"
            _amOT.viz.canvas.style.left = "0px"
            _amOT.viz.canvas.style.transition = "bottom 0.5s ease 0s, left 0.5s ease 0s"
            _amOT.viz.chromeVisible = false
            _amOT.viz.canvas.addEventListener("click", function () {
                _amOT.ToggleAppChromeVisibility()
            })
            _amOT.viz.canvas.addEventListener("dblclick", function () {
                _amOT.VizConfig()
            })
            _amOT.viz.canvas.addEventListener("contextmenu", function (e) {
                e.preventDefault()
                _amOT.VizConfig()
            })
            // _amOT.viz.presets = butterchurnPresets.getPresets();
            _amOT.viz.presets = Object.assign({},
                importedPresets.getPresets());
            _amOT.viz.preset = _amOT.viz.presets[localStorage.getItem("bc-selected")];
            document.body.appendChild(_amOT.viz.canvas)
            _amOT.viz.visualizer = butterchurn.default.createVisualizer(AMEx.context, _amOT.viz.canvas, {
                width: 800,
                height: 600,
                mesh_width: 64,
                mesh_height: 48,
                pixelRatio: window.devicePixelRatio || 1,
                textureRatio: 1,
                fps: 2
            });

            _amOT.viz.visualizer.loadExtraImages(butterchurnExtraImages.default.getImages());
            _amOT.viz.visualizer.connectAudio(AMEx.result.source);
            _amOT.viz.visualizer.loadPreset(_amOT.viz.presets[localStorage.getItem("bc-selected")], 0.0);

        }

        function startRenderer() {
            if (_amOT.viz.running) {
                requestAnimationFrame(() => startRenderer());
                _amOT.viz.visualizer.render();
            }
        }
        startRenderer()
        _amOT.RedrawViz()
        if (!_amOT.viz.ready) {
            _amOT.viz.ready = true
        }
    },
    fInit: false,
    eqReady: false,
    amplifyMedia: function (mediaElem, multiplier) {
        // needed for EQ and viz
        var context = new(window.AudioContext || window.webkitAudioContext),
            result = {
                context: CiderAudio.context,
                source: CiderAudio.source,
                gain: CiderAudio.audioNodes.gainNode,
                media: mediaElem
            };
        AMEx.context = CiderAudio.context
        AMEx.result = result
        return result
    },
    popup_generic: function ({
        title = "",
        content = document.createElement("div"),
        closefn = function () {},
        transparentBg = false,
        windowStyle = {},
        backdropStyle = {}
    }) {
        let backdrop = document.createElement("div")
        backdrop.style.width = "100%"
        backdrop.style.height = "100%"
        backdrop.style.position = "fixed"
        backdrop.style.top = 0
        backdrop.style.left = 0
        if (!transparentBg) {
            backdrop.style.background = "rgba(0,0,0,0.5)"
        } else {
            backdrop.style.background = "rgba(0,0,0,0.0)"
        }
        backdrop.style.zIndex = 10000
        backdrop.style.display = "flex"
        backdrop.style.alignItems = "center"
        backdrop.style.justifyContent = "center"
        let win = document.createElement("div")
        win.style.width = "500px"
        win.style.background = "var(--bs-gray-dark)"
        win.style.color = "var(--textColor)"
        win.style.zIndex = 10000
        win.style.padding = "16px"
        win.style.borderRadius = "10px"
        Object.assign(backdrop.style, backdropStyle)
        Object.assign(win.style, windowStyle)
        let closeBtn = document.createElement("button")
        closeBtn.classList.add("md-btn")
        closeBtn.classList.add("md-btn-primary")
        closeBtn.classList.add("md-btn-block")
        closeBtn.style.margin = "12px 0px 0px 0px"
        closeBtn.innerHTML = "Close"
        closeBtn.addEventListener("click", function () {
            backdrop.remove()
            closefn()
        })
        let titleText = document.createElement("div")
        titleText.innerHTML = (title)
        titleText.style.fontWeight = "bold"


        win.appendChild(titleText)
        win.appendChild(content)
        win.appendChild(closeBtn)

        backdrop.appendChild(win)
        document.body.appendChild(backdrop)
        return backdrop
    }
}

MusicKit.getInstance().addEventListener(MusicKit.Events.mediaElementCreated, ()=>{
    CiderFrontAPI.StyleSheets.Add("./plugins/cider-butterchurn/visstyle.less")
    _amOT.Start()
})

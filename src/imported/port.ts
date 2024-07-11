// Excuse the ugliness. This plugin is ported from AME AND Cider 1 and needs some cleanup.
// @ts-nocheck

import { useCiderAudio } from "../api/CiderAudio";
import { customElementName } from "../utils";
import { importedPresets } from "./full-presets";
// import "./plugin-visualizer-butterchurn";
import butterchurn from "butterchurn";
import "./plugin-visualizer-butterchurnExtraImages";
import { createModal } from "../api/Modal";

var AMEx = {
  context: new AudioContext(),
  result: {},
};
const CiderAudio = useCiderAudio();
// Viz & EQ
export const _amOT = {
  animationFrame: null,
  viz: {
    /**
     * @type {*}
     */
    visualizer: null,
    preset: {},
    presetName: "",
    presets: {},
    renderSize: [1600, 1200],
    running: false,
    ready: false,
    chromeVisible: false,
    scale: 1.0,
    canvas: document.createElement("canvas"),
    lyrics: document.createElement("div"),
  },
  Start() {
    // const menuEntry = new CiderFrontAPI.Objects.MenuEntry()
    // menuEntry.name = "Toggle Visualizer"
    // menuEntry.onClick = ()=>{
    //     _amOT.VizToggle()
    // }
    // CiderFrontAPI.AddMenuEntry(menuEntry)
  },
  VizToggle: function () {
    if (CiderAudio.context) {
      _amOT.amplifyMedia();
      if (_amOT.viz.running) {
        _amOT.StopViz();
      } else {
        _amOT.StartViz();
      }
    } else {
      alert("Audio Context not ready yet");
    }
  },
  StopViz: function () {
    // const appNavigation = document.querySelector(".app-navigation")
    // const chromeBottom = document.querySelector(".app-chrome.chrome-bottom")
    // if(chromeBottom) {
    // 	chromeBottom.style.position = ""
    // 	chromeBottom.style.bottom = ""
    // 	chromeBottom.style.left = ""
    // }
    // appNavigation.style.marginTop = ""
    _amOT.viz.canvas.style.display = "none";
    _amOT.viz.running = false;
    // document.querySelector("#app-main").removeAttribute("vis-style")
  },
  ToggleFullscreen: function () {
    var element = document.body;
    var requestMethod =
      element.requestFullScreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullScreen;

    if (requestMethod) {
      // Native full screen.
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
      // Older IE.
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  },
  VizConfig: function() {
    const {closeDialog, openDialog, dialogElement} = createModal({
      escClose: true,
    })
    // @ts-ignore
    const content = document.createElement(customElementName('viz-settings'));
    content._props.closeFn = closeDialog;
    dialogElement.appendChild(content);
    openDialog();
  },
  RedrawViz: function () {
    _amOT.viz.canvas.width =
      window.innerWidth * parseFloat(localStorage.getItem("bc-scale"));
    _amOT.viz.canvas.height =
      window.innerHeight * parseFloat(localStorage.getItem("bc-scale"));
    _amOT.viz.visualizer.setRendererSize(
      window.innerWidth * parseFloat(localStorage.getItem("bc-scale")),
      window.innerHeight * parseFloat(localStorage.getItem("bc-scale"))
    );
  },
  SetAppChromeVisibility(visible) {
    document.querySelectorAll(".app-chrome").forEach(function (b, a) {
      if (!visible) {
        _amOT.viz.chromeVisible = false;
        b.style.zIndex = "";
        b.style.backdropFilter = "";
      } else {
        _amOT.viz.chromeVisible = true;
        b.style.zIndex = "9999";
        b.style.backdropFilter = "blur(16px)";
      }
    });
  },
  ToggleAppChromeVisibility() {
    if (_amOT.viz.chromeVisible) {
      _amOT.SetAppChromeVisibility(false);
    } else {
      _amOT.SetAppChromeVisibility(true);
    }
  },
  StartViz: function () {
    if (CiderAudio.context) {
      _amOT.amplifyMedia();
    } else {
      alert("Audio Context not ready yet");
      return;
    }

    if (!localStorage.getItem("bc-notice")) {
      let about = document.createElement("p");
      about.innerHTML = `<b>Single click</b> - Show controls<br><b>Double click / Right click</b> - Show settings`;
      _amOT.popup_generic({
        title: "Butterchurn Visualizer",
        content: about,
        closefn: function () {
          localStorage.setItem("bc-notice", "1");
        },
      });
    }

    if (!localStorage.getItem("bc-scale")) {
      localStorage.setItem("bc-scale", "1.0");
    }

    _amOT.viz.scale = parseFloat(localStorage.getItem("bc-scale"));
    _amOT.viz.running = true;
    _amOT.viz.canvas.style.display = "";
    if (document.querySelector(".player-modal")) {
      _amOT.viz.canvas.style.zIndex = "-1";
    } else {
      _amOT.viz.canvas.style.zIndex = "9998";
    }
    if (!_amOT.viz.ready) {
      window.onresize = function (event) {
        _amOT.RedrawViz();
      };
      if (!localStorage.getItem("bc-selected")) {
        localStorage.setItem(
          "bc-selected",
          "Flexi, martin + geiss - dedicated to the sherwin maxawow"
        );
      }
      _amOT.viz.canvas.style.width = "100%";
      _amOT.viz.canvas.style.height = "100%";
      _amOT.viz.canvas.style.position = "fixed";
      if (document.querySelector(".player-modal")) {
        _amOT.viz.canvas.style.zIndex = "-1";
      } else {
        _amOT.viz.canvas.style.zIndex = "9998";
      }
      _amOT.viz.canvas.style.bottom = "0px";
      _amOT.viz.canvas.style.left = "0px";
      _amOT.viz.canvas.style.transition =
        "bottom 0.5s ease 0s, left 0.5s ease 0s";
      _amOT.viz.chromeVisible = false;
      _amOT.viz.canvas.addEventListener("click", function () {
        // _amOT.ToggleAppChromeVisibility()
      });
      _amOT.viz.canvas.addEventListener("dblclick", function () {
        _amOT.VizConfig();
      });
      _amOT.viz.canvas.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        _amOT.VizConfig();
      });
      // _amOT.viz.presets = butterchurnPresets.getPresets();
      _amOT.viz.presets = Object.assign({}, importedPresets.getPresets());
      _amOT.viz.preset = _amOT.viz.presets[localStorage.getItem("bc-selected")];
      document.body.appendChild(_amOT.viz.canvas);
      _amOT.viz.visualizer = butterchurn.createVisualizer(
        AMEx.context,
        _amOT.viz.canvas,
        {
          width: 800,
          height: 600,
          mesh_width: 64,
          mesh_height: 48,
          pixelRatio: window.devicePixelRatio || 1,
          textureRatio: 1,
          fps: 2,
        }
      );

      _amOT.viz.visualizer.loadExtraImages(
        butterchurnExtraImages.default.getImages()
      );
      _amOT.viz.visualizer.connectAudio(AMEx.result.source);
      try {
        _amOT.viz.visualizer.loadPreset(
          _amOT.viz.presets[localStorage.getItem("bc-selected") || "Flexi, martin + geiss - dedicated to the sherwin maxawow"],
          0.0
        );
      }catch(e) {
        console.error(e);
      }
    }

    function startRenderer() {
      if (_amOT.viz.running) {
        _amOT.animationFrame = requestAnimationFrame(() => startRenderer());
        _amOT.viz.visualizer.render();
      }
    }
    startRenderer();
    _amOT.RedrawViz();
    if (!_amOT.viz.ready) {
      _amOT.viz.ready = true;
    }
  },
  stopRenderer() {
    cancelAnimationFrame(_amOT.animationFrame);
  },
  fInit: false,
  eqReady: false,
  amplifyMedia: function (mediaElem, multiplier) {
    // needed for EQ and viz
    var context = new (window.AudioContext || window.webkitAudioContext)(),
      result = {
        context: CiderAudio.context,
        source: CiderAudio.source,
        gain: CiderAudio.audioNodes.gainNode,
        media: mediaElem,
      };
    AMEx.context = CiderAudio.context;
    AMEx.result = result;
    return result;
  },
  popup_generic: function ({
    title = "",
    content = document.createElement("div"),
    closefn = function () {},
    transparentBg = false,
    windowStyle = {},
    backdropStyle = {},
  }) {
    let backdrop = document.createElement("div");
    backdrop.style.width = "100%";
    backdrop.style.height = "100%";
    backdrop.style.position = "fixed";
    backdrop.style.top = 0;
    backdrop.style.left = 0;
    if (!transparentBg) {
      backdrop.style.background = "rgba(0,0,0,0.5)";
    } else {
      backdrop.style.background = "rgba(0,0,0,0.0)";
    }
    backdrop.style.zIndex = 10000;
    backdrop.style.display = "flex";
    backdrop.style.alignItems = "center";
    backdrop.style.justifyContent = "center";
    let win = document.createElement("div");
    win.classList.add("plugin-base");
    win.classList.add("viz-panel");
    win.style.width = "500px";
    win.style.background = "var(--textOpposite)";
    win.style.color = "var(--textDefault)";
    win.style.zIndex = 10000;
    win.style.padding = "16px";
    win.style.borderRadius = "10px";
    Object.assign(backdrop.style, backdropStyle);
    Object.assign(win.style, windowStyle);
    let closeBtn = document.createElement("button");
    closeBtn.classList.add("md-btn");
    closeBtn.classList.add("md-btn-primary");
    closeBtn.classList.add("md-btn-block");
    closeBtn.style.margin = "12px 0px 0px 0px";
    closeBtn.innerHTML = "Close";
    closeBtn.addEventListener("click", function () {
      backdrop.remove();
      closefn();
    });
    let titleText = document.createElement("div");
    titleText.innerHTML = title;
    titleText.classList.add("apple-heading");

    win.appendChild(titleText);
    win.appendChild(content);
    win.appendChild(closeBtn);

    backdrop.appendChild(win);
    document.body.appendChild(backdrop);
    return backdrop;
  },
};

window._amOT = _amOT;
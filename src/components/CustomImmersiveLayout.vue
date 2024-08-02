<script setup lang="ts">
import CComponent from "../api/CComponent.vue";
import { useCiderAudio } from "../api/CiderAudio.ts";
import { _amOT } from "../imported/port";
import { useIdle } from "@vueuse/core";

const { idle } = useIdle(1000);
const controlsOpened = computed(() => {
  return !idle.value;
});

watch(controlsOpened, (newVal) => {
  if (newVal) {
    showTabs();
  } else {
    hideTabs();
  }
});

const showRightSide = ref(true);

const audio = useCiderAudio();
const unsubscribe: any = audio.subscribe(
  "ready",
  () => {
    if (!_amOT.viz.running) {
      _amOT.StartViz();
    }
  },
  {
    once: true,
  }
);

function hideTabs() {
  document.querySelector(".immersive-tabs")?.classList.add("hidden");
}

function showTabs() {
  document.querySelector(".immersive-tabs")?.classList.remove("hidden");
}

onMounted(() => {
  document.querySelector(".player-modal")?.classList.add("force-transparent");
  document.querySelector(".blurmap")?.classList.add("hidden");
});

onUnmounted(() => {
  unsubscribe();
  if (_amOT.viz.running) {
    _amOT.StopViz();
  }
  document
    .querySelector(".player-modal")
    ?.classList.remove("force-transparent");
  document.querySelector(".blurmap")?.classList.remove("hidden");
});
</script>

<template>
  <div class="my-layout plugin-base">
    <div
      class="main-content"
      :class="{
        'hide-right-side': !showRightSide,
      }"
    >
      <div class="left-side"></div>
      <div class="right-side">
        <CComponent name="ImmersiveDrawerContent"></CComponent>
      </div>
    </div>
    <div
      class="player-container"
      :class="{
        'is-idle': idle,
      }"
    >
      <div class="artwork" @click="showRightSide = !showRightSide">
        <CComponent name="ImmersiveArtwork"></CComponent>
      </div>
      <div class="metadata-display">
        <CComponent name="AMPMetadataMojave"></CComponent>
      </div>
      <div class="controls">
        <CComponent
          name="MojavePlayer"
          :component-props="{
            noArtwork: true,
          }"
        ></CComponent>
      </div>
      <button class="config-button" @click="_amOT.VizConfig">
        <CComponent
          name="NIcon"
          :component-props="{
            name: 'settings',
          }"
        ></CComponent>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.config-button {
  height: 100%;
  display: grid;
  place-items: center;
  width: 90px;
  background: transparent;
  border: 0;
  transition: opacity 0.3s var(--ease_appleSpring);
  margin-right: 1em;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background: rgba(255, 255, 255, 0.2);
  }

  > * {
    zoom: 2;
  }
}

.player-container {
  display: grid;
  width: 100%;
  grid-template-columns: auto 0px 1fr auto;
  align-items: center;
  padding-left: 1em;
  padding-bottom: 1em;
  padding-top: 1em;
  max-width: 1920px;
  margin: 0 auto;
  transition: grid-template-columns 0.5s linear;
  .metadata-display {
    padding-left: 0em;
    zoom: 1.25;
    opacity: 0;
    transition: opacity 0.5s var(--ease_appleSpring),
      padding-left 0.5s var(--ease_appleSpring);
  }
  &.is-idle {
    grid-template-columns: auto 30px 1fr auto;

    .metadata-display {
      padding-left: 1em;
      opacity: 1;
    }

    .controls {
      opacity: 0;
    }

    .config-button {
      opacity: 0;
    }
  }
}

.my-layout {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
}
.main-content {
  display: grid;
  grid-template-columns: 0fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-template-areas: "left-side right-side";
  height: 100%;
  width: 100%;
  max-width: 1920px;
  overflow: hidden;
  transition: grid-template-columns 0.5s var(--ease_appleSpring),
    grid-template-rows 0.5s var(--ease_appleSpring);
  justify-self: center;

  &.hide-right-side {
    grid-template-columns: 1fr 0fr;
    grid-template-rows: 1fr;

    grid-template-areas: "left-side";

    .right-side {
      opacity: 0;
      transform: scale(0.9);
      padding: 0;
    }
  }
}

.controls {
  zoom: 1.1;
  transition: opacity 0.3s var(--ease_appleSpring),
    transform 0.3s var(--ease_appleSpring);
}

.artwork {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s var(--ease_appleSpring);

  &:active {
    transform: scale(0.95);
    transition: transform 0.1s var(--ease_appleSpring);
  }
}

.left-side {
  display: grid;
  grid-template-rows: 1fr;
  width: 100%;
  overflow: hidden;
  align-items: center;
  justify-items: center;
  container-type: inline-size;
  container-name: left-side;
}

.right-side {
  display: grid;
  width: 100%;
  overflow: hidden;
  padding: 6em;
  transition: opacity 0.3s var(--ease_appleSpring),
    transform 0.3s var(--ease_appleSpring), padding 0.3s var(--ease_appleSpring);
}

:deep(.lyricView) {
  left: 0;
  width: 100%;
  position: relative;
}

:deep(.lcdplayer-top) {
  height: 45px;
}

:deep(.lyric-view) {
  filter: drop-shadow(0 5px 5px black);

  padding-top: 36cqh;
  mask-image: linear-gradient(
    0deg,
    transparent 0%,
    black 20%,
    black 90%,
    transparent 100%
  );

  .lyric-char {
    --defaultColor: rgb(200 200 200 / 80%);
  }

  .lyric-line {
    --fontSize: clamp(10px, 4vw, var(--lyricsMaxSize));
    --fontSizeBG: clamp(6px, 2.5vw, var(--lyricsMaxSize));
    padding: 12px;
    border-radius: 12px;
    filter: unset;
    text-align: center;
    transform-origin: center;

    &.finished {
      transition: opacity 0.5s var(--appleEase), filter 0.5s var(--appleEase),
        transform 0.5s var(--appleEase), grid-template-rows 0.35s ease-in-out;
      --lineBlurAmount: 10px;
      opacity: var(--finishedOpacity);
    }

    @media (max-width: 1200px) {
      --fontSize: 30px;
      --fontSizeBG: 18.5px;
    }

    @media (max-width: 960px) {
      --fontSize: 20px;
      --fontSizeBG: 10px;
    }

    @media (max-width: 300px) {
      --fontSize: 15px;
      --fontSizeBG: 5px;
    }
  }

  .lyrics-lower-placeholder {
    height: 45cqh;
  }
}
</style>

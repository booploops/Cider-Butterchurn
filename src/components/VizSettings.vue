<script setup lang="ts">
import { _amOT } from "../imported/port";
import { useLocalStorage } from "@vueuse/core";

const selected = useLocalStorage<string>(
  "bc-selected",
  "Flexi, martin + geiss - dedicated to the sherwin maxawow"
);
const presets = computed(() => {
  console.log(_amOT.viz.presets);
  return _amOT.viz.presets;
});

const renderScale = useLocalStorage<number>("bc-scale", 1);
const favorites = useLocalStorage<string[]>("viz-favorites", []);
const showRemove = computed(() => favorites.value.includes(selected.value));

watch(selected, (newVal) => {
  // @ts-ignore
  _amOT.viz.visualizer.loadPreset(_amOT.viz.presets[newVal]);
});

watch(renderScale, () => {
  _amOT.RedrawViz();
});

function fullscreen() {
  document.documentElement.requestFullscreen();
}

function addToFavorites() {
  if (!favorites.value.includes(selected.value)) {
    favorites.value.push(selected.value);
  }
}

function removeFromFavorites() {
  const index = favorites.value.indexOf(selected.value);
  if (index > -1) {
    favorites.value.splice(index, 1);
  }
}
</script>

<template>
  <div class="plugin-base q-mt-sm">
    <div class="row flex-gap-2">
      <div class="col">
        <div class="shelf-title">Available</div>
        <select v-model="selected" class="options-list" size="3">
          <option v-for="(_, index) in presets" :key="index">
            {{ index }}
          </option>
        </select>
        <button class="full-width q-my-sm" @click="addToFavorites">
          ⭐ Add To Favorites
        </button>
      </div>
      <div class="col">
        <div class="shelf-title">Favorites</div>
        <select v-model="selected" class="options-list" size="3">
          <option v-for="(fav, index) in favorites" :key="index">
            {{ fav }}
          </option>
        </select>
        <button
          @click="removeFromFavorites"
          v-if="showRemove"
          class="full-width q-my-sm"
        >
          ❌ Remove From Favorites
        </button>
      </div>
    </div>

    <div>
      <div class="shelf-title">Render Scale</div>
      <input
        type="number"
        class="full-width"
        min="0.1"
        max="2"
        step="0.1"
        v-model="renderScale"
      />
    </div>

    <div class="row flex-gap-2 q-mt-sm">
      <button class="full-width c-btn" @click="fullscreen">Fullscreen</button>
      <button class="full-width c-btn" @click="_amOT.VizConfig">
        Close Visualizer
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.options-list {
  min-width: 0;
  width: 100%;
  height: 300px;
  display: inline-flex;
  overflow: hidden;
  overflow-y: scroll;
  font-size: inherit;
  option {
    padding: 3px;
    font-size: inherit;
  }
}
</style>

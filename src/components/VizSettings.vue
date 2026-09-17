<script setup lang="ts">
import { _amOT } from "../imported/port";
import { useLocalStorage } from "@vueuse/core";

defineProps<{
    closeFn: () => void;
}>();

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

// Shuffle mode: cycle through favorites instead of staying on one preset.
const shuffle = useLocalStorage<boolean>("bc-shuffle", false);
const shuffleInterval = useLocalStorage<number>("bc-shuffle-interval", 30);
// Normalise a stored value that is out of range so the field shows what the timer really uses.
{
  const clamped = _amOT.ClampShuffleSeconds(shuffleInterval.value);
  if (clamped !== shuffleInterval.value) shuffleInterval.value = clamped;
}

// What the renderer is actually showing. Empty until a preset has loaded successfully.
const nowPlaying = ref<string>(_amOT.viz.presetName || "");
const nowPlayingLabel = computed(() => nowPlaying.value || "(none loaded)");

// In shuffle mode the favorite buttons act on the preset on screen, not the stored single pick.
const favTarget = computed(() =>
  shuffle.value && nowPlaying.value ? nowPlaying.value : selected.value
);
const showRemove = computed(() => favorites.value.includes(favTarget.value));

// Same predicate the core's ShuffleNext uses: valid favorites other than the one on screen.
const shufflePool = computed(() =>
  [...new Set(favorites.value)].filter(
    (f) => _amOT.IsKnownPreset(f) && f !== nowPlaying.value
  )
);
const canShuffle = computed(() => shufflePool.value.length > 0);

function onPresetChanged(e: Event) {
  const name = (e as CustomEvent<unknown>).detail;
  if (typeof name === "string") nowPlaying.value = name;
}
onMounted(() => window.addEventListener("bc-preset-changed", onPresetChanged));
onUnmounted(() => window.removeEventListener("bc-preset-changed", onPresetChanged));

const searchAll = ref("");
const searchFav = ref("");

const presetsFiltered = computed(() => {
    if (searchAll.value.length !== 0) {
        return Object.keys(presets.value).filter((key) =>
            key.toLowerCase().includes(searchAll.value.toLowerCase())
        );
    }
    return Object.keys(presets.value);
})

const favoritesFiltered = computed(() => {
    if (searchFav.value.length !== 0) {
        return favorites.value.filter((fav) =>
            fav.toLowerCase().includes(searchFav.value.toLowerCase())
        );
    }
    return favorites.value;
})

watch(selected, (newVal) => {
  _amOT.LoadPresetByName(newVal);
});

watch(shuffle, (enabled) => {
  if (enabled) {
    _amOT.ShuffleNext();
  } else {
    // Return to the user's single pick when leaving shuffle mode.
    _amOT.LoadPresetByName(selected.value);
  }
  _amOT.UpdateShuffle();
});

// Applied on change (not per keystroke) so the countdown isn't reset while typing.
function commitInterval() {
  const clamped = _amOT.ClampShuffleSeconds(shuffleInterval.value);
  if (clamped !== shuffleInterval.value) shuffleInterval.value = clamped;
  _amOT.UpdateShuffle();
}

watch(renderScale, () => {
  _amOT.RedrawViz();
});

function addToFavorites() {
  if (!favorites.value.includes(favTarget.value)) {
    favorites.value.push(favTarget.value);
  }
}

function removeFromFavorites() {
  const index = favorites.value.indexOf(favTarget.value);
  if (index > -1) {
    favorites.value.splice(index, 1);
  }
}
</script>

<template>
  <div class="plugin-base q-mt-sm viz-settings">

    <div class="row flex-gap-2">
      <div class="col">
        <div class="shelf-title">Available</div>
        <input type="text" v-model="searchAll" class="full-width" placeholder="Search all..." />
        <select v-model="selected" class="options-list" size="3">
          <option v-for="(name) in presetsFiltered" :key="name">
            {{ name }}
          </option>
        </select>
        <button class="full-width q-my-sm" @click="addToFavorites">
          ⭐ Add To Favorites
        </button>
      </div>
      <div class="col">
        <div class="shelf-title">Favorites</div>
        <input type="text" v-model="searchFav" class="full-width" placeholder="Search favorites..." />
        <select v-model="selected" class="options-list" size="3">
          <option v-for="(fav, index) in favoritesFiltered" :key="index">
            {{ fav }}
          </option>
        </select>
        <button
          @click="removeFromFavorites"
          v-if="showRemove"
          class="full-width q-my-sm"
        >
          ❌ Remove From Favorites<template v-if="shuffle"> ({{ favTarget }})</template>
        </button>
      </div>
    </div>

    <div class="shuffle-box">
      <div class="shelf-title">Preset Mode</div>
      <div class="row flex-gap-2 mode-row">
        <label class="mode-option">
          <input type="radio" :value="false" v-model="shuffle" />
          Stay on selected preset
        </label>
        <label class="mode-option">
          <input type="radio" :value="true" v-model="shuffle" />
          Shuffle favorites
        </label>
      </div>
      <div v-if="shuffle" class="row flex-gap-2 q-mt-sm shuffle-controls">
        <label class="col">
          Change every (seconds)
          <input
            type="number"
            class="full-width"
            :min="_amOT.SHUFFLE_MIN_SECONDS"
            :max="_amOT.SHUFFLE_MAX_SECONDS"
            step="5"
            v-model.number="shuffleInterval"
            @change="commitInterval"
          />
        </label>
        <button class="col c-btn" @click="_amOT.ShuffleNext()" :disabled="!canShuffle">
          ⏭ Next Favorite
        </button>
      </div>
      <div v-if="shuffle && !canShuffle" class="hint">
        No other favorite to shuffle to. Add at least one more favorite.
      </div>
      <div class="hint">Now showing: <b>{{ nowPlayingLabel }}</b></div>
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
      <button class="full-width c-btn" @click="_amOT.VizToggle();closeFn()">
        Close Visualizer
      </button>
      <button class="full-width c-btn" @click="closeFn">
        Done
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.viz-settings {
    max-width: 500px;
}

.shuffle-box {
  margin-top: 8px;
}

.mode-row {
  flex-wrap: wrap;
}

.mode-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.shuffle-controls {
  align-items: flex-end;
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}

.hint {
  opacity: 0.8;
  font-size: 0.9em;
  margin-top: 6px;
}

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

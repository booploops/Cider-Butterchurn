<script lang="ts" setup>
import type { ComponentNames } from "./ComponentNames.ts";
const ElRef = ref<HTMLElement>();
let cc: any;

const props = defineProps<{
  name: ComponentNames;
  componentProps?: Record<string, any>;
}>();

function create() {
  if (ElRef.value) {
    // @ts-ignore
    cc = __PLUGINSYS__.App.RenderComponent({
      component: props.name,
      element: ElRef.value,
      props: props.componentProps,
    });
  }
}

onUnmounted(() => {
  if (cc.unmount) {
    cc.unmount();
  }
});
onMounted(create);

watch(props, create);
</script>

<template>
  <div ref="ElRef" class="__CComponent__"></div>
</template>

<style scoped>
.__CComponent__ {
  display: contents;
}
</style>

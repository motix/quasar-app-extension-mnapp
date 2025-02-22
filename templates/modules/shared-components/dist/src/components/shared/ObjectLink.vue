<script setup lang="ts">
import { ref } from 'vue';

import { copyToClipboard } from 'quasar';

// Props

const props = withDefaults(
  defineProps<{
    label: string;
    // eslint-disable-next-line vue/require-default-prop
    icon?: string | undefined;
    wrapLabel?: boolean | undefined;
    maxWidth?: string | undefined;
  }>(),
  {
    wrapLabel: false,
    maxWidth: '100%',
  },
);

// Data

const hover = ref(false);
const labelCopied = ref(false);

// Methods

async function copyLabel() {
  await copyToClipboard(props.label);
  labelCopied.value = true;
}
</script>

<template>
  <q-btn
    class="q-pa-none"
    flat
    no-caps
    style="min-height: 0"
    :style="{ 'max-width': maxWidth }"
    @mouseleave="labelCopied = hover = false"
    @mouseover="
      (function () {
        hover = true;
        labelCopied = false;
      })()
    "
  >
    <!-- Setting max-width to support ellipsis -->
    <div class="row no-wrap" style="max-width: 100%">
      <div :class="{ 'text-left': !!icon || $slots.icon, ellipsis: !wrapLabel }">
        <slot name="icon">
          <q-icon v-if="icon" class="q-mr-sm" :name="icon" size="1.2em" />
        </slot>

        <span>
          {{ label }}
        </span>
      </div>

      <div style="width: 0">
        <fade-transition>
          <div
            v-if="hover && !labelCopied"
            class="q-px-xs"
            style="margin-right: -1.2em; margin-top: -0.5em"
            @click.stop.prevent="copyLabel"
          >
            <q-icon name="fal fa-copy" size="1.2em" />
          </div>
        </fade-transition>
      </div>
    </div>
  </q-btn>
</template>

<style lang="scss" scoped>
.q-btn {
  line-height: $body-line-height;
}
</style>

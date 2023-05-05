<script setup lang="ts">
import { requiredConfigEntries } from 'composables/useConfig';
// Props

type Props = {
  fixedPadding?: number;
  topFloatPadding?: number;
  bottomFloatPadding?: number;
};
const props = defineProps<Props>();

// Data

const topFloatPadding =
  props.topFloatPadding === undefined
    ? requiredConfigEntries('topFloatPadding').topFloatPadding
    : props.topFloatPadding;
const bottomFloatPadding =
  props.bottomFloatPadding === undefined
    ? requiredConfigEntries('bottomFloatPadding').bottomFloatPadding
    : props.bottomFloatPadding;

// Methods

function styleFn(offset: number, height: number) {
  const fixedPadding =
    props.fixedPadding === undefined
      ? requiredConfigEntries('fixedPadding').fixedPadding
      : props.fixedPadding;

  return {
    minHeight: `${height - offset - fixedPadding}px`,
  };
}
</script>

<template>
  <q-page v-bind="$attrs" :style-fn="styleFn">
    <div
      :style="{
        paddingTop: `${topFloatPadding}px`,
        paddingBottom: `${bottomFloatPadding}px`,
      }"
    >
      <slot></slot>
    </div>
  </q-page>
</template>

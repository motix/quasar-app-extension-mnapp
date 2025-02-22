<script setup lang="ts">
import { computed, readonly, ref } from 'vue';

import { Dark } from 'quasar';

import { requiredConfigEntries } from 'composables/useConfig';

import ExpandableCardHeader from './ExpandableCardHeader.vue';

// Props

const props = withDefaults(
  defineProps<{
    expandable?: boolean | undefined;
    initiallyExpanded?: boolean | undefined;
    clickable?: boolean | undefined;
    // eslint-disable-next-line vue/require-default-prop
    headerBackgroundColor?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    bodyBackgroundColor?: string | undefined;
    headerDark?: boolean | undefined;
    // eslint-disable-next-line vue/require-default-prop
    externalLinkUrl?: string | undefined;
    avatarTop?: boolean | undefined;
    // eslint-disable-next-line vue/require-default-prop
    avatarColor?: string | undefined;
    avatarSize?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    avatarIcon?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    avatarImage?: string | undefined;
    useGravatar?: boolean | undefined;
    // eslint-disable-next-line vue/require-default-prop
    gravatarId?: string | undefined;
    titleFullWidth?: boolean | undefined;
    titleTop?: boolean | undefined;
    // eslint-disable-next-line vue/require-default-prop
    titleColor?: string | undefined;
    titleNoWrap?: boolean | undefined;
    // eslint-disable-next-line vue/require-default-prop
    title?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    titleEndIconColor?: string | undefined;
    titleEndIconSuperscript?: boolean | undefined;
    // eslint-disable-next-line vue/require-default-prop
    titleEndIcon?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    subtitleIcon?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    subtitleColor?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    subtitle?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    subtitleTooltip?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    captionColor?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    caption?: string | undefined;
    // eslint-disable-next-line vue/require-default-prop
    captionTooltip?: string | undefined;
    sideTop?: boolean | undefined;
    headerSeparator?: boolean | undefined;
    bodyLoading?: boolean | undefined;
    // eslint-disable-next-line vue/require-default-prop
    bodyClass?: string | undefined;
    bodyColGutter?: boolean | undefined;
    bodyRowGutter?: boolean | undefined;
    bodyCellGutter?: boolean | undefined;
    bezelLessLoading?: boolean | undefined;
  }>(),
  {
    expandable: false,
    initiallyExpanded: false,
    clickable: false,
    headerDark: false,
    avatarTop: false,
    avatarSize: '56px',
    useGravatar: false,
    titleFullWidth: false,
    titleTop: false,
    titleNoWrap: false,
    titleEndIconSuperscript: false,
    sideTop: false,
    headerSeparator: false,
    bodyLoading: false,
    bodyColGutter: false,
    bodyRowGutter: false,
    bodyCellGutter: false,
    bezelLessLoading: false,
  },
);

const { clickable } = props;

// Data

const cardWidth = readonly(ref(requiredConfigEntries('cardWidth').cardWidth));

const cardExpanded = ref(!!props.initiallyExpanded);

// Computed

const bodyCssClass = computed<Record<string, unknown>>(() => {
  const result: Record<string, unknown> = {
    'q-col-gutter-x-md row': props.bodyColGutter,
    'q-gutter-y-md': props.bodyRowGutter,
    'q-col-gutter-md row': props.bodyCellGutter,
  };

  if (props.bodyClass) {
    result[props.bodyClass] = true;
  }

  return result;
});

const expanded = computed(() => props.expandable && cardExpanded.value);

// Expose

defineExpose({
  expanded,
});
</script>

<template>
  <q-card
    :class="`bg-${bodyBackgroundColor || (Dark.isActive ? 'grey-10' : 'grey-1')}`"
    style="width: 100%"
    :style="{ maxWidth: cardWidth + 'px' }"
  >
    <template v-if="expandable">
      <q-expansion-item
        v-model="cardExpanded"
        :class="
          (headerBackgroundColor ? `bg-${headerBackgroundColor}` : '') +
          ' ' +
          (clickable ? 'cursor-pointer' : '')
        "
        :dark="headerDark || Dark.isActive"
        expand-icon-class="q-pr-none"
        :expand-icon-toggle="clickable"
        expand-separator
        @click.stop
      >
        <template #header>
          <expandable-card-header v-bind="$props" class="q-pl-none full-width" :clickable="false">
            <template v-if="$slots.main" #main>
              <slot name="main"></slot>
            </template>

            <template v-if="$slots.side" #side>
              <slot name="side"></slot>
            </template>
          </expandable-card-header>
        </template>

        <div
          class="rounded-borders"
          :class="`bg-${bodyBackgroundColor || (Dark.isActive ? 'grey-10' : 'grey-1')}`"
          style="border-top-left-radius: 0; border-top-right-radius: 0; cursor: default"
          @click.stop
        >
          <!-- Fix background error when the following templates use q-gutter classes -->
          <div style="height: 1px"></div>

          <slot name="bezel-less-top"></slot>

          <q-linear-progress v-if="bodyLoading" color="warning" indeterminate />
          <q-slide-transition>
            <q-card-section v-if="$slots.body" v-show="!bodyLoading" :class="bodyCssClass">
              <slot name="body"></slot>
            </q-card-section>
          </q-slide-transition>

          <q-linear-progress v-if="bezelLessLoading" color="warning" indeterminate />
          <q-slide-transition>
            <div v-if="$slots['bezel-less']" v-show="!bezelLessLoading">
              <slot name="bezel-less"></slot>
            </div>
          </q-slide-transition>
        </div>
      </q-expansion-item>
    </template>

    <template v-else>
      <expandable-card-header
        v-ripple="clickable"
        v-bind="$props"
        class="q-pa-md"
        :class="headerBackgroundColor ? `bg-${headerBackgroundColor}` : ''"
      >
        <template v-if="$slots.main" #main>
          <slot name="main"></slot>
        </template>

        <template v-if="$slots.side" #side>
          <slot name="side"></slot>
        </template>
      </expandable-card-header>

      <div @click.stop>
        <q-separator v-if="headerSeparator" />

        <slot name="bezel-less-top"></slot>

        <q-linear-progress v-if="bodyLoading" color="warning" indeterminate />
        <q-slide-transition>
          <q-card-section v-if="$slots.body" v-show="!bodyLoading" :class="bodyCssClass">
            <slot name="body"></slot>
          </q-card-section>
        </q-slide-transition>

        <q-linear-progress v-if="bezelLessLoading" color="warning" indeterminate />
        <q-slide-transition>
          <div v-if="$slots['bezel-less']" v-show="!bezelLessLoading">
            <slot name="bezel-less"></slot>
          </div>
        </q-slide-transition>
      </div>
    </template>
  </q-card>
</template>

<style lang="scss" scoped>
// Fix focus error when the following templates use q-gutter classes
:deep() .q-expansion-item > .q-expansion-item__container > .q-hoverable {
  z-index: 1;
}
</style>

<script setup lang="ts">
import { computed, readonly, ref } from 'vue';

import { Dark } from 'quasar';

import { requiredConfigEntries } from 'composables/useConfig';

import ExpandableCardHeader from './ExpandableCardHeader.vue';

// Props

const props = withDefaults(
  defineProps<{
    expandable?: boolean;
    clickable?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    headerBackgroundColor?: string;
    // eslint-disable-next-line vue/require-default-prop
    bodyBackgroundColor?: string;
    headerDark?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    externalLinkUrl?: string;
    avatarTop?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    avatarColor?: string;
    avatarSize?: string;
    // eslint-disable-next-line vue/require-default-prop
    avatarIcon?: string;
    // eslint-disable-next-line vue/require-default-prop
    avatarImage?: string;
    useGravatar?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    gravatarId?: string;
    titleFullWidth?: boolean;
    titleTop?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    titleColor?: string;
    titleNoWrap?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    title?: string;
    // eslint-disable-next-line vue/require-default-prop
    subtitleIcon?: string;
    // eslint-disable-next-line vue/require-default-prop
    subtitleColor?: string;
    // eslint-disable-next-line vue/require-default-prop
    subtitle?: string;
    // eslint-disable-next-line vue/require-default-prop
    subtitleTooltip?: string;
    // eslint-disable-next-line vue/require-default-prop
    captionColor?: string;
    // eslint-disable-next-line vue/require-default-prop
    caption?: string;
    // eslint-disable-next-line vue/require-default-prop
    captionTooltip?: string;
    sideTop?: boolean;
    headerSeparator?: boolean;
    bodyLoading?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    bodyClass?: string;
    bodyColGutter?: boolean;
    bodyRowGutter?: boolean;
    bodyCellGutter?: boolean;
    bezelLessLoading?: boolean;
  }>(),
  {
    expandable: false,
    clickable: false,
    headerDark: false,
    avatarTop: false,
    avatarSize: '56px',
    useGravatar: false,
    titleFullWidth: false,
    titleTop: false,
    titleNoWrap: false,
    sideTop: false,
    headerSeparator: false,
    bodyLoading: false,
    bodyColGutter: false,
    bodyRowGutter: false,
    bodyCellGutter: false,
    bezelLessLoading: false,
  }
);

// Data

const cardWidth = readonly(ref(requiredConfigEntries('cardWidth').cardWidth));

const cardExpanded = ref(false);

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
    :class="`bg-${
      bodyBackgroundColor || (Dark.isActive ? 'grey-10' : 'grey-1')
    }`"
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
          <!-- Refer to this issue for v-bind="$props": https://giters.com/johnsoncodehk/volar/issues/556 -->
          <expandable-card-header
            v-bind="{ ...$props, ref: undefined }"
            class="q-pl-none full-width"
            :clickable="false"
          >
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
          :class="`bg-${
            bodyBackgroundColor || (Dark.isActive ? 'grey-10' : 'grey-1')
          }`"
          style="
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            cursor: default;
          "
          @click.stop
        >
          <!-- Fix background error when the following templates use q-gutter classes -->
          <div style="height: 1px"></div>

          <slot name="bezel-less-top"></slot>

          <q-linear-progress v-if="bodyLoading" color="warning" indeterminate />
          <q-slide-transition>
            <q-card-section
              v-if="$slots.body && !bodyLoading"
              :class="bodyCssClass"
            >
              <slot name="body"></slot>
            </q-card-section>
          </q-slide-transition>

          <q-linear-progress
            v-if="bezelLessLoading"
            color="warning"
            indeterminate
          />
          <q-slide-transition>
            <slot v-if="!bezelLessLoading" name="bezel-less"></slot>
          </q-slide-transition>
        </div>
      </q-expansion-item>
    </template>
    <template v-else>
      <!-- Refer to this issue for v-bind="$props": https://giters.com/johnsoncodehk/volar/issues/556 -->
      <expandable-card-header
        v-bind="{ ...$props, ref: undefined }"
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
          <q-card-section
            v-if="$slots.body && !bodyLoading"
            :class="bodyCssClass"
          >
            <slot name="body"></slot>
          </q-card-section>
        </q-slide-transition>

        <slot name="bezel-less"></slot>
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

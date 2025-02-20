<script setup lang="ts">
import { computed } from 'vue';

import { Dark } from 'quasar';

// Props

const props = withDefaults(
  defineProps<{
    expandable?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    headerBackgroundColor?: string;
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
    titleEndIconColor?: string;
    titleEndIconSuperscript?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    titleEndIcon?: string;
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
  }>(),
  {
    expandable: false,
    headerDark: false,
    avatarTop: false,
    avatarSize: '56px',
    useGravatar: false,
    titleFullWidth: false,
    titleTop: false,
    titleNoWrap: false,
    sideTop: false,
  },
);

// Computed

const titleCssClass = computed(() => {
  const val: { [key: string]: boolean } = {
    'text-no-wrap': props.titleNoWrap,
  };

  if (props.titleColor) {
    val[`text-${props.titleColor}`] = true;
  }

  return val;
});

const subtitleCssClass = computed(() => {
  const val: { [key: string]: boolean } = {};

  if (props.subtitleColor) {
    val[`text-${props.subtitleColor}`] = true;
  }

  return val;
});

const captionCssClass = computed(() => {
  const val: { [key: string]: boolean } = {};

  if (props.captionColor) {
    val[`text-${props.captionColor}`] = true;
  }

  return val;
});
</script>

<template>
  <q-item :dark="headerDark || Dark.isActive">
    <q-btn
      v-if="externalLinkUrl"
      class="absolute"
      :color="headerDark ? 'white' : 'primary'"
      flat
      :href="externalLinkUrl"
      icon="fal fa-external-link"
      outline
      padding="xs"
      size="xs"
      :style="{
        right: expandable ? '-39px' : '0px',
        top: expandable ? '-8px' : '0px',
      }"
      target="_blank"
      type="a"
      @click.stop
    />

    <q-item-section
      v-if="avatarIcon || avatarImage || useGravatar"
      avatar
      :class="{ 'q-pt-xs': avatarTop }"
      :top="avatarTop"
    >
      <q-avatar
        v-if="avatarIcon"
        :color="avatarColor || (headerDark || Dark.isActive ? 'white' : 'grey-9')"
        :size="avatarSize"
      >
        <q-icon
          :color="headerBackgroundColor || (headerDark || Dark.isActive ? 'grey-9' : 'white')"
          :name="avatarIcon"
        />
      </q-avatar>
      <q-avatar v-if="avatarImage" :size="avatarSize">
        <q-img :src="avatarImage" />
      </q-avatar>
      <gravatar-image
        v-if="useGravatar"
        :dark="headerDark || Dark.isActive"
        :gravatar-id="gravatarId"
      />
    </q-item-section>

    <q-item-section :top="titleTop">
      <q-item-label v-if="title" class="text-h6" :class="titleCssClass">
        {{ title }}
        <template v-if="titleEndIcon">
          <sup v-if="titleEndIconSuperscript">
            <q-icon :color="titleEndIconColor" :name="titleEndIcon" />
          </sup>
          <q-icon v-else class="q-ml-xs" :color="titleEndIconColor" :name="titleEndIcon" />
        </template>
      </q-item-label>

      <!-- Setting max-width to support ellipsis in main slot -->
      <q-item class="q-pa-none" style="max-width: 100%; min-height: 0">
        <q-item-section top>
          <q-item-label v-if="subtitle" class="text-subtitle2 q-pt-xs" :class="subtitleCssClass">
            <q-icon v-if="subtitleIcon" class="q-mr-xs" :name="subtitleIcon" />
            <span>
              {{ subtitle }}
              <top-tooltip v-if="subtitleTooltip">
                {{ subtitleTooltip }}
              </top-tooltip>
            </span>
          </q-item-label>

          <q-item-label v-if="caption" caption :class="captionCssClass">
            <span>
              {{ caption }}
              <top-tooltip v-if="captionTooltip">
                {{ captionTooltip }}
              </top-tooltip>
            </span>
          </q-item-label>

          <!-- Use a div to prevent content from spreading to full width -->
          <div style="max-width: 100%">
            <slot name="main"></slot>
          </div>
        </q-item-section>

        <q-item-section v-if="$slots.side && titleFullWidth" class="text-right" side :top="sideTop">
          <slot name="side"></slot>
        </q-item-section>
      </q-item>
    </q-item-section>

    <q-item-section
      v-if="$slots.side && !titleFullWidth"
      class="text-right"
      :class="{ 'q-pt-xs': sideTop }"
      side
      :top="sideTop"
    >
      <slot name="side"></slot>
    </q-item-section>
  </q-item>
</template>

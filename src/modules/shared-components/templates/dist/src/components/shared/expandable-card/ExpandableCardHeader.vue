<script setup lang="ts">
import { computed } from 'vue';

// Props

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line vue/require-default-prop
    headerBackgroundColor?: string;
    headerDark?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    externalLinkUrl?: string;
    avatarTop?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    avatarColor?: string;
    // eslint-disable-next-line vue/require-default-prop
    avatarIcon?: string;
    // eslint-disable-next-line vue/require-default-prop
    avatarImage?: string;
    useGravatar?: boolean;
    // eslint-disable-next-line vue/require-default-prop
    gravatarId?: string;
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
  }>(),
  {
    headerDark: false,
    avatarTop: false,
    useGravatar: false,
    titleTop: false,
    titleNoWrap: false,
    sideTop: false,
  }
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
  <q-item :dark="headerDark">
    <q-btn
      v-if="externalLinkUrl"
      class="absolute"
      color="primary"
      flat
      :href="externalLinkUrl"
      icon="fal fa-external-link"
      outline
      padding="xs"
      size="xs"
      style="right: 0; top: 0"
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
        :color="avatarColor || (headerDark ? 'white' : 'grey-9')"
        size="56px"
      >
        <q-icon
          :color="headerBackgroundColor || (headerDark ? 'grey-9' : 'white')"
          :name="avatarIcon"
        />
      </q-avatar>
      <q-avatar v-if="avatarImage" size="56px">
        <q-img :src="avatarImage" />
      </q-avatar>
      <gravatar-image
        v-if="useGravatar"
        :dark="headerDark"
        :gravatar-id="gravatarId"
      />
    </q-item-section>

    <q-item-section :top="titleTop">
      <q-item-label v-if="title" class="text-h6" :class="titleCssClass">
        {{ title }}
      </q-item-label>

      <q-item-label
        v-if="subtitle"
        class="text-subtitle2 q-pt-xs"
        :class="subtitleCssClass"
      >
        <q-icon v-if="subtitleIcon" :name="subtitleIcon" />
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

      <slot name="main" />
    </q-item-section>

    <q-item-section
      v-if="$slots.side"
      class="text-right"
      :class="{ 'q-pt-xs': sideTop }"
      side
      :top="sideTop"
    >
      <slot name="side" />
    </q-item-section>
  </q-item>
</template>

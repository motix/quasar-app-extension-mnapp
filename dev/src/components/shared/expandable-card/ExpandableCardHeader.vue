<script setup lang="ts">
import { computed } from 'vue'

// Props

const props = defineProps({
  headerBackgroundColor: {
    type: String,
    required: false,
    default: undefined
  },
  headerDark: {
    type: Boolean,
    default: false
  },
  externalLinkUrl: {
    type: String,
    required: false,
    default: undefined
  },
  avatarTop: {
    type: Boolean,
    default: false
  },
  avatarColor: {
    type: String,
    required: false,
    default: undefined
  },
  avatarIcon: {
    type: String,
    required: false,
    default: undefined
  },
  avatarImage: {
    type: String,
    required: false,
    default: undefined
  },
  useGravatar: {
    type: Boolean,
    default: false
  },
  gravatarId: {
    type: String,
    required: false,
    default: undefined
  },
  titleTop: {
    type: Boolean,
    default: false
  },
  titleColor: {
    type: String,
    required: false,
    default: undefined
  },
  titleNoWrap: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: false,
    default: undefined
  },
  subtitleIcon: {
    type: String,
    required: false,
    default: undefined
  },
  subtitleColor: {
    type: String,
    required: false,
    default: undefined
  },
  subtitle: {
    type: String,
    required: false,
    default: undefined
  },
  subtitleTooltip: {
    type: String,
    required: false,
    default: undefined
  },
  caption: {
    type: String,
    required: false,
    default: undefined
  },
  sideTop: {
    type: Boolean,
    default: false
  }
})

// Computed

const titleCssClass = computed(() => {
  const val: {[key: string]: boolean} = {
    'text-no-wrap': props.titleNoWrap
  }

  if (props.titleColor) {
    val[`text-${props.titleColor}`] = true
  }

  return val
})

const subtitleCssClass = computed(() => {
  const val: {[key: string]: boolean} = {}

  if (props.subtitleColor) {
    val[`text-${props.subtitleColor}`] = true
  }

  return val
})
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
      >
        <q-icon
          :color="headerBackgroundColor || (headerDark ? 'grey-9' : 'white')"
          :name="avatarIcon"
        />
      </q-avatar>
      <q-avatar
        v-if="avatarImage"
        size="56px"
      >
        <q-img :src="avatarImage" />
      </q-avatar>
      <gravatar
        v-if="useGravatar"
        :dark="headerDark"
        :gravatar-id="gravatarId"
      />
    </q-item-section>

    <q-item-section :top="titleTop">
      <q-item-label
        v-if="title"
        class="text-h6"
        :class="titleCssClass"
      >
        {{ title }}
      </q-item-label>

      <q-item-label
        v-if="subtitle"
        class="text-subtitle2 q-pt-xs"
        :class="subtitleCssClass"
      >
        <q-icon
          v-if="subtitleIcon"
          :name="subtitleIcon"
        />
        <span>
          {{ subtitle }}
          <top-tooltip v-if="subtitleTooltip">
            {{ subtitleTooltip }}
          </top-tooltip>
        </span>
      </q-item-label>

      <q-item-label
        v-if="caption"
        caption
      >
        {{ caption }}
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

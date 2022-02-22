<script setup lang="ts">
import { requiredConfigEntries } from 'services/useConfig'
import ExpandableCardHeader from './ExpandableCardHeader.vue'
// Main
import { ref, readonly, computed } from 'vue'

// Props

const props = defineProps({
  expandable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  headerBackgroundColor: {
    type: String,
    required: false,
    default: undefined
  },
  bodyBackgroundColor: {
    type: String,
    required: false,
    default: 'grey-1'
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
  },
  headerSeparator: {
    type: Boolean,
    default: false
  },
  gutterColBody: {
    type: Boolean,
    default: false
  },
  gutterRowBody: {
    type: Boolean,
    default: false
  }
})

// Data

const cardWidth = readonly(ref(requiredConfigEntries('cardWidth').cardWidth))

// Computed

const cardCssClass = computed<Record<string, unknown>>(() => ({
  'cursor-pointer': props.clickable
}))

//  Private Executions

cardCssClass.value[`bg-${props.bodyBackgroundColor}`] = true
</script>

<template>
  <q-card
    :class="cardCssClass"
    style="width: 100%"
    :style="{ maxWidth: cardWidth + 'px' }"
  >
    <template v-if="expandable">
      <q-expansion-item
        :class="headerBackgroundColor ? `bg-${headerBackgroundColor}` : ''"
        :dark="headerDark"
        expand-icon-class="q-pr-none"
        expand-separator
      >
        <template #header>
          <!-- Refer to this issue for v-bind="$props": https://giters.com/johnsoncodehk/volar/issues/556 -->
          <expandable-card-header
            v-bind="{ ...$props, ref: undefined }"
            class="q-pl-none full-width"
          >
            <template
              v-if="$slots.main"
              #main
            >
              <slot name="main" />
            </template>

            <template
              v-if="$slots.side"
              #side
            >
              <slot name="side" />
            </template>
          </expandable-card-header>
        </template>

        <div :class="`bg-${bodyBackgroundColor}`">
          <slot name="bezel-less-top" />

          <q-card-section v-if="$slots.body">
            <div
              v-if="gutterColBody || gutterRowBody"
              :class="{ 'q-gutter-y-md': gutterColBody, 'q-col-gutter-md row items-start': gutterRowBody }"
            >
              <slot name="body" />
            </div>
            <slot
              v-else
              name="body"
            />
          </q-card-section>

          <slot name="bezel-less" />
        </div>
      </q-expansion-item>
    </template>
    <template v-else>
      <!-- Refer to this issue for v-bind="$props": https://giters.com/johnsoncodehk/volar/issues/556 -->
      <expandable-card-header
        v-bind="{ ...$props, ref: undefined }"
        class="q-pa-md"
        :class="(headerBackgroundColor ? `bg-${headerBackgroundColor}` : '')"
      >
        <template
          v-if="$slots.main"
          #main
        >
          <slot name="main" />
        </template>

        <template
          v-if="$slots.side"
          #side
        >
          <slot name="side" />
        </template>
      </expandable-card-header>

      <q-separator v-if="headerSeparator" />

      <slot name="bezel-less-top" />

      <q-card-section v-if="$slots.body">
        <div
          v-if="gutterColBody || gutterRowBody"
          :class="{ 'q-gutter-y-md': gutterColBody, 'q-col-gutter-md row items-start': gutterRowBody }"
        >
          <slot name="body" />
        </div>
        <slot
          v-else
          name="body"
        />
      </q-card-section>

      <slot name="bezel-less" />
    </template>
  </q-card>
</template>

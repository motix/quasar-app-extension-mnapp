<template>
  <q-card
    class="bg-grey-1"
    :class="{ 'cursor-pointer': clickable }"
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
          <expandable-card-header
            v-bind="$props"
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

        <q-card-section
          v-if="$slots.body"
          class="bg-grey-1"
        >
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
      </q-expansion-item>
    </template>
    <template v-else>
      <expandable-card-header
        v-bind="$props"
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

<script lang="ts">
import { defineComponent } from 'vue'
import useConfig from 'composables/use-config'
import ExpandableCardHeader from './ExpandableCardHeader.vue'

export default defineComponent({
  name: 'ExpandableCard',

  components: { ExpandableCardHeader },

  props: {
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
  },

  setup () {
    return { ...useConfig() }
  }
})
</script>

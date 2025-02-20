<script setup lang="ts">
import { ref, watch } from 'vue';

import { Dark, QAjaxBar } from 'quasar';

import useNewPage from 'composables/crud-pages/useNewPage';

import FloatToolbar from 'components/shared/FloatToolbar.vue';
import TopTooltip from 'components/shared/TopTooltip.vue';

// Props

const props = defineProps<{ scopeName: string }>();

// Composables

const {
  // usePageStatus
  ready,
  freezed,
  isDirty,
  // useEditor
  editorSaving,
  initiallyFilled,
  editorSave,
  // useNavigateToListPage
  confirmAndGoBack,
} = useNewPage<NonNullable<unknown>>(props.scopeName);

// Data

const freezingBar = ref<QAjaxBar | null>(null);
const saveTooltip = ref<InstanceType<typeof TopTooltip> | null>(null);

// Methods

function hideSaveTooltip() {
  saveTooltip.value?.hide();
}

// Watch

watch(freezed, (value) => {
  if (value) {
    freezingBar.value?.start();
  } else {
    freezingBar.value?.stop();
  }
});
</script>

<template>
  <div>
    <fade-transition>
      <div v-if="!ready" key="loading" class="absolute-center">
        <!-- Loading -->
        <q-spinner-pie color="primary" size="6em" />
      </div>

      <div v-else key="ready">
        <!-- Ready -->
        <slot></slot>

        <float-toolbar position="bottom-left">
          <template #fixed-buttons>
            <q-btn
              key="back"
              :color="isDirty ? 'accent' : Dark.isActive ? 'grey-9' : 'grey-3'"
              :disable="freezed"
              icon="fal fa-arrow-left"
              round
              :text-color="isDirty ? 'white' : 'accent'"
              @click="confirmAndGoBack"
            >
              <top-tooltip>Back</top-tooltip>
            </q-btn>
          </template>
        </float-toolbar>

        <float-toolbar>
          <template #fixed-buttons>
            <q-btn
              key="save"
              :color="Dark.isActive ? 'grey-9' : 'grey-3'"
              :disable="freezed || (!isDirty && !initiallyFilled)"
              icon="fal fa-save"
              :loading="editorSaving"
              round
              text-color="primary"
              @click="
                (() => {
                  hideSaveTooltip();
                  editorSave();
                })()
              "
            >
              <top-tooltip ref="saveTooltip">Save</top-tooltip>
            </q-btn>

            <slot name="toolbar-main"></slot>

            <transition-group
              v-show="$slots['toolbar-extra']"
              key="extra"
              class="no-wrap row reverse"
              name="float-toolbar-transition"
              style="margin-right: 7px"
              tag="div"
            >
              <slot name="toolbar-extra"></slot>
            </transition-group>
          </template>
        </float-toolbar>
      </div>
    </fade-transition>

    <q-ajax-bar ref="freezingBar" color="warning" position="bottom" size="3px" />
  </div>
</template>

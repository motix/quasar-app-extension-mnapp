<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';

import { Dark, QAjaxBar } from 'quasar';

import useViewPage from 'composables/crud-pages/useViewPage';

import FloatToolbar from 'components/shared/FloatToolbar.vue';
import SwitchViewButton from 'components/shared/SwitchViewButton.vue';
import TopTooltip from 'components/shared/TopTooltip.vue';

// Props

const props = defineProps<{ scopeName: string }>();

// Composables

const $p = useViewPage<NonNullable<unknown>, NonNullable<unknown>>(props.scopeName);
const {
  // useReturnUrl
  goBack,
  // usePageFeatures
  hasMultiViews,
  // usePageStatus
  ready,
  freezed,
  editMode,
  isDirty,
  // usePageData
  model,
  // useEditor
  editorSaving,
  edit,
  editorSave,
  revert,
  // useDeleting
  deleting,
  trash,
  // useToolbar
  toolbarRef,
  toolbarPersistent,
  toolbarFabButtonsVisibility,
  toolbarFixedButtonsVisibility,
} = $p;

// Data

const freezingBar = useTemplateRef('freezingBar');
const saveTooltip = useTemplateRef('saveTooltip');

// Computed

const hasMainButtons = computed(() => {
  if (
    $p.toolbarFabButtonsVisibility.value.edit ||
    $p.toolbarFabButtonsVisibility.value.revert ||
    $p.toolbarFabButtonsVisibility.value.save ||
    $p.toolbarFabButtonsVisibility.value.trash
  ) {
    return true;
  }

  for (const button in $p.toolbarMainButtonVisibility.value) {
    if ($p.toolbarMainButtonVisibility.value[button]) {
      return true;
    }
  }

  return false;
});

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

      <div v-else-if="!model" key="empty">
        <!-- Empty -->
        <div class="q-my-md text-center">The item is not available. Please contact support.</div>

        <float-toolbar position="bottom-left">
          <template #fixed-buttons>
            <q-btn
              key="back"
              :color="Dark.isActive ? 'grey-9' : 'grey-3'"
              icon="fal fa-arrow-left"
              round
              text-color="accent"
              @click="goBack"
            >
              <top-tooltip>Back</top-tooltip>
            </q-btn>
          </template>
        </float-toolbar>
      </div>

      <div v-else key="ready">
        <!-- Ready -->
        <fade-transition>
          <div v-if="!editMode" key="viewer">
            <slot name="viewer"></slot>
          </div>

          <div v-else key="editor">
            <slot name="editor"></slot>
          </div>
        </fade-transition>

        <float-toolbar position="bottom-left">
          <template #fixed-buttons>
            <q-btn
              v-if="toolbarFixedButtonsVisibility.back"
              key="back"
              :color="Dark.isActive ? 'grey-9' : 'grey-3'"
              :disable="freezed"
              icon="fal fa-arrow-left"
              round
              text-color="accent"
              @click="goBack"
            >
              <top-tooltip>Back</top-tooltip>
            </q-btn>
          </template>
        </float-toolbar>

        <float-toolbar
          ref="toolbarRef"
          :fab-buttons-visibility="toolbarFabButtonsVisibility"
          :persistent="toolbarPersistent"
        >
          <q-btn
            v-show="toolbarFabButtonsVisibility.trash"
            key="trash"
            :color="Dark.isActive ? 'grey-9' : 'grey-3'"
            :disable="freezed"
            icon="fal fa-trash-alt"
            :loading="deleting"
            round
            text-color="negative"
            @click="trash"
          >
            <top-tooltip>Delete</top-tooltip>
          </q-btn>

          <q-btn
            v-show="toolbarFabButtonsVisibility.edit"
            key="edit"
            :color="Dark.isActive ? 'grey-9' : 'grey-3'"
            :disable="freezed"
            icon="fal fa-edit"
            round
            text-color="primary"
            @click="edit"
          >
            <top-tooltip>Edit</top-tooltip>
          </q-btn>

          <q-btn
            v-show="toolbarFabButtonsVisibility.revert"
            key="revert"
            :color="isDirty ? 'warning' : Dark.isActive ? 'grey-9' : 'grey-3'"
            :disable="freezed"
            icon="fal fa-undo"
            round
            :text-color="isDirty ? 'white' : 'warning'"
            @click="revert"
          >
            <top-tooltip>Revert</top-tooltip>
          </q-btn>

          <q-btn
            v-show="toolbarFabButtonsVisibility.save"
            key="save"
            :color="Dark.isActive ? 'grey-9' : 'grey-3'"
            :disable="freezed || !isDirty"
            icon="fal fa-save"
            :loading="editorSaving"
            round
            text-color="primary"
            @click="
              (function () {
                hideSaveTooltip();
                editorSave();
              })()
            "
          >
            <top-tooltip ref="saveTooltip">Save</top-tooltip>
          </q-btn>

          <slot name="toolbar-main"></slot>

          <transition-group
            v-show="hasMultiViews || $slots['toolbar-extra']"
            key="extra"
            class="no-wrap row reverse"
            name="float-toolbar-transition"
            :style="{
              'margin-right': hasMainButtons ? '7px' : undefined,
            }"
            tag="div"
          >
            <switch-view-button v-if="toolbarFabButtonsVisibility.switchView" key="switchView" />

            <slot name="toolbar-extra"></slot>
          </transition-group>

          <template #second-row-buttons>
            <slot name="toolbar-second-row"></slot>
          </template>
        </float-toolbar>
      </div>
    </fade-transition>

    <q-ajax-bar ref="freezingBar" color="warning" position="bottom" size="3px" />
  </div>
</template>

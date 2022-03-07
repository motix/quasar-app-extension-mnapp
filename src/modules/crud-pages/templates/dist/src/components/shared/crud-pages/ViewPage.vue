<script setup lang="ts">
import useViewPage from 'composables/crud-pages/useViewPage'
import TopTooltip from 'components/shared/TopTooltip.vue'
import FloatToolbar from 'components/shared/FloatToolbar.vue'
import SwitchViewButton from 'components/shared/SwitchViewButton.vue'
// Main
import { ref, watch } from 'vue'
// Types
import type { QAjaxBar } from 'quasar'

// Props

const props = defineProps<{ scopeName: string }>()

// Composables

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
  toolbar,
  toolbarFabButtonsVisibility,
  toolbarFixedButtonsVisibility
} = useViewPage(props.scopeName)

// Data

const freezingBar = ref<QAjaxBar | null>(null)
const saveTooltip = ref<InstanceType<typeof TopTooltip> | null>(null)

// Methods

function hideSaveTooltip () {
  saveTooltip.value?.hide()
}

// Watch

watch(freezed, value => {
  if (value) {
    freezingBar.value?.start()
  } else {
    freezingBar.value?.stop()
  }
})
</script>

<template>
  <div>
    <fade-transition>
      <div
        v-if="!ready"
        key="loading"
        class="absolute-center"
      >
        <!-- Loading -->
        <q-spinner-pie
          color="primary"
          size="6em"
        />
      </div>

      <div
        v-else-if="!model"
        key="empty"
      >
        <!-- Empty -->
        <div class="q-my-md text-center">
          The item is not available. Please contact support.
        </div>

        <float-toolbar position="bottom-left">
          <template #fixed-buttons>
            <q-btn
              key="back"
              color="grey-3"
              icon="fal fa-arrow-left"
              round
              text-color="accent"
              @click="goBack"
            >
              <top-tooltip>
                Back
              </top-tooltip>
            </q-btn>
          </template>
        </float-toolbar>
      </div>

      <div
        v-else
        key="ready"
      >
        <!-- Ready -->
        <fade-transition>
          <div
            v-if="!editMode"
            key="viewer"
          >
            <slot name="viewer" />
          </div>

          <div
            v-else
            key="editor"
          >
            <slot name="editor" />
          </div>
        </fade-transition>

        <float-toolbar position="bottom-left">
          <template #fixed-buttons>
            <q-btn
              v-if="toolbarFixedButtonsVisibility.back"
              key="back"
              color="grey-3"
              :disable="freezed"
              icon="fal fa-arrow-left"
              round
              text-color="accent"
              @click="goBack"
            >
              <top-tooltip>
                Back
              </top-tooltip>
            </q-btn>
          </template>
        </float-toolbar>

        <float-toolbar
          ref="toolbar"
          :fab-buttons-visibility="toolbarFabButtonsVisibility"
        >
          <q-btn
            v-show="toolbarFabButtonsVisibility.trash"
            key="trash"
            color="grey-3"
            :disable="freezed"
            icon="fal fa-trash-alt"
            :loading="deleting"
            round
            text-color="negative"
            @click="trash"
          >
            <top-tooltip>
              Delete
            </top-tooltip>
          </q-btn>

          <q-btn
            v-show="toolbarFabButtonsVisibility.edit"
            key="edit"
            color="grey-3"
            :disable="freezed"
            icon="fal fa-edit"
            round
            text-color="primary"
            @click="edit"
          >
            <top-tooltip>
              Edit
            </top-tooltip>
          </q-btn>

          <q-btn
            v-show="toolbarFabButtonsVisibility.revert"
            key="revert"
            :color="isDirty ? 'warning' : 'grey-3'"
            :disable="freezed"
            icon="fal fa-undo"
            round
            :text-color="isDirty ? 'white' : 'warning'"
            @click="revert"
          >
            <top-tooltip>
              Revert
            </top-tooltip>
          </q-btn>

          <q-btn
            v-show="toolbarFabButtonsVisibility.save"
            key="save"
            color="grey-3"
            :disable="freezed || !isDirty"
            icon="fal fa-save"
            :loading="editorSaving"
            round
            text-color="primary"
            @click="hideSaveTooltip(); editorSave()"
          >
            <top-tooltip ref="saveTooltip">
              Save
            </top-tooltip>
          </q-btn>

          <transition-group
            v-show="hasMultiViews || $slots['toolbar-extra']"
            key="extra"
            class="no-wrap row reverse"
            name="float-toolbar-transition"
            style="margin-right: 7px"
            tag="div"
          >
            <switch-view-button
              v-if="hasMultiViews"
              key="switchView"
            />

            <slot name="toolbar-extra" />
          </transition-group>
        </float-toolbar>
      </div>
    </fade-transition>

    <q-ajax-bar
      ref="freezingBar"
      color="warning"
      position="bottom"
      size="3px"
    />
  </div>
</template>

<script setup lang="ts">
import useNewPage from 'composables/crud-pages/useNewPage'
import TopTooltip from 'components/shared/TopTooltip.vue'
import FloatToolbar from 'components/shared/FloatToolbar.vue'
// Main
import { ref, watch } from 'vue'
// Types
import type { QAjaxBar } from 'quasar'

// Props

const props = defineProps<{ scopeName: string }>()

// Composables

const {
  // usePageStatus
  ready,
  freezed,
  isDirty,
  // useEditor
  saving,
  initiallyFilled,
  save,
  // useNavigateToListPage
  confirmAndGoBack,
  // useToolbar
  toolbar
} = useNewPage(props.scopeName)

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
        v-else
        key="ready"
      >
        <!-- Ready -->
        <slot />

        <float-toolbar position="bottom-left">
          <template #fixed-buttons>
            <q-btn
              key="back"
              :color="isDirty ? 'accent' : 'grey-3'"
              :disable="freezed"
              icon="fal fa-arrow-left"
              round
              :text-color="isDirty ? 'white' : 'accent'"
              @click="confirmAndGoBack"
            >
              <top-tooltip>
                Back
              </top-tooltip>
            </q-btn>
          </template>
        </float-toolbar>

        <float-toolbar ref="toolbar">
          <template #fixed-buttons>
            <q-btn
              key="save"
              color="grey-3"
              :disable="freezed || (!isDirty && !initiallyFilled)"
              icon="fal fa-save"
              :loading="saving"
              round
              text-color="primary"
              @click="hideSaveTooltip(); save()"
            >
              <top-tooltip ref="saveTooltip">
                Save
              </top-tooltip>
            </q-btn>
          </template>
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

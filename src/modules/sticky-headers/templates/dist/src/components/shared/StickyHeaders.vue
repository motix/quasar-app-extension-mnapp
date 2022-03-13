<script setup lang="ts">
import { scroll } from 'quasar'
import { useStickyHeadersResult } from 'composables/useStickyHeaders'
// Main
import { ref, computed, nextTick } from 'vue'
// Types
import type { QScrollObserverProps } from 'quasar'

type OnScrollDetail = Parameters<Exclude<QScrollObserverProps['onScroll'], undefined>>[0]

// Private

let sourceScrollObserverPaused = false
let destScrollObserverPaused = false
let sourceScrollObserverPausedTimeout: ReturnType<typeof setTimeout> | null = null
let destScrollObserverPausedTimeout: ReturnType<typeof setTimeout> | null = null

const getSourceTable = () => document.querySelector(`${sourceTableScrollTarget.value}>table`)

// Props

const props = defineProps<{ target: string }>()

// Composables

const {
  getHorizontalScrollPosition,
  setHorizontalScrollPosition
} = scroll

const { stickyHeadersPosition } = useStickyHeadersResult()

// Data

const container = ref<HTMLElement | null>(null)
const containerVisible = ref(false)
const containerTop = ref('0px')
const headersPadding = ref('0px')
const headersWidth = ref('100%')

const sourceTableScrollObserverEnabled = ref(false)

// Computed

const sourceTableScrollTarget = computed(() => `${props.target}>.q-table__middle.scroll`)

// Methods

function onResize () {
  const source = getSourceTable()

  if (!source) {
    return
  }

  // Update headers size

  const padding = source.getBoundingClientRect().left

  headersPadding.value = `${padding}px`
  headersWidth.value = `${source.getBoundingClientRect().width + (padding * 2)}px`

  // Update headers content

  const sourceTr = source.querySelector(':scope>thead>tr') as HTMLElement
  const destTr = (container.value as HTMLElement).querySelector(':scope>div>table>thead>tr') as HTMLElement

  destTr.innerHTML = sourceTr.innerHTML

  function updateClassnames () {
    sourceTr.childNodes.forEach((value, index) => {
      const sourceTh = value as HTMLElement
      const destTh = destTr.childNodes.item(index) as HTMLElement

      destTh.className = sourceTh.className
    })
  }

  sourceTr.childNodes.forEach((value, index) => {
    const sourceTh = value as HTMLElement
    const destTh = destTr.childNodes.item(index) as HTMLElement

    destTh.style.width = `${sourceTh.getBoundingClientRect().width}px`

    sourceTh.onclick = () => { updateClassnames() }
    destTh.onclick = () => {
      sourceTh.click()
      void nextTick(() => { updateClassnames() })
    }
  })
}

function onDocumentScroll () {
  const source = getSourceTable()

  sourceTableScrollObserverEnabled.value = !!source

  if (!source) {
    return
  }

  const sourceTop = source.getBoundingClientRect().top

  containerTop.value = `${stickyHeadersPosition.value}px`
  containerVisible.value = sourceTop <= stickyHeadersPosition.value

  const left = getHorizontalScrollPosition(document.querySelector(sourceTableScrollTarget.value) as HTMLElement)
  setHorizontalScrollPosition(container.value as HTMLElement, left)
}

function onSourceTableScroll (info: OnScrollDetail) {
  if (sourceScrollObserverPaused) {
    return
  }

  if (destScrollObserverPausedTimeout) {
    clearTimeout(destScrollObserverPausedTimeout)
  }

  destScrollObserverPaused = true
  setHorizontalScrollPosition(container.value as HTMLElement, info.position.left)
  destScrollObserverPausedTimeout = setTimeout(() => { destScrollObserverPaused = false }, 100)
}

function onDestTableScroll (info: OnScrollDetail) {
  if (destScrollObserverPaused) {
    return
  }

  if (sourceScrollObserverPausedTimeout) {
    clearTimeout(sourceScrollObserverPausedTimeout)
  }

  sourceScrollObserverPaused = true
  setHorizontalScrollPosition(document.querySelector(sourceTableScrollTarget.value) as HTMLElement, info.position.left)
  sourceScrollObserverPausedTimeout = setTimeout(() => { sourceScrollObserverPaused = false }, 100)
}
</script>

<template>
  <q-resize-observer @resize="onResize" />
  <q-scroll-observer
    axis="vertical"
    @scroll="onDocumentScroll"
  />
  <q-scroll-observer
    v-if="sourceTableScrollObserverEnabled"
    axis="horizontal"
    :scroll-target="sourceTableScrollTarget"
    @scroll="onSourceTableScroll"
  />
  <q-scroll-observer
    v-if="container"
    axis="horizontal"
    :scroll-target="container"
    @scroll="onDestTableScroll"
  />

  <fade-transition>
    <div
      v-show="containerVisible"
      ref="container"
      class="scroll container"
      :style="{ top: containerTop }"
    >
      <div>
        <table
          class="q-table"
          :style="{ width: headersWidth,
                    'max-width': headersWidth,
                    'padding-left': headersPadding,
                    'padding-right': headersPadding }"
        >
          <thead>
            <tr />
          </thead>
        </table>
      </div>
    </div>
  </fade-transition>
</template>

<style scoped lang="scss">
.container {
  position: fixed;
  z-index: 1;
  background: white;
  width: 100%;
  left: 0px;
  padding-top: 1px;
  padding-bottom: 1px;

  :deep() th {
    color: $grey;
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
.container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.container {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>

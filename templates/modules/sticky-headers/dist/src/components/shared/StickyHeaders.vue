<script setup lang="ts">
import type { QScrollObserverProps } from 'quasar';

import { computed, nextTick, ref, useTemplateRef } from 'vue';

import { scroll } from 'quasar';

import { useStickyHeadersResult } from 'composables/useStickyHeaders';

type OnScrollDetail = Parameters<Exclude<QScrollObserverProps['onScroll'], undefined>>[0];

// Private

let sourceScrollObserverPaused = false;
let destScrollObserverPaused = false;
let sourceScrollObserverPausedTimeout: ReturnType<typeof setTimeout> | null = null;
let destScrollObserverPausedTimeout: ReturnType<typeof setTimeout> | null = null;

const getSourceTable = () => document.querySelector(`${sourceTableScrollTarget.value}>table`);

// Props

const { target, markupTable, dense, separated } = defineProps<{
  target: string;
  markupTable?: boolean | undefined;
  dense?: boolean | undefined;
  separated?: boolean | undefined;
}>();

// Composables

const { getHorizontalScrollPosition, setHorizontalScrollPosition } = scroll;

const { stickyHeadersPosition } = useStickyHeadersResult();

// Data

const container = useTemplateRef('container');
const containerVisible = ref(false);
const containerTop = ref('0px');
const headersPaddingLeft = ref('0px');
const headersPaddingRight = ref('0px');
const headersWidth = ref('100%');

const sourceTableScrollObserverEnabled = ref(false);

// Computed

const sourceTableScrollTarget = computed(() =>
  markupTable ? target : `${target}>.q-table__middle.scroll`,
);

// Methods

function onResize() {
  const source = getSourceTable();
  const sourceScroll = document.querySelector(sourceTableScrollTarget.value);

  if (!source || !sourceScroll) {
    return;
  }

  // Update headers size

  const scrollLeft = sourceScroll.scrollLeft;
  sourceScroll.scrollTo({ left: 0 });
  const paddingLeft = source.getBoundingClientRect().left;
  sourceScroll.scrollTo({ left: 1000000 });
  const paddingRight = window.innerWidth - source.getBoundingClientRect().right;
  sourceScroll.scrollTo({ left: scrollLeft });

  headersPaddingLeft.value = `${paddingLeft}px`;
  headersPaddingRight.value = `${paddingRight}px`;
  headersWidth.value = `${source.getBoundingClientRect().width + paddingLeft + paddingRight}px`;

  // Update headers content

  const sourceTr = source.querySelector(':scope>thead>tr') as HTMLElement;
  const destTr = (container.value as HTMLElement).querySelector(
    ':scope>div>table>thead>tr',
  ) as HTMLElement;

  destTr.innerHTML = sourceTr.innerHTML;

  function forEachHeader(callback: (sourceTh: HTMLElement, desetTh: HTMLElement) => void) {
    let textNodeCount = 0;
    sourceTr.childNodes.forEach((value, index) => {
      const sourceTh = value as HTMLElement;

      // Text node will be generated when using <template v-if></template> to wrap headers
      if (sourceTh.nodeName === '#comment' || sourceTh.nodeName === '#text') {
        if (sourceTh.nodeName === '#text') {
          textNodeCount++;
        }

        return;
      }

      const destTh = destTr.childNodes.item(index - textNodeCount) as HTMLElement;

      callback(sourceTh, destTh);
    });
  }

  function updateClassnames() {
    forEachHeader((sourceTh, destTh) => {
      destTh.className = sourceTh.className;
    });
  }

  forEachHeader((sourceTh, destTh) => {
    destTh.style.width = `${sourceTh.getBoundingClientRect().width}px`;
    sourceTh.onclick = () => {
      updateClassnames();
    };
    destTh.onclick = () => {
      sourceTh.click();
      void nextTick(() => {
        updateClassnames();
      });
    };
  });
}

function onDocumentScroll() {
  const source = getSourceTable();

  sourceTableScrollObserverEnabled.value = !!source;

  if (!source) {
    return;
  }

  const {
    top: sourceTop,
    bottom: sourceBottom,
    height: sourceHeight,
  } = source.getBoundingClientRect();
  const sourceTr = source.querySelector(':scope>thead>tr') as HTMLElement;

  containerTop.value = `${stickyHeadersPosition.value}px`;
  containerVisible.value =
    sourceHeight > 0 &&
    sourceTop <= stickyHeadersPosition.value &&
    sourceBottom >= stickyHeadersPosition.value + sourceTr.getBoundingClientRect().height * 2;

  const left = getHorizontalScrollPosition(
    document.querySelector(sourceTableScrollTarget.value) as HTMLElement,
  );
  setHorizontalScrollPosition(container.value as HTMLElement, left);
}

function onSourceTableScroll(info: OnScrollDetail) {
  if (sourceScrollObserverPaused) {
    return;
  }

  if (destScrollObserverPausedTimeout) {
    clearTimeout(destScrollObserverPausedTimeout);
  }

  destScrollObserverPaused = true;
  setHorizontalScrollPosition(container.value as HTMLElement, info.position.left);
  destScrollObserverPausedTimeout = setTimeout(() => {
    destScrollObserverPaused = false;
  }, 100);
}

function onDestTableScroll(info: OnScrollDetail) {
  if (destScrollObserverPaused) {
    return;
  }

  if (sourceScrollObserverPausedTimeout) {
    clearTimeout(sourceScrollObserverPausedTimeout);
  }

  sourceScrollObserverPaused = true;
  setHorizontalScrollPosition(
    document.querySelector(sourceTableScrollTarget.value) as HTMLElement,
    info.position.left,
  );
  sourceScrollObserverPausedTimeout = setTimeout(() => {
    sourceScrollObserverPaused = false;
  }, 100);
}

function update() {
  onResize();
}

defineExpose({
  update,
});
</script>

<template>
  <q-resize-observer @resize="onResize" />
  <q-scroll-observer axis="vertical" @scroll="onDocumentScroll" />
  <q-scroll-observer
    v-if="sourceTableScrollObserverEnabled"
    axis="horizontal"
    :scroll-target="sourceTableScrollTarget"
    @scroll="onSourceTableScroll"
  />
  <q-scroll-observer
    v-if="container"
    axis="horizontal"
    :scroll-target="container || undefined"
    @scroll="onDestTableScroll"
  />

  <fade-transition>
    <div
      v-show="containerVisible"
      ref="container"
      class="scroll container"
      :class="{ 'q-table--dense': dense }"
      :style="{ top: containerTop }"
    >
      <div>
        <table
          class="q-table"
          :class="{ 'q-table--vertical-separator': separated }"
          :style="{
            width: headersWidth,
            'max-width': headersWidth,
            'padding-left': headersPaddingLeft,
            'padding-right': headersPaddingRight,
          }"
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
  z-index: 2;
  width: 100%;
  left: 0px;
  padding-top: 1px;
  padding-bottom: 1px;
}

.body--light .container {
  background: white;

  :deep() th {
    color: $grey;
  }
}

.body--dark .container {
  background: $grey-9;

  :deep() th {
    color: white;
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
.container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.q-table--vertical-separator :deep() th {
  border-bottom-width: 0px !important;
}
</style>

<script lang="ts">
export default {}

import useMultiViews from 'composables/useMultiViews'
import useListPage from 'composables/crud-pages/useListPage'
import FloatToolbar from 'components/shared/FloatToolbar.vue'
import StickyHeaders from 'components/shared/StickyHeaders.vue'
import SwitchViewButton from 'components/shared/SwitchViewButton.vue'
// Main
import { useSlots, ref, computed, watchEffect, nextTick } from 'vue'

type ListPageType = ReturnType<typeof useListPage>

function useTableView (scopeName: string) {
  // Slots

  const slots = useSlots()

  // Composables

  const {
    columns,
    pagination
  } = useListPage(scopeName)

  // Computed

  const scopedSlotNames = computed(() => {
    const names = []

    for (const name in slots) {
      name.startsWith('body-cell-') && names.push(name)
    }

    return names as `body-cell-${string}`[]
  })

  return {
    columns,
    pagination,
    scopedSlotNames
  }
}

function usePageData (
  scopeName: string,
  emit: (e: 'loadNextPage', index: number, done: (stop: boolean) => void) => void
) {
  // Composables

  const {
    items,
    allItemsLoaded,
    itemCountLabel
  } = useListPage(scopeName)

  // Methods

  function onLoadNextPage (index: number, done: (stop: boolean) => void) {
    emit(
      'loadNextPage',
      index,
      stop => {
        done(stop)
        allItemsLoaded.value = stop
      })
  }

  return {
    items,
    allItemsLoaded,
    itemCountLabel,
    onLoadNextPage
  }
}

function useNavigateToViewPage (scopeName: string) {
  // Composables

  const {
    itemLink,
    onItemClick
  } = useListPage(scopeName)

  // Methods

  function onRowClick (evt: Event, row: unknown) {
    if ((evt.target as Element).localName === 'td') {
      onItemClick(evt as MouseEvent, row)
    }
  }

  return {
    itemLink,
    onRowClick
  }
}

function usePageMultiViews (columns: ListPageType['columns']) {
  // Slots

  const slots = useSlots()

  // Composables

  const {
    isTableView,
    isCardsView
  } = useMultiViews()

  // Computed

  const hasTableView = computed(() => !!columns.value)
  const hasCardsView = computed(() => !!slots['item-card'])
  const hasMultiViews = computed(() => hasTableView.value && hasCardsView.value)

  return {
    isTableView,
    isCardsView,
    hasTableView,
    hasCardsView,
    hasMultiViews
  }
}

function useSmoothHideInfiniteScrollLoading (allItemsLoaded: ReturnType<typeof useListPage>['allItemsLoaded']) {
  // Data

  const hideInfiniteScrollLoading = ref(false)

  // Watch

  watchEffect(() => {
    if (allItemsLoaded.value) {
      void nextTick(() => { hideInfiniteScrollLoading.value = true })
    } else {
      hideInfiniteScrollLoading.value = false
    }
  })

  return {
    hideInfiniteScrollLoading
  }
}
</script>

<script setup lang="ts">
// Props

const props = defineProps<{ scopeName: string }>()

// Emit

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'loadNextPage', index: number, done: (stop: boolean) => void): void
}>()

// Composables

const {
  // usePageStatus
  ready,
  // useNavigateToNewPage
  newUrl,
  newButton
} = useListPage(props.scopeName)

const {
  columns,
  pagination,
  scopedSlotNames
} = useTableView(props.scopeName)

const {
  items,
  allItemsLoaded,
  itemCountLabel,
  onLoadNextPage
} = usePageData(props.scopeName, emit)

const {
  itemLink,
  onRowClick
} = useNavigateToViewPage(props.scopeName)

const {
  isTableView,
  isCardsView,
  hasTableView,
  hasCardsView,
  hasMultiViews
} = usePageMultiViews(columns)

const {
  hideInfiniteScrollLoading
} = useSmoothHideInfiniteScrollLoading(allItemsLoaded)
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
        v-else-if="!items || items.length === 0"
        key="empty"
      >
        <!-- Empty -->
        <div>
          <slot name="top" />
        </div>
        <div class="q-my-md text-center">
          There is no data in this list.
        </div>
      </div>

      <div
        v-else
        key="ready"
      >
        <!-- Ready -->
        <sticky-headers
          v-if="hasTableView && (isTableView || !hasCardsView)"
          target="#mainTable"
        />

        <q-infinite-scroll
          ref="ifiniteScroll"
          :offset="250"
          @load="onLoadNextPage"
        >
          <fade-transition>
            <q-table
              v-if="hasTableView && (isTableView || !hasCardsView)"
              id="mainTable"
              key="tableView"
              v-model:pagination="pagination"
              :columns="columns || undefined"
              :rows="items"
              @row-click="onRowClick"
            >
              <template
                v-if="$slots.top"
                #top
              >
                <slot name="top" />
              </template>

              <template
                v-for="slotName in scopedSlotNames"
                #[slotName]="slotProps"
              >
                <slot
                  :name="slotName"
                  :props="slotProps"
                />
              </template>

              <template #bottom>
                <div class="text-center full-width">
                  {{ itemCountLabel }}
                </div>
              </template>
            </q-table>

            <div
              v-else-if="hasCardsView && (isCardsView || !hasTableView)"
              key="cardsView"
            >
              <div class="row items-start justify-evenly q-gutter-md">
                <div>
                  <slot name="top" />
                </div>

                <div class="flex-break q-mt-none" />

                <slot
                  v-for="item in items"
                  :link="itemLink(item)"
                  :model="item"
                  name="item-card"
                />
              </div>

              <div
                class="text-center q-mt-lg"
                :class="{ 'q-mb-md': allItemsLoaded }"
              >
                {{ itemCountLabel }}
              </div>
            </div>
          </fade-transition>

          <!-- Smoothly hide loading template -->
          <q-slide-transition v-if="allItemsLoaded">
            <div
              v-show="!hideInfiniteScrollLoading"
              style="height: 72px"
            />
          </q-slide-transition>

          <template #loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </fade-transition>

    <float-toolbar
      v-if="$slots['toolbar-extra']"
      :fab-buttons-space-ignored="1"
    >
      <template
        v-if="newButton"
        #fixed-buttons
      >
        <q-btn
          key="add"
          color="grey-3"
          icon="fal fa-plus"
          round
          text-color="primary"
          :to="newUrl"
        >
          <top-tooltip>
            Add
          </top-tooltip>
        </q-btn>
      </template>

      <transition-group
        key="extra"
        class="no-wrap row reverse"
        name="float-toolbar-transition"
        :style="{ 'margin-right': `${newButton ? 59 : 0}px` }"
        tag="div"
      >
        <switch-view-button
          v-if="hasMultiViews"
          key="switchView"
        />

        <slot name="toolbar-extra" />
      </transition-group>
    </float-toolbar>

    <float-toolbar v-else-if="newButton || hasMultiViews">
      <template #fixed-buttons>
        <q-btn
          v-if="newButton"
          key="add"
          color="grey-3"
          icon="fal fa-plus"
          round
          text-color="primary"
          :to="newUrl"
        >
          <top-tooltip>
            Add
          </top-tooltip>
        </q-btn>

        <div
          v-if="hasMultiViews"
          key="extra"
          class="no-wrap row reverse"
          :style="{ 'margin-right': `${newButton ? 7 : 0}px` }"
        >
          <switch-view-button />
        </div>
      </template>
    </float-toolbar>
  </div>
</template>

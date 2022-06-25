<script lang="ts">
export default {};

import { computed, nextTick, ref, useSlots, watchEffect } from 'vue';

import { Dark } from 'quasar';

import useListPage from 'composables/crud-pages/useListPage';
import useMultiViews from 'composables/useMultiViews';

import FloatToolbar from 'components/shared/FloatToolbar.vue';
import StickyHeaders from 'components/shared/StickyHeaders.vue';
import SwitchViewButton from 'components/shared/SwitchViewButton.vue';

type ListPageType = ReturnType<typeof useListPage>;

function useTableView(scopeName: string) {
  // Slots

  const slots = useSlots();

  // Composables

  const {
    // useTableView
    wrapCells,
    columns,
    pagination,
  } = useListPage(scopeName);

  // Computed

  const headerSlotNames = computed(() => {
    const names = [];

    for (const name in slots) {
      name.startsWith('header-cell-') && names.push(name);
    }

    return names as `header-cell-${string}`[];
  });

  const bodySlotNames = computed(() => {
    const names = [];

    for (const name in slots) {
      name.startsWith('body-cell-') && names.push(name);
    }

    return names as `body-cell-${string}`[];
  });

  return {
    wrapCells,
    columns,
    pagination,
    headerSlotNames,
    bodySlotNames,
  };
}

function usePageData(
  scopeName: string,
  emit: (
    e: 'loadNextPage',
    index: number,
    done: (stop: boolean) => void
  ) => void
) {
  // Composables

  const {
    // usePageData
    items,
    allItemsLoaded,
    itemCountLabel,
  } = useListPage(scopeName);

  // Methods

  function onLoadNextPage(index: number, done: (stop: boolean) => void) {
    emit('loadNextPage', index, (stop) => {
      done(stop);
      allItemsLoaded.value = stop;
    });
  }

  return {
    items,
    allItemsLoaded,
    itemCountLabel,
    onLoadNextPage,
  };
}

function useNavigateToViewPage(scopeName: string) {
  // Composables

  const {
    // useNavigateToViewPage
    viewUrl,
    itemLink,
    onItemClick,
  } = useListPage(scopeName);

  // Computed

  const hasViewPage = computed(() => viewUrl.value !== null);

  // Methods

  function onRowClick(evt: Event, row: unknown) {
    if ((evt.target as Element).localName === 'td') {
      onItemClick(evt as MouseEvent, row, false);
    }
  }

  return {
    itemLink,
    hasViewPage,
    onRowClick,
  };
}

function usePageMultiViews(columns: ListPageType['columns']) {
  // Slots

  const slots = useSlots();

  // Composables

  const { isTableView, isCardsView } = useMultiViews();

  // Computed

  const hasTableView = computed(() => !!columns.value || !!slots['table']);
  const hasCardsView = computed(() => !!slots['item-card'] || !!slots['cards']);
  const hasMultiViews = computed(
    () => hasTableView.value && hasCardsView.value
  );

  return {
    isTableView,
    isCardsView,
    hasTableView,
    hasCardsView,
    hasMultiViews,
  };
}

function useSmoothHideInfiniteScrollLoading(
  allItemsLoaded: ReturnType<typeof useListPage>['allItemsLoaded']
) {
  // Data

  const hideInfiniteScrollLoading = ref(false);

  // Watch

  watchEffect(() => {
    if (allItemsLoaded.value) {
      void nextTick(() => {
        hideInfiniteScrollLoading.value = true;
      });
    } else {
      hideInfiniteScrollLoading.value = false;
    }
  });

  return {
    hideInfiniteScrollLoading,
  };
}
</script>

<script setup lang="ts">
// Props

const props = defineProps<{ scopeName: string }>();

// Emit

const emit = defineEmits<{
  (e: 'loadNextPage', index: number, done: (stop: boolean) => void): void;
}>();

// Composables

const {
  // usePageStatus
  ready,
  // useNavigateToNewPage
  newUrl,
  newButton,
} = useListPage(props.scopeName);

const { wrapCells, columns, pagination, headerSlotNames, bodySlotNames } =
  useTableView(props.scopeName);

const { items, allItemsLoaded, itemCountLabel, onLoadNextPage } = usePageData(
  props.scopeName,
  emit
);

const { itemLink, hasViewPage, onRowClick } = useNavigateToViewPage(
  props.scopeName
);

const { isTableView, isCardsView, hasTableView, hasCardsView, hasMultiViews } =
  usePageMultiViews(columns);

const { hideInfiniteScrollLoading } =
  useSmoothHideInfiniteScrollLoading(allItemsLoaded);
</script>

<template>
  <div>
    <fade-transition>
      <div v-if="!ready" key="loading" class="absolute-center">
        <!-- Loading -->
        <q-spinner-pie color="primary" size="6em" />
      </div>

      <div v-else-if="!items || items.length === 0" key="empty">
        <!-- Empty -->
        <div
          :class="{
            'text-center': hasCardsView && (isCardsView || !hasTableView),
          }"
        >
          <slot name="top"></slot>
        </div>
        <div class="q-my-md text-center">There is no data in this list.</div>
      </div>

      <div v-else key="ready">
        <!-- Ready -->
        <q-infinite-scroll
          ref="ifiniteScroll"
          :offset="250"
          @load="onLoadNextPage"
        >
          <fade-transition>
            <slot
              v-if="hasTableView && (isTableView || !hasCardsView)"
              name="table"
            >
              <div key="tableView">
                <sticky-headers target="#mainTable" />

                <q-table
                  id="mainTable"
                  v-model:pagination="pagination"
                  :columns="columns || undefined"
                  :rows="items"
                  :wrap-cells="wrapCells"
                  v-on="hasViewPage ? { rowClick: onRowClick } : {}"
                >
                  <template v-if="$slots.top" #top>
                    <slot name="top"></slot>
                  </template>

                  <template
                    v-for="slotName in headerSlotNames"
                    #[slotName]="slotProps"
                  >
                    <slot :name="slotName" :props="slotProps"></slot>
                  </template>

                  <template
                    v-for="slotName in bodySlotNames"
                    #[slotName]="slotProps"
                  >
                    <slot :name="slotName" :props="slotProps"></slot>
                  </template>

                  <template #bottom>
                    <div class="text-center full-width">
                      {{ itemCountLabel }}
                    </div>
                  </template>
                </q-table>
              </div>
            </slot>

            <slot
              v-else-if="hasCardsView && (isCardsView || !hasTableView)"
              name="cards"
            >
              <div key="cardsView">
                <div class="row items-start justify-evenly q-gutter-md">
                  <div>
                    <slot name="top"></slot>
                  </div>

                  <div class="flex-break q-mt-none"></div>

                  <slot
                    v-for="item in items"
                    :link="() => itemLink(item)"
                    :model="item"
                    name="item-card"
                  ></slot>
                </div>

                <div
                  class="text-center q-mt-lg"
                  :class="{ 'q-mb-md': allItemsLoaded }"
                >
                  {{ itemCountLabel }}
                </div>
              </div>
            </slot>
          </fade-transition>

          <!-- Smoothly hide loading template -->
          <q-slide-transition v-if="allItemsLoaded">
            <div v-show="!hideInfiniteScrollLoading" style="height: 72px"></div>
          </q-slide-transition>

          <template #loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </fade-transition>

    <float-toolbar
      v-if="$slots['toolbar-extra']"
      :fab-buttons-space-ignored="1"
    >
      <template v-if="newButton" #fixed-buttons>
        <q-btn
          key="add"
          :color="Dark.isActive ? 'grey-9' : 'grey-3'"
          icon="fal fa-plus"
          round
          text-color="primary"
          :to="newUrl"
        >
          <top-tooltip>Add</top-tooltip>
        </q-btn>
      </template>

      <transition-group
        key="extra"
        class="no-wrap row reverse"
        name="float-toolbar-transition"
        :style="{ 'margin-right': `${newButton ? 59 : 0}px` }"
        tag="div"
      >
        <switch-view-button v-if="hasMultiViews" key="switchView" />

        <slot name="toolbar-extra"></slot>
      </transition-group>
    </float-toolbar>

    <float-toolbar v-else-if="newButton || hasMultiViews">
      <template #fixed-buttons>
        <q-btn
          v-if="newButton"
          key="add"
          :color="Dark.isActive ? 'grey-9' : 'grey-3'"
          icon="fal fa-plus"
          round
          text-color="primary"
          :to="newUrl"
        >
          <top-tooltip>Add</top-tooltip>
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

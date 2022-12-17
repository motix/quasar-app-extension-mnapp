<script lang="ts">
export default {};

import { computed, nextTick, ref, useSlots, watchEffect } from 'vue';

import { Dark, QInfiniteScroll } from 'quasar';

import useListPage from 'composables/crud-pages/useListPage';
import useMultiViews from 'composables/useMultiViews';

import FloatToolbar from 'components/shared/FloatToolbar.vue';
import StickyHeaders from 'components/shared/StickyHeaders.vue';
import SwitchViewButton from 'components/shared/SwitchViewButton.vue';

function useTableView(scopeName: string) {
  // Slots

  const slots = useSlots();

  // Composables

  const {
    // useTableView
    wrapCells,
    columns,
    pagination,
    rows,
  } = useListPage<NonNullable<unknown>, NonNullable<unknown>>(scopeName);

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
    rows,
    headerSlotNames,
    bodySlotNames,
  };
}

function useAutoLoadAllPages() {
  // Data

  const autoLoadAllPages = ref(false);
  const hideAutoLoadAllPagesButton = ref(false);
  const infiniteScroll = ref<InstanceType<typeof QInfiniteScroll> | null>(null);

  // Methods

  function toggleAutoLoadAllPages() {
    autoLoadAllPages.value = !autoLoadAllPages.value;

    infiniteScroll.value?.trigger();
  }

  return {
    autoLoadAllPages,
    hideAutoLoadAllPagesButton,
    infiniteScroll,
    toggleAutoLoadAllPages,
  };
}

function usePageData(
  scopeName: string,
  emit: (
    e: 'loadNextPage',
    index: number,
    done: (stop: boolean) => void
  ) => void,
  autoLoadAllPages: ReturnType<typeof useAutoLoadAllPages>['autoLoadAllPages'],
  infiniteScroll: ReturnType<typeof useAutoLoadAllPages>['infiniteScroll']
) {
  // Composables

  const {
    // usePageData
    items,
    allItemsLoaded,
    itemCountLabel,
    // useClientFilter
    clientFilteredItems,
    clientFilteredItemCountLabel,
  } = useListPage<NonNullable<unknown>, NonNullable<unknown>>(scopeName);

  // Methods

  function onLoadNextPage(index: number, done: (stop: boolean) => void) {
    emit('loadNextPage', index, (stop) => {
      done(stop);
      allItemsLoaded.value = stop;

      if (stop) {
        autoLoadAllPages.value = false;
      } else if (autoLoadAllPages.value) {
        infiniteScroll.value?.trigger();
      }
    });
  }

  return {
    items,
    allItemsLoaded,
    itemCountLabel,
    clientFilteredItems,
    clientFilteredItemCountLabel,
    onLoadNextPage,
  };
}

function useNavigateToViewPage(scopeName: string) {
  // Composables

  const {
    // useTableView
    onRowClick,
    // useNavigateToViewPage
    viewUrl,
    itemLink,
    onItemClick,
  } = useListPage<NonNullable<unknown>, NonNullable<unknown>>(scopeName);

  // Computed

  const hasViewPage = computed(() => viewUrl.value !== null);

  // Methods

  function handleRowClick(evt: Event, row: NonNullable<unknown>) {
    if (onRowClick.value) {
      onRowClick.value(evt, row);
    } else if ((evt.target as Element).localName === 'td') {
      onItemClick(evt as MouseEvent, row, false);
    }
  }

  return {
    itemLink,
    hasViewPage,
    onRowClick: handleRowClick,
  };
}

function usePageMultiViews(scopeName: string) {
  // Slots

  const slots = useSlots();

  // Composables

  const { isTableView, isCardsView } = useMultiViews();

  const {
    // useTableView
    columns,
  } = useListPage<NonNullable<unknown>, NonNullable<unknown>>(scopeName);

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

function useSmoothHideInfiniteScrollLoading(scopeName: string) {
  // Composables

  const {
    // usePageData
    allItemsLoaded,
  } = useListPage<NonNullable<unknown>, NonNullable<unknown>>(scopeName);

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

// Slots

const slots = useSlots();

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
} = useListPage<NonNullable<unknown>, NonNullable<unknown>>(props.scopeName);

const { wrapCells, columns, pagination, rows, headerSlotNames, bodySlotNames } =
  useTableView(props.scopeName);

const {
  autoLoadAllPages,
  hideAutoLoadAllPagesButton,
  infiniteScroll,
  toggleAutoLoadAllPages,
} = useAutoLoadAllPages();

const {
  items,
  allItemsLoaded,
  itemCountLabel,
  clientFilteredItems,
  clientFilteredItemCountLabel,
  onLoadNextPage,
} = usePageData(props.scopeName, emit, autoLoadAllPages, infiniteScroll);

const { itemLink, hasViewPage, onRowClick } = useNavigateToViewPage(
  props.scopeName
);

const { isTableView, isCardsView, hasTableView, hasCardsView, hasMultiViews } =
  usePageMultiViews(props.scopeName);

const { hideInfiniteScrollLoading } = useSmoothHideInfiniteScrollLoading(
  props.scopeName
);

// Computed

const switchViewButtonMargin = computed(
  () =>
    `${
      slots['toolbar-extra']
        ? (newButton.value ? 52 : 0) +
          (!hideAutoLoadAllPagesButton.value ? 52 : 0) +
          (newButton.value || !hideAutoLoadAllPagesButton.value ? 7 : 0)
        : newButton.value || !hideAutoLoadAllPagesButton.value
        ? 7
        : 0
    }px`
);
</script>

<template>
  <div>
    <fade-transition>
      <div v-if="!ready" key="loading" class="absolute-center">
        <!-- Loading -->
        <q-spinner-pie color="primary" size="6em" />
      </div>

      <div
        v-else-if="!items || !clientFilteredItems || items.length === 0"
        key="empty"
      >
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
          ref="infiniteScroll"
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
                  :rows="rows || undefined"
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
                      <template
                        v-if="items.length > clientFilteredItems.length"
                      >
                        - {{ clientFilteredItemCountLabel }}
                      </template>
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
                  <div class="col-12 text-center">
                    <slot name="top"></slot>
                  </div>

                  <div class="flex-break"></div>

                  <slot
                    v-for="item in clientFilteredItems"
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
                  <template v-if="items.length > clientFilteredItems.length">
                    - {{ clientFilteredItemCountLabel }}
                  </template>
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
      <template v-if="newButton || !hideAutoLoadAllPagesButton" #fixed-buttons>
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

        <q-btn
          v-if="!hideAutoLoadAllPagesButton"
          key="autoLoadAllPages"
          :color="Dark.isActive ? 'grey-9' : 'grey-3'"
          :disable="!infiniteScroll || allItemsLoaded"
          :icon="autoLoadAllPages ? undefined : 'fas fa-ellipsis'"
          round
          text-color="primary"
          @click="toggleAutoLoadAllPages"
        >
          <q-spinner-dots v-if="autoLoadAllPages" color="primary" />
          <top-tooltip>Auto Load All Pages</top-tooltip>
        </q-btn>
      </template>

      <transition-group
        key="extra"
        class="no-wrap row reverse"
        name="float-toolbar-transition"
        :style="{ 'margin-right': switchViewButtonMargin }"
        tag="div"
      >
        <switch-view-button v-if="hasMultiViews" key="switchView" />

        <slot name="toolbar-extra"></slot>
      </transition-group>
    </float-toolbar>

    <float-toolbar
      v-else-if="newButton || hasMultiViews || !hideAutoLoadAllPagesButton"
    >
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

        <q-btn
          v-if="!hideAutoLoadAllPagesButton"
          key="autoLoadAllPages"
          :color="Dark.isActive ? 'grey-9' : 'grey-3'"
          :disable="!infiniteScroll || allItemsLoaded"
          :icon="autoLoadAllPages ? undefined : 'fas fa-ellipsis'"
          round
          text-color="primary"
          @click="toggleAutoLoadAllPages"
        >
          <q-spinner-dots v-if="autoLoadAllPages" color="primary" />
          <top-tooltip>Auto Load All Pages</top-tooltip>
        </q-btn>

        <div
          v-if="hasMultiViews"
          key="extra"
          class="no-wrap row reverse"
          :style="{
            'margin-right': switchViewButtonMargin,
          }"
        >
          <switch-view-button />
        </div>
      </template>
    </float-toolbar>
  </div>
</template>

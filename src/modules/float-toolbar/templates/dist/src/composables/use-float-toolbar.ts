import { computed, ref, provide, inject, Ref } from 'vue'

const FloatToolbarResultSymbol = Symbol('floatToolbarPosition')

export interface FloatToolbarResult {
  readonly fixedHeaderHeight: Readonly<Ref<number>>;
  readonly collapseHeaderHeight: Readonly<Ref<number>>;
  readonly headerHeight: Readonly<Ref<number>>;
  readonly headerElevated: Readonly<Ref<boolean>>;
  readonly floatToolbarPosition: Readonly<Ref<number>>;
}

export default function (fixedHeaderHeight: number, collapseHeaderHeight: number) {
  const readOnlyFixedHeaderHeight = computed(() => fixedHeaderHeight)
  const readOnlyCollapseHeaderHeight = computed(() => collapseHeaderHeight)
  const headerHeight = computed(() => fixedHeaderHeight + collapseHeaderHeight)
  const scrollPosition = ref(0)
  const headerElevated = computed(() => scrollPosition.value >= collapseHeaderHeight)
  const floatToolbarPosition = computed(() => Math.max(collapseHeaderHeight - scrollPosition.value, 0))

  const result: FloatToolbarResult = {
    fixedHeaderHeight: readOnlyFixedHeaderHeight,
    collapseHeaderHeight: readOnlyCollapseHeaderHeight,
    headerHeight,
    headerElevated,
    floatToolbarPosition
  }

  provide(FloatToolbarResultSymbol, result)

  function onScroll (details: { position: number }) {
    scrollPosition.value = details.position
  }

  return {
    ...result,
    onScroll
  }
}

export function useFloatToolbarResult () {
  const floatToolbarResult = inject<FloatToolbarResult>(FloatToolbarResultSymbol)

  if (!floatToolbarResult) {
    throw new Error('No float toolbar result provided.')
  }

  return floatToolbarResult
}

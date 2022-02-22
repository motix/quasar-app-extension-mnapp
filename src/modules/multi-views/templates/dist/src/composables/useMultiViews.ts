import { Platform } from 'quasar'
import useScroll from 'composables/useScroll'
// Main
import { computed, reactive } from 'vue'

const data = reactive({
  viewType: Platform.is.desktop ? 'table' : 'cards'
})

export default function () {
  // Computed

  const isTableView = computed(() => data.viewType === 'table')
  const isCardsView = computed(() => data.viewType === 'cards')

  // Methods

  function switchView () {
    switch (data.viewType) {
    case 'table':
      data.viewType = 'cards'
      break
    case 'cards':
      data.viewType = 'table'
      break
    default:
      throw new Error(`viewType '${data.viewType}' not implemented`)
    }
  }

  function switchViewAndScroll () {
    const scroll = useScroll()

    switchView()
    scroll.toTop()
  }

  return {
    isTableView,
    isCardsView,
    switchView,
    switchViewAndScroll
  }
}

import { requiredConfigEntries } from 'composables/useConfig'
import { ref, readonly } from 'vue'

export default function useCardsView () {
  // Composables

  const listItemCardWidth = readonly(ref(requiredConfigEntries('listItemCardWidth').listItemCardWidth))

  return {
    listItemCardWidth
  }
}

import { requiredConfigEntries } from 'services/useConfig'
// Main
import { ref, readonly } from 'vue'

export default function useCardsView () {
  // Data

  const listItemCardWidth = readonly(ref(requiredConfigEntries('listItemCardWidth').listItemCardWidth))

  return {
    listItemCardWidth
  }
}

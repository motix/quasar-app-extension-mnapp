// Main
import { ref, Ref } from 'vue'
// Types
import type { CreateDocActionPayload } from 'services/firebase-firestore'

export default function usePageData<TVm = unknown> () {
  // Data

  const viewModel = ref(null) as Ref<TVm | null>

  // Method Refs

  const createModel = ref<((payload: CreateDocActionPayload<TVm>) => Promise<TVm>) | null>(null)

  return {
    viewModel,
    createModel
  }
}

export class UsePageDataHelper<TVm = unknown> {
  Return = usePageData<TVm>()
}

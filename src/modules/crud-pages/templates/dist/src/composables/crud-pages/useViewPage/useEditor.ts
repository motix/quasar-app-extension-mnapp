import { Dialog } from 'quasar'
import { useForm } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import useNotifications from 'composables/useNotifications'
import useScroll from 'composables/useScroll'

// Main
import { ref } from 'vue'
// Types
import type { UpdateDocActionPayload } from 'services/firebase-firestore'
import type usePageStatus from './usePageStatus'
import type usePageData from './usePageData'
import type { UsePageDataHelper } from './usePageData'

export default function useEditor<TVm = unknown> (
  freezed: ReturnType<typeof usePageStatus>['freezed'],
  muteNextRealtimeUpdate: ReturnType<typeof usePageStatus>['muteNextRealtimeUpdate'],
  editMode: ReturnType<typeof usePageStatus>['editMode'],
  isDirty: ReturnType<typeof usePageStatus>['isDirty'],
  findKey: ReturnType<typeof usePageData>['findKey'],
  modelFindKeyField: UsePageDataHelper<never, TVm>['Return']['modelFindKeyField'],
  docKey: ReturnType<typeof usePageData>['docKey'],
  viewModel: UsePageDataHelper<never, TVm>['Return']['viewModel'],
  updateModel: UsePageDataHelper<never, TVm>['Return']['updateModel'],
  getModelAndViewModel: ReturnType<typeof usePageData>['getModelAndViewModel']
) {
  // Private

  class UseFormHelper<K extends keyof TVm> {
    Return = useForm<Pick<TVm, K>>()
  }
  type UseFormResult<K extends keyof TVm> = UseFormHelper<K>['Return']

  let internalValidate: UseFormResult<never>['validate'] | null = null
  let internalCustomValidate: (() => Promise<boolean>) | null = null

  async function validate () {
    let isValid = true

    if (internalValidate) {
      const validation = await internalValidate()
      isValid &&= validation.valid
    }

    if (internalCustomValidate) {
      isValid &&= await internalCustomValidate()
    }

    return isValid
  }

  // Composables

  const router = useRouter()
  const route = useRoute()

  const {
    notifyErrorDebug,
    notifyValidationError,
    notifySaveDataSuccess,
    notifySaveDataError
  } = useNotifications()

  const {
    toTop: scrollToTop
  } = useScroll()

  // Data

  const editorSaving = ref(false)

  // Methods

  function useValidation<K extends keyof TVm> (
    callUseForm: (initialValues?: Pick<TVm, K>) => UseFormResult<K>,
    ...initialValuesKeys: (K)[]
  ) {
    const viewModelValue = viewModel.value
    const initialValues = viewModelValue
      ? Object.fromEntries(initialValuesKeys.map(key => [key, viewModelValue[key]])) as Pick<TVm, K>
      : undefined

    const result = callUseForm(initialValues)

    internalValidate = result.validate
  }

  function useCustomValidation (customValidate: typeof internalCustomValidate) {
    internalCustomValidate = customValidate
  }

  function edit () {
    editMode.value = true
    scrollToTop()
  }

  function exitEditMode () {
    isDirty.value = false
    editMode.value = false
    scrollToTop()
  }

  async function editorSave () {
    docKey.value === null && (() => { throw new Error('docKey not specified') })()
    viewModel.value === null && (() => { throw new Error('viewModel not specified') })()
    updateModel.value === null && (() => { throw new Error('updateModel not specified') })()

    freezed.value = true
    muteNextRealtimeUpdate.value = true
    editorSaving.value = true

    const isValid = await validate()

    if (!isValid) {
      notifyValidationError()

      editorSaving.value = false
      muteNextRealtimeUpdate.value = false
      freezed.value = false
      return
    }

    const payload: UpdateDocActionPayload<TVm> = {
      docKey: docKey.value,
      doc: viewModel.value,
      isViewModel: true
    }

    try {
      await updateModel.value(payload)
    } catch (error) {
      console.error(error)
      notifySaveDataError()
      notifyErrorDebug(error)

      editorSaving.value = false
      muteNextRealtimeUpdate.value = false
      freezed.value = false
      return
    }

    notifySaveDataSuccess()

    editorSaving.value = false
    muteNextRealtimeUpdate.value = false
    freezed.value = false

    const newFindKey = String(viewModel.value[modelFindKeyField.value])

    if (newFindKey !== findKey.value) {
      let path = route.fullPath

      path = path.substring(0, path.length - findKey.value.length + 1)
      findKey.value = newFindKey
      path += findKey.value
      void router.replace(path)
    }

    exitEditMode()
  }

  function revert () {
    if (isDirty.value) {
      Dialog.create({
        title: 'Revert',
        message: 'Are you sure want to discard all changes?',
        cancel: true,
        persistent: true
      })
        .onOk(() => {
          exitEditMode()
          getModelAndViewModel()
        })
    } else {
      exitEditMode()
    }
  }

  return {
    editorSaving,
    useValidation,
    useCustomValidation,
    edit,
    exitEditMode,
    editorSave,
    revert
  }
}

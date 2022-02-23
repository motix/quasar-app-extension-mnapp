import _ from 'lodash'
import { Dialog } from 'quasar'
import { useForm } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import useNotifications from 'composables/useNotifications'
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
  findKey: ReturnType<typeof usePageData>['findKey'],
  modelFindKeyField: UsePageDataHelper<never, TVm>['Return']['modelFindKeyField'],
  docKey: ReturnType<typeof usePageData>['docKey'],
  viewModel: UsePageDataHelper<never, TVm>['Return']['viewModel'],
  updateModel: UsePageDataHelper<never, TVm>['Return']['updateModel'],
  getModelAndViewModel: ReturnType<typeof usePageData>['getModelAndViewModel']
) {
  // Private

  const router = useRouter()
  const route = useRoute()

  const {
    notifyErrorDebug,
    notifyValidationError,
    notifySaveDataSuccess,
    notifySaveDataError
  } = useNotifications()

  class UseFormHelper {
    Return = useForm<Partial<TVm>>()
  }
  type UseFormResult = UseFormHelper['Return']

  let internalValidate: UseFormResult['validate'] | null = null

  async function validate () {
    !internalValidate && (() => { throw new Error('internalValidate not specified') })()

    const validation = await internalValidate()
    return validation.valid
  }

  // Data

  const hasEditor = ref(true)
  const isDirty = ref(false)
  const editorSaving = ref(false)

  // Methods

  function useValidation (
    callUseForm: (initialValues?: Partial<TVm>) => UseFormResult,
    ...initialValuesExclude: (keyof TVm)[]
  ) {
    const viewModelValue = viewModel.value
    const initialValues = viewModelValue
      ? Object.fromEntries(
        _.difference(Object.keys(viewModelValue) as (keyof TVm)[], initialValuesExclude)
          .map(key => [key, viewModelValue[key]])
      ) as Partial<TVm>
      : undefined

    const result = callUseForm(initialValues)

    internalValidate = result.validate
  }

  function edit () {
    editMode.value = true
  }

  function exitEditMode () {
    isDirty.value = false
    editMode.value = false
  }

  function dirty () {
    isDirty.value = true
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
      doc: viewModel.value
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

      path = path.substr(0, path.length - findKey.value.length)
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
    hasEditor,
    modelFindKeyField,
    isDirty,
    editorSaving,
    useValidation,
    edit,
    exitEditMode,
    dirty,
    editorSave,
    revert
  }
}
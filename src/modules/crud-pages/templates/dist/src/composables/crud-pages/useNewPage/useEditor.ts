import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import useNotifications from 'composables/useNotifications'
// Main
import { ref, Ref } from 'vue'
// Types
import type { CreateDocActionPayload } from 'services/firebase-firestore'
import type usePageStatus from './usePageStatus'
import type { UsePageDataHelper } from './usePageData'

export default function useEditor<TVm = unknown> (
  freezed: ReturnType<typeof usePageStatus>['freezed'],
  viewModel: UsePageDataHelper<TVm>['Return']['viewModel'],
  createModel: UsePageDataHelper<TVm>['Return']['createModel']
) {
  // Private

  const router = useRouter()

  const {
    notifyErrorDebug,
    notifyValidationError,
    notifyCreateDataSuccessAndRedirect,
    notifyCreateDataError
  } = useNotifications()

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

  // Data

  const viewUrl = ref<string | null>(null)
  const modelFindKeyField = ref<keyof TVm>('id' as keyof TVm) as Ref<keyof TVm>
  const editorSaving = ref(false)
  const initiallyFilled = ref(false)

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

  async function editorSave () {
    viewModel.value === null && (() => { throw new Error('viewModel not specified') })()
    createModel.value === null && (() => { throw new Error('createModel not specified') })()
    viewUrl.value === null && (() => { throw new Error('viewUrl not specified') })()

    freezed.value = true
    editorSaving.value = true

    const isValid = await validate()

    if (!isValid) {
      notifyValidationError()

      editorSaving.value = false
      freezed.value = false
      return
    }

    const payload: CreateDocActionPayload<TVm> = {
      doc: viewModel.value
    }

    let newModel: TVm
    try {
      newModel = await createModel.value(payload)
    } catch (error) {
      console.error(error)
      notifyCreateDataError()
      notifyErrorDebug(error)

      editorSaving.value = false
      freezed.value = false
      return
    }

    notifyCreateDataSuccessAndRedirect()

    editorSaving.value = false

    const newFindKey = String(newModel[modelFindKeyField.value])
    void router.push(viewUrl.value + newFindKey)
  }

  return {
    viewUrl,
    modelFindKeyField,
    editorSaving,
    initiallyFilled,
    useValidation,
    useCustomValidation,
    editorSave
  }
}

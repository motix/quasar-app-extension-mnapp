import _ from 'lodash'
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

  const viewUrl = ref<string | null>(null)
  const modelFindKeyField = ref<keyof TVm>('id' as keyof TVm) as Ref<keyof TVm>
  const isDirty = ref(false)
  const saving = ref(false)
  const initiallyFilled = ref(false)

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

  function dirty () {
    isDirty.value = true
  }

  async function save () {
    viewModel.value === null && (() => { throw new Error('viewModel not specified') })()
    createModel.value === null && (() => { throw new Error('createModel not specified') })()
    viewUrl.value === null && (() => { throw new Error('viewUrl not specified') })()

    freezed.value = true
    saving.value = true

    const isValid = await validate()

    if (!isValid) {
      notifyValidationError()

      saving.value = false
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

      saving.value = false
      freezed.value = false
      return
    }

    notifyCreateDataSuccessAndRedirect()

    saving.value = false

    const newFindKey = String(newModel[modelFindKeyField.value])
    void router.push(viewUrl.value + newFindKey)
  }

  return {
    viewUrl,
    modelFindKeyField,
    isDirty,
    saving,
    initiallyFilled,
    useValidation,
    dirty,
    save
  }
}

import { Dialog } from 'quasar'
import { useRouter } from 'vue-router'
import useReturnUrl from 'composables/useReturnUrl'
// Types
import type usePageStatus from './usePageStatus'

export default function navigateToListPage (
  isDirty: ReturnType<typeof usePageStatus>['isDirty']
) {
  // Private

  const router = useRouter()

  // Composables

  const {
    returnUrl,
    defaultReturnUrl: backUrl
  } = useReturnUrl()

  // Methods

  function confirmAndGoBack () {
    if (isDirty.value) {
      Dialog.create({
        title: 'Leave',
        message: 'Are you sure want to discard all changes?',
        cancel: true,
        persistent: true
      })
        .onOk(() => {
          void router.push(returnUrl.value)
        })
    } else {
      void router.push(returnUrl.value)
    }
  }

  return {
    backUrl,
    confirmAndGoBack
  }
}

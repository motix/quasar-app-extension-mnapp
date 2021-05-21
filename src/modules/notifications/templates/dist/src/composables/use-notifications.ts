import { Notify } from 'quasar'

export default function () {
  function notifyLoadDataError () {
    Notify.create({
      message: 'Load data error. Refresh the page to try again or contact support.',
      color: 'negative'
    })
  }

  function notifyValidationError () {
    Notify.create({
      message: 'Invalid data input. Please revise marked fields.',
      color: 'negative'
    })
  }

  function notifyCreateDataSuccessAndRedirect () {
    Notify.create({
      message: 'Data created successfully. Redirecting to details page.',
      color: 'positive'
    })
  }

  function notifyCreateDataError () {
    Notify.create({
      message: 'Create data error. Refresh the page to try again or contact support.',
      color: 'negative'
    })
  }

  function notifySaveDataSuccess () {
    Notify.create({
      message: 'Data saved successfully.',
      color: 'positive'
    })
  }

  function notifySaveDataError () {
    Notify.create({
      message: 'Save data error. Refresh the page to try again or contact support.',
      color: 'negative'
    })
  }

  function notifyDeleteDataSuccessAndRedirect () {
    Notify.create({
      message: 'Data deleted successfully. Redirecting to list page.',
      color: 'positive'
    })
  }

  function notifyDeleteDataError () {
    Notify.create({
      message: 'Delete data error. Refresh the page to try again or contact support.',
      color: 'negative'
    })
  }

  return {
    notifyLoadDataError,
    notifyValidationError,
    notifyCreateDataSuccessAndRedirect,
    notifyCreateDataError,
    notifySaveDataSuccess,
    notifySaveDataError,
    notifyDeleteDataSuccessAndRedirect,
    notifyDeleteDataError
  }
}

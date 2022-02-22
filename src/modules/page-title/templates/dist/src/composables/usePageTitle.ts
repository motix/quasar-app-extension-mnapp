import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'
import { requiredConfigEntries } from 'services/useConfig'
// Main
import { ref, computed, readonly, watch } from 'vue'

export default function () {
  // Private

  const route = useRoute()

  const metaData = computed(() => {
    let title = pageTitle.value || appName.value

    if (title.indexOf('\\') > -1) {
      title = title.substring(title.lastIndexOf('\\') + 1).trim()
    }

    title = title === appName.value ? title : `${title} - ${appName.value}`

    return {
      title
    }
  })

  // Data

  const appName = readonly(ref(requiredConfigEntries('appName').appName))
  const pageTitle = ref(route.meta.pageTitle)

  // Private Executions

  useMeta(() => metaData.value)

  // Watch

  watch(() => route.meta, newValue => {
    pageTitle.value = newValue.pageTitle
  })

  return {
    appName,
    pageTitle
  }
}

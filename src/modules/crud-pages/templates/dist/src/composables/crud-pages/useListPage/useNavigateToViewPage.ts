import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { UsePageDataHelper } from './usePageData';

export default function useNavigateToViewPage<T = unknown>(
  modelFindKeyField: UsePageDataHelper<T>['Return']['modelFindKeyField']
) {
  // Composables

  const router = useRouter();

  // Data

  const viewUrl = ref<string | null>(null);

  // Methods

  function itemLink(item: T) {
    viewUrl.value === null &&
      (() => {
        throw new Error('viewUrl not specified');
      })();

    const keyValue = item[modelFindKeyField.value];
    const routeLocation = router.resolve(
      viewUrl.value + String(keyValue).replaceAll('.', '_')
    );

    return routeLocation.href;
  }

  function onItemClick(event: MouseEvent, item: T) {
    viewUrl.value === null &&
      (() => {
        throw new Error('viewUrl not specified');
      })();

    const keyValue = item[modelFindKeyField.value];

    if (event.ctrlKey || event.metaKey) {
      window.open(itemLink(item), '_blank');
    } else if (!event.altKey) {
      void router.push(viewUrl.value + String(keyValue).replaceAll('.', '_'));
    }
  }

  return {
    viewUrl,
    itemLink,
    onItemClick,
  };
}

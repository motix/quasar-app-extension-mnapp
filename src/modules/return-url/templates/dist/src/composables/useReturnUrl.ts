import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default function () {
  // Composables

  const router = useRouter();
  const { meta } = useRoute();

  // Data

  const defaultReturnUrl = ref('');

  // Computed

  const returnUrl = computed(
    () => (meta.history && meta.history[0]) || defaultReturnUrl.value,
  );

  // Methods

  const goBack = () => {
    onGoBack();
    void router.push(returnUrl.value);
  };

  const onGoBack = () => {
    meta.goingBack = true;
  };

  return {
    defaultReturnUrl,
    returnUrl,
    goBack,
    onGoBack,
  };
}

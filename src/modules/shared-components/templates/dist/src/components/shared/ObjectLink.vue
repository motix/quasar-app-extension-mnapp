<script setup lang="ts">
// Props

withDefaults(
  defineProps<{
    label: string;
    // eslint-disable-next-line vue/require-default-prop
    icon?: string;
    wrapLabel?: boolean;
    maxWidth?: string;
  }>(),
  {
    wrapLabel: false,
    maxWidth: '100%',
  }
);
</script>

<template>
  <q-btn
    class="q-pa-none"
    flat
    no-caps
    style="min-height: 0"
    :style="{ 'max-width': maxWidth }"
  >
    <div :class="{ 'text-left': !!icon || $slots.icon, ellipsis: !wrapLabel }">
      <slot name="icon">
        <q-icon v-if="icon" class="q-mr-sm" :name="icon" size="1.2em" />
      </slot>

      <span>
        {{ label }}
      </span>
    </div>
  </q-btn>
</template>

<style lang="scss" scoped>
.q-btn {
  line-height: $body-line-height;
}
</style>

<script setup lang="ts">
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
        <q-icon v-if="icon" class="q-mr-sm" :name="icon" size="xs" />
      </slot>

      <span>
        {{ label }}
        <top-tooltip>
          {{ label }}
        </top-tooltip>
      </span>
    </div>
  </q-btn>
</template>

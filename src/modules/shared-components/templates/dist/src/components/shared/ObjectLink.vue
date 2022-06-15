<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    // eslint-disable-next-line vue/require-default-prop
    icon?: string;
    wrapLabel?: boolean;
  }>(),
  {
    wrapLabel: false,
  }
);
</script>

<template>
  <q-btn class="q-px-none" flat no-caps style="max-width: 100%">
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

<script setup lang="ts">
import type DocumentStatusBase from 'utils/DocumentStatusBase';

const { revertColor } = defineProps<{
  status: DocumentStatusBase<unknown, string, string, string>;
  icon: string;
  revertColor?: boolean | undefined;
}>();
</script>

<template>
  <q-icon :color="revertColor ? status.textColor : status.backgroundColor" :name="icon" size="xs">
    <top-tooltip>
      {{ status.text }}
    </top-tooltip>
  </q-icon>
</template>

<script setup lang="ts">
import type { Member, MemberVm } from 'models/crud-pages';

import useViewPage from 'composables/crud-pages/useViewPage';

// Props

const props = defineProps<{ scopeName: string }>();

// Composables

const {
  // Auto sort
  freezed,
  m,
} = useViewPage<Member, MemberVm>(props.scopeName);
</script>

<template>
  <expandable-card
    :avatar-icon="m.photoUrl ? undefined : 'fas fa-user-alt'"
    :avatar-image="m.photoUrl || undefined"
    :caption="m.email"
    class="q-mx-auto"
    :subtitle="m.uid"
    subtitle-tooltip="UID"
    :title="m.fullName"
  >
    <template v-if="!!m.slackId" #main>
      <div class="q-mt-sm text-caption">
        Slack ID: {{ m.slackId }}
        <top-tooltip>Slack ID</top-tooltip>
      </div>
    </template>

    <template #side>
      <q-toggle
        v-model="m.isActive"
        checked-icon="fal fa-power-off"
        class="right-toggle"
        color="primary"
        :disable="freezed"
        label="Active"
        left-label
        unchecked-icon="clear"
      />

      <q-toggle
        v-model="m.inviteToFinanceChannels"
        checked-icon="fal fa-comments"
        class="right-toggle"
        color="primary"
        :disable="freezed"
        label="Finance Channels"
        left-label
        unchecked-icon="clear"
      />
    </template>
  </expandable-card>
</template>

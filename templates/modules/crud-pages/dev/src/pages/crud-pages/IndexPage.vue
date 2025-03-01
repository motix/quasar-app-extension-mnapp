<script setup lang="ts">
import type { Member } from 'models/crud-pages';

import { where } from 'firebase/firestore';

import { membersStoreDefaultSort, useMembersStore } from 'stores/crud-pages/Members';

import useListPage from 'composables/crud-pages/useListPage';
import useListPageFilterWithOptionsAndStore from 'composables/crud-pages/useListPageFilterWithOptionsAndStore';
import useListPageStore from 'composables/crud-pages/useListPageStore';

// Constants

const SCOPE_NAME = 'list-page';

// Options

defineOptions({
  name: 'AliveIndex',
});

// Composables

const $p = useListPage<Member>(SCOPE_NAME, true);
const {
  // Auto sort
  listItemCardWidth,
  onItemClick,
} = $p;

const { store, onLoadNextPage } = useListPageStore<Member>(
  useMembersStore(),
  $p.loadPage,
  $p.appendItems,
  $p.updateItems,
);

const { filterLabel, filterItems, filterOptions } = useListPageFilterWithOptionsAndStore<
  Member,
  'active' | 'all'
>(
  $p.ready,
  $p.queryConstraints,
  'active',
  store,
  $p.loadFirstPage,
  $p.resetItems,
  {
    type: 'active',
    label: 'Active Members',
    queryConstraints: [where('isActive', '==', true), ...membersStoreDefaultSort],
  },
  {
    type: 'all',
    label: 'All Members',
    queryConstraints: [...membersStoreDefaultSort],
  },
);

// Private Executions

// useTableView
$p.columns.value = [
  {
    name: 'photoUrl',
    label: 'Avatar',
    align: 'center',
    field: 'photoUrl',
  },
  {
    name: 'fullName',
    label: 'Full Name',
    align: 'left',
    field: 'fullName',
  },
  {
    name: 'email',
    label: 'Email',
    align: 'left',
    field: 'email',
  },
  {
    name: 'uid',
    label: 'UID',
    align: 'left',
    field: 'uid',
  },
  {
    name: 'slackId',
    label: 'Slack ID',
    align: 'left',
    field: 'slackId',
  },
  {
    name: 'inviteToFinanceChannels',
    label: 'Finance Channels',
    align: 'center',
    field: 'inviteToFinanceChannels',
  },
  {
    name: 'isActive',
    label: 'Active',
    align: 'center',
    field: 'isActive',
  },
];

// useNavigateToViewPage
$p.viewUrl.value = '/crud-pages/';

// useNavigateToNewPage
$p.newUrl.value = '/crud-pages/new-member';
</script>

<template>
  <list-page :composition="$p" :scope-name="SCOPE_NAME" @load-next-page="onLoadNextPage">
    <template #top>
      <q-btn-dropdown color="accent" :label="filterLabel" rounded>
        <q-list>
          <q-item
            v-for="option in filterOptions"
            :key="option.type"
            clickable
            :disable="option.selected"
            :v-close-popup="!option.selected"
            @click="filterItems(option.type)"
          >
            <q-item-section>
              <q-item-label>{{ option.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>

    <template #body-cell-photoUrl="{ props }">
      <q-td auto-width :props="props">
        <q-avatar size="md">
          <q-img v-if="props.value" :src="props.value" />
          <q-icon v-else color="dark" name="fas fa-user-alt" size="lg" />
        </q-avatar>
      </q-td>
    </template>
    <template #body-cell-inviteToFinanceChannels="{ props }">
      <q-td auto-width :props="props">
        <q-toggle
          v-model="props.value"
          checked-icon="fal fa-comments"
          color="primary"
          disable
          unchecked-icon="clear"
        />
      </q-td>
    </template>
    <template #body-cell-isActive="{ props }">
      <q-td auto-width :props="props">
        <q-toggle
          v-model="props.value"
          checked-icon="fal fa-power-off"
          color="primary"
          disable
          unchecked-icon="clear"
        />
      </q-td>
    </template>

    <template #item-card="{ model, link }">
      <expandable-card
        :avatar-icon="model.photoUrl ? undefined : 'fas fa-user-alt'"
        :avatar-image="model.photoUrl || undefined"
        :caption="model.email"
        clickable
        :external-link-url="link()"
        :style="{ maxWidth: listItemCardWidth + 'px' }"
        :subtitle="model.uid"
        subtitle-tooltip="UID"
        :title="model.fullName"
        @click="onItemClick($event, model, true)"
      >
        <template v-if="!!model.slackId" #main>
          <div class="q-mt-sm text-caption">
            Slack ID: {{ model.slackId }}
            <top-tooltip>Slack ID</top-tooltip>
          </div>
        </template>

        <template #side>
          <q-toggle
            v-model="model.isActive"
            checked-icon="fal fa-power-off"
            class="right-toggle"
            color="primary"
            disable
            unchecked-icon="clear"
          >
            <top-tooltip>Active</top-tooltip>
          </q-toggle>

          <q-toggle
            v-model="model.inviteToFinanceChannels"
            checked-icon="fal fa-comments"
            class="right-toggle"
            color="primary"
            disable
            unchecked-icon="clear"
          >
            <top-tooltip>Invite to Finance Channels</top-tooltip>
          </q-toggle>
        </template>
      </expandable-card>
    </template>
  </list-page>
</template>

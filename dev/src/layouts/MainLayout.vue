<template>
  <q-layout
    view="lHh Lpr lFf"
    @scroll="onScroll"
  >
    <q-header :elevated="headerElevated">
      <q-toolbar class="top-toolbar">
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />

        <q-toolbar class="justify-center">
          <q-btn
            flat
            stretch
            to="/"
          >
            <img
              src="motix-logo.png"
              style="height: 23px"
            >
          </q-btn>
        </q-toolbar>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-grey-1"
      show-if-above
      :width="250"
    >
      <q-scroll-area
        class="shadow-4 inset-shadow"
        :style="`height: calc(100% - ${headerHeight}px); margin-top: ${headerHeight}px; border-right: 1px solid #ddd`"
      >
        <q-list padding>
          <!-- Production -->
          <q-expansion-item
            :default-opened="$route.path.startsWith('/production/')"
            group="mainAreas"
            header-class="menu-item text-grey-7"
            icon="fal fa-thunderstorm"
            label="Production"
          >
            <q-item
              v-ripple
              clickable
              to="/production/projects"
            >
              <q-item-section>Projects</q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              to="/production/timesheets"
            >
              <q-item-section>Timesheets</q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              to="/production/team"
            >
              <q-item-section>Team</q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              to="/production/customers"
            >
              <q-item-section>Customers</q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              to="/production/product-types"
            >
              <q-item-section>Product Types</q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              to="/production/production-roles"
            >
              <q-item-section>Production Roles</q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              to="/production/production-salary"
            >
              <q-item-section>Production Salary</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-separator />

          <!-- Finance -->
          <q-expansion-item
            :default-opened="$route.path.startsWith('/finance/')"
            group="mainAreas"
            header-class="menu-item text-grey-7"
            icon="fal fa-usd-circle"
            label="Finance"
          >
            <q-item
              v-ripple
              clickable
              to="/finance/projects"
            >
              <q-item-section>Projects</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-separator />

          <!-- HR -->
          <q-expansion-item
            :default-opened="$route.path.startsWith('/hr/')"
            group="mainAreas"
            header-class="menu-item text-grey-7"
            icon="fal fa-user-chart"
            label="HR"
          >
            <q-item
              v-ripple
              clickable
              to="/hr/team"
            >
              <q-item-section>Team</q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              to="/hr/payrolls"
            >
              <q-item-section>Payrolls</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-separator />

          <!-- Inventory -->
          <q-expansion-item
            :default-opened="$route.path.startsWith('/inventory/')"
            group="mainAreas"
            header-class="menu-item text-grey-7"
            icon="fal fa-inventory"
            label="Inventory"
          />

          <q-separator />

          <!-- Reports -->
          <q-expansion-item
            :default-opened="$route.path.startsWith('/reports/')"
            group="mainAreas"
            header-class="menu-item text-grey-7"
            icon="fal fa-chart-line"
            label="Reports"
          />

          <q-separator />

          <!-- Admin -->
          <q-expansion-item
            :default-opened="$route.path.startsWith('/admin/')"
            group="mainAreas"
            header-class="menu-item text-grey-7"
            icon="fal fa-cog"
            label="Admin"
          >
            <q-item
              v-ripple
              clickable
              to="/admin/team"
            >
              <q-item-section>Team</q-item-section>
            </q-item>
            <q-item
              v-ripple
              clickable
              to="/admin/roles"
            >
              <q-item-section>Roles</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-separator />

          <!-- Help -->
          <q-expansion-item
            :default-opened="$route.path.startsWith('/help/')"
            group="mainAreas"
            header-class="menu-item text-grey-7"
            icon="fal fa-question-circle"
            label="Help"
          />
        </q-list>
      </q-scroll-area>

      <div
        class="absolute-top bg-primary"
        dark
        :style="`height: ${headerHeight}px`"
      >
        <q-img
          class="absolute-top"
          :img-style="{'background-size': 'auto 90px', 'background-repeat': 'repeat'}"
          no-default-spinner
          position="0 0"
          src="overlay-bg.png"
          :style="`height: ${headerHeight}px`"
        >
          <div class="absolute-bottom bg-transparent">
            <q-item class="q-pa-none">
              <q-item-section avatar>
                <gravatar :gravatar-id="safeCurrentUser.gravatarId" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1">
                  {{ safeCurrentUser.fullName }}
                </q-item-label>
                <q-item-label class="text-caption">
                  {{ safeCurrentUser.email.substr(0, safeCurrentUser.email.indexOf('@')) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-img>
      </div>
    </q-drawer>

    <q-page-container class="page-body">
      <q-page>
        <div
          class="page-title q-layout-padding q-pt-sm q-pb-none text-white shadow-4"
          :style="`min-height:${collapseHeaderHeight}px`"
        >
          <div class="text-h5">
            {{ pageTitle }}
          </div>
        </div>

        <router-view v-slot="{ Component }">
          <fade-transition>
            <component :is="Component" />
          </fade-transition>
        </router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useFloatToolbar from 'composables/shared/use-float-toolbar'
import FadeTransition from 'src/components/shared/transitions/FadeTransition.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { FadeTransition },

  setup () {
    const route = useRoute()
    const leftDrawerOpen = ref(false)
    const pageTitle = ref(route.meta.pageTitle)

    watch(() => route.meta, (newMeta) => {
      pageTitle.value = newMeta.pageTitle
    })

    return {
      leftDrawerOpen,
      pageTitle,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      ...useFloatToolbar(50, 50)
    }
  }
})
</script>

<style lang="scss" scoped>
.page-body {
  font-weight: 300;

  :deep() .text-body1,
  :deep() .text-body2 {
    font-weight: 300;
  }
}

.top-toolbar {
  background-image: url("/overlay-bg.png");
  background-size: auto 90px;
  background-position: -250px 0;
}

.page-title {
  background-image: url("/overlay-bg.png");
  background-size: auto 90px;
  background-position: -250px -50px;
  background-color: $primary;
}

:deep() .menu-item .q-item__section--avatar .q-icon {
  color: $primary;
}
</style>

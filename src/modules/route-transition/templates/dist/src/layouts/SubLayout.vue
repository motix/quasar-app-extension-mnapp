<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :enter-active-class="route.meta.transitionEnter || 'animated fadeIn'"
      :leave-active-class="route.meta.transitionLeave || 'animated fadeOut'"
    >
      <component
        :is="Component"
        :key="route.path"
      />
    </transition>
  </router-view>
</template>

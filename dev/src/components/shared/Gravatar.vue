<template>
  <span>
    <q-avatar size="56px">
      <q-img
        v-if="gravatarId"
        :src="`https://secure.gravatar.com/avatar/${gravatarId}?s=128`"
      />
      <q-icon
        v-else
        :color="dark ? 'white' : 'dark'"
        name="fas fa-user-alt"
        size="lg"
      />
    </q-avatar>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Gravatar',

  props: {
    gravatarId: {
      type: String as PropType<string | undefined>,
      default: undefined
    },

    dark: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped>
.q-icon {
  opacity: 0.33;
}

.q-avatar :deep() img {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <q-dialog
    ref="dialog"
    maximized
    persistent
    transition-hide="slide-down"
    transition-show="slide-up"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Login Expired</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p>
          You are logged out from the system.
          Please use the button bellow to login from a different window and come back here to resume your work.<br />
          <span class="text-negative">If you click Continue before logging in you will loose any unsaved data.</span>
        </p>
        <p>
          You can also reload this page to login without opening a new window.
          In that case, you will <span class="text-negative">loose your unsaved data</span> too.
        </p>
      </q-card-section>

      <q-card-actions>
        <q-btn
          color="primary"
          :href="loginUrl"
          label="Login"
          target="_blank"
          type="a"
        />
        <q-btn
          color="primary"
          flat
          label="Reload Page"
          @click="reloadPage"
        />
        <q-btn
          color="primary"
          flat
          label="Continue"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { QDialog } from 'quasar'

const LOGIN_URL = '<%= prompts.loginUrl %>'

export default Vue.extend({
  computed: {
    loginUrl () {
      return `${LOGIN_URL}?returnUrl=${LOGIN_URL}`
    }
  },

  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show () {
      (this.$refs.dialog as QDialog).show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide () {
      (this.$refs.dialog as QDialog).hide()
    },

    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick () {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    reloadPage () {
      window.location.href = `${LOGIN_URL}?r${window.location.pathname}`
    }
  }
})
</script>

<script setup lang="ts">
import useScroll from 'composables/useScroll'
import { ref } from 'vue'
// Types
import type { QCard } from 'quasar'

// Composables

const {
  toTop,
  toElement
} = useScroll()

// Data

const buttons = ref<Element | null>(null)
const element = ref<Element | null>(null)
const component = ref<QCard | null>(null)

// Methods

function toButtons () {
  buttons.value && toElement(buttons.value)
}

function toTheElement () {
  element.value && toElement(element.value)
}

function toComponent () {
  component.value && toElement(component.value)
}
</script>

<template>
  <q-page padding>
    <div>
      <q-btn
        label="To Buttons"
        @click="toButtons"
      />
    </div>

    <div style="padding: 500px 0" />

    <div ref="element">
      Element
      <q-btn
        label="To Buttons"
        @click="toButtons"
      />
    </div>

    <div style="padding: 500px 0" />

    <div>
      <q-card ref="component">
        Component
        <q-btn
          label="To Buttons"
          @click="toButtons"
        />
      </q-card>
    </div>

    <div style="padding: 3000px 0" />

    <div ref="buttons">
      <q-btn
        label="To Top"
        @click="toTop"
      />
      <q-btn
        label="To Element"
        @click="toTheElement"
      />
      <q-btn
        label="To Component"
        @click="toComponent"
      />
    </div>
  </q-page>
</template>

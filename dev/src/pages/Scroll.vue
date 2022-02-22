<script setup lang="ts">
import useScroll from 'composables/use-scroll'
import { ref, ComponentPublicInstance } from 'vue'

// Composables

const {
  toTop,
  toElement
} = useScroll()

// Data

const buttons = ref<Element>()
const element = ref<Element>()
const component = ref<ComponentPublicInstance>()

// Methods

function toButtons () {
  toElement(buttons.value as Element)
}

function toTheElement () {
  toElement(element.value as Element)
}

function toComponent () {
  toElement(component.value as ComponentPublicInstance)
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

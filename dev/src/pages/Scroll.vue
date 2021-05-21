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
        @click="toElement"
      />
      <q-btn
        label="To Component"
        @click="toComponent"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, ComponentPublicInstance } from 'vue'

import useScroll from 'composables/use-scroll'

const scroll = useScroll()

export default defineComponent({
  name: 'Scroll',

  setup () {
    const buttons = ref<Element>()
    const element = ref<Element>()
    const component = ref<ComponentPublicInstance>()

    function toButtons () {
      scroll.toElement(buttons.value as Element)
    }

    function toTop () {
      scroll.toTop()
    }

    function toElement () {
      scroll.toElement(element.value as Element)
    }

    function toComponent () {
      scroll.toElement(component.value as ComponentPublicInstance)
    }

    return {
      buttons,
      element,
      component,
      toButtons,
      toTop,
      toElement,
      toComponent
    }
  }
})
</script>

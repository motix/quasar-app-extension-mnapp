import { defineComponent, computed, ref } from 'vue'
import { QFab } from 'quasar'
import { useFloatToolbarResult } from 'composables/shared/use-float-toolbar'

const PAGE_PADDING = 16
const QFAB_BTN_WIDTH = 56
const QFAB_ACTIONS_PADDING = 3
const QFAB_ACTIONS_MARGIN = 9
const QBTN_MARGIN = 5
const QBTN_WIDTH = 42

export default defineComponent({
  name: 'FloatToolbar',

  props: {
    fabButtonsVisibility: {
      type: Object,
      required: false,
      default: undefined
    },
    offset: {
      type: Object,
      required: false,
      default: undefined
    }
  },

  setup (props, { slots }) {
    const floatToolbarResult = useFloatToolbarResult()
    const fab = ref<QFab>()
    const fabOpened = ref<boolean>(false)
    const showFab = computed(() => !!slots.default && fabButtonsCount.value > 0)
    const fabButtonsCount = computed(() => {
      let count = 0

      if (props.fabButtonsVisibility) {
        for (const button in props.fabButtonsVisibility) {
          if (props.fabButtonsVisibility[button]) count++
        }
      } else if (slots.default) {
        for (const item of slots.default()) {
          if (!!item.el && item.el.tag) count++
        }
      }

      return count
    })
    const offsetX = computed(() => PAGE_PADDING - (!showFab.value ? QBTN_MARGIN : 0) + ((!!props.offset && props.offset.x as number) || 0))
    const offsetY = computed(() => {
      const buttonWidth = !showFab.value ? QBTN_WIDTH : QFAB_BTN_WIDTH
      return Math.max(floatToolbarResult.floatToolbarPosition.value - (buttonWidth / 2), -(buttonWidth / 2)) + ((!!props.offset && props.offset.y as number) || 0)
    })
    const fixedButtonsPosition = computed(() => {
      if (!showFab.value) {
        return 0
      }

      return (QFAB_ACTIONS_PADDING + QFAB_ACTIONS_MARGIN) +
        (fabOpened.value ? (QBTN_WIDTH + QBTN_MARGIN * 2) * fabButtonsCount.value : 0)
    })

    function open () {
      (fab.value as QFab).show()
    }

    function onBeforeShow () {
      fabOpened.value = true
    }

    function onBeforeHide () {
      fabOpened.value = false
    }

    return {
      fab,
      fabOpened,
      showFab,
      fabButtonsCount,
      offsetX,
      offsetY,
      fixedButtonsPosition,
      ...floatToolbarResult,
      open,
      onBeforeShow,
      onBeforeHide
    }
  }
})

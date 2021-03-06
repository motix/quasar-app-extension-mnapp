import { ComponentPublicInstance } from 'vue'
import { scroll } from 'quasar'
import useConfig from 'composables/use-config'

const { getScrollTarget, setVerticalScrollPosition } = scroll

export default function () {
  const config = useConfig()

  function toTop () {
    const target = getScrollTarget(window.document.body)
    setVerticalScrollPosition(target, 0, config.scrollDuration)
  }

  function toElement (destination: ComponentPublicInstance | Element | ComponentPublicInstance[] | Element[], index?: number) {
    let el: Element | undefined

    if ((destination as ComponentPublicInstance).$el instanceof Element) {
      el = (destination as ComponentPublicInstance).$el as Element
    }

    if (destination instanceof Element) {
      el = destination
    }

    if (destination instanceof Array) {
      if (index === undefined) index = 0

      destination = destination[index]

      if ((destination as ComponentPublicInstance).$el instanceof Element) {
        el = (destination as ComponentPublicInstance).$el as Element
      }

      if (destination instanceof Element) {
        el = destination
      }
    }

    if (el === undefined) throw new Error('No element to scroll to')

    const target = getScrollTarget(el)

    let offset = (el as HTMLElement).offsetTop
    let offsetParent = el as HTMLElement

    while (offsetParent.offsetParent) {
      offsetParent = offsetParent.offsetParent as HTMLElement
      offset += offsetParent.offsetTop
    }

    offset -= config.scrollOffset as number

    setVerticalScrollPosition(target, offset, config.scrollDuration)
  }

  return {
    toTop,
    toElement
  }
}

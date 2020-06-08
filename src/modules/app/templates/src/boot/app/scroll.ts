import Vue from 'vue'
import { scroll } from 'quasar'
import { ConfigInstance } from './config'

const { getScrollTarget, setScrollPosition } = scroll

export interface ScrollInstance {
  toTop (): void;
  toElement (el: Vue | Element | Vue[] | Element[]): void;
}

export default function (config: ConfigInstance) {
  function toTop () {
    const target = getScrollTarget(window.document.body)
    setScrollPosition(target, 0, config.scrollDuration)
  }

  function toElement (destination: Vue | Element | Vue[] | Element[], index?: number) {
    let el: Element | undefined

    if (destination instanceof Vue) {
      el = (destination as Vue).$el
    }

    if (destination instanceof Element) {
      el = destination
    }

    if (destination instanceof Array) {
      if (index === undefined) index = 0

      destination = destination[index]

      if (destination instanceof Vue) {
        el = (destination as Vue).$el
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

    offset -= config.scrollOffset

    setScrollPosition(target, offset, config.scrollDuration)
  }

  return {
    toTop,
    toElement
  }
}

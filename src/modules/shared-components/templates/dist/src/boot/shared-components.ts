import { boot } from 'quasar/wrappers'
import useConfig from 'composables/use-config'
import FadeTransition from 'components/shared/transitions/FadeTransition.vue'
import ListTransition from 'components/shared/transitions/ListTransition.vue'
import TopTooltip from 'components/shared/TopTooltip.vue'
import Gravatar from 'components/shared/Gravatar.vue'
import ExpandableCard from 'components/shared/expandable-card/ExpandableCard.vue'
import PercentInput from 'components/shared/PercentInput.vue'

declare module 'composables/use-config' {
  interface Config {
    cardWidth?: number;
    listItemCardWidth?: number;
  }
}

export default boot(({ app }) => {
  app.component('FadeTransition', FadeTransition)
  app.component('ListTransition', ListTransition)

  app.component('TopTooltip', TopTooltip)

  app.component('Gravatar', Gravatar)

  app.component('ExpandableCard', ExpandableCard)

  app.component('PercentInput', PercentInput)

  const config = useConfig()

  if (config.cardWidth === undefined) config.cardWidth = 500
  if (config.listItemCardWidth === undefined) config.listItemCardWidth = 380
})

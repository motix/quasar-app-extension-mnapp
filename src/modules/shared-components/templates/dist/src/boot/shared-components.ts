import useConfig from 'composables/useConfig'
import FadeTransition from 'components/shared/transitions/FadeTransition.vue'
import ListTransition from 'components/shared/transitions/ListTransition.vue'
import TopTooltip from 'components/shared/TopTooltip.vue'
import Gravatar from 'components/shared/Gravatar.vue'
import ExpandableCard from 'components/shared/expandable-card/ExpandableCard.vue'
import PercentInput from 'components/shared/PercentInput.vue'
import QPagePadding from 'components/shared/QPagePadding.vue'
// Main
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  const config = useConfig()

  if (config.cardWidth === undefined) config.cardWidth = 500
  if (config.listItemCardWidth === undefined) config.listItemCardWidth = 380
  if (config.fixedPadding === undefined) config.fixedPadding = 50
  if (config.topFloatPadding === undefined) config.topFloatPadding = 0
  if (config.bottomFloatPadding === undefined) config.bottomFloatPadding = 56

  app.component('FadeTransition', FadeTransition)
  app.component('ListTransition', ListTransition)
  app.component('TopTooltip', TopTooltip)
  app.component('Gravatar', Gravatar)
  app.component('ExpandableCard', ExpandableCard)
  app.component('PercentInput', PercentInput)
  app.component('QPagePadding', QPagePadding)
})

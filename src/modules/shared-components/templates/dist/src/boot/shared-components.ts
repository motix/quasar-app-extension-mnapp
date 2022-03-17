import useConfig from 'composables/useConfig'
import FadeTransition from 'components/shared/transition/FadeTransition.vue'
import ListTransition from 'components/shared/transition/ListTransition.vue'
import TopTooltip from 'components/shared/TopTooltip.vue'
import Gravatar from 'components/shared/Gravatar.vue'
import ExpandableCard from 'components/shared/expandable-card/ExpandableCard.vue'
import QPagePadding from 'components/shared/QPagePadding.vue'
import PercentInput from 'components/shared/PercentInput.vue'
import QInputVal from 'components/shared/validation/QInputVal.vue'
import PercentInputVal from 'components/shared/validation/PercentInputVal.vue'
import QSelectVal from 'components/shared/validation/QSelectVal.vue'
import QDateVal from 'components/shared/validation/QDateVal.vue'
import QDateInputVal from 'components/shared/validation/QDateInputVal.vue'
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
  app.component('QPagePadding', QPagePadding)
  app.component('PercentInput', PercentInput)
  app.component('QInputVal', QInputVal)
  app.component('PercentInputVal', PercentInputVal)
  app.component('QSelectVal', QSelectVal)
  app.component('QDateVal', QDateVal)
  app.component('QDateInputVal', QDateInputVal)
})

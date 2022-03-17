import { boot } from 'quasar/wrappers'

import useConfig from 'composables/useConfig'

import ExpandableCard from 'components/shared/expandable-card/ExpandableCard.vue'
import Gravatar from 'components/shared/Gravatar.vue'
import PercentInput from 'components/shared/PercentInput.vue'
import QPagePadding from 'components/shared/QPagePadding.vue'
import TopTooltip from 'components/shared/TopTooltip.vue'
import FadeTransition from 'components/shared/transition/FadeTransition.vue'
import ListTransition from 'components/shared/transition/ListTransition.vue'
import PercentInputVal from 'components/shared/validation/PercentInputVal.vue'
import QDateInputVal from 'components/shared/validation/QDateInputVal.vue'
import QDateVal from 'components/shared/validation/QDateVal.vue'
import QInputVal from 'components/shared/validation/QInputVal.vue'
import QSelectVal from 'components/shared/validation/QSelectVal.vue'

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

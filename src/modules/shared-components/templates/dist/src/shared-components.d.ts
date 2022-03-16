export { }

import FadeTransition from 'components/shared/transition/FadeTransition.vue'
import ListTransition from 'components/shared/transition/ListTransition.vue'
import TopTooltip from 'components/shared/TopTooltip.vue'
import Gravatar from 'components/shared/Gravatar.vue'
import ExpandableCard from 'components/shared/expandable-card/ExpandableCard.vue'
import QPagePadding from 'components/shared/QPagePadding.vue'
import PercentInput from 'components/shared/PercentInput.vue'
import QInputVal from 'components/shared/validation/QInputVal.vue'
import QPercentInputVal from 'components/shared/validation/QPercentInputVal.vue'
import QSelectVal from 'components/shared/validation/QSelectVal.vue'
import QDateVal from 'components/shared/validation/QDateVal.vue'
import QDateInputVal from 'components/shared/validation/QDateInputVal.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FadeTransition: typeof FadeTransition;
    ListTransition: typeof ListTransition;
    TopTooltip: typeof TopTooltip;
    Gravatar: typeof Gravatar;
    ExpandableCard: typeof ExpandableCard;
    QPagePadding: typeof QPagePadding;
    PercentInput: typeof PercentInput;
    QInputVal: typeof QInputVal;
    QPercentInputVal: typeof QPercentInputVal;
    QSelectVal: typeof QSelectVal;
    QDateVal: typeof QDateVal;
    QDateInputVal: typeof QDateInputVal;
  }
}

declare module 'composables/useConfig' {
  interface Config {
    cardWidth?: number;
    listItemCardWidth?: number;
    fixedPadding?: number;
    topFloatPadding?: number;
    bottomFloatPadding?: number;
  }
}

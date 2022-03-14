export { }

import FadeTransition from 'components/shared/transitions/FadeTransition.vue'
import ListTransition from 'components/shared/transitions/ListTransition.vue'
import TopTooltip from 'components/shared/TopTooltip.vue'
import Gravatar from 'components/shared/Gravatar.vue'
import ExpandableCard from 'components/shared/expandable-card/ExpandableCard.vue'
import PercentInput from 'components/shared/PercentInput.vue'
import QPagePadding from 'components/shared/QPagePadding.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FadeTransition: typeof FadeTransition;
    ListTransition: typeof ListTransition;
    TopTooltip: typeof TopTooltip;
    Gravatar: typeof Gravatar;
    ExpandableCard: typeof ExpandableCard;
    PercentInput: typeof PercentInput;
    QPagePadding: typeof QPagePadding;
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

export { }

import FadeTransition from 'components/shared/transitions/FadeTransition.vue'
import ListTransition from 'components/shared/transitions/ListTransition.vue'
import TopTooltip from 'components/shared/TopTooltip.vue'
import Gravatar from 'components/shared/Gravatar.vue'
import ExpandableCard from 'components/shared/expandable-card/ExpandableCard.vue'
import PercentInput from 'components/shared/PercentInput.vue'
import QPageWithToolbar from 'components/shared/QPageWithToolbar.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FadeTransition: typeof FadeTransition;
    ListTransition: typeof ListTransition;
    TopTooltip: typeof TopTooltip;
    Gravatar: typeof Gravatar;
    ExpandableCard: typeof ExpandableCard;
    PercentInput: typeof PercentInput;
    QPageWithToolbar: typeof QPageWithToolbar;
  }
}

declare module 'services/useConfig' {
  interface Config {
    cardWidth?: number;
    listItemCardWidth?: number;
  }
}

export {};

import ExpandableCard from 'components/shared/expandable-card/ExpandableCard.vue';
import GravatarImage from 'components/shared/GravatarImage.vue';
import PercentInput from 'components/shared/PercentInput.vue';
import QPagePadding from 'components/shared/QPagePadding.vue';
import ThousandInput from 'components/shared/ThousandInput.vue';
import TopTooltip from 'components/shared/TopTooltip.vue';
import FadeTransition from 'components/shared/transition/FadeTransition.vue';
import ListTransition from 'components/shared/transition/ListTransition.vue';
import DateArrayFieldVal from 'components/shared/validation/DateArrayFieldVal.vue';
import PercentInputVal from 'components/shared/validation/PercentInputVal.vue';
import QDateInputVal from 'components/shared/validation/QDateInputVal.vue';
import QDateVal from 'components/shared/validation/QDateVal.vue';
import QInputVal from 'components/shared/validation/QInputVal.vue';
import QSelectVal from 'components/shared/validation/QSelectVal.vue';
import ThousandInputVal from 'components/shared/validation/ThousandInputVal.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FadeTransition: typeof FadeTransition;
    ListTransition: typeof ListTransition;
    TopTooltip: typeof TopTooltip;
    GravatarImage: typeof GravatarImage;
    ExpandableCard: typeof ExpandableCard;
    QPagePadding: typeof QPagePadding;
    PercentInput: typeof PercentInput;
    ThousandInput: typeof ThousandInput;
    QInputVal: typeof QInputVal;
    PercentInputVal: typeof PercentInputVal;
    ThousandInputVal: typeof ThousandInputVal;
    QSelectVal: typeof QSelectVal;
    QDateVal: typeof QDateVal;
    QDateInputVal: typeof QDateInputVal;
    DateArrayFieldVal: typeof DateArrayFieldVal;
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

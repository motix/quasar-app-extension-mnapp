import type { MappingProfile } from '@automapper/core';

import { addProfile, createMapper } from '@automapper/core';
import { pojos } from '@automapper/pojos';

import memberProfile from './memberProfile';

export const membershipProfile: MappingProfile = (mapper) => {
  memberProfile(mapper);
};

const membershipMapper = createMapper({
  strategyInitializer: pojos(),
});

addProfile(membershipMapper, membershipProfile);

export default membershipMapper;

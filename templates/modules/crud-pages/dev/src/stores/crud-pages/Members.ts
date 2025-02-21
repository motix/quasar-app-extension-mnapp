import type { QueryConstraint } from 'firebase/firestore';
import type { Member, MemberAm, MemberVm } from 'models/crud-pages';

import { orderBy } from 'firebase/firestore';

import membershipMapper from 'models/crud-pages/mapper/membershipMapper';

import { useStore } from 'stores/firebase-firestore';

export const useMembersStore = useStore<Member, MemberVm, MemberAm>(
  'Members',
  'admin_members',
  membershipMapper,
  'Member',
  'MemberVm',
  'MemberAm',
);

export const membersStoreDefaultSort: Readonly<QueryConstraint[]> = [
  orderBy('fullName'),
  orderBy('email'),
];

import {
  collection,
  query,
  where,
  limit,
  getDocs
} from 'firebase/firestore'
import { getFirestore } from 'services/firebase'

export async function validateUniqueField<TValue> (
  collectionPath: string,
  fieldName: string,
  value: TValue,
  excludeId?: string
) {
  const db = getFirestore()
  const collectionRef = collection(db, collectionPath)
  const q = query(
    collectionRef,
    where(fieldName, '==', value),
    limit(2)
  )
  const querySnapshot = await getDocs(q)

  const result =
    querySnapshot.empty ||
    (
      !!excludeId &&
      querySnapshot.docs.length === 1 &&
      querySnapshot.docs[0].id === excludeId
    )

  return result
}

import type { QueryConstraint, Unsubscribe } from 'firebase/firestore'

// Models

export type DocModel = {
  id: string;
}

export type DocViewModel<T extends DocModel> = Omit<T, 'id'> & {
  id?: string;
}

export type DocApiModel<T extends DocModel> = Omit<T, 'id'>

// State

export type RealtimeDocIndex<T> = {
  [docKey: string]: {
    doc?: T,
    unsubscribe: Unsubscribe
  }
}

// Actions

export type LoadDocsPageActionPayload = {
  page: number,
  queryConstraints: QueryConstraint[],
  done: () => void,
  outOfRange?: () => void,
  error?: (error: Error) => void
}

export type LoadDocsPageActionMethod =
    (payload: LoadDocsPageActionPayload) => Promise<void>

export type ReleaseDocsActionPayload = {
  immediately: boolean
}

export type LoadRealtimeDocActionPayload = {
  findKey: string,
  findKeyField?: string,
  done: () => void,
  notFound?: () => void,
  deleted?: () => void,
  error?: (error: Error) => void
}

export type LoadRealtimeDocActionResult = {
  docKey: string,
  release: () => void
}

export type ReleaseRealtimeDocActionPayload = {
  docKey: string
}

export type CreateDocActionPayload<T> = {
  doc: T
  idField?: keyof T
}

export type UpdateDocActionPayload<T> = {
  docKey: string,
  doc: T,
  isViewModel: boolean
}

export type UpdateDocsActionPayload<T> = {
  docs: T[],
  isViewModel: boolean
}

export type DeleteDocActionPayload = {
  docKey: string
}

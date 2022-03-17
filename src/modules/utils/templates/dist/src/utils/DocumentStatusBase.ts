import { intersection } from 'lodash'

import { UserRole } from 'models/firebase-auth'

export interface ButtonBase<TActionName extends string> {
  label: string;
  color: string;
  icon: string;
  roles: UserRole[];
  action: TActionName;
}

export interface StatusBase<TActionName extends string> {
  text: string;
  textColor: string;
  backgroundColor: string;
  buttons: ButtonBase<TActionName>[];
}

export default abstract class DocumentStatus<
  T,
  TStatusName extends string,
  TButtonName extends string,
  TActionName extends string
> {
  protected container: T
  protected userRoles: UserRole[] = []
  protected abstract allButtons: Record<TButtonName, ButtonBase<TActionName>>
  protected abstract allStatuses: Record<TStatusName, StatusBase<TActionName>>

  constructor (container: T, userRoles: UserRole[]) {
    this.container = container
    this.userRoles = userRoles
  }

  abstract get statusName(): TStatusName

  protected get status () {
    return this.allStatuses[this.statusName]
  }

  get text () {
    return this.status.text
  }

  get textColor () {
    return this.status.textColor
  }

  get backgroundColor () {
    return this.status.backgroundColor
  }

  get buttons () {
    return this.userRoles.includes('admin')
      ? this.status.buttons
      : this.status.buttons.filter(button => intersection(this.userRoles, button.roles).length > 0)
  }

  setUserRoles (userRoles: UserRole[]) {
    this.userRoles = userRoles
  }
}

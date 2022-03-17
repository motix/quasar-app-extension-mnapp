import { intersection } from 'lodash'

export interface ButtonBase<TUserRole, TActionName> {
  label: string;
  color: string;
  icon: string;
  roles: TUserRole[];
  action: TActionName;
}

export interface StatusBase<TUserRole, TActionName> {
  text: string;
  textColor: string;
  backgroundColor: string;
  buttons: ButtonBase<TUserRole, TActionName>[];
}

export default abstract class DocumentStatus<
  T,
  TUserRole extends string,
  TStatusName extends string,
  TButtonName extends string,
  TActionName extends string
> {
  protected container: T
  protected userRoles: TUserRole[] = []
  protected abstract allButtons: Record<TButtonName, ButtonBase<TUserRole, TActionName>>
  protected abstract allStatuses: Record<TStatusName, StatusBase<TUserRole, TActionName>>

  constructor (container: T, userRoles: TUserRole[]) {
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
    return this.userRoles.includes('admin' as TUserRole)
      ? this.status.buttons
      : this.status.buttons.filter(button => intersection(this.userRoles, button.roles).length > 0)
  }

  setUserRoles (userRoles: TUserRole[]) {
    this.userRoles = userRoles
  }
}

import { date } from 'quasar'
import { ConfigInstance } from './config'

export interface RulesInstance {
  validDate: (val: string) => boolean;
  sameDateOrAfter: (val: string, otherVal: string) => boolean;
}

export default function (config: ConfigInstance) {
  function validDate (val: string) {
    return !val || date.formatDate(date.extractDate(val, config.editDateFormat), config.editDateFormat) === val
  }

  function sameDateOrAfter (val: string, otherVal: string) {
    return !val || !otherVal || !validDate(val) || !validDate(otherVal) ||
      date.getDateDiff(date.extractDate(val, config.editDateFormat), date.extractDate(otherVal, config.editDateFormat)) >= 0
  }

  return {
    validDate,
    sameDateOrAfter
  }
}

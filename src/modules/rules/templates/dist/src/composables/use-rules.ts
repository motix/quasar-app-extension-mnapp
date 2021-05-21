import { date } from 'quasar'
import useConfig from 'composables/use-config'

declare module 'composables/use-config' {
  interface Config {
    dateFormat?: string;
    editDateFormat?: string;
    dateMask?: string;
  }
}

export interface RulesInstance {
  validDate: (val: string) => boolean;
  sameDateOrAfter: (val: string, otherVal: string) => boolean;
}

export default function () {
  const config = useConfig()

  if (config.dateFormat === undefined) config.dateFormat = 'DD/MM/YYYY'
  if (config.editDateFormat === undefined) config.editDateFormat = 'DDMMYYYY'
  if (config.dateMask === undefined) config.dateMask = '##/##/####'

  function validDate (val: string) {
    return !val || date.formatDate(date.extractDate(val, config.editDateFormat as string), config.editDateFormat) === val
  }

  function sameDateOrAfter (val: string, otherVal: string) {
    return !val || !otherVal || !validDate(val) || !validDate(otherVal) ||
      date.getDateDiff(date.extractDate(val, config.editDateFormat as string), date.extractDate(otherVal, config.editDateFormat as string)) >= 0
  }

  const rules: RulesInstance = {
    validDate,
    sameDateOrAfter
  }

  return rules
}

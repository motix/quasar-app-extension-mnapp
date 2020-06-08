/* eslint-disable camelcase */

import { Platform } from 'quasar'

export interface ConfigInstance {
  scrollDuration: number;
  scrollOffset: number;
  deffaultListView: string;
  cardWidth: number;
  listItemCardWidth: number;
  dateFormat: string;
  editDateFormat: string;
  dateMask: string;
}

const config: ConfigInstance = {
  scrollDuration: 500,
  scrollOffset: 50,
  deffaultListView: Platform.is.desktop ? 'table' : 'card',
  cardWidth: 500,
  listItemCardWidth: 380,
  dateFormat: 'DD/MM/YYYY',
  editDateFormat: 'DDMMYYYY',
  dateMask: '##/##/####'
}

export default config

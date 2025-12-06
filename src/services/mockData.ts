import type { Minion } from '../models/minion';

export const MOCK_MINIONS: Minion[] = [
  { id: 1, name: 'Kevin', bio: 'Líder', birth: '2020-01-01', side: 'Minionés Cantonés', skills: ['Mecánico', 'Físico'], img: 'https://minions-api.herokuapp.com/images/kevin.png' },
  { id: 2, name: 'Stuart', bio: 'Guitarrista', birth: '2019-05-12', side: 'Minionés Español', skills: ['Químico'], img: 'https://minions-api.herokuapp.com/images/stuart.png' },
  { id: 3, name: 'Bob', bio: 'Pequeño', birth: '2021-08-20', side: 'Minionés Británico', skills: ['Arquitecto'], img: 'https://minions-api.herokuapp.com/images/bob.png' },
];
import type { Minion } from '../models/minion';

export const MOCK_MINIONS: Minion[] = [
  { id: 1, nombre: 'Kevin', bio: 'Líder', birth: '2020-01-01', idioma: 'Minionés Portugués', habilidades: ['Mecánico', 'Físico'], img: 'https://minions-api.herokuapp.com/images/kevin.png' },
  { id: 2, nombre: 'Stuart', bio: 'Guitarrista', birth: '2019-05-12', idioma: 'Minionés Español', habilidades: ['Químico'], img: 'https://minions-api.herokuapp.com/images/stuart.png' },
  { id: 3, nombre: 'Bob', bio: 'Pequeño', birth: '2021-08-20', idioma: 'Minionés Británico', habilidades: ['Arquitecto'], img: 'https://minions-api.herokuapp.com/images/bob.png' },
];
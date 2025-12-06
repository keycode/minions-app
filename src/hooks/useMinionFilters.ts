import { useMemo } from 'react';
import type { Minion } from '../models/minion';

interface FilterOptions {
  search: string;
  language: string;
  skills: string[];
}

/**
 * Custom Hook para filtrar la lista de Minions.
 * Cumple con el requisito de usar useMemo para optimizar cálculos costosos.
 */
export const useMinionFilters = (minions: Minion[], filters: FilterOptions) => {
  const filteredMinions = useMemo(() => {
    return minions.filter((minion) => {
      // 1. Filtro por Texto (Nombre) - Case Insensitive [cite: 112]
      const searchMatch = minion.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      // 2. Filtro por Idioma (Selección única)
      // Si hay idioma seleccionado, debe coincidir exactamente.
      const languageMatch = filters.language
        ? minion.side === filters.language
        : true;

      // 3. Filtro por Habilidades (Selección múltiple) [cite: 11]
      // Si hay habilidades seleccionadas, el minion debe tener AL MENOS una de ellas.
      // (Lógica OR inclusiva habitual en filtros de tags)
      const skillsMatch =
        filters.skills.length > 0
          ? filters.skills.some((skill) => minion.skills.includes(skill))
          : true;

      // Combinación de filtros (AND) [cite: 113]
      return searchMatch && languageMatch && skillsMatch;
    });
  }, [minions, filters]); // Solo recalcula si cambian los minions o los filtros

  return filteredMinions;
};
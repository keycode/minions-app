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
      // 1. Filtro por Texto (Nombre)
      const searchMatch = minion.nombre // Antes: .name
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      // 2. Filtro por Idioma
      const languageMatch = filters.language
        ? minion.idioma === filters.language // Antes: .side
        : true;

      // 3. Filtro por Habilidades
      const skillsMatch =
        filters.skills.length > 0
          ? filters.skills.some((skill) => minion.habilidades.includes(skill)) // Antes: .skills
          : true;

      return searchMatch && languageMatch && skillsMatch;
    });
  }, [minions, filters]); // Solo recalcula si cambian los minions o los filtros

  return filteredMinions;
};
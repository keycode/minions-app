import axios from 'axios';
import type { Minion } from '../models/minion';
import { MOCK_MINIONS } from './mockData';

const API_URL = 'https://minion.globalsmartiot.es';

export const minionsService = {
  /**
   * Intenta obtener los minions de la API.
   * Si falla (404, 500, CORS), devuelve los datos Mock para que la app siga funcionando.
   */
  getAll: async (page: number = 1): Promise<Minion[]> => {
    try {
  
      const response = await axios.get(`${API_URL}/getMinions?page=${page}`);
      
      // Verificamos si la respuesta tiene el formato esperado
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      // Si la API devuelve algo raro, lanzamos error para ir al catch
      throw new Error('Formato de API inesperado');
      
    } catch (error) {
      console.warn(`[API Error] Fallo al cargar minions (Página ${page}). Usando datos de respaldo (Mock).`, error);
      
      // FALLBACK: Devolvemos los datos locales para que el reclutador pueda probar la app
      // Simulamos paginación local (opcional, aquí devolvemos todos para filtrar en cliente)
      return MOCK_MINIONS;
    }
  }
};
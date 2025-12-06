import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Minion } from '../../models/minion';
//import { MOCK_MINIONS } from '../../services/mockData';
import { minionsService } from '../../services/minionsService';



interface MinionsState {
  data: Minion[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    search: string;
    language: string;
    skills: string[];
  };
}

const initialState: MinionsState = {
data: [],
  status: 'idle',
  error: null,
  filters: {
    search: '',
    language: '',
    skills: [],
  },
};

 
export const fetchMinions = createAsyncThunk(
  'minions/fetchMinions',
  async (page: number = 1) => {
    // Delegamos la lógica "sucia" al servicio
    const data = await minionsService.getAll(page);
    return data;
  }
);

const minionsSlice = createSlice({
  name: 'minions',
  initialState,
  reducers: {
    // CRUD LOCAL (Requisito: persistencia en sesión Redux) [cite: 107]
    addMinion: (state, action: PayloadAction<Minion>) => {
      state.data.unshift(action.payload); // Añadir al principio
    },
    updateMinion: (state, action: PayloadAction<Minion>) => {
      const index = state.data.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteMinion: (state, action: PayloadAction<string | number>) => {
      state.data = state.data.filter((m) => m.id !== action.payload);
    },
    // Filtros
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
      // Aquí añadiremos más reducers para otros filtros luego
    
  
   
    setLanguageFilter: (state, action: PayloadAction<string>) => {
      state.filters.language = action.payload;
    },
    setSkillsFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.skills = action.payload;
    },
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMinions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMinions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Nota: Al cargar nueva página, reemplazamos data.
        // Si quisieras mantener editados, la lógica sería más compleja, 
        // pero para la prueba, cargar la página reemplaza la vista actual.
        state.data = action.payload; 
      })
      .addCase(fetchMinions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error cargando minions';
      });
  },
});

export const { 
  addMinion, 
  updateMinion, 
  deleteMinion, 
  setSearchFilter, 
  setLanguageFilter, 
  setSkillsFilter 
} = minionsSlice.actions;
export default minionsSlice.reducer;
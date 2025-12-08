import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Minion } from '../../models/minion';
//import { MOCK_MINIONS } from '../../services/mockData';
import { minionsService } from '../../services/minionsService';
import axios from "axios";
// Tiene que ser online por el CORS


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
    updateMinionPhoto: (state, action: PayloadAction<{id: string | number, url: string}>) => {
       const minion = state.data.find(m => m.id === action.payload.id);
       if (minion) {
         minion.img = action.payload.url;
       }
    },
  
   
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
   
        state.data = action.payload;
      })
      .addCase(generateMinionImage.fulfilled, (state, action) => {
        const { id, url } = action.payload;
      
      
        const minion = state.data.find((m) => m.id.toString() === id.toString());
      
        if (minion) {
  
          minion.img = url;
        }
      })
      .addCase(fetchMinions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error cargando minions';
      });
  },
});



export const generateMinionImage = createAsyncThunk(
  'minions/generateImage',
  async ({ id, prompt }: { id: string | number; prompt: string }) => {
    
    // Llamada a tu Proxy PHP
    // Nota: Asegúrate de que la URL apunte a donde tienes el proxy (ej: /proxy.php o /api/...)
    const response = await axios.post('/proxy.php', {
      id,
      prompt
    });

    // Validamos que el PHP haya devuelto success
    if (response.data.success) {
      // Devolvemos el ID y la nueva URL para que el Reducer lo use
      return { id, url: response.data.url };
    } else {
      throw new Error(response.data.error || 'Error generando imagen');
    }
  }
);

export const { 
  addMinion, 
  updateMinion, 
  deleteMinion, 
  setSearchFilter, 
  setLanguageFilter, 
  setSkillsFilter , updateMinionPhoto
} = minionsSlice.actions;
export default minionsSlice.reducer;
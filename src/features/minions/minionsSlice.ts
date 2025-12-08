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
  // NUEVO: Almacenes de persistencia local
  edits: Record<string, Minion>; // Diccionario de IDs -> Minion Editado
  created: Minion[];
  
  workshop: Minion[];      // El "Carrito"
  groupImage: string | null; // URL de la foto de grupo generada
  isGeneratingGroup: boolean;// Array de Minions creados manualmente
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
  edits: {},   
  created: [], 
  workshop: [],
  groupImage: null,
  isGeneratingGroup: false
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
   addMinion: (state, action: PayloadAction<Minion>) => {
      state.created.unshift(action.payload); 
      // También lo mostramos en data inmediatamente
      state.data.unshift(action.payload);
    },

    // --- UPDATE: Guardamos en 'edits' y actualizamos 'data' ---
    updateMinion: (state, action: PayloadAction<Minion>) => {
      const minion = action.payload;
      // 1. Guardar en persistencia (Diccionario por ID)
      state.edits[minion.id] = minion;

      // 2. Actualizar visualmente si está en pantalla ahora mismo
      const index = state.data.findIndex((m) => m.id === minion.id);
      if (index !== -1) {
        state.data[index] = minion;
      }
    },

    // --- DELETE: Lo quitamos de todas partes ---
    deleteMinion: (state, action: PayloadAction<string | number>) => {
      const id = action.payload;
      state.data = state.data.filter((m) => m.id !== id);
      state.created = state.created.filter((m) => m.id !== id);
      // Opcional: Podrías necesitar un array 'deleted' si quieres que no reaparezcan al paginar
    },
   updateMinionPhoto: (state, action: PayloadAction<{id: string | number, url: string}>) => {
       const minion = state.data.find(m => m.id === action.payload.id);
       if (minion) {
         minion.img = action.payload.url;
       }
    },
   
   addToWorkshop: (state, action: PayloadAction<Minion>) => {
      // Evitar duplicados
      const exists = state.workshop.find(m => m.id === action.payload.id);
      if (!exists) {
        state.workshop.push(action.payload);
      }
    },
    removeFromWorkshop: (state, action: PayloadAction<string | number>) => {
      state.workshop = state.workshop.filter(m => m.id !== action.payload);
    },
    clearWorkshop: (state) => {
      state.workshop = [];
      state.groupImage = null;
    },
   
  
    // Filtros
    setSearchFilter: (state, action: PayloadAction<string>) => { state.filters.search = action.payload; },
    setLanguageFilter: (state, action: PayloadAction<string>) => { state.filters.language = action.payload; },
    setSkillsFilter: (state, action: PayloadAction<string[]>) => { state.filters.skills = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMinions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMinions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // --- AQUÍ ESTÁ LA MAGIA ---
        // Al recibir datos "viejos" de la API, los mezclamos con nuestros cambios locales
        
        const apiMinions: Minion[] = Array.isArray(action.payload) ? action.payload : [];

        // 1. Aplicamos ediciones: Si tenemos una edición guardada, usamos esa en vez de la de la API
        const mergedMinions = apiMinions.map(apiMinion => {
          // Si existe en 'edits', devolvemos el editado. Si no, el de la API.
          return state.edits[apiMinion.id] || apiMinion;
        });

        // 2. Combinamos: [Nuevos creados] + [Datos de API fusionados]
        // Requisito: "La creación... debe visualizarse inmediatamente en la lista" [cite: 119]
        state.data = [...state.created, ...mergedMinions];
      })
      .addCase(generateMinionImage.fulfilled, (state, action) => {
       const { id, url } = action.payload;
        // Buscar y actualizar en data
        const minionInData = state.data.find(m => m.id.toString() === id.toString());
        if (minionInData) {
            minionInData.img = url;
            // IMPORTANTE: Guardar también en edits para que persista al recargar lista
            state.edits[id] = { ...minionInData, img: url };
        }
      })
      .addCase(fetchMinions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error cargando minions';
      })
      
      .addCase(generateGroupImage.pending, (state) => {
      state.isGeneratingGroup = true;
    })
    .addCase(generateGroupImage.fulfilled, (state, action) => {
      state.isGeneratingGroup = false;
      state.groupImage = action.payload; // Guardamos la URL
    }).addCase(generateGroupImage.rejected, (state) => {
      state.isGeneratingGroup = false;
      alert("Error generando la foto de grupo");
    });
      ;
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



export const generateGroupImage = createAsyncThunk(
  'minions/generateGroupImage',
  async (selectedMinions: Minion[]) => {

    const descriptions = selectedMinions.map(m => `${m.nombre} (${m.habilidades.join(', ')})`).join(', ');
    const prompt = `A complex, cinematic photograph integrating elements from these Minions:  ${descriptions} .The entire image is rendered in the specific visual style of Minions and add the iconic 'Shrink Ray' (Rayo Deductor) weapon from the Minions / Despicable Me franchise. High quality 3D render style, yellow skin, denim overalls.`;
    
    // Usamos un ID especial para la foto de grupo
    const groupId = 'mission_squad_' + Date.now();

    const response = await axios.post('/proxy.php', {
      id: groupId, // ID único para guardar el archivo
      prompt: prompt
    });

    if (response.data.success) {
      return response.data.url;
    } else {
      throw new Error(response.data.error);
    }
  }
);

export const { 
  addMinion, 
  updateMinion, 
  deleteMinion, 
  setSearchFilter, 
  setLanguageFilter, 
  setSkillsFilter, updateMinionPhoto,
  addToWorkshop, removeFromWorkshop, clearWorkshop
} = minionsSlice.actions;
export default minionsSlice.reducer;
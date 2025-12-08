export interface Minion {
id: string | number;
  nombre: string;
  idioma: string;
  habilidades: string[];
  
  // Nuevos campos exactos del JSON
  fecha_cumpleanos: number; // Timestamp (segundos)
  experiencia: number;
  estado: string;
  descripcion: string;      // Antes: bio
  numero_ojos: number;      // Antes: ojos
  altura: number;           // Antes: string, ahora number (entero)
  comida_favorita: string;  // Antes: comida
  personalidad: string;
  
  // Campo UI (no viene en el JSON pero lo usamos para la foto)
  img?: string; 
}
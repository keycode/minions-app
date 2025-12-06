export interface Minion {
  id: string | number;
  name: string;
  bio: string; // Descripción
  birth: string; // Fecha de nacimiento
  side: string; // Bando/Idioma (En el PDF 'Idioma' parece ser el bando ej: Minionés Español)
  skills: string[]; // Habilidades (Array de strings)
  img?: string; // URL de la foto
  // Campos extra deducidos de la imagen detalle:
  experience?: number;
  height?: number;
  eyes?: number;
  personality?: string[];
}
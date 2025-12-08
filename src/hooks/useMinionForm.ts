import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
// IMPORTANTE: Importamos fetchMinions para poder recargar los datos si faltan
import { addMinion, updateMinion, generateMinionImage, fetchMinions } from '../features/minions/minionsSlice';
import type { Minion } from '../models/minion';

const initialMinionState: Minion = {
id: 0,
  nombre: '',
  idioma: 'Minionés Español',
  habilidades: [],
  fecha_cumpleanos: 946684800, // 2000-01-01 (aprox) por defecto
  experiencia: 0,
  estado: 'Activo',
  descripcion: '',
  numero_ojos: 2,
  altura: 100,
  comida_favorita: 'Bananas',
  personalidad: '',
};

export const useMinionForm = (id?: string) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Obtenemos datos y también el STATUS para saber si ya se están cargando
  const { data: minions, status } = useAppSelector((state) => state.minions);

  const isNew = !id;
  const minionFound = !isNew ? minions.find((m) => m.id.toString() === id) : null;

  // Inicialización del estado
  const [formData, setFormData] = useState<Minion>(() => {
    if (minionFound) return minionFound;
    return initialMinionState;
  });
  
  const [isEditing, setIsEditing] = useState(isNew);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- EFECTO DE RECARGA DE DATOS (NUEVO) ---
  useEffect(() => {
    // Si estamos en modo edición (!isNew), el array de minions está vacío, 
    // y el estado es 'idle' (no está cargando ya)...
    if (!isNew && minions.length === 0 && status === 'idle') {
      // ... ¡Disparamos la carga manual!
      dispatch(fetchMinions(1)); 
    }
  }, [isNew, minions.length, status, dispatch]);


  // --- EFECTO DE ACTUALIZACIÓN DEL FORMULARIO ---
  useEffect(() => {
    if (!isNew && id) {
      const currentMinion = minions.find((m) => m.id.toString() === id);

      if (currentMinion) {
        // Si encontramos al minion (porque ya estaba o porque acaba de llegar el fetch), actualizamos
        setFormData(prevState => {
            if (prevState.id !== currentMinion.id) return currentMinion;
            return prevState;
        });
      } else if (status === 'succeeded' && minions.length > 0) {
        // Solo redirigimos si YA terminó de cargar ('succeeded') y aun así no está el ID.
        // Esto evita que te expulse mientras está cargando (loading).
        navigate('/minions');
      }
    }
  }, [id, minions, isNew, navigate, status]); // Añadimos 'status' a las dependencias

  useEffect(() => {
    // Solo chequeamos si estamos editando un minion existente (tiene ID)
    if (!isNew && id) {
      // Ruta teórica donde el PHP guarda la imagen
      const serverImagePath = `/uploads/minion_images/${id}.jpg`;

      // Creamos una imagen "fantasma" en memoria para probar si carga
      const img = new Image();
      img.src = serverImagePath;

      img.onload = () => {
        // ¡ÉXITO! La imagen existe en el servidor.
        // Forzamos al formulario a usar esta imagen en lugar de la que tenga en memoria/redux
        setFormData(prev => ({ ...prev, img: serverImagePath }));
      };

      img.onerror = () => {
        // FALLO: La imagen no existe en la carpeta uploads.
        // No hacemos nada, mantenemos la que viene de Redux o el default.
      };
    }
  }, [id, isNew]);
    
    
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
        let newValue: any = value;

        // 1. Si es la fecha, convertimos de String "YYYY-MM-DD" a Timestamp (Number)
        if (name === 'fecha_cumpleanos') {
             // Creamos fecha a mediodía para evitar problemas de zona horaria
             const dateObj = new Date(value);
             // Convertimos milisegundos a segundos (Unix Timestamp)
             newValue = Math.floor(dateObj.getTime() / 1000);
        }
        // 2. Si es número, lo parseamos (para altura, ojos, experiencia)
        else if (type === 'number') {
            newValue = Number(value);
        }

        return { ...prev, [name]: newValue };
    });
  };

  const handleSkillsChange = (newSkills: string[]) => {
    setFormData(prev => ({ ...prev, habilidades: newSkills }));
  };

  const saveMinion = () => {
    if (!formData.nombre.trim()) return alert('El nombre es obligatorio');
    if (isNew) {
      dispatch(addMinion({ ...formData, id: Date.now() }));
    } else {
      dispatch(updateMinion(formData));
    }
    navigate('/minions');
  };

  const cancelEdit = () => {
    if (isNew) {
      navigate('/minions');
    } else {
      setIsEditing(false);
      // Si tenemos el dato en memoria, reseteamos el form al original
      const original = minions.find((m) => m.id.toString() === id);
      if (original) setFormData(original);
    }
  };

  const handleGenerateAiImage = async () => {
     if (!formData.nombre) return alert("Escribe un nombre primero.");
     if (!formData.id || formData.id === 0) return alert("Guarda el minion primero.");

     const prompt = `Thumbnail 300x300, minion llamado ${formData.nombre}, idioma ${formData.idioma}, habilidades ${formData.habilidades.join(', ')}. Estilo cartoon 3d render. No añadir ningun texto solo la imagen del Minion`;

     setIsGenerating(true);
     try {
       const result = await dispatch(generateMinionImage({ 
         id: formData.id, 
         prompt 
       })).unwrap();
       setFormData(prev => ({ ...prev, img: result.url }));
     } catch (error) {
       console.error("Error IA:", error);
       alert("Error al generar la imagen.");
     } finally {
       setIsGenerating(false);
     }
  };

  return {
    formData,
    isNew,
    isEditing,
    isGenerating,
    setIsEditing,
    handleChange,
    handleSkillsChange,
    saveMinion,
    cancelEdit,
    handleGenerateAiImage
  };
};
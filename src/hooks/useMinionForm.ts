import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addMinion, updateMinion } from '../features/minions/minionsSlice';
import type { Minion } from '../models/minion';

// Estado inicial vacío
const initialMinionState: Minion = {
  id: 0,
  nombre: '',
  bio: '',
  birth: '',
  idioma: 'Minionés Español',
  habilidades: [],
  img: 'https://m.media-amazon.com/images/I/71eY2B9sCmL._AC_SL1500_.jpg'
};

/**
 * Custom Hook para la gestión del formulario de Minions.
 * Encapsula la lógica de estado, validación y despacho de acciones CRUD.
 * Cumple con el requisito de "Manejo de formularios".
 */
export const useMinionForm = (id?: string) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const minions = useAppSelector((state) => state.minions.data);

  // Lógica: Si no hay ID en la URL, es un minion nuevo
  const isNew = !id;
  
  // Estado local del formulario
  const [formData, setFormData] = useState<Minion>(initialMinionState);
  
  // Estado para controlar si los inputs están habilitados
  const [isEditing, setIsEditing] = useState(isNew);

  // Efecto: Cargar datos si estamos editando uno existente
  useEffect(() => {
    if (!isNew && id) {
      const foundMinion = minions.find((m) => m.id.toString() === id);
      if (foundMinion) {
        setFormData(foundMinion);
      } else {
        // Si el ID no existe, volvemos al listado
        navigate('/minions');
      }
    }
  }, [id, minions, isNew, navigate]);

  // Manejador genérico de cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador específico para el MultiSelect (habilidades)
  const handleSkillsChange = (newSkills: string[]) => {
    setFormData(prev => ({ ...prev, habilidades: newSkills }));
  };

  // Acción de Guardar
  const saveMinion = () => {
    // Validación básica
    if (!formData.nombre.trim()) return alert('El nombre es obligatorio');

    if (isNew) {
      // Crear: Generamos ID temporal y despachamos
      dispatch(addMinion({ ...formData, id: Date.now() }));
    } else {
      // Editar: Actualizamos
      dispatch(updateMinion(formData));
    }
    navigate('/minions');
  };

  // Resetear cambios (Cancelar edición)
  const cancelEdit = () => {
    if (isNew) {
      navigate('/minions');
    } else {
      setIsEditing(false);
      // Recargar datos originales del store
      const original = minions.find((m) => m.id.toString() === id);
      if (original) setFormData(original);
    }
  };

  return {
    formData,
    isNew,
    isEditing,
    setIsEditing,
    handleChange,
    handleSkillsChange,
    saveMinion,
    cancelEdit
  };
};
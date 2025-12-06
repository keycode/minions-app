import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Pencil, X } from 'lucide-react';

// Redux & Tipos
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addMinion, updateMinion } from '../features/minions/minionsSlice';
import type { Minion } from '../models/minion';

// Componentes
import { MultiSelect } from '../components/MultiSelect';

export const MinionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const minions = useAppSelector((state) => state.minions.data);

  // Determinar modo: Si no hay ID, es "Crear". Si hay ID, es "Ver" o "Editar".
  const isNew = !id;
  
  // Estado local para el modo Edición (si es nuevo, nace editando)
  const [isEditing, setIsEditing] = useState(isNew);

  // Estado del Formulario
  const [formData, setFormData] = useState<Minion>({
    id: Date.now(), // ID temporal para nuevos
    name: '',
    bio: '',
    birth: '',
    side: 'Minionés Español', // Valor por defecto
    skills: [],
    img: 'https://m.media-amazon.com/images/I/71eY2B9sCmL._AC_SL1500_.jpg' // Foto por defecto
  });

  // Cargar datos si estamos viendo/editando uno existente
  useEffect(() => {
    if (!isNew && id) {
      const foundMinion = minions.find((m) => m.id.toString() === id);
      if (foundMinion) {
        setFormData(foundMinion);
      } else {
        // Si no existe (ej: recargar página con ID falso), volver al inicio
        navigate('/minions');
      }
    }
  }, [id, minions, isNew, navigate]);

  // Manejo de cambios en Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Guardar (Create o Update)
  const handleSave = () => {
    if (!formData.name) return alert('El nombre es obligatorio');

    if (isNew) {
      // Crear nuevo
      dispatch(addMinion({ ...formData, id: Date.now() })); // Generamos ID único real
    } else {
      // Actualizar existente
      dispatch(updateMinion(formData));
    }
    
    // Volver al listado
    navigate('/minions');
  };

  // Listas para selects
  const languageOptions = ['Minionés Español', 'Minionés Inglés', 'Minionés Portugués', 'Minionés Cantonés'];
  const skillOptions = ['Mecánico', 'Físico', 'Químico', 'Arquitecto', 'Músico', 'Villano'];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER: Botón Volver y Título */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/minions')} className="flex items-center gap-2 text-gray-500 hover:text-blue-900 font-medium">
                    <ArrowLeft size={20} /> Volver
                </button>
                <h1 className="text-2xl font-bold text-blue-900">
                    {isNew ? 'Nuevo Minion' : 'Ficha del Minion'}
                </h1>
            </div>
            
            {/* Botones de Acción (Editar / Guardar / Cancelar) */}
            <div className="flex gap-2">
                {!isEditing && !isNew && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-yellow-500"
                    >
                        <Pencil size={18} /> Editar
                    </button>
                )}
                
                {isEditing && (
                    <>
                        <button 
                            onClick={() => isNew ? navigate('/minions') : setIsEditing(false)}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
                        >
                            <X size={18} /> Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700"
                        >
                            <Save size={18} /> Guardar
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* TARJETA PRINCIPAL (Layout 2 columnas) */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            
            {/* COLUMNA IZQUIERDA: Foto */}
            <div className="w-full md:w-1/3 bg-gray-50 p-8 flex flex-col items-center justify-start border-r border-gray-100">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-yellow-400 shadow-inner mb-4 bg-white">
                    <img src={formData.img} alt="Minion" className="w-full h-full object-contain" />
                </div>
                {/* Input URL foto (solo editable) */}
                {isEditing && (
                    <div className="w-full">
                        <label className="text-xs font-bold text-gray-400 uppercase">URL de la Foto</label>
                        <input 
                            type="text" 
                            name="img"
                            value={formData.img}
                            onChange={handleChange}
                            className="w-full text-xs p-2 border rounded mt-1"
                            placeholder="http://..."
                        />
                    </div>
                )}
            </div>

            {/* COLUMNA DERECHA: Datos */}
            <div className="w-full md:w-2/3 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Campo: Nombre */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                        <input 
                            type="text" 
                            name="name"
                            disabled={!isEditing}
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500' : 'border-transparent bg-gray-50 font-bold text-lg'}`}
                        />
                    </div>

                    {/* Campo: Idioma */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Idioma</label>
                        {isEditing ? (
                            <select 
                                name="side"
                                value={formData.side}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                            >
                                {languageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : (
                            <div className="p-3 bg-gray-50 rounded-lg border border-transparent text-gray-700">{formData.side}</div>
                        )}
                    </div>

                    {/* Campo: Fecha Nacimiento */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Fecha de Cumpleaños</label>
                        <input 
                            type="date" 
                            name="birth"
                            disabled={!isEditing}
                            value={formData.birth}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`}
                        />
                    </div>

                    {/* Campo: Habilidades (Reusamos MultiSelect si es edición, o lista tags si es ver) */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Habilidades</label>
                        {isEditing ? (
                            <MultiSelect 
                                label="Seleccionar habilidades"
                                options={skillOptions}
                                selected={formData.skills}
                                onChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                                        {skill}
                                    </span>
                                ))}
                                {formData.skills.length === 0 && <span className="text-gray-400 italic">Sin habilidades... todavía</span>}
                            </div>
                        )}
                    </div>

                    {/* Campo: Descripción / Bio */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Descripción</label>
                        <textarea 
                            name="bio"
                            disabled={!isEditing}
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-600 italic'}`}
                        />
                    </div>

                </div>
                
                {/* Nota informativa estilo PDF */}
                <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r text-sm text-yellow-800">
                    <strong>Información del Sistema:</strong>
                    <p className="mt-1">Esta ficha contiene toda la información relevante del minion. Para editar los campos, haz clic en el botón "Editar" en la parte superior derecha.</p>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
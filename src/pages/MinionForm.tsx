import React from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Pencil, X, Sparkles, Loader2 } from 'lucide-react';

import { useMinionForm } from '../hooks/useMinionForm';
import { MultiSelect } from '../components/MultiSelect';

const timestampToString = (ts: number): string => {
    if (!ts) return '';
    // Multiplicamos por 1000 porque JS usa milisegundos
    return new Date(ts * 1000).toISOString().split('T')[0];
};

export const MinionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const DEFAULT_IMAGE = '/uploads/default.png';

  const { 
    formData, 
    isNew, 
    isEditing, 
    setIsEditing, 
    isGenerating,
    handleChange, 
    handleSkillsChange,  
    saveMinion,         
    cancelEdit,          
    handleGenerateAiImage  
  } = useMinionForm(id);

  // Listas estáticas para la UI
  const languageOptions = ['Minionés Español', 'Minionés Inglés', 'Minionés Portugués', 'Minionés Cantonés'];
  const habilidadesOptions = ['Mecánico', 'Físico', 'Químico', 'Arquitecto', 'Músico', 'Villano'];

  return (
    // CAMBIO 1: Padding reducido en móvil (p-4)
    <div className="min-h-screen p-4 font-sans bg-gray-50 md:p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER RESPONSIVO */}
        {/* CAMBIO 2: flex-col en móvil para que título y botones no choquen */}
        <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
            <div className="flex items-center w-full gap-4 sm:w-auto">
                <button onClick={() => navigate('/minions')} className="flex items-center gap-2 font-medium text-gray-500 hover:text-blue-900">
                    <ArrowLeft size={20} /> <span className="sm:inline">Volver</span>
                </button>
                <h1 className="text-2xl font-bold text-blue-900 truncate">
                    {isNew ? 'Nuevo Minion' : 'Ficha del Minion'}
                </h1>
            </div>
            
            {/* Botones de Acción */}
            <div className="flex justify-end w-full gap-2 sm:w-auto">
                {!isEditing && !isNew && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-center flex-1 gap-2 px-6 py-2 font-bold text-black transition-colors bg-yellow-400 rounded-lg shadow-sm sm:flex-none hover:bg-yellow-500"
                    >
                        <Pencil size={18} /> Editar
                    </button>
                )}
                
                {isEditing && (
                    <>
                        <button 
                            onClick={cancelEdit}
                            disabled={isGenerating}
                            className="flex items-center justify-center flex-1 gap-2 px-4 py-2 font-medium text-gray-600 transition-colors bg-white border border-gray-300 rounded-lg sm:flex-none hover:bg-gray-100 disabled:opacity-50"
                        >
                            <X size={18} /> Cancelar
                        </button>
                        <button 
                            onClick={saveMinion}
                            disabled={isGenerating} 
                            className="flex items-center justify-center flex-1 gap-2 px-6 py-2 font-bold text-black transition-colors bg-yellow-400 rounded-lg shadow-sm sm:flex-none hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} /> Guardar
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* TARJETA PRINCIPAL */}
        {/* Ya era responsive (flex-col md:flex-row), mantenemos eso */}
        <div className="flex flex-col overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl md:flex-row">
            
            {/* COLUMNA IZQUIERDA: Foto */}
            {/* CAMBIO 3: Padding reducido en móvil (p-6) vs desktop (md:p-8) */}
            <div className="flex flex-col items-center justify-start w-full p-6 border-b border-gray-100 md:w-1/3 bg-gray-50 md:p-8 md:border-b-0 md:border-r">
                <div className="relative w-48 h-48 mb-4 overflow-hidden bg-white border-4 border-yellow-400 rounded-full shadow-inner md:w-64 md:h-64">
                   <img 
                        src={formData.img || DEFAULT_IMAGE} 
                        alt="Minion" 
                        className="object-contain w-full h-full"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== DEFAULT_IMAGE) {
                                target.src = DEFAULT_IMAGE;
                            }
                        }}
                    />
                    
                    {isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Loader2 className="text-white animate-spin" size={32} />
                        </div>
                    )}
                </div>
                
                {isEditing && (
                    <button 
                        type="button" 
                        onClick={handleGenerateAiImage}
                        disabled={isGenerating}
                        className={`mt-2 mb-4 w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 px-4 rounded-lg shadow transition-all
                            ${isGenerating 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-cyan-600 hover:bg-cyan-500 active:scale-95'
                            }`}
                    >
                        {isGenerating ? (
                            <> <Loader2 size={16} className="animate-spin" /> Creando... </>
                        ) : (
                            <> <Sparkles size={16} /> Generar con Nano Banana </>
                        )}
                    </button>
                )}

                {isEditing && (
                    <div className="w-full">
                        <label className="text-xs font-bold text-gray-400 uppercase">URL de la Foto</label>
                        <input 
                            type="text" 
                            name="img"
                            value={formData.img}
                            onChange={handleChange}
                            disabled={isGenerating}
                            className="w-full p-2 mt-1 text-xs text-gray-600 border rounded"
                            placeholder="http://..."
                        />
                    </div>
                )}
            </div>

            {/* COLUMNA DERECHA: DATOS */}
            {/* CAMBIO 4: Padding reducido en móvil (p-4 o p-6) */}
            <div className="w-full p-4 md:w-2/3 md:p-8">
                {/* El grid ya era responsive (cols-1 md:cols-2), perfecto */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    
                    {/* NOMBRE */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Nombre</label>
                        <input type="text" name="nombre" disabled={!isEditing || isGenerating} value={formData.nombre} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500' : 'border-transparent bg-gray-50 font-bold text-lg'}`} />
                    </div>

                    {/* IDIOMA */}
                    <div>
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Idioma</label>
                        {isEditing ? (
                            <select name="idioma" value={formData.idioma} onChange={handleChange} disabled={isGenerating} className="w-full p-3 bg-white border border-gray-300 rounded-lg">
                                {languageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : (<div className="p-3 text-gray-700 border border-transparent rounded-lg bg-gray-50">{formData.idioma}</div>)}
                    </div>

                    {/* FECHA */}
                    <div>
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Fecha de Cumpleaños</label>
                        <input 
                            type="date" 
                            name="fecha_cumpleanos"
                            disabled={!isEditing || isGenerating}
                            value={timestampToString(formData.fecha_cumpleanos)}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`}
                        />
                    </div>

                    {/* HABILIDADES */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Habilidades</label>
                        {isEditing ? (
                            <MultiSelect label="Seleccionar habilidades" options={habilidadesOptions} selected={formData.habilidades} onChange={handleSkillsChange} />
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.habilidades.map(skill => <span key={skill} className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-full">{skill}</span>)}
                            </div>
                        )}
                    </div>

                    {/* EXPERIENCIA Y ESTADO */}
                    <div>
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Experiencia (Años)</label>
                        <input type="number" name="experiencia" min="0" disabled={!isEditing || isGenerating} value={formData.experiencia} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>
                    <div>
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Estado</label>
                        <input type="text" name="estado" disabled={!isEditing || isGenerating} value={formData.estado} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Descripción</label>
                        <textarea name="descripcion" disabled={!isEditing || isGenerating} value={formData.descripcion} onChange={handleChange} rows={3} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-600 italic'}`} />
                    </div>

                    {/* ALTURA Y OJOS */}
                    <div>
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Altura (cm)</label>
                        <input type="number" name="altura" disabled={!isEditing || isGenerating} value={formData.altura} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>
                    <div>
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Cantidad de Ojos</label>
                        <input type="number" name="numero_ojos" min="1" max="3" disabled={!isEditing || isGenerating} value={formData.numero_ojos} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>

                    {/* COMIDA Y PERSONALIDAD */}
                    <div>
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Comida Favorita</label>
                        <input type="text" name="comida_favorita" disabled={!isEditing || isGenerating} value={formData.comida_favorita} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>
                    <div>
                        <label className="block mb-1 text-xs font-bold text-gray-400 uppercase">Personalidad</label>
                        <input type="text" name="personalidad" disabled={!isEditing || isGenerating} value={formData.personalidad} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
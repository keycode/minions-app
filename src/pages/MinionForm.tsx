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
    
    //const hasGeneratedImage = formData.img?.includes('/uploads/minion_images/');

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/minions')} className="flex items-center gap-2 text-gray-500 hover:text-blue-900 font-medium">
                    <ArrowLeft size={20} /> Volver
                </button>
                <h1 className="text-2xl font-bold text-blue-900">
                    {isNew ? 'Nuevo Minion' : 'Ficha del Minion'}
                </h1>
            </div>
            
            {/* Botones de Acción */}
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
                            onClick={cancelEdit}
                            // Deshabilitamos cancelar si se está generando la imagen para evitar inconsistencias
                            disabled={isGenerating}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50"
                        >
                            <X size={18} /> Cancelar
                        </button>
                        <button 
                            onClick={saveMinion}
                            disabled={isGenerating} // No guardar mientras genera
                            className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} /> Guardar
                        </button>
                    </>
                )}
                  </div>
                  
        </div>

        {/* TARJETA PRINCIPAL */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            
            {/* COLUMNA IZQUIERDA: Foto */}
            <div className="w-full md:w-1/3 bg-gray-50 p-8 flex flex-col items-center justify-start border-r border-gray-100">
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-yellow-400 shadow-inner mb-4 bg-white relative">
                   <img 
                        src={formData.img || DEFAULT_IMAGE} 
                        alt="Minion" 
                        className="w-full h-full object-contain"
                        // AÑADIR ESTO: Si la imagen falla, pon la default
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Evita bucle infinito si la default también falla
                            if (target.src !== DEFAULT_IMAGE) {
                                target.src = DEFAULT_IMAGE;
                            }
                        }}
                    />
                    
                    {/* Overlay opcional mientras carga para dar feedback visual sobre la foto */}
                    {isGenerating && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="text-white animate-spin" size={32} />
                        </div>
                    )}
                </div>
                
           
               {isEditing   && (
                    <button 
                        type="button" 
                        onClick={handleGenerateAiImage}
                        disabled={isGenerating} // Deshabilita click
                        className={`mt-2 mb-4 w-full flex items-center justify-center gap-2 text-black text-sm font-bold py-2 px-4 rounded-lg shadow transition-all
                            ${isGenerating 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-yellow-400  hover:bg-yellow-400 active:scale-95'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> 
                                Creando Minion...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} /> 
                                Invocar a Nano Banana
                            </>
                        )}
                    </button>
                )}

                {/* Input URL foto (solo editable) */}
                {isEditing && (
                    <div className="w-full">
                        <label className="text-xs font-bold text-gray-400 uppercase">URL de la Foto</label>
                        <input 
                            type="text" 
                            name="img"
                            value={formData.img}
                            onChange={handleChange}
                            disabled={isGenerating}
                            className="w-full text-xs p-2 border rounded mt-1"
                            placeholder="http://..."
                        />
                    </div>
                )}
            </div>

  
            {/* COLUMNA DERECHA: DATOS  */}
            <div className="w-full md:w-2/3 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* NOMBRE */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                        <input type="text" name="nombre" disabled={!isEditing || isGenerating} value={formData.nombre} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 font-bold text-lg'}`} />
                    </div>

                    {/* IDIOMA */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Idioma</label>
                        {isEditing ? (
                            <select name="idioma" value={formData.idioma} onChange={handleChange} disabled={isGenerating} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                                {languageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : (<div className="p-3 bg-gray-50 rounded-lg border border-transparent text-gray-700">{formData.idioma}</div>)}
                    </div>

                    {/* FECHA (Conversión visual) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Fecha de Cumpleaños</label>
                        <input 
                            type="date" 
                            name="fecha_cumpleanos" // Nombre coincide con JSON
                            disabled={!isEditing || isGenerating}
                            // CONVERTIMOS EL TIMESTAMP A STRING PARA QUE EL INPUT LO ENTIENDA
                            value={timestampToString(formData.fecha_cumpleanos)}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`}
                        />
                    </div>

                    {/* HABILIDADES */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Habilidades</label>
                        {isEditing ? (
                            <MultiSelect label="Seleccionar habilidades" options={habilidadesOptions} selected={formData.habilidades} onChange={handleSkillsChange} />
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.habilidades.map(skill => <span key={skill} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">{skill}</span>)}
                            </div>
                        )}
                    </div>

                    {/* EXPERIENCIA Y ESTADO */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Experiencia (Años)</label>
                        <input type="number" name="experiencia" min="0" disabled={!isEditing || isGenerating} value={formData.experiencia} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Estado</label>
                        <input type="text" name="estado" disabled={!isEditing || isGenerating} value={formData.estado} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>

                    {/* DESCRIPCIÓN (Antes BIO) */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Descripción</label>
                        <textarea name="descripcion" disabled={!isEditing || isGenerating} value={formData.descripcion} onChange={handleChange} rows={3} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-600 italic'}`} />
                    </div>

                    {/* ALTURA Y OJOS */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Altura (cm)</label>
                        <input 
                            type="number" // Ahora es Number
                            name="altura" 
                            disabled={!isEditing || isGenerating} 
                            value={formData.altura} 
                            onChange={handleChange} 
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cantidad de Ojos</label>
                        <input type="number" name="numero_ojos" min="1" max="3" disabled={!isEditing || isGenerating} value={formData.numero_ojos} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>

                    {/* COMIDA FAVORITA Y PERSONALIDAD */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Comida Favorita</label>
                        <input type="text" name="comida_favorita" disabled={!isEditing || isGenerating} value={formData.comida_favorita} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Personalidad</label>
                        <input type="text" name="personalidad" disabled={!isEditing || isGenerating} value={formData.personalidad} onChange={handleChange} className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
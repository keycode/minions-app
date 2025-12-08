import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Zap, Loader2, Download } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { removeFromWorkshop, generateGroupImage, clearWorkshop } from '../features/minions/minionsSlice';

export const Workshop: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Sacamos los datos del taller
  const { workshop, groupImage, isGeneratingGroup } = useAppSelector((state) => state.minions);

  const handleGenerate = () => {
    if (workshop.length === 0) return;
    dispatch(generateGroupImage(workshop));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/minions')} className="text-gray-500 hover:text-blue-900 font-medium flex items-center gap-2">
                    <ArrowLeft size={20} /> Volver al Dashboard
                </button>
               
            </div>
            
            {workshop.length > 0 && (
                <button onClick={() => dispatch(clearWorkshop())} className="text-red-500 text-sm hover:underline">
                    Vaciar taller
                </button>
            )}
        </div>
  <div className="flex items-center justify-between mb-8"> <h1 className="text-3xl font-bold text-blue-900">Taller de Misión</h1></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* COLUMNA IZQUIERDA: LISTA DE MINIONS */}
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Equipo Seleccionado ({workshop.length})</h2>
                
                {workshop.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center text-gray-400">
                        <p>No hay minions seleccionados para la misión.</p>
                        <button onClick={() => navigate('/minions')} className="mt-4 text-blue-600 font-bold hover:underline">Ir a reclutar</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workshop.map(minion => (
                            <div key={minion.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                <img src={minion.img || '/uploads/default.png'} alt={minion.nombre} className="w-16 h-16 rounded-full object-contain bg-gray-50 border border-gray-200" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">{minion.nombre}</h3>
                                    <p className="text-xs text-gray-500">{minion.habilidades.join(', ')}</p>
                                </div>
                                <button 
                                    onClick={() => dispatch(removeFromWorkshop(minion.id))}
                                    className="text-gray-300 hover:text-red-500 p-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* COLUMNA DERECHA: GENERADOR IA */}
            <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl shadow-xl p-6 text-white text-center sticky top-6">
                    <h2 className="text-2xl font-bold mb-2">Foto de Equipo</h2>
                

                    {/* ZONA DE IMAGEN GENERADA */}
                    <div className="aspect-video bg-black/30 rounded-lg mb-6 flex items-center justify-center overflow-hidden border border-white/10 relative group">
                        {isGeneratingGroup ? (
                            <div className="text-center">
                                <Loader2 size={40} className="animate-spin mx-auto mb-2 text-yellow-400" />
                                <span className="text-xs animate-pulse">Invocando a Nano Banana...</span>
                            </div>
                        ) : groupImage ? (
                            <>
                                <img src={groupImage} alt="Squad" className="w-full h-full object-cover" />
                                <a 
                                    href={groupImage} 
                                    download="minion_squad.jpg"
                                    target="_blank"
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity gap-2 font-bold"
                                >
                                    <Download size={20} /> Descargar
                                </a>
                            </>
                        ) : (
                            <span className="text-white/20 text-4xl font-black">?</span>
                        )}
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={workshop.length === 0 || isGeneratingGroup}
                        className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                            ${workshop.length === 0 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : isGeneratingGroup
                                    ? 'bg-yellow-600 text-yellow-100 cursor-wait'
                                    : 'bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105'
                            }`}
                    >
                        {isGeneratingGroup ? 'Generando...' : <><Zap size={20} /> Generar Squad</>}
                    </button>
                    
                    {workshop.length === 0 && (
                        <p className="text-xs text-red-300 mt-2">Selecciona al menos un minion</p>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
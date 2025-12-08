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
    // CAMBIO 1: Padding responsive (p-4 en móvil, p-6 en desktop)
    <div className="min-h-screen p-4 font-sans bg-gray-50 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER RESPONSIVO */}
        {/* CAMBIO 2: Flex-col en móvil para alinear título y botón de vaciar */}
        <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center md:mb-8">
            <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center sm:gap-4 sm:w-auto">
                <button onClick={() => navigate('/minions')} className="flex items-center self-start gap-2 font-medium text-gray-500 hover:text-blue-900 sm:self-auto">
                    <ArrowLeft size={20} /> <span className="text-sm sm:text-base">Volver</span>
                </button>
                <h1 className="text-2xl font-bold text-blue-900 md:text-3xl">Taller de Misión</h1>
            </div>
            
            {workshop.length > 0 && (
                <button 
                    onClick={() => dispatch(clearWorkshop())} 
                    className="flex items-center self-end gap-1 px-3 py-1 text-sm text-red-500 rounded-full hover:underline sm:self-auto bg-red-50 sm:bg-transparent sm:p-0"
                >
                    <Trash2 size={14} className="sm:hidden" /> Vaciar taller
                </button>
            )}
        </div>

        {/* GRID PRINCIPAL */}
 
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:gap-8">
            
            {/* COLUMNA 1 (LISTA): Ocupa 2 espacios en desktop */}
            {/* Usamos order-2 en móvil si quisiéramos que el generador salga primero, pero aquí mantenemos el orden natural */}
            <div className="space-y-4 lg:col-span-1">
                <div className="flex items-end justify-between">
                    <h2 className="text-lg font-bold text-gray-700 md:text-xl">Equipo Seleccionado ({workshop.length})</h2>
                </div>
                
                {workshop.length === 0 ? (
                    <div className="p-8 py-12 text-center text-gray-400 bg-white border border-gray-100 shadow rounded-xl">
                        <p>No hay minions seleccionados.</p>
                        <button onClick={() => navigate('/minions')} className="mt-4 font-bold text-blue-600 hover:underline">Ir a reclutar</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 md:gap-4">
                        {workshop.map(minion => (
                            <div key={minion.id} className="flex items-center gap-3 p-3 transition-shadow bg-white border border-gray-100 rounded-lg shadow-sm md:p-4 md:gap-4 hover:shadow-md">
                                <img src={minion.img || '/uploads/default.png'} alt={minion.nombre} className="object-contain w-12 h-12 border border-gray-200 rounded-full md:w-16 md:h-16 bg-gray-50" />
                                <div className="flex-1 min-w-0"> {/* min-w-0 para que el truncate funcione */}
                                    <h3 className="font-bold text-gray-800 truncate">{minion.nombre}</h3>
                                    <p className="text-xs text-gray-500 truncate">{minion.habilidades.join(', ')}</p>
                                </div>
                                <button 
                                    onClick={() => dispatch(removeFromWorkshop(minion.id))}
                                    className="p-2 text-gray-300 transition-colors rounded-full hover:text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* COLUMNA 2 (GENERADOR): Ocupa 1 espacio en desktop */}
            {/* CAMBIO 4: Sticky solo en desktop (lg:sticky). En móvil va al final del flujo normal */}
            <div className="lg:col-span-2">
                <div className="p-5 text-center text-white shadow-xl bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl md:p-6 lg:sticky lg:top-6">
                    <h2 className="mb-2 text-xl font-bold md:text-2xl">Foto de Equipo</h2>
                    <p className="mb-6 text-xs text-blue-200 md:text-sm">Genera una imagen con IA de todos tus minions listos para la misión.</p>

                    {/* ZONA DE IMAGEN GENERADA */}
                    <div className="relative flex items-center justify-center mb-6 overflow-hidden border rounded-lg aspect-video bg-black/30 border-white/10 group">
                        {isGeneratingGroup ? (
                            <div className="p-4 text-center">
                                <Loader2 size={32} className="mx-auto mb-2 text-yellow-400 animate-spin" />
                                <span className="text-xs animate-pulse">Invocando a Nano Banana...</span>
                            </div>
                        ) : groupImage ? (
                            <>
                                <img src={groupImage} alt="Squad" className="object-cover w-full h-full" />
                                {/* En móvil el botón descargar siempre visible (opacity-100), en desktop hover */}
                                <a 
                                    href={groupImage} 
                                    download="minion_squad.jpg"
                                    target="_blank"
                                    className="absolute inset-0 flex items-center justify-center gap-2 font-bold text-white transition-opacity bg-black/40 md:bg-black/60 md:opacity-0 md:group-hover:opacity-100"
                                >
                                    <Download size={20} /> <span className="drop-shadow-md">Descargar</span>
                                </a>
                            </>
                        ) : (
                            <span className="text-4xl font-black text-white/20">?</span>
                        )}
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={workshop.length === 0 || isGeneratingGroup}
                        className={`w-full py-3 md:py-4 rounded-lg font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                            ${workshop.length === 0 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : isGeneratingGroup
                                    ? 'bg-yellow-600 text-yellow-100 cursor-wait'
                                    : 'bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95'
                            }`}
                    >
                        {isGeneratingGroup ? 'Generando...' : <><Zap size={20} /> Generar Squad</>}
                    </button>
                    
                    {workshop.length === 0 && (
                        <p className="inline-block px-2 py-1 mt-3 text-xs text-red-300 rounded bg-red-900/30">Selecciona al menos un minion</p>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
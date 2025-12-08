import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, Wrench, Hammer, Filter } from 'lucide-react';

// Hooks de Redux y Acciones
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { 
  fetchMinions, 
  deleteMinion, 
  setSearchFilter, 
  setLanguageFilter, 
  setSkillsFilter, 
  addToWorkshop
} from '../features/minions/minionsSlice';
import { useMinionFilters } from '../hooks/useMinionFilters';

// Componentes UI
import { MultiSelect } from '../components/MultiSelect';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Estado Local para paginación visual
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false); // Nuevo estado para colapsar filtros en móvil

  // Obtener estado global de Redux
  const { data, status, filters, workshop } = useAppSelector((state) => state.minions);

  // 1. Cargar datos
  useEffect(() => {
    // Si implementaste persistencia, quizás quieras chequear si data.length === 0
    if (data.length === 0 && status === 'idle') {
        dispatch(fetchMinions(currentPage));
    }
  }, [dispatch, currentPage, data.length, status]);

  // 2. Filtrado Optimizado
  const filteredMinions = useMinionFilters(data, filters);

  // --- PAGINACIÓN ---
  const ITEMS_PER_PAGE = 5; 
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentMinions = filteredMinions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMinions.length / ITEMS_PER_PAGE);

  // Manejadores
  const handleAddToWorkshop = (minion: any) => { dispatch(addToWorkshop(minion)); };
  const isInWorkshop = (id: string | number) => workshop.some(m => m.id === id);
  const handleDelete = (id: string | number) => {
    if (window.confirm('¿Seguro que quieres eliminar a este Minion de tu malvado plan?')) {
      dispatch(deleteMinion(id));
    }
  };

  const languageOptions = ['Minionés Español', 'Minionés Inglés', 'Minionés Portugués', 'Minionés Cantonés'];
  const skillOptions = ['Mecánico', 'Físico', 'Químico', 'Arquitecto', 'Músico'];

  return (
    // CAMBIO: Padding reducido en móvil (p-4) y mayor en desktop (md:p-6)
    <div className="min-h-screen p-4 font-sans text-gray-800 bg-gray-50 md:p-6">
      
      {/* HEADER y TÍTULO */}
      <div className="mx-auto mb-6 max-w-7xl md:mb-8">
        {/* Título y Botón Taller alineados */}
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
            <h1 className="text-2xl font-bold text-blue-900 md:text-3xl">Gestión de Minions</h1>
            
            <button 
                onClick={() => navigate('/workshop')}
                className="flex items-center justify-center w-full gap-2 px-6 py-2 font-bold text-black transition-transform bg-yellow-400 rounded-lg shadow-md md:w-auto hover:bg-yellow-500 md:py-3 active:scale-95"
            >
                <Wrench size={20} />
                <span className="md:hidden lg:inline">Ver Taller de Misión</span>
                <span className="hidden md:inline lg:hidden">Taller</span>
                {workshop.length > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 ml-1 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full">
                        {workshop.length}
                    </span>
                )}
            </button>
        </div>

        {/* --- BARRA DE FILTROS --- */}
        <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
          
          {/* Toggle de filtros para móvil (opcional para ahorrar espacio) */}
          <div className="flex items-center justify-between mb-2 md:hidden">
             <span className="text-sm font-bold text-gray-500">Filtros y Búsqueda</span>
             <button onClick={() => setShowFiltersMobile(!showFiltersMobile)} className="p-2 bg-gray-100 rounded">
                <Filter size={18} />
             </button>
          </div>

          <div className={`flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center ${showFiltersMobile ? 'block' : 'hidden'} md:flex`}>
            
            <div className="flex flex-col items-center w-full gap-4 md:flex-row xl:w-auto">
              {/* 1. Buscador */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.search}
                  onChange={(e) => dispatch(setSearchFilter(e.target.value))}
                />
              </div>

              {/* 2. Filtro de Idioma */}
              <div className="w-full md:w-48">
                  <select 
                      className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg outline-none appearance-none focus:ring-2 focus:ring-blue-500"
                      value={filters.language}
                      onChange={(e) => dispatch(setLanguageFilter(e.target.value))}
                  >
                      <option value="">Todos los idiomas</option>
                      {languageOptions.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                      ))}
                  </select>
              </div>

              {/* 3. Filtro de Habilidades */}
              <div className="w-full md:w-auto">
                 <MultiSelect 
                    label="Habilidades" 
                    options={skillOptions}
                    selected={filters.skills}
                    onChange={(selected) => dispatch(setSkillsFilter(selected))}
                />
              </div>
            </div>

            {/* Botón Añadir */}
            <button 
              onClick={() => navigate('/minions/new')}
              className="flex items-center justify-center w-full gap-2 px-6 py-2 mt-2 font-bold text-black transition-transform bg-yellow-400 rounded-lg shadow-md xl:mt-0 hover:bg-yellow-500 active:scale-95 md:w-auto"
            >
              <Plus size={20} />
              <span>Añadir nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- RESULTADOS --- */}
      <div className="mx-auto max-w-7xl">
        
        {/* ESTADO DE CARGA */}
        {status === 'loading' && (
            <div className="py-10 text-center bg-white rounded-lg shadow">
                <p className="font-medium text-gray-500">Cargando Minions...</p>
            </div>
        )}

        {/* SI NO HAY RESULTADOS */}
        {status !== 'loading' && currentMinions.length === 0 && (
             <div className="py-10 text-center text-gray-500 bg-white rounded-lg shadow">
                No se encontraron minions con esos filtros.
            </div>
        )}

        {/* === VISTA MÓVIL (TARJETAS) === 
            Visible solo en pantallas pequeñas (md:hidden)
        */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
            {currentMinions.map((minion) => (
                <div key={minion.id} className="flex flex-col gap-3 p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                    {/* Cabecera Tarjeta */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-blue-900">{minion.nombre}</h3>
                            <p className="text-sm text-gray-500">{minion.idioma}</p>
                        </div>
                        {/* Botón Taller en Móvil */}
                        <button 
                             onClick={() => handleAddToWorkshop(minion)}
                             disabled={isInWorkshop(minion.id)}
                             className={`p-2 rounded-full ${isInWorkshop(minion.id) ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}
                        >
                            <Hammer size={20} />
                        </button>
                    </div>

                    {/* Habilidades */}
                    <div className="flex flex-wrap gap-1">
                        {minion.habilidades.map((h, i) => (
                            <span key={i} className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-full">
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* Acciones Footer */}
                    <div className="flex justify-end gap-3 pt-3 mt-2 border-t">
                         <button onClick={() => navigate(`/minions/${minion.id}`)} className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye size={16} /> Ver
                         </button>
                         <button onClick={() => navigate(`/minions/${minion.id}`)} className="flex items-center gap-1 text-sm font-medium text-blue-600">
                            <Pencil size={16} /> Editar
                         </button>
                         <button onClick={() => handleDelete(minion.id)} className="flex items-center gap-1 text-sm text-red-500">
                            <Trash2 size={16} /> Borrar
                         </button>
                    </div>
                </div>
            ))}
        </div>

        {/* === VISTA ESCRITORIO (TABLA) === 
            Visible solo en pantallas medianas en adelante (hidden md:block)
        */}
        <div className="hidden overflow-hidden bg-white rounded-lg shadow-md md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm tracking-wider text-gray-800 uppercase bg-yellow-400">
                  <th className="p-4 font-bold border-b border-yellow-500">Nombre</th>
                  <th className="p-4 font-bold border-b border-yellow-500">Idioma</th>
                  <th className="p-4 font-bold border-b border-yellow-500">Habilidad</th>
                  <th className="p-4 font-bold text-center border-b border-yellow-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                 {currentMinions.map((minion) => (
                    <tr key={minion.id} className="transition-colors border-b border-gray-100 hover:bg-blue-50">
                      <td className="p-4 font-medium">{minion.nombre}</td>
                      <td className="p-4">{minion.idioma}</td>
                      <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                             {minion.habilidades.join(', ')}
                          </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3 text-gray-500">
                          <button onClick={() => navigate(`/minions/${minion.id}`)} className="hover:text-blue-600" title="Ver"><Eye size={18} /></button>
                          <button onClick={() => navigate(`/minions/${minion.id}`)} className="hover:text-green-600" title="Editar"><Pencil size={18} /></button>
                          <button onClick={() => handleDelete(minion.id)} className="hover:text-red-600" title="Eliminar"><Trash2 size={18} /></button>
                          
                          {/* Botón Taller Desktop */}
                          <button 
                              onClick={() => handleAddToWorkshop(minion)}
                              disabled={isInWorkshop(minion.id)}
                              className={`ml-2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors
                                  ${isInWorkshop(minion.id) 
                                      ? 'bg-green-100 text-green-700 cursor-default' 
                                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  }`}
                          >
                              {isInWorkshop(minion.id) ? 'En taller' : <><Hammer size={14} /> Añadir</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PAGINACIÓN --- */}
        <div className="flex justify-center gap-2 p-4 mt-4">
            {/* Botones de paginación (mantienen estilo) */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        currentPage === pageNum 
                        ? 'bg-yellow-400 text-black font-bold shadow-sm' 
                        : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-300'
                    }`}
                >
                    {pageNum}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};
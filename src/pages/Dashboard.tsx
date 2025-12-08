import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';

// Hooks de Redux y Acciones
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { 
  fetchMinions, 
  deleteMinion, 
  setSearchFilter, 
  setLanguageFilter, 
  setSkillsFilter 
} from '../features/minions/minionsSlice';
import { useMinionFilters } from '../hooks/useMinionFilters';

// Componentes UI
import { MultiSelect } from '../components/MultiSelect';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Estado Local para paginación visual
  const [currentPage, setCurrentPage] = useState(1);

  // Obtener estado global de Redux
  const { data, status, filters } = useAppSelector((state) => state.minions);

  // 1. Cargar datos (Efecto secundario)
  // Requisito: "Implementa la paginación... utilizando el parámetro page de la API"
  useEffect(() => {
    dispatch(fetchMinions(currentPage));
  }, [dispatch, currentPage]);

  // 2. Filtrado Optimizado (Custom Hook)
  // Requisito: "useMemo... para optimizar cálculos costosos"
  const filteredMinions = useMinionFilters(data, filters);
// --- NUEVA LÓGICA DE PAGINACIÓN VISUAL ---
  const ITEMS_PER_PAGE = 5; // Mostramos 5 por página
  
  // Calculamos índices
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  
  // Estos son los minions que REALMENTE se pintan en la tabla
  const currentMinions = filteredMinions.slice(indexOfFirstItem, indexOfLastItem);

  // Calculamos total de páginas para pintar los botones correctos
  const totalPages = Math.ceil(filteredMinions.length / ITEMS_PER_PAGE);
  // Manejadores de eventos
  const handleDelete = (id: string | number) => {
    // Requisito: "Confirmación de eliminación... muestra un mensaje"
    if (window.confirm('¿Seguro que quieres eliminar a este Minion de tu malvado plan?')) {
      dispatch(deleteMinion(id));
    }
  };

  // Opciones para los filtros (Simuladas según diseño)
  const languageOptions = ['Minionés Español', 'Minionés Inglés', 'Minionés Portugués', 'Minionés Cantonés'];
  const skillOptions = ['Mecánico', 'Físico', 'Químico', 'Arquitecto', 'Músico'];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* HEADER y TÍTULO */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Gestión de Minions</h1>

        {/* --- BARRA DE HERRAMIENTAS (Filtros y Botones) --- */}
        {/* Requisito: "Buscador... Filtrado por idioma... y Habilidades" */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-center">
            {/* 1. Buscador por Palabra Clave */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por palabra clave"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.search}
                onChange={(e) => dispatch(setSearchFilter(e.target.value))}
              />
            </div>

            {/* 2. Filtro de Idioma (Select simple) */}
            <div className="w-full md:w-56">
                <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    value={filters.language}
                    onChange={(e) => dispatch(setLanguageFilter(e.target.value))}
                >
                    <option value="">Todos los idiomas</option>
                    {languageOptions.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
            </div>

            {/* 3. Filtro de Habilidades (MultiSelect Custom) */}
            <MultiSelect 
                label="Habilidades" 
                options={skillOptions}
                selected={filters.skills}
                onChange={(selected) => dispatch(setSkillsFilter(selected))}
            />
          </div>

          {/* Botón de Añadir */}
          <button 
            onClick={() => navigate('/minions/new')}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg shadow-md transition-transform active:scale-95 w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            Añadir nuevo minion
          </button>
        </div>
      </div>

      {/* --- TABLA DE RESULTADOS --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Estilo amarillo según PDF Page 1 */}
              <tr className="bg-yellow-400 text-gray-800 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-yellow-500">Nombre</th>
                <th className="p-4 font-bold border-b border-yellow-500">Idioma</th>
                <th className="p-4 font-bold border-b border-yellow-500">Habilidad</th>
                <th className="p-4 font-bold border-b border-yellow-500 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {status === 'loading' ? (
                 <tr><td colSpan={4} className="p-8 text-center">Cargando Minions...</td></tr>
              ) : currentMinions.length > 0 ? (
                currentMinions.map((minion) => (
                  <tr key={minion.id} className="hover:bg-blue-50 border-b border-gray-100 transition-colors">
                    <td className="p-4 font-medium">{minion.nombre}</td>
                    <td className="p-4">{minion.idioma}</td>
                    <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                           {/* Renderizamos las habilidades separadas por coma */}
                            {minion.habilidades.join(', ')}
                        </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3 text-gray-500">
                        <button onClick={() => navigate(`/minions/${minion.id}`)} className="hover:text-blue-600" title="Ver">
                            <Eye size={18} />
                        </button>
                        <button onClick={() => navigate(`/minions/${minion.id}`)} className="hover:text-green-600" title="Editar">
                            <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(minion.id)} className="hover:text-red-600" title="Eliminar">
                            <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                        No se encontraron minions con esos filtros.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINACIÓN --- */}
       <div className="flex justify-center p-4 gap-2 bg-gray-50 border-t border-gray-200">
            {/* Generamos array de botones según el número de páginas */}
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
            
            {/* Texto informativo */}
            <span className="text-xs text-gray-400 self-center ml-2">
                Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredMinions.length)} de {filteredMinions.length}
            </span>
        </div>
      </div>
    </div>
  );
};
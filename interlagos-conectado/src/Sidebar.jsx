import { ChevronRight, Tag, Info, Star, Heart, ShieldCheck, LogIn } from 'lucide-react';

export default function Sidebar({ currentView, categories = [], selectedCategory, setSelectedCategory, handleAdminClick, isAdmin, user, onLogin }) {

    const renderContent = () => {
        switch (currentView) {
            case 'merchants':
                return (
                    <>
                        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3 px-2">Categorias</h3>
                        <div className="space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${selectedCategory === cat.id
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <span className={`${selectedCategory === cat.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                                        {cat.icon}
                                    </span>
                                    {cat.label}
                                    {selectedCategory === cat.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
                                </button>
                            ))}
                        </div>
                    </>

                );

            case 'donations':
                return (
                    <>
                        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3 px-2">Doações</h3>
                        <div className="space-y-1">
                            {['Campanhas', 'ONGs', 'Voluntariado'].map((item) => (
                                <button
                                    key={item}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    <Heart size={16} className="text-gray-400" />
                                    {item}
                                </button>
                            ))}
                        </div>
                    </>
                );

            case 'utility':
                return (
                    <>
                        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3 px-2">Acesso Rápido</h3>
                        <div className="space-y-1">
                            {['Emergência', 'Saúde', 'Serviços Públicos'].map((section) => (
                                <button
                                    key={section}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    <Info size={16} className="text-gray-400" />
                                    {section}
                                </button>
                            ))}
                        </div>
                    </>
                );

            case 'news':
                return (
                    <>
                        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3 px-2">Filtros</h3>
                        <div className="space-y-1">
                            {['Urgente', 'Eventos', 'Geral', 'Trânsito'].map((filter) => (
                                <button
                                    key={filter}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    <Tag size={16} className="text-gray-400" />
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </>
                );

            case 'ads':
                return (
                    <>
                        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3 px-2">Categorias</h3>
                        <div className="space-y-1">
                            {['Vagas de Emprego', 'Vendas', 'Serviços', 'Imóveis'].map((cat) => (
                                <button
                                    key={cat}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    <Tag size={16} className="text-gray-400" />
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <aside className="hidden lg:block w-64 sticky top-24 shrink-0 animate-in fade-in slide-in-from-left-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[300px]">
                <div key={currentView} className="animate-in fade-in slide-in-from-left-2 duration-300">
                    {renderContent()}
                </div>
            </div>

            {/* Banner Promocional Sidebar */}
            <div className="mt-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white text-center shadow-lg">
                <Star className="mx-auto mb-2 text-yellow-400 fill-yellow-400" size={24} />
                <h4 className="font-bold text-sm mb-1">Quer destacar seu negócio?</h4>
                <p className="text-xs text-indigo-100 mb-3">Apareça para milhares de vizinhos todos os dias.</p>
                <button onClick={handleAdminClick} className="w-full bg-white text-indigo-700 text-xs font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                    Cadastrar Agora
                </button>
            </div>
        </aside>
    );
}

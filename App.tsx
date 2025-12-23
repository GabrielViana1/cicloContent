import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Layout, 
  Calendar as CalendarIcon, 
  Lightbulb, 
  BookOpen, 
  Trash2, 
  Edit2, 
  Wand2, 
  ChevronRight,
  Video,
  FileText, 
  CheckCircle, 
  Send,
  Smartphone,
  LogOut,
  User as UserIcon,
  Lock,
  Loader2
} from 'lucide-react';
import { 
  ContentItem, 
  ContentStatus, 
  ContentType, 
  Platform, 
  HookItem, 
  CTAItem 
} from './types';
import { 
  INITIAL_HOOKS, 
  INITIAL_CTAS, 
  STATUS_CONFIG, 
  TYPE_CONFIG, 
  PLATFORM_CONFIG 
} from './constants';
import { generateContentScript, generateMoreIdeas } from './services/geminiService';
import { useAuth } from './context/AuthContext';
import { contentService } from './services/contentService';

// Define o caminho da logo. Coloque sua imagem em /public/logo.png ou ajuste a string abaixo.
const LOGO_SRC = 'https://scontent-gru1-2.cdninstagram.com/v/t51.2885-19/476313876_2305927659781234_1567068422599777714_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-gru1-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2QHkWbOu_Q8cup5SJ_2IxdpyAn_m6dYd5HukUR-ZMjlMLLNv9eLOhy7-0ip7Vtsg_hg&_nc_ohc=Y74lICW3I-gQ7kNvwEYHpCh&_nc_gid=Qm0cfUF1WmN7RZXpDz880A&edm=APoiHPcBAAAA&ccb=7-5&oh=00_AfnBack3T-LkgFvQ8PzvX-zikHR072GOE_RfRIetFm6tJA&oe=695087FF&_nc_sid=22de04';

const LogoMark: React.FC<{ size?: 'sm' | 'lg'; alt?: string }> = ({ size = 'sm', alt = 'CicloContent logo' }) => {
  const [isBroken, setIsBroken] = useState(false);
  const fallbackSize = size === 'lg' ? 'text-3xl' : 'text-lg';

  if (!LOGO_SRC || isBroken) {
    return <span className={`${fallbackSize} font-bold text-white`}>D</span>;
  }

  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      className="w-full h-full object-contain"
      onError={() => setIsBroken(true)}
    />
  );
};

// --- Components ---

// 0. Login Screen
const LoginScreen: React.FC = () => {
  const { login, signUp } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        const { error } = await login(email, password);
        if (error) throw error;
      } else {
        // Validação de senha
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }

        const { error } = await signUp(email, password);
        if (error) throw error;
        else alert('Conta criada! Verifique seu email ou faça login.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setConfirmPassword('');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
             <LogoMark size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">CicloContent AI</h1>
          <p className="text-indigo-100 mt-2 text-sm">Organize, crie e publique suas ideias.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Confirmar Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {isLoginMode ? 'Entrar' : 'Criar Conta'} <ChevronRight size={18} />
                </>
              )}
            </button>
            
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={toggleMode}
                className="text-sm text-indigo-600 font-medium hover:underline"
              >
                {isLoginMode ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// 1. Idea Generator Modal
interface IdeaGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: string) => Promise<void>;
  isGenerating: boolean;
}

const IdeaGeneratorModal: React.FC<IdeaGeneratorModalProps> = ({ isOpen, onClose, onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(topic);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Lightbulb className="text-indigo-600" size={24} />
            Gerar Ideias com IA
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sobre qual tema você quer ideias?
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900 placeholder-gray-400"
              placeholder="Ex: Nutrição Esportiva, Dicas de Excel, Viagens..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              Deixe em branco para usar os temas dos seus conteúdos atuais.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg bg-white border border-gray-200"
              disabled={isGenerating}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isGenerating}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Gerando...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Gerar Ideias
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Idea/Content Modal (Create/Edit)
interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ContentItem | null;
  onSave: (item: ContentItem) => Promise<void>;
  hooks: HookItem[];
  ctas: CTAItem[];
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, item, onSave, hooks, ctas }) => {
  const [formData, setFormData] = useState<Partial<ContentItem>>({
    title: '',
    idea: '',
    context: '',
    theme: '',
    type: ContentType.REEL,
    platform: Platform.INSTAGRAM,
    status: ContentStatus.IDEA,
    script: '',
    cta: '',
    scheduledDate: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        title: '',
        idea: '',
        context: '',
        theme: '',
        type: ContentType.REEL,
        platform: Platform.INSTAGRAM,
        status: ContentStatus.IDEA,
        script: '',
        cta: '',
        scheduledDate: '',
      });
    }
  }, [item, isOpen]);

  const handleGenerate = async () => {
    if (!formData.idea) return;
    setIsGenerating(true);
    try {
      const result = await generateContentScript(
        formData.idea, 
        formData.type || ContentType.REEL, 
        formData.context || ''
      );
      if (result) {
        setFormData(prev => ({
          ...prev,
          title: result.title,
          script: result.script,
          cta: result.suggestedCta,
          status: prev.status === ContentStatus.IDEA ? ContentStatus.DRAFT : prev.status
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const newItem: ContentItem = {
      id: item?.id || crypto.randomUUID(), // Temporarily generate ID if new
      title: formData.title || formData.idea || 'Sem Título',
      idea: formData.idea || '',
      context: formData.context || '',
      theme: formData.theme || '',
      type: formData.type || ContentType.REEL,
      platform: formData.platform || Platform.INSTAGRAM,
      status: formData.status || ContentStatus.IDEA,
      script: formData.script || '',
      cta: formData.cta || '',
      scheduledDate: formData.scheduledDate,
      createdAt: item?.createdAt || Date.now(),
    };
    
    await onSave(newItem);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {item ? 'Editar Conteúdo' : 'Nova Ideia'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Idea Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ideia Principal</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900 placeholder-gray-400"
                placeholder="Ex: 3 Dicas de Marketing..."
                value={formData.idea}
                onChange={e => setFormData({...formData, idea: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as ContentType})}
                >
                  {Object.values(ContentType).map(t => (
                    <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value as Platform})}
                >
                  {Object.values(Platform).map(p => (
                    <option key={p} value={p}>{PLATFORM_CONFIG[p].label}</option>
                  ))}
                </select>
              </div>
            </div>

             {/* AI Action */}
             {!item || formData.status === ContentStatus.IDEA ? (
               <div className="bg-indigo-50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                 <div className="text-sm text-indigo-800 text-center sm:text-left">
                   Transforme sua ideia simples em um roteiro completo com IA.
                 </div>
                 <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !formData.idea}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex-shrink-0"
                 >
                   {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                   {isGenerating ? 'Gerando...' : 'Gerar Conteúdo'}
                 </button>
               </div>
             ) : null}

            {/* Details Section (Visible if not just an idea or manually expanded) */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Post</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Script / Legenda</label>
                  {/* Hook Picker */}
                  <div className="relative group">
                     <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Inserir Hook</span>
                     <div className="absolute right-0 bottom-full mb-2 w-64 bg-white shadow-xl rounded-lg border hidden group-hover:block p-2 max-h-48 overflow-y-auto z-10">
                        <p className="text-xs font-bold text-gray-500 mb-2">Selecione um Hook:</p>
                        {hooks.map(h => (
                          <div 
                            key={h.id} 
                            className="text-xs p-2 hover:bg-gray-100 cursor-pointer rounded text-gray-900"
                            onClick={() => setFormData(prev => ({...prev, script: (prev.script ? prev.script + '\n' : '') + h.text}))}
                          >
                            {h.text}
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg h-32 bg-white text-gray-900"
                  value={formData.script}
                  onChange={e => setFormData({...formData, script: e.target.value})}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">CTA (Chamada para Ação)</label>
                  <div className="relative group">
                     <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Inserir CTA</span>
                     <div className="absolute right-0 bottom-full mb-2 w-64 bg-white shadow-xl rounded-lg border hidden group-hover:block p-2 max-h-48 overflow-y-auto z-10">
                        {ctas.map(c => (
                          <div 
                            key={c.id} 
                            className="text-xs p-2 hover:bg-gray-100 cursor-pointer rounded text-gray-900"
                            onClick={() => setFormData({...formData, cta: c.text})}
                          >
                            {c.text}
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
                  value={formData.cta}
                  onChange={e => setFormData({...formData, cta: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Data de Publicação</label>
                   <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
                    value={formData.scheduledDate}
                    onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                   <select
                    className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as ContentStatus})}
                   >
                     {Object.values(ContentStatus).map(s => (
                       <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                     ))}
                   </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg bg-white border border-gray-200">
                Cancelar
              </button>
              <button type="submit" disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2">
                {isSaving && <Loader2 className="animate-spin" size={16} />}
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// 3. View: Dashboard / Kanban
const KanbanView: React.FC<{
  items: ContentItem[]; 
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void; 
  onMoveItem: (id: string, newStatus: ContentStatus) => void;
}> = ({ items, onEdit, onDelete, onMoveItem }) => {
  const [activeStatus, setActiveStatus] = useState<ContentStatus>(ContentStatus.IDEA);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ContentStatus | null>(null);
  
  // -- TABS DRAG LOGIC (Header only) --
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isDraggingTabs, setIsDraggingTabs] = useState(false);
  const [tabsStartX, setTabsStartX] = useState(0);
  const [tabsScrollLeft, setTabsScrollLeft] = useState(0);

  const handleTabsMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    setIsDraggingTabs(true);
    setTabsStartX(e.pageX - tabsRef.current.offsetLeft);
    setTabsScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleTabsMouseLeave = () => {
    setIsDraggingTabs(false);
  };

  const handleTabsMouseUp = () => {
    setIsDraggingTabs(false);
  };

  const handleTabsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTabs || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - tabsStartX) * 2;
    tabsRef.current.scrollLeft = tabsScrollLeft - walk;
  };

  // -- BOARD DRAG LOGIC (Background) --
  const boardRef = useRef<HTMLDivElement>(null);
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);
  const [boardStartX, setBoardStartX] = useState(0);
  const [boardScrollLeft, setBoardScrollLeft] = useState(0);

  const handleBoardMouseDown = (e: React.MouseEvent) => {
    // Ignore if clicking inside a card
    if ((e.target as HTMLElement).closest('.kanban-card')) return;
    
    setIsDraggingBoard(true);
    if (boardRef.current) {
      setBoardStartX(e.pageX - boardRef.current.offsetLeft);
      setBoardScrollLeft(boardRef.current.scrollLeft);
      // Disable snap while dragging for smoothness
      boardRef.current.style.scrollSnapType = 'none';
      boardRef.current.style.cursor = 'grabbing';
    }
  };

  const handleBoardMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingBoard || !boardRef.current) return;
    e.preventDefault();
    const x = e.pageX - boardRef.current.offsetLeft;
    const walk = (x - boardStartX) * 1.5; // Multiplier for speed
    boardRef.current.scrollLeft = boardScrollLeft - walk;
  };

  const handleBoardMouseUp = () => {
    setIsDraggingBoard(false);
    if (boardRef.current) {
      boardRef.current.style.cursor = 'default';
      // Re-enable snap logic (timeout to let momentum settle if we added momentum, but here standard drag)
      // Or we can leave snap off until next interaction.
      // Let's restore snap after a short delay to allow final position to settle or snap
      setTimeout(() => {
        if (boardRef.current) {
            boardRef.current.style.scrollSnapType = '';
        }
      }, 100);
    }
  };

  const handleBoardMouseLeave = () => {
     if (isDraggingBoard) {
       handleBoardMouseUp();
     }
  };


  // -- AUTO SCROLL ON DRAG (For Cards) --
  const handleAutoScroll = (e: React.DragEvent) => {
    // Only scroll if we are dragging a card
    if (!draggingId || !boardRef.current) return;

    // Prevent default to allow for potential drop logic if needed (usually handled by columns)
    // But here we mainly want to read position
    
    const { left, right } = boardRef.current.getBoundingClientRect();
    const mouseX = e.clientX;
    const threshold = 100; // px from edge
    const scrollSpeed = 15; // px per event

    if (mouseX > right - threshold) {
      boardRef.current.scrollLeft += scrollSpeed;
    } else if (mouseX < left + threshold) {
      boardRef.current.scrollLeft -= scrollSpeed;
    }
  };

  // -- CARD DRAG AND DROP --

  const handleDragStart = (e: React.DragEvent, id: string) => {
    // We allow dragging
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {}, 0);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverColumn(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, status: ContentStatus) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDropOnColumn = (e: React.DragEvent, status: ContentStatus) => {
    e.preventDefault();
    
    // Disable scroll snap briefly to prevent snapping back to original column
    if (boardRef.current) {
      boardRef.current.style.scrollSnapType = 'none';
    }

    if (draggingId) {
      onMoveItem(draggingId, status);
      // Wait for React to update list, then scroll
      setTimeout(() => {
        scrollToColumn(status);
        // Re-enable snap after animation
        setTimeout(() => {
          if (boardRef.current) {
            boardRef.current.style.scrollSnapType = '';
          }
        }, 500);
      }, 50);
    }
    setDraggingId(null);
    setDragOverColumn(null);
  };

  // Handle Card Click
  const handleCardClick = (e: React.MouseEvent, item: ContentItem) => {
    onEdit(item);
  };

  const scrollToColumn = (status: ContentStatus) => {
    setActiveStatus(status);
    if (boardRef.current) {
      // Temporarily disable snap to allow smooth programmatic scroll
      boardRef.current.style.scrollSnapType = 'none';
      
      const index = Object.values(ContentStatus).indexOf(status);
      const children = boardRef.current.children;
      
      if (children[index]) {
        const target = children[index] as HTMLElement;
        const container = boardRef.current;
        
        // Calculate center position using getBoundingClientRect for precision
        const targetRect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeLeft = targetRect.left - containerRect.left; // Visual distance
        
        // Target offset (left) - Half container width + Half target width
        const scrollLeft = container.scrollLeft + relativeLeft - (container.clientWidth / 2) + (targetRect.width / 2);

        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
      
      // Re-enable snap after scroll finishes
      setTimeout(() => {
         if (boardRef.current) {
            boardRef.current.style.scrollSnapType = '';
         }
      }, 500);
    }
  };

  const handleScroll = () => {
    if (!boardRef.current) return;
    
    const container = boardRef.current;
    // Ponto central do container visível
    const containerCenter = container.scrollLeft + (container.clientWidth / 2);
    
    let closestStatus = activeStatus;
    let minDistance = Infinity;

    // Encontrar a coluna que está mais próxima do centro
    Array.from(container.children).forEach((child, index) => {
      const htmlChild = child as HTMLElement;
      // Ponto central da coluna
      const childCenter = htmlChild.offsetLeft + (htmlChild.clientWidth / 2);
      const distance = Math.abs(containerCenter - childCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        const statuses = Object.values(ContentStatus);
        if (statuses[index]) {
           closestStatus = statuses[index];
        }
      }
    });

    if (closestStatus !== activeStatus) {
      setActiveStatus(closestStatus);
    }
  };

  const groups = useMemo(() => {
    const g: Record<string, ContentItem[]> = {
      [ContentStatus.IDEA]: [],
      [ContentStatus.DRAFT]: [],
      [ContentStatus.RECORDING]: [],
      [ContentStatus.READY]: [],
      [ContentStatus.PUBLISHED]: []
    };
    items.forEach(item => {
      if (g[item.status]) g[item.status].push(item);
    });
    return g;
  }, [items]);

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Tabs (Drop Zones) */}
      <div 
        ref={tabsRef}
        onMouseDown={handleTabsMouseDown}
        onMouseLeave={handleTabsMouseLeave}
        onMouseUp={handleTabsMouseUp}
        onMouseMove={handleTabsMouseMove}
        className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar px-1 items-center cursor-grab active:cursor-grabbing select-none"
      >
        {Object.values(ContentStatus).map(status => (
          <button
            key={status}
            onClick={() => scrollToColumn(status)}
            onDragOver={(e) => handleDragOverColumn(e, status)}
            onDrop={(e) => handleDropOnColumn(e, status)}
            className={`
              flex flex-shrink-0 items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all border
              ${activeStatus === status 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
              ${dragOverColumn === status ? 'ring-2 ring-indigo-400 scale-105 bg-indigo-50' : ''}
            `}
          >
            {STATUS_CONFIG[status].label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeStatus === status ? 'bg-white/20' : 'bg-gray-100'}`}>
              {groups[status].length}
            </span>
          </button>
        ))}
      </div>

      {/* Columns Container (Board) */}
      <div 
        ref={boardRef}
        onMouseDown={handleBoardMouseDown}
        onMouseMove={handleBoardMouseMove}
        onMouseUp={handleBoardMouseUp}
        onMouseLeave={handleBoardMouseLeave}
        onDragOver={handleAutoScroll} 
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar flex-1 snap-x snap-mandatory md:snap-none cursor-grab relative"
      >
        {Object.values(ContentStatus).map(status => {
           const StatusIcon = STATUS_CONFIG[status].icon;
           const isDragOver = dragOverColumn === status;
           
           return (
            <div 
              key={status} 
              onDragOver={(e) => handleDragOverColumn(e, status)}
              onDrop={(e) => handleDropOnColumn(e, status)}
              className={`
                flex-shrink-0 flex-col w-[85vw] md:w-[300px] md:min-w-[280px] snap-center h-full flex transition-colors rounded-lg
                ${isDragOver ? 'bg-indigo-50 ring-2 ring-indigo-300' : ''}
              `}
            >
              <div className={`p-3 rounded-t-lg font-semibold flex items-center gap-2 ${STATUS_CONFIG[status].color.split(' ')[0]} bg-opacity-50 select-none`}>
                <StatusIcon size={18} />
                {STATUS_CONFIG[status].label}
                <span className="ml-auto bg-white/50 px-2 py-0.5 rounded text-xs text-gray-800">
                  {groups[status].length}
                </span>
              </div>
              <div className="bg-gray-50/50 flex-1 p-2 rounded-b-lg overflow-y-auto space-y-3 border border-gray-100 min-h-0">
                {groups[status].map(item => {
                  const PlatIcon = PLATFORM_CONFIG[item.platform].icon;
                  const isDragging = draggingId === item.id;
                  
                  return (
                    <div 
                      key={item.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => handleCardClick(e, item)}
                      className={`
                        kanban-card bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-grab hover:shadow-md transition-all group relative select-none
                        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${item.status === ContentStatus.PUBLISHED ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                           {TYPE_CONFIG[item.type].label}
                         </span>
                         <button 
                          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                          className="text-gray-300 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                      <h3 className="font-medium text-gray-800 line-clamp-2 mb-2">{item.title}</h3>
                      {item.idea && item.status === ContentStatus.IDEA && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.idea}</p>
                      )}
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <PlatIcon size={14} className={PLATFORM_CONFIG[item.platform].color} />
                          {item.scheduledDate && (
                             <span>{new Date(item.scheduledDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {groups[status].length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8 italic select-none pointer-events-none">
                    {isDragOver ? 'Solte aqui' : 'Vazio'}
                  </div>
                )}
              </div>
            </div>
           )
        })}
      </div>
    </div>
  );
};

// 4. View: Simple Calendar List
const CalendarList: React.FC<{
  items: ContentItem[];
  onEdit: (item: ContentItem) => void;
}> = ({ items, onEdit }) => {
  const sortedItems = useMemo(() => {
    return items
      .filter(i => i.scheduledDate)
      .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());
  }, [items]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b bg-gray-50 font-medium text-gray-700">Próximas Postagens</div>
      <div className="divide-y divide-gray-100">
        {sortedItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhum post agendado.</div>
        ) : (
          sortedItems.map(item => {
            const date = new Date(item.scheduledDate!);
            const day = date.getDate();
            const month = date.toLocaleDateString('pt-BR', { month: 'short' });
            const PlatIcon = PLATFORM_CONFIG[item.platform].icon;

            return (
              <div key={item.id} onClick={() => onEdit(item)} className="p-4 flex items-center hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex-shrink-0 w-14 h-14 bg-indigo-50 text-indigo-600 rounded-lg flex flex-col items-center justify-center mr-4">
                  <span className="text-sm uppercase font-bold">{month}</span>
                  <span className="text-xl font-bold">{day}</span>
                </div>
                <div className="flex-1">
                   <h4 className="font-medium text-gray-900 line-clamp-1">{item.title}</h4>
                   <div className="flex items-center gap-2 mt-1">
                      <PlatIcon size={14} className={PLATFORM_CONFIG[item.platform].color} />
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[item.status].color}`}>
                        {STATUS_CONFIG[item.status].label}
                      </span>
                   </div>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// 5. View: Tools (Hooks & CTAs)
const ToolsLibrary: React.FC<{
  hooks: HookItem[];
  ctas: CTAItem[];
}> = ({ hooks, ctas }) => {
  const [activeTab, setActiveTab] = useState<'hooks' | 'ctas'>('hooks');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, show a toast here
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('hooks')}
          className={`flex-1 py-2 rounded-lg font-medium text-center transition-colors ${activeTab === 'hooks' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          Banco de Hooks
        </button>
        <button 
          onClick={() => setActiveTab('ctas')}
          className={`flex-1 py-2 rounded-lg font-medium text-center transition-colors ${activeTab === 'ctas' ? 'bg-pink-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          Biblioteca de CTAs
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'hooks' ? (
          <div className="grid gap-4">
            {hooks.map(hook => (
              <div key={hook.id} className="p-4 border rounded-lg hover:border-indigo-300 transition-colors group relative bg-gray-50">
                <span className="absolute top-2 right-2 text-[10px] text-gray-400 bg-gray-200 px-2 rounded-full">{hook.category}</span>
                <p className="font-medium text-gray-800 pr-16">"{hook.text}"</p>
                <button 
                  onClick={() => copyToClipboard(hook.text)}
                  className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1"
                >
                  <Edit2 size={12} /> Copiar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
             {ctas.map(cta => (
              <div key={cta.id} className="p-4 border rounded-lg hover:border-pink-300 transition-colors bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${cta.isFavorite ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">"{cta.text}"</p>
                    <button 
                      onClick={() => copyToClipboard(cta.text)}
                      className="mt-3 text-sm text-pink-600 font-medium hover:text-pink-800 flex items-center gap-1"
                    >
                      <Edit2 size={12} /> Copiar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// --- Main App ---

export default function App() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'board' | 'calendar' | 'tools'>('board');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [hooks] = useState<HookItem[]>(INITIAL_HOOKS);
  const [ctas] = useState<CTAItem[]>(INITIAL_CTAS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIdeaGenOpen, setIsIdeaGenOpen] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Carregar items do Supabase quando o usuário muda
  useEffect(() => {
    if (user) {
      setIsLoadingData(true);
      contentService.fetchItems()
        .then(data => setItems(data))
        .catch(err => console.error(err))
        .finally(() => setIsLoadingData(false));
    } else {
      setItems([]);
    }
  }, [user]);

  const handleSaveItem = async (item: ContentItem) => {
    if (!user) return;
    
    // Otimistic Update (Atualiza UI antes do banco)
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        const newItems = [...prev];
        newItems[idx] = item;
        return newItems;
      }
      return [item, ...prev];
    });

    // Salva no banco
    await contentService.upsertItem(item, user.id);
  };

  const handleMoveItem = async (id: string, newStatus: ContentStatus) => {
     // Otimistic Update
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));

    // Salva no banco
    await contentService.updateStatus(id, newStatus);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este conteúdo?')) {
      // Otimistic Update
      setItems(prev => prev.filter(i => i.id !== id));
      
      // Deleta do banco
      await contentService.deleteItem(id);
    }
  };

  const handleEditItem = (item: ContentItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleNewIdea = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openIdeaGenerator = () => {
    setIsIdeaGenOpen(true);
  };

  const handleConfirmGenerateIdeas = async (topic: string) => {
      if(!user) return;
      setIsGeneratingIdeas(true);
      try {
        const themes = [...new Set(items.map(i => i.theme).filter(Boolean) as string[])];
        const newIdeas = await generateMoreIdeas(topic, themes);
        
        if (newIdeas.length > 0) {
            const newContentItems: ContentItem[] = newIdeas.map(idea => ({
                id: crypto.randomUUID(),
                title: idea,
                idea: idea,
                theme: topic || '',
                type: ContentType.POST, // Default
                platform: Platform.INSTAGRAM, // Default
                status: ContentStatus.IDEA,
                script: '',
                cta: '',
                createdAt: Date.now()
            }));
            
            // Otimistic UI
            setItems(prev => [...newContentItems, ...prev]);
            setIsIdeaGenOpen(false);

            // Persist all new items (could be batched in real world)
            for (const item of newContentItems) {
               await contentService.upsertItem(item, user.id);
            }

        } else {
            alert('Não foi possível gerar ideias no momento.');
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao gerar ideias.');
      } finally {
        setIsGeneratingIdeas(false);
      }
  }

  if (loading) {
     return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-3 shadow-sm h-16 flex-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              <LogoMark />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">Ciclo<span className="text-indigo-600">Content</span></h1>
          </div>
          <div className="flex gap-2 items-center">
             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-medium text-gray-900">{user?.email?.split('@')[0]}</span>
                <span className="text-[10px] text-gray-500">{user?.email}</span>
             </div>

             <button 
               onClick={openIdeaGenerator}
               className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
             >
               <Lightbulb size={16} />
               Gerar Ideias
             </button>
             {/* Mobile Generate Ideas Button */}
             <button 
               onClick={openIdeaGenerator}
               className="md:hidden flex items-center justify-center w-10 h-10 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
             >
               <Wand2 size={20} />
             </button>

             <button 
               onClick={handleNewIdea}
               className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
             >
               <Plus size={18} />
               <span className="hidden sm:inline">Nova Ideia</span>
               <span className="sm:hidden">Novo</span>
             </button>

             <button 
               onClick={() => logout()}
               className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
               title="Sair"
             >
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 h-[calc(100dvh-130px)] md:h-[calc(100dvh-64px)] overflow-hidden">
        {isLoadingData ? (
           <div className="h-full flex items-center justify-center text-gray-400 gap-2">
             <Loader2 className="animate-spin" /> Carregando seus conteúdos...
           </div>
        ) : (
          <>
            {activeTab === 'board' && (
              <KanbanView 
                items={items} 
                onEdit={handleEditItem} 
                onDelete={handleDeleteItem} 
                onMoveItem={handleMoveItem}
              />
            )}
            {activeTab === 'calendar' && (
               <div className="h-full overflow-y-auto">
                 <CalendarList items={items} onEdit={handleEditItem} />
               </div>
            )}
            {activeTab === 'tools' && (
               <div className="h-full overflow-y-auto pt-4">
                 <ToolsLibrary hooks={hooks} ctas={ctas} />
               </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('board')}
          className={`flex flex-col items-center text-xs ${activeTab === 'board' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <Layout size={20} />
          <span className="mt-1">Quadro</span>
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center text-xs ${activeTab === 'calendar' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <CalendarIcon size={20} />
          <span className="mt-1">Calendário</span>
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`flex flex-col items-center text-xs ${activeTab === 'tools' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <BookOpen size={20} />
          <span className="mt-1">Biblioteca</span>
        </button>
      </nav>

      <ContentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={editingItem}
        onSave={handleSaveItem}
        hooks={hooks}
        ctas={ctas}
      />

      <IdeaGeneratorModal 
        isOpen={isIdeaGenOpen}
        onClose={() => setIsIdeaGenOpen(false)}
        onGenerate={handleConfirmGenerateIdeas}
        isGenerating={isGeneratingIdeas}
      />
    </div>
  );
}

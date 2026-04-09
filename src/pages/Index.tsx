import { useNavigate } from 'react-router-dom'
import WebGLTextDistortion from '@/components/WebGLTextDistortion'
import Icon from '@/components/ui/icon'

const navItems = [
  { label: 'Видео архив', icon: 'Play', route: '/video' },
  { label: 'Документы', icon: 'FileText', route: null },
  { label: 'Заявки на закупку', icon: 'ShoppingCart', route: null },
]

const modules = [
  {
    icon: 'Play',
    title: 'Видео архив',
    description: 'Корпоративная библиотека обучающих и рабочих видеоматериалов',
    tag: 'Медиа',
    route: '/video',
  },
  {
    icon: 'FileText',
    title: 'Документы',
    description: 'Просмотр регламентов, инструкций и корпоративных документов',
    tag: 'База знаний',
    route: null,
  },
  {
    icon: 'ShoppingCart',
    title: 'Заявки на закупку',
    description: 'Подача и отслеживание заявок на приобретение товаров и услуг',
    tag: 'Закупки',
    route: null,
  },
]

const Index = () => {
  const navigate = useNavigate()
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* WebGL Background */}
      <WebGLTextDistortion />

      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">

        {/* Top Navigation */}
        <header className="pointer-events-auto flex items-center justify-between px-8 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Icon name="Building2" size={20} className="text-white/70" />
            <span className="text-white/90 font-mono text-sm tracking-widest uppercase">
              Corp Portal
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => item.route && navigate(item.route)}
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono text-xs tracking-wider uppercase"
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </nav>
          <button className="text-white/50 hover:text-white transition-colors font-mono text-xs tracking-wider uppercase flex items-center gap-2">
            <Icon name="LogIn" size={14} />
            Войти
          </button>
        </header>

        {/* Center Hero Text */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="mb-4">
            <span className="font-mono text-xs tracking-[0.4em] text-white/30 uppercase">
              Корпоративный портал
            </span>
          </div>
          <h1 className="font-mono text-4xl md:text-6xl font-bold text-white/90 mb-6 leading-tight tracking-tight">
            Все данные.<br />
            <span className="text-white/40">Один портал.</span>
          </h1>
          <p className="font-mono text-sm text-white/30 max-w-md mb-10 leading-relaxed tracking-wide">
            Видео, документы и заявки на закупку — в едином защищённом пространстве
          </p>
          <button className="pointer-events-auto font-mono text-xs tracking-[0.3em] uppercase border border-white/30 hover:border-white/70 hover:bg-white/5 text-white/70 hover:text-white px-8 py-3 transition-all duration-300">
            Войти в систему
          </button>
        </div>

        {/* Bottom Module Cards */}
        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-3 gap-px border-t border-white/10">
          {modules.map((mod) => (
            <button
              key={mod.title}
              onClick={() => mod.route && navigate(mod.route)}
              className="group flex flex-col gap-3 p-6 bg-black/60 hover:bg-white/5 transition-all duration-300 text-left border-r border-white/10 last:border-r-0"
            >
              <div className="flex items-center justify-between">
                <Icon name={mod.icon} size={18} className="text-white/40 group-hover:text-white/80 transition-colors" />
                <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase">
                  {mod.tag}
                </span>
              </div>
              <div>
                <div className="font-mono text-sm text-white/70 group-hover:text-white transition-colors mb-1">
                  {mod.title}
                </div>
                <div className="font-mono text-[11px] text-white/25 leading-relaxed">
                  {mod.description}
                </div>
              </div>
              <div className="flex items-center gap-1 text-white/20 group-hover:text-white/50 transition-colors">
                <span className="font-mono text-[10px] tracking-widest uppercase">Открыть</span>
                <Icon name="ArrowRight" size={10} />
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Index
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/icon'

interface Video {
  id: number
  title: string
  category: string
  duration: string
  date: string
  description: string
  thumbnail: string
  src: string
}

const VIDEOS: Video[] = [
  {
    id: 1,
    title: 'Вводный инструктаж по охране труда',
    category: 'Охрана труда',
    duration: '14:32',
    date: '12.03.2026',
    description: 'Обязательный инструктаж для всех новых сотрудников. Правила безопасности на рабочем месте.',
    thumbnail: '',
    src: '',
  },
  {
    id: 2,
    title: 'Процедура согласования закупок',
    category: 'Закупки',
    duration: '08:17',
    date: '01.04.2026',
    description: 'Пошаговое руководство по подаче и согласованию заявок на закупку товаров и услуг.',
    thumbnail: '',
    src: '',
  },
  {
    id: 3,
    title: 'Корпоративные стандарты коммуникации',
    category: 'HR',
    duration: '22:05',
    date: '28.02.2026',
    description: 'Внутренние стандарты деловой переписки, взаимодействия с клиентами и партнёрами.',
    thumbnail: '',
    src: '',
  },
  {
    id: 4,
    title: 'Работа с корпоративным порталом',
    category: 'IT',
    duration: '11:48',
    date: '05.04.2026',
    description: 'Обзор функций портала: видео архив, документы, заявки на закупку.',
    thumbnail: '',
    src: '',
  },
  {
    id: 5,
    title: 'Антикоррупционная политика компании',
    category: 'Комплаенс',
    duration: '17:24',
    date: '15.01.2026',
    description: 'Ключевые положения антикоррупционной политики и ответственность за нарушения.',
    thumbnail: '',
    src: '',
  },
  {
    id: 6,
    title: 'Обучение по пожарной безопасности',
    category: 'Охрана труда',
    duration: '09:53',
    date: '20.03.2026',
    description: 'Правила поведения при пожаре, эвакуационные маршруты, использование огнетушителей.',
    thumbnail: '',
    src: '',
  },
]

const CATEGORIES = ['Все', 'Охрана труда', 'Закупки', 'HR', 'IT', 'Комплаенс']

const CATEGORY_COLORS: Record<string, string> = {
  'Охрана труда': 'text-amber-400/70',
  'Закупки': 'text-blue-400/70',
  'HR': 'text-green-400/70',
  'IT': 'text-purple-400/70',
  'Комплаенс': 'text-red-400/70',
}

export default function VideoArchive() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('Все')
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const [search, setSearch] = useState('')

  const filtered = VIDEOS.filter((v) => {
    const matchCat = activeCategory === 'Все' || v.category === activeCategory
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono text-xs tracking-wider uppercase"
        >
          <Icon name="ArrowLeft" size={14} />
          Corp Portal
        </button>
        <div className="flex items-center gap-2">
          <Icon name="Play" size={16} className="text-white/50" />
          <span className="font-mono text-sm tracking-widest uppercase text-white/80">Видео архив</span>
        </div>
        <div className="w-24" />
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 p-6 gap-6 shrink-0">
          {/* Search */}
          <div className="relative">
            <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white/70 placeholder-white/20 font-mono text-xs pl-8 pr-3 py-2 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Categories */}
          <div>
            <div className="font-mono text-[10px] tracking-widest text-white/20 uppercase mb-3">Категории</div>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => {
                const count = cat === 'Все' ? VIDEOS.length : VIDEOS.filter((v) => v.category === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center justify-between px-3 py-2 font-mono text-xs transition-all text-left ${
                      activeCategory === cat
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-white/20">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-auto border-t border-white/10 pt-4">
            <div className="font-mono text-[10px] tracking-widest text-white/20 uppercase mb-3">Всего видео</div>
            <div className="font-mono text-3xl text-white/60">{VIDEOS.length}</div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">

          {/* Mobile search */}
          <div className="lg:hidden px-4 pt-4 pb-2">
            <div className="relative">
              <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white/70 placeholder-white/20 font-mono text-xs pl-8 pr-3 py-2 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Mobile categories */}
          <div className="lg:hidden flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${
                  activeCategory === cat
                    ? 'border-white/40 text-white bg-white/10'
                    : 'border-white/10 text-white/30 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-white/5">
            {filtered.map((video) => (
              <button
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group relative bg-black p-5 text-left flex flex-col gap-3 hover:bg-white/5 transition-all duration-200"
              >
                {/* Thumbnail placeholder */}
                <div className="relative w-full aspect-video bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                      <Icon name="Play" size={16} className="text-white/30 group-hover:text-white/60 transition-colors ml-0.5" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 font-mono text-[10px] text-white/50 px-2 py-0.5">
                    {video.duration}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] tracking-widest uppercase ${CATEGORY_COLORS[video.category] ?? 'text-white/30'}`}>
                    {video.category}
                  </span>
                  <span className="font-mono text-[10px] text-white/20">{video.date}</span>
                </div>

                {/* Title */}
                <div className="font-mono text-sm text-white/70 group-hover:text-white transition-colors leading-snug">
                  {video.title}
                </div>

                {/* Description */}
                <div className="font-mono text-[11px] text-white/25 leading-relaxed line-clamp-2">
                  {video.description}
                </div>

                <div className="flex items-center gap-1 text-white/20 group-hover:text-white/50 transition-colors mt-auto">
                  <span className="font-mono text-[10px] tracking-widest uppercase">Смотреть</span>
                  <Icon name="ArrowRight" size={10} />
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 gap-3 bg-black">
                <Icon name="VideoOff" size={32} className="text-white/10" />
                <div className="font-mono text-xs text-white/20">Ничего не найдено</div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-10"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Player area */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center border-b border-white/10">
              {activeVideo.src ? (
                <video
                  src={activeVideo.src}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
                    <Icon name="Play" size={24} className="text-white/30 ml-1" />
                  </div>
                  <div className="font-mono text-xs text-white/20 tracking-widest uppercase">
                    Видео не подключено
                  </div>
                </div>
              )}

              {/* Close */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white border border-white/10 hover:border-white/30 bg-black/60 transition-all"
              >
                <Icon name="X" size={14} />
              </button>
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] tracking-widest uppercase ${CATEGORY_COLORS[activeVideo.category] ?? 'text-white/30'}`}>
                  {activeVideo.category}
                </span>
                <div className="flex items-center gap-3 text-white/20 font-mono text-[10px]">
                  <span>{activeVideo.duration}</span>
                  <span>{activeVideo.date}</span>
                </div>
              </div>
              <div className="font-mono text-base text-white/80">{activeVideo.title}</div>
              <div className="font-mono text-xs text-white/30 leading-relaxed">{activeVideo.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Trash2,
  Book,
  Sparkles,
  PencilLine,
  Coffee,
  Sun,
  CloudRain,
  Leaf,
  Moon,
} from 'lucide-react';

const App = () => {
  const [story, setStory] = useState('');
  const [title, setTitle] = useState('Diário de Outono');
  const [isTyping, setIsTyping] = useState(false);
  const [savedStories, setSavedStories] = useState([]);
  const [theme, setTheme] = useState('autumn');
  const typingTimeoutRef = useRef(null);

  const themes = {
    autumn: {
      bg: '#fdfaf6',
      paper: '#fff9f0',
      accent: '#ffccdc',
      secondary: '#ffb3cc',
      icon: <Leaf className="w-4 h-4" />,
      name: 'Outono',
    },
    spring: {
      bg: '#fff0f5',
      paper: '#fff9fb',
      accent: '#d1ffcc',
      secondary: '#b3ffb3',
      icon: <Sun className="w-4 h-4" />,
      name: 'Primavera',
    },
    rain: {
      bg: '#f0f4f8',
      paper: '#f8fbff',
      accent: '#a0e4f1',
      secondary: '#80d4e1',
      icon: <CloudRain className="w-4 h-4" />,
      name: 'Chuva',
    },
    night: {
      bg: '#2d2a26',
      paper: '#3d3935',
      accent: '#d6cfc7',
      secondary: '#8c857d',
      icon: <Moon className="w-4 h-4" />,
      name: 'Noite',
      text: '#fdfaf6',
    },
  };

  const changeTheme = (newTheme) => {
    if (newTheme !== theme) {
      setTheme(newTheme);
      setStory('');
      setTitle(`Nova Crônica de ${themes[newTheme].name}`);
    }
  };

  useEffect(() => {
    if (isTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 800);
    }
  }, [story]);

  const handleSave = () => {
    if (!story.trim()) return;
    const newEntry = {
      id: Date.now(),
      title: title || 'Sem Título',
      content: story,
      date: new Date().toLocaleDateString('pt-BR'),
      theme: theme,
    };
    setSavedStories([newEntry, ...savedStories]);
  };

  const currentTheme = themes[theme];
  const isNight = theme === 'night';

  return (
    <div
      className="min-h-screen font-sans flex flex-col items-center p-4 md:p-8 relative overflow-x-hidden transition-colors duration-1000"
      style={{
        backgroundColor: currentTheme.bg,
        color: isNight ? currentTheme.text : '#4a443f',
      }}
    >
      {/* Elementos Decorativos de Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div
          className={`absolute top-10 right-10 w-64 h-64 border-2 rounded-full rotate-12 flex items-center justify-center ${
            isNight ? 'border-white/20' : 'border-[#d6cfc7]'
          }`}
        >
          <div
            className={`w-48 h-48 border rounded-full ${
              isNight ? 'border-white/10' : 'border-[#d6cfc7]'
            }`}
          />
        </div>
        <div
          className={`absolute bottom-20 left-10 text-9xl font-black select-none ${
            isNight ? 'text-white/5' : 'text-[#e8e2d9]'
          }`}
        >
          物語
        </div>

        {/* Animação Flutuante */}
        <div className="absolute top-20 left-1/4 animate-bounce opacity-40">
          {theme === 'autumn' && (
            <Leaf className="text-orange-300 w-12 h-12" />
          )}
          {theme === 'spring' && (
            <Sparkles className="text-pink-300 w-12 h-12" />
          )}
          {theme === 'rain' && (
            <CloudRain className="text-blue-300 w-12 h-12" />
          )}
          {theme === 'night' && (
            <Moon className="text-yellow-100 w-12 h-12" />
          )}
        </div>
      </div>

      <main className="z-10 w-full max-w-3xl flex flex-col gap-6">
        {/* Seletor de Estação e Modo Noturno */}
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          {Object.keys(themes).map((t) => (
            <button
              key={t}
              onClick={() => changeTheme(t)}
              className={`flex items-center gap-2 px-4 py-2 border-2 border-[#2d2a26] font-bold text-xs uppercase transition-all shadow-[2px_2px_0px_0px_rgba(45,42,38,1)] ${
                theme === t
                  ? 'bg-[#2d2a26] text-white -translate-y-1'
                  : 'bg-white text-[#2d2a26] hover:bg-gray-50'
              }`}
            >
              {themes[t].icon} {themes[t].name}
            </button>
          ))}
        </div>

        {/* Painel de Título */}
        <header
          className="relative border-4 border-[#2d2a26] p-6 shadow-[8px_8px_0px_0px_rgba(45,42,38,1)] transition-colors duration-500"
          style={{ backgroundColor: currentTheme.paper }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full">
              <div
                className={`${
                  isNight
                    ? 'bg-white text-[#2d2a26]'
                    : 'bg-[#2d2a26] text-white'
                } p-2 rounded-sm transition-colors`}
              >
                <PencilLine
                  className={`w-6 h-6 ${isTyping ? 'animate-pulse' : ''}`}
                />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`bg-transparent border-b-2 border-dashed transition-colors text-2xl font-black uppercase tracking-tighter outline-none w-full ${
                  isNight
                    ? 'border-white/20 text-white focus:border-white'
                    : 'border-[#d6cfc7] focus:border-[#2d2a26]'
                }`}
                placeholder="NOME DO CAPÍTULO..."
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 border-2 border-[#2d2a26] px-4 py-2 font-bold transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(45,42,38,1)] text-[#2d2a26]"
                style={{ backgroundColor: currentTheme.accent }}
              >
                <Save className="w-4 h-4" /> SALVAR
              </button>
              <button
                onClick={() => setStory('')}
                className={`p-2 border-2 border-[#2d2a26] transition-colors ${
                  isNight
                    ? 'bg-[#3d3935] text-white hover:bg-red-900/30'
                    : 'bg-white hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div
            className={`absolute -top-3 -left-3 border-2 border-[#2d2a26] text-[10px] px-2 py-1 font-bold rotate-[-5deg] ${
              isNight
                ? 'bg-white text-[#2d2a26]'
                : 'bg-[#2d2a26] text-white'
            }`}
          >
            ARC: {theme.toUpperCase()}
          </div>
        </header>

        {/* Área de Escrita */}
        <div
          className="relative border-4 border-[#2d2a26] p-8 shadow-[8px_8px_0px_0px_rgba(45,42,38,1)] min-h-[500px] transition-colors duration-500"
          style={{ backgroundColor: currentTheme.paper }}
        >
          {/* Grid decorativo adaptável */}
          <div
            className={`absolute inset-0 pointer-events-none opacity-[0.03] ${
              isNight
                ? 'bg-[radial-gradient(#fff_1px,transparent_1px)]'
                : 'bg-[radial-gradient(#000_1px,transparent_1px)]'
            } [background-size:20px_20px]`}
          />

          <textarea
            value={story}
            onChange={(e) => {
              setStory(e.target.value);
              setIsTyping(true);
            }}
            placeholder="Mude a estação para um novo começo..."
            className={`w-full h-full min-h-[450px] bg-transparent border-none focus:ring-0 text-xl leading-relaxed resize-none outline-none font-serif relative z-10 transition-colors ${
              isNight
                ? 'placeholder-white/10 text-white/90'
                : 'placeholder-gray-300 text-[#4a443f]'
            }`}
          />

          {/* Elementos Visuais Reativos */}
          <div className="absolute bottom-6 right-8 flex items-center gap-3">
            {isTyping && (
              <div className="flex gap-1 animate-bounce">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentTheme.accent }}
                />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentTheme.secondary }}
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    isNight ? 'bg-white/20' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
            <div
              className={`border border-[#2d2a26] px-3 py-1 text-[12px] font-bold ${
                isNight
                  ? 'bg-white text-[#2d2a26]'
                  : 'bg-[#2d2a26] text-white'
              }`}
            >
              {story.length} CARATERES
            </div>
          </div>
        </div>

        {/* Biblioteca de Memórias */}
        {savedStories.length > 0 && (
          <section className="mt-8 pb-20">
            <h3
              className={`flex items-center gap-2 text-lg font-black uppercase tracking-widest mb-6 ${
                isNight ? 'text-white' : ''
              }`}
            >
              <Book className="w-5 h-5" /> Crónicas Publicadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedStories.map((s) => (
                <div
                  key={s.id}
                  className={`border-2 border-[#2d2a26] p-5 hover:-translate-y-1 transition-all cursor-pointer group shadow-[4px_4px_0px_0px_rgba(45,42,38,1)]`}
                  style={{ backgroundColor: themes[s.theme].paper }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4
                      className={`font-black text-lg transition-colors line-clamp-1 ${
                        isNight
                          ? 'text-white group-hover:text-[#d6cfc7]'
                          : 'group-hover:text-blue-500'
                      }`}
                    >
                      {s.title}
                    </h4>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 border border-[#2d2a26] text-[#2d2a26]"
                      style={{
                        backgroundColor: themes[s.theme].accent,
                      }}
                    >
                      {s.date}
                    </span>
                  </div>
                  <p
                    className={`text-sm line-clamp-3 leading-relaxed italic ${
                      isNight ? 'text-white/60' : 'text-gray-600'
                    }`}
                  >
                    {s.content}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-1">
                      <div
                        className="w-3 h-3 rounded-full border border-black"
                        style={{
                          backgroundColor: themes[s.theme].accent,
                        }}
                      />
                    </div>
                    <Coffee
                      className={`w-4 h-4 transition-colors ${
                        isNight
                          ? 'text-white/20 group-hover:text-[#d6cfc7]'
                          : 'text-gray-300 group-hover:text-orange-300'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-auto mb-10 text-center z-10">
        <div
          className={`inline-block border-2 border-[#2d2a26] px-6 py-2 font-bold text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(45,42,38,1)] ${
            isNight ? 'bg-[#3d3935] text-white' : 'bg-white'
          }`}
        >
          Tecer Histórias é Libertar a Alma • 2026
        </div>
      </footer>
    </div>
  );
};

export default App;

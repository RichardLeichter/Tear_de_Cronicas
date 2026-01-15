
        const themes = {
            autumn: { bg: '--autumn-bg', panel: '--autumn-panel', accent: '#b07d4b', name: 'Outono', icon: '🍂', particle: '🍂' },
            spring: { bg: '--spring-bg', panel: '--spring-panel', accent: '#e63946', name: 'Primavera', icon: '🌸', particle: '🌸' },
            rain: { bg: '--rain-bg', panel: '--rain-panel', accent: '#1d3557', name: 'Chuva', icon: '💧', particle: '💧' },
            night: { bg: '--night-bg', panel: '--night-panel', accent: '#a5b1c2', name: 'Noite', icon: '🌙', text: '#e5e5e5', particle: '✨' }
        };

        let currentTheme = 'autumn';
        let savedStories = [];
        let typingTimer;
        let zenTimer;
        let editingStoryId = null;

        const body = document.getElementById('app-body');
        const editor = document.getElementById('story-editor');
        const titleInput = document.getElementById('story-title');
        const pulseDot = document.getElementById('pulse-dot');
        const editorContainer = document.getElementById('editor-container');

        function setTheme(themeKey) {
            const oldTheme = currentTheme;
            currentTheme = themeKey;
            const t = themes[themeKey];
            const isNight = themeKey === 'night';

            if (oldTheme !== themeKey) {
                editor.style.opacity = '0';
                setTimeout(() => {
                    if (!editingStoryId) {
                        editor.value = '';
                        titleInput.value = `Fragmentos de ${t.name}`;
                    }
                    updateTextInfo();
                    editor.style.opacity = '0.7';
                }, 400);
            }

            body.style.backgroundColor = `var(${t.bg})`;
            body.style.color = isNight ? t.text : '#222';
            body.classList.toggle('night', isNight);

            editorContainer.style.backgroundColor = `var(${t.panel})`;
            document.getElementById('floating-asset').innerText = t.icon;
            pulseDot.style.background = t.accent;
            editor.style.caretColor = t.accent;

            const labels = [document.getElementById('main-label'), document.getElementById('editor-info')];
            labels.forEach(l => l.style.color = t.accent);

            document.querySelectorAll('.station-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`btn-${themeKey}`).classList.add('active');

            renderStories();
        }

        function updateTextInfo() {
            const length = editor.value.length;
            document.getElementById('char-counter').innerText = `${length} Caracteres`;
        }

        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.innerText = themes[currentTheme].particle;

            const rect = editor.getBoundingClientRect();
            particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            particle.style.top = (rect.top + Math.random() * 100) + 'px';
            particle.style.fontSize = (Math.random() * 10 + 10) + 'px';

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 2000);
        }

        function clearEditor() {
            editorContainer.style.transform = 'scale(0.98)';
            editor.value = '';
            titleInput.value = `Fragmentos de ${themes[currentTheme].name}`;
            editingStoryId = null;
            setTimeout(() => editorContainer.style.transform = 'scale(1)', 200);
            updateTextInfo();
        }

        function exportStory(storyId = null) {
            let storyToExport;
            if (storyId) {
                storyToExport = savedStories.find(s => s.id === storyId);
            } else {
                if (!editor.value.trim()) return;
                storyToExport = {
                    title: titleInput.value,
                    content: editor.value
                };
            }

            if (!storyToExport) return;

            const text = `${storyToExport.title}\n\n${storyToExport.content}`;
            const blob = new Blob([text], { type: 'text/plain' });
            const anchor = document.createElement('a');
            anchor.download = `${storyToExport.title.toLowerCase().replace(/\s/g, '-')}.txt`;
            anchor.href = window.URL.createObjectURL(blob);
            anchor.click();
        }

        function saveStory() {
            if (!editor.value.trim()) return;

            if (editingStoryId) {
                const story = savedStories.find(s => s.id === editingStoryId);
                story.title = titleInput.value;
                story.content = editor.value;
            } else {
                const story = {
                    id: Date.now(),
                    title: titleInput.value,
                    content: editor.value,
                    date: new Date().toLocaleDateString('pt-BR'),
                    originTheme: currentTheme
                };
                savedStories.unshift(story);
            }
            editingStoryId = null;
            renderStories();
            document.getElementById('library-section').classList.remove('hidden');
            clearEditor();
        }

        function loadStory(storyId) {
            const story = savedStories.find(s => s.id === storyId);
            if (story) {
                titleInput.value = story.title;
                editor.value = story.content;
                editingStoryId = story.id;
                setTheme(story.originTheme);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        function deleteStory(storyId) {
            savedStories = savedStories.filter(s => s.id !== storyId);
            renderStories();
        }


        function renderStories() {
            const grid = document.getElementById('stories-grid');
            grid.innerHTML = '';

            savedStories.forEach((s) => {
                const originT = themes[s.originTheme];
                const card = document.createElement('div');

                card.className = "glass-panel p-6 md:p-8 story-card group border-none shadow-sm flex flex-col";
                card.style.backgroundColor = `var(${themes[currentTheme].panel})`;

                card.innerHTML = `
                    <div class="flex justify-between items-start mb-4 text-[9px] md:text-[10px] font-extrabold tracking-widest uppercase" style="color: ${originT.accent}">
                        <span>${s.date}</span>
                        <span>Original: ${originT.name}</span>
                    </div>
                    <h4 class="serif text-lg md:text-xl mb-3">${s.title}</h4>
                    <p class="serif text-sm opacity-70 line-clamp-3 leading-relaxed mb-4">"${s.content}"</p>
                    <div class="mt-auto flex items-center justify-end gap-4 text-xs uppercase tracking-widest">
                        <button onclick="loadStory(${s.id})" class="hover:tracking-[0.2em] transition-all cursor-pointer font-extrabold p-2">Editar</button>
                        <button onclick="exportStory(${s.id})" class="hover:tracking-[0.2em] transition-all cursor-pointer font-extrabold p-2">Baixar</button>
                        <button onclick="deleteStory(${s.id})" class="hover:tracking-[0.2em] transition-all cursor-pointer font-extrabold p-2 text-red-500">Excluir</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        editor.addEventListener('input', () => {
            updateTextInfo();
            if (Math.random() > 0.7) createParticle();

            document.getElementById('editor-container').classList.add('is-typing');
            body.classList.add('zen-mode');

            clearTimeout(typingTimer);
            clearTimeout(zenTimer);

            typingTimer = setTimeout(() => {
                document.getElementById('editor-container').classList.remove('is-typing');
            }, 1000);

            zenTimer = setTimeout(() => {
                body.classList.remove('zen-mode');
            }, 3000);
        });

        window.addEventListener('mousemove', (e) => {
            if (body.classList.contains('zen-mode')) {
                body.classList.remove('zen-mode');
            }

            if (window.innerWidth < 768) return;
            const x = (window.innerWidth / 2 - e.pageX) / 70;
            const y = (window.innerHeight / 2 - e.pageY) / 70;
            editorContainer.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });

        setTheme('autumn');

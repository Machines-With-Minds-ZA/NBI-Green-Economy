 const priorityAreas = [
            {
                title: "Agriculture",
                image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
                overlay: "Agriculture"
            },
            {
                title: "Energy\n(clean and efficient)",
                image: "https://images.unsplash.com/photo-1466442929976-97f336a657be",
                overlay: "Energy\n(clean and efficient)"
            },
            {
                title: "Natural resource conservation and management\n(including mining)",
                image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
                overlay: "Natural resource conservation and management\n(including mining)"
            },
            {
                title: "Sustainable transport and infrastructure",
                image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                overlay: "Sustainable transport and infrastructure"
            },
            {
                title: "Environmental sustainability, including tourism education",
                image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                overlay: "Environmental sustainability, including tourism education"
            },
            {
                title: "Green buildings and the built environment",
                image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
                overlay: "Green buildings and the built environment"
            },
            {
                title: "Sustainable waste management and recycling",
                image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
                overlay: "Sustainable waste management and recycling"
            },
            {
                title: "Water management",
                image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                overlay: "Water management"
            },
            {
                title: "Sustainable production and consumption",
                image: "https://images.unsplash.com/photo-1466442929976-97f336a657be",
                overlay: "Sustainable production and consumption"
            }
        ];

        function renderPriorityAreas(containerId) {
            const container = document.getElementById(containerId);
            priorityAreas.forEach(area => {
                const card = document.createElement('div');
                card.className = 'card group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer';
                card.innerHTML = `
                    <div class="relative h-48">
                        <img src="${area.image}" alt="${area.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                        <div class="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                        <div class="absolute inset-0 flex items-center justify-center p-4">
                            <h3 class="text-white font-semibold text-center text-sm lg:text-base leading-tight">${area.overlay}</h3>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        renderPriorityAreas('priority-areas');

        document.querySelectorAll('a[href="/"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/index.html';
            });
        });

        document.querySelectorAll('a[href="/about"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/about.html';
            });
        });
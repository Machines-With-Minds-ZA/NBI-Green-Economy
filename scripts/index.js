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

        document.addEventListener('DOMContentLoaded', function () {
            const grid = document.getElementById('priority-areas');
            if (!grid) return;
            grid.innerHTML = '';
            priorityAreas.forEach(area => {
                const card = document.createElement('div');
                card.className = 'relative group overflow-hidden';
                card.innerHTML = `
                    <img src="${area.image}" class="w-full h-48 object-cover" alt="${area.title}">
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span class="text-white text-xl font-semibold text-center">${area.overlay}</span>
                    </div>
                `;
                grid.appendChild(card);
            });
        });

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
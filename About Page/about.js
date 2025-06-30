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

        const climateRisks = [
            {
                icon: "⚠️",
                title: "Risk of physical damage to structures",
                description: "Climate change poses significant threats to infrastructure through extreme weather events, rising sea levels, and temperature fluctuations. Buildings, roads, and critical facilities face increased vulnerability to flooding, storms, and heat stress, requiring adaptive design and resilient construction practices."
            },
            {
                icon: "📊",
                title: "Risk of increased operating costs",
                description: "As climate impacts intensify, businesses face higher operational expenses through increased energy costs, supply chain disruptions, and the need for climate adaptation measures. These rising costs affect competitiveness and long-term sustainability of operations across all sectors."
            },
            {
                icon: "⛔",
                title: "Risk of supply chain disruptions",
                description: "Climate-related events can severely impact global and local supply chains, causing delays, shortages, and increased costs. Extreme weather, droughts, and floods disrupt transportation networks and production facilities, highlighting the need for resilient supply chain strategies."
            },
            {
                icon: "⚖️",
                title: "Regulatory risk",
                description: "Evolving climate policies and regulations create compliance challenges and potential financial penalties. Organizations must navigate changing environmental standards, carbon pricing mechanisms, and disclosure requirements while adapting their operations to meet new regulatory frameworks."
            },
            {
                icon: "📋",
                title: "Reputational risk",
                description: "Consumer awareness and stakeholder expectations around climate action continue to rise. Organizations face reputational damage if they fail to demonstrate meaningful environmental commitment, potentially affecting brand value, customer loyalty, and investment attractiveness in an increasingly climate-conscious market."
            }
        ];

        const responses = [
            {
                title: "Adaptation",
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                description: "Building resilience through proactive planning against climate impacts. This involves developing infrastructure that can withstand extreme weather, implementing early warning systems, and creating adaptive capacity in communities and ecosystems. Adaptation strategies help reduce vulnerability and build long-term resilience to unavoidable climate change effects."
            },
            {
                title: "Mitigation",
                image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
                description: "Reducing greenhouse gas emissions through renewable energy transition, energy efficiency improvements, and sustainable practices. Mitigation efforts focus on preventing further climate change by decarbonizing energy systems, improving industrial processes, and implementing nature-based solutions that capture carbon while providing co-benefits."
            },
            {
                title: "Climate finance",
                image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
                description: "Mobilizing financial resources to support climate action through green bonds, carbon markets, and sustainable investment mechanisms. Climate finance enables the scaling up of renewable energy projects, adaptation infrastructure, and green technology development while creating new economic opportunities in the low-carbon transition."
            },
            {
                title: "Climate resilience",
                image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
                description: "Building systems and communities that can bounce back from climate shocks and stresses. Climate resilience integrates adaptation and mitigation strategies with social and economic development to create robust, flexible systems that can maintain essential functions under changing climate conditions while supporting sustainable development goals."
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

        function renderClimateRisks() {
            const container = document.getElementById('climate-risks');
            climateRisks.forEach(risk => {
                const card = document.createElement('div');
                card.className = 'card teal-bg text-white p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2';
                card.innerHTML = `
                    <div class="text-4xl mb-4">${risk.icon}</div>
                    <h3 class="text-xl font-bold mb-4">${risk.title}</h3>
                    <p class="text-sm leading-relaxed opacity-95">${risk.description}</p>
                `;
                container.appendChild(card);
            });
        }

        function renderClimateResponses() {
            const container = document.getElementById('climate-responses');
            responses.forEach(response => {
                const card = document.createElement('div');
                card.className = 'card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2';
                card.innerHTML = `
                    <div class="relative h-64">
                        <img src="${response.image}" alt="${response.title}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-black/40"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <h3 class="text-white text-3xl font-bold">${response.title}</h3>
                        </div>
                    </div>
                    <div class="p-6 teal-bg text-white">
                        <p class="text-sm leading-relaxed opacity-95">${response.description}</p>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        renderPriorityAreas('about-priority-areas');
        renderClimateRisks();
        renderClimateResponses();

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
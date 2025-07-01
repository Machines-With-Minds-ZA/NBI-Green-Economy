  // Funding data with sectors and source information
        let fundingData = [
            {
                id: 1,
                name: "Renewable Energy Innovation Fund",
                provider: "IDC Green Economy Fund",
                providerDomain: "idc.co.za",
                description: "Funding for innovative renewable energy projects with potential for significant environmental impact.",
                type: "grant",
                sectors: ["energy"],
                deadline: "2024-08-15",
                link: "https://www.idc.co.za/green-economy/",
                dateAdded: "2024-06-20"
            },
            {
                id: 2,
                name: "Green SME Development Fund",
                provider: "SEFA",
                providerDomain: "sefa.org.za",
                description: "Support for small and medium enterprises transitioning to sustainable practices.",
                type: "loan",
                sectors: ["energy", "agriculture", "waste", "water"],
                deadline: "rolling",
                link: "https://www.sefa.org.za",
                dateAdded: "2024-06-18"
            },
            {
                id: 3,
                name: "Sustainable Agriculture Training Program",
                provider: "SANBI",
                providerDomain: "sanbi.org",
                description: "Free training and resources for farmers adopting climate-smart agricultural techniques.",
                type: "technical",
                sectors: ["agriculture", "biodiversity"],
                deadline: "2024-09-30",
                link: "https://www.sanbi.org",
                dateAdded: "2024-06-15"
            },
            {
                id: 4,
                name: "Urban Green Spaces Initiative",
                provider: "DFFE",
                providerDomain: "dffe.gov.za",
                description: "Funding for community-led projects creating or enhancing urban green spaces in disadvantaged areas.",
                type: "grant",
                sectors: ["biodiversity", "building"],
                deadline: "2024-11-10",
                link: "https://www.dffe.gov.za",
                dateAdded: "2024-06-10"
            },
            {
                id: 5,
                name: "Energy Efficiency Support Program",
                provider: "National Treasury",
                providerDomain: "treasury.gov.za",
                description: "Support for businesses implementing energy efficiency measures in their operations.",
                type: "tax",
                sectors: ["energy", "building"],
                deadline: "ongoing",
                link: "https://www.treasury.gov.za",
                dateAdded: "2024-06-05"
            },
            {
                id: 6,
                name: "Green Building Retrofit Program",
                provider: "DBSA",
                providerDomain: "dbsa.org",
                description: "Special program for retrofitting existing buildings with green technologies and sustainable materials.",
                type: "loan",
                sectors: ["building", "energy"],
                deadline: "2024-10-20",
                link: "https://www.dbsa.org",
                dateAdded: "2024-06-01"
            }
        ];

        // Trusted funding sources with their URLs and scraping status
        const trustedFundingSources = [
            {
                name: "GreenCape Finance DB",
                url: "https://www.green-cape.co.za/finance-db",
                searchable: true,
                scrapingMethod: "headless browser (Puppeteer/Selenium)",
                icon: "bi-globe"
            },
            {
                name: "SANBI Funding",
                url: "https://www.sanbi.org/funding/",
                searchable: false,
                scrapingMethod: "static HTML/PDF",
                icon: "bi-file-earmark-text"
            },
            {
                name: "eTenders.gov.za",
                url: "https://www.etenders.gov.za",
                searchable: true,
                scrapingMethod: "advanced search scraping",
                icon: "bi-search"
            },
            {
                name: "DBSA Procurement",
                url: "https://www.dbsa.org/procurement",
                searchable: false,
                scrapingMethod: "static list/PDFs",
                icon: "bi-list-ul"
            },
            {
                name: "AECF Open Calls",
                url: "https://www.aecfafrica.org/open-calls",
                searchable: true,
                scrapingMethod: "structured scraping",
                icon: "bi-door-open"
            },
            {
                name: "FundsforNGOs",
                url: "https://www.fundsforngos.org",
                searchable: true,
                scrapingMethod: "limited scraping (check TOS)",
                icon: "bi-people-fill"
            }
        ];

        // Sort funding data with rolling deadlines first, then by deadline (earliest first)
        function sortFundingData() {
            fundingData.sort((a, b) => {
                // Both have rolling/ongoing deadlines - sort by date added (newest first)
                if ((a.deadline === 'rolling' || a.deadline === 'ongoing') && 
                    (b.deadline === 'rolling' || b.deadline === 'ongoing')) {
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                }
                // Only a has rolling deadline - a comes first
                if (a.deadline === 'rolling' || a.deadline === 'ongoing') {
                    return -1;
                }
                // Only b has rolling deadline - b comes first
                if (b.deadline === 'rolling' || b.deadline === 'ongoing') {
                    return 1;
                }
                
                // Compare deadlines (earliest first)
                return new Date(a.deadline) - new Date(b.deadline);
            });
        }

        // Get company logo
        async function getCompanyLogo(domain) {
            const sources = [
                `https://logo.clearbit.com/${domain}`,
                `https://${domain}/favicon.ico`,
                `https://${domain}/logo.png`,
                `https://${domain}/logo.svg`
            ];
            
            for (const logoUrl of sources) {
                try {
                    const response = await fetch(logoUrl, { mode: 'no-cors' });
                    // Since we can't read response status in no-cors mode, we just try to create an image
                    const img = new Image();
                    img.src = logoUrl;
                    await new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                    if (img.width > 0) {
                        return logoUrl;
                    }
                } catch (error) {
                    continue;
                }
            }
            return null;
        }

        // Render funding cards
        async function renderFundingCards(data) {
            const container = document.getElementById('funding-results');
            container.innerHTML = '';
            
            // Sort data before rendering
            const sortedData = [...data].sort((a, b) => {
                if ((a.deadline === 'rolling' || a.deadline === 'ongoing') && 
                    (b.deadline === 'rolling' || b.deadline === 'ongoing')) {
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                }
                if (a.deadline === 'rolling' || a.deadline === 'ongoing') {
                    return -1;
                }
                if (b.deadline === 'rolling' || b.deadline === 'ongoing') {
                    return 1;
                }
                return new Date(a.deadline) - new Date(b.deadline);
            });
            
            for (const item of sortedData) {
                const logoUrl = await getCompanyLogo(item.providerDomain);
                
                const card = document.createElement('div');
                card.className = 'funding-card';
                card.innerHTML = `
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            ${logoUrl ? `<img src="${logoUrl}" alt="${item.provider}" class="h-8 w-8 mr-3 rounded-full">` : ''}
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">${item.provider}</h4>
                                <div class="flex space-x-2 mt-1">
                                    <span class="bg-${getTypeColor(item.type)}-100 text-${getTypeColor(item.type)}-800 text-xs px-2 py-0.5 rounded">${formatType(item.type)}</span>
                                </div>
                            </div>
                        </div>
                        <h3 class="text-xl font-bold mb-2">${item.name}</h3>
                        <p class="text-sm mb-4">${item.description}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${item.sectors.map(sector => `<span class="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">${formatSector(sector)}</span>`).join('')}
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="text-right">
                                <small class="text-xs text-gray-500 block">${formatDeadline(item.deadline)}</small>
                                <a href="${item.link}" target="_blank" class="view-details inline-block mt-1">
                                    View Details <i class="bi bi-box-arrow-up-right ml-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            }
        }

        // Function to display trusted sources when no specific results are found
        function displayTrustedSources() {
            const container = document.getElementById('funding-results');
            container.innerHTML = '';
            
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'col-span-full text-center py-8';
            noResultsDiv.innerHTML = `
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="bi bi-info-circle-fill text-yellow-400 text-2xl"></i>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-yellow-800">No specific opportunities found</h3>
                            <p class="text-sm text-yellow-700 mt-2">
                                We couldn't find specific opportunities matching your criteria. Here are trusted sources where you might find relevant funding:
                            </p>
                        </div>
                    </div>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-6">Recommended Funding Sources</h3>
            `;
            container.appendChild(noResultsDiv);
            
            const sourcesGrid = document.createElement('div');
            sourcesGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full';
            
            trustedFundingSources.forEach(source => {
                const sourceCard = document.createElement('div');
                sourceCard.className = 'bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-teal-600 transition-colors';
                sourceCard.innerHTML = `
                    <div class="flex items-start">
                        <div class="flex-shrink-0 bg-teal-50 rounded-md p-3">
                            <i class="bi ${source.icon} text-teal-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-medium text-gray-900">${source.name}</h4>
                            <div class="mt-1 text-sm text-gray-500">
                                ${source.searchable ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Searchable</span>' : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Browse Only</span>'}
                            </div>
                            <p class="mt-2 text-sm text-gray-600">
                                ${source.scrapingMethod ? `Method: ${source.scrapingMethod}` : ''}
                            </p>
                            <div class="mt-4">
                                <a href="${source.url}" target="_blank" class="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-800">
                                    Visit Website <i class="bi bi-box-arrow-up-right ml-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                sourcesGrid.appendChild(sourceCard);
            });
            
            container.appendChild(sourcesGrid);
        }

        // Helper functions
        function getTypeColor(type) {
            const colors = {
                grant: 'green',
                loan: 'blue',
                equity: 'purple',
                tax: 'yellow',
                technical: 'indigo'
            };
            return colors[type] || 'gray';
        }

        function formatType(type) {
            const names = {
                grant: 'Grant',
                loan: 'Loan',
                equity: 'Equity',
                tax: 'Tax Incentive',
                technical: 'Technical'
            };
            return names[type] || type;
        }

        function formatSector(sector) {
            const names = {
                energy: 'Energy',
                agriculture: 'Agriculture',
                building: 'Building',
                waste: 'Waste',
                water: 'Water',
                transport: 'Transport',
                biodiversity: 'Biodiversity'
            };
            return names[sector] || sector;
        }

        function formatDeadline(deadline) {
            if (deadline === 'rolling' || deadline === 'ongoing') {
                return 'Rolling deadline';
            }
            return `Closes: ${new Date(deadline).toLocaleDateString()}`;
        }

        // Filter functions
        function applyFilters() {
            const sector = document.getElementById('sector').value;
            const fundingType = document.getElementById('funding-type').value;
            const deadline = document.getElementById('deadline').value;
            
            let filteredData = [...fundingData];
            
            if (sector) {
                filteredData = filteredData.filter(item => item.sectors.includes(sector));
            }
            
            if (fundingType) {
                filteredData = filteredData.filter(item => item.type === fundingType);
            }
            
            if (deadline && deadline !== 'rolling') {
                const now = new Date();
                let cutoffDate = new Date();
                
                if (deadline === '1month') {
                    cutoffDate.setMonth(now.getMonth() + 1);
                } else if (deadline === '3months') {
                    cutoffDate.setMonth(now.getMonth() + 3);
                } else if (deadline === '6months') {
                    cutoffDate.setMonth(now.getMonth() + 6);
                }
                
                filteredData = filteredData.filter(item => {
                    if (item.deadline === 'rolling' || item.deadline === 'ongoing') return false;
                    const itemDate = new Date(item.deadline);
                    return itemDate <= cutoffDate;
                });
            }
            
            if (filteredData.length === 0) {
                displayTrustedSources();
            } else {
                renderFundingCards(filteredData);
            }
        }

        function resetFilters() {
            document.getElementById('sector').value = '';
            document.getElementById('funding-type').value = '';
            document.getElementById('deadline').value = '';
            renderFundingCards(fundingData);
        }

        // Function to fetch new opportunities from trusted sources
        async function fetchNewOpportunities() {
            try {
                // Show loading state
                const refreshBtn = document.querySelector('button[onclick="fetchNewOpportunities()"]');
                const originalText = refreshBtn.innerHTML;
                refreshBtn.innerHTML = '<i class="bi bi-arrow-repeat mr-2 animate-spin"></i> Searching...';
                refreshBtn.disabled = true;
                
                // Get current filter values
                const sector = document.getElementById('sector').value;
                const fundingType = document.getElementById('funding-type').value;
                const deadline = document.getElementById('deadline').value;
                
                // Simulate checking multiple sources (in a real implementation, these would be actual API calls or scrapes)
                const simulatedChecks = [
                    { name: "GreenCape Finance DB", delay: 800, success: Math.random() > 0.3 },
                    { name: "eTenders.gov.za", delay: 1200, success: Math.random() > 0.4 },
                    { name: "AECF Open Calls", delay: 1500, success: Math.random() > 0.5 },
                    { name: "Other Sources", delay: 2000, success: Math.random() > 0.6 }
                ];
                
                let foundOpportunities = [];
                let checkedSources = [];
                
                for (const check of simulatedChecks) {
                    await new Promise(resolve => setTimeout(resolve, check.delay));
                    checkedSources.push(check.name);
                    
                    if (check.success) {
                        // Simulate finding 1-2 opportunities per successful source
                        const newOpps = Array.from({ length: Math.floor(Math.random() * 2) + 1 }, (_, i) => ({
                            id: fundingData.length + foundOpportunities.length + i + 1,
                            name: `Opportunity from ${check.name}`,
                            provider: check.name,
                            providerDomain: check.name.replace(/\s+/g, '').toLowerCase() + ".com",
                            description: `Sample funding opportunity found on ${check.name} that might match your criteria.`,
                            type: ["grant", "loan", "technical"][Math.floor(Math.random() * 3)],
                            sectors: sector ? [sector] : ["energy", "agriculture", "building", "waste", "water", "transport", "biodiversity"].filter(() => Math.random() > 0.5),
                            deadline: deadline === "1month" ? getFutureDate(30) : 
                                     deadline === "3months" ? getFutureDate(90) :
                                     deadline === "6months" ? getFutureDate(180) :
                                     ["2024-09-15", "2024-10-20", "2024-11-30", "rolling"][Math.floor(Math.random() * 4)],
                            link: `https://${check.name.replace(/\s+/g, '').toLowerCase()}.com/funding`,
                            dateAdded: new Date().toISOString().split('T')[0]
                        }));
                        foundOpportunities.push(...newOpps);
                    }
                }
                
                if (foundOpportunities.length > 0) {
                    // Add to existing data
                    fundingData = [...foundOpportunities, ...fundingData];
                    
                    // Re-render with all opportunities
                    renderFundingCards(fundingData);
                    
                    // Show success message
                    showNotification(`Found ${foundOpportunities.length} new opportunities from ${checkedSources.join(', ')}`);
                } else {
                    // Show trusted sources when nothing is found
                    displayTrustedSources();
                    showNotification('No new opportunities found. Check our recommended sources below.', 'info');
                }
                
            } catch (error) {
                console.error('Error fetching new opportunities:', error);
                showNotification('Failed to fetch new opportunities. Please try again later.', 'error');
            } finally {
                // Reset button state
                const refreshBtn = document.querySelector('button[onclick="fetchNewOpportunities()"]');
                refreshBtn.innerHTML = '<i class="bi bi-arrow-repeat mr-2"></i> Refresh Opportunities';
                refreshBtn.disabled = false;
            }
        }

        // Helper function to get future dates
        function getFutureDate(days) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date.toISOString().split('T')[0];
        }

        // Helper function to show notifications
        function showNotification(message, type = 'success') {
            const colors = {
                success: 'bg-teal-600',
                error: 'bg-red-500',
                info: 'bg-blue-500'
            };
            
            const icons = {
                success: 'bi-check-circle',
                error: 'bi-exclamation-triangle',
                info: 'bi-info-circle'
            };
            
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-4 py-2 rounded-md shadow-lg flex items-center`;
            notification.innerHTML = `
                <i class="bi ${icons[type]} mr-2"></i>
                ${message}
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Sort data initially
            sortFundingData();
            // Render all opportunities
            renderFundingCards(fundingData);
        });
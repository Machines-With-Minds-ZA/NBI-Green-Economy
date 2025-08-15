// Ensure Lunr.js is loaded via CDN: <script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js"></script>

// Define the content index based on provided pages
const documents = [
  // From about.html
  {
    id: 'about-1',
    title: 'About the Green Economy',
    body: 'A green economy is one which is socially inclusive and environmentally sustainable. It improves human well-being and builds social equity while reducing environmental risks and ecological scarcities. In simple terms, we can think of a green economy as one which is low carbon, resource efficient and socially inclusive.',
    url: '/LandingPage/About Page/about.html#hero-section'
  },
  {
    id: 'about-2',
    title: 'Nine Priority Focus Areas for the Green Economy in South Africa',
    body: 'Nine priority focus areas for the green economy in South Africa (Green Economy Summit, 2010): Agriculture, Energy (clean and efficient), Natural resource conservation and management (including mining), Sustainable transport and infrastructure, Environmental sustainability, including tourism education, Green buildings and the built environment, Sustainable waste management and recycling, Water management, Sustainable production and consumption.',
    url: '/LandingPage/About Page/about.html#priority-areas'
  },
  {
    id: 'about-3',
    title: 'Climate Risks: Risk of Physical Damage & Disruption',
    body: 'Climate change can cause extreme weather events like floods and wildfires. These events can damage buildings, roads and farms, which can make it harder for people to do their jobs and for businesses to operate smoothly.',
    url: '/LandingPage/About Page/about.html#climate-risks'
  },
  {
    id: 'about-4',
    title: 'Climate Risks: Risk of Increased Operating Costs',
    body: 'As the climate gets hotter, businesses might need more energy to cool down their buildings. Also, if water becomes scarce, some industries might have to pay more for the water they use. These extra expenses can make it more expensive for businesses to run.',
    url: '/LandingPage/About Page/about.html#climate-risks'
  },
  {
    id: 'about-5',
    title: 'Climate Risks: Risk of Supply Chain Disruptions',
    body: 'Sometimes, companies in South Africa get the materials they need from other countries. However, climate change can disrupt this by causing problems like hurlingness that affect shipping or extreme weather that stops production in other places. This can lead to delays and higher costs for businesses.',
    url: '/LandingPage/About Page/about.html#climate-risks'
  },
  {
    id: 'about-6',
    title: 'Climate Risks: Reputation Risk',
    body: 'If a company appears not to show care or concern about the environment or has business practices and operations that are detrimental to the environment, people (consumers) might not want to buy their products or support them. This can hurt a company\'s image and make it harder for them to perform well in their respective industry or stay competitive in the market.',
    url: '/LandingPage/About Page/about.html#climate-risks'
  },
  {
    id: 'about-7',
    title: 'Climate Risks: Regulatory Risk',
    body: 'Governments are making stricter rules to protect the environment from climate change. Businesses in South Africa need to know these rules, and sometimes it can be expensive to do so. If they do not follow the rules, they can get fired or face legal implications.',
    url: '/LandingPage/About Page/about.html#climate-risks'
  },
  {
    id: 'about-8',
    title: 'How We Can Respond to Climate Change: Adaptation',
    body: 'Adaptation means keeping abreast of and staying ready to adapt to changes caused by climate change. It\'s about making plans and changes to deal with events like droughts or floods that might happen more often because of climate change. An example: farmers in South Africa are changing the way in which they harvest and grow crops in order to use less water, due to a decrease in rainfall. This is an example of adapting to the changing climate.',
    url: '/LandingPage/About Page/about.html#business-preparation'
  },
  {
    id: 'about-9',
    title: 'How We Can Respond to Climate Change: Mitigation',
    body: 'Mitigation means trying to stop or reduce activities that make climate change worse. This may include reducing gas emissions that come from burning coal or oil, which release large amounts of carbon dioxide into the atmosphere, in turn causing climate change through an increase in temperature by trapping heat in the atmosphere. An example: South Africa is building more wind and solar power plants to make electricity and generate alternative sources of energy without using as much coal, a fossil fuel. This aids in reducing the gases that cause climate change.',
    url: '/LandingPage/About Page/about.html#business-preparation'
  },
  {
    id: 'about-10',
    title: 'How We Can Respond to Climate Change: Climate Finance',
    body: 'Climate finance refers to funds that help governments and organisations develop projects aimed at fighting climate change. These funds can be used to build and promote initiatives such as clean energy projects or to help communities prepare for climate impacts. An example: South Africa might get money from a global fund to build solar panels in a town. This contributes to clean energy and reduces the effects of climate change. Climate finance helps pay for such projects.',
    url: '/LandingPage/About Page/about.html#business-preparation'
  },
  {
    id: 'about-11',
    title: 'How We Can Respond to Climate Change: Climate Resilience',
    body: 'Climate resilience means being strong and ready to handle the problems that are caused by climate change. It\'s about making sure communities and nature can "bounce back" after climate change effects such as floods or storms. An example in South Africa: in areas where there is not much water, people might learn ways to save water and grow drought-resistant crops. This helps them survive and do well even when there is less rain due to a changing climate.',
    url: '/LandingPage/About Page/about.html#business-preparation'
  },
  // From disclaimer.html
  {
    id: 'disclaimer-1',
    title: 'Disclaimer',
    body: 'The information provided by the Green Economy Toolkit is for general informational purposes only. All information on this site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site. Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk. The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We reserve the right to make additions, deletions, or modifications to the contents on the site at any time without prior notice. If you require any more information or have any questions about our site\'s disclaimer, please feel free to contact us.',
    url: '/disclaimer.html'
  },
  // From IRMSector.html
  {
    id: 'irm-1',
    title: 'Installation, Repair and Maintenance Sector',
    body: 'Since 2019, the National Business Initiative has been spearheading multifaceted and multisector partnerships focused on growing pathways for young people to access installation, repair and maintenance (IRM) occupations. Artisanal skills can be useful in supporting the journey and transition to a green economy. Through various industry and sector opportunities, tradespeople and small, micro and medium enterprises (SMMEs) in the IRM space can take advantage of this move to a green economy. There are opportunities to support the below focus areas outlined by the South African government.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#hero'
  },
  {
    id: 'irm-2',
    title: 'IRM in Agriculture',
    body: 'Where do I fit in? In sustainable agriculture, you can play a crucial role by providing installation, repair and maintenance services for energy-efficient and environmentally friendly farming equipment such as electric tractors, solar-powered irrigation systems and precision farming technology. In addition, you can educate farmers about the benefits of eco-friendly practices and equipment. How do I get involved? To get involved, consider attending workshops and training programmes that are focused on green agricultural equipment installation, repair and maintenance. Collaborate with agricultural organisations and eco-conscious farmers to understand their specific needs and offer customised installation, repair and maintenance solutions. Promote your services through channels that reach the farming community, emphasising their environmental benefits.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#agriculture'
  },
  {
    id: 'irm-3',
    title: 'IRM in Energy (Clean and Efficient)',
    body: 'Where do I fit in? You can specialise in the installation, repair and maintenance of clean energy infrastructure, such as solar panels, wind turbines and energy-efficient heating, ventilation and air-conditioning (HVAC) systems. By ensuring these systems operate optimally, you contribute to the broader goal of clean energy adoption. How do I get involved? Seek certification or training in clean energy technology installation, repair and maintenance. Partner with renewable energy installation companies to provide ongoing maintenance services. Stay updated on the latest advancements in clean energy technologies to offer cutting-edge repair solutions.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#energy'
  },
  {
    id: 'irm-4',
    title: 'IRM in Natural Resource Conservation and Management (Including Mining)',
    body: 'Where do I fit in? Your role can involve advocating for and implementing sustainable installation, repair and maintenance practices in the mining industry. Focus on equipment used in responsible mining, such as energy-efficient conveyor systems and environmentally friendly drilling equipment. How do I get involved? Collaborate with mining companies committed to sustainable practices and learn about their specific needs. Stay informed about industry guidelines for eco-friendly mining equipment maintenance. Consider joining or partnering with organisations dedicated to responsible resource management.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#natural-resource'
  },
  {
    id: 'irm-5',
    title: 'IRM in Sustainable Transport and Infrastructure',
    body: 'Where do I fit in? You can specialise in the installation, repair and maintenance of eco-friendly transportation infrastructure, such as electric vehicle (EV) charging stations, bike-sharing systems or public transport transit systems that are powered by clean energy. How do I get involved? Acquire training and certifications for EV charging station installation, repair and maintenance. Collaborate with local governments and transportation authorities to maintain sustainable transportation infrastructure. Offer your expertise to businesses and municipalities interested in expanding their eco-friendly transport options.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#transport'
  },
  {
    id: 'irm-6',
    title: 'IRM in Environmental Sustainability, Including Tourism Education',
    body: 'Where do I fit in? Your role can involve installing, maintaining and repairing eco-friendly tourism facilities, such as eco-lodges, nature reserves, and sustainable tourism attractions. Additionally, you can offer training programmes on eco-conscious installation, repair and maintenance techniques. How do I get involved? Partner with eco-conscious tourism businesses to provide installation, repair and maintenance services for their facilities. Develop educational materials and workshops on responsible tourism and eco-friendly installation, repair and maintenance practices. Collaborate with environmental NGOs to promote sustainable tourism in your region.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#environmental'
  },
  {
    id: 'irm-7',
    title: 'IRM in Green Buildings and the Built Environment',
    body: 'Where do I fit in? Focus on installing, repairing and maintaining energy-efficient systems within green buildings, such as solar panels, energy-efficient heating, ventilation and air-conditioning (HVAC) systems, and smart building technologies. How do I get involved? Seek certifications in green building equipment installation, repair and maintenance. Collaborate with environmentally conscious green building construction firms to offer post-construction repair and maintenance services. Stay informed about the latest green building standards and technologies.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#buildings'
  },
  {
    id: 'irm-8',
    title: 'IRM in Sustainable Waste Management and Recycling',
    body: 'Where do I fit in? Specialise in installing, repairing and maintaining recycling machinery and equipment to support waste reduction and recycling efforts. How do I get involved? Collaborate with recycling facilities and waste management companies to offer repair and maintenance services for their equipment, and to install new equipment. Stay updated on recycling industry trends and any regulations related to eco-friendly equipment maintenance.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#waste'
  },
  {
    id: 'irm-9',
    title: 'IRM in Water Management',
    body: 'Where do I fit in? Focus on installing, repairing and maintaining water-saving technologies, such as efficient irrigation systems and water purification equipment. How do I get involved? Seek certifications or training programmes for water management equipment installation, repair and maintenance. Partner with water treatment facilities and businesses involved in water conservation to provide your services. Stay informed about water quality regulations and conservation techniques.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#water'
  },
  {
    id: 'irm-10',
    title: 'IRM in Sustainable Production and Consumption',
    body: 'Where do I fit in? Advocate for the repair and refurbishment of electronics and appliances to promote sustainable consumption. Encourage clients to choose repair over replacement. How do I get involved? Collaborate with eco-conscious manufacturers and retailers to provide repair and maintenance services for their products. Educate consumers about the benefits of repairing and maintaining their belongings instead of throwing them away and buying new ones. Participate in local sustainability initiatives to raise awareness about sustainable consumption practices.',
    url: '/LandingPage/IRM-Sector/IRMSector.html#production'
  },
  // From knowledge-hub.html
  {
    id: 'knowledge-1',
    title: 'Welcome to Our Knowledge Hub',
    body: 'Welcome to our knowledge hub.',
    url: '/LandingPage/Knowledge-Hub/knowledge-hub.html#hero'
  },
  {
    id: 'knowledge-2',
    title: 'Access to Learning Opportunities',
    body: 'The National Business Initiative (NBI) has created an online application to improve the learning experience for technical and business-related topics. Key features of the app include offline access to content; the ability to download and complete content activities with outcomes logged on the learning management system when connected; interactive engagement; self-paced self-learning; the option to register and manage your profile; and tracking of learning progress. This app is part of the Installation, Repair and Maintenance (IRM) Initiative, which aims to unlock demand for jobs and create opportunities for youth to access those jobs. The Initiative is a collaboration between the NBI, the government and the private sector, offering demand-led skills training, workplace-based learning, and enterprise development with technology integration for a more dynamic learning process.',
    url: '/LandingPage/Knowledge-Hub/knowledge-hub.html#learning'
  },
  {
    id: 'knowledge-3',
    title: 'Access to Business Development Support',
    body: 'The IRM Initiative hub is a platform that provides access to various opportunities including procurement, access to market, capacity building, training and enterprise development support. To gain access to the various opportunities, click the link below, register and complete the application form, which will give you access to various opportunities under the "Opportunities" tab on the hub.',
    url: '/LandingPage/Knowledge-Hub/knowledge-hub.html#business-dev'
  },
  {
    id: 'knowledge-4',
    title: 'Access to Market Opportunities',
    body: 'Our business development support services are designed to help you thrive in today\'s competitive market. Through our hubs, we assist township-based SMMEs in identifying opportunities, and equipping them with the skills and tools to ensure that they adapt to market trends. We also help them create networks and partnerships.',
    url: '/LandingPage/Knowledge-Hub/knowledge-hub.html#market-opp'
  },
  // From opportunities.html
  {
    id: 'opportunities-1',
    title: 'Green Economy Opportunities',
    body: 'Find out about opportunities for procurement, market access, capacity building, training and enterprise development support in your area. This page is your go-to hub for all the information you need, right at your fingertips. Use the filter to select resources tailored to your specific category of interest.',
    url: '/LandingPage/Opportunities/opportunities.html#info'
  }
];

// Build the Lunr index
let index;
function buildIndex() {
  console.log('Building Lunr index...');
  try {
    index = lunr(function () {
      this.ref('id');
      this.field('title', { boost: 10 }); // Boost title for relevance
      this.field('body');
      this.metadataWhitelist = ['position']; // For highlighting

      documents.forEach(function (doc) {
        this.add(doc);
      }, this);
    });
    console.log('Lunr index built successfully with', documents.length, 'documents');
  } catch (error) {
    console.error('Error building Lunr index:', error);
  }
}

// Function to perform search
function performSearch(query) {
  if (!index) {
    console.warn('Index not built, rebuilding...');
    buildIndex();
  }

  // Support fuzzy matching for single letters and short queries
  const enhancedQuery = query.split(' ').map(term => term + '~1').join(' ');
  console.log('Performing search with query:', enhancedQuery);
  try {
    const results = index.search(enhancedQuery);
    console.log('Search returned', results.length, 'results');
    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Function to highlight matches
function highlightText(text, positions) {
  let highlighted = '';
  let lastEnd = 0;
  positions.sort((a, b) => a.start - b.start);
  positions.forEach(pos => {
    const start = pos.start;
    const end = pos.start + pos.length;
    highlighted += text.substring(lastEnd, start) + '<mark>' + text.substring(start, end) + '</mark>';
    lastEnd = end;
  });
  highlighted += text.substring(lastEnd);
  return highlighted;
}

// Debounce function to limit search frequency
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Event listener setup
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up search listeners for aienhancedsearch.js...');

  const searchInput = document.getElementById('smartSearch');
  const resultsContainer = document.getElementById('search-results');
  const searchPopup = document.getElementById('search-popup');

  if (!searchInput || !resultsContainer || !searchPopup) {
    console.error('One or more search elements not found:', {
      searchInput: !!searchInput,
      resultsContainer: !!resultsContainer,
      searchPopup: !!searchPopup
    });
    return;
  }

  console.log('All search elements found, initializing search input handling...');

  // Open search popup on input focus
  searchInput.addEventListener('focus', () => {
    console.log('Search input focused');
    if (searchPopup.style.display === 'none') {
      searchPopup.style.display = 'block';
      searchPopup.classList.add('animate-in');
      searchPopup.classList.remove('animate-out');
    }
  });

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    console.log('Executing debounced search with query:', query);
    resultsContainer.innerHTML = ''; // Clear previous results

    if (query.length === 0) {
      resultsContainer.innerHTML = '<p class="text-muted">Start typing to see suggestions...</p>';
      return;
    }

    const results = performSearch(query);

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="text-muted">No results found.</p>';
      return;
    }

    // Limit to top 5 results for performance
    results.slice(0, 5).forEach(result => {
      const doc = documents.find(d => d.id === result.ref);
      if (!doc) {
        console.warn('Document not found for ref:', result.ref);
        return;
      }

      // Get metadata for highlighting
      const bodyMetadata = result.matchData.metadata;
      let snippet = doc.body.substring(0, 150) + (doc.body.length > 150 ? '...' : '');

      // Highlight matches in body
      if (bodyMetadata && Object.keys(bodyMetadata).length > 0) {
        const positions = [];
        Object.values(bodyMetadata).forEach(meta => {
          if (meta.body && meta.body.position) {
            meta.body.position.forEach(pos => positions.push({ start: pos[0], length: pos[1] }));
          }
        });
        if (positions.length > 0) {
          snippet = highlightText(doc.body.substring(0, 150) + (doc.body.length > 150 ? '...' : ''), positions);
        }
      }

      const resultItem = document.createElement('div');
      resultItem.classList.add('search-result-item');
      resultItem.innerHTML = `
        <a href="${doc.url}" class="result-title">${doc.title}</a>
        <p class="result-snippet">${snippet}</p>
      `;
      resultsContainer.appendChild(resultItem);
    });
    console.log('Rendered', results.length, 'search results');
  }, 300); // 300ms debounce

  // Trigger search on input
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    console.log('Input event triggered with query:', query);
    debouncedSearch(query);
  });

  // Handle language change (for future multilingual support)
  const languageSelector = document.querySelector('.language-selector');
  if (languageSelector) {
    languageSelector.addEventListener('change', (e) => {
      console.log('Language changed to:', e.target.value);
      // Placeholder for rebuilding index with translated documents
    });
  }

  // Build index on load
  buildIndex();
});

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const catalogContent = document.getElementById('catalog-content');
    const categoryTabsContainer = document.getElementById('category-tabs');
    let catalogData = {};

    const categoryMap = {
        'fragancias_ella': 'Fragancias para Ella',
        'fragancias_el': 'Fragancias para Él',
        'promociones': 'Promociones',
        'cremas_splash': 'Cremas y Splash',
        'testers_estuches': 'Testers y Estuches',
        'ocasiones_especiales': 'Ocasiones Especiales'
    };

    const defaultImage = 'https://r2.flowith.net/files/o/1755978196538-it_keeps_smelling_perfumes_logo_refinement_index_0@1024x1024.png';

    const renderProducts = (products, categoryKey) => {
        catalogContent.innerHTML = '';
        if (!products || products.length === 0) {
            catalogContent.innerHTML = `<div class=\"text-center py-20\"><h2 class=\"font-serif text-3xl text-deep-blue mb-4\">Próximamente</h2><p class=\"text-gray-600\">Nuevos productos llegarán pronto a esta sección.</p></div>`;
            return;
        }

        const categoryName = categoryMap[categoryKey] || 'Catálogo';

        const sectionHeader = `
            <div class=\"text-center mb-12 relative floral-motif\">
                <h2 class=\"section-title\">${categoryName}</h2>
            </div>
        `;

        const productGrid = document.createElement('div');
        productGrid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10";

        const fragment = document.createDocumentFragment();
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = "product-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1";
            
            const imageUrl = product.imagen || defaultImage;
            const priceDisplay = typeof product.precio === 'number' ? `$${product.precio.toFixed(2)}` : product.precio;
            const priceHtml = product.precio ? `<p class=\"font-sans text-xl font-bold text-deep-blue mt-auto self-end\">${priceDisplay}</p>` : '';


            card.innerHTML = `
                <div class=\"p-4 bg-gray-50 flex justify-center items-center h-64 overflow-hidden\">
                    <img src=\"${imageUrl}\" alt=\"Botella de perfume ${product.nombre}\" class=\"product-card-image max-h-full w-auto transition-transform duration-500 group-hover:scale-110\" onerror=\"this.src='${defaultImage}'\">
                </div>
                <div class=\"p-5 flex-grow flex flex-col border-t-4 border-champagne-gold\">
                    <h3 class=\"font-serif text-xl text-deep-blue font-bold mb-2 h-14 flex items-center\">${product.nombre}</h3>
                    <p class=\"text-gray-500 text-sm flex-grow mb-4\">${product.descripcion}</p>
                    ${priceHtml}
                </div>
            `;
            fragment.appendChild(card);
        });

        productGrid.appendChild(fragment);
        catalogContent.innerHTML = sectionHeader;
        catalogContent.appendChild(productGrid);
    };

    const renderOcasionesEspeciales = (categoryData) => {
        catalogContent.innerHTML = '';
        const fragment = document.createDocumentFragment();

        for (const ocasion in categoryData) {
            const products = categoryData[ocasion];
            
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'text-center my-12 relative floral-motif';
            sectionHeader.innerHTML = `<h2 class="section-title">${ocasion}</h2>`;
            fragment.appendChild(sectionHeader);

            const productGrid = document.createElement('div');
            productGrid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 mb-16";

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = "product-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1";
                const imageUrl = product.imagen || defaultImage;
                card.innerHTML = `
                    <div class="p-4 bg-gray-50 flex justify-center items-center h-64 overflow-hidden">
                        <img src="${imageUrl}" alt="Botella de perfume ${product.nombre}" class="product-card-image max-h-full w-auto transition-transform duration-500 group-hover:scale-110" onerror="this.src='${defaultImage}'">
                    </div>
                    <div class="p-5 flex-grow flex flex-col border-t-4 border-champagne-gold">
                        <h3 class="font-serif text-xl text-deep-blue font-bold mb-2 h-14 flex items-center">${product.nombre}</h3>
                        <p class="text-gray-500 text-sm flex-grow mb-4">${product.descripcion}</p>
                    </div>
                `;
                productGrid.appendChild(card);
            });
            fragment.appendChild(productGrid);
        }
        catalogContent.appendChild(fragment);
    };
    
    const setActiveTab = (selectedKey) => {
        const tabs = document.querySelectorAll('.category-tab');
        tabs.forEach(tab => {
            if (tab.dataset.category === selectedKey) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    };

    const handleTabClick = (categoryKey) => {
        if (categoryKey === 'ocasiones_especiales') {
            renderOcasionesEspeciales(catalogData[categoryKey]);
        } else {
            renderProducts(catalogData[categoryKey], categoryKey);
        }
        setActiveTab(categoryKey);
    };

    const createTabs = () => {
        const fragment = document.createDocumentFragment();
        Object.keys(categoryMap).forEach(key => {
            const tabButton = document.createElement('button');
            tabButton.className = 'category-tab';
            tabButton.textContent = categoryMap[key];
            tabButton.dataset.category = key;
            tabButton.addEventListener('click', () => handleTabClick(key));
            fragment.appendChild(tabButton);
        });
        categoryTabsContainer.appendChild(fragment);
    };

    const loadCatalog = async () => {
        try {
            const response = await fetch('data/catalog.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            catalogData = await response.json();
            createTabs();

            const initialCategory = Object.keys(categoryMap)[0];
            handleTabClick(initialCategory);
        } catch (error) {
            console.error("Could not load catalog data:", error);
            catalogContent.innerHTML = `<p class=\"text-center col-span-full text-red-500\">Error al cargar el catálogo. Por favor, intente más tarde.</p>`;
        }
    };

    loadCatalog();
});

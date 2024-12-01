// Configuração da API
const API_BASE_URL = 'http://localhost:5000/api';

// Estado global
let currentSection = 'dashboard';
let trendingData = {
    brazil: [],
    global: [],
    categories: [],
    featured: []
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Configurar navegação
    setupNavigation();
    
    // Carregar dados iniciais
    loadDashboardData();
    
    // Configurar busca
    setupSearch();
});

// Configuração da navegação
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.closest('.nav-link').dataset.section;
            showSection(section);
        });
    });
}

// Mostrar seção específica
function showSection(sectionId) {
    // Atualizar navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    // Mostrar conteúdo
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;

    // Carregar dados da seção
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'brazil':
            loadBrazilTrending();
            break;
        case 'global':
            loadGlobalTrending();
            break;
        case 'categories':
            loadCategories();
            break;
    }
}

// Carregar dados do dashboard
async function loadDashboardData() {
    showLoading();
    try {
        const [brazilData, globalData, categoriesData] = await Promise.all([
            fetchData('/trending/brazil'),
            fetchData('/trending/global'),
            fetchData('/categories')
        ]);

        // Atualizar contadores
        document.getElementById('brazilCount').textContent = brazilData.playlists.length + ' playlists';
        document.getElementById('globalCount').textContent = globalData.playlists.length + ' playlists';
        document.getElementById('categoriesCount').textContent = categoriesData.categories.items.length + ' categorias';
        document.getElementById('featuredCount').textContent = 
            (brazilData.featured.length + globalData.featured.length) + ' playlists';

        // Atualizar lista de tendências
        updateTrendingList([...brazilData.playlists, ...globalData.playlists]);

    } catch (error) {
        showError('Erro ao carregar dados do dashboard');
    } finally {
        hideLoading();
    }
}

// Atualizar lista de tendências
function updateTrendingList(playlists) {
    const trendingList = document.getElementById('trendingList');
    trendingList.innerHTML = playlists.slice(0, 10).map(playlist => `
        <a href="${playlist.external_urls.spotify}" target="_blank" 
           class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div>
                <h6 class="mb-1">${playlist.name}</h6>
                <small class="text-muted">${playlist.tracks.total} faixas</small>
            </div>
            <span class="badge bg-primary rounded-pill">
                <i class="fas fa-play"></i>
            </span>
        </a>
    `).join('');
}

// Carregar tendências do Brasil
async function loadBrazilTrending() {
    showLoading();
    try {
        const data = await fetchData('/trending/brazil');
        displayPlaylists(data.playlists, 'brazilPlaylists');
    } catch (error) {
        showError('Erro ao carregar tendências do Brasil');
    } finally {
        hideLoading();
    }
}

// Carregar tendências globais
async function loadGlobalTrending() {
    showLoading();
    try {
        const data = await fetchData('/trending/global');
        displayPlaylists(data.playlists, 'globalPlaylists');
    } catch (error) {
        showError('Erro ao carregar tendências globais');
    } finally {
        hideLoading();
    }
}

// Carregar categorias
async function loadCategories() {
    showLoading();
    try {
        const data = await fetchData('/categories');
        displayCategories(data.categories.items);
    } catch (error) {
        showError('Erro ao carregar categorias');
    } finally {
        hideLoading();
    }
}

// Exibir playlists
function displayPlaylists(playlists, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = playlists.map(playlist => `
        <div class="col-md-4 col-lg-3">
            <div class="card playlist-card">
                <img src="${playlist.images[0]?.url || 'placeholder.jpg'}" 
                     class="card-img-top" alt="${playlist.name}">
                <div class="card-body">
                    <h5 class="card-title">${playlist.name}</h5>
                    <p class="card-text">${playlist.description || ''}</p>
                    <a href="${playlist.external_urls.spotify}" 
                       target="_blank" 
                       class="btn btn-spotify">
                        <i class="fab fa-spotify me-2"></i>
                        Ouvir no Spotify
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Exibir categorias
function displayCategories(categories) {
    const container = document.getElementById('categoriesList');
    container.innerHTML = categories.map(category => `
        <div class="col-md-4 col-lg-3">
            <div class="card category-card" onclick="loadCategoryPlaylists('${category.id}', '${category.name}')">
                <img src="${category.icons[0]?.url || 'placeholder.jpg'}" 
                     class="card-img-top category-image" alt="${category.name}">
                <div class="card-body">
                    <h5 class="card-title">${category.name}</h5>
                </div>
            </div>
        </div>
    `).join('');
}

// Carregar playlists de uma categoria
async function loadCategoryPlaylists(categoryId, categoryName) {
    showLoading();
    try {
        const data = await fetchData(`/category/${categoryId}/playlists`);
        // Mudar para a seção de playlists
        const container = document.getElementById('categoriesList');
        container.innerHTML = `
            <div class="col-12 mb-4">
                <button class="btn btn-secondary" onclick="loadCategories()">
                    <i class="fas fa-arrow-left me-2"></i>
                    Voltar para Categorias
                </button>
                <h3 class="mt-3">${categoryName}</h3>
            </div>
        `;
        displayPlaylists(data.playlists.items, 'categoriesList');
    } catch (error) {
        showError(`Erro ao carregar playlists da categoria ${categoryName}`);
    } finally {
        hideLoading();
    }
}

// Configurar busca
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    const handleSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            // Implementar lógica de busca
            console.log('Buscando por:', query);
        }
    };

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Funções de utilidade
async function fetchData(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error('Erro na requisição');
    }
    return await response.json();
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showError(message) {
    // Implementar exibição de erro
    console.error(message);
}

// Funções de ação rápida
function refreshTrending() {
    if (currentSection === 'dashboard') {
        loadDashboardData();
    } else {
        showSection(currentSection);
    }
}

function exportData() {
    // Implementar exportação de dados
    console.log('Exportando dados...');
}

function showFeatured() {
    // Implementar exibição de destaques
    console.log('Mostrando destaques...');
}

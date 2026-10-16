let paginaAtual = 1;
const porPagina = 4;

async function carregarGaleria() {
    const termoInput = document.getElementById('searchInput');
    const termo = termoInput ? termoInput.value : '';
    const grid = document.getElementById('galleryGrid');
    const infoPagina = document.getElementById('infoPagina');

    if (!grid) return;

    grid.innerHTML = '<p style="color:#a0aec0; text-align:center; grid-column: 1/-1;">A carregar dados do MySQL...</p>';

    try {
        const res = await fetch(`/api/fotos?page=${paginaAtual}&per_page=${porPagina}&q=${encodeURIComponent(termo)}`);
        const data = await res.json();

        grid.innerHTML = '';

        if (!data.resultados || data.resultados.length === 0) {
            grid.innerHTML = '<p style="color:#a0aec0; text-align:center; grid-column: 1/-1;">Nenhuma imagem encontrada no banco de dados.</p>';
            return;
        }

        data.resultados.forEach(foto => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <img src="${foto.url_imagem}" alt="${foto.titulo}" onerror="this.src='https://via.placeholder.com/300x200/15192b/ffffff?text=NASA+Image'">
                <div class="gallery-content">
                    <h3>${foto.titulo}</h3>
                    <p><i class="fas fa-user-astronaut"></i> Autor: ${foto.autor}</p>
                </div>
            `;
            grid.appendChild(card);
        });

        if (infoPagina) {
            infoPagina.textContent = `Página ${data.pagina}`;
        }
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p style="color:#fc8181; text-align:center; grid-column: 1/-1;">Erro ao comunicar com a API Flask.</p>';
    }
}

function proximaPagina() {
    paginaAtual++;
    carregarGaleria();
}

function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarGaleria();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarGaleria();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            paginaAtual = 1;
            carregarGaleria();
        });
    }
});
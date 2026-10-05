const API_KEY = "uDZicaK3xrGEdJV93SPObkNSTxmDG6RbxLtKYaEg";

const dataBusca = document.getElementById("dataBusca");
const searchInput = document.getElementById("searchInput");
const resultado = document.getElementById("resultado");
const totalSpan = document.getElementById("total");
const perigososSpan = document.getElementById("perigosos");
const proximoSpan = document.getElementById("proximo");
const searchError = document.getElementById("searchError");
const dataError = document.getElementById("dataError");

let estadoFavoritos = { imagens: [], asteroides: [] };

function mostrarErro(campo, elementoErro, mensagem) {
  if (!campo || !elementoErro) return;
  campo.classList.add("input-error");
  elementoErro.textContent = mensagem;
}

function limparErro(campo, elementoErro) {
  if (!campo || !elementoErro) return;
  campo.classList.remove("input-error");
  elementoErro.textContent = "";
}

function validarTextoBusca(campo, elementoErro, nomeCampo) {
  if (!campo) return false;
  const valor = campo.value.trim();
  if (valor.length === 0) {
    mostrarErro(campo, elementoErro, `${nomeCampo} não pode ficar vazio.`);
    return false;
  }
  if (valor.length < 3) {
    mostrarErro(campo, elementoErro, `${nomeCampo} deve ter pelo menos 3 caracteres.`);
    return false;
  }
  limparErro(campo, elementoErro);
  return true;
}

function validarDataBusca() {
  if (!dataBusca || !dataBusca.value) {
    mostrarErro(dataBusca, dataError, "Selecione uma data para realizar a busca.");
    return false;
  }
  limparErro(dataBusca, dataError);
  return true;
}

if (dataBusca) {
  dataBusca.value = new Date().toISOString().split("T")[0];
  dataBusca.addEventListener("change", validarDataBusca);
}

document.getElementById("buscarBtn")?.addEventListener("click", buscarAsteroides);

searchInput?.addEventListener("input", () => {
  if (searchInput.value.trim().length >= 3) limparErro(searchInput, searchError);
});

async function carregarFavoritosDoBanco() {
  try {
    const resposta = await fetch('/api/favoritos');
    if (!resposta.ok) throw new Error("Erro de comunicação com a API");
    estadoFavoritos = await resposta.json();
    atualizarBadge();
    renderFavoritosImagens();
    renderFavoritosAsteroides();
  } catch (erro) {
    console.error("Erro ao carregar favoritos do banco:", erro);
  }
}

function atualizarBadge() {
  const total = estadoFavoritos.imagens.length + estadoFavoritos.asteroides.length;
  const badge = document.getElementById("favBadge");
  const imgCount = document.getElementById("favImgCount");
  const astCount = document.getElementById("favAstCount");

  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? "flex" : "none";
  }
  if (imgCount) imgCount.textContent = estadoFavoritos.imagens.length;
  if (astCount) astCount.textContent = estadoFavoritos.asteroides.length;
}

document.getElementById("favToggleBtn")?.addEventListener("click", () => {
  const section = document.getElementById("favoritesSection");
  if (!section) return;
  const isHidden = section.style.display === "none" || section.style.display === "";
  section.style.display = isHidden ? "block" : "none";
  if (isHidden) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.getElementById("clearFavoritesBtn")?.addEventListener("click", async () => {
  if (!confirm("Tem certeza que deseja remover todos os favoritos do banco de dados?")) return;
  try {
    await fetch('/api/favoritos', { method: 'DELETE' });
    await carregarFavoritosDoBanco();
    document.querySelectorAll(".btn-fav, .btn-fav-ast").forEach(b => b.classList.remove("active"));
  } catch (erro) {
    console.error("Erro ao limpar favoritos:", erro);
  }
});

document.querySelectorAll(".fav-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".fav-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".fav-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    const panel = document.getElementById(tab.dataset.tab);
    if (panel) panel.classList.add("active");
  });
});

function isImagemFavoritada(src) {
  return estadoFavoritos.imagens.some(i => i.imagem === src);
}

async function toggleFavImagem(src, titulo, descricao) {
  try {
    await fetch('/api/favoritos/imagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagem: src, titulo: titulo, descricao: descricao })
    });
    await carregarFavoritosDoBanco();
  } catch (erro) {
    console.error("Erro ao favoritar imagem:", erro);
  }
}

function renderFavoritosImagens() {
  const grid = document.getElementById("favImagesGrid");
  if (!grid) return;
  if (estadoFavoritos.imagens.length === 0) {
    grid.innerHTML = '<p class="fav-empty">Nenhuma imagem favoritada ainda.</p>';
    return;
  }
  grid.innerHTML = estadoFavoritos.imagens.map(item => `
    <div class="gallery-card">
      <img src="${item.imagem}" alt="${item.titulo}">
      <button class="btn-fav active" data-src="${item.imagem}" data-context="fav-panel" title="Remover dos favoritos">★</button>
      <div class="gallery-content">
        <h3>${item.titulo}</h3>
        <p>${item.descricao}</p>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".btn-fav[data-context='fav-panel']").forEach(btn => {
    btn.addEventListener("click", function () {
      const src = this.dataset.src;
      const item = estadoFavoritos.imagens.find(i => i.imagem === src);
      if (item) toggleFavImagem(item.imagem, item.titulo, item.descricao);
    });
  });
}

function isAsteroideFavoritado(nome) {
  return estadoFavoritos.asteroides.some(a => a.nome === nome);
}

async function toggleFavAsteroide(nome, diametro, distancia, perigoso) {
  try {
    await fetch('/api/favoritos/asteroide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, diametro, distancia, perigoso })
    });
    await carregarFavoritosDoBanco();
  } catch (erro) {
    console.error("Erro ao favoritar asteroide:", erro);
  }
}

function renderFavoritosAsteroides() {
  const tbody = document.getElementById("favAsteroidsTable");
  if (!tbody) return;
  if (estadoFavoritos.asteroides.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="fav-empty">Nenhum asteroide favoritado ainda.</td></tr>';
    return;
  }
  tbody.innerHTML = estadoFavoritos.asteroides.map(ast => `
    <tr>
      <td>${ast.nome}</td>
      <td>${ast.diametro} m</td>
      <td>${ast.distancia} km</td>
      <td class="${ast.perigoso ? 'perigoso' : 'seguro'}">
        ${ast.perigoso ? "⚠️ Sim" : "✅ Não"}
      </td>
      <td>
        <button class="btn-fav-ast active" data-nome="${ast.nome}" data-context="fav-panel" title="Remover dos favoritos">★</button>
      </td>
    </tr>
  `).join("");

  tbody.querySelectorAll(".btn-fav-ast[data-context='fav-panel']").forEach(btn => {
    btn.addEventListener("click", function () {
      const ast = estadoFavoritos.asteroides.find(a => a.nome === this.dataset.nome);
      if (ast) toggleFavAsteroide(ast.nome, ast.diametro, ast.distancia, ast.perigoso);
    });
  });
}

async function buscarAsteroides() {
  if (!validarDataBusca()) return;
  const data = dataBusca.value;
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${data}&end_date=${data}&api_key=${API_KEY}`;
  
  try {
    if (resultado) resultado.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";
    const resposta = await fetch(url);
    const dados = await resposta.json();
    const lista = dados.near_earth_objects[data];
    if (resultado) resultado.innerHTML = "";
    
    let perigosos = 0; let menorDistancia = Infinity;
    
    lista.forEach(ast => {
      const distancia = Number(ast.close_approach_data[0].miss_distance.kilometers);
      const diametro = ast.estimated_diameter.meters.estimated_diameter_max;
      const perigoso = ast.is_potentially_hazardous_asteroid;
      
      if (perigoso) perigosos++;
      if (distancia < menorDistancia) menorDistancia = distancia;
      
      const favAtivo = isAsteroideFavoritado(ast.name) ? "active" : "";
      const nome = ast.name;
      const diametroStr = diametro.toFixed(2);
      const distanciaStr = distancia.toLocaleString();
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${nome}</td>
        <td>${diametroStr} m</td>
        <td>${distanciaStr} km</td>
        <td class="${perigoso ? 'perigoso' : 'seguro'}">${perigoso ? "⚠️ Sim" : "✅ Não"}</td>
        <td><button class="btn-fav-ast ${favAtivo}" data-nome="${nome}" title="Favoritar">★</button></td>
      `;
      
      const btn = tr.querySelector(".btn-fav-ast");
      btn.addEventListener("click", function () {
        this.classList.toggle("active");
        toggleFavAsteroide(nome, diametroStr, distanciaStr, perigoso);
      });
      if (resultado) resultado.appendChild(tr);
    });
    
    if (totalSpan) totalSpan.textContent = lista.length;
    if (perigososSpan) perigososSpan.textContent = perigosos;
    if (proximoSpan) proximoSpan.textContent = menorDistancia.toLocaleString() + " km";
  } catch (erro) {
    if (resultado) resultado.innerHTML = "<tr><td colspan='5'>Erro ao carregar dados.</td></tr>";
  }
}

const galleryGrid = document.getElementById("galleryGrid");

searchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarImagensNASA();
});

async function buscarImagensNASA() {
  if (!validarTextoBusca(searchInput, searchError, "A busca de imagens")) return;
  const termo = searchInput.value.trim();
  if (galleryGrid) galleryGrid.innerHTML = "<p>Carregando imagens...</p>";
  
  try {
    const resposta = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(termo)}&media_type=image`);
    const dados = await resposta.json();
    const imagens = dados.collection.items.slice(0, 12);
    if (galleryGrid) galleryGrid.innerHTML = "";
    
    if (imagens.length === 0) {
      if (galleryGrid) galleryGrid.innerHTML = "<p>Nenhuma imagem encontrada.</p>";
      return;
    }
    
    imagens.forEach(item => {
      const src = item.links?.[0]?.href;
      const titulo = item.data?.[0]?.title || "Sem título";
      const descricao = (item.data?.[0]?.description || "").substring(0, 150) + "...";
      if (!src) return;
      
      const favAtivo = isImagemFavoritada(src) ? "active" : "";
      
      const card = document.createElement("div");
      card.className = "gallery-card";
      card.innerHTML = `
        <img src="${src}" alt="${titulo}">
        <button class="btn-fav ${favAtivo}" data-src="${src}" title="Favoritar">★</button>
        <div class="gallery-content">
          <h3>${titulo}</h3>
          <p>${descricao}</p>
        </div>
      `;
      
      const btn = card.querySelector(".btn-fav");
      btn.addEventListener("click", function () {
        this.classList.toggle("active");
        toggleFavImagem(src, titulo, descricao);
      });
      if (galleryGrid) galleryGrid.appendChild(card);
    });
  } catch (erro) {
    if (galleryGrid) galleryGrid.innerHTML = "<p>Erro ao carregar imagens.</p>";
  }
}

carregarFavoritosDoBanco().then(() => {
  buscarAsteroides();
});
# 🚀 Projeto Web API (Breno Hyago e Rodrigo Yuzo)- Galeria NASA (Flask + MySQL + MVC)

Aplicação Web API JSON desenvolvida em **Python com Flask**, utilizando a arquitetura **MVC** e integrada com **MySQL no Docker**.

## 🛠️ Tecnologias Utilizadas
- **Backend:** Python, Flask, `mysql-connector-python`
- **Banco de Dados:** MySQL (Docker Container)
- **Frontend:** HTML5, CSS3, JavaScript (Fetch API)

## 📌 Requisitos da API
- `GET /` — Interface visual (Frontend NASA)
- `GET /api/fotos` — Lista todas as fotos com suporte a paginação (`page`, `per_page`) e filtro (`q`)
- `GET /api/usuarios/<id>/fotos` — Lista as fotos associadas a um utilizador específico

## ⚙️ Como Executar o Projeto

1. **Iniciar a Base de Dados no Docker:**
   ```bash
   docker start mysql-projeto

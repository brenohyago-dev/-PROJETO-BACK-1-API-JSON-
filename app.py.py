from flask import Flask, render_template, request, jsonify, g
import sqlite3

app = Flask(__name__)
DATABASE = 'banco.db'

# --- CONFIGURAÇÃO DO BANCO DE DADOS ---
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Cria as tabelas caso não existam
with app.app_context():
    db = get_db()
    # Tabela para Imagens
    db.execute('''CREATE TABLE IF NOT EXISTS imagens_favoritas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    imagem TEXT NOT NULL,
                    titulo TEXT,
                    descricao TEXT)''')
    # Tabela para Asteroides
    db.execute('''CREATE TABLE IF NOT EXISTS asteroides_favoritos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    diametro TEXT,
                    distancia TEXT,
                    perigoso INTEGER)''')
    db.commit()


# --- ROTAS (A NOSSA API) ---

# 1. Rota principal para abrir o site
@app.route('/')
def index():
    return render_template('index.html')

# 2. Rota para LER todos os favoritos do banco de dados (GET)
@app.route('/api/favoritos', methods=['GET'])
def get_favoritos():
    db = get_db()
    
    # Busca imagens
    cur_img = db.execute('SELECT * FROM imagens_favoritas')
    imagens = [{'imagem': row['imagem'], 'titulo': row['titulo'], 'descricao': row['descricao']} for row in cur_img.fetchall()]
    
    # Busca asteroides
    cur_ast = db.execute('SELECT * FROM asteroides_favoritos')
    asteroides = [{'nome': row['nome'], 'diametro': row['diametro'], 'distancia': row['distancia'], 'perigoso': bool(row['perigoso'])} for row in cur_ast.fetchall()]
    
    return jsonify({'imagens': imagens, 'asteroides': asteroides})

# 3. Rota para ADICIONAR ou REMOVER uma imagem (POST)
@app.route('/api/favoritos/imagem', methods=['POST'])
def toggle_imagem():
    dados = request.json
    imagem_src = dados.get('imagem')
    db = get_db()
    
    # Se já existir, remove. Se não existir, insere.
    cursor = db.execute('SELECT id FROM imagens_favoritas WHERE imagem = ?', (imagem_src,))
    if cursor.fetchone():
        db.execute('DELETE FROM imagens_favoritas WHERE imagem = ?', (imagem_src,))
    else:
        db.execute('INSERT INTO imagens_favoritas (imagem, titulo, descricao) VALUES (?, ?, ?)',
                   (imagem_src, dados.get('titulo'), dados.get('descricao')))
    db.commit()
    return jsonify({'mensagem': 'Atualizado com sucesso!'})

# 4. Rota para ADICIONAR ou REMOVER um asteroide (POST)
@app.route('/api/favoritos/asteroide', methods=['POST'])
def toggle_asteroide():
    dados = request.json
    nome = dados.get('nome')
    db = get_db()
    
    cursor = db.execute('SELECT id FROM asteroides_favoritos WHERE nome = ?', (nome,))
    if cursor.fetchone():
        db.execute('DELETE FROM asteroides_favoritos WHERE nome = ?', (nome,))
    else:
        db.execute('INSERT INTO asteroides_favoritos (nome, diametro, distancia, perigoso) VALUES (?, ?, ?, ?)',
                   (nome, dados.get('diametro'), dados.get('distancia'), int(dados.get('perigoso', 0))))
    db.commit()
    return jsonify({'mensagem': 'Atualizado com sucesso!'})

# 5. Rota para LIMPAR tudo (DELETE)
@app.route('/api/favoritos', methods=['DELETE'])
def limpar_favoritos():
    db = get_db()
    db.execute('DELETE FROM imagens_favoritas')
    db.execute('DELETE FROM asteroides_favoritos')
    db.commit()
    return jsonify({'mensagem': 'Tudo limpo!'})

if __name__ == '__main__':
    app.run(debug=True)
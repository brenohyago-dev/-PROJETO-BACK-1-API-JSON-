from flask import Flask, render_template
from controllers.foto_controller import foto_bp

app = Flask(__name__)

# Registra o Blueprint com as rotas da API JSON
app.register_blueprint(foto_bp)

# Rota principal para carregar a interface da NASA (index.html)
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
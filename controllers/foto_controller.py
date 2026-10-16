from flask import Blueprint, jsonify, request
from models.foto_model import FotoModel

foto_bp = Blueprint('foto_bp', __name__)

@foto_bp.route('/api/fotos', methods=['GET'])
def listar_fotos():
    pagina = request.args.get('page', default=1, type=int)
    por_pagina = request.args.get('per_page', default=4, type=int)
    busca = request.args.get('q', default="", type=str)
    
    fotos, total = FotoModel.get_todas_fotos(pagina, por_pagina, busca)
    
    return jsonify({
        "pagina": pagina,
        "por_pagina": por_pagina,
        "total_resultados": total,
        "resultados": fotos
    })

@foto_bp.route('/api/usuarios/<int:usuario_id>/fotos', methods=['GET'])
def listar_fotos_usuario(usuario_id):
    fotos = FotoModel.get_fotos_por_usuario(usuario_id)
    return jsonify({
        "usuario_id": usuario_id,
        "total_fotos": len(fotos),
        "fotos": fotos
    })
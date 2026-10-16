from config import get_db_connection

class FotoModel:
    @staticmethod
    def get_todas_fotos(pagina=1, por_pagina=4, busca=""):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        offset = (pagina - 1) * por_pagina
        
        if busca:
            query = "SELECT * FROM fotos WHERE titulo LIKE %s LIMIT %s OFFSET %s"
            cursor.execute(query, (f"%{busca}%", por_pagina, offset))
        else:
            query = "SELECT * FROM fotos LIMIT %s OFFSET %s"
            cursor.execute(query, (por_pagina, offset))
            
        fotos = cursor.fetchall()
        
        if busca:
            cursor.execute("SELECT COUNT(*) as total FROM fotos WHERE titulo LIKE %s", (f"%{busca}%",))
        else:
            cursor.execute("SELECT COUNT(*) as total FROM fotos")
        
        total_res = cursor.fetchone()
        total = total_res['total'] if total_res else 0
        
        cursor.close()
        conn.close()
        
        return fotos, total

    @staticmethod
    def get_fotos_por_usuario(usuario_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT f.*, u.nome as autor 
            FROM fotos f 
            JOIN usuarios u ON f.usuario_id = u.id 
            WHERE u.id = %s
        """
        cursor.execute(query, (usuario_id,))
        fotos = cursor.fetchall()
        cursor.close()
        conn.close()
        return fotos
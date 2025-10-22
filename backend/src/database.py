# ============================================
# DATABASE Configuration
# Configuração do banco de dados SQLAlchemy
# ============================================

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Instância global do SQLAlchemy
db = SQLAlchemy()
migrate = Migrate()

def init_db(app):
    """
    Inicializa o banco de dados com a aplicação Flask
    
    Args:
        app: Instância da aplicação Flask
    """
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Importar modelos para que sejam reconhecidos pelo SQLAlchemy
    from src.models import User, Memory, Theme
    
    # Criar tabelas se não existirem (apenas em desenvolvimento)
    with app.app_context():
        if app.config.get('FLASK_ENV') == 'development':
            db.create_all()

def get_db():
    """
    Retorna a instância do banco de dados
    
    Returns:
        SQLAlchemy: Instância do banco
    """
    return db

def create_tables():
    """
    Cria todas as tabelas do banco de dados
    """
    db.create_all()

def drop_tables():
    """
    Remove todas as tabelas do banco de dados
    CUIDADO: Esta operação é irreversível!
    """
    db.drop_all()

def reset_database():
    """
    Reseta o banco de dados (remove e recria todas as tabelas)
    CUIDADO: Esta operação é irreversível!
    """
    drop_tables()
    create_tables()

class DatabaseManager:
    """
    Gerenciador do banco de dados com métodos utilitários
    """
    
    @staticmethod
    def commit():
        """
        Faz commit das alterações pendentes
        """
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def rollback():
        """
        Desfaz alterações pendentes
        """
        db.session.rollback()
    
    @staticmethod
    def close():
        """
        Fecha a sessão do banco
        """
        db.session.close()
    
    @staticmethod
    def add(obj):
        """
        Adiciona objeto à sessão
        
        Args:
            obj: Objeto a ser adicionado
        """
        db.session.add(obj)
    
    @staticmethod
    def delete(obj):
        """
        Remove objeto da sessão
        
        Args:
            obj: Objeto a ser removido
        """
        db.session.delete(obj)
    
    @staticmethod
    def save_and_commit(obj):
        """
        Salva objeto e faz commit
        
        Args:
            obj: Objeto a ser salvo
            
        Returns:
            obj: Objeto salvo
        """
        try:
            db.session.add(obj)
            db.session.commit()
            return obj
        except Exception as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def bulk_insert(objects):
        """
        Insere múltiplos objetos de uma vez
        
        Args:
            objects: Lista de objetos a serem inseridos
        """
        try:
            db.session.bulk_save_objects(objects)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def execute_raw_sql(sql, params=None):
        """
        Executa SQL bruto
        
        Args:
            sql (str): Comando SQL
            params (dict, optional): Parâmetros para o SQL
            
        Returns:
            Result: Resultado da execução
        """
        try:
            result = db.session.execute(sql, params or {})
            db.session.commit()
            return result
        except Exception as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def get_table_info(table_name):
        """
        Obtém informações sobre uma tabela
        
        Args:
            table_name (str): Nome da tabela
            
        Returns:
            dict: Informações da tabela
        """
        try:
            # Para SQLite
            result = db.session.execute(f"PRAGMA table_info({table_name})")
            columns = result.fetchall()
            
            return {
                'table_name': table_name,
                'columns': [
                    {
                        'name': col[1],
                        'type': col[2],
                        'not_null': bool(col[3]),
                        'default': col[4],
                        'primary_key': bool(col[5])
                    }
                    for col in columns
                ]
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_database_stats():
        """
        Obtém estatísticas do banco de dados
        
        Returns:
            dict: Estatísticas do banco
        """
        try:
            stats = {}
            
            # Contar registros em cada tabela
            from src.models import User, Memory, Theme
            
            stats['users'] = db.session.query(User).count()
            stats['memories'] = db.session.query(Memory).count()
            stats['themes'] = db.session.query(Theme).count()
            
            return stats
        except Exception as e:
            return {'error': str(e)}
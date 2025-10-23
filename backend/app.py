# ============================================
# MAIN APPLICATION - Flask Factory Pattern
# Ponto de entrada da aplicação
# ============================================

from src.app_factory import create_app
from src.config import Config

# Criar instância da aplicação usando Factory Pattern
app = create_app(Config)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
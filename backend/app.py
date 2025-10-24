# ============================================
# MAIN APPLICATION - app.py
# Ponto de entrada principal da aplicação Flask
# ============================================

"""
Arquivo principal que inicializa a aplicação Flask Memory Book.

Responsabilidades:
- Determinar o ambiente de execução (development/production)
- Carregar configurações apropriadas para o ambiente
- Criar instância da aplicação usando Factory Pattern
- Configurar servidor para desenvolvimento e produção
- Definir ponto de entrada para execução da aplicação

Dependências:
- src.app_factory: Factory para criação da aplicação Flask
- src.config: Configurações por ambiente
- os: Variáveis de ambiente do sistema

Padrões de Projeto:
- Factory Pattern: Utiliza create_app() para instanciar a aplicação
- Configuration Pattern: Carrega configs baseadas no ambiente
"""

import os
from src.app_factory import create_app
from src.config import config

# Determinar ambiente (produção ou desenvolvimento)
env = os.environ.get('FLASK_ENV', 'development')
app_config = config.get(env, config['default'])

# Criar instância da aplicação usando Factory Pattern
app = create_app(app_config)

if __name__ == '__main__':
    # Configurações para desenvolvimento e produção
    port = int(os.environ.get('PORT', 5000))
    debug = env == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)
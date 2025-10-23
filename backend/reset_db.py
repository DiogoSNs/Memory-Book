#!/usr/bin/env python3
"""
Script para resetar o banco de dados
Recria todas as tabelas com as novas colunas
"""

import os
import sys
from flask import Flask

# Adicionar o diretório src ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.app_factory import create_app
from src.config import Config
from src.models import User, Memory, Theme

def reset_db():
    """Reset do banco de dados"""
    print("🔄 Iniciando reset do banco de dados...")
    
    # Criar aplicação
    app = create_app(Config)
    
    with app.app_context():
        try:
            # Importar a instância correta do db
            from src.app_factory import db
            
            # Reset das tabelas
            print("🗑️  Removendo tabelas existentes...")
            db.drop_all()
            
            print("🏗️  Criando novas tabelas...")
            db.create_all()
            
            print("✅ Banco de dados resetado com sucesso!")
            print("📊 Estrutura das tabelas:")
            
            # Mostrar estrutura das tabelas
            inspector = db.inspect(db.engine)
            for table_name in inspector.get_table_names():
                print(f"\n📋 Tabela: {table_name}")
                columns = inspector.get_columns(table_name)
                for col in columns:
                    print(f"   - {col['name']}: {col['type']}")
                    
        except Exception as e:
            print(f"❌ Erro ao resetar banco: {e}")
            return False
    
    return True

if __name__ == "__main__":
    if reset_db():
        print("\n🎉 Reset concluído! Você pode agora iniciar o servidor.")
    else:
        print("\n💥 Falha no reset do banco de dados.")
        sys.exit(1)
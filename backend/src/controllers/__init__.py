# ============================================
# CONTROLLERS PACKAGE - MVC Pattern
# Controllers/Views da aplicação Flask
# ============================================

from .auth_controller import auth_bp
from .memory_controller import memory_bp
from .theme_controller import theme_bp

__all__ = ['auth_bp', 'memory_bp', 'theme_bp']
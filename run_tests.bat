@echo off
setlocal

echo Limpando cache do pytest...
if exist .pytest_cache (
    rmdir /S /Q .pytest_cache
)

echo Rodando testes com cobertura...
python -m pytest tests --maxfail=1 --disable-warnings --cov=backend --cov-report=term

echo.
echo Testes finalizados.

endlocal

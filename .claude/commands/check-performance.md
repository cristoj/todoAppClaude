Analiza este coproyecto React para problemas de performance, solo la carpeta @src no los tests.

Busca:
1. **Re-renders innecesarios** - Componentes que re-renderizan sin cambios
2. **Funciones en render** - Funciones definidas dentro del JSX
3. **Objetos y arrays en dependencies** - Causarán re-renders infinitos
4. **Missing useMemo/useCallback** - Dónde podrían optimizar
5. **Listas sin keys correctas** - Impacto en performance
6. **Imports grandes** - Oportunidades para code splitting

Para cada problema:
- Descripción del impacto
- Código problemático
- Código optimizado
- Mejora esperada
- [feature]: $FEATURE | funcionalidad a incorporar
- [description]; $FEATURE | Descripción breve de la nueva funcionalidad
---

# Documentación para implantar la nueva funcionalidad solicitada 

Se crearán dos carpetas @docs/dev/{feature}.md y @docs/designer/{feature}.md con los contenidos solicitados a continuación. Para la documentación del desarrollador serás un analista experto en el desarrollo de aplicaciones web en React. Para el documento de diseño serás un epecialista en UI/UX amante del minimalismo pero que siempre sorprende con sus creatividades. Los documentos no deberían ser muy extensos pues son features sencillas. Lo mínimo para que sean ejecutables

## 1. Documentación para diseñadores
- Generar los mockups visuales no wireframes en ACII, imágenes en formato JPG o PNG de la nueva funcionalidad ([feature]) de como quedaría en producción (no necesaríamente como quedará exacto pero si lo que espera el diseñador) éstas imágenes se guardarán en @docs/user/images/{feature}-{index}.{jpg|png}, desde el módulo principal hasta otros que se vean afectados, no siempre la implementación afectará a demás módulos, tendrás que valorarlo como experto en UI/UX. Siempre siguiendo el diseño del proyecto
- Generar una guía visual de cómo quedará esta nueva funcionalidad ([feature]), deberá tener además de texto, capturas de pantallas para facilitar la comprensión de la implementación de [feature] y que el equipo técnico pueda implementarlo

## 2. Documentación para desarrolladores
- Como todas las demás funcionalidades deberá estar regida por los principios SOLID y DDD
- Documentar los test a realizar, unos test robustos que cubran al menos el 80% del código incluídos test unitarios, integración y e2e.
- Analizar los requerimientos necesarios para llevar a cabo dicha implemnetación, en cuanto a nuevas dependencias para la lógica de código como diseño.
- Deberás copiar el diseño que del documento alojado en @docs/user/{feature}.md que tendrá capturas de pantalla con los mockups. Esas imagenes estarán en la carpeta @docs/user/images/{feature}-{index}.{jpg|png}, úsalas e intenta que los **componentes visuales sean más parecidos a ellas** muy importante, haz que se parezcan lo máximo posible.
- Realización de un documento completo con los pasos a seguir para la implementación de la nueva funcionalidad ([feature]). Tendrá que tener en cuenta plazos y complejidad de cada paso.
- Crear una issue en el repo con el tag enhancement con la solicitud y una breve documentación de lo que se va a realizar.

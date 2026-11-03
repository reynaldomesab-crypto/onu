# 🎮 Guía para Jugar "El Arte de lo Posible"

## 🚀 Primeros Pasos

### 1. Instalar Dependencias

```bash
cd /home/reynaldomesab/Proyectos/ONU
pnpm install
```

### 2. Iniciar el Juego

```bash
pnpm dev
```

### 3. Abrir en el Navegador

- **Local**: http://localhost:5173
- **Móvil**: Escanear el QR en la consola o usar ngrok para compartir

## 🎮 Cómo Jugar - Paso a Paso

### Paso 1: Selección de País (Home)

1. **En la pantalla de inicio**, verás 5 países E10 (miembros electos)
2. **Tus opciones**:
   - 🇧🇷 Brasil (América)
   - 🇯🇵 Japón (Asia)
   - 🇩🇪 Alemania (Europa)
   - 🇮🇳 India (Asia)
   - 🇿🇦 Sudáfrica (África)

3. **No puedes seleccionar P5** (China 🇨🇳, Francia 🇫🇷, Rusia 🇷🇺, Reino Unido 🇬🇧, Estados Unidos 🇺🇸)
   - Los P5 tienen derecho a veto
   - Solo actúan como contraparte en la negociación

4. Haz clic en un país E10 para seleccionarlo

### Paso 2: Briefing (Resumen del Día)

Una vez seleccionado tu país:

1. **Revisa los eventos del día**:
   - Mueve el scroll para ver todos los eventos
   - Cada evento muestra:
     - Título del evento
     - Descripción
     - Urgencia (alta/media/baja)
     - Países involucrados

2. **Atiende eventos** (opcional):
   - Haz clic en "Atender" para marcar el evento como atendido
   - Esto cuesta 1 acción

3. **Acciones disponibles**:
   - Ir a Negociación (1 acción)
   - Ir a Redacción (1 acción)

### Paso 3: Negociación (Chat con Representantes)

1. **Comunícate con otros países**:
   - Haz clic en un botón del país que quieras consultar
   - Cada consulta cuesta 1 acción
   - Selecciona entre: USA, CHN, RUS, FRA, GBR, BRA, JPN, DEU, IND, ZAF

2. **Envía mensajes**:
   - Escribe tu mensaje en el input
   - Presiona "Enviar"
   - La IA responde automáticamente

3. **Consultas disponibles**:
   - 3 consultas por día (1 acción cada una)
   - La IA simula respuestas de los países
   - Respuestas de IA son predefinidas para cada país

4. **Avanzar a Redacción**:
   - Haz clic en "Pas
   - Necesitas 1 acción

### Paso 4: Redacción (Selección de Cláusulas)

1. **Crea un borrador** (si no existe):
   - Haz clic en "Crear Borrador" (1 acción)
   - Elige el tono: Conciliador, Equilibrado, Firme

2. **Selecciona cláusulas**:
   - Verás 4 categorías: Condena, Llamado, Sanciones, Monitoreo
   - Cada cláusula muestra:
     - Texto de la cláusula
     - Nivel de impacto (bajo/medio/alto)
     - Riesgo de veto por cada P5 (bajo/medio/alto)
   - Haz clic en "Añadir" para añadir la cláusula al borrador

3. **Revisa el borrador**:
   - Panel central: muestra el borrador actual
   - Panel derecho: riesgos de veto por P5
   - Barra de impacto: muestra el impacto total

4. **Modifica el borrador**:
   - Cambia el tono: Conciliador, Equilibrado, Firme
   - Elimina cláusulas con el botón "×"
   - Haz clic en "Limpiar" para empezar de nuevo

5. **Presenta a Votación**:
   - Haz clic en "Presentar a Votación" (1 acción)
   - Necesitas al menos 1 cláusula seleccionada

### Paso 5: Votación (Predicción de Veto)

1. **Ves la predicción del riesgo de veto**:
   - Riesgo global de veto (0-100%)
   - Riesgo por cada P5 (bajo/medio/alto)
   - Países P5 que probablemente vetarán
   - Recomendación del modelo

2. **Verifica el riesgo**:
   - Si el riesgo es alto, revisa las cláusulas de alto impacto
   - Cambia el tono si es necesario
   - Elimina cláusulas de alto riesgo

3. **Presenta el borrador**:
   - Haz clic en "Proceder a Revelación"
   - El borrador se presenta a votación

### Paso 6: Revelación (Resultados)

1. **Verifica el resultado**:
   - ✅ Resolución Aprobada
   - ❌ Resolución Rechazada
   - 📊 Resultados: A favor, en contra, abstenciones
   - 🚫 Vetos ejercidos (si hay)

2. **Compara con historial**:
   - Verifica si tu resultado coincide con historial
   - Compara con el "resultado histórico" de ejemplo

3. **Siguiente Día**:
   - Haz clic en "Nuevo Día" (1 acción)
   - El presupuesto se reinicia (3 acciones)
   - Los eventos se reinician

## 🎯 Reglas del Juego

### Regla 1: Tu rol (E10)
- Eres siempre un miembro electo (E10)
- No puedes ser un P5 (con veto)
- Presides el Consejo

### Regla 2: Presupuesto de Acciones
- Tienes 3 acciones por día
- 1 acción = 1 presentación de borrador
- 1 acción = 3 consultas en negociación
- Las acciones no se acumulan de día en día

### Regla 3: Máquina de Estados
- El juego sigue 5 fases:
  1. BRIEFING
  2. NEGOTIATION
  3. DRAFTING
  4. VOTING
  5. REVEAL

### Regla 4: Riesgo de Veto
- Cada cláusula tiene riesgo de veto por cada P5
- Impacto alto = riesgo alto
- Tono firme = riesgo alto
- Tono conciliador = riesgo bajo

## 🎨 Características de la UI

### Sistema de Notificaciones
- Notificaciones aparecen en la esquina superior derecha
- 4 tipos: éxito, error, advertencia, información
- Auto-eliminación después de 4 segundos
- Puedes cerrarlas manualmente

### Animaciones
- Transiciones suaves entre fases
- Animación de llenado para barras de progreso
- Animación pulse slow para indicadores importantes
- Animación slide-in para notificaciones

### Responsive Design
- Funciona en móviles, tablets y desktop
- Grid responsive para países
- Touch-friendly (mínimo 44px)

## 📱 Para Móvil (Android)

### Instalar en tu dispositivo

1. **Build del APK**:
   ```bash
   cd /home/reynaldomesab/Proyectos/ONU
   npx cap build android
   ```

2. **Instalar el APK**:
   - Conecta tu Android por USB
   - Sincroniza:
     ```bash
     npx cap sync
     ```
   - Abre en Android Studio:
     ```bash
     npx cap open android
     ```
   - Ejecuta la app en el emulador o dispositivo real

### Mejoras para Móvil
- Botones más grandes
- Navegación táctil
- Scroll suave
- Menú hamburguesa en móvil

## ⚙️ Configuración de la API

### Datos Simulados (Por defecto)
- Los datos se cargan desde archivos TypeScript
- Actualización automática cada 7 días
- Datos estáticos

### Datos en Vivo (Conexión API)
Para conectar la API de la ONU:

1. Edita `src/services/unDataService.ts`
2. Descomenta las llamadas `fetch` reales
3. Comenta o elimina los return con datos simulados
4. Inicia la app: `pnpm dev`

Ver documentación completa en `UN_API_INTEGRATION.md`

## 🎯 Estrategia de Juego

### Estrategia Básica
1. **Negocia primero**: Usa tus 3 consultas para entender las posiciones de los países
2. **Selecciona cláusulas**: Elige cláusulas con bajo riesgo de veto
3. **Equilibra el tono**: Usa tono equilibrado para reducir riesgo
4. **Presenta pronto**: No esperes demasiado para presentar
5. **Revisa el riesgo**: Mira el riesgo de veto antes de presentar

### Estrategia Avanzada
1. **Analiza el contexto**: Usa el briefing para entender la situación
2. **Negocia con P5**: Conecta con los 5 países P5
3. **Usa cláusulas de bajo impacto**: Evita cláusulas de alto impacto
4. **Cambia el tono dinámicamente**: Usa tono conciliador si el riesgo es alto
5. **Aprende de errores**: Si tu resolución es rechazada, revisa por qué

## 📊 Estadísticas del Juego

### Métricas a observar
- **Riesgo de veto global**: < 33% (bajo), 33-66% (medio), > 66% (alto)
- **Países que vetan**: Observa cuáles países P5 suelen vetar
- **Impacto total**: Más bajo es mejor
- **Acciones restantes**: Planifica tu estrategia

### Objetivos
- Aprobar resoluciones
- Evitar vetos
- Comprender las dinámicas del Consejo

## 🎉 Jugar en Días Simulados

El juego se desarrolla en días simulados:
- Día 1: Primer día
- Día 2: Segundo día
- ...

Cada día:
- Se reinicia el presupuesto (3 acciones)
- Se reinician los eventos
- Se reinician los mensajes de chat
- El borrador actual se pierde

## 🔧 Solución de Problemas

### Problema: No puedo seleccionar mi país
**Solución**: Asegúrate de seleccionar un país E10 (miembro electo). Los P5 no son seleccionables.

### Problema: No hay acciones disponibles
**Solución**: Necesitas avanzar a un nuevo día para reiniciar el presupuesto.

### Problema: La aplicación no carga
**Solución**:
1. Ejecuta `pnpm install` si hay dependencias faltantes
2. Ejecuta `pnpm dev` para iniciar el servidor
3. Verifica la consola para errores

### Problema: Los datos no se actualizan
**Solución**:
1. Verifica tu conexión a internet
2. Haz clic en "Actualizar" en el header
3. Revisa los logs del navegador

## 📚 Recursos Adicionales

- **Documentación del juego**: `README.md`
- **Estructura del proyecto**: `PROJECT_STRUCTURE.md`
- **Diagramas de flujo**: `GAME_FLOW.md`
- **Guía de mejoras**: `WEB_APP_UPGRADE.md`
- **Integración API**: `UN_API_INTEGRATION.md`

## 🎮 Resumen Rápido

1. **Selecciona tu país E10**
2. **Revisa el Briefing**
3. **Negocia con otros países**
4. **Redacta una resolución**
5. **Presenta a votación**
6. **Verifica el resultado**
7. **Avanza al próximo día**

---

**¡Disfruta jugando!** 🎉

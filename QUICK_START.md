# Comandos Rápidos - Proyecto ONU

## 🚀 Inicio Rápido

```bash
# 1. Navegar al proyecto
cd /home/reynaldomesab/Proyectos/ONU

# 2. Instalar dependencias
pnpm install

# 3. Iniciar desarrollo (web)
pnpm dev
```

## 📱 Capacitor (Android)

```bash
# Añadir plataforma Android
npx cap add android

# Sincronizar web con Android
npx cap sync

# Abrir en Android Studio
npx cap open android

# Build APK
npx cap build android
```

## 🧪 Tests

```bash
# Ejecutar tests
pnpm test

# Ejecutar tests en modo watch
pnpm test --watch
```

## 📦 Build

```bash
# Build de producción
pnpm build

# Preview del build
pnpm preview
```

## 📝 Scripts Disponibles

```bash
pnpm dev           # Desarrollo web
pnpm build         # Build de producción
pnpm preview       # Preview del build
pnpm test          # Ejecutar tests
pnpm test:watch    # Tests en modo watch
pnpm check         # Type checking (tsc)
```

## 📚 Documentación

```bash
# README principal
cat README.md

# Estructura del proyecto
cat PROJECT_STRUCTURE.md

# Flujo del juego
cat GAME_FLOW.md

# Reporte de completitud
cat COMPLETION_REPORT.md
```

## 🛠️ Estructura de Archivos

```
ONU/
├── src/
│   ├── components/      # Componentes React
│   ├── pages/           # Páginas
│   ├── store/           # Zustand store
│   ├── services/        # API service
│   ├── models/          # ONNX model
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilidades
│   ├── hooks/           # Hooks personalizados
│   ├── assets/          # Assets
│   └── tests/           # Tests
├── android/             # Proyecto Capacitor
├── models/              # Modelo ONNX
├── dist/                # Build de producción
└── [Archivos de config]
```

## 🎮 Controles del Juego

1. **Home**: Seleccione su país E10
2. **Briefing**: Revisa los eventos del día
3. **Negotiation**: Envíe mensajes y contacte países
4. **Drafting**: Seleccione cláusulas para el borrador
5. **Voting**: Presente el borrador y vea la predicción
6. **Reveal**: Verifique el resultado y avance de día

## ⚙️ Variables de Entorno

- `.env.development`: Variables para desarrollo
- `.env.production`: Variables para producción

## 🔧 Configuración de Capacitor

- `capacitor.config.ts`: Configuración de la app móvil

## 📊 Estadísticas del Proyecto

- **Archivos TypeScript**: 28
- **Componentes**: 14
- **Tipos**: 10+
- **Fases**: 5
- **Documentación**: 4 archivos

## 🎯 Próximos Pasos

1. Añadir modelo ONNX real en `/models/veto_model.onnx`
2. Conectar API de la ONU en `apiService.ts`
3. Mejorar respuestas de IA con LLM
4. Añadir más contenido (cláusulas, países, eventos)

---

**Estado**: ✅ Proyecto completado y funcional
**Ubicación**: `/home/reynaldomesab/Proyectos/ONU`
**Stack**: React + TypeScript + Vite + Zustand + Tailwind + Capacitor + ONNX Runtime

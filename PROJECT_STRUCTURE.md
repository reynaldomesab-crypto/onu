# Estructura Detallada del Proyecto

## Archivos de Configuración

```
├── package.json           # Dependencias y scripts
├── pnpm-lock.yaml         # Lockfile de pnpm
├── tsconfig.json          # Configuración de TypeScript
├── tsconfig.node.json     # Configuración de TypeScript para Vite
├── vite.config.ts         # Configuración de Vite
├── vite-env.d.ts          # Definiciones de tipos para Vite
├── tailwind.config.js     # Configuración de Tailwind CSS
├── postcss.config.js      # Configuración de PostCSS
├── capacitor.config.ts    # Configuración de Capacitor
├── .env.development       # Variables de entorno (dev)
├── .env.production        # Variables de entorno (prod)
└── .gitignore            # Archivos a ignorar en git
```

## Directorio `src/`

### `src/types/` - Tipos TypeScript

```
├── index.ts              # Interfaces principales del juego
│   ├── Country          # País miembro del Consejo
│   ├── Clause           # Cláusula predefinida
│   ├── Draft            # Borrador de resolución
│   ├── GamePhase        # Fases del juego
│   ├── GameState        # Estado completo del juego
│   ├── VetoRisk         # Resultado de predicción
│   ├── VoteResult       # Resultado de votación
│   ├── ChatMessage      # Mensaje de chat
│   ├── DailyEvent       # Evento del día
│   └── GameAction       # Registro de acciones
├── countries.ts         # Datos de países (P5 + E10)
├── clauses.ts           # Cláusulas predefinidas
└── events.ts            # Eventos simulados
```

### `src/store/` - Gestión de Estado

```
└── useGameStore.ts      # Zustand store del juego
    ├── Estado inicial
    ├── Acciones del juego
    │   ├── initGame()           # Seleccionar país del jugador
    │   ├── setPhase()           # Cambiar fase
    │   ├── nextDay()            # Avanzar al día siguiente
    │   ├── useAction()          # Gestionar presupuesto
    │   ├── createDraft()        # Crear borrador
    │   ├── addClauseToDraft()   # Añadir cláusula
    │   ├── removeClauseFromDraft() # Eliminar cláusula
    │   ├── setDraftTone()       # Cambiar tono
    │   ├── submitDraft()        # Presentar a votación
    │   ├── addPlayerMessage()   # Añadir mensaje del jugador
    │   ├── addAiResponse()      # Añadir respuesta de IA
    │   ├── markEventAddressed() # Marcar evento como atendido
    │   ├── resetGame()          # Reiniciar juego
    │   ├── setError()           # Establecer mensaje de error
    │   └── setLoading()         # Estado de carga
    └── Persistencia (opcional)
```

### `src/services/` - Servicios

```
└── apiService.ts        # Placeholder de API de la ONU
    ├── fetchDailyEvents()       # Obtener eventos del día
    ├── fetchCountries()         # Obtener lista de países
    ├── fetchDraft()             # Obtener borrador por ID
    ├── fetchHistoricalResult()  # Obtener resultado histórico
    └── submitDraftForVote()     # Enviar borrador a votación
```

### `src/models/` - Modelos de IA

```
└── vetoModel.ts         # Modelo ONNX Runtime Web
    ├── loadModel()              # Cargar modelo ONNX
    ├── isModelLoaded()          # Verificar si está cargado
    ├── predictVetoRisk()        # Predecir riesgo de veto
    └── unloadModel()            # Liberar modelo
```

### `src/components/` - Componentes React

```
├── game/                # Componentes de fases del juego
│   ├── BriefingPhase.tsx    # Pantalla de briefing
│   ├── NegotiationPhase.tsx # Pantalla de negociación
│   ├── DraftingPhase.tsx    # Pantalla de redacción
│   ├── VotingPhase.tsx      # Pantalla de votación
│   ├── RevealPhase.tsx      # Pantalla de revelación
│   └── Game.tsx             # Router interno
└── ui/                   # Componentes reutilizables
    ├── Button.tsx            # Botón con variantes
    ├── Card.tsx              # Tarjeta genérica
    ├── Badge.tsx             # Badge con impactos
    ├── CountryBadge.tsx      # Badge con bandera de país
    ├── DayBudgetBar.tsx      # Barra de presupuesto
    ├── PhaseHeader.tsx       # Header de fase
    └── PlayerRestrictionNotice.tsx  # Aviso de restricción
```

### `src/pages/` - Páginas

```
└── Home.tsx             # Pantalla de inicio y selección de país
```

### `src/utils/` - Utilidades

```
└── cn.ts                # Utility para clases de Tailwind
```

### `src/hooks/` - Hooks Personalizados

```
# (vacío por ahora - se pueden añadir hooks personalizados)
```

### `src/assets/` - Assets

```
# (vacío por ahora)
```

### `src/tests/` - Tests

```
├── setup.ts             # Configuración de tests
├── useGameStore.test.ts # Tests del store
└── vetoModel.test.ts    # Tests del modelo
```

## Directorio `android/`

```
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── assets/     # Assets de la app
│   │   │   ├── java/       # Código Java nativo
│   │   │   └── res/        # Recursos de Android
│   │   └── androidTest/    # Tests de Android
│   └── build.gradle
└── build.gradle
```

## Directorio `models/`

```
└── veto_model.onnx      # Modelo ONNX (placeholder)
```

## Directorio `dist/`

```
# Build de producción generado por Vite
├── index.html
└── assets/
    ├── ort-wasm-simd-threaded.jsep-*.wasm
    ├── index-*.css
    └── index-*.js
```

## Flujo del Juego

```
Home (selección de país)
    ↓
Briefing (eventos del día)
    ↓
Negotiation (chat con países)
    ↓
Drafting (selección de cláusulas)
    ↓
Voting (predicción ONNX + votación)
    ↓
Reveal (resultados + historial)
    ↓
Nuevo Día (si quedan acciones) o Fin
```

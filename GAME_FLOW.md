# Diagrama de Flujo del Juego

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    Aplicación React                          │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Home Page  │───→│   Game Store │───→│   Game UI    │  │
│  │  (Home.tsx) │    │ (Zustand)    │    │ (Components) │  │
│  └─────────────┘    └──────────────┘    └──────────────┘  │
│         │                        │                         │
│         ▼                        ▼                         │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ API Service │    │  ONNX Model  │    │  UI Components│  │
│  │ (Placeholder)│    │  (Veto Model)│    │  (Tailwind)  │  │
│  └─────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Estados (Game Phases)

```
┌─────────────────────────────────────────────────────────────┐
│                     Máquina de Estados                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│   BRIEFING   │  ← Inicio del juego
│   (Briefing) │
└──────┬───────┘
       │
       │ 1 acción
       ▼
┌──────────────┐
│ NEGOTIATION  │  ← Chat con representantes
│ (Negotiation)│
└──────┬───────┘
       │
       │ 1 acción (opcional) o 3 consultas
       ▼
┌──────────────┐
│  DRAFTING    │  ← Selección de cláusulas
│  (Drafting)  │
└──────┬───────┘
       │
       │ 1 acción
       ▼
┌──────────────┐
│   VOTING     │  ← Predicción ONNX + Votación
│   (Voting)   │
└──────┬───────┘
       │
       │
       ▼
┌──────────────┐
│   REVEAL     │  ← Resultados
│   (Reveal)   │
└──────┬───────┘
       │
       │ 1 acción
       ▼
┌──────────────┐
│   BRIEFING   │  ← Nuevo día (si quedan acciones)
│   (Briefing) │
└──────────────┘
       │
       │ Fin de acciones → Reiniciar o Fin
       └───────────────────────────────────┘
```

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                      Datos del Juego                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────┐
│  Country    │  → P5 (China, Francia, Rusia, UK, USA)
│  Data       │  → E10 (Brasil, Japón, Alemania, India, Sudáfrica)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Clause     │  → Tipo: condena, llamado, sanciones, monitoreo
│  Data       │  → Impacto: bajo, medio, alto
│             │  → VetoRisk: bajo, medio, alto (por P5)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Draft      │  → Cláusulas seleccionadas
│             │  → Tono: conciliador, equilibrado, firme
│             │  → TargetCountry (opcional)
│             │  → Status: borrador, presentado, aprobado, rechazado
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────┐
│  VetoRisk   │  │  VoteResult  │
│  (ONNX)     │  │  (Simulado)  │
│             │  │              │
│  - overallRisk│ │  - votesFor  │
│  - riskByCountry│ │  - votesAgainst│
│  - likelyVetoers│ │  - abstentions│
│  - recommendation│ │  - vetoes    │
│  - isSimulated │ │  - approved  │
└─────────────┘  └──────────────┘
```

## Flujo de Acciones

```
┌─────────────────────────────────────────────────────────────┐
│                      Presupuesto de Acciones                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  MAX_ACTIONS_PER_DAY = 3                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Acciones Disponibles (1 por día)                           │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   BRIEFING   │  │ NEGOTIATION  │  │  DRAFTING    │
│   (1 acción) │  │ (1 acción)   │  │  (1 acción)  │
│              │  │              │  │              │
│  - Atender   │  │ - Enviar     │  │ - Crear      │
│    evento    │  │    mensaje   │  │    borrador  │
│  - Consultar │  │ - Contactar  │  │ - Añadir     │
│    país      │  │    país      │  │    cláusulas │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐
│   VOTING     │  (1 acción)
│   (1 acción) │  - Presentar
│              │    borrador
└──────────────┘

┌──────────────┐
│   REVEAL     │  (1 acción)
│   (1 acción) │  - Nuevo día
│              │    (si quedan acciones)
└──────────────┘
```

## Integración con ONNX Runtime

```
┌─────────────────────────────────────────────────────────────┐
│              Modelo ONNX Runtime Web                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────┐
│  Entrada    │
│  (Features) │
│             │
│  1. Número  │
│     de      │
│     cláusulas│
│             │
│  2. Suma    │
│     de      │
│     impactos│
│             │
│  3. Tono    │
│     numérico│
│             │
│  4. Riesgo  │
│     máximo  │
│     por P5  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  ONNX Model │
│  (veto_model.onnx)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Salida     │
│  (VetoRisk) │
│             │
│  - overallRisk│
│  - riskByCountry│
│  - likelyVetoers│
│  - recommendation│
└─────────────┘
```

## Flujo de Negociación

```
┌─────────────────────────────────────────────────────────────┐
│                      Sistema de Chat                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   Jugador       │
│  (E10)          │
└────────┬────────┘
         │
         │ 1. Envía mensaje
         ▼
┌─────────────────┐
│   Chat Messages │
│  (Zustand)      │
└────────┬────────┘
         │
         │ 2. Simula respuesta IA
         ▼
┌─────────────────┐
│   IA Response   │
│                 │
│  - País aleatorio│
│  - Respuesta    │
│    predefinida  │
└────────┬────────┘
         │
         │ 3. Añade mensaje al chat
         ▼
┌─────────────────┐
│   Chat UI       │
│                 │
│  - Muestra      │
│    mensajes    │
│  - Input        │
│    de texto    │
└─────────────────┘
```

## Estado Persistente

```
┌─────────────────────────────────────────────────────────────┐
│                  Persistencia (localStorage)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Campos persistidos:                                        │
│                                                             │
│  - currentDay: number (día actual)                          │
│  - playerCountry: Country | null (país del jugador)        │
│  - draftHistory: Draft[] (historial de borradores)         │
│  - actionHistory: GameAction[] (historial de acciones)     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Campos NO persistidos:                                     │
│                                                             │
│  - phase: GamePhase (fase actual)                          │
│  - actionBudget: number (presupuesto actual)               │
│  - currentDraft: Draft | null (borrador actual)            │
│  - chatMessages: ChatMessage[] (mensajes de chat)           │
│  - dailyEvents: DailyEvent[] (eventos del día)             │
│  - lastVetoRisk: VetoRisk | null (última predicción)        │
│  - lastVoteResult: VoteResult | null (última votación)     │
└─────────────────────────────────────────────────────────────┘
```

# Capa de Acceso a Datos - Consejo de Seguridad de la ONU

Este directorio contiene la capa de acceso a datos que consulta fuentes oficiales de la ONU, normaliza los datasets y los empaqueta como archivos JSON estáticos para consumo del frontend.

## Estructura de Carpetas

```
scripts/
├── sources/
│   ├── psdata.ts          # Cliente API de PSData (api.psdata.un.org)
│   ├── undl.ts            # Cliente UN Digital Library (placeholder)
│   ├── unsc.ts            # Cliente UNSCR Open Data
│   ├── crUnsc.ts          # Lector del corpus CR-UNSC (estático)
│   └── corpus/            # Datos CR-UNSC empaquetados manualmente
├── types/
│   └── datasets.ts        # Interfaces TypeScript de cada dataset
├── normalize.ts           # Funciones de normalización por dataset
├── updateAll.ts           # Orquestador principal
├── validateData.ts        # Validador de datos con Zod
└── README.md              # Este archivo
```

## Datasets Soportados

### Grupo A - API de PSData (https://api.psdata.un.org/public)

| Dataset ID | Archivo de salida | Campos principales |
|------------|-------------------|-------------------|
| DPPA-SCMembership | sc-membership.json | country, role, startYear, endYear |
| DPPA-SCRegionalGroupMembership | sc-regional-groups.json | country, regionalGroup |
| DPPA-SCVOTES | sc-votes.json | resolutionId, date, votes, result |
| DPPA-SCVETOES | sc-vetoes.json | date, vetoingCountry, topic, resolutionId |
| DPPA-FieldMissions | field-missions.json | missionId, name, mandateComponents |
| DPPADPOSS-FATALITIES | peacekeeper-fatalities.json | year, mission, count |

### Grupo B - Fuentes Externas

| Fuente | Archivo de salida | Método |
|--------|-------------------|--------|
| UNSCR Open Data | unscr-resolutions.json | Descarga JSON/CSV |
| Lista Consolidada de Sanciones | sc-sanctions-consolidated.json | Parseo XML |
| Lista Presidencias E10 (HDX) | sc-presidencies.json | Descarga CSV |

### Grupo C - Datos Manuales

| Archivo | Origen |
|---------|--------|
| cr-unsc-citations.json | Empaquetado manualmente |
| unsc-speeches-sample.json | Empaquetado manualmente |

## Formato de Salida

Todos los archivos JSON siguen la convención:

```json
{
  "_meta": {
    "source": "URL o nombre de la fuente",
    "fetchedAt": "ISO-8601",
    "recordCount": 123,
    "schemaVersion": 1
  },
  "data": [ ... ]
}
```

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm run update-data` | Ejecuta actualización completa de todos los datasets |
| `pnpm run update-data:dry` | Ejecuta en modo dry-run (solo valida, no escribe) |
| `pnpm run validate-data` | Valida que todos los JSON existen y cumplen el esquema |

## Cómo Añadir un Nuevo Dataset

Sigue estos 4 pasos:

1. **Cliente**: Crea o actualiza un archivo en `scripts/sources/` con la función de descarga
2. **Normalizador**: Añade una función en `scripts/normalize.ts` que convierta los datos crudos al formato tipado
3. **Tipo**: Define la interfaz en `scripts/types/datasets.ts` y `src/types/datasets.ts`
4. **Registro**: Añade la entrada en `scripts/updateAll.ts` (configuración + procesador)

## Limitaciones Conocidas

1. **UNSCR Open Data**: No tiene una API REST pública documentada. Las URLs de descarga pueden cambiar y requieren ajuste manual.
2. **Lista de Sanciones**: El parseo de XML de scsanctions.un.org está pendiente de implementación completa.
3. **Presidencias E10**: El CSV de HDX requiere descarga y parseo específico.
4. **Corpus CR-UNSC**: Los archivos deben estar presentes en `scripts/sources/corpus/` antes de ejecutar.

## Flujo de Actualización Mensual

1. El 1 de cada mes a las 06:00 UTC, GitHub Actions ejecuta `.github/workflows/update-data.yml`
2. El workflow descarga, normaliza y empaqueta todos los datasets
3. Si hay cambios, se hace commit automático a `public/data`
4. El frontend consume los JSON estáticos desde `/data/*.json`

## Dependencias

- `tsx` - Ejecutar TypeScript directamente
- `zod` - Validación de esquemas
- `fast-xml-parser` - Parseo de XML (para sanciones)
- `@types/node` - Tipos de Node.js

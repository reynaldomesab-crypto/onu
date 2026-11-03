# 🔌 Integración con la API de la ONU

## 📚 Documentación de la API

### UNDATA API - United Nations Data API

La API oficial de datos de la ONU proporciona acceso programático a datos de paz y seguridad.

**Base URL**: `https://data.un.org/api/rest/v1`

**Documentación**: https://data.un.org/Host.aspx?Content=API

**Formatos de datos**:
- JSON (por defecto)
- XML
- CSV

**Ejemplo de uso**:
```bash
curl "https://data.un.org/api/rest/v1/dataset/UNSC_MEMBERS"
```

## 📋 Endpoint Principales

### 1. Países del Consejo de Seguridad

**Dataset**: UNSC_MEMBERS
**Endpoint**: `GET /dataset/UNSC_MEMBERS`

```bash
curl "https://data.un.org/api/rest/v1/dataset/UNSC_MEMBERS"
```

**Respuesta esperada**:
```json
{
  "data": [
    {
      "code": "USA",
      "name": "United States of America",
      "nameEs": "Estados Unidos de América",
      "isP5": true,
      "region": "Americas",
      "role": "P5",
      "stance": "cooperativo"
    }
  ]
}
```

### 2. Eventos de Paz y Seguridad

**Dataset**: UN_PEACEKEEPING
**Endpoint**: `GET /dataset/UN_PEACEKEEPING`

```bash
curl "https://data.un.org/api/rest/v1/dataset/UN_PEACEKEEPING"
```

**Respuesta esperada**:
```json
{
  "data": [
    {
      "id": "event-001",
      "title": "Operación de Paz",
      "description": "Descripción del evento",
      "date": "2024-01-15",
      "involvedCountries": ["UN", "CHN", "RUS"],
      "urgency": "alta"
    }
  ]
}
```

### 3. Resoluciones del Consejo

**Dataset**: UNSC_RESOLUTIONS
**Endpoint**: `GET /dataset/UNSC_RESOLUTIONS/{id}`

```bash
curl "https://data.un.org/api/rest/v1/dataset/UNSC_RESOLUTIONS/12345"
```

**Respuesta esperada**:
```json
{
  "id": "12345",
  "title": "Resolución del Consejo",
  "votesFor": 12,
  "votesAgainst": 2,
  "abstentions": 1,
  "vetoes": [],
  "approved": true,
  "comment": "Comentario histórico"
}
```

### 4. Cláusulas de Resoluciones

**Dataset**: UNSC_CLAUSES
**Endpoint**: `GET /dataset/UNSC_CLAUSES`

```bash
curl "https://data.un.org/api/rest/v1/dataset/UNSC_CLAUSES"
```

## 🚀 Cómo Conectar

### Paso 1: Registrar en UNDATA API

1. Visite: https://data.un.org/Host.aspx?Content=API
2. Lea la documentación completa
3. Entienda los términos de uso

### Paso 2: Configurar la API en el Proyecto

#### Opción A: Usar el servicio existente

El archivo `src/services/unDataService.ts` ya está preparado con la estructura para conectar a la API.

Para conectar:

1. Descomentar las llamadas `fetch` reales en las funciones
2. Descomentar las llamadas a la API en `apiService.ts`
3. Eliminar o comentar los return con datos simulados

#### Opción B: Usar la API directamente en componentes

```typescript
import { fetchPeaceAndSecurityData } from "@/services/unDataService";

// En tu componente
const { loading, error, loadData } = useUnDataService();

useEffect(() => {
  loadData();
}, [loadData]);
```

### Paso 3: Implementar actualización automática

```typescript
import { startAutoUpdate } from "@/services/unDataService";
import { useGameStore } from "@/store/useGameStore";

const { setCountries, setDailyEvents } = useGameStore();

// Iniciar actualización automática cada 7 días
useEffect(() => {
  const stopUpdate = startAutoUpdate(async () => {
    const data = await fetchPeaceAndSecurityData();
    setCountries(data.countries);
    setDailyEvents(data.events);
  });

  return stopUpdate;
}, []);
```

## 🔧 Configuración de la API

### Variables de Entorno

Cree un archivo `.env.local` en la raíz del proyecto:

```bash
# UNDATA API
VITE_UNDATA_API_BASE=https://data.un.org/api/rest/v1
VITE_UNDATA_API_TIMEOUT=30000
```

### Configuración en el código

```typescript
// src/services/unDataService.ts

const UNDATA_API_BASE = import.meta.env.VITE_UNDATA_API_BASE || "https://data.un.org/api/rest/v1";
const API_TIMEOUT = parseInt(import.meta.env.VITE_UNDATA_API_TIMEOUT || "30000");
```

## 📊 Datos Disponibles en la API

### Países del Consejo de Seguridad

- **Dataset**: UNSC_MEMBERS
- **Campos**: code, name, nameEs, isP5, region, role, stance
- **Formato**: JSON

### Eventos de Paz y Seguridad

- **Dataset**: UN_PEACEKEEPING
- **Campos**: id, title, description, date, involvedCountries, urgency
- **Formato**: JSON

### Resoluciones Históricas

- **Dataset**: UNSC_RESOLUTIONS
- **Campos**: id, title, votesFor, votesAgainst, abstentions, vetoes, approved, comment
- **Formato**: JSON

### Cláusulas de Resoluciones

- **Dataset**: UNSC_CLAUSES
- **Campos**: id, text, type, impact, vetoRiskByCountry, category
- **Formato**: JSON

## ⚠️ Consideraciones Importantes

### Rate Limiting

- La API de la ONU puede tener límites de velocidad
- Implementar rate limiting en el cliente
- Usar caché para reducir peticiones

### Caching

- Implementar caché local para datos frecuentes
- Actualizar datos periódicamente (recomendado: cada 7 días)

### Error Handling

- Manejar errores de red
- Implementar retries automáticos
- Usar datos simulados como fallback

### Autenticación

- La API de la ONU puede requerir autenticación para acceso completo
- Verificar términos de uso de UNDATA API

## 🧪 Pruebas

### Test de conexión

```bash
# Test de conexión a la API
curl "https://data.un.org/api/rest/v1/dataset/UNSC_MEMBERS"
```

### Test de la aplicación

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Abrir http://localhost:5173
# Verificar que los datos se carguen correctamente
```

## 📝 Pasos para Conectar

1. ✅ **Crear servicio de datos UN**: `src/services/unDataService.ts`
2. ✅ **Actualizar apiService.ts**: Conectar a la API real
3. ✅ **Crear hook personalizado**: `src/hooks/useUnDataService.ts`
4. ✅ **Actualizar Home**: Mostrar datos en vivo
5. ⚪ **Implementar caché**: Reducir peticiones
6. ⚪ **Implementar rate limiting**: Respetar límites de la API
7. ⚪ **Implementar autenticación**: Si la API lo requiere

## 🎯 Resultado Esperado

### Antes
- ✅ Datos simulados estáticos
- ✅ Sin actualización automática
- ✅ Sin datos en vivo

### Después
- ✅ Datos reales de la ONU
- ✅ Actualización automática cada 7 días
- ✅ Datos en vivo en la aplicación
- ✅ Mejor experiencia de usuario

## 🔗 Enlaces Útiles

- **API Manual**: https://data.un.org/Host.aspx?Content=API
- **Peace & Security Data Hub**: https://psdata.un.org/
- **UNSC-BENCH**: https://unsc-bench.example.org/api
- **UN Peacekeeping Data**: https://data.un.org/dataset/UN_PEACEKEEPING
- **UNSC Members**: https://data.un.org/dataset/UNSC_MEMBERS
- **UNSC Resolutions**: https://data.un.org/dataset/UNSC_RESOLUTIONS

---

## 🚀 Cómo Usar

### 1. Cargar datos en el componente Home

```typescript
import { useUnDataService } from "@/hooks/useUnDataService";

const { loading, error, loadData } = useUnDataService();

useEffect(() => {
  loadData();
}, [loadData]);
```

### 2. Actualizar manualmente

```typescript
const { forceUpdate } = useUnDataService();

<Button onClick={forceUpdate}>Actualizar Datos</Button>
```

### 3. Verificar si hay actualización pendiente

```typescript
const { needsRefresh, checkUpdateNeeded } = useUnDataService();

useEffect(() => {
  checkUpdateNeeded();
}, []);

if (needsRefresh) {
  return <Button onClick={forceUpdate}>Actualizar</Button>;
}
```

## 📞 Soporte

Si encuentras problemas con la API:
1. Verifica que la URL base sea correcta
2. Verifica los términos de uso de la API
3. Verifica que no estés excediendo los límites de velocidad
4. Revisa los logs del navegador para errores

---

**Estado**: ✅ Estructura lista para integración con API de la ONU
**Ubicación**: `/home/reynaldomesab/Proyectos/ONU/src/services/unDataService.ts`

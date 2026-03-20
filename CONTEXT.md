# CONSORCIA — Contexto del Proyecto

## Descripción
Aplicación web para la gestión moderna de consorcios. Conecta propietarios, inquilinos, consejo y administradores en una sola plataforma. Desarrollada en React + Vite + TailwindCSS.

---

## Stack tecnológico
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Estilos:** Tailwind CSS v4 con arbitrary values `bg-[#hex]` para colores del proyecto. Inline styles solo para valores dinámicos en runtime (delays de animación, colores derivados de estado/datos)
- **Iconos:** `react-icons/fi` (Feather Icons)
- **Tipografía:** Urbanist 800 (headlines) + Raleway 300/400/500/600/700 (UI)
- **Backend:** Pendiente — actualmente todo es mock data

---

## Paleta de colores — Teal Shift

| Token | Hex | Uso |
|---|---|---|
| Deep Navy | `#1a1f3e` | Fondo de página, panel izquierdo auth |
| Navy Base | `#2d3250` | Header, sidebar, texto principal |
| Surface | `#f0f4f8` | Cards, panel derecho auth |
| White | `#ffffff` | Inputs, área de contenido dashboard |
| Teal | `#5b9ea0` | Bordes activos, focus ring, íconos |
| Teal Dark | `#2a6b6e` | CTA, nav activo, éxito |
| Teal Light | `#8ecfd1` | Stats, badges sobre fondo oscuro |
| Amber | `#f9b17a` | Acento "CIA", pendiente, highlight |
| Text Muted | `#5b7a8a` | Labels, placeholders |
| Border | `#b0cfd0` | Bordes de inputs, divisores |

---

## Estructura de archivos

```
src/
  app/
    guards/
      AuthGuard.jsx               ← Protege rutas privadas
    App.jsx                       ← Rutas principales
  assets/
    img/
      consorcia.png               ← Logo CONSORCIA
      favicon.png                 ← Favicon
  hooks/
    useLogin.js                   ← Hook de autenticación + helpers
    useDashboardData.js           ← Hook de datos del dashboard por consorcio
    useExpensasData.js            ← Hook de datos de expensas por consorcio/email
  services/
    api.js                        ← Cliente HTTP base (fetch/axios config)
    auth.api.js                   ← Endpoints de autenticación
  pages/
    HomePage.jsx                  ← re-export → home/index.jsx
    LoginPage.jsx                 ← re-export → login/index.jsx
    ForgotPasswordPage.jsx        ← re-export → forgot-password/index.jsx
    DashboardLayout.jsx           ← re-export → dashboard-layout/index.jsx
    Dashboard.jsx                 ← re-export → dashboard/index.jsx
    Expensas.jsx                  ← re-export → expensas/index.jsx

    home/
      index.jsx                   ← Orquestador (isMobile, ready, navigate)
      Homenav.jsx                 ← Barra de nav desktop (logo + botones)
      Homehero.jsx                ← SVG grid, shapes, hero, pills, badges
      Homefooter.jsx              ← Footer con versión
      Mobileslider.jsx            ← Slider mobile (3 slides + dots + botones)
      homeConstants.js            ← SHAPES, FEATURES, APP_VERSION

    login/
      index.jsx                   ← Orquestador (tab, navigate, isAuthenticated)
      LoginBranding.jsx           ← Panel izq: canvas, shapes, logo, badges, botón Volver
      LoginPanel.jsx              ← Panel der: saludo, tabs, form/registro, footer mobile
      LoginTabs.jsx               ← Tabs Ingresar / Registrarse
      LoginForm.jsx               ← Formulario completo con validaciones
      LoginConstants.js           ← SHAPES, APP_VERSION

    forgot-password/
      index.jsx                   ← Orquestador (email, sending, sent, error, submit)
      ForgotPanel.jsx             ← Panel der: título + switch form↔success + footer mobile
      ForgotForm.jsx              ← Input email + botón CTA
      ForgotSuccess.jsx           ← Ícono check + mensaje + botón volver

    dashboard-layout/
      index.jsx                   ← Orquestador (collapsed, drawer, notif, consorcioId)
      DashboardSidebar.jsx        ← Sidebar desktop colapsable
      DashboardHeader.jsx         ← Header: hamburguesa, selector consorcio, notif, usuario
      DashboardDrawer.jsx         ← Drawer mobile full-width
      DashboardBottomNav.jsx      ← Bottom nav mobile (4 ítems)
      DashboardNotifSidebar.jsx   ← Panel notificaciones mobile (slideInRight)
      DashboardConstants.js       ← SIDEBAR_ITEMS, BOTTOM_ITEMS, MOCK_CONSORCIOS,
                                    MOCK_CONSORCIOS_POR_USUARIO, MOCK_NOTIFICACIONES,
                                    filterNavItems()

    dashboard/
      index.jsx                   ← Orquestador (rol, unidades, selector, layout por rol)
      SectionCard.jsx             ← SectionCard + CardHeader (named exports)
      DashboardBanner.jsx         ← Banner bienvenida (greeting + fecha)
      CardExpensaPersonal.jsx     ← Expensa del mes con estado y monto
      CardExpensaGlobal.jsx       ← Resumen global con barra de progreso
      CardMensajesReclamos.jsx    ← CardMensajes + CardReclamos (named exports)
      CardEncuestaDocumentos.jsx  ← CardEncuesta + CardDocumentos (named exports)
      DashboardConstants.js       ← ESTADO_CONFIG, getGreeting(), getFormattedDate(), ROLE_LABELS

    expensas/
      index.jsx                   ← Orquestador (hook, filtros, handlePaid, estados vacíos)
      FilaExpensa.jsx             ← Fila expandible (último mes) + compacta (anteriores)
      TendenciaChip.jsx           ← Chip ↑↓% reutilizable
      ExpensasHeader.jsx          ← Título + badge vencidas
      ExpensasFiltros.jsx         ← Chips de filtro por estado
      ExpensasSaldo.jsx           ← Stat card saldo pendiente
      ExpensasConstants.js        ← ESTADO, ITEM_COLORS, formatARS()

  styles/
    demo.css
    index.css
  App.css
  main.jsx
```

---

## Convenciones de arquitectura

### Re-exports
Cada página en `src/pages/` es un re-export que apunta a su carpeta granular:
```js
// src/pages/Expensas.jsx
export { default } from "./expensas/index";
```
Esto permite refactorizar sin tocar `App.jsx`.

### Keyframes
Los `@keyframes` viven en un `<style>` tag dentro del orquestador (`index.jsx`) de cada carpeta. Se declaran una vez y aplican a todos los hijos del árbol.

### Inline styles
Solo se usan cuando el valor es dinámico en runtime: colores derivados de un objeto de estado (`ESTADO[exp.estado].bg`), delays de animación calculados por índice (`index * 0.07`), o dimensiones provenientes de datos (`s.size`, `s.top`).

### Constantes por carpeta
Cada carpeta tiene su propio `*Constants.js` con datos estáticos, configuraciones de estado y helpers puros. No hay constantes globales compartidas entre carpetas (excepto la paleta de colores que está en Tailwind).

### Panel izquierdo compartido
`forgot-password/index.jsx` reutiliza `LoginBranding.jsx` directamente desde `../login/LoginBranding`. No hay copia ni componente SharedBranding.

---

## Roles de usuario

| Rol | Email mock | Contraseña |
|---|---|---|
| Administrador | `admin@consorcia.com` | `Admin123` |
| Consejo (multi-consorcio) | `council@consorcia.com` | `Council1` |
| Consejo (1 consorcio) | `council2@consorcia.com` | `Council2` |
| Propietario (multi-unidad, multi-consorcio) | `owner@consorcia.com` | `Owner123` |
| Propietario (1 unidad, 1 consorcio) | `owner2@consorcia.com` | `Owner1234` |
| Inquilino | `tenant@consorcia.com` | `Tenant123` |
| Error forzado | `error@consorcia.com` | `Error123` |

---

## Consorcios mock

| ID | Nombre | Dirección | Usuarios |
|---|---|---|---|
| `c1` | Edificio Las Acacias | Av. Corrientes 1234 | admin, council (Carlos Méndez), owner (Juan Pérez) |
| `c2` | Torre San Martín | San Martín 567 | admin, council (Carlos Méndez), owner (Juan Pérez) |
| `c3` | Complejo Los Olivos | Av. Santa Fe 890 | admin, council2 (Marta Suárez), owner2 (Laura Martínez) |

### Unidades por propietario

**Juan Pérez** (`owner@consorcia.com`):
- c1 → Unidad 3B (pendiente $42.500) + Unidad 7A (pago $38.000)
- c2 → Unidad 5D (vencido $55.000)

**Laura Martínez** (`owner2@consorcia.com`):
- c3 → Unidad 4A (pago $31.000)

**Carlos Méndez** (`council@consorcia.com`):
- c1 → integra el Consejo (sin unidad propia en el mock)
- c2 → integra el Consejo (sin unidad propia en el mock)

**Marta Suárez** (`council2@consorcia.com`):
- c3 → Unidad 6B (pendiente $31.000) · único consorcio

---

## Páginas completadas ✅

### HomePage
- **Mobile:** slider de 3 slides con swipe (Slide 1: logo + slogan, Slide 2: features, Slide 3: estadísticas) + botones Iniciar Sesión / Registrarse fijos al fondo
- **Desktop:** SVG grid teal (reemplaza canvas), floating shapes, hero centrado, feature pills, download badges App Store / Google Play, botón Volver
- Detección de breakpoint con `window.innerWidth` + listener de resize

### LoginPage
- Layout two-panel (42% Navy + 58% Surface)
- Panel izquierdo: canvas grid, floating shapes con `border-radius` orgánico, logo, badges descarga, botón Volver (visible en desktop y mobile)
- Tabs Ingresar / Registrarse con íconos FiLogIn / FiUserPlus
- Redirección automática si ya hay sesión activa (`isAuthenticated()`)

### LoginForm
- Validaciones: email con regex, contraseña ≥8 chars + mayúscula + número
- Botón CTA deshabilitado hasta que se cumplan todas las condiciones
- Indicadores visuales de condiciones bajo el campo contraseña
- Show/hide contraseña con FiEye / FiEyeOff
- Alert inline rojo para errores
- Movido a `src/pages/login/LoginForm.jsx` — importa `useLogin` desde `../../hooks/useLogin`

### ForgotPasswordPage
- Layout two-panel — reutiliza `LoginBranding` del panel izquierdo
- Botón "Enviar enlace" deshabilitado hasta email válido
- Dos estados: formulario → confirmación con FiCheckCircle
- Alert inline para errores

### DashboardLayout
- **Desktop:** sidebar colapsable (220px ↔ 64px), header con hamburguesa + selector de consorcio centrado + nombre usuario + notificaciones
- **Mobile:** bottom nav (68px, 4 ítems) + drawer lateral full-width + sidebar de notificaciones desde la derecha
- Selector de consorcio: dropdown con nombre, dirección y punto activo — solo visible para roles owner/council/admin con múltiples consorcios
- Inquilino: muestra logo CONSORCIA en lugar del selector de consorcio
- Filtro de navegación por rol: inquilino no ve Documentos, Encuestas ni Reclamos
- Sesión: `getStoredUser()` + `logout()` desde `../../hooks/useLogin`
- Contexto al Outlet: `{ consorcioId }` via `useOutletContext`

### Dashboard
- Detecta rol automáticamente desde `getStoredUser()`
- Usa `useDashboardData(consorcioId, role, userEmail)` para obtener datos
- Selector de unidad (tabs) para propietarios con múltiples unidades — se resetea al cambiar de consorcio
- **Owner:** Banner + selector unidad + Expensa personal + Reclamos/Mensajes + Encuesta/Documentos
- **Tenant:** Banner + Expensa personal + Mensajes
- **Council:** Banner + Expensa global + Expensa personal + Reclamos/Mensajes + Encuesta/Documentos
- **Admin:** Banner + Expensa global + Reclamos/Mensajes + Encuesta/Documentos
- Cards en 2 columnas en desktop (auto-fit minmax 260px)

### Expensas
- Usa `useExpensasData(consorcioId, email)` — hook externo
- Filtros por estado con chips (Todas / Pendientes / Vencidas / Parciales / Pendiente validación / Comprobante rechazado / Pagadas) — solo muestra chips con count > 0
- Stat card de saldo pendiente — rojo si hay vencidas
- **Último mes:** fila expandible con detalle de conceptos, porcentajes, alerta de morosidad, botón Pagar (rojo si vencido, teal si pendiente)
- **Meses anteriores:** fila compacta con estado, fecha de pago y botón Descargar
- `TendenciaChip` con ↑↓% reutilizable
- `itemMorosidad` se agrega al detalle del último mes si existe (destacado en rojo)
- Estados: `pago`, `pago_con_recargo`, `pendiente`, `vencido`, `vencido_pagado`, `parcial`, `pendiente_validacion`, `comprobante_rechazado`

---

## Hooks completados ✅

### useLogin.js (`src/hooks/`)
Exporta:
- `useLogin({ onSuccess })` — hook principal con validaciones, mock auth, sessionStorage/localStorage
- `getStoredUser()` — devuelve el usuario de la sesión
- `getStoredToken()` — devuelve el token
- `isAuthenticated()` — boolean
- `logout()` — limpia storage

### useDashboardData.js (`src/hooks/`)
- Recibe `(consorcioId, role, userEmail)`
- Filtra unidades por `userId` para roles owner/tenant
- Devuelve `{ data, unidades, loading, error }`
- Estructura lista para reemplazar mock por fetch real

### useExpensasData.js (`src/hooks/`)
- Recibe `(consorcioId, email)`
- Devuelve `{ historial, resumen, tendencias, itemMorosidad, ultimoPeriodoKey, loading, error, periodoToKey }`
- `resumen`: `{ saldo, pendientes, vencidas, parciales, pendienteValidacion, rechazados, pagas }`
- `tendencias`: objeto `{ [expId]: number }` con % de variación respecto al mes anterior
- `periodoToKey(periodo)`: convierte string de período a clave comparable para detectar el último mes

### services (`src/services/`)
- `api.js` — cliente HTTP base (configuración de fetch/axios, base URL, headers)
- `auth.api.js` — endpoints de autenticación (login, logout, refresh token)

---

## Decisiones de diseño tomadas

- **Tailwind:** arbitrary values para todos los colores del proyecto (`bg-[#2a6b6e]`). Inline styles solo para valores dinámicos en runtime
- **Keyframes:** declarados en `<style>` tag del orquestador de cada carpeta, no en CSS global
- **Sidebar desktop:** colapsable con transición `0.22s cubic-bezier(0.4,0,0.2,1)`
- **Bottom nav mobile:** 68px altura, íconos size=22, opacidad inactivos 0.5, indicador superior activo
- **Drawer mobile:** fondo `#edf2f4`, header del perfil `#2d3250` para contraste, tap en perfil navega a `/perfil`
- **Notificaciones mobile:** sidebar full-width desde la derecha (`slideInRight`)
- **Selector de consorcio:** `useState` con función inicializadora para evitar render con consorcio incorrecto
- **Aislamiento de datos:** cada propietario solo ve sus unidades via `userId` en el mock
- **paddingBottom del main:** `28px` desktop / `84px` mobile (declarado por separado para evitar sobreescritura por shorthand)
- **Panel izquierdo compartido:** `ForgotPasswordPage` reutiliza `LoginBranding` directamente, sin duplicar código
- **Re-exports:** todos los `pages/*.jsx` son re-exports, `App.jsx` nunca se modifica al refactorizar
- **Canvas → SVG:** `HomeHero` usa SVG con `<pattern>` en lugar de canvas para el grid teal (compatible con SSR y más liviano)

---

## Páginas pendientes ⬜

- `Documentos.jsx`
- `Mensajes.jsx`
- `Encuestas.jsx`
- `Contactos.jsx`
- `Perfil.jsx`
- `Configuracion.jsx`

---

## Próximos pasos sugeridos

1. **Perfil** — datos del usuario + cambio de contraseña
2. **Mensajes** — bandeja de entrada del consorcio
3. **Encuestas** — votaciones activas con opciones y resultados
4. **Documentos** — lista descargable de documentos del consorcio
5. **Contactos** — lista de contactos útiles del consorcio
6. **Configuración** — preferencias del usuario
7. **Backend** — Node.js + Express + MongoDB + Mongoose + JWT

---

## Decisiones de producto / notas de diseño

### Mensajes.jsx
- El Consejo puede iniciar mensajes hacia la Administración con categoría **"Solicitud de presupuesto"** — diferenciada de un mensaje común.
  - Flujo: Consejo detecta una necesidad → inicia solicitud desde Mensajes → Administración recibe el pedido, consigue presupuestos y los adjunta como Aprobación.
  - Esta categoría es exclusiva del rol `council`. Los roles `owner` y `tenant` usan Mensajes solo para consultas generales.
- Considerar separación visual de mensajes por origen: **de propietarios** vs **de la administración**.

---

## Notas para el backend

Cuando se conecte el backend, los únicos archivos a modificar son:
- `useLogin.js` — reemplazar mock por llamada a `auth.api.js`
- `useDashboardData.js` — reemplazar `setTimeout` por `fetch('/api/dashboard')`
- `useExpensasData.js` — reemplazar mock por `fetch('/api/expensas')`
- `dashboard-layout/DashboardConstants.js` — `MOCK_CONSORCIOS` y `MOCK_CONSORCIOS_POR_USUARIO` por fetch
- `services/api.js` — configurar base URL y auth headers
- `services/auth.api.js` — implementar endpoints reales
- El resto de componentes no cambia

El objeto `user` guardado en storage debe tener: `{ id, email, name, role }`
# CONSORCIA — Contexto del Proyecto

## Descripción
Aplicación web para la gestión moderna de consorcios. Conecta propietarios, inquilinos, consejo y administradores en una sola plataforma. Desarrollada en React + Vite + TailwindCSS.

---

## Stack tecnológico
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Estilos:** Tailwind CSS v4 + estilos inline (sin depender de clases Tailwind para lógica crítica)
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
      AuthGuard.jsx           ← Protege rutas privadas
    App.jsx                   ← Rutas principales
  assets/
    img/
      consorcia.png           ← Logo CONSORCIA
  features/
    auth/
      hooks/
        useLogin.js           ← Hook de autenticación + helpers
      components/
        LoginForm.jsx         ← Formulario de login con validaciones
  hooks/
    useDashboardData.js       ← Hook de datos del dashboard por consorcio
    useToast.js               ← Hook de notificaciones toast
  components/
    Toast.jsx                 ← Componente visual de toasts
  pages/
    HomePage.jsx              ← Landing page (slider mobile + layout desktop)
    LoginPage.jsx             ← Página de login (two-panel layout)
    ForgotPasswordPage.jsx    ← Recuperación de contraseña
    DashboardLayout.jsx       ← Shell del dashboard (sidebar + header + outlet)
    Dashboard.jsx             ← Página de inicio del dashboard
  styles/
    App.css
  main.jsx
```

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

### HomePage.jsx
- **Mobile:** slider de 3 slides con swipe (Slide 1: logo + slogan, Slide 2: features, Slide 3: estadísticas) + botones Iniciar Sesión / Registrarse fijos al fondo
- **Desktop:** layout con canvas grid teal, floating shapes, hero centrado, feature pills, download badges App Store / Google Play
- Detección de breakpoint con `window.innerWidth` + listener de resize

### LoginPage.jsx
- Layout two-panel (42% Navy + 58% Surface)
- Tabs Ingresar / Registrarse con íconos FiLogIn / FiUserPlus
- Redirección automática si ya hay sesión activa (`isAuthenticated()`)

### LoginForm.jsx
- Validaciones: email con regex, contraseña ≥8 chars + mayúscula + número
- Botón CTA deshabilitado hasta que se cumplan todas las condiciones
- Indicadores visuales de condiciones bajo el campo contraseña
- Show/hide contraseña con FiEye / FiEyeOff
- Alert inline rojo para errores

### ForgotPasswordPage.jsx
- Layout two-panel igual que LoginPage
- Botón "Enviar enlace" deshabilitado hasta email válido
- Dos estados: formulario → confirmación con FiCheckCircle
- Alert inline para errores

### DashboardLayout.jsx
- **Desktop:** sidebar colapsable (220px ↔ 64px), header con hamburguesa + selector de consorcio centrado + nombre usuario + notificaciones
- **Mobile:** bottom nav (68px, 4 ítems) + drawer lateral full-width + sidebar de notificaciones desde la derecha
- Selector de consorcio: dropdown con nombre, dirección y punto activo — solo visible para roles owner/council/admin con múltiples consorcios
- Inquilino: muestra logo CONSORCIA en lugar del selector de consorcio
- Filtro de navegación por rol: inquilino no ve Documentos, Encuestas ni Reclamos
- Sesión: `getStoredUser()` + `logout()` desde `useLogin.js`
- Contexto al Outlet: `{ consorcioId }` via `useOutletContext`

### Dashboard.jsx
- Detecta rol automáticamente desde `getStoredUser()`
- Usa `useDashboardData(consorcioId, role, userEmail)` para obtener datos
- Selector de unidad (tabs) para propietarios con múltiples unidades — se resetea al cambiar de consorcio
- **Owner:** Banner + selector unidad + Expensa personal + Reclamos/Mensajes + Encuesta/Documentos
- **Tenant:** Banner + Expensa personal + Mensajes
- **Council:** Banner + Expensa global + Expensa personal + Reclamos/Mensajes + Encuesta/Documentos
- **Admin:** Banner + Expensa global + Reclamos/Mensajes + Encuesta/Documentos
- Cards en 2 columnas en desktop (auto-fit minmax 260px)

---

## Hooks completados ✅

### useLogin.js (`src/features/auth/hooks/`)
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

### useToast.js (`src/hooks/`)
- `showToast(message, type)` — tipos: "error" | "success" | "info"
- Auto-dismiss configurable (default 4000ms)
- Animación de entrada/salida

### Toast.jsx (`src/components/`)
- Posición: top-right
- Barra de acento izquierda por tipo (rojo/teal/teal claro)
- Botón cerrar manual

---

## Decisiones de diseño tomadas

- **Tailwind:** se usa para layout/responsive pero la lógica crítica de show/hide usa media queries CSS inline o IDs con `@media` dentro de `<style>` para evitar problemas de purge
- **Sidebar desktop:** colapsable con transición 0.22s cubic-bezier
- **Bottom nav mobile:** 68px altura, íconos size=22, opacidad inactivos 0.5
- **Drawer mobile:** fondo `#edf2f4`, header del perfil `#2d3250` para contraste
- **Notificaciones mobile:** sidebar full-width desde la derecha (slideInRight)
- **Selector de consorcio:** `useState` con función inicializadora para evitar render con consorcio incorrecto
- **Aislamiento de datos:** cada propietario solo ve sus unidades via `userId` en el mock
- **paddingBottom del main:** `28px` desktop / `84px` mobile (declarado por separado para evitar sobreescritura por shorthand)

---

## Páginas pendientes ⬜

- `Expensas.jsx`
- `Documentos.jsx`
- `Mensajes.jsx`
- `Encuestas.jsx`
- `Contactos.jsx`
- `Perfil.jsx`
- `Configuracion.jsx`
- `AuthGuard.jsx`

---

## Próximos pasos sugeridos

1. **Expensas** — lista de períodos con estado + detalle de expensa
2. **Perfil** — datos del usuario + cambio de contraseña
3. **Mensajes** — bandeja de entrada del consorcio
4. **Encuestas** — votaciones activas con opciones y resultados
5. **Documentos** — lista descargable de documentos del consorcio
6. **Contactos** — lista de contactos útiles del consorcio
7. **Configuración** — preferencias del usuario
8. **Backend** — Node.js + Express + MongoDB + Mongoose + JWT

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
- `useLogin.js` — reemplazar mock por `fetch('/api/auth/login')`
- `useDashboardData.js` — reemplazar `setTimeout` por `fetch('/api/dashboard')`
- `DashboardLayout.jsx` — `MOCK_CONSORCIOS` y `MOCK_CONSORCIOS_POR_USUARIO` por fetch
- El resto de componentes no cambia

El objeto `user` guardado en storage debe tener: `{ id, email, name, role }`
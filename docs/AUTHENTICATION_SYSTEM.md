# Sistema de Autenticação e Permissões

## Visão Geral

Este projeto utiliza **Better Auth** como sistema de autenticação principal, com um sistema de roles baseado em três níveis de permissão: `USER`, `MANAGER` e `ADMIN`.

## Arquitetura do Sistema

### Roles Disponíveis

- **USER**: Usuário básico com permissões limitadas
- **MANAGER**: Pode gerenciar conteúdo (agenda)
- **ADMIN**: Acesso total ao sistema

### Estrutura de Arquivos

```
src/
├── components/auth/
│   ├── ProtectedRoute.tsx    # Proteção de rotas completas
│   └── PermissionGate.tsx    # Proteção de componentes específicos
├── hooks/
│   └── useAuth.ts           # Hook principal de autenticação
├── lib/
│   ├── auth.ts              # Configuração do Better Auth
│   ├── auth-client.ts       # Cliente de autenticação
│   ├── auth-server-utils.ts # Utilitários server-side
│   └── auth-utils.ts        # Utilitários de roles
├── stores/
│   ├── usersStore.ts        # Store para gerenciamento de usuários
│   └── agendaStores.ts      # Store para gerenciamento de agenda
└── middleware.ts            # Middleware de proteção de rotas
```

## Model Prisma

enum UserRole {
ADMIN
MANAGER
USER
}

### Better Auth Setup

O sistema utiliza Better Auth com adaptador Prisma e plugins de admin e sessão customizada:

```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false,
  },
  plugins: [
    admin({
      defaultRole: "USER",
      adminRoles: ["ADMIN"],
    }),
    customSession(async ({ user }) => {
      // Busca role do usuário no banco
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });
      return {
        user: {
          ...user,
          role: dbUser?.role || "USER",
        },
      };
    }),
  ],
});
```

## Componentes de Proteção

### 1. ProtectedRoute - Proteção de Páginas Completas

Protege páginas inteiras baseado em autenticação e roles:

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Página que requer apenas autenticação
export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Conteúdo da dashboard</div>
    </ProtectedRoute>
  );
}

// Página que requer role ADMIN
export default function AdminPanel() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div>Painel administrativo</div>
    </ProtectedRoute>
  );
}

// Com fallback customizado
export default function SecurePage() {
  return (
    <ProtectedRoute
      requireAdmin={true}
      fallback={<div>Você precisa ser admin para acessar esta página</div>}
    >
      <div>Conteúdo restrito</div>
    </ProtectedRoute>
  );
}
```

### 2. PermissionGate - Proteção de Componentes

Protege componentes específicos dentro de uma página:

```tsx
import { PermissionGate } from "@/components/auth/PermissionGate";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Botão visível apenas para admins */}
      <PermissionGate requireAdmin={true}>
        <button>Gerenciar Usuários</button>
      </PermissionGate>

      {/* Com fallback */}
      <PermissionGate
        requireAdmin={true}
        fallback={<p>Funcionalidade disponível apenas para admins</p>}
      >
        <AdminPanel />
      </PermissionGate>
    </div>
  );
}
```

## Hook useAuth

### Uso Básico

```tsx
import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const {
    user,
    isAuthenticated,
    isAdmin,
    isManager,
    canManageContent,
    hasPermission,
    signIn,
    signOut,
  } = useAuth();

  if (!isAuthenticated) {
    return <div>Faça login para continuar</div>;
  }

  return (
    <div>
      <p>Olá, {user?.name}!</p>

      {isAdmin && <p>Você é administrador</p>}
      {isManager && <p>Você pode gerenciar conteúdo</p>}

      {canManageContent && <button>Criar Nova Agenda</button>}

      {hasPermission("agenda:delete") && <button>Excluir Agenda</button>}
    </div>
  );
}
```

### Sistema de Permissões

```tsx
// Verificação de permissões específicas
const { hasPermission } = useAuth();

// ADMIN - tem todas as permissões
// MANAGER - permissões de conteúdo
const managerPermissions = [
  "agenda:read",
  "agenda:create",
  "agenda:update",
  "agenda:delete",
  "profile:read_own",
  "profile:update_own",
];

// USER - permissões básicas
const userPermissions = [
  "agenda:read",
  "profile:read_own",
  "profile:update_own",
];

// Exemplo de uso
if (hasPermission("agenda:create")) {
  // Mostrar botão de criar
}
```

## Proteção Server-Side

### Utilitários para API Routes

```typescript
// src/app/api/users/route.ts
import {
  requireAdmin,
  requireAuth,
  requireManagerOrAdmin,
} from "@/lib/auth-server-utils";

// Apenas admins podem listar usuários
export async function GET() {
  try {
    const user = await requireAdmin();
    // Lógica da API
  } catch (error) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// Managers e admins podem gerenciar agenda
export async function POST() {
  try {
    const user = await requireManagerOrAdmin();
    // Lógica da API
  } catch (error) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// Qualquer usuário autenticado
export async function GET() {
  try {
    const user = await requireAuth();
    // Lógica da API
  } catch (error) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```

### Middleware de Rotas

```typescript
// src/middleware.ts
export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  // Redireciona para login se não autenticado
  if (!session?.user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Proteção de rotas admin
  const userRole = session.user?.role;
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Protege todas as rotas /admin/*
};
```

## Exemplos Práticos de Uso

### 1. Página de Administração

```tsx
// src/app/admin/users/page.tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserManagement } from "@/components/admin/UserManagement";

export default function UsersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h1>
        <UserManagement />
      </div>
    </ProtectedRoute>
  );
}
```

### 2. Dashboard com Permissões Condicionais

```tsx
// src/app/dashboard/page.tsx
import { useAuth } from "@/hooks/useAuth";
import { PermissionGate } from "@/components/auth/PermissionGate";

export default function Dashboard() {
  const { user, isAdmin, canManageContent } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <h1>Dashboard - {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card sempre visível */}
        <div className="card">
          <h3>Meu Perfil</h3>
          <p>Gerencie suas informações pessoais</p>
        </div>

        {/* Card para managers e admins */}
        <PermissionGate requireAdmin={false}>
          {canManageContent && (
            <div className="card">
              <h3>Gerenciar Agenda</h3>
              <p>Criar e editar eventos</p>
            </div>
          )}
        </PermissionGate>

        {/* Card apenas para admins */}
        <PermissionGate requireAdmin={true}>
          <div className="card">
            <h3>Administração</h3>
            <p>Gerenciar usuários e sistema</p>
          </div>
        </PermissionGate>
      </div>
    </div>
  );
}
```

### 3. Componente com Múltiplas Permissões

```tsx
// src/components/agenda/AgendaCard.tsx
import { useAuth } from "@/hooks/useAuth";

interface AgendaCardProps {
  agenda: {
    id: string;
    titulo: string;
    data: Date;
    local: string;
  };
}

export function AgendaCard({ agenda }: AgendaCardProps) {
  const { hasPermission, isAdmin } = useAuth();

  return (
    <div className="card">
      <h3>{agenda.titulo}</h3>
      <p>{agenda.local}</p>
      <p>{agenda.data.toLocaleDateString()}</p>

      <div className="flex gap-2 mt-4">
        {/* Botão de visualizar - todos podem ver */}
        <button className="btn-primary">Ver Detalhes</button>

        {/* Botão de editar - managers e admins */}
        {hasPermission("agenda:update") && (
          <button className="btn-secondary">Editar</button>
        )}

        {/* Botão de excluir - apenas admins */}
        {isAdmin && <button className="btn-danger">Excluir</button>}
      </div>
    </div>
  );
}
```

### 4. API Route com Verificação de Permissão

```typescript
// src/app/api/agenda/[id]/route.ts
import { requireManagerOrAdmin, getAuthUser } from "@/lib/auth-server-utils";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica se é manager ou admin
    const user = await requireManagerOrAdmin();

    const body = await request.json();

    const updatedAgenda = await prisma.agenda.update({
      where: { id: params.id },
      data: body,
    });

    return Response.json(updatedAgenda);
  } catch (error) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Apenas admins podem excluir
    const user = await requireAdmin();

    await prisma.agenda.delete({
      where: { id: params.id },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```

## Boas Práticas

### 1. Sempre Validar no Server-Side

```typescript
// ❌ Não confie apenas na validação client-side
export async function deleteUser(id: string) {
  // Sem validação server-side - INSEGURO
  return await prisma.user.delete({ where: { id } });
}

// ✅ Sempre valide no servidor
export async function deleteUser(id: string) {
  const user = await requireAdmin(); // Valida permissão
  return await prisma.user.delete({ where: { id } });
}
```

### 2. Use Componentes de Proteção Consistentemente

```tsx
// ❌ Verificação manual repetitiva
export function AdminButton() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return <button>Admin Action</button>;
}

// ✅ Use PermissionGate
export function AdminButton() {
  return (
    <PermissionGate requireAdmin={true}>
      <button>Admin Action</button>
    </PermissionGate>
  );
}
```

### 3. Centralize Lógica de Permissões

```typescript
// ✅ Use o sistema de permissões do useAuth
const { hasPermission } = useAuth();

if (hasPermission("agenda:create")) {
  // Lógica
}
```

## Troubleshooting

### Problemas Comuns

1. **Usuário não consegue acessar rota protegida**

   - Verifique se o middleware está configurado corretamente
   - Confirme se o role do usuário está sendo salvo no banco

2. **Permissões não funcionam**

   - Verifique se o `customSession` está retornando o role
   - Confirme se o `hasPermission` está sendo usado corretamente

3. **Redirecionamento infinito**
   - Verifique se a rota de login não está protegida pelo middleware
   - Confirme se o matcher do middleware está correto

### Debug

```typescript
// Adicione logs para debug
const { user, role, isAuthenticated } = useAuth();

console.log("User:", user);
console.log("Role:", role);
console.log("Is Authenticated:", isAuthenticated);
```

## Observações da IA

1. Separação Clara (Client vs. Server):
   _ Client-Side: A lógica está bem contida no useAuth hook, que serve como uma fonte única de verdade para os componentes React. ProtectedRoute
   e PermissionGate consomem esse hook para aplicar as regras na UI, cada um com seu propósito claro (páginas vs. componentes).
   _ Server-Side: O arquivo lib/auth-server-utils.ts cuida da validação no backend (API Routes, Server Actions). Funções como requireAdmin e
   requireAuth garantem que as operações sensíveis estejam protegidas na fonte, que é a prática mais segura.

   2. Centralização da Lógica:

      - `lib/auth.ts`: É o coração do sistema, onde o better-auth é configurado com o adaptador do Prisma e os plugins. Manter isso em um único
        arquivo é ótimo.
      - `useAuth.ts`: Centraliza toda a lógica de estado do lado do cliente. Se você precisar mudar como uma role é interpretada (ex: adicionar uma
        role SUPER_ADMIN), você só precisa mexer neste arquivo e o resto da aplicação se adapta.
      - `lib/auth-utils.ts`: Contém funções puras e reutilizáveis (isAdmin, canManageContent) que não dependem de estado, podendo ser usadas tanto
        no cliente quanto no servidor.

   3. Não há Repetição, mas Sim Complemento:

      - Você pode ter uma função isAdmin em auth-utils.ts e uma propriedade isAdmin em useAuth.ts. Isso não é repetição. O hook useAuth usa a
        lógica para criar um estado (isAdmin: userRole === "ADMIN"), enquanto o auth-utils provê a função pura para ser usada em outros contextos.
      - ProtectedRoute e PermissionGate parecem similares, mas resolvem problemas em escalas diferentes, como já discutimos. Um protege a "porta da
        casa" (a rota), o outro protege os "cômodos e objetos" (os componentes).

   4. Fonte Única de Verdade para Tipos:
      - O arquivo lib/types.ts importa o UserRole diretamente do Prisma (@prisma/client). Isso é excelente, pois garante que suas roles no frontend
        e no backend nunca ficarão dessincronizadas.

- ✅ Autenticação (login/logout).
- ✅ Proteção de rotas no client-side.
- ✅ Proteção de endpoints no server-side.
- ✅ Controle de acesso baseado em roles (RBAC).
- ✅ Renderização condicional de UI baseada em permissões.

# RushCMS SDK Integration Guide

## ✅ O que foi configurado

O SDK do RushCMS foi integrado ao nextjs-starter com sucesso! Agora você tem acesso a:

### 3 Pacotes Instalados
- **@rushcms/types** - Tipos TypeScript completos
- **@rushcms/client** - Cliente API com cache inteligente
- **@rushcms/react** - 15 componentes React + hooks

### Arquivos Criados

#### 1. `/src/lib/rush-cms-sdk.ts`
Cliente configurado e pronto para usar:
```typescript
import { rushcmsClient, getEntries, getEntry } from '@/lib/rush-cms-sdk'
```

#### 2. `/src/app/sdk-examples/blog/page.tsx`
Exemplo de lista de posts usando o SDK

#### 3. `/src/app/sdk-examples/blog/[slug]/page.tsx`
Exemplo de post individual com **BlocksRenderer** renderizando todos os 15 blocos

---

## 🚀 Como Testar

### 1. Configure as variáveis de ambiente

Adicione ao seu `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://api.rushcms.com
API_TOKEN=seu-token-aqui
SITE_SLUG=seu-site-slug
BLOG_COLLECTION_ID=1
CACHE_TTL=7200
```

### 2. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

### 3. Acesse os exemplos

- **Lista de posts**: http://localhost:3000/sdk-examples/blog
- **Post individual**: http://localhost:3000/sdk-examples/blog/[slug]

---

## 📚 Como Usar o SDK

### Server Components (Recomendado)

```tsx
import { getEntries, getEntry } from '@/lib/rush-cms-sdk'
import { BlocksRenderer } from '@rushcms/react'

export default async function Page() {
	const entry = await getEntry(1, 'my-post-slug')

	return (
		<article>
			<h1>{entry.title}</h1>
			<BlocksRenderer blocks={entry.data.content} />
		</article>
	)
}
```

### Client Components (com Hooks)

```tsx
'use client'

import { RushCMSProvider, useEntry, BlocksRenderer } from '@rushcms/react'
import { rushcmsClient } from '@/lib/rush-cms-sdk'

export default function ClientPage() {
	return (
		<RushCMSProvider client={rushcmsClient}>
			<BlogPost slug='my-post' />
		</RushCMSProvider>
	)
}

function BlogPost({ slug }: { slug: string }) {
	const { entry, loading, error } = useEntry({
		collectionId: 1,
		slug
	})

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error.message}</div>
	if (!entry) return <div>Not found</div>

	return (
		<article>
			<h1>{entry.title}</h1>
			<BlocksRenderer blocks={entry.data.content} />
		</article>
	)
}
```

---

## 🎨 Componentes de Blocos Disponíveis

O SDK renderiza automaticamente 15 tipos de blocos:

### Basic Blocks
- **RichText** - Texto formatado com TipTap
- **Callout** - Caixas destacadas com ícones
- **Toggle** - Conteúdo recolhível
- **Quote** - Citações com autor

### Media Blocks
- **Image** - Imagens com lightbox e lazy loading
- **Gallery** - Galerias (grid, masonry, carousel)
- **Video** - Player de vídeo

### Embed Blocks
- **YouTube** - Vídeos do YouTube
- **Embed** - iFrames genéricos
- **Bookmark** - Preview de links

### Advanced Blocks
- **Alert** - Alertas (info, success, warning, error)
- **Divider** - Separadores
- **Code** - Blocos de código com syntax highlighting
- **Columns** - Layouts multi-coluna
- **Button** - Botões de call-to-action

---

## 🔄 Migração Gradual

Você pode usar o SDK lado a lado com a implementação antiga:

```typescript
// Antiga (ainda funciona)
import { getEntries } from '@/lib/rush-cms'

// Nova (SDK)
import { getEntries } from '@/lib/rush-cms-sdk'
```

Recomendamos migrar gradualmente, testando cada página.

---

## 📖 TypeScript

Todos os tipos estão disponíveis:

```typescript
import type {
	Entry,
	Block,
	ImageBlock,
	CodeBlock,
	PaginatedResponse
} from '@rushcms/types'

const entry: Entry = await getEntry(1, 'slug')
const blocks: Block[] = entry.data.content
```

---

## ⚡ Performance

O SDK já vem com:
- ✅ Cache inteligente (7200s padrão)
- ✅ Lazy loading de imagens
- ✅ ISR do Next.js compatível
- ✅ Tree-shaking automático

---

## 🐛 Troubleshooting

### Erro: "Module not found"
```bash
cd /home/rafhael/www/html/rush-cms/starters/nextjs
pnpm install
```

### Cache não funciona
Certifique-se de que `API_TOKEN` está em `.env.local` (sem NEXT_PUBLIC_)

### Estilos não aparecem
Os componentes usam Tailwind CSS. Certifique-se de que o Tailwind está configurado.

---

## 🔗 Links Úteis

- [SDK README](/../../sdk/README.md)
- [@rushcms/client README](/../../sdk/packages/client/README.md)
- [@rushcms/react README](/../../sdk/packages/react/README.md)
- [Exemplo Next.js](/../../sdk/examples/nextjs-app)

---

## ✨ Próximos Passos

1. Teste os exemplos em `/sdk-examples/blog`
2. Crie suas próprias páginas usando o SDK
3. Customize os estilos dos componentes de blocos
4. Explore os hooks `useEntry` e `useEntries`

---

**Desenvolvido com o RushCMS SDK** 🚀

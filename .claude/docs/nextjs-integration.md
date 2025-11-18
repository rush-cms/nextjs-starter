# Next.js Integration Guide - Rush CMS

Este documento explica como integrar o Rush CMS (headless CMS) com um front-end Next.js 15, otimizado para performance máxima.

---

## O que é o Rush CMS?

**Rush CMS** é um headless CMS multi-tenant construído com Laravel 12 e Filament 4, que expõe uma API REST completa para consumo de conteúdo.

### Características Principais

- **Headless API REST** - Consome de qualquer front-end (Next.js, React, Vue, etc.)
- **Collections dinâmicas** - Crie tipos de conteúdo customizados (posts, páginas, produtos, carros, imóveis, etc.)
- **14+ tipos de campos** - Text, RichText, Markdown, Image, Gallery, File, Select, Boolean, Color, Category, Database Lists, Block Editor, etc.
- **Estados de Entry** - draft, published, archived
- **Scheduling** - `publish_at` e `expires_at`
- **Multi-tenant** - Cada site tem seu `site_id` próprio
- **Autenticação** - Laravel Sanctum com Bearer tokens
- **Rate limiting** - Proteção contra abuso
- **Analytics** - Tracking de pageviews, referrers, devices
- **Media otimizada** - Conversão automática para WebP (75% quality)
- **S3 compatible** - Hospedagem de imagens no S3/DigitalOcean Spaces/etc.

---

## Arquitetura de Integração

```
┌─────────────────────┐
│   Rush CMS Panel    │ ← Editor publica conteúdo
│   (Filament Admin)  │
└──────────┬──────────┘
           │
           ↓ (Webhook on-demand revalidation)
┌─────────────────────┐
│   Next.js 15 Site   │ ← SSG + ISR com cache configurável
│   (App Router)      │
└──────────┬──────────┘
           │
           ↓ (Fetch API com cache)
┌─────────────────────┐
│  Rush CMS REST API  │ ← Bearer token authentication
│  /api/collections   │
│  /api/entries       │
│  /api/navigation    │
└─────────────────────┘
```

---

## Estratégia de Rendering (Performance Máxima)

### SSG + ISR + On-Demand Revalidation (Hybrid Approach)

Esta é a estratégia recomendada para máxima performance com conteúdo que precisa ser atualizado rapidamente.

**Como funciona:**

1. **Build Time (SSG):**
   - Next.js gera páginas estáticas das principais rotas
   - HTML é servido diretamente do CDN (Vercel/Netlify Edge)
   - TTFB < 50ms

2. **Runtime (ISR):**
   - Páginas não geradas no build são criadas on-demand e cacheadas
   - Cache expira conforme configuração `.env` (ex: 5min, 30min, 1h)
   - Após expiração, próxima request regenera a página

3. **On-Demand Revalidation (Webhook):**
   - Rush CMS envia webhook quando conteúdo é publicado/atualizado
   - Next.js invalida cache específico imediatamente
   - Próxima request regenera a página com novo conteúdo
   - **Resultado:** Loja de carros remove veículo do estoque → Site atualiza em segundos!

**Comparação de Performance:**

| Estratégia | TTFB | Atualização | API Calls | Uso Rush CMS |
|------------|------|-------------|-----------|--------------|
| SSR Puro | 300-800ms | Real-time | Toda request | Alto ❌ |
| SSG apenas | <50ms | Apenas no build | Build only | Muito baixo ✅ |
| **SSG + ISR** | **<50ms** | **Configurável** | **Mínimo** | **Baixo ✅** |
| SSG + ISR + Webhook | <50ms | Segundos | Mínimo | Baixo ✅ |

---

## Configuração do Ambiente

### Variáveis de Ambiente (.env.local)

```bash
# Rush CMS API Configuration
NEXT_PUBLIC_API_URL=https://cms.seusite.com.br
API_TOKEN=your-sanctum-bearer-token-here
SITE_ID=1

# Revalidation Configuration (em segundos)
# Institucional: 3600 (1 hora)
# Blog: 1800 (30 minutos)
# Loja de carros/imóveis: 300 (5 minutos)
REVALIDATE_TIME=1800

# On-Demand Revalidation
REVALIDATE_SECRET=sua-chave-secreta-aqui

# S3/Spaces Configuration (para otimização de imagens)
NEXT_PUBLIC_S3_URL=https://seusite.nyc3.digitaloceanspaces.com
NEXT_PUBLIC_S3_BUCKET=rush-cms

# Site Configuration
NEXT_PUBLIC_SITE_NAME="Meu Site"
NEXT_PUBLIC_SITE_URL=https://seusite.com.br

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### .env.example (para documentação)

Sempre forneça um `.env.example` com valores de exemplo e comentários explicativos.

---

## Estrutura de Dados da API

### Endpoints Principais

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/collections` | GET | Lista todas as collections |
| `/api/collections/{slug}` | GET | Detalhes de uma collection |
| `/api/entries` | GET | Lista entries (com filtros) |
| `/api/entries/{id}` | GET | Entry por ID |
| `/api/entries/slug/{slug}` | GET | Entry por slug |
| `/api/navigation` | GET | Menu de navegação |

### Exemplo de Response - Entry

```json
{
  "data": {
    "id": 123,
    "site_id": 1,
    "collection_id": 5,
    "slug": "meu-post-incrivel",
    "status": "published",
    "publish_at": "2025-01-10T10:00:00.000000Z",
    "expires_at": null,
    "data": {
      "title": "Meu Post Incrível",
      "content": "<p>Conteúdo HTML aqui...</p>",
      "excerpt": "Um resumo do post",
      "featured_image": {
        "id": 456,
        "url": "https://seusite.nyc3.digitaloceanspaces.com/rush-cms/images/post-image.webp",
        "name": "post-image.webp",
        "size": 125000,
        "mime_type": "image/webp",
        "alt": "Imagem do post",
        "responsive": {
          "thumb": "https://.../post-image-thumb.webp",
          "medium": "https://.../post-image-medium.webp",
          "large": "https://.../post-image-large.webp"
        }
      },
      "category": {
        "id": 789,
        "name": "Tecnologia",
        "slug": "tecnologia"
      },
      "tags": [
        { "id": 1, "name": "Next.js", "slug": "nextjs" },
        { "id": 2, "name": "Performance", "slug": "performance" }
      ]
    },
    "created_at": "2025-01-10T09:00:00.000000Z",
    "updated_at": "2025-01-10T09:30:00.000000Z"
  }
}
```

### Exemplo de Response - Collection Listing

```json
{
  "data": [
    {
      "id": 5,
      "name": "Blog Posts",
      "slug": "blog",
      "description": "Posts do blog",
      "entries_count": 42
    },
    {
      "id": 6,
      "name": "Páginas",
      "slug": "pages",
      "description": "Páginas institucionais",
      "entries_count": 8
    }
  ]
}
```

### Filtros Disponíveis (Query Params)

```
/api/entries?collection=blog&status=published&per_page=20&page=1
/api/entries?search=next.js&category=tecnologia
/api/entries?tag=performance&sort=created_at&order=desc
```

**Parâmetros importantes:**
- `collection` - Slug da collection
- `status` - published, draft, archived
- `per_page` - Paginação (padrão: 15, máx: 100)
- `page` - Número da página
- `search` - Busca textual
- `category` - Filtro por categoria (slug)
- `tag` - Filtro por tag (slug)
- `sort` - Campo para ordenação (created_at, updated_at, title, publish_at)
- `order` - asc ou desc

---

## Implementação no Next.js 15

### 1. API Client (`lib/rush-cms.ts`)

```typescript
// lib/rush-cms.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.API_TOKEN;
const SITE_ID = process.env.SITE_ID;
const REVALIDATE_TIME = parseInt(process.env.REVALIDATE_TIME || '1800');

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

async function fetchAPI(
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> {
  const { revalidate = REVALIDATE_TIME, tags = [] } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Site-ID': SITE_ID || '1',
    },
    next: {
      revalidate,
      tags,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Entry by slug
export async function getEntryBySlug(
  slug: string,
  collection?: string
): Promise<any> {
  const params = new URLSearchParams();
  if (collection) params.set('collection', collection);

  return fetchAPI(`/api/entries/slug/${slug}?${params}`, {
    tags: [`entry-${slug}`],
  });
}

// Entries list
export async function getEntries(params: {
  collection?: string;
  status?: 'published' | 'draft' | 'archived';
  per_page?: number;
  page?: number;
  category?: string;
  tag?: string;
}): Promise<any> {
  const searchParams = new URLSearchParams({
    status: 'published',
    per_page: '20',
    ...params,
  } as any);

  return fetchAPI(`/api/entries?${searchParams}`, {
    tags: ['entries-list'],
  });
}

// Collection by slug
export async function getCollection(slug: string): Promise<any> {
  return fetchAPI(`/api/collections/${slug}`, {
    tags: [`collection-${slug}`],
  });
}

// Navigation
export async function getNavigation(): Promise<any> {
  return fetchAPI('/api/navigation', {
    revalidate: 3600, // Menu muda pouco, cache de 1 hora
    tags: ['navigation'],
  });
}
```

---

### 2. Page Component com SSG + ISR (`app/blog/[slug]/page.tsx`)

```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getEntryBySlug, getEntries } from '@/lib/rush-cms';
import { Article } from '@/components/Article';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

// Geração estática de páginas no build
export async function generateStaticParams() {
  try {
    const response = await getEntries({
      collection: 'blog',
      status: 'published',
      per_page: 100, // Top 100 posts mais recentes
    });

    return response.data.map((entry: any) => ({
      slug: entry.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Metadados dinâmicos para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const response = await getEntryBySlug(params.slug, 'blog');
    const entry = response.data;

    return {
      title: entry.data.title,
      description: entry.data.excerpt || entry.data.title,
      openGraph: {
        title: entry.data.title,
        description: entry.data.excerpt,
        images: entry.data.featured_image?.url ? [entry.data.featured_image.url] : [],
        type: 'article',
        publishedTime: entry.publish_at,
        modifiedTime: entry.updated_at,
        authors: entry.data.author?.name ? [entry.data.author.name] : [],
        tags: entry.data.tags?.map((tag: any) => tag.name) || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: entry.data.title,
        description: entry.data.excerpt,
        images: entry.data.featured_image?.url ? [entry.data.featured_image.url] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Post não encontrado',
    };
  }
}

// Page Component
export default async function BlogPostPage({ params }: PageProps) {
  let entry;

  try {
    const response = await getEntryBySlug(params.slug, 'blog');
    entry = response.data;
  } catch (error) {
    notFound();
  }

  // Verifica se entry está publicado
  if (entry.status !== 'published') {
    notFound();
  }

  // Verifica se entry expirou
  if (entry.expires_at && new Date(entry.expires_at) < new Date()) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Article entry={entry} />
    </main>
  );
}
```

---

### 3. Article Component (`components/Article.tsx`)

```typescript
// components/Article.tsx
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface ArticleProps {
  entry: {
    slug: string;
    data: {
      title: string;
      content: string;
      excerpt?: string;
      featured_image?: {
        url: string;
        alt: string;
        responsive?: {
          large?: string;
          medium?: string;
          thumb?: string;
        };
      };
      category?: {
        name: string;
        slug: string;
      };
      tags?: Array<{
        name: string;
        slug: string;
      }>;
    };
    publish_at: string;
    updated_at: string;
  };
}

export function Article({ entry }: ArticleProps) {
  const { data, publish_at, updated_at } = entry;

  return (
    <article className="prose prose-lg max-w-4xl mx-auto">
      {/* Categoria */}
      {data.category && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            {data.category.name}
          </span>
        </div>
      )}

      {/* Título */}
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>

      {/* Metadata */}
      <div className="flex gap-4 text-sm text-gray-600 mb-8">
        <time dateTime={publish_at}>
          {formatDate(publish_at)}
        </time>
        {updated_at !== publish_at && (
          <span>• Atualizado em {formatDate(updated_at)}</span>
        )}
      </div>

      {/* Imagem destacada */}
      {data.featured_image && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={data.featured_image.url}
            alt={data.featured_image.alt || data.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}

      {/* Conteúdo HTML do Rush CMS */}
      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
          {data.tags.map((tag) => (
            <a
              key={tag.slug}
              href={`/blog/tag/${tag.slug}`}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              #{tag.name}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
```

---

### 4. On-Demand Revalidation API Route (`app/api/revalidate/route.ts`)

```typescript
// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Validar secret token
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, slug, collection, action } = body;

    console.log('[Revalidate] Received webhook:', { type, slug, collection, action });

    // Revalidar com base no tipo
    switch (type) {
      case 'entry':
        // Revalidar entry específico
        if (slug) {
          revalidateTag(`entry-${slug}`);
          console.log(`[Revalidate] Entry tag: entry-${slug}`);
        }

        // Revalidar lista de entries
        revalidateTag('entries-list');

        // Revalidar path específico se souber a collection
        if (collection && slug) {
          revalidatePath(`/${collection}/${slug}`);
          console.log(`[Revalidate] Path: /${collection}/${slug}`);
        }
        break;

      case 'collection':
        // Revalidar collection específica
        if (slug) {
          revalidateTag(`collection-${slug}`);
          revalidatePath(`/${slug}`);
          console.log(`[Revalidate] Collection: ${slug}`);
        }
        break;

      case 'navigation':
        // Revalidar menu
        revalidateTag('navigation');
        console.log('[Revalidate] Navigation menu');
        break;

      default:
        // Revalidar tudo em caso de dúvida
        revalidateTag('entries-list');
        console.log('[Revalidate] Fallback: entries-list');
    }

    return NextResponse.json({
      revalidated: true,
      type,
      slug,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    );
  }
}

// Health check
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
```

---

### 5. Webhook Configuration no Rush CMS

No Rush CMS, crie um Observer para enviar webhook quando entry for atualizado:

```php
// app/Observers/EntryWebhookObserver.php
<?php

namespace App\Observers;

use App\Models\Entry;
use App\Enums\EntryStatus;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EntryWebhookObserver
{
    public function updated(Entry $entry): void
    {
        $this->sendWebhook($entry, 'updated');
    }

    public function created(Entry $entry): void
    {
        if ($entry->status === EntryStatus::Published) {
            $this->sendWebhook($entry, 'created');
        }
    }

    public function deleted(Entry $entry): void
    {
        $this->sendWebhook($entry, 'deleted');
    }

    protected function sendWebhook(Entry $entry, string $action): void
    {
        $webhookUrl = config('services.nextjs.webhook_url');
        $webhookSecret = config('services.nextjs.webhook_secret');

        if (! $webhookUrl || ! $webhookSecret) {
            return;
        }

        try {
            $response = Http::timeout(5)->post("{$webhookUrl}?secret={$webhookSecret}", [
                'type' => 'entry',
                'slug' => $entry->slug,
                'collection' => $entry->collection->slug,
                'action' => $action,
                'status' => $entry->status->value,
                'timestamp' => now()->toIso8601String(),
            ]);

            if ($response->successful()) {
                Log::info('[Webhook] Next.js revalidation successful', [
                    'slug' => $entry->slug,
                    'action' => $action,
                ]);
            } else {
                Log::warning('[Webhook] Next.js revalidation failed', [
                    'slug' => $entry->slug,
                    'status' => $response->status(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('[Webhook] Next.js revalidation error', [
                'slug' => $entry->slug,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
```

**Registrar o Observer (`app/Providers/AppServiceProvider.php`):**

```php
use App\Models\Entry;
use App\Observers\EntryWebhookObserver;

public function boot(): void
{
    Entry::observe(EntryWebhookObserver::class);
}
```

**Adicionar no `.env` do Rush CMS:**

```bash
NEXTJS_WEBHOOK_URL=https://seusite.com.br/api/revalidate
NEXTJS_WEBHOOK_SECRET=sua-chave-secreta-aqui
```

**Adicionar no `config/services.php`:**

```php
'nextjs' => [
    'webhook_url' => env('NEXTJS_WEBHOOK_URL'),
    'webhook_secret' => env('NEXTJS_WEBHOOK_SECRET'),
],
```

---

## Otimização de Imagens

### next/image com S3 Loader

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.digitaloceanspaces.com',
        pathname: '/rush-cms/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default config;
```

### Image Component Wrapper

```typescript
// components/ui/OptimizedImage.tsx
import Image from 'next/image';
import type { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function OptimizedImage({ src, alt, width, height, ...props }: OptimizedImageProps) {
  // Rush CMS já converte para WebP, Next.js otimiza ainda mais
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      {...props}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9IiNlZWUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4="
    />
  );
}
```

**Rush CMS já faz:**
- ✅ Conversão WebP (75% quality)
- ✅ Responsive sizes (thumb, medium, large)
- ✅ Lazy loading metadata

**Next.js adiciona:**
- ✅ AVIF support (menor que WebP)
- ✅ Responsive srcset automático
- ✅ Blur placeholder
- ✅ CDN caching

---

## Configuração de Deploy

### Netlify (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

# Revalidation webhook
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers de segurança
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

### Vercel (Auto-detected)

Vercel detecta Next.js automaticamente. Apenas configure as variáveis de ambiente no dashboard.

**Opcional - `vercel.json`:**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "@rush-cms-api-url",
    "API_TOKEN": "@rush-cms-api-token",
    "SITE_ID": "@rush-cms-site-id"
  }
}
```

---

## Testing & Debugging

### Test API Connection

```typescript
// scripts/test-api.ts
async function testRushCMSConnection() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_TOKEN = process.env.API_TOKEN;

  console.log('Testing Rush CMS connection...');
  console.log('API URL:', API_URL);

  try {
    const res = await fetch(`${API_URL}/api/collections`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    console.log('✅ Connection successful!');
    console.log('Collections found:', data.data.length);
    console.log(data.data.map((c: any) => `- ${c.name} (${c.slug})`).join('\n'));
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testRushCMSConnection();
```

**Run:**
```bash
npx tsx scripts/test-api.ts
```

---

## Boas Práticas

### 1. Error Handling

```typescript
// lib/rush-cms.ts
export class RushCMSError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'RushCMSError';
  }
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}): Promise<any> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Site-ID': SITE_ID || '1',
      },
      next: {
        revalidate: options.revalidate || REVALIDATE_TIME,
        tags: options.tags || [],
      },
    });

    if (!res.ok) {
      throw new RushCMSError(
        `API Error: ${res.statusText}`,
        res.status,
        endpoint
      );
    }

    return res.json();
  } catch (error) {
    if (error instanceof RushCMSError) {
      throw error;
    }
    throw new RushCMSError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown'}`,
      undefined,
      endpoint
    );
  }
}
```

### 2. TypeScript Types

```typescript
// types/rush-cms.ts
export interface RushCMSEntry {
  id: number;
  site_id: number;
  collection_id: number;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  publish_at: string;
  expires_at: string | null;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RushCMSCollection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  entries_count: number;
}

export interface RushCMSPaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface RushCMSImage {
  id: number;
  url: string;
  name: string;
  size: number;
  mime_type: string;
  alt: string;
  responsive?: {
    thumb?: string;
    medium?: string;
    large?: string;
  };
}
```

### 3. Caching Strategy per Route Type

```typescript
// Institutional pages - cache longo (1 hora)
export async function getPage(slug: string) {
  return fetchAPI(`/api/entries/slug/${slug}?collection=pages`, {
    revalidate: 3600,
    tags: [`page-${slug}`],
  });
}

// Blog posts - cache médio (30 minutos)
export async function getBlogPost(slug: string) {
  return fetchAPI(`/api/entries/slug/${slug}?collection=blog`, {
    revalidate: 1800,
    tags: [`post-${slug}`],
  });
}

// Car listings - cache curto (5 minutos)
export async function getCar(slug: string) {
  return fetchAPI(`/api/entries/slug/${slug}?collection=vehicles`, {
    revalidate: 300,
    tags: [`vehicle-${slug}`],
  });
}

// Homepage - cache muito curto (1 minuto)
export async function getHomepage() {
  return fetchAPI('/api/entries/slug/home?collection=pages', {
    revalidate: 60,
    tags: ['homepage'],
  });
}
```

### 4. Loading States & Suspense

```typescript
// app/blog/[slug]/page.tsx
import { Suspense } from 'react';

function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div className="h-64 bg-gray-200 rounded mb-8"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export default function BlogPostPage({ params }: PageProps) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent slug={params.slug} />
    </Suspense>
  );
}
```

### 5. SEO Optimization

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const response = await getEntryBySlug(params.slug, 'blog');
  const entry = response.data;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${entry.slug}`;

  return {
    title: entry.data.title,
    description: entry.data.excerpt || entry.data.title,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: entry.status === 'published',
      follow: entry.status === 'published',
    },
    openGraph: {
      title: entry.data.title,
      description: entry.data.excerpt,
      url: canonicalUrl,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: entry.data.featured_image?.url ? [
        {
          url: entry.data.featured_image.url,
          width: 1200,
          height: 630,
          alt: entry.data.featured_image.alt || entry.data.title,
        },
      ] : [],
      locale: 'pt_BR',
      type: 'article',
      publishedTime: entry.publish_at,
      modifiedTime: entry.updated_at,
      authors: entry.data.author?.name ? [entry.data.author.name] : [],
      tags: entry.data.tags?.map((tag: any) => tag.name) || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.data.title,
      description: entry.data.excerpt,
      images: entry.data.featured_image?.url ? [entry.data.featured_image.url] : [],
    },
  };
}
```

---

## Troubleshooting

### Problem: CORS Error

**Sintoma:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solução:** Configure CORS no Rush CMS (`config/cors.php`):

```php
'allowed_origins' => [
    'https://seusite.com.br',
    'https://www.seusite.com.br',
    'http://localhost:3000', // Development
],
```

### Problem: 401 Unauthorized

**Sintoma:** `API Error: 401 Unauthorized`

**Checklist:**
1. ✅ Token Sanctum está correto?
2. ✅ Token não expirou?
3. ✅ Header `Authorization: Bearer {token}` está sendo enviado?
4. ✅ Site ID está correto (`X-Site-ID` header)?

### Problem: ISR não está funcionando

**Sintoma:** Página não atualiza após tempo de revalidação

**Debug:**
```typescript
// Adicionar logs
console.log('Fetching from Rush CMS:', {
  endpoint,
  revalidate: options.revalidate,
  tags: options.tags,
  timestamp: new Date().toISOString(),
});
```

**Checklist:**
1. ✅ `revalidate` está configurado corretamente?
2. ✅ Não está em modo desenvolvimento? (ISR não funciona com `npm run dev`)
3. ✅ Build e start production: `npm run build && npm run start`

### Problem: Webhook não está funcionando

**Sintoma:** Conteúdo não atualiza imediatamente após publicação

**Debug no Rush CMS:**
```php
Log::info('[Webhook] Sending revalidation request', [
    'url' => $webhookUrl,
    'slug' => $entry->slug,
]);
```

**Debug no Next.js:**
```typescript
// app/api/revalidate/route.ts
console.log('[Revalidate] Webhook received:', {
  type, slug, collection, action,
  headers: Object.fromEntries(request.headers),
});
```

**Checklist:**
1. ✅ Secret token está correto?
2. ✅ URL do webhook está acessível?
3. ✅ Firewall não está bloqueando?
4. ✅ Observer está registrado no Laravel?

### Problem: Imagens não carregam

**Sintoma:** Next.js Image error: "Invalid src prop"

**Checklist:**
1. ✅ Domain está configurado em `next.config.ts` → `remotePatterns`?
2. ✅ URL da imagem está completa (https://...)?
3. ✅ S3 bucket é público?

---

## Performance Checklist

Antes de ir para produção:

- [ ] Build success: `npm run build`
- [ ] Type check: `npm run type-check`
- [ ] Test API connection: `npx tsx scripts/test-api.ts`
- [ ] Test ISR: Build + start production, esperar revalidação
- [ ] Test webhook: Publicar entry no Rush CMS, verificar logs
- [ ] Lighthouse audit: Score > 90 em Performance
- [ ] Image optimization: All images usando `next/image`
- [ ] SEO metadata: All pages com `generateMetadata`
- [ ] Error boundaries: 404 e 500 pages customizadas
- [ ] Environment variables: Produção configurada (Netlify/Vercel)
- [ ] CORS: Domínio de produção permitido no Rush CMS
- [ ] Rate limiting: Monitorar usage no Rush CMS Analytics

---

## Recursos Adicionais

**Documentação Oficial:**
- [Next.js 15 Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

**Rush CMS:**
- Painel admin: `https://cms.seusite.com.br/admin`
- API docs: `https://cms.seusite.com.br/api/docs` (se configurado)
- Telescope (debugging): `https://cms.seusite.com.br/admin/telescope`

---

## Conclusão

Esta integração oferece:
- ✅ **Performance máxima** com SSG + ISR + CDN
- ✅ **Conteúdo atualizado** com on-demand revalidation
- ✅ **SEO perfeito** com metadata dinâmico
- ✅ **Flexibilidade** para diferentes tipos de site (.env configurável)
- ✅ **DX excelente** com TypeScript strict e error handling
- ✅ **Production-ready** para Netlify e Vercel

**Performance esperada:**
- TTFB: < 50ms
- LCP: < 1s
- CLS: 0
- Lighthouse: 95-100

Boa sorte! 🚀

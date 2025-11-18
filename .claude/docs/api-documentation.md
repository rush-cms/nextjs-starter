# Rush CMS - API Documentation

Versão da API: **v1**

Base URL: `https://cms.rafhael.com.br/api/v1`

---

## 📋 Índice

- [Autenticação](#autenticação)
- [Rate Limiting](#rate-limiting)
- [Estrutura de Respostas](#estrutura-de-respostas)
- [Endpoints](#endpoints)
  - [Teams](#teams)
  - [Collections](#collections)
  - [Entries](#entries)
  - [Forms](#forms)
  - [Navigations](#navigations)
  - [Analytics](#analytics)

---

## 🔐 Autenticação

A API usa **Bearer Token** para autenticação. Você precisa incluir o token no header de todas as requisições protegidas:

```http
Authorization: Bearer {seu-token-aqui}
```

### Obtendo um Token

Tokens são gerados no painel administrativo em **API Tokens**. Cada token está associado a um Site específico.

**Headers obrigatórios:**
```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer {token}
```

---

## ⏱️ Rate Limiting

A API possui limitação de taxa (rate limiting) para prevenir abuso:

| Endpoint | Limite | Período |
|----------|--------|---------|
| Analytics | 120 requisições | 1 minuto |
| Forms (Submit) | 10 requisições | 1 minuto |
| Outros | Padrão Laravel | - |

**Resposta ao exceder limite:**
```json
{
  "message": "Too Many Attempts."
}
```
Status: `429 Too Many Requests`

---

## 📦 Estrutura de Respostas

### Sucesso
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Erro
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

### Status HTTP
- `200` - OK
- `201` - Created
- `202` - Accepted (processamento assíncrono)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity (validação)
- `429` - Too Many Requests
- `500` - Server Error

---

## 🌐 Endpoints

### Teams

#### Listar Site Atual
Retorna informações do site associado ao token.

```http
GET /api/v1/teams
```

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Meu Site",
      "slug": "meu-site",
      "domain": "meusite.com",
      "status": "active"
    }
  ]
}
```

---

### Collections

#### Listar Collections
Retorna todas as collections ativas do site.

```http
GET /api/v1/{site-slug}/collections
```

**Parâmetros de URL:**
- `site-slug` (string, obrigatório) - Slug do site

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Blog Posts",
      "slug": "blog-posts",
      "options": {
        "main": [],
        "sidebar": []
      },
      "metadata": {},
      "items_per_page": 10
    },
    {
      "id": 2,
      "name": "Pages",
      "slug": "pages",
      "options": {},
      "metadata": {},
      "items_per_page": 20
    }
  ]
}
```

**Cache:** 1 hora (3600s)

---

### Entries

#### Listar Entries de uma Collection
Retorna todas as entries publicadas de uma collection específica.

```http
GET /api/v1/{site-slug}/collections/{collection-id}/entries
```

**Parâmetros de URL:**
- `site-slug` (string, obrigatório) - Slug do site
- `collection-id` (integer, obrigatório) - ID da collection

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "data": [
    {
      "id": 1,
      "author": {
        "name": "João Silva"
      },
      "title": "Meu Primeiro Post",
      "slug": "meu-primeiro-post",
      "excerpt": "Um resumo do post...",
      "data": {
        "content": "Conteúdo completo do post...",
        "featured_image": "123",
        "custom_field": "valor"
      },
      "status": "published",
      "published_at": "2025-01-15T10:00:00Z",
      "meta": {
        "seo_title": "Título SEO",
        "seo_description": "Descrição SEO"
      }
    }
  ]
}
```

**Campos:**
- `id` - ID único da entry
- `author` - Informações do autor
- `title` - Título da entry
- `slug` - Slug único (URL-friendly)
- `excerpt` - Resumo/descrição curta
- `data` - Dados dinâmicos baseados nos campos da collection
- `status` - Status (`published`, `draft`, `archived`)
- `published_at` - Data de publicação (ISO 8601)
- `meta` - Metadados adicionais

**Filtros aplicados automaticamente:**
- Apenas entries com `status: published`
- Apenas entries da collection especificada
- Apenas entries do site autenticado

**Relacionamentos incluídos:**
- `author` - Nome do autor
- `collection` - Nome e slug da collection
- `media` - Arquivos de mídia associados
- `tags` - Tags associadas

**Cache:** 1 hora (3600s)

**Erros:**
- `403` - Collection não pertence ao site
- `404` - Collection não encontrada

---

### Forms

#### Listar Formulários
Retorna todos os formulários ativos do site.

```http
GET /api/v1/{site-slug}/forms
```

**Parâmetros de URL:**
- `site-slug` (string, obrigatório) - Slug do site

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Contato",
      "key": "contact-form",
      "description": "Formulário de contato principal",
      "fields": [
        {
          "type": "text",
          "config": {
            "name": "name",
            "label": "Nome",
            "placeholder": "Seu nome completo"
          },
          "validation": {
            "is_required": true
          }
        },
        {
          "type": "email",
          "config": {
            "name": "email",
            "label": "E-mail"
          },
          "validation": {
            "is_required": true
          }
        }
      ],
      "is_active": true,
      "created_at": "2025-01-10T00:00:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

#### Obter Formulário Específico
Retorna detalhes de um formulário específico.

```http
GET /api/v1/{site-slug}/forms/{form-key}
```

**Parâmetros de URL:**
- `site-slug` (string, obrigatório) - Slug do site
- `form-key` (string, obrigatório) - Chave única do formulário

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Contato",
    "key": "contact-form",
    "description": "Formulário de contato principal",
    "fields": [
      {
        "type": "text",
        "config": {
          "name": "name",
          "label": "Nome",
          "placeholder": "Seu nome completo"
        },
        "validation": {
          "is_required": true
        }
      }
    ],
    "is_active": true,
    "created_at": "2025-01-10T00:00:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

**Erros:**
- `404` - Formulário não encontrado ou inativo

---

#### Enviar Formulário
Submete dados de um formulário.

```http
POST /api/v1/{site-slug}/forms/{form-key}/submit
```

**Parâmetros de URL:**
- `site-slug` (string, obrigatório) - Slug do site
- `form-key` (string, obrigatório) - Chave única do formulário

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "data": {
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "message": "Olá, gostaria de mais informações..."
  },
  "metadata": {
    "utm_source": "google",
    "utm_campaign": "summer-2025"
  }
}
```

**Campos:**
- `data` (object, obrigatório) - Dados do formulário (campo dinâmicos)
- `metadata` (object, opcional) - Metadados adicionais

**Metadados capturados automaticamente:**
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` (da query string)
- `referrer` (header Referer)
- `ip_address` (IP do cliente)
- `user_agent` (User-Agent do navegador)

**Resposta de Sucesso (201):**
```json
{
  "data": {
    "submission_id": 42
  },
  "message": "Form submitted successfully"
}
```

**Erros de Validação (422):**
```json
{
  "success": false,
  "message": "The data.email field is required.",
  "errors": {
    "data.email": ["Este campo é obrigatório."],
    "data.name": ["Este campo é obrigatório."]
  }
}
```

**Rate Limit:** 10 requisições por minuto

---

### Navigations

#### Listar Navegações
Retorna todas as navegações do site com seus itens.

```http
GET /api/v1/{site-slug}/navigations
```

**Parâmetros de URL:**
- `site-slug` (string, obrigatório) - Slug do site

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Menu Principal",
      "slug": "main-menu",
      "location": "header"
    },
    {
      "id": 2,
      "name": "Footer",
      "slug": "footer",
      "location": "footer"
    }
  ]
}
```

**Cache:** 1 hora (3600s)

---

#### Listar Itens de Navegação
Retorna os itens de uma navegação específica.

```http
GET /api/v1/{site-slug}/navigations/{navigation-id}/items
```

**Parâmetros de URL:**
- `site-slug` (string, obrigatório) - Slug do site
- `navigation-id` (integer, obrigatório) - ID da navegação

**Headers:**
```http
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "data": [
    {
      "title": "Home",
      "url": "/",
      "target": "_self"
    },
    {
      "title": "Sobre",
      "url": "/about",
      "target": "_self"
    },
    {
      "title": "Blog",
      "url": "/blog",
      "target": "_self"
    },
    {
      "title": "Contato",
      "url": "/contact",
      "target": "_self"
    }
  ]
}
```

**Campos:**
- `title` - Texto do link
- `url` - URL do link
- `target` - Alvo do link (`_self`, `_blank`)

**Ordenação:** Os itens são retornados na ordem definida no painel (campo `order`)

**Erros:**
- `403` - Navegação não pertence ao site
- `404` - Navegação não encontrada

---

### Analytics

#### Script de Analytics
Retorna o script JavaScript para tracking de pageviews.

```http
GET /api/v1/{site-slug}/analytics.js
```

**Parâmetros de URL:**
- `site-slug` (string, obrigatório) - Slug do site

**Headers:** Nenhum header obrigatório (endpoint público)

**Resposta de Sucesso (200):**
```javascript
!function(){var e="http://your-domain.com/api/v1/meu-site/analytics/pageview",...}();
```

**Content-Type:** `application/javascript`

**Cache:** 24 horas

**Como usar:**
```html
<script src="https://your-domain.com/api/v1/{site-slug}/analytics.js"></script>
```

**Metadados capturados (meta tags):**
```html
<meta name="entry-slug" content="meu-post">
<meta name="collection-slug" content="blog-posts">
```

Se não houver meta tags, o script usa o último segmento da URL como `entry_slug`.

---

#### Registrar Pageview
Registra uma visualização de página (usado automaticamente pelo script analytics.js).

```http
POST /api/v1/{site-slug}/analytics/pageview
```

**Parâmetros de URL:**
- `site-slug` (string, obrigatório) - Slug do site

**Headers:**
```http
Content-Type: application/json
Accept: application/json
```

**Observação:** Este endpoint **NÃO requer** autenticação (Bearer Token).

**Body:**
```json
{
  "entry_slug": "meu-primeiro-post",
  "collection_slug": "blog-posts",
  "session_id": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "referrer": "https://google.com",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "summer-2025"
}
```

**Campos:**
- `entry_slug` (string, obrigatório, max: 255) - Slug da entry visualizada
- `collection_slug` (string, opcional, max: 255) - Slug da collection
- `session_id` (string, obrigatório, exatamente 32 caracteres) - ID único da sessão
- `referrer` (string, opcional, URL válida, max: 500) - URL de origem
- `utm_source` (string, opcional, max: 50) - Fonte UTM
- `utm_medium` (string, opcional, max: 50) - Meio UTM
- `utm_campaign` (string, opcional, max: 100) - Campanha UTM

**Dados capturados automaticamente:**
- IP do cliente
- User-Agent
- Device type (desktop, mobile, tablet)
- Browser
- Sistema operacional
- Domínio do referrer

**Resposta de Sucesso (202):**
```json
{
  "success": true,
  "message": "Pageview tracked successfully"
}
```

**Observação:** Status `202 Accepted` indica que a pageview foi aceita e será processada de forma assíncrona (em fila).

**Bot Detection:**
Se um bot for detectado, retorna:
```json
{
  "success": true,
  "message": "Bot detected, pageview not tracked"
}
```
Status: `200 OK`

**Erros:**
- `403` - Domínio não autorizado
- `404` - Site ou Entry não encontrado
- `422` - Validação falhou

**Rate Limit:** 120 requisições por minuto

**Validação de Domínio:**
O endpoint valida se o domínio de origem (header `Origin` ou `Referer`) está autorizado nas configurações do site. Configure domínios autorizados no painel administrativo.

---

## 🔍 Exemplos de Uso

### JavaScript (Fetch)

#### Listar Collections
```javascript
const response = await fetch('https://your-domain.com/api/v1/meu-site/collections', {
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer seu-token-aqui'
  }
});

const data = await response.json();
console.log(data.data); // Array de collections
```

#### Listar Entries
```javascript
const response = await fetch('https://your-domain.com/api/v1/meu-site/collections/1/entries', {
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer seu-token-aqui'
  }
});

const data = await response.json();
console.log(data.data); // Array de entries
```

#### Submeter Formulário
```javascript
const response = await fetch('https://your-domain.com/api/v1/meu-site/forms/contact-form/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer seu-token-aqui'
  },
  body: JSON.stringify({
    data: {
      name: 'João Silva',
      email: 'joao@exemplo.com',
      message: 'Olá!'
    }
  })
});

const result = await response.json();
console.log(result.message);
```

---

### React Hooks

#### useFetch Hook
```javascript
import { useState, useEffect } from 'react';

function useFetch(url, token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url, token]);

  return { data, loading, error };
}

// Uso
function BlogPosts() {
  const { data, loading, error } = useFetch(
    'https://your-domain.com/api/v1/meu-site/collections/1/entries',
    'seu-token'
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {data.map(entry => (
        <article key={entry.id}>
          <h2>{entry.title}</h2>
          <p>{entry.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

---

### Next.js (App Router)

#### Server Component
```javascript
// app/blog/page.js
async function getPosts() {
  const res = await fetch(
    'https://your-domain.com/api/v1/meu-site/collections/1/entries',
    {
      headers: {
        'Authorization': `Bearer ${process.env.RUSH_API_TOKEN}`
      },
      next: { revalidate: 3600 } // Cache por 1 hora
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}

export default async function BlogPage() {
  const { data: posts } = await getPosts();

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

---

### Vue.js (Composition API)

```javascript
<template>
  <div>
    <div v-if="loading">Carregando...</div>
    <div v-else-if="error">Erro: {{ error }}</div>
    <div v-else>
      <article v-for="entry in entries" :key="entry.id">
        <h2>{{ entry.title }}</h2>
        <p>{{ entry.excerpt }}</p>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const entries = ref([]);
const loading = ref(true);
const error = ref(null);

const API_URL = 'https://your-domain.com/api/v1';
const SITE_SLUG = 'meu-site';
const API_TOKEN = 'seu-token';

onMounted(async () => {
  try {
    const response = await fetch(
      `${API_URL}/${SITE_SLUG}/collections/1/entries`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    entries.value = result.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
```

---

## 🚀 Casos de Uso Comuns

### Blog/Site Institucional

1. **Listar posts do blog:**
   ```
   GET /api/v1/{site}/collections/{blog-collection-id}/entries
   ```

2. **Listar páginas estáticas:**
   ```
   GET /api/v1/{site}/collections/{pages-collection-id}/entries
   ```

3. **Obter menu de navegação:**
   ```
   GET /api/v1/{site}/navigations/{header-nav-id}/items
   ```

4. **Enviar formulário de contato:**
   ```
   POST /api/v1/{site}/forms/contact/submit
   ```

5. **Tracking de analytics:**
   ```html
   <script src="/api/v1/{site}/analytics.js"></script>
   ```

---

### E-commerce / Catálogo de Produtos

1. **Listar produtos:**
   ```
   GET /api/v1/{site}/collections/{products-collection-id}/entries
   ```

2. **Filtrar por categoria (usando tags):**
   - Retorna as tags no campo `tags` de cada entry
   - Implemente filtros no frontend

3. **Formulário de orçamento:**
   ```
   POST /api/v1/{site}/forms/quote-request/submit
   ```

---

## 🔒 Segurança

### CORS
Configure os domínios autorizados no painel administrativo. Requests de domínios não autorizados serão bloqueados.

### HTTPS
**Obrigatório em produção.** A API deve ser acessada apenas via HTTPS.

### Proteção contra Bots
O endpoint de analytics detecta e ignora automaticamente bots conhecidos.

### Validação de Dados
Todos os endpoints validam dados de entrada rigorosamente.

### Rate Limiting
Proteção contra abuso com limites configuráveis.

---

## ⚠️ Notas Importantes

1. **Cache:** Endpoints de leitura são cacheados por 1 hora. Mudanças no painel admin limpam o cache automaticamente.

2. **Status de Entries:** Apenas entries com `status: published` são retornadas na API.

3. **Processamento Assíncrono:** Analytics são processados em fila (status 202). O registro não é instantâneo.

4. **Tokens:** Cada token está vinculado a um site específico. Use tokens diferentes para sites diferentes.

5. **Timezone:** Todas as datas são retornadas em UTC (ISO 8601).

6. **Media URLs:** URLs de mídia são absolutas e incluem o domínio completo.

---

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs de erro no painel admin
- Consulte a documentação técnica interna
- Entre em contato com a equipe de desenvolvimento

---

**Última atualização:** 2025-01-15
**Versão do documento:** 1.0

# LinkPages - Linktree Clone

LinkPages é uma funcionalidade do Rush CMS que permite criar páginas de links estilo Linktree, perfeitas para redes sociais e bio links.

## 📋 Índice

- [O que são LinkPages?](#o-que-são-linkpages)
- [Configuração](#configuração)
- [Rotas Disponíveis](#rotas-disponíveis)
- [Estrutura de Dados](#estrutura-de-dados)
- [Customização](#customização)

---

## O que são LinkPages?

LinkPages são páginas personalizáveis que contêm:
- Avatar/foto de perfil
- Título e descrição
- Lista de links principais (botões)
- Links de redes sociais
- Configurações de tema e estilo

**Casos de uso:**
- Bio link para Instagram/TikTok
- Página de links de influenciadores
- Portfólio com links importantes
- Menu de links para eventos

---

## Configuração

### 1. Criar um LinkPage no Rush CMS Admin

1. Acesse o painel administrativo do Rush CMS
2. Vá em **LinkPages** > **Criar Novo**
3. Preencha os campos:
   - **Título**: Nome que aparecerá na página
   - **Descrição**: Subtítulo ou bio
   - **Avatar**: Foto de perfil
   - **Links**: Adicione os botões principais
   - **Social Links**: Adicione links de redes sociais
   - **Settings**: Configure tema e estilo
4. **Importante**: Copie a **Key** gerada automaticamente

### 2. Configurar no .env

Adicione a key do LinkPage no seu arquivo `.env`:

```bash
# LinkPage Key (for /links page)
LINKPAGE_KEY=abc123xyz456def789ghi012jkl345mno678
```

**Nota:** Se você deixar `LINKPAGE_KEY` vazio, a rota `/links` retornará 404.

### 3. Build e Deploy

```bash
pnpm build
pnpm start
```

---

## Rotas Disponíveis

### 1. `/links` - LinkPage Padrão

Mostra o LinkPage configurado no `LINKPAGE_KEY`:

```
https://seu-site.com/links
```

**Como funciona:**
- Lê `LINKPAGE_KEY` do `.env`
- Busca o LinkPage na API
- Renderiza usando `LinkPageRenderer`
- Retorna 404 se não configurado

### 2. `/links/[key]` - LinkPage Específico

Permite acessar qualquer LinkPage por sua key:

```
https://seu-site.com/links/abc123xyz456
https://seu-site.com/links/influencer-bio
```

**Casos de uso:**
- Ter múltiplos LinkPages no mesmo site
- Um LinkPage para cada pessoa da equipe
- Páginas de links diferentes para cada campanha

---

## Estrutura de Dados

### API Endpoint

```http
GET /api/v1/{site-slug}/linkpages/{key}
```

### Resposta JSON

```json
{
  "data": {
    "id": 1,
    "key": "abc123xyz456",
    "title": "João Silva",
    "description": "Designer & Developer",
    "avatar": "https://cdn.example.com/avatar.jpg",
    "links": [
      {
        "title": "Meu Portfólio",
        "url": "https://joaosilva.com",
        "icon": "🎨",
        "display_mode": "icon_text"
      },
      {
        "title": "Instagram",
        "url": "https://instagram.com/joaosilva",
        "icon": "📷",
        "display_mode": "icon_text"
      }
    ],
    "social_links": [
      {
        "platform": "twitter",
        "url": "https://twitter.com/joaosilva",
        "icon": "🐦"
      },
      {
        "platform": "linkedin",
        "url": "https://linkedin.com/in/joaosilva",
        "icon": "💼"
      }
    ],
    "settings": {
      "theme": "light",
      "button_style": "rounded",
      "show_avatar": true,
      "show_description": true
    }
  }
}
```

---

## Customização

### Display Modes

Cada link pode ter um `display_mode` diferente:

- **`icon_text`** (padrão): Mostra ícone e texto
- **`icon_only`**: Apenas o ícone
- **`text_only`**: Apenas o texto

### Button Styles

Configure o estilo dos botões em `settings.button_style`:

- **`rounded`** (padrão): Bordas arredondadas
- **`square`**: Bordas quadradas
- **`pill`**: Bordas totalmente arredondadas

### Temas

Configure o tema em `settings.theme`:

- **`light`**: Tema claro
- **`dark`**: Tema escuro
- **`auto`**: Segue preferência do sistema

**Nota:** A implementação atual usa um tema fixo. Para habilitar temas dinâmicos, você precisa customizar o componente `LinkPageRenderer`.

---

## Exemplo de Uso no Código

### Buscar LinkPage no Server Component

```typescript
import { getLinkPage } from '@/lib/rush-cms'
import { config } from '@/lib/config'

export default async function MyPage() {
  const linkPage = await getLinkPage(
    config.site.slug,
    'abc123xyz456'
  )

  return (
    <div>
      <h1>{linkPage.title}</h1>
      <p>{linkPage.description}</p>
      {linkPage.links.map((link, index) => (
        <a key={index} href={link.url}>
          {link.icon} {link.title}
        </a>
      ))}
    </div>
  )
}
```

### Listar Todos os LinkPages

```typescript
import { getLinkPages } from '@/lib/rush-cms'
import { config } from '@/lib/config'

export default async function AllLinksPage() {
  const linkPages = await getLinkPages(config.site.slug)

  return (
    <div>
      <h1>Todos os LinkPages</h1>
      {linkPages.map((linkPage) => (
        <div key={linkPage.id}>
          <h2>{linkPage.title}</h2>
          <a href={`/links/${linkPage.key}`}>
            Ver página →
          </a>
        </div>
      ))}
    </div>
  )
}
```

---

## Tipos TypeScript

```typescript
import type {
  RushCMSLinkPage,
  RushCMSLinkPageLink,
  RushCMSLinkPageSocialLink,
  RushCMSLinkPageSettings,
  LinkDisplayMode
} from '@/types/rush-cms'
```

---

## SEO

O componente LinkPage gera metadados automaticamente:

- **Title**: Usa o título do LinkPage
- **Description**: Usa a descrição do LinkPage
- **Open Graph**: Inclui avatar como imagem

---

## Dicas e Melhores Práticas

1. **Mantenha links curtos**: Use títulos concisos nos botões
2. **Use emojis**: Adicione personalidade com ícones emoji
3. **Priorize links**: Coloque os mais importantes no topo
4. **Teste no mobile**: A maioria dos acessos vem de dispositivos móveis
5. **Analytics**: Use UTM parameters nos links para tracking

---

## Troubleshooting

### Página /links retorna 404

**Causa**: `LINKPAGE_KEY` não está configurado no `.env`

**Solução**:
1. Configure `LINKPAGE_KEY` no `.env`
2. Reinicie o servidor: `pnpm dev`

### LinkPage não carrega

**Causa**: A key está incorreta ou o LinkPage não está publicado

**Solução**:
1. Verifique se a key está correta no Rush CMS Admin
2. Certifique-se de que `is_published` está marcado como `true`
3. Verifique os logs do servidor

### Avatar não aparece

**Causa**: URL do avatar pode estar incorreta

**Solução**:
1. Verifique se a URL do avatar está acessível
2. Certifique-se de que `settings.show_avatar` está como `true`
3. Verifique se o Next.js Image está configurado para o domínio da CDN

---

**Última atualização**: 2025-12-08

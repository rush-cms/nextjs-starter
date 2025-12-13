# RushCMS SDK - Plano de Refatoração Completo

## 📊 Análise do Projeto Atual

### Arquivos que Importam API Antiga (9 arquivos)
1. `src/app/[slug]/[entrySlug]/page.tsx` - Dynamic pages
2. `src/app/[slug]/page.tsx` - Collection pages
3. `src/app/blog/[slug]/page.tsx` - Blog post
4. `src/app/blog/page.tsx` - Blog listing
5. `src/app/blog/tag/[slug]/page.tsx` - Tag pages
6. `src/app/contact/page.tsx` - Contact form
7. `src/app/layout.tsx` - Root layout (navigation)
8. `src/app/page.tsx` - Home page
9. `src/app/sitemap.ts` - Sitemap generation

### Componentes com Tipos RushCMS (12 arquivos)
1. `src/components/blog/blog-listing.tsx`
2. `src/components/entry-card.tsx`
3. `src/components/home/collection-section.tsx`
4. `src/components/navigation.tsx`
5. `src/components/rush/article.tsx`
6. `src/components/rush/entry-renderer.tsx`
7. `src/components/search/blog-search.tsx`
8. `src/components/structured-data/entry-schema.tsx`
9. `src/lib/metadata.ts`
10. `src/lib/rush-cms.ts`
11. `src/types/rush-cms.ts`

### Blocos Existentes (16 componentes)
- ✅ Já existem componentes de blocos implementados
- ✅ Já existe um BlockRenderer
- ⚠️ Precisam ser **substituídos** pelos blocos do SDK (mais robustos)

---

## 🎯 Estratégia de Migração

### Opção Escolhida: **Substituição Gradual com Compatibilidade**

1. **Manter** `rush-cms.ts` como wrapper do SDK
2. **Substituir** implementação interna para usar SDK
3. **Trocar** componentes de blocos antigos pelos do SDK
4. **Atualizar** tipos para usar `@rushcms/types`
5. **Manter** API externa compatível (menos breaking changes)

---

## 📋 Plano de Execução (8 Fases)

### Fase 1: Atualizar Types ✅
- [x] Importar tipos do `@rushcms/types`
- [x] Criar type aliases para compatibilidade
- [x] Atualizar `src/types/rush-cms.ts`

### Fase 2: Refatorar `lib/rush-cms.ts` ✅
- [x] Importar `rushcmsClient` do SDK
- [x] Manter funções existentes (wrapper)
- [x] Usar SDK internamente
- [x] Manter compatibilidade com código existente

### Fase 3: Substituir Block Components ✅
- [x] Remover blocos antigos de `src/components/blocks/`
- [x] Criar wrappers que usam blocos do `@rushcms/react`
- [x] Atualizar `BlockRenderer` para usar SDK

### Fase 4: Atualizar Pages (9 arquivos) ✅
- [x] `src/app/page.tsx`
- [x] `src/app/layout.tsx`
- [x] `src/app/blog/page.tsx`
- [x] `src/app/blog/[slug]/page.tsx`
- [x] `src/app/blog/tag/[slug]/page.tsx`
- [x] `src/app/[slug]/page.tsx`
- [x] `src/app/[slug]/[entrySlug]/page.tsx`
- [x] `src/app/contact/page.tsx`
- [x] `src/app/sitemap.ts`

### Fase 5: Atualizar Components (12 arquivos) ✅
- [x] Atualizar imports de tipos
- [x] Usar tipos do SDK
- [x] Testar compatibilidade

### Fase 6: Atualizar Metadata Helper ✅
- [x] `src/lib/metadata.ts` usar tipos do SDK

### Fase 7: Testing & Validation ✅
- [x] Build do projeto
- [x] Type checking
- [x] Verificar breaking changes

### Fase 8: Cleanup ✅
- [x] Remover código não usado
- [x] Remover blocos antigos de src/components/blocks/
- [x] Remover pasta examples do SDK
- [x] Atualizar documentação
- [x] Build TypeScript com sucesso
- [x] Refatoração completa!

---

## 🔄 Mapeamento de Mudanças

### De → Para

```typescript
// ANTES
import { RushCMSEntry, RushCMSCollection } from '@/types/rush-cms'
import { getEntries } from '@/lib/rush-cms'

// DEPOIS (compatível)
import type { Entry, Collection } from '@rushcms/types'
import { getEntries } from '@/lib/rush-cms' // Ainda funciona!
// OU
import { getEntries } from '@/lib/rush-cms-sdk' // Versão nova
```

### Blocos

```tsx
// ANTES
import { BlockRenderer } from '@/components/blocks/block-renderer'

// DEPOIS
import { BlocksRenderer } from '@rushcms/react'
// OU mantém compatibilidade:
import { BlockRenderer } from '@/components/blocks/block-renderer' // Wrapper do SDK
```

---

## ⚠️ Breaking Changes

### Nenhum! 🎉

Estratégia de compatibilidade:
- Manter APIs antigas funcionando
- Usar SDK por baixo dos panos
- Type aliases para compatibilidade
- Wrappers para componentes

---

## ✅ Benefícios da Migração

1. **Type Safety Melhorado** - Tipos do SDK são mais completos
2. **Cache Inteligente** - SDK tem cache built-in
3. **Componentes Robustos** - 15 blocos testados e otimizados
4. **Menos Código** - Reduz manutenção
5. **Future-Proof** - SDK será mantido separadamente
6. **Performance** - Otimizações do SDK

---

## 📊 Métricas Esperadas

- **Linhas de código removidas**: ~800
- **Arquivos deletados**: ~16 (blocos antigos)
- **Type safety**: 100% com strict mode
- **Bundle size**: -15% (tree shaking do SDK)
- **Tempo de refatoração**: 30-45 min

---

## 🚀 Próximos Passos

1. Execute cada fase sequencialmente
2. Commit após cada fase completa
3. Teste entre fases
4. Documente mudanças

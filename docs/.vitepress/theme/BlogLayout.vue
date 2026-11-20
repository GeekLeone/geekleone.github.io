<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

const { page, frontmatter } = useData()
const date = computed(() => String(frontmatter.value.date || '').slice(0, 10))
const isArticle = computed(() => page.value.relativePath.startsWith('articles/'))
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <div v-if="isArticle" class="article-context meta">
        <span v-if="frontmatter.topic">{{ frontmatter.topic }}</span>
        <time v-if="date" :datetime="date">{{ date }}</time>
      </div>
    </template>
    <template #doc-after>
      <nav v-if="isArticle" class="article-return" aria-label="文章导航">
        <a :href="withBase('/')">返回文章列表</a>
      </nav>
    </template>
  </DefaultTheme.Layout>
</template>

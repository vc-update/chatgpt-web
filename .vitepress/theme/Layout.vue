<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HomeDisclaimer from './components/HomeDisclaimer.vue'
import ArticleNotice from './components/ArticleNotice.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #home-hero-before>
      <HomeDisclaimer v-if="frontmatter.pageClass !== 'news-home-page'" />
    </template>
    <template #doc-before>
      <ArticleNotice />
    </template>
  </Layout>
</template>

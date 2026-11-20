<script setup>
import { data as posts } from './posts.data'
import { withBase } from 'vitepress'
</script>

<template>
  <main class="journal">
    <header class="masthead">
      <h1>阿叻的技术笔记</h1>
      <p>记录技术原理、项目取舍和 AI 实验。</p>
    </header>
    <section aria-labelledby="latest">
      <h2 id="latest" class="section-heading">最新文章</h2>
      <article v-for="post in posts" :key="post.url" class="post" :class="{ illustrated: post.trace }">
        <div class="story">
          <div class="meta"><span>{{ post.topic }}</span><time :datetime="post.date">{{ post.date }}</time></div>
          <h3><a :href="withBase(post.url)">{{ post.title }}</a></h3>
          <p>{{ post.summary }}</p>
        </div>
        <figure v-if="post.trace" class="trace">
          <figcaption>控制台输出顺序</figcaption>
          <ol>
            <li v-for="row in post.trace" :key="row.phase">
              <span>{{ row.phase }}</span><b v-for="(token, index) in row.output" :key="index">{{ token }}</b>
            </li>
          </ol>
        </figure>
      </article>
    </section>
  </main>
</template>
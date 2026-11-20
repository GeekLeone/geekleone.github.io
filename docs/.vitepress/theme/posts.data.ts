import { createContentLoader } from 'vitepress'

export default createContentLoader('articles/*.md', {
  transform(pages) {
    return pages.map(({ url, frontmatter }) => ({
      url, title: frontmatter.title, summary: frontmatter.description,
      trace: frontmatter.trace, topic: frontmatter.topic, date: String(frontmatter.date).slice(0, 10)
    })).sort((a, b) => b.date.localeCompare(a.date))
  }
})

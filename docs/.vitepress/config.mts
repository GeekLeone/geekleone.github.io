import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '阿叻',
  description: '技术分析、项目拆解与 AI 实验',
  head: [['meta', { name: 'theme-color', content: '#147b69' }]],
  themeConfig: {
    nav: [
      { text: '文章', link: '/', activeMatch: '^/(?:$|articles/)' },
      { text: '关于我', link: '/about' }
    ],
    outline: { label: '本文目录', level: [2, 3] },
    skipToContentLabel: '跳到正文',
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    docFooter: { prev: '上一篇', next: '下一篇' },
    sidebarMenuLabel: '菜单'
  }
})

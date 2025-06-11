import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Prisma",
  base: "/prisma-demo/",
  description:
    "使用 Prisma 可以为您提供一流的 TypeScript ORM、声明式数据库迁移系统以及包含入门所需的一切的数据库。",
  lang: "zh-CN",
  cleanUrls: true,
  sitemap: {
    hostname: "https://nonfan.github.io/prisma-demo/",
  },
  head: [
    ["link", { rel: "icon", href: "/prisma-demo/logo.png" }],
  ],
  themeConfig: {
    siteTitle: false,
    logo: {
      light: "/logo.svg",
      dark: "/logo-dark.svg",
    },
    outlineTitle: "页面导航",
    outline: [2, 3],
    lastUpdated: {
      text: "最后更新于",
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    darkModeSwitchLabel: "外观",
    returnToTopLabel: "返回顶部",
    sidebarMenuLabel: "菜单",
    nav: [
      { text: "指南", link: "/overview/what-is-prisma" },
      { text: "Prisma 官方文档", link: "https://prisma.org.cn/" },
    ],
    sidebar: [
      {
        text: "入门",
        items: [
          { text: "prisma 是什么?", link: "/overview/what-is-prisma" },
          { text: "快速开始", link: "/overview/getting-started" },
        ],
      },
      {
        text: "基础",
        collapsed: false,
        items: [],
      },
    ],
    search: {
      provider: "local",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/nonfan/prisma-demo" },
    ],
    editLink: {
      pattern: "https://github.com/nonfan/prisma-demo/edit/docs/docs/:path",
      text: "在 GitHub 上编辑此页面",
    },
    footer: {
      message: "基于 MIT 许可发布",
      copyright:
        'Copyright © 2025-present <a href="https://github.com/nonfan">MOFAN</a>',
    },
  },
});

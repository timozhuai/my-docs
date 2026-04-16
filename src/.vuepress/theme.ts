import { hopeTheme } from "vuepress-theme-hope";

import { zhNavbarConfig } from "./navbar.js";
import { zhSidebarConfig } from "./sidebar/index.js";

export default hopeTheme(
  {
    hostname: "https://mozhuai.site",

    author: {
      name: "Tmz",
      url: "https://mozhuai.site",
    },

    favicon: "/favicon.ico",

    logo: "/logo.svg",

    repo: "vuepress-theme-hope/vuepress-theme-hope",

    docsDir: "src",

    locales: {
      "/": {
        navbar: zhNavbarConfig,
        sidebar: zhSidebarConfig,
      },
    },

    displayFooter: true,
    footer: '<a href="/sitemap.xml">网站地图</a> | 豫ICP备2026003374号-1',
    copyright: "Copyright © 2019-present Tmz",

    blog: {
      description: "热爱探索互联网资源的普通用户",
      intro: "/资源/关于我.html",
      name: "Tmz",
      medias: {
        WechatMP: "/assets/img/wechat-qr.png",
        Bilibili: "https://space.bilibili.com/3546386612095774",
      },
    },

    plugins: {
      sitemap: {},
      blog: true,
      slimsearch: {},
      comment: {
        provider: "Waline",
        serverURL: "https://waline.mozhuai.site/",
        pageview: true,
      },
      components: {
        components: ["VPCard"],
      },
    },

    markdown: {
      align: true,
      codeTabs: true,
      demo: true,
      figure: true,
      flowchart: true,
      highlighter: {
        type: "shiki",
        lineNumbers: 10,
        langAlias: {
          conf: "ini",
        },
      },
      imgLazyload: true,
      imgMark: true,
      imgSize: true,
      footnote: true,
      mark: true,
      mermaid: true,
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
    },
  },
  false,
);

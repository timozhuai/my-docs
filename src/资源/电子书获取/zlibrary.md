---
title: Z-Library Worker 部署指南
date: 2025-01-01
tags:
  - Z-Library
  - 电子书
  - 教程
  - 部署
description: Z-Library 使用教程及最新访问地址汇总
---

# Z-Library Worker 终极加固私有版

> ⚠️ **重要警告**：此项目仅供学习和研究目的。使用前请了解相关法律法规，确保您的使用符合当地法律要求。

## ✨ 主要功能

- 🔐 **双重认证**：Basic Auth + IP 白名单
- 🛡️ **双重限流**：IP 访问限制 + 全站访问限制
- 🔒 **隐私保护**：清理敏感响应头，防止追踪
- 🚀 **性能优化**：异步处理，不影响响应速度

## 🔧 配置说明

### 1. 访问控制配置

```javascript
const AUTH_NAME = "your_username"; // ⚠️ 必须修改：设置强用户名
const AUTH_PASS = "your_strong_password"; // ⚠️ 必须修改：使用复杂密码（至少16位，包含大小写、数字、特殊字符）

// IP 白名单（可选），如 ['1.2.3.4', '5.6.7.8']
// 留空表示不限制 IP
const IP_WHITE_LIST = [];
```

> 🔒 **安全提醒**：请务必修改默认的用户名和密码，使用强密码防止暴力破解！

### 2. 防刷限额配置

```javascript
const MAX_VISITS_PER_IP = 100; // 每个 IP 每日限制访问次数
const GLOBAL_MAX_VISITS = 5000; // 全站每日总请求上限
```

### 3. 目标配置

```javascript
const upstream = "z-library.ec"; // 目标域名
const upstream_mobile = "z-library.ec"; // 移动端目标域名
const https = true; // 使用 HTTPS
```

## 📋 完整代码

<details>
<summary>点击查看完整代码</summary>

```javascript
/**
 * Z-Library Worker 终极加固私有版
 * 功能：Basic Auth + IP/全站双重限流 + 隐私加固 + 屏蔽扫描
 */

// --- 🔐 1. 访问控制配置 ---
const AUTH_NAME = "admin"; // 你的用户名
const AUTH_PASS = "123456"; // 你的密码

// [IP 白名单] 如果不为空，则只有名单内的 IP 能访问。例: ['1.2.3.4', '5.6.7.8']
const IP_WHITE_LIST = [];

// --- 🛡️ 2. 防刷限额配置 ---
const MAX_VISITS_PER_IP = 100; // 每个 IP 每日限制
const GLOBAL_MAX_VISITS = 5000; // 全站每日总请求上限 (防止额度被恶意刷光)

// --- ⚙️ 3. 目标配置 ---
const upstream = "z-library.ec";
const upstream_mobile = "z-library.ec";
const https = true;

// --- 🚀 4. 代码逻辑 ---

addEventListener("fetch", (event) => {
  event.respondWith(fetchAndApply(event));
});

async function fetchAndApply(event) {
  const request = event.request;
  const ip_address = request.headers.get("cf-connecting-ip");
  const KV = globalThis.ZLIB_AUTH;
  const dateKey = new Date().toISOString().slice(0, 10);

  // --- [安全层 1] IP 白名单校验 ---
  if (IP_WHITE_LIST.length > 0 && !IP_WHITE_LIST.includes(ip_address)) {
    return new Response("Unauthorized IP.", { status: 403 });
  }

  // --- [安全层 2] 密码验证 (Basic Auth) ---
  if (!(await checkBasicAuth(request))) {
    return new Response("Private Access", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  // --- [安全层 3] 双重频率限制 (KV) ---
  if (KV) {
    const globalKey = `global_total:${dateKey}`;
    const ipKey = `ip_visit:${ip_address}:${dateKey}`;

    // 并行读取全站和个人计数
    const [globalCount, ipCount] = await Promise.all([
      KV.get(globalKey).then((v) => parseInt(v) || 0),
      KV.get(ipKey).then((v) => parseInt(v) || 0),
    ]);

    // 全站总额度拦截
    if (globalCount >= GLOBAL_MAX_VISITS) {
      return new Response("System Maintenance (Daily Quota Exceeded)", {
        status: 503,
      });
    }
    // 个人额度拦截
    if (ipCount >= MAX_VISITS_PER_IP) {
      return new Response("Daily limit reached.", { status: 429 });
    }

    // 异步更新计数，不影响响应速度
    event.waitUntil(
      Promise.all([
        KV.put(globalKey, (globalCount + 1).toString(), {
          expirationTtl: 86400,
        }),
        KV.put(ipKey, (ipCount + 1).toString(), { expirationTtl: 86400 }),
      ]),
    );
  }

  // --- [核心层] 代理转发 ---
  let url = new URL(request.url);
  const url_hostname = url.hostname;
  const user_agent = request.headers.get("user-agent");

  let upstream_domain =
    user_agent && /Android|iPhone|iPad/i.test(user_agent)
      ? upstream_mobile
      : upstream;

  url.host = upstream_domain;
  url.protocol = https ? "https:" : "http:";

  let new_request_headers = new Headers(request.headers);
  new_request_headers.set("Host", upstream_domain);
  new_request_headers.set("Referer", `https://${upstream_domain}/`);
  new_request_headers.delete("Authorization"); // 验证完毕后删除，不传给原站

  if (new_request_headers.has("Origin")) {
    new_request_headers.set("Origin", `https://${upstream_domain}`);
  }

  let original_response = await fetch(url.href, {
    method: request.method,
    headers: new_request_headers,
    body: request.body,
    redirect: "manual",
  });

  let new_response_headers = new Headers(original_response.headers);

  // 修复 Cookie
  const setCookie = new_response_headers.get("Set-Cookie");
  if (setCookie) {
    new_response_headers.delete("Set-Cookie");
    setCookie.split(/,(?=[^;]+?=)/).forEach((cookie) => {
      let newCookie = cookie.replace(
        new RegExp(upstream_domain, "gi"),
        url_hostname,
      );
      newCookie = newCookie
        .replace(/;\s*Secure/gi, "")
        .replace(/;\s*Domain=[^;]+/gi, "");
      newCookie += "; Secure; SameSite=None";
      new_response_headers.append("Set-Cookie", newCookie);
    });
  }

  // 修复重定向
  const location = new_response_headers.get("Location");
  if (location) {
    new_response_headers.set(
      "Location",
      location.replace(new RegExp(upstream_domain, "gi"), url_hostname),
    );
  }

  // 安全头清理 (彻底移除原站 CSP)
  new_response_headers.delete("content-security-policy");
  new_response_headers.delete("content-security-policy-report-only");
  new_response_headers.delete("x-content-type-options");
  new_response_headers.delete("access-control-allow-origin");

  // 注入隐私保护
  new_response_headers.set("Referrer-Policy", "no-referrer"); // 更加严格的隐私保护
  new_response_headers.set("X-Content-Type-Options", "nosniff");

  // 响应分流处理
  const content_type = new_response_headers.get("content-type");
  const status = original_response.status;

  if (
    content_type &&
    (content_type.includes("text/html") ||
      content_type.includes("javascript") ||
      content_type.includes("json"))
  ) {
    let text = await original_response.text();
    text = text.replace(new RegExp(upstream_domain, "g"), url_hostname);

    if (content_type.includes("text/html")) {
      // 仅保留核心防报错代码，移除所有 Console Log 标记
      const injectCode = `<script>window.addEventListener('error', e => { if(e.message.includes('eval')) e.preventDefault(); }, true);</script>`;
      text = text.replace("<head>", "<head>" + injectCode);
    }
    return new Response(text, { status, headers: new_response_headers });
  } else {
    return new Response(original_response.body, {
      status,
      headers: new_response_headers,
    });
  }
}

/**
 * Basic Auth 验证逻辑
 */
async function checkBasicAuth(request) {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;
  try {
    const decoded = atob(auth.split(" ")[1]);
    const [user, pass] = decoded.split(":");
    return user === AUTH_NAME && pass === AUTH_PASS;
  } catch (e) {
    return false;
  }
}
```

</details>

## 🚀 部署步骤

### 第一步：创建 Cloudflare Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Create Worker**
5. 给 Worker 命名，例如：`z-library-proxy`

### 第二步：配置 KV 命名空间（可选）

如果需要使用访问统计功能：

1. 在 Workers & Pages 页面，选择 **KV**
2. 创建新的 KV 命名空间，命名为：`ZLIB_AUTH`
3. 在 Worker 设置中绑定 KV 命名空间：
   - Variable name: `ZLIB_AUTH`
   - KV namespace: 选择刚创建的命名空间

### 第三步：部署代码

1. 复制上面的完整代码
2. 粘贴到 Worker 编辑器中
3. **修改配置**：
   - 更改 `AUTH_NAME` 和 `AUTH_PASS` 为你的用户名和密码
   - 根据需要调整访问限制
4. 点击 **Save and Deploy**

### 第四步：绑定自定义域名（可选）

1. 在 Worker 设置中，选择 **Triggers**
2. 点击 **Add custom domain**
3. 输入你的域名，例如：`books.yourdomain.com`
4. 等待 SSL 证书自动生成

## 🔒 安全建议

1. **强密码**：使用复杂的用户名和密码组合
2. **IP 白名单**：如果只有特定地区使用，配置 IP 白名单
3. **定期更换**：定期更换认证信息
4. **监控使用**：通过 KV 数据监控访问情况

## 📝 注意事项

- 免费版 Cloudflare Worker 每天有 100,000 次请求限制
- KV 存储有读写次数限制，请合理设置访问上限
- 确保遵守当地法律法规

## 🐛 常见问题

**Q: 无法访问怎么办？**
A: 检查认证信息是否正确，IP 是否在白名单内

**Q: 如何查看访问统计？**
A: 通过 KV 命名空间可以查看每日访问数据

**Q: 可以添加多个目标域名吗？**
A: 可以修改代码实现多域名轮询或负载均衡

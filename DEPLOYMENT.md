# 让其他电脑访问 ¡Hola!

`127.0.0.1` 和 `localhost` 永远只代表正在打开网页的那台电脑，不能作为分享地址。

## 同一 Wi-Fi 或局域网内临时体验

1. 在项目目录运行 `pnpm dev`。
2. 保持这台电脑和终端窗口开启。
3. 把终端中 `Network` 后面的地址发给对方，例如 `http://10.10.9.176:4173/`。
4. 如果仍然无法连接，确认两台电脑位于同一网络，并检查路由器、校园网或公司网络是否启用了“客户端隔离”。

局域网 IP 可能在重连网络后变化，因此每次分享前都应查看最新的 `Network` 地址。

## 让任何电脑长期访问

先运行 `pnpm build`，然后把生成的 `dist/` 目录部署到 Vercel、Netlify、Cloudflare Pages 或其他静态网站托管服务。部署完成后应分享平台提供的 `https://...` 公网地址。

当前仓库没有配置 Git 远端，也没有绑定任何托管账号，所以本机无法凭空生成一个长期公网链接。公开部署会把网站内容暴露到互联网，需要由网站所有者选择托管平台并授权发布。

## 使用 GitHub Pages 自动发布

项目已经包含 `.github/workflows/deploy-pages.yml`。把代码推送到 GitHub 的 `main` 或 `master` 分支后：

1. 打开仓库的 `Settings → Pages`。
2. 在 `Build and deployment` 中选择 `GitHub Actions`。
3. 打开仓库的 `Actions` 页面，等待 `Deploy Hola to GitHub Pages` 变为绿色。
4. 使用 Actions 任务或 Pages 设置中显示的 `https://<用户名>.github.io/<仓库名>/` 地址。

工作流会自动识别仓库名称、设置 Vite 的 Pages 子路径、运行代码检查和测试，然后只上传构建后的 `dist/`。以后每次推送代码都会自动更新网站，不需要手动提交 `dist/`。

## Browser 能验证什么

Browser 或 Playwright 可以验证页面能否加载、不同屏幕尺寸的布局和页面交互，但它们运行在当前电脑的环境中，不能代替另一台真实电脑验证家庭路由器、防火墙、校园网或运营商网络。

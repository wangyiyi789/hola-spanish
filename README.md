# ¡Hola! 西班牙语学习网站

## 启动

```bash
pnpm install
pnpm dev
```

开发服务器固定使用 `4173` 端口，并监听所有本地网卡。

- 当前电脑：`http://127.0.0.1:4173/`
- 同一 Wi-Fi／局域网下的其他设备：`http://<运行电脑的局域网 IP>:4173/`

`127.0.0.1` 是回环地址，每台电脑的 `127.0.0.1` 都只指向它自己，因此不能把这个地址直接发给其他电脑。如果局域网地址仍无法访问，请检查 Windows 防火墙是否允许 Node.js 在“专用网络”上通信。

运行 `pnpm dev` 后不要关闭终端窗口。Vite 会在 `Network` 一行打印可供其他设备使用的完整地址；两台电脑必须在同一 Wi-Fi／局域网。

可用以下命令查看 Windows 局域网 IP：

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' }
```

## 生产构建

```bash
pnpm build
pnpm preview
```

`dist/` 是纯静态网站，可部署到 Cloudflare Pages、Vercel、Netlify 或任意静态网站托管服务，从而让互联网上的其他电脑访问。

跨电脑访问、局域网排查和公网发布说明见 [DEPLOYMENT.md](./DEPLOYMENT.md)。

项目已配置 GitHub Pages 自动发布工作流。代码推送到 GitHub 后，在仓库 `Settings → Pages` 中把发布来源设为 `GitHub Actions`，之后每次推送都会自动测试、构建和更新公网网站。

# 云孪信息科技 - 企业官网 + 后台管理系统

## 项目简介

本系统是为数字孪生公司"云孪信息科技"设计的企业官网与后台管理系统。前台展示作品案例和解决方案，后台支持内容管理（CRUD）、文件上传和权限管理。

### 技术栈
- 纯前端实现（HTML5 + CSS3 + Vanilla JavaScript）
- 数据持久化基于浏览器 localStorage
- 前后台共享同一数据层（`assets/js/data.js`）
- Canvas 粒子背景动画

## 目录结构

```
digiwin-site/
├── index.html              # 前台首页
├── cases.html              # 案例列表页
├── case-detail.html        # 案例详情页（?id=xxx）
├── solutions.html          # 解决方案页（锚点导航）
├── about.html              # 关于我们
├── contact.html            # 联系我们
├── admin/
│   ├── login.html          # 后台登录页
│   ├── index.html          # 后台管理主页
│   └── admin.js            # 后台核心逻辑
├── assets/
│   ├── css/
│   │   ├── common.css      # 公共样式系统
│   │   └── admin.css       # 后台样式
│   └── js/
│       ├── data.js         # 统一数据层（默认数据 + CRUD API）
│       ├── main.js         # 前台公共 JS
│       └── particles.js    # 粒子背景动画
└── README.md               # 本文件
```

## 运行方式

### 方式一：直接打开（推荐）
直接用浏览器打开 `index.html` 即可访问前台页面。

### 方式二：本地服务器（解决 CORS 限制）
如果遇到文件引用问题，可使用任意本地服务器：

```bash
# Python 3
cd digiwin-site
python -m http.server 8080

# Node.js (需要安装 http-server)
npx http-server digiwin-site -p 8080
```

然后访问 `http://localhost:8080`

## 后台管理

### 访问方式
打开 `admin/login.html`

### 演示账号

| 角色 | 用户名 | 密码 | 权限 |
|---|---|---|---|
| 管理员 | admin | admin123 | 全部权限（CRUD + 用户管理 + 发布） |
| 编辑者 | editor | editor123 | 内容编辑（不可删除、不可管理用户、不可发布） |

### 后台功能
- **仪表盘**：统计已发布的案例/方案/新闻数量
- **首页轮播**：管理 Hero 区轮播内容
- **解决方案**：编辑五大行业方案详情
- **案例管理**：新增/编辑/删除案例
- **关于我们**：维护公司介绍、发展历程、团队、资质、合作伙伴
- **新闻管理**：发布/编辑公司新闻
- **联系方式**：更新公司联系方式
- **导航设置**：管理网站导航菜单
- **用户管理**：新增/删除/修改用户角色（仅管理员）

### 数据持久化
所有数据修改通过 `data.js` API 自动同步到浏览器 localStorage。首次运行使用内置默认数据。如需重置，可在浏览器控制台执行：

```javascript
DataLayer.resetData()
```

## 视觉风格
- 深空蓝黑主题 (`#0a0e27`)
- 半透明毛玻璃卡片 + 亮青色强调
- 响应式适配（桌面/平板/手机）
- Canvas 粒子背景动画
- 滚动渐入动画

## 注意事项
- 所有图片使用占位符（渐变色块），实际部署时替换为真实图片
- 联系表单为演示用途，实际使用时需对接后端 API
- 登录验证仅在前端完成，生产环境需配合服务端认证

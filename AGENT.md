# 任务管理应用（Task Manager）

## 项目概述
一个基于 Vue 3 的看板式任务管理应用，数据存储在浏览器 localStorage 中，无需后端。支持任务的增删改查、拖拽改变状态、优先级标记、深色模式切换，所有数据持久化在本地。

## 技术栈
- 前端框架：Vue 3（Composition API + `<script setup>`），版本 ^3.5.42
- 构建工具：Vite，版本 ^8.3.0
- 样式方案：Tailwind CSS v3（^3.4.19）+ PostCSS + Autoprefixer
- 数据存储：浏览器 localStorage
- 拖拽方案：HTML5 原生 Drag & Drop API（零第三方依赖）
- 包管理器：npm
- 运行环境：Node.js（v24+），操作系统 Windows

## 目录结构
```
Task-Management/               ← git 仓库根目录 = 项目根目录
├── .gitignore
├── AGENT.md                   ← 本文件，项目上下文与开发规范
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js         ← content 路径配置
├── postcss.config.js          ← tailwindcss + autoprefixer 插件
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.js                ← 入口，import './style.css' + 挂载 App
    ├── style.css              ← @tailwind base/components/utilities 三指令
    ├── App.vue                ← 根组件
    ├── assets/                ← 静态图片资源
    ├── components/             ← 通用 UI 组件（PascalCase 命名）
    ├── composables/           ← 可复用逻辑函数（camelCase 命名，如 useTasks.js）
    └── utils/                  ← 纯工具函数（如 storage.js 封装 localStorage 操作）
```

## 功能要求

### 任务管理
- 创建任务：标题必填，描述选填
- 编辑任务：支持修改标题、描述、优先级
- 删除任务：支持删除单个任务
- 三种状态：待办（todo）/ 进行中（in-progress）/ 完成（done）

### 优先级
- 三档优先级，对应颜色：
  - 高 = 红色（red）
  - 中 = 黄色（yellow）
  - 低 = 绿色（green）

### 看板视图
- 三列卡片布局，分别对应三种状态
- 拖拽卡片跨列即改变任务状态
- 列内可拖拽排序

### 深色模式
- 一键切换深色/浅色模式
- 模式选择记忆存储在 localStorage
- 默认跟随系统偏好（prefers-color-scheme）

### 数据持久化
- 所有任务数据持久化到 localStorage，刷新不丢失
- 深色模式偏好持久化到 localStorage

## 编码规范
- 统一使用 Vue 3 Composition API 和 `<script setup>` 语法
- 组件文件使用 PascalCase 命名（如 TaskCard.vue、TaskColumn.vue）
- 工具函数 / composable 使用 camelCase 命名（如 useTasks.js）
- 样式统一使用 Tailwind 工具类，不写独立 CSS 文件（除非 Tailwind 无法覆盖）
- localStorage 的 key 统一使用 `task-manager:` 前缀
  - `task-manager:tasks` — 任务列表数据
  - `task-manager:theme` — 深色模式偏好
- ID 生成统一使用 `crypto.randomUUID()`
- 时间戳统一使用 `Date.now()` 毫秒级

## 常用命令
```bash
npm run dev      # 启动开发服务器（默认 http://localhost:5173）
npm run build   # 生产构建，输出到 dist/
npm run preview # 预览生产构建
```

## 注意事项
- 每次修改代码后，提醒刷新浏览器验证效果
- 不要引入额外的第三方拖拽库（如 vuedraggable），使用原生 HTML5 Drag & Drop API
- 优先复用已有组件，避免重复创建相似功能的文件
- Tailwind CSS 为 v3 版本，使用 `@tailwind` 指令 + `tailwind.config.js` + `postcss.config.js` 经典配置方式，不升级到 v4 的 `@import` 方式

## 数据模型

任务对象结构：
```js
{
  id: string,            // 唯一标识（crypto.randomUUID()）
  title: string,         // 标题（必填，不可为空）
  description: string,  // 描述（选填，默认空字符串）
  status: 'todo' | 'in-progress' | 'done',  // 任务状态，默认 'todo'
  priority: 'high' | 'medium' | 'low',        // 优先级，默认 'medium'
  createdAt: number,    // 创建时间戳（Date.now()）
  updatedAt: number,    // 最后更新时间戳（Date.now()）
  completedAt: number | null  // 完成时间戳，未完成时为 null
}
```

localStorage 存储结构：
```js
// key: "task-manager:tasks"
// value: JSON 序列化的任务对象数组
[
  { id, title, description, status, priority, createdAt, updatedAt, completedAt },
  ...
]
```

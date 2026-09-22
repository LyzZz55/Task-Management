# Task Manager

一个基于 Vue 3 的看板式任务管理应用。数据存储在浏览器 localStorage 中，无需后端，开箱即用。

## 功能特性

- **看板视图**：三列布局（待办 / 进行中 / 完成），一目了然
- **拖拽交互**：HTML5 原生 Drag & Drop，拖拽卡片跨列即改状态，列内可拖拽排序
- **优先级标记**：高（红）/ 中（黄）/ 低（绿）三档优先级，左侧色条醒目标记
- **深色模式**：一键切换深色 / 浅色模式，首次跟随系统偏好，后续记忆选择
- **数据持久化**：所有任务数据和主题偏好存储在 localStorage，刷新不丢失
- **零后端依赖**：纯前端应用，无需服务器和数据库

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | ^3.5.42 | Composition API + `<script setup>` |
| Vite | ^8.3.0 | 构建工具与开发服务器 |
| Tailwind CSS | ^3.4.19 | 原子化 CSS 框架（v3 经典配置） |
| PostCSS | ^8.5.28 | CSS 后处理器 |
| Autoprefixer | ^10.6.1 | 自动添加浏览器前缀 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

开发服务器默认运行在 `http://localhost:5173`。

## 项目结构

```
task-manager/
├── index.html               # HTML 入口
├── package.json
├── vite.config.js           # Vite 配置
├── tailwind.config.js       # Tailwind 配置（darkMode: 'class'）
├── postcss.config.js        # PostCSS 配置
├── AGENT.md                 # 项目上下文与开发规范
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.js              # 应用入口
    ├── style.css            # Tailwind 三指令 + color-scheme
    ├── App.vue              # 根组件（看板布局 + 主题切换）
    ├── assets/              # 静态图片资源
    ├── components/
    │   ├── TaskForm.vue     # 创建 / 编辑表单
    │   ├── TaskItem.vue     # 任务卡片（可拖拽）
    │   └── TaskColumn.vue   # 看板列容器（拖拽放置区）
    ├── composables/
    │   ├── useTasks.js      # 任务 CRUD + 拖拽逻辑 + 自动持久化
    │   └── useTheme.js      # 深色模式管理
    └── utils/
        └── storage.js       # localStorage 封装
```

## 数据模型

```js
{
  id: string,            // 唯一标识（crypto.randomUUID()）
  title: string,         // 标题（必填）
  description: string,   // 描述（选填，默认空字符串）
  status: 'todo' | 'in-progress' | 'done',  // 状态，默认 'todo'
  priority: 'high' | 'medium' | 'low',       // 优先级，默认 'medium'
  createdAt: number,    // 创建时间戳
  updatedAt: number,    // 最后更新时间戳
  completedAt: number | null  // 完成时间戳，未完成时为 null
}
```

数据存储在 `localStorage`，key 为 `task-manager:tasks`（任务列表）和 `task-manager:theme`（主题偏好）。

## License

MIT

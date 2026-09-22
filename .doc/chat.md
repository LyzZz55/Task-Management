# 开发对话记录

## 项目信息
- **项目名称**: Task Manager（任务管理应用）
- **仓库地址**: git@github.com:LyzZz55/Task-Management.git
- **开发日期**: 2026-09-22
- **AI 助手**: AiWork（蚂蚁数科研发的通用 AI 工作智能体）

---

## 对话摘要

### 第一阶段：项目初始化

**用户请求**: 从零搭建 Vue 3 + Vite + Tailwind CSS 项目骨架，项目名为 task-manager。

**执行过程**:
1. 使用 `npm create vite@latest task-manager -- --template vue` 初始化 Vue 3（JavaScript）项目
2. 安装 Tailwind CSS v3 及依赖（tailwindcss@3.4.19、postcss@8.5.28、autoprefixer@10.6.1）
3. 创建 `tailwind.config.js`（content 路径 `./index.html` + `./src/**/*.{vue,js}`）和 `postcss.config.js`
4. `src/style.css` 引入 `@tailwind base/components/utilities` 三指令
5. `main.js` 确认引入 `style.css`
6. 启动 dev server 验证：HTTP 200，Tailwind 编译产物正确

**关键决策**: 刻意锁定 tailwindcss v3 而非 v4，因为用户要求的 `tailwind.config.js` + `postcss.config.js` + `@tailwind` 三指令是 v3 的经典配置方式。

### 第二阶段：项目目录重组

**用户指出**: 当前目录 `E:\Coding\software\0922\Task-Management` 本身就是 git 仓库根目录，项目应直接搭建在此目录下，不应嵌套在 `task-manager` 子目录中。

**执行过程**:
1. 用 robocopy 将 `task-manager` 子目录下所有文件（排除 node_modules）移动到当前目录
2. 终止残留的 dev server node 进程（PID 25132、26764）
3. 删除 `task-manager` 子目录
4. 在当前目录重新 `npm install`
5. 配置 `.gitignore`（Vite 标准 + 环境变量 + .sandbox-tmp）
6. 验证 dev server 正常运行

### 第三阶段：编写 AGENT.md

**用户请求**: 在项目根目录写了一份简单的 AGENT.md，要求根据项目实际情况完善。

**完善内容**:
- 补充目录结构（含预规划的 composables/、utils/ 目录）
- 补充常用命令（dev/build/preview）
- 完善数据模型（增加 updatedAt、completedAt 字段）
- 补充技术栈版本号和运行环境
- 明确 localStorage key 规范
- 补充编码规范（crypto.randomUUID()、Date.now()）

### 第四阶段：基础功能实现（CRUD + 持久化）

**用户请求**: 实现项目最基础的骨架——创建、编辑、存储事项，确保刷新不丢失信息。

**创建的文件**:
- `src/utils/storage.js` — localStorage 封装（loadTasks/saveTasks）
- `src/composables/useTasks.js` — 任务 CRUD 逻辑，watch 深度监听自动持久化
- `src/components/TaskForm.vue` — 创建/编辑表单（标题必填、描述选填、状态/优先级下拉）
- `src/components/TaskItem.vue` — 任务卡片展示（优先级圆点、状态标签）
- `src/App.vue` — 主页面（新建/编辑/删除/筛选/空状态）

### 第五阶段：工作流程调整

**用户请求**: 调整为"暂存-测试-提交-统一推送"的工作流程，并撤回之前的推送。

**新工作流程（写入 AGENT.md）**:
1. 完成新需求实现后，暂存所有修改（git add）但不本地提交
2. 用户测试后如果发现问题，进行修复后再次暂存
3. 直到功能没有问题，将所有修改提交到本地（git commit），然后回到步骤 1
4. 全部开发完成后，一并推送到远程（git push）

**执行**: `git reset --soft` 撤回 CRUD 提交，重新按新流程提交到本地。SSH 连接 GitHub 超时，改为本地工作。

### 第六阶段：看板拖拽 + 深色模式

**用户请求**: 实现 UI 相关功能——拖拽、深色/浅色模式。

**创建/修改的文件**:
- `tailwind.config.js` — 添加 `darkMode: 'class'`
- `src/composables/useTheme.js`（新建） — 深色模式管理，跟随系统偏好 + localStorage 记忆
- `src/composables/useTasks.js` — 新增 draggingId、startDrag、endDrag、moveTask
- `src/components/TaskColumn.vue`（新建） — 三列看板容器，dragover/drop 处理
- `src/components/TaskItem.vue` — 添加 draggable、drag 事件、深色模式样式
- `src/components/TaskForm.vue` — 添加深色模式样式
- `src/App.vue` — 看板三列布局 + 主题切换按钮 + 拖拽逻辑
- `src/style.css` — 添加 color-scheme

**拖拽实现细节**:
- HTML5 原生 Drag & Drop API，零第三方依赖
- 拖拽跨列改状态，列内拖拽排序
- 拖拽时卡片半透明（opacity-40），拖到目标卡片上方/下方显示蓝色边线

### 第七阶段：Bug 修复

**问题 1: 跨列拖拽后条目高光丢失**
- **根因**: moveTask 后源列 TaskItem 被卸载，dragend 事件来不及触发，draggingId 保持设置，新列中的卡片以 opacity-40 显示
- **修复**: 在 handleDropOnTask 和 handleDropOnColumn 中，moveTask 之后立即调用 endDrag()

**问题 2: 优先级色条太细 + 深色模式下颜色相同**
- **根因（太细）**: border-l-4 = 4px
- **根因（深色同色）**: `dark:border-slate-700`（两重选择器）覆盖了 `border-l-red-500`（一重选择器）
- **修复**: 放弃 border 方案，改用独立 div 色条（w-3 = 12px，3 倍宽度），使用 bg- 背景色彻底避免 CSS 优先级冲突

### 第八阶段：文档完善

**用户请求**: 写 README.md，新建 .doc/chat.md 保存对话上下文，提交并 push。

---

## 提交历史

```
475d070  fix: 优先级色条增粗 + 深色模式颜色修复
e89014b  fix: 跨列拖拽后条目高光丢失 + 优先级改为左侧色条
11e5483  feat: 看板拖拽 + 深色模式
7b9b6d4  docs: 更新工作流程为暂存-测试-提交-统一推送模式
277526e  feat: 实现任务管理基础功能（CRUD + localStorage 持久化）
6500a5e  docs: 完善项目上下文文档 AGENT.md
68e3b05  feat: 搭建 Vue 3 + Vite + Tailwind CSS 项目骨架
0c33780  Initial commit
```

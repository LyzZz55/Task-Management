<script setup>
import { ref, computed } from 'vue'
import { useTasks } from './composables/useTasks.js'
import { useTheme } from './composables/useTheme.js'
import TaskForm from './components/TaskForm.vue'
import TaskColumn from './components/TaskColumn.vue'

const {
  tasks,
  createTask,
  updateTask,
  deleteTask,
  draggingId,
  startDrag,
  endDrag,
  moveTask,
} = useTasks()

const { isDark, toggleTheme } = useTheme()

// 表单显示状态
const showForm = ref(false)
const editingTask = ref(null)

// 看板三列
const columns = [
  { status: 'todo', label: '待办' },
  { status: 'in-progress', label: '进行中' },
  { status: 'done', label: '完成' },
]

function tasksByStatus(status) {
  return tasks.value.filter((t) => t.status === status)
}

function openCreate() {
  editingTask.value = null
  showForm.value = true
}

function openEdit(task) {
  editingTask.value = { ...task }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingTask.value = null
}

function handleSubmit(data) {
  if (editingTask.value) {
    updateTask(editingTask.value.id, data)
  } else {
    createTask(data)
  }
  closeForm()
}

function handleDelete(id) {
  deleteTask(id)
}

// 拖拽：落在某个任务卡片上
function handleDropOnTask({ targetId, position }) {
  const targetTask = tasks.value.find((t) => t.id === targetId)
  if (!targetTask || !draggingId.value) return

  if (position === 'before') {
    moveTask(draggingId.value, targetTask.status, targetId)
  } else {
    // after: 插入到目标任务的下一个同列任务前
    const columnTasks = tasksByStatus(targetTask.status)
    const targetIndex = columnTasks.findIndex((t) => t.id === targetId)
    const nextTask = columnTasks[targetIndex + 1]
    moveTask(draggingId.value, targetTask.status, nextTask?.id || null)
  }
  endDrag()
}

// 拖拽：落在某个列的空白区
function handleDropOnColumn(status) {
  if (!draggingId.value) return
  moveTask(draggingId.value, status, null)
  endDrag()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
    <!-- Header -->
    <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Task Manager</h1>
        <div class="flex items-center gap-3">
          <!-- 深色模式切换 -->
          <button
            @click="toggleTheme"
            class="p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            title="切换主题"
          >
            <!-- 太阳图标（深色模式下显示） -->
            <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- 月亮图标（浅色模式下显示） -->
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
            </svg>
          </button>
          <!-- 新建任务 -->
          <button
            @click="openCreate"
            class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            + 新建任务
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- 表单（弹层） -->
      <div
        v-if="showForm"
        class="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm"
      >
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
          {{ editingTask ? '编辑任务' : '新建任务' }}
        </h2>
        <TaskForm :task="editingTask" @submit="handleSubmit" @cancel="closeForm" />
      </div>

      <!-- 看板三列 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskColumn
          v-for="col in columns"
          :key="col.status"
          :status="col.status"
          :tasks="tasksByStatus(col.status)"
          :dragging-id="draggingId"
          @edit="openEdit"
          @delete="handleDelete"
          @dragstart="startDrag($event.id)"
          @dragend="endDrag"
          @drop-on-task="handleDropOnTask"
          @drop-on-column="handleDropOnColumn"
        />
      </div>
    </main>
  </div>
</template>

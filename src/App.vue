<script setup>
import { ref, computed } from 'vue'
import { useTasks } from './composables/useTasks.js'
import TaskForm from './components/TaskForm.vue'
import TaskItem from './components/TaskItem.vue'

const { tasks, createTask, updateTask, deleteTask } = useTasks()

// 表单显示状态
const showForm = ref(false)
const editingTask = ref(null) // null=创建模式，对象=编辑模式

const statusFilter = ref('all')

const filteredTasks = computed(() => {
  if (statusFilter.value === 'all') return tasks.value
  return tasks.value.filter((t) => t.status === statusFilter.value)
})

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

const taskCount = computed(() => tasks.value.length)
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-800">Task Manager</h1>
        <button
          @click="openCreate"
          class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          + 新建任务
        </button>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-6">
      <!-- 筛选 -->
      <div class="flex items-center gap-2 mb-4">
        <button
          v-for="opt in [
            { value: 'all', label: '全部' },
            { value: 'todo', label: '待办' },
            { value: 'in-progress', label: '进行中' },
            { value: 'done', label: '完成' },
          ]"
          :key="opt.value"
          @click="statusFilter = opt.value"
          :class="[
            'px-3 py-1.5 text-sm rounded-full transition',
            statusFilter === opt.value
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100',
          ]"
        >
          {{ opt.label }}
        </button>
        <span class="ml-auto text-sm text-slate-400">{{ taskCount }} 项</span>
      </div>

      <!-- 表单（弹层） -->
      <div
        v-if="showForm"
        class="mb-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
      >
        <h2 class="text-sm font-semibold text-slate-700 mb-3">
          {{ editingTask ? '编辑任务' : '新建任务' }}
        </h2>
        <TaskForm :task="editingTask" @submit="handleSubmit" @cancel="closeForm" />
      </div>

      <!-- 任务列表 -->
      <div v-if="filteredTasks.length > 0" class="space-y-3">
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @edit="openEdit"
          @delete="handleDelete"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-16 text-slate-400">
        <p class="text-sm">暂无任务</p>
        <button
          @click="openCreate"
          class="mt-2 text-sm text-indigo-600 hover:underline"
        >
          创建第一个任务
        </button>
      </div>
    </main>
  </div>
</template>

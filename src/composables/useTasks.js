import { ref, watch } from 'vue'
import { loadTasks, saveTasks } from '../utils/storage.js'

export function useTasks() {
  const tasks = ref(loadTasks())

  // 深度监听，自动持久化到 localStorage
  watch(tasks, (newTasks) => {
    saveTasks(newTasks)
  }, { deep: true })

  function createTask(data) {
    const now = Date.now()
    const status = data.status || 'todo'
    const task = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      description: (data.description || '').trim(),
      status,
      priority: data.priority || 'medium',
      createdAt: now,
      updatedAt: now,
      completedAt: status === 'done' ? now : null,
    }
    tasks.value.push(task)
  }

  function updateTask(id, data) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index === -1) return
    const old = tasks.value[index]
    const newStatus = data.status || old.status
    tasks.value[index] = {
      ...old,
      title: data.title !== undefined ? data.title.trim() : old.title,
      description:
        data.description !== undefined
          ? (data.description || '').trim()
          : old.description,
      status: newStatus,
      priority: data.priority || old.priority,
      updatedAt: Date.now(),
      completedAt:
        newStatus === 'done'
          ? old.completedAt || Date.now()
          : null,
    }
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return { tasks, createTask, updateTask, deleteTask }
}

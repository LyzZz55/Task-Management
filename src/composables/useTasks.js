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

  // 拖拽状态（模块级共享）
  const draggingId = ref(null)

  function startDrag(id) {
    draggingId.value = id
  }

  function endDrag() {
    draggingId.value = null
  }

  function moveTask(draggedId, targetStatus, beforeTaskId) {
    const draggedIndex = tasks.value.findIndex((t) => t.id === draggedId)
    if (draggedIndex === -1) return
    const [draggedTask] = tasks.value.splice(draggedIndex, 1)

    // 更新状态
    if (draggedTask.status !== targetStatus) {
      draggedTask.status = targetStatus
      draggedTask.updatedAt = Date.now()
      draggedTask.completedAt =
        targetStatus === 'done'
          ? draggedTask.completedAt || Date.now()
          : null
    }

    // 插入到目标位置
    if (beforeTaskId) {
      const beforeIndex = tasks.value.findIndex((t) => t.id === beforeTaskId)
      if (beforeIndex !== -1) {
        tasks.value.splice(beforeIndex, 0, draggedTask)
      } else {
        tasks.value.push(draggedTask)
      }
    } else {
      tasks.value.push(draggedTask)
    }
  }

  return { tasks, createTask, updateTask, deleteTask, draggingId, startDrag, endDrag, moveTask }
}

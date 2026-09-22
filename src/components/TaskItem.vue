<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  task: { type: Object, required: true },
  isDragging: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'delete', 'dragstart', 'dragend', 'drop-on-task'])

const statusConfig = {
  todo: { label: '待办', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  'in-progress': { label: '进行中', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' },
  done: { label: '完成', color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300' },
}

const priorityConfig = {
  high: { label: '高', bar: 'border-l-red-500' },
  medium: { label: '中', bar: 'border-l-yellow-500' },
  low: { label: '低', bar: 'border-l-green-500' },
}

const statusInfo = computed(() => statusConfig[props.task.status])
const priorityInfo = computed(() => priorityConfig[props.task.priority])

// 拖拽插入位置指示
const dragPosition = ref(null) // 'before' | 'after' | null

function onDragStart(e) {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.task.id)
  emit('dragstart', props.task)
}

function onDragEnd() {
  dragPosition.value = null
  emit('dragend')
}

function onDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  const rect = e.currentTarget.getBoundingClientRect()
  const midpoint = rect.top + rect.height / 2
  dragPosition.value = e.clientY < midpoint ? 'before' : 'after'
}

function onDragLeave() {
  dragPosition.value = null
}

function onDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  const position = dragPosition.value
  dragPosition.value = null
  emit('drop-on-task', { targetId: props.task.id, position })
}
</script>

<template>
  <div
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing"
    :class="[
      priorityInfo.bar,
      isDragging && 'opacity-40',
      dragPosition === 'before' && 'border-t-2 border-t-indigo-400',
      dragPosition === 'after' && 'border-b-2 border-b-indigo-400',
    ]"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{{ task.title }}</h3>
        <p v-if="task.description" class="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{{ task.description }}</p>
      </div>
      <div class="flex gap-1 flex-shrink-0">
        <button
          @click="emit('edit', task)"
          class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition"
          title="编辑"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="emit('delete', task.id)"
          class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
          title="删除"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-2">
      <span class="px-2 py-0.5 text-xs font-medium rounded-full" :class="statusInfo.color">
        {{ statusInfo.label }}
      </span>
      <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
        {{ priorityInfo.label }}优先
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskItem from './TaskItem.vue'

const props = defineProps({
  status: { type: String, required: true },
  tasks: { type: Array, default: () => [] },
  draggingId: { type: String, default: null },
})

const emit = defineEmits([
  'edit',
  'delete',
  'dragstart',
  'dragend',
  'drop-on-task',
  'drop-on-column',
])

const isDragOver = ref(false)

const columnConfig = {
  todo: { label: '待办', accent: 'border-t-slate-400' },
  'in-progress': { label: '进行中', accent: 'border-t-blue-400' },
  done: { label: '完成', accent: 'border-t-green-400' },
}

const info = computed(() => columnConfig[props.status])

function onDragOver() {
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop() {
  isDragOver.value = false
  emit('drop-on-column', props.status)
}
</script>

<template>
  <div
    class="flex flex-col rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 border-t-4"
    :class="[info.accent, isDragOver && 'ring-2 ring-indigo-400 ring-offset-1 dark:ring-offset-slate-900']"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <!-- 列头 -->
    <div class="flex items-center justify-between px-4 py-3">
      <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {{ info.label }}
      </h2>
      <span class="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
        {{ tasks.length }}
      </span>
    </div>

    <!-- 卡片区域 -->
    <div class="flex-1 px-3 pb-3 space-y-2.5 min-h-[120px]">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :is-dragging="draggingId === task.id"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @dragstart="emit('dragstart', $event)"
        @dragend="emit('dragend', $event)"
        @drop-on-task="emit('drop-on-task', $event)"
      />

      <!-- 空列占位 -->
      <div
        v-if="tasks.length === 0"
        class="text-center py-8 text-sm text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg"
      >
        拖拽任务到此处
      </div>
    </div>
  </div>
</template>

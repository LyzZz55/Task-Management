<script setup>
import { ref, reactive, watch, computed } from 'vue'

const props = defineProps({
  task: { type: Object, default: null }, // 传入则为编辑模式
})

const emit = defineEmits(['submit', 'cancel'])

const isEdit = computed(() => !!props.task)

const form = reactive({
  title: props.task?.title || '',
  description: props.task?.description || '',
  status: props.task?.status || 'todo',
  priority: props.task?.priority || 'medium',
})

const error = ref('')

function handleSubmit() {
  if (!form.title.trim()) {
    error.value = '标题不能为空'
    return
  }
  error.value = ''
  emit('submit', { ...form })
}

// 切换 task 时重新填充表单
watch(
  () => props.task,
  (t) => {
    form.title = t?.title || ''
    form.description = t?.description || ''
    form.status = t?.status || 'todo'
    form.priority = t?.priority || 'medium'
    error.value = ''
  }
)
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-3">
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">标题 *</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="输入任务标题"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">描述</label>
      <textarea
        v-model="form.description"
        rows="2"
        placeholder="可选描述"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      ></textarea>
    </div>

    <div class="flex gap-4">
      <div class="flex-1">
        <label class="block text-sm font-medium text-slate-700 mb-1">状态</label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="todo">待办</option>
          <option value="in-progress">进行中</option>
          <option value="done">完成</option>
        </select>
      </div>
      <div class="flex-1">
        <label class="block text-sm font-medium text-slate-700 mb-1">优先级</label>
        <select
          v-model="form.priority"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-1">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
      >
        取消
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
      >
        {{ isEdit ? '保存' : '创建' }}
      </button>
    </div>
  </form>
</template>

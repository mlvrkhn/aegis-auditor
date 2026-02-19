<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircle, XCircle, Shield, Play } from 'lucide-vue-next'

declare global {
  interface Window {
    electronAPI: {
      runAudit: () => Promise<CheckResult[]>
    }
  }
}

interface CheckResult {
  id: string
  name: string
  category: string
  passed: boolean
  details: string
  weight: number
}

const results = ref<CheckResult[]>([])
const lastAudit = ref<Date | null>(null)
const loading = ref(false)

const totalWeight = 85

const runAudit = async () => {
  loading.value = true
  try {
    const data = await window.electronAPI.runAudit()
    results.value = data
    lastAudit.value = new Date()
  } catch (err) {
    alert('Audit failed – check console')
    console.error(err)
  }
  loading.value = false
}

const score = computed(() => {
  if (!results.value.length) return 0
  const earned = results.value.reduce((sum, r) => sum + (r.passed ? r.weight : 0), 0)
  return Math.round((earned / totalWeight) * 100)
})

const getScoreColor = (s: number) => {
  if (s >= 90) return 'text-emerald-500'
  if (s >= 70) return 'text-amber-500'
  return 'text-red-500'
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-10">
        <div class="flex items-center gap-4">
          <Shield class="w-10 h-10 text-emerald-500" />
          <div>
            <h1 class="text-4xl font-semibold tracking-tight">Aegis Auditor</h1>
            <p class="text-zinc-400">macOS Security Posture Dashboard</p>
          </div>
        </div>
        <button
          @click="runAudit"
          :disabled="loading"
          class="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-2xl font-medium transition disabled:opacity-50"
        >
          <Play class="w-5 h-5" />
          {{ loading ? 'Running Audit...' : 'Run Full Audit' }}
        </button>
      </div>

      <!-- Score -->
      <div v-if="results.length > 0" class="flex flex-col items-center mb-12">
        <div :class="['text-[120px] font-bold tabular-nums leading-none', getScoreColor(score)]">
          {{ score }}
        </div>
        <p class="text-2xl -mt-4 text-zinc-400">Security Score</p>
        <p v-if="lastAudit" class="text-sm text-zinc-500 mt-2">
          Last audit: {{ lastAudit.toLocaleString() }}
        </p>
      </div>

      <!-- Results Grid -->
      <div v-if="results.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="check in results"
          :key="check.id"
          class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="text-sm text-zinc-500">{{ check.category }}</div>
              <h3 class="font-medium mt-1 text-lg">{{ check.name }}</h3>
            </div>
            <component
              :is="check.passed ? CheckCircle : XCircle"
              class="w-8 h-8 flex-shrink-0"
              :class="check.passed ? 'text-emerald-500' : 'text-red-500'"
            />
          </div>
          <div class="mt-4 text-sm text-zinc-400 font-mono bg-zinc-950 p-3 rounded-2xl">
            {{ check.details }}
          </div>
        </div>
      </div>

      <div v-if="!results.length && !loading" class="text-center py-24 text-zinc-500">
        Click “Run Full Audit” to begin
      </div>
    </div>
  </div>
</template>

<style scoped></style>
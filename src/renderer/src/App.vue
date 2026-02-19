<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircle, XCircle, Shield, Play } from 'lucide-vue-next'
import type { CheckResult } from './vite-env'

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
    console.error(err)
  } finally {
    loading.value = false
  }
}

const score = computed(() => {
  if (!results.value.length) return 0
  const earned = results.value.reduce((sum, r) => sum + (r.passed ? r.weight : 0), 0)
  return Math.round((earned / totalWeight) * 100)
})

const getScoreColor = (s: number) => {
  if (s >= 90) return 'text-emerald-400'
  if (s >= 70) return 'text-amber-400'
  return 'text-red-400'
}

const passedCount = computed(() => results.value.filter(r => r.passed).length)
const failedCount = computed(() => results.value.filter(r => !r.passed).length)

const formatDate = (date: Date | null) =>
  date ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date) : ''
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white flex flex-col">
    <!-- header -->
    <header class="border-b border-zinc-800 px-6 py-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Shield class="w-5 h-5 text-emerald-400" />
          <div>
            <div class="font-semibold">Aegis Auditor</div>
            <div class="text-xs text-zinc-400">Security Assessment</div>
          </div>
        </div>

        <button
          @click="runAudit"
          :disabled="loading"
          class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium flex items-center gap-2"
        >
          <Play class="w-4 h-4" />
          {{ loading ? 'Running...' : 'Run Audit' }}
        </button>
      </div>
    </header>

    <!-- content -->
    <main class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-4xl">
        <!-- empty state -->
        <div v-if="results.length === 0" class="text-center">
          <h1 class="text-3xl font-bold mb-3">Welcome to Aegis</h1>
          <p class="text-zinc-400 mb-8 max-w-xl mx-auto">
            Run a security audit to identify vulnerabilities and misconfigurations.
          </p>
          <button
            @click="runAudit"
            :disabled="loading"
            class="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-md font-medium"
          >
            Start Audit
          </button>
        </div>

        <!-- results -->
        <div v-else class="space-y-6">
          <!-- score -->
          <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
            <div class="flex items-end justify-between mb-6">
              <div>
                <div class="text-xs text-zinc-400 uppercase tracking-wide mb-2">Score</div>
                <div :class="['text-6xl font-bold', getScoreColor(score)]">{{ score }}%</div>
              </div>
              <div class="flex gap-8 text-right">
                <div>
                  <div class="text-xs text-zinc-400">Passed</div>
                  <div class="text-2xl font-bold text-emerald-400">{{ passedCount }}</div>
                </div>
                <div>
                  <div class="text-xs text-zinc-400">Failed</div>
                  <div class="text-2xl font-bold text-red-400">{{ failedCount }}</div>
                </div>
              </div>
            </div>
            <div v-if="lastAudit" class="text-xs text-zinc-400">
              Last audit: {{ formatDate(lastAudit) }}
            </div>
          </div>

          <!-- results list -->
          <div>
            <h2 class="text-lg font-semibold mb-4">Results</h2>
            <div class="space-y-2 bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
              <div
                v-for="result in results"
                :key="result.name"
                class="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="flex-shrink-0">
                    <CheckCircle v-if="result.passed" class="w-5 h-5 text-emerald-400" />
                    <XCircle v-else class="w-5 h-5 text-red-400" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-medium truncate">{{ result.name }}</div>
                  </div>
                </div>

                <span :class="['text-xs font-semibold px-3 py-1 rounded-md flex-shrink-0', result.passed ? 'bg-emerald-600/20 text-emerald-300' : 'bg-red-600/20 text-red-300']">
                  {{ result.weight }} pts
                </span>
              </div>
            </div>
          </div>

          <!-- re-run button -->
          <div class="flex justify-center">
            <button
              @click="runAudit"
              :disabled="loading"
              class="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm font-medium"
            >
              Run Again
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
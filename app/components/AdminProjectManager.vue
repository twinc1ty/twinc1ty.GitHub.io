<script setup lang="ts">
interface ProjectRepo {
  owner: string
  name: string
  description: string
  stars: number
  language: string
  url: string
}

interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  language: string | null
  html_url: string
}

const { fetchUserRepos, getProjectsJson, commitProjectsJson } = useGithubApi()

const allRepos = ref<GitHubRepo[]>([])
const selectedRepos = ref<ProjectRepo[]>([])
const fileSha = ref('')
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const saveStatus = ref<'idle' | 'success' | 'error'>('idle')

const filteredRepos = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return allRepos.value.filter(
    r =>
      r.name.toLowerCase().includes(q) &&
      !selectedRepos.value.some(s => s.name === r.name)
  )
})

async function load() {
  loading.value = true
  try {
    const [repos, projects] = await Promise.all([
      fetchUserRepos(),
      getProjectsJson(),
    ])
    allRepos.value = repos
    selectedRepos.value = projects.repos
    fileSha.value = projects.sha
  } catch (e) {
    console.error('Failed to load data:', e)
  }
  loading.value = false
}

function addRepo(repo: GitHubRepo) {
  selectedRepos.value.push({
    owner: repo.full_name.split('/')[0],
    name: repo.name,
    description: repo.description || '',
    stars: repo.stargazers_count,
    language: repo.language || '',
    url: repo.html_url,
  })
}

function removeRepo(index: number) {
  selectedRepos.value.splice(index, 1)
}

function moveUp(index: number) {
  if (index === 0) return
  const item = selectedRepos.value.splice(index, 1)[0]
  selectedRepos.value.splice(index - 1, 0, item)
}

function moveDown(index: number) {
  if (index >= selectedRepos.value.length - 1) return
  const item = selectedRepos.value.splice(index, 1)[0]
  selectedRepos.value.splice(index + 1, 0, item)
}

async function save() {
  saving.value = true
  saveStatus.value = 'idle'
  try {
    const success = await commitProjectsJson(selectedRepos.value, fileSha.value)
    saveStatus.value = success ? 'success' : 'error'
    if (success) {
      // Refresh SHA after successful commit
      const updated = await getProjectsJson()
      fileSha.value = updated.sha
    }
  } catch {
    saveStatus.value = 'error'
  }
  saving.value = false
  setTimeout(() => { saveStatus.value = 'idle' }, 3000)
}

onMounted(load)
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-12">
      <p class="text-cyber-subtle font-mono animate-pulse">Loading repos...</p>
    </div>

    <div v-else class="space-y-8">
      <!-- Selected repos -->
      <div>
        <h3 class="font-mono text-lg text-cyber-text mb-4">
          Selected Projects ({{ selectedRepos.length }})
        </h3>

        <div v-if="selectedRepos.length" class="space-y-2">
          <div
            v-for="(repo, i) in selectedRepos"
            :key="repo.name"
            class="flex items-center gap-3 p-3 glass-panel"
          >
            <div class="flex flex-col gap-1">
              <button
                class="text-cyber-subtle hover:text-cyber-accent text-xs"
                :disabled="i === 0"
                @click="moveUp(i)"
              >
                &#9650;
              </button>
              <button
                class="text-cyber-subtle hover:text-cyber-accent text-xs"
                :disabled="i === selectedRepos.length - 1"
                @click="moveDown(i)"
              >
                &#9660;
              </button>
            </div>

            <div class="flex-1 min-w-0">
              <p class="font-mono text-sm text-cyber-text truncate">{{ repo.name }}</p>
              <p class="text-xs text-cyber-subtle truncate">{{ repo.description }}</p>
            </div>

            <span v-if="repo.language" class="text-xs font-mono text-cyber-subtle">
              {{ repo.language }}
            </span>

            <button
              class="text-cyber-subtle hover:text-red-400 text-sm font-mono"
              @click="removeRepo(i)"
            >
              Remove
            </button>
          </div>
        </div>

        <p v-else class="text-cyber-subtle text-sm font-mono">
          No projects selected. Add repos from the list below.
        </p>
      </div>

      <!-- Save button -->
      <div class="flex items-center gap-4">
        <button
          class="px-6 py-3 bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent font-mono text-sm rounded hover:bg-cyber-accent/20 transition-all disabled:opacity-50"
          :disabled="saving"
          @click="save"
        >
          {{ saving ? 'Saving...' : 'Save & Deploy' }}
        </button>
        <span
          v-if="saveStatus === 'success'"
          class="text-sm font-mono text-green-400"
        >
          Saved! Site will rebuild shortly.
        </span>
        <span
          v-if="saveStatus === 'error'"
          class="text-sm font-mono text-red-400"
        >
          Failed to save. Check your permissions.
        </span>
      </div>

      <!-- Available repos -->
      <div>
        <h3 class="font-mono text-lg text-cyber-text mb-4">Available Repos</h3>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search repos..."
          class="w-full px-4 py-2 mb-4 bg-cyber-surface border border-cyber-accent/20 rounded text-sm font-mono text-cyber-text focus:outline-none focus:border-cyber-accent/50"
        >

        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="repo in filteredRepos"
            :key="repo.name"
            class="flex items-center gap-3 p-3 glass-panel cursor-pointer hover:border-cyber-accent/30 transition-all"
            @click="addRepo(repo)"
          >
            <div class="flex-1 min-w-0">
              <p class="font-mono text-sm text-cyber-text-dim truncate">{{ repo.name }}</p>
              <p class="text-xs text-cyber-subtle truncate">{{ repo.description }}</p>
            </div>
            <span v-if="repo.language" class="text-xs font-mono text-cyber-subtle">
              {{ repo.language }}
            </span>
            <span class="text-xs text-cyber-accent font-mono">+ Add</span>
          </div>
        </div>

        <p v-if="!filteredRepos.length" class="text-cyber-subtle text-sm font-mono py-4 text-center">
          {{ searchQuery ? 'No matching repos found.' : 'All repos are already selected.' }}
        </p>
      </div>
    </div>
  </div>
</template>

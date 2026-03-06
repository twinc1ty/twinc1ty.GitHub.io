<script setup lang="ts">
const { isAuthenticated, user, loginWithDeviceFlow, setToken, logout } = useGithubAuth()

const manualToken = ref('')
const showManualInput = ref(false)

function submitManualToken() {
  if (manualToken.value.trim()) {
    setToken(manualToken.value.trim())
    manualToken.value = ''
    showManualInput.value = false
  }
}
</script>

<template>
  <div>
    <div v-if="isAuthenticated" class="flex items-center gap-4">
      <img
        v-if="user?.avatar_url"
        :src="user.avatar_url"
        :alt="user.login"
        class="w-8 h-8 rounded-full border border-cyber-accent/30"
      >
      <span class="font-mono text-sm text-cyber-text">{{ user?.login }}</span>
      <button
        class="text-xs font-mono text-cyber-subtle hover:text-red-400 transition-colors"
        @click="logout"
      >
        Logout
      </button>
    </div>

    <div v-else class="space-y-4">
      <p class="text-cyber-muted text-sm">
        Authenticate with GitHub to manage your projects.
      </p>

      <div class="flex flex-col gap-3">
        <button
          class="px-6 py-3 bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent font-mono text-sm rounded hover:bg-cyber-accent/20 transition-all"
          @click="loginWithDeviceFlow"
        >
          Login with GitHub
        </button>

        <button
          class="text-xs font-mono text-cyber-subtle hover:text-cyber-muted transition-colors"
          @click="showManualInput = !showManualInput"
        >
          Or enter a personal access token manually
        </button>

        <div v-if="showManualInput" class="flex gap-2">
          <input
            v-model="manualToken"
            type="password"
            placeholder="ghp_..."
            class="flex-1 px-3 py-2 bg-cyber-surface border border-cyber-accent/20 rounded text-sm font-mono text-cyber-text focus:outline-none focus:border-cyber-accent/50"
            @keyup.enter="submitManualToken"
          >
          <button
            class="px-4 py-2 bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent font-mono text-sm rounded hover:bg-cyber-accent/20 transition-all"
            @click="submitManualToken"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

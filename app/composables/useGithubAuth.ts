// todo: Move client ID to env variable and update in GitHub OAuth app settings and update with actual client id
const GITHUB_CLIENT_ID = 'GITHUB_CLIENT_ID' 
const TOKEN_KEY = 'gh_token'
const USER_KEY = 'gh_user'

interface GitHubUser {
  login: string
  avatar_url: string
  name: string
}

export function useGithubAuth() {
  const token = useState<string | null>('gh_token', () => null)
  const user = useState<GitHubUser | null>('gh_user', () => null)
  const isAuthenticated = computed(() => !!token.value)

  function loadFromStorage() {
    if (import.meta.client) {
      token.value = localStorage.getItem(TOKEN_KEY)
      const savedUser = localStorage.getItem(USER_KEY)
      if (savedUser) {
        user.value = JSON.parse(savedUser)
      }
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      if (res.ok) {
        const data = await res.json()
        user.value = { login: data.login, avatar_url: data.avatar_url, name: data.name }
        if (import.meta.client) {
          localStorage.setItem(USER_KEY, JSON.stringify(user.value))
        }
      } else {
        logout()
      }
    } catch {
      logout()
    }
  }

  function loginWithDeviceFlow() {
    const scopes = 'repo'
    const redirectUri = `${window.location.origin}/admin`
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`
  }

  function setToken(newToken: string) {
    token.value = newToken
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, newToken)
    }
    fetchUser()
  }

  function logout() {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  // Auto-load on init
  loadFromStorage()

  return {
    token,
    user,
    isAuthenticated,
    loginWithDeviceFlow,
    setToken,
    logout,
    fetchUser,
  }
}

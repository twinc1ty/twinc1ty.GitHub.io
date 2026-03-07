const REPO_OWNER = 'twinc1ty'
const REPO_NAME = 'twinc1ty.GitHub.io' // Update if repo is renamed
const PROJECTS_PATH = 'public/data/projects.json'

interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  language: string | null
  html_url: string
  fork: boolean
}

interface ProjectRepo {
  owner: string
  name: string
  description: string
  stars: number
  language: string
  url: string
}

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
}

function fromBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64)))
}

export function useGithubApi() {
  const { token } = useGithubAuth()

  function headers() {
    return {
      Authorization: `Bearer ${token.value}`,
      Accept: 'application/vnd.github.v3+json',
    }
  }

  async function fetchUserRepos(): Promise<GitHubRepo[]> {
    const allRepos: GitHubRepo[] = []
    let page = 1
    const perPage = 100

    while (true) {
      const res = await fetch(
        `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=updated&affiliation=owner`,
        { headers: headers() }
      )
      if (!res.ok) break
      const repos: GitHubRepo[] = await res.json()
      allRepos.push(...repos.filter(r => !r.fork))
      if (repos.length < perPage) break
      page++
    }

    return allRepos
  }

  async function getProjectsJson(): Promise<{ repos: ProjectRepo[]; sha: string }> {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PROJECTS_PATH}`,
      { headers: headers() }
    )

    if (!res.ok) {
      return { repos: [], sha: '' }
    }

    const data = await res.json()
    try {
      const content = JSON.parse(fromBase64(data.content))
      return { repos: content.repos || [], sha: data.sha }
    } catch {
      // Malformed JSON in projects.json — treat as empty
      return { repos: [], sha: data.sha }
    }
  }

  async function commitProjectsJson(repos: ProjectRepo[], sha: string): Promise<boolean> {
    const content = toBase64(JSON.stringify({ repos }, null, 2))

    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PROJECTS_PATH}`,
      {
        method: 'PUT',
        headers: { ...headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Update projects list via admin panel',
          content,
          sha,
        }),
      }
    )

    return res.ok
  }

  return {
    fetchUserRepos,
    getProjectsJson,
    commitProjectsJson,
  }
}

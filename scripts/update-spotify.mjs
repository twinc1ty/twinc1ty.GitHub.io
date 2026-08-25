import { writeFile } from 'node:fs/promises'

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
  console.error('Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REFRESH_TOKEN in environment')
  process.exit(1)
}

async function getAccessToken() {
  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  })
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.access_token
}

async function getCurrentlyPlaying(token) {
  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 204) return null
  if (!res.ok) throw new Error(`Currently-playing request failed: ${res.status}`)
  const data = await res.json()
  if (!data || !data.item) return null
  return {
    isPlaying: Boolean(data.is_playing),
    title: data.item.name,
    artist: data.item.artists.map(a => a.name).join(', '),
    albumArt: data.item.album?.images?.[0]?.url ?? null,
    trackUrl: data.item.external_urls?.spotify ?? null,
    playedAt: null,
  }
}

async function getLastPlayed(token) {
  const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Recently-played request failed: ${res.status}`)
  const data = await res.json()
  const item = data.items?.[0]
  if (!item) return null
  return {
    isPlaying: false,
    title: item.track.name,
    artist: item.track.artists.map(a => a.name).join(', '),
    albumArt: item.track.album?.images?.[0]?.url ?? null,
    trackUrl: item.track.external_urls?.spotify ?? null,
    playedAt: item.played_at,
  }
}

const token = await getAccessToken()
let result = await getCurrentlyPlaying(token)
if (!result) result = await getLastPlayed(token)

if (!result) {
  result = {
    isPlaying: false,
    title: 'Nothing played recently',
    artist: 'twinc1ty',
    albumArt: null,
    trackUrl: null,
    playedAt: null,
  }
}

await writeFile('public/data/spotify.json', `${JSON.stringify(result, null, 2)}\n`)
console.log('Updated spotify.json:', result)

export const DAILY_WORD_COUNT = 10
export const REVIEW_TARGET = 5
export const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30]

export function getVocabUserKey() {
  const user = uni.getStorageSync('userInfo') || uni.getStorageSync('adminInfo') || {}
  return `legal_vocab_${user.account || 'guest'}`
}

export function getProgressKey() {
  return `${getVocabUserKey()}_progress`
}

export function getDailyPlanKey(dateKey) {
  return `${getVocabUserKey()}_plan_${dateKey}`
}

export function loadVocabProgress() {
  try {
    return uni.getStorageSync(getProgressKey()) || {}
  } catch (e) {
    return {}
  }
}

export function saveVocabProgress(progress) {
  try {
    uni.setStorageSync(getProgressKey(), progress)
  } catch (e) {}
}

export function loadDailyPlan(dateKey) {
  try {
    const plan = uni.getStorageSync(getDailyPlanKey(dateKey))
    return plan && Array.isArray(plan.ids) ? plan.ids : []
  } catch (e) {
    return []
  }
}

export function saveDailyPlan(dateKey, ids) {
  try {
    uni.setStorageSync(getDailyPlanKey(dateKey), { date: dateKey, ids })
  } catch (e) {}
}

export function getDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function hashString(input) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function mulberry32(seed) {
  let state = seed >>> 0
  return function () {
    state = (state + 0x6D2B79F5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seededShuffle(items, seed) {
  const arr = [...items]
  const random = mulberry32(seed)
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

export function mapWord(doc) {
  return {
    id: doc._id,
    en: doc.title || '',
    phonetic: doc.meta || '',
    cn: doc.description || '暂无释义',
    level: doc.meta || ''
  }
}

export function isLearned(progress) {
  return !!progress && !!progress.learnedAt
}

export function isDueReview(progress, now = Date.now()) {
  return isLearned(progress) && !!progress.reviewAt && progress.reviewAt <= now
}

export function isStarred(progress) {
  return !!progress && !!progress.starred
}

export function buildTodayWordIds(pool, progressMap, date = new Date()) {
  const now = Date.now()
  const dateKey = getDateKey(date)
  const savedPlan = loadDailyPlan(dateKey)
  if (savedPlan.length) {
    const poolMap = new Map(pool.map(w => [w.id, w]))
    const planned = savedPlan.map(id => poolMap.get(id)).filter(Boolean).map(w => w.id)
    if (planned.length) return { ids: planned, dateKey }
  }

  const dueWords = seededShuffle(pool.filter(w => isDueReview(progressMap[w.id], now)), hashString(`review:${dateKey}`))
  const newWords = seededShuffle(pool.filter(w => !isLearned(progressMap[w.id])), hashString(`new:${dateKey}`))
  const selected = []
  selected.push(...dueWords.slice(0, REVIEW_TARGET))
  let need = DAILY_WORD_COUNT - selected.length
  if (need > 0) selected.push(...newWords.slice(0, need))

  need = DAILY_WORD_COUNT - selected.length
  if (need > 0) {
    const usedIds = new Set(selected.map(w => w.id))
    const rest = seededShuffle(pool.filter(w => !usedIds.has(w.id)), hashString(`fill:${dateKey}`))
    selected.push(...rest.slice(0, need))
  }

  const ids = selected.map(w => w.id)
  saveDailyPlan(dateKey, ids)
  return { ids, dateKey }
}

export function getVocabStats(pool, progressMap, now = Date.now()) {
  return {
    total: pool.length,
    review: pool.filter(w => isDueReview(progressMap[w.id], now)).length,
    unlearned: pool.filter(w => !isLearned(progressMap[w.id])).length,
    starred: pool.filter(w => isStarred(progressMap[w.id])).length
  }
}

export function markWordProgress(progressMap, word, known) {
  const now = Date.now()
  const prev = progressMap[word.id] || {}
  const correctCount = known ? (prev.correctCount || 0) + 1 : (prev.correctCount || 0)
  const wrongCount = known ? (prev.wrongCount || 0) : (prev.wrongCount || 0) + 1
  const intervalIndex = Math.min(correctCount - 1, REVIEW_INTERVALS.length - 1)
  const reviewAt = known
    ? now + REVIEW_INTERVALS[intervalIndex] * 24 * 60 * 60 * 1000
    : now

  return {
    ...progressMap,
    [word.id]: {
      ...prev,
      correctCount,
      wrongCount,
      reviewCount: (prev.reviewCount || 0) + 1,
      lastResult: known ? 'known' : 'unknown',
      learnedAt: prev.learnedAt || now,
      reviewAt,
      updatedAt: now
    }
  }
}

export function toggleWordStar(progressMap, word) {
  const prev = progressMap[word.id] || {}
  return {
    ...progressMap,
    [word.id]: {
      ...prev,
      starred: !prev.starred,
      updatedAt: Date.now()
    }
  }
}

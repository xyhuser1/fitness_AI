<template>
  <button class="back-btn" @click="goBack">‹ 返回</button>
  <div class="fitness-checkin-wrapper">
    <div class="app-container">
      <!-- 头部卡片 -->
      <div class="header-card">
        <div class="header-top">
          <div class="app-title">
            <span class="icon">💪</span>减脂小助手
          </div>
          <div class="date-display">
            <span>{{ dateFull }}</span><br />
            <span class="weekday">{{ weekdayDisplay }}</span>
          </div>
        </div>

        <div class="streak-badge" :class="{ fire: streak >= 7 }">
          <span class="flame">🔥</span>
          <span class="streak-num">{{ streak }}</span>
          <span class="streak-label">连续<br />打卡</span>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span>今日进度</span>
            <span class="percent" :class="{ complete: isTodayPerfect }">
              {{ completedCount }}/{{ TOTAL_ITEMS }}
            </span>
          </div>
          <div class="progress-bar-outer">
            <div
              class="progress-bar-inner"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 打卡项目 -->
      <div class="checkin-grid">
        <div
          v-for="item in CHECKIN_ITEMS"
          :key="item.id"
          class="checkin-item"
          :class="{ checked: todayData[item.id] }"
          @click="toggleCheckin(item.id)"
        >
          <div class="check-mark">{{ todayData[item.id] ? "✓" : "" }}</div>
          <span class="item-icon">{{ item.icon }}</span>
          <span class="item-name">{{ item.name }}</span>
        </div>
      </div>

      <!-- 日历 -->
      <div class="calendar-card">
        <div class="calendar-title">📅 最近14天打卡记录</div>
        <div class="calendar-row">
          <div
            v-for="(day, idx) in recent14Days"
            :key="idx"
            class="calendar-day"
          >
            <div
              class="day-dot"
              :class="[day.level, day.isToday ? 'today-ring' : '']"
            >
              {{ day.char }}
            </div>
            <span class="day-label">{{ day.label }}</span>
          </div>
        </div>
      </div>

      <!-- 统计 -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-num">{{ weekStats.weekCheckinDays }}</div>
          <div class="stat-label">本周打卡天数</div>
        </div>
        <div class="stat-card">
          <div class="stat-num gold">{{ weekStats.weekPerfectDays }}</div>
          <div class="stat-label">本周全勤⭐</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">{{ totalDays }}</div>
          <div class="stat-label">累计打卡天数</div>
        </div>
      </div>

      <!-- 激励语 -->
      <div class="motivation-bar">
        <span class="quote-icon">{{ motivation.icon }}</span>
        {{ motivation.text }}
      </div>

      <!-- 重置 -->
      <div class="footer-reset">
        <button class="reset-btn" @click="resetAllData">重置数据</button>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastShow" class="toast" :class="{ celebrate: toastCelebrate }">
      {{ toastMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const BASE_URL = 'http://localhost:8080/api/checkin';
const USER_ID = 1;

const CHECKIN_ITEMS = ref([
  { id: "exercise", name: "运动 30 分钟", icon: "🏃" },
  { id: "diet", name: "健康饮食", icon: "🥗" },
  { id: "water", name: "饮水 2L", icon: "💧" },
  { id: "sleep", name: "早睡 (23:00前)", icon: "😴" },
  { id: "nosnack", name: "不吃零食", icon: "🚫" },
  { id: "weight_log", name: "记录体重", icon: "📝" },
])
const TOTAL_ITEMS = CHECKIN_ITEMS.value.length

const allData = ref({})
const todayData = ref({})
const dateFull = ref("")
const weekdayDisplay = ref("")
const streak = ref(0)
const completedCount = ref(0)
const progressPercent = ref(0)
const recent14Days = ref([])
const weekStats = ref({ weekCheckinDays: 0, weekPerfectDays: 0 })
const totalDays = ref(0)
const motivation = ref({ icon: "✨", text: "" })

const toastShow = ref(false)
const toastMsg = ref("")
const toastCelebrate = ref(false)
let toastTimer = null

const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
})

const isTodayPerfect = computed(() => completedCount.value >= TOTAL_ITEMS)

function getDateStr(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function formatDateChinese(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"]
  return {
    full: `${y}年${m}月${d}日`,
    weekday: `星期${weekdays[date.getDay()]}`,
    monthDay: `${m}/${d}`
  }
}

async function loadAllData() {
  try {
    const res = await axios.get(BASE_URL + '/recent', {
      params: { userId: USER_ID, days: 30 }
    })
    if (res.data.code === 200) {
      const list = res.data.data || []
      const data = {}
      list.forEach(item => {
        data[item.checkinDate] = {
          exercise: item.exercise,
          diet: item.diet,
          water: item.water,
          sleep: item.sleep,
          nosnack: item.nosnack,
          weight_log: item.weightLog
        }
      })
      allData.value = data
    }
  } catch (e) {
    console.error('加载打卡数据失败', e)
  }
}

async function saveToBackend(dateStr, dayData) {
  try {
    await axios.post(BASE_URL + '/save', {
      userId: USER_ID,
      checkinDate: dateStr,
      exercise: dayData.exercise || false,
      diet: dayData.diet || false,
      water: dayData.water || false,
      sleep: dayData.sleep || false,
      nosnack: dayData.nosnack || false,
      weightLog: dayData.weight_log || false
    })
  } catch (e) {
    console.error('保存打卡失败', e)
  }
}

function getDayData(dateStr) {
  return allData.value[dateStr] || {}
}

function getCompletedCount(dateStr) {
  const d = getDayData(dateStr)
  return CHECKIN_ITEMS.value.filter(i => d[i.id]).length
}

function hasAnyCheckin(dateStr) {
  return getCompletedCount(dateStr) > 0
}

function calculateStreak() {
  let s = hasAnyCheckin(todayStr.value) ? 1 : 0
  const check = new Date(todayStr.value)
  check.setDate(check.getDate() - 1)
  while (hasAnyCheckin(getDateStr(check))) {
    s++
    check.setDate(check.getDate() - 1)
  }
  return s
}

async function renderAll() {
  await loadAllData()

  const { full, weekday } = formatDateChinese(todayStr.value)
  dateFull.value = full
  weekdayDisplay.value = weekday

  todayData.value = getDayData(todayStr.value)
  completedCount.value = getCompletedCount(todayStr.value)
  progressPercent.value = Math.round((completedCount.value / TOTAL_ITEMS) * 100)
  streak.value = calculateStreak()

  const days = []
  const today = new Date(todayStr.value)
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const ds = getDateStr(d)
    const c = getCompletedCount(ds)
    let level = "level-0", char = "·"
    if (c >= TOTAL_ITEMS) { level = "level-3"; char = "⭐" }
    else if (c >= 4) { level = "level-2"; char = "●" }
    else if (c >= 1) { level = "level-1"; char = "●" }
    days.push({
      level, char,
      isToday: ds === todayStr.value,
      label: ds === todayStr.value ? "今天" : formatDateChinese(ds).monthDay
    })
  }
  recent14Days.value = days

  const todayDate = new Date(todayStr.value)
  const dayOfWeek = todayDate.getDay() || 7
  let weekCheckinDays = 0, weekPerfectDays = 0
  for (let i = 1; i <= 7; i++) {
    const d = new Date(todayDate)
    d.setDate(todayDate.getDate() - dayOfWeek + i)
    const ds = getDateStr(d)
    if (ds > todayStr.value) break
    if (hasAnyCheckin(ds)) weekCheckinDays++
    if (getCompletedCount(ds) >= TOTAL_ITEMS) weekPerfectDays++
  }
  weekStats.value = { weekCheckinDays, weekPerfectDays }

  totalDays.value = Object.keys(allData.value).filter(d => hasAnyCheckin(d)).length

  const quotes = [
    { icon: "💪", text: "坚持就是胜利！" },
    { icon: "🔥", text: "连续打卡，习惯养成！" },
    { icon: "⭐", text: "今天的努力，明天的收获！" },
    { icon: "🌈", text: "每一天都在变好！" },
    { icon: "🎯", text: "目标明确，行动坚定！" }
  ]
  motivation.value = quotes[Math.floor(Math.random() * quotes.length)]
}

async function toggleCheckin(id) {
  const data = { ...todayData.value }
  data[id] = !data[id]
  todayData.value = data
  allData.value[todayStr.value] = data

  await saveToBackend(todayStr.value, data)
  await renderAll()
  showToast(data[id] ? "打卡成功！✅" : "已取消打卡")
}

function showToast(msg, celebrate = false) {
  if (toastTimer) clearTimeout(toastTimer)
  toastMsg.value = msg
  toastCelebrate.value = celebrate
  toastShow.value = true
  toastTimer = setTimeout(() => toastShow.value = false, 1800)
}

async function resetAllData() {
  if (confirm("确定清空所有数据？")) {
    allData.value = {}
    await renderAll()
    showToast("数据已重置")
  }
}

function goBack() {
  router.back();
}

onMounted(() => {
  renderAll()
})
</script>

<style scoped>
.fitness-checkin-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  padding-bottom: 40px;
  position: relative;
}

.app-container {
  max-width: 420px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #ff6b6b;
  cursor: pointer;
  padding: 8px 0;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

/* 头部卡片 */
.header-card {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.app-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.app-title .icon {
  margin-right: 6px;
}

.date-display {
  text-align: right;
  color: rgba(255,255,255,0.9);
  font-size: 14px;
}

.weekday {
  font-size: 12px;
  opacity: 0.8;
}

.streak-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 16px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 15px rgba(245,87,108,0.4);
}

.streak-badge.fire {
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
  box-shadow: 0 4px 15px rgba(241,39,17,0.4);
}

.flame {
  font-size: 18px;
}

.streak-num {
  font-size: 24px;
  font-weight: 800;
  color: white;
}

.streak-label {
  font-size: 10px;
  color: rgba(255,255,255,0.9);
  line-height: 1.3;
}

.progress-section {
  margin-top: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: rgba(255,255,255,0.9);
  font-size: 13px;
}

.percent {
  font-weight: 600;
}

.percent.complete {
  color: #4ade80;
}

.progress-bar-outer {
  height: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22d3ee);
  border-radius: 10px;
  transition: width 0.5s;
}

/* 打卡项目 */
.checkin-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.checkin-item {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(5px);
  border-radius: 16px;
  padding: 16px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.checkin-item:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.checkin-item.checked {
  background: rgba(74,222,128,0.2);
  border: 2px solid rgba(74,222,128,0.5);
}

.check-mark {
  position: absolute;
  top: 6px;
  right: 8px;
  color: #4ade80;
  font-size: 16px;
  font-weight: bold;
}

.item-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 6px;
}

.item-name {
  font-size: 12px;
  color: rgba(255,255,255,0.9);
}

/* 日历 */
.calendar-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(5px);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.calendar-title {
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  margin-bottom: 12px;
}

.calendar-row {
  display: flex;
  justify-content: space-between;
}

.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.day-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}

.level-0 { background: rgba(255,255,255,0.1); }
.level-1 { background: rgba(74,222,128,0.3); color: #4ade80; }
.level-2 { background: rgba(74,222,128,0.5); color: white; }
.level-3 { background: rgba(74,222,128,0.8); color: white; }

.today-ring {
  box-shadow: 0 0 0 2px #4ade80;
}

.day-label {
  font-size: 10px;
  color: rgba(255,255,255,0.6);
}

/* 统计 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.stat-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(5px);
  border-radius: 14px;
  padding: 14px 8px;
  text-align: center;
}

.stat-num {
  font-size: 28px;
  font-weight: 800;
  color: white;
}

.stat-num.gold {
  color: #fbbf24;
}

.stat-label {
  font-size: 11px;
  color: rgba(255,255,255,0.7);
  margin-top: 4px;
}

/* 激励语 */
.motivation-bar {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(5px);
  border-radius: 14px;
  padding: 14px 16px;
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
}

.quote-icon {
  margin-right: 6px;
}

/* 重置 */
.footer-reset {
  text-align: center;
}

.reset-btn {
  background: rgba(255,255,255,0.15);
  border: none;
  color: rgba(255,255,255,0.7);
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(255,255,255,0.25);
  color: white;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 1000;
}

.toast.celebrate {
  background: linear-gradient(135deg, #4ade80, #22d3ee);
}
</style>

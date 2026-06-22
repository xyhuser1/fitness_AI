<template>
  <button class="back-btn" @click="goBack">‹ 返回</button>
  <div class="exercise-wrapper">
    <div class="exercise-app-container">
      <!-- 头部 -->
      <div class="exercise-header">
        <h1>
          <span>🏃</span> 每日运动记录器
          <span>💪</span>
        </h1>
        <div class="exercise-sub">记录每次运动 · 追踪消耗 · 看见进步</div>
      </div>

      <div class="exercise-dashboard">
        <!-- 左侧：记录表单 -->
        <div class="exercise-record-panel">
          <div class="exercise-section-title">📝 记录今日运动</div>

          <div class="exercise-form-group">
            <label>🏋️ 运动类型</label>
            <select v-model="exerciseType">
              <option value="有氧">🏃 有氧</option>
              <option value="力量">🏋️ 力量</option>
              <option value="柔韧">🧘 柔韧</option>
              <option value="球类">⚽ 球类</option>
              <option value="其他">🎯 其他</option>
            </select>
          </div>

          <div class="exercise-form-group">
            <label>📋 运动项目</label>
            <input type="text" v-model="exerciseName" placeholder="例：慢跑、深蹲、瑜伽..." @keyup.enter="saveRecord" />
          </div>

          <div class="exercise-form-group">
            <label>⏱️ 时长 (分钟)</label>
            <input type="number" v-model.number="duration" placeholder="数字，如 30" @keyup.enter="saveRecord" />
          </div>

          <div class="exercise-form-group">
            <label>🔥 消耗卡路里 (kcal)</label>
            <input type="number" v-model.number="calories" placeholder="数字，如 250" @keyup.enter="saveRecord" />
          </div>

          <div class="exercise-form-group">
            <label>📝 备注</label>
            <textarea v-model="notes" placeholder="例：强度中等，感觉良好..."></textarea>
          </div>

          <div class="exercise-form-group">
            <label>📅 日期</label>
            <input type="date" v-model="recordDate" />
          </div>

          <button class="exercise-btn-primary" @click="saveRecord">➕ 保存记录</button>

          <!-- 今日统计 -->
          <div class="exercise-today-stats">
            <div class="exercise-stats-title">📊 今日统计</div>
            <div class="exercise-stat-item">
              <span class="exercise-stat-label">总消耗卡路里</span>
              <span class="exercise-stat-value">{{ todayStats.totalCalories }}</span>
              <span> kcal</span>
            </div>
            <div class="exercise-stat-item">
              <span class="exercise-stat-label">运动次数</span>
              <span class="exercise-stat-value">{{ todayStats.exerciseCount }}</span>
              <span> 次</span>
            </div>
            <div class="exercise-stat-item">
              <span class="exercise-stat-label">最常运动</span>
              <span class="exercise-stat-value">{{ todayStats.topExercise }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：历史记录 -->
        <div class="exercise-history-panel">
          <div class="exercise-history-header">
            <div class="exercise-section-title" style="border-left-color:#f0a030;">📋 运动历史</div>
            <button class="exercise-btn-secondary" @click="exportData">📎 导出数据</button>
          </div>

          <div class="exercise-filter-bar">
            <input type="text" v-model="searchKeyword" placeholder="🔍 搜索运动或备注..." />
            <input type="date" v-model="filterDate" placeholder="筛选日期" />
            <button class="exercise-btn-secondary" @click="clearFilters">🗑️ 清除筛选</button>
          </div>

          <div class="exercise-record-list">
            <div v-if="filteredRecords.length === 0" class="exercise-empty-msg">
              ✨ 暂无运动记录，开始记录今天的活力时刻吧！
            </div>
            <div v-for="record in filteredRecords" :key="record.id" class="exercise-record-card">
              <div class="exercise-record-header">
                <span class="exercise-type-badge">{{ record.exerciseType }}</span>
                <span class="exercise-record-date">📅 {{ record.recordDate }}</span>
                <button class="exercise-delete-btn" @click="deleteRecord(record.id)">🗑️</button>
              </div>
              <div class="exercise-name">🏅 {{ record.exerciseName }}</div>
              <div>
                <span class="exercise-calories">🔥 {{ record.calories ? record.calories + ' kcal' : '未记录' }}</span>
                <span class="exercise-duration">⏱️ {{ record.duration ? record.duration + ' min' : '' }}</span>
              </div>
              <div v-if="record.notes" class="exercise-notes">📌 {{ record.notes }}</div>
              <div class="exercise-tag-group">
                <span class="exercise-tag">⭐ {{ record.exerciseType }}</span>
                <span v-if="record.duration" class="exercise-tag">⏱️ {{ record.duration }} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="exercise-footer">🏆 每一次运动都是对身体的投资 — 本地存储，数据永存 💪</footer>

      <!-- 临时消息 -->
      <div v-if="message" class="exercise-temp-msg">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
//base——url 表示后端的链接库
const BASE_URL = 'http://localhost:8080/api/sport'

    // 数据
    const exerciseRecords = ref([])
    const exerciseType = ref('有氧')
    const exerciseName = ref('')
    const duration = ref(0)
    const calories = ref(0)
    const notes = ref('')
    const recordDate = ref('')
    const searchKeyword = ref('')
    const filterDate = ref('')
    const message = ref('')

     // 辅助函数
    const getTodayDate = () => {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }
     const showMessage = (msg) => {
      message.value = msg
      setTimeout(() => { message.value = '' }, 1800)
    }

 // 从后端加载
    const loadRecords = async () => {
      try {
        const res = await axios.get(BASE_URL + '/list', {
          params: { userId: 1 }
        })
        if (res.data.code === 200) {
          exerciseRecords.value = res.data.data
        }
      } catch (e) {
        console.error('加载失败', e)
      }
    }

     // 保存到后端
    const saveRecord = async () => {
      if (!exerciseName.value.trim()) {
        alert('请填写运动项目 🏃')
        return
      }
      let durVal = parseInt(duration.value)
      if (isNaN(durVal) || durVal < 0) durVal = 0
      let calVal = parseInt(calories.value)
      if (isNaN(calVal) || calVal < 0) calVal = 0
      let dateValue = recordDate.value
      if (!dateValue) dateValue = getTodayDate()

      try {
        const res = await axios.post(BASE_URL + '/add', {
          userId: 1,
          exerciseType: exerciseType.value,
          exerciseName: exerciseName.value.trim(),
          duration: durVal,
          calories: calVal,
          notes: notes.value.trim(),
          recordDate: dateValue
        })
        if (res.data.code === 200) {
          showMessage('✅ 运动记录已保存！')
          loadRecords()
          exerciseName.value = ''
          duration.value = 0
          calories.value = 0
          notes.value = ''
          recordDate.value = getTodayDate()
        } else {
          alert(res.data.message)
        }
      } catch (e) {
        alert('保存失败，请检查后端是否启动')
        console.error(e)
      }
    }
 // 删除
    const deleteRecord = async (id) => {
      if (confirm('删除这条运动记录？')) {
        try {
          const res = await axios.delete(BASE_URL + '/delete/' + id)
          if (res.data.code === 200) {
            showMessage('🗑️ 记录已删除')
            loadRecords()
          }
        } catch (e) {
          alert('删除失败')
          console.error(e)
        }
      }
    }
 // 筛选
    const filteredRecords = computed(() => {
      let result = [...exerciseRecords.value]
      const keyword = searchKeyword.value.trim().toLowerCase()
      if (keyword) {
        result = result.filter(record =>
          record.exerciseName.toLowerCase().includes(keyword) ||
          (record.notes && record.notes.toLowerCase().includes(keyword)) ||
          record.exerciseType.toLowerCase().includes(keyword)
        )
      }
      if (filterDate.value) {
        result = result.filter(record => record.recordDate === filterDate.value)
      }
      result.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate))
      return result
    })
 // 今日统计
    const todayStats = computed(() => {
      const today = getTodayDate()
      const todayRecords = exerciseRecords.value.filter(record => record.recordDate === today)
      const totalCalories = todayRecords.reduce((sum, record) => sum + (record.calories || 0), 0)
      const exerciseCount = todayRecords.length

      const freqMap = {}
      todayRecords.forEach(record => {
        freqMap[record.exerciseName] = (freqMap[record.exerciseName] || 0) + 1
      })
      let topName = '暂无'
      let maxFreq = 0
      for (const [name, count] of Object.entries(freqMap)) {
        if (count > maxFreq) { maxFreq = count; topName = name }
      }
      return {
        totalCalories,
        exerciseCount,
        topExercise: topName !== '暂无' ? `${topName} (${maxFreq}次)` : '暂无'
      }
    })

const clearFilters = () => {
      searchKeyword.value = ''
      filterDate.value = ''
      showMessage('筛选已清除')
    }

    const exportData = () => {
      if (exerciseRecords.value.length === 0) {
        alert('暂时没有运动记录可导出～')
        return
      }
      const blob = new Blob([JSON.stringify(exerciseRecords.value, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `exercise_records_${getTodayDate()}.json`
      a.click()
      URL.revokeObjectURL(url)
      showMessage('📁 已导出 JSON 文件')
    }

    function goBack() {
      router.back();
    }

    onMounted(() => {
      loadRecords()
      recordDate.value = getTodayDate()
    })


</script>

<style scoped>

.exercise-wrapper * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, 'Segoe UI', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
}

.exercise-app-container {
  max-width: 1300px;
  margin: 0 auto;
}

/* ===== 头部 ===== */
.exercise-header {
  text-align: center;
  margin-bottom: clamp(16px, 3vw, 32px);
}

.exercise-header h1 {
  font-size: clamp(1.4rem, 4vw, 2.6rem);
  background: linear-gradient(135deg, #2a6b8f, #f0a030);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-flex;
  align-items: center;
  gap: clamp(6px, 1vw, 12px);
  flex-wrap: wrap;
  justify-content: center;
}

.exercise-header h1 span {
  font-size: clamp(1.2rem, 3vw, 2rem);
}

.exercise-sub {
  color: #4a6a7a;
  font-weight: 500;
  font-size: clamp(0.75rem, 1.2vw, 1rem);
  border-bottom: 1px dashed #b8d0dd;
  display: inline-block;
  padding-bottom: 4px;
}

/* ===== 主布局 ===== */
.exercise-dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(16px, 2.5vw, 32px);
  margin-top: clamp(8px, 1vw, 16px);
}

/* ===== 面板 ===== */
.exercise-record-panel,
.exercise-history-panel {
  flex: 1 1 clamp(280px, 40%, 500px);
  background: rgba(235, 245, 250, 0.85);
  backdrop-filter: blur(2px);
  border-radius: clamp(1.2rem, 2vw, 2rem);
  padding: clamp(16px, 2.5vw, 32px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(80, 150, 200, 0.2);
}

.exercise-history-panel {
  flex: 2 1 clamp(280px, 55%, 700px);
}

.exercise-section-title {
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  font-weight: 600;
  border-left: 6px solid #2a6b8f;
  padding-left: 14px;
  margin-bottom: clamp(12px, 1.5vw, 20px);
  color: #1f4a5e;
}

/* ===== 表单 ===== */
.exercise-form-group {
  margin-bottom: clamp(10px, 1.5vw, 18px);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exercise-form-group label {
  font-weight: 600;
  font-size: clamp(0.7rem, 1vw, 0.85rem);
  color: #3d6a7a;
}

.exercise-form-group input,
.exercise-form-group select,
.exercise-form-group textarea {
  background: #ffffffdd;
  border: 1px solid #c5dbe8;
  border-radius: 1.2rem;
  padding: clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 18px);
  font-size: clamp(0.85rem, 1.1vw, 1rem);
  outline: none;
  transition: 0.2s;
  color: #1f3a44;
  width: 100%;
}

.exercise-form-group input:focus,
.exercise-form-group select:focus,
.exercise-form-group textarea:focus {
  border-color: #f0a030;
  box-shadow: 0 0 0 3px rgba(240, 160, 48, 0.2);
  background: white;
}

.exercise-form-group textarea {
  resize: vertical;
  min-height: 60px;
}

/* ===== 按钮 ===== */
.exercise-btn-primary {
  background: #2a6b8f;
  border: none;
  color: white;
  padding: clamp(10px, 1.2vw, 14px) clamp(14px, 1.8vw, 20px);
  border-radius: 2rem;
  font-weight: 600;
  font-size: clamp(0.9rem, 1.2vw, 1.05rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.exercise-btn-primary:hover {
  background: #1d5575;
  transform: scale(0.98);
}

.exercise-btn-secondary {
  background: #d6e5ef;
  color: #1f4a5e;
  border: none;
  padding: clamp(6px, 0.8vw, 10px) clamp(12px, 1.2vw, 18px);
  border-radius: 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  font-size: clamp(0.7rem, 0.9vw, 0.9rem);
  white-space: nowrap;
}

.exercise-btn-secondary:hover {
  background: #c0d6e3;
}

/* ===== 今日统计 ===== */
.exercise-today-stats {
  margin-top: clamp(16px, 2vw, 32px);
  background: #e6f0f7;
  border-radius: 1.5rem;
  padding: clamp(12px, 1.5vw, 20px);
  border: 1px solid #cde0ec;
}

.exercise-stats-title {
  font-weight: 700;
  margin-bottom: 8px;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
}

.exercise-stat-item {
  display: flex;
  justify-content: space-between;
  padding: clamp(4px, 0.6vw, 8px) 0;
  border-bottom: 1px dashed #c2d8e6;
  font-size: clamp(0.75rem, 1vw, 0.95rem);
}

.exercise-stat-item:last-child {
  border-bottom: none;
}

.exercise-stat-label {
  font-weight: 500;
}

.exercise-stat-value {
  font-weight: 700;
  color: #d48c2c;
}

/* ===== 历史面板 ===== */
.exercise-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(8px, 1vw, 16px);
  margin-bottom: clamp(10px, 1vw, 16px);
}

.exercise-filter-bar {
  display: flex;
  gap: clamp(6px, 1vw, 12px);
  margin-bottom: clamp(10px, 1vw, 16px);
  flex-wrap: wrap;
}

.exercise-filter-bar input {
  flex: 1 1 clamp(100px, 20%, 200px);
  padding: clamp(6px, 0.8vw, 10px) clamp(10px, 1.2vw, 16px);
  border: 1px solid #c5dbe8;
  border-radius: 1.2rem;
  font-size: clamp(0.7rem, 0.9vw, 0.85rem);
  outline: none;
  background: #ffffffdd;
  min-width: 80px;
}

.exercise-filter-bar input:focus {
  border-color: #f0a030;
  box-shadow: 0 0 0 3px rgba(240, 160, 48, 0.2);
}

.exercise-filter-bar .exercise-btn-secondary {
  flex: 0 0 auto;
}

/* ===== 记录列表 ===== */
.exercise-record-list {
  max-height: clamp(350px, 50vh, 550px);
  overflow-y: auto;
  padding-right: 4px;
}

.exercise-record-list::-webkit-scrollbar {
  width: 4px;
}

.exercise-record-list::-webkit-scrollbar-thumb {
  background: #b0ccdd;
  border-radius: 10px;
}

.exercise-record-card {
  background: white;
  border-radius: clamp(1rem, 1.5vw, 1.5rem);
  padding: clamp(10px, 1.2vw, 18px);
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border-left: clamp(5px, 0.6vw, 8px) solid #f0a030;
}

.exercise-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin-bottom: 6px;
}

.exercise-type-badge {
  background: #dce8f0;
  padding: clamp(2px, 0.4vw, 4px) clamp(8px, 1vw, 14px);
  border-radius: 50px;
  font-size: clamp(0.6rem, 0.8vw, 0.7rem);
  font-weight: 700;
  color: #1f5a70;
}

.exercise-record-date {
  font-size: clamp(0.6rem, 0.8vw, 0.75rem);
  color: #5f7e8f;
}

.exercise-delete-btn {
  background: none;
  border: none;
  font-size: clamp(1rem, 1.2vw, 1.2rem);
  cursor: pointer;
  color: #8aaec2;
  transition: color 0.2s;
  padding: 4px 8px;
}

.exercise-delete-btn:hover {
  color: #c23d3d;
}

.exercise-name {
  font-weight: 700;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  margin: 6px 0 4px;
  color: #1f4a5e;
}

.exercise-calories {
  font-size: clamp(0.7rem, 0.9vw, 0.8rem);
  background: #e6f0f7;
  display: inline-block;
  padding: 2px clamp(8px, 1vw, 14px);
  border-radius: 20px;
}

.exercise-duration {
  font-size: clamp(0.7rem, 0.9vw, 0.8rem);
  margin-left: 6px;
  color: #4a6a7a;
}

.exercise-notes {
  font-size: clamp(0.7rem, 0.9vw, 0.8rem);
  color: #5a6f7a;
  margin-top: 4px;
  font-style: italic;
}

.exercise-empty-msg {
  text-align: center;
  padding: 2rem 0.5rem;
  color: #8aaec2;
  font-size: clamp(0.85rem, 1.1vw, 1rem);
}

.exercise-tag-group {
  display: flex;
  gap: clamp(4px, 0.6vw, 10px);
  margin-top: clamp(8px, 1vw, 14px);
  flex-wrap: wrap;
}

.exercise-tag {
  background: #e6f0f7;
  border-radius: 32px;
  padding: clamp(2px, 0.4vw, 4px) clamp(8px, 1vw, 14px);
  font-size: clamp(0.6rem, 0.7vw, 0.7rem);
}

/* ===== 底部 ===== */
.exercise-footer {
  text-align: center;
  margin-top: clamp(16px, 2.5vw, 32px);
  font-size: clamp(0.6rem, 0.9vw, 0.8rem);
  color: #8aaec2;
  padding: 0.5rem;
}

/* ===== Toast 消息 ===== */
.exercise-temp-msg {
  position: fixed;
  bottom: clamp(12px, 2vh, 30px);
  left: 50%;
  transform: translateX(-50%);
  background-color: #2a6b8f;
  color: white;
  padding: clamp(6px, 0.8vw, 12px) clamp(16px, 2vw, 30px);
  border-radius: 40px;
  font-size: clamp(0.8rem, 1vw, 0.95rem);
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: exerciseFadeUp 0.3s ease-out;
  max-width: 90%;
  text-align: center;
  white-space: nowrap;
}

@keyframes exerciseFadeUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* ===== 小屏设备特殊处理（仅处理布局方向） ===== */
@media screen and (max-width: 600px) {
  .exercise-dashboard {
    flex-direction: column;
  }
  
  .exercise-record-panel,
  .exercise-history-panel {
    flex: 1 1 100%;
  }
  
  .exercise-filter-bar {
    flex-direction: column;
  }
  
  .exercise-filter-bar input {
    flex: 1 1 100%;
    width: 100%;
  }
  
  .exercise-filter-bar .exercise-btn-secondary {
    width: 100%;
    text-align: center;
  }
  
  .exercise-history-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .exercise-history-header .exercise-btn-secondary {
    width: 100%;
    text-align: center;
  }
  
  .exercise-temp-msg {
    white-space: normal;
    word-break: break-word;
  }
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #ff6b6b;
  cursor: pointer;
  padding: 8px 0;
}
</style>
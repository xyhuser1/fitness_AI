<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios';
//定义后端链接
const BASE_URL = 'http://localhost:8080/api/diet'
// ========== 响应式数据 ==========
const dietRecords = ref([])
const router = useRouter();

// 表单
const mealType = ref('早餐')  
const foodName = ref('')
const calories = ref(0)
const notes = ref('')
const recordDate = ref('')

// 筛选
const searchKeyword = ref('')
const filterDate = ref('')

// 提示消息
const message = ref('')
const loading = ref(false)

// ========== 辅助函数 ==========
const getTodayDate = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const getDateOffset = (offsetDays) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

const showMessage = (msg) => {
  message.value = msg
  setTimeout(() => {
    message.value = ''
  }, 1800)
}

// ========== 后端获取数据 ==========


const loadRecords = async() => {
  try{
    const res =await axios.get(BASE_URL+'/list',{params:{userId:1,date:getTodayDate()}});
  if(res.data.code===200){
    dietRecords.value=res.data.data;
  }
  }
  
  catch(e)
  {
console.error("加载失败",e);
  }
  }
  
 
function goBack() {
    router.back();
}
// ========== 业务方法 ==========
const saveRecord = async() => {
  if (!foodName.value.trim()) {
    alert("请填写食物名称 🥗")
    return
  }
  let calValue = parseInt(calories.value)
  if (isNaN(calValue) || calValue < 0) calValue = 0
  let dateValue = recordDate.value
  if (!dateValue) dateValue = getTodayDate()

  try{
const res= await axios.post(BASE_URL+'/add',{
          userId: 1,
          recordDate: dateValue,
          mealType: mealType.value,
          foodName: foodName.value.trim(),
          calories: calValue});
          if(res.data.code===200){
            showMessage("✅记录已保存")
            loadRecords()
          }else{
            alert(res.data.message)
          }

  }
  catch(e){
    alert('保存失败，请检查后端是否启动')
        console.error(e)
      }

  // 重置表单
  foodName.value = ''
  calories.value = 0
  notes.value = ''
  recordDate.value = getTodayDate()

  showMessage("✅ 记录已保存！")
}

const deleteRecord = async(id) => {
  if (confirm('删除这条饮食记录？')) {
    try{
    const res=  await  axios.delete(BASE_URL+'/delete/'+id)
    if(res.data.code==200){
     showMessage("🗑️ 记录已删除")
     loadRecords()//从后端重新加载
    }}
    catch(e){
         alert("删除失败")
         console.error(e)
    }
    
  }
}

const exportData = () => {
  if (dietRecords.value.length === 0) {
    alert("暂时没有饮食记录可导出～")
    return
  }
  const dataStr = JSON.stringify(dietRecords.value, null, 2)
  const blob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `diet_records_${getTodayDate()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showMessage("📁 已导出 JSON 文件")
}

const clearFilters = () => {
  searchKeyword.value = ''
  filterDate.value = ''
  showMessage("筛选已清除")
}

// ========== 计算属性 ==========
const filteredRecords = computed(() => {
  let result = [...dietRecords.value]
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (keyword) {
    result = result.filter(record =>
      record.foodName.toLowerCase().includes(keyword) ||
      record.notes.toLowerCase().includes(keyword) ||
      record.mealType.toLowerCase().includes(keyword)
    )
  }
  if (filterDate.value) {
    result = result.filter(record => record.date === filterDate.value)
  }
  result.sort((a, b) => new Date(b.date) - new Date(a.date))
  return result
})

const todayStats = computed(() => {
  const today = getTodayDate()
  const todayRecords = dietRecords.value.filter(record => record.date === today)
  const totalCalories = todayRecords.reduce((sum, record) => sum + (record.calories || 0), 0)
  const mealCount = todayRecords.length
  let maxCalorieMeal = { mealType: "-", calories: -1 }
  todayRecords.forEach(record => {
    const cal = record.calories || 0
    if (cal > maxCalorieMeal.calories) {
      maxCalorieMeal.calories = cal
      maxCalorieMeal.mealType = record.mealType
    }
  })
  const topMealText = maxCalorieMeal.calories > 0
    ? `${maxCalorieMeal.mealType} (${maxCalorieMeal.calories}kcal)`
    : "暂无"
  return { totalCalories, mealCount, topMeal: topMealText }
})

// ========== 生命周期 ==========
onMounted(() => {
  loadRecords()
  if (!recordDate.value) {
    recordDate.value = getTodayDate()
  }
})


</script>

<template>
  <button class="back-btn" @click="goBack">‹ 返回</button>
  <div class="diet-wrapper">
    <div class="diet-app-container">
      <div class="diet-header">
        <h1>
          <span>🥗</span> 每日饮食记录器
          <span>🍎</span>
        </h1>
        <div class="diet-sub">记录每餐 · 掌控健康 · 追溯习惯</div>
      </div>

      <div class="diet-dashboard">
        <!-- 左侧记录区 -->
        <div class="diet-record-panel">
          <div class="diet-section-title">📝 记录今日饮食</div>

          <div class="diet-form-group">
            <label>🍽️ 餐别</label>
            <select v-model="mealType">
              <option value="早餐">🌅 早餐</option>
              <option value="午餐">☀️ 午餐</option>
              <option value="晚餐">🌙 晚餐</option>
              <option value="加餐">🍪 加餐/零食</option>
            </select>
          </div>

          <div class="diet-form-group">
            <label>🥘 食物名称</label>
            <input type="text" v-model="foodName" placeholder="例：鸡胸肉沙拉，全麦面包..." @keyup.enter="saveRecord" />
          </div>

          <div class="diet-form-group">
            <label>🔥 预估卡路里 (kcal)</label>
            <input type="number" v-model.number="calories" placeholder="数字，如 450" @keyup.enter="saveRecord" />
          </div>

          <div class="diet-form-group">
            <label>📝 备注</label>
            <textarea v-model="notes" placeholder="例：少油，高蛋白..."></textarea>
          </div>

          <div class="diet-form-group">
            <label>📅 日期</label>
            <input type="date" v-model="recordDate" />
          </div>

          <button class="diet-btn-primary" @click="saveRecord">➕ 保存记录</button>

          <div class="diet-today-stats">
            <div style="font-weight:700; margin-bottom:8px;">📊 今日统计</div>
            <div class="diet-stat-item">
              <span class="diet-stat-label">总摄入卡路里</span>
              <span class="diet-stat-value">{{ todayStats.totalCalories }}</span>
              <span> kcal</span>
            </div>
            <div class="diet-stat-item">
              <span class="diet-stat-label">记录餐次</span>
              <span class="diet-stat-value">{{ todayStats.mealCount }}</span>
              <span> 次</span>
            </div>
            <div class="diet-stat-item">
              <span class="diet-stat-label">最丰盛一餐</span>
              <span class="diet-stat-value">{{ todayStats.topMeal }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧历史区 -->
        <div class="diet-history-panel">
          <div class="diet-history-header">
            <div class="diet-section-title" style="border-left-color:#b8863b;">📋 饮食历史</div>
            <button class="diet-btn-secondary" @click="exportData">📎 导出数据</button>
          </div>

          <div class="diet-filter-bar">
            <input type="text" v-model="searchKeyword" placeholder="🔍 搜索食物或备注..." />
            <input type="date" v-model="filterDate" placeholder="筛选日期" />
            <button class="diet-btn-secondary" @click="clearFilters">🗑️ 清除筛选</button>
          </div>

          <div class="diet-record-list">
            <div v-if="filteredRecords.length === 0" class="diet-empty-msg">
              ✨ 暂无饮食记录，添加今天的健康餐吧！
            </div>
            <div v-for="record in filteredRecords" :key="record.id" class="diet-record-card">
              <div class="diet-record-header">
                <span class="diet-meal-type">{{ record.mealType }}</span>
                <span class="diet-record-date">📅 {{ record.date }}</span>
                <button class="diet-delete-btn" @click="deleteRecord(record.id)">🗑️</button>
              </div>
              <div class="diet-food-name">🍲 {{ record.foodName }}</div>
              <div class="diet-calories">🔥 {{ record.calories ? record.calories + ' kcal' : '未记录' }}</div>
              <div v-if="record.notes" class="diet-notes">📌 {{ record.notes }}</div>
              <div class="diet-nutrition-badge">
                <span class="diet-badge">⭐ {{ record.mealType }}</span>
                <span v-if="record.calories > 0" class="diet-badge">⚡能量 {{ record.calories }} kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="diet-footer">🥑 每一餐都是对自己的爱护 — 本地存储，数据永存 🥝</footer>
      <div v-if="message" class="diet-temp-msg">{{ message }}</div>
    </div>
  </div>
</template>



<style scoped>
/* ==================== 全局重置（仅限本组件） ==================== */
.diet-wrapper * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, 'Segoe UI', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
}

.diet-wrapper {
  background: linear-gradient(135deg, #f8f4ee 0%, #f0ebe3 100%);
  min-height: 100vh;
  padding: 20px;
}

.diet-app-container {
  max-width: 1300px;
  margin: 0 auto;
}

/* ==================== 头部 ==================== */
.diet-header {
  text-align: center;
  margin-bottom: 2rem;
}

.diet-header h1 {
  font-size: 2.2rem;
  background: linear-gradient(135deg, #3b6e3e, #e0a82b);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.3px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.diet-header h1 span {
  font-size: 2rem;
}

.diet-sub {
  color: #7f6b3c;
  margin-top: 6px;
  font-weight: 500;
  border-bottom: 1px dashed #e2ca9b;
  display: inline-block;
  padding-bottom: 4px;
}

/* ==================== 主布局 ==================== */
.diet-dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 1rem;
}

/* ==================== 左侧面板 ==================== */
.diet-record-panel {
  flex: 1.2;
  min-width: 280px;
  background: rgba(255, 250, 240, 0.85);
  backdrop-filter: blur(2px);
  border-radius: 2rem;
  padding: 1.6rem;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(226, 190, 110, 0.3);
}

.diet-section-title {
  font-size: 1.4rem;
  font-weight: 600;
  border-left: 6px solid #e0a82b;
  padding-left: 14px;
  margin-bottom: 1.2rem;
  color: #3a5a34;
}

.diet-form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.diet-form-group label {
  font-weight: 600;
  font-size: 0.85rem;
  color: #5d6e47;
  letter-spacing: 0.5px;
}

.diet-form-group input,
.diet-form-group select,
.diet-form-group textarea {
  background: #ffffffdd;
  border: 1px solid #e2cfaa;
  border-radius: 1.2rem;
  padding: 10px 16px;
  font-size: 0.95rem;
  outline: none;
  transition: 0.2s;
  color: #2c3e2b;
}

.diet-form-group input:focus,
.diet-form-group select:focus,
.diet-form-group textarea:focus {
  border-color: #e0a82b;
  box-shadow: 0 0 0 3px rgba(224, 168, 43, 0.2);
  background: white;
}

.diet-form-group textarea {
  resize: vertical;
  min-height: 70px;
}

.diet-btn-primary {
  background: #3b6e3e;
  border: none;
  color: white;
  padding: 12px 18px;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.diet-btn-primary:hover {
  background: #2c582f;
  transform: scale(0.98);
}

.diet-btn-secondary {
  background: #e9dbc3;
  color: #5e4b2b;
  border: none;
  padding: 8px 14px;
  border-radius: 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.diet-btn-secondary:hover {
  background: #ddd0b8;
}

/* ==================== 今日统计 ==================== */
.diet-today-stats {
  margin-top: 2rem;
  background: #fff4e4;
  border-radius: 1.5rem;
  padding: 1rem;
  border: 1px solid #f3e3ca;
}

.diet-stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #ebd7b5;
}

.diet-stat-item:last-child {
  border-bottom: none;
}

.diet-stat-label {
  font-weight: 500;
}

.diet-stat-value {
  font-weight: 700;
  color: #cb7b2a;
}

/* ==================== 右侧面板 ==================== */
.diet-history-panel {
  flex: 2;
  min-width: 300px;
  background: rgba(255, 250, 240, 0.7);
  backdrop-filter: blur(2px);
  border-radius: 2rem;
  padding: 1.6rem;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.05);
}

.diet-history-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.diet-filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.diet-filter-bar input {
  flex: 1;
  padding: 8px 14px;
  border: 1px solid #e2cfaa;
  border-radius: 1.2rem;
  font-size: 0.85rem;
  outline: none;
  background: #ffffffdd;
  min-width: 120px;
}

.diet-filter-bar input:focus {
  border-color: #e0a82b;
  box-shadow: 0 0 0 3px rgba(224, 168, 43, 0.2);
}

.diet-record-list {
  max-height: 480px;
  overflow-y: auto;
  padding-right: 5px;
}

.diet-record-list::-webkit-scrollbar {
  width: 4px;
}

.diet-record-list::-webkit-scrollbar-thumb {
  background: #d4c5ad;
  border-radius: 10px;
}

/* ==================== 记录卡片 ==================== */
.diet-record-card {
  background: white;
  border-radius: 1.2rem;
  padding: 1rem;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border-left: 8px solid #e0a82b;
}

.diet-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.diet-meal-type {
  background: #f2e5d2;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #926d2c;
}

.diet-record-date {
  font-size: 0.75rem;
  color: #9b7e54;
}

.diet-delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #bc8f6b;
  transition: color 0.2s;
}

.diet-delete-btn:hover {
  color: #c23d3d;
}

.diet-food-name {
  font-weight: 700;
  font-size: 1rem;
  margin: 8px 0 4px;
  color: #2e4a2b;
}

.diet-calories {
  font-size: 0.8rem;
  background: #eef3e6;
  display: inline-block;
  padding: 2px 12px;
  border-radius: 20px;
}

.diet-notes {
  font-size: 0.8rem;
  color: #6c5a3e;
  margin-top: 6px;
  font-style: italic;
}

.diet-empty-msg {
  text-align: center;
  padding: 2rem;
  color: #bb9b6e;
}

.diet-nutrition-badge {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.diet-badge {
  background: #f5e9d5;
  border-radius: 32px;
  padding: 4px 12px;
  font-size: 0.7rem;
}

/* ==================== 底部 ==================== */
.diet-footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.75rem;
  color: #baa06e;
}

/* ==================== Toast 消息 ==================== */
.diet-temp-msg {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #3b6e3e;
  color: white;
  padding: 8px 22px;
  border-radius: 40px;
  font-size: 0.9rem;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: dietFadeUp 0.3s ease-out;
}

@keyframes dietFadeUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* ============================================================ */
/* ==================== 三端适配 ==================== */
/* ============================================================ */

/* ---------- 平板（768px - 1024px） ---------- */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .diet-wrapper {
    padding: 16px;
  }

  .diet-dashboard {
    gap: 1.5rem;
  }

  .diet-record-panel {
    flex: 1;
    min-width: 240px;
    padding: 1.4rem;
  }

  .diet-history-panel {
    flex: 1.5;
    min-width: 260px;
    padding: 1.4rem;
  }

  .diet-header h1 {
    font-size: 1.8rem;
  }

  .diet-record-list {
    max-height: 400px;
  }

  .diet-filter-bar input {
    min-width: 100px;
    font-size: 0.8rem;
  }

  .diet-btn-primary {
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .diet-section-title {
    font-size: 1.2rem;
  }

  .diet-record-card {
    padding: 0.9rem;
  }
}

/* ---------- 手机（< 768px） ---------- */
@media screen and (max-width: 767px) {
  .diet-wrapper {
    padding: 12px;
  }

  .diet-dashboard {
    flex-direction: column;
    gap: 1rem;
  }

  .diet-record-panel {
    flex: 1;
    min-width: unset;
    padding: 1.2rem;
    border-radius: 1.5rem;
  }

  .diet-history-panel {
    flex: 1;
    min-width: unset;
    padding: 1.2rem;
    border-radius: 1.5rem;
  }

  .diet-header h1 {
    font-size: 1.4rem;
    gap: 6px;
  }

  .diet-header h1 span {
    font-size: 1.2rem;
  }

  .diet-sub {
    font-size: 0.85rem;
  }

  .diet-section-title {
    font-size: 1.1rem;
    padding-left: 10px;
  }

  .diet-form-group input,
  .diet-form-group select,
  .diet-form-group textarea {
    padding: 8px 14px;
    font-size: 0.9rem;
    border-radius: 1rem;
  }

  .diet-form-group textarea {
    min-height: 60px;
  }

  .diet-btn-primary {
    padding: 10px 14px;
    font-size: 0.9rem;
    border-radius: 1.5rem;
  }

  .diet-btn-secondary {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .diet-record-list {
    max-height: 350px;
  }

  .diet-record-card {
    padding: 0.8rem;
    border-left-width: 5px;
    border-radius: 1rem;
  }

  .diet-record-header {
    gap: 4px;
  }

  .diet-food-name {
    font-size: 0.9rem;
  }

  .diet-calories {
    font-size: 0.75rem;
  }

  .diet-notes {
    font-size: 0.75rem;
  }

  .diet-today-stats {
    padding: 0.8rem;
    margin-top: 1.2rem;
  }

  .diet-stat-item {
    padding: 6px 0;
    font-size: 0.85rem;
  }

  .diet-filter-bar {
    flex-direction: column;
    gap: 8px;
  }

  .diet-filter-bar input {
    flex: 1;
    min-width: unset;
    width: 100%;
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .diet-filter-bar .diet-btn-secondary {
    width: 100%;
    text-align: center;
  }

  .diet-history-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .diet-history-header .diet-btn-secondary {
    width: 100%;
    text-align: center;
  }

  .diet-nutrition-badge {
    gap: 6px;
  }

  .diet-badge {
    font-size: 0.65rem;
    padding: 3px 10px;
  }

  .diet-footer {
    font-size: 0.65rem;
    margin-top: 1.2rem;
  }

  .diet-temp-msg {
    font-size: 0.8rem;
    padding: 6px 16px;
    bottom: 12px;
  }

  .diet-meal-type {
    font-size: 0.65rem;
    padding: 3px 10px;
  }

  .diet-record-date {
    font-size: 0.65rem;
  }

  .diet-delete-btn {
    font-size: 1rem;
  }

  .diet-stat-value {
    font-size: 0.9rem;
  }
}

/* ---------- 大屏（1200px+） ---------- */
@media screen and (min-width: 1200px) {
  .diet-wrapper {
    padding: 30px 40px;
  }

  .diet-app-container {
    max-width: 1400px;
  }

  .diet-record-panel {
    padding: 2rem;
    border-radius: 2.5rem;
  }

  .diet-history-panel {
    padding: 2rem;
    border-radius: 2.5rem;
  }

  .diet-header h1 {
    font-size: 2.6rem;
  }

  .diet-record-list {
    max-height: 550px;
  }

  .diet-record-card {
    padding: 1.2rem;
    border-radius: 1.5rem;
  }

  .diet-section-title {
    font-size: 1.6rem;
  }

  .diet-btn-primary {
    padding: 14px 20px;
    font-size: 1.1rem;
  }

  .diet-form-group input,
  .diet-form-group select,
  .diet-form-group textarea {
    padding: 12px 18px;
    font-size: 1rem;
  }

  .diet-food-name {
    font-size: 1.1rem;
  }
  .back-btn {
    background: none;
    border: none;
    font-size: 16px;
    color: #ff6b6b;
    cursor: pointer;
    padding: 8px 0;
}
}
</style>
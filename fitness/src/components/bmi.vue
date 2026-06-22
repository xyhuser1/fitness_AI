<template>
  <button class="back-btn" @click="goBack">‹ 返回</button>
  <div class="bmi-wrapper">
    <div class="bmi-container">
      <!-- 头部 -->
      <div class="bmi-header">
        <h1><span>📊</span> BMI 健康检测</h1>
        <div class="bmi-sub">了解你的身体质量指数 · 科学管理体重</div>
      </div>

      <div class="bmi-dashboard">
        <!-- 左侧：输入区域 -->
        <div class="bmi-input-panel">
          <div class="bmi-section-title">📝 输入数据</div>

          <div class="bmi-form-group">
            <label>📏 身高 (cm)</label>
            <input type="number" v-model.number="height" placeholder="例：170" />
          </div>

          <div class="bmi-form-group">
            <label>⚖️ 体重 (kg)</label>
            <input type="number" v-model.number="weight" placeholder="例：65" step="0.1" />
          </div>

          <button class="bmi-btn-primary" @click="calculateBMI">🔍 开始检测</button>
          <button class="bmi-btn-secondary" @click="loadFromProfile">📋 从个人资料读取</button>
        </div>

        <!-- 右侧：结果展示 -->
        <div class="bmi-result-panel">
          <div class="bmi-section-title" style="border-left-color: #ff6b6b;">📊 检测结果</div>

          <div v-if="bmiResult === null" class="bmi-empty">
            👈 请输入身高体重后点击检测
          </div>

          <div v-else class="bmi-result-content">
            <!-- BMI 数值展示 -->
            <div class="bmi-score-circle" :style="{ borderColor: bmiColor }">
              <div class="bmi-score-num" :style="{ color: bmiColor }">{{ bmiResult }}</div>
              <div class="bmi-score-label">BMI</div>
            </div>

            <!-- 分类结果 -->
            <div class="bmi-category" :style="{ backgroundColor: bmiColor + '20', color: bmiColor }">
              {{ bmiCategory }}
            </div>

            <!-- 进度条 -->
            <div class="bmi-bar-wrapper">
              <div class="bmi-bar">
                <div class="bmi-bar-segment" style="background: #3498db; width: 25%;" title="偏瘦"></div>
                <div class="bmi-bar-segment" style="background: #2ecc71; width: 25%;" title="正常"></div>
                <div class="bmi-bar-segment" style="background: #f39c12; width: 25%;" title="偏胖"></div>
                <div class="bmi-bar-segment" style="background: #e74c3c; width: 25%;" title="肥胖"></div>
              </div>
              <div class="bmi-bar-pointer" :style="{ left: pointerPosition + '%' }">
                <div class="bmi-pointer-arrow">▼</div>
              </div>
              <div class="bmi-bar-labels">
                <span>偏瘦</span>
                <span>正常</span>
                <span>偏胖</span>
                <span>肥胖</span>
              </div>
            </div>

            <!-- 健康建议 -->
            <div class="bmi-advice">
              <div class="bmi-advice-title">💡 健康建议</div>
              <div class="bmi-advice-text">{{ bmiAdvice }}</div>
            </div>

            <!-- 参考标准 -->
            <div class="bmi-reference">
              <div class="bmi-ref-title">📋 BMI 参考标准（中国标准）</div>
              <div class="bmi-ref-table">
                <div class="bmi-ref-row">
                  <span class="bmi-ref-range">< 18.5</span>
                  <span class="bmi-ref-label" style="color: #3498db;">偏瘦</span>
                  <span class="bmi-ref-desc">营养不良风险</span>
                </div>
                <div class="bmi-ref-row">
                  <span class="bmi-ref-range">18.5 ~ 23.9</span>
                  <span class="bmi-ref-label" style="color: #2ecc71;">正常</span>
                  <span class="bmi-ref-desc">健康体重范围</span>
                </div>
                <div class="bmi-ref-row">
                  <span class="bmi-ref-range">24 ~ 27.9</span>
                  <span class="bmi-ref-label" style="color: #f39c12;">偏胖</span>
                  <span class="bmi-ref-desc">需注意控制体重</span>
                </div>
                <div class="bmi-ref-row">
                  <span class="bmi-ref-range">≥ 28</span>
                  <span class="bmi-ref-label" style="color: #e74c3c;">肥胖</span>
                  <span class="bmi-ref-desc">建议咨询医生</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const BASE_URL = 'http://localhost:8080/api/user'

const height = ref(null)
const weight = ref(null)
const bmiResult = ref(null)

function goBack() {
  router.back()
}

// 从个人资料读取身高体重
async function loadFromProfile() {
  try {
    const res = await axios.get(BASE_URL + '/1')
    if (res.data.code === 200) {
      const user = res.data.data
      if (user.height) height.value = user.height
      if (user.weight) weight.value = user.weight
      if (height.value && weight.value) {
        calculateBMI()
      } else {
        alert('个人资料中缺少身高或体重信息，请先到个人中心填写')
      }
    }
  } catch (e) {
    alert('读取个人资料失败，请检查后端是否启动')
    console.error(e)
  }
}

// 计算BMI
function calculateBMI() {
  if (!height.value || !weight.value) {
    alert('请输入身高和体重 📏⚖️')
    return
  }
  if (height.value <= 0 || weight.value <= 0) {
    alert('身高和体重必须大于0')
    return
  }
  const heightM = height.value / 100
  const bmi = weight.value / (heightM * heightM)
  bmiResult.value = Math.round(bmi * 10) / 10
}

// BMI 颜色
const bmiColor = computed(() => {
  if (bmiResult.value === null) return '#999'
  const v = bmiResult.value
  if (v < 18.5) return '#3498db'
  if (v < 24) return '#2ecc71'
  if (v < 28) return '#f39c12'
  return '#e74c3c'
})

// BMI 分类
const bmiCategory = computed(() => {
  if (bmiResult.value === null) return ''
  const v = bmiResult.value
  if (v < 18.5) return '偏瘦 — 需要加强营养'
  if (v < 24) return '正常 — 请继续保持'
  if (v < 28) return '偏胖 — 注意控制饮食'
  return '肥胖 — 建议咨询医生'
})

// 进度条指针位置 (映射BMI 15~35 到 0~100%)
const pointerPosition = computed(() => {
  if (bmiResult.value === null) return 0
  const v = bmiResult.value
  if (v < 15) return 0
  if (v > 35) return 100
  return ((v - 15) / 20) * 100
})

// 健康建议
const bmiAdvice = computed(() => {
  if (bmiResult.value === null) return ''
  const v = bmiResult.value
  if (v < 18.5) return '建议适当增加热量摄入，多摄入优质蛋白质（鸡蛋、牛奶、鱼肉），配合力量训练增肌。'
  if (v < 24) return '体重处于健康范围，请继续保持均衡饮食和规律运动，每周至少运动3次。'
  if (v < 28) return '建议减少高热量食物摄入，增加有氧运动（跑步、游泳），每天控制饮食在合理范围。'
  return '建议尽快调整饮食结构，减少碳水和油脂摄入，坚持运动。如有需要请咨询专业医生。'
})
</script>

<style scoped>
.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #ff6b6b;
  cursor: pointer;
  padding: 8px 12px;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.bmi-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px 20px;
}

.bmi-container {
  max-width: 900px;
  margin: 0 auto;
}

.bmi-header {
  text-align: center;
  margin-bottom: 24px;
}

.bmi-header h1 {
  font-size: 28px;
  color: #fff;
  margin: 0;
}

.bmi-sub {
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  margin-top: 6px;
}

.bmi-dashboard {
  display: flex;
  gap: 20px;
}

.bmi-input-panel, .bmi-result-panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.bmi-input-panel {
  width: 280px;
  flex-shrink: 0;
}

.bmi-result-panel {
  flex: 1;
}

.bmi-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  border-left: 4px solid #2ec4b6;
  padding-left: 10px;
  margin-bottom: 20px;
}

.bmi-form-group {
  margin-bottom: 16px;
}

.bmi-form-group label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
}

.bmi-form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.bmi-form-group input:focus {
  border-color: #667eea;
}

.bmi-btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
  transition: transform 0.1s;
}

.bmi-btn-primary:active {
  transform: scale(0.98);
}

.bmi-btn-secondary {
  width: 100%;
  padding: 10px;
  background: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
}

.bmi-empty {
  text-align: center;
  color: #aaa;
  padding: 60px 20px;
  font-size: 15px;
}

.bmi-result-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.bmi-score-circle {
  width: 120px;
  height: 120px;
  border: 6px solid;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bmi-score-num {
  font-size: 36px;
  font-weight: bold;
}

.bmi-score-label {
  font-size: 12px;
  color: #999;
  margin-top: -2px;
}

.bmi-category {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: bold;
}

.bmi-bar-wrapper {
  width: 100%;
  padding: 0 10px;
  position: relative;
}

.bmi-bar {
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
}

.bmi-bar-segment {
  height: 100%;
}

.bmi-bar-pointer {
  position: relative;
  top: -6px;
  transition: left 0.5s ease;
}

.bmi-pointer-arrow {
  text-align: center;
  font-size: 16px;
  color: #333;
  line-height: 1;
}

.bmi-bar-labels {
  display: flex;
  justify-content: space-around;
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.bmi-advice {
  width: 100%;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 14px;
}

.bmi-advice-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}

.bmi-advice-text {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.bmi-reference {
  width: 100%;
}

.bmi-ref-title {
  font-size: 13px;
  font-weight: bold;
  color: #555;
  margin-bottom: 8px;
}

.bmi-ref-table {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bmi-ref-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  padding: 4px 0;
}

.bmi-ref-range {
  width: 90px;
  color: #666;
  font-family: monospace;
}

.bmi-ref-label {
  width: 40px;
  font-weight: bold;
}

.bmi-ref-desc {
  color: #999;
  font-size: 12px;
}

@media (max-width: 640px) {
  .bmi-dashboard {
    flex-direction: column;
  }
  .bmi-input-panel {
    width: 100%;
  }
}
</style>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const router = useRouter();

// 用户信息
const userInfo = ref({
    nickname: '用户',
    avatar: '👤'
});

// 今日统计
const todayStats = ref({
    caloriesIn: 0,
    caloriesOut: 0,
    weightLost: 0
});
    const aiResult = ref(null);
    const aiLoading = ref(false);
// AI智能分析
    async function loadAiAnalysis() {
        aiLoading.value = true;
        try {
            const res = await axios.get('http://localhost:8080/api/ai/analyze', {
                params: { userId: 1 }
            });
            if (res.data.code === 200) {
                aiResult.value = JSON.parse(res.data.data);
                // 存到缓存
                localStorage.setItem('ai_analysis', res.data.data);
            }
        } catch (e) {
            console.error('AI分析失败', e);
        } finally {
            aiLoading.value = false;
        }
    }

// 获取用户信息
async function loadUser() {
    try {
        const res = await axios.get('http://localhost:8080/api/user/1');
        if (res.data.code === 200) {
            const user = res.data.data;
            userInfo.value = {
                nickname: user.nickname || user.username || '用户',
                avatar: user.avatar || '👤'
            };
        }
    } catch (e) {
        console.error('加载用户信息失败', e);
    }
}

// 获取今日饮食统计
async function loadTodayDiet() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const res = await axios.get('http://localhost:8080/api/diet/list', {
            params: { userId: 1, date: today }
        });
        if (res.data.code === 200) {
            const list = res.data.data || [];
            todayStats.value.caloriesIn = list.reduce((sum, item) => sum + (item.calories || 0), 0);
        }
    } catch (e) {
        console.error('加载饮食数据失败', e);
    }
}

// 获取今日运动统计
async function loadTodaySport() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const res = await axios.get('http://localhost:8080/api/sport/list', {
            params: { userId: 1 }
        });
        if (res.data.code === 200) {
            const list = (res.data.data || []).filter(item => item.recordDate === today);
            todayStats.value.caloriesOut = list.reduce((sum, item) => sum + (item.calories || 0), 0);
        }
    } catch (e) {
        console.error('加载运动数据失败', e);
    }
}

function goTo(path) {
    router.push(path);
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        sessionStorage.removeItem('token');
        router.push('/login');
    }
}

function goToProfile() {
    router.push('/profile');
}

onMounted(() => {
    loadUser();
    loadTodayDiet();
    loadTodaySport();
    // 读取缓存的AI分析结果
        const cached = localStorage.getItem('ai_analysis');
        if (cached) {
            try {
                aiResult.value = JSON.parse(cached);
            } catch (e) {}
        }
});
</script>

<template>
    <div class="home">
        <!-- 顶部 -->
        <div class="header">
            <h1>🏋️ 减脂小助手</h1>
            <div class="header-right">
                <div class="user-info" @click="goToProfile">
                    <span class="user-avatar">{{ userInfo.avatar }}</span>
                    <span class="user-name">{{ userInfo.nickname }}</span>
                    <span class="arrow">›</span>
                </div>
                <button class="logout-btn" @click="logout">退出</button>
            </div>
        </div>

        <!-- 欢迎语 -->
        <div class="welcome">
            <p>👋 你好，{{ userInfo.nickname }}！今天也要加油哦 💪</p>
        </div>

        <!-- 功能菜单 -->
        <div class="menu-grid">
            <div class="menu-card" @click="goTo('/bmi')">
                <div class="icon">📊</div>
                <div class="name">BMI 检测</div>
            </div>
            <div class="menu-card" @click="goTo('/diet')">
                <div class="icon">🍽️</div>
                <div class="name">饮食记录</div>
            </div>
            <div class="menu-card" @click="goTo('/sport')">
                <div class="icon">🏃</div>
                <div class="name">运动记录</div>
            </div>
            <div class="menu-card" @click="goTo('/progress')">
                <div class="icon">📈</div>
                <div class="name">进度跟踪</div>
            </div>
        </div>

        <!-- 底部统计 -->
        <div class="stats">
            <div class="stat-item">
                <span class="num">{{ todayStats.caloriesIn }}</span>
                <span class="label">今日摄入 (kcal)</span>
            </div>
            <div class="stat-item">
                <span class="num">{{ todayStats.caloriesOut }}</span>
                <span class="label">今日消耗 (kcal)</span>
            </div>
            <div class="stat-item">
                <span class="num">{{ todayStats.weightLost }}</span>
                <span class="label">已减 (kg)</span>
            </div>
        </div>
        <!-- AI智能分析 ← 在这里添加 -->
            <div class="ai-card">
                <div class="ai-header">
                    <span>🤖 AI 智能分析</span>
                    <button class="ai-refresh" @click="loadAiAnalysis">🔄</button>
                </div>
                <div v-if="aiLoading" class="ai-loading">分析中...</div>
                <div v-else-if="aiResult" class="ai-content">
                    <div class="ai-stats">
                        <div class="ai-stat">
                            <span class="ai-num">{{ aiResult.caloriesIn }}</span>
                            <span class="ai-label">摄入 kcal</span>
                        </div>
                        <div class="ai-stat">
                            <span class="ai-num">{{ aiResult.caloriesOut }}</span>
                            <span class="ai-label">消耗 kcal</span>
                        </div>
                    </div>
                    <div class="ai-advice">
                        <p>💡 {{ aiResult.summary }}</p>
                    </div>
                </div>
                <div v-else class="ai-empty">暂无数据</div>
            </div>
    </div>
</template>

<style scoped>
.home {
    min-height: 100vh;
    background: #f0f2f5;
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 16px 24px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.header h1 {
    color: #ff6b6b;
    font-size: 24px;
    margin: 0;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 6px 14px 6px 10px;
    border-radius: 20px;
    transition: background 0.2s;
}

.user-info:hover {
    background: #f5f5f5;
}

.user-avatar {
    font-size: 28px;
    line-height: 1;
}

.user-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.arrow {
    font-size: 18px;
    color: #bbb;
    margin-left: 2px;
}

.logout-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    background: #ff6b6b;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
}

.logout-btn:hover {
    background: #e55a5a;
}

.welcome {
    background: white;
    padding: 16px 24px;
    border-radius: 16px;
    margin-top: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.welcome p {
    font-size: 18px;
    color: #333;
    margin: 0;
}

.welcome .goal {
    font-size: 14px;
    color: #ff6b6b;
    background: #fff0f0;
    padding: 4px 14px;
    border-radius: 12px;
}

.menu-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 20px;
}

.menu-card {
    background: white;
    padding: 24px 16px;
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: transform 0.2s, box-shadow 0.2s;
}

.menu-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.menu-card .icon {
    font-size: 36px;
}

.menu-card .name {
    margin-top: 10px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 20px;
}

.stat-item {
    background: white;
    padding: 20px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.stat-item .num {
    display: block;
    font-size: 28px;
    font-weight: bold;
    color: #ff6b6b;
}

.stat-item .label {
    font-size: 14px;
    color: #888;
    margin-top: 4px;
}

/* AI分析卡片 ← 在这里添加 */
    .ai-card {
        background: white;
        border-radius: 16px;
        padding: 20px;
        margin-top: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .ai-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .ai-header span {
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }

    .ai-refresh {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
    }

    .ai-loading {
        text-align: center;
        color: #888;
        padding: 20px;
    }

    .ai-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 16px;
    }

    .ai-stat {
        text-align: center;
    }

    .ai-num {
        display: block;
        font-size: 24px;
        font-weight: bold;
        color: #ff6b6b;
    }

    .ai-label {
        font-size: 12px;
        color: #888;
    }

    .ai-advice {
        background: #f8f9fa;
        padding: 12px;
        border-radius: 12px;
    }

    .ai-advice p {
        margin: 0;
        font-size: 14px;
        color: #555;
        line-height: 1.5;
    }

    .ai-empty {
        text-align: center;
        color: #888;
        padding: 20px;
    }
</style>
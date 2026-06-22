<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const router = useRouter();
const BASE_URL = 'http://localhost:8080/api/user';

// 用户信息
const user = ref({
    id: 1,
    username: '',
    nickname: '',
    email: '',
    phone: '',
    gender: 1,
    birthDate: '',
    height: null,
    avatar: ''
});

// 编辑状态
const isEditing = ref(false);
const editForm = ref({});
const message = ref('');

// 计算年龄
const age = computed(() => {
    if (!user.value.birthDate) return '未填写';
    const birth = new Date(user.value.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age + '岁';
});

// 性别显示
const genderText = computed(() => {
    return user.value.gender === 1 ? '男' : '女';
});

// 获取用户信息
async function loadUser() {
    try {
        const res = await axios.get(BASE_URL + '/1');
        if (res.data.code === 200) {
            user.value = res.data.data;
        }
    } catch (e) {
        console.error('加载用户信息失败', e);
    }
}

// 开始编辑
function startEdit() {
    editForm.value = { ...user.value };
    isEditing.value = true;
}

// 取消编辑
function cancelEdit() {
    isEditing.value = false;
    editForm.value = {};
}

// 保存编辑
async function saveEdit() {
    try {
        const res = await axios.put(BASE_URL + '/update', editForm.value);
        if (res.data.code === 200) {
            showMessage('✅ 保存成功');
            isEditing.value = false;
            loadUser(); // 重新加载
        } else {
            alert(res.data.message);
        }
    } catch (e) {
        alert('保存失败，请检查后端是否启动');
        console.error(e);
    }
}

// 显示提示
function showMessage(msg) {
    message.value = msg;
    setTimeout(() => { message.value = ''; }, 1800);
}

function goBack() {
    router.back();
}

onMounted(() => {
    loadUser();
});
</script>

<template>
    <div class="profile-page">
        <!-- 顶部导航 -->
        <div class="nav-header">
            <button class="back-btn" @click="goBack">‹ 返回</button>
            <span class="page-title">个人中心</span>
            <button v-if="!isEditing" class="edit-btn" @click="startEdit">编辑</button>
            <span v-else class="placeholder"></span>
        </div>

        <!-- 用户卡片 -->
        <div class="user-card">
            <div class="user-avatar-large">
                {{ user.avatar || '👤' }}
            </div>
            <div class="user-details">
                <div class="name">{{ user.nickname || user.username }}</div>
                <div class="sub-info">
                    {{ genderText }} · {{ age }}
                    <span v-if="user.height"> · {{ user.height }}cm</span>
                </div>
            </div>
        </div>

        <!-- 查看模式 -->
        <div v-if="!isEditing" class="info-section">
            <div class="info-item">
                <span class="info-label">👤 用户名</span>
                <span class="info-value">{{ user.username }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">✏️ 昵称</span>
                <span class="info-value">{{ user.nickname || '未填写' }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">📧 邮箱</span>
                <span class="info-value">{{ user.email || '未填写' }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">📱 手机号</span>
                <span class="info-value">{{ user.phone || '未填写' }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">⚧ 性别</span>
                <span class="info-value">{{ genderText }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">🎂 出生日期</span>
                <span class="info-value">{{ user.birthDate || '未填写' }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">📏 身高</span>
                <span class="info-value">{{ user.height ? user.height + 'cm' : '未填写' }}</span>
            </div>
        </div>

        <!-- 编辑模式 -->
        <div v-else class="edit-section">
            <div class="form-group">
                <label>✏️ 昵称</label>
                <input v-model="editForm.nickname" placeholder="请输入昵称" />
            </div>
            <div class="form-group">
                <label>📧 邮箱</label>
                <input v-model="editForm.email" placeholder="请输入邮箱" />
            </div>
            <div class="form-group">
                <label>📱 手机号</label>
                <input v-model="editForm.phone" placeholder="请输入手机号" />
            </div>
            <div class="form-group">
                <label>⚧ 性别</label>
                <select v-model="editForm.gender">
                    <option :value="1">男</option>
                    <option :value="0">女</option>
                </select>
            </div>
            <div class="form-group">
                <label>🎂 出生日期</label>
                <input type="date" v-model="editForm.birthDate" />
            </div>
            <div class="form-group">
                <label>📏 身高 (cm)</label>
                <input type="number" v-model.number="editForm.height" placeholder="请输入身高" />
            </div>

            <div class="btn-group">
                <button class="save-btn" @click="saveEdit">💾 保存</button>
                <button class="cancel-btn" @click="cancelEdit">❌ 取消</button>
            </div>
        </div>

        <!-- 提示消息 -->
        <div v-if="message" class="toast-msg">{{ message }}</div>
    </div>
</template>

<style scoped>
.profile-page {
    min-height: 100vh;
    background: #f0f2f5;
    padding: 20px;
    padding-bottom: 40px;
    position: relative;
}

/* 导航 */
.nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px 16px 4px;
}

.back-btn {
    background: none;
    border: none;
    font-size: 16px;
    color: #ff6b6b;
    cursor: pointer;
    padding: 8px 0;
}

.edit-btn {
    background: none;
    border: none;
    font-size: 14px;
    color: #ff6b6b;
    cursor: pointer;
    padding: 8px 0;
}

.page-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.placeholder {
    width: 60px;
}

/* 用户卡片 */
.user-card {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    border-radius: 20px;
    padding: 24px;
    color: white;
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 20px;
}

.user-avatar-large {
    font-size: 56px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.user-details {
    flex: 1;
}

.user-details .name {
    font-size: 22px;
    font-weight: 600;
}

.user-details .sub-info {
    font-size: 14px;
    opacity: 0.9;
    margin-top: 4px;
}

/* 信息展示 */
.info-section {
    background: white;
    border-radius: 16px;
    padding: 8px 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
    border-bottom: none;
}

.info-label {
    font-size: 14px;
    color: #666;
}

.info-value {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

/* 编辑模式 */
.edit-section {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 6px;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
    border-color: #ff6b6b;
}

.btn-group {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.save-btn,
.cancel-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

.save-btn {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
}

.cancel-btn {
    background: #f0f0f0;
    color: #666;
}

.save-btn:hover,
.cancel-btn:hover {
    opacity: 0.9;
}

/* 提示消息 */
.toast-msg {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 1000;
}
</style>

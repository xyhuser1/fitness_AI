const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "谢";
pres.title = "减脂小助手 - 答辩PPT";

// ====== Color Palette ======
const C = {
  coral: "FF6B6B",      // primary accent
  teal: "2EC4B6",       // secondary
  navy: "1A1A2E",       // dark bg
  darkBlue: "16213E",   // slightly lighter navy
  white: "FFFFFF",
  offWhite: "F7F7F7",
  lightGray: "EAEAEA",
  midGray: "8B8B8B",
  darkText: "2D2D2D",
  cardBg: "FFFFFF",
  green: "4CAF50",
  orange: "FF9800",
  purple: "7C4DFF",
};

const FONT_H = "Arial Black";
const FONT_B = "Arial";

const mkShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.1 });

// ============================================================
// SLIDE 1 - Title
// ============================================================
let s1 = pres.addSlide();
s1.background = { color: C.navy };
// Decorative shapes
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.coral } });
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.565, w: 10, h: 0.06, fill: { color: C.coral } });
// Left accent bar
s1.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 0.08, h: 2.8, fill: { color: C.teal } });
// Main title
s1.addText("减脂小助手", {
  x: 1.0, y: 1.2, w: 8.5, h: 1.2,
  fontSize: 44, fontFace: FONT_H, color: C.white, bold: true, margin: 0
});
// Subtitle
s1.addText("基于 Vue3 + SpringBoot 的智能健康管理平台", {
  x: 1.0, y: 2.3, w: 8.5, h: 0.6,
  fontSize: 20, fontFace: FONT_B, color: C.teal, margin: 0
});
// Info line
s1.addText([
  { text: "答辩人：谢", options: { breakLine: true } },
  { text: "广西中医药大学", options: { breakLine: true } },
  { text: "信息管理与信息系统专业", options: {} }
], {
  x: 1.0, y: 3.4, w: 5, h: 1.2,
  fontSize: 16, fontFace: FONT_B, color: C.midGray, lineSpacingMultiple: 1.5, margin: 0
});
// Decorative emoji
s1.addText("💪", { x: 8.2, y: 3.2, w: 1, h: 1, fontSize: 48, align: "center", valign: "middle" });

// ============================================================
// SLIDE 2 - Project Background
// ============================================================
let s2 = pres.addSlide();
s2.background = { color: C.offWhite };
s2.addText("项目背景", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.navy, bold: true, margin: 0
});
s2.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

// Problem cards - 3 cards in a row
const problems = [
  { icon: "🪑", title: "久坐少动", desc: "大学生长时间坐在教室和宿舍\n缺乏规律的体育锻炼" },
  { icon: "🍔", title: "饮食不规律", desc: "外卖频繁、三餐不定\n热量摄入难以控制" },
  { icon: "📊", title: "缺乏量化管理", desc: "没有便捷的工具记录\n和分析自己的健康数据" },
];
problems.forEach((p, i) => {
  let cx = 0.5 + i * 3.1;
  s2.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.4, w: 2.8, h: 2.8, fill: { color: C.cardBg }, shadow: mkShadow() });
  s2.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.4, w: 2.8, h: 0.06, fill: { color: C.coral } });
  s2.addText(p.icon, { x: cx, y: 1.6, w: 2.8, h: 0.6, fontSize: 32, align: "center" });
  s2.addText(p.title, { x: cx, y: 2.2, w: 2.8, h: 0.4, fontSize: 18, fontFace: FONT_H, color: C.navy, align: "center", bold: true, margin: 0 });
  s2.addText(p.desc, { x: cx + 0.2, y: 2.65, w: 2.4, h: 1.2, fontSize: 13, fontFace: FONT_B, color: C.midGray, align: "center", lineSpacingMultiple: 1.4, margin: 0 });
});

// Solution banner
s2.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.5, w: 9, h: 0.8, fill: { color: C.coral } });
s2.addText("→  解决方案：开发一款集饮食记录、运动追踪、AI智能分析于一体的减脂管理平台", {
  x: 0.5, y: 4.5, w: 9, h: 0.8,
  fontSize: 16, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0
});

// ============================================================
// SLIDE 3 - System Overview (6 features)
// ============================================================
let s3 = pres.addSlide();
s3.background = { color: C.offWhite };
s3.addText("系统功能总览", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.navy, bold: true, margin: 0
});
s3.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

const features = [
  { icon: "👤", title: "用户管理", desc: "注册登录、个人资料\n权限控制" },
  { icon: "🍱", title: "饮食记录", desc: "记录每餐食物\n自动AI估算热量" },
  { icon: "🏃", title: "运动记录", desc: "记录运动项目与时长\nAI计算消耗热量" },
  { icon: "📊", title: "BMI 检测", desc: "基于身高体重计算\n健康体重评估" },
  { icon: "✅", title: "每日打卡", desc: "6项健康目标\n连续打卡统计" },
  { icon: "🤖", title: "AI分析", desc: "DeepSeek智能分析\n个性化健康建议" },
  { icon: "📈", title: "进度追踪", desc: "历史数据查看\n减脂趋势可视化" },
];
features.forEach((f, i) => {
  let row = Math.floor(i / 3), col = i % 3;
  let cx = 0.5 + col * 3.1, cy = 1.3 + row * 2.0;
  s3.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 2.8, h: 1.7, fill: { color: C.cardBg }, shadow: mkShadow() });
  s3.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 0.08, h: 1.7, fill: { color: C.teal } });
  s3.addText(f.icon, { x: cx + 0.2, y: cy + 0.15, w: 0.5, h: 0.5, fontSize: 24 });
  s3.addText(f.title, { x: cx + 0.75, y: cy + 0.15, w: 1.8, h: 0.4, fontSize: 16, fontFace: FONT_H, color: C.navy, bold: true, margin: 0 });
  s3.addText(f.desc, { x: cx + 0.75, y: cy + 0.55, w: 1.8, h: 1.0, fontSize: 12, fontFace: FONT_B, color: C.midGray, lineSpacingMultiple: 1.3, margin: 0 });
});

// ============================================================
// SLIDE 4 - Tech Stack
// ============================================================
let s4 = pres.addSlide();
s4.background = { color: C.offWhite };
s4.addText("技术选型", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.navy, bold: true, margin: 0
});
s4.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

// Layered stack - horizontal bars
const layers = [
  { label: "前端层", techs: "Vue 3.5  ·  Vite 8  ·  Vue Router 5  ·  Axios", color: C.teal },
  { label: "后端层", techs: "Spring Boot 3.1  ·  RESTful API  ·  CORS", color: "4A90D9" },
  { label: "持久层", techs: "MyBatis-Plus 3.5  ·  MySQL 8.0  ·  Redis", color: C.orange },
  { label: "AI 层", techs: "DeepSeek Chat API  ·  智能热量估算  ·  健康分析", color: C.purple },
  { label: "工具层", techs: "Lombok  ·  JDK 17  ·  Maven  ·  IntelliJ IDEA", color: C.midGray },
];
layers.forEach((l, i) => {
  let cy = 1.3 + i * 0.82;
  s4.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: cy, w: 2.0, h: 0.65, fill: { color: l.color } });
  s4.addText(l.label, { x: 0.5, y: cy, w: 2.0, h: 0.65, fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
  s4.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: cy, w: 7.0, h: 0.65, fill: { color: C.cardBg }, shadow: mkShadow() });
  s4.addText(l.techs, { x: 2.7, y: cy, w: 6.6, h: 0.65, fontSize: 15, fontFace: FONT_B, color: C.darkText, valign: "middle", margin: 0 });
});

// ============================================================
// SLIDE 5 - Architecture Diagram
// ============================================================
let s5 = pres.addSlide();
s5.background = { color: C.offWhite };
s5.addText("系统架构", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.navy, bold: true, margin: 0
});
s5.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

// Frontend box
s5.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 2.8, h: 3.5, fill: { color: "E8F5E9" }, shadow: mkShadow() });
s5.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 2.8, h: 0.5, fill: { color: C.teal } });
s5.addText("前端 (Vue 3)", { x: 0.5, y: 1.4, w: 2.8, h: 0.5, fontSize: 15, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
const feItems = ["登录 / 注册页", "首页仪表盘", "BMI 检测页", "饮食记录页", "运动记录页", "打卡进度页", "个人中心页"];
feItems.forEach((item, i) => {
  s5.addText("• " + item, { x: 0.7, y: 2.0 + i * 0.42, w: 2.4, h: 0.35, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0 });
});

// Arrow
s5.addText("REST API\n(Axios HTTP)", { x: 3.5, y: 2.5, w: 1.2, h: 0.8, fontSize: 11, fontFace: FONT_B, color: C.coral, align: "center", valign: "middle", margin: 0 });
s5.addText("→", { x: 3.5, y: 2.0, w: 1.2, h: 0.5, fontSize: 28, color: C.coral, align: "center" });

// Backend box
s5.addShape(pres.shapes.RECTANGLE, { x: 4.9, y: 1.4, w: 2.3, h: 3.5, fill: { color: "E3F2FD" }, shadow: mkShadow() });
s5.addShape(pres.shapes.RECTANGLE, { x: 4.9, y: 1.4, w: 2.3, h: 0.5, fill: { color: "4A90D9" } });
s5.addText("后端 (Spring Boot)", { x: 4.9, y: 1.4, w: 2.3, h: 0.5, fontSize: 14, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
const beItems = ["UserController", "DietRecordCtrl", "SportRecordCtrl", "CheckinCtrl", "AiController"];
beItems.forEach((item, i) => {
  s5.addText("• " + item, { x: 5.1, y: 2.0 + i * 0.42, w: 2.0, h: 0.35, fontSize: 12, fontFace: FONT_B, color: C.darkText, margin: 0 });
});

// Arrow
s5.addText("→", { x: 7.3, y: 2.8, w: 0.5, h: 0.5, fontSize: 28, color: C.orange, align: "center" });
s5.addText("MyBatis-Plus", { x: 6.5, y: 2.1, w: 1.2, h: 0.35, fontSize: 8, fontFace: FONT_B, color: C.orange, align: "center", margin: 0 });

// Database box
s5.addShape(pres.shapes.RECTANGLE, { x: 7.7, y: 1.4, w: 1.8, h: 1.8, fill: { color: "FFF3E0" }, shadow: mkShadow() });
s5.addShape(pres.shapes.RECTANGLE, { x: 7.7, y: 1.4, w: 1.8, h: 0.45, fill: { color: C.orange } });
s5.addText("MySQL", { x: 7.7, y: 1.4, w: 1.8, h: 0.45, fontSize: 14, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
s5.addText("user 表\ndiet_record\nsport_record\ncheckin_record", { x: 7.8, y: 1.95, w: 1.6, h: 1.1, fontSize: 11, fontFace: FONT_B, color: C.darkText, lineSpacingMultiple: 1.3, margin: 0 });

// AI box
s5.addShape(pres.shapes.RECTANGLE, { x: 7.7, y: 3.5, w: 1.8, h: 1.4, fill: { color: "F3E5F5" }, shadow: mkShadow() });
s5.addShape(pres.shapes.RECTANGLE, { x: 7.7, y: 3.5, w: 1.8, h: 0.45, fill: { color: C.purple } });
s5.addText("DeepSeek AI", { x: 7.7, y: 3.5, w: 1.8, h: 0.45, fontSize: 14, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
s5.addText("食物热量估算\n运动消耗计算\n综合健康分析", { x: 7.8, y: 4.05, w: 1.6, h: 0.8, fontSize: 11, fontFace: FONT_B, color: C.darkText, lineSpacingMultiple: 1.3, margin: 0 });
// Arrow to AI
s5.addText("AI API ↗", { x: 6.9, y: 3.8, w: 0.8, h: 0.4, fontSize: 9, fontFace: FONT_B, color: C.purple, align: "center", margin: 0 });

// ============================================================
// SLIDE 6 - Database Design
// ============================================================
let s6 = pres.addSlide();
s6.background = { color: C.offWhite };
s6.addText("数据库设计", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.navy, bold: true, margin: 0
});
s6.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

// 4 table cards
const tables = [
  {
    name: "user（用户表）", color: C.teal,
    fields: "id, username, password\nemail, phone, nickname\ngender, birthDate\nheight, weight, avatar\nstatus, createdAt"
  },
  {
    name: "diet_record（饮食）", color: "4A90D9",
    fields: "id, userId (FK)\nrecordDate, mealType\nfoodName, calories\ncreatedAt"
  },
  {
    name: "sport_record（运动）", color: C.orange,
    fields: "id, userId (FK)\nexerciseType, exerciseName\nduration, calories\nnotes, recordDate"
  },
  {
    name: "checkin_record（打卡）", color: C.purple,
    fields: "id, userId (FK)\ncheckinDate\nexercise, diet, water\nsleep, nosnack\nweightLog"
  },
];
tables.forEach((t, i) => {
  let col = i % 2, row = Math.floor(i / 2);
  let cx = 0.5 + col * 4.7, cy = 1.3 + row * 2.1;
  s6.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 4.4, h: 1.85, fill: { color: C.cardBg }, shadow: mkShadow() });
  s6.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 4.4, h: 0.45, fill: { color: t.color } });
  s6.addText(t.name, { x: cx, y: cy, w: 4.4, h: 0.45, fontSize: 14, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
  s6.addText(t.fields, { x: cx + 0.2, y: cy + 0.5, w: 4.0, h: 1.3, fontSize: 11, fontFace: FONT_B, color: C.darkText, lineSpacingMultiple: 1.25, margin: 0 });
});

// ============================================================
// SLIDE 7 - User System
// ============================================================
let s7 = pres.addSlide();
s7.background = { color: C.offWhite };
s7.addText("核心功能：用户系统 & BMI检测", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.navy, bold: true, margin: 0
});
s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

// Two columns
// Left - Registration
s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 3.8, fill: { color: C.cardBg }, shadow: mkShadow() });
s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.5, fill: { color: C.teal } });
s7.addText("注册 / 登录", { x: 0.5, y: 1.3, w: 4.3, h: 0.5, fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
s7.addText([
  { text: "注册功能", options: { bold: true, breakLine: true, fontSize: 14, color: C.navy } },
  { text: "用户名唯一性校验", options: { bullet: true, breakLine: true } },
  { text: "密码格式验证（6-10位，字母+数字）", options: { bullet: true, breakLine: true } },
  { text: "确认密码一致性检查", options: { bullet: true, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "登录功能", options: { bold: true, breakLine: true, fontSize: 14, color: C.navy } },
  { text: "用户名密码验证", options: { bullet: true, breakLine: true } },
  { text: "用户状态检查（status字段）", options: { bullet: true, breakLine: true } },
  { text: "SessionStorage存储登录状态", options: { bullet: true, breakLine: true } },
  { text: "路由守卫 beforeEach 保护", options: { bullet: true } },
], {
  x: 0.8, y: 1.9, w: 3.8, h: 3.0, fontSize: 12, fontFace: FONT_B, color: C.darkText, paraSpaceAfter: 2, margin: 0
});

// Right - Profile
s7.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 3.8, fill: { color: C.cardBg }, shadow: mkShadow() });
s7.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fill: { color: C.coral } });
s7.addText("BMI 检测", { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
s7.addText([
  { text: "检测原理", options: { bold: true, breakLine: true, fontSize: 14, color: C.navy } },
  { text: "BMI = 体重(kg) ÷ 身高(m)²", options: { bullet: true, breakLine: true } },
  { text: "基于用户填写的身高体重自动计算", options: { bullet: true, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "健康评估标准", options: { bold: true, breakLine: true, fontSize: 14, color: C.navy } },
  { text: "偏瘦：< 18.5", options: { bullet: true, breakLine: true } },
  { text: "正常：18.5 ~ 23.9", options: { bullet: true, breakLine: true } },
  { text: "偏胖：24 ~ 27.9", options: { bullet: true, breakLine: true } },
  { text: "肥胖：≥ 28", options: { bullet: true } },
], {
  x: 5.5, y: 1.9, w: 3.8, h: 3.0, fontSize: 12, fontFace: FONT_B, color: C.darkText, paraSpaceAfter: 2, margin: 0
});

// ============================================================
// SLIDE 8 - Diet & Sport Recording
// ============================================================
let s8 = pres.addSlide();
s8.background = { color: C.offWhite };
s8.addText("核心功能：饮食与运动记录", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.navy, bold: true, margin: 0
});
s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

// Diet column
s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 3.8, fill: { color: C.cardBg }, shadow: mkShadow() });
s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.5, fill: { color: C.teal } });
s8.addText("🍱 饮食记录", { x: 0.5, y: 1.3, w: 4.3, h: 0.5, fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
s8.addText([
  { text: "记录内容", options: { bold: true, breakLine: true, fontSize: 14, color: C.navy } },
  { text: "餐次选择（早/午/晚/加餐）", options: { bullet: true, breakLine: true } },
  { text: "食物名称", options: { bullet: true, breakLine: true } },
  { text: "卡路里（可手动或AI自动）", options: { bullet: true, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "AI智能估算", options: { bold: true, breakLine: true, fontSize: 14, color: C.coral } },
  { text: "输入食物名称 → DeepSeek自动", options: { bullet: true, breakLine: true } },
  { text: "返回估算热量(kcal)", options: { bullet: true, breakLine: true } },
  { text: "支持按日期筛选查询", options: { bullet: true } },
], {
  x: 0.8, y: 1.9, w: 3.8, h: 3.0, fontSize: 12, fontFace: FONT_B, color: C.darkText, paraSpaceAfter: 2, margin: 0
});

// Sport column
s8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 3.8, fill: { color: C.cardBg }, shadow: mkShadow() });
s8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fill: { color: C.coral } });
s8.addText("🏃 运动记录", { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
s8.addText([
  { text: "记录内容", options: { bold: true, breakLine: true, fontSize: 14, color: C.navy } },
  { text: "运动类型（有氧/力量/柔韧/球类）", options: { bullet: true, breakLine: true } },
  { text: "运动项目名称", options: { bullet: true, breakLine: true } },
  { text: "时长（分钟）+ 消耗热量", options: { bullet: true, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "AI智能估算", options: { bold: true, breakLine: true, fontSize: 14, color: C.coral } },
  { text: "根据运动名+时长 → DeepSeek", options: { bullet: true, breakLine: true } },
  { text: "估算70kg体重消耗热量", options: { bullet: true, breakLine: true } },
  { text: "支持备注说明", options: { bullet: true } },
], {
  x: 5.5, y: 1.9, w: 3.8, h: 3.0, fontSize: 12, fontFace: FONT_B, color: C.darkText, paraSpaceAfter: 2, margin: 0
});

// ============================================================
// SLIDE 9 - AI Analysis
// ============================================================
let s9 = pres.addSlide();
s9.background = { color: C.navy };
s9.addText("核心功能：AI 智能分析", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.white, bold: true, margin: 0
});
s9.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

// Flow diagram - horizontal steps
const steps = [
  { icon: "📋", title: "采集数据", desc: "用户信息\n今日饮食记录\n今日运动记录", color: C.teal },
  { icon: "🤖", title: "AI分析", desc: "构造Prompt\n调用DeepSeek API\n结构化JSON返回", color: C.purple },
  { icon: "📊", title: "展示结果", desc: "热量摄入/消耗\n平衡分析\n饮食运动建议", color: C.coral },
];
steps.forEach((st, i) => {
  let cx = 0.4 + i * 3.3;
  s9.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.3, w: 2.8, h: 2.8, fill: { color: C.darkBlue }, shadow: mkShadow() });
  s9.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.3, w: 2.8, h: 0.06, fill: { color: st.color } });
  s9.addText(st.icon, { x: cx, y: 1.5, w: 2.8, h: 0.5, fontSize: 28, align: "center" });
  s9.addText(st.title, { x: cx, y: 2.0, w: 2.8, h: 0.4, fontSize: 18, fontFace: FONT_H, color: st.color, align: "center", bold: true, margin: 0 });
  s9.addText(st.desc, { x: cx + 0.3, y: 2.5, w: 2.2, h: 1.3, fontSize: 13, fontFace: FONT_B, color: C.midGray, align: "center", lineSpacingMultiple: 1.4, margin: 0 });
  // Arrow between steps
  if (i < 2) {
    s9.addText("→", { x: cx + 2.8, y: 2.2, w: 0.5, h: 0.5, fontSize: 28, color: C.coral, align: "center" });
  }
});

// Prompt example
s9.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.4, w: 9, h: 0.9, fill: { color: C.darkBlue } });
s9.addText("Prompt示例：\"你是专业营养师和健身教练。根据用户信息和今日记录进行分析，返回JSON格式：caloriesIn, caloriesOut, balance, dietAdvice, sportAdvice, summary\"", {
  x: 0.7, y: 4.4, w: 8.6, h: 0.9,
  fontSize: 11, fontFace: FONT_B, color: C.midGray, valign: "middle", margin: 0
});

// ============================================================
// SLIDE 10 - Daily Check-in
// ============================================================
let s10 = pres.addSlide();
s10.background = { color: C.offWhite };
s10.addText("核心功能：每日打卡", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.navy, bold: true, margin: 0
});
s10.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

// 6 check-in items in 2x3 grid
const checkItems = [
  { icon: "🏃", name: "运动打卡", desc: "今日是否完成运动" },
  { icon: "🥗", name: "饮食控制", desc: "饮食是否合理" },
  { icon: "💧", name: "喝水达标", desc: "每日饮水量达标" },
  { icon: "😴", name: "睡眠质量", desc: "睡眠是否充足" },
  { icon: "🚫", name: "拒绝零食", desc: "未吃高热量零食" },
  { icon: "⚖️", name: "体重记录", desc: "今日是否称重" },
];
checkItems.forEach((item, i) => {
  let col = i % 3, row = Math.floor(i / 3);
  let cx = 0.5 + col * 3.1, cy = 1.3 + row * 1.5;
  s10.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 2.8, h: 1.2, fill: { color: C.cardBg }, shadow: mkShadow() });
  s10.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 0.08, h: 1.2, fill: { color: C.teal } });
  s10.addText(item.icon, { x: cx + 0.2, y: cy + 0.1, w: 0.5, h: 0.5, fontSize: 22 });
  s10.addText(item.name, { x: cx + 0.75, y: cy + 0.1, w: 1.8, h: 0.35, fontSize: 15, fontFace: FONT_H, color: C.navy, bold: true, margin: 0 });
  s10.addText(item.desc, { x: cx + 0.75, y: cy + 0.5, w: 1.8, h: 0.5, fontSize: 12, fontFace: FONT_B, color: C.midGray, margin: 0 });
});

// Streak feature
s10.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.5, w: 9, h: 0.8, fill: { color: C.coral } });
s10.addText("🔥 连续打卡机制：每日完成进度实时显示 → 完成全部6项获得完美打卡 → 连续天数累计激励", {
  x: 0.5, y: 4.5, w: 9, h: 0.8,
  fontSize: 15, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0
});

// ============================================================
// SLIDE 11 - Summary & Future
// ============================================================
let s11 = pres.addSlide();
s11.background = { color: C.offWhite };
s11.addText("总结与展望", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: FONT_H, color: C.navy, bold: true, margin: 0
});
s11.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 1.5, h: 0.05, fill: { color: C.coral } });

// Left - Achievements
s11.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 3.8, fill: { color: C.cardBg }, shadow: mkShadow() });
s11.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.5, fill: { color: C.teal } });
s11.addText("✅ 已实现功能", { x: 0.5, y: 1.3, w: 4.3, h: 0.5, fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
s11.addText([
  { text: "前后端分离架构，RESTful API", options: { bullet: true, breakLine: true } },
  { text: "完整的用户注册登录体系", options: { bullet: true, breakLine: true } },
  { text: "饮食记录 + AI热量自动估算", options: { bullet: true, breakLine: true } },
  { text: "运动记录 + AI消耗自动计算", options: { bullet: true, breakLine: true } },
  { text: "6维度每日打卡 + 连续激励", options: { bullet: true, breakLine: true } },
  { text: "BMI健康体重评估", options: { bullet: true, breakLine: true } },
  { text: "DeepSeek AI综合健康分析", options: { bullet: true, breakLine: true } },
  { text: "MyBatis-Plus简化数据库操作", options: { bullet: true, breakLine: true } },
  { text: "路由守卫保护用户隐私", options: { bullet: true } },
], {
  x: 0.8, y: 1.95, w: 3.8, h: 3.0, fontSize: 13, fontFace: FONT_B, color: C.darkText, paraSpaceAfter: 4, margin: 0
});

// Right - Future
s11.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 3.8, fill: { color: C.cardBg }, shadow: mkShadow() });
s11.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fill: { color: C.coral } });
s11.addText("🚀 未来展望", { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0 });
s11.addText([
  { text: "数据可视化增强", options: { bold: true, breakLine: true, color: C.navy } },
  { text: "ECharts图表展示体重趋势、热量曲线", options: { bullet: true, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "智能设备对接", options: { bold: true, breakLine: true, color: C.navy } },
  { text: "接入小米手环等可穿戴设备数据", options: { bullet: true, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "社交互动功能", options: { bold: true, breakLine: true, color: C.navy } },
  { text: "好友PK、排行榜、分享打卡", options: { bullet: true, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "个性化推荐", options: { bold: true, breakLine: true, color: C.navy } },
  { text: "AI生成每周饮食运动计划", options: { bullet: true } },
], {
  x: 5.5, y: 1.95, w: 3.8, h: 3.0, fontSize: 12, fontFace: FONT_B, color: C.darkText, paraSpaceAfter: 2, margin: 0
});

// ============================================================
// SLIDE 12 - Thank You
// ============================================================
let s12 = pres.addSlide();
s12.background = { color: C.navy };
s12.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.coral } });
s12.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.565, w: 10, h: 0.06, fill: { color: C.coral } });

s12.addText("感谢各位老师的指导与聆听！", {
  x: 1, y: 1.5, w: 8, h: 1.2,
  fontSize: 36, fontFace: FONT_H, color: C.white, bold: true, align: "center", valign: "middle", margin: 0
});
s12.addText("🙏", { x: 4.5, y: 2.8, w: 1, h: 1, fontSize: 48, align: "center" });
s12.addText("敬请指导", {
  x: 2, y: 3.8, w: 6, h: 0.6,
  fontSize: 22, fontFace: FONT_B, color: C.teal, align: "center", margin: 0
});

// ============================================================
// Write file
// ============================================================
pres.writeFile({ fileName: "C:/Users/Administrator/Desktop/减脂小助手/减脂小助手答辩PPT.pptx" })
  .then(() => console.log("PPT created successfully!"))
  .catch(err => console.error("Error:", err));

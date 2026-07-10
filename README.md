# YESSKIN 四页实盘原样静态复刻

本目录直接复用 2026-07-10 当前实盘页面的 HTML、CSS、JavaScript 和共享组件，不是重新设计或同风格重画。

## 打开方式

直接双击 **index.html**。左侧只保留四个交付入口：

1. 用户全景档案
2. 用户画像分析
3. 顾问任务&H5审核
4. 智能运营DashBoard

“用户全景档案”和“用户画像分析”在当前 `index.html` 内切换，不依赖网站根目录。

## 数据与安全边界

- 只保留一位脱敏演示客户：林女士（HIS_DEMO_001）。
- 实盘只读响应已冻结到 static-api-data.js；页面不访问 API、数据库或外网。
- 顾问话术、皮肤类型与 H5 图片按钮使用本地回放。
- automaticSendAllowed=false
- customerFacingPublishAllowed=false
- remoteWriteAllowed=false

## 与实盘一致性

除四页导航收口、资源相对路径和本地数据适配外，其余页面结构、样式、组件和交互代码均来自当前实盘源文件。

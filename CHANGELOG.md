# 变更记录

## 2026-08-09 静态数据与小程序真实数据收口

- 小程序测评接入 `questions.listPublic`，移除硬编码题目。
- 小程序交卷改为真实计分，并通过 `survey.saveResult` 保存测评结果。
- `survey` 云对象新增 `time` 字段，`survey_result.schema.json` 同步补充。
- 小程序数据中心、个人中心从 `survey.myResults` 读取真实测评记录。
- 小程序首页推荐、法律英语资源改为读取真实 `resources`。
- 小程序成就页、学习进度、听力训练等暂无数据模型，已清空为待接入状态。
- 网页端和小程序端视频详情移除默认示例视频回退，未配置 `fileUrl` 时提示缺少文件地址。
- 网页端专项选择页清空静态专项分类，待后续接入题目分类。
- 移除 `questions`、`resources`、`knowledge` 云对象中的自动种子数据。
- 修复题目库主观题 `subType` 丢失问题，并补上“论述题 / 案例分析题”切换。
- 修复问卷页题干字段读取错误，改为读取题目库的 `title`。

## 2026-08-08 云端框架与管理端

- 新增并完善 `user`、`resource`、`survey_result`、`question`、`legal_doc` 数据库 Schema。
- 新增并完善 `users`、`resources`、`survey`、`questions`、`knowledge` 云对象。
- 管理端题库、知识库、资源库、用户管理、数据总览接入真实数据。
- 网页端首页、登录、测评、结果、报告、个人中心、学习中心、法律库接入真实云数据。
- 小程序本地 `cloudfunctions` 同步 `users`、`resources`、`survey`、`questions`、`knowledge` 副本。

## 2026-08-06 初始版本

- 从原项目同步基础版本。
- 建立网页端与微信小程序端双端项目结构。
- 保留 uniCloud 云函数、数据库 Schema、页面与本地调试脚本。

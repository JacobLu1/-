<template>
  <view class="app-shell">
    <!-- ===== Left Sidebar ===== -->
    <aside class="app-sidebar">
      <view class="app-sidebar-logo">
        <view class="app-sidebar-logo-icon">
          <view class="ls-svg-glyph" aria-hidden="true"></view>
        </view>
        <view class="app-sidebar-logo-text">
          <text>涉外法治人才培养平台</text>
          <text>管理端</text>
        </view>
      </view>

      <nav class="app-sidebar-nav">
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/dashboard')">
          <view class="navi-icon navi-icon-dashboard"></view>
          <text>数据总览</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/user-management')">
          <view class="navi-icon navi-icon-users"></view>
          <text>用户管理</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/question-bank')">
          <view class="navi-icon navi-icon-file-question"></view>
          <text>题库管理</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/knowledge-management')">
          <view class="navi-icon navi-icon-book"></view>
          <text>法律库管理</text>
        </view>
        <view class="app-nav-item is-active" @tap="navigateTo('/pages/admin/resource-management')">
          <view class="navi-icon navi-icon-folder"></view>
          <text>资源管理</text>
        </view>
        <view class="app-nav-divider"></view>
        <view class="app-nav-item" @tap="handleLogout">
          <view class="navi-icon navi-icon-logout"></view>
          <text>退出登录</text>
        </view>
      </nav>

      <view class="app-sidebar-user">
        <view class="app-sidebar-user-inner">
          <view class="app-sidebar-user-avatar">管</view>
          <view style="min-width:0;flex:1">
            <text class="app-sidebar-user-name">管理员</text>
            <text class="app-sidebar-user-role">系统管理员</text>
          </view>
        </view>
      </view>
    </aside>

    <!-- ===== Main Content Area ===== -->
    <view class="app-main">
      <header class="app-topbar">
        <view class="app-topbar-titles">
          <text class="app-topbar-title">资源管理</text>
          <text class="app-topbar-breadcrumb">管理端 / 资源</text>
        </view>
        <text class="app-topbar-meta">{{ todayDateText }}</text>
      </header>
      <main class="app-content">

        <!-- ===== Section 1: 资源概览统计 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[0] }" aria-label="资源概览统计">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">资源概览</text>
                <text class="qb-section-subtitle">学习中心资源整体情况</text>
              </view>
            </view>
          </view>
          <view class="qb-kpi-grid">
            <view class="qb-kpi-card">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">资源总数</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-folder"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiTotal }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>resource 集合实时统计</text>
              </view>
            </view>
            <view class="qb-kpi-card qb-accent-success">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">视频资源</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-video"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiVideo }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>type = video</text>
              </view>
            </view>
            <view class="qb-kpi-card qb-accent-warning">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">词汇资源</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-book-open"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiVocabulary }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>type = vocabulary</text>
              </view>
            </view>
            <view class="qb-kpi-card">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">文本阅读</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-file-text"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiReading }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>type = reading</text>
              </view>
            </view>
            <view class="qb-kpi-card">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">听力训练</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-mic"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiListening }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>type = listening</text>
              </view>
            </view>
          </view>
        </section>

        <!-- ===== Section 2: 资源上传 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[1] }" aria-label="资源上传">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">录入学习资源</text>
                <text class="qb-section-subtitle">支持视频、法律英语等学习资源，参考学习中心内容</text>
              </view>
            </view>
          </view>
          <view class="rm-upload-card">
            <view class="rm-upload-row">
              <view class="rm-form-field">
                <text class="rm-form-label">资源类型</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': uploadType === 'video' }" @tap="uploadType = 'video'">视频资源</view>
                  <view class="qb-pill" :class="{ 'is-active': uploadType === 'vocabulary' }" @tap="uploadType = 'vocabulary'">词汇</view>
                  <view class="qb-pill" :class="{ 'is-active': uploadType === 'reading' }" @tap="uploadType = 'reading'">文本阅读</view>
                  <view class="qb-pill" :class="{ 'is-active': uploadType === 'listening' }" @tap="uploadType = 'listening'">听力训练</view>
                </view>
              </view>
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">资源标题</text>
                <input class="rm-input" v-model="uploadTitle" :placeholder="uploadType === 'vocabulary' ? '请输入英文单词' : '请输入资源标题'" />
              </view>
              <view class="rm-form-field">
                <text class="rm-form-label">排序号</text>
                <input class="rm-input rm-input-sm" v-model="uploadSortOrder" type="number" placeholder="数字越小越靠前" />
              </view>
            </view>

            <view class="rm-upload-row">
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">{{ uploadType === 'video' ? '视频分类' : uploadType === 'vocabulary' ? '词汇主题' : uploadType === 'reading' ? '阅读主题' : '听力场景' }}</text>
                <input class="rm-input" v-model="uploadCategory" :placeholder="uploadType === 'video' ? '如 国际仲裁 / WTO法 / 跨境投资 / 海商法' : '如 国际仲裁 / 跨境投资 / 海商法'" />
              </view>
              <view class="rm-form-field">
                <text class="rm-form-label">{{ uploadType === 'video' ? '时长' : '难度 / 音标' }}</text>
                <input class="rm-input rm-input-sm" v-model="uploadMeta" :placeholder="uploadType === 'video' ? '如 45:30' : '如 中级 / /əˈbɪtrəl/' " />
              </view>
            </view>

            <view v-if="uploadType === 'vocabulary'" class="rm-upload-row">
              <view class="rm-form-field">
                <text class="rm-form-label">语言分类</text>
                <view class="qb-pills">
                  <view
                    class="qb-pill"
                    :class="{ 'is-active': uploadLang === lang }"
                    v-for="lang in LANGUAGES"
                    :key="lang"
                    @tap="uploadLang = lang"
                  >{{ lang }}</view>
                </view>
              </view>
            </view>

            <view v-if="uploadType === 'video'" class="rm-upload-row">
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">视频文件</text>
                <view class="rm-file-row">
                  <view class="rm-file-btn" @tap="chooseVideoFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>{{ uploadingVideo ? '上传中...' : '选择视频文件' }}</text>
                  </view>
                  <text v-if="uploadVideoName" class="rm-file-name">{{ uploadVideoName }}</text>
                </view>
                <text class="rm-form-label rm-form-label-soft">视频地址（选择文件后自动填入，也可手动填写）</text>
                <input class="rm-input" v-model="uploadUrl" placeholder="云存储 MP4 地址" />
              </view>
              <view class="rm-form-field">
                <text class="rm-form-label">封面图</text>
                <view class="rm-file-row">
                  <view class="rm-file-btn rm-file-btn-sm" @tap="chooseCoverFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>{{ uploadingCover ? '上传中...' : '选择封面图' }}</text>
                  </view>
                  <text v-if="uploadCoverName" class="rm-file-name">{{ uploadCoverName }}</text>
                </view>
                <input class="rm-input" v-model="uploadCover" placeholder="封面 URL，可留空" />
              </view>
            </view>

            <view v-if="uploadType === 'vocabulary'" class="rm-upload-row">
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">中文释义</text>
                <input class="rm-input" v-model="uploadDescription" placeholder="请输入单词释义" />
              </view>
              <view class="rm-form-field">
                <text class="rm-form-label">例句 / 用法</text>
                <input class="rm-input" v-model="uploadContent" placeholder="可选" />
              </view>
            </view>

            <view v-if="uploadType === 'reading'" class="rm-upload-row">
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">阅读正文</text>
                <textarea class="rm-textarea" v-model="uploadContent" placeholder="请输入阅读正文"></textarea>
              </view>
              <view class="rm-form-field">
                <text class="rm-form-label">PDF / 原文链接</text>
                <view class="rm-file-row">
                  <view class="rm-file-btn rm-file-btn-sm" @tap="choosePdfFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>{{ uploadingPdf ? '上传中...' : '选择 PDF 文件' }}</text>
                  </view>
                  <text v-if="uploadPdfName" class="rm-file-name">{{ uploadPdfName }}</text>
                </view>
                <input class="rm-input" v-model="uploadUrl" placeholder="可留空" />
                <text class="rm-form-label">封面图</text>
                <view class="rm-file-row">
                  <view class="rm-file-btn rm-file-btn-sm" @tap="chooseCoverFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>{{ uploadingCover ? '上传中...' : '选择封面图' }}</text>
                  </view>
                  <text v-if="uploadCoverName" class="rm-file-name">{{ uploadCoverName }}</text>
                </view>
                <input class="rm-input" v-model="uploadCover" placeholder="可留空" />
              </view>
            </view>

            <view v-if="uploadType === 'listening'" class="rm-upload-row">
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">音频文件</text>
                <view class="rm-file-row">
                  <view class="rm-file-btn" @tap="chooseAudioFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>{{ uploadingAudio ? '上传中...' : '选择音频文件' }}</text>
                  </view>
                  <text v-if="uploadAudioName" class="rm-file-name">{{ uploadAudioName }}</text>
                </view>
                <text class="rm-form-label rm-form-label-soft">音频地址（选择文件后自动填入，也可手动填写）</text>
                <input class="rm-input" v-model="uploadAudioUrl" placeholder="云存储音频 URL" />
              </view>
              <view class="rm-form-field">
                <text class="rm-form-label">封面图</text>
                <view class="rm-file-row">
                  <view class="rm-file-btn rm-file-btn-sm" @tap="chooseCoverFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>{{ uploadingCover ? '上传中...' : '选择封面图' }}</text>
                  </view>
                  <text v-if="uploadCoverName" class="rm-file-name">{{ uploadCoverName }}</text>
                </view>
                <input class="rm-input" v-model="uploadCover" placeholder="可留空" />
              </view>
            </view>

            <view v-if="uploadType === 'reading' || uploadType === 'listening'" class="rm-upload-row">
              <view v-if="uploadType === 'reading'" class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">阅读简介</text>
                <textarea class="rm-textarea" v-model="uploadDescription" placeholder="请输入摘要或说明"></textarea>
              </view>
            </view>

            <view v-if="uploadType === 'listening'" class="rm-upload-row">
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">英文原文</text>
                <view class="rm-file-row">
                  <view class="rm-file-btn rm-file-btn-sm" @tap="chooseListeningTextFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>选择文本文件</text>
                  </view>
                  <text v-if="uploadListeningTextName" class="rm-file-name">{{ uploadListeningTextName }}</text>
                </view>
                <view class="rm-file-row">
                  <view class="rm-file-btn rm-file-btn-sm" @tap="chooseListeningWordFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>选择 Word 文档</text>
                  </view>
                  <text v-if="uploadListeningWordName" class="rm-file-name">{{ uploadListeningWordName }}</text>
                </view>
                <textarea class="rm-textarea" v-model="uploadContent" placeholder="请输入英文原文，可包含换行"></textarea>
              </view>
            </view>

            <view v-if="uploadType === 'listening'" class="rm-upload-row">
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">中文译文</text>
                <view class="rm-file-row">
                  <view class="rm-file-btn rm-file-btn-sm" @tap="chooseListeningZhTextFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>选择文本文件</text>
                  </view>
                  <text v-if="uploadListeningZhTextName" class="rm-file-name">{{ uploadListeningZhTextName }}</text>
                </view>
                <view class="rm-file-row">
                  <view class="rm-file-btn rm-file-btn-sm" @tap="chooseListeningZhWordFile">
                    <view class="navi-icon navi-icon-upload-cloud"></view>
                    <text>选择 Word 文档</text>
                  </view>
                  <text v-if="uploadListeningZhWordName" class="rm-file-name">{{ uploadListeningZhWordName }}</text>
                </view>
                <textarea class="rm-textarea" v-model="uploadDescription" placeholder="请输入中文译文，可包含换行"></textarea>
              </view>
            </view>

            <view v-if="uploadType === 'listening'" class="rm-question-box">
              <view class="rm-question-head">
                <text class="rm-question-title">听力题目</text>
                <view class="rm-mini-btn" @tap="addUploadQuestion">添加题目</view>
              </view>
              <view v-if="!uploadQuestions.length" class="rm-question-empty">尚未添加题目，可先保存听力资源后再补充</view>
              <view v-for="(question, qi) in uploadQuestions" :key="qi" class="rm-question-item">
                <view class="rm-upload-row">
                  <text class="rm-form-label">题目 {{ qi + 1 }}</text>
                  <input class="rm-input rm-input-grow" v-model="question.stem" placeholder="请输入题干" />
                  <view class="rm-link-btn" @tap="removeUploadQuestion(qi)">删除</view>
                </view>
                <view class="rm-upload-row rm-options-row">
                  <input
                    v-for="(option, oi) in question.options"
                    :key="oi"
                    class="rm-input rm-option-input"
                    v-model="question.options[oi]"
                    :placeholder="String.fromCharCode(65 + oi) + ' 选项'"
                  />
                  <view class="rm-link-btn" @tap="addUploadOption(qi)">+ 选项</view>
                </view>
                <view class="rm-upload-row">
                  <input class="rm-input rm-input-sm" v-model="question.answer" placeholder="答案，单选填 A/B" />
                </view>
              </view>
            </view>

            <view class="rm-upload-foot">
              <text class="rm-upload-tip">普通保存进入审核；保存并上线后直接在学习中心展示</text>
              <view class="rm-upload-actions">
                <view class="qb-create-btn" @tap="handleUpload(false)">
                  <view class="navi-icon navi-icon-upload-cloud"></view>
                  <text>保存资源</text>
                </view>
                <view class="qb-create-btn qb-create-btn-success" @tap="handleUpload(true)">
                  <view class="navi-icon navi-icon-check-circle"></view>
                  <text>保存并上线资源</text>
                </view>
              </view>
            </view>
          </view>

          <view v-if="uploadType === 'vocabulary'" class="rm-upload-card rm-batch-card">
            <view class="rm-batch-head">
              <view class="rm-batch-title-wrap">
                <text class="rm-batch-title">批量导入词汇</text>
                <text class="rm-batch-subtitle">粘贴词表或选择 txt 文件，格式：英文词 + 空格/Tab + 中文释义，可加第三列分类；重复词汇自动跳过，导入后直接上线</text>
                <text class="rm-batch-lang">导入语言：{{ uploadLang }}（可在上方「语言分类」切换）</text>
              </view>
              <view class="rm-batch-actions">
                <view class="rm-file-btn rm-file-btn-sm" @tap="chooseBatchFile">选择 txt 文件</view>
              </view>
            </view>
            <textarea
              class="rm-textarea rm-batch-textarea"
              v-model="batchText"
              placeholder="每行一条，例如：&#10;arbitration  仲裁  国际仲裁&#10;burden of proof  举证责任&#10;plaintiff  原告  诉讼法律"
            ></textarea>
            <view class="rm-batch-foot">
              <text v-if="batchParseCount > 0" class="rm-batch-count">已识别 {{ batchParseCount }} 条词条</text>
              <text v-else class="rm-batch-count rm-batch-count-muted">尚未识别到词条</text>
              <view class="qb-create-btn qb-create-btn-success" :class="{ 'is-disabled': batchImporting }" @tap="handleBatchImport">
                <view class="navi-icon navi-icon-check-circle"></view>
                <text>{{ batchImporting ? '导入中...' : '一键导入' }}</text>
              </view>
            </view>
            <text v-if="batchResult" class="rm-batch-result" :class="{ 'is-error': batchResult.error }">{{ batchResult.message }}</text>
          </view>

          <view v-if="uploadType === 'reading'" class="rm-upload-card rm-batch-card">
            <view class="rm-batch-head">
              <view class="rm-batch-title-wrap">
                <text class="rm-batch-title">批量导入阅读</text>
                <text class="rm-batch-subtitle">粘贴文本或选择 txt 文件：每篇以 #title= 开头，支持 #cat= #meta= #description= #date= 字段，其余行作为正文；重复篇目自动跳过，导入后直接上线</text>
              </view>
              <view class="rm-batch-actions">
                <view class="rm-file-btn rm-file-btn-sm" @tap="chooseBatchFile">选择 txt 文件</view>
              </view>
            </view>
            <textarea
              class="rm-textarea rm-batch-textarea"
              v-model="batchText"
              placeholder="每篇以 #title= 开头，例如：&#10;#title=司法和国家权力的多种面孔（序言）&#10;#cat=比较法&#10;#meta=米尔伊安·R·达玛什卡 著&#10;#description=全书导言&#10;正文内容..."
            ></textarea>
            <view class="rm-batch-foot">
              <text v-if="readingParseCount > 0" class="rm-batch-count">已识别 {{ readingParseCount }} 篇阅读</text>
              <text v-else class="rm-batch-count rm-batch-count-muted">尚未识别到阅读篇目</text>
              <view class="qb-create-btn qb-create-btn-success" :class="{ 'is-disabled': batchImporting }" @tap="handleBatchReadingImport">
                <view class="navi-icon navi-icon-check-circle"></view>
                <text>{{ batchImporting ? '导入中...' : '一键导入' }}</text>
              </view>
            </view>
            <text v-if="batchResult" class="rm-batch-result" :class="{ 'is-error': batchResult.error }">{{ batchResult.message }}</text>
          </view>
        </section>

        <!-- ===== Section 3: 学习资源管理 ===== -->
        <section id="learning-resource-management" class="dc-section" :class="{ 'is-visible': visibleSections[2] }" aria-label="学习资源管理">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">学习资源管理</text>
                <text class="qb-section-subtitle">共 {{ resources.length }} 条资源，按类型、分类、排序统一管理</text>
              </view>
            </view>
          </view>
          <view class="qb-toolbar">
            <view class="qb-toolbar-row">
              <view class="qb-search">
                <view class="navi-icon navi-icon-search qb-search-icon"></view>
                <input class="qb-search-input" v-model="resourceSearch" placeholder="搜索资源标题" />
              </view>
              <view class="qb-filter-group">
                <text class="qb-filter-label">类型</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': resourceFilter === 'all' }" @tap="resourceFilter = 'all'">全部</view>
                  <view class="qb-pill" :class="{ 'is-active': resourceFilter === 'video' }" @tap="resourceFilter = 'video'">视频</view>
                  <view class="qb-pill" :class="{ 'is-active': resourceFilter === 'vocabulary' }" @tap="resourceFilter = 'vocabulary'">词汇</view>
                  <view class="qb-pill" :class="{ 'is-active': resourceFilter === 'reading' }" @tap="resourceFilter = 'reading'">阅读</view>
                  <view class="qb-pill" :class="{ 'is-active': resourceFilter === 'listening' }" @tap="resourceFilter = 'listening'">听力</view>
                </view>
              </view>
              <view v-if="selectedIds.length" class="qb-batch-del" @tap="batchDelete">
                <view class="navi-icon navi-icon-trash-2"></view>
                <text>批量删除（{{ selectedIds.length }}）</text>
              </view>
            </view>
          </view>
          <view class="qb-table-card">
            <view class="qb-table-container">
              <table class="qb-table">
                <thead>
                  <tr>
                    <th scope="col" class="qb-check-col">
                      <view class="qb-check" :class="{ 'is-checked': isAllSelected }" @tap="toggleSelectAll()"></view>
                    </th>
                    <th scope="col">编号</th>
                    <th scope="col">类型</th>
                    <th v-if="showLanguageColumn" scope="col">语言</th>
                    <th scope="col">资源标题</th>
                    <th scope="col">分类</th>
                    <th scope="col">难度 / 时长</th>
                    <th scope="col">排序</th>
                    <th scope="col">状态</th>
                    <th scope="col">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in pagedResources" :key="item.id">
                    <td class="qb-check-col">
                      <view class="qb-check" :class="{ 'is-checked': selectedIds.includes(item.id) }" @tap="toggleSelect(item.id)"></view>
                    </td>
                    <td><text class="qb-qid">{{ item.id }}</text></td>
                    <td><text class="qb-type-tag" :class="item.typeClass">{{ resourceTypeLabel(item.type) }}</text></td>
                    <td v-if="showLanguageColumn"><text class="qb-type-tag qb-cat-blue">{{ item.lang || '英语' }}</text></td>
                    <td class="qb-qcontent"><text class="qb-qcontent-text">{{ item.title }}</text></td>
                    <td><text class="qb-type-tag" :class="item.tagClass">{{ item.category || '待分类' }}</text></td>
                    <td><text class="qb-date">{{ item.meta || '--' }}</text></td>
                    <td><text class="qb-date">{{ item.sortOrder }}</text></td>
                    <td><text class="qb-diff-tag" :class="item.statusClass">{{ item.status }}</text></td>
                    <td>
                      <view class="qb-actions">
                        <view class="qb-action-btn qb-action-edit" @tap="openEdit(item)">
                          <view class="navi-icon navi-icon-pencil"></view>
                          <text>编辑</text>
                        </view>
                        <view class="qb-action-btn qb-action-del" @tap="handleDelete(item.type, item)">
                          <view class="navi-icon navi-icon-trash-2"></view>
                          <text>删除</text>
                        </view>
                      </view>
                    </td>
                  </tr>
                </tbody>
              </table>
              <view v-if="!filteredResources.length" class="qb-empty-row">暂无资源，请先录入并上线</view>
            </view>
            <view v-if="filteredResources.length" class="qb-pagination">
              <view class="qb-pagination-info">
                共 {{ filteredResources.length }} 条，每页 50 条，当前第 {{ currentPage }} / {{ totalPages }} 页
              </view>
              <view class="qb-pagination-buttons">
                <view
                  class="qb-page-btn"
                  :class="{ 'is-disabled': currentPage <= 1 }"
                  @tap="changePage(currentPage - 1)"
                >上一页</view>
                <view
                  class="qb-page-item"
                  v-for="page in visiblePageNumbers"
                  :key="page"
                >
                  <view v-if="page === '...'" class="qb-page-ellipsis">...</view>
                  <view
                    v-else
                    class="qb-page-btn"
                    :class="{ 'is-active': page === currentPage }"
                    @tap="changePage(page)"
                  >{{ page }}</view>
                </view>
                <view
                  class="qb-page-btn"
                  :class="{ 'is-disabled': currentPage >= totalPages }"
                  @tap="changePage(currentPage + 1)"
                >下一页</view>
              </view>
            </view>
          </view>
        </section>

        <!-- ===== 编辑资源弹窗 ===== -->
        <view v-if="editVisible" class="rm-modal-mask" @tap.self="closeEdit">
          <view class="rm-modal">
            <view class="rm-modal-header">
              <view>
                <text class="rm-modal-title">编辑{{ resourceTypeLabel(editType) }}资源</text>
                <text class="rm-modal-subtitle">保存后立即同步到学习中心</text>
              </view>
              <view class="rm-modal-close" @tap="closeEdit">×</view>
            </view>
            <view class="rm-modal-body">
              <view class="rm-upload-row">
                <view class="rm-form-field rm-form-field-grow">
                  <text class="rm-form-label">资源标题</text>
                  <input class="rm-input" v-model="editForm.title" :placeholder="editType === 'vocabulary' ? '请输入英文单词' : '请输入资源标题'" />
                </view>
                <view class="rm-form-field">
                  <text class="rm-form-label">分类</text>
                  <input class="rm-input" v-model="editForm.cat" placeholder="如 国际仲裁 / 跨境投资" />
                </view>
              </view>
              <view class="rm-upload-row">
                <view class="rm-form-field">
                  <text class="rm-form-label">{{ editType === 'video' ? '时长' : '难度 / 音标' }}</text>
                  <input class="rm-input" v-model="editForm.meta" placeholder="如 45:30 或 中级" />
                </view>
                <view class="rm-form-field rm-form-field-grow">
                  <text class="rm-form-label">排序号</text>
                  <input class="rm-input" v-model="editForm.sortOrder" type="number" placeholder="数字越小越靠前" />
                </view>
              </view>

              <view v-if="editType === 'video' || editType === 'reading'" class="rm-upload-row">
                <view class="rm-form-field rm-form-field-grow">
                  <text class="rm-form-label">{{ editType === 'video' ? '视频地址' : 'PDF / 原文链接' }}</text>
                  <input class="rm-input" v-model="editForm.fileUrl" placeholder="填写云存储公开 URL" />
                </view>
                <view class="rm-form-field">
                  <text class="rm-form-label">封面图</text>
                  <view class="rm-file-row">
                    <view class="rm-file-btn rm-file-btn-sm" @tap="chooseCoverFile">
                      <view class="navi-icon navi-icon-upload-cloud"></view>
                      <text>{{ uploadingCover ? '上传中...' : '选择封面图' }}</text>
                    </view>
                    <text v-if="uploadCoverName" class="rm-file-name">{{ uploadCoverName }}</text>
                  </view>
                  <input class="rm-input" v-model="editForm.cover" placeholder="封面 URL，可留空" />
                </view>
              </view>

              <view v-if="editType === 'vocabulary'" class="rm-upload-row">
                <view class="rm-form-field">
                  <text class="rm-form-label">语言分类</text>
                  <view class="qb-pills">
                    <view
                      class="qb-pill"
                      :class="{ 'is-active': editForm.lang === lang }"
                      v-for="lang in LANGUAGES"
                      :key="lang"
                      @tap="editForm.lang = lang"
                    >{{ lang }}</view>
                  </view>
                </view>
              </view>

              <view v-if="editType === 'vocabulary'" class="rm-upload-row">
                <view class="rm-form-field rm-form-field-grow">
                  <text class="rm-form-label">中文释义</text>
                  <input class="rm-input" v-model="editForm.description" placeholder="请输入单词释义" />
                </view>
                <view class="rm-form-field rm-form-field-grow">
                  <text class="rm-form-label">例句 / 用法</text>
                  <input class="rm-input" v-model="editForm.content" placeholder="可选" />
                </view>
              </view>

              <view v-if="editType === 'listening'" class="rm-upload-row">
                <view class="rm-form-field rm-form-field-grow">
                  <text class="rm-form-label">音频地址</text>
                  <input class="rm-input" v-model="editForm.audioUrl" placeholder="填写云存储音频 URL" />
                </view>
                <view class="rm-form-field">
                  <text class="rm-form-label">封面图</text>
                  <view class="rm-file-row">
                    <view class="rm-file-btn rm-file-btn-sm" @tap="chooseCoverFile">
                      <view class="navi-icon navi-icon-upload-cloud"></view>
                      <text>{{ uploadingCover ? '上传中...' : '选择封面图' }}</text>
                    </view>
                    <text v-if="uploadCoverName" class="rm-file-name">{{ uploadCoverName }}</text>
                  </view>
                  <input class="rm-input" v-model="editForm.cover" placeholder="封面 URL，可留空" />
                </view>
              </view>

              <view v-if="editType === 'reading'" class="rm-upload-row">
                <view class="rm-form-field rm-form-field-grow">
                  <text class="rm-form-label">阅读正文</text>
                  <textarea class="rm-textarea" v-model="editForm.content" placeholder="请输入阅读正文"></textarea>
                </view>
              </view>

              <view v-if="editType === 'listening'" class="rm-upload-row">
                <view class="rm-form-field rm-form-field-grow">
                  <text class="rm-form-label">英文原文</text>
                  <view class="rm-file-row">
                    <view class="rm-file-btn rm-file-btn-sm" @tap="chooseEditListeningTextFile">
                      <view class="navi-icon navi-icon-upload-cloud"></view>
                      <text>选择文本文件</text>
                    </view>
                    <text v-if="editListeningTextName" class="rm-file-name">{{ editListeningTextName }}</text>
                  </view>
                  <view class="rm-file-row">
                    <view class="rm-file-btn rm-file-btn-sm" @tap="chooseEditListeningWordFile">
                      <view class="navi-icon navi-icon-upload-cloud"></view>
                      <text>选择 Word 文档</text>
                    </view>
                    <text v-if="editListeningWordName" class="rm-file-name">{{ editListeningWordName }}</text>
                  </view>
                  <textarea class="rm-textarea" v-model="editForm.content" placeholder="请输入英文原文，可包含换行"></textarea>
                </view>
              </view>

              <view v-if="editType === 'listening'" class="rm-upload-row">
                <view class="rm-form-field rm-form-field-grow">
                  <text class="rm-form-label">中文译文</text>
                  <view class="rm-file-row">
                    <view class="rm-file-btn rm-file-btn-sm" @tap="chooseEditListeningZhTextFile">
                      <view class="navi-icon navi-icon-upload-cloud"></view>
                      <text>选择文本文件</text>
                    </view>
                    <text v-if="editListeningZhTextName" class="rm-file-name">{{ editListeningZhTextName }}</text>
                  </view>
                  <view class="rm-file-row">
                    <view class="rm-file-btn rm-file-btn-sm" @tap="chooseEditListeningZhWordFile">
                      <view class="navi-icon navi-icon-upload-cloud"></view>
                      <text>选择 Word 文档</text>
                    </view>
                    <text v-if="editListeningZhWordName" class="rm-file-name">{{ editListeningZhWordName }}</text>
                  </view>
                  <textarea class="rm-textarea" v-model="editForm.description" placeholder="请输入中文译文，可包含换行"></textarea>
                </view>
              </view>

              <view v-if="editType === 'listening'" class="rm-question-box">
                <view class="rm-question-head">
                  <text class="rm-question-title">听力题目</text>
                  <view class="rm-mini-btn" @tap="addEditQuestion">添加题目</view>
                </view>
                <view v-if="!editQuestions.length" class="rm-question-empty">尚未添加题目</view>
                <view v-for="(question, qi) in editQuestions" :key="qi" class="rm-question-item">
                  <view class="rm-upload-row">
                    <text class="rm-form-label">题目 {{ qi + 1 }}</text>
                    <input class="rm-input rm-input-grow" v-model="question.stem" placeholder="请输入题干" />
                    <view class="rm-link-btn" @tap="removeEditQuestion(qi)">删除</view>
                  </view>
                  <view class="rm-upload-row rm-options-row">
                    <input
                      v-for="(option, oi) in question.options"
                      :key="oi"
                      class="rm-input rm-option-input"
                      v-model="question.options[oi]"
                      :placeholder="String.fromCharCode(65 + oi) + ' 选项'"
                    />
                    <view class="rm-link-btn" @tap="addEditOption(qi)">+ 选项</view>
                  </view>
                  <view class="rm-upload-row">
                    <input class="rm-input rm-input-sm" v-model="question.answer" placeholder="答案，单选填 A/B" />
                  </view>
                </view>
              </view>

              <view class="rm-modal-options">
                <view class="rm-form-field">
                  <text class="rm-form-label">审核状态</text>
                  <view class="qb-pills">
                    <view class="qb-pill" :class="{ 'is-active': editForm.status === '审核中' }" @tap="editForm.status = '审核中'; syncStatusClass()">审核中</view>
                    <view class="qb-pill" :class="{ 'is-active': editForm.status === '已上线' }" @tap="editForm.status = '已上线'; syncStatusClass()">已上线</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="rm-modal-foot">
              <view class="rm-modal-cancel" @tap="closeEdit">取消</view>
              <view class="qb-create-btn" :class="{ 'is-disabled': editSaving }" @tap="saveEdit">
                <view class="navi-icon navi-icon-check"></view>
                <text>{{ editSaving ? '保存中...' : '保存修改' }}</text>
              </view>
            </view>
          </view>
        </view>

      </main>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { requireAdmin } from '@/utils/auth.js'

const visibleSections = ref([false, false, false])
const todayDateText = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
})

/* ===== 上传表单 ===== */
const uploadType = ref('video')
const uploadTitle = ref('')
const uploadMeta = ref('')
const uploadUrl = ref('')
const uploadCover = ref('')
const uploadCategory = ref('')
const uploadDescription = ref('')
const uploadContent = ref('')
const uploadAudioUrl = ref('')
const uploadSortOrder = ref(1)
const uploadLang = ref('英语')
const uploadQuestions = ref([])
const uploadListeningTextName = ref('')
const editListeningTextName = ref('')
const uploadListeningWordName = ref('')
const editListeningWordName = ref('')
const uploadListeningZhTextName = ref('')
const editListeningZhTextName = ref('')
const uploadListeningZhWordName = ref('')
const editListeningZhWordName = ref('')

/* ===== 文件上传状态 ===== */
const uploadVideoName = ref('')
const uploadingVideo = ref(false)
const uploadAudioName = ref('')
const uploadingAudio = ref(false)
const uploadPdfName = ref('')
const uploadingPdf = ref(false)
const uploadCoverName = ref('')
const uploadingCover = ref(false)

/* ===== 批量导入词汇 ===== */
const batchText = ref('')
const batchImporting = ref(false)
const batchResult = ref(null)

const batchParseCount = computed(() => parseBatchVocabText(batchText.value).length)

function parseBatchVocabText(text) {
  const lines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const items = []
  for (const line of lines) {
    let title = ''
    let description = ''
    let cat = ''
    const tabs = line.split('\t')
    if (tabs.length >= 2) {
      title = tabs[0].trim()
      description = (tabs[1] || '').trim()
      cat = (tabs[2] || '').trim()
    } else {
      // 无 Tab 时按空格拆分：英文在前，中文释义在后
      const m = line.match(/^(.*?)\s+([\u4e00-\u9fff].*)$/)
      if (m) {
        title = m[1].trim()
        description = m[2].trim()
      } else {
        title = line
      }
    }
    if (!title) continue
    items.push({ title, description, cat })
  }
  return items
}

/* ===== 批量导入阅读 ===== */
const readingParseCount = computed(() => parseBatchReadingText(batchText.value).length)

function parseBatchReadingText(text) {
  const lines = String(text || '').split(/\r?\n/)
  const items = []
  const FIELDS = ['cat', 'meta', 'description', 'date', 'tags']
  let current = null
  for (const rawLine of lines) {
    const line = rawLine.replace(/\r/g, '')
    const fieldMatch = line.match(/^#(\w+)\s*=\s*(.*)$/)
    if (fieldMatch) {
      const key = fieldMatch[1].toLowerCase()
      const value = fieldMatch[2].trim()
      if (key === 'title') {
        if (current && current.title && current.content) items.push(current)
        current = { title: value, content: '' }
      } else if (current && FIELDS.includes(key)) {
        current[key] = value
      }
      continue
    }
    if (!current) continue
    current.content += (current.content ? '\n' : '') + rawLine
  }
  if (current && current.title && current.content) items.push(current)
  return items
}

async function handleBatchReadingImport() {
  if (batchImporting.value) return
  const items = parseBatchReadingText(batchText.value)
  if (!items.length) {
    batchResult.value = { error: true, message: '请先粘贴或选择阅读文本' }
    return
  }
  if (items.length > 100) {
    batchResult.value = { error: true, message: `共 ${items.length} 篇，超出单次 100 篇上限，请分批导入` }
    return
  }
  batchImporting.value = true
  batchResult.value = null
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.batchCreateReading({ adminToken: getAdminToken(), items })) || {}
    if (r.errCode !== 0) {
      batchResult.value = { error: true, message: r.errMsg || '批量导入失败' }
    } else {
      batchResult.value = { error: false, message: `导入完成：新增 ${r.added} 篇，跳过重复 ${r.skipped} 篇` }
      await loadAll()
    }
  } catch (e) {
    batchResult.value = { error: true, message: (e && e.message) || '批量导入失败，请确认 resources 云对象已重新部署' }
  } finally {
    batchImporting.value = false
  }
}

function chooseBatchFile() {
  uni.chooseFile({
    count: 1,
    extension: ['txt', 'text', 'tsv'],
    success(res) {
      const file = res.tempFiles && res.tempFiles[0]
      if (!file) return
      if (file.size > 2 * 1024 * 1024) {
        batchResult.value = { error: true, message: '文件过大，请控制在 2MB 以内' }
        return
      }
      const path = file.path || file.tempFilePath
      if (path && path.startsWith('blob:')) {
        fetch(path).then(r => r.text()).then(t => {
          batchText.value = t
          batchResult.value = null
        }).catch(() => {
          batchResult.value = { error: true, message: '读取文件失败，请改为复制粘贴文本' }
        })
        return
      }
      // 小程序端
      uni.getFileSystemManager().readFile({
        filePath: path,
        encoding: 'utf8',
        success(r) {
          batchText.value = r.data || ''
          batchResult.value = null
        },
        fail() {
          batchResult.value = { error: true, message: '读取文件失败，请改为复制粘贴文本' }
        }
      })
    }
  })
}

async function handleBatchImport() {
  if (batchImporting.value) return
  const items = parseBatchVocabText(batchText.value).map(item => ({
    ...item,
    lang: uploadLang.value
  }))
  if (!items.length) {
    batchResult.value = { error: true, message: '请先粘贴或选择词汇文本' }
    return
  }
  if (items.length > 2000) {
    batchResult.value = { error: true, message: `共 ${items.length} 条，超出单次 2000 条上限，请分批导入` }
    return
  }
  batchImporting.value = true
  batchResult.value = null
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.batchCreateVocabulary({ adminToken: getAdminToken(), items })) || {}
    if (r.errCode !== 0) {
      batchResult.value = { error: true, message: r.errMsg || '批量导入失败' }
    } else {
      batchResult.value = { error: false, message: `导入完成：新增 ${r.added} 条，跳过重复 ${r.skipped} 条` }
      await loadAll()
    }
  } catch (e) {
    batchResult.value = { error: true, message: (e && e.message) || '批量导入失败，请确认 resources 云对象已重新部署' }
  } finally {
    batchImporting.value = false
  }
}

/* ===== 编辑弹窗 ===== */
const editVisible = ref(false)
const editSaving = ref(false)
const editType = ref('video')
const editTarget = ref(null)
const editQuestions = ref([])
const editForm = reactive({
  id: '',
  type: 'video',
  title: '',
  cat: '',
  lang: '英语',
  tagClass: 'qb-type-case',
  meta: '',
  diffClass: 'qb-diff-mid',
  fileUrl: '',
  audioUrl: '',
  content: '',
  cover: '',
  description: '',
  sortOrder: 1,
  date: '',
  status: '审核中',
  statusClass: 'qb-diff-mid'
})

/* ===== 学习资源 ===== */
const resourceSearch = ref('')
const resourceFilter = ref('all')
const resources = ref([])
const PAGE_SIZE = 50
const currentPage = ref(1)
const selectedIds = ref([])

// 当前筛选结果是否全部选中
const isAllSelected = computed(() => {
  const list = filteredResources.value
  return list.length > 0 && list.every(item => selectedIds.value.includes(item.id))
})

function toggleSelect(id) {
  const i = selectedIds.value.indexOf(id)
  if (i >= 0) selectedIds.value.splice(i, 1)
  else selectedIds.value.push(id)
}

function toggleSelectAll() {
  const all = filteredResources.value
  const allSelected = all.length > 0 && all.every(item => selectedIds.value.includes(item.id))
  selectedIds.value = allSelected ? [] : all.map(item => item.id)
}

async function batchDelete() {
  if (!selectedIds.value.length) return
  const ids = selectedIds.value.slice()
  const typeLabel = resourceFilter.value === 'vocabulary' ? '词汇' : resourceFilter.value === 'video' ? '视频' : resourceFilter.value === 'reading' ? '阅读' : resourceFilter.value === 'listening' ? '听力' : ''
  uni.showModal({
    title: '确认批量删除',
    content: `确定要删除选中的 ${ids.length} 条${typeLabel ? `（${typeLabel}）` : ''}资源吗？删除后不可恢复。`,
    success: async (res) => {
      if (!res.confirm) return
      try {
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.remove({ adminToken: getAdminToken(), ids })) || {}
        if (r.errCode === 0) {
          uni.showToast({ title: `已删除 ${r.removed || ids.length} 条`, icon: 'success' })
          selectedIds.value = []
          await loadAll()
        } else {
          uni.showToast({ title: r.errMsg || '删除失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '删除失败', icon: 'none' })
      }
    }
  })
}

const filteredResources = computed(() => {
  const q = resourceSearch.value.trim().toLowerCase()
  return resources.value.filter(item => {
    const matchType = resourceFilter.value === 'all' || item.type === resourceFilter.value
    const matchQuery = !q ||
      item.title.toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.lang || '').toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    return matchType && matchQuery
  })
})

const showLanguageColumn = computed(() => resourceFilter.value === 'vocabulary')

const totalPages = computed(() => Math.max(1, Math.ceil(filteredResources.value.length / PAGE_SIZE)))

const pagedResources = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredResources.value.slice(start, start + PAGE_SIZE)
})

const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = []
  if (current > 3) pages.push(1, '...')
  const start = Math.max(1, current - 1)
  const end = Math.min(total, current + 1)
  for (let i = start; i <= end; i += 1) pages.push(i)
  if (current < total - 2) pages.push('...', total)
  return pages
})

function changePage(page) {
  const next = Number(page)
  if (!Number.isInteger(next) || next < 1 || next > totalPages.value || next === currentPage.value) return
  currentPage.value = next
  setTimeout(() => {
    if (typeof document === 'undefined') return
    const section = document.getElementById('learning-resource-management')
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 50)
}

watch([resourceSearch, resourceFilter], () => {
  currentPage.value = 1
})

watch(totalPages, (total) => {
  if (currentPage.value > total) currentPage.value = total
})

/* ===== 资源概览 KPI ===== */
const kpiTotal = computed(() => resources.value.length)
const kpiVideo = computed(() => resources.value.filter(item => item.type === 'video').length)
const kpiVocabulary = computed(() => resources.value.filter(item => item.type === 'vocabulary').length)
const kpiReading = computed(() => resources.value.filter(item => item.type === 'reading').length)
const kpiListening = computed(() => resources.value.filter(item => item.type === 'listening').length)

/* ===== 云端数据 ===== */
function getAdminToken() {
  return uni.getStorageSync('adminToken')
}

const LANGUAGES = ['英语', '德语', '法语', '拉丁语', '西班牙语']

function resourceTypeLabel(type) {
  const labels = {
    video: '视频',
    vocabulary: '词汇',
    reading: '文本阅读',
    listening: '听力训练'
  }
  return labels[type] || type || '未分类'
}

const CATEGORY_COLOR_CLASSES = [
  'qb-cat-blue',
  'qb-cat-green',
  'qb-cat-amber',
  'qb-cat-red',
  'qb-cat-violet',
  'qb-cat-teal',
  'qb-cat-pink'
]

function categoryColorClass(category) {
  const value = String(category || '待分类').trim()
  const lower = value.toLowerCase()
  const stableMap = {
    '国际仲裁': 'qb-cat-blue',
    'wto法': 'qb-cat-green',
    '跨境投资': 'qb-cat-amber',
    '海商法': 'qb-cat-red'
  }
  if (stableMap[lower]) return stableMap[lower]
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0
  }
  return CATEGORY_COLOR_CLASSES[Math.abs(hash) % CATEGORY_COLOR_CLASSES.length]
}

// 云文档 → 页面表格行
function toResourceItem(doc) {
  return {
    id: doc._id,
    type: doc.type || '',
    title: doc.title || '',
    category: doc.cat || '',
    lang: doc.lang || '英语',
    tagClass: categoryColorClass(doc.cat || ''),
    typeClass: doc.type === 'video' ? 'qb-type-single' : 'qb-type-multi',
    meta: doc.meta || '',
    diffClass: doc.diffClass || 'qb-diff-mid',
    fileUrl: doc.fileUrl || '',
    audioUrl: doc.audioUrl || '',
    content: doc.content || '',
    cover: doc.cover || '',
    description: doc.description || '',
    questions: Array.isArray(doc.questions) ? doc.questions : [],
    sortOrder: Number(doc.sortOrder) >= 0 ? Number(doc.sortOrder) : 9999,
    date: doc.date || '',
    status: doc.status || '审核中',
    statusClass: doc.statusClass || 'qb-diff-mid'
  }
}

async function loadAll() {
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.list({ adminToken: getAdminToken(), type: 'all' })) || {}
    if (r.errCode === 0) {
      resources.value = (r.list || []).map(toResourceItem)
      refreshUploadSortOrder()
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '资源加载失败', icon: 'none' })
  }
}

function nextSortOrderForType(type) {
  const max = resources.value
    .filter((item) => item.type === type)
    .reduce((result, item) => Math.max(result, Number(item.sortOrder) || 0), 0)
  return max + 1
}

function refreshUploadSortOrder() {
  uploadSortOrder.value = nextSortOrderForType(uploadType.value)
}

watch(uploadType, refreshUploadSortOrder)

/* ===== 方法 ===== */
const navigateTo = (url) => {
  uni.navigateTo({ url })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}

function createQuestion() {
  return { stem: '', options: ['', ''], answer: '' }
}

function addUploadQuestion() {
  uploadQuestions.value.push(createQuestion())
}

function removeUploadQuestion(index) {
  uploadQuestions.value.splice(index, 1)
}

function addUploadOption(questionIndex) {
  uploadQuestions.value[questionIndex].options.push('')
}

function addEditQuestion() {
  editQuestions.value.push(createQuestion())
}

function removeEditQuestion(index) {
  editQuestions.value.splice(index, 1)
}

function addEditOption(questionIndex) {
  editQuestions.value[questionIndex].options.push('')
}

let payload = {}

/* ===== 文件上传到云存储 ===== */
function safeFileName(name) {
  const extMatch = String(name || '').match(/\.[A-Za-z0-9]+$/)
  const ext = (extMatch && extMatch[0]) || ''
  const base = (String(name || 'file').replace(/\.[A-Za-z0-9]+$/, '') || 'file')
    .replace(/[^\w\-]+/g, '_')
    .slice(0, 40)
  return `${Date.now()}_${base}${ext}`
}

function isCancelError(err) {
  const msg = String((err && (err.errMsg || err.message)) || '').toLowerCase()
  const isUserCancel = msg.indexOf('cancel') >= 0 &&
    msg.indexOf('timeout') < 0 &&
    msg.indexOf('abort') < 0
  return isUserCancel
}

function chooseOneFile(extension) {
  return new Promise((resolve, reject) => {
    uni.chooseFile({
      count: 1,
      extension,
      success: (res) => {
        const file = res.tempFiles && res.tempFiles[0]
        if (!file) {
          reject(new Error('未选择文件'))
          return
        }
        resolve(file)
      },
      fail: (err) => reject(err)
    })
  })
}

function readLocalTextFile(file) {
  return new Promise((resolve, reject) => {
    if (Number(file && file.size) > 2 * 1024 * 1024) {
      reject(new Error('文本文件过大，请控制在 2MB 以内'))
      return
    }
    const path = (file && (file.path || file.tempFilePath)) || ''
    if (path.startsWith('blob:')) {
      fetch(path)
        .then((res) => res.text())
        .then(resolve)
        .catch(() => reject(new Error('读取文本文件失败，请改为复制粘贴文本')))
      return
    }
    if (!path) {
      reject(new Error('未获取到文本文件路径'))
      return
    }
    uni.getFileSystemManager().readFile({
      filePath: path,
      encoding: 'utf8',
      success: (res) => resolve(res.data || ''),
      fail: () => reject(new Error('读取文本文件失败，请改为复制粘贴文本'))
    })
  })
}

async function chooseListeningTextFile() {
  try {
    const file = await chooseOneFile(['.txt', '.text', '.md'])
    const text = await readLocalTextFile(file)
    uploadContent.value = text
    uploadListeningTextName.value = file.name || ''
    uni.showToast({ title: '文本已导入，可继续修改', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || '读取文本失败', icon: 'none', duration: 3000 })
    }
  }
}

function readWordFile(file) {
  return new Promise((resolve, reject) => {
    if (!window.mammoth) {
      reject(new Error('Word 解析组件未加载，请刷新页面后重试'))
      return
    }
    const path = (file && (file.path || file.tempFilePath)) || ''
    const parseArrayBuffer = (arrayBuffer) => {
      window.mammoth.extractRawText({ arrayBuffer })
        .then((result) => resolve(result.value || ''))
        .catch((err) => reject(new Error((err && err.message) || '解析 Word 文档失败')))
    }
    if (path.startsWith('blob:')) {
      fetch(path)
        .then((res) => res.arrayBuffer())
        .then(parseArrayBuffer)
        .catch(() => reject(new Error('读取 Word 文档失败')))
      return
    }
    if (file && typeof file.arrayBuffer === 'function') {
      file.arrayBuffer()
        .then(parseArrayBuffer)
        .catch(() => reject(new Error('读取 Word 文档失败')))
      return
    }
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error('读取 Word 文档失败'))
      reader.onload = () => parseArrayBuffer(reader.result)
      reader.readAsArrayBuffer(file)
      return
    }
    reject(new Error('当前环境不支持解析 Word 文档，请将内容复制粘贴到文本框'))
  })
}

async function chooseListeningWordFile() {
  try {
    const file = await chooseOneFile(['.docx'])
    const text = await readWordFile(file)
    uploadContent.value = text
    uploadListeningWordName.value = file.name || ''
    uni.showToast({ title: 'Word 已导入，可继续修改', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || '读取 Word 失败', icon: 'none', duration: 3000 })
    }
  }
}

async function chooseListeningZhTextFile() {
  try {
    const file = await chooseOneFile(['.txt', '.text', '.md'])
    const text = await readLocalTextFile(file)
    uploadDescription.value = text
    uploadListeningZhTextName.value = file.name || ''
    uni.showToast({ title: '中文文本已导入，可继续修改', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || '读取文本失败', icon: 'none', duration: 3000 })
    }
  }
}

async function chooseListeningZhWordFile() {
  try {
    const file = await chooseOneFile(['.docx'])
    const text = await readWordFile(file)
    uploadDescription.value = text
    uploadListeningZhWordName.value = file.name || ''
    uni.showToast({ title: '中文 Word 已导入，可继续修改', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || '读取 Word 失败', icon: 'none', duration: 3000 })
    }
  }
}

async function chooseEditListeningTextFile() {
  try {
    const file = await chooseOneFile(['.txt', '.text', '.md'])
    const text = await readLocalTextFile(file)
    editForm.content = text
    editListeningTextName.value = file.name || ''
    uni.showToast({ title: '文本已导入，可继续修改', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || '读取文本失败', icon: 'none', duration: 3000 })
    }
  }
}

async function chooseEditListeningWordFile() {
  try {
    const file = await chooseOneFile(['.docx'])
    const text = await readWordFile(file)
    editForm.content = text
    editListeningWordName.value = file.name || ''
    uni.showToast({ title: 'Word 已导入，可继续修改', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || '读取 Word 失败', icon: 'none', duration: 3000 })
    }
  }
}

async function chooseEditListeningZhTextFile() {
  try {
    const file = await chooseOneFile(['.txt', '.text', '.md'])
    const text = await readLocalTextFile(file)
    editForm.description = text
    editListeningZhTextName.value = file.name || ''
    uni.showToast({ title: '中文文本已导入，可继续修改', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || '读取文本失败', icon: 'none', duration: 3000 })
    }
  }
}

async function chooseEditListeningZhWordFile() {
  try {
    const file = await chooseOneFile(['.docx'])
    const text = await readWordFile(file)
    editForm.description = text
    editListeningZhWordName.value = file.name || ''
    uni.showToast({ title: '中文 Word 已导入，可继续修改', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || '读取 Word 失败', icon: 'none', duration: 3000 })
    }
  }
}

/* 根据文件大小 & 类型推算需要的超时时间，避免大文件被默认的 60s 超时掐断 */
function calcUploadTimeout(file, label) {
  const size = Number(file && file.size) || 0
  const name = String(file && file.name || '').toLowerCase()
  // 粗略假定上传速率下限 0.5 MB/s（公司网/弱网），给 2.5 倍冗余；最少 2 分钟
  const minRateBps = 0.5 * 1024 * 1024
  const bySizeMs = size > 0 ? Math.ceil((size / minRateBps) * 2.5 * 1000) : 0

  // 不同文件类型的兜底上限
  let typeCapMs = 2 * 60 * 1000 // 默认 2 分钟（小图）
  if (label === '封面') typeCapMs = 10 * 60 * 1000           // 大图 10 分钟
  else if (label === '音频') typeCapMs = 60 * 60 * 1000     // 音频 1 小时
  else if (['视频', '文件'].indexOf(label) >= 0) typeCapMs = 2 * 60 * 60 * 1000  // 视频 / PDF → 2 小时

  // 如果是音视频后缀，进一步放宽
  if (/\.(mp4|mov|m4v|webm|mkv|avi|flv)$/i.test(name)) typeCapMs = Math.max(typeCapMs, 2 * 60 * 60 * 1000)
  if (/\.(mp3|m4a|wav|aac|flac|ogg)$/i.test(name)) typeCapMs = Math.max(typeCapMs, 60 * 60 * 1000)
  if (/\.(pdf|zip|rar|7z|doc|docx|ppt|pptx|xls|xlsx)$/i.test(name)) typeCapMs = Math.max(typeCapMs, 90 * 60 * 1000)

  const result = Math.max(2 * 60 * 1000, Math.max(bySizeMs, typeCapMs))
  return result
}

/* 选择大文件时，提前给出警告提示，让管理员做好长时间等待的心理准备 */
function warnIfLargeFile(file, label) {
  if (!file || typeof file.size !== 'number' || file.size <= 0) return true
  // 视频/PDF > 200MB，音频 > 50MB，封面 > 10MB 视为大文件
  const thresholds = {
    '视频': 200 * 1024 * 1024,
    '音频':  50 * 1024 * 1024,
    '文件': 100 * 1024 * 1024,
    '封面':  10 * 1024 * 1024
  }
  const limit = thresholds[label] || (100 * 1024 * 1024)
  if (file.size >= limit) {
    const msg = `${label}文件较大（${formatFileSize(file.size)}），上传时间较长。\n建议：\n① 保持当前页面不要关闭/切换；\n② 若反复失败，可先使用 OSS / COS / Bilibili 等上传工具，把返回的公开 URL 直接粘贴到旁边的输入框即可跳过本地上传。\n\n是否继续？`
    return confirm(msg)
  }
  return true
}

function uploadToCloud(file, dir, options = {}) {
  const label = options.label || '文件'
  const timeout = options.timeout || calcUploadTimeout(file, label)
  return uniCloud.uploadFile({
    filePath: file.path,
    cloudPath: `${dir}/${safeFileName(file.name)}`,
    cloudPathAsRealPath: true,
    timeout,
    onUploadProgress: (progressEvent) => {
      if (progressEvent && Number(progressEvent.total) > 0 && options.onProgress) {
        const percent = Math.min(99, Math.max(0, Math.round((Number(progressEvent.loaded) / Number(progressEvent.total)) * 100)))
        options.onProgress(percent)
      }
    }
  }).then((res) => {
    const url = (res && (res.fileID || res.fileUrl || res.url)) || ''
    if (!/^https?:\/\//.test(url)) {
      throw new Error('上传完成但未获取到可访问地址，请手动填写 URL')
    }
    return url
  })
}

function isRetryableUploadError(err) {
  const msg = String((err && (err.errMsg || err.message)) || '').toLowerCase()
  return msg.indexOf('timeout') >= 0 ||
    msg.indexOf('network') >= 0 ||
    msg.indexOf('etimedout') >= 0 ||
    msg.indexOf('请求超时') >= 0 ||
    msg.indexOf('上传超时') >= 0 ||
    msg.indexOf('econnreset') >= 0 ||
    msg.indexOf('socket hang up') >= 0 ||
    msg.indexOf('broken pipe') >= 0
}

async function uploadWithRetry(file, dir, label, onProgress) {
  const maxAttempts = 5
  const timeout = calcUploadTimeout(file, label)
  let lastError = null
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await uploadToCloud(file, dir, { label, timeout, onProgress })
    } catch (e) {
      lastError = e
      if (!isRetryableUploadError(e) || attempt >= maxAttempts) break
      const waitSec = Math.min(10, attempt * 2)
      if (onProgress) onProgress(0, `第${attempt}次${isRetryableUploadError(e) ? '超时' : '失败'}，${waitSec}s后重试(${attempt}/${maxAttempts})`)
      await new Promise((resolve) => setTimeout(resolve, waitSec * 1000))
    }
  }
  if (lastError) {
    const rawMsg = String((lastError && (lastError.errMsg || lastError.message)) || lastError || '未知错误')
    const hint = `\n\n若持续失败：可把文件先上传到阿里云 OSS / 腾讯云 COS / B站等可生成公开 HTTPS 链接的平台，将链接复制粘贴到"${label === '封面' ? '封面 URL' : '云存储 URL'}"输入框即可继续发布。`
    const err = new Error(rawMsg + hint)
    throw err
  }
  throw new Error(`${label}上传失败`)
}

function formatFileSize(bytes) {
  const value = Number(bytes) || 0
  if (value <= 0) return ''
  if (value < 1024 * 1024) return `${Math.round(value / 1024)}KB`
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)}MB`
  return `${(value / (1024 * 1024 * 1024)).toFixed(2)}GB`
}

function probeVideoDuration(file) {
  if (!file) return Promise.resolve('')
  if (Number(file.duration) > 0) {
    return Promise.resolve(formatVideoDuration(Number(file.duration)))
  }
  return new Promise((resolve) => {
    let timer = null
    let objectUrl = ''
    const cleanup = () => {
      if (timer) clearTimeout(timer)
      if (objectUrl && URL && URL.revokeObjectURL) URL.revokeObjectURL(objectUrl)
    }
    try {
      if (typeof document === 'undefined' || typeof window === 'undefined') {
        resolve('')
        return
      }
      const video = document.createElement('video')
      video.preload = 'metadata'
      objectUrl = URL.createObjectURL(file)
      timer = setTimeout(() => {
        cleanup()
        resolve('')
      }, 8000)
      video.onloadedmetadata = () => {
        const duration = video.duration
        cleanup()
        resolve(formatVideoDuration(duration))
      }
      video.onerror = () => {
        cleanup()
        resolve('')
      }
      video.src = objectUrl
    } catch (e) {
      cleanup()
      resolve('')
    }
  })
}

function formatVideoDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  if (h > 0) return `${String(h).padStart(2, '0')}:${mm}:${ss}`
  return `${mm}:${ss}`
}

async function chooseVideoFile() {
  if (uploadingVideo.value) return
  try {
    const file = await chooseOneFile(['.mp4', '.mov', '.m4v', '.webm'])
    if (!warnIfLargeFile(file, '视频')) return
    const duration = await probeVideoDuration(file)
    uploadingVideo.value = true
    uni.showLoading({ title: `视频上传中${file.size ? ' ' + formatFileSize(file.size) : ''}`, mask: true })
    const url = await uploadWithRetry(file, 'upload/video', '视频', (percent, message) => {
      uni.showLoading({
        title: message || `视频上传中 ${percent}%`,
        mask: true
      })
    })
    uploadUrl.value = url
    uploadVideoName.value = file.name
    if (!uploadTitle.value.trim() && file.name) {
      uploadTitle.value = String(file.name).replace(/\.[^.]+$/, '')
    }
    if (duration && !uploadMeta.value.trim()) {
      uploadMeta.value = duration
    }
    uni.showToast({ title: '视频已上传', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || (e && e.errMsg) || '视频上传失败', icon: 'none', duration: 5000 })
    }
  } finally {
    uploadingVideo.value = false
    uni.hideLoading()
  }
}

async function chooseAudioFile() {
  if (uploadingAudio.value) return
  try {
    const file = await chooseOneFile(['.mp3', '.m4a', '.wav', '.aac'])
    if (!warnIfLargeFile(file, '音频')) return
    uploadingAudio.value = true
    uni.showLoading({ title: `音频上传中${file.size ? ' ' + formatFileSize(file.size) : ''}`, mask: true })
    const url = await uploadWithRetry(file, 'upload/audio', '音频', (percent, message) => {
      uni.showLoading({
        title: message || `音频上传中 ${percent}%`,
        mask: true
      })
    })
    uploadAudioUrl.value = url
    uploadAudioName.value = file.name
    uni.showToast({ title: '音频已上传', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || (e && e.errMsg) || '音频上传失败', icon: 'none', duration: 5000 })
    }
  } finally {
    uploadingAudio.value = false
    uni.hideLoading()
  }
}

async function choosePdfFile() {
  if (uploadingPdf.value) return
  try {
    const file = await chooseOneFile(['.pdf'])
    if (!warnIfLargeFile(file, '文件')) return
    uploadingPdf.value = true
    uni.showLoading({ title: `文件上传中${file.size ? ' ' + formatFileSize(file.size) : ''}`, mask: true })
    const url = await uploadWithRetry(file, 'upload/file', '文件', (percent, message) => {
      uni.showLoading({
        title: message || `文件上传中 ${percent}%`,
        mask: true
      })
    })
    uploadUrl.value = url
    uploadPdfName.value = file.name
    uni.showToast({ title: '文件已上传', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || (e && e.errMsg) || '文件上传失败', icon: 'none', duration: 5000 })
    }
  } finally {
    uploadingPdf.value = false
    uni.hideLoading()
  }
}

async function chooseCoverFile() {
  if (uploadingCover.value) return
  try {
    const file = await chooseOneFile(['.jpg', '.jpeg', '.png', '.webp'])
    if (!warnIfLargeFile(file, '封面')) return
    uploadingCover.value = true
    uni.showLoading({ title: `封面上传中${file.size ? ' ' + formatFileSize(file.size) : ''}`, mask: true })
    const url = await uploadWithRetry(file, 'upload/cover', '封面', (percent, message) => {
      uni.showLoading({
        title: message || `封面上传中 ${percent}%`,
        mask: true
      })
    })
    if (editVisible.value) {
      editForm.cover = url
    } else {
      uploadCover.value = url
    }
    uploadCoverName.value = file.name
    uni.showToast({ title: '封面已上传', icon: 'success' })
  } catch (e) {
    if (!isCancelError(e)) {
      uni.showToast({ title: (e && e.message) || (e && e.errMsg) || '封面上传失败', icon: 'none', duration: 5000 })
    }
  } finally {
    uploadingCover.value = false
    uni.hideLoading()
  }
}

const handleUpload = (publishNow) => {
  doUpload(publishNow)
}

const doUpload = async (publishNow = false) => {
  const title = uploadTitle.value.trim()
  if (!title) {
    uni.showToast({ title: '请输入资源标题', icon: 'none' })
    return
  }
  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const meta = uploadMeta.value.trim()

  payload = {
    title,
    cat: uploadCategory.value.trim() || '待分类',
    tagClass: categoryColorClass(uploadCategory.value.trim() || '待分类'),
    meta: uploadType.value === 'video' ? (meta || '--:--') : meta,
    diffClass: 'qb-diff-mid',
    cover: uploadCover.value.trim(),
    fileUrl: uploadUrl.value.trim(),
    audioUrl: uploadAudioUrl.value.trim(),
    content: uploadContent.value.trim(),
    description: uploadDescription.value.trim(),
    lang: uploadType.value === 'vocabulary' ? uploadLang.value : '',
    questions: uploadQuestions.value.map(q => ({
      stem: q.stem.trim(),
      options: (q.options || []).map(o => o.trim()),
      answer: String(q.answer || '').trim()
    })),
    sortOrder: Number(uploadSortOrder.value) >= 0 ? Number(uploadSortOrder.value) : 1,
    status: publishNow ? '已上线' : '审核中',
    statusClass: publishNow ? 'qb-diff-easy' : 'qb-diff-mid'
  }

  let r
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    r = (await resourcesObj.add({ adminToken: getAdminToken(), type: uploadType.value, data: { ...payload, date } })) || {}
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '上传失败', icon: 'none' })
    return
  }
  if (r.errCode !== 0) {
    uni.showToast({ title: r.errMsg || '上传失败', icon: 'none' })
    return
  }

  resources.value.unshift(toResourceItem({ _id: r.id, type: uploadType.value, ...payload, date }))
  refreshUploadSortOrder()

  uploadTitle.value = ''
  uploadMeta.value = ''
  uploadUrl.value = ''
  uploadCover.value = ''
  uploadCategory.value = ''
  uploadDescription.value = ''
  uploadContent.value = ''
  uploadAudioUrl.value = ''
  uploadLang.value = '英语'
  uploadQuestions.value = []
  uploadVideoName.value = ''
  uploadAudioName.value = ''
  uploadPdfName.value = ''
  uploadCoverName.value = ''
  uploadListeningTextName.value = ''
  uploadListeningWordName.value = ''
  uploadListeningZhTextName.value = ''
  uploadListeningZhWordName.value = ''
  uni.showToast({ title: publishNow ? '已保存并上线' : '保存成功，等待审核', icon: 'success' })
}

const openEdit = (item) => {
  editType.value = item.type || 'video'
  editTarget.value = item
  editForm.id = item.id
  editForm.type = editType.value
  editForm.title = item.title || ''
  editForm.cat = item.category || item.cat || ''
  editForm.lang = item.lang || '英语'
  editForm.tagClass = categoryColorClass(item.category || item.cat || '')
  editForm.meta = item.meta || ''
  editForm.diffClass = item.diffClass || 'qb-diff-mid'
  editForm.fileUrl = item.fileUrl || ''
  editForm.audioUrl = item.audioUrl || ''
  editForm.content = item.content || ''
  editForm.cover = item.cover || ''
  editForm.description = item.description || ''
  editForm.sortOrder = Number(item.sortOrder) >= 0 ? Number(item.sortOrder) : 1
  editForm.date = item.date || ''
  editForm.status = item.status || '审核中'
  editForm.statusClass = item.statusClass || (editForm.status === '已上线' ? 'qb-diff-easy' : 'qb-diff-mid')
  editQuestions.value = (item.questions || []).map(q => ({
    stem: q.stem || '',
    options: Array.isArray(q.options) && q.options.length ? q.options.map(o => String(o || '')) : ['', ''],
    answer: q.answer === undefined || q.answer === null ? '' : String(q.answer)
  }))
  editListeningTextName.value = ''
  editListeningWordName.value = ''
  editListeningZhTextName.value = ''
  editListeningZhWordName.value = ''
  editVisible.value = true
}

const closeEdit = () => {
  if (editSaving.value) return
  editVisible.value = false
  editTarget.value = null
}

const syncStatusClass = () => {
  editForm.statusClass = editForm.status === '已上线' ? 'qb-diff-easy' : 'qb-diff-mid'
}

const saveEdit = async () => {
  const title = editForm.title.trim()
  if (!title) {
    uni.showToast({ title: '请输入资源标题', icon: 'none' })
    return
  }

  const data = {
    title,
    cat: editForm.cat.trim() || '待分类',
    tagClass: categoryColorClass(editForm.cat.trim() || '待分类'),
    meta: editForm.meta.trim(),
    diffClass: editForm.diffClass || 'qb-diff-mid',
    fileUrl: editForm.fileUrl.trim(),
    audioUrl: editForm.audioUrl.trim(),
    content: editForm.content.trim(),
    cover: editForm.cover.trim(),
    description: editForm.description.trim(),
    lang: editType.value === 'vocabulary' ? editForm.lang : '',
    questions: editQuestions.value.map(q => ({
      stem: q.stem.trim(),
      options: (q.options || []).map(o => o.trim()),
      answer: String(q.answer || '').trim()
    })),
    sortOrder: Number(editForm.sortOrder) >= 0 ? Number(editForm.sortOrder) : 1,
    date: editForm.date.trim(),
    status: editForm.status,
    statusClass: editForm.statusClass
  }

  editSaving.value = true
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.update({ adminToken: getAdminToken(), id: editForm.id, data })) || {}
    if (r.errCode !== 0) {
      uni.showToast({ title: r.errMsg || '保存失败', icon: 'none' })
      return
    }

    const target = editTarget.value
    if (target) {
      target.title = data.title
      target.cat = data.cat
      target.tagClass = categoryColorClass(data.cat)
      target.meta = data.meta
      target.diffClass = data.diffClass
      target.fileUrl = data.fileUrl
      target.audioUrl = data.audioUrl
      target.content = data.content
      target.cover = data.cover
      target.description = data.description
      target.lang = data.lang
      target.questions = data.questions
      target.sortOrder = data.sortOrder
      target.date = data.date
      target.status = data.status
      target.statusClass = data.statusClass
      target.category = data.cat
    }

    editVisible.value = false
    editTarget.value = null
    editListeningTextName.value = ''
    editListeningWordName.value = ''
    editListeningZhTextName.value = ''
    editListeningZhWordName.value = ''
    uni.showToast({ title: '已保存', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '保存失败', icon: 'none' })
  } finally {
    editSaving.value = false
  }
}

const handleDelete = (type, item) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除资源「${item.title}」吗？`,
    confirmColor: '#DC2626',
    success: async (res) => {
      if (!res.confirm) return
      try {
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.remove({ adminToken: getAdminToken(), id: item.id })) || {}
        if (r.errCode === 0) {
          resources.value = resources.value.filter(v => v.id !== item.id)
          uni.showToast({ title: '已删除', icon: 'success' })
        } else {
          uni.showToast({ title: r.errMsg || '删除失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '删除失败', icon: 'none' })
      }
    }
  })
}

onMounted(() => {
  if (!requireAdmin()) return
  loadAll()
  setTimeout(() => {
    visibleSections.value = [true, true, true]
  }, 100)
})
</script>

<style scoped>
/* ============================================
   Brand CSS Variables
   ============================================ */
.app-shell {
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-active: #1E40AF;
  --rule-primary-foreground: #FFFFFF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;
  --rule-background: #F8FAFC;
  --rule-foreground: #0F172A;
  --rule-card: #FFFFFF;
  --rule-card-foreground: #0F172A;
  --rule-popover: #FFFFFF;
  --rule-popover-foreground: #0F172A;
  --rule-muted: #F1F5F9;
  --rule-muted-foreground: #64748B;
  --rule-border: #E2E8F0;
  --rule-input: #E2E8F0;
  --rule-ring: #2563EB;
  --rule-radius-small: 4px;
  --rule-radius-medium: 8px;
  --rule-radius-large: 16px;
  --rule-radius-full: 9999px;
  --state-success: #16A34A;
  --state-success-tint: #DCFCE7;
  --state-warning: #D97706;
  --state-warning-tint: #FEF3C7;
  --state-error: #DC2626;
  --state-error-tint: #FEE2E2;
  --state-info: #2563EB;
  --state-info-tint: #DBEAFE;
  --state-violet: #7C3AED;
  --state-violet-tint: #EDE9FE;
  --state-teal: #0F766E;
  --state-teal-tint: #CCFBF1;
  --state-pink: #BE185D;
  --state-pink-tint: #FCE7F3;
  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-line: #E2E8F0;
  --rule-surface: #FFFFFF;
  --rule-surface-2: #F8FAFC;
  --rule-shadow-1: 0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.02);
  --rule-shadow-2: 0 8px 24px -8px rgba(15,23,42,.12);
  --rule-shadow-3: 0 24px 60px -20px rgba(15,23,42,.20);
  --rule-font-mono: "JetBrains Mono", "SF Mono", "Consolas", monospace;
  display: flex;
  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root { --qb-ease: cubic-bezier(.2,.8,.2,1); }

/* ===== Sidebar ===== */
.app-sidebar {
  position: fixed; left: 0; top: 0; height: 100vh; width: 240px;
  display: flex; flex-direction: column;
  background: var(--rule-card); border-right: 1px solid var(--rule-border);
  z-index: 40; flex-shrink: 0;
}
.app-sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 24px; border-bottom: 1px solid var(--rule-border);
  color: inherit;
}
.app-sidebar-logo-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
  box-shadow: 0 4px 10px -2px color-mix(in srgb, var(--rule-primary) 40%, transparent);
}
.ls-svg-glyph {
  width: 20px; height: 20px; background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
}
.app-sidebar-logo-text {
  display: flex; flex-direction: column; line-height: 1.4;
}
.app-sidebar-logo-text text:first-child {
  font-size: 15px; font-weight: 600; color: var(--rule-foreground);
  white-space: nowrap;
}
.app-sidebar-logo-text text:last-child {
  font-size: 12px; font-weight: 500; color: var(--rule-ink-3);
}
.app-sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
.app-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px;
  font-size: 14px; font-weight: 500; color: var(--rule-ink-2);
  cursor: pointer; transition: background 0.2s ease, color 0.2s ease;
}
.app-nav-item:hover { background: var(--rule-muted); color: var(--rule-foreground); }
.app-nav-item.is-active { background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active)); color: #fff; box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--rule-primary) 45%, transparent); }
.app-nav-item.is-active:hover { background: var(--rule-primary-hover); color: #fff; }
.app-nav-item.is-active .navi-icon { background: #fff; }
.app-nav-divider { height: 1px; background: var(--rule-border); margin: 8px 4px; }

.navi-icon { width: 20px; height: 20px; flex-shrink: 0; background: currentColor; display: inline-block; }

.navi-icon-dashboard {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='7' height='9' x='3' y='3' rx='1'/><rect width='7' height='5' x='14' y='3' rx='1'/><rect width='7' height='9' x='14' y='12' rx='1'/><rect width='7' height='5' x='3' y='16' rx='1'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='7' height='9' x='3' y='3' rx='1'/><rect width='7' height='5' x='14' y='3' rx='1'/><rect width='7' height='9' x='14' y='12' rx='1'/><rect width='7' height='5' x='3' y='16' rx='1'/></svg>") center/contain no-repeat;
}
.navi-icon-file-question {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><path d='M9 12.01h6'/><path d='M9 16.01h3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><path d='M9 12.01h6'/><path d='M9 16.01h3'/></svg>") center/contain no-repeat;
}
.navi-icon-book {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}
.navi-icon-users {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>") center/contain no-repeat;
}
.navi-icon-folder {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>") center/contain no-repeat;
}
.navi-icon-logout {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}
.navi-icon-video {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='3' rx='2'/><path d='M7 3v18'/><path d='M17 3v18'/><path d='M3 7.5h4'/><path d='M3 12h18'/><path d='M3 16.5h4'/><path d='M17 7.5h4'/><path d='M17 16.5h4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='3' rx='2'/><path d='M7 3v18'/><path d='M17 3v18'/><path d='M3 7.5h4'/><path d='M3 12h18'/><path d='M3 16.5h4'/><path d='M17 7.5h4'/><path d='M17 16.5h4'/></svg>") center/contain no-repeat;
}
.navi-icon-mic {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z'/><path d='M19 10v2a7 7 0 0 1-14 0v-2'/><line x1='12' x2='12' y1='19' y2='22'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z'/><path d='M19 10v2a7 7 0 0 1-14 0v-2'/><line x1='12' x2='12' y1='19' y2='22'/></svg>") center/contain no-repeat;
}
.navi-icon-book-open {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}
.navi-icon-file-text {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><line x1='10' y1='9' x2='8' y2='9'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><line x1='10' y1='9' x2='8' y2='9'/></svg>") center/contain no-repeat;
}
.navi-icon-trending-up-sm {
  width: 14px; height: 14px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>") center/contain no-repeat;
}
.navi-icon-search {
  width: 18px; height: 18px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
}
.navi-icon-upload-cloud {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242'/><path d='M12 12v9'/><path d='m16 16-4-4-4 4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242'/><path d='M12 12v9'/><path d='m16 16-4-4-4 4'/></svg>") center/contain no-repeat;
}
.navi-icon-check-circle {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><path d='m9 11 3 3L22 4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><path d='m9 11 3 3L22 4'/></svg>") center/contain no-repeat;
}
.navi-icon-check {
  width: 16px; height: 16px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 6 9 17l-5-5'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 6 9 17l-5-5'/></svg>") center/contain no-repeat;
}
.navi-icon-pencil {
  width: 14px; height: 14px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/><path d='m15 5 4 4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/><path d='m15 5 4 4'/></svg>") center/contain no-repeat;
}
.navi-icon-trash-2 {
  width: 14px; height: 14px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/><line x1='10' y1='11' x2='10' y2='17'/><line x1='14' y1='11' x2='14' y2='17'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/><line x1='10' y1='11' x2='10' y2='17'/><line x1='14' y1='11' x2='14' y2='17'/></svg>") center/contain no-repeat;
}

/* ===== Sidebar User ===== */
.app-sidebar-user { padding: 16px 12px; border-top: 1px solid var(--rule-border); }
.app-sidebar-user-inner {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 12px; cursor: pointer; border-radius: 8px;
  transition: background 0.15s ease;
}
.app-sidebar-user-inner:hover { background: var(--rule-muted); }
.app-sidebar-user-avatar {
  width: 32px; height: 32px; border-radius: 9999px;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: var(--rule-primary-foreground);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; flex-shrink: 0;
}
.app-sidebar-user-name { display: block; font-size: 13px; font-weight: 500; color: var(--rule-foreground); }
.app-sidebar-user-role { display: block; font-size: 12px; color: var(--rule-muted-foreground); }

/* ===== Main ===== */
.app-main { flex: 1; margin-left: 240px; display: flex; flex-direction: column; min-height: 100vh; min-width: 0; }
.app-topbar {
  height: 64px; border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card); display: flex; align-items: center;
  justify-content: space-between; padding: 0 32px; flex-shrink: 0;
  position: sticky; top: 0; z-index: 30;
}
.app-topbar-titles { display: flex; flex-direction: column; gap: 2px; }
.app-topbar-title { font-size: 18px; font-weight: 600; color: var(--rule-foreground); }
.app-topbar-breadcrumb { font-size: 12px; color: var(--rule-muted-foreground); }
.app-topbar-meta { font-size: 13px; color: var(--rule-muted-foreground);font-variant-numeric:tabular-nums; }
.app-content { flex: 1; padding: 28px 32px; max-width: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box; }

/* ===== Scroll Reveal ===== */
.dc-section {
  margin-bottom: 28px; opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s var(--qb-ease), transform 0.7s var(--qb-ease);
}
.dc-section:last-child { margin-bottom: 0; }
.dc-section.is-visible { opacity: 1; transform: translateY(0); }

/* ===== Section Header ===== */
.qb-section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.qb-section-title-wrap { display: flex; align-items: center; gap: 14px; }
.qb-section-bar {
  width: 6px; height: 22px; border-radius: 3px; flex-shrink: 0;
  background: linear-gradient(180deg, var(--rule-primary), var(--rule-primary-active));
}
.qb-section-title { font-size: 17px; font-weight: 700; color: var(--rule-foreground); letter-spacing: -0.01em; line-height: 1.3; }
.qb-section-subtitle { font-size: 13px; color: var(--rule-muted-foreground); display: block; margin-top: 2px; }

/* ===== KPI Cards ===== */
.qb-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.qb-kpi-card {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px;
  display: flex; flex-direction: column; gap: 14px; min-width: 0;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
  transition: transform 0.3s var(--qb-ease), box-shadow 0.3s var(--qb-ease), border-color 0.3s var(--qb-ease);
}
.qb-kpi-card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--rule-primary) 30%, transparent);
  box-shadow: 0 4px 8px color-mix(in srgb, var(--rule-primary) 12%, transparent), 0 22px 44px -14px color-mix(in srgb, var(--rule-primary) 38%, transparent);
}
.qb-kpi-card::before {
  content: ''; position: absolute; top: 0; right: 0;
  width: 130px; height: 130px; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--rule-primary) 12%, transparent), transparent 70%);
  transform: translate(40px, -40px);
}
.qb-kpi-card.qb-accent-success:hover {
  border-color: color-mix(in srgb, var(--state-success) 30%, transparent);
  box-shadow: 0 4px 8px color-mix(in srgb, var(--state-success) 12%, transparent), 0 22px 44px -14px color-mix(in srgb, var(--state-success) 38%, transparent);
}
.qb-kpi-card.qb-accent-success::before { background: radial-gradient(circle, color-mix(in srgb, var(--state-success) 12%, transparent), transparent 70%); }
.qb-kpi-card.qb-accent-warning:hover {
  border-color: color-mix(in srgb, var(--state-warning) 30%, transparent);
  box-shadow: 0 4px 8px color-mix(in srgb, var(--state-warning) 12%, transparent), 0 22px 44px -14px color-mix(in srgb, var(--state-warning) 38%, transparent);
}
.qb-kpi-card.qb-accent-warning::before { background: radial-gradient(circle, color-mix(in srgb, var(--state-warning) 12%, transparent), transparent 70%); }
.qb-kpi-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; position: relative; z-index: 1; }
.qb-kpi-card-label { font-size: 13px; color: var(--rule-muted-foreground); font-weight: 500; }
.qb-kpi-card-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--rule-primary) 48%, transparent);
}
.qb-kpi-card-icon .navi-icon { width: 22px; height: 22px; background: var(--rule-primary-foreground); }
.qb-kpi-card.qb-accent-success .qb-kpi-card-icon { background: linear-gradient(135deg, var(--state-success), color-mix(in srgb, var(--state-success) 70%, var(--rule-ink))); box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--state-success) 48%, transparent); }
.qb-kpi-card.qb-accent-warning .qb-kpi-card-icon { background: linear-gradient(135deg, var(--state-warning), color-mix(in srgb, var(--state-warning) 70%, var(--rule-ink))); box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--state-warning) 48%, transparent); }
.qb-kpi-card-value { font-size: 32px; font-weight: 700; line-height: 1.1; color: var(--rule-foreground); font-variant-numeric: tabular-nums; letter-spacing: -0.02em; position: relative; z-index: 1; }
.qb-kpi-card-foot { font-size: 12px; color: var(--rule-muted-foreground); position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 6px; }

/* ===== Toolbar ===== */
.qb-toolbar {
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 18px 22px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
}
.qb-toolbar-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.qb-search { position: relative; flex: 1 1 240px; min-width: 220px; }
.qb-batch-del {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  background: #FEE2E2;
  color: #B91C1C;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s ease;
  flex-shrink: 0;
}
.qb-batch-del:hover { background: #FECACA; }
.qb-batch-del .navi-icon {
  width: 14px;
  height: 14px;
  background: currentColor;
}
.qb-check-col {
  width: 36px;
  text-align: center;
}
.qb-check {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid #CBD5E1;
  background: #fff;
  cursor: pointer;
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
  transition: border-color .15s ease, background .15s ease;
}
.qb-check:hover { border-color: #2563EB; }
.qb-check.is-checked {
  background: #2563EB;
  border-color: #2563EB;
}
.qb-check.is-checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.qb-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--rule-muted-foreground); }
.qb-search-input {
  width: 100%; height: 42px; padding: 0 16px 0 42px;
  border-radius: var(--rule-radius-full);
  border: 1px solid var(--rule-border); background: var(--rule-card);
  color: var(--rule-foreground); font-size: 14px;
  outline: none; box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.qb-search-input::placeholder { color: var(--rule-muted-foreground); }
.qb-search-input:focus { border-color: var(--rule-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--rule-primary) 18%, transparent); }

.qb-filter-group { display: inline-flex; align-items: center; gap: 8px; }
.qb-filter-label { font-size: 13px; color: var(--rule-muted-foreground); font-weight: 500; white-space: nowrap; }
.qb-pills { display: inline-flex; gap: 4px; background: var(--rule-muted); padding: 4px; border-radius: var(--rule-radius-full); }
.qb-pill {
  font-size: 13px; font-weight: 500; padding: 6px 14px;
  border-radius: var(--rule-radius-full); cursor: pointer;
  color: var(--rule-muted-foreground);
  background: transparent; white-space: nowrap;
  transition: background 0.25s var(--qb-ease), color 0.25s var(--qb-ease), box-shadow 0.25s var(--qb-ease);
}
.qb-pill:hover { color: var(--rule-foreground); }
.qb-pill.is-active {
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: var(--rule-primary-foreground);
  box-shadow: 0 4px 10px -2px color-mix(in srgb, var(--rule-primary) 42%, transparent);
}

.qb-create-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: var(--rule-primary-foreground);
  padding: 10px 20px; border-radius: var(--rule-radius-full);
  cursor: pointer; white-space: nowrap;
  box-shadow: 0 8px 20px -4px color-mix(in srgb, var(--rule-primary) 42%, transparent);
  transition: transform 0.3s var(--qb-ease), box-shadow 0.3s var(--qb-ease);
}
.qb-create-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -4px color-mix(in srgb, var(--rule-primary) 56%, transparent); }
.qb-create-btn .navi-icon { width: 16px; height: 16px; background: var(--rule-primary-foreground); }
.qb-create-btn-success {
  background: linear-gradient(135deg, var(--state-success), color-mix(in srgb, var(--state-success) 72%, var(--rule-ink)));
  box-shadow: 0 8px 20px -4px color-mix(in srgb, var(--state-success) 46%, transparent);
}
.qb-create-btn-success:hover {
  box-shadow: 0 12px 28px -4px color-mix(in srgb, var(--state-success) 58%, transparent);
}

/* ===== Table Card ===== */
#learning-resource-management {
  scroll-margin-top: 80px;
}

.qb-table-card {
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
}
.qb-table-container { overflow-x: auto; }
.qb-table { width: 100%; border-collapse: collapse; min-width: 920px; }
.qb-table thead th {
  font-size: 13px; font-weight: 600; color: var(--rule-muted-foreground);
  text-align: left; padding: 12px 16px;
  border-bottom: 1px solid var(--rule-border); white-space: nowrap;
}
.qb-table tbody td {
  font-size: 14px; color: var(--rule-foreground);
  padding: 14px 16px; border-bottom: 1px solid var(--rule-border);
  vertical-align: middle;
}
.qb-table tbody tr:last-child td { border-bottom: none; }
.qb-table tbody tr { transition: background 0.2s ease; }
.qb-table tbody tr:hover { background: color-mix(in srgb, var(--rule-primary) 5%, transparent); }
.qb-qid { font-family: var(--rule-font-mono); font-size: 13px; font-weight: 600; color: var(--rule-primary); white-space: nowrap; }
.qb-qcontent { color: var(--rule-ink-2); max-width: 340px; }
.qb-qcontent-text { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }
.qb-empty-row { padding: 28px 16px; text-align: center; font-size: 13px; color: var(--rule-muted-foreground); }
.qb-date { color: var(--rule-muted-foreground); font-variant-numeric: tabular-nums; white-space: nowrap; font-size: 13px; }

/* pagination */
.qb-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 18px;
}
.qb-pagination-info {
  font-size: 13px;
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
}
.qb-pagination-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.qb-page-item {
  display: inline-flex;
}
.qb-page-btn,
.qb-page-ellipsis {
  min-width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: 1px solid var(--rule-border);
  border-radius: 8px;
  background: var(--rule-card);
  color: var(--rule-ink-2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}
.qb-page-ellipsis {
  border-color: transparent;
  background: transparent;
  cursor: default;
}
.qb-page-btn:hover:not(.is-disabled):not(.is-active) {
  border-color: var(--rule-primary);
  color: var(--rule-primary);
}
.qb-page-btn.is-active {
  background: var(--rule-primary);
  border-color: var(--rule-primary);
  color: #FFFFFF;
}
.qb-page-btn.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* type tags */
.qb-type-tag { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--rule-radius-full); white-space: nowrap; }
.qb-type-single { background: var(--rule-primary-tint-1); color: var(--rule-primary); }
.qb-type-multi { background: var(--state-success-tint); color: var(--state-success); }
.qb-type-case { background: var(--state-warning-tint); color: var(--state-warning); }
.qb-cat-blue { background: var(--state-info-tint); color: var(--state-info); }
.qb-cat-green { background: var(--state-success-tint); color: var(--state-success); }
.qb-cat-amber { background: var(--state-warning-tint); color: var(--state-warning); }
.qb-cat-red { background: var(--state-error-tint); color: var(--state-error); }
.qb-cat-violet { background: var(--state-violet-tint); color: var(--state-violet); }
.qb-cat-teal { background: var(--state-teal-tint); color: var(--state-teal); }
.qb-cat-pink { background: var(--state-pink-tint); color: var(--state-pink); }

/* difficulty / status tags */
.qb-diff-tag { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--rule-radius-full); white-space: nowrap; }
.qb-diff-easy { background: var(--state-success-tint); color: var(--state-success); }
.qb-diff-mid { background: var(--state-warning-tint); color: var(--state-warning); }
.qb-diff-hard { background: var(--state-error-tint); color: var(--state-error); }

/* action buttons */
.qb-actions { display: inline-flex; gap: 8px; white-space: nowrap; }
.qb-action-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; padding: 5px 12px;
  border-radius: var(--rule-radius-full);
  cursor: pointer; background: transparent;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.qb-action-btn .navi-icon { width: 14px; height: 14px; }
.qb-action-edit { color: var(--rule-primary); }
.qb-action-edit:hover { background: var(--rule-primary-tint-3); }
.qb-action-del { color: var(--state-error); }
.qb-action-del:hover { background: var(--state-error-tint); }

/* ===== Upload Card ===== */
.rm-upload-card {
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
}
.rm-upload-row {
  display: flex; align-items: flex-end; gap: 20px; flex-wrap: wrap;
}
.rm-form-field { display: flex; flex-direction: column; gap: 8px; }
.rm-form-field-grow { flex: 1 1 260px; min-width: 220px; }
.rm-form-label { font-size: 13px; font-weight: 600; color: var(--rule-ink-2); }
.rm-input {
  height: 42px; padding: 0 14px;
  border-radius: var(--rule-radius-medium);
  border: 1px solid var(--rule-border); background: var(--rule-card);
  color: var(--rule-foreground); font-size: 14px;
  outline: none; box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.rm-input-sm { width: 150px; }
.rm-input-grow { flex: 1 1 240px; min-width: 200px; }
.rm-input::placeholder { color: var(--rule-muted-foreground); }
.rm-input:focus { border-color: var(--rule-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--rule-primary) 18%, transparent); }

.rm-question-box {
  margin-top: 18px; padding: 18px;
  border: 1px dashed color-mix(in srgb, var(--rule-primary) 35%, transparent);
  border-radius: var(--rule-radius-large);
  background: color-mix(in srgb, var(--rule-primary-tint-3) 70%, transparent);
}
.rm-question-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.rm-question-title { font-size: 14px; font-weight: 700; color: var(--rule-foreground); }
.rm-question-empty { font-size: 13px; color: var(--rule-muted-foreground); }
.rm-question-item {
  padding: 14px; margin-top: 12px;
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-medium);
  background: var(--rule-card);
}
.rm-mini-btn, .rm-link-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; white-space: nowrap;
  cursor: pointer; border-radius: var(--rule-radius-full);
}
.rm-mini-btn {
  padding: 7px 12px; color: var(--rule-primary-foreground);
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
}
.rm-link-btn {
  padding: 6px 10px; color: var(--rule-primary);
  background: var(--rule-primary-tint-1);
  border: 1px solid color-mix(in srgb, var(--rule-primary) 20%, transparent);
}
.rm-options-row { align-items: center; }
.rm-option-input { flex: 1 1 140px; min-width: 130px; }

.rm-upload-foot {
  margin-top: 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.rm-upload-tip { font-size: 12px; color: var(--rule-muted-foreground); }
.rm-upload-actions { display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* ===== 文件上传 ===== */
.rm-file-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.rm-file-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; white-space: nowrap; cursor: pointer;
  padding: 9px 16px; border-radius: var(--rule-radius-full);
  color: var(--rule-primary-foreground);
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--rule-primary) 42%, transparent);
  transition: transform .2s ease, box-shadow .2s ease;
}
.rm-file-btn:hover { transform: translateY(-1px); }
.rm-file-btn .navi-icon { width: 15px; height: 15px; background: var(--rule-primary-foreground); }
.rm-file-btn-sm { padding: 7px 12px; font-size: 12px; }
.rm-file-name {
  font-size: 12px; color: var(--rule-muted-foreground);
  max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.rm-form-label-soft { font-size: 12px; color: var(--rule-muted-foreground); font-weight: 500; }

/* ===== 批量导入词汇 ===== */
.rm-batch-card {
  margin-top: 16px;
  border: 1px dashed color-mix(in srgb, var(--rule-primary) 45%, transparent);
  background: linear-gradient(180deg, color-mix(in srgb, var(--rule-primary-tint-1) 35%, transparent), transparent 70%);
}
.rm-batch-head {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  margin-bottom: 14px;
}
.rm-batch-title-wrap { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.rm-batch-title {
  font-size: 16px; font-weight: 700; color: var(--rule-ink);
  display: inline-flex; align-items: center; gap: 8px;
}
.rm-batch-title::before {
  content: ''; width: 4px; height: 16px; border-radius: 4px;
  background: linear-gradient(180deg, var(--rule-primary), var(--rule-primary-active));
}
.rm-batch-subtitle { font-size: 12px; color: var(--rule-muted-foreground); line-height: 1.6; }
.rm-batch-lang { font-size: 12px; font-weight: 600; color: var(--rule-primary); }
.rm-batch-actions { flex-shrink: 0; }
.rm-batch-textarea { min-height: 180px; font-family: inherit; line-height: 1.7; }
.rm-batch-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  margin-top: 12px;
}
.rm-batch-count { font-size: 12px; color: var(--rule-primary); font-weight: 600; }
.rm-batch-count-muted { color: var(--rule-muted-foreground); font-weight: 400; }
.rm-batch-result {
  display: block; margin-top: 12px; padding: 10px 14px;
  border-radius: var(--rule-radius, 10px);
  font-size: 13px; font-weight: 600;
  color: var(--rule-success, #16a34a);
  background: color-mix(in srgb, #16a34a 10%, transparent);
}
.rm-batch-result.is-error {
  color: var(--rule-danger, #dc2626);
  background: color-mix(in srgb, #dc2626 10%, transparent);
}
.qb-create-btn.is-disabled { opacity: .6; pointer-events: none; }

/* ===== Edit Modal ===== */
.rm-modal-mask {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(15, 23, 42, .46);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; box-sizing: border-box;
  animation: rm-fade-in .2s var(--qb-ease);
}
.rm-modal {
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 16px;
  box-shadow: var(--rule-shadow-3);
  animation: rm-pop-in .24s var(--qb-ease);
}
.rm-modal-header {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  padding: 22px 24px; border-bottom: 1px solid var(--rule-border);
}
.rm-modal-title { display: block; font-size: 17px; font-weight: 700; color: var(--rule-foreground); }
.rm-modal-subtitle { display: block; margin-top: 4px; font-size: 12px; color: var(--rule-muted-foreground); }
.rm-modal-close {
  width: 32px; height: 32px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px; cursor: pointer;
  color: var(--rule-muted-foreground); font-size: 22px; line-height: 1;
  background: var(--rule-muted); transition: background .2s ease, color .2s ease;
}
.rm-modal-close:hover { background: var(--state-error-tint); color: var(--state-error); }
.rm-modal-body {
  padding: 22px 24px;
  display: flex; flex-direction: column; gap: 16px;
}
.rm-modal-body .rm-upload-row { align-items: flex-end; }
.rm-textarea {
  width: 100%; min-height: 88px; padding: 10px 14px;
  border-radius: var(--rule-radius-medium);
  border: 1px solid var(--rule-border); background: var(--rule-card);
  color: var(--rule-foreground); font-size: 14px; line-height: 1.55;
  font-family: inherit; outline: none; box-sizing: border-box;
  resize: vertical; transition: border-color .2s ease, box-shadow .2s ease;
}
.rm-textarea::placeholder { color: var(--rule-muted-foreground); }
.rm-textarea:focus { border-color: var(--rule-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--rule-primary) 18%, transparent); }
.rm-modal-options { display: flex; }
.rm-modal-foot {
  display: flex; align-items: center; justify-content: flex-end; gap: 12px;
  padding: 18px 24px; border-top: 1px solid var(--rule-border);
}
.rm-modal-cancel {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 88px; padding: 10px 18px;
  border: 1px solid var(--rule-border); border-radius: var(--rule-radius-full);
  color: var(--rule-ink-2); font-size: 14px; font-weight: 600; cursor: pointer;
  background: var(--rule-card); transition: border-color .2s ease, background .2s ease, color .2s ease;
}
.rm-modal-cancel:hover { border-color: var(--rule-ink-3); background: var(--rule-muted); color: var(--rule-foreground); }
.qb-create-btn.is-disabled { opacity: .65; pointer-events: none; }

@keyframes rm-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes rm-pop-in {
  from { opacity: 0; transform: translateY(12px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .qb-kpi-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
  .app-sidebar.open { transform: translateX(0); }
  .app-main { margin-left: 0; }
  .app-content { padding: 20px; }
  .qb-toolbar-row { flex-direction: column; align-items: stretch; }
  .qb-filter-group { width: 100%; flex-wrap: wrap; }
  .qb-create-btn { width: 100%; justify-content: center; }
}
@media (max-width: 640px) {
  .qb-kpi-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .dc-section { transition-duration: 0.01ms; }
  .qb-kpi-card:hover, .qb-create-btn:hover { transform: none; }
}
</style>

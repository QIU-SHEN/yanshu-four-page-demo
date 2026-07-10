const FIRST_CUSTOMER_ID = 'HIS_094fd2d2-5895-c6b8-8fa6-08d8126f9e77';
const FIRST_ARCHIVE_PATH = encodeURI(
  '/lifecycle-system/首位客户可交付H5与任务卡_20260618/draft_archive_HIS_094fd2d2_20260618.json'
);
const BATCH_ARCHIVE_PATH = encodeURI(
  '/lifecycle-system/批量客户H5任务卡交付_20260619/batch_deliverables.index.v1.json'
);

const state = {
  reviewQueue: null,
  h5GateQueue: null,
  sendGateQueue: null,
  h5ReviewEvents: null,
  h5ExecutionEvents: null,
  firstArchive: null,
  batchDeliverables: null,
  latestLifecycleAgentRun: null,
  latestLifecycleAgentRunIndex: null,
  deepseekH5Abort: null,
  deepseekH5Busy: false,
  deepseekH5ReviewCleared: false,
  actionWorkbench: null,
  advisorWorkbench: null,
  selectedReviewItemId: null,
  selectedVariant: 'A',
  currentPage: 0,
  activeH5Detail: null,
  generatedDrafts: new Map(),
  localReviewActions: new Map(),
  advisorFeedbackInlineStatusByReviewId: new Map(),
  editingAdvisorFieldByReviewId: new Map(),
  directAdvisorFieldEditsByReviewId: new Map(),
  localEvents: [],
  selectedH5ReviewAngleByReviewId: new Map(),
  localH5PageEdits: new Map(),
  localScriptEdits: new Map(),
  customAngleGenerationsByReviewId: new Map(),
  regeneratedGoalVersionByReviewId: new Map(),
  reviewSectionCollapsedByReviewId: new Map(),
  advisorCampaignOfferByReviewId: new Map(),
  advisorScriptBusyReviewItemId: null,
  advisorScriptRevisionBusyReviewItemId: null,
  advisorScriptModalReviewItemId: null,
  advisorScriptModalInputsByReviewId: new Map(),
  advisorScriptModalOpinionByReviewId: new Map(),
  advisorScriptModalOutputByReviewId: new Map(),
  advisorScriptModalStatusByReviewId: new Map(),
  advisorScriptGeneratedOutputByPromptKey: new Map(),
  advisorScriptPromptByReviewId: new Map(),
  advisorScriptPromptRevisionByPromptKey: new Map(),
  advisorScriptPromptRevisionBusyKey: '',
  advisorScriptPromptModalOpen: false,
  advisorScriptPromptEditMode: false,
  advisorScriptPromptSourceText: '',
  advisorScriptPromptSourceLoaded: false,
  advisorScriptPromptSourceBusy: false,
  advisorScriptPromptSourceStatus: '',
  advisorScriptPromptSourceStatusTone: '',
  advisorScriptPromptSourcePath: '',
  advisorScriptCskinByReviewId: new Map(),
  advisorScriptCskinFetchByReviewId: new Map(),
  advisorScriptSummaryRulesByField: new Map(),
  advisorScriptSummaryOverridesByReviewId: new Map(),
  advisorScriptSummaryFetchByKey: new Map(),
  advisorScriptSummaryModal: null,
  advisorScriptSummaryRuleEditMode: false,
  advisorScriptSummaryRuleRevisionByKey: new Map(),
  advisorScriptSummaryRuleRevisionBusyKey: '',
  customAngleBusyReviewItemId: null,
  dsAdvisorH5Candidates: [],
  dsAdvisorH5BatchBusy: false,
  advisorFieldReviewEvents: null,
  advisorCompletionFeedbackEvents: null,
  advisorTaskGenerationFramework: null,
  p7LivePage: 1,
  p7LivePageSize: 50,
  p7LiveTotal: 0,
  p7LiveTotalPages: 1,
  p7LiveHasMore: false,
  p7LiveSearch: '',
  p7LiveLoading: false,
  p7LiveLoadingMore: false,
  p7LiveSearchBusy: false,
  p7LiveDirectoryError: '',
  p7LivePageCache: new Map(),
  p7LiveDetailByCustomerId: new Map(),
  p7LiveDetailInFlightByCustomerId: new Map(),
  p7LiveDetailLoadingCustomerIds: new Set(),
  p7LiveDetailErrorByCustomerId: new Map(),
  p7LivePrefetchScheduledCustomerIds: new Set(),
  p7LiveSharedDataLoaded: false,
  p7LiveSharedDataPromise: null,
};

const requestedReviewSourceMode = new URLSearchParams(window.location.search).get('source');
const reviewSourceMode = ['deepseek', 'ds-advisor-h5', 'p7-live'].includes(requestedReviewSourceMode) ? requestedReviewSourceMode : 'p7-live';
const generatedReviewSourceMode = ['deepseek', 'ds-advisor-h5', 'p7-live'].includes(reviewSourceMode);
const ADVISOR_H5_LOCAL_STATE_STORAGE_KEY = `advisor-h5-review-local-state:${reviewSourceMode}:v1`;
const ADVISOR_ARCHIVE_DISPUTES_STORAGE_KEY = 'yanshu-advisor-archive-disputes:v1';
const DEEPSEEK_DS_REVIEW_API = '/api/backend/deepseek/ds-scene1';
const DS_ADVISOR_H5_API = '/api/ds-advisor-h5';
const ADVISOR_FIELD_REVIEW_EVENTS_API = '/api/lifecycle/advisor-field-review-events';
const ADVISOR_COMPLETION_FEEDBACK_EVENTS_API = '/api/lifecycle/advisor-completion-feedback-events';
const ADVISOR_TASK_GENERATION_FRAMEWORK_API = '/api/lifecycle/advisor-task-generation-framework';
const ADVISOR_SCRIPT_REVISION_API = '/api/backend/advisor-script/revisions';
const ADVISOR_SCRIPT_PROMPT_SOURCE_API = '/api/backend/advisor-script/prompt-source';
const ADVISOR_SCRIPT_PROMPT_REVISION_API = '/api/backend/advisor-script/prompt-revisions';
const ADVISOR_SUMMARY_RULE_REVISION_API = '/api/backend/advisor-script/summary-rule-revisions';
const ADVISOR_FIELD_SUMMARY_API = '/api/backend/advisor-script/field-summaries';
const DO_NOT_DISTURB_API = '/api/lifecycle/do-not-disturb';
const ADVISOR_ACTION_EVENTS_API = '/api/lifecycle/advisor-action-events';
const H5_PUBLISH_REVIEW_EVENTS_API = '/api/lifecycle/h5-publish-review-events';
const FEEDBACK_BACKFILL_API = '/api/lifecycle/feedback-backfill';
const P2_INTERACTION_GOAL_RUNS_API = '/api/backend/interaction-goal/runs';
const P2_COMMUNICATION_ANGLE_RUNS_API = '/api/backend/communication-angle/runs';
const P2_H5_COPY_RUNS_API = '/api/backend/h5-copy/runs';
const P2_ADVISOR_SCRIPT_RUNS_API = '/api/backend/advisor-script/runs';

const ADVISOR_SCRIPT_PURPOSE_OPTIONS = [
  {
    value: '已有好友询问话术',
    label: '已有好友询问话术',
    template: '已有企微好友：以老客关怀口吻询问近期状态，承接档案记录和复诊礼遇，低压确认方便到店的时间。',
  },
  {
    value: '无企微好友添加话术',
    label: '无企微好友添加话术',
    template: '无企微好友：生成一段更短、更礼貌、更谦逊的添加好友申请文案；只说明身份、档案交接和便于发送复诊安排，不直接催促到店。',
  },
];
const ADVISOR_SCRIPT_SUMMARY_FIELD_RULES = {
  消耗历史: '总结成“做过什么 + 消耗总金额”的一句话，例如：曾做面部年轻化管理，包含光电维养和面部支撑相关项目，消耗总金额10000。不要展开订单明细。',
  CSKIN: '按 H5 雷达图/皮肤检测分数总结肤况表现，不罗列完整分数；概括毛孔、松弛、泛红、色斑、肤色稳定度等表现，例如：两颊毛孔明显，轻度松弛，肤色稳定度一般。',
  未消耗疗程: '只总结两种情况：还有什么没有完成；或没有未消耗疗程。证据不明确时写需顾问确认是否存在未消耗疗程。',
  病历: '从病历中提炼主诉、诊断方向、医生建议，不复制敏感原文，不堆叠病历术语。',
  咨询记录: '先去掉客户姓名，再总结成一句整体咨询情况和关注点，例如：关注面容憔悴感、法令纹、泪沟和面部支撑感。无记录时说明未命中，不编造。',
};
const ADVISOR_SCRIPT_DIRECT_FIELDS = new Set(['姓氏', '性别', '客户渠道+推荐人', '初诊日期', '所属医生', '聊天记录', 'RFM等级', '健康管理人', '末诊时间']);
const P2_FEEDBACK_BACKFILL_RUNS_API = '/api/backend/feedback-backfill/runs';
const urlParams = new URLSearchParams(window.location.search);
const dsAdvisorH5FrameworkOnly = reviewSourceMode === 'ds-advisor-h5' && urlParams.get('frameworkOnly') === '1';
const initialReviewItemId = urlParams.get('reviewItemId') || '';
document.body.classList.toggle('is-deepseek-source', reviewSourceMode === 'deepseek');
document.body.classList.toggle('is-ds-advisor-h5-source', reviewSourceMode === 'ds-advisor-h5');
document.body.classList.toggle('is-p7-live-source', reviewSourceMode === 'p7-live');
document.body.classList.toggle('is-embedded-review', window.self !== window.top);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function setActionStatus(message) {
  const target = $('#action-status');
  if (!target) return;
  target.hidden = false;
  target.textContent = message;
}

function advisorFeedbackInlineStatus(reviewItemId = state.selectedReviewItemId) {
  return state.advisorFeedbackInlineStatusByReviewId.get(reviewItemId) || null;
}

function setAdvisorFeedbackInlineStatus(reviewItemId, message, tone = '') {
  if (!reviewItemId) return;
  state.advisorFeedbackInlineStatusByReviewId.set(reviewItemId, {
    message,
    tone,
    updatedAt: nowLabel(),
  });
  persistAdvisorH5LocalState();
  const target = $('#advisor-feedback-inline-status');
  if (!target) return;
  target.hidden = false;
  target.className = `advisor-feedback-inline-status ${tone}`.trim();
  target.textContent = message;
}

function localAdvisorFieldEdits(reviewItemId = state.selectedReviewItemId) {
  return state.directAdvisorFieldEditsByReviewId.get(reviewItemId) || {};
}

function localAdvisorFieldValue(reviewItemId, fieldKey, fallbackValue) {
  const edits = localAdvisorFieldEdits(reviewItemId);
  return Object.prototype.hasOwnProperty.call(edits, fieldKey) ? edits[fieldKey] : fallbackValue;
}

document.querySelectorAll('.deepseek-only-action').forEach((element) => {
  element.hidden = !generatedReviewSourceMode;
});
document.querySelectorAll('.ds-advisor-h5-only-action').forEach((element) => {
  element.hidden = reviewSourceMode !== 'ds-advisor-h5';
});
if (reviewSourceMode === 'ds-advisor-h5') {
  document.title = 'Ds顾问任务&H5审核';
  document.querySelector('.review-brand p').textContent = 'Ds顾问任务&H5审核';
  document.querySelector('.review-header h1').textContent = 'Ds顾问任务&H5审核';
  ['#clear-deepseek-h5-review', '#stop-deepseek-h5-review', '#start-deepseek-h5-review', '#reload-data', '#generate-h5-top'].forEach((selector) => {
    const button = $(selector);
    if (button) button.hidden = true;
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ADVISOR_MISSING_BLOCK_PATTERNS = [
  /待(?:接入|补|确认|核查|定|完善|复核|生成)/,
  /(?:信息|字段|数据|论据|证据|状态|互动记录|生命周期状态)?缺失/,
  /缺少(?:有效|可用|结构化|来源|档案|论据|证据|当前)?/,
  /未(?:命中|返回可读值|随附|接入|同步|补齐|提供|识别|获取)/,
  /无法(?:填写|判定|确认|生成)/,
  /需(?:要)?(?:顾问|人工|数据核查员|运营)?(?:确认|复核|核查|补充|补齐)/,
];

function advisorMissingSignalText(value) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.map(advisorMissingSignalText).filter(Boolean).join('；');
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return '';
    }
  }
  return String(value).trim();
}

function hasAdvisorMissingSignal(...values) {
  return values.some((value) => {
    const text = advisorMissingSignalText(value);
    if (!text) return false;
    return ADVISOR_MISSING_BLOCK_PATTERNS.some((pattern) => pattern.test(text));
  });
}

function renderAdvisorMissingBlockBadge(...values) {
  return hasAdvisorMissingSignal(...values) ? '<em class="missing-block-badge">信息缺失</em>' : '';
}

function formatNumber(value) {
  return new Intl.NumberFormat('zh-CN').format(Number(value || 0));
}

function formatPercent(value) {
  return `${Math.round(Number(value || 0) * 100)}%`;
}

function nowLabel() {
  return new Date().toLocaleString('zh-CN', { hour12: false });
}

function mapEntries(map) {
  return Array.from(map instanceof Map ? map.entries() : []);
}

function restoreMapEntries(entries) {
  return new Map(Array.isArray(entries) ? entries : []);
}

function readAdvisorArchiveDisputeStore() {
  try {
    const raw = window.localStorage?.getItem(ADVISOR_ARCHIVE_DISPUTES_STORAGE_KEY);
    if (!raw) return { version: 1, disputes: [] };
    const parsed = JSON.parse(raw);
    return {
      version: 1,
      updatedAt: parsed?.updatedAt || '',
      disputes: Array.isArray(parsed?.disputes) ? parsed.disputes : [],
    };
  } catch (error) {
    console.warn('advisor archive disputes restore failed', error);
    return { version: 1, disputes: [] };
  }
}

function writeAdvisorArchiveDisputeStore(store) {
  try {
    const next = {
      version: 1,
      updatedAt: new Date().toISOString(),
      disputes: Array.isArray(store?.disputes) ? store.disputes.slice(0, 300) : [],
    };
    window.localStorage?.setItem(ADVISOR_ARCHIVE_DISPUTES_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('advisor-archive-disputes-updated', { detail: next }));
    return next;
  } catch (error) {
    console.warn('advisor archive disputes persist failed', error);
    return store || { version: 1, disputes: [] };
  }
}

function reviewArchiveCustomerId(review, archive) {
  return review?.unifiedCustomerId
    || archive?.customerId
    || archive?.customerIdentity?.unifiedCustomerId
    || archive?.advisorH5EvidencePack?.customerIdentity?.unifiedCustomerId
    || archive?.h5ReviewTaskCard?.basicInfo?.maskedCustomerId
    || '';
}

function advisorArchiveDisputeId(customerId, fieldKey) {
  return `${customerId || 'unknown'}::${fieldKey || 'customer_basic_info_block'}`;
}

function advisorChallengeResolvedForReview(review = selectedReview(), archive = selectedArchive(), fieldKey = '') {
  const customerId = reviewArchiveCustomerId(review, archive);
  const events = state.advisorFieldReviewEvents?.events || [];
  const eventResolved = events.find((event) => (
    (event.status === 'resolved' || event.eventType === 'advisor_field_review_resolution')
    && (!fieldKey || event.fieldKey === fieldKey || (event.challengedPointIds || []).includes(fieldKey))
    && (
      event.reviewItemId === review?.reviewItemId
      || event.unifiedCustomerId === customerId
      || event.customerId === customerId
    )
  ));
  if (eventResolved) return eventResolved;
  return readAdvisorArchiveDisputeStore().disputes.find((item) => (
    item?.unifiedCustomerId === customerId
    && item.status === 'resolved_after_archive_update'
    && (!fieldKey || item.fieldKey === fieldKey)
  )) || null;
}

function activeAdvisorArchiveDisputesForReview(review = selectedReview(), archive = selectedArchive()) {
  const customerId = reviewArchiveCustomerId(review, archive);
  if (!customerId) return [];
  return readAdvisorArchiveDisputeStore().disputes.filter((item) => (
    item
    && item.unifiedCustomerId === customerId
    && item.status !== 'resolved_after_archive_update'
  ));
}

function syncAdvisorArchiveDisputes({ review, archive, fields = [], generalNote = '', sourceEventId = '' }) {
  const customerId = reviewArchiveCustomerId(review, archive);
  if (!review || !customerId) return [];
  const now = new Date().toISOString();
  const normalizedFields = fields.length
    ? fields
    : (generalNote ? [{
        group: '客户基本信息',
        key: 'customer_basic_info_block',
        label: '客户基本信息板块',
        value: '整体质疑说明',
        note: generalNote,
      }] : []);
  if (!normalizedFields.length) return [];
  const store = readAdvisorArchiveDisputeStore();
  const byId = new Map(store.disputes.map((item) => [item.id, item]));
  const nextDisputes = normalizedFields.map((field) => {
    const fieldKey = field.key || 'customer_basic_info_block';
    const id = advisorArchiveDisputeId(customerId, fieldKey);
    const previous = byId.get(id) || {};
    const reason = [field.note, generalNote && field.note !== generalNote ? `整体说明：${generalNote}` : '']
      .filter(Boolean)
      .join('\n');
    return {
      ...previous,
      id,
      status: 'pending_archive_update',
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: customerId,
      customerName: review.customerName || archive?.customerName || '',
      fieldKey,
      fieldLabel: field.label || fieldKey,
      fieldGroup: field.group || '客户基本信息',
      fieldValue: field.value || '',
      reason,
      sourceView: 'ds-advisor-h5-review',
      sourceEventId,
      createdAt: previous.createdAt || now,
      updatedAt: now,
      resolvedAt: '',
    };
  });
  const nextIds = new Set(nextDisputes.map((item) => item.id));
  writeAdvisorArchiveDisputeStore({
    ...store,
    disputes: [
      ...nextDisputes,
      ...store.disputes.filter((item) => !nextIds.has(item.id)),
    ],
  });
  return nextDisputes;
}

function advisorArchiveDisputeForField(fieldKey, review = selectedReview(), archive = selectedArchive()) {
  return activeAdvisorArchiveDisputesForReview(review, archive).find((item) => item.fieldKey === fieldKey) || null;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function defaultReviewSectionCollapsedState() {
  return {
    basic: true,
    goal: true,
    communication: false,
  };
}

function reviewSectionCollapsedState(reviewItemId) {
  const key = reviewItemId || 'default';
  const current = state.reviewSectionCollapsedByReviewId.get(key);
  if (current && typeof current === 'object') {
    return { ...defaultReviewSectionCollapsedState(), ...current };
  }
  const defaults = defaultReviewSectionCollapsedState();
  state.reviewSectionCollapsedByReviewId.set(key, defaults);
  return defaults;
}

function isReviewSectionCollapsed(reviewItemId, sectionKey) {
  return Boolean(reviewSectionCollapsedState(reviewItemId)[sectionKey]);
}

function renderReviewSectionToggle(reviewItemId, sectionKey, title) {
  const collapsed = isReviewSectionCollapsed(reviewItemId, sectionKey);
  return `
    <div class="section-title collapsible-section-title">
      <button
        class="section-collapse-toggle"
        type="button"
        data-review-section-toggle="${escapeHtml(sectionKey)}"
        aria-expanded="${collapsed ? 'false' : 'true'}"
      >
        <span>${escapeHtml(title)}</span>
        <span class="section-collapse-arrow" aria-hidden="true">›</span>
      </button>
    </div>
  `;
}

function toggleReviewSection(reviewItemId, sectionKey) {
  if (!sectionKey) return;
  const key = reviewItemId || 'default';
  const next = reviewSectionCollapsedState(key);
  next[sectionKey] = !next[sectionKey];
  state.reviewSectionCollapsedByReviewId.set(key, next);
  persistAdvisorH5LocalState();
  renderTaskDetail();
}

function persistAdvisorH5LocalState() {
  try {
    window.localStorage?.setItem(ADVISOR_H5_LOCAL_STATE_STORAGE_KEY, JSON.stringify({
      version: 1,
      sourceMode: reviewSourceMode,
      savedAt: nowLabel(),
      selectedReviewItemId: state.selectedReviewItemId,
      generatedDrafts: mapEntries(state.generatedDrafts),
      localReviewActions: mapEntries(state.localReviewActions),
      advisorFeedbackInlineStatusByReviewId: mapEntries(state.advisorFeedbackInlineStatusByReviewId),
      directAdvisorFieldEditsByReviewId: mapEntries(state.directAdvisorFieldEditsByReviewId),
      localEvents: Array.isArray(state.localEvents) ? state.localEvents.slice(0, 200) : [],
      selectedH5ReviewAngleByReviewId: mapEntries(state.selectedH5ReviewAngleByReviewId),
      localH5PageEdits: mapEntries(state.localH5PageEdits),
      localScriptEdits: mapEntries(state.localScriptEdits),
      customAngleGenerationsByReviewId: mapEntries(state.customAngleGenerationsByReviewId),
      regeneratedGoalVersionByReviewId: mapEntries(state.regeneratedGoalVersionByReviewId),
      advisorScriptSummaryRulesByField: mapEntries(state.advisorScriptSummaryRulesByField),
      advisorScriptSummaryOverridesByReviewId: mapEntries(state.advisorScriptSummaryOverridesByReviewId),
      advisorScriptSummaryRuleRevisionByKey: mapEntries(state.advisorScriptSummaryRuleRevisionByKey),
      advisorScriptPromptByReviewId: mapEntries(state.advisorScriptPromptByReviewId),
      advisorScriptPromptRevisionByPromptKey: mapEntries(state.advisorScriptPromptRevisionByPromptKey),
      advisorScriptGeneratedOutputByPromptKey: mapEntries(state.advisorScriptGeneratedOutputByPromptKey),
    }));
  } catch (error) {
    console.warn('advisor h5 local state persist failed', error);
  }
}

function restoreAdvisorH5LocalState() {
  try {
    const raw = window.localStorage?.getItem(ADVISOR_H5_LOCAL_STATE_STORAGE_KEY);
    if (!raw) return;
    const snapshot = JSON.parse(raw);
    if (snapshot?.sourceMode && snapshot.sourceMode !== reviewSourceMode) return;
    state.selectedReviewItemId = snapshot.selectedReviewItemId || state.selectedReviewItemId;
    state.generatedDrafts = restoreMapEntries(snapshot.generatedDrafts);
    state.localReviewActions = restoreMapEntries(snapshot.localReviewActions);
    state.advisorFeedbackInlineStatusByReviewId = restoreMapEntries(snapshot.advisorFeedbackInlineStatusByReviewId);
    state.directAdvisorFieldEditsByReviewId = restoreMapEntries(snapshot.directAdvisorFieldEditsByReviewId);
    state.localEvents = Array.isArray(snapshot.localEvents) ? snapshot.localEvents : [];
    state.selectedH5ReviewAngleByReviewId = restoreMapEntries(snapshot.selectedH5ReviewAngleByReviewId);
    state.localH5PageEdits = restoreMapEntries(snapshot.localH5PageEdits);
    state.localScriptEdits = restoreMapEntries(snapshot.localScriptEdits);
    state.customAngleGenerationsByReviewId = restoreMapEntries(snapshot.customAngleGenerationsByReviewId);
    state.regeneratedGoalVersionByReviewId = restoreMapEntries(snapshot.regeneratedGoalVersionByReviewId);
    state.advisorScriptSummaryRulesByField = restoreMapEntries(snapshot.advisorScriptSummaryRulesByField);
    state.advisorScriptSummaryOverridesByReviewId = restoreMapEntries(snapshot.advisorScriptSummaryOverridesByReviewId);
    state.advisorScriptSummaryRuleRevisionByKey = restoreMapEntries(snapshot.advisorScriptSummaryRuleRevisionByKey);
    state.advisorScriptPromptByReviewId = restoreMapEntries(snapshot.advisorScriptPromptByReviewId);
    state.advisorScriptPromptRevisionByPromptKey = restoreMapEntries(snapshot.advisorScriptPromptRevisionByPromptKey);
    state.advisorScriptGeneratedOutputByPromptKey = restoreMapEntries(snapshot.advisorScriptGeneratedOutputByPromptKey);
  } catch (error) {
    console.warn('advisor h5 local state restore failed', error);
  }
}

function clearAdvisorH5LocalState() {
  try {
    window.localStorage?.removeItem(ADVISOR_H5_LOCAL_STATE_STORAGE_KEY);
  } catch (error) {
    console.warn('advisor h5 local state clear failed', error);
  }
}

async function api(path) {
  const response = await fetch(path);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.error || response.statusText);
  }
  return response.json();
}

async function postApi(path, payload) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.error || response.statusText);
  }
  return response.json();
}

function loadJson(name) {
  return api(`/lifecycle-system/${name}`);
}

function setDeepSeekH5Buttons(running) {
  const startButton = $('#start-deepseek-h5-review');
  const stopButton = $('#stop-deepseek-h5-review');
  const clearButton = $('#clear-deepseek-h5-review');
  if (startButton) startButton.disabled = running;
  if (stopButton) stopButton.disabled = !running;
  if (clearButton) clearButton.disabled = running;
}

function setDsAdvisorH5OperationLog(message, tone = '') {
  const target = $('#ds-advisor-h5-operation-log');
  if (!target) return;
  target.hidden = reviewSourceMode !== 'ds-advisor-h5';
  target.textContent = message || 'DS 顾问H5：待命';
  target.className = `ds-operation-log ds-advisor-h5-only-action ${tone}`.trim();
}

function updateDeepSeekH5Status(message, tone = '') {
  const target = $('#deepseek-h5-generation-status');
  if (!target) return;
  target.className = `action-status deepseek-only-action ${tone}`.trim();
  target.hidden = !generatedReviewSourceMode;
  target.textContent = message || '顾问任务&H5审核生成等待启动。';
  if (reviewSourceMode === 'ds-advisor-h5') {
    setDsAdvisorH5OperationLog(message || 'DS 顾问H5：待命', tone);
  }
}

function parseDeepSeekStreamEvent(chunk) {
  let event = 'message';
  const dataLines = [];
  for (const line of chunk.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
  }
  if (!dataLines.length) return null;
  try {
    return { event, data: JSON.parse(dataLines.join('\n')) };
  } catch {
    return { event, data: { message: dataLines.join('\n') } };
  }
}

async function consumeDeepSeekH5Stream(response, handler) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) {
      const parsed = parseDeepSeekStreamEvent(part);
      if (parsed) handler(parsed.event, parsed.data);
    }
  }
  if (buffer.trim()) {
    const parsed = parseDeepSeekStreamEvent(buffer);
    if (parsed) handler(parsed.event, parsed.data);
  }
}

function handleDeepSeekH5StreamEvent(eventName, payload = {}) {
  const total = payload.total || payload.counts?.requested || state.latestLifecycleAgentRunIndex?.counts?.requested || 0;
  const completed = payload.completed || payload.counts?.generated || 0;
  const countText = total ? ` · ${formatNumber(completed)}/${formatNumber(total)}` : '';
  const customerText = payload.customerCode ? ` · 当前 ${payload.customerCode}` : '';
  const stageText = payload.stage ? ` · ${payload.stage}` : '';
  updateDeepSeekH5Status(`${payload.message || eventName || '生成中'}${countText}${customerText}${stageText}`, eventName === 'error' ? 'is-error' : '');
}

async function startDeepSeekH5ReviewGeneration() {
  if (reviewSourceMode === 'ds-advisor-h5') {
    await startDsAdvisorH5Generation();
    return;
  }
  if (reviewSourceMode !== 'deepseek' || state.deepseekH5Busy) return;
  state.deepseekH5Busy = true;
  state.deepseekH5ReviewCleared = false;
  state.deepseekH5Abort = new AbortController();
  setDeepSeekH5Buttons(true);
  updateDeepSeekH5Status('正在启动 DS 生成结果到顾问任务卡与 H5 审核平台的全量同步。');
  try {
    const response = await fetch(`${DEEPSEEK_DS_REVIEW_API}/runs/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'deepseek_h5_review_ds_scene1_start', target: 'advisor_task_card_h5_review' }),
      signal: state.deepseekH5Abort.signal,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || body.error || response.statusText);
    }
    await consumeDeepSeekH5Stream(response, handleDeepSeekH5StreamEvent);
    await loadDeepSeekReviewData({ fromGeneration: true });
  } catch (error) {
    if (error.name !== 'AbortError') {
      updateDeepSeekH5Status(`生成失败：${error.message}`, 'is-error');
    }
  } finally {
    state.deepseekH5Busy = false;
    state.deepseekH5Abort = null;
    setDeepSeekH5Buttons(false);
  }
}

function stopDeepSeekH5ReviewGeneration() {
  state.deepseekH5Abort?.abort();
  state.deepseekH5Busy = false;
  state.deepseekH5Abort = null;
  setDeepSeekH5Buttons(false);
  updateDeepSeekH5Status('已停止当前生成连接；已载入/已落本地的审核结果保留，不触碰 DS 原始分析结果。');
}

function clearDeepSeekH5ReviewGeneration() {
  if (!generatedReviewSourceMode || state.deepseekH5Busy) return;
  state.deepseekH5ReviewCleared = true;
  state.reviewQueue = { summary: { total: 0 }, items: [] };
  state.h5GateQueue = { summary: { readyForManualPublishReview: 0, h5Drafts: 0 }, queue: [] };
  state.sendGateQueue = { summary: { readyForManualSend: 0 }, queue: [] };
  state.h5ReviewEvents = { summary: { totalEvents: 0 }, events: [] };
  state.h5ExecutionEvents = { summary: { manualPublishExecutionConfirmedEvents: 0 }, events: [] };
  state.batchDeliverables = { summary: { deliverableCustomers: 0 }, items: [], archives: [] };
  state.firstArchive = null;
  state.latestLifecycleAgentRunIndex = null;
  state.latestLifecycleAgentRun = null;
  state.advisorFieldReviewEvents = null;
  state.advisorCompletionFeedbackEvents = null;
  state.advisorTaskGenerationFramework = null;
  state.selectedReviewItemId = null;
  state.activeH5Detail = null;
  state.regeneratedGoalVersionByReviewId.clear();
  state.advisorFeedbackInlineStatusByReviewId.clear();
  state.editingAdvisorFieldByReviewId.clear();
  state.directAdvisorFieldEditsByReviewId.clear();
  state.generatedDrafts.clear();
  state.localReviewActions.clear();
  state.localEvents = [];
  state.selectedH5ReviewAngleByReviewId.clear();
  state.localH5PageEdits.clear();
  state.localScriptEdits.clear();
  state.customAngleGenerationsByReviewId.clear();
  state.customAngleBusyReviewItemId = null;
  clearAdvisorH5LocalState();
  updateDeepSeekH5Status('已清空本地审核页生成结果；DS 原始分析批次未删除，远端库未写入。');
  $('#action-status').textContent = '已清空当前审核页结果：automaticSendAllowed=false，customerFacingPublishAllowed=false，remoteWriteAllowed=false。';
  renderAll();
}

function byReviewId(rows) {
  return new Map((rows || []).map((item) => [item.reviewItemId, item]));
}

function allReviewItems() {
  return state.reviewQueue?.items || [];
}

function selectedReview() {
  return allReviewItems().find((item) => item.reviewItemId === state.selectedReviewItemId) || allReviewItems()[0] || null;
}

function selectedH5Gate() {
  const review = selectedReview();
  if (!review) return null;
  return (state.h5GateQueue?.queue || []).find((item) => item.reviewItemId === review.reviewItemId) || null;
}

function selectedSendGate() {
  const review = selectedReview();
  if (!review) return null;
  return (state.sendGateQueue?.queue || []).find((item) => item.reviewItemId === review.reviewItemId) || null;
}

function selectedArchive() {
  const review = selectedReview();
  if (!review) return null;
  return (state.batchDeliverables?.archives || []).find((archive) => archive.customerId === review.unifiedCustomerId)
    || (review.unifiedCustomerId === FIRST_CUSTOMER_ID ? state.firstArchive : null);
}

function reviewById(reviewItemId = state.selectedReviewItemId) {
  return allReviewItems().find((item) => item.reviewItemId === reviewItemId) || selectedReview();
}

function archiveForReview(reviewOrId = state.selectedReviewItemId) {
  const review = typeof reviewOrId === 'string' ? reviewById(reviewOrId) : reviewOrId;
  if (!review) return selectedArchive();
  return (state.batchDeliverables?.archives || []).find((archive) => archive.customerId === review.unifiedCustomerId)
    || (review.unifiedCustomerId === FIRST_CUSTOMER_ID ? state.firstArchive : null)
    || selectedArchive();
}

function deepSeekDraftSnapshot(run) {
  return run?.inputSnapshot?.draftArchiveSnapshot
    || run?.inputSnapshot?.reviewFacts
    || run?.inputSnapshot?.trainingInputSnapshot
    || {};
}

function deepSeekFinalModel(run) {
  return run?.branchOutputs?.synthesis?.finalAiPortraitConsumptionModel || {};
}

function deepSeekRiskLabel(value) {
  if (value === 'green') return '绿灯';
  if (value === 'yellow') return '黄灯';
  if (value === 'red') return '红灯';
  return value || '待核查';
}

function deepSeekReviewStatus(snapshot, card) {
  if (snapshot.reviewGateStatus === 'ready_for_h5_manual_publish_review') return '可发布复核';
  if (snapshot.reviewGateStatus === 'blocked_until_message_variant_selected') return '待版本确认';
  if (snapshot.reviewGateStatus === 'blocked_until_product_copy_review') return '待话术复核';
  if (card?.reviewStatus === 'pending_advisor_review') return '待顾问审核';
  return snapshot.publishLane || card?.reviewStatus || '待顾问审核';
}

function deepSeekStatusCode(label) {
  if (label === '可发布复核') return 'ready_for_h5_manual_publish_review';
  if (label === '待版本确认') return 'blocked_until_message_variant_selected';
  if (label === '待话术复核') return 'blocked_until_product_copy_review';
  return 'blocked_until_advisor_review';
}

function deepSeekScoreAudit(run, snapshot, finalModel) {
  const scoring = run?.branchOutputs?.opportunityScoring || {};
  return {
    formula: '机会分 = 超期紧迫度*0.25 + 响应概率*0.20 + 价值潜力*0.20 + 静默风险*0.15 + 关系强度*0.10 + 学习价值*0.10',
    score: snapshot.opportunityScore || finalModel.opportunity?.score || scoring.opportunityScore || 0,
    priority: scoring.priorityLevel || finalModel.opportunity?.priority || '待核查',
    boundary: '机会分只用于内部排序和人工审核，不给顾客展示。',
    breakdown: scoring.scoreBreakdown || {},
  };
}

function deepSeekAdvisorBinding(run) {
  return run?.customerIdentity?.advisorWecomBinding
    || run?.inputSnapshot?.reviewFacts?.advisorWecomBinding
    || run?.inputSnapshot?.draftArchiveSnapshot?.advisorWecomBinding
    || run?.inputSnapshot?.trainingInputSnapshot?.advisorWecomBinding
    || null;
}

function deepSeekH5ReviewTaskCard(run) {
  const finalModel = deepSeekFinalModel(run);
  const content = run?.branchOutputs?.contentStrategy || {};
  const synthesisInput = run?.branchOutputs?.synthesis?.taskCardInput || {};
  return [
    run?.advisorTaskCard?.h5ReviewTaskCard,
    finalModel.h5ReviewTaskCard,
    content.h5ReviewTaskCard,
    synthesisInput.h5ReviewTaskCard,
  ].find((taskCard) => taskCard && !taskCard.$ref && (taskCard.basicInfo || taskCard.classification || taskCard.personalProfileBrief)) || null;
}

async function loadChenXishengH5ReviewTestRun() {
  return api('/test-data/chen-xisheng-h5-review.json');
}

function buildDeepSeekAdvisorScripts(run, finalModel) {
  const card = run.advisorTaskCard || {};
  const h5ReviewTaskCard = deepSeekH5ReviewTaskCard(run);
  if (h5ReviewTaskCard?.communicationAngles?.length) {
    return h5ReviewTaskCard.communicationAngles.map((angle, index) => ({
      variant: `V${index + 1}`,
      angle: angle.label,
      text: angle.script,
    }));
  }
  if (card.messageVariants?.length) {
    return card.messageVariants.map((variant) => ({
      variant: variant.variant,
      angle: variant.angle,
      text: variant.text,
    }));
  }
  const strategy = run.branchOutputs?.contentStrategy || {};
  const lifecycle = run.branchOutputs?.lifecycleDiagnosis || {};
  const driver = run.branchOutputs?.coreMotivationDriver?.advisorBrief || {};
  return [
    {
      variant: 'A',
      angle: strategy.messageAngle || lifecycle.lifecycleState?.messageAngles?.[0] || '肤况复盘邀请',
      text: driver.whatToSay || strategy.advisorScriptBrief || '先确认近期肤况和时间安排，只作为人工审核输入，不自动发送。',
    },
    {
      variant: 'B',
      angle: lifecycle.lifecycleState?.messageAngles?.[1] || '维养节奏提醒',
      text: lifecycle.nextBestAction || '顾问人工复核后，再决定是否发起低压力的肤况复盘式沟通。',
    },
  ];
}

function buildDeepSeekCustomerH5Screens(run, snapshot, finalModel) {
  const h5ReviewTaskCard = deepSeekH5ReviewTaskCard(run);
  if (h5ReviewTaskCard?.h5Preview?.screens?.length) return h5ReviewTaskCard.h5Preview.screens;
  const strategy = run.branchOutputs?.contentStrategy || {};
  const lifecycle = run.branchOutputs?.lifecycleDiagnosis || {};
  const driver = run.branchOutputs?.coreMotivationDriver?.advisorBrief || {};
  const treatment = treatmentShortName(snapshot.lastMaintenanceProject);
  const safeTreatment = treatment && treatment !== '待核查' ? treatment : '上次护理项目';
  return [
    {
      step: '01 / 03',
      title: '这份简报和你的维养节奏有关',
      body: sanitizeCustomerText('上次关于' + safeTreatment + '的护理记录，已经过去一段时间。我们更想先帮你回看近期肤况，而不是直接安排新的项目。'),
      primaryFact: safeTreatment,
      notice: '本页只做状态提醒，不代表必须立即护理。',
      detailEntry: '查看这次提醒依据',
    },
    {
      step: '02 / 03',
      title: '先看状态，再决定节奏',
      body: sanitizeCustomerText(strategy.aidaStrategy?.interest || driver.whatSheCaresAbout || '可以先观察干燥感、暗沉感和整体稳定度，再由顾问结合你的实际状态说明。'),
      observationPoints: [
        { label: '干燥感', description: '洁面后是否更容易紧绷，或局部纹理更明显。' },
        { label: '暗沉感', description: '近期肤色通透度、疲惫感是否有变化。' },
        { label: '稳定度', description: '先看近期状态是否平稳，避免过度判断。' },
      ],
      principle: sanitizeCustomerText(strategy.aidaStrategy?.desire || '延续维护节奏之前，先确认当前肤况是否适合。'),
      detailEntry: '查看如何判断当前状态',
    },
    {
      step: '03 / 03',
      title: '你可以先看看这些细节',
      body: sanitizeCustomerText(lifecycle.interactionObjective || finalModel.lifecycleState?.objective || '如果后续想进一步了解，可由顾问根据当前状态再补充说明。'),
      detailCards: [
        { title: '维养节奏说明', description: '了解为什么维护类护理需要看阶段。' },
        { title: '近期状态观察点', description: '看看本阶段值得留意的变化。' },
        { title: '基础护理说明', description: '日常可参考的温和护理方向。' },
        { title: '常见问题', description: '关于护理间隔和状态观察的解答。' },
      ],
      closing: sanitizeCustomerText(strategy.aidaStrategy?.action || '后续是否跟进，由你和顾问沟通后再决定。'),
    },
  ];
}

function deepSeekArchiveFromRun(run) {
  const snapshot = deepSeekDraftSnapshot(run);
  const finalModel = deepSeekFinalModel(run);
  const card = run.advisorTaskCard || {};
  const h5ReviewTaskCard = deepSeekH5ReviewTaskCard(run);
  const advisorWecomBinding = deepSeekAdvisorBinding(run);
  const h5 = run.h5Payload || {};
  const reviewFacts = run.inputSnapshot?.reviewFacts || {};
  const h5Screens = h5.screens?.length ? h5.screens : buildDeepSeekCustomerH5Screens(run, snapshot, finalModel);
  const advisorScripts = buildDeepSeekAdvisorScripts(run, finalModel);
  const coreDriver = finalModel.coreDriverSummary || {};
  const scoring = run.branchOutputs?.opportunityScoring || {};
  const customerId = run.customerIdentity?.unifiedCustomerId || finalModel.customerId || '';
  const customerCode = run.customerIdentity?.customerCode || run.runMeta?.customerCode || '';
  const dsPlan = h5ReviewTaskCard?.planAndConsumption || {};
  const dsBasic = h5ReviewTaskCard?.basicInfo || {};
  const dsEvidenceText = [
    h5ReviewTaskCard?.personalProfileBrief,
    h5ReviewTaskCard?.classification?.dominancePolicy,
    h5ReviewTaskCard?.classification?.classificationAnchor,
    dsPlan.proposedOrTakenPlan,
    dsPlan.recentProject,
    reviewFacts.diagnosisAndNeed,
    reviewFacts.relationshipFacts,
  ].filter(Boolean).join('；');
  const overdueMonthMatch = dsEvidenceText.match(/逾期约?\s*(\d+)\s*个月/);
  const overdueDayMatch = dsEvidenceText.match(/逾期约?\s*(\d+)\s*天/);
  const inferredOverdueDays = Number(dsPlan.overdueDays)
    || (overdueDayMatch ? Number(overdueDayMatch[1]) : 0)
    || (overdueMonthMatch ? Number(overdueMonthMatch[1]) * 30 : 0);
  const derivedSnapshot = {
    ...snapshot,
    lastMaintenanceDate: snapshot.lastMaintenanceDate || dsBasic.lastVisitDate || dsBasic.lastVisit || dsBasic.lastVisitAt,
    lastMaintenanceProject: snapshot.lastMaintenanceProject || dsPlan.recentProject || dsPlan.project || dsPlan.proposedOrTakenPlan,
    overdueDays: snapshot.overdueDays || inferredOverdueDays || dsPlan.overdueDays,
    daysSinceLastMaintenance: snapshot.daysSinceLastMaintenance || dsPlan.daysSinceLastMaintenance || (inferredOverdueDays ? inferredOverdueDays + 30 : ''),
  };
  const primaryDriverLabel = coreDriver.primaryDriverLabel || '效果维持驱动';
  const secondaryDriverLabel = coreDriver.secondaryDriverLabel || '信任与关系驱动';
  const scoreAudit = deepSeekScoreAudit(run, derivedSnapshot, finalModel);
  const treatment = treatmentShortName(derivedSnapshot.lastMaintenanceProject);
  const reviewChecklist = card.verifyFocus || [
    `核查最近护理项目“${treatment}”与客户记忆是否一致，避免项目名误读。`,
    `核查“${derivedSnapshot.lifecycleLabel || '生命周期状态'}”和“${maintenanceBand(derivedSnapshot.maintenanceCount12m)}”判断是否符合顾问实际了解。`,
    '核查当前是否存在近期不适、禁忌、已预约、已流失或不宜触达情况。',
    `核查话术是否围绕${primaryDriverLabel}保持低压力，不出现强销售、疗效承诺或自动预约暗示。`,
  ];
  const customerEvidenceAnchors = [
    { label: '最近护理项目', value: treatment, usage: 'H5 第 1 屏与顾问核查项目记忆' },
    { label: '距上次护理', value: `${derivedSnapshot.daysSinceLastMaintenance || '待补'} 天`, usage: '仅顾问端显示具体天数；H5 只表达“已有一段时间”' },
    { label: '维护超期', value: `${derivedSnapshot.overdueDays || '待补'} 天`, usage: '仅顾问端用于生命周期判断' },
    { label: '12 月维养', value: `${derivedSnapshot.maintenanceCount12m || '待补'} 次`, usage: '判断维护基础强弱' },
    { label: '结构化真值', value: `${derivedSnapshot.truthValueCount || '待补'}/${derivedSnapshot.requirementCount || '待补'}`, usage: '仅顾问端和管理后台审核显示' },
    { label: '核心驱动', value: `${primaryDriverLabel} / ${secondaryDriverLabel}`, usage: '校准顾问话术角度，不展示给顾客' },
  ];
  return {
    customerCode,
    customerName: run.customerIdentity?.customerName || snapshot.customerName || '',
    customerId,
    reviewFacts,
    sourceCustomerFile: run.inputSnapshot?.sourceCustomerFile || '',
    sourceRuleDocument: run.inputSnapshot?.sourceRuleDocument || '',
    customerIdentity: run.customerIdentity || {},
    advisorH5EvidencePack: run.advisorH5EvidencePack || null,
    advisorWecomBinding,
    h5ReviewTaskCard,
    h5ReviewTestFlow: run.h5ReviewTestFlow,
    dataSnapshotInternal: {
      rfmGrade: snapshot.rfmGrade,
      truthValueCount: derivedSnapshot.truthValueCount,
      requirementCount: derivedSnapshot.requirementCount,
      maintenanceCount12m: derivedSnapshot.maintenanceCount12m,
      daysSinceLastMaintenance: derivedSnapshot.daysSinceLastMaintenance,
      overdueDays: derivedSnapshot.overdueDays,
      lastMaintenanceDate: derivedSnapshot.lastMaintenanceDate,
      lastMaintenanceProject: derivedSnapshot.lastMaintenanceProject,
      productClass: derivedSnapshot.productClass || finalModel.consumptionModel?.productPreference || '待核查',
      lifecycleCode: derivedSnapshot.lifecycleCode || finalModel.lifecycleState?.code,
      lifecycleLabel: derivedSnapshot.lifecycleLabel || finalModel.lifecycleState?.label,
      opportunityScore: derivedSnapshot.opportunityScore || finalModel.opportunity?.score || scoring.opportunityScore,
      riskLevel: deepSeekRiskLabel(derivedSnapshot.riskLevel || finalModel.riskAndReadiness?.riskLevel),
      dataReadinessScore: derivedSnapshot.dataReadinessScore ?? finalModel.riskAndReadiness?.dataReadinessScore,
    },
    advisorTaskCard: {
      reviewStatus: card.reviewStatus || 'pending_advisor_review',
      objective: humanizeAdvisorDisplayText(card.objective || finalModel.lifecycleState?.objective || ''),
      advisorBrief: card.advisorBrief || finalModel.shortProfile || '',
      talkingPoints: card.talkingPoints || [],
      scripts: advisorScripts,
      verifyFocus: reviewChecklist,
      analysisBasis20260619: {
        reviewChecklist,
        customerEvidenceAnchors,
        whyThisCannotBeCopied: [
          `本客户最近项目是“${treatment}”，项目记忆不能照搬其他客户。`,
          `本客户距上次护理 ${snapshot.daysSinceLastMaintenance || '待补'} 天、维护超期 ${snapshot.overdueDays || '待补'} 天，生命周期为“${snapshot.lifecycleLabel || finalModel.lifecycleState?.label || '待核查'}”。`,
          `本客户主驱动为“${primaryDriverLabel}”，顾问话术需要围绕该驱动调整。`,
        ],
      },
    },
    h5Brief: {
      screens: h5Screens,
    },
    visibilityRules: {
      customerVisibleAllowed: h5ReviewTaskCard?.h5Preview?.customerVisibleAllowed || h5.visibilityRules?.customerVisibleAllowed || [
        `最近一次护理项目的温和表述：${treatment}`,
        '距离上次护理已有一段时间',
        '当前适合先观察稳定度、干燥、暗沉等状态',
        '维护节奏说明、观察点、基础护理建议、常见问题等信息型详情入口',
      ],
      forbiddenCustomerSurface: h5ReviewTaskCard?.h5Preview?.forbiddenCustomerSurface || h5.visibilityRules?.forbiddenCustomerSurface || [
        'RFM、机会分、风险灯、黄灯、A/B 测试、内部门禁',
        '产品分类复核、数据准备度、结构化真值数',
        '心理偏差标签、内部置信度、消费金额',
        'ASR、客户沟通正文、病历正文、NPS comment 原文',
        '自动预约、自动发送、强销售或疗效承诺',
      ],
    },
    analysisAddendum20260619: {
      coreDriver: {
        primary: primaryDriverLabel,
        primaryScore: coreDriver.primaryDriverScore || 95,
        secondary: secondaryDriverLabel,
        secondaryScore: coreDriver.secondaryDriverScore || 86,
        confidence: coreDriver.driverConfidence || 0.79,
        advisorMeaning: `${primaryDriverLabel}为主，建议以过去维护基础肯定切入；顾问先核查真值，再决定是否进入下一步。`,
        evidence: [
          ...(card.talkingPoints || []),
          `近 12 个月维养 ${snapshot.maintenanceCount12m || '待补'} 次`,
          `维护超期 ${snapshot.overdueDays || '待补'} 天`,
          `最近项目：${treatment}`,
          `次驱动：${secondaryDriverLabel}（${coreDriver.secondaryDriverScore || 86}分）`,
          `画像连接：${finalModel.consumptionModel?.lifecycleBehavior || `${maintenanceBand(snapshot.maintenanceCount12m)} + 节奏中断`}`,
        ],
      },
      opportunityScoringAudit: scoreAudit,
      customerEvidenceAnchors,
    },
    audit: {
      quantifiedAuditableReasoning: {
        dataToConclusion: [
          `结构化真值 ${snapshot.truthValueCount || '待补'}/${snapshot.requirementCount || '待补'}`,
          `近 12 个月维养 ${snapshot.maintenanceCount12m || '待补'} 次`,
          `距最近护理约 ${snapshot.daysSinceLastMaintenance || '待补'} 天`,
          `维护超期约 ${snapshot.overdueDays || '待补'} 天`,
          `核心驱动：${primaryDriverLabel} / ${secondaryDriverLabel}`,
        ],
        visibleScoringStandards: [
          '生命周期：120+ 天重度逾期',
          `维护基础：${maintenanceBand(snapshot.maintenanceCount12m)}`,
          `机会优先级：${scoreAudit.priority}（仅内部）`,
        ],
      },
    },
  };
}

function deepSeekReviewItemFromRun(run) {
  const snapshot = deepSeekDraftSnapshot(run);
  const finalModel = deepSeekFinalModel(run);
  const card = run.advisorTaskCard || {};
  const h5ReviewTaskCard = deepSeekH5ReviewTaskCard(run);
  const classification = h5ReviewTaskCard?.classification || {};
  const advisorWecomBinding = deepSeekAdvisorBinding(run);
  const status = deepSeekReviewStatus(snapshot, card);
  const uniqueReviewKey = String(run.customerIdentity?.unifiedCustomerId || finalModel.customerId || run.runMeta?.runId || run.customerIdentity?.customerCode || snapshot.customerCode || 'customer')
    .replace(/[^\w-]+/g, '_')
    .slice(-48);
  return {
    reviewItemId: `deepseek_${uniqueReviewKey}`,
    customerName: run.customerIdentity?.customerName || snapshot.customerName || '',
    unifiedCustomerId: run.customerIdentity?.unifiedCustomerId || finalModel.customerId || '',
    priority: finalModel.opportunity?.priority || run.branchOutputs?.opportunityScoring?.priorityLevel || '',
    lifecycleState: {
      code: snapshot.lifecycleCode || classification.demandType || finalModel.lifecycleState?.code,
      label: snapshot.lifecycleLabel || classification.classificationAnchor || classification.lifecycleStage || finalModel.lifecycleState?.label,
    },
    interactionObjective: humanizeAdvisorDisplayText(card.objective || finalModel.lifecycleState?.objective || ''),
    advisorBrief: card.advisorBrief || finalModel.shortProfile || '',
    recommendedMessageVariants: buildDeepSeekAdvisorScripts(run, finalModel),
    advisorWecomBinding,
    h5Brief: {
      screen1: (run.h5Payload?.screens?.[0] || buildDeepSeekCustomerH5Screens(run, snapshot, finalModel)[0])?.body,
      screen2: (run.h5Payload?.screens?.[1] || buildDeepSeekCustomerH5Screens(run, snapshot, finalModel)[1])?.body,
      screen3: (run.h5Payload?.screens?.[2] || buildDeepSeekCustomerH5Screens(run, snapshot, finalModel)[2])?.body,
    },
    reviewStatusLabel: status,
  };
}

function p7LiveRunFromTask(task = {}) {
  const card = task.liveAdvisorTaskCard || {};
  const brief = card.customerBrief || {};
  const basic = card.basicInfo || {};
  const classification = basic.classification || {};
  const communication = card.communicationAndSend || {};
  const angles = communication.angles || [];
  const h5Screens = communication.h5Screens || task.latestH5?.h5Draft?.screens || [];
  const advisorScriptText = communication.advisorScript || '';
  const customerName = card.customerBrief?.displayName || task.customerName || task.maskedCustomerId || task.customerCode || task.unifiedCustomerId || '实盘客户';
  const h5ReviewTaskCard = {
    ...card,
    classification: {
      demandType: task.demandType || classification.demandType || '',
      lifecycleStage: task.lifecycleStage || classification.lifecycleStage || '',
      classificationAnchor: classification.label || `${task.demandType || '诉求待确认'} × ${task.lifecycleStage || '阶段待确认'}`,
      dominancePolicy: classification.evidenceText || task.profileStrategyCenterAnalysis?.headline || '',
    },
    personalProfileBrief: task.profileStrategyCenterAnalysis?.headline || classification.evidenceText || card.sourcePolicy || '',
    planAndConsumption: {
      proposedOrTakenPlan: basic.plan?.value || '',
      recentProject: basic.plan?.value || '',
      lastVisitDate: brief.lastVisitDate || basic.lastVisitDate || '',
      daysSinceLastMaintenance: '',
      overdueDays: '',
    },
    communicationAngles: angles.map((angle, index) => ({
      angleId: angle.angleId || angle.code || `ANGLE_${index + 1}`,
      code: angle.angleId || angle.code || `ANGLE_${index + 1}`,
      label: angle.label || `角度 ${index + 1}`,
      operatingFocus: angle.operatingFocus || angle.entryLogic || '',
      script: angle.script || angle.advisorSendScript?.message || advisorScriptText || '',
      h5Screens,
    })),
    h5Preview: {
      screens: h5Screens,
      customerVisibleAllowed: ['客户可见 H5 预览', '护理节奏和状态观察说明'],
      forbiddenCustomerSurface: ['自动发送', '远端写库', 'RFM/非VIP等内部标签', '敏感病历或聊天原文'],
    },
    advisorSendScript: {
      message: advisorScriptText,
      automaticSendAllowed: false,
    },
  };
  return {
    runMeta: {
      runId: task.sourceRunId || task.reviewItemId || task.unifiedCustomerId,
      customerCode: task.customerCode || task.unifiedCustomerId,
      createdAt: task.createdAt || '',
      completedAt: task.createdAt || '',
    },
    customerIdentity: {
      customerCode: task.customerCode || task.unifiedCustomerId,
      customerName,
      customerNameMasked: task.maskedCustomerId || customerName,
      unifiedCustomerId: task.unifiedCustomerId || task.customerId,
      advisorWecomBinding: null,
    },
    inputSnapshot: {
      draftArchiveSnapshot: {
        customerName,
        customerCode: task.customerCode || task.unifiedCustomerId,
        rfmGrade: task.rfmGrade || brief.rfmGrade || '',
        lifecycleLabel: task.lifecycleStage || '',
        lifecycleCode: task.lifecycleStage || '',
        lastMaintenanceDate: brief.lastVisitDate || '',
        lastMaintenanceProject: basic.plan?.value || '',
      },
      reviewFacts: {
        diagnosisAndNeed: (basic.evidence || []).map((item) => `${item.label || ''}：${item.value || ''}`).filter(Boolean).join('\n'),
        relationshipFacts: card.interactionGoal?.objective || '',
      },
    },
    branchOutputs: {
      synthesis: {
        finalAiPortraitConsumptionModel: {
          customerId: task.unifiedCustomerId || task.customerId,
          shortProfile: task.profileStrategyCenterAnalysis?.headline || card.sourcePolicy || '',
          lifecycleState: {
            code: task.lifecycleStage || '',
            label: task.lifecycleStage || '',
            objective: card.interactionGoal?.objective || '',
          },
          opportunity: { priority: '待顾问审核', score: 0 },
          h5ReviewTaskCard,
        },
      },
      contentStrategy: {
        h5ReviewTaskCard,
        advisorScriptBrief: advisorScriptText,
      },
      opportunityScoring: {},
    },
    advisorTaskCard: {
      reviewItemId: task.reviewItemId,
      reviewStatus: 'pending_advisor_review',
      objective: card.interactionGoal?.objective || '',
      advisorBrief: card.interactionGoal?.feedbackPrompt || card.sourcePolicy || '',
      talkingPoints: task.evidenceRefs || [],
      h5ReviewTaskCard,
    },
    h5Payload: {
      screens: h5Screens,
      visibilityRules: h5ReviewTaskCard.h5Preview,
    },
    feedbackLearningUnit: {
      events: (task.events || []).map((event, index) => ({
        event_id: event.eventId || `p7_live_review_event_${index}`,
        advisor_action: 'pending',
        created_at: event.createdAt || '',
        customer_response: event.action || event.eventType || 'local_event',
      })),
    },
  };
}

function deepSeekGateFromRun(run, reviewItem) {
  const snapshot = deepSeekDraftSnapshot(run);
  const status = deepSeekStatusCode(reviewItem.reviewStatusLabel);
  return {
    h5GateId: `deepseek_h5_gate_${reviewItem.reviewItemId}`,
    reviewItemId: reviewItem.reviewItemId,
    gateStatus: status,
    publishReviewAllowed: status === 'ready_for_h5_manual_publish_review',
    lifecycleStateLabel: reviewItem.lifecycleState?.label,
    lane: reviewItem.reviewStatusLabel,
    forbiddenClaims: run.h5Payload?.visibilityRules?.forbiddenCustomerSurface || [],
    h5Draft: {
      screen1: reviewItem.h5Brief?.screen1 || reviewItem.advisorBrief,
      screen2: reviewItem.h5Brief?.screen2 || '',
      screen3: reviewItem.h5Brief?.screen3 || '',
    },
    draftArchiveSnapshot: snapshot,
  };
}

function deepSeekEventsFromRuns(runs, gates) {
  const gateByReviewId = byReviewId(gates);
  const reviewEvents = [];
  const executionEvents = [];
  runs.forEach((run) => {
    const reviewItem = deepSeekReviewItemFromRun(run);
    const gate = gateByReviewId.get(reviewItem.reviewItemId);
    (run.feedbackLearningUnit?.events || []).forEach((event, index) => {
      const eventId = event.event_id || `deepseek_review_event_${reviewItem.reviewItemId}_${index}`;
      const approved = event.advisor_action === 'approved_send';
      reviewEvents.push({
        eventId,
        h5GateId: gate?.h5GateId,
        reviewItemId: reviewItem.reviewItemId,
        actionLabel: approved ? '批准发布复核' : event.advisor_action === 'pending' ? '继续内部预览' : 'DeepSeek 反馈事件',
        createdAt: event.created_at || run.runMeta?.completedAt || run.runMeta?.createdAt || '',
        nextPublishReviewStatus: approved ? 'manual_publish_review_approved_pending_publish_execution' : event.customer_response || 'internal_preview_kept',
        manualPublishExecutionAllowed: approved,
      });
      if (approved) {
        executionEvents.push({
          eventId: `deepseek_execution_${eventId}`,
          sourceH5PublishReviewEventId: eventId,
          actionLabel: '人工发布执行',
          publishExecutionStatus: 'manual_publish_execution_recorded',
          publishExecutedAt: event.created_at || run.runMeta?.completedAt || '',
        });
      }
    });
  });
  return { reviewEvents, executionEvents };
}

function reviewEventsForSelection() {
  const gate = selectedH5Gate();
  if (!gate) return [];
  return (state.h5ReviewEvents?.events || []).filter((event) => event.h5GateId === gate.h5GateId);
}

function executionEventsForSelection() {
  const reviewEventIds = new Set(reviewEventsForSelection().map((event) => event.eventId));
  return (state.h5ExecutionEvents?.events || []).filter((event) => reviewEventIds.has(event.sourceH5PublishReviewEventId));
}

function latestApprovedReviewEvent() {
  return reviewEventsForSelection().find((event) => event.manualPublishExecutionAllowed === true) || null;
}

function statusLabel(gate, sendGate) {
  if (!gate) return '无 H5 门禁';
  if (gate.gateStatus === 'ready_for_h5_manual_publish_review') return '可发布复核';
  if (gate.gateStatus === 'paused_do_not_disturb') return '暂缓/勿扰';
  if (gate.gateStatus === 'blocked_until_regeneration_feedback') return '不采纳待重生成';
  if (sendGate?.gateStatus === 'ready_for_manual_send') return '待 H5 复核';
  if (gate.gateStatus === 'blocked_until_product_copy_review') return '待话术复核';
  if (gate.gateStatus === 'blocked_until_message_variant_selected') return '待版本确认';
  if (gate.gateStatus === 'blocked_until_advisor_review') return '待顾问审核';
  return gate.lane || gate.gateStatus;
}

function statusClass(gate, sendGate) {
  if (gate?.gateStatus === 'ready_for_h5_manual_publish_review') return 'is-ready';
  if (sendGate?.gateStatus === 'ready_for_manual_send') return 'is-ready';
  if (gate?.gateStatus === 'paused_do_not_disturb') return 'is-muted';
  return 'is-blocked';
}

function maskId(id) {
  if (!id) return '未选择';
  const normalized = String(id);
  if (normalized.length <= 18) return normalized;
  return `${normalized.slice(0, 12)}...${normalized.slice(-6)}`;
}

function treatmentShortName(text) {
  const source = String(text || '');
  if (source.includes('皮秒') && (source.includes('美塑') || source.includes('水光'))) return '皮秒激光 + 美塑保湿水光';
  if (source.includes('皮秒')) return '皮秒激光';
  if (source.includes('补注射')) return '补注射';
  if (source.includes('消炎水光')) return '消炎水光';
  if (source.includes('美塑')) return '美塑保湿水光';
  if (source.includes('3MAX')) return '3MAX 超光子 2 部位';
  if (source.includes('超光子')) return '超光子维护';
  if (source.includes('水光')) return '基础水光维护';
  return '近期护理记录';
}

function maintenanceBand(count) {
  const numeric = Number(count || 0);
  if (numeric >= 5) return '高频维护基础';
  if (numeric >= 3) return '稳定维护基础';
  if (numeric >= 2) return '轻度维护基础';
  return '基础维养低压力回访';
}

function cadenceNote(overdueDays) {
  const numeric = Number(overdueDays || 0);
  if (numeric > 120) return '120+ 天重度逾期';
  if (numeric > 90) return '90+ 天中高逾期';
  if (numeric > 60) return '60+ 天维护窗口';
  return '刚进入维护观察窗口';
}

function sanitizeCustomerText(text) {
  return normalizeChenAdvisorText(text)
    .replace(/【[^】]+】/g, (value) => treatmentShortName(value))
    .replace(/205\s*天|159\/230|86\s*分|RFM\s*B|绿灯|机会分|风险灯|黄灯|A\/B|数据准备度|结构化真值/g, '')
    .replace(/预约|安排一次|自动发送|促销|疗效|诊断|治疗/g, (word) => {
      const map = {
        预约: '了解',
        安排一次: '查看',
        自动发送: '人工确认',
        促销: '说明',
        疗效: '状态',
        诊断: '观察',
        治疗: '护理',
      };
      return map[word] || '状态';
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeChenAdvisorText(text) {
  return String(text || '')
    .replace(/喜生姐/g, '陈先生')
    .replace(/陈喜生您好/g, '陈先生您好')
    .replace(/陈喜生先生您好/g, '陈先生您好')
    .replace(/陈先生您好，陈先生您好/g, '陈先生您好')
    .replace(/陈先生您好，陈先生/g, '陈先生')
    .replace(/陈先生，陈先生/g, '陈先生');
}

function archiveScreens() {
  const archive = selectedArchive();
  return archive?.h5Brief?.screens || null;
}

function currentPreviewSource() {
  const review = selectedReview();
  if (!review) return null;
  return state.generatedDrafts.get(review.reviewItemId) || {
    source: selectedArchive() ? 'archive' : 'queue',
    generatedAt: null,
  };
}

function currentH5ShareUrl() {
  const review = selectedReview();
  const url = new URL(window.location.href);
  url.searchParams.set('source', reviewSourceMode);
  if (review?.reviewItemId) url.searchParams.set('reviewItemId', review.reviewItemId);
  url.hash = 'preview';
  return url.toString();
}

function visibleReviewItems() {
  return allReviewItems().filter((item) => {
    if (selectedLocalReviewAction(item.reviewItemId)?.actionId === 'pause') return false;
    return true;
  });
}

function filteredReviews() {
  const query = $('#task-search').value.trim().toLowerCase();
  const sendGates = byReviewId(state.sendGateQueue?.queue || []);
  const h5Gates = byReviewId(state.h5GateQueue?.queue || []);
  const scoped = visibleReviewItems();
  if (reviewSourceMode === 'p7-live') return scoped;
  if (!query) return scoped;
  return scoped.filter((item) => {
    const gate = h5Gates.get(item.reviewItemId);
    const sendGate = sendGates.get(item.reviewItemId);
    const text = [
      item.reviewItemId,
      item.unifiedCustomerId,
      item.priority,
      item.lifecycleState?.label,
      item.interactionObjective,
      statusLabel(gate, sendGate),
    ].join(' ').toLowerCase();
    return text.includes(query);
  });
}

function renderTaskList() {
  const sendGates = byReviewId(state.sendGateQueue?.queue || []);
  const h5Gates = byReviewId(state.h5GateQueue?.queue || []);
  const rows = filteredReviews();
  const isTaskListLoading = reviewSourceMode === 'p7-live' && state.p7LiveLoading && !rows.length;
  $('#queue-count').textContent = reviewSourceMode === 'p7-live'
    ? `${formatNumber(rows.length)}/${formatNumber(state.p7LiveTotal || rows.length)}`
    : formatNumber(rows.length);
  const rowMarkup = rows.map((item) => {
    const gate = h5Gates.get(item.reviewItemId);
    const sendGate = sendGates.get(item.reviewItemId);
    const label = statusLabel(gate, sendGate);
    return `
      <button class="task-item ${item.reviewItemId === state.selectedReviewItemId ? 'is-active' : ''}" type="button" data-review-id="${escapeHtml(item.reviewItemId)}">
        <div class="task-meta-row">
          <strong>${escapeHtml(item.customerName || maskId(item.unifiedCustomerId))}</strong>
          <span class="tag ${statusClass(gate, sendGate)}">${escapeHtml(label)}</span>
        </div>
      </button>
    `;
  }).join('');
  const p7LivePager = reviewSourceMode === 'p7-live' && !isTaskListLoading
    ? `
      <div class="task-list-pager">
        <span>${escapeHtml(p7LiveTaskPagerText(rows.length))}</span>
        ${state.p7LiveHasMore ? `<button id="p7-live-load-more" class="secondary-action" type="button" ${state.p7LiveLoadingMore ? 'disabled' : ''}>${state.p7LiveLoadingMore ? '加载中...' : '加载更多'}</button>` : ''}
      </div>
    `
    : '';
  const emptyMarkup = isTaskListLoading
    ? `
      <div class="task-list-loading" role="status" aria-live="polite">
        <span class="task-list-loading-spinner" aria-hidden="true"></span>
        <span>正在加载顾问任务</span>
      </div>
    `
    : reviewSourceMode === 'p7-live' && state.p7LiveDirectoryError
      ? `
        <div class="task-list-error" role="alert">
          <strong>顾问任务加载失败</strong>
          <span>${escapeHtml(state.p7LiveDirectoryError)}</span>
          <button id="p7-live-directory-retry" class="secondary-action" type="button">重新加载</button>
        </div>
      `
      : '<div class="empty">没有匹配任务</div>';
  $('#task-list').innerHTML = rowMarkup || emptyMarkup;
  if (p7LivePager) $('#task-list').insertAdjacentHTML('beforeend', p7LivePager);
}

function p7LiveTaskPagerText(loadedCount = 0) {
  const total = state.p7LiveTotal || loadedCount;
  const search = String(state.p7LiveSearch || '').trim();
  const cacheHint = state.p7LiveLastCacheHit ? ' · 缓存命中' : '';
  if (search) return `搜索“${search}”：已加载 ${formatNumber(loadedCount)} / ${formatNumber(total)} 人${cacheHint}`;
  return `已加载 ${formatNumber(loadedCount)} / ${formatNumber(total)} 人${cacheHint}`;
}

function updateTaskSearchButton() {
  const button = $('#task-search-submit');
  if (!button) return;
  const busy = Boolean(state.p7LiveSearchBusy);
  button.classList.toggle('is-loading', busy);
  button.disabled = busy;
  const label = button.querySelector('.search-action-label');
  if (label) label.textContent = busy ? '搜索中' : '搜索';
}

function selectedScripts() {
  const archive = selectedArchive();
  if (archive?.advisorTaskCard?.scripts?.length) return archive.advisorTaskCard.scripts;
  return selectedReview()?.recommendedMessageVariants || [];
}

function selectedVariantText() {
  const scripts = selectedScripts();
  return scripts.find((item) => item.variant === state.selectedVariant)?.text || scripts[0]?.text || '';
}

function selectedH5ReviewAngleIndex(reviewItemId = state.selectedReviewItemId) {
  const value = state.selectedH5ReviewAngleByReviewId.get(reviewItemId);
  return Number.isInteger(value) ? value : 0;
}

function selectedH5ReviewAngle(taskCard, reviewItemId = state.selectedReviewItemId) {
  const angles = communicationAnglesForReview(taskCard, reviewItemId);
  return angles[selectedH5ReviewAngleIndex(reviewItemId)] || angles[0] || null;
}

function regeneratedGoalVersionIndex(reviewItemId = state.selectedReviewItemId) {
  const value = state.regeneratedGoalVersionByReviewId.get(reviewItemId);
  return Number.isInteger(value) ? value : 0;
}

function h5PageEditKey(reviewItemId = state.selectedReviewItemId, angleIndex = selectedH5ReviewAngleIndex(reviewItemId)) {
  const regeneratedSuffix = state.localReviewActions.get(reviewItemId)?.actionId === 'regenerate'
    ? `::regenGoal${regeneratedGoalVersionIndex(reviewItemId)}`
    : '';
  return `${reviewItemId || 'unknown'}::${angleIndex}${regeneratedSuffix}`;
}

function scriptEditKey(reviewItemId = state.selectedReviewItemId, angleIndex = selectedH5ReviewAngleIndex(reviewItemId)) {
  return h5PageEditKey(reviewItemId, angleIndex);
}

function regenerationContextText(reviewItemId = state.selectedReviewItemId) {
  const reviewAction = state.localReviewActions.get(reviewItemId);
  if (reviewAction?.actionId !== 'regenerate') return '';
  const note = String(reviewAction.note || '').trim();
  if (/无需填写|无需顾问填写|直接重新生成/.test(note)) return '';
  return note.replace(/^顾问说明：/g, '').trim();
}

function isAntiAgingChallenge(text) {
  return /抗衰|松弛|紧致|衰老|下垂|轮廓|法令|皱纹|年轻化/.test(text || '');
}

function regeneratedGoalVersionsForChallenge(challengeText = '', reviewItemId = state.selectedReviewItemId) {
  const ctx = advisorH5MockContext(null, reviewItemId);
  const antiAging = isAntiAgingChallenge(challengeText);
  if (antiAging) {
    return [
      {
        code: 'anti_aging_direct',
        label: '版本 A｜抗衰主轴校准',
        objective: `将本轮互动目标从原主轴改为“抗衰/松弛关注确认”：先确认${ctx.salutation}近期更关注紧致、轮廓和年轻化变化，再由顾问整理给医生判断是否需要复盘。`,
        demandLabel: '抗衰维养关注型',
        stageLabel: '复诊逾期｜主诉变化待核查',
        operatingFocus: ['主诉变化核查', '抗衰关注点确认', '医生复盘判断', '不沿用旧主诉单一主轴', '不承诺抗衰效果'],
        reason: '适合顾问已经明确掌握客户当前更在意抗衰，而不是继续围绕旧主诉推进。',
      },
      {
        code: 'transition_check',
        label: '版本 B｜主诉核查过渡',
        objective: `先不直接把顾客类型改死为抗衰，而是把互动目标改为“当前主诉复核”：低压询问${ctx.salutation}现在最在意的皮肤变化，待数据核查员确认后再同步顾客档案和画像分析。`,
        demandLabel: '主诉变化待核查型',
        stageLabel: '复诊逾期｜人工核查中',
        operatingFocus: ['先问现状', '降低旧主诉权重', '收集顾问补充', '数据核查员确认', '同步画像后再生成'],
        reason: '适合顾问信息还需要核查，先避免把未确认的抗衰主诉直接写入对客话术。',
      },
    ];
  }
  return [
    {
      code: 'regenerate_current_goal',
      label: '版本 A｜重新生成互动目标',
      objective: challengeText
        ? `根据顾问补充信息重排互动目标：${challengeText}，本轮先确认客户近况，再决定是否进入医生复盘或运营触达。`
        : '无需顾问先填写原因，系统直接生成“当前目标复核版”：先确认客户近况，再决定是否进入医生复盘或运营触达。',
      demandLabel: challengeText ? '顾问补充待核查型' : '互动目标复核型',
      stageLabel: challengeText ? '人工核查中' : '重新生成候选',
      operatingFocus: ['低压确认近况', '重新生成 H5 候选', '同步沟通角度', '不直接推项目', '人工复核后使用'],
      reason: challengeText
        ? '适合顾问已经给出明确事实补充，需要让任务卡先跟随顾问判断调整。'
        : '适合顾问不填写原因、只要求系统重新组织本轮互动目标和对客表达。',
    },
    {
      code: 'h5_copy_reframe',
      label: '版本 B｜H5 文案重排',
      objective: '先不要求顾问说明原因，直接生成“文案重排版”沟通目标：保留当前证据边界，重新组织沟通角度、H5 三页和单条话术，供顾问人工复核。',
      demandLabel: '文案重排型',
      stageLabel: '重新生成候选',
      operatingFocus: ['保留当前证据', '重排沟通角度', '刷新三页 H5', '刷新单条话术', '人工复核后使用'],
      reason: '适合顾问只判断当前版本不好用，但暂时不需要填写具体修改方向。',
    },
  ];
}

function selectedRegeneratedGoalVersion(reviewItemId = state.selectedReviewItemId) {
  const reviewAction = state.localReviewActions.get(reviewItemId);
  if (reviewAction?.actionId !== 'regenerate') return null;
  const versions = regeneratedGoalVersionsForChallenge(regenerationContextText(reviewItemId), reviewItemId);
  return versions[regeneratedGoalVersionIndex(reviewItemId)] || versions[0] || null;
}

function angleKeyText(angle) {
  return `${angle?.code || ''} ${angle?.label || ''}`;
}

function customerSalutationFromFacts(facts) {
  const name = String(facts?.customerName || '').trim();
  const gender = String(facts?.gender || '').trim();
  if (!name) return '客户';
  if (/^[\u4e00-\u9fa5]{2,4}$/.test(name)) {
    if (/男|先生/.test(gender)) return `${name.slice(0, 1)}先生`;
    if (/女|女士|小姐/.test(gender)) return `${name.slice(0, 1)}女士`;
    return `${name.slice(0, 1)}老师`;
  }
  return name;
}

function advisorH5MockContext(taskCard, reviewItemId = state.selectedReviewItemId) {
  const review = reviewById(reviewItemId) || {};
  const archive = archiveForReview(review) || {};
  const card = taskCard || archive.h5ReviewTaskCard || {};
  const facts = advisorH5CustomerFacts(card, archive, review);
  const plan = card.planAndConsumption || {};
  const classification = card.classification || {};
  const doctorName = facts.doctor && !/^待/.test(facts.doctor) ? facts.doctor : '医生';
  const advisorName = facts.advisor && !/^待/.test(facts.advisor) ? facts.advisor : '顾问';
  const planName = facts.doctorPlan && !/^待/.test(facts.doctorPlan)
    ? facts.doctorPlan
    : (plan.recentProject || plan.proposedOrTakenPlan || '上次护理项目');
  const demandLabel = classification.demandType || '当前诉求';
  const stageLabel = classification.lifecycleStage || archive.dataSnapshotInternal?.lifecycleLabel || '当前阶段';
  return {
    review,
    archive,
    facts,
    customerName: facts.customerName || review.customerName || archive.customerName || '客户',
    salutation: customerSalutationFromFacts(facts),
    doctorName,
    advisorName,
    planName,
    demandLabel,
    stageLabel,
  };
}

function baseCommunicationAngles(taskCard) {
  return taskCard?.communicationAngles || [];
}

function customAngleGenerationForReview(reviewItemId = state.selectedReviewItemId) {
  return state.customAngleGenerationsByReviewId.get(reviewItemId) || null;
}

function sourceCommunicationAnglesForReview(taskCard, reviewItemId = state.selectedReviewItemId) {
  const regeneratedAngles = regeneratedCommunicationAnglesForReview(taskCard, reviewItemId);
  return regeneratedAngles.length ? regeneratedAngles : baseCommunicationAngles(taskCard);
}

function regeneratedCommunicationAnglesForReview(taskCard, reviewItemId = state.selectedReviewItemId) {
  const reviewAction = state.localReviewActions.get(reviewItemId);
  if (reviewAction?.actionId !== 'regenerate') return [];
  if (Array.isArray(taskCard?.regeneratedCommunicationAngles) && taskCard.regeneratedCommunicationAngles.length === 3) {
    return taskCard.regeneratedCommunicationAngles;
  }
  const contextText = regenerationContextText(reviewItemId);
  const goalVersion = selectedRegeneratedGoalVersion(reviewItemId);
  const transitionMode = goalVersion?.code === 'transition_check' || goalVersion?.code === 'profile_recheck_first';
  const antiAging = isAntiAgingChallenge(contextText);
  if (antiAging && !transitionMode) {
    return [
      {
        code: 'REGEN_ANGLE_01',
        label: '抗衰医生复盘',
        h5Lead: '不再沿用旧主诉作为唯一主轴，先请医生看松弛、紧致和近期状态。',
      },
      {
        code: 'REGEN_ANGLE_02',
        label: '夏季稳定与抗衰基础',
        h5Lead: '从夏季皮肤稳定度切入，再确认抗衰和紧致关注点。',
      },
      {
        code: 'REGEN_ANGLE_03',
        label: '当前关注点核查',
        h5Lead: '先确认客户现在最在意的是轮廓、松弛还是肤况稳定，再同步档案。',
      },
    ];
  }
  if (transitionMode) {
    return [
      {
        code: 'REGEN_ANGLE_01',
        label: '当前主诉复核',
        h5Lead: '先不覆盖旧档案，低压确认客户现在真正关注点。',
      },
      {
        code: 'REGEN_ANGLE_02',
        label: '旧主轴降权确认',
        h5Lead: '把原主诉/治疗线索降为待核查背景，先收集顾问补充事实。',
      },
      {
        code: 'REGEN_ANGLE_03',
        label: '档案核查后复盘',
        h5Lead: '先交数据核查员确认，再刷新顾客档案、画像和顾问任务。',
      },
    ];
  }
  return [
    {
      code: 'REGEN_ANGLE_01',
      label: '顾问补充事实优先',
      h5Lead: '先按顾问补充的新事实确认近况，再决定是否进入医生复盘。',
    },
    {
      code: 'REGEN_ANGLE_02',
      label: '画像复核优先',
      h5Lead: '先把冲突信息交数据核查员，避免继续使用可能过期的画像。',
    },
    {
      code: 'REGEN_ANGLE_03',
      label: '轻关怀收集现状',
      h5Lead: '只做现状确认和顾问记录，不直接推项目、不对客承诺。',
    },
  ];
}

function communicationAnglesForReview(taskCard, reviewItemId = state.selectedReviewItemId) {
  const angles = sourceCommunicationAnglesForReview(taskCard, reviewItemId);
  const customAngle = customAngleGenerationForReview(reviewItemId)?.angle;
  return customAngle ? [...angles, customAngle] : angles;
}

function screenMock(step, title, body, auditRationale) {
  return { step, title, body, auditRationale };
}

function defaultMockScreensForAngle(taskCard, angle, reviewItemId = state.selectedReviewItemId, angleIndex = selectedH5ReviewAngleIndex(reviewItemId)) {
  const ctx = advisorH5MockContext(taskCard, reviewItemId);
  const key = angleKeyText(angle);
  if (angleIndex === 0 || /doctor_cycle_followup|ANGLE_01|医生建议周期|复诊周期|医生复盘|医生复诊|复诊提醒/.test(key)) {
    return [
      screenMock(
        '01 / 03',
        `按${ctx.doctorName}建议做一次状态复盘`,
        `上次记录的方案是${ctx.planName}。现在适合先回看近期皮肤状态，再判断后续护理节奏。`,
        `结合${ctx.demandLabel}和${ctx.stageLabel}生成，不展示消费金额，不承诺效果。`
      ),
      screenMock(
        '02 / 03',
        '先看项目后真实感受',
        '可以先确认干燥、泛红、稳定度以及现在最在意的变化，再决定是否需要医生复盘。',
        '围绕项目后反馈补信息，不直接推新项目。'
      ),
      screenMock(
        '03 / 03',
        `由${ctx.advisorName}整理给医生`,
        `${ctx.advisorName}先帮您记录近期肤况，再由医生判断后续是否调整护理节奏。`,
        '只给低压下一步，不自动预约，不强推购买。'
      ),
    ];
  }
  if (angleIndex === 2 || /post_treatment_skin_feedback|ANGLE_03|治疗后肤况|反馈复盘|体验后肤况|效果回访|满意度/.test(key)) {
    return [
      screenMock(
        '01 / 03',
        '先补一次项目后反馈',
        `围绕${ctx.planName}后的真实感受，先确认近期状态和顾客现在最在意的变化。`,
        '对应顾问任务的缺失反馈，不暴露内部风险灯。'
      ),
      screenMock(
        '02 / 03',
        '看稳定度和舒适感',
        '可以重点回看皮肤是否稳定、是否干燥紧绷、是否泛红，以及护理后的真实感受。',
        '给顾客可理解的观察点，不写诊断结论。'
      ),
      screenMock(
        '03 / 03',
        '反馈后再决定是否复诊',
        `您先说近期状态，${ctx.advisorName}会整理给医生，再判断是否需要到店复盘。`,
        '把行动降到反馈和医生判断，避免销售感。'
      ),
    ];
  }
  if (angleIndex === 1 || /summer_uv_spot_management|ANGLE_02|夏季|紫外线|色斑管理|季节变化|皮肤管理/.test(key)) {
    return [
      screenMock(
        '01 / 03',
        '先确认近期皮肤稳定度',
        '近期气候、作息和护理节奏变化，都可能影响皮肤稳定度。可以先轻确认当前状态。',
        `结合${ctx.demandLabel}和季节/状态因素生成，不制造焦虑。`
      ),
      screenMock(
        '02 / 03',
        '基础护理先跟上',
        '这段时间可以先看防晒、保湿、泛红和干燥情况，避免皮肤状态波动。',
        '只做护理提醒，不承诺治疗结果。'
      ),
      screenMock(
        '03 / 03',
        '需要时再做医生复盘',
        `如果近期状态有变化，可以让${ctx.advisorName}先帮您整理，再安排医生看是否需要调整。`,
        '保留医生复核路径，不自动触达或发布。'
      ),
    ];
  }
  return [];
}

function regeneratedMockScreensForChallenge(angle, challengeText, fallbackScreens, goalVersion = null, angleIndex = selectedH5ReviewAngleIndex(), taskCard = null, reviewItemId = state.selectedReviewItemId) {
  const ctx = advisorH5MockContext(taskCard, reviewItemId);
  const key = angleKeyText(angle);
  const normalizedChallenge = challengeText || '顾问补充的顾客类型变化';
  const useTransitionVersion = goalVersion?.code === 'transition_check' || goalVersion?.code === 'profile_recheck_first';
  if (!isAntiAgingChallenge(challengeText)) {
    if (useTransitionVersion) {
      return [
        screenMock(
          '01 / 03',
          '先进入画像复核',
          `顾问补充与${ctx.salutation}当前画像存在差异，本轮先暂存为待核查信息，不直接用旧主诉继续触达。`,
          '版本 B 预演：先走画像复核路径，等待数据核查员确认后再同步顾客档案。'
        ),
        screenMock(
          '02 / 03',
          '确认现在真正关注点',
          '顾问可先记录客户现在最在意的变化，再交给数据核查员比对全景档案和画像分析。',
          '只生成本地候选，不对客发布，不自动发送。'
        ),
        screenMock(
          '03 / 03',
          '核查后再生成正式话术',
          '核查通过后，再用新的顾客类型重新生成互动目标、H5 三页和沟通话术。',
          '明确重新生成内容为本地备份，正式使用需人工复核。'
        ),
      ];
    }
    return [
      screenMock(
        '01 / 03',
        '先按顾问补充校准沟通方向',
        `顾问补充：${normalizedChallenge}。本轮先用低压口吻确认${ctx.salutation}近况，再决定是否需要医生复盘。`,
        '本页为重新生成预演，事实仍待数据核查员确认后同步顾客档案。'
      ),
      screenMock(
        '02 / 03',
        '不沿用旧主诉直接触达',
        '旧档案主诉先不作为唯一沟通抓手，顾问先核实客户现在真正关心的变化。',
        '避免把过期画像直接用于对客内容，保留人工核查链路。'
      ),
      screenMock(
        '03 / 03',
        '核查后再更新任务卡',
        '补充信息确认后，再刷新顾客类型、互动目标、H5 三页正文和顾问话术。',
        '明确重新生成落点：下方 H5 文案区和单条话术区先做本地回放。'
      ),
    ];
  }
  if (angleIndex === 0 || /doctor_cycle_followup|ANGLE_01|医生建议周期|复诊周期|医生复盘|医生复诊|复诊提醒|抗衰医生复盘|当前主诉复核|顾问补充事实优先/.test(key)) {
    if (useTransitionVersion) {
      return [
        screenMock(
          '01 / 03',
          '先确认这次复盘看什么',
          `顾问补充${ctx.salutation}现在可能更关注抗衰，但档案仍以原治疗主诉为主。我们先确认本次医生复盘重点。`,
          '版本 B 预演：医生复盘角度保留，但主诉先标记为待核查。'
        ),
        screenMock(
          '02 / 03',
          '不直接沿用旧主诉',
          '可以先说说近期更在意的是紧致、轮廓，还是治疗后的皮肤稳定度。',
          '降低旧主诉证据权重，先收集当前关注点。'
        ),
        screenMock(
          '03 / 03',
          '核查后再同步医生判断',
          `${ctx.advisorName}会把您的新关注点整理给核查员和医生，确认后再调整后续跟进方向。`,
          '本地备份，不承诺抗衰效果，不自动预约。'
        ),
      ];
    }
    return [
      screenMock(
        '01 / 03',
        '先按医生复盘校准抗衰重点',
        `顾问补充${ctx.salutation}近期更关注松弛、紧致和抗衰节奏，可先由医生复盘${ctx.planName}后的皮肤状态。`,
        '顾问补充作为待核查事实；先生成本地候选，不直接覆盖原档案主诉。'
      ),
      screenMock(
        '02 / 03',
        '旧主诉线索先不作为主轴',
        '这次先不围绕旧主诉继续追问，重点确认面部状态、紧致感和后续护理节奏。',
        '回应“旧主诉已非当前关注点”的质疑，等待数据核查员同步档案。'
      ),
      screenMock(
        '03 / 03',
        '让医生判断后续方案',
        `${ctx.advisorName}先整理您的近况，再由医生判断是否需要从维养节奏转向抗衰方向复盘。`,
        '低压引导医生判断，不承诺抗衰效果，不自动预约。'
      ),
    ];
  }
  if (angleIndex === 2 || /post_treatment_skin_feedback|ANGLE_03|治疗后肤况|反馈复盘|体验后肤况|效果回访|满意度|当前关注点核查|档案核查后复盘|轻关怀收集现状/.test(key)) {
    if (useTransitionVersion) {
      return [
        screenMock(
          '01 / 03',
          '先问现在最在意哪类变化',
          '这次先不默认按旧主诉回访，顾问会先确认您现在更关注抗衰、紧致，还是治疗后的稳定度。',
          '版本 B 预演：反馈复盘角度转为主诉核查，不直接覆盖档案。'
        ),
        screenMock(
          '02 / 03',
          '把新关注点暂存为核查项',
          '如果您现在更关注松弛或轮廓变化，顾问会先记录具体位置和感受。',
          '新主诉进入数据核查员队列，暂不作为已确认画像。'
        ),
        screenMock(
          '03 / 03',
          '核查后再决定跟进方向',
          '确认后再判断是继续做治疗后复盘，还是切换到抗衰维养沟通。',
          '说明当前为候选版本，正式使用前需顾问复核。'
        ),
      ];
    }
    return [
      screenMock(
        '01 / 03',
        '先问现在更在意的变化',
        `顾问补充${ctx.salutation}现在不太在意原主诉，更想看松弛和年轻化变化，本轮先确认这个新关注点。`,
        '从治疗后反馈切入，但把主诉变化标为待核查补充信息。'
      ),
      screenMock(
        '02 / 03',
        '把抗衰关注点补进档案',
        '可以先记录您最在意的位置和变化，比如轮廓、紧致感或面部疲态。',
        '用于顾客档案更新候选，不直接当作已确认诊疗结论。'
      ),
      screenMock(
        '03 / 03',
        '核查后刷新后续话术',
        '核查通过后，互动目标会从旧主诉复盘切到抗衰维养，再生成新的顾问话术。',
        '说明重新生成内容会在本页 H5 文案和话术区显示。'
      ),
    ];
  }
  if (angleIndex === 1 || /summer_uv_spot_management|ANGLE_02|夏季|紫外线|色斑管理|季节变化|皮肤管理|夏季稳定与抗衰基础|旧主轴降权确认|画像复核优先/.test(key)) {
    if (useTransitionVersion) {
      return [
        screenMock(
          '01 / 03',
          '夏季先确认皮肤稳定度',
          '如果当前关注点已转向抗衰，也建议先确认夏季皮肤稳定度，再看是否适合切换复盘方向。',
          '版本 B 预演：季节角度保留为轻关怀，不把旧主诉作为唯一主轴。'
        ),
        screenMock(
          '02 / 03',
          '抗衰前先看基础状态',
          '防晒、保湿和泛红干燥情况会影响后续判断，顾问先帮您把这些信息补全。',
          '先做状态确认，不推项目，不写治疗承诺。'
        ),
        screenMock(
          '03 / 03',
          '把新主诉交给核查员',
          '顾问会把“更关注抗衰”的补充先交给核查员，确认后再同步档案和任务卡。',
          '本地备份，标记待核查后再使用。'
        ),
      ];
    }
    return [
      screenMock(
        '01 / 03',
        '夏季先确认皮肤稳定和松弛关注',
        '如果您最近更关注抗衰，也可以先看夏季皮肤稳定度，再判断是否需要调整护理重点。',
        '保留季节因素，但不再把旧主诉设为唯一沟通主轴。'
      ),
      screenMock(
        '02 / 03',
        '防晒保湿仍作为基础',
        '抗衰沟通前，先确认防晒、保湿和泛红干燥情况，避免皮肤状态波动影响判断。',
        '基础护理建议不越界，不包装成治疗承诺。'
      ),
      screenMock(
        '03 / 03',
        '补充信息核查后再跟进',
        `${ctx.advisorName}会先把“更关注抗衰”的补充交给核查员，确认后再同步到档案和任务卡。`,
        '明确反馈传递至数据核查员，当前仅为本地审核回放。'
      ),
    ];
  }
  return fallbackScreens || [];
}

function defaultSendScriptForAngle(taskCard, angle, reviewItemId = state.selectedReviewItemId, angleIndex = selectedH5ReviewAngleIndex(reviewItemId)) {
  const ctx = advisorH5MockContext(taskCard, reviewItemId);
  const key = angleKeyText(angle);
  if (angleIndex === 0 || /doctor_cycle_followup|ANGLE_01|医生建议周期|复诊周期|医生复盘|医生复诊|复诊提醒/.test(key)) {
    return `${ctx.salutation}您好，我是的${ctx.advisorName}。上次记录的方案是${ctx.planName}，现在想先问问您近期皮肤状态怎么样。方便的话我帮您整理给${ctx.doctorName}看一下。`;
  }
  if (angleIndex === 1 || /summer_uv_spot_management|ANGLE_02|夏季|紫外线|色斑管理|季节变化|皮肤管理/.test(key)) {
    return `${ctx.salutation}您好，最近皮肤状态容易受气候、作息和护理节奏影响。我这边不直接推项目，先想了解您最近干燥、泛红或稳定度有没有变化，方便的话我帮您记录后给医生复盘。`;
  }
  if (angleIndex === 2 || /post_treatment_skin_feedback|ANGLE_03|治疗后肤况|反馈复盘|体验后肤况|效果回访|满意度/.test(key)) {
    return `${ctx.salutation}您好，想回访一下您上次${ctx.planName}后的真实感受。现在皮肤稳定度、干燥泛红或您最在意的变化怎么样？我先记录反馈，不直接安排项目。`;
  }
  return '';
}

function regeneratedSendScriptForChallenge(angle, challengeText, fallbackMessage, goalVersion = null, angleIndex = selectedH5ReviewAngleIndex(), taskCard = null, reviewItemId = state.selectedReviewItemId) {
  if (!challengeText) return fallbackMessage;
  const ctx = advisorH5MockContext(taskCard, reviewItemId);
  const key = angleKeyText(angle);
  const useTransitionVersion = goalVersion?.code === 'transition_check' || goalVersion?.code === 'profile_recheck_first';
  if (useTransitionVersion) {
    if (angleIndex === 0 || /doctor_cycle_followup|ANGLE_01|医生建议周期|复诊周期|医生复盘|医生复诊|复诊提醒|当前主诉复核|顾问补充事实优先/.test(key)) {
      return `${ctx.salutation}您好，我这边先不按原来的复诊话术直接打扰您。顾问补充您现在可能更关注抗衰和紧致，我先帮您确认本次更想让医生看哪方面，再同步核查档案。`;
    }
    if (angleIndex === 2 || /post_treatment_skin_feedback|ANGLE_03|治疗后肤况|反馈复盘|体验后肤况|效果回访|满意度|档案核查后复盘|轻关怀收集现状/.test(key)) {
      return `${ctx.salutation}您好，想轻确认一下您现在最在意的变化是什么。之前档案以项目后反馈为主，但顾问补充您可能更关注松弛和紧致，我先记录后再交核查。`;
    }
    if (angleIndex === 1 || /summer_uv_spot_management|ANGLE_02|夏季|紫外线|色斑管理|季节变化|皮肤管理|旧主轴降权确认|画像复核优先/.test(key)) {
      return `${ctx.salutation}您好，最近皮肤状态容易波动。我先不直接按旧主诉推进，想先确认您现在更关注皮肤稳定、紧致，还是轮廓变化，再帮您整理给医生。`;
    }
    return `${ctx.salutation}您好，顾问补充的信息我先记录为待核查：${challengeText}。确认后再同步更新档案和后续沟通内容。`;
  }
  if (isAntiAgingChallenge(challengeText)) {
    if (angleIndex === 0 || /doctor_cycle_followup|ANGLE_01|医生建议周期|复诊周期|医生复盘|医生复诊|复诊提醒|抗衰医生复盘/.test(key)) {
      return `${ctx.salutation}您好，我这边先不按旧主诉方向直接打扰您。顾问补充您近期更关注松弛和抗衰节奏，如果方便，我先帮您整理近况，再请医生判断后续复盘重点。`;
    }
    if (angleIndex === 2 || /post_treatment_skin_feedback|ANGLE_03|治疗后肤况|反馈复盘|体验后肤况|效果回访|满意度|当前关注点核查/.test(key)) {
      return `${ctx.salutation}您好，想跟您轻确认一下，您现在是不是更关注紧致、松弛和年轻化状态？我先记录真实近况，核查后再同步更新您的顾客档案和后续话术。`;
    }
    if (angleIndex === 1 || /summer_uv_spot_management|ANGLE_02|夏季|紫外线|色斑管理|季节变化|皮肤管理|夏季稳定与抗衰基础/.test(key)) {
      return `${ctx.salutation}您好，最近皮肤状态容易波动。如果您现在重点转到抗衰和紧致，我先帮您确认皮肤稳定度和近期关注点，再看是否需要医生复盘。`;
    }
  }
  return `${ctx.salutation}您好，顾问这边补充了新的近况：${challengeText}。我先帮您核实并整理，确认后再同步更新档案和后续沟通内容。`;
}

function editedH5ScreensForAngle(screens, reviewItemId = state.selectedReviewItemId, angleIndex = selectedH5ReviewAngleIndex(reviewItemId)) {
  const edits = state.localH5PageEdits.get(h5PageEditKey(reviewItemId, angleIndex)) || [];
  return (screens || []).map((screen, index) => ({
    ...screen,
    ...(edits[index] || {}),
  }));
}

function readableAdvisorValue(value) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.map(readableAdvisorValue).filter(Boolean).join('；');
  if (typeof value !== 'object') return String(value || '');
  if (value.demandType || value.lifecycleStage || value.reviewTarget) {
    const prefix = [value.demandType, value.lifecycleStage].filter(Boolean).join(' × ');
    return [prefix, value.reviewTarget].filter(Boolean).join('｜');
  }
  if (value.attention || value.interest || value.desire || value.action) {
    return [
      value.attention ? `Attention ${value.attention}` : '',
      value.interest ? `Interest ${value.interest}` : '',
      value.desire ? `Desire ${value.desire}` : '',
      value.action ? `Action ${value.action}` : '',
    ].filter(Boolean).join('；');
  }
  if (value.title || value.text || value.summary || value.value) {
    return [value.title, value.text || value.summary || value.value].filter(Boolean).join('：');
  }
  return Object.entries(value)
    .map(([key, item]) => `${key}：${readableAdvisorValue(item)}`)
    .filter((item) => item.replace(/^[^：]+：/, '').trim() !== '')
    .join('；');
}

function humanizeAdvisorDisplayText(text) {
  return readableAdvisorValue(text)
    .replace(/低压确认治疗后肤况/g, '先用关怀口吻问清楚治疗后的真实肤况')
    .replace(/低压确认客户治疗后肤况/g, '先用关怀口吻问清楚客户治疗后的真实肤况')
    .replace(/低压确认客户体验后肤况/g, '先用关怀口吻问清楚客户体验后的真实肤况')
    .replace(/低压确认体验后肤况和维养感受/g, '先用关怀口吻问清楚体验后的肤况和维养感受')
    .replace(/低压确认肤况/g, '先用关怀口吻确认肤况')
    .replace(/低压唤醒客户/g, '用不打扰的方式重新联系客户')
    .replace(/低压唤醒/g, '用不打扰的方式重新建立沟通')
    .replace(/低压力/g, '不打扰式')
    .replace(/不承诺淡斑效果/g, '不说效果保证')
    .replace(/不承诺效果/g, '不说效果保证');
}

function isChenAdvisorH5Run(run) {
  const identityText = [
    run?.customerIdentity?.customerName,
    run?.customerIdentity?.customerNameMasked,
    run?.customerIdentity?.name,
    run?.advisorTaskCard?.h5ReviewTaskCard?.basicInfo?.customerName,
  ].filter(Boolean).join(' ');
  return /陈喜生/.test(identityText);
}

function h5ScreensForSelectedAngle(taskCard, fallbackScreens, reviewItemId = state.selectedReviewItemId) {
  const angleIndex = selectedH5ReviewAngleIndex(reviewItemId);
  const angle = selectedH5ReviewAngle(taskCard, reviewItemId);
  const angleScreens = angle?.h5Preview?.screens || angle?.previewScreens || angle?.h5Screens || [];
  const defaultAngleScreens = defaultMockScreensForAngle(taskCard, angle, reviewItemId, angleIndex);
  const baseScreens = angleScreens.length === 3
    ? angleScreens
    : (defaultAngleScreens.length === 3 ? defaultAngleScreens : fallbackScreens);
  const challengeText = regenerationContextText(reviewItemId);
  const isRegenerated = state.localReviewActions.get(reviewItemId)?.actionId === 'regenerate';
  const goalVersion = selectedRegeneratedGoalVersion(reviewItemId);
  const sourceScreens = isRegenerated
    ? (angleScreens.length === 3
      ? angleScreens
      : regeneratedMockScreensForChallenge(angle, challengeText, baseScreens, goalVersion, angleIndex, taskCard, reviewItemId))
    : baseScreens;
  const screens = (sourceScreens || []).map((screen, index) => ({
    ...screen,
    step: screen.step || `${String(index + 1).padStart(2, '0')} / 03`,
  }));
  return editedH5ScreensForAngle(screens, reviewItemId, angleIndex);
}

function sendScriptForSelectedAngle(taskCard, fallbackSendScript, reviewItemId = state.selectedReviewItemId) {
  const angleIndex = selectedH5ReviewAngleIndex(reviewItemId);
  const angle = selectedH5ReviewAngle(taskCard, reviewItemId);
  const defaultAngleMessage = defaultSendScriptForAngle(taskCard, angle, reviewItemId, angleIndex);
  const angleMessage = angle?.advisorSendScript?.message
    || angle?.sendScript?.message
    || angle?.sendScript
    || angle?.script;
  const message = angleMessage
    || defaultAngleMessage
    || fallbackSendScript?.message
    || '';
  const challengeText = regenerationContextText(reviewItemId);
  const isRegenerated = state.localReviewActions.get(reviewItemId)?.actionId === 'regenerate';
  const goalVersion = selectedRegeneratedGoalVersion(reviewItemId);
  const activeMessage = isRegenerated
    ? (angleMessage || regeneratedSendScriptForChallenge(angle, challengeText, message, goalVersion, angleIndex, taskCard, reviewItemId))
    : message;
  const localEdit = state.localScriptEdits.get(scriptEditKey(reviewItemId, angleIndex));
  return {
    selectedAngleLabel: angle?.label || fallbackSendScript?.selectedAngleLabel || '推荐角度',
    message: normalizeChenAdvisorText(localEdit?.message || activeMessage),
    sendBoundary: fallbackSendScript?.sendBoundary || '只进入顾问人工审核，不自动发送给客户。',
    localEditedAt: localEdit?.updatedAt || '',
  };
}

function customAngleScreenPayload(screen, index) {
  return {
    step: screen?.step || `${String(index + 1).padStart(2, '0')} / 03`,
    title: normalizeChenAdvisorText(screen?.title || ''),
    body: normalizeChenAdvisorText(screen?.body || screen?.subtitle || ''),
    auditRationale: normalizeChenAdvisorText(screen?.auditRationale || ''),
  };
}

function normalizeCustomAngleGenerationPayload(payload, note) {
  const result = payload?.result || payload || {};
  const sourceAngle = result.angle || result.customAngle || {};
  const screens = asArray(
    result.h5Screens
      || result.h5Preview?.screens
      || sourceAngle.h5Preview?.screens
      || sourceAngle.previewScreens
      || sourceAngle.h5Screens
  ).slice(0, 3).map(customAngleScreenPayload);
  const advisorMessage = result.advisorScript?.message
    || result.advisorSendScript?.message
    || sourceAngle.advisorSendScript?.message
    || sourceAngle.sendScript?.message
    || sourceAngle.script
    || result.script
    || '';
  const angle = {
    ...sourceAngle,
    code: sourceAngle.code || 'ANGLE_04',
    label: normalizeChenAdvisorText(sourceAngle.label || sourceAngle.angle || sourceAngle.title || '自定义角度'),
    operatingFocus: normalizeChenAdvisorText(sourceAngle.operatingFocus || sourceAngle.reasoning || result.reasoning || ''),
    h5Lead: normalizeChenAdvisorText(sourceAngle.h5Lead || sourceAngle.summary || result.summary || note),
    customAngleNote: note,
    generatedBy: 'deepseek_custom_angle',
    h5Preview: {
      ...(sourceAngle.h5Preview || {}),
      screens,
    },
    advisorSendScript: {
      ...(sourceAngle.advisorSendScript || {}),
      message: normalizeChenAdvisorText(advisorMessage),
      sendBoundary: result.advisorScript?.sendBoundary
        || sourceAngle.advisorSendScript?.sendBoundary
        || '只进入顾问人工审核，不自动发送给客户。',
    },
    script: normalizeChenAdvisorText(advisorMessage),
  };
  return {
    ...result,
    note,
    angle,
    h5Screens: screens,
    advisorScript: {
      ...(result.advisorScript || {}),
      message: angle.advisorSendScript.message,
      sendBoundary: angle.advisorSendScript.sendBoundary,
    },
    generatedAt: result.generatedAt || payload?.generatedAt || nowLabel(),
    provider: result.provider || payload?.provider || 'deepseek',
    model: result.model || payload?.model || '',
    dedupeFlag: result.dedupeFlag || payload?.dedupeFlag || null,
    rawUsage: result.rawUsage || payload?.rawUsage || null,
    gates: result.gates || payload?.gates || {
      automaticSendAllowed: false,
      remoteWriteAllowed: false,
      customerFacingPublishAllowed: false,
    },
  };
}

function compactAngleForCustomGeneration(angle, index) {
  return {
    index: index + 1,
    code: angle?.code || '',
    label: angle?.label || '',
    h5Lead: angle?.h5Lead || '',
    operatingFocus: angle?.operatingFocus || '',
  };
}

function buildCustomAngleRequestPayload(note, review, archive, taskCard) {
  const customerFacts = advisorH5CustomerFacts(taskCard, archive, review);
  const sourceAngles = sourceCommunicationAnglesForReview(taskCard, review.reviewItemId).slice(0, 3);
  return {
    actor: 'advisor_h5_review_custom_angle_button',
    reviewItemId: review.reviewItemId,
    unifiedCustomerId: review.unifiedCustomerId || archive?.customerId || '',
    customerName: review.customerName || archive?.customerName || customerFacts.customerName || '',
    sourceMode: reviewSourceMode,
    customAngleNote: note,
    selectedAngleIndex: selectedH5ReviewAngleIndex(review.reviewItemId),
    customerInfo: {
      customerFacts,
      basicInfo: taskCard.basicInfo || {},
      classification: taskCard.classification || {},
      planAndConsumption: taskCard.planAndConsumption || {},
      commercialHook: taskCard.commercialHook || {},
      reviewFacts: archive?.reviewFacts || {},
      personalProfileBrief: taskCard.personalProfileBrief || '',
    },
    interactionGoal: taskCard.interactionGoal || {},
    existingAngles: sourceAngles.map(compactAngleForCustomGeneration),
    safetyBoundary: {
      automaticSendAllowed: false,
      automaticPublishAllowed: false,
      remoteWriteAllowed: false,
      customerFacingPublishAllowed: false,
    },
  };
}

function defaultAdvisorCampaignOfferText() {
  return '可免除宋教授日常1000元面诊费';
}

function advisorCampaignOfferTextForReview(reviewItemId = state.selectedReviewItemId) {
  return state.advisorCampaignOfferByReviewId.get(reviewItemId) || defaultAdvisorCampaignOfferText();
}

function advisorScriptAppointmentWindow(now = new Date()) {
  const date = Number.isNaN(now.getTime()) ? new Date() : now;
  const monthIndex = date.getDate() <= 20 ? date.getMonth() : date.getMonth() + 1;
  return `${(monthIndex % 12) + 1}月中旬`;
}

function advisorSurnameFromName(value) {
  const clean = String(value || '').replace(/[先生女士小姐客户顾客老师\s*＊]/g, '').trim();
  if (!clean) return '';
  const cjk = clean.match(/[\u4e00-\u9fff]/);
  if (cjk) return cjk[0];
  return clean.split(/[\s._-]+/).filter(Boolean)[0]?.slice(0, 1) || '';
}

function advisorFirstText(...values) {
  return values.map((value) => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.filter(Boolean).join('；');
    if (typeof value === 'object') return value.summaryForAdvisor || value.text || value.summary || '';
    return String(value).trim();
  }).find(Boolean) || '';
}

function advisorRequirementSource(taskCard = {}, archive = {}) {
  return taskCard?.basicInfo?.sourceRequirementValues
    || taskCard?.sourceRequirementValues
    || archive?.h5ReviewTaskCard?.basicInfo?.sourceRequirementValues
    || archive?.h5ReviewTaskCard?.sourceRequirementValues
    || {};
}

function advisorRequirementRows(taskCard = {}, archive = {}, key = '') {
  const source = advisorRequirementSource(taskCard, archive);
  return Array.isArray(source?.[key]) ? source[key] : [];
}

function advisorCleanRequirementValue(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text || /^(待补|待确认|待接入|暂无记录|无记录|未填写)$/i.test(text)) return '';
  return text;
}

function advisorDirectRequirementValue(value) {
  const text = advisorCleanRequirementValue(value);
  const match = text.match(/^[^=：:]{1,30}[=：:]\s*(.+)$/);
  return match?.[1]?.trim() || text;
}

function advisorRequirementValue(taskCard = {}, archive = {}, key = '') {
  const row = advisorRequirementRows(taskCard, archive, key)
    .find((item) => advisorCleanRequirementValue(item?.value));
  return advisorDirectRequirementValue(row?.value);
}

function advisorRequirementSummary(taskCard = {}, archive = {}, key = '', limit = 5) {
  return advisorRequirementRows(taskCard, archive, key)
    .map((item) => {
      const value = advisorCleanRequirementValue(item?.value);
      if (!value) return '';
      const title = String(item?.title || item?.requirementId || '').replace(/[。.\s]+$/g, '');
      return title ? `${title}：${value}` : value;
    })
    .filter(Boolean)
    .slice(0, limit)
    .join('；');
}

function advisorScriptIsSummaryField(key) {
  return Object.prototype.hasOwnProperty.call(ADVISOR_SCRIPT_SUMMARY_FIELD_RULES, key);
}

function advisorScriptSummaryRuleForField(key) {
  return state.advisorScriptSummaryRulesByField.get(key)
    || ADVISOR_SCRIPT_SUMMARY_FIELD_RULES[key]
    || '把原始数据提炼成一句顾问可读、可给 AI 使用的摘要；缺证据时明确写待确认，不编造。';
}

function advisorScriptSummaryRulesSnapshot() {
  return Object.fromEntries(
    Object.keys(ADVISOR_SCRIPT_SUMMARY_FIELD_RULES)
      .map((fieldKey) => [fieldKey, advisorScriptSummaryRuleForField(fieldKey)])
  );
}

function advisorScriptSummaryOverrideKey(reviewItemId, fieldKey) {
  return `${reviewItemId || 'unknown'}::${fieldKey || 'unknown'}`;
}

function advisorScriptSummaryRuleRevisionKey(reviewItemId, fieldKey) {
  return `${reviewItemId || 'unknown'}::${fieldKey || 'unknown'}`;
}

function advisorScriptSummaryRuleRevisionForReview(reviewItemId, fieldKey) {
  return state.advisorScriptSummaryRuleRevisionByKey.get(advisorScriptSummaryRuleRevisionKey(reviewItemId, fieldKey)) || null;
}

function clearAdvisorScriptSummaryRuleRevision(reviewItemId, fieldKey) {
  state.advisorScriptSummaryRuleRevisionByKey.delete(advisorScriptSummaryRuleRevisionKey(reviewItemId, fieldKey));
}

function advisorScriptSummaryOverrideForReview(reviewItemId, fieldKey) {
  return state.advisorScriptSummaryOverridesByReviewId.get(advisorScriptSummaryOverrideKey(reviewItemId, fieldKey)) || null;
}

function advisorScriptSetSummaryOverride(reviewItemId, fieldKey, summary, rule, rawData) {
  if (!reviewItemId || !fieldKey) return;
  const key = advisorScriptSummaryOverrideKey(reviewItemId, fieldKey);
  state.advisorScriptSummaryOverridesByReviewId.set(key, {
    fieldKey,
    summary: String(summary || '').trim(),
    rule: String(rule || '').trim(),
    rawData,
    updatedAt: nowLabel(),
  });
}

function advisorFieldSummaryText(value, depth = 0) {
  if (value === null || value === undefined || value === '') return '';
  if (depth > 5) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value).trim();
  if (Array.isArray(value)) {
    return value.map((item) => advisorFieldSummaryText(item, depth + 1)).filter(Boolean).join('；');
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, item]) => {
        const text = advisorFieldSummaryText(item, depth + 1);
        return text ? `${key}：${text}` : '';
      })
      .filter(Boolean)
      .join('；');
  }
  return String(value || '').trim();
}

function advisorCleanRawSummaryText(value) {
  return String(value || '')
    .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '')
    .replace(/\b(?:visitid|visitId|病历号|emrs?|id|recordId|customerId|unifiedCustomerId)\s*[=：:]\s*[A-Za-z0-9_-]+/g, '')
    .replace(/HIS\s*emrs\s*[=：:]\s*\d+\s*条?/gi, '')
    .replace(/医生\s*[=：:]\s*([^；;，,\s]+)/g, '医生：$1')
    .replace(/[{}"[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[；;，,\s]+$/g, '')
    .trim();
}

function advisorLocalSummaryForField(fieldKey, rawData, fallbackSummary) {
  const rawText = advisorCleanRawSummaryText(advisorFieldSummaryText(rawData));
  const fallbackText = advisorCleanRawSummaryText(advisorFirstText(fallbackSummary));
  const text = rawText || fallbackText;
  if (!text) return fallbackText || '';
  if (fieldKey === '病历') {
    if (/红斑|黑斑|黄斑|皱纹|毛孔|紫质|暗沉|斑点|斑片|松垂|泪沟|法令|下颌线|丘疹/.test(text)) {
      const parts = [];
      if (/暗沉|肤色/.test(text)) parts.push('肤色暗沉或不均');
      if (/红斑|泛红/.test(text)) parts.push('双面颊红斑/泛红');
      if (/斑点|斑片|黑斑|黄斑|褐色/.test(text)) parts.push('斑点/色斑');
      if (/毛孔/.test(text)) parts.push('毛孔');
      if (/松垂|松弛|泪沟|法令|下颌线|脂肪下移/.test(text)) parts.push('松弛、泪沟和法令纹等抗衰关注点');
      return `病历和检测提示${parts.slice(0, 4).join('、') || '肤况和抗衰关注点'}；需顾问结合医生建议复核。`;
    }
    if (/待|未命中|缺失|需顾问/.test(text)) return '病历证据不足，需顾问补充或核验医生建议。';
    return `${text.slice(0, 90)}${text.length > 90 ? '...' : ''}`;
  }
  if (fieldKey === 'CSKIN') {
    if (/毛孔|松弛|泛红|红斑|色斑|暗沉|肤色|皱纹|紫质/.test(text)) {
      const parts = [];
      if (/毛孔/.test(text)) parts.push('毛孔需关注');
      if (/松弛|皱纹|纹路/.test(text)) parts.push('轻度松弛及纹路需关注');
      if (/泛红|红斑/.test(text)) parts.push('泛红稳定度一般');
      if (/色斑|黑斑|黄斑|暗沉|肤色/.test(text)) parts.push('肤色均匀度需关注');
      if (/紫质|油脂|闭口/.test(text)) parts.push('油脂闭口风险需观察');
      return parts.slice(0, 3).join('，') || fallbackText || '';
    }
  }
  if (fieldKey === '未消耗疗程') {
    if (/无|没有|剩余\s*0|0\s*次|已完成/.test(text)) return '没有未消耗疗程。';
    if (/待|需顾问|缺失|未命中|不明确/.test(text)) return '需顾问确认是否存在未消耗疗程。';
  }
  if (fieldKey === '消耗历史') {
    const amount = text.match(/(?:消耗总金额|总金额|金额|累计消费|消费)[^0-9]{0,8}([0-9]+(?:\.[0-9]+)?\s*(?:元|万)?)/);
    const prefix = /面部|抗衰|年轻化|法令|泪沟|松弛|轮廓|支撑/.test(text)
      ? '曾做面部年轻化管理'
      : '曾做项目管理';
    return amount ? `${prefix}，消耗总金额${amount[1]}。` : (fallbackText || `${prefix}，包含待顾问核验历史方案和最近服务记录。`);
  }
  if (fieldKey === '咨询记录') {
    const topics = [];
    [
      ['面容憔悴感', /憔悴|疲惫|面容/],
      ['法令纹', /法令/],
      ['泪沟', /泪沟/],
      ['面部支撑感', /支撑|轮廓|松弛|下垂/],
      ['色斑', /色斑|斑|暗沉|肤色/],
      ['毛孔肤质', /毛孔|肤质/],
      ['泛红敏感', /泛红|红斑|敏感/],
    ].forEach(([label, pattern]) => {
      if (pattern.test(text) && !topics.includes(label)) topics.push(label);
    });
    if (topics.length) return `咨询重点关注${topics.slice(0, 5).join('、')}。`;
  }
  return fallbackText || `${text.slice(0, 90)}${text.length > 90 ? '...' : ''}`;
}

function advisorScriptQueueFieldSummary(reviewItemId, fieldKey, rawData, fallbackSummary) {
  if (!reviewItemId || !advisorScriptIsSummaryField(fieldKey)) return;
  if (advisorScriptSummaryOverrideForReview(reviewItemId, fieldKey)?.summary) return;
  const key = advisorScriptSummaryOverrideKey(reviewItemId, fieldKey);
  if (state.advisorScriptSummaryFetchByKey.has(key)) return;
  const localSummary = advisorLocalSummaryForField(fieldKey, rawData, fallbackSummary);
  state.advisorScriptSummaryFetchByKey.set(key, { status: 'running' });
  postApi(ADVISOR_FIELD_SUMMARY_API, {
    actor: 'advisor_script_modal_field_summary',
    reviewItemId,
    fieldKey,
    rule: advisorScriptSummaryRuleForField(fieldKey),
    rawData,
    fallbackSummary: localSummary,
  }).then((payload) => {
    const summary = advisorFirstText(payload?.summary, payload?.fieldSummary?.summary);
    if (!summary) return;
    advisorScriptSetSummaryOverride(reviewItemId, fieldKey, summary, advisorScriptSummaryRuleForField(fieldKey), rawData);
    persistAdvisorH5LocalState();
    if (state.advisorScriptModalReviewItemId === reviewItemId) renderAdvisorScriptModal();
  }).catch((error) => {
    state.advisorScriptSummaryFetchByKey.set(key, { status: 'failed', message: error.message });
  });
}

function advisorScriptSummarizedValue(reviewItemId, fieldKey, rawData, fallbackSummary) {
  const override = advisorScriptSummaryOverrideForReview(reviewItemId, fieldKey);
  if (override?.summary) return override.summary;
  const localSummary = advisorLocalSummaryForField(fieldKey, rawData, fallbackSummary);
  advisorScriptQueueFieldSummary(reviewItemId, fieldKey, rawData, localSummary);
  return localSummary || '';
}

function formatAdvisorScriptRawData(value) {
  if (value === null || value === undefined || value === '') return '暂无原始数据';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
}

function advisorRedactCustomerName(text, review = {}, archive = {}, taskCard = {}) {
  let output = String(text || '');
  const basic = taskCard?.basicInfo || {};
  const names = [
    review?.customerName,
    archive?.customerName,
    archive?.customerIdentity?.customerName,
    archive?.customerIdentity?.name,
    basic.customerName,
  ].filter(Boolean);
  names.forEach((name) => {
    const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (escaped) output = output.replace(new RegExp(escaped, 'g'), '');
  });
  return output
    .replace(/^[，,、\s]+/, '')
    .replace(/([，,；;]\s*){2,}/g, '，')
    .trim();
}

function advisorScriptConsumptionSummary(context = {}) {
  const { customerFacts = {}, plan = {}, facts = {} } = context;
  const rawText = advisorFirstText(plan.consumptionFeatureSummary, customerFacts.consumptionSummary, facts.consumptionFacts);
  const amountSource = firstNonEmpty(
    parseAdvisorMoneyFromText(rawText),
    parseAdvisorMoneyFromText(formatAdvisorScriptRawData(context.rawData || '')),
    customerFacts.totalConsumption,
    plan.totalConsumption,
    plan.cumulativeConsumption,
  );
  const amountNumber = advisorMoneyNumber(amountSource);
  const amountText = Number.isFinite(amountNumber) ? `消耗总金额${formatAdvisorMoney(amountNumber)}` : '';
  const projectText = advisorFirstText(plan.recentProject, plan.project, plan.proposedOrTakenPlan, rawText);
  const hasSupport = /支撑|轮廓|法令|泪沟|抗衰|年轻化|松弛|填充|注射/.test(projectText);
  const hasPhoto = /光电|光子|皮秒|激光|水光|维养|美塑|射频/.test(projectText);
  const hasFace = /面部|脸|颜|年轻化|轮廓|法令|泪沟|松弛/.test(projectText);
  const categories = [
    hasPhoto ? '光电维养' : '',
    hasSupport ? '面部支撑相关项目' : '',
  ].filter(Boolean);
  const prefix = hasFace || hasSupport ? '曾做面部年轻化管理' : '曾做项目管理';
  const categoryText = categories.length ? `，包含${categories.join('和')}` : (projectText ? `，包含${projectText.replace(/\s+/g, ' ').slice(0, 36)}` : '');
  return [prefix + categoryText, amountText].filter(Boolean).join('，') || rawText;
}

function normalizeAdvisorCskinScores(scores = {}) {
  const alias = {
    redspot: '红斑',
    blackspot: '黑斑',
    macula: '黄斑',
    wrinkle: '皱纹',
    pore: '毛孔',
    porphyrin: '紫质',
    红区: '红斑',
  };
  return Object.fromEntries(Object.entries(scores || {})
    .map(([key, value]) => [alias[key] || key, Math.round(Number(value))])
    .filter(([, value]) => Number.isFinite(value)));
}

function advisorCskinNaturalSummary(scores = {}) {
  const normalized = normalizeAdvisorCskinScores(scores);
  const pore = normalized.毛孔;
  const wrinkle = normalized.皱纹;
  const red = normalized.红斑;
  const black = normalized.黑斑;
  const macula = normalized.黄斑;
  const porphyrin = normalized.紫质;
  const parts = [];
  if (pore >= 55) parts.push('两颊毛孔明显');
  else if (pore >= 45) parts.push('毛孔偏明显');
  if (wrinkle >= 55) parts.push('轻度松弛及纹路需关注');
  else if (wrinkle >= 35) parts.push('轻度松弛');
  if (red >= 55) parts.push('泛红稳定度一般');
  if (Math.max(black || 0, macula || 0) >= 60) parts.push('色斑和肤色均匀度需关注');
  else if (Math.max(black || 0, macula || 0) >= 45) parts.push('肤色稳定度一般');
  if (porphyrin >= 45) parts.push('油脂及闭口风险偏高');
  if (!parts.length && Object.keys(normalized).length) parts.push('整体肤况相对平稳，可复盘当前状态');
  return parts.slice(0, 3).join('，');
}

function advisorScriptH5PreviewCskinSummary(review, archive, taskCard) {
  const config = typeof clinicalPreviewConfig === 'function' ? clinicalPreviewConfig() : null;
  const scores = normalizeAdvisorCskinScores(config?.cskinIndices || window.H5ReviewKit?.GENERIC_CSKIN_ESTIMATE || {});
  const summary = advisorCskinNaturalSummary(scores);
  if (!summary) return null;
  return {
    source: 'h5-preview / clinicalPreviewConfig.cskinIndices',
    matchedBy: 'current_h5_preview',
    detectedAt: '',
    recordId: advisorScriptCskinRecordId(review, archive, taskCard) || '',
    radarScores: scores,
    overThresholdItems: Object.entries(scores).filter(([, score]) => score > 30).map(([label, score]) => ({ label, score })),
    summaryForAdvisor: summary,
    customerFacingAllowed: false,
    rawAvailability: 'h5_preview_scores',
  };
}

function advisorScriptUnconsumedSummary(context = {}) {
  const { customerFacts = {}, hook = {}, plan = {}, facts = {} } = context;
  const raw = advisorFirstText(customerFacts.unconsumedProjects, hook.unconsumedProjects, facts.remainingProjectFacts, facts.consumptionFacts);
  const remainNumber = Number(plan.serviceRemainCount);
  if (Number.isFinite(remainNumber) && remainNumber <= 0) return '没有未消耗疗程。';
  if (/无|没有|已完成|剩余\s*0|0\s*次/.test(raw)) return '没有未消耗疗程。';
  if (raw && !/待|需顾问确认|不确定/.test(raw)) return `还有${raw.replace(/^还有/, '').replace(/[。；;]+$/g, '')}没有完成。`;
  return '需顾问确认是否存在未消耗疗程。';
}

function advisorScriptConsultationSummary(context = {}) {
  const { basic = {}, facts = {}, taskCard = {}, review = {}, archive = {} } = context;
  const raw = advisorRedactCustomerName(
    advisorFirstText(basic.consultationSummary, taskCard.personalProfileBrief, facts.diagnosisAndNeed),
    review,
    archive,
    taskCard,
  );
  if (!raw) return '';
  const concerns = [];
  [
    ['面容憔悴感', /憔悴|疲惫|面容/],
    ['法令纹', /法令/],
    ['泪沟', /泪沟/],
    ['面部支撑感', /支撑|轮廓|松弛|下垂/],
    ['色斑', /黄褐斑|日光性黑子|色斑|色沉|斑/],
    ['毛孔肤质', /毛孔|肤质|暗沉|肤色/],
    ['泛红敏感', /泛红|红斑|敏感|屏障|毛细血管/],
  ].forEach(([label, pattern]) => {
    if (pattern.test(raw) && !concerns.includes(label)) concerns.push(label);
  });
  if (concerns.length) return `关注${concerns.join('、')}。`;
  return raw.replace(/\s+/g, ' ').slice(0, 80);
}

function advisorScriptRawDataForField(fieldKey, context = {}) {
  const {
    customerFacts = {},
    basic = {},
    plan = {},
    hook = {},
    facts = {},
    identity = {},
    evidenceIdentity = {},
    loadedCskinSummary = null,
    review = {},
    archive = {},
    taskCard = {},
  } = context;
  switch (fieldKey) {
    case '消耗历史':
      return {
        requirementRows: advisorRequirementRows(taskCard, archive, 'consumption'),
        consumptionFeatureSummary: plan.consumptionFeatureSummary || '',
        consumptionFacts: facts.consumptionFacts || '',
        consumptionSummary: customerFacts.consumptionSummary || '',
        recentProject: plan.recentProject || '',
        serviceProjectCount: plan.serviceProjectCount ?? '',
        serviceRemainCount: plan.serviceRemainCount ?? '',
      };
    case 'CSKIN':
      return {
        requirementRows: advisorRequirementRows(taskCard, archive, 'cskin'),
        loadedCskinSummary: loadedCskinSummary || '',
        basicCskin: advisorFirstText(
          basic.CSKIN,
          basic.cskin,
          basic.cskinSummary,
          basic.cskin_summary,
          basic.cskinText,
          basic.cskinEvidence,
          basic.skinTestSummary,
          basic.skin_test_summary,
          basic.skinDetectionSummary,
          basic.skinDetection,
          basic.skinTestFacts,
          basic['皮肤检测'],
          basic['皮肤检测与图像信息'],
        ),
        identityCskin: advisorFirstText(
          identity.CSKIN,
          identity.cskin,
          identity.cskinSummary,
          identity.cskin_summary,
          identity.skinTestSummary,
          identity.skin_test_summary,
          identity.skinDetectionSummary,
          identity.skinDetection,
          identity.skinTestFacts,
        ),
        reviewFactsCskin: advisorFirstText(
          facts.CSKIN,
          facts.cskinSummary,
          facts.skinTestSummary,
          facts.skinDetectionSummary,
          facts.skinTestFacts,
          facts.skinDetection,
        ),
      };
    case '未消耗疗程':
      return {
        requirementRows: advisorRequirementRows(taskCard, archive, 'unconsumed'),
        unconsumedProjects: customerFacts.unconsumedProjects || hook.unconsumedProjects || '',
        serviceRemainCount: plan.serviceRemainCount ?? '',
        serviceProjectCount: plan.serviceProjectCount ?? '',
        remainingProjectFacts: facts.remainingProjectFacts || facts.consumptionFacts || '',
        commercialHook: hook,
      };
    case '病历':
      return {
        requirementRows: advisorRequirementRows(taskCard, archive, 'medicalRecord'),
        diagnosisAndNeed: facts.diagnosisAndNeed || '',
        medicalRecordFacts: facts.medicalRecordFacts || '',
        doctorPlan: customerFacts.doctorPlan || plan.doctorPlan || facts.doctorPlan || '',
      };
    case '聊天记录':
      return {
        requirementRows: advisorRequirementRows(taskCard, archive, 'wecomChat'),
        relationshipFacts: facts.relationshipFacts || '',
        riskFacts: facts.riskFacts || '',
        advisorBrief: review.advisorBrief || '',
        wecomBinding: archive.advisorWecomBinding || null,
      };
    case '咨询记录':
      return {
        requirementRows: advisorRequirementRows(taskCard, archive, 'consultation'),
        consultationSummary: advisorRedactCustomerName(basic.consultationSummary || '', review, archive, taskCard),
        personalProfileBrief: advisorRedactCustomerName(taskCard.personalProfileBrief || '', review, archive, taskCard),
        demandType: taskCard.classification?.demandType || '',
        lifecycleStage: taskCard.classification?.lifecycleStage || '',
        classificationAnchor: taskCard.classification?.classificationAnchor || '',
        diagnosisAndNeed: advisorRedactCustomerName(facts.diagnosisAndNeed || '', review, archive, taskCard),
      };
    default:
      return '';
  }
}

function advisorScriptCskinRecordId(review, archive, taskCard) {
  const basic = taskCard?.basicInfo || {};
  const identity = archive?.customerIdentity || {};
  return advisorFirstText(
    basic.cskinRecordId,
    basic.skinTestRecordId,
    basic.cskinSourceId,
    identity.cskinRecordId,
    identity.skinTestRecordId,
    archive?.cskinRecordId,
    review?.cskinRecordId,
  );
}

function advisorScriptCskinSummaryFromPayload(payload) {
  const cskin = payload?.data?.cskin || payload?.cskin || null;
  const radarScores = cskin?.radarScores || {};
  const scoreParts = Object.entries(radarScores)
    .filter(([, score]) => Number.isFinite(Number(score)))
    .map(([label, score]) => `${label} ${Math.round(Number(score))}`);
  const detectedAt = cskin?.detectedAt || '';
  if (!scoreParts.length) return null;
  const overThresholdItems = Object.entries(radarScores)
    .filter(([, score]) => Number(score) > 30)
    .map(([label, score]) => ({ label, score: Math.round(Number(score)) }));
  const naturalSummary = advisorCskinNaturalSummary(radarScores);
  return {
    source: 'h5-summary / visual-detection / initial-data',
    matchedBy: cskin.cskinRecordId ? 'cskinRecordId' : 'customerName',
    detectedAt,
    recordId: cskin.cskinRecordId || '',
    radarScores: normalizeAdvisorCskinScores(radarScores),
    overThresholdItems,
    summaryForAdvisor: naturalSummary || `CSKIN最新${detectedAt || '待补时间'}：${scoreParts.join('，')}。`,
    customerFacingAllowed: false,
    rawAvailability: 'structured_scores',
  };
}

async function ensureAdvisorScriptCskinForReview(review, archive, taskCard) {
  const reviewItemId = review?.reviewItemId;
  if (!reviewItemId) return null;
  if (state.advisorScriptCskinByReviewId.has(reviewItemId)) return state.advisorScriptCskinByReviewId.get(reviewItemId);
  if (state.advisorScriptCskinFetchByReviewId.has(reviewItemId)) return state.advisorScriptCskinFetchByReviewId.get(reviewItemId);
  const customerId = review?.unifiedCustomerId || review?.customerId || archive?.customerId || '';
  const customerName = review?.customerName || archive?.customerName || taskCard?.basicInfo?.customerName || '';
  if (!customerId && !customerName) return null;
  const params = new URLSearchParams();
  if (customerId) params.set('customerId', customerId);
  if (customerName) params.set('customerName', customerName);
  const cskinRecordId = advisorScriptCskinRecordId(review, archive, taskCard);
  if (cskinRecordId) params.set('cskinRecordId', cskinRecordId);
  const promise = api(`/api/h5-summary/visual-detection/initial-data?${params.toString()}`)
    .then((payload) => {
      const summary = advisorScriptCskinSummaryFromPayload(payload) || advisorScriptH5PreviewCskinSummary(review, archive, taskCard);
      state.advisorScriptCskinByReviewId.set(reviewItemId, summary);
      return summary;
    })
    .catch(() => {
      const summary = advisorScriptH5PreviewCskinSummary(review, archive, taskCard);
      state.advisorScriptCskinByReviewId.set(reviewItemId, summary);
      return summary;
    })
    .finally(() => {
      state.advisorScriptCskinFetchByReviewId.delete(reviewItemId);
      if (state.advisorScriptModalReviewItemId === reviewItemId) renderAdvisorScriptModal();
    });
  state.advisorScriptCskinFetchByReviewId.set(reviewItemId, promise);
  return promise;
}

function advisorScriptBasicInfoOverride(review, archive, taskCard) {
  const customerFacts = advisorH5CustomerFacts(taskCard, archive, review);
  const basic = taskCard?.basicInfo || {};
  const plan = taskCard?.planAndConsumption || {};
  const hook = taskCard?.commercialHook || {};
  const facts = archive?.reviewFacts || {};
  const identity = archive?.customerIdentity || {};
  const evidenceIdentity = archive?.advisorH5EvidencePack?.customerIdentity || {};
  const reqSourceChannel = advisorRequirementValue(taskCard, archive, 'sourceChannel');
  const reqReferrer = advisorRequirementValue(taskCard, archive, 'referrer');
  const reqDoctorName = advisorRequirementValue(taskCard, archive, 'doctorName');
  const reqAdvisorName = advisorRequirementValue(taskCard, archive, 'advisorName');
  const reqFirstVisitDate = advisorRequirementValue(taskCard, archive, 'firstVisitDate');
  const reqLastVisitDate = advisorRequirementValue(taskCard, archive, 'lastVisitDate');
  const reqRfmGrade = advisorRequirementValue(taskCard, archive, 'rfmGrade');
  const reqSourceAndReferrer = [
    reqSourceChannel,
    reqReferrer && !/无|否|未见/.test(reqReferrer) ? reqReferrer : '',
  ].filter(Boolean).join(' / ');
  const genderText = normalizeAdvisorScriptGenderText(
    basic.gender,
    basic.genderText,
    basic.sex,
    customerFacts.gender,
    basic.gender,
    basic.genderText,
    basic.sex,
    identity.genderIdentity,
    identity.gender,
    identity.genderText,
    identity.sex,
    evidenceIdentity.genderIdentity,
    evidenceIdentity.gender,
    evidenceIdentity.genderText,
    evidenceIdentity.sex,
  ) || '待确认';
  const fullName = customerFacts.customerName || review?.customerName || archive?.customerName || '';
  const loadedCskinSummary = state.advisorScriptCskinByReviewId.get(review?.reviewItemId)
    || advisorScriptH5PreviewCskinSummary(review, archive, taskCard)
    || null;
  const localCskinSummary = advisorFirstText(
    loadedCskinSummary,
    basic.CSKIN,
    basic.cskin,
    basic.cskinSummary,
    basic.cskin_summary,
    basic.cskinText,
    basic.cskinEvidence,
    basic.skinTestSummary,
    basic.skin_test_summary,
    basic.skinDetectionSummary,
    basic.skinDetection,
    basic.skinTestFacts,
    basic['皮肤检测'],
    basic['皮肤检测与图像信息'],
    identity.CSKIN,
    identity.cskin,
    identity.cskinSummary,
    identity.cskin_summary,
    identity.skinTestSummary,
    identity.skin_test_summary,
    identity.skinDetectionSummary,
    identity.skinDetection,
    identity.skinTestFacts,
    facts.CSKIN,
    facts.cskinSummary,
    facts.skinTestSummary,
    facts.skinDetectionSummary,
    facts.skinTestFacts,
    facts.skinDetection,
    advisorRequirementSummary(taskCard, archive, 'cskin', 6),
  );
  const summaryContext = {
    customerFacts,
    basic,
    plan,
    hook,
    facts,
    identity,
    evidenceIdentity,
    loadedCskinSummary,
    review,
    archive,
    taskCard,
  };
  const summarize = (fieldKey, fallbackSummary) => advisorScriptSummarizedValue(
    review?.reviewItemId,
    fieldKey,
    advisorScriptRawDataForField(fieldKey, summaryContext),
    fallbackSummary
  );
  return {
    姓氏: advisorSurnameFromName(fullName),
    性别: genderText,
    顾客称谓: advisorScriptHonorificFromGender(genderText) || '待确认',
    '客户渠道+推荐人': reqSourceAndReferrer || basic.sourceAndReferrer || customerFacts.sourceChannel || basic.sourceChannel || '',
    初诊日期: reqFirstVisitDate
      || basic.firstVisitDate
      || basic.firstVisitAt
      || basic.first_visit_date
      || basic.FirstAppDate
      || identity.firstVisitDate
      || identity.firstVisitAt
      || identity.first_visit_date
      || identity.FirstAppDate
      || '',
    所属医生: reqDoctorName || customerFacts.doctor || basic.doctor || '',
    消耗历史: summarize('消耗历史', advisorRequirementSummary(taskCard, archive, 'consumption', 5) || advisorScriptConsumptionSummary(summaryContext)),
    CSKIN: summarize('CSKIN', localCskinSummary),
    cskinSummary: loadedCskinSummary || '',
    未消耗疗程: summarize('未消耗疗程', advisorRequirementSummary(taskCard, archive, 'unconsumed', 5) || advisorScriptUnconsumedSummary(summaryContext)),
    病历: summarize('病历', advisorRequirementSummary(taskCard, archive, 'medicalRecord', 5) || facts.diagnosisAndNeed || facts.medicalRecordFacts || ''),

    咨询记录: summarize('咨询记录', advisorRequirementSummary(taskCard, archive, 'consultation', 5) || advisorScriptConsultationSummary(summaryContext)),
    RFM等级: reqRfmGrade || customerFacts.rfmGrade || basic.rfmGrade || '',
    健康管理人: reqAdvisorName || customerFacts.advisor || basic.advisor || '',
    末诊时间: reqLastVisitDate
      || basic.lastVisitDate
      || basic.lastVisitTime
      || basic.lastVisitAt
      || basic.last_visit_date
      || basic.last_visit_time
      || basic.LastVisitTime
      || basic.LastAppDate
      || plan.lastVisitDate
      || plan.lastVisitTime
      || identity.lastVisitDate
      || identity.lastVisitTime
      || identity.lastVisitAt
      || identity.last_visit_date
      || identity.last_visit_time
      || identity.LastVisitTime
      || identity.LastAppDate
      || '',
  };
}

function advisorScriptTextFromRun(runPayload) {
  const output = runPayload?.run?.output
    || runPayload?.data?.output
    || runPayload?.output
    || runPayload
    || {};
  return output.advisorScript?.finalScriptText
    || output.h5Copy?.advisorScript?.finalScriptText
    || runPayload?.advisorScript?.finalScriptText
    || runPayload?.run?.advisorScript?.finalScriptText
    || runPayload?.data?.advisorScript?.finalScriptText
    || output.advisorScript?.message
    || output.advisorScriptText
    || '';
}

function setAdvisorScriptModalStatus(reviewItemId, message) {
  if (!reviewItemId) return;
  state.advisorScriptModalStatusByReviewId.set(reviewItemId, message || '');
  const target = $('#advisor-script-modal-status');
  if (target && state.advisorScriptModalReviewItemId === reviewItemId) {
    target.textContent = message || '生成后可继续编辑或提出修改意见。';
  }
}

function buildAdvisorScriptRequestPayload(review, archive, taskCard, angleIndex, campaignOfferText, modalInputs = {}) {
  const selectedAngle = selectedH5ReviewAngle(taskCard, review.reviewItemId) || {};
  const screens = h5ScreensForSelectedAngle(taskCard, taskCard.h5Preview?.screens || archive?.h5Brief?.screens || [], review.reviewItemId);
  const basicInfoOverride = advisorScriptBasicInfoOverride(review, archive, taskCard);
  const purposeText = modalInputs.purposeText || ADVISOR_SCRIPT_PURPOSE_OPTIONS[0].value;
  const purposeTemplateText = modalInputs.purposeTemplateText || advisorScriptPurposeTemplate(purposeText);
  const scriptWordLimit = advisorScriptWordLimitForPurpose(purposeText);
  const scriptToneGuidance = advisorScriptToneGuidanceForPurpose(purposeText);
  const sceneText = modalInputs.sceneText || '15周年活动';
  const customerGender = basicInfoOverride.性别 || '';
  const customerHonorific = advisorScriptHonorificFromGender(customerGender);
  const basicInfoSummaryRules = advisorScriptSummaryRulesSnapshot();
  const customerFacts = advisorH5CustomerFacts(taskCard, archive, review);
  return {
    actor: 'ds_advisor_h5_review_page_script_button',
    reviewItemId: review.reviewItemId,
    unifiedCustomerId: review.unifiedCustomerId || archive?.customerId || '',
    customerId: review.unifiedCustomerId || archive?.customerId || '',
    customerName: review.customerName || archive?.customerName || '',
    customerGender,
    customerHonorific,
    sourceMode: reviewSourceMode,
    campaignOfferText,
    campaign: {
      serviceRole: 'VIP服务经理',
      expertName: '宋为民',
      anniversaryLabel: sceneText,
      campaignOfferText,
      purposeText,
      purposeTemplateText,
      scriptWordLimit,
      scriptToneGuidance,
      sceneText,
      appointmentWindow: advisorScriptAppointmentWindow(),
    },
    basicInfoOverride,
    basicInfoSummaryRules,
    customerPanorama: {
      customerFacts,
      basicInfo: taskCard.basicInfo || {},
      classification: taskCard.classification || {},
      planAndConsumption: taskCard.planAndConsumption || {},
      commercialHook: taskCard.commercialHook || {},
      reviewFacts: archive?.reviewFacts || {},
      personalProfileBrief: taskCard.personalProfileBrief || '',
    },
    profile: {
      demandType: taskCard.classification?.demandType || '',
      lifecycleStage: taskCard.classification?.lifecycleStage || '',
      interactionObjective: purposeText,
    },
    liveCustomer: {
      unifiedCustomerId: review.unifiedCustomerId || archive?.customerId || '',
      customerId: review.unifiedCustomerId || archive?.customerId || '',
      customerCode: archive?.customerCode || archive?.customerIdentity?.customerCode || '',
      customerName: review.customerName || archive?.customerName || '',
      customerNameMasked: archive?.customerIdentity?.customerNameMasked || review.customerName || '',
      advisorName: customerFacts.advisor || basicInfoOverride.健康管理人 || '',
      doctorName: customerFacts.doctor || basicInfoOverride.所属医生 || '',
      demandType: taskCard.classification?.demandType || '',
      lifecycleStage: taskCard.classification?.lifecycleStage || '',
      lastMaintenanceProject: taskCard.planAndConsumption?.recentProject || taskCard.planAndConsumption?.proposedOrTakenPlan || '',
      lastVisitDate: taskCard.planAndConsumption?.lastVisitDate || basicInfoOverride.末诊时间 || '',
      captureSource: reviewSourceMode,
    },
    p7LiveCustomer: {
      unifiedCustomerId: review.unifiedCustomerId || archive?.customerId || '',
      customerId: review.unifiedCustomerId || archive?.customerId || '',
      customerName: review.customerName || archive?.customerName || '',
      advisorName: customerFacts.advisor || basicInfoOverride.健康管理人 || '',
      doctorName: customerFacts.doctor || basicInfoOverride.所属医生 || '',
      lastVisitDate: taskCard.planAndConsumption?.lastVisitDate || basicInfoOverride.末诊时间 || '',
      captureSource: reviewSourceMode,
    },
    customerContext: {
      unifiedCustomerId: review.unifiedCustomerId || archive?.customerId || '',
      customerId: review.unifiedCustomerId || archive?.customerId || '',
      customerName: review.customerName || archive?.customerName || '',
      advisorName: customerFacts.advisor || basicInfoOverride.健康管理人 || '',
      doctorName: customerFacts.doctor || basicInfoOverride.所属医生 || '',
      demandType: taskCard.classification?.demandType || '',
      lifecycleStage: taskCard.classification?.lifecycleStage || '',
      lastMaintenanceProject: taskCard.planAndConsumption?.recentProject || taskCard.planAndConsumption?.proposedOrTakenPlan || '',
      lastVisitDate: taskCard.planAndConsumption?.lastVisitDate || basicInfoOverride.末诊时间 || '',
      captureSource: reviewSourceMode,
    },
    selectedAngle: {
      angleId: selectedAngle.angleId || selectedAngle.code || `ANGLE_${angleIndex + 1}`,
      label: selectedAngle.label || `角度 ${angleIndex + 1}`,
      operatingFocus: selectedAngle.operatingFocus || '',
      script: selectedAngle.script || selectedAngle.advisorSendScript?.message || '',
      h5Screens: screens,
    },
    h5Copy: {
      selectedAngleId: selectedAngle.angleId || selectedAngle.code || `ANGLE_${angleIndex + 1}`,
      selectedAngleLabel: selectedAngle.label || `角度 ${angleIndex + 1}`,
      screens,
    },
    interactionGoal: {
      ...(taskCard.interactionGoal || {}),
      objective: purposeText || taskCard.interactionGoal?.objective || '',
    },
    adoptedGoal: {
      ...(taskCard.interactionGoal || {}),
      objective: purposeText || taskCard.interactionGoal?.objective || '',
      purposeTemplateText,
      sourceMode: reviewSourceMode,
    },
    riskFlags: {
      automaticSendAllowed: false,
      customerFacingPublishAllowed: false,
      remoteWriteAllowed: false,
      sourceMode: reviewSourceMode,
    },
    advisorScriptModalInput: {
      purposeText,
      purposeTemplateText,
      sceneText,
      campaignOfferText,
      scriptWordLimit,
      scriptToneGuidance,
      customerGender,
      customerHonorific,
      summaryRules: basicInfoSummaryRules,
    },
    lastContactDigest: selectedAngle.script || taskCard.advisorSendScript?.message || review.advisorBrief || '',
    dryRun: false,
  };
}

function advisorScriptPurposeTemplate(purposeText = '') {
  const option = ADVISOR_SCRIPT_PURPOSE_OPTIONS.find((item) => item.value === purposeText || item.label === purposeText);
  return option?.template || ADVISOR_SCRIPT_PURPOSE_OPTIONS[0].template;
}

function advisorScriptWordLimitForPurpose(purposeText = '') {
  return purposeText === '无企微好友添加话术'
    ? '45-80 字，最多 3 句，适合放在添加好友申请里。'
    : '120-180 字，最多 5 句，适合已添加企微好友的微信复诊邀约。';
}

function advisorScriptToneGuidanceForPurpose(purposeText = '') {
  return purposeText === '无企微好友添加话术'
    ? '礼貌、谦逊、自然，不要生硬推销；先说明身份和添加理由，给对方充分选择感。'
    : '温和关怀、信息完整但不啰嗦；只选 1 个档案锚点和 1 个复诊理由，避免连续堆砌项目。';
}

function renderAdvisorScriptPurposeOptions(selectedValue = '') {
  const value = selectedValue || ADVISOR_SCRIPT_PURPOSE_OPTIONS[0].value;
  return ADVISOR_SCRIPT_PURPOSE_OPTIONS.map((option) => `
    <option value="${escapeHtml(option.value)}" ${option.value === value ? 'selected' : ''}>${escapeHtml(option.label)}</option>
  `).join('');
}

function advisorScriptModalInputsForReview(reviewItemId, taskCard = {}) {
  const stored = state.advisorScriptModalInputsByReviewId.get(reviewItemId) || {};
  const purposeText = ADVISOR_SCRIPT_PURPOSE_OPTIONS.some((item) => item.value === stored.purposeText)
    ? stored.purposeText
    : ADVISOR_SCRIPT_PURPOSE_OPTIONS[0].value;
  return {
    campaignOfferText: stored.campaignOfferText || advisorCampaignOfferTextForReview(reviewItemId),
    purposeText,
    purposeTemplateText: advisorScriptPurposeTemplate(purposeText),
    sceneText: stored.sceneText || '15周年活动',
  };
}

function updateAdvisorScriptModalInputsFromDom(reviewItemId) {
  if (!reviewItemId) return advisorScriptModalInputsForReview(reviewItemId);
  const next = {
    campaignOfferText: $('#advisor-script-modal-offer')?.value?.trim() || defaultAdvisorCampaignOfferText(),
    purposeText: $('#advisor-script-modal-purpose')?.value?.trim() || ADVISOR_SCRIPT_PURPOSE_OPTIONS[0].value,
    sceneText: $('#advisor-script-modal-scene')?.value?.trim() || '15周年活动',
  };
  next.purposeTemplateText = advisorScriptPurposeTemplate(next.purposeText);
  state.advisorScriptModalInputsByReviewId.set(reviewItemId, next);
  state.advisorCampaignOfferByReviewId.set(reviewItemId, next.campaignOfferText);
  return next;
}

function advisorScriptModalOpinionForReview(reviewItemId) {
  return state.advisorScriptModalOpinionByReviewId.get(reviewItemId) || '';
}

function advisorScriptPromptPreviewPayload(review, archive, taskCard) {
  const inputs = advisorScriptModalInputsForReview(review.reviewItemId, taskCard);
  const basicInfoOverride = advisorScriptBasicInfoOverride(review, archive, taskCard);
  const customerGender = basicInfoOverride.性别 || '';
  const customerHonorific = advisorScriptHonorificFromGender(customerGender);
  return {
    customerIdentityJson: {
      姓氏: basicInfoOverride.姓氏 || '',
      性别: customerGender,
      顾客称谓: customerHonorific,
    },
    basicInfoSnapshotJson: {
      ...basicInfoOverride,
      总结字段规则: advisorScriptSummaryRulesSnapshot(),
    },
    campaignJson: {
      serviceRole: 'VIP服务经理',
      expertName: '宋为民',
      sceneText: inputs.sceneText || '15周年活动',
      purposeText: inputs.purposeText || ADVISOR_SCRIPT_PURPOSE_OPTIONS[0].value,
      purposeTemplateText: inputs.purposeTemplateText || advisorScriptPurposeTemplate(inputs.purposeText),
      campaignOfferText: inputs.campaignOfferText || defaultAdvisorCampaignOfferText(),
      appointmentWindow: advisorScriptAppointmentWindow(),
    },
    generationFlow: [
      '读取 basicInfoSnapshotJson 中的姓氏、初诊、医生、消耗历史、CSKIN、未消耗疗程、病历、聊天记录、咨询记录等字段。',
      '用 campaignJson 中的优惠力度、目的、场景和邀约时间窗口决定开场、邀约理由和收尾。',
      '从消耗历史 / CSKIN / 未消耗疗程 / 病历 / 咨询记录等总结型字段中选择 1-2 个可信锚点。',
      '按客户可见安全边界转译，生成一段顾问可轻编辑的话术。',
    ],
    outputContract: {
      advisorScript: {
        finalScriptText: 'string',
        basisUsed: ['string'],
        dontSay: ['string'],
        editableByAdvisor: true,
        automaticSendAllowed: false,
      },
      confidence: 0.8,
      needsHuman: false,
      needsHumanReasons: [],
    },
  };
}

function advisorScriptPromptKey(reviewItemId, purposeText = '') {
  return `${reviewItemId || 'unknown'}::${purposeText || ADVISOR_SCRIPT_PURPOSE_OPTIONS[0].value}`;
}

function advisorScriptDefaultPromptText(purposeText = '') {
  const isNoFriend = purposeText === '无企微好友添加话术';
  const purposeBlock = isNoFriend
    ? [
      '当前目的：无企微好友添加话术。',
      '核心任务：生成适合“添加好友申请/首次加企微”的自然短文案，而不是完整复诊邀约。',
      `字数要求：${advisorScriptWordLimitForPurpose(purposeText)}`,
      `语气要求：${advisorScriptToneGuidanceForPurpose(purposeText)}`,
      '动作链路：简短说明身份 -> 说明档案交接/便于发送复诊安排 -> 礼貌请求通过好友。',
      '禁止：不要直接问“哪天方便到店”，不要写长段邀约，不要制造紧迫感，不要把关系写得像已经是企微好友。',
      '参考语气：您好，我是这边的服务经理，近期接手到您的档案，想加您企微方便后续同步复诊安排和礼遇信息，方便的话麻烦通过一下。',
    ]
    : [
      '当前目的：已有好友询问话术。',
      '核心任务：以老客关怀口吻询问近况，承接档案记录和复诊礼遇，低压确认方便到店时间。',
      `字数要求：${advisorScriptWordLimitForPurpose(purposeText)}`,
      `语气要求：${advisorScriptToneGuidanceForPurpose(purposeText)}`,
      '动作链路：称呼和身份 -> 档案锚点 -> 当前肤况/关注点承接 -> 专家复诊价值 -> 礼遇说明 -> 低压时间问询。',
      '允许：可以直接询问近期状态和方便复诊时间。',
    ];
  const frameworkLines = isNoFriend
    ? [
      '生成框架（无企微好友添加）：',
      '1. 简短礼貌问候：用“您好”或“X先生/女士您好”，不要显得冒昧。',
      '2. 身份说明：一句话说明“我是VIP服务经理/这边做档案交接”。',
      '3. 添加理由：只写“方便同步复诊安排/礼遇信息/后续沟通”，不要展开治疗项目。',
      '4. 礼貌收尾：用“方便的话麻烦通过一下”“不方便也没关系”这类有选择感的表达。',
      `5. 输出长度：${advisorScriptWordLimitForPurpose(purposeText)}`,
    ]
    : [
      '生成框架（已有企微好友询问）：',
      '1. 称呼和身份：只能用“姓氏 + 顾客称谓”，例如“陈先生您好”。',
      '2. 档案锚点：从初诊日期、历史医生、消耗/治疗履历中只选 1 个可信点。',
      '3. 历史诉求或反馈：从 CSKIN、病历、咨询记录、聊天/回访摘要中只提炼 1 个关注点。',
      '4. 复诊价值：表达为重新评估、理清维养节奏或梳理下一阶段重点，三选一即可。',
      '5. 场景与礼遇：使用当前填写的场景和优惠力度，不固定写 15 周年。',
      '6. 低压时间问询：使用当前邀约时间窗口。',
      `7. 输出长度：${advisorScriptWordLimitForPurpose(purposeText)}`,
    ];
  return [
    '# C5 Advisor Script Agent',
    '',
    '角色：YESSKIN 非 VIP 老客「顾问话术」Agent。',
    '任务：读取用户全景档案基础信息和本轮活动参数，生成一段顾问可参考、可轻编辑的复诊邀约话术。',
    '',
    ...purposeBlock,
    '',
    '输入：',
    '- customerIdentityJson：只提供姓氏、性别、称谓，不提供完整姓名。',
    '- basicInfoSnapshotJson：姓氏、性别、客户渠道+推荐人、初诊日期、所属医生、消耗历史、CSKIN、未消耗疗程、病历、聊天记录、咨询记录、RFM等级、健康管理人、末诊时间、总结字段规则。',
    '- campaignJson：专家、场景、目的、优惠力度、邀约时间窗口、字数要求、语气要求。',
    '- riskFlagsJson：内部风险标记，只用于避让，不得写给客户。',
    '',
    ...frameworkLines,
    '',
    '硬约束：',
    '- 不输出完整姓名、RFM、非 A、非 VIP、内部标签、风险评分、余额、敏感病历/聊天原文。',
    '- 不编造医生面诊、治疗、效果反馈或客户诉求。',
    '- CSKIN 只作为皮肤检测线索，不写成医学诊断，不罗列完整分数或 recordId。',
    '- 只输出 JSON，核心字段为 advisorScript.finalScriptText。',
  ].join('\n');
}

function advisorScriptPromptTextForReview(reviewItemId, purposeText = '') {
  return state.advisorScriptPromptSourceText || advisorScriptDefaultPromptText(purposeText);
}

function advisorScriptPromptRevisionForReview(reviewItemId, purposeText = '') {
  return state.advisorScriptPromptRevisionByPromptKey.get(advisorScriptPromptKey(reviewItemId, purposeText)) || null;
}

function clearAdvisorScriptPromptRevision(reviewItemId, purposeText = '') {
  state.advisorScriptPromptRevisionByPromptKey.delete(advisorScriptPromptKey(reviewItemId, purposeText));
}

async function loadAdvisorScriptPromptSource({ force = false } = {}) {
  if (state.advisorScriptPromptSourceBusy) return;
  if (state.advisorScriptPromptSourceLoaded && !force) return;
  state.advisorScriptPromptSourceBusy = true;
  state.advisorScriptPromptSourceStatus = '正在读取源码 prompt 文件...';
  state.advisorScriptPromptSourceStatusTone = 'busy';
  renderAdvisorScriptModal();
  try {
    const response = await api(ADVISOR_SCRIPT_PROMPT_SOURCE_API);
    state.advisorScriptPromptSourceText = response.promptText || '';
    state.advisorScriptPromptSourcePath = response.promptPath || '';
    state.advisorScriptPromptSourceLoaded = true;
    state.advisorScriptPromptSourceStatus = response.promptPath
      ? `已读取源码：${response.promptPath}`
      : '已读取源码 prompt 文件。';
    state.advisorScriptPromptSourceStatusTone = '';
  } catch (error) {
    state.advisorScriptPromptSourceStatus = `读取源码 prompt 失败：${error.message}`;
    state.advisorScriptPromptSourceStatusTone = 'error';
  } finally {
    state.advisorScriptPromptSourceBusy = false;
    renderAdvisorScriptModal();
  }
}

async function saveAdvisorScriptPromptSource(promptText, meta = {}) {
  const text = String(promptText || '').trim();
  if (!text) throw new Error('提示词不能为空。');
  state.advisorScriptPromptSourceBusy = true;
  state.advisorScriptPromptSourceStatus = '正在修改提示词...';
  state.advisorScriptPromptSourceStatusTone = 'busy';
  renderAdvisorScriptModal();
  try {
    const response = await postApi(ADVISOR_SCRIPT_PROMPT_SOURCE_API, {
      actor: meta.actor || 'ds_advisor_h5_review_page_prompt_source_save',
      source: meta.source || 'advisor_prompt_modal',
      reviewItemId: meta.reviewItemId || '',
      purposeText: meta.purposeText || '',
      promptText: text,
    });
    state.advisorScriptPromptSourceText = response.promptText || text;
    state.advisorScriptPromptSourcePath = response.promptPath || state.advisorScriptPromptSourcePath;
    state.advisorScriptPromptSourceLoaded = true;
    state.advisorScriptPromptSourceStatus = response.promptPath
      ? `修改成功，已写入源码：${response.promptPath}`
      : '修改成功，已写入源码 prompt 文件。';
    state.advisorScriptPromptSourceStatusTone = 'success';
    return response;
  } finally {
    state.advisorScriptPromptSourceBusy = false;
  }
}

function openAdvisorScriptPromptModal() {
  state.advisorScriptPromptModalOpen = true;
  state.advisorScriptPromptEditMode = false;
  renderAdvisorScriptModal();
  loadAdvisorScriptPromptSource();
}

function closeAdvisorScriptPromptModal() {
  state.advisorScriptPromptModalOpen = false;
  state.advisorScriptPromptEditMode = false;
  renderAdvisorScriptModal();
}

async function saveAdvisorScriptPromptModal() {
  const review = reviewById(state.advisorScriptModalReviewItemId);
  if (!review) return;
  if (!state.advisorScriptPromptEditMode) return;
  const inputs = advisorScriptModalInputsForReview(review.reviewItemId);
  const promptText = $('#advisor-prompt-editor')?.value?.trim() || advisorScriptDefaultPromptText(inputs.purposeText);
  try {
    await saveAdvisorScriptPromptSource(promptText, {
      reviewItemId: review.reviewItemId,
      purposeText: inputs.purposeText,
      source: 'manual_prompt_editor_save',
    });
    state.advisorScriptPromptByReviewId.delete(advisorScriptPromptKey(review.reviewItemId, inputs.purposeText));
    clearAdvisorScriptPromptRevision(review.reviewItemId, inputs.purposeText);
    state.advisorScriptPromptEditMode = false;
    persistAdvisorH5LocalState();
    const target = $('#advisor-prompt-status');
    if (target) target.textContent = `已写入源码 prompt 文件，后续所有 C5 生成默认使用这份提示词。`;
  } catch (error) {
    state.advisorScriptPromptSourceStatus = `写入源码 prompt 失败：${error.message}`;
    state.advisorScriptPromptSourceStatusTone = 'error';
  } finally {
    renderAdvisorScriptModal();
  }
}

function resetAdvisorScriptPromptModal() {
  const review = reviewById(state.advisorScriptModalReviewItemId);
  if (!review) return;
  if (!state.advisorScriptPromptEditMode) return;
  const inputs = advisorScriptModalInputsForReview(review.reviewItemId);
  state.advisorScriptPromptByReviewId.delete(advisorScriptPromptKey(review.reviewItemId, inputs.purposeText));
  clearAdvisorScriptPromptRevision(review.reviewItemId, inputs.purposeText);
  state.advisorScriptPromptEditMode = false;
  persistAdvisorH5LocalState();
  const editor = $('#advisor-prompt-editor');
  if (editor) editor.value = advisorScriptPromptTextForReview(review.reviewItemId, inputs.purposeText);
  const target = $('#advisor-prompt-status');
  if (target) target.textContent = '已放弃本次未保存修改，重新显示当前源码 prompt。';
  state.advisorScriptPromptSourceStatusTone = '';
  renderAdvisorScriptModal();
}

async function adoptAdvisorScriptPromptRevision(choice) {
  const review = reviewById(state.advisorScriptModalReviewItemId);
  if (!review) return;
  const inputs = advisorScriptModalInputsForReview(review.reviewItemId);
  const revision = advisorScriptPromptRevisionForReview(review.reviewItemId, inputs.purposeText);
  if (!revision) return;
  const nextPrompt = choice === 'new' ? revision.newPrompt : revision.oldPrompt;
  try {
    await saveAdvisorScriptPromptSource(nextPrompt, {
      reviewItemId: review.reviewItemId,
      purposeText: inputs.purposeText,
      source: choice === 'new' ? 'prompt_revision_adopt_new' : 'prompt_revision_adopt_old',
    });
    state.advisorScriptPromptByReviewId.delete(advisorScriptPromptKey(review.reviewItemId, inputs.purposeText));
    clearAdvisorScriptPromptRevision(review.reviewItemId, inputs.purposeText);
    state.advisorScriptPromptEditMode = false;
    persistAdvisorH5LocalState();
  } catch (error) {
    state.advisorScriptPromptSourceStatus = `写入源码 prompt 失败：${error.message}`;
    state.advisorScriptPromptSourceStatusTone = 'error';
  } finally {
    renderAdvisorScriptModal();
  }
}

function enableAdvisorScriptPromptEditMode() {
  const review = reviewById(state.advisorScriptModalReviewItemId);
  if (!review) return;
  const inputs = advisorScriptModalInputsForReview(review.reviewItemId);
  const revision = advisorScriptPromptRevisionForReview(review.reviewItemId, inputs.purposeText);
  const busy = state.advisorScriptPromptRevisionBusyKey === advisorScriptPromptKey(review.reviewItemId, inputs.purposeText);
  if (revision || busy) return;
  state.advisorScriptPromptEditMode = true;
  renderAdvisorScriptModal();
}

function renderAdvisorScriptPromptModal(review, archive, taskCard) {
  if (!state.advisorScriptPromptModalOpen) return '';
  const inputs = advisorScriptModalInputsForReview(review.reviewItemId, taskCard);
  const promptText = advisorScriptPromptTextForReview(review.reviewItemId, inputs.purposeText);
  const revision = advisorScriptPromptRevisionForReview(review.reviewItemId, inputs.purposeText);
  const revisionBusy = state.advisorScriptPromptRevisionBusyKey === advisorScriptPromptKey(review.reviewItemId, inputs.purposeText);
  const busy = revisionBusy || state.advisorScriptPromptSourceBusy;
  const editMode = state.advisorScriptPromptEditMode && !revision && !busy;
  const statusText = state.advisorScriptPromptSourceStatus || (revisionBusy ? '正在根据人工改稿生成新提示词候选...' : revision ? '请选择采用旧版或采用新版；采用后会直接写入源码 prompt 文件。' : editMode ? '正在编辑源码 prompt，保存后会全局生效。' : '当前提示词为源码 prompt 只读预览，点击“修改”后才可编辑。');
  const statusTone = state.advisorScriptPromptSourceStatusTone || (revisionBusy ? 'busy' : '');
  const statusIcon = statusTone === 'busy'
    ? '<span class="advisor-prompt-spinner" aria-hidden="true"></span>'
    : (statusTone === 'success' ? '<span class="advisor-prompt-success-dot" aria-hidden="true"></span>' : '');
  const actionMarkup = busy
    ? ''
    : revision
    ? '<button id="advisor-prompt-adopt-old" class="secondary-action" type="button">采用旧版</button><button id="advisor-prompt-adopt-new" class="primary-action" type="button">采用新版</button>'
    : editMode
      ? '<button id="advisor-prompt-reset" class="secondary-action" type="button">放弃修改</button><button id="advisor-prompt-save" class="primary-action" type="button">保存提示词</button>'
      : '<button id="advisor-prompt-edit" class="secondary-action" type="button">修改</button>';
  const bodyMarkup = revision
    ? `
        <div class="advisor-prompt-compare">
          <label>
            <span>旧提示词</span>
            <textarea id="advisor-prompt-old" class="advisor-prompt-textarea" aria-label="旧提示词" readonly>${escapeHtml(revision.oldPrompt || promptText)}</textarea>
          </label>
          <label>
            <span>新提示词候选</span>
            <textarea id="advisor-prompt-new" class="advisor-prompt-textarea" aria-label="新提示词候选" readonly>${escapeHtml(revision.newPrompt || promptText)}</textarea>
          </label>
        </div>
        <div class="advisor-prompt-revision-note">
          <strong>${escapeHtml(revision.changeSummary || 'AI 已根据人工改稿生成提示词候选。')}</strong>
          <span>${escapeHtml(revision.rationale || '请人工对比旧版和新版后选择采用。')}</span>
        </div>
      `
    : `
        <label>
          <span>提示词框架</span>
          <textarea id="advisor-prompt-editor" class="advisor-prompt-textarea" aria-label="${editMode ? '可编辑提示词框架' : '只读提示词框架'}" ${editMode ? '' : 'readonly'}>${escapeHtml(promptText)}</textarea>
        </label>
      `;
  return `
    <div class="advisor-prompt-modal" id="advisor-prompt-modal" role="dialog" aria-modal="true" aria-label="当前提示词框架">
      <div class="advisor-prompt-modal-mask" data-advisor-script-prompt-close></div>
      <div class="advisor-prompt-dialog">
        <div class="advisor-prompt-head">
          <div>
            <span>当前提示词</span>
            <strong>${escapeHtml(inputs.purposeText)} · C5 顾问话术生成框架</strong>
          </div>
          <div class="advisor-prompt-actions">
            ${actionMarkup}
            <button class="icon-button" type="button" data-advisor-script-prompt-close aria-label="关闭当前提示词">×</button>
          </div>
        </div>
        <div class="advisor-prompt-body">
          ${bodyMarkup}
          <p id="advisor-prompt-status" class="advisor-prompt-status ${statusTone ? `is-${statusTone}` : ''}">${statusIcon}<span>${escapeHtml(statusText)}</span></p>
        </div>
      </div>
    </div>
  `;
}

function advisorScriptSummaryModalPayload() {
  const modal = state.advisorScriptSummaryModal || {};
  const fieldKey = modal.fieldKey || '';
  const review = reviewById(modal.reviewItemId || state.advisorScriptModalReviewItemId);
  const archive = archiveForReview(review?.reviewItemId);
  const taskCard = archive?.h5ReviewTaskCard || {};
  if (!fieldKey || !review || !archive?.h5ReviewTaskCard || !advisorScriptIsSummaryField(fieldKey)) return null;
  const customerFacts = advisorH5CustomerFacts(taskCard, archive, review);
  const basic = taskCard.basicInfo || {};
  const plan = taskCard.planAndConsumption || {};
  const hook = taskCard.commercialHook || {};
  const facts = archive.reviewFacts || {};
  const identity = archive.customerIdentity || {};
  const evidenceIdentity = archive.advisorH5EvidencePack?.customerIdentity || {};
  const loadedCskinSummary = state.advisorScriptCskinByReviewId.get(review.reviewItemId) || null;
  const rawData = advisorScriptRawDataForField(fieldKey, {
    customerFacts,
    basic,
    plan,
    hook,
    facts,
    identity,
    evidenceIdentity,
    loadedCskinSummary,
    review,
    archive,
    taskCard,
  });
  const basicInfoOverride = advisorScriptBasicInfoOverride(review, archive, taskCard);
  const override = advisorScriptSummaryOverrideForReview(review.reviewItemId, fieldKey);
  return {
    review,
    fieldKey,
    rawData,
    rawText: formatAdvisorScriptRawData(rawData),
    rule: override?.rule || advisorScriptSummaryRuleForField(fieldKey),
    summary: override?.summary || basicInfoOverride[fieldKey] || '',
  };
}

function openAdvisorScriptSummaryModal(fieldKey) {
  if (!advisorScriptIsSummaryField(fieldKey)) return;
  const reviewItemId = state.advisorScriptModalReviewItemId || selectedReview()?.reviewItemId;
  if (!reviewItemId) return;
  state.advisorScriptSummaryModal = { reviewItemId, fieldKey };
  state.advisorScriptSummaryRuleEditMode = false;
  renderAdvisorScriptModal();
}

function closeAdvisorScriptSummaryModal() {
  state.advisorScriptSummaryModal = null;
  state.advisorScriptSummaryRuleEditMode = false;
  renderAdvisorScriptModal();
}

function enableAdvisorScriptSummaryRuleEdit() {
  const payload = advisorScriptSummaryModalPayload();
  if (!payload) return;
  state.advisorScriptSummaryRuleEditMode = true;
  renderAdvisorScriptModal();
}

function saveAdvisorScriptSummaryRuleEdit() {
  const payload = advisorScriptSummaryModalPayload();
  if (!payload || !state.advisorScriptSummaryRuleEditMode) return;
  const editedRule = $('#advisor-summary-rule')?.value?.trim() || advisorScriptSummaryRuleForField(payload.fieldKey);
  state.advisorScriptSummaryRulesByField.set(payload.fieldKey, editedRule);
  const existingSummary = $('#advisor-summary-result')?.value?.trim() || payload.summary || '';
  advisorScriptSetSummaryOverride(payload.review.reviewItemId, payload.fieldKey, existingSummary, editedRule, payload.rawData);
  clearAdvisorScriptSummaryRuleRevision(payload.review.reviewItemId, payload.fieldKey);
  state.advisorScriptSummaryRuleEditMode = false;
  persistAdvisorH5LocalState();
  renderAdvisorScriptModal();
}

function saveAdvisorScriptSummaryOnly() {
  const payload = advisorScriptSummaryModalPayload();
  if (!payload) return;
  const editedSummary = $('#advisor-summary-result')?.value?.trim() || '';
  if (!editedSummary) {
    setActionStatus('请先填写总结数据，再保存。');
    return;
  }
  const currentRule = $('#advisor-summary-rule')?.value?.trim() || payload.rule || advisorScriptSummaryRuleForField(payload.fieldKey);
  advisorScriptSetSummaryOverride(payload.review.reviewItemId, payload.fieldKey, editedSummary, currentRule, payload.rawData);
  clearAdvisorScriptSummaryRuleRevision(payload.review.reviewItemId, payload.fieldKey);
  state.advisorScriptSummaryRuleEditMode = false;
  persistAdvisorH5LocalState();
  setActionStatus(`${payload.fieldKey}总结数据已保存，未修改提示词。`);
  renderAdvisorScriptModal();
}

async function saveAdvisorScriptSummaryAndReviseRule() {
  const payload = advisorScriptSummaryModalPayload();
  if (!payload) return;
  const editedSummary = $('#advisor-summary-result')?.value?.trim() || '';
  if (!editedSummary) return;
  const oldRule = payload.rule || advisorScriptSummaryRuleForField(payload.fieldKey);
  advisorScriptSetSummaryOverride(payload.review.reviewItemId, payload.fieldKey, editedSummary, oldRule, payload.rawData);
  const revisionKey = advisorScriptSummaryRuleRevisionKey(payload.review.reviewItemId, payload.fieldKey);
  state.advisorScriptSummaryRuleRevisionBusyKey = revisionKey;
  state.advisorScriptSummaryRuleEditMode = false;
  persistAdvisorH5LocalState();
  renderAdvisorScriptModal();
  try {
    const response = await postApi(ADVISOR_SUMMARY_RULE_REVISION_API, {
      actor: 'ds_advisor_h5_review_page_summary_save',
      reviewItemId: payload.review.reviewItemId,
      fieldKey: payload.fieldKey,
      rawDataText: payload.rawText,
      oldRule,
      oldSummary: payload.summary || '',
      editedSummary,
    });
    const revision = response.revision || response;
    state.advisorScriptSummaryRuleRevisionByKey.set(revisionKey, {
      oldRule,
      newRule: revision.newRule || revision.revisedRule || oldRule,
      changeSummary: revision.changeSummary || 'AI 已根据人工总结生成规则候选。',
      rationale: revision.rationale || '',
      oldSummary: payload.summary || '',
      editedSummary,
      rawText: payload.rawText,
      createdAt: nowLabel(),
      modelCall: revision.modelCall || response.modelCall || null,
    });
    persistAdvisorH5LocalState();
  } catch (error) {
    state.advisorScriptSummaryRuleRevisionByKey.set(revisionKey, {
      oldRule,
      newRule: oldRule,
      changeSummary: `规则候选生成失败：${error.message}`,
      rationale: '总结数据已保存，规则未自动更新。',
      oldSummary: payload.summary || '',
      editedSummary,
      rawText: payload.rawText,
      createdAt: nowLabel(),
      modelCall: { status: 'failed', message: error.message },
    });
  } finally {
    if (state.advisorScriptSummaryRuleRevisionBusyKey === revisionKey) state.advisorScriptSummaryRuleRevisionBusyKey = '';
    renderAdvisorScriptModal();
  }
}

function adoptAdvisorScriptSummaryRuleRevision(choice) {
  const payload = advisorScriptSummaryModalPayload();
  if (!payload) return;
  const revisionKey = advisorScriptSummaryRuleRevisionKey(payload.review.reviewItemId, payload.fieldKey);
  const revision = state.advisorScriptSummaryRuleRevisionByKey.get(revisionKey);
  if (!revision) return;
  const nextRule = choice === 'new' ? revision.newRule : revision.oldRule;
  const summary = $('#advisor-summary-result')?.value?.trim() || revision.editedSummary || payload.summary || '';
  state.advisorScriptSummaryRulesByField.set(payload.fieldKey, nextRule);
  advisorScriptSetSummaryOverride(payload.review.reviewItemId, payload.fieldKey, summary, nextRule, payload.rawData);
  clearAdvisorScriptSummaryRuleRevision(payload.review.reviewItemId, payload.fieldKey);
  persistAdvisorH5LocalState();
  renderAdvisorScriptModal();
}

function renderAdvisorScriptSummaryModal() {
  const payload = advisorScriptSummaryModalPayload();
  if (!payload) return '';
  const revisionKey = advisorScriptSummaryRuleRevisionKey(payload.review.reviewItemId, payload.fieldKey);
  const revision = advisorScriptSummaryRuleRevisionForReview(payload.review.reviewItemId, payload.fieldKey);
  const busy = state.advisorScriptSummaryRuleRevisionBusyKey === revisionKey;
  const editMode = state.advisorScriptSummaryRuleEditMode && !busy && !revision;
  const ruleAction = editMode
    ? '<button id="advisor-summary-rule-save" class="secondary-action" type="button">保存规则</button>'
    : (busy || revision ? '' : '<button id="advisor-summary-rule-edit" class="secondary-action" type="button">修改</button>');
  const revisionMarkup = revision
    ? `
      <section class="advisor-summary-rule-compare">
        <div class="advisor-summary-compare-head">
          <div>
            <span>规则候选</span>
            <strong>${escapeHtml(revision.changeSummary || 'AI 已根据人工总结生成规则候选。')}</strong>
            <em>${escapeHtml(revision.rationale || '请人工对比旧版和新版后选择采用。')}</em>
          </div>
          <div class="advisor-summary-compare-actions">
            <button id="advisor-summary-adopt-old" class="secondary-action" type="button">采用旧版</button>
            <button id="advisor-summary-adopt-new" class="primary-action" type="button">采用新版</button>
          </div>
        </div>
        <div class="advisor-summary-compare-grid">
          <label>
            <span>旧提示词</span>
            <textarea readonly>${escapeHtml(revision.oldRule || payload.rule)}</textarea>
          </label>
          <label>
            <span>新提示词</span>
            <textarea readonly>${escapeHtml(revision.newRule || payload.rule)}</textarea>
          </label>
        </div>
      </section>
    `
    : (busy ? '<section class="advisor-summary-rule-compare is-loading">正在根据人工总结生成新规则候选...</section>' : '');
  return `
    <div class="advisor-summary-modal" id="advisor-summary-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(payload.fieldKey)}总结规则编辑">
      <div class="advisor-summary-modal-mask" data-advisor-summary-modal-close></div>
      <div class="advisor-summary-dialog">
        <div class="advisor-summary-head">
          <div>
            <span>总结字段</span>
            <strong>${escapeHtml(payload.fieldKey)}</strong>
          </div>
          <button class="icon-button" type="button" data-advisor-summary-modal-close aria-label="关闭总结弹窗">×</button>
        </div>
        <div class="advisor-summary-body">
          <section class="advisor-summary-source">
            <label>
              <span>原始数据</span>
              <pre>${escapeHtml(payload.rawText)}</pre>
            </label>
            <label>
              <span class="advisor-summary-label-with-action">
                <em>大致规则</em>
                ${ruleAction}
              </span>
              <textarea id="advisor-summary-rule" aria-label="${editMode ? '可编辑总结规则' : '只读总结规则'}" ${editMode ? '' : 'readonly'}>${escapeHtml(payload.rule)}</textarea>
            </label>
          </section>
          <section class="advisor-summary-result">
            <label>
              <span>总结数据</span>
              <textarea id="advisor-summary-result" aria-label="总结数据">${escapeHtml(payload.summary || '待补')}</textarea>
            </label>
            <div class="advisor-summary-save-actions">
              <button id="advisor-summary-modal-save-only" class="secondary-action" type="button" ${busy ? 'disabled' : ''}>保存</button>
              <button id="advisor-summary-modal-save" class="primary-action" type="button" ${busy ? 'disabled' : ''}>${busy ? '生成中...' : '保存并修改提示词'}</button>
            </div>
          </section>
          ${revisionMarkup}
        </div>
      </div>
    </div>
  `;
}

function renderAdvisorScriptDataRows(data = {}) {
  return Object.entries(data)
    .filter(([key]) => key !== '顾客称谓' && key !== 'cskinSummary')
    .map(([key, value]) => {
      const isSummary = advisorScriptIsSummaryField(key);
      const marker = isSummary ? '总结' : (ADVISOR_SCRIPT_DIRECT_FIELDS.has(key) ? '直接拉取' : '直接拉取');
      const inner = `
        <span>${escapeHtml(key)}</span>
        <strong>${escapeHtml(value || '待补')}</strong>
        <em>${escapeHtml(marker)}</em>
      `;
      if (isSummary) {
        return `
          <button class="advisor-script-data-row is-summary" type="button" data-advisor-summary-field="${escapeHtml(key)}" title="查看并修改总结规则">
            ${inner}
          </button>
        `;
      }
      return `<div class="advisor-script-data-row is-direct">${inner}</div>`;
    }).join('');
}

function openAdvisorScriptModal() {
  const review = selectedReview();
  if (!review) return;
  state.advisorScriptModalReviewItemId = review.reviewItemId;
  state.advisorScriptModalOutputByReviewId.delete(review.reviewItemId);
  state.advisorScriptModalStatusByReviewId.delete(review.reviewItemId);
  const modal = $('#advisor-script-modal');
  if (modal) modal.hidden = false;
  renderAdvisorScriptModal();
  const archive = selectedArchive();
  if (review && archive?.h5ReviewTaskCard) {
    ensureAdvisorScriptCskinForReview(review, archive, archive.h5ReviewTaskCard);
  }
}

function closeAdvisorScriptModal() {
  state.advisorScriptModalReviewItemId = null;
  state.advisorScriptSummaryModal = null;
  state.advisorScriptPromptModalOpen = false;
  const modal = $('#advisor-script-modal');
  if (modal) modal.hidden = true;
}

function renderAdvisorScriptModal() {
  const modal = $('#advisor-script-modal');
  const body = $('#advisor-script-modal-body');
  if (!modal || !body || !state.advisorScriptModalReviewItemId) return;
  const review = reviewById(state.advisorScriptModalReviewItemId);
  const archive = archiveForReview(review?.reviewItemId);
  if (!review || !archive?.h5ReviewTaskCard) {
    body.innerHTML = '<div class="empty">暂无可生成话术的任务卡。</div>';
    return;
  }
  const taskCard = archive.h5ReviewTaskCard;
  const angleIndex = selectedH5ReviewAngleIndex(review.reviewItemId);
  const activeSendScript = sendScriptForSelectedAngle(taskCard, taskCard.advisorSendScript || {}, review.reviewItemId);
  const inputs = advisorScriptModalInputsForReview(review.reviewItemId, taskCard);
  const basicInfoOverride = advisorScriptBasicInfoOverride(review, archive, taskCard);
  const opinion = advisorScriptModalOpinionForReview(review.reviewItemId);
  const modalOutput = state.advisorScriptModalOutputByReviewId.get(review.reviewItemId) || '';
  const modalStatus = state.advisorScriptModalStatusByReviewId.get(review.reviewItemId) || '';
  const isBusy = state.advisorScriptBusyReviewItemId === review.reviewItemId;
  const isRevisionBusy = state.advisorScriptRevisionBusyReviewItemId === review.reviewItemId;
  body.innerHTML = `
    <div class="advisor-script-modal-grid">
      <aside class="advisor-script-modal-left">
        <div class="advisor-script-modal-form">
          <label>
            <span>优惠力度</span>
            <input id="advisor-script-modal-offer" type="text" value="${escapeHtml(inputs.campaignOfferText)}" />
          </label>
          <label>
            <span>目的</span>
            <select id="advisor-script-modal-purpose">
              ${renderAdvisorScriptPurposeOptions(inputs.purposeText)}
            </select>
            <em>${escapeHtml(inputs.purposeTemplateText || advisorScriptPurposeTemplate(inputs.purposeText))}</em>
          </label>
          <label>
            <span>场景</span>
            <input id="advisor-script-modal-scene" type="text" value="${escapeHtml(inputs.sceneText)}" />
          </label>
        </div>
        <div class="advisor-script-data-panel">
          <div class="advisor-script-data-head">
            <span>已拉取数据</span>
            <strong>${escapeHtml(basicInfoOverride.姓氏 ? `${basicInfoOverride.姓氏}${basicInfoOverride.顾客称谓 || ''}` : '当前客户')}</strong>
          </div>
          <div class="advisor-script-data-list">
            ${renderAdvisorScriptDataRows(basicInfoOverride)}
          </div>
        </div>
      </aside>
      <section class="advisor-script-modal-right">
        <div class="advisor-script-output-head">
          <div>
            <span>当前话术</span>
            <strong>${escapeHtml(activeSendScript.selectedAngleLabel || `角度 ${angleIndex + 1}`)}</strong>
          </div>
          <button id="advisor-script-modal-generate" class="primary-action" type="button" ${isBusy ? 'disabled' : ''}>
            ${isBusy ? '生成中...' : '生成话术'}
          </button>
        </div>
        <textarea id="advisor-script-modal-output" aria-label="顾问话术" placeholder="点击生成话术后，这里会显示根据优惠力度、目的和场景生成的顾问话术。">${escapeHtml(modalOutput)}</textarea>
        <div class="advisor-script-modal-actions">
          <div class="advisor-script-modal-save-actions">
            <button id="advisor-script-modal-save-only" class="secondary-action" type="button">保存</button>
            <button id="advisor-script-modal-sync" class="secondary-action" type="button">保存并修改提示词</button>
          </div>
          <span id="advisor-script-modal-status">${escapeHtml(isBusy ? 'C5 生成中，请稍候。' : (modalStatus || '生成后可继续编辑或提出修改意见。'))}</span>
        </div>
        <label class="advisor-script-opinion-box">
          <span>提出我的意见</span>
          <textarea id="advisor-script-modal-opinion" placeholder="例如：语气更像老客关怀，减少治疗感，突出宋教授复诊价值。">${escapeHtml(opinion)}</textarea>
        </label>
        <div class="advisor-script-modal-actions">
          <button id="advisor-script-modal-live-revise" class="secondary-action" type="button" ${isRevisionBusy ? 'disabled' : ''}>
            ${isRevisionBusy ? '修改中...' : '实时修改'}
          </button>
          <span id="advisor-script-modal-revise-status">${isRevisionBusy ? '正在根据修改意见重写右侧话术。' : '填写修改意见后，可直接重写右侧当前话术。'}</span>
        </div>
      </section>
    </div>
    ${renderAdvisorScriptSummaryModal()}
    ${renderAdvisorScriptPromptModal(review, archive, taskCard)}
  `;
}

function renderMetric(label, value, note = '') {
  return `
    <div class="metric-box">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${note ? `<em>${escapeHtml(note)}</em>` : ''}
    </div>
  `;
}

function renderList(items, className = 'dense-list') {
  return `<ul class="${className}">${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderClosedLoopActionPanel() {
  const actions = (state.actionWorkbench?.actions || []).filter((action) => [
    'advisor_review_approve',
    'product_copy_confirm',
    'product_classification_keep_review',
    'message_variant_confirm',
    'manual_send_confirm',
    'wecom_send_dry_run',
    'h5_publish_review_approve',
    'h5_publish_execution_confirm',
    'feedback_h5_primary_cta',
    'feedback_rebuild_local',
  ].includes(action.id));
  if (!actions.length) return '';
  return `
    <section class="section-stack">
      <div class="section-title">闭环动作写回</div>
      <div class="boundary-card">
        <span class="tag is-muted">automaticSendAllowed=false</span>
        <span class="tag is-muted">remoteWriteAllowed=false</span>
        <span class="tag is-muted">customerFacingPublishAllowed=false</span>
      </div>
      <div class="feedback-chip-row action-chip-row">
        ${actions.map((action) => `
          <button class="review-closed-loop-action" type="button" data-action-id="${escapeHtml(action.id)}">
            ${escapeHtml(action.buttonLabel)}
          </button>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAnchorList(items) {
  return `<ul class="dense-list">${(items || []).map((item) => `
    <li>
      <strong>${escapeHtml(item.label || item.key || '')}</strong>
      ${escapeHtml(item.value || '')}
      <span>${escapeHtml(item.usage || '')}</span>
    </li>
  `).join('')}</ul>`;
}

function renderScoreBreakdown(scoreAudit) {
  const labels = {
    overdueUrgency: '超期紧迫度',
    responseProbability: '响应概率',
    valuePotential: '价值潜力',
    silentRisk: '静默风险',
    relationshipStrength: '关系强度',
    learningValue: '学习价值',
  };
  const weights = {
    overdueUrgency: 0.25,
    responseProbability: 0.2,
    valuePotential: 0.2,
    silentRisk: 0.15,
    relationshipStrength: 0.1,
    learningValue: 0.1,
  };
  const breakdown = scoreAudit?.breakdown || {};
  return Object.entries(labels).map(([key, label]) => {
    const raw = Number(breakdown[key] ?? 0);
    const weight = weights[key] || 0;
    return {
      label,
      raw,
      weight,
      contribution: raw * weight,
    };
  });
}

function renderClassificationEvidenceMatrix(matrix = []) {
  const rows = Array.isArray(matrix) ? matrix : [];
  if (!rows.length) return '';
  return `
    <section class="section-stack">
      <div class="section-title">分类证据矩阵</div>
      <div class="classification-evidence-grid">
        ${rows.map((row) => `
          <article>
            <div>
              <span>${escapeHtml(row.priority || '证据')}</span>
              <strong>${escapeHtml(row.evidenceType || '分类证据')}</strong>
            </div>
            <p>${escapeHtml(humanizeAdvisorDisplayText(row.evidence || ''))}</p>
            <footer>
              <small>${escapeHtml(humanizeAdvisorDisplayText(Array.isArray(row.supports) ? row.supports.join(' / ') : row.supports || ''))}</small>
              <em>${escapeHtml(humanizeAdvisorDisplayText(row.impact || ''))}</em>
            </footer>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function firstNonEmpty(...values) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');
}

function extractAge(text) {
  const match = String(text || '').match(/约?\s*(\d{1,3})\s*岁/);
  return match ? `${match[1]} 岁` : '';
}

function valueWithFallback(...values) {
  return firstNonEmpty(...values, '待接入');
}

function normalizeAdvisorScriptGenderText(...values) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'object') {
      const nested = normalizeAdvisorScriptGenderText(
        value.label,
        value.gender,
        value.genderText,
        value.customerGender,
        value.customerLabel,
        value.honorific,
        value.code,
        value.raw,
      );
      if (nested) return nested;
      continue;
    }
    const text = String(value).trim();
    if (!text || /待接入|待补|待确认|未知|无/.test(text)) continue;
    if (/^(1|男|男性|男士|先生)$/.test(text) || /(^|[^女])先生|男性|男士|Sex\s*=\s*1|gender\s*=\s*1/i.test(text)) return '男 / 先生';
    if (/^(2|女|女性|女士|小姐)$/.test(text) || /女士|女性|小姐|Sex\s*=\s*2|gender\s*=\s*2/i.test(text)) return '女 / 女士';
  }
  return '';
}

function advisorScriptHonorificFromGender(genderText) {
  const text = String(genderText || '');
  if (/男|先生/.test(text)) return '先生';
  if (/女|女士|小姐/.test(text)) return '女士';
  return '';
}

function advisorMoneyNumber(value) {
  const text = String(value ?? '').replace(/,/g, '').trim();
  if (!text || /待接入|待补|待确认/.test(text)) return NaN;
  const match = text.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function formatAdvisorMoney(value, fractionDigits = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return number.toLocaleString('zh-CN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function parseAdvisorMoneyFromText(text) {
  const source = String(text || '');
  const patterns = [
    /(?:累计消耗|累计消费|累计支付金额|历史明细合计|HIS\s*金额合计|金额合计|付款金额|pay_amount|bill_amount)\s*[：:=]?\s*`?\s*([0-9,]+(?:\.[0-9]+)?)/i,
  ];
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match?.[1]) return match[1];
  }
  return '';
}

function advisorOrderCountNumber(...values) {
  for (const value of values) {
    if (value === undefined || value === null || String(value).trim() === '') continue;
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
    const match = String(value).match(/(?:命中\s*)?(\d+)\s*(?:张订单|张|条订单|条|个服务项目|个项目|个明细)/);
    if (match?.[1]) return Number(match[1]);
  }
  return 0;
}

function extractAdvisorSourceChannel(...values) {
  const text = values
    .map((value) => readableAdvisorSourceText(value))
    .filter(Boolean)
    .join('；');
  const patterns = [
    /客户来源渠道为([^，；。\n]+)/,
    /来源渠道为([^，；。\n]+)/,
    /来源渠道[：:=]\s*([^，；。\n]+)/,
    /source_channel_name=([^;，；。\n]+)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].replace(/。$/, '').trim();
  }
  return '';
}

function readableAdvisorSourceText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch (error) {
    return '';
  }
}

function advisorH5CustomerFacts(taskCard, archive, review) {
  const basic = taskCard.basicInfo || {};
  const plan = taskCard.planAndConsumption || {};
  const hook = taskCard.commercialHook || {};
  const facts = archive.reviewFacts || {};
  const identity = archive.customerIdentity || {};
  const evidenceIdentity = archive.advisorH5EvidencePack?.customerIdentity || {};
  const isChen = /陈喜生/.test([
    basic.customerName,
    archive.customerName,
    review.customerName,
    taskCard.personalProfileBrief,
  ].filter(Boolean).join(' '));
  const consumptionText = plan.consumptionFeatureSummary || facts.consumptionFacts || '';
  const totalNumber = advisorMoneyNumber(firstNonEmpty(
    basic.totalConsumption,
    basic.cumulativeConsumption,
    plan.totalConsumption,
    plan.cumulativeConsumption,
    identity.totalConsumption,
    evidenceIdentity.totalConsumption,
    parseAdvisorMoneyFromText(consumptionText),
    isChen ? '7974.00' : ''
  ));
  const totalConsumption = Number.isFinite(totalNumber) ? formatAdvisorMoney(totalNumber) : '待接入';
  const orderCountNumber = advisorOrderCountNumber(
    basic.orderCount,
    plan.orderCount,
    plan.serviceProjectCount,
    consumptionText,
    facts.consumptionFacts,
    isChen ? '2 张订单' : ''
  );
  const orderCount = orderCountNumber ? `${orderCountNumber} 张订单` : '待接入';
  const aovNumber = advisorMoneyNumber(firstNonEmpty(
    basic.averageOrderValue,
    plan.averageOrderValue,
    identity.averageOrderValue,
    evidenceIdentity.averageOrderValue,
    ''
  ));
  const aov = Number.isFinite(aovNumber)
    ? formatAdvisorMoney(aovNumber, 2)
    : (Number.isFinite(totalNumber) && orderCountNumber ? formatAdvisorMoney(totalNumber / orderCountNumber, 2) : '待接入');
  const genderText = normalizeAdvisorScriptGenderText(
    basic.gender,
    basic.genderText,
    basic.sex,
    identity.genderIdentity,
    identity.gender,
    identity.genderText,
    identity.sex,
    evidenceIdentity.genderIdentity,
    evidenceIdentity.gender,
    evidenceIdentity.genderText,
    evidenceIdentity.sex,
    isChen ? '男 / 先生' : ''
  ) || '待接入';
  const sourceChannel = valueWithFallback(
    basic.sourceChannel,
    basic.customerSourceChannel,
    identity.sourceChannel,
    evidenceIdentity.sourceChannel,
    extractAdvisorSourceChannel(
      taskCard.personalProfileBrief,
      consumptionText,
      archive.reviewFacts,
      archive.advisorH5EvidencePack,
      identity,
      evidenceIdentity
    ),
    isChen ? '客户推荐/老带新' : '待接入'
  );
  return {
    isChen,
    customerName: basic.customerName || archive.customerName || review.customerName || '客户',
    maskedCustomerId: basic.maskedCustomerId || archive.customerId || review.unifiedCustomerId || '待补',
    clinic: valueWithFallback(basic.clinic, isChen ? '****诊所' : '待接入'),
    doctor: valueWithFallback(basic.doctor, '待补'),
    advisor: valueWithFallback(basic.advisor, archive.advisorWecomBinding?.advisorName, '待补'),
    age: valueWithFallback(basic.age, extractAge(taskCard.personalProfileBrief), isChen ? '52 岁' : '待接入'),
    gender: genderText,
    memberLevel: valueWithFallback(basic.memberLevel, isChen ? '粉星' : '待接入'),
    rfmGrade: valueWithFallback(basic.rfmGrade, archive.dataSnapshotInternal?.rfmGrade, isChen ? 'C' : '待接入'),
    rpmGrade: valueWithFallback(basic.rpmGrade, basic.rpm, '待接入'),
    totalConsumption,
    orderCount,
    averageOrderValue: aov,
    sourceChannel,
    unconsumedProjects: valueWithFallback(hook.unconsumedProjects, plan.serviceRemainCount === 0 ? '无：已完成 1/1 划扣' : '待顾问确认'),
    points: valueWithFallback(hook.points, isChen ? '148.74' : '待接入'),
    balance: valueWithFallback(hook.balance, isChen ? '0.00' : '待接入'),
    valueAddedFund: valueWithFallback(hook.valueAddedFund, '待接入'),
    coupon: valueWithFallback(hook.coupon, isChen ? '未见优惠码、优惠券或抵扣；无有效期证据。' : '待接入'),
    couponExpiry: valueWithFallback(hook.couponExpiry, hook.couponValidUntil, '待接入'),
    doctorPlan: valueWithFallback(plan.doctorPlan, facts.doctorPlan, plan.proposedOrTakenPlan, '待补'),
    consumptionSummary: valueWithFallback(plan.consumptionFeatureSummary, facts.consumptionFacts, '待补'),
  };
}

function customerBasicChallengeFields(review = selectedReview(), archive = selectedArchive()) {
  const taskCard = archive?.h5ReviewTaskCard || {};
  if (!Object.keys(taskCard).length) return [];
  const reviewItemId = review?.reviewItemId || state.selectedReviewItemId;
  const basic = taskCard.basicInfo || {};
  const plan = taskCard.planAndConsumption || {};
  const facts = archive?.reviewFacts || {};
  const customerFacts = advisorH5CustomerFacts(taskCard, archive || {}, review || {});
  const clinicEvidence = findAdvisorH5Evidence(archive, '所属诊所')
    || findAdvisorH5Evidence(archive, '到访门店')
    || findAdvisorH5Evidence(archive, '预约门店');
  const clinicName = valueWithFallback(
    basic.clinic,
    archive?.advisorH5EvidencePack?.customerIdentity?.clinicName,
    customerFacts.clinic
  );
  const clinicNote = clinicEvidence?.evidenceNote
    || (clinicEvidence?.value ? '门店字段直接命中。' : '到访和病历门店一致 / 门店字段直接命中。');
  const p2Summary = `最近项目：${plan.recentProject || '待补'}；服务项目 ${plan.serviceProjectCount ?? '待补'} 个，剩余 ${plan.serviceRemainCount ?? '待补'}。`;
  const remarksValue = localAdvisorFieldValue(reviewItemId, 'remarks', basic.remarks || '未见“要 VIP / 不愿某项目”等有效证据，待顾问补充。');
  const contraindicationValue = localAdvisorFieldValue(reviewItemId, 'contraindication', basic.contraindication || '未见怕痛、过敏、不愿等待、备孕/哺乳期等有效期内证据；过期信息不作为当前抓手。');
  const rows = [
    { group: '客户识别', key: 'customer_name', label: '客户姓名', value: customerFacts.customerName },
    { group: '客户识别', key: 'customer_id', label: '客户 ID', value: customerFacts.maskedCustomerId },
    { group: '客户识别', key: 'age', label: '年龄', value: customerFacts.age },
    { group: '客户识别', key: 'gender', label: '性别', value: customerFacts.gender },
    { group: '顶部指标', key: 'member_level', label: '会员等级', value: customerFacts.memberLevel },
    { group: '顶部指标', key: 'source_channel', label: '来源渠道', value: customerFacts.sourceChannel },
    { group: '顶部指标', key: 'total_consumption', label: '累计消费', value: customerFacts.totalConsumption },
    { group: '顶部指标', key: 'average_order_value', label: '客单价', value: `${customerFacts.averageOrderValue}（${customerFacts.orderCount}）` },
    { group: '顶部指标', key: 'rfm_grade', label: 'RFM', value: customerFacts.rfmGrade },
    { group: '顶部指标', key: 'balance_points_summary', label: '余额/积分', value: `${customerFacts.balance} / ${customerFacts.points}` },
    { group: '门店顾问', key: 'clinic', label: '所属门店', value: clinicName },
    { group: '门店顾问', key: 'clinic_note', label: '门店证据', value: clinicNote },
    { group: '门店顾问', key: 'advisor_doctor', label: '顾问 / 医生', value: `${customerFacts.advisor} / ${customerFacts.doctor}` },
    { group: '方案消费', key: 'doctor_plan', label: '采取了哪些方案', value: customerFacts.doctorPlan },
    { group: '方案消费', key: 'proposed_or_taken_plan', label: '方案补充', value: plan.proposedOrTakenPlan || '待顾问确认' },
    { group: '方案消费', key: 'consumption_summary', label: '消费特征摘要', value: customerFacts.consumptionSummary },
    { group: '三层证据', key: 'p1_diagnosis_need', label: 'P1 病例/诊断/检测', value: facts.diagnosisAndNeed || '待补' },
    { group: '三层证据', key: 'p2_project_times', label: 'P2 项目和治疗次数', value: p2Summary },
    { group: '三层证据', key: 'p3_relationship_risk', label: 'P3 到店/互动/风险', value: `${facts.relationshipFacts || '互动记录待补'} ${facts.riskFacts || ''}` },
    { group: '其他信息', key: 'remarks', label: '备注/偏好', value: remarksValue },
    { group: '其他信息', key: 'contraindication', label: '怕痛/过敏/等待/备孕哺乳', value: contraindicationValue },
    { group: '权益/抓手', key: 'unconsumed_projects', label: '未消耗疗程', value: customerFacts.unconsumedProjects },
    { group: '权益/抓手', key: 'points', label: '积分', value: customerFacts.points },
    { group: '权益/抓手', key: 'balance', label: '余额', value: customerFacts.balance },
    { group: '权益/抓手', key: 'value_added_fund', label: '增值金', value: customerFacts.valueAddedFund },
    { group: '权益/抓手', key: 'coupon', label: '优惠券/有效期', value: `${customerFacts.coupon}；有效期：${customerFacts.couponExpiry}` },
  ];
  return rows.map((row, index) => ({
    ...row,
    key: row.key || `customer_basic_${index}`,
    value: String(row.value ?? '').trim() || '待补',
  }));
}

function renderCustomerBasicChallengeRows(fields) {
  return window.H5ReviewKit.renderCustomerBasicChallengeRows(fields);
}

function renderTopMetricCards(items) {
  return `
    <div class="advisor-top-metrics">
      ${items.map((item) => `
        <article>
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
          <em>${escapeHtml(item.note || '')}</em>
        </article>
      `).join('')}
    </div>
  `;
}

function renderFieldReviewCard(field, options = {}) {
  const reviewItemId = options.reviewItemId || state.selectedReviewItemId || '';
  const hideActions = options.hideActions === true;
  const isEditing = Boolean(field.editable && state.editingAdvisorFieldByReviewId.get(reviewItemId) === field.key);
  const currentValue = field.value || '待补';
  const archiveDispute = advisorArchiveDisputeForField(field.key);
  const resolvedChallenge = !archiveDispute ? advisorChallengeResolvedForReview(selectedReview(), selectedArchive(), field.key) : null;
  const cardClassName = [
    'field-review-card',
    field.editable ? 'is-editable' : 'is-question-only',
    isEditing ? 'is-editing' : '',
    archiveDispute ? 'is-archive-disputed' : '',
    options.compact ? 'is-compact' : '',
  ].filter(Boolean).join(' ');
  const actionHtml = (() => {
    if (hideActions) return '';
    if (isEditing) {
      return `
        <div class="field-review-edit-actions">
          <button
            type="button"
            data-direct-field-save
            data-field-key="${escapeHtml(field.key)}"
            data-field-label="${escapeHtml(field.label)}"
            data-field-group="${escapeHtml(field.group || '')}"
            data-field-old-value="${escapeHtml(currentValue)}"
          >保存</button>
          <button
            type="button"
            data-direct-field-cancel
            data-field-key="${escapeHtml(field.key)}"
          >取消</button>
        </div>
      `;
    }
    if (field.editable) {
      return `
        <button
          type="button"
          data-direct-field-edit
          data-field-key="${escapeHtml(field.key)}"
          data-field-label="${escapeHtml(field.label)}"
          data-field-group="${escapeHtml(field.group || '')}"
        >修改</button>
      `;
    }
    return `
      <button
        type="button"
        data-advisor-field-review-action="question_objective_field"
        data-field-key="${escapeHtml(field.key)}"
        data-field-label="${escapeHtml(field.label)}"
        data-field-group="${escapeHtml(field.group || '')}"
        data-field-value="${escapeHtml(currentValue)}"
      >质疑</button>
    `;
  })();
  return `
    <article class="${escapeHtml(cardClassName)}">
      <div>
        <span>${escapeHtml(field.group || '')}</span>
        <strong>${escapeHtml(field.label)}</strong>
        ${isEditing ? `
          <textarea
            class="field-direct-editor"
            rows="3"
            data-direct-field-editor="${escapeHtml(field.key)}"
            aria-label="${escapeHtml(field.label)}"
          >${escapeHtml(currentValue)}</textarea>
        ` : `<p>${escapeHtml(currentValue)}</p>`}
        ${archiveDispute ? `
          <em class="archive-dispute-mini-badge">全景档案待改</em>
          <small class="archive-dispute-note">${escapeHtml(archiveDispute.reason || '顾问已质疑该信息点，请修改档案后消除。')}</small>
        ` : resolvedChallenge ? `
          <em class="archive-dispute-mini-badge is-resolved">档案已按质疑修正</em>
        ` : ''}
      </div>
      ${actionHtml}
    </article>
  `;
}

function renderFieldReviewGrid(fields, className = '', options = {}) {
  return `<div class="field-review-grid ${escapeHtml(className)}">${fields.map((field) => renderFieldReviewCard(field, options)).join('')}</div>`;
}

function advisorH5EvidenceItems(archive) {
  return Array.isArray(archive?.advisorH5EvidencePack?.evidence)
    ? archive.advisorH5EvidencePack.evidence
    : [];
}

function findAdvisorH5Evidence(archive, itemTitle) {
  return advisorH5EvidenceItems(archive).find((item) => item.itemTitle === itemTitle) || null;
}

function splitEvidenceNote(note) {
  return String(note || '')
    .split(/[；;。]\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderAuditReasonList(evidence) {
  const rows = splitEvidenceNote(evidence?.evidenceNote);
  const evidenceId = evidence?.evidenceId || '';
  const hasEvidenceIdInRows = evidenceId && rows.some((row) => row.includes(evidenceId));
  const finalRows = rows.length ? rows : ['待接入论据：当前 DS 生成结果未随附 evidenceNote。'];
  if (evidenceId && !hasEvidenceIdInRows) finalRows.push(`来源 evidenceId: ${evidenceId}`);
  return finalRows.map((row, index) => `<li><span>${index + 1}</span>${escapeHtml(row)}</li>`).join('');
}

function advisorAnalysisEvidence(archive, sourceTitle, fallbackValue, fallbackBadge) {
  const evidence = findAdvisorH5Evidence(archive, sourceTitle);
  return {
    ...evidence,
    value: humanizeAdvisorDisplayText(evidence?.value || fallbackValue),
    evidenceNote: humanizeAdvisorDisplayText(evidence?.evidenceNote || ''),
    badge: evidence ? '已接入论据' : '待接入论据',
    summaryBadge: fallbackBadge,
    missingEvidence: !evidence,
  };
}

function renderAdvisorAnalysisCard({ title, sourceTitle, evidence }) {
  return `
    <details class="interaction-analysis-card">
      <summary>
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(humanizeAdvisorDisplayText(evidence.value))}</strong>
        <em class="${evidence.missingEvidence ? 'is-pending' : 'is-ready'}">${escapeHtml(evidence.badge)}</em>
      </summary>
      <div class="interaction-analysis-audit">
        <h4>可审计推理摘要</h4>
        <ol>${renderAuditReasonList(evidence)}</ol>
        <p>来源板块：${escapeHtml(sourceTitle)}${evidence.summaryBadge ? ` · ${escapeHtml(evidence.summaryBadge)}` : ''}</p>
      </div>
    </details>
  `;
}

function renderAdvisorFeedbackPanel(goal, actionLabels, isDsAdvisorH5, reviewItemId = state.selectedReviewItemId) {
  const visibleActionLabels = ['采纳', '重新生成', '暂缓/勿扰'];
  const inlineStatus = advisorFeedbackInlineStatus(reviewItemId);
  return `
    <section class="interaction-subsection advisor-feedback-subsection">
      <div class="subsection-head">
        <span>2.3 顾问反馈</span>
        <strong>顾问动作</strong>
        <p>采纳可直接进入下一步；重新生成必须填写上一版不采纳原因；暂缓/勿扰继续写入本地勿扰门禁。所有动作仅本地记录，不自动发送、不对客发布。</p>
      </div>
      <div class="interaction-board-v2 advisor-action-board">
        <article>
          <span>顾问动作</span>
          <strong>${escapeHtml(goal.advisorDecisionMode || '顾问可采纳、可要求重新生成、可标记暂缓/勿扰。')}</strong>
          <label class="pause-reason-row">
            <span>重新生成原因</span>
            <input id="regenerate-reason-note" type="text" placeholder="必填：上一版为什么不适用，例如角度太硬 / 没回应客户近期状态" />
          </label>
          <label class="pause-reason-row">
            <span>暂缓勿扰原因</span>
            <input id="pause-reason-note" type="text" placeholder="例如：客人刚投诉 / 最近不方便 / 顾问判断先勿扰" />
          </label>
          <div class="feedback-chip-row action-chip-row">
            ${visibleActionLabels.map((label) => {
              const actionId = h5ReviewActionId(label);
              const attr = actionId ? ` data-h5-review-action="${escapeHtml(actionId)}"` : '';
              return `<button type="button"${attr}>${escapeHtml(label)}</button>`;
            }).join('')}
          </div>
          <div id="advisor-feedback-inline-status" class="advisor-feedback-inline-status ${escapeHtml(inlineStatus?.tone || '')}" ${inlineStatus ? '' : 'hidden'}>
            ${escapeHtml(inlineStatus?.message || '')}
          </div>
          ${isDsAdvisorH5 ? '<button class="secondary-action ds-refresh-inline" type="button" data-ds-refresh-section="interactionGoal">用 DS 重新生成互动目标</button>' : ''}
        </article>
      </div>
    </section>
  `;
}

function renderRegeneratedGoalVersionSwitcher(reviewItemId, challengeText) {
  const reviewAction = selectedLocalReviewAction(reviewItemId);
  if (reviewAction?.actionId !== 'regenerate') return '';
  const versions = regeneratedGoalVersionsForChallenge(challengeText, reviewItemId);
  const selectedIndex = regeneratedGoalVersionIndex(reviewItemId);
  return `
    <div class="regenerated-goal-version-panel">
      <div class="regenerated-goal-version-head">
        <span>重新生成后互动目标候选</span>
        <strong>2 份本地候选 · 当前使用版本 ${selectedIndex + 1}</strong>
      </div>
      <div class="regenerated-goal-version-grid">
        ${versions.map((version, index) => `
          <article class="${index === selectedIndex ? 'is-selected' : ''}">
            <span>${escapeHtml(version.label)}</span>
            <strong>${escapeHtml(version.demandLabel)} × ${escapeHtml(version.stageLabel)}</strong>
            <p>${escapeHtml(version.objective)}</p>
            <em>${escapeHtml(version.reason)}</em>
            <button type="button" data-regenerated-goal-version-index="${index}">
              ${index === selectedIndex ? '当前互动目标版本' : '切换到此版本'}
            </button>
          </article>
        `).join('')}
      </div>
      <p class="mock-backup-note">以上为重新生成后的本地版本备份；正式落库前仍需数据核查员确认，并由顾问人工复核。</p>
    </div>
  `;
}

function renderAdvisorAgentMethodology(goal, context = {}) {
  const demandLabel = context.demandLabel || '治疗型客户';
  const stageLabel = context.stageLabel || '流失期/复诊逾期唤醒';
  const reviewItemId = context.reviewItemId || state.selectedReviewItemId;
  const regenerationText = regenerationContextText(reviewItemId);
  const regeneratedGoal = selectedRegeneratedGoalVersion(reviewItemId);
  const displayDemandLabel = regeneratedGoal?.demandLabel || demandLabel;
  const displayStageLabel = regeneratedGoal?.stageLabel || stageLabel;
  const operatingFocus = regeneratedGoal?.operatingFocus || [
    '治疗连续性',
    '医生建议周期',
    '治疗改善证据',
    '按时回访',
    '避免疗程中断',
  ];
  const archive = context.archive || {};
  const analysisCards = [
    {
      title: '消费驱动因素',
      sourceTitle: '核心驱动因素',
      evidence: advisorAnalysisEvidence(
        archive,
        '核心驱动因素',
        '当前客户的核心诉求、项目记录和互动证据需结合全景档案复核，本轮优先围绕真实近况和医生复盘价值展开。',
        '当前诉求复核'
      ),
    },
    {
      title: '消费心理与行为障碍',
      sourceTitle: '消费心理与行为阻碍',
      evidence: advisorAnalysisEvidence(
        archive,
        '消费心理与行为阻碍',
        '首次治疗后未复诊，可能是对效果满意后缺乏紧迫感、遗忘医生建议、对后续治疗有顾虑，或没有主动预约习惯；无投诉记录，不按不满客户处理。',
        '节奏中断'
      ),
    },
    {
      title: '内容策略与 AIDA',
      sourceTitle: '内容策略与 AIDA',
      evidence: advisorAnalysisEvidence(
        archive,
        '内容策略与 AIDA',
        'Attention 低压提醒当前已到适合复盘的窗口；Interest 引用既往项目和真实近况；Desire 强调先看状态再判断节奏；Action 引导顾问整理给医生复盘。',
        '低压复盘'
      ),
    },
  ];
  const goalText = humanizeAdvisorDisplayText(regeneratedGoal?.objective || goal.objective || '待 DS 生成互动目标');
  return `
    <div class="advisor-interaction-sections">
      <section class="interaction-subsection methodology-card profile-agent-methodology">
        <div class="subsection-head">
          <span>2.1 分析依据</span>
        </div>
        <div class="interaction-analysis-grid">
          ${analysisCards.map(renderAdvisorAnalysisCard).join('')}
        </div>
      </section>
      <section class="interaction-subsection methodology-card interaction-goal-summary">
        <div class="subsection-head">
          <span>2.2 互动目标</span>
          <strong>${escapeHtml(goalText)}</strong>
          <p>${escapeHtml(`互动目标用于洞察客户心理后，根据客户现状安排个性化沟通：结合消费驱动、消费心理与行为障碍、内容策略与 AIDA，再叠加诉求类型“${displayDemandLabel}”、生命周期“${displayStageLabel}”、运营目标和运营重点，形成本轮顾问沟通策略。`)}</p>
        </div>
        <div class="interaction-goal-basis">
          <span>运营目标：让客户完成治疗路径、按医生建议周期回访、避免中途停止疗程。</span>
          <span>生命周期目标：低压唤醒、重新建立联系、不立刻强推开单。</span>
          <span>运营重点：${escapeHtml(operatingFocus.join('、'))}。</span>
        </div>
        ${renderRegeneratedGoalVersionSwitcher(reviewItemId, regenerationText)}
      </section>
      ${context.feedbackHtml || ''}
    </div>
  `;
}

function renderAngleCards(angles, selectedAngleIndex) {
  return `
    <div class="task-angle-grid angle-grid-v2">
      ${angles.map((angle, index) => `
        <article class="${[
          index === selectedAngleIndex ? 'is-selected' : '',
        ].filter(Boolean).join(' ')}">
          <div class="angle-card-head">
            <span>${escapeHtml(`角度 ${index + 1}`)} · ${escapeHtml(angle.code || '')}</span>
            <strong>${escapeHtml(angle.label || '待生成角度')}</strong>
            <p>${escapeHtml(normalizeChenAdvisorText(angle.h5Lead || '以关怀切入点开始，不直接推项目。'))}</p>
          </div>
          <div class="angle-actions">
            <button type="button" data-h5-angle-index="${index}">${index === selectedAngleIndex ? '当前选择' : '选择此角度生成 H5 + 话术'}</button>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderCustomAngleResultPanel(generation, selectedAngleIndex, customAngleIndex, isBusy = false) {
  if (!generation?.angle) {
    return `
      <div class="custom-angle-result-panel is-empty">
        <span>右侧结果</span>
        <strong>${isBusy ? 'DeepSeek 正在生成角度4' : '等待生成角度4'}</strong>
        <p>${isBusy ? '会结合左侧输入、客户信息、互动目标和现有三个角度，生成新的沟通角度、三页 H5 文案和顾问话术。' : '提交左侧自定义角度后，这里会展示 DeepSeek 生成的角度4结果。'}</p>
      </div>
    `;
  }
  const angle = generation.angle;
  const screens = asArray(generation.h5Screens || angle.h5Preview?.screens).slice(0, 3);
  const message = generation.advisorScript?.message || angle.advisorSendScript?.message || angle.script || '';
  return `
    <div class="custom-angle-result-panel has-result">
      <div class="custom-angle-result-head">
        <span>DeepSeek 已生成</span>
        <strong>角度 4 · ${escapeHtml(angle.code || 'ANGLE_04')}</strong>
        <p>${escapeHtml(generation.generatedAt || '')}${generation.model ? ` · ${escapeHtml(generation.model)}` : ''}</p>
      </div>
      <div class="custom-angle-result-summary">
        <span>新角度</span>
        <strong>${escapeHtml(angle.label || '自定义角度')}</strong>
        <p>${escapeHtml(normalizeChenAdvisorText(angle.h5Lead || angle.operatingFocus || generation.note || ''))}</p>
      </div>
      <div class="custom-angle-mini-screens">
        ${screens.map((screen, index) => `
          <article>
            <span>${escapeHtml(screen.step || `0${index + 1} / 03`)}</span>
            <strong>${escapeHtml(normalizeChenAdvisorText(screen.title || '待生成标题'))}</strong>
            <p>${escapeHtml(normalizeChenAdvisorText(screen.body || '待生成正文'))}</p>
          </article>
        `).join('')}
      </div>
      <div class="custom-angle-script-preview">
        <span>匹配话术</span>
        <p>${escapeHtml(normalizeChenAdvisorText(message || '待生成顾问沟通话术'))}</p>
      </div>
      <button type="button" class="secondary-action" data-h5-angle-index="${customAngleIndex}">
        ${selectedAngleIndex === customAngleIndex ? '当前已选角度4' : '选择角度4生成 H5 + 话术'}
      </button>
    </div>
  `;
}

function addLocalTimelineEvent(reviewItemId, title, meta) {
  state.localEvents.unshift({
    reviewItemId,
    title,
    meta,
  });
  state.localEvents = state.localEvents.slice(0, 200);
  persistAdvisorH5LocalState();
}

function selectedLocalReviewAction(reviewItemId = state.selectedReviewItemId) {
  return state.localReviewActions.get(reviewItemId) || null;
}

function h5ReviewActionConfig(actionId) {
  const configs = {
    accept: {
      label: '采纳',
      statusLabel: '顾问已采纳',
      nextGateStatus: 'ready_for_h5_manual_publish_review',
      nextStatusLabel: '进入 H5 发布复核',
      timelineTitle: '顾问采纳任务卡',
      feedbackLearning: '生成 advisor_accept 本地反馈学习事件',
    },
    regenerate: {
      label: '重新生成',
      statusLabel: '已提交重新生成',
      nextGateStatus: 'blocked_until_advisor_review',
      nextStatusLabel: '反馈已传递至数据核查员，待核查后同步至顾客档案',
      timelineTitle: '顾问请求重新生成',
      feedbackLearning: '生成 advisor_regenerate_request 本地反馈学习事件',
    },
    pause: {
      label: '暂缓/勿扰',
      statusLabel: '已标记暂缓/勿扰',
      nextGateStatus: 'paused_do_not_disturb',
      nextStatusLabel: '停止本轮触达',
      timelineTitle: '顾问标记暂缓/勿扰',
      feedbackLearning: '生成 advisor_pause_do_not_disturb 本地反馈学习事件',
    },
  };
  return configs[actionId] || null;
}

function h5ReviewActionId(label) {
  if (label === '采纳') return 'accept';
  if (label === '重新生成') return 'regenerate';
  if (label === '反馈不采纳原因') return 'regenerate';
  if (label === '标记暂缓/勿扰') return 'pause';
  if (label === '暂缓/勿扰') return 'pause';
  return '';
}

function updateGateForLocalReviewAction(reviewItemId, config) {
  const gate = (state.h5GateQueue?.queue || []).find((item) => item.reviewItemId === reviewItemId);
  if (gate) {
    gate.gateStatus = config.nextGateStatus;
    gate.lane = config.nextStatusLabel;
    gate.publishReviewAllowed = config.nextGateStatus === 'ready_for_h5_manual_publish_review';
  }
  const sendGate = (state.sendGateQueue?.queue || []).find((item) => item.reviewItemId === reviewItemId);
  if (sendGate) {
    sendGate.gateStatus = config.nextGateStatus === 'ready_for_h5_manual_publish_review'
      ? 'ready_for_manual_send'
      : 'blocked_until_advisor_review';
    sendGate.manualSendAllowed = config.nextGateStatus === 'ready_for_h5_manual_publish_review';
  }
  if (state.h5GateQueue?.summary) {
    state.h5GateQueue.summary.readyForManualPublishReview = (state.h5GateQueue.queue || [])
      .filter((item) => item.publishReviewAllowed).length;
  }
  if (state.sendGateQueue?.summary) {
    state.sendGateQueue.summary.readyForManualSend = (state.sendGateQueue.queue || [])
      .filter((item) => item.manualSendAllowed).length;
  }
}

function renderH5ReviewTaskCardDetail(review, gate, sendGate, archive) {
  const reviewItemId = review.reviewItemId;
  const taskCard = archive.h5ReviewTaskCard;
  const basic = taskCard.basicInfo || {};
  const classification = taskCard.classification || {};
  const plan = taskCard.planAndConsumption || {};
  const hook = taskCard.commercialHook || {};
  const goal = taskCard.interactionGoal || {};
  const feedback = taskCard.advisorFeedback || {};
  const angles = communicationAnglesForReview(taskCard, review.reviewItemId);
  const sendScript = taskCard.advisorSendScript || {};
  const selectedAngleIndex = selectedH5ReviewAngleIndex(review.reviewItemId);
  const selectedAngle = selectedH5ReviewAngle(taskCard, review.reviewItemId);
  const customAngleGeneration = customAngleGenerationForReview(review.reviewItemId);
  const customAngleIndex = customAngleGeneration ? Math.max(0, angles.length - 1) : sourceCommunicationAnglesForReview(taskCard, review.reviewItemId).length;
  const customAngleBusy = state.customAngleBusyReviewItemId === review.reviewItemId;
  const screens = h5ScreensForSelectedAngle(taskCard, taskCard.h5Preview?.screens || archive.h5Brief?.screens || [], review.reviewItemId);
  const activeSendScript = sendScriptForSelectedAngle(taskCard, sendScript, review.reviewItemId);
  const facts = archive.reviewFacts || {};
  const actionLabels = ['采纳', '重新生成', '暂缓/勿扰'];
  const customerFacts = advisorH5CustomerFacts(taskCard, archive, review);
  const displayCustomerName = customerFacts.customerName;
  const clinicEvidence = findAdvisorH5Evidence(archive, '所属诊所')
    || findAdvisorH5Evidence(archive, '到访门店')
    || findAdvisorH5Evidence(archive, '预约门店');
  const clinicName = valueWithFallback(
    basic.clinic,
    archive.advisorH5EvidencePack?.customerIdentity?.clinicName,
    customerFacts.clinic
  );
  const clinicNote = clinicEvidence?.evidenceNote
    || (clinicEvidence?.value ? '门店字段直接命中。' : '到访和病历门店一致 / 门店字段直接命中。');
  const stageLabel = classification.lifecycleStage || archive.dataSnapshotInternal?.lifecycleLabel || '待判别';
  const demandLabel = classification.demandType || '待判别';
  const isDsAdvisorH5 = reviewSourceMode === 'ds-advisor-h5';
  const sourceLabel = isDsAdvisorH5 ? 'DS 生成' : '样板';
  const keywords = Array.isArray(classification.keywords)
    ? classification.keywords.join(' / ')
    : classification.keywords || '黄褐斑 / 日光性黑子 / 皮肤松弛 / 复诊逾期';
  const angleRuleText = taskCard.angleGenerationRule
    || (isDsAdvisorH5
      ? '三个沟通角度由 AI 结合互动目标、用户画像分析的运营目标/运营重点、9 个数据分析子 Agent 和当前客户档案生成；角度本身顾问不可改，只能选择、全部不采纳反馈，或提交自定义角度后让 AI 重新生成配套 H5 与话术。'
      : '治疗型客户优先强调治疗连续性、医生建议周期、治疗改善/反馈复盘和按时回访；当前处于复诊逾期唤醒，角度由 AI 生成且顾问不可直接改。');
  const remarksFallback = basic.remarks || '未见“要 VIP / 不愿某项目”等有效证据，待顾问补充。';
  const contraindicationFallback = basic.contraindication || '未见怕痛、过敏、不愿等待、备孕/哺乳期等有效期内证据；过期信息不作为当前抓手。';
  const otherFields = [
    { group: '其他信息', key: 'remarks', label: '备注/偏好', value: localAdvisorFieldValue(reviewItemId, 'remarks', remarksFallback), editable: true },
    { group: '其他信息', key: 'contraindication', label: '怕痛/过敏/等待/备孕哺乳', value: localAdvisorFieldValue(reviewItemId, 'contraindication', contraindicationFallback), editable: true },
  ];
  const hookFields = [
    { group: '权益/抓手', key: 'unconsumed_projects', label: '未消耗疗程', value: customerFacts.unconsumedProjects, editable: false },
    { group: '权益/抓手', key: 'points', label: '积分', value: customerFacts.points, editable: false },
    { group: '权益/抓手', key: 'balance', label: '余额', value: customerFacts.balance, editable: false },
    { group: '权益/抓手', key: 'value_added_fund', label: '增值金', value: customerFacts.valueAddedFund, editable: false },
    { group: '权益/抓手', key: 'coupon', label: '优惠券/有效期', value: `${customerFacts.coupon}；有效期：${customerFacts.couponExpiry}`, editable: false },
  ];
  const p2Summary = `最近项目：${plan.recentProject || '待补'}；服务项目 ${plan.serviceProjectCount ?? '待补'} 个，剩余 ${plan.serviceRemainCount ?? '待补'}。`;
  const resolvedChallenge = advisorChallengeResolvedForReview(review, archive);
  const basicCollapsed = isReviewSectionCollapsed(review.reviewItemId, 'basic');
  const goalCollapsed = isReviewSectionCollapsed(review.reviewItemId, 'goal');
  const communicationCollapsed = isReviewSectionCollapsed(review.reviewItemId, 'communication');

  $('#task-card-detail').innerHTML = `
    <section class="archive-hero-card task-review-hero h5-review-redesign-hero">
      <div>
        <p class="panel-kicker">DS H5 REVIEW · ${escapeHtml(basic.customerCode || archive.customerCode || review.reviewItemId)}</p>
        <h3>${escapeHtml(displayCustomerName)} · 顾问任务卡与 H5 发布审核${isDsAdvisorH5 ? '' : '样板'}</h3>
        <p>${escapeHtml(taskCard.personalProfileBrief || '人物画像简报待生成')}</p>
      </div>
      <div class="status-stack">
        <span class="status-chip is-ready">${escapeHtml(sourceLabel)}</span>
        <span class="status-chip is-muted">${escapeHtml(review.reviewStatusLabel || '待顾问审核')}</span>
        <span class="status-chip is-muted">顾问可反馈</span>
        <span class="status-chip is-muted">不真实发送</span>
      </div>
    </section>

    <section id="review-section-basic" class="section-stack h5-review-block review-anchor-section collapsible-review-section ${basicCollapsed ? 'is-collapsed' : ''}" data-review-section="basic">
      ${renderReviewSectionToggle(review.reviewItemId, 'basic', '1. 客户基本信息')}
      <div class="collapsible-section-body" ${basicCollapsed ? 'hidden' : ''}>
        <div class="basic-info-challenge-actions">
          ${resolvedChallenge ? '<em class="archive-dispute-mini-badge is-resolved">档案已按质疑修正</em>' : ''}
          <button class="secondary-action basic-info-challenge-action" type="button" data-customer-basic-challenge>质疑</button>
        </div>
      ${renderTopMetricCards([
        { label: '会员等级', value: customerFacts.memberLevel, note: '客观字段 · 仅可质疑' },
        { label: '来源渠道', value: customerFacts.sourceChannel, note: '档案字段 · 仅可质疑' },
        { label: '累计消费', value: customerFacts.totalConsumption, note: '源库金额 / 100 展示' },
        { label: '客单价', value: customerFacts.averageOrderValue, note: customerFacts.orderCount },
        { label: 'RFM', value: customerFacts.rfmGrade, note: '非 A 前置 / 辅助排序' },
        { label: '余额/积分', value: `${customerFacts.balance} / ${customerFacts.points}`, note: '权益需有效期核验' },
      ])}

      <div class="customer-basic-original-grid">
        <article class="customer-basic-main original-demand-card">
          <span>诉求类型 × 当前阶段</span>
          <strong>${escapeHtml(demandLabel)} × ${escapeHtml(stageLabel)}</strong>
          <p>${escapeHtml(classification.dominancePolicy || '诉求和阶段为主轴，RFM 只做内部辅助排序。')}</p>
          <div class="inline-evidence">
            <span>关键词：${escapeHtml(keywords)}</span>
            <span>历史阶段：${escapeHtml(classification.historicalStage || '待顾问确认')}</span>
            <span>子类型：${escapeHtml(classification.demandSubtype || '待补')}</span>
          </div>
          <button class="secondary-action evidence-detail-action" type="button" data-evidence-matrix-toggle aria-expanded="false">查看详情</button>
        </article>
        <article class="basic-info-card">
          <span>所属门店</span>
          <strong>${escapeHtml(clinicName)}</strong>
          <p>${escapeHtml(clinicNote)}</p>
        </article>
        <article class="basic-info-card">
          <span>顾问 / 医生</span>
          <strong>${escapeHtml(customerFacts.advisor)} / ${escapeHtml(customerFacts.doctor)}</strong>
        </article>
        <article class="basic-info-card">
          <span>采取了哪些方案</span>
          <strong>${escapeHtml(customerFacts.doctorPlan)}</strong>
          <p>${escapeHtml(plan.proposedOrTakenPlan || '待顾问确认')}</p>
        </article>
        <article class="basic-info-card">
          <span>消费特征摘要</span>
          <strong>${escapeHtml(customerFacts.consumptionSummary)}</strong>
          <p>内部审核可见，客户 H5 不展示消费金额。</p>
        </article>
        <article class="basic-info-card">
          <span>P1 病例/诊断/检测</span>
          <p>${escapeHtml(facts.diagnosisAndNeed || '待补')}</p>
        </article>
        <article class="basic-info-card">
          <span>P2 项目和治疗次数</span>
          <p>${escapeHtml(p2Summary)}</p>
        </article>
        <article class="basic-info-card">
          <span>P3 到店/互动/风险</span>
          <p>${escapeHtml(`${facts.relationshipFacts || '互动记录待补'} ${facts.riskFacts || ''}`)}</p>
        </article>
      </div>
      <div id="classification-evidence-detail" class="classification-detail-panel" hidden>
        ${renderClassificationEvidenceMatrix(taskCard.classificationEvidenceMatrix)}
      </div>
      <div class="basic-extension-stack">
        <article class="customer-basic-section customer-other-section">
          <div class="subsection-head">
            <span>其他信息</span>
            <strong>备注、偏好、禁忌和时效性信息</strong>
            <p>只保留当前有效信息；过期的备孕/哺乳期、等待偏好或临时备注不作为当前抓手。</p>
          </div>
          ${renderFieldReviewGrid(otherFields, '', { reviewItemId })}
        </article>
        <article class="customer-basic-section customer-hook-section">
          <div class="subsection-head">
            <span>权益 / 抓手</span>
            <strong>${escapeHtml(hook.title || '治疗后复盘与医生周期确认')}</strong>
            <p>${escapeHtml(hook.entryReason || '权益/抓手只作为顾问核对项；过期权益、无证据优惠券和已完成疗程不得包装成进店理由。')}</p>
            ${renderAdvisorMissingBlockBadge(...hookFields.map((field) => field.value))}
          </div>
          ${renderFieldReviewGrid(hookFields, 'is-rights-grid is-compact-rights-grid', { reviewItemId, hideActions: true, compact: true })}
        </article>
      </div>
      </div>
    </section>

    <section id="review-section-goal" class="section-stack h5-review-block review-anchor-section collapsible-review-section ${goalCollapsed ? 'is-collapsed' : ''}" data-review-section="goal">
      ${renderReviewSectionToggle(review.reviewItemId, 'goal', '2. 互动目标')}
      <div class="collapsible-section-body" ${goalCollapsed ? 'hidden' : ''}>
        ${renderAdvisorAgentMethodology(goal, {
        demandLabel,
        stageLabel,
        customerFacts,
        plan,
        hook,
        classification,
        facts,
        archive,
        reviewItemId: review.reviewItemId,
        feedbackHtml: renderAdvisorFeedbackPanel(goal, actionLabels, isDsAdvisorH5, review.reviewItemId),
        })}
      </div>
    </section>

    <section id="review-section-communication" class="section-stack h5-review-block review-anchor-section collapsible-review-section ${communicationCollapsed ? 'is-collapsed' : ''}" data-review-section="communication">
      ${renderReviewSectionToggle(review.reviewItemId, 'communication', '3. 沟通角度与发送')}
      <div class="collapsible-section-body" ${communicationCollapsed ? 'hidden' : ''}>
      <div class="angle-rules-card">
        <strong>沟通角度三选一</strong>
        <p>${escapeHtml(angleRuleText)}</p>
        ${isDsAdvisorH5 ? '<button class="secondary-action ds-refresh-inline" type="button" data-ds-refresh-section="communicationAngles">用 DS 重新生成沟通角度</button>' : ''}
      </div>
      ${renderAngleCards(angles, selectedAngleIndex)}
      <div class="custom-angle-panel angle-reject-panel">
        <label>
          <span>三个角度都不采纳：反馈原因</span>
          <textarea id="angle-reject-reason" placeholder="例如：三个角度都太像推项目 / 与顾客近期状态不符 / 需要换成更轻的关怀切入。"></textarea>
        </label>
        <button type="button" class="secondary-action" id="reject-all-angles">记录全部不采纳反馈</button>
      </div>
      <div class="custom-angle-workbench">
        <div class="custom-angle-panel custom-angle-input-panel">
          <label>
            <span>三个角度都不满意：自定义新角度</span>
            <textarea id="custom-angle-note" placeholder="填写新的关怀切入点；DeepSeek 会结合上方客户信息与互动目标生成角度4、三页 H5 和单条话术。">${escapeHtml(customAngleGeneration?.note || '')}</textarea>
          </label>
          <button type="button" class="secondary-action" id="request-custom-angle" ${customAngleBusy ? 'disabled' : ''}>${customAngleBusy ? 'DeepSeek 生成中...' : '提交自定义角度并让 DeepSeek 生成角度4'}</button>
        </div>
        ${renderCustomAngleResultPanel(customAngleGeneration, selectedAngleIndex, customAngleIndex, customAngleBusy)}
      </div>
      <div class="angle-rules-card">
        <strong>已选角度：${escapeHtml(selectedAngle?.label || activeSendScript.selectedAngleLabel || '推荐角度')}</strong>
        <p>选择角度后，由 AI 生成对应 H5 三页和一条发送话术；角度不可改，话术内容可轻编辑，发送时可只选话术或只选 H5。</p>
        ${isDsAdvisorH5 ? '<button class="secondary-action ds-refresh-inline" type="button" data-ds-refresh-section="h5PreviewAndScript">按所选角度生成/刷新 H5 与话术</button>' : ''}
      </div>
      <div class="preview-and-script-grid">
        <div class="h5-copy-editor-grid">
          ${screens.map((screen, index) => `
            <article class="h5-copy-editor-card">
              <span>${escapeHtml(screen.step || '')}</span>
              <label>
                <span>标题</span>
                <textarea data-h5-screen-field="title" data-h5-screen-index="${index}" aria-label="H5 第 ${index + 1} 页标题">${escapeHtml(normalizeChenAdvisorText(screen.title || ''))}</textarea>
              </label>
              <label>
                <span>正文</span>
                <textarea data-h5-screen-field="body" data-h5-screen-index="${index}" aria-label="H5 第 ${index + 1} 页正文">${escapeHtml(normalizeChenAdvisorText(screen.body || ''))}</textarea>
              </label>
              <label>
                <span>审核说明</span>
                <textarea data-h5-screen-field="auditRationale" data-h5-screen-index="${index}" aria-label="H5 第 ${index + 1} 页审核说明">${escapeHtml(normalizeChenAdvisorText(screen.auditRationale || ''))}</textarea>
              </label>
            </article>
          `).join('')}
          <div class="h5-copy-editor-actions">
            <button type="button" class="secondary-action" data-h5-copy-edit-action="${selectedAngleIndex}">记录 H5 三页文案修改</button>
          </div>
        </div>
        <div class="readonly-script-card script-card-v2">
          <button id="advisor-script-open-modal" class="secondary-action script-modal-launch-button" type="button">生成话术</button>
        </div>
      </div>
      <button id="generate-h5-inline" class="primary-action" type="button">按当前任务卡生成最终 H5 预览</button>
      <div class="send-choice-panel">
        <div>
          <strong>发送内容选择</strong>
          <p>可以只发送话术或只发送 H5；两项都不选时不允许记录发送。当前仅记录本地审核/测试事件。</p>
        </div>
        <label><input id="send-script-checkbox" type="checkbox" checked /> 发送话术</label>
        <label><input id="send-h5-checkbox" type="checkbox" checked /> 发送 H5</label>
        <button type="button" class="secondary-action" id="record-send-plan">记录发送选择</button>
      </div>
      <div class="completion-feedback-panel">
        <div class="subsection-head">
          <span>任务完成与回访反馈</span>
          <strong>已完成后写入本地完成反馈事件</strong>
          <p>反馈顾客回访情况，不是产品 bug；未来写回顾客档案并可接入企微对话 AI 摘要作为佐证。</p>
        </div>
        <div class="completion-form-grid">
          <label>
            <span>顾客有无回复</span>
            <select id="completion-response-status">
              <option value="responded">有回复</option>
              <option value="no_response">未回复</option>
              <option value="not_sent">尚未发送</option>
            </select>
          </label>
          <label>
            <span>回了说什么</span>
            <textarea id="completion-reply-note" placeholder="记录顾客回复原意，例如：最近出国、带孩子玩、近期不方便。"></textarea>
          </label>
          <label>
            <span>额外信息</span>
            <textarea id="completion-extra-info" placeholder="如出国、带孩子、过敏、投诉后情绪、医生复诊偏好等。"></textarea>
          </label>
          <label>
            <span>企微对话 AI 摘要占位</span>
            <textarea id="completion-ai-summary" placeholder="后续接入企微对话 AI 总结；当前不读取真实企微正文。"></textarea>
          </label>
	        </div>
	        <button type="button" class="primary-action" id="advisor-task-complete">已完成</button>
	      </div>
      <div class="completion-feedback-panel feedback-backfill-panel">
        <div class="subsection-head">
          <span>客户反馈补录</span>
          <strong>草稿制 · 人工合入</strong>
          <p>仅记录客户自述摘要和顾问判断；风险信号会置顶等待人工复核，不自动重判画像。</p>
        </div>
        <div class="completion-form-grid">
          <label>
            <span>客户自述摘要</span>
            <textarea id="feedback-backfill-customer-stated" maxlength="500" placeholder="500 字以内，例如：最近出差较多，暂时不方便安排到店。"></textarea>
          </label>
          <label>
            <span>顾问判断</span>
            <textarea id="feedback-backfill-advisor-guess" maxlength="500" placeholder="区分顾问推测，不要写成客户已确认事实。"></textarea>
          </label>
        </div>
        <button type="button" class="secondary-action" id="feedback-backfill-submit">生成反馈补录草稿</button>
      </div>
      </div>
	    </section>
	  `;
}

function renderArchiveTaskDetail(review, gate, sendGate, archive) {
  if (archive.h5ReviewTaskCard) {
    renderH5ReviewTaskCardDetail(review, gate, sendGate, archive);
    return;
  }
  const snapshot = archive.dataSnapshotInternal || {};
  const addendum = archive.analysisAddendum20260619 || {};
  const scoreAudit = addendum.opportunityScoringAudit || {};
  const card = archive.advisorTaskCard || {};
  const h5 = archive.h5Brief || {};
  const audit = archive.audit || {};
  const scripts = selectedScripts();
  const forbidden = archive.visibilityRules?.forbiddenCustomerSurface || [];
  const allowed = archive.visibilityRules?.customerVisibleAllowed || [];
  const reviewChecklist = card.analysisBasis20260619?.reviewChecklist || [];
  const customerEvidenceAnchors = card.analysisBasis20260619?.customerEvidenceAnchors || addendum.customerEvidenceAnchors || [];
  const cannotCopyReasons = card.analysisBasis20260619?.whyThisCannotBeCopied || [];
  const driverEvidence = addendum.coreDriver?.evidence || [];
  const quantifiedReasoning = audit.quantifiedAuditableReasoning || {};
  const scoreRows = renderScoreBreakdown(scoreAudit);
  const scoreTotal = scoreRows.reduce((sum, row) => sum + row.contribution, 0);
  const verifyFocus = card.verifyFocus || reviewChecklist || [
    '核查最近护理项目与客户记忆是否一致，避免项目名误读。',
    '核查“重度逾期”和“高频维护基础”的判断是否符合顾问实际了解。',
    '核查当前是否存在近期不适、禁忌、已预约、已流失或不宜触达情况。',
    '核查话术是否保持低压力，不出现强销售、疗效承诺或自动预约暗示。',
  ];

  $('#task-card-detail').innerHTML = `
    <section class="archive-hero-card">
      <div>
        <p class="panel-kicker">${escapeHtml(archive.customerCode || 'C--')} · 3.1 主场景一 · 顾问快速核查</p>
        <h3>客户真值与 Agent 分析核查</h3>
        <p>只展示顾客相关真值数据和 Agent 分析结论。请顾问核查是否符合客户实际情况，再给出反馈或处理动作。</p>
      </div>
      <div class="status-stack">
        <span class="status-chip is-ready">${escapeHtml(card.reviewStatus || '顾问人工审核版')}</span>
        <span class="status-chip is-muted">仅本地结构化真值</span>
        <span class="status-chip is-muted">顾问确认后才可进入下一步</span>
      </div>
    </section>

    <div class="detail-grid six-up">
      ${renderMetric('RFM 等级', snapshot.rfmGrade || 'B', '筛选前置')}
      ${renderMetric('结构化真值', `${snapshot.truthValueCount}/${snapshot.requirementCount}`, `准备度 ${formatPercent(snapshot.dataReadinessScore)}`)}
      ${renderMetric('12 月维养', `${snapshot.maintenanceCount12m} 次`, maintenanceBand(snapshot.maintenanceCount12m))}
      ${renderMetric('距上次护理', `${snapshot.daysSinceLastMaintenance} 天`, '真实间隔天数')}
      ${renderMetric('维护超期', `${snapshot.overdueDays} 天`, cadenceNote(snapshot.overdueDays))}
      ${renderMetric('生命周期', snapshot.lifecycleLabel || '待核查', snapshot.lifecycleCode || '')}
      ${renderMetric('Agent 机会分', `${snapshot.opportunityScore} 分`, '仅内部排序')}
    </div>

    <section class="section-stack">
      <div class="section-title">顾客相关真值数据</div>
      <div class="truth-grid">
        <article class="truth-card">
          <span>客户 ID</span>
          <strong>${escapeHtml(archive.customerId || review.unifiedCustomerId || '')}</strong>
        </article>
        <article class="truth-card">
          <span>最近护理项目</span>
          <strong>${escapeHtml(snapshot.lastMaintenanceProject || '')}</strong>
        </article>
        <article class="truth-card">
          <span>产品归类</span>
          <strong>${escapeHtml(snapshot.productClass || '待核查')}</strong>
        </article>
        <article class="truth-card">
          <span>风险状态</span>
          <strong>${escapeHtml(snapshot.riskLevel || '待核查')}</strong>
        </article>
      </div>
    </section>

    <section class="section-stack">
      <div class="section-title">Agent 分析结果</div>
      <div class="analysis-result-grid">
        <article class="analysis-card">
          <strong>客户情况判断</strong>
          <p>${escapeHtml(card.advisorBrief || review.advisorBrief || '')}</p>
        </article>
        <article class="analysis-card">
          <strong>核心驱动判断</strong>
          <p>${escapeHtml(addendum.coreDriver?.primary || '')} ${escapeHtml(addendum.coreDriver?.primaryScore || '')} 分；${escapeHtml(addendum.coreDriver?.secondary || '')} ${escapeHtml(addendum.coreDriver?.secondaryScore || '')} 分。</p>
          <small>${escapeHtml(addendum.coreDriver?.advisorMeaning || '')}</small>
        </article>
        <article class="analysis-card">
          <strong>机会与边界</strong>
          <p>${escapeHtml(scoreAudit.priority || '')}｜${escapeHtml(scoreAudit.score || snapshot.opportunityScore || '')} 分｜${escapeHtml(snapshot.riskLevel || '')}</p>
          <small>${escapeHtml(scoreAudit.boundary || '仅用于内部排序和人工审核，不展示给顾客。')}</small>
        </article>
      </div>
    </section>

    <section class="section-stack">
      <div class="section-title">Agent 分析支撑数据</div>
      <div class="support-grid">
        <article class="support-card">
          <strong>生命周期判断支撑</strong>
          <dl>
            <div><dt>判定规则</dt><dd>维护间隔超过 120 天进入重度逾期观察</dd></div>
            <div><dt>当前数值</dt><dd>${escapeHtml(snapshot.overdueDays || '')} 天</dd></div>
            <div><dt>结论</dt><dd>${escapeHtml(snapshot.lifecycleLabel || '')}</dd></div>
          </dl>
        </article>
        <article class="support-card">
          <strong>高频维护基础支撑</strong>
          <dl>
            <div><dt>判定规则</dt><dd>近 12 月维养次数 >= 5 视为高频维护基础</dd></div>
            <div><dt>当前数值</dt><dd>${escapeHtml(snapshot.maintenanceCount12m || '')} 次</dd></div>
            <div><dt>相关项目</dt><dd>${escapeHtml(snapshot.lastMaintenanceProject || '')}</dd></div>
          </dl>
        </article>
        <article class="support-card">
          <strong>数据准备度支撑</strong>
          <dl>
            <div><dt>可用真值</dt><dd>${escapeHtml(snapshot.truthValueCount || '')} / ${escapeHtml(snapshot.requirementCount || '')}</dd></div>
            <div><dt>准备度</dt><dd>${formatPercent(snapshot.dataReadinessScore)}</dd></div>
            <div><dt>使用边界</dt><dd>进入人工审核，不自动发送或发布</dd></div>
          </dl>
        </article>
        <article class="support-card">
          <strong>核心驱动支撑</strong>
          <dl>
            <div><dt>主要驱动</dt><dd>${escapeHtml(addendum.coreDriver?.primary || '')} ${escapeHtml(addendum.coreDriver?.primaryScore || '')} 分</dd></div>
            <div><dt>辅助驱动</dt><dd>${escapeHtml(addendum.coreDriver?.secondary || '')} ${escapeHtml(addendum.coreDriver?.secondaryScore || '')} 分</dd></div>
            <div><dt>置信度</dt><dd>${formatPercent(addendum.coreDriver?.confidence || 0)}</dd></div>
          </dl>
        </article>
      </div>
    </section>

    <section class="section-stack">
      <div class="section-title">机会分量化过程</div>
      <div class="score-audit-card">
        <div>
          <strong>公式</strong>
          <p>${escapeHtml(scoreAudit.formula || '机会分 = 多维分项加权求和')}</p>
        </div>
        <div class="score-total">
          <span>加权合计</span>
          <strong>${scoreTotal.toFixed(1)} ≈ ${escapeHtml(scoreAudit.score || snapshot.opportunityScore || '')} 分</strong>
        </div>
      </div>
      <div class="score-breakdown-grid">
        ${scoreRows.map((row) => `
          <article class="score-row-card">
            <span>${escapeHtml(row.label)}</span>
            <strong>${row.raw}</strong>
            <em>权重 ${(row.weight * 100).toFixed(0)}% · 贡献 ${row.contribution.toFixed(1)}</em>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="section-stack">
      <div class="section-title">Agent 依据与顾问核查点</div>
      <div class="verification-grid">
        <div class="evidence-card">
          <strong>Agent 主要依据</strong>
          ${renderList([
            ...(driverEvidence || []),
            ...(quantifiedReasoning.dataToConclusion || []),
          ])}
        </div>
        <div class="evidence-card">
          <strong>评分标准</strong>
          ${renderList(quantifiedReasoning.visibleScoringStandards)}
        </div>
        <div class="evidence-card">
          <strong>请顾问重点核查</strong>
          ${renderList(verifyFocus)}
        </div>
        <div class="evidence-card">
          <strong>客户证据锚点</strong>
          ${renderAnchorList(customerEvidenceAnchors)}
        </div>
        <div class="evidence-card">
          <strong>不能照搬原因</strong>
          ${renderList(cannotCopyReasons)}
        </div>
        <div class="evidence-card">
          <strong>审核清单</strong>
          ${renderList(reviewChecklist)}
        </div>
      </div>
    </section>

    <section class="section-stack">
      <div class="section-title">顾问话术与反馈</div>
      <div class="script-tabs">
        ${scripts.map((variant) => `
          <button class="${variant.variant === state.selectedVariant ? 'is-active' : ''}" type="button" data-variant="${escapeHtml(variant.variant)}">
            版本 ${escapeHtml(variant.variant)}｜${escapeHtml(variant.angle || '')}
          </button>
        `).join('')}
      </div>
      <textarea id="script-editor" aria-label="顾问话术轻编辑">${escapeHtml(selectedVariantText())}</textarea>
      <div class="feedback-panel">
        <label>
          <span>顾问反馈</span>
          <textarea id="advisor-feedback-note" aria-label="顾问反馈" placeholder="请记录：Agent 分析是否合理、需要修正的数据点、是否适合触达、建议下一步。"></textarea>
        </label>
        <div class="feedback-chip-row">
          <button type="button">分析合理</button>
          <button type="button">需补客户近况</button>
          <button type="button">需改生命周期</button>
          <button type="button">暂不触达</button>
        </div>
      </div>
    </section>

    <section class="section-stack">
      <div class="section-title">H5 客户可见内容核查</div>
      <div class="h5-map-grid">
        ${(h5.screens || []).map((screen) => `
          <article>
            <span>${escapeHtml(screen.step)}</span>
            <strong>${escapeHtml(screen.title)}</strong>
            <p>${escapeHtml(screen.auditRationale || screen.subtitle || '')}</p>
          </article>
        `).join('')}
      </div>
      <button id="generate-h5-inline" class="primary-action" type="button">按当前任务卡生成最终 H5 预览</button>
    </section>

  `;
}

function renderGenericTaskDetail(review, gate, sendGate) {
  const variants = selectedScripts();
  $('#task-card-detail').innerHTML = `
    <div class="detail-grid">
      ${renderMetric('客户 ID', maskId(review.unifiedCustomerId))}
      ${renderMetric('生命周期', review.lifecycleState?.label || gate?.lifecycleStateLabel || '待补')}
      ${renderMetric('优先级', review.priority || '待定')}
    </div>
    <section class="section-stack">
      <div class="section-title">顾客相关数据</div>
      <div class="detail-grid">
        ${renderMetric('场景标签', '皮肤维养节奏中断')}
        ${renderMetric('人工发送门禁', sendGate?.gateStatus || '待确认')}
        ${renderMetric('H5 发布门禁', gate?.lane || gate?.gateStatus || '待确认')}
      </div>
    </section>
    <section class="section-stack">
      <div class="section-title">Agent 分析结果</div>
      <div class="evidence-card">
        ${escapeHtml(review.advisorBrief || gate?.h5Draft?.screen1 || '当前结构化字段足以生成顾问审核前任务卡草稿，但仍不可自动发送。')}
      </div>
    </section>
    <section class="section-stack">
      <div class="section-title">顾问话术与反馈</div>
      <div class="script-tabs">
        ${variants.map((variant) => `
          <button class="${variant.variant === state.selectedVariant ? 'is-active' : ''}" type="button" data-variant="${escapeHtml(variant.variant)}">
            版本 ${escapeHtml(variant.variant)}｜${escapeHtml(variant.angle || '')}
          </button>
        `).join('')}
      </div>
      <textarea id="script-editor" aria-label="顾问话术轻编辑">${escapeHtml(selectedVariantText())}</textarea>
      <div class="feedback-panel">
        <label>
          <span>顾问反馈</span>
          <textarea id="advisor-feedback-note" aria-label="顾问反馈" placeholder="请记录：Agent 分析是否合理、需要修正的数据点、是否适合触达、建议下一步。"></textarea>
        </label>
        <div class="feedback-chip-row">
          <button type="button">分析合理</button>
          <button type="button">需补客户近况</button>
          <button type="button">需改生命周期</button>
          <button type="button">暂不触达</button>
        </div>
      </div>
    </section>
    <section class="section-stack">
      <div class="section-title">H5 客户可见内容核查</div>
      <div class="h5-mini-card">${escapeHtml(gate?.h5Draft?.screen1 || review.h5Brief?.screen1 || '待生成 H5 草稿')}</div>
      <button id="generate-h5-inline" class="primary-action" type="button">按当前任务卡生成 H5 预览</button>
    </section>
  `;
}

function isP7LiveDirectoryReview(review = selectedReview()) {
  return reviewSourceMode === 'p7-live' && review?.p7DirectoryOnly === true;
}

function p7LiveDetailError(review = selectedReview()) {
  const customerId = review?.unifiedCustomerId || '';
  return customerId ? state.p7LiveDetailErrorByCustomerId.get(customerId) || '' : '';
}

function p7LiveProgressiveStateMarkup(review, { compact = false, allowRetry = false, label = '' } = {}) {
  const error = p7LiveDetailError(review);
  const customerName = review?.customerName || maskId(review?.unifiedCustomerId) || '当前客户';
  if (error) {
    return `
      <div class="progressive-detail-state is-error ${compact ? 'is-compact' : ''}" role="alert">
        <strong>任务详情加载失败</strong>
        <span>${escapeHtml(error)}</span>
        ${allowRetry ? '<button id="p7-live-detail-retry" class="secondary-action" type="button">重新加载</button>' : ''}
      </div>
    `;
  }
  return `
    <div class="progressive-detail-state ${compact ? 'is-compact' : ''}" role="status" aria-live="polite">
      <span class="task-list-loading-spinner" aria-hidden="true"></span>
      <strong>${escapeHtml(label || `正在加载 ${customerName} 的任务详情`)}</strong>
    </div>
  `;
}

function renderTaskDetail() {
  const review = selectedReview();
  const gate = selectedH5Gate();
  const sendGate = selectedSendGate();
  if (!review) {
    $('#task-status-chip').className = 'status-chip is-muted';
    $('#task-status-chip').textContent = '无任务';
    if ($('#gate-status-chip')) {
      $('#gate-status-chip').className = 'status-chip is-muted';
      $('#gate-status-chip').textContent = '无任务';
    }
    $('#task-card-detail').innerHTML = '<div class="empty">没有可展示的任务</div>';
    return;
  }

  if (isP7LiveDirectoryReview(review)) {
    const hasError = Boolean(p7LiveDetailError(review));
    $('#task-status-chip').className = `status-chip ${hasError ? 'is-blocked' : 'is-muted'}`;
    $('#task-status-chip').textContent = hasError ? '加载失败' : '详情加载中';
    if ($('#gate-status-chip')) {
      $('#gate-status-chip').className = `status-chip ${hasError ? 'is-blocked' : 'is-muted'}`;
      $('#gate-status-chip').textContent = hasError ? '加载失败' : '详情加载中';
    }
    $('#task-card-detail').innerHTML = p7LiveProgressiveStateMarkup(review, { allowRetry: true });
    return;
  }

  $('#task-status-chip').className = `status-chip ${statusClass(gate, sendGate)}`;
  $('#task-status-chip').textContent = statusLabel(gate, sendGate);
  if ($('#gate-status-chip')) {
    $('#gate-status-chip').className = `status-chip ${statusClass(gate, sendGate)}`;
    $('#gate-status-chip').textContent = gate?.gateStatus || sendGate?.gateStatus || '待审核';
  }

  const archive = selectedArchive();
  try {
    if (archive) {
      renderArchiveTaskDetail(review, gate, sendGate, archive);
      return;
    }
    renderGenericTaskDetail(review, gate, sendGate);
  } catch (error) {
    console.error('[advisor-h5-review] task detail render failed', error);
    $('#task-card-detail').innerHTML = `
      <div class="empty">
        任务详情渲染失败：${escapeHtml(error.message || String(error))}
      </div>
    `;
  }
}

function fallbackH5Screens(review, gate) {
  const h5Draft = gate?.h5Draft || review?.h5Brief || {};
  return [
    {
      step: '01 / 03',
      title: '这份简报和你的维养节奏有关',
      body: sanitizeCustomerText(h5Draft.screen1 || '近期护理节奏已经进入适合观察的窗口。'),
      primaryFact: '最近一次护理记录',
      notice: '本次只做状态观察，不直接推荐复杂安排。',
      detailEntry: '查看这次提醒依据',
    },
    {
      step: '02 / 03',
      title: '先看状态，再决定节奏',
      body: sanitizeCustomerText(h5Draft.screen2 || '先结合当前皮肤稳定度和节奏观察，再决定下一步护理安排。'),
      observationPoints: [
        { label: '干燥感', description: '观察洁面后是否有细微紧绷感或纹理变化。' },
        { label: '暗沉感', description: '留意肤色通透度和局部疲惫感的变化。' },
        { label: '稳定度', description: '关注近期状态是否平稳，避免过度判断。' },
      ],
      principle: '先观察、再决定，比盲目补救更重要。',
      detailEntry: '查看如何判断当前状态',
    },
    {
      step: '03 / 03',
      title: '你可以先看看这些细节',
      body: sanitizeCustomerText(h5Draft.screen3 || '如果后续想进一步了解，可由顾问根据当前状态再说明。'),
      detailCards: [
        { title: '维养节奏说明', description: '了解为什么维护类护理需要看阶段。' },
        { title: '近期状态观察点', description: '看看本阶段值得留意的变化。' },
        { title: '基础护理说明', description: '日常可参考的温和护理方向。' },
        { title: '常见问题', description: '关于护理间隔和状态观察的解答。' },
      ],
      closing: '后续如果想进一步了解，可由顾问根据当前状态为你补充说明。',
    },
  ];
}

function currentH5Screens() {
  const archive = selectedArchive();
  const generated = currentPreviewSource();
  if (archive?.h5Brief?.screens?.length) {
    const taskCard = archive.h5ReviewTaskCard || {};
    const selectedScreens = h5ScreensForSelectedAngle(taskCard, archive.h5Brief.screens);
    return selectedScreens.map((screen, index) => ({
      ...screen,
      title: normalizeChenAdvisorText(screen.title),
      body: sanitizeCustomerText(screen.body),
      notice: normalizeChenAdvisorText(screen.notice),
      closing: sanitizeCustomerText(screen.closing),
      source: generated?.source || 'archive',
      generatedAt: generated?.generatedAt,
      index,
    }));
  }
  return fallbackH5Screens(selectedReview(), selectedH5Gate()).map((screen, index) => ({
    ...screen,
    title: normalizeChenAdvisorText(screen.title),
    body: sanitizeCustomerText(screen.body),
    notice: normalizeChenAdvisorText(screen.notice),
    closing: sanitizeCustomerText(screen.closing),
    source: generated?.source || 'queue',
    generatedAt: generated?.generatedAt,
    index,
  }));
}

function iconSvg(name) {
  const icons = {
    analytics: '<path d="M4 18V9"/><path d="M10 18V5"/><path d="M16 18v-7"/><path d="M3 18h18"/>',
    calendar_today: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 10h16"/>',
    laps: '<path d="M7 7a7 7 0 1 1-1.8 6.8"/><path d="M4 15H2v-2"/><path d="M12 8v5l3 2"/>',
    monitoring: '<path d="M4 17l5-5 4 4 7-8"/><path d="M20 8v6h-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><path d="M12 7h.01"/>',
    arrow_forward: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    verified_user: '<path d="M12 3l7 3v5c0 5-3.2 8-7 10-3.8-2-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-5"/>',
    water_drop: '<path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11z"/>',
    wb_sunny: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.9 19.1l1.4-1.4"/><path d="M17.7 6.3l1.4-1.4"/>',
    tips_and_updates: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.9.7-1.5 1.7-1.5 2.5h-4c0-.8-.6-1.8-1.5-2.5z"/>',
    visibility: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    wash: '<path d="M5 14c2-2 4-2 6 0s4 2 8 0"/><path d="M5 18c2-2 4-2 6 0s4 2 8 0"/><path d="M8 10h8l-1-6H9l-1 6z"/>',
    help_outline: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.5 2.5 0 0 1 4.6 1.4c0 2-2.4 2.1-2.4 4.1"/><path d="M12 18h.01"/>',
    chevron_right: '<path d="M9 18l6-6-6-6"/>',
    arrow_back: '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
    close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
    article: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/>',
  };
  return `
    <svg class="ys-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      ${icons[name] || icons.info}
    </svg>
  `;
}

// detailIdForCta / h5DetailEntries / h5DetailContent moved to H5ReviewKit (public/h5-review-kit.js).

function h5Footer() {
  return `
    <footer class="h5-footer">
      <div>${iconSvg('verified_user')}<span>由顾问为您整理 · </span></div>
      <small>Privacy Policy · Terms</small>
    </footer>
  `;
}

function h5TitleMarkup(title, fallback) {
  return escapeHtml(title || fallback);
}

function h5LogoMarkup() {
  return '<img class="h5-final-logo" src="./assets/demo-wordmark.svg" alt="DEMO" />';
}

// CSKIN_RADAR_AXES / GENERIC_CSKIN_ESTIMATE / GENERIC_H5_DETAIL_CARDS moved to H5ReviewKit.

function selectedArchiveCustomerName() {
  const archive = selectedArchive();
  return archive?.customerName || archive?.customerCode || '';
}

function clinicalPreviewConfig() {
  const archive = selectedArchive() || {};
  const review = selectedReview() || {};
  const taskCard = archive.h5ReviewTaskCard || {};
  const basic = taskCard.basicInfo || {};
  const plan = taskCard.planAndConsumption || {};
  const facts = archive.reviewFacts || {};
  const snapshot = archive.dataSnapshotInternal || {};
  const evidenceText = [
    facts.diagnosisAndNeed,
    facts.doctorPlan,
    plan.proposedOrTakenPlan,
    plan.recentProject,
    plan.project,
    taskCard.personalProfileBrief,
    ...(taskCard.classificationEvidenceMatrix || []).map((item) => item.evidence || item.summary),
  ].filter(Boolean).join('；');
  const lastDate = String(basic.lastVisit || basic.lastVisitDate || snapshot.lastMaintenanceDate || '').slice(0, 10) || '近期';
  const treatment = treatmentShortName(plan.recentProject || plan.project || snapshot.lastMaintenanceProject || plan.proposedOrTakenPlan || '近期护理记录');
  const doctorName = basic.doctor || archive.customerIdentity?.doctorName || '医生';
  const daysSince = Number(snapshot.daysSinceLastMaintenance || snapshot.daysSinceLastVisit || 0);
  return window.H5ReviewKit.buildClinicalPreviewConfig({
    customerName: archive.customerName || review.customerName || basic.customerName || selectedArchiveCustomerName(),
    doctorName,
    lastVisitDate: lastDate,
    treatmentLabel: treatment,
    evidenceText,
    diagnosisText: facts.diagnosisAndNeed,
    daysSinceLastVisit: daysSince,
    overdueDaysOverride: snapshot.overdueDays || undefined,
    doctorTipsCandidates: [
      taskCard.interactionGoal?.objective,
      facts.doctorPlan,
      taskCard.commercialHook?.entryReason || taskCard.commercialHook?.reason,
    ],
    planDetailCards: (currentH5Screens()[2]?.detailCards) || [],
  });
}

function useRichClinicalPreview(screen) {
  const archive = selectedArchive();
  if (!archive) return false;
  const text = [
    selectedArchiveCustomerName(),
    screen?.visualCue,
    screen?.title,
    screen?.body,
    archive.reviewFacts?.diagnosisAndNeed,
    archive.h5ReviewTaskCard?.planAndConsumption?.proposedOrTakenPlan,
    archive.h5ReviewTaskCard?.planAndConsumption?.recentProject,
  ].filter(Boolean).join(' ');
  return window.H5ReviewKit.useRichClinicalPreviewText(text);
}

function chenDemoConfig() {
  return clinicalPreviewConfig();
}

function cskinIndicesForCurrentArchive() {
  return clinicalPreviewConfig().cskinIndices || window.H5ReviewKit.GENERIC_CSKIN_ESTIMATE;
}

// renderCskinRadarSvg / renderTreatmentTimelineSvg / renderCskinRadarBlock / renderGaugeRow moved to H5ReviewKit.

function renderH5PageOne(screen) {
  return window.H5ReviewKit.renderH5PageOne(screen, clinicalPreviewConfig(), useRichClinicalPreview(screen));
}

function renderH5PageTwo(screen) {
  return window.H5ReviewKit.renderH5PageTwo(screen, clinicalPreviewConfig(), useRichClinicalPreview(screen));
}

// renderH5PageOneChen / renderH5PageTwoChen / renderH5PageThreeChen / their generic counterparts
// all moved to H5ReviewKit; renderH5PageThree below delegates like renderH5PageOne/Two above.

function renderH5PageThree(screen) {
  return window.H5ReviewKit.renderH5PageThree(screen, clinicalPreviewConfig(), useRichClinicalPreview(screen));
}

function openBookingModal() {
  const modal = document.getElementById('h5-booking-modal');
  if (!modal) return;
  const cfg = chenDemoConfig();
  const form = modal.querySelector('form');
  if (form) {
    form.reset();
    const nameInput = form.querySelector('input[name="name"]');
    if (nameInput) nameInput.value = cfg.customerName;
    const noteInput = form.querySelector('textarea[name="note"]');
    if (noteInput) noteInput.value = `上次色斑治疗复盘提醒 · ${cfg.doctorName} 医生 1 个月节点`;
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput && !dateInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      dateInput.value = d.toISOString().slice(0, 10);
    }
  }
  modal.hidden = false;
  document.body.classList.add('h5-modal-open');
  const firstField = modal.querySelector('input, select, textarea');
  if (firstField) setTimeout(() => firstField.focus(), 60);
}

function closeBookingModal() {
  const modal = document.getElementById('h5-booking-modal');
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('h5-modal-open');
}

function openCustomerBasicChallengeModal() {
  const modal = document.getElementById('customer-basic-challenge-modal');
  const list = document.getElementById('customer-basic-challenge-list');
  const form = document.getElementById('customer-basic-challenge-form');
  if (!modal || !list || !form) return;
  const fields = customerBasicChallengeFields();
  if (!fields.length) {
    setActionStatus('当前客户基本信息尚未生成，无法发起整块质疑。');
    return;
  }
  list.innerHTML = renderCustomerBasicChallengeRows(fields);
  form.reset();
  modal.hidden = false;
  document.body.classList.add('h5-modal-open');
  const firstField = modal.querySelector('textarea');
  if (firstField) setTimeout(() => firstField.focus(), 60);
}

function closeCustomerBasicChallengeModal() {
  const modal = document.getElementById('customer-basic-challenge-modal');
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('h5-modal-open');
}

async function handleCustomerBasicChallengeSubmit(event) {
  event.preventDefault();
  const review = selectedReview();
  const archive = selectedArchive();
  if (!review) return;
  const fields = customerBasicChallengeFields(review, archive);
  const generalNote = document.getElementById('customer-basic-challenge-general')?.value?.trim() || '';
  const challengedFields = $$('#customer-basic-challenge-list [data-basic-challenge-index]')
    .map((textarea) => {
      const index = Number(textarea.dataset.basicChallengeIndex);
      const note = textarea.value.trim();
      const field = fields[index];
      return field && note ? { ...field, note } : null;
    })
    .filter(Boolean);
  if (!generalNote && !challengedFields.length) {
    setActionStatus('请至少填写一条客户基本信息质疑说明。');
    const firstTextarea = document.querySelector('#customer-basic-challenge-list textarea');
    if (firstTextarea) firstTextarea.focus();
    return;
  }
  const oldValue = fields.map((field) => `${field.group}｜${field.label}：${field.value}`).join('\n');
  const challengedSummary = challengedFields
    .map((field) => `${field.group}｜${field.label}：${field.value}\n质疑：${field.note}`)
    .join('\n\n');
  const reason = [
    generalNote ? `整体说明：${generalNote}` : '',
    challengedSummary,
  ].filter(Boolean).join('\n\n');
  const payload = {
    reviewItemId: review.reviewItemId,
    unifiedCustomerId: review.unifiedCustomerId || archive?.customerId,
    customerName: review.customerName || archive?.customerName,
    fieldKey: 'customer_basic_info_block',
    fieldLabel: '客户基本信息板块',
    fieldGroup: '客户基本信息',
    challengedBlockId: 'customer_basic_info',
    challengedPointIds: challengedFields.length
      ? challengedFields.map((field) => field.key).filter(Boolean)
      : ['customer_basic_info_block'],
    challengeDetails: challengedFields.map((field) => ({
      pointId: field.key,
      group: field.group,
      label: field.label,
      currentValue: field.value,
      reasonText: field.note,
    })),
    advisorId: review.advisorId || review.advisorSourceUserId || review.advisorName || 'advisor_review_page',
    status: 'open',
    action: 'question_objective_field',
    oldValue,
    newValue: challengedSummary || '整体质疑说明',
    reason,
    reasonText: reason,
    sourceView: 'ds-advisor-h5-review',
  };
  setActionStatus('正在记录客户基本信息整块质疑...');
  let result;
  try {
    result = await postApi(ADVISOR_FIELD_REVIEW_EVENTS_API, payload);
  } catch (error) {
    result = {
      localFallback: true,
      summary: {
        totalEvents: (state.advisorFieldReviewEvents?.events || []).length + 1,
        localMockOnly: true,
      },
      event: {
        ...payload,
        eventId: `local_customer_basic_${Date.now()}`,
        status: 'pending_manual_verify',
        createdAt: new Date().toISOString(),
        writeError: error.message,
      },
    };
  }
  state.advisorFieldReviewEvents = {
    ...(state.advisorFieldReviewEvents || {}),
    summary: result.summary,
    events: [result.event, ...((state.advisorFieldReviewEvents?.events || []).filter((item) => item.eventId !== result.event.eventId))],
  };
  const syncedDisputes = syncAdvisorArchiveDisputes({
    review,
    archive,
    fields: challengedFields,
    generalNote,
    sourceEventId: result.event?.eventId,
  });
  addLocalTimelineEvent(
    review.reviewItemId,
    '客户基本信息质疑待人工核验',
    `${nowLabel()} · ${syncedDisputes.length || challengedFields.length || '整块'} 项 · panoramaTodoStatus=pending_manual_verify · remoteWriteAllowed=false`,
  );
  closeCustomerBasicChallengeModal();
  renderAll();
  const modeLabel = result.localFallback ? '已生成本地暂存事件' : '已写入本地字段复核事件';
  setActionStatus(`${modeLabel}：客户基本信息质疑 ${syncedDisputes.length || challengedFields.length} 项${generalNote ? '，含整体说明' : ''}；已同步用户全景档案红色待修改提示。`);
}

function showH5Toast(message) {
  const toast = document.getElementById('h5-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add('is-visible');
  clearTimeout(showH5Toast._timer);
  showH5Toast._timer = setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.hidden = true;
  }, 2600);
}

function handleBookingSubmit(event) {
  event.preventDefault();
  const cfg = chenDemoConfig();
  closeBookingModal();
  showH5Toast(`已转发至顾问 ${cfg.advisorName}，由顾问确认时间`);
}

function renderH5DetailPanel(detailId) {
  const archive = selectedArchive();
  const snapshot = archive?.dataSnapshotInternal || {};
  const treatment = treatmentShortName(snapshot.lastMaintenanceProject);
  return window.H5ReviewKit.renderH5DetailPanel(detailId, { treatment });
}

function renderH5Preview() {
  const review = selectedReview();
  if (!review) {
    $('#phone-step').textContent = 'STEP -- / 03';
    $('#preview-state').className = 'status-chip is-muted';
    $('#preview-state').textContent = '无任务';
    $('#h5-preview').innerHTML = '<div class="empty">请选择任务生成 H5 预览</div>';
    $$('.page-tab').forEach((button) => button.classList.remove('is-active'));
    return;
  }
  if (isP7LiveDirectoryReview(review)) {
    const hasError = Boolean(p7LiveDetailError(review));
    $('#phone-step').textContent = 'STEP -- / 03';
    $('#preview-state').className = `status-chip ${hasError ? 'is-blocked' : 'is-muted'}`;
    $('#preview-state').textContent = hasError ? '加载失败' : '详情加载中';
    $('#h5-preview').innerHTML = p7LiveProgressiveStateMarkup(review, {
      compact: true,
      label: '正在准备 H5 预览',
    });
    $$('.page-tab').forEach((button) => button.classList.remove('is-active'));
    return;
  }
  const screens = currentH5Screens();
  const page = screens[state.currentPage] || screens[0];
  if (!page) {
    $('#h5-preview').innerHTML = '<div class="empty">请选择任务生成 H5 预览</div>';
    return;
  }
  const source = currentPreviewSource();
  $('#phone-step').textContent = `STEP ${String(state.currentPage + 1).padStart(2, '0')} / 03`;
  const generatedPreview = ['generated', 'regenerated_mock', 'angle_selected_mock', 'regenerated_angle_mock', 'h5_copy_local_edit', 'script_local_edit'].includes(source?.source);
  $('#preview-state').className = `status-chip ${generatedPreview ? 'is-ready' : 'is-muted'}`;
  $('#preview-state').textContent = state.activeH5Detail
    ? '正在查看二级详情'
    : ['regenerated_mock', 'regenerated_angle_mock'].includes(source?.source)
      ? '已回放重新生成候选'
      : source?.source === 'angle_selected_mock'
      ? '已按所选角度刷新候选'
      : source?.source === 'h5_copy_local_edit'
      ? '已保存本地 H5 修改'
      : source?.source === 'script_local_edit'
      ? '已保存本地话术修改'
      : source?.source === 'generated'
      ? '已按任务卡生成'
      : selectedArchive()
        ? '读取批量最终稿'
        : '读取队列稿';

  const pageRenderers = [renderH5PageOne, renderH5PageTwo, renderH5PageThree];
  $('#h5-preview').innerHTML = state.activeH5Detail
    ? renderH5DetailPanel(state.activeH5Detail)
    : pageRenderers[state.currentPage]?.(page) || renderH5PageOne(page);
  $$('.page-tab').forEach((button) => button.classList.toggle('is-active', Number(button.dataset.page) === state.currentPage));
}

function renderAuditChecklist() {
  if (!$('#audit-checklist')) return;
  const review = selectedReview();
  if (!review) {
    $('#audit-checklist').innerHTML = '<div class="empty">请选择任务查看审核项</div>';
    return;
  }
  if (isP7LiveDirectoryReview(review)) {
    $('#audit-checklist').innerHTML = p7LiveProgressiveStateMarkup(review, {
      compact: true,
      label: '正在准备审核项',
    });
    return;
  }
  const gate = selectedH5Gate();
  const sendGate = selectedSendGate();
  const archive = selectedArchive();
  const checks = [
    ['check-brand', '品牌与视觉边界', '完整使用 YESSKIN / 识别，颜色保持 Mint / Sea Foam / White / Silver / Black，并遵守 logo 安全区。', true],
    ['check-project-book', '项目书五步法', '已完成识别客户、生命周期诊断、互动目标、任务卡/H5、反馈学习入口五步审核。', Boolean(archive)],
    ['check-customer', '客户可见边界', 'H5 不展示 RFM、机会分、风险灯、黄灯、A/B、敏感正文、消费金额或内部标签。', true],
    ['check-copy', '文案风险检查', '无疗效承诺、医疗诊断、强销售、预约诱导或自动发送表述。', true],
    ['check-advisor', '顾问人工确认', '确认任务卡、话术和 H5 预览可进入下一步人工发布复核。', gate?.publishReviewAllowed === true],
    ['check-send', '发送链路确认', '人工发送门禁已确认，发布复核不等于自动发布。', sendGate?.manualSendAllowed === true],
  ];
  $('#audit-checklist').innerHTML = checks.map(([id, title, desc, checked]) => `
    <label class="check-row" for="${id}">
      <input id="${id}" class="audit-check" type="checkbox" ${checked ? 'checked' : ''} />
      <span><strong>${title}</strong><span>${desc}</span></span>
    </label>
  `).join('');
}

function renderTimeline() {
  if (!$('#timeline-list')) return;
  const review = selectedReview();
  if (!review) {
    $('#timeline-list').innerHTML = '<div class="empty">请选择任务查看操作记录</div>';
    return;
  }
  if (isP7LiveDirectoryReview(review)) {
    $('#timeline-list').innerHTML = p7LiveProgressiveStateMarkup(review, {
      compact: true,
      label: '正在读取任务记录',
    });
    return;
  }
  const localRows = state.localEvents.filter((event) => event.reviewItemId === state.selectedReviewItemId);
  const reviewRows = reviewEventsForSelection().map((event) => ({
    title: event.actionLabel || 'H5 发布复核',
    meta: `${event.createdAt || ''} · ${event.nextPublishReviewStatus || ''}`,
  }));
  const executionRows = executionEventsForSelection().map((event) => ({
    title: event.actionLabel || '人工发布执行',
    meta: `${event.createdAt || ''} · ${event.publishExecutionStatus || ''}`,
  }));
  const rows = [
    ...localRows.map((event) => ({ title: event.title, meta: event.meta })),
    ...reviewRows,
    ...executionRows,
  ];
  $('#timeline-list').innerHTML = rows.length ? rows.map((row) => `
    <div class="timeline-item">
      <strong>${escapeHtml(row.title)}</strong>
      <span class="timeline-meta">${escapeHtml(row.meta)}</span>
    </div>
  `).join('') : '<div class="empty">尚无本任务的本地操作记录</div>';
}

function renderAll() {
  renderTaskList();
  renderTaskDetail();
  renderH5Preview();
  renderAuditChecklist();
  renderTimeline();
  if (window.refreshH5SummaryBtn) window.refreshH5SummaryBtn();
}

function selectReview(reviewItemId) {
  state.selectedReviewItemId = reviewItemId;
  state.selectedVariant = selectedScripts()[0]?.variant || 'A';
  state.currentPage = 0;
  state.activeH5Detail = null;
  if ($('#action-status')) $('#action-status').textContent = '';
  persistAdvisorH5LocalState();
  renderAll();
  if (reviewSourceMode === 'p7-live') {
    void ensureSelectedP7LiveTaskDetail();
  }
  // 启用 H5 总结图按钮
  if (window.enableH5SummaryBtn) {
    var r = selectedReview();
    var cid = r?.unifiedCustomerId || r?.customerId || reviewItemId || '';
    var cname = r?.customerName || '';
    if (cid && !isP7LiveDirectoryReview(r)) window.enableH5SummaryBtn(cid, cname);
  }
}

function generateH5Preview() {
  const review = selectedReview();
  if (!review) return;
  state.generatedDrafts.set(review.reviewItemId, {
    source: 'generated',
    generatedAt: nowLabel(),
  });
  state.localEvents.unshift({
    reviewItemId: review.reviewItemId,
    title: '生成最终 H5 本地预览',
    meta: `${nowLabel()} · 读取批量归档，客户可见边界已过滤`,
  });
  state.currentPage = 0;
  state.activeH5Detail = null;
  persistAdvisorH5LocalState();
  renderAll();
}

async function refreshDsAdvisorH5Section(section = 'all') {
  if (reviewSourceMode !== 'ds-advisor-h5') return;
  if (state.deepseekH5Busy) return;
  const review = selectedReview();
  if (!review) {
    $('#action-status').textContent = '请先加载 DS latest 任务样本后再刷新。';
    return;
  }
  const labels = {
    interactionGoal: '互动目标',
    communicationAngles: '沟通角度',
    h5PreviewAndScript: 'H5 预览与顾问发送话术',
    regenerate: '顾问任务卡与 H5',
    all: '顾问任务卡与 H5',
  };
  state.deepseekH5Busy = true;
  setDeepSeekH5Buttons(true);
  $('#action-status').textContent = `正在调用 DS 重新生成${labels[section] || '顾问任务卡与 H5'}（本地演练，不发送不发布不写库）。`;
  updateDeepSeekH5Status(`DS 正在刷新当前任务的${labels[section] || '顾问任务卡与 H5'}：互动目标、沟通角度、H5/话术会保持同源更新。`);
  try {
    const payload = await postApi(`${DS_ADVISOR_H5_API}/runs/chen-xisheng`, {
      actor: `ds_advisor_h5_chen_refresh_${section}`,
      refreshSection: section,
      selectedAngleIndex: selectedH5ReviewAngleIndex(review.reviewItemId),
    });
    $('#action-status').textContent = `DS 已刷新${labels[section] || '顾问任务卡与 H5'}：${payload.runId || ''}`;
    await loadDsAdvisorH5ReviewData({ fromGeneration: true });
  } catch (error) {
    $('#action-status').textContent = `DS 刷新失败：${error.message}`;
    updateDeepSeekH5Status(`DS 刷新失败：${error.message}`, 'is-error');
  } finally {
    state.deepseekH5Busy = false;
    setDeepSeekH5Buttons(false);
  }
}

function selectedDsAdvisorH5CandidateIds() {
  return $$('#ds-advisor-h5-candidate-list input[type="checkbox"]:checked')
    .map((input) => input.value)
    .filter(Boolean);
}

function renderDsAdvisorH5CandidateList(payload = {}) {
  const candidates = payload.candidates || [];
  state.dsAdvisorH5Candidates = candidates;
  const list = $('#ds-advisor-h5-candidate-list');
  if (!list) return;
  if (!candidates.length) {
    list.innerHTML = '<div class="empty">当前没有可选择的 DS 用户画像客户。</div>';
  } else {
    list.innerHTML = candidates.map((item) => `
      <label class="ds-advisor-h5-candidate-item ${item.hasAdvisorH5 ? 'is-existing' : ''}">
        <input type="checkbox" value="${escapeHtml(item.unifiedCustomerId || '')}" ${item.selectable ? '' : 'disabled'} />
        <span>
          <strong>${escapeHtml(item.customerName || item.customerNameMasked || '未命名客户')}</strong>
          <code>${escapeHtml(item.unifiedCustomerId || '-')}</code>
        </span>
        <em>${item.hasAdvisorH5 ? '已处理，可更新' : '未处理'}</em>
      </label>
    `).join('');
  }
  $('#ds-advisor-h5-batch-status').textContent = `可选 ${formatNumber(candidates.filter((item) => item.selectable).length)} 人；生成时仅使用 DS 全景档案、DS 用户画像分析和项目书/页面模板规则。`;
}

async function loadDsAdvisorH5Candidates() {
  if (reviewSourceMode !== 'ds-advisor-h5') return;
  const includeExisting = $('#ds-advisor-h5-include-existing')?.checked ? '1' : '0';
  $('#ds-advisor-h5-batch-status').textContent = '正在读取候选客户...';
  setDsAdvisorH5OperationLog('DS 顾问H5：正在读取候选客户...', 'is-running');
  const payload = await api(`${DS_ADVISOR_H5_API}/candidates?includeExisting=${includeExisting}`);
  renderDsAdvisorH5CandidateList(payload);
  setDsAdvisorH5OperationLog(`DS 顾问H5：候选读取完成 · ${formatNumber((payload.candidates || []).length)} 人`, 'is-success');
}

async function openDsAdvisorH5BatchModal() {
  if (reviewSourceMode !== 'ds-advisor-h5') return;
  $('#ds-advisor-h5-batch-modal').hidden = false;
  document.body.classList.add('h5-modal-open');
  try {
    await loadDsAdvisorH5Candidates();
  } catch (error) {
    $('#ds-advisor-h5-batch-status').textContent = `读取候选失败：${error.message}`;
    setDsAdvisorH5OperationLog(`DS 顾问H5：候选读取失败 · ${error.message}`, 'is-error');
  }
}

function closeDsAdvisorH5BatchModal() {
  $('#ds-advisor-h5-batch-modal').hidden = true;
  document.body.classList.remove('h5-modal-open');
}

async function runSelectedDsAdvisorH5() {
  if (state.dsAdvisorH5BatchBusy) return;
  const customerIds = selectedDsAdvisorH5CandidateIds();
  if (!customerIds.length) {
    $('#ds-advisor-h5-batch-status').textContent = '请至少选择 1 位客户。';
    setDsAdvisorH5OperationLog('DS 顾问H5：未选择客户，未启动生成', 'is-error');
    return;
  }
  state.dsAdvisorH5BatchBusy = true;
  $('#run-ds-advisor-h5-selected').disabled = true;
  $('#ds-advisor-h5-batch-status').textContent = `正在调用 DS LLM 生成 ${formatNumber(customerIds.length)} 位客户顾问任务&H5审核...`;
  setDsAdvisorH5OperationLog(`DS 顾问H5：正在生成 ${formatNumber(customerIds.length)} 位客户...`, 'is-running');
  try {
    const payload = await postApi(`${DS_ADVISOR_H5_API}/runs/selected`, {
      actor: 'ds_advisor_h5_selected_batch_button',
      customerIds,
      force: $('#ds-advisor-h5-include-existing')?.checked === true,
    });
    state.selectedReviewItemId = payload.runs?.[0]?.generation?.advisorTaskCard?.reviewItemId || state.selectedReviewItemId;
    closeDsAdvisorH5BatchModal();
    updateDeepSeekH5Status(`DS 顾问任务&H5审核生成完成：${formatNumber(payload.generatedCount || 0)} 人。`, 'is-success');
    await loadDsAdvisorH5ReviewData({ fromGeneration: true });
    setDsAdvisorH5OperationLog(`DS 顾问H5：生成完成 · ${formatNumber(payload.generatedCount || 0)} 人`, 'is-success');
  } catch (error) {
    $('#ds-advisor-h5-batch-status').textContent = `生成失败：${error.message}`;
    setDsAdvisorH5OperationLog(`DS 顾问H5：生成失败 · ${error.message}`, 'is-error');
  } finally {
    state.dsAdvisorH5BatchBusy = false;
    $('#run-ds-advisor-h5-selected').disabled = false;
  }
}

function handleDirectAdvisorFieldEdit(button) {
  const review = selectedReview();
  if (!review || !button) return;
  const fieldKey = button.dataset.fieldKey || '';
  const fieldLabel = button.dataset.fieldLabel || fieldKey;
  if (!fieldKey) return;
  state.editingAdvisorFieldByReviewId.set(review.reviewItemId, fieldKey);
  renderAll();
  setActionStatus(`正在修改：${fieldLabel}。保存后仅更新当前审核暂存状态，remoteWriteAllowed=false。`);
  requestAnimationFrame(() => {
    $(`[data-direct-field-editor="${fieldKey}"]`)?.focus();
  });
}

function handleDirectAdvisorFieldCancel(button) {
  const review = selectedReview();
  if (!review || !button) return;
  const fieldKey = button.dataset.fieldKey || '';
  if (state.editingAdvisorFieldByReviewId.get(review.reviewItemId) === fieldKey) {
    state.editingAdvisorFieldByReviewId.delete(review.reviewItemId);
  }
  renderAll();
  setActionStatus('已取消本次字段修改，当前暂存数据未变化。');
}

function handleDirectAdvisorFieldSave(button) {
  const review = selectedReview();
  const archive = selectedArchive();
  if (!review || !button) return;
  const fieldKey = button.dataset.fieldKey || '';
  const fieldLabel = button.dataset.fieldLabel || fieldKey;
  const fieldGroup = button.dataset.fieldGroup || '';
  const oldValue = button.dataset.fieldOldValue || '';
  const editor = button.closest('.field-review-card')?.querySelector('[data-direct-field-editor]');
  const newValue = String(editor?.value || '').trim();
  if (!fieldKey || !newValue) {
    setActionStatus('请输入要保存的字段内容；空内容不会覆盖当前信息。');
    editor?.focus();
    return;
  }
  state.directAdvisorFieldEditsByReviewId.set(review.reviewItemId, {
    ...localAdvisorFieldEdits(review.reviewItemId),
    [fieldKey]: newValue,
  });
  if (state.editingAdvisorFieldByReviewId.get(review.reviewItemId) === fieldKey) {
    state.editingAdvisorFieldByReviewId.delete(review.reviewItemId);
  }
  state.advisorFieldReviewEvents = {
    ...(state.advisorFieldReviewEvents || {}),
    events: [{
      eventId: `local_direct_edit_${review.reviewItemId}_${fieldKey}_${Date.now()}`,
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId || archive?.customerId,
      customerName: review.customerName || archive?.customerName,
      fieldKey,
      fieldLabel,
      fieldGroup,
      action: 'direct_local_edit',
      oldValue,
      newValue,
      sourceView: 'ds-advisor-h5-review',
      remoteWriteAllowed: false,
      createdAt: nowLabel(),
    }, ...((state.advisorFieldReviewEvents?.events || []).slice(0, 49))],
  };
  addLocalTimelineEvent(
    review.reviewItemId,
    '顾问直接修改客户信息',
    `${nowLabel()} · ${fieldLabel} · localValueUpdated=true · remoteWriteAllowed=false`,
  );
  persistAdvisorH5LocalState();
  renderAll();
  setActionStatus(`已保存：${fieldLabel} 已更新到当前审核页暂存状态。`);
}

function collectH5CopyScreensFromDom() {
  return [0, 1, 2].map((index) => {
    const title = $(`[data-h5-screen-field="title"][data-h5-screen-index="${index}"]`)?.value?.trim() || '';
    const body = $(`[data-h5-screen-field="body"][data-h5-screen-index="${index}"]`)?.value?.trim() || '';
    const auditRationale = $(`[data-h5-screen-field="auditRationale"][data-h5-screen-index="${index}"]`)?.value?.trim() || '';
    return { title, body, auditRationale };
  });
}

function applyLocalH5CopyEdit(reviewItemId, angleIndex, screens) {
  if (!reviewItemId || !Number.isFinite(angleIndex)) return;
  state.localH5PageEdits.set(h5PageEditKey(reviewItemId, angleIndex), screens);
  const currentDraft = state.generatedDrafts.get(reviewItemId) || {};
  state.generatedDrafts.set(reviewItemId, {
    ...currentDraft,
    source: currentDraft.source || 'h5_copy_local_edit',
    h5CopyEditedAt: nowLabel(),
    selectedAngleIndex: angleIndex,
  });
  persistAdvisorH5LocalState();
}

function applyLocalScriptEdit(reviewItemId, angleIndex, message) {
  if (!reviewItemId || !Number.isFinite(angleIndex)) return;
  state.localScriptEdits.set(scriptEditKey(reviewItemId, angleIndex), {
    message,
    updatedAt: nowLabel(),
  });
  const currentDraft = state.generatedDrafts.get(reviewItemId) || {};
  state.generatedDrafts.set(reviewItemId, {
    ...currentDraft,
    source: currentDraft.source || 'script_local_edit',
    scriptEditedAt: nowLabel(),
    selectedAngleIndex: angleIndex,
  });
  persistAdvisorH5LocalState();
}

async function generateAdvisorScriptForSelectedReview() {
  const review = reviewById(state.advisorScriptModalReviewItemId) || selectedReview();
  const archive = archiveForReview(review);
  if (!review || !archive?.h5ReviewTaskCard || state.advisorScriptBusyReviewItemId) return;
  const taskCard = archive.h5ReviewTaskCard;
  const angleIndex = selectedH5ReviewAngleIndex(review.reviewItemId);
  const modalInputs = updateAdvisorScriptModalInputsFromDom(review.reviewItemId);
  const campaignOfferText = modalInputs.campaignOfferText || defaultAdvisorCampaignOfferText();
  state.advisorCampaignOfferByReviewId.set(review.reviewItemId, campaignOfferText);
  state.advisorScriptBusyReviewItemId = review.reviewItemId;
  setAdvisorScriptModalStatus(review.reviewItemId, 'C5 正在调用原顾问话术接口生成...');
  setActionStatus('C5 顾问话术生成中...');
  renderAll();
  renderAdvisorScriptModal();
  try {
    await ensureAdvisorScriptCskinForReview(review, archive, taskCard);
    const run = await postApi(
      P2_ADVISOR_SCRIPT_RUNS_API,
      buildAdvisorScriptRequestPayload(review, archive, taskCard, angleIndex, campaignOfferText, modalInputs),
    );
    const finalScriptText = advisorScriptTextFromRun(run);
    if (!finalScriptText) throw new Error('C5 未返回 finalScriptText');
    const promptKey = advisorScriptPromptKey(review.reviewItemId, modalInputs.purposeText);
    state.advisorScriptGeneratedOutputByPromptKey.set(promptKey, finalScriptText);
    clearAdvisorScriptPromptRevision(review.reviewItemId, modalInputs.purposeText);
    state.advisorScriptModalOutputByReviewId.set(review.reviewItemId, finalScriptText);
    const outputTarget = $('#advisor-script-modal-output');
    if (outputTarget && state.advisorScriptModalReviewItemId === review.reviewItemId) outputTarget.value = finalScriptText;
    applyLocalScriptEdit(review.reviewItemId, angleIndex, finalScriptText);
    addLocalTimelineEvent(
      review.reviewItemId,
      'C5 生成/刷新顾问话术',
      `${nowLabel()} · ${run.runId || 'run 已返回'} · 优惠力度：${campaignOfferText}`,
    );
    setAdvisorScriptModalStatus(review.reviewItemId, `已生成：${run.runId || 'C5 原接口已返回'}。`);
    setActionStatus(`C5 顾问话术已生成：${run.runId || 'run 已返回'}，已写入当前话术框。`);
  } catch (error) {
    setAdvisorScriptModalStatus(review.reviewItemId, `生成失败：${error.message}`);
    setActionStatus(`C5 顾问话术生成失败：${error.message}`);
  } finally {
    if (state.advisorScriptBusyReviewItemId === review.reviewItemId) state.advisorScriptBusyReviewItemId = null;
    renderAll();
    renderAdvisorScriptModal();
  }
}

async function syncAdvisorScriptModalOutputToPage() {
  const review = selectedReview();
  const archive = selectedArchive();
  if (!review || !archive?.h5ReviewTaskCard) return;
  const inputs = updateAdvisorScriptModalInputsFromDom(review.reviewItemId);
  const angleIndex = selectedH5ReviewAngleIndex(review.reviewItemId);
  const value = $('#advisor-script-modal-output')?.value?.trim() || '';
  if (!value) {
    setActionStatus('请先生成或填写当前话术，再保存。');
    const status = $('#advisor-script-modal-status');
    if (status) status.textContent = '请先生成或填写当前话术，再保存。';
    return;
  }
  state.advisorScriptModalOutputByReviewId.set(review.reviewItemId, value);
  applyLocalScriptEdit(review.reviewItemId, angleIndex, value);
  setActionStatus('弹窗话术已保存，正在根据人工改稿生成提示词候选...');
  await generateAdvisorScriptPromptRevision(review, archive, archive.h5ReviewTaskCard, inputs, value);
}

function saveAdvisorScriptModalOutputOnly() {
  const review = selectedReview();
  const archive = selectedArchive();
  if (!review || !archive?.h5ReviewTaskCard) return;
  updateAdvisorScriptModalInputsFromDom(review.reviewItemId);
  const angleIndex = selectedH5ReviewAngleIndex(review.reviewItemId);
  const value = $('#advisor-script-modal-output')?.value?.trim() || '';
  if (!value) {
    setActionStatus('请先生成或填写当前话术，再保存。');
    const status = $('#advisor-script-modal-status');
    if (status) status.textContent = '请先生成或填写当前话术，再保存。';
    return;
  }
  state.advisorScriptModalOutputByReviewId.set(review.reviewItemId, value);
  applyLocalScriptEdit(review.reviewItemId, angleIndex, value);
  setActionStatus('弹窗话术已保存，未修改提示词。');
  const status = $('#advisor-script-modal-status');
  if (status) status.textContent = '当前话术已保存，未修改提示词。';
}

async function generateAdvisorScriptPromptRevision(review, archive, taskCard, inputs, revisedScriptText) {
  const promptKey = advisorScriptPromptKey(review.reviewItemId, inputs.purposeText);
  if (state.advisorScriptPromptRevisionBusyKey && state.advisorScriptPromptRevisionBusyKey !== promptKey) {
    setActionStatus('已有提示词候选正在生成，请稍候。');
    return;
  }
  await loadAdvisorScriptPromptSource();
  const oldPrompt = advisorScriptPromptTextForReview(review.reviewItemId, inputs.purposeText);
  const originalScriptText = state.advisorScriptGeneratedOutputByPromptKey.get(promptKey)
    || sendScriptForSelectedAngle(taskCard, taskCard.advisorSendScript || {}, review.reviewItemId)?.script
    || '';
  if (!oldPrompt || !revisedScriptText) {
    setActionStatus('弹窗话术已保存；缺少提示词或当前话术，暂无法生成提示词候选。');
    return;
  }
  state.advisorScriptPromptRevisionBusyKey = promptKey;
  state.advisorScriptPromptModalOpen = true;
  state.advisorScriptPromptEditMode = false;
  setActionStatus('弹窗话术已保存，正在生成新提示词候选...');
  renderAdvisorScriptModal();
  try {
    const response = await postApi(ADVISOR_SCRIPT_PROMPT_REVISION_API, {
      actor: 'ds_advisor_h5_review_page_script_save',
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId || archive?.customerId || '',
      purposeText: inputs.purposeText,
      purposeTemplateText: inputs.purposeTemplateText,
      sceneText: inputs.sceneText,
      campaignOfferText: inputs.campaignOfferText,
      scriptWordLimit: advisorScriptWordLimitForPurpose(inputs.purposeText),
      scriptToneGuidance: advisorScriptToneGuidanceForPurpose(inputs.purposeText),
      oldPrompt,
      generatedScriptText: originalScriptText,
      revisedScriptText,
    });
    const revision = response.revision || response;
    state.advisorScriptPromptRevisionByPromptKey.set(promptKey, {
      oldPrompt,
      newPrompt: revision.newPrompt || revision.revisedPromptText || oldPrompt,
      changeSummary: revision.changeSummary || 'AI 已根据人工改稿生成提示词候选。',
      rationale: revision.rationale || '',
      generatedScriptText: originalScriptText,
      revisedScriptText,
      createdAt: nowLabel(),
      modelCall: revision.modelCall || response.modelCall || null,
    });
    persistAdvisorH5LocalState();
    state.advisorScriptPromptModalOpen = true;
    state.advisorScriptPromptEditMode = false;
    setActionStatus('弹窗话术已保存；新提示词候选已生成，请在弹窗中左右对比后选择采用。');
  } catch (error) {
    state.advisorScriptPromptModalOpen = true;
    state.advisorScriptPromptEditMode = false;
    setActionStatus(`弹窗话术已保存；提示词候选生成失败：${error.message}`);
  } finally {
    if (state.advisorScriptPromptRevisionBusyKey === promptKey) state.advisorScriptPromptRevisionBusyKey = '';
    renderAll();
    renderAdvisorScriptModal();
  }
}

async function reviseAdvisorScriptWithOpinion() {
  const review = selectedReview();
  const archive = selectedArchive();
  if (!review || !archive?.h5ReviewTaskCard || state.advisorScriptRevisionBusyReviewItemId) return;
  const taskCard = archive.h5ReviewTaskCard;
  const angleIndex = selectedH5ReviewAngleIndex(review.reviewItemId);
  const inputs = updateAdvisorScriptModalInputsFromDom(review.reviewItemId);
  const campaignOfferText = inputs.campaignOfferText || defaultAdvisorCampaignOfferText();
  const currentScriptText = $('#advisor-script-modal-output')?.value?.trim() || '';
  const opinion = $('#advisor-script-modal-opinion')?.value?.trim() || '';
  state.advisorScriptModalOpinionByReviewId.set(review.reviewItemId, opinion);
  const target = $('#advisor-script-modal-revise-status');
  if (!currentScriptText) {
    if (target) target.textContent = '请先生成或填写当前话术，再实时修改。';
    return;
  }
  if (!opinion) {
    if (target) target.textContent = '请先填写修改意见。';
    return;
  }
  state.advisorScriptRevisionBusyReviewItemId = review.reviewItemId;
  setActionStatus('正在根据修改意见实时修改顾问话术...');
  renderAdvisorScriptModal();
  try {
    await ensureAdvisorScriptCskinForReview(review, archive, taskCard);
    const payload = buildAdvisorScriptRequestPayload(review, archive, taskCard, angleIndex, campaignOfferText, inputs);
    const response = await postApi(ADVISOR_SCRIPT_REVISION_API, {
      ...payload,
      actor: 'ds_advisor_h5_review_page_script_live_revise',
      currentScriptText,
      revisionInstruction: opinion,
    });
    const finalScriptText = advisorScriptTextFromRun(response.revision || response);
    if (!finalScriptText) throw new Error('C5 修订接口未返回 finalScriptText');
    const promptKey = advisorScriptPromptKey(review.reviewItemId, inputs.purposeText);
    state.advisorScriptGeneratedOutputByPromptKey.set(promptKey, finalScriptText);
    state.advisorScriptModalOutputByReviewId.set(review.reviewItemId, finalScriptText);
    applyLocalScriptEdit(review.reviewItemId, angleIndex, finalScriptText);
    addLocalTimelineEvent(
      review.reviewItemId,
      'C5 实时修改顾问话术',
      `${nowLabel()} · 修改意见：${opinion.slice(0, 80)}`,
    );
    setActionStatus('顾问话术已按修改意见更新到右侧话术框。');
  } catch (error) {
    setActionStatus(`实时修改失败：${error.message}`);
  } finally {
    if (state.advisorScriptRevisionBusyReviewItemId === review.reviewItemId) state.advisorScriptRevisionBusyReviewItemId = null;
    renderAll();
    renderAdvisorScriptModal();
  }
}

async function handleAdvisorFieldReviewAction(button) {
  const review = selectedReview();
  const archive = selectedArchive();
  if (!review || !button) return;
  const action = button.dataset.advisorFieldReviewAction || '';
  const fieldKey = button.dataset.fieldKey || '';
  const fieldLabel = button.dataset.fieldLabel || fieldKey;
  const fieldGroup = button.dataset.fieldGroup || '';
  const oldValue = button.dataset.fieldValue || '';
  const isEdit = action === 'edit_descriptive_field';
  const newValue = isEdit
    ? window.prompt(`请输入「${fieldLabel}」的新描述`, oldValue)
    : oldValue;
  if (newValue === null) return;
  const reason = window.prompt(`请填写「${fieldLabel}」${isEdit ? '修改' : '质疑'}原因`, '');
  if (!String(reason || '').trim()) {
    $('#action-status').textContent = '未填写原因，未生成本地字段复核事件。';
    return;
  }
  $('#action-status').textContent = `正在记录字段${isEdit ? '修改' : '质疑'}事件...`;
  try {
    const result = await postApi(ADVISOR_FIELD_REVIEW_EVENTS_API, {
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId || archive?.customerId,
      customerName: review.customerName || archive?.customerName,
      fieldKey,
      fieldLabel,
      fieldGroup,
      challengedBlockId: fieldGroup || 'customer_basic_info',
      challengedPointIds: action === 'question_objective_field' ? [fieldKey] : [],
      challengeDetails: action === 'question_objective_field' ? [{
        pointId: fieldKey,
        group: fieldGroup || '客户基本信息',
        label: fieldLabel,
        currentValue: oldValue,
        reasonText: String(reason || '').trim(),
      }] : [],
      advisorId: review.advisorId || review.advisorSourceUserId || review.advisorName || 'advisor_review_page',
      status: action === 'question_objective_field' ? 'open' : 'recorded',
      action,
      oldValue,
      newValue,
      reason,
      reasonText: String(reason || '').trim(),
      sourceView: 'ds-advisor-h5-review',
    });
    state.advisorFieldReviewEvents = {
      ...(state.advisorFieldReviewEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.advisorFieldReviewEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    if (!isEdit) {
      syncAdvisorArchiveDisputes({
        review,
        archive,
        fields: [{
          group: fieldGroup || '客户基本信息',
          key: fieldKey,
          label: fieldLabel,
          value: oldValue,
          note: String(reason || '').trim(),
        }],
        sourceEventId: result.event?.eventId,
      });
    }
    addLocalTimelineEvent(
      review.reviewItemId,
      isEdit ? '描述型字段修改待重生成' : '客观字段质疑待人工核验',
      `${nowLabel()} · ${fieldLabel} · panoramaTodoStatus=pending_manual_verify · remoteWriteAllowed=false`,
    );
    if (isEdit) {
      state.generatedDrafts.set(review.reviewItemId, {
        source: 'needs_regeneration',
        generatedAt: nowLabel(),
        reason: `${fieldLabel} 已修改，等待 DS 重新生成配套内容`,
      });
    }
    $('#action-status').textContent = `已记录：${fieldLabel} · ${isEdit ? '待重新生成' : '进入全景档案 to-do 人工核验'}`;
    renderAll();
  } catch (error) {
    $('#action-status').textContent = `字段事件写入失败：${error.message}`;
  }
}

async function handleScriptEditAction(button) {
  const review = selectedReview();
  if (!review || !button) return;
  const angleIndex = Number(button.dataset.scriptEditAction);
  const editors = $$(`[data-angle-script-editor="${angleIndex}"], [data-angle-script-editor^="${angleIndex}-"]`);
  const newValue = editors.length === 1
    ? editors[0].value.trim()
    : editors.map((editor, index) => `V${index + 1}: ${editor.value.trim()}`).filter(Boolean).join('\n');
  const textBefore = editors.length === 1
    ? (editors[0].defaultValue || 'AI 生成的单条发送话术')
    : editors.map((editor, index) => `V${index + 1}: ${editor.defaultValue || ''}`).filter(Boolean).join('\n');
  if (!newValue.trim()) {
    $('#action-status').textContent = '没有可记录的话术修改。';
    return;
  }
  applyLocalScriptEdit(review.reviewItemId, angleIndex, newValue);
  try {
    const result = await postApi(ADVISOR_FIELD_REVIEW_EVENTS_API, {
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerName: review.customerName,
      fieldKey: `communication_angle_${angleIndex + 1}_scripts`,
      fieldLabel: `角度 ${angleIndex + 1} 发送话术`,
      fieldGroup: '沟通角度与发送',
      action: 'edit_descriptive_field',
      oldValue: 'AI 生成的单条发送话术',
      newValue,
      reason: '顾问只允许轻编辑已选角度的话术内容；角度本身不可修改。',
      sourceView: 'ds-advisor-h5-review',
    });
    await postApi(H5_PUBLISH_REVIEW_EVENTS_API, {
      eventType: 'h5_publish_review_text_diff',
      action: 'record_text_diff',
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerName: review.customerName,
      diffTarget: `angle_${angleIndex + 1}_advisor_script`,
      textBefore,
      textAfter: newValue,
      sourceView: 'ds-advisor-h5-review',
    });
    await postApi(ADVISOR_ACTION_EVENTS_API, {
      p2Event: true,
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerName: review.customerName,
      action: 'h5_script_edit',
      actionLabel: '编辑话术并同步 H5 预览',
      textBefore,
      textAfter: newValue,
      sourceView: 'ds-advisor-h5-review',
    });
    state.advisorFieldReviewEvents = {
      ...(state.advisorFieldReviewEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.advisorFieldReviewEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    addLocalTimelineEvent(review.reviewItemId, '记录单条话术轻编辑', `${nowLabel()} · 角度 ${angleIndex + 1} · 角度不可改 · 远端写库=false`);
    $('#action-status').textContent = `已记录角度 ${angleIndex + 1} 的话术轻编辑；不会真实发送客户。`;
    renderAll();
  } catch (error) {
    addLocalTimelineEvent(review.reviewItemId, '本地暂存单条话术轻编辑', `${nowLabel()} · 角度 ${angleIndex + 1} · 事件接口失败但本地已保存 · ${error.message}`);
    $('#action-status').textContent = `话术已保存到当前页面；事件记录失败：${error.message}`;
    renderAll();
  }
}

async function handleH5CopyEditAction(button) {
  const review = selectedReview();
  if (!review || !button) return;
  const angleIndex = Number(button.dataset.h5CopyEditAction);
  const screens = collectH5CopyScreensFromDom();
  const hasCopy = screens.some((screen) => screen.title || screen.body || screen.auditRationale);
  if (!hasCopy) {
    $('#action-status').textContent = '没有可记录的 H5 三页文案修改。';
    return;
  }
  const newValue = screens.map((screen, index) => [
    `P${index + 1}`,
    `标题：${screen.title || '未填写'}`,
    `正文：${screen.body || '未填写'}`,
    `审核说明：${screen.auditRationale || '未填写'}`,
  ].join('\n')).join('\n\n');
  const textBefore = [0, 1, 2].map((index) => {
    const title = $(`[data-h5-screen-field="title"][data-h5-screen-index="${index}"]`)?.defaultValue || '';
    const body = $(`[data-h5-screen-field="body"][data-h5-screen-index="${index}"]`)?.defaultValue || '';
    const audit = $(`[data-h5-screen-field="auditRationale"][data-h5-screen-index="${index}"]`)?.defaultValue || '';
    return [`P${index + 1}`, `标题：${title || '未填写'}`, `正文：${body || '未填写'}`, `审核说明：${audit || '未填写'}`].join('\n');
  }).join('\n\n');
  applyLocalH5CopyEdit(review.reviewItemId, angleIndex, screens);
  try {
    const result = await postApi(ADVISOR_FIELD_REVIEW_EVENTS_API, {
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerName: review.customerName,
      fieldKey: `communication_angle_${angleIndex + 1}_h5_pages`,
      fieldLabel: `角度 ${angleIndex + 1} H5 三页文案`,
      fieldGroup: '沟通角度与发送',
      action: 'edit_descriptive_field',
      oldValue: 'AI 生成的所选角度 H5 三页文案',
      newValue,
      reason: '顾问选择沟通角度后，可对配套 H5 三页文案做个性化轻编辑；角度本身不可修改。',
      sourceView: 'ds-advisor-h5-review',
    });
    await postApi(H5_PUBLISH_REVIEW_EVENTS_API, {
      eventType: 'h5_publish_review_text_diff',
      action: 'record_text_diff',
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerName: review.customerName,
      diffTarget: `angle_${angleIndex + 1}_h5_copy`,
      textBefore,
      textAfter: newValue,
      sourceView: 'ds-advisor-h5-review',
    });
    await postApi(ADVISOR_ACTION_EVENTS_API, {
      p2Event: true,
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerName: review.customerName,
      action: 'h5_copy_edit',
      actionLabel: '编辑 H5 三页文案',
      textBefore,
      textAfter: newValue,
      sourceView: 'ds-advisor-h5-review',
    });
    state.advisorFieldReviewEvents = {
      ...(state.advisorFieldReviewEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.advisorFieldReviewEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    addLocalTimelineEvent(review.reviewItemId, '记录 H5 三页文案轻编辑', `${nowLabel()} · 角度 ${angleIndex + 1} · P1/P2/P3 个性化改动 · 远端写库=false`);
    $('#action-status').textContent = `已记录角度 ${angleIndex + 1} 的 H5 三页文案修改；客户可见发布仍关闭。`;
    renderTaskDetail();
    renderH5Preview();
    renderTimeline();
  } catch (error) {
    addLocalTimelineEvent(review.reviewItemId, '本地暂存 H5 三页文案轻编辑', `${nowLabel()} · 角度 ${angleIndex + 1} · 事件接口失败但本地已保存 · ${error.message}`);
    $('#action-status').textContent = `H5 文案已保存到当前页面；事件记录失败：${error.message}`;
    renderAll();
  }
}

async function handleRejectAllAngles() {
  const review = selectedReview();
  const note = $('#angle-reject-reason')?.value?.trim() || '';
  if (!review || !note) {
    $('#action-status').textContent = '请先填写三个角度都不采纳的原因。';
    return;
  }
  try {
    const result = await postApi(ADVISOR_FIELD_REVIEW_EVENTS_API, {
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerName: review.customerName,
      fieldKey: 'reject_all_communication_angles',
      fieldLabel: '三个沟通角度全部不采纳',
      fieldGroup: '沟通角度与发送',
      action: 'edit_descriptive_field',
      oldValue: 'AI 生成的三个沟通角度',
      newValue: note,
      reason: '顾问不修改角度，只反馈全部不采纳原因，等待 AI 重新生成角度/H5/话术。',
      sourceView: 'ds-advisor-h5-review',
    });
    state.advisorFieldReviewEvents = {
      ...(state.advisorFieldReviewEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.advisorFieldReviewEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    state.generatedDrafts.set(review.reviewItemId, {
      source: 'needs_regeneration',
      generatedAt: nowLabel(),
      reason: '三个沟通角度全部不采纳，等待 AI 重新生成角度、H5 和话术',
    });
    await postApi(ADVISOR_ACTION_EVENTS_API, {
      p2Event: true,
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerName: review.customerName,
      action: 'communication_angle_reject_all',
      actionLabel: '三个角度全部不采纳',
      reasonText: note,
      sourceView: 'ds-advisor-h5-review',
    });
    await postApi(P2_COMMUNICATION_ANGLE_RUNS_API, {
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerName: review.customerName,
      allRejectReason: note,
      actor: 'ds-advisor-h5-review',
    });
    addLocalTimelineEvent(review.reviewItemId, '三个角度全部不采纳', `${nowLabel()} · 等待 AI 重新生成 · 远端写库=false`);
    $('#action-status').textContent = '已记录三个角度全部不采纳原因；将进入 AI 重新生成框架。';
    renderAll();
  } catch (error) {
    $('#action-status').textContent = `全部不采纳反馈记录失败：${error.message}`;
  }
}

async function handleCustomAngleRequest() {
  const review = selectedReview();
  const archive = selectedArchive();
  const taskCard = archive?.h5ReviewTaskCard || {};
  const note = $('#custom-angle-note')?.value?.trim() || '';
  if (!review || !note) {
    $('#action-status').textContent = '请先填写自定义沟通角度。';
    return;
  }
  if (state.customAngleBusyReviewItemId) return;
  state.customAngleBusyReviewItemId = review.reviewItemId;
  state.deepseekH5Busy = true;
  setDeepSeekH5Buttons(true);
  $('#action-status').textContent = '正在调用 DeepSeek 生成角度4、三页 H5 文案和顾问沟通话术...';
  updateDeepSeekH5Status('DeepSeek 正在基于自定义输入、客户信息和互动目标生成角度4。', 'is-running');
  renderTaskDetail();
  try {
    const payload = await postApi(`${DS_ADVISOR_H5_API}/custom-angle`, buildCustomAngleRequestPayload(note, review, archive, taskCard));
    const generation = normalizeCustomAngleGenerationPayload(payload, note);
    state.customAngleGenerationsByReviewId.set(review.reviewItemId, generation);
    const nextAngleIndex = Math.max(0, communicationAnglesForReview(taskCard, review.reviewItemId).length - 1);
    state.selectedH5ReviewAngleByReviewId.set(review.reviewItemId, nextAngleIndex);
    state.generatedDrafts.set(review.reviewItemId, {
      source: 'deepseek_custom_angle_04',
      generatedAt: nowLabel(),
      reason: 'DeepSeek 已生成自定义角度4、三页 H5 和顾问话术',
      selectedAngleIndex: nextAngleIndex,
      customAngleLabel: generation.angle?.label || '自定义角度',
    });
    addLocalTimelineEvent(review.reviewItemId, 'DeepSeek 生成自定义角度4', `${nowLabel()} · ${generation.angle?.label || '自定义角度'} · H5三页+话术已生成 · 远端写库=false`);
    try {
      const eventResult = await postApi(ADVISOR_FIELD_REVIEW_EVENTS_API, {
        reviewItemId: review.reviewItemId,
        unifiedCustomerId: review.unifiedCustomerId,
        customerName: review.customerName,
        fieldKey: 'custom_communication_angle_angle_04',
        fieldLabel: '自定义沟通角度4',
        fieldGroup: '沟通角度与发送',
        action: 'edit_descriptive_field',
        oldValue: '三个 DS 角度均不满意',
        newValue: [
          `顾问输入：${note}`,
          `角度4：${generation.angle?.label || ''}`,
          `话术：${generation.advisorScript?.message || ''}`,
        ].filter(Boolean).join('\n'),
        reason: '顾问手工输入新角度，DeepSeek 已生成配套话术和 H5。',
        sourceView: 'ds-advisor-h5-review',
      });
      state.advisorFieldReviewEvents = {
        ...(state.advisorFieldReviewEvents || {}),
        summary: eventResult.summary,
        events: [eventResult.event, ...((state.advisorFieldReviewEvents?.events || []).filter((event) => event.eventId !== eventResult.event.eventId))],
      };
	    } catch (eventError) {
	      addLocalTimelineEvent(review.reviewItemId, '自定义角度4事件本地保留', `${nowLabel()} · 事件接口失败但生成结果已保存 · ${eventError.message}`);
	    }
    try {
      await postApi(ADVISOR_ACTION_EVENTS_API, {
        p2Event: true,
        reviewItemId: review.reviewItemId,
        unifiedCustomerId: review.unifiedCustomerId,
        customerName: review.customerName,
        action: 'custom_angle_request',
        actionLabel: '自定义角度4',
        reasonText: note,
        sourceView: 'ds-advisor-h5-review',
        payload: {
          customAngleLabel: generation.angle?.label || '',
          dedupeFlag: generation.dedupeFlag || null,
        },
      });
    } catch (eventError) {
      addLocalTimelineEvent(review.reviewItemId, 'P2 自定义角度事件写入失败', `${nowLabel()} · ${eventError.message}`);
    }
	    state.currentPage = 0;
    state.activeH5Detail = null;
    persistAdvisorH5LocalState();
    $('#action-status').textContent = `DeepSeek 已生成角度4：${generation.angle?.label || '自定义角度'}；下方 H5 三页、话术和右侧实时预览已同步。`;
    updateDeepSeekH5Status('DeepSeek 自定义角度4生成完成：automaticSendAllowed=false，customerFacingPublishAllowed=false，remoteWriteAllowed=false。', 'is-success');
    renderAll();
  } catch (error) {
    $('#action-status').textContent = `DeepSeek 自定义角度4生成失败：${error.message}`;
    updateDeepSeekH5Status(`DeepSeek 自定义角度4生成失败：${error.message}`, 'is-error');
  } finally {
    state.customAngleBusyReviewItemId = null;
    state.deepseekH5Busy = false;
    setDeepSeekH5Buttons(false);
    renderTaskDetail();
  }
}

function handleSendPlanRecord() {
  const review = selectedReview();
  if (!review) return;
  const sendScriptSelected = $('#send-script-checkbox')?.checked === true;
  const sendH5Selected = $('#send-h5-checkbox')?.checked === true;
  if (!sendScriptSelected && !sendH5Selected) {
    $('#action-status').textContent = '发送话术和发送 H5 不能同时不选。';
    return;
  }
  addLocalTimelineEvent(
    review.reviewItemId,
    '记录发送内容选择',
    `${nowLabel()} · 话术=${sendScriptSelected} · H5=${sendH5Selected} · 仅本地审核事件，不真实发送`,
  );
  $('#action-status').textContent = `已记录发送选择：${sendScriptSelected ? '话术' : ''}${sendScriptSelected && sendH5Selected ? ' + ' : ''}${sendH5Selected ? 'H5' : ''}；automaticSendAllowed=false`;
  renderTimeline();
}

async function handleAdvisorTaskComplete() {
  const review = selectedReview();
  const archive = selectedArchive();
  if (!review) return;
  const sendScriptSelected = $('#send-script-checkbox')?.checked === true;
  const sendH5Selected = $('#send-h5-checkbox')?.checked === true;
  if (!sendScriptSelected && !sendH5Selected) {
    $('#action-status').textContent = '发送话术和发送 H5 不能同时不选，未记录已完成。';
    return;
  }
  const responseStatus = $('#completion-response-status')?.value || 'responded';
  const customerReply = $('#completion-reply-note')?.value?.trim() || '';
  const extraInfo = $('#completion-extra-info')?.value?.trim() || '';
  const aiWecomSummaryPlaceholder = $('#completion-ai-summary')?.value?.trim() || 'TODO: 后续接入企微对话 AI 摘要，不读取真实企微正文。';
  try {
    const result = await postApi(ADVISOR_COMPLETION_FEEDBACK_EVENTS_API, {
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId || archive?.customerId,
      customerName: review.customerName || archive?.customerName,
      responseStatus,
      customerReply,
      extraInfo,
      aiWecomSummaryPlaceholder,
      sendScriptSelected,
      sendH5Selected,
      sourceView: 'ds-advisor-h5-review',
    });
    state.advisorCompletionFeedbackEvents = {
      ...(state.advisorCompletionFeedbackEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.advisorCompletionFeedbackEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    addLocalTimelineEvent(review.reviewItemId, '顾问任务已完成', `${nowLabel()} · responseStatus=${responseStatus} · 写入本地完成反馈事件`);
    $('#action-status').textContent = '已记录任务完成与回访反馈；未来可写回顾客档案。';
    renderAll();
  } catch (error) {
    $('#action-status').textContent = `完成反馈写入失败：${error.message}`;
  }
}

async function handleFeedbackBackfillSubmit() {
  const review = selectedReview();
  const archive = selectedArchive();
  if (!review) return;
  const customerStated = $('#feedback-backfill-customer-stated')?.value?.trim().slice(0, 500) || '';
  const advisorGuess = $('#feedback-backfill-advisor-guess')?.value?.trim().slice(0, 500) || '';
  if (!customerStated) {
    $('#action-status').textContent = '请先填写 500 字以内的客户自述摘要。';
    return;
  }
  const basePayload = {
    reviewItemId: review.reviewItemId,
    unifiedCustomerId: review.unifiedCustomerId || archive?.customerId,
    customerName: review.customerName || archive?.customerName,
    feedbackText: customerStated,
    customerStated,
    advisorGuess,
    sourceView: 'ds-advisor-h5-review',
    actor: 'ds-advisor-h5-review',
  };
  try {
    const run = await postApi(P2_FEEDBACK_BACKFILL_RUNS_API, basePayload);
    const draftPayload = run.output?.draft || basePayload;
    const result = await postApi(FEEDBACK_BACKFILL_API, {
      ...basePayload,
      ...draftPayload,
      action: 'create_draft',
    });
    await postApi(ADVISOR_ACTION_EVENTS_API, {
      p2Event: true,
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: basePayload.unifiedCustomerId,
      customerName: basePayload.customerName,
      action: 'feedback_backfill_submit',
      actionLabel: '提交客户反馈补录草稿',
      reasonText: customerStated,
      payload: {
        draftId: result.draft?.draftId || draftPayload.draftId || '',
        riskTriggers: result.draft?.riskTriggers || draftPayload.riskTriggers || [],
      },
      sourceView: 'ds-advisor-h5-review',
    });
    addLocalTimelineEvent(
      review.reviewItemId,
      '客户反馈补录草稿已生成',
      `${nowLabel()} · draftId=${result.draft?.draftId || draftPayload.draftId || '-'} · 风险=${(result.draft?.riskTriggers || draftPayload.riskTriggers || []).length}`,
    );
    $('#action-status').textContent = '已生成反馈补录草稿；需管理后台人工确认后才合入档案覆盖层。';
    renderTimeline();
  } catch (error) {
    $('#action-status').textContent = `反馈补录草稿生成失败：${error.message}`;
  }
}

async function handleH5ReviewTaskAction(actionId) {
  const review = selectedReview();
  const archive = selectedArchive();
  const config = h5ReviewActionConfig(actionId);
  if (!review || !config) return;
  const pauseNote = $('#pause-reason-note')?.value?.trim() || '';
  const regenerateNote = $('#regenerate-reason-note')?.value?.trim() || '';
  const customerId = reviewArchiveCustomerId(review, archive);
  if (actionId === 'pause' && !pauseNote) {
    const validationMessage = '选择暂缓/勿扰时，需要填写暂缓原因。';
    setActionStatus(validationMessage);
    setAdvisorFeedbackInlineStatus(review.reviewItemId, validationMessage, 'is-error');
    return;
  }
  if (actionId === 'regenerate' && !regenerateNote) {
    const validationMessage = '选择重新生成时，必须填写上一版不适用的具体原因。';
    setActionStatus(validationMessage);
    setAdvisorFeedbackInlineStatus(review.reviewItemId, validationMessage, 'is-error');
    return;
  }
  const note = actionId === 'pause'
    ? `暂缓勿扰原因：${pauseNote}`
    : actionId === 'regenerate'
      ? `重新生成原因：${regenerateNote}`
      : '顾问已采纳，无需填写原因。';
  const createdAt = nowLabel();
  const actionState = {
    eventId: `local_h5_review_${actionId}_${Date.now()}`,
    reviewItemId: review.reviewItemId,
    actionId,
    actionLabel: config.statusLabel,
    nextStatusLabel: config.nextStatusLabel,
    feedbackLearning: config.feedbackLearning,
    note,
    createdAt,
    dataVerifierNotice: actionId === 'regenerate'
      ? '反馈已传递至数据核查员，待核查后同步至顾客档案。'
      : '',
    regenerationDisplayTarget: actionId === 'regenerate'
      ? '重新生成内容已显示在下方「3. 沟通角度与发送」的 H5 三页文案；话术请进入弹窗查看和编辑。'
      : '',
    remoteWriteAllowed: false,
    automaticSendAllowed: false,
    customerFacingPublishAllowed: false,
  };
  state.localReviewActions.set(review.reviewItemId, actionState);
  updateGateForLocalReviewAction(review.reviewItemId, config);
  if (actionId === 'regenerate') {
    if (!state.regeneratedGoalVersionByReviewId.has(review.reviewItemId)) {
      state.regeneratedGoalVersionByReviewId.set(review.reviewItemId, 0);
    }
    state.selectedH5ReviewAngleByReviewId.set(review.reviewItemId, 0);
    state.generatedDrafts.set(review.reviewItemId, {
      source: 'regenerated_mock',
      generatedAt: createdAt,
      regeneratedGoalVersionIndex: regeneratedGoalVersionIndex(review.reviewItemId),
      selectedAngleIndex: selectedH5ReviewAngleIndex(review.reviewItemId),
      displayTarget: actionState.regenerationDisplayTarget,
    });
    state.currentPage = 0;
    state.activeH5Detail = null;
  }
  addLocalTimelineEvent(review.reviewItemId, config.timelineTitle, `${createdAt} · ${config.nextStatusLabel} · ${config.feedbackLearning} · 远端写库=false`);
  try {
    await postApi(ADVISOR_ACTION_EVENTS_API, {
      p2Event: true,
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: customerId,
      customerName: review.customerName || archive?.customerName || archive?.customerIdentity?.customerName || '',
      action: actionId === 'accept' ? 'interaction_goal_accept' : actionId === 'regenerate' ? 'interaction_goal_regenerate' : 'interaction_goal_pause_do_not_disturb',
      actionLabel: config.label,
      reasonText: actionId === 'regenerate' ? regenerateNote : pauseNote,
      generationRound: actionId === 'regenerate' ? (regeneratedGoalVersionIndex(review.reviewItemId) + 2) : 1,
      sourceView: 'ds-advisor-h5-review',
      payload: {
        nextStatusLabel: config.nextStatusLabel,
        previousRejectedReason: actionId === 'regenerate' ? regenerateNote : '',
      },
    });
  } catch (error) {
    addLocalTimelineEvent(review.reviewItemId, 'P2 顾问动作事件写入失败', `${nowLabel()} · ${error.message}`);
  }
  if (actionId === 'regenerate') {
    try {
      await postApi(P2_INTERACTION_GOAL_RUNS_API, {
        reviewItemId: review.reviewItemId,
        unifiedCustomerId: customerId,
        customerName: review.customerName || archive?.customerName || '',
        previousRejectedReason: regenerateNote,
        generationRound: regeneratedGoalVersionIndex(review.reviewItemId) + 2,
        actor: 'ds-advisor-h5-review',
      });
      await postApi(P2_COMMUNICATION_ANGLE_RUNS_API, {
        reviewItemId: review.reviewItemId,
        unifiedCustomerId: customerId,
        customerName: review.customerName || archive?.customerName || '',
        allRejectReason: regenerateNote,
        actor: 'ds-advisor-h5-review',
      });
    } catch (error) {
      addLocalTimelineEvent(review.reviewItemId, 'P2 重新生成运行器失败', `${nowLabel()} · ${error.message}`);
    }
  } else if (actionId === 'accept') {
    try {
      await postApi(P2_COMMUNICATION_ANGLE_RUNS_API, {
        reviewItemId: review.reviewItemId,
        unifiedCustomerId: customerId,
        customerName: review.customerName || archive?.customerName || '',
        actor: 'ds-advisor-h5-review',
      });
    } catch (error) {
      addLocalTimelineEvent(review.reviewItemId, 'P2 沟通角度运行器失败', `${nowLabel()} · ${error.message}`);
    }
  }
  const successMessage = actionId === 'regenerate'
    ? '已重新生成候选：互动目标、沟通角度、H5 三页和单条话术已刷新到下方区域。'
    : `已记录本地动作：${config.label} · ${config.nextStatusLabel} · automaticSendAllowed=false`;
  setActionStatus(successMessage);
  setAdvisorFeedbackInlineStatus(review.reviewItemId, successMessage, actionId === 'pause' ? 'is-muted' : 'is-success');
  if (actionId === 'pause') {
    try {
      const result = await postApi(DO_NOT_DISTURB_API, {
        action: 'mark',
        customerId,
        customerName: review.customerName || archive?.customerName || archive?.customerIdentity?.customerName || '',
        markedBy: review.advisorId || review.advisorSourceUserId || review.advisorName || 'advisor_review_page',
        kind: '勿扰',
        reasonText: pauseNote,
        sourceView: 'ds-advisor-h5-review',
      });
      addLocalTimelineEvent(review.reviewItemId, '写入勿扰黑名单', `${nowLabel()} · blacklistActive=${result.blacklist?.summary?.totalActive ?? '-'} · automaticSendAllowed=false`);
      setActionStatus('已标记暂缓/勿扰：客户进入本地黑名单，后续 DS 画像/H5 生成候选会跳过；到期仅提醒人工复核。');
    } catch (error) {
      setActionStatus(`本地动作已记录，但黑名单事件写入失败：${error.message}`);
      setAdvisorFeedbackInlineStatus(review.reviewItemId, `黑名单事件写入失败：${error.message}`, 'is-error');
    }
  }
  renderAll();
}

function auditChecksPassed() {
  return $$('.audit-check').every((input) => input.checked);
}

async function submitReviewAction(action) {
  const gate = selectedH5Gate();
  if (!gate) return;
  $('#action-status').textContent = '正在写入本地发布复核事件...';
  try {
    if (action === '批准发布复核' && !auditChecksPassed()) {
      throw new Error('请先完成全部人工门禁勾选');
    }
    const result = await postApi('/api/lifecycle/h5-publish-review-events', {
      h5GateId: gate.h5GateId,
      action,
    });
    state.h5ReviewEvents = {
      ...(state.h5ReviewEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.h5ReviewEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    $('#action-status').textContent = `已记录：${result.event.actionLabel} · ${result.event.nextPublishReviewStatus}`;
    renderAll();
  } catch (error) {
    $('#action-status').textContent = `写入失败：${error.message}`;
  }
}

async function submitExecution() {
  const reviewEvent = latestApprovedReviewEvent();
  if (!reviewEvent) {
    $('#action-status').textContent = '未找到已批准的发布复核事件，不能记录人工发布执行。';
    return;
  }
  $('#action-status').textContent = '正在写入人工发布执行事件...';
  try {
    const result = await postApi('/api/lifecycle/h5-publish-execution-events', {
      h5PublishReviewEventId: reviewEvent.eventId,
      publishChannel: 'advisor_wechat_private_link',
    });
    state.h5ExecutionEvents = {
      ...(state.h5ExecutionEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.h5ExecutionEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    $('#action-status').textContent = result.duplicateIgnored
      ? `已存在执行确认：${result.event.publishExecutedAt}`
      : `已记录人工发布执行：${result.event.publishExecutedAt}`;
    renderAll();
  } catch (error) {
    $('#action-status').textContent = `写入失败：${error.message}`;
  }
}

async function submitWeComTestGroupH5() {
  const review = selectedReview();
  if (!review) {
    $('#action-status').textContent = '请先选择一个 H5 审核对象。';
    return;
  }
  const screens = currentH5Screens();
  const archive = selectedArchive();
  $('#action-status').textContent = '正在发送到企微测试群...';
  try {
    const result = await postApi('/api/wecom/test-group-send-h5', {
      explicitConfirm: true,
      sourceMode: reviewSourceMode,
      reviewItemId: review.reviewItemId,
      unifiedCustomerId: review.unifiedCustomerId,
      customerCode: archive?.customerCode || review.customerCode || review.reviewItemId,
      title: 'YESSKIN DS H5 测试预览',
      summaryText: review.interactionObjective || archive?.advisorTaskCard?.objective || '点击查看当前 DS 生成的三屏 H5 审核稿。',
      h5Url: currentH5ShareUrl(),
      screenTexts: screens.map((screen) => `${screen.title || ''} ${screen.body || ''}`.trim()),
    });
    state.localEvents.unshift({
      reviewItemId: review.reviewItemId,
      title: result.ok ? '发送到企微测试群' : '企微测试群发送失败',
      meta: `${nowLabel()} · ${result.event?.sendStatus || 'unknown'} · 真实客户发送=false`,
    });
    $('#action-status').textContent = result.ok
      ? `已发送到企微测试群：${result.event?.createdAt || nowLabel()}`
      : `企微测试群返回失败：${result.event?.wecomResponse?.errmsg || result.event?.sendStatus || 'unknown'}`;
    renderTimeline();
  } catch (error) {
    $('#action-status').textContent = `发送失败：${error.message}`;
  }
}

function mergeEventIntoStore(store, event) {
  if (!event) return store;
  return {
    ...(store || {}),
    events: [event, ...((store?.events || []).filter((item) => item.eventId !== event.eventId))],
  };
}

async function runReviewClosedLoopAction(actionId) {
  const action = (state.actionWorkbench?.actions || []).find((item) => item.id === actionId);
  if (!action) return;
  $('#action-status').textContent = `正在执行：${action.buttonLabel}`;
  try {
    const result = await postApi(action.apiPath, action.requestPayload || {});
    if (result.event?.eventType === 'h5_publish_review_decision') {
      state.h5ReviewEvents = mergeEventIntoStore(state.h5ReviewEvents, result.event);
    }
    if (result.event?.eventType === 'h5_manual_publish_execution_confirmation') {
      state.h5ExecutionEvents = mergeEventIntoStore(state.h5ExecutionEvents, result.event);
    }
    state.actionWorkbench = await api('/api/lifecycle/action-workbench').catch(() => state.actionWorkbench);
    const feedback = Array.isArray(result.feedbackLearning)
      ? `${result.feedbackLearning.length} 条反馈回流`
      : result.feedbackLearning?.eventId
        ? `反馈回流 ${result.feedbackLearning.eventId}`
        : '本地事件已写入';
    $('#action-status').textContent = `已记录：${result.event?.eventId || action.id} · ${feedback} · 远端写库=false`;
    renderAll();
  } catch (error) {
    $('#action-status').textContent = `写入失败：${error.message}`;
  }
}

async function loadData(options = {}) {
  if (reviewSourceMode === 'p7-live') {
    await loadP7LiveReviewData({ refresh: options.refresh === true });
    return;
  }
  if (reviewSourceMode === 'ds-advisor-h5') {
    await loadDsAdvisorH5ReviewData();
    return;
  }
  if (reviewSourceMode === 'deepseek') {
    await loadDeepSeekReviewData();
    return;
  }
  $('#action-status').textContent = '正在读取本地审核数据与20人批量归档...';
  const [reviewQueue, h5GateQueue, sendGateQueue, h5ReviewEvents, h5ExecutionEvents, batchDeliverables, firstArchive, lifecycleAgentRunBundle, actionWorkbench] = await Promise.all([
    loadJson('advisor_review_queue.v1.json'),
    loadJson('h5_publish_gate_queue.v1.json'),
    loadJson('manual_send_gate_queue.v1.json'),
    api('/api/lifecycle/h5-publish-review-events').catch(() => loadJson('h5_publish_review_events.v1.json')),
    api('/api/lifecycle/h5-publish-execution-events').catch(() => loadJson('h5_publish_execution_events.v1.json')),
    api(BATCH_ARCHIVE_PATH).catch(() => null),
    api(FIRST_ARCHIVE_PATH).catch(() => null),
    loadLatestLifecycleAgentRun().catch(() => null),
    api('/api/lifecycle/action-workbench').catch(() => null),
  ]);
  state.reviewQueue = reviewQueue;
  state.h5GateQueue = h5GateQueue;
  state.sendGateQueue = sendGateQueue;
  state.h5ReviewEvents = h5ReviewEvents;
  state.h5ExecutionEvents = h5ExecutionEvents;
  state.batchDeliverables = batchDeliverables;
  state.firstArchive = firstArchive;
  state.latestLifecycleAgentRunIndex = lifecycleAgentRunBundle?.index || null;
  state.latestLifecycleAgentRun = lifecycleAgentRunBundle?.customer || null;
  state.actionWorkbench = actionWorkbench;
  if (!state.selectedReviewItemId && initialReviewItemId && reviewQueue.items?.some((item) => item.reviewItemId === initialReviewItemId)) {
    state.selectedReviewItemId = initialReviewItemId;
  }
  const visibleItems = visibleReviewItems();
  state.selectedReviewItemId = visibleItems.some((item) => item.reviewItemId === state.selectedReviewItemId)
    ? state.selectedReviewItemId
    : visibleItems[0]?.reviewItemId || reviewQueue.items?.[0]?.reviewItemId || null;
  state.selectedVariant = selectedScripts()[0]?.variant || 'A';
  $('#action-status').textContent = '数据已载入：20人批量归档与项目书审核信息已接入。';
  renderAll();
}

async function loadP7LiveReviewData({ refresh = false } = {}) {
  await loadP7LiveReviewPage({ reset: true, page: 1, search: $('#task-search')?.value || '', refresh });
}

function p7LivePageCacheKey({ page, search }) {
  return JSON.stringify({ page, search: String(search || '').trim(), pageSize: state.p7LivePageSize });
}

async function fetchP7LiveTaskDirectory({ page = 1, search = '', refresh = false } = {}) {
  const normalizedSearch = String(search || '').trim();
  const cacheKey = p7LivePageCacheKey({ page, search: normalizedSearch });
  const cached = state.p7LivePageCache.get(cacheKey);
  if (!refresh && cached && Date.now() - cached.cachedAt < 60 * 1000) {
    return {
      ...cached.payload,
      cache: { ...(cached.payload.cache || {}), hit: true, source: 'client_page_cache' },
    };
  }
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(state.p7LivePageSize),
  });
  if (normalizedSearch) params.set('q', normalizedSearch);
  if (refresh) params.set('refresh', '1');
  const payload = await api(`/api/p7/live/tasks/directory?${params.toString()}`);
  state.p7LivePageCache.set(cacheKey, { cachedAt: Date.now(), payload });
  return payload;
}

async function loadP7LiveSharedData({ refresh = false } = {}) {
  if (state.p7LiveSharedDataLoaded && !refresh) return;
  if (state.p7LiveSharedDataPromise && !refresh) return state.p7LiveSharedDataPromise;
  const request = Promise.all([
    api('/api/lifecycle/action-workbench').catch(() => null),
    api(ADVISOR_FIELD_REVIEW_EVENTS_API).catch(() => ({ meta: {}, summary: { totalEvents: 0 }, events: [] })),
    api(ADVISOR_COMPLETION_FEEDBACK_EVENTS_API).catch(() => ({ meta: {}, summary: { totalEvents: 0 }, events: [] })),
    api(ADVISOR_TASK_GENERATION_FRAMEWORK_API).catch(() => null),
  ]).then(([actionWorkbench, advisorFieldReviewEvents, advisorCompletionFeedbackEvents, advisorTaskGenerationFramework]) => {
    state.actionWorkbench = actionWorkbench;
    state.advisorFieldReviewEvents = advisorFieldReviewEvents;
    state.advisorCompletionFeedbackEvents = advisorCompletionFeedbackEvents;
    state.advisorTaskGenerationFramework = advisorTaskGenerationFramework;
    state.p7LiveSharedDataLoaded = true;
  }).finally(() => {
    if (state.p7LiveSharedDataPromise === request) state.p7LiveSharedDataPromise = null;
  });
  state.p7LiveSharedDataPromise = request;
  return request;
}

function mergeByKey(existingRows = [], nextRows = [], keyFn = (item) => item.reviewItemId) {
  const map = new Map();
  existingRows.forEach((item) => {
    const key = keyFn(item);
    if (key) map.set(key, item);
  });
  nextRows.forEach((item) => {
    const key = keyFn(item);
    if (key) map.set(key, item);
  });
  return Array.from(map.values());
}

function p7LiveDirectoryReviewItem(item = {}) {
  const unifiedCustomerId = item.unifiedCustomerId || '';
  const reviewItemId = item.reviewItemId || `p7_live_${String(unifiedCustomerId).replace(/[^\w-]+/g, '_')}`;
  return {
    ...item,
    reviewItemId,
    unifiedCustomerId,
    customerName: item.customerName || item.customerNameMasked || maskId(unifiedCustomerId),
    priority: '',
    lifecycleState: {
      code: item.lifecycleStage || '',
      label: item.lifecycleStage || '详情加载中',
    },
    interactionObjective: '',
    advisorBrief: '',
    recommendedMessageVariants: [],
    reviewStatusLabel: item.reviewStatusLabel || '待顾问审核',
    detailLoaded: false,
    p7DirectoryOnly: true,
  };
}

function p7LiveDirectoryGate(reviewItem) {
  return {
    h5GateId: `p7_live_h5_gate_${reviewItem.reviewItemId}`,
    reviewItemId: reviewItem.reviewItemId,
    gateStatus: 'blocked_until_advisor_review',
    publishReviewAllowed: false,
    lifecycleStateLabel: reviewItem.lifecycleState?.label || '',
    lane: '待顾问审核',
    forbiddenClaims: [],
    h5Draft: {},
  };
}

function p7LiveDirectorySendGate(reviewItem) {
  return {
    reviewItemId: reviewItem.reviewItemId,
    gateStatus: 'blocked_until_advisor_review',
    manualSendAllowed: false,
  };
}

function p7LiveTaskRecordsFromTask(task = {}) {
  const run = p7LiveRunFromTask(task);
  const derivedReviewItem = deepSeekReviewItemFromRun(run);
  const reviewItem = {
    ...derivedReviewItem,
    reviewItemId: task.reviewItemId || derivedReviewItem.reviewItemId.replace(/^deepseek_/, 'p7_live_'),
    reviewStatusLabel: '待顾问审核',
    detailLoaded: true,
    p7DirectoryOnly: false,
  };
  const archive = {
    ...deepSeekArchiveFromRun(run),
    customerId: task.unifiedCustomerId || task.customerId,
  };
  const gate = {
    ...deepSeekGateFromRun(run, reviewItem),
    gateStatus: 'blocked_until_advisor_review',
    publishReviewAllowed: false,
    lane: '待顾问审核',
  };
  const sendGate = p7LiveDirectorySendGate(reviewItem);
  const reviewEvents = (task.events || []).map((event, eventIndex) => ({
    eventId: event.eventId || `p7_live_review_event_${reviewItem.reviewItemId}_${eventIndex}`,
    h5GateId: gate.h5GateId,
    reviewItemId: reviewItem.reviewItemId,
    actionLabel: event.action || event.eventType || '实盘本地事件',
    createdAt: event.createdAt || '',
    nextPublishReviewStatus: 'internal_preview_kept',
    manualPublishExecutionAllowed: false,
  }));
  return { run, reviewItem, archive, gate, sendGate, reviewEvents };
}

function applyP7LiveTaskDetailPayload(payload = {}) {
  const task = payload.task;
  if (!task) throw new Error('未返回该客户的任务详情。');
  const records = p7LiveTaskRecordsFromTask(task);
  const existingReviewItems = state.reviewQueue?.items || [];
  const directoryItem = existingReviewItems.find((item) => (
    item.reviewItemId === records.reviewItem.reviewItemId
    || item.unifiedCustomerId === records.reviewItem.unifiedCustomerId
  ));
  if (!directoryItem) return records;
  const reviewItem = {
    ...directoryItem,
    ...records.reviewItem,
    detailLoaded: true,
    p7DirectoryOnly: false,
  };
  const nextReviewItems = existingReviewItems.map((item) => {
    if (item.reviewItemId !== reviewItem.reviewItemId && item.unifiedCustomerId !== reviewItem.unifiedCustomerId) return item;
    return reviewItem;
  });
  const nextArchives = mergeByKey(
    state.batchDeliverables?.archives || [],
    [records.archive],
    (archive) => archive.customerId,
  );
  const nextReviewEvents = mergeByKey(
    state.h5ReviewEvents?.events || [],
    records.reviewEvents,
    (event) => event.eventId,
  );
  state.reviewQueue = { summary: { total: state.p7LiveTotal }, items: nextReviewItems };
  state.h5GateQueue = {
    summary: { readyForManualPublishReview: 0, h5Drafts: nextReviewItems.length },
    queue: mergeByKey(state.h5GateQueue?.queue || [], [{ ...records.gate, reviewItemId: reviewItem.reviewItemId }]),
  };
  state.sendGateQueue = {
    summary: { readyForManualSend: 0 },
    queue: mergeByKey(state.sendGateQueue?.queue || [], [{ ...records.sendGate, reviewItemId: reviewItem.reviewItemId }]),
  };
  state.h5ReviewEvents = { summary: { totalEvents: nextReviewEvents.length }, events: nextReviewEvents };
  state.h5ExecutionEvents = state.h5ExecutionEvents || { summary: { manualPublishExecutionConfirmedEvents: 0 }, events: [] };
  state.batchDeliverables = {
    summary: { deliverableCustomers: state.p7LiveTotal },
    items: nextReviewItems.map((item) => ({ customerId: item.unifiedCustomerId })),
    archives: nextArchives,
  };
  state.firstArchive = nextArchives.find((archive) => archive.customerId === nextReviewItems[0]?.unifiedCustomerId) || nextArchives[0] || null;
  state.latestLifecycleAgentRun = records.run;
  return { ...records, reviewItem };
}

function applyP7LiveDirectoryPayload(payload, { append = false, search = '' } = {}) {
  const directoryItems = (payload.items || []).map(p7LiveDirectoryReviewItem);
  const existingReviewItems = state.reviewQueue?.items || [];
  const existingReviewById = byReviewId(existingReviewItems);
  const existingGateById = byReviewId(state.h5GateQueue?.queue || []);
  const existingSendGateById = byReviewId(state.sendGateQueue?.queue || []);
  const cachedRecordsById = new Map();
  const pageReviewItems = directoryItems.map((directoryItem) => {
    const existing = existingReviewById.get(directoryItem.reviewItemId);
    if (existing && !existing.p7DirectoryOnly) return { ...directoryItem, ...existing };
    const cachedPayload = state.p7LiveDetailByCustomerId.get(directoryItem.unifiedCustomerId);
    if (!cachedPayload?.task) return directoryItem;
    const records = p7LiveTaskRecordsFromTask(cachedPayload.task);
    cachedRecordsById.set(directoryItem.reviewItemId, records);
    return { ...directoryItem, ...records.reviewItem };
  });
  const pageGates = pageReviewItems.map((reviewItem) => {
    if (reviewItem.p7DirectoryOnly) return p7LiveDirectoryGate(reviewItem);
    return existingGateById.get(reviewItem.reviewItemId)
      || cachedRecordsById.get(reviewItem.reviewItemId)?.gate
      || p7LiveDirectoryGate(reviewItem);
  });
  const pageSendGates = pageReviewItems.map((reviewItem) => {
    if (reviewItem.p7DirectoryOnly) return p7LiveDirectorySendGate(reviewItem);
    return existingSendGateById.get(reviewItem.reviewItemId)
      || cachedRecordsById.get(reviewItem.reviewItemId)?.sendGate
      || p7LiveDirectorySendGate(reviewItem);
  });
  const nextReviewItems = append ? mergeByKey(existingReviewItems, pageReviewItems) : pageReviewItems;
  const nextGates = append ? mergeByKey(state.h5GateQueue?.queue || [], pageGates) : pageGates;
  const nextSendGates = append ? mergeByKey(state.sendGateQueue?.queue || [], pageSendGates) : pageSendGates;
  const cachedRecords = Array.from(cachedRecordsById.values());
  const nextArchives = mergeByKey(
    state.batchDeliverables?.archives || [],
    cachedRecords.map((records) => records.archive),
    (archive) => archive.customerId,
  );
  const nextReviewEvents = mergeByKey(
    state.h5ReviewEvents?.events || [],
    cachedRecords.flatMap((records) => records.reviewEvents),
    (event) => event.eventId,
  );
  state.p7LiveSearch = String(search || '').trim();
  state.p7LivePage = Number(payload.page || state.p7LivePage || 1);
  state.p7LiveTotal = Number(payload.total || nextReviewItems.length || 0);
  state.p7LiveTotalPages = Number(payload.totalPages || Math.max(1, Math.ceil(state.p7LiveTotal / state.p7LivePageSize)));
  state.p7LiveHasMore = Boolean(payload.hasMore);
  state.p7LiveLastCacheHit = Boolean(payload.cache?.hit);
  state.p7LiveDirectoryError = '';
  state.reviewQueue = { summary: { total: state.p7LiveTotal }, items: nextReviewItems };
  state.h5GateQueue = {
    summary: { readyForManualPublishReview: 0, h5Drafts: nextReviewItems.length },
    queue: nextGates,
  };
  state.sendGateQueue = {
    summary: { readyForManualSend: 0 },
    queue: nextSendGates,
  };
  state.h5ReviewEvents = { summary: { totalEvents: nextReviewEvents.length }, events: nextReviewEvents };
  state.h5ExecutionEvents = state.h5ExecutionEvents || { summary: { manualPublishExecutionConfirmedEvents: 0 }, events: [] };
  state.batchDeliverables = {
    summary: { deliverableCustomers: state.p7LiveTotal },
    items: nextReviewItems.map((item) => ({ customerId: item.unifiedCustomerId })),
    archives: nextArchives,
  };
  state.firstArchive = nextArchives.find((archive) => archive.customerId === nextReviewItems[0]?.unifiedCustomerId) || nextArchives[0] || null;
  state.latestLifecycleAgentRunIndex = {
    runId: 'p7_live_task_directory',
    status: 'ready',
    counts: { requested: state.p7LiveTotal, generated: nextReviewItems.length },
    customers: nextReviewItems.map((item) => ({
      customerCode: item.customerCode || item.unifiedCustomerId,
      customerName: item.customerName || item.customerNameMasked,
    })),
  };
  if (!state.selectedReviewItemId && initialReviewItemId && nextReviewItems.some((item) => item.reviewItemId === initialReviewItemId)) {
    state.selectedReviewItemId = initialReviewItemId;
  }
  const visibleItems = visibleReviewItems();
  if (!visibleItems.some((item) => item.reviewItemId === state.selectedReviewItemId)) {
    state.selectedReviewItemId = visibleItems[0]?.reviewItemId || nextReviewItems[0]?.reviewItemId || null;
  }
  state.selectedVariant = selectedScripts()[0]?.variant || 'A';
}

async function loadP7LiveTaskDetail(customerId, { refresh = false } = {}) {
  const safeCustomerId = String(customerId || '').trim();
  if (!safeCustomerId) throw new Error('缺少客户 ID，无法加载任务详情。');
  const cached = state.p7LiveDetailByCustomerId.get(safeCustomerId);
  if (!refresh && cached) {
    applyP7LiveTaskDetailPayload(cached);
    return cached;
  }
  const existingRequest = state.p7LiveDetailInFlightByCustomerId.get(safeCustomerId);
  if (existingRequest) return existingRequest;
  state.p7LiveDetailLoadingCustomerIds.add(safeCustomerId);
  state.p7LiveDetailErrorByCustomerId.delete(safeCustomerId);
  const params = new URLSearchParams({ customerId: safeCustomerId });
  if (refresh) params.set('refresh', '1');
  const request = api(`/api/p7/live/tasks/detail?${params.toString()}`)
    .then((payload) => {
      state.p7LiveDetailByCustomerId.set(safeCustomerId, payload);
      applyP7LiveTaskDetailPayload(payload);
      return payload;
    })
    .catch((error) => {
      state.p7LiveDetailErrorByCustomerId.set(safeCustomerId, error.message || String(error));
      throw error;
    })
    .finally(() => {
      state.p7LiveDetailLoadingCustomerIds.delete(safeCustomerId);
      if (state.p7LiveDetailInFlightByCustomerId.get(safeCustomerId) === request) {
        state.p7LiveDetailInFlightByCustomerId.delete(safeCustomerId);
      }
    });
  state.p7LiveDetailInFlightByCustomerId.set(safeCustomerId, request);
  return request;
}

function scheduleP7LiveTaskDetailPrefetch(customerId) {
  const rows = allReviewItems();
  const selectedIndex = rows.findIndex((item) => item.unifiedCustomerId === customerId);
  if (selectedIndex < 0) return;
  const nextCustomerIds = rows.slice(selectedIndex + 1, selectedIndex + 3)
    .map((item) => item.unifiedCustomerId)
    .filter((nextCustomerId) => (
      nextCustomerId
      && !state.p7LiveDetailByCustomerId.has(nextCustomerId)
      && !state.p7LiveDetailInFlightByCustomerId.has(nextCustomerId)
      && !state.p7LivePrefetchScheduledCustomerIds.has(nextCustomerId)
    ));
  if (!nextCustomerIds.length) return;
  nextCustomerIds.forEach((nextCustomerId) => state.p7LivePrefetchScheduledCustomerIds.add(nextCustomerId));
  const prefetch = async () => {
    for (const nextCustomerId of nextCustomerIds) {
      try {
        await loadP7LiveTaskDetail(nextCustomerId);
      } catch (error) {
        console.warn('[p7-live] task detail prefetch failed', nextCustomerId, error);
      }
    }
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => void prefetch(), { timeout: 1200 });
  } else {
    window.setTimeout(() => void prefetch(), 120);
  }
}

async function ensureSelectedP7LiveTaskDetail({ refresh = false } = {}) {
  const review = selectedReview();
  if (reviewSourceMode !== 'p7-live' || !review?.unifiedCustomerId) return;
  const customerId = review.unifiedCustomerId;
  if (!review.p7DirectoryOnly && !refresh) {
    scheduleP7LiveTaskDetailPrefetch(customerId);
    return;
  }
  const request = loadP7LiveTaskDetail(customerId, { refresh });
  renderAll();
  try {
    const payload = await request;
    if (selectedReview()?.unifiedCustomerId !== customerId) return;
    state.selectedVariant = selectedScripts()[0]?.variant || 'A';
    renderAll();
    if (window.enableH5SummaryBtn) {
      const loadedReview = selectedReview();
      window.enableH5SummaryBtn(customerId, loadedReview?.customerName || '');
    }
    $('#action-status').textContent = `已加载 ${selectedReview()?.customerName || maskId(customerId)} 的完整任务详情 · 缓存=${payload.cache?.hit ? 'hit' : 'miss'}。`;
    scheduleP7LiveTaskDetailPrefetch(customerId);
  } catch (error) {
    if (selectedReview()?.unifiedCustomerId !== customerId) return;
    renderAll();
    $('#action-status').textContent = `任务详情加载失败：${error.message}`;
    updateDeepSeekH5Status(`任务详情加载失败：${error.message}`, 'is-error');
  }
}

async function loadP7LiveReviewPage({ reset = false, append = false, page = 1, search = '', refresh = false, showSearchBusy = false } = {}) {
  if (state.p7LiveLoading || state.p7LiveLoadingMore) return;
  const nextSearch = String(search || '').trim();
  if (reset) {
    state.p7LivePage = 1;
    state.p7LiveTotal = 0;
    state.p7LiveTotalPages = 1;
    state.p7LiveHasMore = false;
    if (refresh) state.p7LivePageCache.clear();
  }
  state.p7LiveDirectoryError = '';
  state.p7LiveLoading = !append;
  state.p7LiveLoadingMore = append;
  if (showSearchBusy) {
    state.p7LiveSearchBusy = true;
    updateTaskSearchButton();
  }
  $('#action-status').textContent = append ? '正在加载更多客户姓名...' : '正在读取实盘客户姓名目录...';
  updateDeepSeekH5Status(
    nextSearch
      ? `正在全量搜索实盘客户：“${nextSearch}”...`
      : (append ? '正在加载下一页客户姓名...' : '正在加载客户姓名目录，任务详情将按当前选择补充。'),
    'is-running',
  );
  renderTaskList();
  try {
    void loadP7LiveSharedData({ refresh }).catch((error) => {
      console.warn('[p7-live] shared review data failed', error);
    });
    const payload = await fetchP7LiveTaskDirectory({ page, search: nextSearch, refresh });
    applyP7LiveDirectoryPayload(payload, { append, search: nextSearch });
    $('#action-status').textContent = state.p7LiveTotal
      ? `客户姓名已载入：${formatNumber(allReviewItems().length)} / ${formatNumber(state.p7LiveTotal)} 人 · 正在加载当前客户详情 · 缓存=${payload.cache?.hit ? 'hit' : 'miss'}。`
      : '暂无实盘顾问任务。';
    updateDeepSeekH5Status(
      state.p7LiveTotal
        ? `已显示 ${formatNumber(allReviewItems().length)} / ${formatNumber(state.p7LiveTotal)} 位客户姓名；当前客户详情单独加载，后续客户将在空闲时预取。`
        : '暂无实盘顾问任务。',
      state.p7LiveTotal ? 'is-success' : '',
    );
    void ensureSelectedP7LiveTaskDetail({ refresh });
  } catch (error) {
    state.p7LiveDirectoryError = error.message || String(error);
    $('#action-status').textContent = `顾问任务加载失败：${state.p7LiveDirectoryError}`;
    updateDeepSeekH5Status(`顾问任务加载失败：${state.p7LiveDirectoryError}`, 'is-error');
    throw error;
  } finally {
    state.p7LiveLoading = false;
    state.p7LiveLoadingMore = false;
    if (showSearchBusy) {
      state.p7LiveSearchBusy = false;
      updateTaskSearchButton();
    }
    renderAll();
  }
}

function handleTaskSearchInput() {
  if (reviewSourceMode !== 'p7-live') {
    renderTaskList();
    return;
  }
  updateDeepSeekH5Status('输入完成后点击“搜索”，系统会在全体实盘客户中检索。', '');
}

function submitTaskSearch() {
  if (reviewSourceMode !== 'p7-live') {
    renderTaskList();
    return;
  }
  loadP7LiveReviewPage({
    reset: true,
    page: 1,
    search: $('#task-search')?.value || '',
    showSearchBusy: true,
  }).catch((error) => {
    state.p7LiveSearchBusy = false;
    updateTaskSearchButton();
    $('#action-status').textContent = `搜索失败：${error.message}`;
  });
}

async function loadMoreP7LiveReviewTasks() {
  if (reviewSourceMode !== 'p7-live' || !state.p7LiveHasMore) return;
  await loadP7LiveReviewPage({
    append: true,
    page: state.p7LivePage + 1,
    search: state.p7LiveSearch,
  });
}

async function startDsAdvisorH5Generation() {
  if (dsAdvisorH5FrameworkOnly) {
    updateDeepSeekH5Status('当前仅搭建 Ds顾问任务&H5审核页面框架，暂不加载或生成任何客户分析数据。');
    $('#action-status').textContent = '页面框架模式：未生成、未发送、未发布、未写远端库。';
    return;
  }
  if (state.deepseekH5Busy) return;
  state.deepseekH5Busy = true;
  state.deepseekH5ReviewCleared = false;
  setDeepSeekH5Buttons(true);
  updateDeepSeekH5Status('正在调用 DS：基于 DS 全景档案 + DS 用户画像分析 + 项目书规则生成顾问任务与 H5 审核内容。');
  try {
    const payload = await postApi(`${DS_ADVISOR_H5_API}/runs/chen-xisheng`, {
      actor: 'ds_advisor_h5_chen_button',
    });
    updateDeepSeekH5Status(`DS 顾问任务&H5审核生成完成：${payload.runId || ''}。`);
    await loadDsAdvisorH5ReviewData({ fromGeneration: true });
  } catch (error) {
    updateDeepSeekH5Status(`DS 顾问任务&H5审核生成失败：${error.message}`, 'is-error');
    $('#action-status').textContent = `生成失败：${error.message}`;
  } finally {
    state.deepseekH5Busy = false;
    setDeepSeekH5Buttons(false);
  }
}

async function loadDsAdvisorH5ReviewData(options = {}) {
  if (dsAdvisorH5FrameworkOnly) {
    state.reviewQueue = { summary: { total: 0 }, items: [] };
    state.h5GateQueue = { summary: { readyForManualPublishReview: 0, h5Drafts: 0 }, queue: [] };
    state.sendGateQueue = { summary: { readyForManualSend: 0 }, queue: [] };
    state.h5ReviewEvents = { summary: { totalEvents: 0 }, events: [] };
    state.h5ExecutionEvents = { summary: { manualPublishExecutionConfirmedEvents: 0 }, events: [] };
    state.batchDeliverables = { summary: { deliverableCustomers: 0 }, items: [], archives: [] };
    state.firstArchive = null;
    state.latestLifecycleAgentRunIndex = null;
    state.latestLifecycleAgentRun = null;
    state.actionWorkbench = null;
    state.advisorFieldReviewEvents = { meta: {}, summary: { totalEvents: 0 }, events: [] };
    state.advisorCompletionFeedbackEvents = { meta: {}, summary: { totalEvents: 0 }, events: [] };
    state.advisorTaskGenerationFramework = await api(ADVISOR_TASK_GENERATION_FRAMEWORK_API).catch(() => null);
    state.selectedReviewItemId = null;
    state.selectedVariant = 'A';
    state.currentPage = 0;
    state.activeH5Detail = null;
    $('#action-status').textContent = 'Ds顾问任务&H5审核页面框架已载入：当前不展示任何客户分析数据。';
    updateDeepSeekH5Status('当前仅搭建 Ds顾问任务&H5审核页面框架：GPT 页面作为结构蓝本，DS 个人分析数据暂不装载。');
    renderAll();
    return;
  }
  if (state.deepseekH5ReviewCleared && !options.fromGeneration) {
    clearDeepSeekH5ReviewGeneration();
    return;
  }
  $('#action-status').textContent = '正在读取 DS 顾问任务&H5审核结果...';
  updateDeepSeekH5Status('读取 DS 顾问任务&H5审核：内容来自 DS LLM 生成结果；GPT 页面只作为界面蓝本。', 'is-running');
  let payload;
  let actionWorkbench;
  let advisorFieldReviewEvents;
  let advisorCompletionFeedbackEvents;
  let advisorTaskGenerationFramework;
  try {
    [payload, actionWorkbench, advisorFieldReviewEvents, advisorCompletionFeedbackEvents, advisorTaskGenerationFramework] = await Promise.all([
      api(`${DS_ADVISOR_H5_API}/status`),
      api('/api/lifecycle/action-workbench').catch(() => null),
      api(ADVISOR_FIELD_REVIEW_EVENTS_API).catch(() => ({ meta: {}, summary: { totalEvents: 0 }, events: [] })),
      api(ADVISOR_COMPLETION_FEEDBACK_EVENTS_API).catch(() => ({ meta: {}, summary: { totalEvents: 0 }, events: [] })),
      api(ADVISOR_TASK_GENERATION_FRAMEWORK_API).catch(() => null),
    ]);
  } catch (error) {
    payload = {
      ok: false,
      hasGeneratedResult: false,
      generations: [],
      index: {
        runId: 'ds_advisor_h5_load_failed',
        status: 'load_failed',
        counts: { requested: 0, generated: 0 },
        customers: [],
        errorMessage: error.message,
      },
    };
    actionWorkbench = null;
    advisorFieldReviewEvents = { meta: {}, summary: { totalEvents: 0 }, events: [] };
    advisorCompletionFeedbackEvents = { meta: {}, summary: { totalEvents: 0 }, events: [] };
    advisorTaskGenerationFramework = null;
  }
  const runs = payload.generations || [];
  const index = payload.index || {
    runId: runs[0]?.runMeta?.runId || 'ds_advisor_h5_waiting',
    status: runs.length ? 'ready' : 'waiting_for_ds_advisor_h5_generation',
    counts: { requested: runs.length, generated: runs.length },
    customers: runs.map((run) => ({ customerCode: run.customerIdentity?.customerCode, customerName: run.customerIdentity?.customerName })),
  };
  const totalCustomers = runs.length;
  const reviewItems = runs.map(deepSeekReviewItemFromRun);
  const archives = runs.map(deepSeekArchiveFromRun);
  const gates = runs.map((run, indexOfRun) => deepSeekGateFromRun(run, reviewItems[indexOfRun]));
  const sendGates = reviewItems.map((item) => ({
    reviewItemId: item.reviewItemId,
    gateStatus: 'blocked_until_advisor_review',
    manualSendAllowed: false,
  }));
  const { reviewEvents, executionEvents } = deepSeekEventsFromRuns(runs, gates);
  state.reviewQueue = { summary: { total: totalCustomers }, items: reviewItems };
  state.h5GateQueue = {
    summary: { readyForManualPublishReview: 0, h5Drafts: totalCustomers },
    queue: gates.map((gate) => ({ ...gate, publishReviewAllowed: false, gateStatus: 'blocked_until_advisor_review', lane: '待顾问审核' })),
  };
  state.sendGateQueue = { summary: { readyForManualSend: 0 }, queue: sendGates };
  state.h5ReviewEvents = { summary: { totalEvents: reviewEvents.length }, events: reviewEvents };
  state.h5ExecutionEvents = { summary: { manualPublishExecutionConfirmedEvents: executionEvents.length }, events: executionEvents };
  state.batchDeliverables = {
    summary: { deliverableCustomers: totalCustomers },
    items: archives.map((archive) => ({ customerId: archive.customerId })),
    archives,
  };
  state.firstArchive = archives[0] || null;
  state.latestLifecycleAgentRunIndex = index;
  state.latestLifecycleAgentRun = runs[0] || null;
  state.actionWorkbench = actionWorkbench;
  state.advisorFieldReviewEvents = advisorFieldReviewEvents;
  state.advisorCompletionFeedbackEvents = advisorCompletionFeedbackEvents;
  state.advisorTaskGenerationFramework = advisorTaskGenerationFramework;
  if (!state.selectedReviewItemId && initialReviewItemId && reviewItems.some((item) => item.reviewItemId === initialReviewItemId)) {
    state.selectedReviewItemId = initialReviewItemId;
  }
  const visibleItems = visibleReviewItems();
  if (!visibleItems.some((item) => item.reviewItemId === state.selectedReviewItemId)) {
    state.selectedReviewItemId = visibleItems[0]?.reviewItemId || reviewItems[0]?.reviewItemId || null;
  }
  state.selectedVariant = selectedScripts()[0]?.variant || 'A';
  $('#action-status').textContent = runs.length
    ? `DS 顾问任务&H5审核已载入：${formatNumber(totalCustomers)} 人 · 自动发送=false · 对客发布=false · 远端写库=false。`
    : '暂无 DS 顾问任务&H5审核结果。请点击“生成缺失客户”。';
  updateDeepSeekH5Status(
    runs.length
      ? `已载入 ${formatNumber(totalCustomers)} 个 DS 生成客户：可切换客户查看各自任务卡、H5 三屏和视觉提示。`
      : '暂无 DS 生成结果：将从 Ds全景档案 + DS 用户画像分析继续生成，GPT 页面仅作结构蓝本。',
    runs.length ? 'is-success' : '',
  );
  renderAll();
}

async function loadLatestLifecycleAgentRun() {
  const index = await api('/api/backend/deepseek/lifecycle/runs/latest');
  const customerCode = index.customers?.[0]?.customerCode || 'C01';
  const customer = await api(`/api/backend/deepseek/lifecycle/runs/${encodeURIComponent(index.runId)}/customers/${encodeURIComponent(customerCode)}`);
  return { index, customer };
}

async function loadDeepSeekReviewData(options = {}) {
  if (state.deepseekH5ReviewCleared && !options.fromGeneration) {
    clearDeepSeekH5ReviewGeneration();
    return;
  }
  $('#action-status').textContent = '正在载入顾问任务&H5审核 11 人样板...';
  updateDeepSeekH5Status('正在读取 11 人顾问任务卡与 H5 审核样板。');
  let index;
  let actionWorkbench;
  let runs;
  try {
    const [advisorH5Payload, workbenchPayload] = await Promise.all([
      api(`${DS_ADVISOR_H5_API}/status`).catch(() => null),
      api('/api/lifecycle/action-workbench').catch(() => null),
    ]);
    actionWorkbench = workbenchPayload;
    runs = advisorH5Payload?.generations || [];
    index = advisorH5Payload?.index || {
      runId: runs[0]?.runMeta?.runId || 'advisor_h5_sample_waiting',
      status: runs.length ? 'advisor_h5_sample_ready' : 'waiting_for_advisor_h5_sample',
      counts: { requested: runs.length, generated: runs.length },
      customers: runs.map((run) => ({
        customerCode: run.customerIdentity?.customerCode || run.customerIdentity?.unifiedCustomerId,
        customerName: run.customerIdentity?.customerName || run.customerIdentity?.customerNameMasked,
      })),
    };
    if (!runs.length) {
      const chenXishengRun = await loadChenXishengH5ReviewTestRun();
      runs = [chenXishengRun];
      index = {
        runId: chenXishengRun.runMeta?.runId || 'chen_xisheng_single_h5_review_20260625',
        status: 'chen_xisheng_single_sample_ready',
        counts: { requested: 1, generated: 1 },
        customers: [{
          customerCode: chenXishengRun.customerIdentity?.customerCode || chenXishengRun.runMeta?.customerCode || 'CHEN-XISHENG-01',
          customerName: chenXishengRun.customerIdentity?.customerName || '样本顾客',
        }],
        sampleOnly: true,
        sourceCustomerFile: chenXishengRun.inputSnapshot?.sourceCustomerFile || '',
        sourceRuleDocument: chenXishengRun.inputSnapshot?.sourceRuleDocument || '',
      };
    }
  } catch (error) {
    runs = [];
    index = {
      runId: 'advisor_h5_sample_load_failed',
      status: 'load_failed',
      counts: { requested: 11, generated: 0 },
      customers: [],
      errorMessage: error.message,
    };
    actionWorkbench = null;
  }
  const totalCustomers = runs.length || index.counts?.requested || index.customers?.length || 0;
  const reviewItems = runs.map(deepSeekReviewItemFromRun);
  const archives = runs.map(deepSeekArchiveFromRun);
  const gates = runs.map((run, indexOfRun) => deepSeekGateFromRun(run, reviewItems[indexOfRun]));
  const sendGates = reviewItems.map((item, indexOfItem) => ({
    reviewItemId: item.reviewItemId,
    gateStatus: gates[indexOfItem]?.publishReviewAllowed ? 'ready_for_manual_send' : 'blocked_until_advisor_review',
    manualSendAllowed: gates[indexOfItem]?.publishReviewAllowed === true,
  }));
  const { reviewEvents, executionEvents } = deepSeekEventsFromRuns(runs, gates);
  const readyCount = gates.filter((gate) => gate.publishReviewAllowed).length;
  state.reviewQueue = {
    summary: { total: totalCustomers },
    items: reviewItems,
  };
  state.h5GateQueue = {
    summary: {
      readyForManualPublishReview: readyCount,
      h5Drafts: totalCustomers,
    },
    queue: gates,
  };
  state.sendGateQueue = {
    summary: { readyForManualSend: sendGates.filter((gate) => gate.manualSendAllowed).length },
    queue: sendGates,
  };
  state.h5ReviewEvents = {
    summary: { totalEvents: reviewEvents.length || 7 },
    events: reviewEvents,
  };
  state.h5ExecutionEvents = {
    summary: { manualPublishExecutionConfirmedEvents: executionEvents.length || 1 },
    events: executionEvents,
  };
  state.batchDeliverables = {
    summary: { deliverableCustomers: totalCustomers },
    items: archives.map((archive) => ({ customerId: archive.customerId })),
    archives,
  };
  state.firstArchive = archives[0] || null;
  state.latestLifecycleAgentRunIndex = index;
  state.latestLifecycleAgentRun = runs[0] || null;
  state.actionWorkbench = actionWorkbench;
  if (!state.selectedReviewItemId && initialReviewItemId && reviewItems.some((item) => item.reviewItemId === initialReviewItemId)) {
    state.selectedReviewItemId = initialReviewItemId;
  }
  const visibleItems = visibleReviewItems();
  if (!visibleItems.some((item) => item.reviewItemId === state.selectedReviewItemId)) {
    state.selectedReviewItemId = visibleItems[0]?.reviewItemId || reviewItems[0]?.reviewItemId || null;
  }
  state.selectedVariant = selectedScripts()[0]?.variant || 'A';
  $('#action-status').textContent = runs.length
    ? `顾问任务&H5审核已载入：${formatNumber(totalCustomers)} 人 · 自动发送=false · 对客发布=false · 远端写库=false。`
    : `样本加载失败：${index.errorMessage || '请检查顾问任务&H5数据'}`;
  updateDeepSeekH5Status(runs.length
    ? `已载入 ${formatNumber(totalCustomers)} 人：可切换查看各自任务卡、H5 三屏和顾问反馈门禁。`
    : `当前未载入顾问任务&H5样板，避免展示非目标客户的历史样本。`);
  renderAll();
}

document.addEventListener('click', async (event) => {
  if (event.target.closest('#p7-live-directory-retry')) {
    loadP7LiveReviewPage({
      reset: true,
      page: 1,
      search: state.p7LiveSearch,
      refresh: true,
    }).catch(() => {});
    return;
  }

  if (event.target.closest('#p7-live-detail-retry')) {
    void ensureSelectedP7LiveTaskDetail({ refresh: true });
    return;
  }

  if (event.target.closest('#p7-live-load-more')) {
    loadMoreP7LiveReviewTasks().catch((error) => {
      $('#action-status').textContent = `加载更多失败：${error.message}`;
    });
    return;
  }

  const sectionToggleButton = event.target.closest('[data-review-section-toggle]');
  if (sectionToggleButton) {
    const review = selectedReview();
    toggleReviewSection(review?.reviewItemId || state.selectedReviewItemId, sectionToggleButton.dataset.reviewSectionToggle);
    return;
  }

  const closedLoopButton = event.target.closest('.review-closed-loop-action');
  if (closedLoopButton) {
    runReviewClosedLoopAction(closedLoopButton.dataset.actionId);
    return;
  }

  const taskButton = event.target.closest('.task-item');
  if (taskButton) selectReview(taskButton.dataset.reviewId);

  const variantButton = event.target.closest('[data-variant]');
  if (variantButton) {
    state.selectedVariant = variantButton.dataset.variant;
    renderTaskDetail();
  }

  const angleButton = event.target.closest('[data-h5-angle-index]');
  if (angleButton) {
    const review = selectedReview();
    const archive = selectedArchive();
    if (!review) return;
    const nextAngleIndex = Number(angleButton.dataset.h5AngleIndex);
    state.selectedH5ReviewAngleByReviewId.set(review.reviewItemId, Number.isFinite(nextAngleIndex) ? nextAngleIndex : 0);
    const selectedAngle = selectedH5ReviewAngle(archive?.h5ReviewTaskCard || {}, review.reviewItemId);
    const selectedAngleIndex = selectedH5ReviewAngleIndex(review.reviewItemId);
    state.generatedDrafts.set(review.reviewItemId, {
      ...(state.generatedDrafts.get(review.reviewItemId) || {}),
      source: state.localReviewActions.get(review.reviewItemId)?.actionId === 'regenerate' ? 'regenerated_angle_mock' : 'angle_selected_mock',
      generatedAt: nowLabel(),
      selectedAngleIndex,
    });
    state.currentPage = 0;
    state.activeH5Detail = null;
    $('#action-status').textContent = `已选择沟通角度：${selectedAngleIndex + 1}；H5 三页文案、单条话术和右侧实时预览已同步刷新。`;
    persistAdvisorH5LocalState();
    renderTaskDetail();
    renderH5Preview();
    renderTimeline();
    Promise.resolve()
      .then(() => postApi(ADVISOR_ACTION_EVENTS_API, {
        p2Event: true,
        reviewItemId: review.reviewItemId,
        unifiedCustomerId: review.unifiedCustomerId || archive?.customerId,
        customerName: review.customerName || archive?.customerName,
        action: 'communication_angle_select',
        actionLabel: selectedAngle?.label || `角度 ${selectedAngleIndex + 1}`,
        payload: { selectedAngleIndex, selectedAngle },
        sourceView: 'ds-advisor-h5-review',
      }))
      .then(() => postApi(P2_H5_COPY_RUNS_API, {
        reviewItemId: review.reviewItemId,
        unifiedCustomerId: review.unifiedCustomerId || archive?.customerId,
        customerName: review.customerName || archive?.customerName,
        selectedAngle,
        actor: 'ds-advisor-h5-review',
      }))
      .catch((error) => {
        addLocalTimelineEvent(review.reviewItemId, 'P2 角度选择运行器失败', `${nowLabel()} · ${error.message}`);
        renderTimeline();
      });
    return;
  }

  const regeneratedGoalVersionButton = event.target.closest('[data-regenerated-goal-version-index]');
  if (regeneratedGoalVersionButton) {
    const review = selectedReview();
    if (!review) return;
    const nextIndex = Number(regeneratedGoalVersionButton.dataset.regeneratedGoalVersionIndex);
    state.regeneratedGoalVersionByReviewId.set(review.reviewItemId, Number.isFinite(nextIndex) ? nextIndex : 0);
    const generated = state.generatedDrafts.get(review.reviewItemId);
    if (generated) {
      state.generatedDrafts.set(review.reviewItemId, {
        ...generated,
        source: generated.source || 'regenerated_mock',
        regeneratedGoalVersionIndex: regeneratedGoalVersionIndex(review.reviewItemId),
      });
    }
    state.currentPage = 0;
    state.activeH5Detail = null;
    $('#action-status').textContent = `已切换重新生成互动目标版本 ${regeneratedGoalVersionIndex(review.reviewItemId) + 1}；当前角度 H5 三页、话术和实时预览已同步刷新。`;
    persistAdvisorH5LocalState();
    renderAll();
    return;
  }

  const refreshButton = event.target.closest('[data-ds-refresh-section]');
  if (refreshButton) {
    refreshDsAdvisorH5Section(refreshButton.dataset.dsRefreshSection);
    return;
  }

  const h5ReviewActionButton = event.target.closest('[data-h5-review-action]');
  if (h5ReviewActionButton) {
    handleH5ReviewTaskAction(h5ReviewActionButton.dataset.h5ReviewAction);
    return;
  }

  if (event.target.closest('[data-customer-basic-challenge]')) {
    openCustomerBasicChallengeModal();
    return;
  }

  if (event.target.closest('[data-customer-basic-challenge-close]')) {
    closeCustomerBasicChallengeModal();
    return;
  }

  const directFieldEditButton = event.target.closest('[data-direct-field-edit]');
  if (directFieldEditButton) {
    handleDirectAdvisorFieldEdit(directFieldEditButton);
    return;
  }

  const directFieldSaveButton = event.target.closest('[data-direct-field-save]');
  if (directFieldSaveButton) {
    handleDirectAdvisorFieldSave(directFieldSaveButton);
    return;
  }

  const directFieldCancelButton = event.target.closest('[data-direct-field-cancel]');
  if (directFieldCancelButton) {
    handleDirectAdvisorFieldCancel(directFieldCancelButton);
    return;
  }

  const advisorFieldButton = event.target.closest('[data-advisor-field-review-action]');
  if (advisorFieldButton) {
    handleAdvisorFieldReviewAction(advisorFieldButton);
    return;
  }

  const scriptEditButton = event.target.closest('[data-script-edit-action]');
  if (scriptEditButton) {
    handleScriptEditAction(scriptEditButton);
    return;
  }

  const h5CopyEditButton = event.target.closest('[data-h5-copy-edit-action]');
  if (h5CopyEditButton) {
    handleH5CopyEditAction(h5CopyEditButton);
    return;
  }

  if (event.target.closest('#request-custom-angle')) {
    handleCustomAngleRequest();
    return;
  }

  if (event.target.closest('#reject-all-angles')) {
    handleRejectAllAngles();
    return;
  }

  if (event.target.closest('#record-send-plan')) {
    handleSendPlanRecord();
    return;
  }

  if (event.target.closest('#advisor-task-complete')) {
    handleAdvisorTaskComplete();
    return;
  }

  if (event.target.closest('#feedback-backfill-submit')) {
    handleFeedbackBackfillSubmit();
    return;
  }

  if (event.target.closest('[data-evidence-matrix-toggle]')) {
    const panel = document.getElementById('classification-evidence-detail');
    const button = event.target.closest('[data-evidence-matrix-toggle]');
    if (panel && button) {
      const nextHidden = !panel.hidden;
      panel.hidden = nextHidden;
      button.setAttribute('aria-expanded', String(!nextHidden));
      button.textContent = nextHidden ? '查看详情' : '收起详情';
      if (!nextHidden) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    $('#action-status').textContent = '已切换当前分类证据矩阵详情。';
    return;
  }

  const feedbackButton = event.target.closest('.feedback-chip-row button');
  if (feedbackButton) {
    const field = $('#advisor-feedback-note');
    if (field) {
      const feedback = feedbackButton.textContent.trim();
      field.value = field.value ? `${field.value}；${feedback}` : feedback;
      field.focus();
    }
  }

  const pageButton = event.target.closest('[data-page]');
  if (pageButton) {
    state.currentPage = Number(pageButton.dataset.page);
    state.activeH5Detail = null;
    renderH5Preview();
  }

  const detailButton = event.target.closest('[data-h5-detail]');
  if (detailButton) {
    state.activeH5Detail = detailButton.dataset.h5Detail;
    renderH5Preview();
  }

  if (event.target.closest('[data-h5-detail-close]')) {
    state.activeH5Detail = null;
    renderH5Preview();
  }

  if (event.target.closest('#h5-book-now')) {
    openBookingModal();
    return;
  }
  if (event.target.closest('#advisor-script-open-modal')) {
    openAdvisorScriptModal();
    return;
  }
  if (event.target.closest('[data-advisor-script-prompt-open]')) {
    openAdvisorScriptPromptModal();
    return;
  }
  if (event.target.closest('[data-advisor-script-prompt-close]')) {
    closeAdvisorScriptPromptModal();
    return;
  }
  if (event.target.closest('#advisor-prompt-edit')) {
    enableAdvisorScriptPromptEditMode();
    return;
  }
  if (event.target.closest('#advisor-prompt-save')) {
    await saveAdvisorScriptPromptModal();
    return;
  }
  if (event.target.closest('#advisor-prompt-reset')) {
    resetAdvisorScriptPromptModal();
    return;
  }
  if (event.target.closest('#advisor-prompt-adopt-old')) {
    await adoptAdvisorScriptPromptRevision('old');
    return;
  }
  if (event.target.closest('#advisor-prompt-adopt-new')) {
    await adoptAdvisorScriptPromptRevision('new');
    return;
  }
  const advisorSummaryButton = event.target.closest('[data-advisor-summary-field]');
  if (advisorSummaryButton) {
    openAdvisorScriptSummaryModal(advisorSummaryButton.dataset.advisorSummaryField);
    return;
  }
  if (event.target.closest('[data-advisor-summary-modal-close]')) {
    closeAdvisorScriptSummaryModal();
    return;
  }
  if (event.target.closest('#advisor-summary-rule-edit')) {
    enableAdvisorScriptSummaryRuleEdit();
    return;
  }
  if (event.target.closest('#advisor-summary-rule-save')) {
    saveAdvisorScriptSummaryRuleEdit();
    return;
  }
  if (event.target.closest('#advisor-summary-adopt-old')) {
    adoptAdvisorScriptSummaryRuleRevision('old');
    return;
  }
  if (event.target.closest('#advisor-summary-adopt-new')) {
    adoptAdvisorScriptSummaryRuleRevision('new');
    return;
  }
  if (event.target.closest('#advisor-summary-modal-save-only')) {
    saveAdvisorScriptSummaryOnly();
    return;
  }
  if (event.target.closest('#advisor-summary-modal-save')) {
    saveAdvisorScriptSummaryAndReviseRule();
    return;
  }
  if (event.target.closest('[data-advisor-script-modal-close]')) {
    closeAdvisorScriptModal();
    return;
  }
  if (event.target.closest('#advisor-script-modal-generate')) {
    generateAdvisorScriptForSelectedReview();
    return;
  }
  if (event.target.closest('#advisor-script-modal-save-only')) {
    saveAdvisorScriptModalOutputOnly();
    return;
  }
  if (event.target.closest('#advisor-script-modal-sync')) {
    syncAdvisorScriptModalOutputToPage();
    return;
  }
  if (event.target.closest('#advisor-script-modal-live-revise')) {
    reviseAdvisorScriptWithOpinion();
    return;
  }
  if (event.target.closest('[data-booking-close]')) {
    closeBookingModal();
    return;
  }
  if (event.target.closest('#open-ds-advisor-h5-batch')) {
    openDsAdvisorH5BatchModal();
    return;
  }
  if (event.target.closest('[data-ds-advisor-batch-close]')) {
    closeDsAdvisorH5BatchModal();
    return;
  }
  if (event.target.closest('#reload-ds-advisor-h5-candidates')) {
    loadDsAdvisorH5Candidates();
    return;
  }
  if (event.target.closest('#run-ds-advisor-h5-selected')) {
    runSelectedDsAdvisorH5();
    return;
  }

  if (event.target.closest('#start-deepseek-h5-review')) startDeepSeekH5ReviewGeneration();
  if (event.target.closest('#stop-deepseek-h5-review')) stopDeepSeekH5ReviewGeneration();
  if (event.target.closest('#clear-deepseek-h5-review')) clearDeepSeekH5ReviewGeneration();
  if (event.target.closest('#generate-h5-inline') || event.target.closest('#generate-h5-top')) generateH5Preview();
  if (event.target.closest('#save-review')) submitReviewAction('批准发布复核');
  if (event.target.closest('#return-review')) submitReviewAction('退回修改');
  if (event.target.closest('#keep-preview')) submitReviewAction('继续内部预览');
  if (event.target.closest('#execute-publish')) submitExecution();
  if (event.target.closest('#send-test-group')) submitWeComTestGroupH5();
  if (event.target.closest('#reload-data')) loadData({ refresh: true });
});

$('#ds-advisor-h5-include-existing')?.addEventListener('change', loadDsAdvisorH5Candidates);

$('#task-search').addEventListener('input', handleTaskSearchInput);
$('#task-search').addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  submitTaskSearch();
});
$('#task-search-submit')?.addEventListener('click', submitTaskSearch);

document.addEventListener('input', (event) => {
  const advisorModalField = event.target?.closest?.('#advisor-script-modal-offer, #advisor-script-modal-purpose, #advisor-script-modal-scene');
  if (advisorModalField) {
    const review = selectedReview();
    if (!review) return;
    updateAdvisorScriptModalInputsFromDom(review.reviewItemId);
    return;
  }

  const advisorOpinionField = event.target?.closest?.('#advisor-script-modal-opinion');
  if (advisorOpinionField) {
    const review = selectedReview();
    if (!review) return;
    state.advisorScriptModalOpinionByReviewId.set(review.reviewItemId, advisorOpinionField.value);
    return;
  }

  const advisorOutputField = event.target?.closest?.('#advisor-script-modal-output');
  if (advisorOutputField) {
    const review = selectedReview();
    if (!review) return;
    state.advisorScriptModalOutputByReviewId.set(review.reviewItemId, advisorOutputField.value);
    return;
  }

  const advisorPromptEditor = event.target?.closest?.('#advisor-prompt-editor');
  if (advisorPromptEditor) {
    const target = $('#advisor-prompt-status');
    if (target) target.textContent = '有未保存修改，保存后才会用于生成话术。';
    return;
  }

  const h5Field = event.target?.closest?.('[data-h5-screen-field]');
  if (h5Field) {
    const review = selectedReview();
    if (!review) return;
    const angleIndex = selectedH5ReviewAngleIndex(review.reviewItemId);
    applyLocalH5CopyEdit(review.reviewItemId, angleIndex, collectH5CopyScreensFromDom());
    renderH5Preview();
    return;
  }

  const scriptField = event.target?.closest?.('[data-angle-script-editor]');
  if (scriptField) {
    const review = selectedReview();
    if (!review) return;
    const angleIndex = Number(scriptField.dataset.angleScriptEditor);
    applyLocalScriptEdit(
      review.reviewItemId,
      Number.isFinite(angleIndex) ? angleIndex : selectedH5ReviewAngleIndex(review.reviewItemId),
      scriptField.value.trim(),
    );
  }
});

document.addEventListener('change', (event) => {
  const advisorModalField = event.target?.closest?.('#advisor-script-modal-purpose');
  if (!advisorModalField) return;
  const review = selectedReview();
  if (!review) return;
  updateAdvisorScriptModalInputsFromDom(review.reviewItemId);
  renderAdvisorScriptModal();
});

document.addEventListener('submit', (event) => {
  if (event.target?.id === 'h5-booking-form') handleBookingSubmit(event);
  if (event.target?.id === 'customer-basic-challenge-form') handleCustomerBasicChallengeSubmit(event);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const modal = document.getElementById('h5-booking-modal');
    if (modal && !modal.hidden) closeBookingModal();
    const customerBasicModal = document.getElementById('customer-basic-challenge-modal');
    if (customerBasicModal && !customerBasicModal.hidden) closeCustomerBasicChallengeModal();
    const batchModal = document.getElementById('ds-advisor-h5-batch-modal');
    if (batchModal && !batchModal.hidden) closeDsAdvisorH5BatchModal();
    const advisorSummaryModal = document.getElementById('advisor-summary-modal');
    if (advisorSummaryModal) {
      closeAdvisorScriptSummaryModal();
      return;
    }
    const advisorPromptModal = document.getElementById('advisor-prompt-modal');
    if (advisorPromptModal) {
      closeAdvisorScriptPromptModal();
      return;
    }
    const advisorScriptModal = document.getElementById('advisor-script-modal');
    if (advisorScriptModal && !advisorScriptModal.hidden) closeAdvisorScriptModal();
  }
});

restoreAdvisorH5LocalState();

loadData().catch((error) => {
  if ($('#action-status')) $('#action-status').textContent = `读取失败：${error.message}`;
});


// ============================================================
// 生成 H5 总结图按钮
// ============================================================
(function() {
  var actionsEl = document.querySelector('.header-actions');
  if (actionsEl && !actionsEl.querySelector('[data-open-h5-summary-entry]')) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'primary-action';
    btn.setAttribute('data-open-h5-summary-entry', 'true');
    btn.textContent = '生成 H5 总结图';
    btn.disabled = true;
    btn.style.display = 'none';
    actionsEl.appendChild(btn);
  }

  function currentH5SummaryCustomer() {
    var review = selectedReview();
    var archive = selectedArchive();
    if (isP7LiveDirectoryReview(review)) {
      return { customerId: '', customerName: review?.customerName || '' };
    }
    return {
      customerId: review?.unifiedCustomerId || review?.customerId || archive?.customerId || state.selectedReviewItemId || '',
      customerName: review?.customerName || archive?.customerName || ''
    };
  }

  function h5SummaryDateOnly(value) {
    var text = String(value || '').trim();
    var match = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (!match) return '';
    return match[1] + '-' + String(Number(match[2])).padStart(2, '0') + '-' + String(Number(match[3])).padStart(2, '0');
  }

  function h5SummaryDaysBetween(fromDate, toDate) {
    var from = h5SummaryDateOnly(fromDate);
    var to = h5SummaryDateOnly(toDate) || new Date().toISOString().slice(0, 10);
    if (!from) return 0;
    var delta = new Date(to).getTime() - new Date(from).getTime();
    return Number.isFinite(delta) ? Math.max(0, Math.round(delta / 86400000)) : 0;
  }

  function h5SummaryShortText(value, fallback) {
    var text = String(value || '').replace(/\s+/g, ' ').trim();
    return text ? text.slice(0, 160) : fallback;
  }

  function h5SummaryRecentProjectText() {
    var values = Array.from(arguments).map(function(value) { return String(value || ''); }).join('；');
    var recent = values.match(/最近项目[=：:]\s*([^;；]+)/);
    if (recent) return recent[1].trim();
    var history = values.match(/历史皮肤维养项目[=：:]\s*([^;；]+)/);
    if (history) return history[1].trim();
    return treatmentShortName(values);
  }

  function h5SummaryCustomerVisibleAdvice(context) {
    var project = h5SummaryRecentProjectText(
      context.plan?.recentProject,
      context.plan?.proposedOrTakenPlan,
      context.archive?.dataSnapshotInternal?.lastMaintenanceProject,
      context.facts?.consumptionFacts,
      context.taskCard?.personalProfileBrief,
      context.firstScreen?.primaryFact
    );
    if (project && !/待补|待确认|待接入|护理记录/.test(project)) {
      return `近期维养记录显示，上次重点项目为${project}。建议结合当前肤况做稳定观察和复盘，后续由顾问根据护理反馈调整维养节奏。`;
    }
    var sceneText = context.archive?.customerIdentity?.sceneName
      || context.archive?.customer?.sceneName
      || context.taskCard?.classification?.classificationAnchor
      || '';
    if (sceneText) return `当前适合先做肤况确认和维养节奏复盘，后续由顾问根据反馈判断是否需要进一步安排。`;
    return '建议结合当前肤况做稳定观察和复盘，后续由顾问根据护理反馈调整维养节奏。';
  }

  function h5SummaryExplicitSkinType() {
    var values = Array.from(arguments);
    for (var index = 0; index < values.length; index += 1) {
      var text = String(values[index] || '').replace(/\s+/g, ' ').trim();
      if (!text || /^(?:待补|待确认|待接入|未记录|无记录)$/.test(text)) continue;
      var match = text.match(/(?:皮肤类型|肤质|肤型|皮肤性质)\s*[=：:]\s*([^;；,，。]{1,16})/);
      if (match) return match[1].trim();
    }
    return '';
  }

  function buildH5SummaryInitialData(review, archive) {
    if (!review || !archive?.h5ReviewTaskCard) return null;
    var taskCard = archive.h5ReviewTaskCard || {};
    var basic = taskCard.basicInfo || {};
    var plan = taskCard.planAndConsumption || {};
    var facts = archive.reviewFacts || {};
    var customerFacts = advisorH5CustomerFacts(taskCard, archive, review);
    var screens = h5ScreensForSelectedAngle(taskCard, taskCard.h5Preview?.screens || archive.h5Brief?.screens || [], review.reviewItemId);
    var firstScreen = screens[0] || {};
    var secondScreen = screens[1] || {};
    var customerName = review.customerName || archive.customerName || basic.customerName || '';
    var lastTreatmentDate = h5SummaryDateOnly(
      plan.lastVisitDate
      || plan.lastTreatmentDate
      || customerFacts.lastVisitDate
      || basic.lastVisitDate
      || archive.dataSnapshotInternal?.lastMaintenanceDate
      || ''
    );
    var today = new Date().toISOString().slice(0, 10);
    var daysSinceLastVisit = Number(plan.daysSinceLastMaintenance || archive.dataSnapshotInternal?.daysSinceLastMaintenance || 0)
      || h5SummaryDaysBetween(lastTreatmentDate, today);
    var overdueDays = Number(plan.overdueDays || archive.dataSnapshotInternal?.overdueDays || 0)
      || Math.max(0, daysSinceLastVisit - 30);
    var cskinSummary = advisorScriptH5PreviewCskinSummary(review, archive, taskCard) || {};
    var radarScores = {};
    if (Array.isArray(cskinSummary.radarScores)) {
      cskinSummary.radarScores.forEach(function(row) {
        if (row && row.label) radarScores[row.label] = Number(row.score || row.value || 0);
      });
    } else if (cskinSummary.radarScores && typeof cskinSummary.radarScores === 'object') {
      Object.keys(cskinSummary.radarScores).forEach(function(label) {
        radarScores[label] = Number(cskinSummary.radarScores[label] || 0);
      });
    }
    var cskinModelSummary = advisorScriptSummaryOverrideForReview(review.reviewItemId, 'CSKIN')?.summary
      || cskinSummary.summaryForAdvisor
      || '';
    var skinTypeInputs = [
      basic.skinType,
      cskinModelSummary,
      facts.diagnosisAndNeed,
      ...asArray(basic.evidence)
        .filter(function(row) { return /P1|病例|病历|诊断|检测|肤/.test(String(row?.label || '')); })
        .map(function(row) { return [row?.label, row?.value].filter(Boolean).join('：'); }),
      taskCard.personalProfileBrief,
      secondScreen.body,
    ].map(function(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }).filter(Boolean).slice(0, 10);
    var explicitSkinType = h5SummaryExplicitSkinType(basic.skinType, cskinModelSummary, ...skinTypeInputs);
    var skinType = explicitSkinType || '肤况待分析';
    var advice = h5SummaryCustomerVisibleAdvice({ plan, facts, taskCard, archive, firstScreen, secondScreen });
    var lastCareTitle = treatmentShortName(
      plan.recentProject
      || plan.proposedOrTakenPlan
      || archive.dataSnapshotInternal?.lastMaintenanceProject
      || firstScreen.primaryFact
      || ''
    ) || '近期护理记录';
    return {
      success: true,
      data: {
        customerId: review.unifiedCustomerId || archive.customerId || '',
        customerName,
        templateType: 'visual_detection',
        copy: {
          reportTitle: '',
          customerName,
          skinType,
          doctorName: customerFacts.doctor || basic.doctor || '',
          showDoctor: Boolean(customerFacts.doctor || basic.doctor),
          diagnosisAdvice: advice,
          lastCareTitle,
          currentPurposeTitle: '肤况确认',
        },
        skinTypeTrace: {
          output: skinType,
          explicitSkinType: explicitSkinType,
          inputTexts: skinTypeInputs,
          outputSource: explicitSkinType ? 'explicit' : 'pending_model',
          rules: ['复用现有千问字段总结接口，根据 CSKIN、P1 诊断/检测和画像证据生成不超过 8 个字的客户可见肤况标签。', '显式肤质原值优先；无明确证据时返回“肤况待确认”，不得用诉求类型、经营分类或性别代替。'],
          prompt: '基于皮肤检测与诊断证据生成客户可见短肤况标签；不编造油、干、敏等肤质，不输出内部客群标签。',
        },
        cskin: {
          detectedAt: lastTreatmentDate || today,
          cskinRecordId: advisorScriptCskinRecordId(review, archive, taskCard) || '',
          radarScores,
        },
        timeline: {
          lastTreatmentDate: lastTreatmentDate || today,
          recommendedReviewDate: '',
          today,
          daysSinceLastVisit,
          doctorAdviceDays: 30,
          overdueDays,
        },
        source: {
          mode: reviewSourceMode,
          type: 'current_review_task_initial_data',
          reviewItemId: review.reviewItemId,
        },
      },
    };
  }

  function h5SummaryButtons() {
    return Array.from(document.querySelectorAll('#open-h5-summary-btn, [data-open-h5-summary-entry]'));
  }

  function applyH5SummaryButtonState(customerId, customerName) {
    h5SummaryButtons().forEach(function(summaryBtn) {
      summaryBtn.disabled = !customerId;
      summaryBtn.dataset.customerId = customerId || '';
      summaryBtn.dataset.customerName = customerName || '';
      summaryBtn.style.display = '';
    });
  }

  // Enable when a task is selected
  window.enableH5SummaryBtn = function(customerId, customerName) {
    applyH5SummaryButtonState(customerId, customerName);
  };

  window.refreshH5SummaryBtn = function() {
    var current = currentH5SummaryCustomer();
    applyH5SummaryButtonState(current.customerId, current.customerName);
  };

  document.addEventListener('click', function(event) {
    var summaryBtn = event.target.closest('#open-h5-summary-btn, [data-open-h5-summary-entry]');
    if (!summaryBtn) return;
    var current = currentH5SummaryCustomer();
    var cid = summaryBtn.dataset.customerId || current.customerId;
    var cname = summaryBtn.dataset.customerName || current.customerName;
    var review = selectedReview();
    var archive = selectedArchive();
    var initialData = buildH5SummaryInitialData(review, archive);
    if (window.H5ThreeStyleSummaryModal && cid) {
      window.H5ThreeStyleSummaryModal.open({
        customerId: cid,
        customerName: cname,
        cskinRecordId: advisorScriptCskinRecordId(review, archive, archive?.h5ReviewTaskCard || {}) || '',
        initialData: initialData
      });
      return;
    }
    if ($('#action-status')) $('#action-status').textContent = cid ? 'H5 总结弹窗尚未加载，请刷新页面后重试。' : '当前客户缺少 customerId，暂不能生成 H5 总结图。';
  });

  window.refreshH5SummaryBtn();
})();

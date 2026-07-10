const state = {
  overview: null,
  selectedEntity: null,
  entityOffset: 0,
  entityLimit: 50,
  entitySearch: '',
  selectedCustomer: null,
  sceneUsers: [],
  customerClassifyBy: 'priority',
  customerArchiveFixtures: null,
  customerArchiveDetailCache: new Map(),
  customerArchiveDetailInFlight: new Map(),
  customerArchiveDetailRequestSeq: 0,
  customerArchivePreloadRunId: 0,
  customerArchivePreloadStatus: null,
  customerChapterWecomRenderJob: null,
  customerArchiveFixturesError: null,
  customerArchiveOverrides: null,
  archiveQuality: null,
  archiveBlockSummaries: null,
  chenSceneUserMdFixture: null,
  dsV3SelectedRunId: null,
  requirementAudit: null,
  detailItems: new Map(),
  mdEvidenceDetails: new Map(),
  dsV3MdEvidenceDetails: new Map(),
  lifecyclePayload: null,
  lifecycleBatch20: null,
  advisorReviewQueue: null,
  feedbackTestUnits: null,
  advisorActionEvents: null,
  interactionOutcomeEvents: null,
  feedbackLearningEvents: null,
  lifecycleKpiSummary: null,
  lifecycleRuleCandidates: null,
  advisorExecutionPack: null,
  manualSendGateQueue: null,
  manualSendEvents: null,
  postSendFollowupQueue: null,
  nextRoundActionPlan: null,
  adminTodoCenter: null,
  adminTodoEvents: null,
  adminTodoSourceSyncPlan: null,
  adminSourceSyncEvents: null,
  adminSourceSyncExecutionEvents: null,
  mvpResultScorecard: null,
  realBusinessTruthBackfillPlan: null,
  productClassificationSeed: null,
  productClassificationReviewQueue: null,
  productClassificationReviewEvents: null,
  productClassificationReviewExecutionPack: null,
  productClassificationReviewImportContract: null,
  productClassificationReviewImportReadinessReport: null,
  productClassificationReviewDecisionGuide: null,
  productClassificationRecomputePlan: null,
  productClassificationImpactPlan: null,
  lifecycleTraceabilityMatrix: null,
  adminCustomerDetailPack: null,
  h5PublishGateQueue: null,
  h5PublishReviewEvents: null,
  h5PublishExecutionEvents: null,
  h5EngagementEvents: null,
  h5FeedbackLearningBridge: null,
  h5FormalOutcomeEvents: null,
  h5PostFormalFollowupQueue: null,
  h5PostFormalFollowupEvents: null,
  h5NoConversionReviewQueue: null,
  h5NoConversionReviewEvents: null,
  productCopyReviewQueue: null,
  productCopyReviewEvents: null,
  gateRecalculationPlan: null,
  databaseAnalysisTrainingPack: null,
  deliverableDraftArchive: null,
  latestLifecycleAgentRun: null,
  latestLifecycleAgentRunIndex: null,
  profileStrategyCenterAnalysis: null,
  profileStrategyCenterAnalyses: [],
  profileStrategyMethodology: null,
  profileStrategyMethodologyHistory: null,
  strategyRefreshGate: null,
  profileStrategyEvolutionCandidates: null,
  profileStrategyCenterSelectedCaseId: null,
  profileStrategySyncOptions: null,
  profileStrategySyncOptionsLoading: false,
  profileStrategySyncMode: 'reanalyze',
  selectedDeepSeekRunCustomerCode: null,
  deepseekResultsBusy: false,
  deepseekResultsAbort: null,
  selectedAiInsightCustomerId: null,
  dsExtractionCheck: null,
  dsExtractionBusy: false,
  dsExtractionAbort: null,
  dsTruthRepairBusyCustomerId: null,
  selectedDsExtractionCustomerCode: null,
  dsV3Panorama: null,
  dsV3Busy: false,
  dsProfileAnalysis: null,
  dsProfileSelectedRunId: null,
  dsProfileBusy: false,
  dsProfileCandidates: [],
  dsProfileBatchBusy: false,
  dsRuleWorkbench: null,
  dsRuleWorkbenchSelectedRuleId: null,
  dsRuleWorkbenchDraftDirty: false,
  advisorArchiveDisputes: [],
  liveArchiveCompletedCustomers: new Map(),
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const safeArray = (value) => (Array.isArray(value) ? value : []);
const uniqueStrings = (values) => Array.from(new Set(safeArray(values)
  .map((value) => String(value || '').trim())
  .filter(Boolean)));

function showFloatingError(message) {
  document.querySelectorAll('.floating-results').forEach((node) => node.remove());
  const panel = document.createElement('div');
  panel.className = 'floating-results';
  panel.setAttribute('role', 'alert');
  panel.innerHTML = `
    <pre>${escapeHtml(message || '页面读取失败')}</pre>
    <button type="button" class="floating-results-close" aria-label="关闭错误提示" title="关闭">关闭</button>
  `;
  panel.querySelector('.floating-results-close')?.addEventListener('click', () => panel.remove());
  document.body.appendChild(panel);
}

const DS_EXTRACTION_BRANCH_LABELS = [
  ['evidenceReadiness', '证据准备度'],
  ['consumerProfile', '客户画像'],
  ['coreMotivationDriver', '核心动机'],
  ['psychologyModel', '心理模型'],
  ['lifecycleDiagnosis', '生命周期诊断'],
  ['opportunityScoring', '机会判断'],
  ['contentStrategy', '内容策略'],
  ['trainingEvaluation', '训练评估'],
  ['synthesis', '综合结论'],
];

const DS_EXTRACTION_BRANCH_ALIASES = {
  evidence_readiness: 'evidenceReadiness',
  consumer_profile: 'consumerProfile',
  customer_profile: 'consumerProfile',
  core_motivation_driver: 'coreMotivationDriver',
  motivation_driver: 'coreMotivationDriver',
  psychology_model: 'psychologyModel',
  lifecycle_diagnosis: 'lifecycleDiagnosis',
  opportunity_scoring: 'opportunityScoring',
  content_strategy: 'contentStrategy',
  training_evaluation: 'trainingEvaluation',
  final_synthesis: 'synthesis',
};

const DS_EXTRACTION_LIMIT = 'all';
const DS_EXTRACTION_PRIMARY_API = '/api/ds-scene1-source-pipeline';
const DS_EXTRACTION_FALLBACK_API = '/api/ds-scene1-extraction';
const DS_EXTRACTION_API_BASES = [DS_EXTRACTION_PRIMARY_API, DS_EXTRACTION_FALLBACK_API];
const DS_RULE_WORKBENCH_API = '/api/ds-rule-workbench';

const DS_EXTRACTION_PHASES = [
  { id: 'build_database', label: '建库' },
  { id: 'pull_source', label: '拉源' },
  { id: 'filter_scene1', label: '筛选' },
  { id: 'ds_extract', label: '规则直抽' },
  { id: 'write_target', label: '写目标库' },
  { id: 'completed', label: '完成' },
];
const DS_TRUTH_REPAIR_STEPS = [
  { id: 'read_titles', label: '读标题' },
  { id: 'query_sources', label: '查源' },
  { id: 'llm_judgement', label: 'DeepSeek判定' },
  { id: 'result_written', label: '写入结果' },
  { id: 'completed', label: '完成校验' },
];

const DS_EXTRACTION_EMPTY_MESSAGE = '尚未运行。本页当前为空状态：等待从新空库建表，并从原始源拉取场景一候选客户；只有点击“启动全量抽取”才会创建本地 DS 目标校验结果。';
const DEEPSEEK_DS_RESULTS_API = '/api/backend/deepseek/ds-scene1';
const DS_V3_PANORAMA_API = '/api/ds-v3';
const DS_PROFILE_ANALYSIS_API = '/api/ds-profile-analysis';
const PROFILE_STRATEGY_CENTER_API = '/api/profile-strategy-center';
const PROFILE_STRATEGY_CENTER_LIVE_SYNC_API = '/api/profile-strategy-center/live/sync';
const PROFILE_STRATEGY_METHODOLOGY_API = '/api/profile-strategy-methodology';
const PROFILE_STRATEGY_EVOLUTION_API = '/api/lifecycle/strategy-evolution-candidates';
const IS_LIVE_ARCHIVE_MODE = true;
const CUSTOMER_ARCHIVE_FIXTURES_API = IS_LIVE_ARCHIVE_MODE ? '/api/customer-archive-fixtures/live' : '/api/customer-archive-fixtures';
const XIZI_MANAGER_BATCH_STATUS_API = '/api/customer-archive-fixtures/live/xizi-manager-batch/status';
const XIZI_MANAGER_BATCH_STREAM_API = '/api/customer-archive-fixtures/live/xizi-manager-batch/stream';
const XIZI_MANAGER_BATCH_STOP_API = '/api/customer-archive-fixtures/live/xizi-manager-batch/stop';
const PHONE_BATCH_STATUS_API = '/api/customer-archive-fixtures/live/phone-batch/status';
const PHONE_BATCH_STREAM_API = '/api/customer-archive-fixtures/live/phone-batch/stream';
const CUSTOMER_ARCHIVE_OVERRIDES_API = '/api/customer-archive-overrides';
const ARCHIVE_CHALLENGES_API = '/api/lifecycle/archive-challenges';
const ADVISOR_ARCHIVE_DISPUTES_STORAGE_KEY = 'yanshu-advisor-archive-disputes:v1';
const ALLOWED_MAIN_VIEWS = new Set(['methodology', 'customers', 'lifecycle', 'deepseek-h5-review']);
const CHEN_SCENE_USER_MD_FIXTURE_API = '/test-data/chen-xisheng-scene-user-md.json';
const LIFECYCLE_ANALYSIS_DATE = '2026-06-25';

const LIFECYCLE_DEMAND_TYPE_STANDARDS = [
  {
    label: '治疗型客户',
    typical: '斑、敏、痘、红斑、炎症、问题肌',
    feature: '刚需、明确治疗目标、医生建议周期、治疗终点清晰，客户依从性重要。',
    operation: '强调治疗连续性和复诊周期，展示检测或改善证据，避免简单推项目。',
  },
  {
    label: '维养型客户',
    typical: '肤色、肤质、暗沉、毛孔、水光、光子、日常状态管理',
    feature: '长期维护、周期性明显、场景触发明显，对体验、关怀和提醒更敏感。',
    operation: '结合季节、紫外线、出游、身份和状态维护，不制造焦虑。',
  },
  {
    label: '抗衰型客户',
    typical: '热玛吉、超声炮、紧致提升、年轻化管理、轮廓抗衰',
    feature: '低频、高客单、决策周期较长，通常一年一到两次，更依赖专业评估。',
    operation: '强调年度年轻化规划、效果维持周期和医生评估，高潜客户转人工重点经营。',
  },
  {
    label: '美化型客户',
    typical: '轮廓调整、鼻部改善、下巴调整、局部形态优化、审美型需求',
    feature: '一次性或低频，审美判断强，决策风险感高，更依赖案例和医生风格。',
    operation: '强调审美方案、术前沟通、恢复期和长期效果，复杂需求转人工或医生参与。',
  },
  {
    label: '整全护肤型客户',
    typical: '医美后护肤适配、修复维稳、效果维持、医生视角护肤建议',
    feature: '连接医美服务和护肤品零售，既判断适配，也判断项目后的加成关系。',
    operation: '只能建立在医生视角、肤质适配和项目关系上，不能变成简单卖货。',
  },
];

const LIFECYCLE_STAGE_STANDARDS = [
  {
    label: '尝鲜期',
    signal: '首次体验、只做过一次、对效果周期认知不足、尚未建立长期信任。',
    goal: '让客户理解疗程逻辑，降低不确定感，引导其完成后续安排。',
  },
  {
    label: '治疗执行期',
    signal: '有明确治疗问题、医生已有建议、疗程尚未完成、到了推荐回访周期。',
    goal: '提醒客户按时回访，维持治疗连续性。',
  },
  {
    label: '稳固期',
    signal: '已完成两到三次治疗、初步效果出现、需要继续巩固、可能因好转而中断。',
    goal: '强调不要在效果开始出现时中断，帮助完成关键疗程。',
  },
  {
    label: '维养期',
    signal: '主要问题已有改善、进入周期维护，适合季节化和场景化触达。',
    goal: '建立长期维养习惯。',
  },
  {
    label: '未消耗待激活期',
    signal: '已购买项目但尚未消耗，可能遗忘、时间冲突或误以为再次到店还要花钱。',
    goal: '明确提醒客户已经付过款，把沟通重点转向什么时候方便来。',
  },
  {
    label: '流失期',
    signal: '超过合理回访周期、长时间未到店、无近期互动，可能已转向其他机构。',
    goal: '低压唤醒，重新建立联系，不立刻强推开单。',
  },
  {
    label: '高潜升级期',
    signal: '消费价值高、项目品类多、回复意愿强，顾问判断有进一步经营空间。',
    goal: '从自动化触达转为人工一对一经营。',
  },
  {
    label: '风险 / 勿扰期',
    signal: '投诉、低满意度、退款、术后不适、顾问标记不宜主动沟通或系统未记录的特殊情况。',
    goal: '停止自动触达，交由人工判断。',
  },
];

function formatNumber(value) {
  return new Intl.NumberFormat('zh-CN').format(Number(value || 0));
}

function formatArchiveWholeMoney(value) {
  const number = Number(String(value || '').replace(/,/g, ''));
  if (!Number.isFinite(number)) return '';
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(Math.round(number));
}

function isArchiveMoneyLabelText(label) {
  const text = String(label || '');
  if (/(时间|日期|年份|开单|预约|到访|初诊|末诊|last_consumption_time|earliest_order_year)/i.test(text)) return false;
  return /(金额|余额|增值金|消费|消耗|付款|欠款|欠费|退款|合计|实付|应收|monetary|spending|PayAmount|ChargedAmount|GiftAmount|Surplus|accountSurplus)/i.test(text);
}

function formatArchiveMoneyWithContext(prefix, amount) {
  if (/(时间|日期|年份|开单|预约|到访|初诊|末诊)/.test(String(prefix || ''))) return `${prefix}${amount}`;
  return `${prefix}${formatArchiveWholeMoney(amount)}`;
}

function formatArchiveMoneyText(value) {
  const text = String(value || '');
  if (!text) return '';
  const moneyContext = /(金额|余额|增值金|消费|消耗|付款|欠款|欠费|退款|合计|实付|应收|monetary|spending|PayAmount|ChargedAmount|GiftAmount|Surplus|accountSurplus)/i;
  const cleaned = text.replace(/约\s*(\d+)\s*岁/g, '$1岁');
  if (!moneyContext.test(cleaned)) return cleaned;
  return cleaned
    .replace(/((?:金额|余额|增值金|消费|消耗|付款|欠款|欠费|退款|合计|实付|应收)\s+)(-?\d+(?:\.\d+)?)/g, (_, prefix, amount) => formatArchiveMoneyWithContext(prefix, amount))
    .replace(/((?:金额|余额|增值金|消费|消耗|付款|欠款|欠费|退款|合计|实付|应收|monetary|spending|PayAmount|ChargedAmount|GiftAmount|Surplus|accountSurplus)[^0-9\-；;，,。<\n]{0,18}[=：:]?\s*)(-?\d+(?:\.\d+)?)/gi, (_, prefix, amount) => formatArchiveMoneyWithContext(prefix, amount))
    .replace(/(\b(?:bill_pay_amount|charged_amount|bill_owe_amount|owed_amount|refund_amount)\b\s*[=：:]?\s*)(-?\d+(?:\.\d+)?)/gi, (_, prefix, amount) => formatArchiveMoneyWithContext(prefix, amount));
}

function normalizeArchiveStringTree(value) {
  if (typeof value === 'string') return formatArchiveMoneyText(value);
  if (Array.isArray(value)) return value.map(normalizeArchiveStringTree);
  if (value && typeof value === 'object') {
    const normalized = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeArchiveStringTree(item)]));
    if (
      typeof normalized.value === 'string'
      && isArchiveMoneyLabelText(normalized.label || normalized.title || normalized.key || '')
    ) {
      normalized.value = formatArchiveWholeMoney(archiveValueNumber(normalized.value)) || normalized.value;
    }
    return normalized;
  }
  return value;
}

function formatTime(value) {
  if (!value) return '无';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', { hour12: false });
}

function formatRunStatus(status) {
  const labels = {
    ready: '已连接',
    running: '运行中',
    queued: '排队中',
    dry_run: 'dry-run 完成',
    dry_run_completed: 'dry-run 完成',
    dry_run_static_contract: '契约通过',
    generated: '已生成',
    completed: '已完成',
    failed: '失败',
    failed_static_fallback: '失败 · 静态兜底',
    needs_human_review: '需人工复核',
    idle: '待运行',
    stopping: '停止中',
    stopped: '已停止',
    build_database: '建库中',
    pull_source: '拉源中',
    filter_scene1: '筛选中',
    ds_extract: '规则直抽中',
    write_target: '写目标库',
  };
  return labels[status] || status || '待展示';
}

function isCompletedRunStatus(status) {
  return ['completed', 'generated', 'dry_run', 'dry_run_completed', 'dry_run_static_contract'].includes(status);
}

function formatMetricValue(value, unit) {
  if (value === null || value === undefined) return '待补';
  if (unit === 'percent') return `${formatNumber(value)}%`;
  if (unit === 'currency') return `¥${formatNumber(value)}`;
  return formatNumber(value);
}

function stringifyCell(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return formatJson(value);
  return formatHisConsumptionText(value);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parsePlainNumber(value) {
  const text = String(value ?? '').replace(/,/g, '').trim();
  if (!/^-?\d+(\.\d+)?$/.test(text)) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function formatHisCentAmount(value) {
  const number = parsePlainNumber(value);
  if (number === null) return String(value ?? '');
  return (number / 100).toFixed(2);
}

function isHisConsumptionAmountField(field, record) {
  const label = String(field?.label || '');
  if (/(企微|CRM|展示金额|chargedAmount)/i.test(label)) return false;
  const text = label;
  if (!/(HIS|PayAmount|DoneAmount|OweAmount|RefundAmount|原始金额)/i.test(text)) return false;
  if (/(余额|GiftAmount|IntegralAmount|积分|次数|数量|Qty|Cnt|ID|Id|状态)/i.test(label)) return false;
  return /(金额|Amount|PayAmount|DoneAmount|OweAmount|RefundAmount)/i.test(text);
}

function formatHisConsumptionText(value) {
  return String(value ?? '');
}

function isHisConsumptionAmountKey(key) {
  return /^(PayAmount|DoneAmount|OweAmount|RefundAmount|ReceivableAmount|DiscountedAmount|ActualAmount|TotalAmount|pay_amount|done_amount|owe_amount|refund_amount|receivable_amount|bill_pay_amount|bill_receivable_amount|bill_done_amount|unit_price|total_price|real_price)$/i.test(String(key || ''));
}

function formatDisplayJsonValue(value, key = '') {
  if (Array.isArray(value)) return value.map((item) => formatDisplayJsonValue(item));
  if (value && typeof value === 'object') {
    const formatted = {};
    Object.entries(value).forEach(([entryKey, entryValue]) => {
      formatted[entryKey] = formatDisplayJsonValue(entryValue, entryKey);
    });
    if (Object.prototype.hasOwnProperty.call(formatted, 'label') && Object.prototype.hasOwnProperty.call(formatted, 'value')) {
      const field = { label: formatted.label, value: formatted.value };
      if (isHisConsumptionAmountField(field, formatted)) {
        formatted.label = formatMdEvidenceFieldLabel(field, formatted);
        formatted.value = formatHisCentAmount(formatted.value);
      }
    }
    return formatted;
  }
  if (typeof value === 'string') {
    if (isHisConsumptionAmountKey(key) && parsePlainNumber(value) !== null) return formatHisCentAmount(value);
    return formatHisConsumptionText(value);
  }
  if (typeof value === 'number' && isHisConsumptionAmountKey(key)) return Number(formatHisCentAmount(value));
  return value;
}

function formatMdDisplayText(value) {
  return formatHisConsumptionText(value);
}

function formatMdEvidenceFieldLabel(field, record) {
  const label = String(field?.label || '字段');
  if (!isHisConsumptionAmountField(field, record)) return label;
  return label.includes('/100') ? label : `${label}（/100）`;
}

function formatMdEvidenceFieldValue(field, record) {
  if (isHisConsumptionAmountField(field, record)) return formatHisCentAmount(field?.value);
  return formatMdDisplayText(field?.value || '');
}

function formatJson(value) {
  if (!value) return '';
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return JSON.stringify(formatDisplayJsonValue(parsed), null, 2);
  } catch {
    return formatHisConsumptionText(value);
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

const ADVISOR_ARCHIVE_FIELD_MAP = {
  customer_basic_info_block: { isBlock: true },
  customer_name: { customerKeys: ['name', 'customerNameMasked'], displayLabels: ['姓名', '客户姓名', '顾客姓名'], rowKeywords: ['姓名', '顾客姓名', '客户姓名'] },
  customer_id: { displayLabels: ['客户 ID', '顾客ID', 'HIS', 'CRM'], rowKeywords: ['客户 ID', '顾客ID', 'HIS', 'CRM', '统一 ID'] },
  age: { customerKeys: ['ageText'], displayLabels: ['年龄'], rowKeywords: ['年龄'] },
  gender: { customerKeys: ['genderText'], displayLabels: ['性别'], rowKeywords: ['性别'] },
  member_level: { customerKeys: ['memberLevel'], displayLabels: ['等级', '会员等级'], rowKeywords: ['会员等级', '会员', '等级'] },
  source_channel: { customerKeys: ['sourceChannel'], displayLabels: ['来源渠道', '客户来源'], rowKeywords: ['来源渠道', '客户来源', '渠道'] },
  total_consumption: { spendingKeys: ['cumulative_consumption', 'consumption_12m'], displayLabels: ['累计消耗', '累计消费'], rowKeywords: ['累计消耗', '累计消费', '消费金额', '消耗金额'] },
  average_order_value: { displayLabels: ['客单价'], rowKeywords: ['客单价', '订单均价', '开单'] },
  rfm_grade: { customerKeys: ['rfmGrade'], displayLabels: ['RFM'], rowKeywords: ['RFM'] },
  balance_points_summary: { displayLabels: ['余额/积分'], rowKeywords: ['余额', '积分'] },
  clinic: { customerKeys: ['clinicName'], displayLabels: ['门店', '所属门店'], rowKeywords: ['门店', '诊所', '所属门店'] },
  clinic_note: { displayLabels: ['门店证据'], rowKeywords: ['门店', '到访', '预约门店'] },
  advisor_doctor: { customerKeys: ['doctorName', 'advisorName'], displayLabels: ['医生', '顾问', '顾问 / 医生'], rowKeywords: ['医生', '顾问', '健康管理人'] },
  doctor_plan: { rowKeywords: ['方案', '医生建议', '治疗方案'] },
  proposed_or_taken_plan: { rowKeywords: ['方案补充', '已采取', '建议方案'] },
  consumption_summary: { rowKeywords: ['消费', '消耗', '付款', '划扣'] },
  p1_diagnosis_need: { rowKeywords: ['病例', '诊断', '检测', '主诉', '诉求'] },
  p2_project_times: { rowKeywords: ['项目', '治疗次数', '疗程', '划扣', '消耗'] },
  p3_relationship_risk: { rowKeywords: ['到店', '互动', '企微', '风险', '回访'] },
  remarks: { rowKeywords: ['备注', '偏好', 'VIP', '不愿'] },
  contraindication: { rowKeywords: ['怕痛', '过敏', '等待', '备孕', '哺乳', '禁忌'] },
  unconsumed_projects: { rowKeywords: ['未消耗', '剩余', '疗程'] },
  points: { rowKeywords: ['积分'] },
  balance: { rowKeywords: ['余额'] },
  value_added_fund: { rowKeywords: ['增值金'] },
  coupon: { rowKeywords: ['优惠券', '优惠码', '有效期'] },
};

const ARCHIVE_SECTION_DISPUTE_FIELD_KEYS = [
  'doctor_plan',
  'proposed_or_taken_plan',
  'consumption_summary',
  'p1_diagnosis_need',
  'p2_project_times',
  'p3_relationship_risk',
  'remarks',
  'contraindication',
  'unconsumed_projects',
  'points',
  'balance',
  'value_added_fund',
  'coupon',
];

function readAdvisorArchiveDisputesFromStorage() {
  try {
    const raw = window.localStorage?.getItem(ADVISOR_ARCHIVE_DISPUTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.disputes) ? parsed.disputes : [];
  } catch (error) {
    console.warn('advisor archive disputes read failed', error);
    return [];
  }
}

function writeAdvisorArchiveDisputesToStorage(disputes) {
  try {
    window.localStorage?.setItem(ADVISOR_ARCHIVE_DISPUTES_STORAGE_KEY, JSON.stringify({
      version: 1,
      updatedAt: new Date().toISOString(),
      disputes: Array.isArray(disputes) ? disputes.slice(0, 300) : [],
    }));
  } catch (error) {
    console.warn('advisor archive disputes write failed', error);
  }
}

function refreshAdvisorArchiveDisputesState() {
  state.advisorArchiveDisputes = readAdvisorArchiveDisputesFromStorage();
  return state.advisorArchiveDisputes;
}

function serverChallengeToAdvisorArchiveDispute(challenge) {
  const customerId = challenge.unifiedCustomerId || challenge.customerId || '';
  const fieldKey = challenge.challengedPointId || challenge.fieldKey || 'customer_basic_info_block';
  return {
    id: `${customerId || 'unknown'}::${fieldKey}`,
    status: 'pending_archive_update',
    reviewItemId: challenge.reviewItemId || '',
    unifiedCustomerId: customerId,
    customerName: challenge.customerName || '',
    fieldKey,
    fieldLabel: challenge.fieldLabel || fieldKey,
    fieldGroup: challenge.fieldGroup || '客户基本信息',
    fieldValue: challenge.currentValue || '',
    reason: [challenge.reasonText || challenge.reason || '', challenge.arbitrationText || challenge.challengeResolutionText || ''].filter(Boolean).join('\n'),
    challengeResolutionText: challenge.arbitrationText || challenge.challengeResolutionText || '',
    sourceView: challenge.sourceView || 'ds-advisor-h5-review',
    sourceEventId: challenge.challengeEventId || challenge.eventId || '',
    createdAt: challenge.createdAt || '',
    updatedAt: challenge.updatedAt || challenge.createdAt || '',
    resolvedAt: '',
  };
}

async function refreshAdvisorArchiveDisputesForCustomerFromServer(customerId) {
  if (!customerId) return [];
  const payload = await api(`${ARCHIVE_CHALLENGES_API}?customerId=${encodeURIComponent(customerId)}`);
  const serverDisputes = (payload.challenges || []).map(serverChallengeToAdvisorArchiveDispute);
  const store = readAdvisorArchiveDisputesFromStorage();
  const next = [
    ...serverDisputes,
    ...store.filter((item) => item.unifiedCustomerId !== customerId),
  ];
  writeAdvisorArchiveDisputesToStorage(next);
  state.advisorArchiveDisputes = next;
  return serverDisputes;
}

function refreshAdvisorArchiveDisputesForCustomerInBackground(customerId, fixture = null) {
  if (!customerId) return;
  refreshAdvisorArchiveDisputesForCustomerFromServer(customerId)
    .then(() => {
      if (fixture && state.selectedCustomer === customerId) {
        renderChenSceneUserMdDetail(fixture);
      }
    })
    .catch((error) => {
      console.warn('archive challenge refresh failed', error);
    });
}

function activeAdvisorArchiveDisputesForCustomer(customerId) {
  if (!customerId) return [];
  const disputes = state.advisorArchiveDisputes?.length
    ? state.advisorArchiveDisputes
    : refreshAdvisorArchiveDisputesState();
  return disputes.filter((item) => (
    item
    && item.unifiedCustomerId === customerId
    && item.status !== 'resolved_after_archive_update'
  ));
}

function advisorArchiveDisputeForField(disputes, fieldKey) {
  return (disputes || []).find((item) => item.fieldKey === fieldKey) || null;
}

function advisorArchiveDisputeForLabel(disputes, label) {
  const labelText = String(label || '');
  return (disputes || []).find((item) => {
    if (item.fieldLabel === labelText) return true;
    const config = ADVISOR_ARCHIVE_FIELD_MAP[item.fieldKey] || {};
    return (config.displayLabels || []).some((candidate) => candidate === labelText || labelText.includes(candidate));
  }) || null;
}

function advisorArchiveDisputeForSpendingItem(disputes, item) {
  const itemText = `${item?.key || ''} ${item?.label || ''}`;
  return (disputes || []).find((dispute) => {
    const config = ADVISOR_ARCHIVE_FIELD_MAP[dispute.fieldKey] || {};
    if ((config.spendingKeys || []).includes(item?.key)) return true;
    return [...(config.displayLabels || []), ...(config.rowKeywords || [])]
      .some((keyword) => keyword && itemText.includes(keyword));
  }) || null;
}

function advisorArchiveDisputeMatchesRow(dispute, section, row) {
  const config = ADVISOR_ARCHIVE_FIELD_MAP[dispute?.fieldKey] || {};
  if (!dispute || config.isBlock) return false;
  const rowText = [
    section?.cleanTitle,
    section?.title,
    row?.title,
    row?.value,
    row?.dataStatus,
    row?.source,
    row?.evidence,
  ].filter(Boolean).join(' ');
  if (dispute.fieldLabel && rowText.includes(dispute.fieldLabel)) return true;
  return (config.rowKeywords || []).some((keyword) => keyword && rowText.includes(keyword));
}

function advisorArchiveDisputeForRow(disputes, section, row) {
  return (disputes || []).find((dispute) => advisorArchiveDisputeMatchesRow(dispute, section, row)) || null;
}

function renderAdvisorArchiveDisputeInline(dispute) {
  if (!dispute) return '';
  const text = [dispute.reason, dispute.challengeResolutionText].filter(Boolean).join('\n') || '请核查并修改该档案信息点。';
  return `
    <small class="advisor-archive-dispute-inline" title="${escapeHtml(text)}">
      <b>顾问质疑</b>
      ${escapeHtml(truncateText(text, 110))}
    </small>
  `;
}

function renderAdvisorArchiveDisputeSummary(fixture) {
  const customerId = fixture?.customer?.unifiedCustomerId || '';
  const disputes = activeAdvisorArchiveDisputesForCustomer(customerId);
  if (!disputes.length) return '';
  return `
    <section class="advisor-archive-dispute-summary" aria-label="顾问质疑待修改">
      <div>
        <strong>顾问质疑待修改</strong>
        <span>${formatNumber(disputes.length)} 个子信息点需要核查；修改档案并保存后，对应质疑自动消失。</span>
      </div>
      <div class="advisor-archive-dispute-list">
        ${disputes.slice(0, 8).map((item) => `
          <article>
            <b>${escapeHtml(item.fieldGroup || '客户基本信息')}｜${escapeHtml(item.fieldLabel || item.fieldKey)}</b>
            <p>${escapeHtml(truncateText(item.reason || '顾问已质疑该信息点。', 140))}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function normalizeArchiveComparable(value) {
  return String(value ?? '').trim();
}

function collectChangedArchiveDisputeFieldKeys(form, fixture) {
  const changed = new Set();
  const customer = fixture?.customer || {};
  const customerFieldMap = {
    name: ['customer_name'],
    phoneMasked: ['customer_id'],
    clinicName: ['clinic', 'clinic_note'],
    doctorName: ['advisor_doctor'],
    ageText: ['age'],
    genderText: ['gender'],
    rfmGrade: ['rfm_grade'],
    memberLevel: ['member_level'],
    sourceChannel: ['source_channel'],
    firstDiagnosisSummary: ['p1_diagnosis_need'],
  };
  Object.entries(customerFieldMap).forEach(([key, disputeKeys]) => {
    const element = form.elements[`customer.${key}`];
    if (!element) return;
    const currentValue = key === 'genderText' ? normalizeCustomerGenderText(customer) : customer[key];
    if (normalizeArchiveComparable(element.value) !== normalizeArchiveComparable(currentValue)) {
      disputeKeys.forEach((fieldKey) => changed.add(fieldKey));
    }
  });
  (normalizeArchiveSpendingVerification(fixture).items || []).forEach((item) => {
    const element = form.elements[`spending.${item.key}`];
    if (!element) return;
    if (normalizeArchiveComparable(element.value) !== normalizeArchiveComparable(item.value)) {
      ['total_consumption', 'average_order_value', 'consumption_summary', 'balance_points_summary'].forEach((fieldKey) => changed.add(fieldKey));
    }
  });
  getCustomerProfileSections(fixture).forEach((section, index) => {
    const order = String(section.summaryTag?.order || index + 1);
    const element = form.elements[`section.${order}`];
    if (!element) return;
    if (normalizeArchiveComparable(element.value) !== normalizeArchiveComparable(buildCustomerChapterSummaryText(section))) {
      ARCHIVE_SECTION_DISPUTE_FIELD_KEYS.forEach((fieldKey) => changed.add(fieldKey));
    }
  });
  if (changed.size) changed.add('customer_basic_info_block');
  return changed;
}

function resolveAdvisorArchiveDisputesForCustomer(customerId, resolvedFieldKeys) {
  if (!customerId || !resolvedFieldKeys?.size) return 0;
  const disputes = readAdvisorArchiveDisputesFromStorage();
  let resolvedCount = 0;
  const now = new Date().toISOString();
  const next = disputes.map((item) => {
    if (
      item?.unifiedCustomerId === customerId
      && item.status !== 'resolved_after_archive_update'
      && resolvedFieldKeys.has(item.fieldKey)
    ) {
      resolvedCount += 1;
      return {
        ...item,
        status: 'resolved_after_archive_update',
        resolvedAt: now,
        resolvedBy: 'customer_archive_editor_ui',
      };
    }
    return item;
  });
  if (resolvedCount) {
    writeAdvisorArchiveDisputesToStorage(next);
    state.advisorArchiveDisputes = next;
  }
  return resolvedCount;
}

function setDsOperationLog(selector, message, tone = '') {
  const target = $(selector);
  if (!target) return;
  target.textContent = message || '待命';
  target.className = `ds-operation-log ${tone}`.trim();
}

function setHealth(ok, text) {
  $('#health-dot').classList.toggle('ok', ok);
  $('#health-text').textContent = text;
}

function switchView(viewName, updateHash = true) {
  if (!ALLOWED_MAIN_VIEWS.has(viewName) || !document.getElementById(viewName)) viewName = 'customers';
  $$('.nav-button').forEach((button) => button.classList.toggle('is-active', button.dataset.view === viewName));
  syncLiveArchiveNavState(viewName);
  $$('.view').forEach((view) => view.classList.toggle('is-active', view.id === viewName));
  if (updateHash) window.history.replaceState(null, '', `#${viewName}`);
  if (viewName === 'customers') renderCustomers().catch((error) => showFloatingError(error.message));
  if (viewName === 'methodology') loadProfileStrategyMethodologyOnly();
  if (viewName === 'lifecycle') loadLifecyclePayload();
  if (viewName === 'ds-profile-analysis') loadDsProfileAnalysis();
  if (viewName === 'rule-workbench') loadDsRuleWorkbench();
  if (viewName === 'deepseek-results') loadLatestLifecycleAgentRun();
  if (viewName === 'ds-extraction-check') {
    if (!state.dsExtractionCheck) initDsExtractionCheckState();
    if (!state.dsExtractionBusy && !state.dsExtractionCheck?.runId && !state.dsExtractionCheck?.customers?.size) {
      loadLatestDsExtractionRun();
    } else {
      renderDsExtractionCheck();
    }
  }
}

function syncLiveArchiveNavState(viewName = window.location.hash.replace('#', '') || 'customers') {
  if (!IS_LIVE_ARCHIVE_MODE || !['customers', 'lifecycle'].includes(viewName)) return;
  $$('.nav-tabs .is-active').forEach((item) => item.classList.remove('is-active'));
  const preferredHref = viewName === 'lifecycle'
    ? '/?archiveSource=live#lifecycle'
    : '/?archiveSource=live#customers';
  const preferred = document.querySelector(`.nav-link[href="${preferredHref}"]`);
  if (preferred) preferred.classList.add('nav-button', 'is-active');
}

function renderKpis(data) {
  const quality = data.quality || {};
  const kpis = [
    ['命中客户', data.entities.find((e) => e.tableName === 'customers')?.exactCount, 'customers'],
    ['场景一标签', data.entities.find((e) => e.tableName === 'customer_scene_tags')?.exactCount, 'customer_scene_tags'],
    ['信息点索引', data.entities.find((e) => e.tableName === 'customer_requirement_values')?.exactCount, '376 × 230'],
    ['业务名覆盖', data.summary.dictionaryCovered, `${data.summary.entityCount} 个对象`],
    ['每客 230 项', quality.customersWith230, `客户总数 ${quality.customers || 0}`],
  ];
  $('#kpi-grid').innerHTML = kpis.map(([label, value, note]) => `
    <article class="kpi">
      <div class="label">${label}</div>
      <div class="value">${formatNumber(value)}</div>
      <div class="note">${note}</div>
    </article>
  `).join('');
}

function renderDsMigrationOverview(data) {
  const target = $('#ds-migration-overview');
  if (!target) return;
  const migration = data.dsMigration || {};
  const latest = migration.latestRun || {};
  const items = migration.latestRunItems || {};
  const persisted = migration.persisted || {};
  const statusLabel = latest.status ? formatRunStatus(latest.status) : '尚未运行';
  const runLabel = latest.runId || '暂无 run';
  const cards = [
    ['目标库', migration.targetDatabase || 'analysis-db', '抽取结果持久化写入'],
    ['最近 run', runLabel, statusLabel],
    ['迁入客户', persisted.persistedCustomers || 0, `每客 230 项：${formatNumber(persisted.customersWith230 || 0)}`],
    ['信息点值', persisted.persistedRequirementValues || 0, 'customer_requirement_values'],
    ['校验 items', items.items || latest.itemCount || 0, `待复核 ${formatNumber(items.needsReview || 0)} · 失败 ${formatNumber(items.failed || 0)}`],
    ['清除保护', migration.clearRequiresConfirmation ? '已开启' : '未开启', '清除目标库结果需二次确认'],
  ];
  target.innerHTML = cards.map(([label, value, note]) => `
    <article class="ds-migration-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(typeof value === 'number' ? formatNumber(value) : value)}</strong>
      <small>${escapeHtml(note)}</small>
    </article>
  `).join('');
}

function renderBars(target, rows) {
  const max = Math.max(1, ...rows.map((row) => Number(row.value || 0)));
  target.innerHTML = rows.map((row) => {
    const pct = Math.max(2, Math.round((Number(row.value || 0) / max) * 100));
    return `
      <div class="bar-row">
        <div class="bar-label">${row.label}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div class="bar-value">${formatNumber(row.value)}</div>
      </div>
    `;
  }).join('');
}

function renderSections(rows) {
  $('#section-chart').innerHTML = rows.map((row) => `
    <div class="section-pill">
      <strong>${row.label}</strong>
      <span>${formatNumber(row.value)} 个信息点</span>
    </div>
  `).join('');
}

function statusClass(status) {
  if (status === '已有客户值') return 'is-complete';
  if (status === '本地已回填真值') return 'is-complete';
  if (status === '远端试跑已导入真值') return 'is-complete';
  if (status === '企微/CRM 摘要已导入真值') return 'is-complete';
  if (status === 'AI 文件索引已匹配真值') return 'is-complete';
  if (status === 'NPS 评分已导入真值') return 'is-complete';
  if (status === '皮肤/CSKIN 索引已匹配真值') return 'is-complete';
  if (status === '医美史/病历索引已匹配真值') return 'is-complete';
  if (status === '所属医生归属已导入真值') return 'is-complete';
  if (status === '签字照片/影像索引已匹配真值') return 'is-complete';
  if (status === '知情同意索引已匹配真值') return 'is-complete';
  if (status === 'DS 已抽取') return 'is-complete';
  if (status === 'DS 候选源无记录') return 'is-no-record';
  if (status === 'DS 待抽取') return 'is-pending';
  if (status === 'DS 未匹配') return 'is-missing';
  if (status === 'DS 需复核') return 'is-pending';
  if (status === '本地已回填摘要') return 'is-summary';
  if (status === '远端试跑未返回记录') return 'is-no-record';
  if (status === '企微/CRM 候选源未返回记录') return 'is-no-record';
  if (status === '小程序/CPM 候选源未返回记录') return 'is-no-record';
  if (status === '签字/知情同意候选源未返回记录') return 'is-no-record';
  if (status === '已建索引，待抽取真实值') return 'is-pending';
  if (status === '已映射，待远端抽取真值') return 'is-pending';
  if (status === '已建槽位，待远端抽取真值') return 'is-pending';
  if (status === '已入目录') return 'is-indexed';
  return 'is-missing';
}

function entitySubtitle(entity) {
  const dict = entity.dictionary;
  return dict ? `${dict.businessName} · ${dict.businessContent}` : '缺少中文业务名';
}

function filteredEntities() {
  const filter = $('#table-filter').value.trim().toLowerCase();
  if (!filter) return state.overview.entities;
  return state.overview.entities.filter((entity) => {
    const text = `${entity.tableName} ${entity.tableType} ${entity.dictionary?.businessName || ''} ${entity.dictionary?.businessContent || ''}`.toLowerCase();
    return text.includes(filter);
  });
}

function renderEntityList() {
  const entities = filteredEntities();
  $('#entity-list').innerHTML = entities.map((entity) => `
    <button class="entity-button ${state.selectedEntity === entity.tableName ? 'is-active' : ''}" data-entity="${entity.tableName}">
      <code>${entity.tableName}</code>
      <strong>${entity.dictionary?.businessName || '未映射'}</strong>
      <span class="entity-meta"><span>${entity.tableType === 'VIEW' ? '视图' : '表'}</span><span>${formatNumber(entity.exactCount)} 行</span><span>${entity.columns.length} 列</span></span>
    </button>
  `).join('');
  $$('.entity-button').forEach((button) => {
    button.addEventListener('click', () => loadTable(button.dataset.entity, 0));
  });
}

function renderDictionary() {
  const rows = state.overview.entities;
  $('#dictionary-table').innerHTML = `
    <div class="dictionary-row header">
      <div>英文对象名</div><div>中文业务名</div><div>中文业务内容</div><div>来源依据</div><div>行数</div>
    </div>
    ${rows.map((entity) => `
      <div class="dictionary-row">
        <code>${entity.tableName}</code>
        <strong>${entity.dictionary?.businessName || '未映射'}</strong>
        <div>${entity.dictionary?.businessContent || ''}</div>
        <div>${entity.dictionary?.source || ''}</div>
        <div>${formatNumber(entity.exactCount)}</div>
      </div>
    `).join('')}
  `;
}

function renderDataTable(payload) {
  const { entity, columns, rows, total, limit, offset } = payload;
  const dict = entity.dictionary;
  $('#selected-entity-head').innerHTML = `
    <strong><code>${entity.tableName}</code> · ${dict?.businessName || '未映射'}</strong>
    <p>${dict?.businessContent || ''}</p>
    <p>${entity.tableType === 'VIEW' ? '视图' : '表'} · ${formatNumber(total)} 行匹配 · ${columns.length} 列 · 第 ${formatNumber(offset + 1)}-${formatNumber(Math.min(offset + limit, total))} 行</p>
  `;
  if (!rows.length) {
    $('#data-table-wrap').innerHTML = '<div class="empty">当前条件下没有记录</div>';
    return;
  }
  $('#data-table-wrap').innerHTML = `
    <table>
      <thead><tr>${columns.map((col) => `<th>${col.columnName}<br><small>${col.columnType}</small></th>`).join('')}</tr></thead>
      <tbody>
        ${rows.map((row) => `
          <tr>${columns.map((col) => `<td>${stringifyCell(row[col.columnName])}</td>`).join('')}</tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function loadTable(name, offset = state.entityOffset) {
  state.selectedEntity = name;
  state.entityOffset = offset;
  state.entityLimit = Number($('#page-size').value || 50);
  state.entitySearch = $('#table-search').value.trim();
  renderEntityList();
  const params = new URLSearchParams({
    limit: state.entityLimit,
    offset: state.entityOffset,
    search: state.entitySearch,
  });
  const payload = await api(`/api/table/${encodeURIComponent(name)}?${params}`);
  renderDataTable(payload);
  $('#prev-page').disabled = state.entityOffset <= 0;
  $('#next-page').disabled = state.entityOffset + state.entityLimit >= payload.total;
}

const CUSTOMER_CLASSIFY_OPTIONS = [
  { key: 'priority', label: '修改优先级（红绿灯）' },
  { key: 'spending', label: '消费情况' },
  { key: 'rfm', label: 'RFM' },
];

const CUSTOMER_ALLOWED_CLINIC_NAMES = [
  '****诊所',
  '****诊所',
  '****诊所',
  '****诊所',
  '****诊所',
];

const CUSTOMER_REVIEW_DIAGNOSTIC_SECTION_ORDERS = new Set([6, 7, 8, 9, 10, 11, 15]);
const CUSTOMER_REVIEW_DIAGNOSTIC_SECTION_META = [
  [6, '面部咨询信息'],
  [7, '特殊情况与医美史'],
  [8, '问题清单与精神量表'],
  [9, '皮肤检测与图像信息'],
  [10, '颜值评分与划痕征'],
  [11, '面诊方案与照片'],
  [15, '病历、处方、知情同意书'],
];
const CUSTOMER_REVIEW_REQUIRED_SPENDING_KEYS = [
  ['cumulative_consumption', '累计消耗'],
  ['consumption_12m', '过去12个月消耗'],
  ['last_consumption_time', '最后一次消耗时间'],
  ['last_consumption_amount', '最后一次消耗金额'],
  ['earliest_order_year', '最早开单年份'],
];

function normalizeCustomerReviewText(value) {
  return normalizeValueText(value).replace(/\*/g, '').trim();
}

function isCustomerReviewMissingValue(value) {
  const text = normalizeCustomerReviewText(value);
  if (!text) return true;
  if (/^(待确认|待补|暂无|未填写|原始源未返回可读值|空|无数据|--|-|null|undefined)$/i.test(text)) return true;
  return /(无法填写|未返回可读值|缺失|需补|待人工确认)/.test(text);
}

function getCustomerReviewAgeNumber(fixture) {
  const customer = fixture?.customer || {};
  const text = normalizeCustomerReviewText(customer.ageText || customer.age || '');
  const match = text.replace(/,/g, '').match(/\d{1,3}/);
  return match ? Number(match[0]) : NaN;
}

function getCustomerReviewClinicName(fixture) {
  const customer = fixture?.customer || {};
  return normalizeCustomerReviewText(customer.clinicName || customer.organizationName || customer.clinic || '');
}

function getCustomerReviewSpendingMap(fixture) {
  const items = normalizeArchiveSpendingVerification(fixture).items || [];
  return Object.fromEntries(items.map((item) => [item.key, item]));
}

function customerReviewIssue(tone, scope, key, label, reason, extra = {}) {
  return {
    tone,
    scope,
    key,
    label,
    reason,
    ...extra,
  };
}

function customerReviewIssueText(issue) {
  return `${issue.label}${issue.reason ? `：${issue.reason}` : ''}`;
}

function getCustomerReviewIdentityFields(fixture) {
  const customer = fixture?.customer || {};
  return [
    { key: 'clinic', label: '门店', value: getCustomerReviewClinicName(fixture), required: true },
    { key: 'advisor_doctor', label: '医生', value: customer.doctorName || customer.primaryDoctorName || customer.doctor || '', required: true },
    { key: 'age', label: '年龄', value: customer.ageText || customer.age || '', required: true },
    { key: 'gender', label: '性别', value: normalizeCustomerGenderText(customer), required: true },
    { key: 'rfm_grade', label: 'RFM', value: customer.rfmGrade ? `RFM ${customer.rfmGrade}` : '', required: true },
    { key: 'source_channel', label: '来源渠道', value: customer.sourceChannel || '', required: true },
    { key: 'member_level', label: '等级', value: customer.memberLevel || '', required: true },
  ];
}

function getCustomerReviewRedIssues(fixture) {
  const issues = [];
  getCustomerReviewIdentityFields(fixture).forEach((field) => {
    if (field.required && isCustomerReviewMissingValue(field.value)) {
      issues.push(customerReviewIssue('red', 'identity', field.key, field.label, '缺失'));
    }
  });

  const age = getCustomerReviewAgeNumber(fixture);
  if (Number.isFinite(age) && age > 70) issues.push(customerReviewIssue('red', 'identity', 'age', '年龄', `${age} 岁大于 70 岁`));

  const clinicName = getCustomerReviewClinicName(fixture);
  if (clinicName && !CUSTOMER_ALLOWED_CLINIC_NAMES.includes(clinicName)) issues.push(customerReviewIssue('red', 'identity', 'clinic', '门店', `不在当前门店白名单：${clinicName}`));

  const spendingMap = getCustomerReviewSpendingMap(fixture);
  CUSTOMER_REVIEW_REQUIRED_SPENDING_KEYS.forEach(([key, label]) => {
    const item = spendingMap[key];
    const value = item?.value;
    if (!item || isCustomerReviewMissingValue(value)) {
      issues.push(customerReviewIssue('red', 'spending', key, label, '缺失'));
      return;
    }
    if (key === 'last_consumption_time' && !/(?:^|[^\d])20\d{2}-\d{2}-\d{2}(?:$|[^\d])/.test(String(value))) {
      issues.push(customerReviewIssue('red', 'spending', key, label, `异常：${value}`));
      return;
    }
    if (key === 'last_consumption_time') return;
    if (key === 'earliest_order_year') {
      const year = Number(String(value).match(/\b(20\d{2})\b/)?.[1]);
      const currentYear = new Date().getFullYear();
      if (!Number.isFinite(year) || year < 2000 || year > currentYear + 1) issues.push(customerReviewIssue('red', 'spending', key, label, `异常：${value}`));
      return;
    }
    if (/consumption|amount/.test(key)) {
      const amount = archiveValueNumber(value);
      if (!Number.isFinite(amount) || amount < 0) issues.push(customerReviewIssue('red', 'spending', key, label, `异常：${value}`));
    }
  });

  return issues;
}

function getCustomerReviewRedReasons(fixture) {
  return getCustomerReviewRedIssues(fixture).map(customerReviewIssueText);
}

function getCustomerReviewSectionOrder(section) {
  const order = Number(section?.summaryTag?.order || section?.order || section?.sectionOrder);
  if (Number.isFinite(order) && order > 0) return order;
  const title = cleanMdChapterTitle(section?.cleanTitle || section?.title || '');
  const match = title.match(/^([一二三四五六七八九十]+)、/);
  if (!match) return 0;
  const map = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
  const text = match[1];
  if (text === '十') return 10;
  if (text.startsWith('十')) return 10 + (map[text.slice(1)] || 0);
  if (text.endsWith('十')) return (map[text[0]] || 0) * 10;
  if (text.includes('十')) return (map[text[0]] || 0) * 10 + (map[text.slice(-1)] || 0);
  return map[text] || 0;
}

function isCustomerReviewUsefulSignal(value) {
  const text = normalizeCustomerReviewText(value);
  if (!text || isCustomerReviewMissingValue(text)) return false;
  if (/^(未命中|未找到|未见|未记录|暂无|无可核验|无数据|无证据|未启用)/.test(text)) return false;
  if (/(不能直接替代|不能直接回答|需对应专项源补取|需要人工确认|只作为线索|仅作线索)/.test(text)) {
    return /(命中\s*\d+\s*条|记录\s*\d+\s*条|HIS\s*咨询记录\s*\d+\s*条|CSKIN\s*命中|指数\s*\d+)/i.test(text);
  }
  return /(命中\s*\d+\s*条|记录\s*[=:：]?\s*\d+\s*条|HIS\s*咨询记录\s*\d+\s*条|CSKIN\s*命中|指数\s*\d+|诊断|病历|咨询|面诊|方案|照片|黄褐斑|玫瑰|痤疮|色斑|皱纹|暗沉|过敏|手术|注射|医美|处方|知情同意|红斑|黑斑|毛孔|紫质|动态纹|静态纹|阳性|阴性|否认|Smoke=|Pregnancy=|FeedBaby=)/i.test(text);
}

function getCustomerReviewDiagnosticState(fixture) {
  const sections = getCustomerProfileSections(fixture);
  const targetSections = sections.filter((section) => CUSTOMER_REVIEW_DIAGNOSTIC_SECTION_ORDERS.has(getCustomerReviewSectionOrder(section)));
  const sectionByOrder = new Map(targetSections.map((section) => [getCustomerReviewSectionOrder(section), section]));
  const hitOrders = targetSections
    .filter((section) => {
      const summary = buildCustomerChapterSummaryText(section);
      return isCustomerReviewUsefulSignal(summary)
        || (section.rows || []).some((row) => isCustomerReviewUsefulSignal(row.value));
    })
    .map(getCustomerReviewSectionOrder)
    .sort((a, b) => a - b);
  return {
    hitOrders,
    hasAnyHit: hitOrders.length > 0,
    checkedOrders: CUSTOMER_REVIEW_DIAGNOSTIC_SECTION_META.map(([order]) => order),
    checkedSections: CUSTOMER_REVIEW_DIAGNOSTIC_SECTION_META.map(([order, fallbackTitle]) => ({
      order,
      section: sectionByOrder.get(order) || null,
      title: sectionByOrder.get(order)
        ? displayMdChapterTitle(sectionByOrder.get(order).cleanTitle || sectionByOrder.get(order).title || fallbackTitle)
        : fallbackTitle,
    })),
    targetSections,
  };
}

function getCustomerReviewPriority(fixture) {
  const redIssues = getCustomerReviewRedIssues(fixture);
  if (redIssues.length) {
    const redReasons = redIssues.map(customerReviewIssueText);
    return { light: '红灯', label: '核验红灯', className: 'is-priority-red', reason: redReasons.join('；'), issues: redIssues };
  }
  const diagnosticState = getCustomerReviewDiagnosticState(fixture);
  if (!diagnosticState.hasAnyHit) {
    const yellowIssues = diagnosticState.checkedSections.map(({ order, title, section }) => {
      return customerReviewIssue(
        'yellow',
        'section',
        `section-${order}`,
        `${String(order).padStart(2, '0')} ${title}`,
        section ? '未命中诊断、咨询、测试或病历有效信息' : '章节缺失，未命中诊断、咨询、测试或病历有效信息',
        { sectionOrder: order },
      );
    });
    return {
      light: '黄灯',
      label: '核验黄灯',
      className: 'is-priority-yellow',
      reason: '06/07/08/09/10/11/15 章均未命中诊断、咨询、测试或病历信息，只能依赖购买项目推断。',
      issues: yellowIssues,
    };
  }
  return {
    light: '绿灯',
    label: '核验绿灯',
    className: 'is-priority-green',
    reason: `基础/消费字段未触发红灯；诊断/咨询/测试类命中章节：${diagnosticState.hitOrders.map((item) => String(item).padStart(2, '0')).join('、')}。`,
    issues: [],
  };
}

function getCustomerConsumptionLabel(fixture) {
  const items = normalizeArchiveSpendingVerification(fixture).items || [];
  const byKey = Object.fromEntries(items.map((item) => [item.key, item]));
  const cumulative = byKey.cumulative_consumption?.value || '待确认';
  const lastAmount = byKey.last_consumption_amount?.value || '待确认';
  return `累计消耗 ${cumulative} / 最后一次 ${lastAmount}`;
}

function archiveValueNumber(value) {
  const match = String(value || '').replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function archiveFirstDateFromFixture(fixture) {
  const text = JSON.stringify(fixture?.sections || []);
  const matches = [...text.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)].map((match) => match[0]);
  return matches[0] || '';
}

function archiveEarliestYearFromFixture(fixture) {
  const text = JSON.stringify(fixture?.sections || []);
  const years = [...text.matchAll(/\b(20\d{2})-\d{2}-\d{2}\b/g)].map((match) => Number(match[1]));
  return years.length ? String(Math.min(...years)) : '待确认';
}

function normalizeArchiveSpendingVerification(fixture) {
  const source = fixture?.spendingVerification || fixture?.spending || {};
  const currentItems = Array.isArray(source.items) ? source.items : [];
  const byKey = Object.fromEntries(currentItems.map((item) => [item.key, item]));
  if (byKey.cumulative_consumption && byKey.consumption_12m && byKey.last_consumption_time && byKey.last_consumption_amount && byKey.earliest_order_year) {
    return {
      ...source,
      items: currentItems.map((item) => ({
        ...item,
        value: isArchiveMoneyLabelText(item.label || item.key || '') ? formatArchiveWholeMoney(archiveValueNumber(item.value)) || item.value : item.value,
      })),
    };
  }
  const oldConsumption = byKey.consumption_amount?.value || byKey.current_payment?.value || byKey.crm_monetary?.value || '';
  const consumptionNumber = archiveValueNumber(oldConsumption);
  const consumptionValue = Number.isFinite(consumptionNumber) ? formatArchiveWholeMoney(consumptionNumber) : '待确认';
  const lastDate = archiveFirstDateFromFixture(fixture) || fixture?.customer?.lastVisitDate || '待确认';
  return {
    sourceCheckedAt: source.sourceCheckedAt || new Date().toISOString(),
    items: [
      { key: 'cumulative_consumption', label: '累计消耗', value: consumptionValue, status: consumptionValue === '待确认' ? '待确认' : '原始值/真值' },
      { key: 'consumption_12m', label: '过去12个月消耗', value: consumptionValue, status: consumptionValue === '待确认' ? '待确认' : '原始值/真值' },
      { key: 'last_consumption_time', label: '最后一次消耗时间', value: lastDate, status: lastDate === '待确认' ? '待确认' : '原始值/真值' },
      { key: 'last_consumption_amount', label: '最后一次消耗金额', value: consumptionValue, status: consumptionValue === '待确认' ? '待确认' : '原始值/真值' },
      { key: 'earliest_order_year', label: '最早开单年份', value: archiveEarliestYearFromFixture(fixture), status: '原始值/真值' },
    ],
  };
}

function normalizeCustomerArchiveFixtureForDisplay(fixture) {
  const normalized = normalizeArchiveStringTree(fixture || {});
  normalized.customer = {
    ...(normalized.customer || {}),
    ageText: String(normalized.customer?.ageText || '').replace(/^约\s*/, '').replace(/\s+/g, ''),
  };
  normalized.spendingVerification = normalizeArchiveSpendingVerification(normalized);
  return normalized;
}

function cloneArchiveFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture || {}));
}

async function loadCustomerArchiveOverrides({ force = false } = {}) {
  if (state.customerArchiveOverrides && !force) return state.customerArchiveOverrides;
  try {
    const payload = await api(CUSTOMER_ARCHIVE_OVERRIDES_API);
    state.customerArchiveOverrides = payload.overrides || {};
  } catch (error) {
    state.customerArchiveOverrides = {};
    state.customerArchiveFixturesError = state.customerArchiveFixturesError || error.message;
  }
  return state.customerArchiveOverrides;
}

async function loadArchiveQuality({ force = false } = {}) {
  if (state.archiveQuality && !force) return state.archiveQuality;
  try {
    state.archiveQuality = await api('/api/lifecycle/archive-quality');
  } catch (error) {
    state.archiveQuality = { ok: false, queue: { queue: [] }, error: error.message };
  }
  return state.archiveQuality;
}

async function loadArchiveBlockSummaries({ force = false } = {}) {
  if (state.archiveBlockSummaries && !force) return state.archiveBlockSummaries;
  try {
    state.archiveBlockSummaries = await api('/api/lifecycle/archive-block-summaries');
  } catch (error) {
    state.archiveBlockSummaries = { ok: false, customers: [], error: error.message };
  }
  return state.archiveBlockSummaries;
}

function getCustomerArchiveOverride(customerId) {
  return state.customerArchiveOverrides?.[customerId]?.patch || null;
}

function applyCustomerArchiveOverrideToFixture(fixture, overrideEntry) {
  const patch = overrideEntry?.patch || overrideEntry || null;
  if (!patch) return fixture;
  const next = cloneArchiveFixture(fixture);
  next.meta = {
    ...(next.meta || {}),
    localOverrideApplied: true,
    localOverrideUpdatedAt: overrideEntry?.updatedAt || '',
    localOverrideUpdatedBy: overrideEntry?.updatedBy || '',
  };
  next.customer = {
    ...(next.customer || {}),
    ...(patch.customer || {}),
  };
  if (Array.isArray(patch.spendingItems) && patch.spendingItems.length) {
    const current = normalizeArchiveSpendingVerification(next);
    const patchByKey = Object.fromEntries(patch.spendingItems.map((item) => [item.key, item]));
    next.spendingVerification = {
      ...current,
      items: (current.items || []).map((item) => ({
        ...item,
        ...(patchByKey[item.key] || {}),
        status: patchByKey[item.key]?.status || item.status || '人工修改',
      })),
    };
  }
  if (patch.sectionSummaries && typeof patch.sectionSummaries === 'object') {
    const summaries = patch.sectionSummaries;
    const tags = Array.isArray(next.summaryTags) ? next.summaryTags : [];
    next.summaryTags = tags.map((tag, index) => {
      const key = String(tag.order || index + 1);
      return summaries[key] !== undefined
        ? { ...tag, summary: summaries[key], localOverride: true }
        : tag;
    });
  }
  return normalizeCustomerArchiveFixtureForDisplay(next);
}

function applyCustomerArchiveOverridesToFixtures(fixtures) {
  const overrides = state.customerArchiveOverrides || {};
  return (fixtures || []).map((fixture) => {
    const customerId = fixture.customer?.unifiedCustomerId;
    return customerId && overrides[customerId]
      ? applyCustomerArchiveOverrideToFixture(fixture, overrides[customerId])
      : fixture;
  });
}

async function refreshCustomerArchiveAfterSave(customerId, overrides = null) {
  state.customerArchiveOverrides = overrides || await loadCustomerArchiveOverrides({ force: true });
  state.customerArchiveFixtures = null;
  state.customerArchiveDetailCache.clear();
  state.customerArchiveDetailInFlight.clear();
  state.customerArchivePreloadRunId += 1;
  state.sceneUsers = [];
  state.selectedCustomer = customerId || state.selectedCustomer;
  if (customerId) {
    try {
      await refreshAdvisorArchiveDisputesForCustomerFromServer(customerId);
    } catch (error) {
      console.warn('archive challenge refresh after save failed', error);
    }
  }
  await renderCustomers();
}

function renderCustomerClassifyControl(selectedKey) {
  return `
    <label class="customer-classify-control" for="customer-classify-select">
      <span>分类</span>
      <select id="customer-classify-select" class="customer-classify-select">
        ${CUSTOMER_CLASSIFY_OPTIONS.map((option) => `
          <option value="${escapeHtml(option.key)}" ${option.key === selectedKey ? 'selected' : ''}>${escapeHtml(option.label)}</option>
        `).join('')}
      </select>
    </label>
  `;
}

function getCustomerClassificationText(row, selectedKey) {
  const option = CUSTOMER_CLASSIFY_OPTIONS.find((item) => item.key === selectedKey) || CUSTOMER_CLASSIFY_OPTIONS[0];
  const values = {
    priority: row.priority?.label || '待确认',
    spending: row.spendingLabel || '待确认',
    rfm: row.rfmGrade ? `RFM ${row.rfmGrade}` : '待补',
  };
  return `按${option.label}：${values[selectedKey] || '待补'}`;
}

function buildSceneUserFromFixture(fixture) {
  const row = fixture.customer || {};
  const priority = row.reviewPriority || fixture.reviewPriority || getCustomerReviewPriority(fixture);
  return {
    unifiedCustomerId: row.unifiedCustomerId,
    hisId: row.hisId,
    crmOid: row.crmOid,
    customerNameMasked: row.customerNameMasked || row.name,
    name: row.name,
    phoneMasked: row.phoneMasked,
    clinicName: row.clinicName,
    advisorName: row.advisorName,
    doctorName: row.doctorName,
    sceneName: row.sceneName,
    rfmGrade: row.rfmGrade,
    memberLevel: row.memberLevel,
    truthValueCount: fixture.completeness?.primaryRowCount || fixture.completeness?.rowCount || 0,
    pendingValueCount: fixture.completeness?.needsReviewRows || 0,
    spendingLabel: getCustomerConsumptionLabel(fixture),
    priority,
  };
}

function compactCustomerSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[\s_*·/｜|:：,，;；\-—_]+/g, '');
}

function getCustomerLookupTerms(row = {}) {
  return [
    row.customerNameMasked,
    row.name,
    row.phoneMasked,
    row.clinicName,
    row.advisorName,
    row.doctorName,
    row.unifiedCustomerId,
    row.hisId,
    row.crmOid,
    row.sceneName,
    row.memberLevel,
    row.rfmGrade ? `RFM ${row.rfmGrade}` : '',
    row.spendingLabel,
    row.priority?.label,
    row.priority?.light,
  ].filter(Boolean);
}

function matchesCustomerLookup(row, query) {
  const normalizedQuery = compactCustomerSearchText(query);
  if (!normalizedQuery) return true;
  const terms = getCustomerLookupTerms(row).map(compactCustomerSearchText);
  const directMatch = terms.some((term) => {
    if (!term) return false;
    if (term === normalizedQuery) return true;
    if (normalizedQuery.length <= 2) return term === normalizedQuery;
    return term.includes(normalizedQuery) || (term.length >= 3 && normalizedQuery.includes(term));
  });
  if (directMatch) return true;
  if (row.phoneMasked?.includes('****')) {
    const [prefix, suffix] = row.phoneMasked.split('****');
    return Boolean(prefix && suffix && normalizedQuery.startsWith(prefix) && normalizedQuery.endsWith(suffix));
  }
  return false;
}

async function handleCustomerLookup() {
  const payload = await loadCustomerArchiveFixtures();
  const query = $('#customer-id-input')?.value.trim() || '';
  const rows = state.sceneUsers.length
    ? state.sceneUsers
    : (payload.fixtures || []).map(buildSceneUserFromFixture);
  const matchedRow = rows.find((row) => matchesCustomerLookup(row, query));
  if (!matchedRow) {
    showFloatingError(`未找到匹配“${query}”的用户全景档案。可输入姓名、脱敏电话、门店、顾问、RFM、消费情况、修改优先级或客户ID。`);
    return;
  }
  const fixture = await loadCustomerArchiveFixtureDetail(matchedRow.unifiedCustomerId);
  renderChenSceneUserMdDetail(fixture);
  refreshAdvisorArchiveDisputesForCustomerInBackground(matchedRow.unifiedCustomerId, fixture);
  $('#customer-id-input').value = query;
}

function customerArchiveSourceNote(payload, fixtures) {
  if (payload.fallback) return `静态样例：${escapeHtml(payload.message || '本地样板库未就绪')}`;
  if (payload.referenceFixtureIncluded) return `陈喜生样板 + 本地样板库：${formatNumber(payload.localTotal || Math.max(fixtures.length - 1, 0))} 位场景一客户`;
  if (IS_LIVE_ARCHIVE_MODE) return `实盘客户池：${formatNumber(payload.total || fixtures.length)} 位场景一客户`;
  return `本地样板库：${formatNumber(payload.total || fixtures.length)} 位场景一客户`;
}

function renderCustomerArchiveSidebar(payload, fixtures) {
  const summaryEl = $('#scene-user-list-summary');
  const listEl = $('#customer-list');
  if (!summaryEl || !listEl) return;
  state.sceneUsers = fixtures.map(buildSceneUserFromFixture);
  summaryEl.innerHTML = `
    ${renderCustomerClassifyControl(state.customerClassifyBy)}
    <span class="scene-user-source-note">${customerArchiveSourceNote(payload, fixtures)}</span>
    <span id="customer-detail-preload-status" class="scene-user-source-note">${customerArchivePreloadStatusText()}</span>
  `;
  $('#customer-classify-select')?.addEventListener('change', (event) => {
    state.customerClassifyBy = event.target.value;
    renderCustomers();
  });
  listEl.innerHTML = state.sceneUsers.map((row) => {
    const isCompleted = state.liveArchiveCompletedCustomers.has(row.unifiedCustomerId);
    return `
      <button class="customer-button scene-user-button ${state.selectedCustomer === row.unifiedCustomerId ? 'is-active' : ''} ${isCompleted ? 'is-live-completed' : ''}" data-customer="${row.unifiedCustomerId}">
        <strong>${row.customerNameMasked || row.unifiedCustomerId}</strong>
        <code>${row.unifiedCustomerId}</code>
        <span>${row.sceneName}</span>
        <span class="scene-user-classification">${escapeHtml(getCustomerClassificationText(row, state.customerClassifyBy))}</span>
        <div class="scene-user-metrics">
          <b>RFM ${escapeHtml(row.rfmGrade || '-')}</b>
          <b>${escapeHtml(row.memberLevel || '-')}</b>
          <b class="${escapeHtml(row.priority.className)}" title="${escapeHtml(row.priority.reason)}">${escapeHtml(row.priority.label)}</b>
        </div>
      </button>
    `;
  }).join('');
  $$('#customer-list .customer-button').forEach((button) => {
    button.addEventListener('click', () => selectCustomerArchiveCustomer(button.dataset.customer));
  });
}

function customerArchivePreloadStatusText() {
  const status = state.customerArchivePreloadStatus;
  if (!IS_LIVE_ARCHIVE_MODE) return '';
  if (status?.message) return status.message;
  if (!status) return '详情缓存：服务器预热中';
  if (status.total <= 0) return '详情预加载：已缓存';
  const base = `详情预加载：${formatNumber(status.done || 0)}/${formatNumber(status.total || 0)}`;
  if (status.active) return `${base} 进行中`;
  if (status.failed) return `${base}，失败 ${formatNumber(status.failed)}`;
  return `${base} 已完成`;
}

function updateCustomerArchivePreloadStatus() {
  const target = $('#customer-detail-preload-status');
  if (target) target.textContent = customerArchivePreloadStatusText();
}

async function selectCustomerArchiveCustomer(customerId) {
  if (!customerId) return;
  state.selectedCustomer = customerId || state.selectedCustomer;
  const requestSeq = ++state.customerArchiveDetailRequestSeq;
  renderCustomerArchiveSidebarFromState();
  $('#customer-detail').innerHTML = '<div class="empty-state">正在加载该客户 19 个信息块详情...</div>';
  const fixture = await loadCustomerArchiveFixtureDetail(customerId);
  if (requestSeq !== state.customerArchiveDetailRequestSeq || state.selectedCustomer !== customerId) return;
  if (fixture) {
    renderChenSceneUserMdDetail(fixture);
    refreshAdvisorArchiveDisputesForCustomerInBackground(customerId, fixture);
  }
}

function renderCustomerArchiveSidebarFromState() {
  const payload = state.customerArchiveFixtures;
  if (!payload?.fixtures) return;
  renderCustomerArchiveSidebar(payload, payload.fixtures || []);
}

async function renderCustomers() {
  const payload = await loadCustomerArchiveFixtures();
  const fixtures = payload.fixtures || [];
  const selectedFixture = findArchiveFixtureByCustomerId(state.selectedCustomer) || fixtures[0];
  if (IS_LIVE_ARCHIVE_MODE && !state.customerArchivePreloadStatus) {
    state.customerArchivePreloadStatus = {
      active: false,
      done: 0,
      failed: 0,
      total: 0,
      serverSide: true,
      message: '详情缓存：服务器磁盘缓存已启用',
    };
  }
  renderCustomerArchiveSidebar(payload, fixtures);
  if (selectedFixture) {
    const selectedCustomerId = selectedFixture.customer?.unifiedCustomerId;
    if (selectedCustomerId) state.selectedCustomer = selectedCustomerId;
    const requestSeq = ++state.customerArchiveDetailRequestSeq;
    $('#customer-detail').innerHTML = '<div class="empty-state">正在加载该客户 18 个信息块详情...</div>';
    try {
      const detailFixture = await loadCustomerArchiveFixtureDetail(selectedCustomerId);
      if (requestSeq !== state.customerArchiveDetailRequestSeq || state.selectedCustomer !== selectedCustomerId) return;
      renderChenSceneUserMdDetail(detailFixture);
      refreshAdvisorArchiveDisputesForCustomerInBackground(detailFixture.customer?.unifiedCustomerId, detailFixture);
    } catch (error) {
      if (requestSeq !== state.customerArchiveDetailRequestSeq || state.selectedCustomer !== selectedCustomerId) return;
      $('#customer-detail').innerHTML = `
        <div class="empty-state">
          <strong>客户详情加载失败</strong>
          <p>${escapeHtml(error.message || '详情接口未返回可用数据')}</p>
          <button type="button" class="primary-button" data-retry-customer-detail="${escapeHtml(selectedCustomerId || '')}">重新加载详情</button>
        </div>
      `;
      $('#customer-detail [data-retry-customer-detail]')?.addEventListener('click', async () => {
        state.customerArchiveDetailCache.delete(selectedCustomerId);
        await renderCustomers().catch((retryError) => showFloatingError(retryError.message));
      });
      showFloatingError(`客户详情加载失败：${error.message}`);
    }
  }
}

async function refreshLiveArchiveCompletedCustomer(payload = {}) {
  if (!IS_LIVE_ARCHIVE_MODE) return;
  const customerId = String(payload.unifiedCustomerId || '').trim();
  if (!customerId) return;
  try {
    state.customerArchiveDetailCache.delete(customerId);
    const fixture = await loadCustomerArchiveFixtureDetail(customerId);
    state.liveArchiveCompletedCustomers.set(customerId, {
      customerId,
      customerName: payload.customerName || fixture.customer?.name || '',
      phoneMasked: payload.phoneMasked || fixture.customer?.phoneMasked || '',
      blockSummaryRunId: payload.blockSummaryRunId || fixture.meta?.aiBlockSummaryRunId || '',
      completedAt: new Date().toISOString(),
    });
    renderCustomerArchiveSidebarFromState();
    if (state.selectedCustomer === customerId) {
      renderChenSceneUserMdDetail(fixture);
    }
    renderLiveExtractStatus();
  } catch (error) {
    if (state.dsExtractionCheck) {
      state.dsExtractionCheck.events.unshift({
        eventName: 'live_archive_completed_customer_refresh_failed',
        message: `已完成客户刷新到左侧栏失败：${error.message}`,
        at: new Date().toISOString(),
      });
      state.dsExtractionCheck.events = state.dsExtractionCheck.events.slice(0, 24);
      renderLiveExtractStatus();
    }
  }
}

function groupRequirements(requirements) {
  const map = new Map();
  for (const item of requirements) {
    const key = `${item.sectionNo}. ${item.sectionName}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return Array.from(map.entries());
}

const SECTION_KEYWORDS = {
  1: ['RFM', '姓名', '性别', '生日', '来源', '初诊', '首次预约', '末诊', '最近到访', '医生', '健康管理人', '会员', '余额', '赠送增值金', '积分', '推荐人', '卡余额', '卡积分', '有效积分'],
  2: ['预约', '待预约', '预约来源', '预约日期', '预约时间', '预约项目', '预约医生', '预约门店', '预约状态', '未到店'],
  3: ['到访', '状态', '分诊', '医生', '咨询师', '护士', '门店', '新客'],
  4: ['年龄', '客户来源', '来源', '皮肤评分', '所属诊所', '所属医生', '初诊', '吸烟', '生活习惯', '基础健康'],
  5: ['咨询', '录音', '沟通', '需求', '关注', '预诊', '面诊', '转写', '综合报告', '医生', '治疗建议'],
  6: ['玫瑰痤疮', '长痘', '斑', '皱纹', '动态性', '静态性', '暗沉', '太田痣', '素颜', '轮廓', '脸型', '抗衰'],
  7: ['手术', '注射', '医美史', '医美习惯', '恢复期', '红肿', '结痂', '过敏', '假体', '线雕', '其他机构', '更换机构'],
  8: ['问题清单', '精神', '焦虑', '得分', '查漏补缺', '边听边记录'],
  9: ['皮肤检测', '图像', 'OSS', '红斑', '色斑', '光源', '历史检测', '差异', 'CSKIN', '档案'],
  10: ['静态纹', '动态纹', '愁容', '怒容', '容量', '划痕', '阳性', '阴性', '评分'],
  11: ['面诊方案', '治疗建议', '中期', '长期', '画布', '拍照', '照片', '图集', '术前', '术后', '前后对比'],
  12: ['开单', '订单', '项目', '产品', '付款', '实付', '应收', '欠费', '优惠', '折扣码', '充值', '套餐', '疗程卡', '划扣'],
  13: ['客户买了什么', '实际做了什么', '消耗', '划扣', '项目', '疗程', '剩余', '次数', '金额', '执行人', '业绩人', '数量'],
  14: ['物料', '出库', '领料', '数量', '护士', '库管', '术前', '术后', '申请', '实际'],
  15: ['病历', '处方', '知情同意', '签字', '照片', '上传', '候选源', '记录'],
  16: ['投诉', '客诉', '理赔', '退款', '负责医生', '咨询师', '紧急', '反馈', '解决', '金额'],
  17: ['企微', 'CRM', '回访', '好友', '任务', '更新时间', '沟通素材', '朋友圈', '会话', '触达'],
  18: ['小程序', '积分', '兑换', '购物车', 'CPM', 'POS', '卡券', '活动', '预约', '同步'],
  19: ['非必填', '数据少', '上线', '培训', '移动端', '企微语音', '客诉', '理赔', '退款', '咨询记录', '数据质量'],
  20: ['统一客户ID', '源系统', 'RFM', '场景', '预约', '到访', '咨询', 'AI', '皮肤检测', '开单', '消耗', '优惠', '回访', '企微', '客诉', '退款'],
};

function normalizeValueText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*---\s*/g, '；')
    .trim();
}

function splitValueParts(text) {
  return normalizeValueText(text)
    .split(/[；;]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function containsAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function extractField(text, name) {
  const match = normalizeValueText(text).match(new RegExp(`${name}=([^;；]+)`));
  return match ? match[1].trim() : '';
}

function uniqueValues(values) {
  return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)));
}

function truncateText(text, max = 180) {
  const clean = normalizeValueText(text);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

function summarizeOrderLikeValue(text, sectionNo) {
  const parts = splitValueParts(text);
  const projects = uniqueValues(parts
    .filter((part) => part.startsWith('项目='))
    .map((part) => part.replace(/^项目=/, '')))
    .slice(0, 3);
  const dates = uniqueValues(parts
    .filter((part) => /^(开单时间|消耗时间|划扣时间)=/.test(part))
    .map((part) => part.replace(/^(开单时间|消耗时间|划扣时间)=/, '').slice(0, 10)))
    .slice(0, 2);
  const payment = uniqueValues(parts
    .filter((part) => /^(应收|实付|是否付款|是否欠费|消耗金额)=/.test(part))
    .slice(0, 4));
  const prefix = sectionNo === 13 ? '消耗/划扣' : '开单/转化';
  const summary = [
    projects.length ? `项目：${projects.join('、')}${projects.length >= 3 ? '等' : ''}` : '',
    dates.length ? `日期：${dates.join('、')}` : '',
    payment.length ? payment.join('；') : '',
  ].filter(Boolean).join('；');
  return summary || `${prefix}记录已导入，查看详情核验证据。`;
}

function summarizeMembershipValue(text, itemText) {
  if (text.includes('积分类型') || text.includes('卡余额') || text.includes('有效积分')) {
    const balance = extractField(text, '卡余额');
    const gift = extractField(text, '赠送增值金');
    const cardPoints = extractField(text, '卡积分');
    const validPoints = uniqueValues(splitValueParts(text)
      .filter((part) => part.startsWith('有效积分='))
      .map((part) => part.replace(/^有效积分=/, '')))
      .filter((value) => value !== '0')
      .slice(0, 3);
    const facts = [
      balance ? `卡余额=${balance}` : '',
      gift ? `赠送增值金=${gift}` : '',
      cardPoints ? `卡积分=${cardPoints}` : '',
      validPoints.length ? `有效积分记录=${validPoints.join('、')}` : '',
    ].filter(Boolean);
    if (itemText.includes('会员等级') && !text.includes('会员等级=')) {
      facts.unshift('未见明确会员等级字段');
    }
    return facts.length ? facts.join('；') : '会员/积分/余额记录已导入，查看详情核验证据。';
  }
  const fields = ['RFM', '姓名', '性别', '生日', '来源ID', '初诊/首次预约', '末诊/最近到访']
    .map((field) => {
      const value = extractField(text, field.replace('/', '\\/'));
      return value ? `${field}=${value}` : '';
    })
    .filter(Boolean);
  return fields.length ? fields.join('；') : '';
}

function summarizeVisitValue(text) {
  const fields = ['到访时间', '状态', '分诊', '医生', '咨询师', '护士', '门店']
    .map((field) => {
      const value = extractField(text, field);
      return value ? `${field}=${value}` : '';
    })
    .filter(Boolean);
  return fields.length ? fields.join('；') : '';
}

function summarizeWecomValue(text) {
  const parts = splitValueParts(text).filter((part) => /企微|CRM|任务|更新时间|身份桥接|客户OID/.test(part));
  return parts.length ? parts.slice(0, 4).join('；') : '';
}

function summarizeNoRecord(section, item) {
  const value = item.customerValue?.valueText || '';
  if (value) return truncateText(value, 150);
  if (item.valueKind === 'no_record') return '本章节候选源已检查，当前客户未返回可确认记录。';
  if (item.valueKind === 'pending' || item.valueKind === 'indexed') return '本信息点已建索引，当前无可展示真值。';
  return '';
}

function formatItemValueSnippet(section, item) {
  const text = item.customerValue?.valueText || '';
  if (!text) return summarizeNoRecord(section, item);
  const sectionNo = Number(section.sectionNo || item.sectionNo || 0);
  if (item.valueKind === 'no_record') return summarizeNoRecord(section, item);
  if (sectionNo === 1) return truncateText(summarizeMembershipValue(text, item.itemText) || text, 180);
  if (sectionNo === 3) return truncateText(summarizeVisitValue(text) || text, 180);
  if (sectionNo === 12 || sectionNo === 13) return truncateText(summarizeOrderLikeValue(text, sectionNo), 190);
  if (sectionNo === 17) {
    return truncateText(
      summarizeWecomValue(text) || '回访/企微章节候选值已导入；非企微任务或会话摘要的明细不在本章节直接展示。',
      180,
    );
  }
  const keywords = SECTION_KEYWORDS[sectionNo] || [];
  const parts = splitValueParts(text)
    .filter((part) => containsAny(part, keywords))
    .slice(0, 5);
  if (parts.length) return truncateText(parts.join('；'), 180);
  if (text.length > 220) return '该信息点已有导入值，但原始值属于跨字段证据包；本章节不直接展示无关长文本，点击查看详情核验证据。';
  return truncateText(text, 180);
}

async function loadChenSceneUserMdFixture() {
  if (!state.chenSceneUserMdFixture) {
    state.chenSceneUserMdFixture = normalizeCustomerArchiveFixtureForDisplay(await api(CHEN_SCENE_USER_MD_FIXTURE_API));
  }
  return state.chenSceneUserMdFixture;
}

async function loadCustomerArchiveFixtures() {
  if (state.customerArchiveFixtures) return state.customerArchiveFixtures;
  await loadCustomerArchiveOverrides();
  await loadArchiveQuality();
  await loadArchiveBlockSummaries();
  // 实盘模式不混入样板参照客户「陈喜生」，实盘客户池只展示 capture_source=p7_live_pipeline 的真实抽取客户。
  const chenFixture = IS_LIVE_ARCHIVE_MODE
    ? null
    : applyCustomerArchiveOverridesToFixtures([await loadChenSceneUserMdFixture()])[0];
  try {
    const liveFixtureLimit = IS_LIVE_ARCHIVE_MODE ? 20 : Math.max(1, Math.min(20, Number($('#live-extract-count')?.value || 5)));
    const fixtureQuery = IS_LIVE_ARCHIVE_MODE ? `?limit=${liveFixtureLimit}&summaryOnly=1` : '?limit=10';
    const payload = await api(`${CUSTOMER_ARCHIVE_FIXTURES_API}${fixtureQuery}`);
    if (payload.fixtures?.length) {
      const localFixtures = (payload.fixtures || []).map(normalizeCustomerArchiveFixtureForDisplay);
      const fixtures = applyCustomerArchiveOverridesToFixtures(
        chenFixture
          ? [chenFixture, ...localFixtures.filter((fixture) => fixture.customer?.unifiedCustomerId !== chenFixture.customer?.unifiedCustomerId)]
          : localFixtures,
      );
      state.customerArchiveFixtures = {
        ...payload,
        total: fixtures.length,
        localTotal: localFixtures.length,
        referenceFixtureIncluded: Boolean(chenFixture),
        fixtures,
      };
      state.customerArchiveFixturesError = null;
      return state.customerArchiveFixtures;
    }
    throw new Error(IS_LIVE_ARCHIVE_MODE ? '实盘客户池当前为空，请先抽取新客户。' : '本地样板库当前没有可展示客户');
  } catch (error) {
    state.customerArchiveFixturesError = error.message;
    state.customerArchiveFixtures = {
      ok: false,
      fallback: !IS_LIVE_ARCHIVE_MODE,
      total: chenFixture ? 1 : 0,
      localTotal: 0,
      referenceFixtureIncluded: Boolean(chenFixture),
      fixtures: chenFixture ? applyCustomerArchiveOverridesToFixtures([chenFixture]) : [],
      message: error.message,
    };
    return state.customerArchiveFixtures;
  }
}

function ensureCustomerArchiveFixtureStore() {
  if (state.customerArchiveFixtures?.fixtures) return state.customerArchiveFixtures;
  state.customerArchiveFixtures = {
    ok: true,
    total: 0,
    localTotal: 0,
    referenceFixtureIncluded: false,
    fixtures: [],
  };
  return state.customerArchiveFixtures;
}

function replaceCustomerArchiveFixtureInState(fixture) {
  const customerId = fixture?.customer?.unifiedCustomerId;
  if (!customerId) return;
  const store = ensureCustomerArchiveFixtureStore();
  const fixtures = store.fixtures;
  const index = fixtures.findIndex((item) => item.customer?.unifiedCustomerId === customerId);
  if (index >= 0) {
    fixtures[index] = fixture;
  } else {
    fixtures.unshift(fixture);
  }
  store.total = Math.max(Number(store.total || 0), fixtures.length);
  store.localTotal = Math.max(Number(store.localTotal || 0), fixtures.length - (store.referenceFixtureIncluded ? 1 : 0));
  state.sceneUsers = fixtures.map(buildSceneUserFromFixture);
}

function customerArchiveFixtureId(fixture) {
  return fixture?.customer?.unifiedCustomerId || fixture?.customer?.customerId || '';
}

function orderedCustomerArchivePreloadIds(fixtures = [], priorityCustomerId = '') {
  const ids = uniqueValues([
    priorityCustomerId,
    ...safeArray(fixtures).map(customerArchiveFixtureId),
  ]);
  return ids.filter(Boolean);
}

async function preloadCustomerArchiveDetails(fixtures = [], options = {}) {
  if (!IS_LIVE_ARCHIVE_MODE) return;
  const ids = orderedCustomerArchivePreloadIds(fixtures, options.priorityCustomerId)
    .filter((customerId) => !state.customerArchiveDetailCache.has(customerId));
  const runId = ++state.customerArchivePreloadRunId;
  state.customerArchivePreloadStatus = {
    active: ids.length > 0,
    done: 0,
    failed: 0,
    total: ids.length,
    startedAt: new Date().toISOString(),
  };
  updateCustomerArchivePreloadStatus();
  if (!ids.length) {
    state.customerArchivePreloadStatus.active = false;
    updateCustomerArchivePreloadStatus();
    return;
  }
  const concurrency = Math.max(1, Math.min(Number(options.concurrency || 3), ids.length));
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < ids.length && runId === state.customerArchivePreloadRunId) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      const customerId = ids[currentIndex];
      try {
        await loadCustomerArchiveFixtureDetail(customerId, { silent: true });
      } catch (error) {
        state.customerArchivePreloadStatus.failed += 1;
        console.warn('customer archive detail preload failed', customerId, error);
      } finally {
        state.customerArchivePreloadStatus.done += 1;
        updateCustomerArchivePreloadStatus();
      }
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  if (runId === state.customerArchivePreloadRunId) {
    state.customerArchivePreloadStatus.active = false;
    state.customerArchivePreloadStatus.finishedAt = new Date().toISOString();
    updateCustomerArchivePreloadStatus();
  }
}

async function loadCustomerArchiveFixtureDetail(customerId) {
  if (!customerId || !IS_LIVE_ARCHIVE_MODE) return findArchiveFixtureByCustomerId(customerId);
  if (state.customerArchiveDetailCache.has(customerId)) return state.customerArchiveDetailCache.get(customerId);
  if (state.customerArchiveDetailInFlight.has(customerId)) return state.customerArchiveDetailInFlight.get(customerId);
  const request = (async () => {
    const payload = await api(`${CUSTOMER_ARCHIVE_FIXTURES_API}?limit=1&customerId=${encodeURIComponent(customerId)}`);
    const fixture = payload.fixtures?.[0];
    if (!fixture) throw new Error(`未找到客户详情：${customerId}`);
    const normalized = applyCustomerArchiveOverridesToFixtures([normalizeCustomerArchiveFixtureForDisplay(fixture)])[0];
    state.customerArchiveDetailCache.set(customerId, normalized);
    replaceCustomerArchiveFixtureInState(normalized);
    return normalized;
  })().finally(() => {
    state.customerArchiveDetailInFlight.delete(customerId);
  });
  state.customerArchiveDetailInFlight.set(customerId, request);
  return request;
}

function clampPhoneExtractCount(value) {
  return Math.max(1, Math.min(20, Number(value || 1) || 1));
}

function normalizePhoneInput(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 11);
}

const LIVE_PHONE_EXTRACT_DEFAULT_MESSAGE = '请输入完整手机号；系统会按手机号匹配 HIS 客户，再规则抽取 230 点；Qwen 总结默认关闭。';

function setPhoneExtractMessage(message, isError = false) {
  const messageEl = $('#live-phone-extract-message');
  if (!messageEl) return;
  messageEl.textContent = message || '';
  messageEl.classList.toggle('is-error', Boolean(isError));
}

function phoneExtractStatusMessage(status) {
  if (!status) return LIVE_PHONE_EXTRACT_DEFAULT_MESSAGE;
  if (status.targetWrite && !status.targetWrite.allowed) {
    return status.targetWrite.message || '本地目标库门禁未通过，暂不能抽取。';
  }
  if (status.batchState?.active) {
    return '服务端已有抽取任务在运行，请先停止或等待当前任务结束。';
  }
  if (status.sourceTunnel?.required) {
    return '本地目标库已就绪；开始抽取时会自动检查源库只读隧道，缺 ECS_PASSWORD 会直接提示。';
  }
  return LIVE_PHONE_EXTRACT_DEFAULT_MESSAGE;
}

function renderPhoneExtractFields(countValue = null, options = {}) {
  const fieldsEl = $('#live-phone-extract-fields');
  const countInput = $('#live-phone-extract-count');
  if (!fieldsEl || !countInput) return;
  const count = clampPhoneExtractCount(countValue ?? countInput.value);
  const preserveValues = options.preserveValues !== false;
  const existingValues = preserveValues
    ? $$('[data-live-phone-input]').map((input) => normalizePhoneInput(input.value))
    : [];
  countInput.value = String(count);
  fieldsEl.innerHTML = Array.from({ length: count }, (_, index) => `
    <label class="phone-extract-field">
      <span class="phone-extract-field-index">${index + 1}</span>
      <input
        data-live-phone-input
        type="tel"
        inputmode="numeric"
        autocomplete="off"
        maxlength="11"
        placeholder="请输入第 ${index + 1} 个完整手机号"
        value="${escapeHtml(existingValues[index] || '')}"
      />
    </label>
  `).join('');
  fieldsEl.querySelectorAll('[data-live-phone-input]').forEach((input) => {
    input.addEventListener('input', () => {
      const normalized = normalizePhoneInput(input.value);
      if (input.value !== normalized) input.value = normalized;
    });
  });
}

function resetLivePhoneExtractModal() {
  const countInput = $('#live-phone-extract-count');
  if (countInput) countInput.value = '1';
  renderPhoneExtractFields(1, { preserveValues: false });
  setPhoneExtractMessage(LIVE_PHONE_EXTRACT_DEFAULT_MESSAGE);
}

function getPhoneExtractValues() {
  return $$('[data-live-phone-input]').map((input) => normalizePhoneInput(input.value));
}

function openLivePhoneExtractModal() {
  const modal = $('#live-phone-extract-modal');
  if (!modal) return;
  resetLivePhoneExtractModal();
  $('#live-phone-extract-start')?.toggleAttribute('disabled', Boolean(state.dsExtractionBusy));
  modal.classList.remove('is-hidden');
  modal.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => $('#live-phone-extract-fields input')?.focus(), 0);
  api(PHONE_BATCH_STATUS_API)
    .then((status) => {
      setPhoneExtractMessage(phoneExtractStatusMessage(status), Boolean(status.targetWrite && !status.targetWrite.allowed));
    })
    .catch((error) => {
      setPhoneExtractMessage(`抽取状态读取失败：${error.message}`, true);
    });
}

function closeLivePhoneExtractModal() {
  const modal = $('#live-phone-extract-modal');
  if (!modal) return;
  modal.classList.add('is-hidden');
  modal.setAttribute('aria-hidden', 'true');
}

async function handleLivePhoneExtractStart() {
  if (state.dsExtractionBusy) {
    setPhoneExtractMessage('当前已有抽取任务在运行，请先等待完成或点击停止抽取。', true);
    return;
  }
  const startButton = $('#live-phone-extract-start');
  const openButton = $('#live-phone-extract-open');
  const stopButton = $('#live-extract-stop-button');
  const logEl = $('#live-extract-log');
  renderPhoneExtractFields($('#live-phone-extract-count')?.value || 1);
  const phones = getPhoneExtractValues();
  const invalidIndexes = phones
    .map((phone, index) => ({ phone, index: index + 1 }))
    .filter((item) => !/^1\d{10}$/.test(item.phone));
  if (invalidIndexes.length) {
    setPhoneExtractMessage(`第 ${invalidIndexes.map((item) => item.index).join('、')} 个手机号不是完整 11 位大陆手机号。`, true);
    return;
  }
  const duplicatePhones = phones.filter((phone, index) => phones.indexOf(phone) !== index);
  if (duplicatePhones.length) {
    setPhoneExtractMessage('手机号输入重复，请去重后再抽取。', true);
    return;
  }
  try {
    const status = await api(PHONE_BATCH_STATUS_API);
    if (status.targetWrite && !status.targetWrite.allowed) {
      setPhoneExtractMessage(phoneExtractStatusMessage(status), true);
      return;
    }
    if (status.batchState?.active) {
      setPhoneExtractMessage('服务端已有抽取任务在运行，请先停止或等待当前任务结束。', true);
      return;
    }
  } catch (error) {
    setPhoneExtractMessage(`抽取状态读取失败：${error.message}`, true);
    return;
  }
  const confirmed = window.confirm(`将按 ${phones.length} 个完整手机号执行规则直抽。\n\n系统会先从原始 HIS 源按手机号匹配客户，再规则抽取 230 个子信息点；本次不调用 Qwen 或其他 LLM 总结。\n\n是否继续？`);
  if (!confirmed) return;
  state.dsExtractionBusy = true;
  state.dsExtractionAbort = new AbortController();
  state.liveArchiveCompletedCustomers.clear();
  if (startButton) startButton.disabled = true;
  if (openButton) openButton.disabled = true;
  if (stopButton) stopButton.disabled = false;
  initDsExtractionCheckState();
  state.dsExtractionCheck.status = 'running';
  state.dsExtractionCheck.phaseId = 'pull_source';
  state.dsExtractionCheck.total = phones.length;
  state.dsExtractionCheck.events.unshift({
    eventName: 'phone_batch_start_clicked',
    message: `开始按 ${phones.length} 个手机号规则直抽；Qwen 总结关闭。`,
    at: new Date().toISOString(),
  });
  if (logEl) logEl.textContent = `开始按 ${phones.length} 个手机号抽取...`;
  closeLivePhoneExtractModal();
  renderLiveExtractStatus();
  let extractedCustomerIds = [];
  try {
    const response = await fetch(PHONE_BATCH_STREAM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actor: 'phone_direct_live_ui',
        phones,
        enableQwen: false,
        summaryMode: 'none',
      }),
      signal: state.dsExtractionAbort.signal,
    });
    if (!response.ok) throw new Error(await readDsExtractionError(response));
    await consumeDsExtractionStream(response, (eventName, payload = {}) => {
      handleDsExtractionEvent(eventName, payload);
      if (eventName === 'done') {
        extractedCustomerIds = uniqueValues([
          ...safeArray(payload.result?.selectedIds),
          ...safeArray(payload.selectedIds),
        ]);
      }
      if (payload.message && logEl) logEl.textContent = payload.message;
      renderLiveExtractStatus();
    });
    if (state.dsExtractionCheck?.status !== 'failed') {
      if (extractedCustomerIds[0]) state.selectedCustomer = extractedCustomerIds[0];
      state.customerArchiveFixtures = null;
      state.customerArchiveDetailCache.clear();
      state.customerArchiveDetailInFlight.clear();
      state.customerArchivePreloadRunId += 1;
      await renderCustomers();
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      if (logEl) logEl.textContent = `手机号抽取失败：${error.message}`;
      handleDsExtractionEvent('error', { message: error.message });
      renderLiveExtractStatus();
    }
  } finally {
    state.dsExtractionBusy = false;
    state.dsExtractionAbort = null;
    if (startButton) startButton.disabled = false;
    if (openButton) openButton.disabled = false;
    if (stopButton) stopButton.disabled = true;
    resetLivePhoneExtractModal();
    renderLiveExtractStatus();
  }
}

async function handleLiveArchiveExtract() {
  if (state.dsExtractionBusy) return;
  const button = $('#live-extract-button');
  const stopButton = $('#live-extract-stop-button');
  const logEl = $('#live-extract-log');
  const limit = Math.max(1, Math.min(20, Number($('#live-extract-count')?.value || 5)));
  state.dsExtractionBusy = true;
  state.dsExtractionAbort = new AbortController();
  button.disabled = true;
  if (stopButton) stopButton.disabled = false;
  initDsExtractionCheckState();
  state.dsExtractionCheck.status = 'running';
  state.dsExtractionCheck.phaseId = 'build_database';
  state.dsExtractionCheck.total = limit;
  state.dsExtractionCheck.events.unshift({
    eventName: 'live_start_clicked',
    message: `开始抽取 ${limit} 名新客户，并追加到用户全景档案（Agent 实盘）。`,
    at: new Date().toISOString(),
  });
  if (logEl) logEl.textContent = `开始抽取 ${limit} 名新客户...`;
  renderLiveExtractStatus();
  try {
    const response = await openDsExtractionStream({
      mode: 'append_new_candidates',
      limit,
      actor: 'index_live_archive_customers',
    });
    await consumeDsExtractionStream(response, (eventName, payload) => {
      handleDsExtractionEvent(eventName, payload || {});
      if (payload?.message) {
        if (logEl) logEl.textContent = payload.message;
      } else if (eventName === 'dedupe_completed') {
        const skipped = payload.skippedExistingIds || payload.skippedExisting || [];
        const selected = payload.selectedNewIds || payload.selectedIds || [];
        if (logEl) logEl.textContent = `去重完成：新增 ${selected.length} 人，跳过 ${skipped.length} 人（已在库中）`;
      } else if (eventName === 'done' || eventName === 'run_completed') {
        if (logEl) logEl.textContent = `抽取完成：run ${payload.run?.runId || payload.runId || ''}`;
      }
      renderLiveExtractStatus();
    });
    state.customerArchiveFixtures = null;
    state.customerArchiveDetailCache.clear();
    state.customerArchiveDetailInFlight.clear();
    state.customerArchivePreloadRunId += 1;
    await renderCustomers();
  } catch (error) {
    if (logEl) logEl.textContent = `抽取失败：${error.message}`;
    handleDsExtractionEvent('error', { message: error.message });
    renderLiveExtractStatus();
  } finally {
    state.dsExtractionBusy = false;
    state.dsExtractionAbort = null;
    button.disabled = false;
    if (stopButton) stopButton.disabled = true;
    renderLiveExtractStatus();
  }
}

async function handleLiveArchiveStopExtract() {
  const logEl = $('#live-extract-log');
  const stopButton = $('#live-extract-stop-button');
  if (stopButton) stopButton.disabled = true;
  if (!state.dsExtractionCheck) initDsExtractionCheckState();
  state.dsExtractionCheck.status = 'stopping';
  state.dsExtractionCheck.events.unshift({
    eventName: 'live_stop_requested',
    message: '正在通知服务端停止实盘抽取；当前客户或当前信息块完成后会停止后续处理。',
    at: new Date().toISOString(),
  });
  if (logEl) logEl.textContent = '停止请求已发送，等待服务端确认...';
  renderLiveExtractStatus();
  try {
    const response = await fetch(XIZI_MANAGER_BATCH_STOP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actor: 'xizi_manager_batch_live_stop_button',
        reason: 'manual_stop_button_requested',
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || payload.error || '停止抽取批处理失败');
    if (payload.active || payload.status === 'stopping') {
      state.dsExtractionCheck.events.unshift({
        eventName: 'xizi_batch_stop_requested',
        message: payload.message || '服务端已收到抽取批处理停止请求。',
        at: new Date().toISOString(),
      });
      state.dsExtractionCheck.status = payload.status || 'stopping';
      renderLiveExtractStatus();
      return;
    }
    if (state.dsExtractionCheck?.runId) {
      await stopDsExtractionCheck();
      return;
    }
    state.dsExtractionAbort?.abort();
    state.dsExtractionBusy = false;
    state.dsExtractionCheck.status = 'stopped';
    state.dsExtractionCheck.events.unshift({
      eventName: 'live_connection_stopped',
      message: '当前页面连接已停止。',
      at: new Date().toISOString(),
    });
  } catch (error) {
    state.dsExtractionCheck.status = 'running';
    state.dsExtractionCheck.events.unshift({
      eventName: 'live_stop_failed',
      message: `停止失败：${error.message}`,
      at: new Date().toISOString(),
    });
    if (stopButton) stopButton.disabled = false;
  }
  renderLiveExtractStatus();
}

async function handleXiziManagerBatchExtract(options = {}) {
  if (state.dsExtractionBusy) return;
  const updateMode = options?.mode === 'update_changed';
  const button = $('#live-xizi-batch-button');
  const updateButton = $('#live-xizi-update-button');
  const stopButton = $('#live-extract-stop-button');
  const logEl = $('#live-extract-log');
  try {
    const statusUrl = updateMode ? `${XIZI_MANAGER_BATCH_STATUS_API}?mode=update_changed` : XIZI_MANAGER_BATCH_STATUS_API;
    const status = await api(statusUrl);
    const selectedCount = Number(status.stats?.selectedCount || 0);
    const skippedCount = Number(status.stats?.skippedCount || 0);
    const duplicateSkipped = Number(status.stats?.duplicateSkippedCount || 0);
    const alreadyGenerated = Number(status.stats?.alreadyGeneratedCount || 0);
    const selectedExisting = Number(status.stats?.selectedExistingGeneratedCount || 0);
    const confirmed = window.confirm(
      updateMode
        ? `将按西子名单执行“重新抽取更新”。\n重抽：${selectedCount} 人\n跳过：${skippedCount} 人（重复姓名 ${duplicateSkipped}）\n已有完整总结仅作历史记录：${selectedExisting} 人\n\n系统会规则重抽 230 点并写入本地目标库；本次不调用 Qwen 或其他 LLM 总结。\n\n是否继续？`
        : `将按西子名单执行规则直抽。\n待处理：${selectedCount} 人\n跳过：${skippedCount} 人（重复姓名 ${duplicateSkipped}，历史已生成 ${alreadyGenerated}）\n\n确认后只读源库并写入本地目标库，不调用 Qwen 模型。是否继续？`,
    );
    if (!confirmed) return;
    state.dsExtractionBusy = true;
    state.dsExtractionAbort = new AbortController();
    if (button) button.disabled = true;
    if (updateButton) updateButton.disabled = true;
    if (stopButton) stopButton.disabled = false;
    $('#live-extract-button')?.setAttribute('disabled', 'disabled');
    initDsExtractionCheckState();
    state.dsExtractionCheck.status = 'running';
    state.dsExtractionCheck.phaseId = 'pull_source';
    state.dsExtractionCheck.total = selectedCount;
    state.dsExtractionCheck.events.unshift({
      eventName: updateMode ? 'xizi_update_start_clicked' : 'xizi_batch_start_clicked',
      message: updateMode
        ? `开始按西子名单更新重抽 ${selectedCount} 人；跳过 ${skippedCount} 人。`
        : `开始按西子名单处理 ${selectedCount} 人；跳过 ${skippedCount} 人。`,
      at: new Date().toISOString(),
    });
    if (logEl) logEl.textContent = updateMode
      ? `开始按西子名单更新重抽 ${selectedCount} 人...`
      : `开始按西子名单处理 ${selectedCount} 人...`;
    renderLiveExtractStatus();
    const response = await fetch(XIZI_MANAGER_BATCH_STREAM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actor: updateMode ? 'xizi_manager_update_live_ui' : 'xizi_manager_batch_live_ui',
        mode: updateMode ? 'update_changed' : 'create_missing',
        enableQwen: false,
        summaryMode: 'none',
      }),
      signal: state.dsExtractionAbort.signal,
    });
    if (!response.ok) throw new Error(await readDsExtractionError(response));
    await consumeDsExtractionStream(response, (eventName, payload = {}) => {
      handleDsExtractionEvent(eventName, payload);
      if (payload.message && logEl) logEl.textContent = payload.message;
      renderLiveExtractStatus();
    });
    state.customerArchiveFixtures = null;
    state.customerArchiveDetailCache.clear();
    state.customerArchiveDetailInFlight.clear();
    state.customerArchivePreloadRunId += 1;
    await renderCustomers();
  } catch (error) {
    if (error.name !== 'AbortError') {
      if (logEl) logEl.textContent = `西子名单批处理失败：${error.message}`;
      handleDsExtractionEvent('error', { message: error.message });
      renderLiveExtractStatus();
    }
  } finally {
    state.dsExtractionBusy = false;
    state.dsExtractionAbort = null;
    if (button) button.disabled = false;
    if (updateButton) updateButton.disabled = false;
    if (stopButton) stopButton.disabled = true;
    $('#live-extract-button')?.removeAttribute('disabled');
    renderLiveExtractStatus();
  }
}

function findArchiveFixtureByCustomerId(customerId) {
  if (customerId && state.customerArchiveDetailCache?.has(customerId)) return state.customerArchiveDetailCache.get(customerId);
  const fixtures = state.customerArchiveFixtures?.fixtures || [];
  return fixtures.find((fixture) => fixture.customer?.unifiedCustomerId === customerId) || fixtures[0] || null;
}

function mdRowStatusClass(row) {
  const text = [row?.value, row?.dataStatus, row?.evidence].join(' ');
  if (/需\s*(ECS|规则|字典|另查|复核|确认)|需要再次|状态码含义|项目规则/.test(text)) return 'is-pending';
  if (/未找到|未命中|无法推测|无数据支撑|未启用|没有证据|无评分|无可核验|不能确认|未见|未记录/.test(text)) return 'is-no-record';
  if (/\*|推断|归纳|计算|口径解释|受限推断|多字段推断|部分命中|不足以推断/.test(text)) return 'is-summary';
  if (/原始字段|原始标识|医生病历事实|原始主键|本地统一 ID/.test(row?.dataStatus || '')) return 'is-complete';
  return 'is-indexed';
}

function mdRowStatusLabel(row) {
  const className = mdRowStatusClass(row);
  if (className === 'is-complete') return '原始/明确';
  if (className === 'is-summary') return '推断/归纳';
  if (className === 'is-pending') return '待人工确认';
  if (className === 'is-no-record') return '暂无记录';
  return '已保留';
}

function renderMdCompleteness(fixture) {
  const stats = fixture.completeness || {};
  const cards = [
    ['16 个标签', fixture.summaryTags?.length || 0, '先看重要总结'],
    ['MD 表格章节', stats.sectionCount || 0, '含个人标识、补充核验和附录表'],
    ['表格行数', stats.rowCount || 0, '按 MD 逐行保留'],
    ['前16章行数', stats.primaryRowCount || 0, '对应顶部16个标签'],
    ['原始/明确', stats.directRows || 0, '未标推断的直接证据'],
    ['推断/归纳', stats.inferredRows || 0, '带星号、计算或口径解释'],
    ['暂无可填资料', stats.missingRows || 0, '保留为空，不补猜测'],
    ['待人工确认', stats.needsReviewRows || 0, '需要补证或规则确认'],
  ];
  return `
    <div class="md-completeness-grid">
      ${cards.map(([label, value, note]) => `
        <div class="detail-item md-completeness-card">
          <span>${escapeHtml(label)}</span>
          <strong>${formatNumber(value)}</strong>
          <small>${escapeHtml(note)}</small>
        </div>
      `).join('')}
    </div>
  `;
}

function displayMdChapterTitle(title = '') {
  const clean = cleanMdChapterTitle(title);
  return clean.replace(/^[一二三四五六七八九十]+、/, '').trim() || clean || '未命名章节';
}

function formatCustomerSummaryValue(row) {
  const value = normalizeValueText(formatMdDisplayText(row?.value || '')).replace(/\*/g, '').trim();
  if (value && value !== '未填写') return value;
  const type = mdRowEvidenceType(row);
  if (type === 'pending') return '待人工确认';
  if (type === 'missing') return '暂无可填资料';
  return '未填写';
}

function buildCustomerChapterSummaryRows(section) {
  return (section.rows || []).map((row) => ({
    title: row.title || '未命名小标题',
    value: formatCustomerSummaryValue(row),
    type: mdRowEvidenceType(row),
  }));
}

const CUSTOMER_COMPREHENSIVE_CHAPTER_SUMMARIES = [
  {
    pattern: /^一、客户身份与会员信息/,
    summary: '陈喜生为粉星会员，RFM C，来源为客户推荐/老带新，约 52 岁，初诊和末诊均落在 2026-01-05，场景一非 VIP 前置通过。账户无余额、无赠送增值金，有 148.74 卡积分且最新积分流水为 994；所属医生链路为客户主表/病历医生杨慧、到访登记医生祝媛园，健康管理人为陈曦，并命中 1 条推荐关系。客户主表未命中特殊情况字段，但医生病历保留既往史、医美史和划痕征等可核验证据。',
  },
  {
    pattern: /^二、预约与待预约/,
    summary: '本章预约链路整体未命中：未找到小程序、移动端或 HIS 预约/待预约记录，因此预约来源、日期、项目、医生、上下午、待预约状态、内部处理、正式预约表、预约状态、预约时间和预约门店均无法填写。没有预约未到店证据；相反，客户已在 2026-01-05 16:57:30 形成到访记录。',
  },
  {
    pattern: /^三、到访与分诊/,
    summary: '客户已到店，命中 1 条 2026-01-05 16:57:30 的****诊所到访记录，状态为 Status=1、TreatmentStatus=1、ConsultStatus=0、IsTriage=0。该到访未关联预约，未记录咨询师和护士；到访登记医生为祝媛园，医生病历医生为杨慧。TreatmentBeginTime=2026-01-05 16:58:00 表明已进入就诊页面，但分诊未完成或未记录完成，并可推断为新客到访。',
  },
  {
    pattern: /^四、新客基础信息/,
    summary: '新客基础信息显示客户约 52 岁，来源为客户推荐/老带新，所属诊所为****诊所。医生链路仍为客户主表医生杨慧、病历医生杨慧、到访登记医生祝媛园，初诊时间为 2026-01-05。结构化皮肤评分未命中，但医生病历有皮肤问题文本；基础健康和生活习惯中 Smoke=0、Pregnancy=0、FeedBaby=0，客户主表相关健康字段未填，病历否认药物过敏、传染病、手术外伤和遗传性疾病家族史。',
  },
  {
    pattern: /^五、咨询(?:记录|与 AI 听诊)/,
    summary: '咨询记录优先展示 HIS 咨询内容、推荐项目和关注项目；多条记录按时间线分段。未命中结构化咨询记录时，只提示咨询记录缺失，不再展示录音、ASR 或 AI 报告缺口。',
  },
  {
    pattern: /^六、面部咨询信息/,
    summary: '面部咨询证据显示有黄褐斑、日光性黑子、双侧颧部/面颊部色素沉着斑和散在褐色斑点，同时有眼周细纹、面部皮肤松弛、干燥、屏障受损型色素问题、紫外线色斑和棕色斑明显、毛细血管扩张。未见玫瑰痤疮诊断，长痘和动态皱纹无法推测；眼周细纹可作为静态可见细纹证据但无评分。暗沉不能确认为独立诉求，无太田痣证据，也无脸型、轮廓或容量缺失的明确记录。',
  },
  {
    pattern: /^七、特殊情况与医美史/,
    summary: '病历否认手术外伤史和药物过敏史，其他过敏源无法推测；历史中未明确写曾做注射类医美，但本次订单/待处方包含补注射（单）。客户有医美史，曾行皮秒激光局部祛斑且效果可，但未写机构。医美习惯、能否接受恢复期/红肿/结痂、是否植入假体、是否做过线雕、是否换过机构及更换原因均无法推测。',
  },
  {
    pattern: /^八、问题清单与精神量表/,
    summary: '本章所有个人记录均未命中或本期未启用：新客接待问题清单、问题覆盖情况、首次约 28 个问题、实际咨询约 20 个自然问题、剩余查漏补缺问题和未来 AI 边听边记均没有陈喜生个人数据。精神量表是否填写、是否由顾客自填、焦虑状态、量表得分以及医生是否参考焦虑情况也均未命中，因此不补写推测内容。',
  },
  {
    pattern: /^九、皮肤检测与图像信息/,
    summary: '病历写有“CSKIN拍照显示”，可推断做过 CSKIN 拍照/检测，但结构化检测表、正式档案、CSKIN 同步字段和 cskin_record_id 均未命中。未找到图像 URL、OSS 地址、多次分时间指数、历史检测对比或与上次差异；红斑和色斑均无数值指数。可用文本证据为浅红色斑合并毛细血管扩张、紫外线色斑和棕色斑明显，医生查看维度集中在颧部、面颊部，并未见完整多光源报告。',
  },
  {
    pattern: /^十、颜值评分与划痕征/,
    summary: '颜值评分侧未命中静态纹、动态纹、愁容怒容和容量缺失评分，但有“眼周细纹明显”、面部皮肤干燥松弛、双侧颧部/面颊部色素沉着、毛细血管扩张和散在褐色斑点等文本评估。划痕征已检测且为阴性，未记录划痕后浮起，不属于划痕征阳性体质，结果口径为阴性。',
  },
  {
    pattern: /^十一、面诊方案与照片/,
    summary: '医生已出面诊方案，方案为皮秒激光 + 美塑疗法，本次治疗建议为皮秒激光美白淡斑、美塑疗法保湿补水、1 月后复诊、不适随访。中期方向可推断为按 1 月复诊继续评估色斑和屏障改善，但病历未写中期计划，长期方向无法推测。画布标注、直接拍照、定点照、术前照、术后照、前后对比照、照片角度区分和图集信息均未找到结构化记录，仅有病历文本提及 CSKIN 拍照。',
  },
  {
    pattern: /^十二、开单与转化/,
    summary: '2026-01-05 新增 2 张 HIS 订单并对应 2 条企微销售订单，HIS 时间为 17:06:30、17:40:41，企微业务时间为 17:06:43、17:53:00。服务项目包括补注射、进口 YS 超皮秒/蜂巢皮秒全脸、Dr.Song 消炎水光和 Dr.Song 大师霜，商品包括 7 片颜贝金胶原蛋白面膜和 1 件神经酰胺霜。两张订单已付款，展示金额合计 7974.00，无欠费；未见优惠码、抵扣、优惠券或折扣码，未命中充值订单但有美丽基金/卡交易记录。本次 4 个服务项目均生成单次 course 并进入后续划扣，未见多次疗程卡；商品只确认已开单、付款、未退款，不按项目消耗理解。',
  },
  {
    pattern: /^十三、消耗与划扣/,
    summary: '本次共 6 个购买明细，其中 4 个服务项目为补注射、超皮秒、消炎水光、大师霜，2 个商品为面膜和神经酰胺霜。实际完成和划扣均为 4 个服务项目，命中 4 条 course 记录，均 IsUse=1、DoneCourseQty=1，且每项 SumCourseQty=1、剩余次数为 0，未见多次卡。消耗明细为超皮秒 5000.00、消炎水光 1280.00、补注射 200.00、大师霜 500.00，企微展示口径合计 6980.00；消耗业绩人和执行人无法确认，订单销售员工 ID、到访医生和病历医生不能直接替代课程执行字段。',
  },
  {
    pattern: /^十四、物料与出库/,
    summary: '商品侧有出库/配送相关信息，商品物料可确认包括面膜 7 和神经酰胺霜 1；服务项目是否需要治疗物料仍需项目规则表确认。当前抽取未命中陈喜生治疗物料使用明细、治疗物料数量、护士领料申请、库管出库、术前领料、术后真实出库确认，也无法判断申请数量与实际使用数量是否一致。',
  },
  {
    pattern: /^十五、病历、处方、知情同意书/,
    summary: '命中 1 条医生病历 BL20260116****4570，医生杨慧，日期 2026-01-05 16:57:30；病历写明主诉面部色斑 7 年加重半年，双侧颧部/面颊色素沉着，夏季加重、入冬减轻，居家护肤及防晒欠佳，曾行皮秒激光局部祛斑有效。诊断为黄褐斑、日光性黑子、面部皮肤松弛，计划皮秒激光 + 美塑疗法，处理为皮秒美白淡斑、美塑保湿补水、1 月后复诊。另有 1 条待处方补注射（单）qty=1、医生杨慧、状态 0，正式 prescriptions 表未命中；毒麻类处方无法推测。知情同意书、划扣项目是否要求上传知情同意、签字照片和可核验照片均未命中或需项目规则确认。',
  },
  {
    pattern: /^十六、客诉、理赔、退款/,
    summary: '未找到陈喜生客诉/理赔记录，因此投诉客户、时间、门店、处理人、投诉类型、方式、紧急程度、投诉内容、客户反馈、是否解决、是否进入理赔、理赔金额和理赔支付方式均无法填写；无投诉负责医生和投诉咨询师，到访咨询师也未记录。退款侧可确认本次两张订单均未退款，未找到退款记录、退款明细、退款方式或退款计算，退款金额为 0。',
  },
  {
    pattern: /^十七、回访与企微触达/,
    summary: '客户已加企微好友，外部联系人 ID 已命中，添加时间为 2026-01-05 17:44:48，isUnbind=N，因此“不先加企微”不适用。按 customer=11448362877 命中 6 条回访任务历史且均为 SUCCESS，回访员工 ID 为 9433124347，但中文姓名未命中；任务历史 msg=null，未记录回访正文、反馈或满意度。企微会话有 1 条客户在 2026-01-06 00:15:45 发出“我是陈喜生”，未命中素材发送和朋友圈分享；没有预约未到店证据，预约源未命中但到访记录存在。可用快捷标识包括 CRM OID 11448362877、CRM Code Party144431 和 HIS ID，后续 CRM copilot 可围绕回访任务、会话和客户档案入口集中。',
  },
  {
    pattern: /^十八、小程序相关/,
    summary: '未找到小程序预约或 HIS 预约同步记录，也未找到小程序提交的待预约记录。积分侧未找到兑换记录，当前只确认卡积分为 148.74 且积分流水存在但不是兑换；购物车数据未命中。由于未发生或未命中兑换，也没有对应兑换数据，本章暂不作为陈喜生核心判断字段。',
  },
  {
    pattern: /^十九、数据质量提醒/,
    summary: '数据质量提示：新客很多字段非必填，可能为空；面部咨询和特殊情况结构存在但数据可能很少；颜值评分目前使用不多，精神量表刚上线且尚未培训，所以数据少。移动端目前只有一家店使用，不能代表全量；咨询记录有些咨询会用、很多不用，只能有数据时参考；客诉和理赔数据不完整，历史问题可能被门店私下处理；企微语音未购买，不一定有语音存档。',
  },
];

function customerComprehensiveChapterSummary(section) {
  const title = cleanMdChapterTitle(section.cleanTitle || section.title || '');
  return CUSTOMER_COMPREHENSIVE_CHAPTER_SUMMARIES.find((item) => item.pattern.test(title))?.summary || '';
}

function isLowSignalCustomerSummaryValue(value) {
  return /^(未填写|暂无可填资料|待人工确认)$/.test(value)
    || /未找到.*无法填写该字段/.test(value)
    || /未命中陈喜生个人记录/.test(value)
    || /无法推测/.test(value);
}

function buildCustomerChapterSummaryText(section) {
  const isLocalTargetFixture = section.sourceMode === 'local_ds_target';
  if (section?.infoBlockPilot?.mode === 'medical_record_form') {
    const pilotSummary = normalizeValueText(
      section.summaryTag?.aiSummary?.narrativeSummary
      || section.summaryTag?.summary
      || section.summary
      || '',
    ).replace(/\*/g, '').trim();
    if (pilotSummary) return pilotSummary;
  }
  if (!isLocalTargetFixture) {
    const comprehensiveSummary = customerComprehensiveChapterSummary(section);
    if (comprehensiveSummary) return comprehensiveSummary;
  }

  const dsSummary = normalizeValueText(section.summaryTag?.aiSummary?.narrativeSummary || '').replace(/\*/g, '').trim();
  if (dsSummary) return dsSummary;

  const curatedSummary = normalizeValueText(section.summaryTag?.summary || '').replace(/\*/g, '').trim();
  if (curatedSummary) return curatedSummary;

  const rows = buildCustomerChapterSummaryRows(section);
  const values = uniqueValues(rows
    .map((row) => normalizeValueText(row.value).replace(/\*/g, '').replace(/[。；;]+$/g, '').trim())
    .filter(Boolean)
    .filter((value) => !isLowSignalCustomerSummaryValue(value)));
  if (values.length) return truncateText(values.slice(0, 4).join('；'), 260);

  const missingCount = rows.filter((row) => ['missing', 'pending'].includes(row.type)).length;
  if (missingCount) return '本章当前多为未命中、空缺或待确认信息，卡片先不补写推测内容；点击后可逐条核验所有小标题和源字段。';
  return '本章保留原始核验信息点，点击后可逐条查看所有小标题和对应数据。';
}

function renderCustomerChapterAiSummaryBadge(section) {
  const aiSummary = section?.summaryTag?.aiSummary;
  if (!aiSummary) return '';
  const failed = aiSummary.generationMode === 'qwen_block_failed_saved'
    || aiSummary.summaryStatus === 'qwen_failed_saved_all_points'
    || aiSummary.failure;
  if (!failed) return '';
  const reason = aiSummary.failure?.message || aiSummary.validation?.errorMessage || '该信息块 Qwen 总结未通过全点位覆盖校验，但原始生成内容已保存。';
  return `<small class="qwen-summary-warning-badge" title="${escapeHtml(reason)}">Qwen校验未通过 · 已保存</small>`;
}

function renderMdSummaryTags(fixture) {
  const sections = getCustomerProfileSections(fixture);
  return `
    <section class="md-summary-block">
      <div class="user-requirement-section-head md-summary-head">
        <strong>${formatNumber(sections.length)} 个章节的重要总结</strong>
        <span>每张卡覆盖对应章节下所有小标题，确认无误时可不再进入明细逐条核验</span>
      </div>
      <div class="md-summary-tags">
        ${sections.map((section, sectionIndex) => {
          const rows = buildCustomerChapterSummaryRows(section);
          const chapterTitle = section.cleanTitle || cleanMdChapterTitle(section.title);
          const order = section.summaryTag?.order || sectionIndex + 1;
          return `
          <article class="md-summary-tag">
            <span>${formatNumber(order)}</span>
            <div class="md-summary-tag-content">
              <strong>${escapeHtml(displayMdChapterTitle(chapterTitle))}</strong>
              <ul class="md-summary-line-list">
                ${rows.map((row) => `
                  <li class="${escapeHtml(mdEvidenceTypeConfig(row.type).className)}">
                    <b>${escapeHtml(row.title)}</b>
                    <span>${escapeHtml(row.value)}</span>
                  </li>
                `).join('')}
              </ul>
              <small>${escapeHtml(chapterTitle)} · ${formatNumber(rows.length)} 个小标题</small>
            </div>
          </article>
        `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderMdEvidenceRecordCards(records) {
  return (records || []).map((record) => `
    <article class="md-evidence-record">
      <div class="md-evidence-record-head">
        <div>
          <b>${escapeHtml(record.title || '证据记录')}</b>
          <span>${escapeHtml(record.source || '')}</span>
        </div>
        <code>${escapeHtml(record.recordId || '')}</code>
      </div>
      <div class="md-evidence-record-meta">
        ${record.doctorName ? `<span>医生：${escapeHtml(record.doctorName)}</span>` : ''}
        ${record.organizationName ? `<span>门店：${escapeHtml(record.organizationName)}</span>` : ''}
        ${record.createTime ? `<span>时间：${escapeHtml(record.createTime)}</span>` : ''}
        ${record.customerId ? `<span>HIS：${escapeHtml(record.customerId)}</span>` : ''}
      </div>
      <div class="md-evidence-field-grid">
        ${(record.fields || []).map((field) => `
          <div>
            <span>${escapeHtml(formatMdEvidenceFieldLabel(field, record))}</span>
            <p>${escapeHtml(formatMdEvidenceFieldValue(field, record))}</p>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');
}

function renderMdEvidenceButton(section, row, sectionIndex, rowIndex, scope = 'customers', options = {}) {
  const records = row.evidenceRecords || [];
  const hasGeneratedDetail = Boolean(row.detailContent || row.dsDetail || row.inferenceMethod || row.amountNormalization);
  const forceDetail = Boolean(options.force);
  if (!records.length && !hasGeneratedDetail && !forceDetail) return '';
  const key = `${scope}-md-evidence-${sectionIndex}-${rowIndex}`;
  const targetMap = scope === 'ds-v3' ? state.dsV3MdEvidenceDetails : state.mdEvidenceDetails;
  targetMap.set(key, {
    sectionTitle: section.title,
    rowTitle: row.title || '未命名标题',
    rowValue: row.value || '',
    dataStatus: row.dataStatus || '',
    source: row.source || '',
    evidence: row.evidence || '',
    detailContent: row.detailContent || row.dsDetail || null,
    inferenceMethod: row.inferenceMethod || '',
    amountNormalization: row.amountNormalization || null,
    generatedAt: row.generatedAt || section.summaryTag?.generatedAt || '',
    raw: row.raw || null,
    records,
  });
  const detailCount = records.length || 1;
  return `
    <button type="button" class="md-evidence-detail-button" data-md-evidence-scope="${escapeHtml(scope)}" data-md-evidence-key="${escapeHtml(key)}">
      查看详情 · ${formatNumber(detailCount)} 条
    </button>
  `;
}

function renderMdSections(fixture, scope = 'customers') {
  return (fixture.sections || []).map((section, sectionIndex) => `
    <section class="user-requirement-section md-table-section ${section.isPrimary16 ? 'is-primary-md' : 'is-support-md'}">
      <div class="user-requirement-section-head">
        <strong>${escapeHtml(section.title)}</strong>
        <span>${formatNumber(section.rowCount)} 行 · ${section.isPrimary16 ? '16标签正文' : '补充核验/附录'}</span>
      </div>
      <div class="user-requirement-rows">
        ${(section.rows || []).map((row, rowIndex) => {
          const className = mdRowStatusClass(row);
          return `
            <article class="user-requirement-row md-table-row ${className}">
              <div class="user-requirement-title">
                <span class="status-chip ${className}">${escapeHtml(mdRowStatusLabel(row))}</span>
                <strong>${escapeHtml(row.title || '未命名标题')}</strong>
                ${renderMdEvidenceButton(section, row, sectionIndex, rowIndex, scope)}
              </div>
              <p class="value-snippet"><span>填写结果</span>${escapeHtml(formatMdDisplayText(row.value || '未填写'))}</p>
              <div class="md-row-grid">
                <div><span>数据状态</span><strong>${escapeHtml(row.dataStatus || '未标注')}</strong></div>
                <div><span>源库/源表/字段</span><strong>${escapeHtml(row.source || '未标注')}</strong></div>
              </div>
              <p class="explanation">${escapeHtml(formatMdDisplayText(row.evidence || '无证据说明'))}</p>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `).join('');
}

const CUSTOMER_EVIDENCE_TYPES = [
  { key: 'truth', label: '原始值/真值', className: 'is-truth' },
  { key: 'inferred', label: '推理值', className: 'is-inferred' },
  { key: 'missing', label: '空缺/灰色', className: 'is-missing-evidence' },
  { key: 'pending', label: '待确认', className: 'is-pending-evidence' },
];

const CUSTOMER_SUMMARY_HIGHLIGHT_RE = /(陈喜生|RFM\s*[A-Z]|粉星|黄褐斑|日光性黑子|面部皮肤松弛|皮秒激光|美塑疗法|CSKIN|企微|SUCCESS|已付款|无欠费|无余额|客户推荐\/老带新|\*\*\*\*诊所|杨慧|陈曦|祝媛园|未命中|未找到|无法填写|待确认|1 月后复诊|划扣|消耗|客诉|理赔|退款|积分|推荐关系|医生病历|补注射|超皮秒|消炎水光|大师霜|神经酰胺霜|\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2})?|\d+(?:\.\d{2})?)/g;

function cleanMdChapterTitle(title = '') {
  return String(title || '').replace(/==.*?==/g, '').trim();
}

function renderCustomerHighlightedSummary(text = '') {
  const cleanText = formatMdDisplayText(text || '')
    .replace(/\s*\[(?:REQ\d+|IP-[^\]]+)\]/g, '')
    .replace(/\s+([，。、；;：:])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const protectedText = escapeHtml(cleanText);
  return protectedText
    .replace(CUSTOMER_SUMMARY_HIGHLIGHT_RE, '<strong>$1</strong>');
}

function normalizeCustomerGenderText(customer = {}) {
  const current = customer.genderText || '';
  const source = `${customer.genderSourceStatus || ''} ${customer.genderRaw || ''}`;
  if (current && current !== '待确认') return current;
  if (/(Sex|gender)\s*=\s*1/.test(source)) return '男';
  if (/(Sex|gender)\s*=\s*2/.test(source)) return '女';
  return current || '待确认';
}

function mdRowEvidenceType(row) {
  const statusClass = mdRowStatusClass(row);
  const text = [row?.title, row?.value, row?.dataStatus, row?.evidence].join(' ');
  if (/待确认|需\s*(ECS|规则|字典|另查|复核|确认)|需要再次|状态码含义|项目规则|不能确认|无法确认|不足以推断/.test(text)) return 'pending';
  if (statusClass === 'is-no-record') return 'missing';
  if (/推断|归纳|计算|口径解释|汇总|部分命中|不足以推断|\*/.test(text)) return 'inferred';
  if (/原始字段|原始标识|医生病历事实|原始主键|本地统一 ID/.test(row?.dataStatus || '')) return 'truth';
  return 'inferred';
}

function mdEvidenceTypeConfig(type) {
  return CUSTOMER_EVIDENCE_TYPES.find((item) => item.key === type) || CUSTOMER_EVIDENCE_TYPES[1];
}

const CUSTOMER_DATA_QUALITY_REMINDER_ROWS = [
  ['新客非必填字段', '新客数据很多字段非必填，可能为空。'],
  ['面部咨询和特殊情况', '面部咨询和特殊情况结构存在，但数据可能很少。'],
  ['颜值评分使用度', '颜值评分现在用得不多。'],
  ['精神量表上线状态', '精神量表刚上线，还没培训，所以目前数据少。'],
  ['移动端样本提醒', '移动端目前只有一家店在用，不能代表全量。'],
  ['咨询记录使用差异', '咨询记录有些咨询会用，很多咨询不用，只能有数据时参考。'],
  ['客诉理赔完整度', '客诉、理赔数据不完整，很多历史问题可能被门店私下处理。'],
  ['企微语音存档', '企微语音没有购买，不一定有语音存档。'],
];

function buildCustomerDataQualitySection() {
  const rows = CUSTOMER_DATA_QUALITY_REMINDER_ROWS.map(([title, value]) => ({
    title,
    value,
    dataStatus: '数据质量提醒',
    source: '业务口径 / 数据质量提醒',
    evidence: value,
  }));
  return {
    title: '十九、数据质量提醒',
    cleanTitle: '十九、数据质量提醒',
    rowCount: rows.length,
    isCustomerDerivedChapter: true,
    summaryTag: { order: 19, label: '十九、数据质量提醒', sectionTitle: '十九、数据质量提醒' },
    rows,
  };
}

function shouldShowCustomerProfileSection(section) {
  const title = cleanMdChapterTitle(section?.title || '');
  return Boolean(section?.isPrimary16)
    || /^十七、回访与企微触达/.test(title)
    || /^十八、小程序相关/.test(title)
    || /^十九、数据质量提醒/.test(title);
}

function getCustomerProfileSections(fixture) {
  const tags = fixture.summaryTags || [];
  const hideDataQualitySection = fixture?.meta?.infoBlockPilot?.hideDataQualitySection === true;
  const sections = (fixture.sections || [])
    .filter(shouldShowCustomerProfileSection)
    .map((section) => {
      const title = cleanMdChapterTitle(section.title);
      const summaryTag = tags.find((tag) => (
        cleanMdChapterTitle(tag.sectionTitle || tag.label) === title
        || cleanMdChapterTitle(tag.label) === title
      )) || {};
      return { ...section, cleanTitle: title, summaryTag };
    });
  if (!hideDataQualitySection && !sections.some((section) => /^十九、数据质量提醒/.test(section.cleanTitle || section.title || ''))) {
    sections.push(buildCustomerDataQualitySection());
  }
  return sections.map((section, index) => ({
    ...section,
    rowCount: section.rowCount || (section.rows || []).length,
    summaryTag: {
      ...(section.summaryTag || {}),
      order: section.summaryTag?.order || index + 1,
    },
  }));
}

function countCustomerChapterRows(rows = []) {
  return rows.reduce((acc, row) => {
    const type = mdRowEvidenceType(row);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

function renderCustomerStatusCount(label, count, className) {
  return `<span class="customer-status-count ${className}"><b>${formatNumber(count || 0)}</b>${escapeHtml(label)}</span>`;
}

function renderCustomerReviewIssueTags(issues = []) {
  if (!issues.length) return '';
  return `
    <div class="archive-light-cause-tags">
      ${issues.map((issue) => `
        <span class="archive-light-cause-tag is-${escapeHtml(issue.tone || 'yellow')}">
          ${escapeHtml(issue.tone === 'red' ? '红灯原因' : '黄灯原因')}：${escapeHtml(customerReviewIssueText(issue))}
        </span>
      `).join('')}
    </div>
  `;
}

function customerReviewIssuesForScope(priority, scope, key) {
  return (priority?.issues || []).filter((issue) => issue.scope === scope && (!key || issue.key === key));
}

function customerReviewIssuesForSection(priority, section) {
  const order = getCustomerReviewSectionOrder(section);
  return (priority?.issues || []).filter((issue) => issue.scope === 'section' && issue.sectionOrder === order);
}

function renderCustomerInfoItem(label, value, options = {}) {
  const dispute = options.dispute || null;
  const issueTags = renderCustomerReviewIssueTags(options.issues || []);
  const className = [
    options.className || '',
    issueTags ? 'has-light-cause-tag' : '',
    dispute ? 'is-advisor-disputed challenge-flagged' : '',
  ].filter(Boolean).join(' ');
  const note = options.note ? ` title="${escapeHtml(options.note)}"` : '';
  return `
    <div class="customer-info-item ${className}"${note}>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || '待补')}</strong>
      ${issueTags}
      ${renderAdvisorArchiveDisputeInline(dispute)}
    </div>
  `;
}

function renderCustomerArchiveEditButton(fixture) {
  const customer = fixture.customer || {};
  const editedAt = fixture.meta?.localOverrideUpdatedAt || '';
  return `
    <div class="customer-title-actions">
      <button type="button" class="customer-archive-edit-button" data-customer-archive-edit="${escapeHtml(customer.unifiedCustomerId || '')}">修改档案</button>
      ${editedAt ? `<small>已保存修改 · ${escapeHtml(editedAt.replace('T', ' ').slice(0, 16))}</small>` : ''}
    </div>
  `;
}

function archiveQualityForCustomer(customerId) {
  const items = state.archiveQuality?.queue?.queue || [];
  return items.find((item) => [item.customerId, item.unifiedCustomerId, item.qualityId].includes(customerId)) || null;
}

function renderArchiveQualityBanner(fixture) {
  const customerId = fixture?.customer?.unifiedCustomerId || '';
  const quality = archiveQualityForCustomer(customerId);
  if (!quality || quality.readyForProfiling !== false) return '';
  const criticalCount = (quality.findings || []).filter((finding) => finding.severity === 'critical').length;
  return `
    <section class="archive-quality-banner">
      <strong>档案未达画像标准（等级 ${escapeHtml(quality.archiveGrade || 'C')}）：${formatNumber(criticalCount)} 项 critical 待处理</strong>
      <span>历史画像仍可查看；新一轮画像 run 候选装配需先完成档案补全/裁决。</span>
    </section>
  `;
}

function archiveBlockSummaryForSection(fixture, sectionIndex) {
  const customerId = fixture?.customer?.unifiedCustomerId || '';
  const customers = Array.isArray(state.archiveBlockSummaries?.customers) ? state.archiveBlockSummaries.customers : [];
  const customer = customers.find((item) => [item.customerId, item.unifiedCustomerId, item.customerCode].includes(customerId));
  const blockId = `B${String(sectionIndex + 1).padStart(2, '0')}`;
  return (Array.isArray(customer?.blocks) ? customer.blocks : []).find((block) => block.blockId === blockId) || null;
}

function renderArchiveBlockSummary(block) {
  return '';
}

function renderCustomerIdentityHeader(fixture) {
  const customer = fixture.customer || {};
  const disputes = activeAdvisorArchiveDisputesForCustomer(customer.unifiedCustomerId);
  const priority = getCustomerReviewPriority(fixture);
  const phone = customer.phoneMasked || '待补';
  const genderText = normalizeCustomerGenderText(customer);
  const genderIsPending = !genderText || genderText === '待确认';
  const infoItems = [
    ['门店', customer.clinicName || '待补', '', 'clinic'],
    ['医生', customer.doctorName || '待补', '', 'advisor_doctor'],
    ['年龄', customer.ageText || '待补', '', 'age'],
    ['性别', genderText || '待确认', genderIsPending ? 'is-pending' : '', 'gender'],
    ['RFM', customer.rfmGrade ? `RFM ${customer.rfmGrade}` : '待补', '', 'rfm_grade'],
    ['来源渠道', customer.sourceChannel || '待补', '', 'source_channel'],
    ['初诊结果', customer.firstDiagnosisSummary || '待补', '', 'p1_diagnosis_need'],
    ['等级', customer.memberLevel || '待补', '', 'member_level'],
  ];
  const nameDispute = advisorArchiveDisputeForField(disputes, 'customer_name');
  return `
    <section class="customer-file-top ${nameDispute ? 'is-advisor-disputed challenge-flagged' : ''}">
      <div class="customer-title-row">
        <div>
          <h3>
            <span>${escapeHtml(customer.name || customer.customerNameMasked || '未命名顾客')}</span>
            <small>${escapeHtml(phone)}</small>
          </h3>
          <code>${escapeHtml(customer.unifiedCustomerId || '')}</code>
          ${renderAdvisorArchiveDisputeInline(nameDispute)}
        </div>
        ${renderCustomerArchiveEditButton(fixture)}
      </div>
      <div class="customer-info-strip">
        ${infoItems.map(([label, value, className, fieldKey, note]) => renderCustomerInfoItem(label, value, {
          className,
          note,
          issues: customerReviewIssuesForScope(priority, 'identity', fieldKey),
          dispute: advisorArchiveDisputeForField(disputes, fieldKey) || advisorArchiveDisputeForLabel(disputes, label),
        })).join('')}
      </div>
    </section>
    ${renderArchiveQualityBanner(fixture)}
  `;
}

function spendingStatusClass(item) {
  const status = `${item?.status || ''}${item?.value || ''}`;
  if (/待确认|复核/.test(status)) return 'is-pending-evidence';
  if (/空缺|未命中|缺失/.test(status)) return 'is-missing-evidence';
  if (/推理|推断|计算/.test(status)) return 'is-inferred';
  return 'is-truth';
}

function renderCustomerSpendingVerification(fixture) {
  const items = normalizeArchiveSpendingVerification(fixture).items || [];
  if (!items.length) return '';
  const customerId = fixture?.customer?.unifiedCustomerId || '';
  const disputes = activeAdvisorArchiveDisputesForCustomer(customerId);
  const priority = getCustomerReviewPriority(fixture);
  return `
    <section class="customer-spending-strip" aria-label="消费情况">
      <div class="customer-strip-head">
        <strong>消费情况</strong>
      </div>
      <div class="customer-spending-grid">
        ${items.map((item) => {
          const dispute = advisorArchiveDisputeForSpendingItem(disputes, item);
          const issueTags = renderCustomerReviewIssueTags(customerReviewIssuesForScope(priority, 'spending', item.key));
          return `
          <article class="customer-spending-item ${spendingStatusClass(item)} ${issueTags ? 'has-light-cause-tag' : ''} ${dispute ? 'is-advisor-disputed challenge-flagged' : ''}">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value || '待确认')}</strong>
            ${issueTags}
            ${item.note ? `<small>${escapeHtml(item.note)}</small>` : ''}
            ${renderAdvisorArchiveDisputeInline(dispute)}
          </article>
        `;
        }).join('')}
      </div>
    </section>
  `;
}

const ARCHIVE_APPOINTMENT_TIMELINE_REQ_IDS = new Set(['REQ0016', 'REQ0017', 'REQ0018', 'REQ0023', 'REQ0024', 'REQ0025', 'REQ0026']);
const ARCHIVE_VISIT_TIMELINE_REQ_IDS = new Set(['REQ0028', 'REQ0029', 'REQ0030', 'REQ0032', 'REQ0033', 'REQ0034']);

function archiveRowRequirementId(row = {}) {
  return row.requirementId || row.requirement_id || row.pointId || row.infoPointId || '';
}

function archiveTimelineRelevantSection(section = {}) {
  const title = cleanMdChapterTitle(section.cleanTitle || section.title || '');
  if (/预约与待预约/.test(title)) return 'appointment';
  if (/到访与分诊/.test(title)) return 'visit';
  return '';
}

function archiveTimelineRowsForKind(fixture, kind) {
  const sections = getCustomerProfileSections(fixture);
  const section = sections.find((item) => archiveTimelineRelevantSection(item) === kind);
  return {
    section,
    rows: section?.rows || [],
  };
}

function firstArchiveTimelineRow(fixture, kind) {
  const reqIds = kind === 'appointment' ? ARCHIVE_APPOINTMENT_TIMELINE_REQ_IDS : ARCHIVE_VISIT_TIMELINE_REQ_IDS;
  const { rows } = archiveTimelineRowsForKind(fixture, kind);
  return rows.find((row) => reqIds.has(archiveRowRequirementId(row)) && normalizeValueText(row.value || '').trim())
    || rows.find((row) => /时间轴/.test(row.title || '') && normalizeValueText(row.value || '').trim())
    || null;
}

function parseArchiveTimelineValue(row, kind) {
  const value = normalizeValueText(formatMdDisplayText(row?.value || '')).replace(/\*/g, '').trim();
  if (!value) return { entries: [], notes: [] };
  const body = value.includes('：') ? value.slice(value.indexOf('：') + 1).trim() : value;
  const entries = [];
  const notes = [];
  body.split(/；/).map((item) => item.trim()).filter(Boolean).forEach((part) => {
    const match = part.match(/^(\d+)\.\s*(.+)$/);
    if (!match) {
      notes.push(part);
      return;
    }
    const fields = match[2].split('｜').map((field) => field.trim()).filter(Boolean);
    entries.push({
      kind,
      order: match[1],
      raw: match[2],
      date: fields[0] || `记录 ${match[1]}`,
      clinic: fields[1] || '',
      time: fields[2] || '',
      status: fields[3] || '',
      stage: fields[4] || '',
      item: kind === 'appointment' ? fields[5] || '' : '',
      people: fields.slice(kind === 'appointment' ? 6 : 5),
    });
  });
  return { entries, notes };
}

function uniqueArchiveTimelineRows(rows = []) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = `${row.title || ''}::${normalizeValueText(row.value || '')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildCustomerArchiveTimeline(fixture) {
  const appointmentRow = firstArchiveTimelineRow(fixture, 'appointment');
  const visitRow = firstArchiveTimelineRow(fixture, 'visit');
  const appointmentRows = archiveTimelineRowsForKind(fixture, 'appointment');
  const visitRows = archiveTimelineRowsForKind(fixture, 'visit');
  return {
    appointment: {
      title: '预约记录',
      row: appointmentRow,
      source: appointmentRow?.source || appointmentRows.section?.source || '',
      detailRows: uniqueArchiveTimelineRows(appointmentRows.rows),
      ...parseArchiveTimelineValue(appointmentRow, 'appointment'),
    },
    visit: {
      title: '到访与分诊',
      row: visitRow,
      source: visitRow?.source || visitRows.section?.source || '',
      detailRows: uniqueArchiveTimelineRows(visitRows.rows),
      ...parseArchiveTimelineValue(visitRow, 'visit'),
    },
  };
}

function archiveTimelineKindMeta(kind) {
  if (kind === 'appointment') {
    return {
      title: '预约记录',
      modalTitle: '预约记录时间轴',
      countLabel: '预约',
      buttonLabel: '查看预约时间轴',
    };
  }
  if (kind === 'visit') {
    return {
      title: '到访与分诊',
      modalTitle: '到访分诊时间轴',
      countLabel: '到访',
      buttonLabel: '查看到访时间轴',
    };
  }
  return {
    title: '预约/到访',
    modalTitle: '预约/到访时间轴',
    countLabel: '记录',
    buttonLabel: '查看时间轴',
  };
}

function customerArchiveTimelineGroupHasContent(group) {
  return Boolean((group?.entries || []).length || (group?.notes || []).length || (group?.detailRows || []).length);
}

function customerArchiveTimelineHasContent(timeline, kind = '') {
  if (kind) return customerArchiveTimelineGroupHasContent(timeline?.[kind]);
  return ['appointment', 'visit'].some((item) => customerArchiveTimelineGroupHasContent(timeline?.[item]));
}

function customerChapterSectionNo(section, fallbackIndex = 0) {
  const order = Number(section?.summaryTag?.order || section?.order || 0);
  return order || fallbackIndex + 1;
}

function renderCustomerArchiveTimelinePrelude(fixture, section) {
  const kind = archiveTimelineRelevantSection(section);
  if (!kind) return '';
  const timeline = buildCustomerArchiveTimeline(fixture);
  const group = timeline[kind];
  if (!customerArchiveTimelineGroupHasContent(group)) return '';
  const meta = archiveTimelineKindMeta(kind);
  const entryCount = group.entries.length;
  return `
    <div class="customer-archive-timeline-prelude">
      <div>
        <strong>${escapeHtml(meta.modalTitle)}</strong>
        <span>${escapeHtml(meta.countLabel)} ${formatNumber(entryCount)}</span>
      </div>
      <button
        type="button"
        class="customer-archive-timeline-open"
        data-customer-archive-timeline-open
        data-customer-archive-timeline-kind="${escapeHtml(kind)}"
      >${escapeHtml(meta.buttonLabel)}</button>
    </div>
  `;
}

function renderCustomerArchiveTimelineEntry(entry) {
  const people = (entry.people || []).filter(Boolean);
  return `
    <li class="customer-archive-timeline-item is-${escapeHtml(entry.kind)}">
      <div class="customer-archive-timeline-dot">${escapeHtml(entry.order || '')}</div>
      <div class="customer-archive-timeline-card">
        <div class="customer-archive-timeline-card-head">
          <strong>${escapeHtml(entry.date)}</strong>
          ${entry.time ? `<span>${escapeHtml(entry.time)}</span>` : ''}
        </div>
        <p>${escapeHtml([entry.clinic, entry.status, entry.stage, entry.item].filter(Boolean).join('｜') || entry.raw)}</p>
        ${people.length ? `<small>${people.map((item) => escapeHtml(item)).join('｜')}</small>` : ''}
      </div>
    </li>
  `;
}

function renderCustomerArchiveTimelineFactRows(rows = []) {
  if (!rows.length) return '';
  return `
    <div class="customer-archive-timeline-facts">
      ${rows.map((row) => `
        <article>
          <span>${escapeHtml(row.title || '未命名子信息点')}</span>
          <p>${escapeHtml(formatMdDisplayText(row.value || '未填写'))}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderCustomerArchiveTimelineGroup(group, kind) {
  const entries = group.entries || [];
  const notes = group.notes || [];
  return `
    <section class="customer-archive-timeline-section is-${escapeHtml(kind)}">
      <div class="customer-archive-timeline-section-head">
        <strong>${escapeHtml(group.title)}</strong>
        <span>${escapeHtml(group.source || '源字段待确认')}</span>
      </div>
      ${entries.length
        ? `<ol class="customer-archive-timeline-list">${entries.map(renderCustomerArchiveTimelineEntry).join('')}</ol>`
        : '<p class="customer-archive-timeline-empty">暂无可展示时间轴记录</p>'}
      ${notes.length ? `<div class="customer-archive-timeline-notes">${notes.map((note) => `<span>${escapeHtml(note)}</span>`).join('')}</div>` : ''}
      ${renderCustomerArchiveTimelineFactRows(group.detailRows || [])}
    </section>
  `;
}

function renderCustomerArchiveTimelineOnlyModalBody(fixture, section) {
  const kind = archiveTimelineRelevantSection(section);
  if (!kind) return '<p class="customer-chapter-modal-empty">暂无可展示时间轴记录。</p>';
  const timeline = buildCustomerArchiveTimeline(fixture);
  const group = timeline[kind];
  if (!customerArchiveTimelineGroupHasContent(group)) {
    return '<p class="customer-chapter-modal-empty">暂无可展示时间轴记录。</p>';
  }
  return renderCustomerArchiveTimelineGroup({
    ...group,
    detailRows: [],
  }, kind);
}

function openCustomerArchiveTimelineModal(fixture, requestedKind = '') {
  const customer = fixture?.customer || {};
  const timeline = buildCustomerArchiveTimeline(fixture);
  const kind = ['appointment', 'visit'].includes(requestedKind) ? requestedKind : '';
  if (!customerArchiveTimelineHasContent(timeline, kind)) return;
  const groups = kind
    ? [[kind, timeline[kind]]]
    : ['appointment', 'visit'].map((item) => [item, timeline[item]]).filter(([, group]) => customerArchiveTimelineGroupHasContent(group));
  const meta = archiveTimelineKindMeta(kind);
  document.querySelector('.customer-archive-timeline-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div class="customer-archive-timeline-modal" role="dialog" aria-modal="true" aria-labelledby="customer-archive-timeline-title">
      <div class="customer-archive-timeline-dialog">
        <div class="customer-archive-timeline-head">
          <div>
            <strong id="customer-archive-timeline-title">${escapeHtml(meta.modalTitle)}</strong>
            <span>${escapeHtml(customer.name || customer.customerNameMasked || '未命名顾客')} · ${escapeHtml(customer.unifiedCustomerId || '')}</span>
          </div>
          <button type="button" class="customer-archive-timeline-close" data-customer-archive-timeline-close aria-label="关闭">关闭</button>
        </div>
        <div class="customer-archive-timeline-body ${groups.length === 1 ? 'is-single' : ''}">
          ${groups.map(([groupKind, group]) => renderCustomerArchiveTimelineGroup(group, groupKind)).join('')}
        </div>
      </div>
    </div>
  `);
  const modal = document.querySelector('.customer-archive-timeline-modal');
  modal.querySelector('[data-customer-archive-timeline-close]')?.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.remove();
  });
}

function renderCustomerChapterConsultationValue(value) {
  const text = Array.isArray(value) ? value.filter(Boolean).join('，') : normalizeValueText(value || '');
  return text ? escapeHtml(text) : '&nbsp;';
}

function renderCustomerChapterConsultationRecord(record = {}) {
  const fields = [
    ['咨询师：', record.consultantName],
    ['咨询方式：', record.consultationMethod],
    ['咨询内容：', record.consultationContent],
    ['推荐项目：', record.recommendedProjects],
    ['关注项目：', record.focusedProjects],
    ['未成交原因：', record.dealFailureReason],
    ['补充原因：', record.supplementaryReason],
  ];
  return `
    <section class="customer-chapter-consultation-record">
      <strong>${escapeHtml(record.clinicName || '未登记机构')}</strong>
      <div class="customer-chapter-consultation-fields">
        ${fields.map(([label, value]) => `
          <div>
            <span>${escapeHtml(label)}</span>
            <p>${renderCustomerChapterConsultationValue(value)}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderCustomerChapterPilotRouteMap(sourceRoute = {}) {
  const routeRows = safeArray(sourceRoute.routeRows);
  if (!routeRows.length) return '';
  return `
    <details class="customer-chapter-pilot-route" open>
      <summary>
        <strong>字段映射路由</strong>
        <span>${escapeHtml(sourceRoute.routeId || 'source_route')} · ${escapeHtml(sourceRoute.sourceDatabase || 'source')}</span>
      </summary>
      ${sourceRoute.extractionBoundary ? `<p class="customer-chapter-pilot-route-boundary">${escapeHtml(formatMdDisplayText(sourceRoute.extractionBoundary))}</p>` : ''}
      <div class="customer-chapter-pilot-route-scroll">
        <table>
          <thead>
            <tr>
              <th>表头</th>
              <th>源字段</th>
              <th>JOIN 路径</th>
              <th>抽取规则</th>
            </tr>
          </thead>
          <tbody>
            ${routeRows.map((row) => `
              <tr>
                <td>${escapeHtml(row.column || '')}</td>
                <td>${safeArray(row.sourceFields).map((field) => `<span>${escapeHtml(formatMdDisplayText(field))}</span>`).join('')}</td>
                <td>${escapeHtml(formatMdDisplayText(row.joinPath || sourceRoute.joinPath || '待确认'))}</td>
                <td>${escapeHtml(formatMdDisplayText(row.extractionRule || '待 DBA 确认'))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </details>
  `;
}

function renderCustomerChapterPilotTable(section) {
  const table = section?.infoBlockPilot?.table || {};
  const columns = safeArray(table.columns);
  const rows = safeArray(table.rows);
  if (!columns.length || !rows.length) return '';
  const hideLabelColumn = Boolean(table.hideLabelColumn);
  return `
    <section class="customer-chapter-pilot-table ${hideLabelColumn ? 'has-no-row-label' : ''}">
      <div class="customer-chapter-pilot-table-head">
        <strong>${escapeHtml(table.title || displayMdChapterTitle(section.cleanTitle || section.title || '子信息点表格'))}</strong>
        <span>${escapeHtml(table.subtitle || `${formatNumber(columns.length)} 个子信息点作为表头`)}</span>
      </div>
      <div class="customer-chapter-pilot-table-scroll">
        <table>
          <thead>
            <tr>
              ${hideLabelColumn ? '' : '<th>对象</th>'}
              ${columns.map((column) => `<th>${escapeHtml(column.title || column.key || '子信息点')}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                ${hideLabelColumn ? '' : `<td>${escapeHtml(row.label || '汇总')}</td>`}
                ${columns.map((column) => {
                  const value = row.cells?.[column.key] || row[column.key] || '';
                  return `<td>${escapeHtml(formatMdDisplayText(value || '未填写'))}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderCustomerChapterMaterialOutboundSheet(sheet) {
  const items = safeArray(sheet.items);
  return `
    <details class="customer-chapter-material-sheet" open>
      <summary class="customer-chapter-material-sheet-head">
        <span class="customer-chapter-material-chev" aria-hidden="true"></span>
        <span>${escapeHtml(sheet.date || '-')}</span>
        <span>${escapeHtml(sheet.organizationName || '-')}</span>
        <span>${escapeHtml(sheet.personName || '-')}</span>
        <strong>${escapeHtml(sheet.statusText || (sheet.documentNo ? `已生成提货申请单: ${sheet.documentNo}` : '未命中提货申请单号'))}</strong>
      </summary>
      <div class="customer-chapter-material-table-scroll">
        <table class="customer-chapter-material-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>名称</th>
              <th>规格</th>
              <th>单位</th>
              <th>术前领取数量</th>
              <th>消耗数量</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr>
                <td>${escapeHtml(item.sequence || index + 1)}</td>
                <td>${escapeHtml(formatMdDisplayText(item.name || '-'))}</td>
                <td>${escapeHtml(formatMdDisplayText(item.specification || '-'))}</td>
                <td>${escapeHtml(formatMdDisplayText(item.unit || '-'))}</td>
                <td>${escapeHtml(formatMdDisplayText(item.preoperativeQuantity || '-'))}</td>
                <td>${escapeHtml(formatMdDisplayText(item.consumedQuantity || '-'))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </details>
  `;
}

function renderCustomerChapterMaterialOutbound(section) {
  const payload = section?.infoBlockPilot?.materialOutbound || {};
  const sheets = safeArray(payload.sheets);
  if (!sheets.length) return '';
  return `
    <section class="customer-chapter-material-outbound">
      ${sheets.map(renderCustomerChapterMaterialOutboundSheet).join('')}
    </section>
  `;
}

function renderCustomerChapterFinalDisplayRow(row) {
  const chips = [
    row.displayTime,
    row.conversationType,
    row.groupName,
    row.sender,
  ].filter(Boolean);
  return `
    <article class="customer-chapter-final-row">
      <div class="customer-chapter-final-row-meta">
        ${chips.map((chip) => `<span>${escapeHtml(formatMdDisplayText(chip))}</span>`).join('')}
      </div>
      <p>${escapeHtml(formatMdDisplayText(row.finalDisplayText || '未填写'))}</p>
      <div class="customer-chapter-final-row-foot">
        ${row.stage ? `<span>${escapeHtml(row.stage)}</span>` : ''}
        ${row.sourceEvidence ? `<span>${escapeHtml(row.sourceEvidence)}</span>` : ''}
        ${row.note ? `<span>${escapeHtml(formatMdDisplayText(row.note))}</span>` : ''}
      </div>
    </article>
  `;
}

function renderCustomerChapterFinalDisplay(section) {
  const finalDisplay = section?.infoBlockPilot?.finalDisplay || {};
  const points = safeArray(finalDisplay.points);
  const rows = safeArray(finalDisplay.rows);
  if (!points.length && !rows.length) return '';
  const pointIds = new Set(points.map((point) => point.id).filter(Boolean));
  const orphanRows = rows.filter((row) => !pointIds.has(row.infoPointId));
  const displayPoints = orphanRows.length
    ? [
      ...points,
      {
        id: '未分组',
        name: '补充映射数据',
        reason: '该组承接未声明 infoPointId 或新增映射行，避免详细数据被静默隐藏。',
        detailRule: '保留源行展示，后续可补充到正式信息点定义。',
      },
    ]
    : points;
  const rowsByPoint = new Map();
  rows.forEach((row) => {
    const key = pointIds.has(row.infoPointId) ? row.infoPointId : '未分组';
    const list = rowsByPoint.get(key) || [];
    list.push(row);
    rowsByPoint.set(key, list);
  });
  return `
    <section class="customer-chapter-final-display">
      <div class="customer-chapter-final-display-head">
        <strong>${escapeHtml(finalDisplay.title || displayMdChapterTitle(section.cleanTitle || section.title || '最终展示'))}</strong>
        <span>${formatNumber(displayPoints.length)} 个新版信息点 · ${formatNumber(rows.length)} 条详细展示数据</span>
      </div>
      <div class="customer-chapter-final-display-grid">
        ${displayPoints.map((point) => {
          const pointRows = rowsByPoint.get(point.id) || [];
          return `
            <article class="customer-chapter-final-point">
              <header>
                <div>
                  <span>${escapeHtml(point.id || '')}</span>
                  <strong>${escapeHtml(point.name || '未命名信息点')}</strong>
                </div>
                <b>${formatNumber(pointRows.length)} 条</b>
              </header>
              <div class="customer-chapter-final-point-rules">
                ${point.reason ? `<p><span>设计原因</span>${escapeHtml(formatMdDisplayText(point.reason))}</p>` : ''}
                ${point.detailRule ? `<p><span>展示规则</span>${escapeHtml(formatMdDisplayText(point.detailRule))}</p>` : ''}
              </div>
              <div class="customer-chapter-final-rows">
                ${pointRows.length
                  ? pointRows.map(renderCustomerChapterFinalDisplayRow).join('')
                  : '<p class="customer-chapter-modal-empty">该信息点当前暂无最终展示数据。</p>'}
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function customerChapterWecomRecordKind(record = {}) {
  const kind = String(record.messageKind || '').trim();
  if (['图片', '语音', '视频', '链接', '文件', '其他'].includes(kind)) return kind;
  const msgType = String(record.msgType || '').toLowerCase();
  if (['link', 'weapp'].includes(msgType)) return '链接';
  if (msgType === 'image') return '图片';
  if (msgType === 'voice') return '语音';
  if (msgType === 'video') return '视频';
  if (msgType === 'file') return '文件';
  if (msgType && msgType !== 'text') return '其他';
  return '文本';
}

function renderCustomerChapterWecomRecordContent(record) {
  const kind = customerChapterWecomRecordKind(record);
  const content = formatMdDisplayText(record.content || '');
  const assetUrl = String(record.assetUrl || '').trim();
  const assetProxyUrl = String(record.assetProxyUrl || '').trim();
  const displayAssetUrl = assetProxyUrl || assetUrl;
  if (kind === '图片') {
    return `
      <div class="customer-chapter-wecom-media">
        ${displayAssetUrl ? `<img src="${escapeHtml(displayAssetUrl)}" alt="企微图片" loading="lazy" data-wecom-image>` : ''}
        <div class="customer-chapter-wecom-image-error" data-wecom-image-error>
          图片未能显示：OSS 原链接已过期，需要本地后端重新签名配置。
        </div>
        <p>${escapeHtml(content || '[图片]')}</p>
        ${displayAssetUrl ? `<a class="customer-chapter-wecom-link" href="${escapeHtml(displayAssetUrl)}" target="_blank" rel="noreferrer">打开原图</a>` : ''}
      </div>
    `;
  }
  if (displayAssetUrl) {
    return `
      <p>${escapeHtml(content || `[${kind}]`)}</p>
      <a class="customer-chapter-wecom-link" href="${escapeHtml(displayAssetUrl)}" target="_blank" rel="noreferrer">查看${escapeHtml(kind)}素材</a>
    `;
  }
  return `<p>${escapeHtml(content || `[${kind}]`)}</p>`;
}

function renderCustomerChapterWecomRecord(record) {
  const kind = customerChapterWecomRecordKind(record);
  const searchText = [
    record.sourceType,
    record.groupName,
    record.sender,
    record.messageTime,
    record.content,
    record.msgType,
  ].filter(Boolean).join(' ');
  const searchAttr = String(searchText || '').slice(0, 800);
  return `
    <article
      class="customer-chapter-wecom-record ${record.isCustomerMessage === '是' ? 'is-customer' : ''}"
      data-wecom-record
      data-wecom-kind="${escapeHtml(kind)}"
      data-wecom-search="${escapeHtml(searchAttr)}"
    >
      <div class="customer-chapter-wecom-avatar">${escapeHtml((record.sender || '企').slice(0, 1))}</div>
      <div class="customer-chapter-wecom-main">
        <header>
          <div>
            <strong>${escapeHtml(record.sender || '未知发送人')}</strong>
            <span>${escapeHtml(kind)}</span>
            ${record.groupName ? `<span>${escapeHtml(record.groupName)}</span>` : ''}
          </div>
          <time>${escapeHtml(record.messageTime || '')}</time>
        </header>
        ${renderCustomerChapterWecomRecordContent(record)}
        <footer>
          <span>${escapeHtml(record.sourceType || (record.groupName ? '群消息' : '私信'))}</span>
          ${record.sourcePk ? `<span>${escapeHtml(record.sourceTable || 'wecom')}#${escapeHtml(record.sourcePk)}</span>` : ''}
        </footer>
      </div>
    </article>
  `;
}

function renderCustomerChapterWecomChatRecords(section) {
  const chat = section?.infoBlockPilot?.wecomChatRecords || {};
  const records = safeArray(chat.records);
  const sessions = safeArray(chat.sessions);
  const source = section?.infoBlockPilot?.wecomSource || {};
  if (!records.length) return '';
  const initialRenderCount = Math.min(records.length, 40);
  const initialRecords = records.slice(0, initialRenderCount);
  const renderJobId = `wecom-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  state.customerChapterWecomRenderJob = {
    id: renderJobId,
    records,
    nextIndex: initialRenderCount,
    total: records.length,
  };
  const kindCounts = records.reduce((acc, record) => {
    const kind = customerChapterWecomRecordKind(record);
    acc[kind] = (acc[kind] || 0) + 1;
    return acc;
  }, {});
  const filters = ['全部', '文本', '语音', '图片', '视频', '链接', '文件', '其他'];
  return `
    <section class="customer-chapter-wecom-chat">
      <div class="customer-chapter-wecom-toolbar">
        <input type="search" data-wecom-chat-search placeholder="关键词">
        <button type="button" data-wecom-chat-search-action>搜索</button>
      </div>
      <div class="customer-chapter-wecom-tabs" role="tablist">
        ${filters.map((filter) => `
          <button
            type="button"
            class="${filter === '全部' ? 'is-active' : ''}"
            data-wecom-chat-filter="${escapeHtml(filter)}"
          >${escapeHtml(filter)}</button>
        `).join('')}
      </div>
      <div class="customer-chapter-wecom-source">
        <span>私信 ${formatNumber(source.privateMessages || records.filter((record) => !record.groupName).length)} 条</span>
        <span>群聊 ${formatNumber(source.groupMessages || records.filter((record) => record.groupName).length)} 条</span>
        <span>图片/素材 ${formatNumber(source.assetMessages || records.filter((record) => customerChapterWecomRecordKind(record) !== '文本').length)} 条</span>
        <span>会话 ${formatNumber(sessions.length)} 个</span>
      </div>
      ${sessions.length ? `
        <div class="customer-chapter-wecom-sessions">
          ${sessions.map((session) => `
            <span>${escapeHtml(session.groupName || '私信')} · ${formatNumber(session.recordCount)} 条</span>
          `).join('')}
        </div>
      ` : ''}
      <div class="customer-chapter-wecom-count" data-wecom-chat-count>
        全部 ${formatNumber(records.length)} 条
        ${Object.entries(kindCounts).map(([kind, count]) => ` · ${escapeHtml(kind)} ${formatNumber(count)} 条`).join('')}
      </div>
      <div class="customer-chapter-wecom-list" data-wecom-chat-list data-wecom-job="${escapeHtml(renderJobId)}">
        ${initialRecords.map(renderCustomerChapterWecomRecord).join('')}
      </div>
      ${records.length > initialRenderCount ? `
        <div class="customer-chapter-wecom-progress" data-wecom-chat-progress>
          <span>已显示 ${formatNumber(initialRenderCount)}/${formatNumber(records.length)} 条</span>
          <button type="button" data-wecom-load-more>继续加载 40 条</button>
        </div>
      ` : ''}
    </section>
  `;
}

function bindCustomerChapterWecomImages(container) {
  container.querySelectorAll('[data-wecom-image]:not([data-wecom-image-bound])').forEach((image) => {
    image.dataset.wecomImageBound = '1';
    const media = image.closest('.customer-chapter-wecom-media');
    image.addEventListener('load', () => {
      media?.classList.add('is-image-loaded');
      media?.classList.remove('is-image-error');
    });
    image.addEventListener('error', () => {
      media?.classList.add('is-image-error');
      media?.classList.remove('is-image-loaded');
    });
  });
}

function continueCustomerChapterWecomRender(modal, applyFilters) {
  const job = state.customerChapterWecomRenderJob;
  const list = modal.querySelector('[data-wecom-chat-list]');
  if (!job || !list || list.dataset.wecomJob !== job.id) return;
  if (job.nextIndex >= job.total) {
    const progress = modal.querySelector('[data-wecom-chat-progress]');
    if (progress) progress.textContent = `已显示 ${formatNumber(job.total)}/${formatNumber(job.total)} 条`;
    return;
  }
  const batchSize = 40;
  const from = job.nextIndex;
  const to = Math.min(job.total, from + batchSize);
  list.insertAdjacentHTML('beforeend', job.records.slice(from, to).map(renderCustomerChapterWecomRecord).join(''));
  job.nextIndex = to;
  bindCustomerChapterWecomImages(list);
  if (typeof applyFilters === 'function') applyFilters();
  const progress = modal.querySelector('[data-wecom-chat-progress]');
  if (progress) {
    progress.innerHTML = job.nextIndex >= job.total
      ? `<span>已显示 ${formatNumber(job.total)}/${formatNumber(job.total)} 条</span>`
      : `<span>已显示 ${formatNumber(job.nextIndex)}/${formatNumber(job.total)} 条</span><button type="button" data-wecom-load-more>继续加载 40 条</button>`;
    progress.querySelector('[data-wecom-load-more]')?.addEventListener('click', () => continueCustomerChapterWecomRender(modal, applyFilters));
  }
}

function bindCustomerChapterWecomChatModal(modal) {
  bindCustomerChapterWecomImages(modal);
  const input = modal.querySelector('[data-wecom-chat-search]');
  const count = modal.querySelector('[data-wecom-chat-count]');
  const filters = Array.from(modal.querySelectorAll('[data-wecom-chat-filter]'));
  let activeFilter = '全部';
  const apply = () => {
    const records = Array.from(modal.querySelectorAll('[data-wecom-record]'));
    const keyword = String(input?.value || '').trim().toLowerCase();
    let visibleCount = 0;
    records.forEach((record) => {
      const kind = record.getAttribute('data-wecom-kind') || '文本';
      const search = String(record.getAttribute('data-wecom-search') || '').toLowerCase();
      const visible = (activeFilter === '全部' || kind === activeFilter) && (!keyword || search.includes(keyword));
      record.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (count) count.textContent = `${activeFilter} ${formatNumber(visibleCount)} 条`;
  };
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.getAttribute('data-wecom-chat-filter') || '全部';
      filters.forEach((item) => item.classList.toggle('is-active', item === button));
      apply();
    });
  });
  modal.querySelector('[data-wecom-chat-search-action]')?.addEventListener('click', apply);
  input?.addEventListener('input', apply);
  modal.querySelector('[data-wecom-load-more]')?.addEventListener('click', () => continueCustomerChapterWecomRender(modal, apply));
}

function renderCustomerChapterMedicalRecordValue(value, options = {}) {
  const items = Array.isArray(value) ? value.filter(Boolean) : [];
  const text = items.length
    ? items.map((item, index) => `${index + 1}.${item}`).join('\n')
    : String(value || '').trim();
  if (text) return escapeHtml(text);
  return `<span class="customer-chapter-medical-placeholder">${escapeHtml(options.placeholder || '')}</span>`;
}

function renderCustomerChapterMedicalRecordField(label, value, options = {}) {
  const multiline = options.multiline !== false;
  return `
    <label class="customer-chapter-medical-field ${options.wide ? 'is-wide' : ''} ${multiline ? 'is-multiline' : ''}">
      <span>${escapeHtml(label)}</span>
      <p>${renderCustomerChapterMedicalRecordValue(value, options)}</p>
    </label>
  `;
}

function customerChapterMedicalRecordLabel(record = {}, index = 0) {
  return record.label
    || [record.recordNo || `病历${index + 1}`, record.visitTime || record.emrDate || '', record.doctorName || ''].filter(Boolean).join(' · ')
    || `病历${index + 1}`;
}

function renderCustomerChapterMedicalRecordPanel(record = {}, index = 0, active = false) {
  const visitType = record.visitType || '初诊';
  return `
    <section class="customer-chapter-medical-record" data-medical-record-panel="${index}" ${active ? '' : 'hidden'} aria-label="${escapeHtml(customerChapterMedicalRecordLabel(record, index))}">
      <div class="customer-chapter-medical-topbar">
        <label class="customer-chapter-medical-inline">
          <span>病历编号:</span>
          <b>${escapeHtml(record.recordNo || '未填写')}</b>
        </label>
        <div class="customer-chapter-medical-visit-type" aria-label="初复诊">
          <span class="${visitType === '初诊' ? 'is-active' : ''}">初诊</span>
          <span class="${visitType === '复诊' ? 'is-active' : ''}">复诊</span>
        </div>
        <span class="customer-chapter-medical-check ${record.checked ? 'is-checked' : ''}">${record.checked ? '已核' : '未核'}</span>
        <div class="customer-chapter-medical-select">
          <span>请选择病历模板</span>
        </div>
      </div>
      <div class="customer-chapter-medical-meta">
        <label>
          <span>就诊时间</span>
          <p>${escapeHtml(record.visitTime || record.emrDate || record.visitId || '未填写')}</p>
        </label>
        <label>
          <span>疾病病种 ICD 码</span>
          <p>${escapeHtml(record.diseaseIcdCode || '未填写')}</p>
        </label>
        ${record.doctorName ? `
          <label>
            <span>医生</span>
            <p>${escapeHtml(record.doctorName)}</p>
          </label>
        ` : ''}
      </div>
      <div class="customer-chapter-medical-fields">
        ${renderCustomerChapterMedicalRecordField('药物过敏史', record.drugAllergy, { multiline: false })}
        ${renderCustomerChapterMedicalRecordField('主诉', record.chiefComplaint)}
        ${renderCustomerChapterMedicalRecordField('现病史', record.currentMedicalHistory)}
        ${renderCustomerChapterMedicalRecordField('既往史', record.pastHistory)}
        ${renderCustomerChapterMedicalRecordField('专科检查', record.specialistExam)}
        ${renderCustomerChapterMedicalRecordField('辅助检查', record.auxiliaryExam)}
        ${renderCustomerChapterMedicalRecordField('诊断', record.diagnosis)}
        ${renderCustomerChapterMedicalRecordField('计划', record.plan)}
        ${renderCustomerChapterMedicalRecordField('处理', record.treatment)}
        ${renderCustomerChapterMedicalRecordField('处方/医嘱', record.prescription, { placeholder: '' })}
        ${renderCustomerChapterMedicalRecordField('知情同意/签字照片', record.consentAndSignature, { placeholder: '' })}
        ${renderCustomerChapterMedicalRecordField('备注', record.remark, { placeholder: '' })}
        ${renderCustomerChapterMedicalRecordField('客户资料', record.customerMaterial, { placeholder: '手动输入，用于咨询师参考' })}
      </div>
    </section>
  `;
}

function renderCustomerChapterMedicalRecordTabs(records = []) {
  if (records.length <= 1) return '';
  return `
    <div class="customer-chapter-medical-tabs" role="tablist" aria-label="病例列表">
      ${records.map((record, index) => `
        <button type="button" class="${index === 0 ? 'is-active' : ''}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}" data-medical-record-tab="${index}">
          <span>${escapeHtml(String(index + 1).padStart(2, '0'))}</span>
          <b>${escapeHtml(customerChapterMedicalRecordLabel(record, index))}</b>
        </button>
      `).join('')}
    </div>
  `;
}

function renderCustomerChapterMedicalRecordForm(section) {
  const records = safeArray(section?.infoBlockPilot?.medicalRecords).filter((record) => record && Object.keys(record).length);
  const fallbackRecord = section?.infoBlockPilot?.medicalRecord || {};
  const displayRecords = records.length ? records : (Object.keys(fallbackRecord).length ? [fallbackRecord] : []);
  if (!displayRecords.length) return '';
  return `
    <div class="customer-chapter-medical-records">
      ${renderCustomerChapterMedicalRecordTabs(displayRecords)}
      <div data-medical-record-panels>
        ${renderCustomerChapterMedicalRecordPanel(displayRecords[0], 0, true)}
      </div>
    </div>
  `;
}

function bindCustomerChapterMedicalRecordModal(modal) {
  if (!modal) return;
  const tabs = Array.from(modal.querySelectorAll('[data-medical-record-tab]'));
  const panelHost = modal.querySelector('[data-medical-record-panels]');
  const records = safeArray(modal.__customerMedicalRecords);
  if (tabs.length <= 1 || !panelHost || !records.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetIndex = Number(tab.dataset.medicalRecordTab || 0);
      tabs.forEach((item) => {
        const active = Number(item.dataset.medicalRecordTab || 0) === targetIndex;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panelHost.innerHTML = renderCustomerChapterMedicalRecordPanel(records[targetIndex] || {}, targetIndex, true);
    });
  });
}

function renderCustomerChapterModalBody(fixture, section, sectionIndex, disputes = [], sectionIssues = []) {
  const pilotMode = section?.infoBlockPilot?.mode || '';
  if (pilotMode === 'timeline_only') {
    return renderCustomerArchiveTimelineOnlyModalBody(fixture, section);
  }
  if (pilotMode === 'deferred_empty' || pilotMode === 'paused_empty') {
    return `
      <section class="customer-chapter-modal-note">
        <strong>暂时搁置</strong>
        <p>${escapeHtml(section.infoBlockPilot?.emptyReason || '本信息块已暂时搁置，当前不展示子信息点。')}</p>
      </section>
    `;
  }
  if (pilotMode === 'archive_final_display') {
    return renderCustomerChapterFinalDisplay(section)
      || '<p class="customer-chapter-modal-empty">当前没有可展示的新版信息点数据。</p>';
  }
  if (pilotMode === 'wecom_chat_records') {
    return renderCustomerChapterWecomChatRecords(section)
      || '<p class="customer-chapter-modal-empty">当前没有可展示的企微聊天记录。</p>';
  }
  if (pilotMode === 'consultation_from_section_05') {
    const consultationRecord = section?.infoBlockPilot?.consultationRecord;
    const groups = renderCustomerChapterGroups(section, sectionIndex, disputes, sectionIssues);
    return `
      ${consultationRecord ? renderCustomerChapterConsultationRecord(consultationRecord) : ''}
      ${groups || '<p class="customer-chapter-modal-empty">当前没有可展示的子信息点。</p>'}
    `;
  }
  if (pilotMode === 'material_outbound_sheet') {
    return renderCustomerChapterMaterialOutbound(section)
      || '<p class="customer-chapter-modal-empty">当前没有可展示的物料出库明细。</p>';
  }
  if (pilotMode === 'wide_table') {
    return renderCustomerChapterPilotTable(section)
      || '<p class="customer-chapter-modal-empty">当前没有可展示的表格数据。</p>';
  }
  if (pilotMode === 'medical_record_form') {
    return renderCustomerChapterMedicalRecordForm(section)
      || '<p class="customer-chapter-modal-empty">当前没有可展示的完整病例。</p>';
  }
  const consultationRecord = section?.infoBlockPilot?.consultationRecord;
  const groups = renderCustomerChapterGroups(section, sectionIndex, disputes, sectionIssues);
  return `
    ${consultationRecord ? renderCustomerChapterConsultationRecord(consultationRecord) : ''}
    ${groups || '<p class="customer-chapter-modal-empty">当前没有可展示的子信息点。</p>'}
  `;
}

function closeCustomerChapterModal() {
  state.customerChapterWecomRenderJob = null;
  document.querySelector('.customer-chapter-modal')?.remove();
}

function bindCustomerChapterModalInteractions(modal, pilotMode) {
  if (!modal) return;
  if (modal.dataset.customerChapterModalBound === '1') return;
  modal.dataset.customerChapterModalBound = '1';
  modal.querySelector('[data-customer-chapter-modal-close]')?.addEventListener('click', closeCustomerChapterModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeCustomerChapterModal();
  });
  if (pilotMode === 'wecom_chat_records') bindCustomerChapterWecomChatModal(modal);
  if (pilotMode === 'medical_record_form') bindCustomerChapterMedicalRecordModal(modal);
}

function openCustomerChapterModal(fixture, sectionIndex, pointId = '') {
  const sections = getCustomerProfileSections(fixture);
  const section = sections[sectionIndex];
  if (!section) return;
  const customer = fixture?.customer || {};
  const customerId = customer.unifiedCustomerId || '';
  const disputes = activeAdvisorArchiveDisputesForCustomer(customerId);
  const priority = getCustomerReviewPriority(fixture);
  const sectionDisputes = disputes.filter((dispute) => (
    (section.rows || []).some((row) => advisorArchiveDisputeMatchesRow(dispute, section, row))
  ));
  const sectionIssues = customerReviewIssuesForSection(priority, section);
  const sectionNo = customerChapterSectionNo(section, sectionIndex);
  const rowCount = safeArray(section.rows).length;
  const modalTitle = displayMdChapterTitle(section.cleanTitle || section.title || `第 ${sectionNo} 信息块`);
  const pilotMode = section?.infoBlockPilot?.mode || '';
  const finalDisplay = section?.infoBlockPilot?.finalDisplay || {};
  const wecomRecords = section?.infoBlockPilot?.wecomChatRecords || {};
  const medicalRecords = safeArray(section?.infoBlockPilot?.medicalRecords);
  let modalHint = `${formatNumber(rowCount)} 个子信息点 · 横屏弹窗核验`;
  if (pilotMode === 'medical_record_form') {
    const medicalRecordCount = medicalRecords.length || (section?.infoBlockPilot?.medicalRecord ? 1 : 0);
    modalHint = `${formatNumber(medicalRecordCount)} 份完整病例 · 横屏弹窗核验`;
  } else if (pilotMode === 'archive_final_display') {
    modalHint = `${formatNumber(safeArray(finalDisplay.points).length)} 个新版信息点 · ${formatNumber(safeArray(finalDisplay.rows).length)} 条详细数据 · 横屏弹窗核验`;
  } else if (pilotMode === 'wecom_chat_records') {
    modalHint = `${formatNumber(safeArray(wecomRecords.records).length)} 条企微聊天记录 · 横屏弹窗核验`;
  } else if (pilotMode === 'material_outbound_sheet') {
    modalHint = `${formatNumber(safeArray(section?.infoBlockPilot?.materialOutbound?.sheets).length)} 张提货申请单 · 横屏弹窗核验`;
  } else if (pilotMode === 'wide_table') {
    modalHint = `${formatNumber(safeArray(section?.infoBlockPilot?.table?.columns).length)} 列表格 · 横屏弹窗核验`;
  } else if (pilotMode === 'consultation_from_section_05') {
    modalHint = '咨询记录 · 朱冰冰样板弹窗核验';
  }
  const wideDetailModes = new Set(['wide_table', 'archive_final_display', 'wecom_chat_records', 'consultation_from_section_05', 'medical_record_form']);
  state.customerChapterWecomRenderJob = null;
  document.querySelector('.customer-chapter-modal')?.remove();
  const modalDialogClass = `customer-chapter-modal-dialog${wideDetailModes.has(pilotMode) ? ' is-wide-table' : ''}`;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="customer-chapter-modal" role="dialog" aria-modal="true" aria-labelledby="customer-chapter-modal-title">
      <div class="${modalDialogClass}">
        <div class="customer-chapter-modal-head">
          <div>
            <span>${String(sectionNo).padStart(2, '0')} · ${escapeHtml(customer.name || customer.customerNameMasked || '未命名顾客')}</span>
            <strong id="customer-chapter-modal-title">${escapeHtml(modalTitle)}</strong>
            <small>${escapeHtml(modalHint)}</small>
          </div>
          <button type="button" class="customer-chapter-modal-close" data-customer-chapter-modal-close aria-label="关闭">关闭</button>
        </div>
        <div class="customer-chapter-modal-summary" data-customer-chapter-modal-summary>
          <p>正在展开 ${escapeHtml(modalTitle)}...</p>
        </div>
        <div class="customer-chapter-modal-body" data-customer-chapter-modal-body>
          <p class="customer-chapter-modal-empty">正在加载详情，请稍候。</p>
        </div>
      </div>
    </div>
  `);
  const modal = document.querySelector('.customer-chapter-modal');
  bindCustomerChapterModalInteractions(modal, pilotMode);
  window.requestAnimationFrame(() => {
    const activeModal = document.querySelector('.customer-chapter-modal');
    if (!activeModal) return;
    try {
      const summaryEl = activeModal.querySelector('[data-customer-chapter-modal-summary]');
      const bodyEl = activeModal.querySelector('[data-customer-chapter-modal-body]');
      if (summaryEl) summaryEl.innerHTML = `<p>${renderCustomerHighlightedSummary(buildCustomerChapterSummaryText(section))}</p>`;
      if (bodyEl) bodyEl.innerHTML = renderCustomerChapterModalBody(fixture, section, sectionIndex, sectionDisputes, sectionIssues);
      if (pilotMode === 'medical_record_form') {
        const records = safeArray(section?.infoBlockPilot?.medicalRecords).filter((record) => record && Object.keys(record).length);
        const fallbackRecord = section?.infoBlockPilot?.medicalRecord || {};
        activeModal.__customerMedicalRecords = records.length ? records : (Object.keys(fallbackRecord).length ? [fallbackRecord] : []);
      }
      if (pilotMode === 'wecom_chat_records') bindCustomerChapterWecomChatModal(activeModal);
      if (pilotMode === 'medical_record_form') bindCustomerChapterMedicalRecordModal(activeModal);
      if (pointId) {
        const target = activeModal.querySelector(`[data-archive-point-ref="${CSS.escape(pointId)}"]`) || activeModal.querySelector('.customer-chapter-row, .archive-block-summary');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.classList.add('is-archive-ref-highlighted');
          window.setTimeout(() => target.classList.remove('is-archive-ref-highlighted'), 2000);
        }
      }
    } catch (error) {
      console.error('customer chapter modal render failed', error);
      const bodyEl = activeModal.querySelector('[data-customer-chapter-modal-body]');
      if (bodyEl) {
        bodyEl.innerHTML = `<p class="customer-chapter-modal-empty">详情渲染失败：${escapeHtml(error.message || '未知错误')}</p>`;
      }
      showFloatingError(`信息块详情打开失败：${error.message || '未知错误'}`);
    }
  });
}

function renderCustomerChapterRow(section, row, sectionIndex, rowIndex, disputes = [], sectionIssues = []) {
  const type = mdRowEvidenceType(row);
  const config = mdEvidenceTypeConfig(type);
  const dispute = advisorArchiveDisputeForRow(disputes, section, row);
  const pointRef = row.requirementId || row.requirement_id || row.pointId || row.infoPointId || '';
  const lightIssueTags = ['missing', 'pending'].includes(type) ? renderCustomerReviewIssueTags(sectionIssues) : '';
  return `
    <article class="customer-chapter-row ${config.className} ${lightIssueTags ? 'has-light-cause-tag' : ''} ${dispute ? 'is-advisor-disputed challenge-flagged' : ''}" ${pointRef ? `data-archive-point-ref="${escapeHtml(pointRef)}"` : ''}>
      <div class="customer-chapter-row-title">
        <span class="status-chip ${dispute ? 'is-advisor-disputed' : config.className}">${escapeHtml(dispute ? '顾问质疑' : config.label)}</span>
        <strong>${escapeHtml(row.title || '未命名标题')}</strong>
        ${renderMdEvidenceButton(section, row, sectionIndex, rowIndex, 'customers', { force: true })}
      </div>
      ${lightIssueTags}
      <p>${escapeHtml(formatMdDisplayText(row.value || '未填写'))}</p>
      ${renderAdvisorArchiveDisputeInline(dispute)}
    </article>
  `;
}

function renderCustomerChapterGroups(section, sectionIndex, disputes = [], sectionIssues = []) {
  const rows = (section.rows || []).map((row, rowIndex) => ({
    row,
    rowIndex,
    type: mdRowEvidenceType(row),
  }));
  return CUSTOMER_EVIDENCE_TYPES.map((typeConfig) => {
    const typedRows = rows.filter((item) => item.type === typeConfig.key);
    if (!typedRows.length) return '';
    return `
      <div class="customer-chapter-group ${typeConfig.className}">
        <div class="customer-chapter-group-head">
          <strong>${escapeHtml(typeConfig.label)}</strong>
          <span>${formatNumber(typedRows.length)} 项</span>
        </div>
        <div class="customer-chapter-rows">
          ${typedRows.map(({ row, rowIndex }) => renderCustomerChapterRow(section, row, sectionIndex, rowIndex, disputes, sectionIssues)).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderCustomerChapterMenu(fixture) {
  const customerId = fixture?.customer?.unifiedCustomerId || '';
  const disputes = activeAdvisorArchiveDisputesForCustomer(customerId);
  const priority = getCustomerReviewPriority(fixture);
  const sections = getCustomerProfileSections(fixture);
  const totalRows = sections.reduce((sum, section) => sum + (section.rows || []).length, 0);
  return `
    <section class="customer-chapter-workbench">
      <div class="customer-strip-head">
        <strong>${formatNumber(sections.length)} 个用户特征信息块</strong>
        <span>${formatNumber(sections.length)} 个汇总信息块 · ${formatNumber(totalRows)} 个子信息点 · 点击打开横屏弹窗</span>
      </div>
      <div class="customer-chapter-card-grid">
        ${sections.map((section, sectionIndex) => {
          const summary = buildCustomerChapterSummaryText(section);
          const aiSummaryBadge = renderCustomerChapterAiSummaryBadge(section);
          const p3Block = archiveBlockSummaryForSection(fixture, sectionIndex);
          const sectionDisputes = disputes.filter((dispute) => (
            (section.rows || []).some((row) => advisorArchiveDisputeMatchesRow(dispute, section, row))
          ));
          const sectionIssues = customerReviewIssuesForSection(priority, section);
          const sectionIssueTags = renderCustomerReviewIssueTags(sectionIssues);
          return `
            <button type="button" class="customer-chapter-card ${sectionIssueTags ? 'has-light-cause-tag' : ''} ${sectionDisputes.length ? 'is-advisor-disputed challenge-flagged' : ''}" data-customer-chapter-open="${sectionIndex}">
              <span class="customer-chapter-index">${String(sectionIndex + 1).padStart(2, '0')}</span>
              <div class="customer-chapter-card-content">
                <strong>${escapeHtml(displayMdChapterTitle(section.cleanTitle || section.title))}</strong>
                ${aiSummaryBadge}
                ${sectionIssueTags}
                <p>${renderCustomerHighlightedSummary(summary)}</p>
                ${renderArchiveBlockSummary(p3Block)}
                ${sectionDisputes.length ? `<small class="advisor-archive-dispute-count">顾问质疑 ${formatNumber(sectionDisputes.length)} 项，需修改档案</small>` : ''}
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function customerArchiveEditField(label, name, value, options = {}) {
  const multiline = options.multiline;
  return `
    <label class="customer-archive-edit-field ${multiline ? 'is-wide' : ''}">
      <span>${escapeHtml(label)}</span>
      ${multiline
        ? `<textarea name="${escapeHtml(name)}" rows="${options.rows || 4}">${escapeHtml(value || '')}</textarea>`
        : `<input name="${escapeHtml(name)}" value="${escapeHtml(value || '')}" />`}
    </label>
  `;
}

function openCustomerArchiveEditModal(fixture) {
  const customer = fixture.customer || {};
  const customerId = customer.unifiedCustomerId || '';
  if (!customerId) return;
  document.querySelector('.customer-archive-edit-modal')?.remove();
  const spendingItems = normalizeArchiveSpendingVerification(fixture).items || [];
  const sections = getCustomerProfileSections(fixture);
  document.body.insertAdjacentHTML('beforeend', `
    <div class="customer-archive-edit-modal" role="dialog" aria-modal="true">
      <form class="customer-archive-edit-dialog" data-customer-id="${escapeHtml(customerId)}">
        <div class="customer-archive-edit-head">
          <div>
            <strong>修改档案</strong>
            <span>${escapeHtml(customer.name || customer.customerNameMasked || customerId)} · 保存到本地检查台覆盖层</span>
          </div>
          <button type="button" class="customer-archive-edit-close" aria-label="关闭">关闭</button>
        </div>
        <div class="customer-archive-edit-body">
          <section class="customer-archive-edit-section">
            <h4>顶部信息</h4>
            <div class="customer-archive-edit-grid">
              ${customerArchiveEditField('姓名', 'customer.name', customer.name || '')}
              ${customerArchiveEditField('脱敏电话', 'customer.phoneMasked', customer.phoneMasked || '')}
              ${customerArchiveEditField('门店', 'customer.clinicName', customer.clinicName || '')}
              ${customerArchiveEditField('医生', 'customer.doctorName', customer.doctorName || '')}
              ${customerArchiveEditField('年龄', 'customer.ageText', customer.ageText || '')}
              ${customerArchiveEditField('性别', 'customer.genderText', normalizeCustomerGenderText(customer) || '')}
              ${customerArchiveEditField('RFM', 'customer.rfmGrade', customer.rfmGrade || '')}
              ${customerArchiveEditField('等级', 'customer.memberLevel', customer.memberLevel || '')}
              ${customerArchiveEditField('来源渠道', 'customer.sourceChannel', customer.sourceChannel || '')}
              ${customerArchiveEditField('初诊结果', 'customer.firstDiagnosisSummary', customer.firstDiagnosisSummary || '', { multiline: true, rows: 3 })}
            </div>
          </section>
          <section class="customer-archive-edit-section">
            <h4>消费情况</h4>
            <div class="customer-archive-edit-grid">
              ${spendingItems.map((item) => customerArchiveEditField(item.label, `spending.${item.key}`, item.value || '')).join('')}
            </div>
          </section>
          <section class="customer-archive-edit-section">
            <h4>19 个信息块总结</h4>
            <div class="customer-archive-edit-summary-list">
              ${sections.map((section, index) => {
                const order = String(section.summaryTag?.order || index + 1);
                return customerArchiveEditField(
                  `${String(index + 1).padStart(2, '0')} ${displayMdChapterTitle(section.cleanTitle || section.title)}`,
                  `section.${order}`,
                  buildCustomerChapterSummaryText(section),
                  { multiline: true, rows: 4 },
                );
              }).join('')}
            </div>
          </section>
        </div>
        <div class="customer-archive-edit-footer">
          <span class="customer-archive-edit-status">不会写入远端源库；只覆盖本地检查台显示。</span>
          <div>
            <button type="button" class="customer-archive-edit-cancel">取消</button>
            <button type="submit" class="customer-archive-edit-save">保存修改</button>
          </div>
        </div>
      </form>
    </div>
  `);
  const modal = document.querySelector('.customer-archive-edit-modal');
  modal.querySelector('.customer-archive-edit-close')?.addEventListener('click', () => modal.remove());
  modal.querySelector('.customer-archive-edit-cancel')?.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.remove();
  });
  modal.querySelector('form')?.addEventListener('submit', (event) => saveCustomerArchiveEdit(event, fixture, modal));
}

function readCustomerArchiveEditForm(form, fixture) {
  const customer = {};
  const spendingItems = (normalizeArchiveSpendingVerification(fixture).items || []).map((item) => ({
    ...item,
    value: form.elements[`spending.${item.key}`]?.value.trim() || '',
    status: '人工修改',
  }));
  ['name', 'phoneMasked', 'clinicName', 'doctorName', 'ageText', 'genderText', 'rfmGrade', 'memberLevel', 'sourceChannel', 'firstDiagnosisSummary'].forEach((key) => {
    const value = form.elements[`customer.${key}`]?.value.trim();
    if (value !== undefined) customer[key] = value || '';
  });
  const sectionSummaries = {};
  getCustomerProfileSections(fixture).forEach((section, index) => {
    const order = String(section.summaryTag?.order || index + 1);
    sectionSummaries[order] = form.elements[`section.${order}`]?.value.trim() || '';
  });
  return { customer, spendingItems, sectionSummaries };
}

async function saveCustomerArchiveEdit(event, fixture, modal) {
  event.preventDefault();
  const form = event.currentTarget;
  const customerId = form.dataset.customerId;
  const status = modal.querySelector('.customer-archive-edit-status');
  const saveButton = modal.querySelector('.customer-archive-edit-save');
  try {
    saveButton.disabled = true;
    status.textContent = '正在保存...';
    const resolvedFieldKeys = collectChangedArchiveDisputeFieldKeys(form, fixture);
    const patch = readCustomerArchiveEditForm(form, fixture);
    const result = await postApi(CUSTOMER_ARCHIVE_OVERRIDES_API, {
      customerId,
      patch,
      actor: 'customer_archive_editor_ui',
    });
    const localResolvedCount = resolveAdvisorArchiveDisputesForCustomer(customerId, resolvedFieldKeys);
    const resolvedCount = Math.max(localResolvedCount, Number(result.resolvedChallengeCount || 0));
    status.textContent = '已保存，正在刷新档案状态...';
    await refreshCustomerArchiveAfterSave(customerId, result.overrides || null);
    if (resolvedCount) console.info(`已修改档案并消除 ${resolvedCount} 条顾问质疑。`);
    modal.remove();
  } catch (error) {
    saveButton.disabled = false;
    status.textContent = `保存失败：${error.message}`;
  }
}

function renderChenSceneUserMdDetail(fixture) {
  const customer = fixture.customer || {};
  refreshAdvisorArchiveDisputesState();
  state.selectedCustomer = customer.unifiedCustomerId;
  state.mdEvidenceDetails.clear();
  $('#requirement-customer-input').value = customer.unifiedCustomerId || '';
  $('#customer-detail').innerHTML = `
    ${renderCustomerIdentityHeader(fixture)}
    ${renderAdvisorArchiveDisputeSummary(fixture)}
    ${renderCustomerSpendingVerification(fixture)}
    ${renderCustomerChapterMenu(fixture)}
  `;
  $('#customer-detail [data-customer-archive-edit]')?.addEventListener('click', () => openCustomerArchiveEditModal(fixture));
  $$('#customer-detail [data-customer-archive-timeline-open]').forEach((button) => {
    button.addEventListener('click', () => openCustomerArchiveTimelineModal(fixture, button.dataset.customerArchiveTimelineKind || ''));
  });
  $$('#customer-detail [data-customer-chapter-open]').forEach((button) => {
    button.addEventListener('click', () => {
      try {
        openCustomerChapterModal(fixture, Number(button.dataset.customerChapterOpen || 0));
      } catch (error) {
        console.error('customer chapter modal failed', error);
        showFloatingError(`信息块详情打开失败：${error.message || '未知错误'}`);
      }
    });
  });
  $$('.customer-button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.customer === customer.unifiedCustomerId);
  });
}

function renderDsV3Panorama(payload) {
  const fixtures = (Array.isArray(payload?.fixtures) && payload.fixtures.length
    ? payload.fixtures
    : [payload?.fixture || payload].filter(Boolean));
  const selectedRunId = state.dsV3SelectedRunId || payload?.selectedRunId || fixtures[0]?.meta?.runId || null;
  const fixture = fixtures.find((item) => item?.meta?.runId === selectedRunId) || fixtures[0] || {};
  state.dsV3SelectedRunId = fixture?.meta?.runId || selectedRunId;
  const customer = fixture.customer || {};
  const stats = fixture.completeness || {};
  const hasGenerated = Boolean(payload?.hasGeneratedResult || fixture.meta?.runId);
  const generatedCount = fixtures.filter((item) => item?.meta?.runId).length;
  const statusLabel = state.dsV3Busy
    ? '生成中'
    : hasGenerated
    ? `已生成 · ${fixture.meta?.validationStatus || '待校验'}`
    : '等待 DS 生成';
  const randomButton = $('#run-ds-v3-random');
  if (randomButton) {
    randomButton.disabled = state.dsV3Busy;
    randomButton.textContent = state.dsV3Busy ? '生成中...' : '任意拉取并生成 DS v3';
  }
  $('#ds-v3-list-summary').innerHTML = `
    <strong>${formatNumber(generatedCount || fixtures.length || 0)} 个 DS 全景档案</strong>
    <span>${escapeHtml(statusLabel)}；本页复用“用户全景档案”的 v3 五列结构，真值由 DS 生成结果填入。</span>
  `;
  $('#ds-v3-customer-list').innerHTML = fixtures.map((item) => {
    const itemCustomer = item.customer || {};
    const itemStats = item.completeness || {};
    const itemRunId = item.meta?.runId || itemCustomer.unifiedCustomerId || '';
    const isActive = itemRunId === state.dsV3SelectedRunId || itemCustomer.unifiedCustomerId === customer.unifiedCustomerId;
    return `
      <button class="customer-button scene-user-button ${isActive ? 'is-active' : ''}" data-ds-v3-run-id="${escapeHtml(itemRunId)}">
        <strong>${escapeHtml(itemCustomer.customerNameMasked || itemCustomer.name || '未命名客户')}</strong>
        <code>${escapeHtml(itemCustomer.unifiedCustomerId || '-')}</code>
        <span>${escapeHtml(itemCustomer.sceneName || '场景一')}</span>
        <div class="scene-user-metrics">
          <b>RFM ${escapeHtml(itemCustomer.rfmGrade || '-')}</b>
          <b>${escapeHtml(itemCustomer.memberLevel || '-')}</b>
          <b>正文 ${formatNumber(itemStats.primaryRowCount || itemStats.rowCount || 0)}</b>
          <b>待确认 ${formatNumber(itemStats.needsReviewRows || 0)}</b>
        </div>
      </button>
    `;
  }).join('');
  $$('#ds-v3-customer-list [data-ds-v3-run-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state.dsV3SelectedRunId = button.dataset.dsV3RunId;
      renderDsV3Panorama(state.dsV3Panorama || payload);
    });
  });
  renderDsV3PanoramaDetail(fixture, { hasGenerated });
}

function renderDsV3PanoramaDetail(fixture, { hasGenerated = false } = {}) {
  const customer = fixture.customer || {};
  const meta = fixture.meta || {};
  state.dsV3MdEvidenceDetails.clear();
  $('#ds-v3-detail').innerHTML = `
    <div class="user-file-head">
      <div>
        <p class="eyebrow">DEEPSEEK V3 SAME SPEC</p>
        <h3>${escapeHtml(customer.name || '陈喜生')}</h3>
        <code>${escapeHtml(customer.unifiedCustomerId || '')}</code>
      </div>
      <span class="status-chip ${hasGenerated ? 'is-complete' : 'is-pending'}">${escapeHtml(hasGenerated ? `DS 已生成 · ${meta.validationStatus || '待校验'}` : '等待 DS 生成')}</span>
    </div>
    <div class="detail-grid user-file-grid">
      <div class="detail-item"><span>场景标签</span><strong>${escapeHtml(customer.sceneName || '场景一')}</strong></div>
      <div class="detail-item"><span>会员/RFM</span><strong>${escapeHtml(`${customer.memberLevel || '-'} / RFM ${customer.rfmGrade || '-'}`)}</strong></div>
      <div class="detail-item"><span>顾问/医生</span><strong>${escapeHtml(`${customer.advisorName || '-'} / ${customer.doctorName || '-'}`)}</strong></div>
      <div class="detail-item"><span>门店</span><strong>${escapeHtml(customer.clinicName || '-')}</strong></div>
      <div class="detail-item"><span>HIS 源 ID</span><strong>${escapeHtml(customer.hisId || '-')}</strong></div>
      <div class="detail-item"><span>CRM OID</span><strong>${escapeHtml(customer.crmOid || '-')}</strong></div>
      <div class="detail-item"><span>初诊/末诊</span><strong>${escapeHtml(`${customer.firstVisitDate || '-'} / ${customer.lastVisitDate || '-'}`)}</strong></div>
      <div class="detail-item"><span>年龄</span><strong>${escapeHtml(customer.ageText || '-')}</strong></div>
    </div>
    <div class="user-file-notice">
      <strong>本页是 DS v3 生产流程结果页，界面复现“用户全景档案”。</strong>
      <span>${escapeHtml(meta.safetyBoundary || '等待 DS 生成后填入；不自动发送、不对客发布、不写远端库。')}</span>
      <span>run：${escapeHtml(meta.runId || '尚未生成')}；模板：${escapeHtml(meta.templateVersion || 'chen_xisheng_v3_20260625')}</span>
    </div>
    ${renderMdCompleteness(fixture)}
    ${renderMdSummaryTags(fixture)}
    ${renderMdSections(fixture, 'ds-v3')}
  `;
}

async function loadDsV3Panorama() {
  setDsOperationLog('#ds-v3-operation-log', 'DS v3：正在读取本地生成结果...', 'is-running');
  try {
    const payload = await api(`${DS_V3_PANORAMA_API}/status`);
    state.dsV3Panorama = payload;
    renderDsV3Panorama(payload);
    const count = (payload.fixtures || []).length || (payload.fixture ? 1 : 0);
    setDsOperationLog('#ds-v3-operation-log', `DS v3：读取完成 · ${formatNumber(count)} 个结果`, 'is-success');
  } catch (error) {
    $('#ds-v3-list-summary').innerHTML = '<strong>DS 全景档案读取失败</strong>';
    $('#ds-v3-customer-list').innerHTML = '';
    $('#ds-v3-detail').innerHTML = `<div class="empty">DS v3 结果读取失败：${escapeHtml(error.message)}</div>`;
    setDsOperationLog('#ds-v3-operation-log', `DS v3：读取失败 · ${error.message}`, 'is-error');
  }
}

async function runDsV3RandomPanorama() {
  if (state.dsV3Busy) return;
  state.dsV3Busy = true;
  renderDsV3Panorama(state.dsV3Panorama || { fixture: buildDsV3ClientPlaceholder(), hasGeneratedResult: false });
  const limit = Math.max(1, Math.min(Number($('#ds-v3-random-limit')?.value || 1), 10));
  setDsOperationLog('#ds-v3-operation-log', `DS v3：正在拉取并生成 ${formatNumber(limit)} 个新客户...`, 'is-running');
  try {
    const payload = await postApi(`${DS_V3_PANORAMA_API}/runs/random-source-candidates`, {
      actor: 'ds_panorama_random_button',
      limit,
    });
    state.dsV3SelectedRunId = payload.runs?.[0]?.fixture?.meta?.runId || state.dsV3SelectedRunId;
    await loadDsV3Panorama();
    setDsOperationLog(
      '#ds-v3-operation-log',
      `DS v3：完成 · 生成 ${formatNumber(payload.generatedCount || 0)}，跳过重复 ${formatNumber(payload.skippedDuplicateCount || 0)}${payload.exhaustedBeforeRequested ? '，候选已耗尽' : ''}`,
      payload.exhaustedBeforeRequested ? 'is-error' : 'is-success',
    );
  } catch (error) {
    showFloatingError(`DS v3 批量生成失败：${error.message}`);
    await loadDsV3Panorama();
    setDsOperationLog('#ds-v3-operation-log', `DS v3：生成失败 · ${error.message}`, 'is-error');
  } finally {
    state.dsV3Busy = false;
    const button = $('#run-ds-v3-random');
    if (button) {
      button.disabled = false;
      button.textContent = '任意拉取并生成 DS v3';
    }
  }
}

function normalizeDsProfileInfoText(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/[，。；、|]/g, '')
    .toLowerCase();
}

function collectDsProfileUserInfoItems(analysis) {
  const items = [];
  const push = (title, value, body, source) => {
    if (!title || (!value && !body)) return;
    items.push({
      title: String(title),
      value: String(value || body || ''),
      body: body && String(body) !== String(value || '') ? String(body) : '',
      source: source || '',
    });
  };
  (analysis.userInfoItems || []).forEach((item) => push(item.title || item.label, item.value, item.body, item.source));
  (analysis.blockerCards || []).forEach((card) => push(card.title, card.value, card.body, 'blockerCards'));
  (analysis.summaryMetrics || []).forEach((item) => push(item.label, item.value, '', 'summaryMetrics'));
  (analysis.priorityEvidence || []).forEach((item) => push(`${item.priority || '证据'} 证据链`, item.summary, '', 'priorityEvidence'));
  const safety = analysis.safetyBoundary || {};
  if (safety.internalOnly) push('当前允许', '仅内部画像分析，不可发送、发布或写入远端库。', '', 'safetyBoundary');

  const seenTitles = new Set();
  const seenValues = new Set();
  const deduped = [];
  items.forEach((item) => {
    const titleKey = normalizeDsProfileInfoText(item.title);
    const valueKey = normalizeDsProfileInfoText(item.value);
    if (!titleKey || seenTitles.has(titleKey) || (valueKey && seenValues.has(valueKey))) return;
    seenTitles.add(titleKey);
    if (valueKey) seenValues.add(valueKey);
    deduped.push(item);
  });
  return deduped;
}

function renderDsProfileAnalysis(payload) {
  const analyses = (Array.isArray(payload?.analyses) && payload.analyses.length
    ? payload.analyses
    : [payload?.analysis || payload].filter((item) => item?.runMeta?.runId));
  const selectedRunId = state.dsProfileSelectedRunId || payload?.selectedRunId || analyses[0]?.runMeta?.runId || null;
  const analysis = analyses.find((item) => item?.runMeta?.runId === selectedRunId) || analyses[0] || null;
  state.dsProfileSelectedRunId = analysis?.runMeta?.runId || selectedRunId;
  const hasGenerated = Boolean(payload?.hasGeneratedResult || analysis?.runMeta?.runId);
  const generatedCount = analyses.filter((item) => item?.runMeta?.runId).length;
  const statusLabel = state.dsProfileBusy
    ? '生成中'
    : hasGenerated
    ? `${formatNumber(generatedCount)} 个画像 · ${analysis.runMeta?.validationStatus || '待校验'}`
    : '等待 DS 生成';
  const batchButton = $('#open-ds-profile-batch');
  if (batchButton) {
    batchButton.disabled = state.dsProfileBusy || state.dsProfileBatchBusy;
    batchButton.textContent = (state.dsProfileBusy || state.dsProfileBatchBusy) ? '生成中...' : '选择客户生成/更新 DS 画像';
  }
  $('#ds-profile-status').textContent = statusLabel;
  $('#ds-profile-status').className = `status-chip ${hasGenerated ? 'is-complete' : 'is-pending'}`;
  const blockerEl = $('#ds-profile-blocker');
  const summaryEl = $('#ds-profile-summary');
  if (!hasGenerated) {
    blockerEl.hidden = false;
    summaryEl.hidden = false;
    $('#ds-profile-blocker').innerHTML = `
      <article>
        <span>基线</span>
        <strong>等待 DS 用户画像分析</strong>
        <p>先读取 Ds全景档案 latest，再由 DS LLM 基于同一套标题、证据链和思考方式生成内部画像分析。</p>
      </article>
      <article>
        <span>当前允许</span>
        <strong>内部画像生成</strong>
        <p>仅用于内部研判和人工复核，不提供触达或发布操作，不写远端库。</p>
      </article>
    `;
    $('#ds-profile-summary').innerHTML = '';
    $('#ds-profile-customer-list').innerHTML = '';
    $('#ds-profile-detail').innerHTML = '<div class="empty">点击“选择客户生成/更新 DS 画像”后，本页会展示 DS LLM 为已有 Ds全景档案客户生成的内部画像分析。</div>';
    return;
  }
  blockerEl.hidden = true;
  summaryEl.hidden = true;
  const customer = analysis.customer || {};
  $('#ds-profile-blocker').innerHTML = '';
  $('#ds-profile-summary').innerHTML = '';
  const listItem = analysis.customerListItem || {};
  const userInfoItems = collectDsProfileUserInfoItems(analysis);
  $('#ds-profile-customer-list').innerHTML = analyses.map((item) => {
    const itemCustomer = item.customer || {};
    const itemList = item.customerListItem || {};
    const itemTags = itemList.tags || [];
    const itemRunId = item.runMeta?.runId || itemCustomer.unifiedCustomerId || '';
    const itemSafety = item.safetyBoundary || {};
    const itemMethodologyVersion = item.runMeta?.methodologyVersionLabel || item.runMeta?.methodologyVersion || 'v1（版本化前）';
    return `
      <button class="ai-insight-customer-button ${itemRunId === state.dsProfileSelectedRunId ? 'is-active' : ''}" data-ds-profile-run-id="${escapeHtml(itemRunId)}">
        <span>${escapeHtml(itemList.title || itemCustomer.name || itemCustomer.customerNameMasked || '未命名客户')}</span>
        <strong>${escapeHtml(itemList.subtitle || itemCustomer.unifiedCustomerId || '')}</strong>
        <small>
          ${itemTags.slice(0, 4).map((tag) => `<b>${escapeHtml(tag)}</b>`).join('')}
          <b>${escapeHtml(item.runMeta?.validationStatus || '待校验')}</b>
          <b>方法论 ${escapeHtml(itemMethodologyVersion)}</b>
          <b>发送 ${itemSafety.automaticSendAllowed ? '允许' : '禁止'}</b>
        </small>
      </button>
    `;
  }).join('');
  $$('#ds-profile-customer-list [data-ds-profile-run-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state.dsProfileSelectedRunId = button.dataset.dsProfileRunId;
      renderDsProfileAnalysis(state.dsProfileAnalysis || payload);
    });
  });
  const header = analysis.detailHeader || {};
  const safety = analysis.safetyBoundary || {};
  const methodologyVersion = analysis.runMeta?.methodologyVersionLabel || analysis.runMeta?.methodologyVersion || 'v1（版本化前）';
  $('#ds-profile-detail').innerHTML = `
    <div class="ai-detail-head">
      <div>
        <span>${escapeHtml(header.eyebrow || `DS 用户画像分析 · ${analysis.runMeta?.runId || ''}`)}</span>
        <h3>${escapeHtml(header.title || `${customer.name || '陈喜生'}｜内部画像分析`)}</h3>
        <p>${escapeHtml(header.description || '由 DS LLM 基于 Ds全景档案证据包生成；仅用于内部分析和人工复核。')}</p>
      </div>
      <div class="ai-detail-badges">
        ${(header.badges || []).slice(0, 4).map((badge) => `<span class="status-chip is-complete">${escapeHtml(badge)}</span>`).join('')}
        <span class="status-chip is-pending">方法论 ${escapeHtml(methodologyVersion)}</span>
        <span class="status-chip ${safety.automaticSendAllowed ? 'is-missing' : 'is-complete'}">自动发送 ${safety.automaticSendAllowed ? '允许' : '禁止'}</span>
      </div>
    </div>
    <section class="ds-profile-user-info">
      <div class="panel-title">本用户信息</div>
      <div class="ai-detail-metrics ds-profile-user-info-grid">
        ${userInfoItems.map((item) => `
          <article>
            <span>${escapeHtml(item.title)}</span>
            <strong>${escapeHtml(item.value)}</strong>
            ${item.body ? `<p>${escapeHtml(item.body)}</p>` : ''}
          </article>
        `).join('')}
      </div>
    </section>
    <div class="ai-conclusion-grid">
      ${(analysis.conclusionCards || []).map((card) => renderAiConclusionCard({
        title: card.title,
        badge: card.badge,
        conclusion: card.conclusion,
        reasons: card.reasons || [],
        rawTitle: card.rawTitle || 'DS 内部画像结构',
        raw: {
          ...(card.raw || {}),
          referencedEvidenceIds: card.referencedEvidenceIds || [],
          runMeta: analysis.runMeta,
          safetyBoundary: safety,
        },
      })).join('')}
    </div>
  `;
}

async function loadDsProfileAnalysis() {
  setDsOperationLog('#ds-profile-operation-log', 'DS 画像：正在读取本地分析结果...', 'is-running');
  try {
    const payload = await api(`${DS_PROFILE_ANALYSIS_API}/status`);
    state.dsProfileAnalysis = payload;
    renderDsProfileAnalysis(payload);
    const count = (payload.analyses || []).length || (payload.analysis ? 1 : 0);
    setDsOperationLog('#ds-profile-operation-log', `DS 画像：读取完成 · ${formatNumber(count)} 个结果`, 'is-success');
  } catch (error) {
    $('#ds-profile-status').textContent = '读取失败';
    $('#ds-profile-status').className = 'status-chip is-missing';
    $('#ds-profile-detail').innerHTML = `<div class="empty">DS 用户画像分析读取失败：${escapeHtml(error.message)}</div>`;
    setDsOperationLog('#ds-profile-operation-log', `DS 画像：读取失败 · ${error.message}`, 'is-error');
  }
}

async function runDsProfileAnalysis() {
  if (state.dsProfileBusy) return;
  state.dsProfileBusy = true;
  renderDsProfileAnalysis(state.dsProfileAnalysis || { hasGeneratedResult: false });
  try {
    const payload = await postApi(`${DS_PROFILE_ANALYSIS_API}/runs/from-ds-v3-exports`, {
      actor: 'ds_profile_analysis_button',
      limit: 2,
    });
    state.dsProfileAnalysis = { ...payload, hasGeneratedResult: true };
    state.dsProfileSelectedRunId = payload.runs?.[0]?.analysis?.runMeta?.runId || payload.analyses?.[0]?.runMeta?.runId || state.dsProfileSelectedRunId;
    renderDsProfileAnalysis(state.dsProfileAnalysis);
  } catch (error) {
    showFloatingError(`DS 用户画像分析生成失败：${error.message}`);
    await loadDsProfileAnalysis();
  } finally {
    state.dsProfileBusy = false;
    const button = $('#open-ds-profile-batch');
    if (button) {
      button.disabled = false;
      button.textContent = '选择客户生成/更新 DS 画像';
    }
  }
}

function selectedDsProfileCandidateIds() {
  return $$('#ds-profile-candidate-list input[type="checkbox"]:checked')
    .map((input) => input.value)
    .filter(Boolean);
}

function renderDsProfileCandidateList(payload = {}) {
  const candidates = payload.candidates || [];
  state.dsProfileCandidates = candidates;
  const list = $('#ds-profile-candidate-list');
  if (!list) return;
  if (!candidates.length) {
    list.innerHTML = '<div class="empty">当前没有可选择的 Ds全景档案客户。</div>';
  } else {
    list.innerHTML = candidates.map((item) => `
      <label class="ds-batch-item ${item.hasProfileAnalysis ? 'is-existing' : ''}">
        <input type="checkbox" value="${escapeHtml(item.unifiedCustomerId || '')}" ${item.selectable ? '' : 'disabled'} />
        <span>
          <strong>${escapeHtml(item.customerName || item.customerNameMasked || '未命名客户')}</strong>
          <code>${escapeHtml(item.unifiedCustomerId || '-')}</code>
        </span>
        <em>${item.hasProfileAnalysis ? '已分析，可更新' : '未分析'}</em>
      </label>
    `).join('');
  }
  $('#ds-profile-batch-status').textContent = `可选 ${formatNumber(candidates.filter((item) => item.selectable).length)} 人；默认优先展示未分析客户。`;
}

async function loadDsProfileCandidates() {
  const includeExisting = $('#ds-profile-include-existing')?.checked ? '1' : '0';
  $('#ds-profile-batch-status').textContent = '正在读取候选客户...';
  setDsOperationLog('#ds-profile-operation-log', 'DS 画像：正在读取候选客户...', 'is-running');
  const payload = await api(`${DS_PROFILE_ANALYSIS_API}/candidates?includeExisting=${includeExisting}`);
  renderDsProfileCandidateList(payload);
  setDsOperationLog('#ds-profile-operation-log', `DS 画像：候选读取完成 · ${formatNumber((payload.candidates || []).length)} 人`, 'is-success');
}

async function openDsProfileBatchModal() {
  $('#ds-profile-batch-modal').hidden = false;
  try {
    await loadDsProfileCandidates();
  } catch (error) {
    $('#ds-profile-batch-status').textContent = `读取候选失败：${error.message}`;
    setDsOperationLog('#ds-profile-operation-log', `DS 画像：候选读取失败 · ${error.message}`, 'is-error');
  }
}

function closeDsProfileBatchModal() {
  $('#ds-profile-batch-modal').hidden = true;
}

async function runSelectedDsProfileAnalysis() {
  if (state.dsProfileBatchBusy) return;
  const customerIds = selectedDsProfileCandidateIds();
  if (!customerIds.length) {
    $('#ds-profile-batch-status').textContent = '请至少选择 1 位客户。';
    setDsOperationLog('#ds-profile-operation-log', 'DS 画像：未选择客户，未启动生成', 'is-error');
    return;
  }
  state.dsProfileBatchBusy = true;
  $('#run-ds-profile-selected').disabled = true;
  $('#ds-profile-batch-status').textContent = `正在调用 DS LLM 生成/更新 ${formatNumber(customerIds.length)} 位客户画像...`;
  setDsOperationLog('#ds-profile-operation-log', `DS 画像：正在生成/更新 ${formatNumber(customerIds.length)} 位客户...`, 'is-running');
  try {
    const payload = await postApi(`${DS_PROFILE_ANALYSIS_API}/runs/selected`, {
      actor: 'ds_profile_selected_batch_button',
      customerIds,
      force: true,
    });
    state.dsProfileAnalysis = { ...payload, hasGeneratedResult: true };
    state.dsProfileSelectedRunId = payload.runs?.[0]?.analysis?.runMeta?.runId || state.dsProfileSelectedRunId;
    closeDsProfileBatchModal();
    await loadDsProfileAnalysis();
    setDsOperationLog('#ds-profile-operation-log', `DS 画像：生成完成 · ${formatNumber(payload.generatedCount || 0)} 人`, 'is-success');
  } catch (error) {
    $('#ds-profile-batch-status').textContent = `生成失败：${error.message}`;
    setDsOperationLog('#ds-profile-operation-log', `DS 画像：生成失败 · ${error.message}`, 'is-error');
  } finally {
    state.dsProfileBatchBusy = false;
    $('#run-ds-profile-selected').disabled = false;
  }
}

function selectedDsRuleWorkbenchRule() {
  const rules = state.dsRuleWorkbench?.rules || [];
  return rules.find((rule) => rule.ruleId === state.dsRuleWorkbenchSelectedRuleId) || rules[0] || null;
}

function renderRuleWorkbenchSummary(payload) {
  const summary = payload?.summary || {};
  const cards = [
    ['规则总数', summary.totalRules || 0, '当前纳入工作台'],
    ['三页直连规则', summary.directGenerationRules || 0, '直接影响三页生成'],
    ['上游规则', summary.upstreamRules || 0, '作为证据来源'],
    ['可编辑规则', summary.editableRules || 0, '本地保存版本'],
    ['锁定门禁', summary.lockedSafetyRules || 0, '不可改成允许'],
    ['最近保存', summary.lastSavedAt ? summary.lastSavedAt.replace('T', ' ').slice(0, 19) : '暂无', '本地 change events'],
  ];
  $('#rule-workbench-summary').innerHTML = `
    <div class="rule-workbench-stat-grid">
      ${cards.map(([label, value, note]) => `
        <article>
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(note)}</small>
        </article>
      `).join('')}
    </div>
    <div class="rule-workbench-gates">
      <span>自动发送 false</span>
      <span>对客发布 false</span>
      <span>远端写库 false</span>
      <span>敏感凭据禁止保存</span>
    </div>
  `;
}

function renderRuleWorkbenchRuleList(payload) {
  const rules = payload?.rules || [];
  const categories = payload?.categories || [];
  $('#rule-workbench-categories').innerHTML = categories.map((item) => `
    <span>${escapeHtml(item.category)} <b>${formatNumber(item.count)}</b></span>
  `).join('');
  $('#rule-workbench-rule-list').innerHTML = rules.map((rule) => `
    <button class="rule-workbench-rule-button ${rule.ruleId === state.dsRuleWorkbenchSelectedRuleId ? 'is-active' : ''}" data-rule-id="${escapeHtml(rule.ruleId)}">
      <span>${escapeHtml(rule.category)}</span>
      <strong>${escapeHtml(rule.title)}</strong>
      <small>${escapeHtml(rule.scope || '')}</small>
      <em>${escapeHtml((rule.requiresRegeneration || []).join(' / ') || '只读复核')}</em>
    </button>
  `).join('');
}

function renderRuleWorkbenchDetail() {
  const rule = selectedDsRuleWorkbenchRule();
  if (!rule) {
    $('#rule-workbench-detail').innerHTML = '<div class="empty">暂无可展示的规则。</div>';
    return;
  }
  const events = (state.dsRuleWorkbench?.changeEvents || []).filter((event) => event.ruleId === rule.ruleId).slice(0, 5);
  const currentText = JSON.stringify(rule.currentValue ?? {}, null, 2);
  $('#rule-workbench-detail').innerHTML = `
    <div class="rule-workbench-head">
      <div>
        <p class="eyebrow">${escapeHtml(rule.group || 'rule')}</p>
        <h3>${escapeHtml(rule.title)}</h3>
        <p>${escapeHtml(rule.description || '')}</p>
      </div>
      <span class="status-chip ${rule.lockedSafetyBoundary ? 'is-pending' : 'is-complete'}">${escapeHtml(rule.lockedSafetyBoundary ? '安全门禁锁定' : '可本地编辑')}</span>
    </div>
    <div class="rule-workbench-meta-grid">
      <article><span>作用范围</span><strong>${escapeHtml(rule.scope || '-')}</strong></article>
      <article><span>最后保存</span><strong>${escapeHtml(rule.updatedAt ? rule.updatedAt.replace('T', ' ').slice(0, 19) : '-')}</strong></article>
      <article><span>保存人</span><strong>${escapeHtml(rule.updatedBy || '-')}</strong></article>
      <article><span>影响生成</span><strong>${escapeHtml((rule.requiresRegeneration || []).join(' / ') || '-')}</strong></article>
    </div>
    <div class="rule-workbench-two-col">
      <section>
        <div class="panel-title">来源位置</div>
        <div class="rule-workbench-chip-list">
          ${(rule.sourcePaths || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
        </div>
      </section>
      <section>
        <div class="panel-title">API / 函数</div>
        <div class="rule-workbench-chip-list">
          ${(rule.apiPaths || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
          ${(rule.functionNames || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
        </div>
      </section>
    </div>
    <div class="rule-workbench-editor-head">
      <div>
        <div class="panel-title">当前规则值</div>
        <p>编辑后保存到本地规则注册表；后续 DS 生成链路可读取此规则版本。</p>
      </div>
      <button id="reset-rule-workbench-draft" class="secondary-button" type="button">恢复当前值</button>
    </div>
    <textarea id="rule-workbench-editor" class="rule-workbench-editor" spellcheck="false">${escapeHtml(currentText)}</textarea>
    <div class="rule-workbench-note" id="rule-workbench-editor-note">
      ${rule.lockedSafetyBoundary ? '此规则允许补充说明，但保存时系统会强制 automaticSendAllowed、customerFacingPublishAllowed、remoteWriteAllowed 等门禁保持 false。' : '保存前会校验 JSON 格式，并拒绝密码、token、连接串等敏感字段。'}
    </div>
    <div class="rule-workbench-two-col">
      <section>
        <div class="panel-title">代码/模板快照</div>
        <pre class="rule-workbench-code">${escapeHtml(JSON.stringify(rule.sourceDefaultValue ?? {}, null, 2))}</pre>
      </section>
      <section>
        <div class="panel-title">最近保存记录</div>
        ${events.length ? events.map((event) => `
          <article class="rule-workbench-event">
            <strong>${escapeHtml(event.savedAt ? event.savedAt.replace('T', ' ').slice(0, 19) : '-')}</strong>
            <span>${escapeHtml(event.actor || '-')}</span>
            <small>${escapeHtml((event.requiresRegeneration || []).join(' / ') || '-')}</small>
          </article>
        `).join('') : '<div class="empty">暂无本规则保存记录。</div>'}
      </section>
    </div>
  `;
  $('#rule-workbench-editor')?.addEventListener('input', () => {
    state.dsRuleWorkbenchDraftDirty = true;
    $('#save-rule-workbench').textContent = '保存当前规则 *';
    $('#rule-workbench-editor-note').textContent = '有未保存修改。保存后会记录本地 change event，并提示相关 DS 页面需要重新生成。';
  });
  $('#reset-rule-workbench-draft')?.addEventListener('click', () => {
    const editor = $('#rule-workbench-editor');
    if (editor) editor.value = currentText;
    state.dsRuleWorkbenchDraftDirty = false;
    $('#save-rule-workbench').textContent = '保存当前规则';
    $('#rule-workbench-editor-note').textContent = '已恢复为当前保存值。';
  });
}

function renderDsRuleWorkbench(payload) {
  state.dsRuleWorkbench = payload;
  if (!state.dsRuleWorkbenchSelectedRuleId && payload?.rules?.[0]) {
    state.dsRuleWorkbenchSelectedRuleId = payload.rules[0].ruleId;
  }
  $('#rule-workbench-status').textContent = `${formatNumber(payload?.summary?.totalRules || 0)} 条规则 · 本地可保存`;
  $('#rule-workbench-status').className = 'status-chip is-complete';
  renderRuleWorkbenchSummary(payload);
  renderRuleWorkbenchRuleList(payload);
  renderRuleWorkbenchDetail();
}

async function loadDsRuleWorkbench() {
  try {
    const payload = await api(DS_RULE_WORKBENCH_API);
    state.dsRuleWorkbenchDraftDirty = false;
    $('#save-rule-workbench').textContent = '保存当前规则';
    renderDsRuleWorkbench(payload);
  } catch (error) {
    $('#rule-workbench-status').textContent = '读取失败';
    $('#rule-workbench-status').className = 'status-chip is-missing';
    $('#rule-workbench-summary').innerHTML = '';
    $('#rule-workbench-rule-list').innerHTML = '';
    $('#rule-workbench-detail').innerHTML = `<div class="empty">规则工作台读取失败：${escapeHtml(error.message)}</div>`;
  }
}

function selectDsRuleWorkbenchRule(ruleId) {
  state.dsRuleWorkbenchSelectedRuleId = ruleId;
  state.dsRuleWorkbenchDraftDirty = false;
  $('#save-rule-workbench').textContent = '保存当前规则';
  renderRuleWorkbenchRuleList(state.dsRuleWorkbench);
  renderRuleWorkbenchDetail();
}

async function saveDsRuleWorkbenchRule() {
  const rule = selectedDsRuleWorkbenchRule();
  const editor = $('#rule-workbench-editor');
  if (!rule || !editor) return;
  let draftValue;
  try {
    draftValue = JSON.parse(editor.value);
  } catch (error) {
    showFloatingError(`规则 JSON 格式不正确：${error.message}`);
    return;
  }
  $('#save-rule-workbench').disabled = true;
  $('#save-rule-workbench').textContent = '保存中...';
  try {
    const payload = await postApi(`${DS_RULE_WORKBENCH_API}/rules/${encodeURIComponent(rule.ruleId)}`, {
      actor: 'rule_workbench_ui',
      draftValue,
    });
    state.dsRuleWorkbenchDraftDirty = false;
    renderDsRuleWorkbench(payload);
  } catch (error) {
    showFloatingError(`规则保存失败：${error.message}`);
  } finally {
    $('#save-rule-workbench').disabled = false;
    $('#save-rule-workbench').textContent = '保存当前规则';
  }
}

function buildDsV3ClientPlaceholder() {
  return {
    meta: {
      generationStatus: 'waiting_for_deepseek_generation',
      templateVersion: 'chen_xisheng_v3_20260625',
      safetyBoundary: '等待 DS 生成后填入；不自动发送、不对客发布、不写远端库。',
    },
    customer: {
      name: '陈喜生',
      customerNameMasked: '陈喜生',
      unifiedCustomerId: 'HIS_00fe9fb2-32a5-c8fb-c019-08de4c3863f5',
      sceneName: '场景一：皮肤维养诉求｜认可但节奏中断型',
    },
    completeness: {},
    summaryTags: [],
    sections: [],
  };
}

function renderMdGeneratedDetail(item) {
  const detail = item.detailContent || null;
  const detailFields = [];
  const pushField = (label, value) => {
    if (value === null || value === undefined || value === '') return;
    const normalized = Array.isArray(value) ? value.join('；') : value;
    detailFields.push([label, typeof normalized === 'string' ? normalized : JSON.stringify(normalized, null, 2)]);
  };
  if (typeof detail === 'string') {
    pushField('DS 生成详情', detail);
  } else if (detail && typeof detail === 'object') {
    pushField('业务含义', detail.whatThisMeans || detail.content || detail.summary);
    pushField('证据路径', detail.evidencePath || detail.evidenceSummary);
    pushField('不确定性', detail.uncertainty || detail.caveat);
    pushField('顾问复核点', detail.advisorCheckpoints);
  }
  pushField('推断/归纳方法', item.inferenceMethod);
  if (item.amountNormalization) {
    const amount = item.amountNormalization || {};
    pushField('金额口径', amount.rule || `展示金额 ${amount.displayAmount || ''}；原始值 ${amount.rawAmount || ''}`);
  }
  if (!detailFields.length) return '';
  return `
    <section class="truth-detail-section">
      <h4>DS 生成的查看详情内容</h4>
      <div class="truth-detail-grid">
        ${detailFields.map(([label, value]) => `
          <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(formatMdDisplayText(value))}</strong></div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderMdRawDetail(item) {
  const raw = item.raw;
  if (!raw || typeof raw !== 'object') return '';
  const entries = Object.entries(raw)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([label, value]) => [
      label,
      typeof value === 'string' ? value : JSON.stringify(value, null, 2),
    ]);
  if (!entries.length) return '';
  return `
    <section class="truth-detail-section">
      <h4>原始字段</h4>
      <div class="truth-detail-grid">
        ${entries.map(([label, value]) => `
          <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(formatMdDisplayText(value))}</strong></div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderMdEvidenceDetail(item) {
  const records = item.records || [];
  const rawDetailCount = item.raw && typeof item.raw === 'object' ? 1 : 0;
  const detailCount = records.length || rawDetailCount;
  const countLabel = records.length ? '证据条数' : '原始字段组';
  $('#truth-detail-modal .truth-detail-title strong').textContent = '证据记录详情';
  $('#truth-detail-body').innerHTML = `
    <div class="truth-detail-head">
      <span class="status-chip is-indexed">详情明细 · ${formatNumber(detailCount)} 条</span>
      <div>
        <h3>${escapeHtml(item.rowTitle)}</h3>
        <span>${escapeHtml(item.sectionTitle)}</span>
      </div>
    </div>
    <div class="truth-detail-grid">
      <div><span>数据状态</span><strong>${escapeHtml(item.dataStatus || '未标注')}</strong></div>
      <div><span>来源字段</span><strong>${escapeHtml(item.source || '未标注')}</strong></div>
      <div><span>${countLabel}</span><strong>${formatNumber(detailCount)}</strong></div>
    </div>
    <section class="truth-detail-section">
      <h4>填写结果</h4>
      <pre>${escapeHtml(formatMdDisplayText(item.rowValue || '未填写'))}</pre>
    </section>
    <section class="truth-detail-section">
      <h4>证据说明</h4>
      <pre>${escapeHtml(formatMdDisplayText(item.evidence || '无证据说明'))}</pre>
    </section>
    ${renderMdRawDetail(item)}
    ${renderMdGeneratedDetail(item)}
    ${records.length ? `
      <section class="truth-detail-section md-evidence-detail-section">
        <h4>记录明细</h4>
        <div class="md-evidence-records is-modal">
          ${renderMdEvidenceRecordCards(records)}
        </div>
      </section>
    ` : ''}
  `;
  $('#truth-detail-modal').hidden = false;
}

function buildSectionInsight(section) {
  const facts = uniqueValues(section.items
    .filter((item) => item.customerValue?.valueText && item.valueKind !== 'no_record')
    .map((item) => formatItemValueSnippet(section, item))
    .filter((text) => text && !text.includes('跨字段证据包')))
    .slice(0, 4);
  const noRecord = Number(section.noRecordCount || 0);
  const pending = Number(section.pendingValueCount || 0);
  if (!facts.length && noRecord === section.items.length) {
    facts.push('本章节候选源已检查，当前客户未返回可确认记录。');
  }
  if (!facts.length && pending) {
    facts.push('本章节仍有待抽取项；当前只展示已确认本地值。');
  }
  if (!facts.length) facts.push('本章节当前没有可单独展示的结构化结论。');
  if (noRecord && noRecord < section.items.length) facts.push(`另有 ${formatNumber(noRecord)} 项候选源未返回记录。`);
  return facts;
}

function renderUserRequirementSections(audit) {
  if (!audit) return '';
  state.detailItems.clear();
  return audit.sections.map((section) => `
    <section class="user-requirement-section">
      <div class="user-requirement-section-head">
        <strong>${section.headingText}</strong>
        <span>${formatNumber(section.items.length)} 项 · 真值 ${formatNumber(section.filledValueCount)} · 摘要 ${formatNumber(section.summaryValueCount)} · 无记录 ${formatNumber(section.noRecordCount)} · 待抽取 ${formatNumber(section.pendingValueCount)} · 未匹配 ${formatNumber(section.missingCount)}</span>
      </div>
      <div class="section-insight">
        <strong>本章节客户信息</strong>
        <ul>
          ${buildSectionInsight(section).map((fact) => `<li>${escapeHtml(fact)}</li>`).join('')}
        </ul>
      </div>
      <div class="user-requirement-rows">
        ${section.items.map((item) => {
          const detailKey = `${section.sectionNo}-${item.requirement?.requirementId || item.itemNo}`;
          if (item.customerValue?.valueText) state.detailItems.set(detailKey, { ...item, section });
          const snippet = formatItemValueSnippet(section, item);
          return `
          <article class="user-requirement-row ${statusClass(item.displayStatus)}">
            <div class="user-requirement-title">
              <span class="status-chip ${statusClass(item.displayStatus)}">${item.displayStatus}</span>
              <strong>${item.itemText}</strong>
            </div>
            <div class="user-requirement-facts">
              <span>REQ：${item.requirement?.requirementId || '待补目录'}</span>
              <span>目标表：${item.requirement?.suggestedTargetTable || item.requirement?.targetTables || '未登记'}</span>
              <span>映射：${formatNumber(item.requirement?.mappingCount || 0)}</span>
              <span>客户状态：${item.customerValue?.valueStatus || '无客户索引'}</span>
            </div>
            ${snippet ? `<p class="value-snippet"><span>本条结论</span>${escapeHtml(snippet)}</p>` : ''}
            ${item.customerValue?.valueText ? `
              <button class="truth-detail-button" type="button" data-detail-key="${detailKey}">
                <span>查看原始证据与导入 payload</span>
                <strong>查看详情</strong>
              </button>
            ` : ''}
            <p class="explanation">${item.explanation}</p>
          </article>
        `}).join('')}
      </div>
    </section>
  `).join('');
}

function renderTruthDetail(item) {
  const value = item.customerValue || {};
  const req = item.requirement || {};
  const jsonText = formatJson(value.valueJson);
  const sectionSnippet = formatItemValueSnippet(item.section || {}, item);
  $('#truth-detail-body').innerHTML = `
    <div class="truth-detail-head">
      <span class="status-chip ${statusClass(item.displayStatus)}">${item.displayStatus}</span>
      <div>
        <strong>${escapeHtml(item.itemText)}</strong>
        <span>${escapeHtml(item.section?.headingText || '')}</span>
      </div>
    </div>
    <div class="truth-detail-grid">
      <div><span>REQ</span><strong>${escapeHtml(req.requirementId || '待补目录')}</strong></div>
      <div><span>目标表</span><strong>${escapeHtml(req.suggestedTargetTable || req.targetTables || '未登记')}</strong></div>
      <div><span>来源表</span><strong>${escapeHtml(value.sourceTable || req.sourceTables || '未登记')}</strong></div>
      <div><span>来源字段</span><strong>${escapeHtml(value.sourceColumn || '未登记')}</strong></div>
      <div><span>客户状态</span><strong>${escapeHtml(value.valueStatus || '无客户值')}</strong></div>
      <div><span>映射数量</span><strong>${formatNumber(req.mappingCount || 0)}</strong></div>
    </div>
    <section class="truth-detail-section">
      <h4>本章节展示结论</h4>
      <pre>${escapeHtml(sectionSnippet || '本章节没有可单独展示的结构化结论。')}</pre>
    </section>
    <section class="truth-detail-section">
      <h4>原始客户值</h4>
      <pre>${escapeHtml(value.valueText || '')}</pre>
    </section>
    ${jsonText ? `
      <section class="truth-detail-section">
        <h4>导入 payload JSON</h4>
        <pre>${escapeHtml(jsonText)}</pre>
      </section>
    ` : ''}
    ${value.notes ? `
      <section class="truth-detail-section">
        <h4>备注</h4>
        <pre>${escapeHtml(value.notes)}</pre>
      </section>
    ` : ''}
  `;
  $('#truth-detail-modal').hidden = false;
}

function closeTruthDetail() {
  $('#truth-detail-modal').hidden = true;
  $('#truth-detail-modal .truth-detail-title strong').textContent = '真值详情';
  $('#truth-detail-body').innerHTML = '';
}

function renderCustomerDetail(data, audit) {
  const filter = data.filterResults[0] || {};
  const membership = data.membership[0] || {};
  const profile = data.profiles[0] || {};
  const tag = data.tags[0] || {};
  const customer = data.customer || {};
  const sceneOk = audit?.sceneAudit?.sceneConsistent;
  const summary = audit?.summary || {};
  const truthValueCount = Number(summary.truthValueCount || 0);
  const remoteTruthValueCount = Number(summary.remoteTruthValueCount || 0);
  const localTruthValueCount = Number(summary.localTruthValueCount || 0);
  const wecomTruthValueCount = Number(summary.wecomTruthValueCount || 0);
  const aiFileTruthValueCount = Number(summary.aiFileTruthValueCount || 0);
  const npsTruthValueCount = Number(summary.npsTruthValueCount || 0);
  const skinMetadataTruthValueCount = Number(summary.skinMetadataTruthValueCount || 0);
  const medicalMetadataTruthValueCount = Number(summary.medicalMetadataTruthValueCount || 0);
  const summaryValueCount = Number(summary.summaryValueCount || 0);
  const noRecordCount = Number(summary.noRecordCount || 0);
  const pendingValueCount = Number(summary.pendingValueCount || 0);
  const requirementCount = Number(summary.customerRequirementCount || data.requirements.length || 0);
  $('#customer-detail').innerHTML = `
    <div class="user-file-head">
      <div>
        <p class="eyebrow">SELECTED SCENE 1 USER</p>
        <h3>${customer.customer_name_masked || customer.unified_customer_id}</h3>
        <code>${customer.unified_customer_id}</code>
      </div>
      <span class="status-chip ${sceneOk ? 'is-complete' : 'is-missing'}">${sceneOk ? '场景一分类通过' : '分类需复核'}</span>
    </div>
    <div class="detail-grid user-file-grid">
      <div class="detail-item"><span>客户 ID</span><strong>${customer.unified_customer_id}</strong></div>
      <div class="detail-item"><span>场景标签</span><strong>${tag.scene_name || profile.scene_name || '未显示'}</strong></div>
      <div class="detail-item"><span>RFM 等级</span><strong>${membership.rfm_grade || ''}</strong></div>
      <div class="detail-item"><span>会员等级</span><strong>${membership.member_level || '未抽取'}</strong></div>
      <div class="detail-item"><span>年龄</span><strong>${customer.age ?? '未抽取'}</strong></div>
      <div class="detail-item"><span>门店</span><strong>${customer.primary_clinic_name || '未抽取'}</strong></div>
      <div class="detail-item"><span>所属医生</span><strong>${customer.primary_doctor_name || '未抽取'}</strong></div>
      <div class="detail-item"><span>健康管理人</span><strong>${customer.health_manager_name || '未抽取'}</strong></div>
      <div class="detail-item"><span>维养次数 12M</span><strong>${filter.skin_maintenance_count_12m ?? ''}</strong></div>
      <div class="detail-item"><span>超期天数</span><strong>${filter.overdue_maintenance_days ?? ''}</strong></div>
      <div class="detail-item"><span>最近维养日期</span><strong>${filter.last_skin_maintenance_date ? String(filter.last_skin_maintenance_date).slice(0, 10) : ''}</strong></div>
      <div class="detail-item"><span>最近维养项目</span><strong>${filter.last_skin_maintenance_project || '未显示'}</strong></div>
      <div class="detail-item"><span>真值信息点</span><strong>${formatNumber(truthValueCount)}/230</strong></div>
      <div class="detail-item"><span>真值来源</span><strong>HIS ${formatNumber(remoteTruthValueCount)} · 本地 ${formatNumber(localTruthValueCount)} · 企微/CRM ${formatNumber(wecomTruthValueCount)} · AI文件 ${formatNumber(aiFileTruthValueCount)} · NPS ${formatNumber(npsTruthValueCount)} · 皮肤索引 ${formatNumber(skinMetadataTruthValueCount)} · 医美索引 ${formatNumber(medicalMetadataTruthValueCount)}</strong></div>
      <div class="detail-item"><span>索引覆盖</span><strong>${formatNumber(requirementCount)}/230</strong></div>
      <div class="detail-item"><span>未导入真值</span><strong>待抽取 ${formatNumber(pendingValueCount)} · 无记录 ${formatNumber(noRecordCount)} · 摘要 ${formatNumber(summaryValueCount)}</strong></div>
    </div>
    <div class="user-file-notice">
      <strong>本页按 非VIP客户信息新表信息confirm.md 展示全部 230 项。</strong>
      <span>顶部“真值信息点”统计已导入的 HIS、本地、企微/CRM 摘要、AI 文件索引、NPS 评分、皮肤/CSKIN 元数据索引和医美史/病历元数据索引真值；索引覆盖只说明 230 个 confirm 槽位已经建齐。没有真实业务值时，下方会逐条解释是待远端抽取、远端无记录，还是只有本地场景一摘要。</span>
    </div>
    ${renderUserRequirementSections(audit)}
  `;
}

async function loadCustomer(id) {
  state.selectedCustomer = id;
  $('#customer-id-input').value = id;
  $('#requirement-customer-input').value = id;
  const [data, audit] = await Promise.all([
    api(`/api/customer/${encodeURIComponent(id)}`),
    api(`/api/requirement-audit?customerId=${encodeURIComponent(id)}`),
  ]);
  state.requirementAudit = audit;
  renderCustomerDetail(data, audit);
  renderRequirementAudit(audit);
  $$('.customer-button').forEach((button) => button.classList.toggle('is-active', button.dataset.customer === id));
}

function flattenRequirementItems(audit) {
  if (!audit) return [];
  return audit.sections.flatMap((section) => section.items.map((item) => ({
    ...item,
    sectionNo: section.sectionNo,
    sectionName: section.sectionName,
    headingText: section.headingText,
  })));
}

function filteredRequirementSections() {
  const audit = state.requirementAudit;
  if (!audit) return [];
  const query = $('#requirement-filter').value.trim().toLowerCase();
  const status = $('#requirement-status-filter').value;
  return audit.sections.map((section) => {
    const items = section.items.filter((item) => {
      if (status && item.displayStatus !== status) return false;
      if (!query) return true;
      const text = [
        section.headingText,
        item.itemText,
        item.displayStatus,
        item.explanation,
        item.requirement?.requirementId,
        item.requirement?.itemText,
        item.requirement?.suggestedTargetTable,
        item.requirement?.targetTables,
        item.requirement?.sourceTables,
      ].join(' ').toLowerCase();
      return text.includes(query);
    });
    return { ...section, items };
  }).filter((section) => section.items.length);
}

function renderRequirementAuditSummary(audit) {
  const scene = audit.sceneAudit || {};
  const kpis = [
    ['场景一分类一致性', scene.sceneConsistent ? '通过' : '需复核', `${scene.sceneTags}/${scene.customers} 标签`],
    ['confirm 原文信息点', audit.summary.markdownItems, audit.confirm.sourceName],
    ['本地目录信息点', audit.summary.catalogItems, 'field_requirement_catalog'],
    ['已匹配 confirm', audit.summary.matchedCount, `未匹配 ${audit.summary.missingCount}`],
    ['当前客户索引', audit.summary.customerRequirementCount ?? '-', audit.summary.selectedCustomerId || '未选择客户'],
  ];
  $('#requirement-audit-summary').innerHTML = `
    <div class="audit-rule ${scene.sceneConsistent ? 'is-ok' : 'is-warn'}">
      <strong>${scene.sceneConsistent ? '当前 376 个用户已按场景一分类' : '场景一分类需要复核'}</strong>
      <span>${scene.rule}</span>
      <div class="audit-rule-grid">
        <span>客户 ${formatNumber(scene.customers)}</span>
        <span>场景标签 ${formatNumber(scene.sceneTags)}</span>
        <span>筛选结果 ${formatNumber(scene.filterResults)}</span>
        <span>可见标签 ${formatNumber(scene.visibleTags)}</span>
        <span>非 VIP 标记 ${formatNumber(scene.nonVipFlags)}</span>
        <span>RFM A 入池 ${formatNumber(scene.rfmGradeA)}</span>
      </div>
    </div>
    <div class="kpi-grid requirement-kpis">
      ${kpis.map(([label, value, note]) => `
        <article class="kpi">
          <div class="label">${label}</div>
          <div class="value ${String(value).length > 8 ? 'smaller' : ''}">${typeof value === 'number' ? formatNumber(value) : value}</div>
          <div class="note">${note}</div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderRequirementAuditList() {
  const sections = filteredRequirementSections();
  $('#requirement-sections').innerHTML = sections.map((section) => `
    <section class="requirement-audit-section">
      <div class="requirement-section-head">
        <div>
          <strong>${section.headingText}</strong>
          <span>${formatNumber(section.items.length)} 条当前显示 · 真值 ${formatNumber(section.filledValueCount)} · 摘要 ${formatNumber(section.summaryValueCount)} · 无记录 ${formatNumber(section.noRecordCount)} · 待抽取 ${formatNumber(section.pendingValueCount)} · 未匹配 ${formatNumber(section.missingCount)}</span>
        </div>
        ${section.notes?.length ? `<p>${section.notes.join(' ')}</p>` : ''}
      </div>
      <div class="requirement-audit-items">
        ${section.items.map((item) => {
          const snippet = formatItemValueSnippet(section, item);
          return `
          <article class="requirement-card ${statusClass(item.displayStatus)}">
            <div class="requirement-card-top">
              <span class="status-chip ${statusClass(item.displayStatus)}">${item.displayStatus}</span>
              <span>${item.matchType} · ${Math.round((item.matchScore || 0) * 100)}%</span>
            </div>
            <h3>${item.itemText}</h3>
            <div class="requirement-meta-grid">
              <div><span>confirm 目录</span><strong>${item.requirement?.requirementId || '待补目录'}</strong></div>
              <div><span>目标表</span><strong>${item.requirement?.suggestedTargetTable || item.requirement?.targetTables || '未登记'}</strong></div>
              <div><span>映射数</span><strong>${formatNumber(item.requirement?.mappingCount || 0)}</strong></div>
              <div><span>客户状态</span><strong>${item.customerValue?.valueStatus || '未选择/无客户值'}</strong></div>
            </div>
            ${item.requirement ? `<p class="matched-text">目录表述：${item.requirement.itemText}</p>` : ''}
            ${snippet ? `<p class="value-text"><span>当前客户结论：</span>${escapeHtml(snippet)}</p>` : ''}
            <p class="explanation">${item.explanation}</p>
            ${item.requirement?.sourceTables ? `<p class="source-text">来源表：${item.requirement.sourceTables}</p>` : ''}
          </article>
        `}).join('')}
      </div>
    </section>
  `).join('');
  if (!sections.length) $('#requirement-sections').innerHTML = '<div class="empty">当前过滤条件下没有信息点</div>';
}

function renderRequirementAudit(audit) {
  state.requirementAudit = audit;
  renderRequirementAuditSummary(audit);
  renderBars($('#requirement-value-chart'), audit.charts.valueStatuses);
  renderBars($('#requirement-mapping-chart'), audit.charts.mappingStatuses);
  renderBars($('#requirement-customer-coverage-chart'), audit.charts.customerCoverage);
  renderRequirementAuditList();
}

function productClassLabel(productClass) {
  if (productClass === 'maintenance') return '维护类';
  if (productClass === 'anti_aging') return '抗衰类';
  if (productClass === 'maintenance_candidate') return '维护候选';
  return productClass || '待确认';
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
  if (numeric >= 120) return '120+ 天重度逾期';
  if (numeric >= 90) return '90+ 天中高逾期';
  if (numeric >= 60) return '60+ 天维护窗口';
  return '刚进入维护观察窗口';
}

function treatmentShortName(text) {
  const source = String(text || '');
  if (source.includes('3MAX')) return '3MAX 超光子 2 部位';
  if (source.includes('超光子')) return '超光子维护';
  if (source.includes('水光')) return '基础水光维护';
  if (source.includes('果酸')) return '果酸/光子组合维护';
  return source || '近期护理记录';
}

function percentLabel(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '待补';
  return `${Math.round(Number(value) * 100)}%`;
}

function labelFromEntries(entries) {
  return Object.entries(entries || {})
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join('、') : value}`)
    .join('；');
}

function dateDiffDays(startDateText, endDateText = LIFECYCLE_ANALYSIS_DATE) {
  if (!startDateText || !endDateText) return null;
  const startParts = String(startDateText).slice(0, 10).split('-').map(Number);
  const endParts = String(endDateText).slice(0, 10).split('-').map(Number);
  if (startParts.length !== 3 || endParts.length !== 3 || startParts.some(Number.isNaN) || endParts.some(Number.isNaN)) return null;
  const start = Date.UTC(startParts[0], startParts[1] - 1, startParts[2]);
  const end = Date.UTC(endParts[0], endParts[1] - 1, endParts[2]);
  return Math.max(0, Math.round((end - start) / 86400000));
}

function addDaysToDateText(dateText, days) {
  if (!dateText) return '';
  const parts = String(dateText).slice(0, 10).split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return '';
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function allMdRows(fixture) {
  return (fixture?.sections || []).flatMap((section) => (section.rows || []).map((row) => ({
    ...row,
    sectionTitle: section.title,
  })));
}

function findMdRow(fixture, matcher) {
  const rows = allMdRows(fixture);
  const predicate = matcher instanceof RegExp
    ? (row) => matcher.test(`${row.title || ''} ${row.value || ''} ${row.source || ''}`)
    : matcher;
  return rows.find(predicate);
}

function findSummaryTag(fixture, label) {
  return (fixture?.summaryTags || []).find((tag) => tag.label === label)?.summary || '';
}

function compactEvidenceRecord(record) {
  return {
    title: record.title,
    source: record.source,
    recordId: record.recordId,
    createTime: record.createTime,
    fields: (record.fields || []).map((field) => ({
      label: field.label,
      value: field.value,
    })),
  };
}

function mdRowSnapshot(row) {
  if (!row) return null;
  return {
    sectionTitle: row.sectionTitle,
    title: row.title,
    value: row.value,
    dataStatus: row.dataStatus,
    source: row.source,
    evidence: row.evidence,
    evidenceRecords: (row.evidenceRecords || []).slice(0, 4).map(compactEvidenceRecord),
  };
}

function buildChenLifecycleAgentAnalysis(fixture) {
  const customer = fixture.customer || {};
  const completeness = fixture.completeness || {};
  const lastVisitDate = customer.lastVisitDate || customer.firstVisitDate;
  const suggestedFollowupDate = addDaysToDateText(lastVisitDate, 31);
  const daysSinceLastVisit = dateDiffDays(lastVisitDate);
  const daysAfterFollowupWindow = dateDiffDays(suggestedFollowupDate);
  const projectCycleRepurchase = {
    statusLabel: '已到复查窗口',
    matchedProjectStandards: [
      {
        projectName: '进口YS超皮秒/蜂巢皮秒（全脸）（单）',
        standardProjectName: '超皮秒平扫',
        matchType: '项目周期表近似命中，需顾问确认同一规整项目',
        repurchaseCycleRaw: '1-3',
        stableTimesRaw: '3-5',
        recoveryDaysRaw: '1-3',
        daysSinceLastTreatment: daysSinceLastVisit,
        repurchaseStatusLabel: '已到复购 / 复查周期',
        recoveryStatusLabel: '已过恢复期',
        stabilizationStatusLabel: '单次已消耗，不足以判断同一项目稳固',
      },
      {
        projectName: 'Dr.Song消炎水光（单）',
        standardProjectName: 'Dr.Song全效消炎水光',
        matchType: '项目周期表近似命中，需顾问确认项目名规整关系',
        repurchaseCycleRaw: '1',
        stableTimesRaw: '3-5',
        recoveryDaysRaw: '3-7',
        daysSinceLastTreatment: daysSinceLastVisit,
        repurchaseStatusLabel: '已到复购 / 复查周期',
        recoveryStatusLabel: '已过恢复期',
        stabilizationStatusLabel: '单次已消耗，不足以判断同一项目稳固',
      },
    ],
    summary: `2026-01-05 已划扣超皮秒、消炎水光等服务项目；截至 ${LIFECYCLE_ANALYSIS_DATE} 距上次到店约 ${formatNumber(daysSinceLastVisit)} 天，已超过超皮秒 1-3 月、消炎水光 1 月等常规复购 / 复查窗口，且已过恢复期。`,
    advisorUse: '项目周期只作为顾问判断“为什么现在值得复查”的辅助因子；主轴仍以医生病历、诊断和 1 月后复诊建议为准。',
    boundaries: [
      '不能因为已到周期就直接推项目或套餐。',
      '不能覆盖治疗型客户 × 流失期的主判断。',
      '需顾问确认当前肤况、是否已在外院处理、同一规整项目是否应继续。',
      '对客不展示周期表行号、机会分或稳固次数内部判断。',
    ],
  };
  const rows = {
    specialCase: findMdRow(fixture, /客户是否有特殊情况记录/),
    faceDemand: findMdRow(fixture, /主诉、现病史、诊断、计划、处理/),
    diagnosis: findMdRow(fixture, /病历号 .*诊断|主诉面部色斑/),
    cskin: findMdRow(fixture, /皮肤检测图像。这里有多次/),
    skinScore: findMdRow(fixture, /皮肤评分质量|结构化皮肤评分/),
    treatmentPlan: findMdRow(fixture, /医生是否出面诊方案/),
    treatmentAdvice: findMdRow(fixture, /^本次治疗建议/),
    order: findMdRow(fixture, /已开单转化|展示金额合计|是否已经下单/),
    consumption: findMdRow(fixture, /4个服务项目均生成 course|course 消耗记录|消耗划扣/),
    appointment: findMdRow(fixture, /预约与待预约|客户是否从小程序主动预约/),
    wecom: findMdRow(fixture, /后续企微回访触达|是否有回访任务/),
    complaint: findMdRow(fixture, /是否发生客诉、理赔、退款|是否发生投诉/),
  };
  const evidenceRows = Object.values(rows).filter(Boolean).map(mdRowSnapshot);
  return {
    sampleId: 'chen-xisheng-scene1-lifecycle-agent-v1',
    analysisDate: LIFECYCLE_ANALYSIS_DATE,
    customer,
    headline: '治疗型客户 × 流失期｜治疗复诊逾期唤醒',
    demandType: {
      primary: '治疗型客户',
      secondary: ['整全护肤型线索', '维养型线索'],
      notPrimary: ['抗衰型证据弱：仅见“面部皮肤松弛/眼周细纹”，无抗衰项目周期和医生抗衰规划。', '美化型证据不足：无轮廓/鼻部/下巴等审美型方案。'],
      confidence: 0.86,
    },
	    lifecycleType: {
      primary: '流失期',
      transitionFrom: '治疗执行期已中断',
      confidence: 0.82,
      advisorConfirmationRequired: true,
	    },
	    projectCycleRepurchase,
	    metrics: {
      truthRows: completeness.rowCount || 0,
      primaryRows: completeness.primaryRowCount || 0,
      directRows: completeness.directRows || 0,
      missingRows: completeness.missingRows || 0,
      lastVisitDate,
      suggestedFollowupDate,
      daysSinceLastVisit,
      daysAfterFollowupWindow,
      opportunityScore: 62,
      readinessScore: 0.72,
      riskLevel: 'yellow',
    },
    sourceTags: {
      identity: findSummaryTag(fixture, '客户身份'),
      appointment: findSummaryTag(fixture, '预约记录'),
      visit: findSummaryTag(fixture, '到访分诊'),
      demand: findSummaryTag(fixture, '面部诉求'),
      cskin: findSummaryTag(fixture, '皮肤检测'),
      plan: findSummaryTag(fixture, '面诊方案'),
      order: findSummaryTag(fixture, '开单转化'),
      consumption: findSummaryTag(fixture, '消耗划扣'),
      complaint: findSummaryTag(fixture, '客诉退款'),
    },
    evidenceRows,
    priorityEvidence: [
      'P1 病例/医生诊断/检测：主诉面部色斑 7 年加重半年；诊断黄褐斑、日光性黑子、面部皮肤松弛；医生方案为皮秒激光 + 美塑疗法；处理写明 1 月后复诊。CSKIN 文本提示紫外线色斑、棕色斑明显并合并毛细血管扩张，但无结构化图像和评分。',
      'P2 历史项目/治疗次数：2026-01-05 发生皮秒、美塑/水光及相关商品开单，4 个服务 course 均为 1/1 已消耗，不能归入未消耗待激活。',
      `P3 消费/到店/互动：2026-01-05 已到店且付款完成；截至 ${LIFECYCLE_ANALYSIS_DATE} 距上次到店约 ${formatNumber(daysSinceLastVisit)} 天，距建议复诊窗口约 ${formatNumber(daysAfterFollowupWindow)} 天；预约/待预约未命中，企微仅 1 条文本会话和 6 条 SUCCESS 任务历史且任务正文为空。`,
      'P4 顾问修正：未命中投诉、退款、勿扰标记；仍需顾问确认当前肤况、是否已在外院处理、是否适合主动触达。',
    ],
  };
}

function renderStrategyEvidenceMatrix(items = []) {
  return `
    <section class="strategy-evidence-section">
      <div class="strategy-section-head">
        <span>分类证据矩阵</span>
      </div>
      <div class="strategy-evidence-grid">
        ${items.map((item) => {
          const points = Array.isArray(item.points) && item.points.length
            ? item.points
            : [{ label: '证据', text: item.evidence }];
          const articleClass = [
            item.isPrimary ? 'is-primary' : '',
            item.tone ? `is-${item.tone}` : '',
          ].filter(Boolean).join(' ');
          return `
          <article class="${escapeHtml(articleClass)}">
            <div class="strategy-evidence-title">
              <span>${escapeHtml(item.priority)}</span>
              <strong>${escapeHtml(item.title)}</strong>
            </div>
            <div class="strategy-evidence-list">
              ${points.map((point) => `
                <div>
                  <b>${escapeHtml(point.label)}</b>
                  <p>${escapeHtml(profileStrategyDisplayText(point.text))}</p>
                </div>
              `).join('')}
            </div>
          </article>
        `;
        }).join('')}
      </div>
    </section>
  `;
}

function defaultStrategyReasoningSteps(analysis) {
  const { customer, metrics } = analysis;
  return [
    {
      label: 'Step 1 · 判顾客类型',
      title: 'P1 / P2 共同指向治疗型客户',
      bullets: [
        'P1 中主诉、现病史、医生诊断、当天皮肤描述、CSKIN 文本、既往皮秒有效史和医生方案均围绕色斑治疗。',
        'P2 中皮秒、美塑 / 水光、补注射等项目已经开单并完成服务消耗，说明历史服务与治疗路径相连。',
        '干燥、保湿补水和护肤品可作为维养 / 整全护肤辅助线索；松弛、眼周细纹只提供抗衰弱线索，美化型证据不足。',
      ],
    },
    {
      label: 'Step 2 · 判生命周期阶段',
      title: 'P3 指向流失期 / 治疗复诊逾期唤醒',
      bullets: [
        `医生处理写明 1 月后复诊；截至 ${LIFECYCLE_ANALYSIS_DATE}，距建议复诊窗口约 ${formatNumber(metrics.daysAfterFollowupWindow)} 天。`,
        '2026-01-05 到店后未命中未来预约、待预约、小程序预约或预约未到店；企微只有弱互动和任务成功状态，缺少有效复诊反馈。',
        '治疗执行期已经中断，当前应低压唤醒并重新建立联系，而不是直接推项目。',
      ],
    },
    {
      label: '排除项',
      title: '为什么不是其它阶段',
      bullets: [
        '不是未消耗待激活：服务项目 course 均为 1/1 已消耗，服务剩余次数为 0。',
        '不是稳固期：未见 2-3 次连续治疗、效果反馈和继续巩固证据。',
        '不是维养期：主要问题是否已改善、是否进入稳定维护周期均未被证据确认。',
      ],
    },
    {
      label: 'P4 · 人工修正入口',
      title: '保留人工复核，不反向覆盖证据',
      bullets: [
        '当前未命中投诉、理赔、退款、勿扰、黑名单等强风险记录。',
        '满意度、治疗后反馈、当前肤况、是否外院处理仍缺失，需在人工复核中校准。',
        'P4 只能修正系统不知道的近况，不能覆盖 P1/P2/P3 已确认的主轴。',
      ],
    },
  ];
}

function defaultStrategyFinalConclusions(analysis) {
  const { customer, metrics } = analysis;
  return [
    {
      label: '1. 顾客类型',
      title: analysis.demandType.primary,
      text: '治疗型：主诉面部色斑 7 年加重半年，现病史和医生诊断指向黄褐斑、日光性黑子与面部皮肤松弛；CSKIN 文本、既往皮秒祛斑有效史、皮秒激光 + 美塑疗法方案和 1 月后复诊建议共同支撑治疗主轴。干燥、保湿补水、护肤品为辅助线索，不替代治疗型判断。',
      isPrimary: true,
    },
    {
      label: '2. 生命周期阶段',
      title: `${analysis.lifecycleType.primary} / 治疗复诊逾期唤醒`,
      text: `2026-01-05 到店并完成皮秒、美塑 / 水光等相关项目开单与 1/1 消耗；距医生建议 1 月后复诊窗口约 ${formatNumber(metrics.daysAfterFollowupWindow)} 天。预约、待预约、小程序预约未命中；企微有好友和任务历史，但回访正文、满意度和客户反馈缺失，因此按治疗执行中断后的流失期处理。`,
    },
    {
      label: '项目周期佐证',
      title: analysis.projectCycleRepurchase.statusLabel,
      text: analysis.projectCycleRepurchase.summary,
    },
    {
      label: '动作方向',
      title: '低压复盘当前肤况与复诊必要性',
      text: `${customer.name || '该客户'}的核心不是简单维养营销，而是围绕治疗连续性、复诊逾期和当前肤况确认的低压复盘。`,
    },
  ];
}

function profileStrategyDemandLabel(analysis) {
  return typeof analysis?.demandType === 'string'
    ? analysis.demandType
    : (analysis?.demandType?.primary || '待判断');
}

function profileStrategyLifecycleLabel(analysis) {
  return typeof analysis?.lifecycleType === 'string'
    ? analysis.lifecycleType
    : (analysis?.lifecycleType?.primary || '待判断');
}

function profileStrategyFinalText(analysis, label) {
  const card = (analysis?.strategyFinalConclusions || []).find((item) => item.label === label);
  return card?.text || card?.title || '';
}

function profileStrategyDisplayText(value) {
  return String(value || '')
    .replace(/\[REQ\d{4}\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function profileStrategyCustomerLabel(customer = {}) {
  const masked = String(customer.customerNameMasked || customer.maskedCustomerId || '').trim();
  const isHisId = /^HIS[_-]/i.test(masked);
  return customer.name
    || customer.customerName
    || customer.customerNameFull
    || customer.displayName
    || customer.customerCode
    || (!isHisId ? masked : '')
    || customer.sampleId
    || '实盘顾客';
}

function profileStrategyProjectStatus(analysis) {
  return analysis?.projectCycleRepurchase?.statusLabel
    || profileStrategyFinalText(analysis, '项目周期佐证')
    || '见项目周期佐证';
}

function profileStrategyFollowupDays(metrics = {}) {
  return Number.isFinite(Number(metrics.daysAfterFollowupWindow))
    ? `${formatNumber(metrics.daysAfterFollowupWindow)} 天`
    : '-';
}

function profileStrategyFindMatrixPoint(analysis, labels = []) {
  const wanted = new Set(labels);
  let fallback = '';
  for (const priority of (analysis?.classificationEvidenceMatrix || [])) {
    for (const point of (priority.points || [])) {
      if (!wanted.has(point.label) || !point.text) continue;
      const text = profileStrategyDisplayText(point.text);
      if (!fallback) fallback = text;
      if (!/缺失|未命中|无法确认|不能判断|gray缺失/.test(text)) return text;
    }
  }
  return fallback;
}

function profileStrategyConclusionTitle(analysis, card = {}) {
  const explicitTitle = profileStrategyDisplayText(card.title || '');
  if (explicitTitle && explicitTitle !== card.label) return explicitTitle;
  if (card.label === '1. 顾客类型') return profileStrategyDemandLabel(analysis);
  if (card.label === '2. 生命周期阶段') return profileStrategyLifecycleLabel(analysis);
  if (card.label === '项目周期佐证') {
    const lifecycle = profileStrategyLifecycleLabel(analysis);
    if (/未消耗/.test(lifecycle)) return '已到消耗后待激活窗口';
    if (/治疗执行/.test(lifecycle)) return '处于治疗复诊衔接窗口';
    if (/稳固/.test(lifecycle)) return '进入疗程稳固观察窗口';
    if (/维养/.test(lifecycle)) return '进入周期维养窗口';
    if (/流失/.test(lifecycle)) return '已超过合理复诊窗口';
    return '项目周期待顾问复核';
  }
  if (card.label === '动作方向') return '按当前阶段做人工跟进';
  return explicitTitle || card.label;
}

function profileStrategyConclusionEvidence(analysis, card = {}, title = '') {
  const text = profileStrategyDisplayText(card.evidence || card.text || card.summary || '');
  const normalizedText = text.replace(/[。；，,\s]/g, '');
  const normalizedTitle = String(title || '').replace(/[。；，,\s]/g, '');
  const repeatsTitle = normalizedText === normalizedTitle
    || normalizedText === `${normalizedTitle}待确认`
    || normalizedText === `${normalizedTitle}需顾问确认`;
  if (text && !repeatsTitle && text !== card.label && text !== title) return text;
  if (card.label === '1. 顾客类型') {
    return profileStrategyFindMatrixPoint(analysis, ['项目内容', '皮肤检测', '方案与建议', '咨询主诉'])
      || '依据 P1 诉求/检测与 P2 项目内容得出，缺失项仅作待确认。';
  }
  if (card.label === '2. 生命周期阶段') {
    return profileStrategyFindMatrixPoint(analysis, ['到店窗口', '复诊窗口', 'course/划扣', '周期表佐证'])
      || '依据 P2 项目消耗与 P3 到店/预约窗口得出，待确认项需顾问复核。';
  }
  if (card.label === '项目周期佐证') {
    return profileStrategyFindMatrixPoint(analysis, ['周期表佐证', '到店窗口', '复诊窗口'])
      || '项目周期证据不足，需要顾问按项目和到店窗口补充核验。';
  }
  if (card.label === '动作方向') {
    return '动作只作为顾问侧跟进建议，需结合当前阶段、缺失证据和人工复核执行。';
  }
  return text;
}

function renderStrategyConclusionPanel(analysis) {
  const reasoningSteps = Array.isArray(analysis.strategyReasoningSteps) && analysis.strategyReasoningSteps.length
    ? analysis.strategyReasoningSteps
    : defaultStrategyReasoningSteps(analysis);
  const finalConclusions = Array.isArray(analysis.strategyFinalConclusions) && analysis.strategyFinalConclusions.length
    ? analysis.strategyFinalConclusions
    : defaultStrategyFinalConclusions(analysis);
  return `
    <section class="strategy-reasoning-section">
      <div class="strategy-section-head">
        <span>证据推理过程</span>
      </div>
      <div class="strategy-reasoning-grid">
        ${reasoningSteps.map((step) => {
          const stepTitle = profileStrategyDisplayText(step.title || '');
          const shouldShowStepTitle = stepTitle && stepTitle !== step.label;
          return `
          <article>
            <span>${escapeHtml(step.label)}</span>
            ${shouldShowStepTitle ? `<strong>${escapeHtml(stepTitle)}</strong>` : ''}
            ${Array.isArray(step.bullets) && step.bullets.length
              ? `<ul>${step.bullets.map((bullet) => `<li>${escapeHtml(profileStrategyDisplayText(bullet))}</li>`).join('')}</ul>`
              : `<p>${escapeHtml(profileStrategyDisplayText(step.text || step.summary || ''))}</p>`}
          </article>
        `;
        }).join('')}
      </div>
    </section>
    <section class="strategy-final-section">
      <div class="strategy-section-head">
        <span>最终结论</span>
      </div>
      <div class="strategy-final-grid">
        ${finalConclusions.map((card) => {
          const title = profileStrategyConclusionTitle(analysis, card);
          const evidence = profileStrategyConclusionEvidence(analysis, card, title);
          return `
          <article class="${card.isPrimary ? 'is-primary' : ''}">
            <span>${escapeHtml(card.label)}</span>
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(evidence)}</p>
          </article>
        `;
        }).join('')}
      </div>
    </section>
  `;
}

function normalizeProfileStrategyMethodologyForUi(methodology = {}) {
  const fallback = {
    intro: '',
    methodologySections: [
      { id: 'step_1_select_target_group', title: 'Step 1｜选定目标客户群体', body: '以 RFM 非 A 作为非 VIP 前置筛选，锁定场景一「皮肤维养诉求·认可但节奏中断型」目标客群；RFM 缺失不自动入池，转数据补全 / 人工复核。' },
      { id: 'step_2_build_panorama', title: 'Step 2｜构建用户全景档案', body: '核验病例、诊断、检测、项目、消费、到店和互动等信息点是否齐全，建立 376 × 230 信息点索引的用户全景档案，作为后续判断的证据底座。' },
      { id: 'step_3_type_then_stage', title: 'Step 3｜客户画像类型分析（判断类型和生命周期）', body: '按 P1-P4 证据链先判定诉求类型（治疗/维养/抗衰/美化/整全护肤），再判定生命周期阶段（尝鲜、治疗执行、稳固、维养、未消耗、流失、高潜或风险勿扰）；证据不足必须输出「不确定」。详见「画像判断方法论」Tab。' },
      { id: 'step_4_interaction_goal', title: 'Step 4｜定义互动目标', body: '每个客户只定义一个当前最该达成的目标，例如治疗复诊、巩固疗程、未消耗激活、低压唤醒或转人工经营。' },
      { id: 'step_5_content_angle', title: 'Step 5｜生成沟通角度方案（H5 + 话术）', body: '产出顾问内部分析、可审核话术、H5 信息草稿和禁用表达，交由顾问校验；系统不得自动发送或自动发布。' },
      { id: 'step_6_send_ab_test', title: 'Step 6｜发送消息与 A/B 测试', body: '顾问审核通过后，发送与发布全部停在人工门禁；在同一类客户里做内容 A/B 测试并保留对照，不简单比较「发了 vs 没发」。' },
      { id: 'step_7_feedback_improve', title: 'Step 7｜客户反馈与改进', body: '记录顾问采纳、暂缓、勿扰、不采纳原因、客户响应、预约、到店和 D+30 转化反馈，回流校准规则。' },
      { id: 'demand_type_standard', title: 'Step 3.1｜先判诉求类型（客户为什么需要回来）', body: '允许类型：治疗型、维养型、抗衰型、美化型、整全护肤型。主要依赖 P1（病例 / 医生诊断 / CSKIN）与 P2（项目 / 消耗），P4 可做人工修正。' },
      { id: 'lifecycle_stage_standard', title: 'Step 3.2｜再判生命周期阶段（客户当前卡在哪儿）', body: '允许阶段：尝鲜、治疗执行、稳固、维养、未消耗待激活、流失、高潜升级、风险/勿扰。在类型已定的基础上，综合 P1、P2、P3 三层证据判断，P4 兜底修正；不确定时须顾问确认。' },
    ],
    evidencePriorities: [
      { code: 'P1', title: '病例 / 医生诊断 / CSKIN / 治疗方案', rule: '保留主诉、诊断、皮肤检测或 CSKIN 指数、医生建议和病历边界；皮肤检测优先读取已更新 CSKIN。既支撑 Step 3.1 的诉求类型判断，也为 Step 3.2 的阶段判断提供治疗节点锚点。' },
      { code: 'P2', title: '项目 / 治疗次数 / 消耗', rule: '只写订单、项目、course/划扣、剩余次数、项目周期和商品边界；退款退货统一移到 P4。既校正 Step 3.1 的类型结论，也为 Step 3.2 的阶段判断提供疗程完成度与消耗节奏。' },
      { code: 'P3', title: '时间窗口 / AI听记 / 预约与回访', rule: '写到店窗口、复诊/复查窗口、预约缺口、AI听记命中情况、企微回访正文；不得混入余额、积分、增值金。主要在 P1、P2 已定类型的基础上，为 Step 3.2 的阶段判断提供行为节奏与互动缺口。' },
      { code: 'P4', title: '风险控制 / 人工修正', rule: '只写投诉、理赔、退款、勿扰、黑名单、特殊情况、满意度和当前肤况缺口。作为 Step 3.1、Step 3.2 共用的兜底修正入口，可改判诉求类型或生命周期阶段，不是独立判断步骤。' },
    ],
    demandTypeStandards: [
      { label: '治疗型客户', evaluationBasis: '斑、敏、痘、红斑、炎症、问题肌；以病例、医生诊断、CSKIN/皮肤检测和治疗方案为主证据。', operatingGoal: '维持治疗连续性，让客户按医生建议完成复诊、复查或疗程衔接。', operatingFocus: '强调治疗连续性和复诊周期，展示检测或改善证据，避免简单推项目。' },
      { label: '维养型客户', evaluationBasis: '肤色、肤质、暗沉、毛孔、水光、光子、日常状态管理；以项目周期、到店节奏和状态维护诉求为主证据。', operatingGoal: '建立长期维护习惯，帮助客户在合理周期内回到保养节奏。', operatingFocus: '结合季节、紫外线、出游、身份和状态维护，不制造焦虑。' },
      { label: '抗衰型客户', evaluationBasis: '热玛吉、超声炮、紧致提升、年轻化管理、轮廓抗衰；以抗衰项目、医生评估和年度规划线索为主证据。', operatingGoal: '建立年度年轻化规划和效果维持周期，识别需要人工重点经营的高潜客户。', operatingFocus: '强调年度年轻化规划、效果维持周期和医生评估，高潜客户转人工重点经营。' },
      { label: '美化型客户', evaluationBasis: '轮廓调整、鼻部改善、下巴调整、局部形态优化、审美型需求；以审美诉求、医生方案和恢复风险为主证据。', operatingGoal: '降低审美决策风险，确保术前沟通、医生参与和恢复预期清楚。', operatingFocus: '强调审美方案、术前沟通、恢复期和长期效果，复杂需求转人工或医生参与。' },
      { label: '整全护肤型客户', evaluationBasis: '医美后护肤适配、修复维稳、效果维持、医生视角护肤建议；以项目后肤况、护肤品适配和医生建议为主证据。', operatingGoal: '把项目效果维护与护肤适配连接起来，避免把护肤建议变成单纯卖货。', operatingFocus: '只能建立在医生视角、肤质适配和项目关系上，不能变成简单卖货。' },
    ],
    lifecycleStageStandards: [
      { label: '尝鲜期', evaluationBasis: '首次体验、只做过一次、对效果周期认知不足、尚未建立长期信任。', operatingGoal: '让客户理解疗程逻辑，降低不确定感，引导其完成后续安排。', operatingFocus: '先复盘体验和疑虑，再轻量提醒下一步，不直接强推深度项目。' },
      { label: '治疗执行期', evaluationBasis: '有明确治疗问题、医生已有建议、疗程尚未完成、到了推荐回访周期。', operatingGoal: '提醒客户按时回访，维持治疗连续性。', operatingFocus: '围绕医生建议、恢复窗口和复诊必要性沟通，避免把治疗复诊说成营销。' },
      { label: '稳固期', evaluationBasis: '已完成两到三次治疗、初步效果出现、需要继续巩固、可能因好转而中断。', operatingGoal: '强调不要在效果开始出现时中断，帮助完成关键疗程。', operatingFocus: '突出巩固价值和效果稳定，不制造新的焦虑点。' },
      { label: '维养期', evaluationBasis: '主要问题已有改善、进入周期维护，适合季节化和场景化触达。', operatingGoal: '建立长期维养习惯。', operatingFocus: '结合季节、出行、作息、肤况变化做低压提醒。' },
      { label: '未消耗待激活期', evaluationBasis: '已购买项目但尚未消耗，可能遗忘、时间冲突或误以为再次到店还要花钱。', operatingGoal: '明确提醒客户已经付过款，把沟通重点转向什么时候方便来。', operatingFocus: '先说清已购权益和预约便利，不包装成新销售。' },
      { label: '流失期', evaluationBasis: '超过合理回访周期、长时间未到店、无近期互动，可能已转向其他机构。', operatingGoal: '低压唤醒，重新建立联系，不立刻强推开单。', operatingFocus: '先确认当前肤况、近况和是否仍适合触达，再决定是否进入后续经营。' },
      { label: '高潜升级期', evaluationBasis: '消费价值高、项目品类多、回复意愿强，顾问判断有进一步经营空间。', operatingGoal: '从自动化触达转为人工一对一经营。', operatingFocus: '交给顾问做个性化方案和医生评估，不用自动话术承诺效果。' },
      { label: '风险 / 勿扰期', evaluationBasis: '投诉、低满意度、退款、术后不适、顾问标记不宜主动沟通或系统未记录的特殊情况。', operatingGoal: '停止自动触达，交由人工判断。', operatingFocus: '优先处理风险、安抚和合规边界，禁止自动发送或自动承诺。' },
    ],
    strategyRules: [],
  };
  const sectionText = (item = {}) => (
    item.body
    || item.rule
    || (Array.isArray(item.steps) ? item.steps.join('；') : '')
    || (Array.isArray(item.allowedTypes) ? item.allowedTypes.join('、') : '')
    || (Array.isArray(item.allowedStages) ? item.allowedStages.join('、') : '')
    || ''
  );
  return {
    ...methodology,
    intro: typeof methodology.intro === 'string' ? methodology.intro : fallback.intro,
    methodologySections: (Array.isArray(methodology.methodologySections) && methodology.methodologySections.length ? methodology.methodologySections : fallback.methodologySections)
      .filter((item) => item.id !== 'stage_priority_principle')
      .map((item, index) => ({
        id: item.id || `method_${index + 1}`,
        title: item.title || `方法论 ${index + 1}`,
        body: sectionText(item),
      })),
    evidencePriorities: (Array.isArray(methodology.evidencePriorities) && methodology.evidencePriorities.length ? methodology.evidencePriorities : fallback.evidencePriorities)
      .map((item, index) => ({
        code: item.code || `P${index + 1}`,
        title: item.title || `证据优先级 ${index + 1}`,
        rule: item.rule || item.body || '',
      })),
    demandTypeStandards: (Array.isArray(methodology.demandTypeStandards) && methodology.demandTypeStandards.length ? methodology.demandTypeStandards : fallback.demandTypeStandards)
      .map((item, index) => ({
        label: item.label || `诉求类型 ${index + 1}`,
        evaluationBasis: item.evaluationBasis || item.typical || item.signal || '',
        operatingGoal: item.operatingGoal || item.businessGoal || item.feature || item.goal || '',
        operatingFocus: item.operatingFocus || item.operation || item.focus || '',
      })),
    lifecycleStageStandards: (Array.isArray(methodology.lifecycleStageStandards) && methodology.lifecycleStageStandards.length ? methodology.lifecycleStageStandards : fallback.lifecycleStageStandards)
      .map((item, index) => ({
        label: item.label || `生命周期阶段 ${index + 1}`,
        evaluationBasis: item.evaluationBasis || item.signal || item.typical || '',
        operatingGoal: item.operatingGoal || item.goal || item.businessGoal || '',
        operatingFocus: item.operatingFocus || item.operation || item.focus || '',
      })),
    strategyRules: (Array.isArray(methodology.strategyRules) ? methodology.strategyRules : fallback.strategyRules)
      .map((item, index) => ({
        id: item.id || `strategy_${index + 1}`,
        title: item.title || `策略 ${index + 1}`,
        rule: item.rule || item.body || '',
      })),
  };
}

function renderProfileStrategyMethodology(methodologyPayload, variant = 'combined') {
  const methodology = normalizeProfileStrategyMethodologyForUi(methodologyPayload);
  const meta = methodology.meta || {};
  const methodologyVersion = meta.methodologyVersion || 'v1（版本化前）';
  const changedSections = Array.isArray(meta.changedSections) ? meta.changedSections : [];
  const historyVersions = Array.isArray(state.profileStrategyMethodologyHistory?.versions) ? state.profileStrategyMethodologyHistory.versions : [];
  const refreshSummary = state.strategyRefreshGate?.queue?.summary || state.strategyRefreshGate?.summary || {};
  const pipelineSteps = methodology.methodologySections.filter((item) => /^step_\d+/.test(item.id));
  const isPipelineOnly = variant === 'pipeline';
  const isProfileOnly = variant === 'profile';
  const activeTab = isPipelineOnly ? 'pipeline' : isProfileOnly ? 'profile' : state.profileStrategyMethodologyTab || 'pipeline';
  const shouldShowTabs = !isPipelineOnly && !isProfileOnly;
  const shouldShowPipeline = isPipelineOnly || activeTab === 'pipeline';
  const shouldShowProfile = isProfileOnly || activeTab === 'profile';
  const panelTitle = isPipelineOnly ? '全流程方法论' : isProfileOnly ? '画像判断方法论' : '方法论与策略中心';
  const panelSubtitle = isPipelineOnly ? '只保留从客群到反馈的 7 步闭环' : isProfileOnly ? 'Step 3 判断标准' : '全流程 · 画像判断 · 动作边界';
  const pipelineBody = (item) => (
    isPipelineOnly
      ? item.body.replace(/详见「画像判断方法论」Tab。?/, '').trim()
      : item.body
  );
  return `
    <section class="profile-strategy-methodology-panel lifecycle-methodology-panel">
      <div class="strategy-section-head profile-methodology-head">
        <div>
          <span>${escapeHtml(panelTitle)}</span>
          <strong>${escapeHtml(panelSubtitle)}</strong>
        </div>
        <button class="secondary-button compact-button" data-profile-methodology-edit type="button">修改</button>
      </div>
      <div class="profile-methodology-version-strip">
        <article>
          <span>当前方法论版本</span>
          <strong>${escapeHtml(methodologyVersion)}</strong>
        </article>
        <article>
          <span>最近变更</span>
          <strong>${changedSections.length ? `${formatNumber(changedSections.length)} 个章节变更` : '无实质变更'}</strong>
        </article>
        <article>
          <span>刷新待办</span>
          <strong>${formatNumber(refreshSummary.pending || 0)} 待确认 · ${formatNumber(refreshSummary.readyToApply || 0)} 待生效</strong>
        </article>
      </div>
      ${methodology.intro ? `<p class="lifecycle-methodology-intro">${escapeHtml(methodology.intro)}</p>` : ''}
      ${shouldShowTabs ? `<div class="profile-methodology-tabs" role="tablist">
        <button type="button" class="profile-methodology-tab ${activeTab === 'pipeline' ? 'is-active' : ''}" data-methodology-tab="pipeline" role="tab" aria-selected="${activeTab === 'pipeline'}">全流程方法论 · 7 步</button>
        <button type="button" class="profile-methodology-tab ${activeTab === 'profile' ? 'is-active' : ''}" data-methodology-tab="profile" role="tab" aria-selected="${activeTab === 'profile'}">画像判断方法论 · Step 3 内部</button>
      </div>` : ''}

      ${shouldShowPipeline ? `<div class="profile-methodology-tabpane is-active" data-methodology-pane="pipeline" role="tabpanel">
        <ol class="profile-strategy-pipeline-list">
          ${pipelineSteps.map((item) => `
            <li class="profile-strategy-pipeline-step ${item.id === 'step_3_type_then_stage' ? 'is-anchor' : ''}">
              <div class="pipeline-step-head">
                <strong>${escapeHtml(item.title)}</strong>
                ${item.id === 'step_3_type_then_stage' ? '<span class="pipeline-step-anchor">画像核心</span>' : ''}
              </div>
              <p>${escapeHtml(pipelineBody(item))}</p>
            </li>
          `).join('')}
        </ol>
      </div>` : ''}

      ${shouldShowProfile ? `<div class="profile-methodology-tabpane is-active" data-methodology-pane="profile" role="tabpanel">
        <div class="profile-methodology-substep">
          <div class="strategy-section-head">
            <span>底层机制 · P1-P4 证据链</span>
            <strong>Step 3.1 与 Step 3.2 共同依赖</strong>
          </div>
          <div class="profile-strategy-priority-grid">
            ${methodology.evidencePriorities.map((item) => `
              <article>
                <b>${escapeHtml(item.code)}</b>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.rule)}</p>
              </article>
            `).join('')}
          </div>
        </div>

        <div class="profile-methodology-substep">
          <div class="strategy-section-head">
            <span>Step 3.1｜先判诉求类型</span>
            <strong>依据 P1 + P2，P4 修正</strong>
          </div>
          <div class="profile-strategy-standard-grid is-demand">
            ${methodology.demandTypeStandards.map((item) => `
              <article>
                <strong>${escapeHtml(item.label)}</strong>
                <p><b>评判依据：</b>${escapeHtml(item.evaluationBasis)}</p>
                <p><b>运营目标：</b>${escapeHtml(item.operatingGoal)}</p>
                <p><b>运营重点：</b>${escapeHtml(item.operatingFocus)}</p>
              </article>
            `).join('')}
          </div>
        </div>

        <div class="profile-methodology-substep">
          <div class="strategy-section-head">
            <span>Step 3.2｜再判生命周期阶段</span>
            <strong>依据 P1 + P2 + P3，P4 兜底</strong>
          </div>
          <div class="profile-strategy-standard-grid">
            ${methodology.lifecycleStageStandards.map((item) => `
              <article>
                <strong>${escapeHtml(item.label)}</strong>
                <p><b>评判依据：</b>${escapeHtml(item.evaluationBasis)}</p>
                <p><b>运营目标：</b>${escapeHtml(item.operatingGoal)}</p>
                <p><b>运营重点：</b>${escapeHtml(item.operatingFocus)}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </div>` : ''}

      ${!isPipelineOnly && methodology.strategyRules.length ? `
        <div class="profile-strategy-rule-block">
          <div class="strategy-section-head">
            <span>总策略规则</span>
            <strong>全流程共同遵循</strong>
          </div>
          <div class="profile-strategy-rule-grid">
            ${methodology.strategyRules.map((item) => `
              <article>
                <span>${escapeHtml(item.title)}</span>
                <p>${escapeHtml(item.rule)}</p>
              </article>
            `).join('')}
          </div>
        </div>
      ` : ''}
      ${!isPipelineOnly ? renderProfileStrategyEvolutionCandidates() : ''}
      ${!isPipelineOnly && historyVersions.length ? `
        <div class="profile-methodology-history">
          <div class="strategy-section-head">
            <span>历史版本</span>
            <strong>只读记录 · append-only</strong>
          </div>
          ${historyVersions.slice(0, 5).map((item) => `
            <details>
              <summary>
                <b>${escapeHtml(item.methodologyVersion || '')}</b>
                <span>${escapeHtml((item.archivedAt || '').replace('T', ' ').slice(0, 16))}</span>
                <small>${formatNumber((item.changedSections || []).length)} 个 diff</small>
              </summary>
              <div class="profile-methodology-history-body">
                ${(item.changedSections || []).slice(0, 12).map((section) => `
                  <p><b>${escapeHtml(section.changeType || '')}</b> ${escapeHtml(section.title || section.sectionId || '')}</p>
                `).join('') || '<p>本次保存无实质章节变更。</p>'}
                <pre>${escapeHtml(JSON.stringify(item.methodology || {}, null, 2).slice(0, 6000))}</pre>
              </div>
            </details>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `;
}

function renderProfileStrategyEvolutionCandidates() {
  const payload = state.profileStrategyEvolutionCandidates || {};
  const candidates = [
    ...(payload.ruleCandidates || []).map((item) => ({ ...item, typeLabel: '规则候选' })),
    ...(payload.promptRevisionCandidates || []).map((item) => ({ ...item, typeLabel: 'Prompt 候选' })),
    ...(payload.mappingFixCandidates || []).map((item) => ({ ...item, typeLabel: '映射候选' })),
  ].slice(0, 12);
  const summary = payload.summary || {};
  if (!candidates.length && !summary.watchlist) return '';
  return `
    <div class="profile-methodology-history profile-strategy-evolution-block">
      <div class="strategy-section-head">
        <span>P5 策略进化候选</span>
        <strong>${formatNumber(summary.totalCandidates || 0)} 候选 · ${formatNumber(summary.watchlist || 0)} 观察项</strong>
      </div>
      ${candidates.length ? candidates.map((item) => {
        const candidateId = item.candidateId || item.mappingCandidateId || '';
        const decision = item.strategyEvolutionDecision || item.decisionStatus || item.status || 'pending_manual_review';
        return `
          <details open>
            <summary>
              <b>${escapeHtml(item.typeLabel)}</b>
              <span>${escapeHtml(item.constantName || item.agentKey || item.infoPointId || candidateId)}</span>
              <small>${escapeHtml(decision)}</small>
            </summary>
            <div class="profile-methodology-history-body">
              <p>${escapeHtml(item.reasoning || item.proposedChange || item.sectionAfter || '等待人工复核。')}</p>
              <p><b>证据数：</b>${formatNumber(item.evidenceCount || 0)} · <b>失败模式：</b>${escapeHtml(item.failureMode || '')}</p>
              ${decision === 'pending_manual_review' ? `
                <div class="backend-actions">
                  <button class="secondary-button compact-button" type="button" data-profile-evolution-action="reject" data-candidate-id="${escapeHtml(candidateId)}">驳回</button>
                  <button class="primary-button compact-button" type="button" data-profile-evolution-action="accept" data-candidate-id="${escapeHtml(candidateId)}">采纳为待办</button>
                </div>
              ` : ''}
            </div>
          </details>
        `;
      }).join('') : '<p class="lifecycle-methodology-intro">样本未达到提案阈值，候选仍在观察中。</p>'}
    </div>
  `;
}

function renderProfileStrategyMethodologyRoots(methodologyPayload) {
  const renderedRoots = new Set();
  const standaloneRoot = document.getElementById('standalone-methodology-root');
  if (standaloneRoot) {
    standaloneRoot.innerHTML = renderProfileStrategyMethodology(methodologyPayload, 'pipeline');
    renderedRoots.add(standaloneRoot);
  }
  const profileRoot = document.getElementById('profile-strategy-methodology-root');
  if (profileRoot) {
    profileRoot.innerHTML = renderProfileStrategyMethodology(methodologyPayload, 'profile');
    renderedRoots.add(profileRoot);
  }
  $$('.profile-strategy-methodology-root').forEach((root) => {
    if (!renderedRoots.has(root)) {
      root.innerHTML = renderProfileStrategyMethodology(methodologyPayload);
    }
  });
}

function clearProfileStrategyMethodologyRoots() {
  $$('.profile-strategy-methodology-root').forEach((root) => {
    root.innerHTML = '';
  });
}

function profileMethodologyTextarea(value, attrs = '') {
  return `<textarea ${attrs}>${escapeHtml(value || '')}</textarea>`;
}

function profileMethodologyInput(value, attrs = '') {
  return `<input ${attrs} value="${escapeHtml(value || '')}">`;
}

function renderProfileMethodologyEditor(methodologyPayload) {
  const methodology = normalizeProfileStrategyMethodologyForUi(methodologyPayload);
  return `
    <div class="profile-methodology-modal" id="profile-strategy-methodology-modal" role="dialog" aria-modal="true" aria-labelledby="profile-methodology-title">
      <div class="profile-methodology-dialog">
        <header class="profile-methodology-toolbar">
          <div>
            <span>策略中心方法论</span>
            <h3 id="profile-methodology-title">修改方法论与策略规则</h3>
          </div>
          <button class="secondary-button compact-button" type="button" data-profile-methodology-close>关闭</button>
        </header>
        <div class="profile-methodology-form">
          <section>
            <h4>方法论 <button class="secondary-button compact-button" type="button" data-profile-methodology-add-section>添加 2.1 章节</button></h4>
            <div class="profile-methodology-editor-grid">
              ${methodology.methodologySections.map((item, index) => `
                <article class="profile-methodology-editor-card" data-methodology-section data-id="${escapeHtml(item.id)}">
                  <b>方法 ${index + 1}</b>
                  <label><span>标题</span>${profileMethodologyInput(item.title, 'data-field="title"')}</label>
                  <label><span>内容</span>${profileMethodologyTextarea(item.body, 'data-field="body" rows="4"')}</label>
                </article>
              `).join('')}
            </div>
          </section>
          <section>
            <h4>P1-P4 证据优先级</h4>
            <div class="profile-methodology-editor-grid">
              ${methodology.evidencePriorities.map((item, index) => `
                <article class="profile-methodology-editor-card" data-evidence-priority>
                  <b>优先级 ${index + 1}</b>
                  <label><span>编号</span>${profileMethodologyInput(item.code, 'data-field="code"')}</label>
                  <label><span>标题</span>${profileMethodologyInput(item.title, 'data-field="title"')}</label>
                  <label><span>规则</span>${profileMethodologyTextarea(item.rule, 'data-field="rule" rows="4"')}</label>
                </article>
              `).join('')}
            </div>
          </section>
          <section>
            <h4>诉求类型判断标准</h4>
            <div class="profile-methodology-editor-grid">
              ${methodology.demandTypeStandards.map((item, index) => `
                <article class="profile-methodology-editor-card" data-demand-type-standard>
                  <b>诉求类型 ${index + 1}</b>
                  <label><span>类型</span>${profileMethodologyInput(item.label, 'data-field="label"')}</label>
                  <label><span>评判依据</span>${profileMethodologyTextarea(item.evaluationBasis, 'data-field="evaluationBasis" rows="3"')}</label>
                  <label><span>运营目标</span>${profileMethodologyTextarea(item.operatingGoal, 'data-field="operatingGoal" rows="3"')}</label>
                  <label><span>运营重点</span>${profileMethodologyTextarea(item.operatingFocus, 'data-field="operatingFocus" rows="3"')}</label>
                </article>
              `).join('')}
            </div>
          </section>
          <section>
            <h4>生命周期阶段判断标准</h4>
            <div class="profile-methodology-editor-grid">
              ${methodology.lifecycleStageStandards.map((item, index) => `
                <article class="profile-methodology-editor-card" data-lifecycle-stage-standard>
                  <b>生命周期 ${index + 1}</b>
                  <label><span>阶段</span>${profileMethodologyInput(item.label, 'data-field="label"')}</label>
                  <label><span>评判依据</span>${profileMethodologyTextarea(item.evaluationBasis, 'data-field="evaluationBasis" rows="3"')}</label>
                  <label><span>运营目标</span>${profileMethodologyTextarea(item.operatingGoal, 'data-field="operatingGoal" rows="3"')}</label>
                  <label><span>运营重点</span>${profileMethodologyTextarea(item.operatingFocus, 'data-field="operatingFocus" rows="3"')}</label>
                </article>
              `).join('')}
            </div>
          </section>
          ${methodology.strategyRules.length ? `
            <section>
              <h4>策略中心规则</h4>
              <div class="profile-methodology-editor-grid">
                ${methodology.strategyRules.map((item, index) => `
                  <article class="profile-methodology-editor-card" data-strategy-rule data-id="${escapeHtml(item.id)}">
                    <b>策略 ${index + 1}</b>
                    <label><span>标题</span>${profileMethodologyInput(item.title, 'data-field="title"')}</label>
                    <label><span>内容</span>${profileMethodologyTextarea(item.rule, 'data-field="rule" rows="4"')}</label>
                  </article>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
        <footer class="profile-methodology-modal-footer">
          <span>保存到本地方法论 JSON；不写远端源库，不自动发送。</span>
          <div>
            <button class="secondary-button compact-button" type="button" data-profile-methodology-close>取消</button>
            <button class="primary-button compact-button" type="button" data-profile-methodology-save>确定保存</button>
          </div>
        </footer>
      </div>
    </div>
  `;
}

function openProfileStrategyMethodologyModal() {
  closeProfileStrategyMethodologyModal();
  document.body.insertAdjacentHTML('beforeend', renderProfileMethodologyEditor(state.profileStrategyMethodology));
}

function addProfileMethodologyPsychologySection() {
  const modal = document.getElementById('profile-strategy-methodology-modal');
  const grid = modal?.querySelector('[data-methodology-section]')?.parentElement;
  if (!grid || grid.querySelector('[data-id="methodology_2_1_psychology_dimensions"]')) return;
  const index = grid.querySelectorAll('[data-methodology-section]').length + 1;
  grid.insertAdjacentHTML('beforeend', `
    <article class="profile-methodology-editor-card" data-methodology-section data-id="methodology_2_1_psychology_dimensions">
      <b>方法 ${formatNumber(index)}</b>
      <label><span>标题</span>${profileMethodologyInput('Step 2.1｜三个心理学维度', 'data-field="title"')}</label>
      <label><span>内容</span>${profileMethodologyTextarea('', 'data-field="body" rows="4" placeholder="由人工补录：认同价值 / 节奏中断原因 / 重启心理门槛等定稿内容"')}</label>
    </article>
  `);
}

function closeProfileStrategyMethodologyModal() {
  document.getElementById('profile-strategy-methodology-modal')?.remove();
}

function collectProfileMethodologyFormValue() {
  const modal = document.getElementById('profile-strategy-methodology-modal');
  if (!modal) return normalizeProfileStrategyMethodologyForUi(state.profileStrategyMethodology);
  const readField = (card, field) => card.querySelector(`[data-field="${field}"]`)?.value.trim() || '';
  return {
    intro: '',
    methodologySections: Array.from(modal.querySelectorAll('[data-methodology-section]')).map((card, index) => ({
      id: card.dataset.id || `method_${index + 1}`,
      title: readField(card, 'title'),
      body: readField(card, 'body'),
    })),
    evidencePriorities: Array.from(modal.querySelectorAll('[data-evidence-priority]')).map((card, index) => ({
      code: readField(card, 'code') || `P${index + 1}`,
      title: readField(card, 'title'),
      rule: readField(card, 'rule'),
    })),
    demandTypeStandards: Array.from(modal.querySelectorAll('[data-demand-type-standard]')).map((card, index) => ({
      label: readField(card, 'label') || `诉求类型 ${index + 1}`,
      evaluationBasis: readField(card, 'evaluationBasis'),
      operatingGoal: readField(card, 'operatingGoal'),
      operatingFocus: readField(card, 'operatingFocus'),
    })),
    lifecycleStageStandards: Array.from(modal.querySelectorAll('[data-lifecycle-stage-standard]')).map((card, index) => ({
      label: readField(card, 'label') || `生命周期阶段 ${index + 1}`,
      evaluationBasis: readField(card, 'evaluationBasis'),
      operatingGoal: readField(card, 'operatingGoal'),
      operatingFocus: readField(card, 'operatingFocus'),
    })),
    strategyRules: Array.from(modal.querySelectorAll('[data-strategy-rule]')).map((card, index) => ({
      id: card.dataset.id || `strategy_${index + 1}`,
      title: readField(card, 'title'),
      rule: readField(card, 'rule'),
    })),
  };
}

async function saveProfileStrategyMethodologyFromModal() {
  const button = document.querySelector('[data-profile-methodology-save]');
  const originalText = button?.textContent || '确定保存';
  if (button) {
    button.disabled = true;
    button.textContent = '保存中';
  }
  try {
    const methodology = collectProfileMethodologyFormValue();
    const response = await postApi(PROFILE_STRATEGY_METHODOLOGY_API, {
      actor: 'profile_strategy_center_ui',
      methodology,
    });
    state.profileStrategyMethodology = response.methodology;
    await loadProfileStrategyMethodologyOnly({ force: true });
    closeProfileStrategyMethodologyModal();
    renderProfileStrategyMethodologyRoots(state.profileStrategyMethodology);
    if (state.chenSceneUserMdFixture) {
      renderLifecyclePayload(state.lifecyclePayload, state.chenSceneUserMdFixture, state.profileStrategyCenterAnalysis);
    }
  } catch (error) {
    showFloatingError(`方法论保存失败：${error.message}`);
  } finally {
    if (button?.isConnected) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

function renderChenLifecycleAgentAnalysis(analysis) {
  const { customer = {}, metrics = {} } = analysis;
  const customerLabel = profileStrategyCustomerLabel(customer);
  const demandTypeLabel = profileStrategyDemandLabel(analysis);
  const lifecycleTypeLabel = profileStrategyLifecycleLabel(analysis);
  const projectCycleStatusLabel = profileStrategyProjectStatus(analysis);
  const projectCycleSummary = analysis.projectCycleRepurchase?.summary || profileStrategyFinalText(analysis, '项目周期佐证') || '项目周期佐证待补充。';
  const projectCycleAdvisorUse = analysis.projectCycleRepurchase?.advisorUse || projectCycleSummary;
  const projectCycleBoundaries = Array.isArray(analysis.projectCycleRepurchase?.boundaries)
    ? analysis.projectCycleRepurchase.boundaries
    : ['缺失项和待确认项仅作为补证方向，不作为正向依据。'];
  const sourceTags = analysis.sourceTags || {};
  const classificationEvidenceMatrix = Array.isArray(analysis.classificationEvidenceMatrix) && analysis.classificationEvidenceMatrix.length
    ? analysis.classificationEvidenceMatrix
    : [
    {
      priority: 'P1',
      title: '病例 / 医生诊断 / CSKIN / 治疗方案',
      isPrimary: true,
      points: [
        { label: '主诉与病史', text: '主诉面部色斑 7 年、加重半年。' },
        { label: '现病史', text: '双侧颧部、面颊部对称淡褐色色素沉着斑；夏季加重、入冬减轻；居家护肤及防晒欠佳。' },
        { label: '医生诊断', text: '诊断黄褐斑、日光性黑子、面部皮肤松弛。' },
        { label: '当天皮肤', text: '面部皮肤干燥松弛，眼周细纹明显；浅红色斑合并毛细血管扩张，散在褐色斑点。' },
        { label: 'CSKIN 文本', text: '病历写到 CSKIN 拍照显示颧部、面颊部紫外线色斑和棕色斑明显，并合并毛细血管扩张。' },
        { label: '医美史', text: '曾行皮秒激光局部祛斑，效果可；本次资料未写明机构。' },
        { label: '方案与建议', text: '方案含皮秒激光 + 美塑疗法；建议皮秒美白淡斑、美塑保湿补水；1 月后复诊，不适随访。' },
        { label: '处方线索', text: '有 1 条待处方记录：补注射（单）qty=1，医生杨慧，状态 0；正式 prescriptions 表未命中。' },
        { label: '排除证据', text: '未见玫瑰痤疮诊断；无太田痣证据；无脸型 / 轮廓 / 容量缺失明确记录。' },
      ],
      use: '',
    },
    {
      priority: 'P2',
      title: '项目 / 治疗次数 / 消耗',
      points: [
        { label: '订单事实', text: '2026-01-05 有 2 张 HIS 订单，对应企微销售订单 2 条；已付款，无欠费。' },
        { label: '开单项目', text: '购买补注射（单）、进口YS超皮秒/蜂巢皮秒（全脸）（单）、Dr.Song 消炎水光（单）、Dr.Song 大师霜及商品。' },
        { label: '金额状态', text: '企微 / CRM 展示金额合计 7974.00；两张订单 BillStatus=3，企微 payStatus=ALL_PAY。' },
        { label: 'course/划扣', text: '上述 4 个服务项目进入 course 并完成 1/1 划扣，IsUse=1，服务项目剩余次数均为 0。' },
        { label: '疗程形态', text: '本次课程均为 1 次，未见多次疗程卡或护理六次卡。' },
        { label: '商品说明', text: '商品类只确认已开单付款，商品无 course 记录，不能按服务项目消耗理解。' },
        { label: '周期表佐证', text: '超皮秒 1-3 月、消炎水光 1 月等周期均已过复购 / 复查窗口，且已过恢复期。' },
      ],
      use: '',
      },
    {
      priority: 'P3',
      title: '时间窗口和互动',
      points: [
        { label: '到店窗口', text: `2026-01-05 到店且付款完成；截至 ${LIFECYCLE_ANALYSIS_DATE} 距上次到店约 ${formatNumber(metrics.daysSinceLastVisit)} 天。` },
        { label: '复诊窗口', text: `医生建议 1 月后复诊；截至 ${LIFECYCLE_ANALYSIS_DATE} 距建议复诊窗口约 ${formatNumber(metrics.daysAfterFollowupWindow)} 天。` },
        { label: '预约缺口', text: '未找到预约 / 待预约记录，无未来预约证据；AppointmentId=null，预约表未命中，也没有预约未到店证据。' },
        { label: '小程序/待预约', text: '未找到小程序预约、HIS 预约同步或待预约记录。' },
        { label: 'AI听记', text: '接待录音、AI 预诊报告、录音转写文本和 AI 综合报告均未命中。' },
        { label: '企微好友', text: '已加企微好友，添加时间 2026-01-05 17:44:48，isUnbind=N。' },
        { label: '回访任务', text: '按 customer=11448362877 命中 6 条任务历史，6 条均为 SUCCESS；回访员工 ID 为 9433124347，中文姓名未命中。' },
        { label: '回访内容', text: '任务历史 msg=null，未记录回访正文；企微会话仅有客户发送“我是陈喜生”。' },
        { label: '互动素材', text: '未命中沟通素材发送记录、朋友圈分享记录、客户反馈文本、满意度或回访反馈。' },
      ],
      use: '',
      },
    {
      priority: 'P4',
      title: '风险控制 / 人工修正',
      points: [
        { label: '投诉理赔', text: '未找到陈喜生客诉、理赔、投诉内容、处理结果或服务不满记录。' },
        { label: '退款退货', text: '本次两张订单均未退款；退款金额为 0，未找到退款记录或退款明细。' },
        { label: '负向风险', text: '当前未命中勿扰、黑名单或强风险记录。' },
        { label: '过敏/划痕', text: '病历中可见划痕症阴性；否认药物过敏、手术外伤、传染病和遗传性疾病家族史。' },
        { label: '签字资料', text: '未找到知情同意记录、签字照片、病历图片、客户图片；到访表 hand_signed_image=null。' },
        { label: '反馈缺口', text: '满意度、治疗后反馈、当前肤况、是否外院处理均缺失。' },
        { label: '修正范围', text: '如顾问掌握不适合触达、近期不适等系统外信息，应由人工修正阶段与动作。' },
      ],
      use: '',
      },
      ];
  const contextCards = Array.isArray(analysis.contextCards) && analysis.contextCards.length
    ? analysis.contextCards
    : [
        { label: '客户身份', text: '陈喜生，约 52 岁，粉星会员；来源为客户推荐 / 老带新。' },
        { label: '非 VIP 前置', text: 'RFM 等级 C；R=90-180 天，F=1 次，M=2K-10K，场景一非 VIP 前置通过。' },
        { label: '机构与医生', text: '门店为****诊所；客户主表所属医生和病历医生为杨慧，到访登记医生为祝媛园。' },
      ];
  const preservedAgentDimensions = [
    {
      title: '个人 AI 画像与消费模型',
      conclusion: `RFM ${customer.rfmGrade || '待补'} 非 VIP 老客；当前策略中心判定为${demandTypeLabel} / ${lifecycleTypeLabel}。`,
      reasons: [sourceTags.identity, sourceTags.demand, sourceTags.plan, `${sourceTags.order}；${sourceTags.consumption}`],
    },
    {
      title: '项目复购周期与稳固判断',
      conclusion: projectCycleSummary,
      reasons: [projectCycleAdvisorUse, ...projectCycleBoundaries],
    },
    {
      title: '核心驱动因素',
      conclusion: '治疗连续性中断为主；历史皮秒有效记忆、医生复诊建议和 CSKIN 色斑证据为辅。',
      reasons: analysis.priorityEvidence,
    },
    {
      title: '消费心理与行为阻碍',
      conclusion: '复诊节奏中断、无当前预约、无近期有效互动；是否已外院处理或近期肤况变化不确定。',
      reasons: [sourceTags.appointment, '4 个服务 course 均 1/1 已消耗，不能用“已经付过款还未消耗”作为主沟通抓手。'],
    },
    {
      title: '生命周期诊断',
      conclusion: '治疗执行期已中断，当前按流失期低压唤醒处理；目标是重新建立联系并确认是否方便做医生复盘。',
      reasons: ['不判稳固期：未见 2-3 次连续治疗和初步效果反馈。', '不判维养期：未见主要问题已改善并进入稳定周期维护的证据。'],
    },
    {
      title: '机会评分',
      conclusion: '中｜治疗证据强，但复诊逾期时间长、互动证据弱，适合低压力复盘，不适合高压转化。',
      reasons: ['加分：P1 医生诊断、方案、复诊建议完整；已加企微；无客诉退款命中。', '扣分：距建议复诊窗口约 140 天，且无预约、无有效回访正文、无近期互动反馈。'],
    },
    {
      title: '机会评分细项',
      conclusion: '权重仍需由真实预约、到店和转化反馈继续校准；本版先作为陈喜生首个蓝本。',
      reasons: ['诊断强度高。', '连续性需求高。', '可触达性中。', '结构化检测图像、评分、顾问修正和客户当前状态缺失。'],
    },
    {
      title: '内容策略与 AIDA',
      conclusion: '顾问侧建议先确认近期肤况和时间安排，只作为人工审核输入，不自动发送。',
      reasons: ['提到上次医生建议的复诊节点已过，先关心近期色斑和皮肤稳定情况。', '强调复盘治疗连续性和医生判断，不制造焦虑，不承诺效果。'],
    },
    {
      title: '最终汇总合成',
      conclusion: `${customerLabel}当前主轴为${analysis.headline || `${demandTypeLabel} / ${lifecycleTypeLabel}`}。`,
      reasons: ['分类顺序：P1 医生病历/诊断/CSKIN 文本 -> P2 项目与消耗 -> P3 到店/预约/企微互动 -> P4 顾问修正。'],
    },
  ];
  state.lifecyclePreservedAgentDimensions = preservedAgentDimensions;
  analysis.classificationEvidenceMatrix = classificationEvidenceMatrix;
  state.profileStrategyCenterAnalysis = analysis;
  state.profileStrategyCenterSelectedCaseId = analysis.sampleId || null;
  analysis.strategyConclusion = {
    demandType: demandTypeLabel,
    lifecycleStage: lifecycleTypeLabel,
    reviewTarget: analysis.strategyConclusion?.reviewTarget || '治疗复诊逾期低压唤醒',
  };
  const strategyAnalyses = state.profileStrategyCenterAnalyses?.length ? state.profileStrategyCenterAnalyses : [analysis];
  const profileStrategyMethodology = normalizeProfileStrategyMethodologyForUi(state.profileStrategyMethodology || analysis.methodology || {});
  renderProfileStrategyMethodologyRoots(profileStrategyMethodology);

  $('#ai-insight-status').textContent = customerLabel;
  $('#ai-insight-status').className = 'status-chip is-complete';
  $('#ai-insight-blocker').hidden = true;
  $('#ai-insight-blocker').innerHTML = '';
  const summaryEl = $('#ai-insight-summary');
  if (IS_LIVE_ARCHIVE_MODE) {
    summaryEl.innerHTML = '';
    summaryEl.hidden = true;
  } else {
    summaryEl.hidden = false;
    summaryEl.innerHTML = `
      <article><span>样本</span><strong>${formatNumber(strategyAnalyses.length)} 人</strong></article>
      <article><span>顾客类型</span><strong>${escapeHtml(demandTypeLabel)}</strong></article>
      <article><span>生命周期阶段</span><strong>${escapeHtml(lifecycleTypeLabel)}</strong></article>
      <article><span>项目周期</span><strong>${escapeHtml(projectCycleStatusLabel)}</strong></article>
      <article><span>复诊逾期</span><strong>${escapeHtml(profileStrategyFollowupDays(metrics))}</strong></article>
    `;
  }
  $('#ai-insight-customer-list').innerHTML = strategyAnalyses.map((item) => {
    const itemCustomer = item.customer || {};
    const itemMetrics = item.metrics || {};
    const isActive = (item.sampleId || '') === (analysis.sampleId || '');
    const itemCustomerLabel = profileStrategyCustomerLabel(itemCustomer);
    const itemDemandTypeLabel = profileStrategyDemandLabel(item);
    const itemLifecycleTypeLabel = profileStrategyLifecycleLabel(item);
    return `
      <button class="ai-insight-customer-button ${isActive ? 'is-active' : ''}" data-profile-strategy-case-id="${escapeHtml(item.sampleId || '')}">
        <span>${escapeHtml(itemCustomerLabel)} · RFM ${escapeHtml(itemCustomer.rfmGrade || '待确认')}</span>
        <strong>复诊逾期 ${escapeHtml(profileStrategyFollowupDays(itemMetrics))}</strong>
        <small>
          <b>类型 ${escapeHtml(itemDemandTypeLabel)}</b>
          <b>阶段 ${escapeHtml(itemLifecycleTypeLabel)}</b>
        </small>
      </button>
    `;
  }).join('');
  $('#ai-insight-detail').innerHTML = `
    <div class="ai-detail-head strategy-center-head">
      <div>
        <span>证据推理链路 · 策略中心</span>
        <h3>${escapeHtml(customerLabel)}｜策略中心</h3>
        <div class="strategy-context-strip">
          ${contextCards.map((card) => `
            <article>
              <span>${escapeHtml(card.label)}</span>
              <strong>${escapeHtml(profileStrategyDisplayText(card.text))}</strong>
            </article>
          `).join('')}
        </div>
      </div>
      <div class="ai-detail-badges">
        <span class="status-chip is-complete">类型 ${escapeHtml(demandTypeLabel)}</span>
        <span class="status-chip is-pending">阶段 ${escapeHtml(lifecycleTypeLabel)}</span>
      </div>
    </div>
    ${renderStrategyEvidenceMatrix(classificationEvidenceMatrix)}
    ${renderStrategyConclusionPanel(analysis)}
  `;
}

function profileStrategySyncCustomerOptionFromAnalysis(analysis) {
  const customer = analysis?.customer || {};
  return {
    customerId: analysis?.sampleId || customer.unifiedCustomerId || customer.customerCode || '',
    name: profileStrategyCustomerLabel(customer),
    rfmGrade: customer.rfmGrade || '待确认',
    demandType: profileStrategyDemandLabel(analysis),
    lifecycleType: profileStrategyLifecycleLabel(analysis),
    daysAfterFollowupWindow: analysis?.metrics?.daysAfterFollowupWindow ?? customer.overdueDays ?? null,
    sourceArchiveRunId: analysis?.sourceArchiveRunId || null,
    isAnalyzed: true,
  };
}

function profileStrategySyncOptionLabel(item) {
  const name = item?.name || item?.customerName || item?.displayName || item?.customerCode || '未命名顾客';
  const rfm = item?.rfmGrade ? `RFM ${item.rfmGrade}` : 'RFM 待确认';
  const overdue = item?.daysAfterFollowupWindow !== null && item?.daysAfterFollowupWindow !== undefined
    ? `复诊逾期 ${item.daysAfterFollowupWindow} 天`
    : '复诊逾期待确认';
  return `${name} · ${rfm} · ${overdue}`;
}

function currentProfileStrategySyncMode() {
  const checked = document.querySelector('input[name="profile-strategy-sync-mode"]:checked');
  return checked?.value === 'new' ? 'new' : 'reanalyze';
}

function renderProfileStrategySyncModal() {
  const list = $('#profile-strategy-sync-customer-list');
  const status = $('#profile-strategy-sync-status');
  if (!list || !status) return;
  const mode = currentProfileStrategySyncMode();
  state.profileStrategySyncMode = mode;
  const options = state.profileStrategySyncOptions || {};
  const existingCustomers = safeArray(options.existingCustomers).length
    ? safeArray(options.existingCustomers)
    : safeArray(state.profileStrategyCenterAnalyses).map(profileStrategySyncCustomerOptionFromAnalysis);
  const newCustomers = safeArray(options.newCandidates);
  const rows = mode === 'new' ? newCustomers : existingCustomers;
  const activeId = state.profileStrategyCenterSelectedCaseId || state.profileStrategyCenterAnalysis?.sampleId || '';
  const emptyText = mode === 'new'
    ? '当前档案池暂无未分析候选。'
    : '当前没有已生成画像的顾客。';
  list.innerHTML = rows.length ? rows.map((item) => {
    const id = item.customerId || item.unifiedCustomerId || item.sampleId || item.name || '';
    const checked = mode === 'reanalyze' && activeId && id === activeId ? 'checked' : '';
    return `
      <label class="ds-batch-item ${item.isAnalyzed ? 'is-existing' : ''}">
        <input type="checkbox" value="${escapeHtml(id)}" ${checked} />
        <span>
          <strong>${escapeHtml(profileStrategySyncOptionLabel(item))}</strong>
          <code>${escapeHtml(item.demandType || item.lifecycleType ? `${item.demandType || '类型待确认'} / ${item.lifecycleType || '阶段待确认'}` : (item.sourceLabel || '用户全景档案候选'))}</code>
        </span>
        <em>${escapeHtml(item.isAnalyzed ? '重跑' : '新增')}</em>
      </label>
    `;
  }).join('') : `<div class="empty">${emptyText}</div>`;
  const selectedCount = rows.filter((item) => {
    const id = item.customerId || item.unifiedCustomerId || item.sampleId || item.name || '';
    return mode === 'reanalyze' && activeId && id === activeId;
  }).length;
  status.textContent = mode === 'new'
    ? `新增候选 ${rows.length} 人。`
    : `已分析 ${rows.length} 人，默认选中 ${selectedCount || 0} 人。`;
}

async function loadProfileStrategySyncOptions() {
  if (state.profileStrategySyncOptionsLoading) return state.profileStrategySyncOptions || {};
  const status = $('#profile-strategy-sync-status');
  const reloadButton = $('#reload-profile-strategy-sync-options');
  state.profileStrategySyncOptionsLoading = true;
  if (reloadButton) reloadButton.disabled = true;
  if (status) status.textContent = '正在读取同步候选...';
  try {
    const options = await api(`${PROFILE_STRATEGY_CENTER_LIVE_SYNC_API}/options`);
    state.profileStrategySyncOptions = options;
    renderProfileStrategySyncModal();
    return options;
  } finally {
    state.profileStrategySyncOptionsLoading = false;
    if (reloadButton?.isConnected) reloadButton.disabled = false;
  }
}

async function openProfileStrategySyncModal() {
  if (!IS_LIVE_ARCHIVE_MODE) {
    showFloatingError('同步入口仅用于用户画像分析（Agent 实盘）。');
    return;
  }
  const modal = $('#profile-strategy-sync-modal');
  if (!modal) return;
  modal.hidden = false;
  try {
    await loadProfileStrategySyncOptions();
  } catch (error) {
    const status = $('#profile-strategy-sync-status');
    if (status) status.textContent = `候选读取失败：${error.message}`;
    renderProfileStrategySyncModal();
  }
}

function closeProfileStrategySyncModal() {
  const modal = $('#profile-strategy-sync-modal');
  if (modal) modal.hidden = true;
}

function selectedProfileStrategySyncCustomerIds() {
  return $$('#profile-strategy-sync-customer-list input[type="checkbox"]:checked')
    .map((input) => input.value.trim())
    .filter(Boolean);
}

async function handleProfileStrategySyncModeChange() {
  renderProfileStrategySyncModal();
  try {
    await loadProfileStrategySyncOptions();
  } catch (error) {
    const status = $('#profile-strategy-sync-status');
    if (status) status.textContent = `候选读取失败：${error.message}`;
  }
}

async function refreshProfileStrategyCenterLiveAfterSync(preferredCaseId = '') {
  const preferredId = String(preferredCaseId || '').trim();
  if (preferredId) {
    state.profileStrategyCenterSelectedCaseId = preferredId;
  }
  await loadLifecyclePayload({ force: true });
  if (!preferredId) return state.profileStrategyCenterAnalysis;
  const matched = safeArray(state.profileStrategyCenterAnalyses).find((item) => {
    const customer = item?.customer || {};
    return [item?.sampleId, customer.unifiedCustomerId, customer.customerId, customer.customerCode]
      .filter(Boolean)
      .some((id) => String(id) === preferredId);
  });
  if (matched) {
    state.profileStrategyCenterSelectedCaseId = matched.sampleId || preferredId;
    state.profileStrategyCenterAnalysis = matched;
    renderLifecyclePayload(state.lifecyclePayload || { meta: {} }, state.chenSceneUserMdFixture, matched);
  }
  return matched || state.profileStrategyCenterAnalysis;
}

async function submitProfileStrategySyncRequest() {
  const status = $('#profile-strategy-sync-status');
  const button = $('#submit-profile-strategy-sync');
  const originalText = button?.textContent || '提交同步请求';
  const mode = currentProfileStrategySyncMode();
  const customerIds = uniqueStrings(selectedProfileStrategySyncCustomerIds());
  if (!customerIds.length) {
    if (status) status.textContent = mode === 'new' ? '请选择新增用户。' : '请选择要重新分析的用户。';
    return;
  }
  if (button) {
    button.disabled = true;
    button.textContent = '提交中';
  }
  try {
    const response = await postApi(PROFILE_STRATEGY_CENTER_LIVE_SYNC_API, {
      mode,
      customerIds,
      actor: 'profile_strategy_center_live_ui',
    });
    const generatedCount = Number(response.generatedCount || 0);
    if (status) {
      status.textContent = generatedCount > 0
        ? `已加入本地同步队列并生成 ${generatedCount} 条本地画像：${response.event?.eventId || 'queued_local_only'}。`
        : `已加入本地同步队列：${response.event?.eventId || 'queued_local_only'}。`;
    }
    state.profileStrategySyncOptions = response.options || state.profileStrategySyncOptions;
    const preferredCaseId = response.analyses?.[0]?.sampleId || customerIds[0] || state.profileStrategyCenterSelectedCaseId;
    state.profileStrategyCenterSelectedCaseId = preferredCaseId || state.profileStrategyCenterSelectedCaseId;
    if (status) status.textContent += ' 正在自动刷新画像结果...';
    await refreshProfileStrategyCenterLiveAfterSync(preferredCaseId);
    await loadProfileStrategySyncOptions().catch(() => null);
    if (status) {
      status.textContent = generatedCount > 0
        ? `已生成 ${generatedCount} 条本地画像并自动刷新页面：${response.event?.eventId || 'queued_local_only'}。`
        : `已写入同步队列并自动刷新页面：${response.event?.eventId || 'queued_local_only'}。`;
    }
    if (generatedCount > 0) {
      closeProfileStrategySyncModal();
      $('#ai-insight-status').textContent = `已同步刷新 ${generatedCount} 条`;
      $('#ai-insight-status').className = 'status-chip is-ready';
    }
  } catch (error) {
    if (status) status.textContent = `提交失败：${error.message}`;
  } finally {
    if (button?.isConnected) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

function fixtureSourceLabel(customer) {
  return `${customer?.unifiedCustomerId || 'HIS'} / ${customer?.hisId || 'HIS源ID'} / ${customer?.crmOid || 'CRM OID'}`;
}

function renderLifecyclePayload(payload, fixture = state.chenSceneUserMdFixture, strategyCenterAnalysis = state.profileStrategyCenterAnalysis) {
  state.lifecyclePayload = payload || { meta: {} };
  if (IS_LIVE_ARCHIVE_MODE && !strategyCenterAnalysis) {
    clearProfileStrategyMethodologyRoots();
    state.profileStrategyCenterAnalysis = null;
    state.profileStrategyCenterSelectedCaseId = null;
    $('#ai-insight-status').textContent = '实盘策略中心待生成';
    $('#ai-insight-status').className = 'status-chip is-pending';
    $('#ai-insight-blocker').hidden = false;
    $('#ai-insight-blocker').innerHTML = '<strong>实盘画像策略中心尚未生成</strong><p>当前 live API 未返回 profileStrategyCenterAnalysis.v1；为避免样板正文泄漏，本页不回退陈喜生样板内容。</p>';
    $('#ai-insight-summary').innerHTML = '';
    $('#ai-insight-summary').hidden = true;
    $('#ai-insight-customer-list').innerHTML = '<div class="empty">暂无实盘画像策略中心结果。</div>';
    $('#ai-insight-detail').innerHTML = '<div class="empty">请先生成 profileStrategyCenterAnalysis.v1，再展示实盘顾客内容。</div>';
    return;
  }
  if (!fixture && !strategyCenterAnalysis) {
    clearProfileStrategyMethodologyRoots();
    $('#ai-insight-detail').innerHTML = `<div class="empty">${IS_LIVE_ARCHIVE_MODE ? '实盘画像策略中心结果尚未读取。' : '样板场景一核验 fixture 尚未读取。'}</div>`;
    return;
  }
  const analysis = strategyCenterAnalysis || buildChenLifecycleAgentAnalysis(fixture);
  renderChenLifecycleAgentAnalysis(analysis);
}

function renderLifecycleBatch20(batch) {
  state.lifecycleBatch20 = batch;
  const summary = batch.summary || {};
  const customers = batch.customers || [];
  $('#lifecycle-batch20-summary').innerHTML = `
    <article>
      <span>批次客户</span>
      <strong>${formatNumber(summary.batchSize || customers.length)} 人</strong>
    </article>
    <article>
      <span>真值范围</span>
      <strong>${formatNumber(summary.minTruthValueCount)}-${formatNumber(summary.maxTruthValueCount)}</strong>
    </article>
    <article>
      <span>待抽取</span>
      <strong>${formatNumber(summary.pendingTotal)}</strong>
    </article>
    <article>
      <span>重度逾期</span>
      <strong>${formatNumber(summary.severeOverdueCount)}</strong>
    </article>
  `;
  $('#lifecycle-batch20-table').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>客户ID</th>
          <th>RFM</th>
          <th>真值</th>
          <th>超期</th>
          <th>最近项目</th>
          <th>生命周期</th>
          <th>目标</th>
        </tr>
      </thead>
      <tbody>
        ${customers.map((customer) => `
          <tr>
            <td>${formatNumber(customer.rank)}</td>
            <td><code>${escapeHtml(customer.unifiedCustomerId)}</code></td>
            <td>${escapeHtml(customer.rfmGrade || '')}</td>
            <td>${formatNumber(customer.truthValueCount)}/230</td>
            <td>${formatNumber(customer.overdueDays)} 天</td>
            <td>${escapeHtml(customer.lastMaintenanceProject || '')}</td>
            <td>${escapeHtml(customer.lifecycleState?.label || '')}</td>
            <td>${escapeHtml(customer.interactionObjective || '')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function aiVerdictLabel(verdict) {
  if (verdict === 'pass') return '通过';
  if (verdict === 'pass_with_warnings') return '带警告通过';
  if (verdict === 'needs_fix') return '需修复';
  return verdict || '待评测';
}

function aiVerdictClass(verdict) {
  if (verdict === 'pass') return 'is-complete';
  if (verdict === 'pass_with_warnings') return 'is-pending';
  if (verdict === 'needs_fix') return 'is-missing';
  return 'is-indexed';
}

function renderScoreBreakdown(breakdown = {}) {
  return Object.entries(breakdown).map(([key, value]) => `
    <div class="ai-score-cell">
      <span>${escapeHtml(key)}</span>
      <strong>${formatNumber(value)}</strong>
    </div>
  `).join('');
}

function renderAiReasonList(rows = []) {
  if (!rows.length) return '<li>暂无更多可审计依据。</li>';
  return rows.map((row) => `<li>${escapeHtml(row)}</li>`).join('');
}

function renderAiJsonBlock(title, value) {
  const displayValue = value && typeof value === 'object' && !Array.isArray(value) && value.auditableWorkflow
    ? { ...value, auditableWorkflow: '[已在上方 Agent 工作流详情中展开]' }
    : value;
  return `
    <div class="ai-json-block">
      <strong>${escapeHtml(title)}</strong>
      <pre>${escapeHtml(formatJson(displayValue))}</pre>
    </div>
  `;
}

function auditValueText(value) {
  if (Array.isArray(value)) return value.join('、');
  if (value && typeof value === 'object') return formatJson(value);
  if (typeof value === 'boolean') return value ? '是' : '否';
  return value == null ? '' : String(value);
}

function renderAuditRows(rows = [], options = {}) {
  if (!rows.length) return '<div class="ai-audit-empty">暂无结构化审计项。</div>';
  const titleKeys = options.titleKeys || ['stage', 'rule', 'metric', 'signal', 'branchAgentId'];
  const bodyKeys = options.bodyKeys || ['input', 'operation', 'output', 'standard', 'calculation', 'value', 'interpretation', 'ruleHit', 'conclusion'];
  return rows.map((row) => {
    if (typeof row !== 'object' || row == null) {
      return `<article><strong>${escapeHtml(auditValueText(row))}</strong></article>`;
    }
    const titleKey = titleKeys.find((key) => row[key] != null);
    const title = titleKey ? row[titleKey] : '审计项';
    const body = bodyKeys
      .filter((key) => row[key] != null && key !== titleKey)
      .map((key) => `<span><b>${escapeHtml(key)}</b>${escapeHtml(auditValueText(row[key]))}</span>`)
      .join('');
    return `<article><strong>${escapeHtml(auditValueText(title))}</strong>${body}</article>`;
  }).join('');
}

function renderAiWorkflow(workflow) {
  if (!workflow) return '';
  const alignment = workflow.projectBookAlignment || {};
  const inputData = workflow.inputData || {};
  const boundary = workflow.displayBoundary || {};
  return `
    <section class="ai-workflow-panel">
      <div class="ai-workflow-title">
        <h4>Agent 工作流详情</h4>
        <span>${escapeHtml(workflow.auditMode || 'quantified_auditable_summary')}</span>
      </div>
      <p class="ai-workflow-policy">${escapeHtml(workflow.chainOfThoughtPolicy || '展示可审计证据、规则、计算和结论。')}</p>
      <div class="ai-workflow-meta">
        <article>
          <span>项目书步骤</span>
          <strong>${escapeHtml(auditValueText(alignment.steps || []))}</strong>
        </article>
        <article>
          <span>回答问题</span>
          <strong>${escapeHtml(auditValueText(alignment.questions || []))}</strong>
        </article>
        <article>
          <span>Agent 职能</span>
          <strong>${escapeHtml(alignment.engineRole || '')}</strong>
        </article>
      </div>
      <div class="ai-workflow-section">
        <h5>输入字段与来源</h5>
        <div class="ai-input-field-list">
          ${(inputData.fields || []).map((field) => `<span>${escapeHtml(field)}</span>`).join('') || '<span>暂无字段</span>'}
        </div>
        <small>安全来源：${escapeHtml(auditValueText(inputData.safeSources || []))}</small>
      </div>
      <div class="ai-workflow-section">
        <h5>从拿到数据到得出结论</h5>
        <div class="ai-audit-row-grid">${renderAuditRows(workflow.workflowSteps, { titleKeys: ['stage'], bodyKeys: ['input', 'operation', 'output'] })}</div>
      </div>
      <div class="ai-workflow-section">
        <h5>规则与评分标准</h5>
        <div class="ai-audit-row-grid">${renderAuditRows(workflow.rulesAndStandards, { titleKeys: ['rule'], bodyKeys: ['standard', 'calculation'] })}</div>
      </div>
      <div class="ai-workflow-section">
        <h5>量化信号</h5>
        <div class="ai-audit-row-grid is-compact">${renderAuditRows(workflow.quantifiedSignals, { titleKeys: ['metric'], bodyKeys: ['value', 'interpretation'] })}</div>
      </div>
      <div class="ai-workflow-section">
        <h5>结论路径</h5>
        <div class="ai-audit-row-grid">${renderAuditRows(workflow.conclusionTraces, { titleKeys: ['signal'], bodyKeys: ['ruleHit', 'conclusion'] })}</div>
      </div>
      <div class="ai-workflow-boundary">
        <span>顾客可见：${boundary.customerVisible ? '是' : '否'}</span>
        <span>敏感原文：${boundary.sensitiveRawTextAllowed ? '允许' : '禁止'}</span>
        <span>自动发送：${boundary.automaticSendAllowed ? '允许' : '禁止'}</span>
        <span>远端写入：${boundary.remoteWriteAllowed ? '允许' : '禁止'}</span>
      </div>
      ${workflow.calibration ? `<p class="ai-workflow-calibration">校准：${escapeHtml(workflow.calibration)}</p>` : ''}
    </section>
  `;
}

function renderAiConclusionCard({ title, badge, conclusion, reasons, rawTitle, raw, workflow }) {
  return `
    <details class="ai-conclusion-card">
      <summary>
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(conclusion)}</strong>
        ${badge ? `<b>${escapeHtml(badge)}</b>` : ''}
      </summary>
      <div class="ai-conclusion-body">
        <section>
          <h4>可审计推理摘要</h4>
          <ol>${renderAiReasonList(reasons)}</ol>
        </section>
        ${renderAiWorkflow(workflow || raw?.auditableWorkflow)}
        ${renderAiJsonBlock(rawTitle || '结构化来源', raw)}
      </div>
    </details>
  `;
}

function renderAiTrainingPack(pack, selectedCustomerId = state.selectedAiInsightCustomerId) {
  state.databaseAnalysisTrainingPack = pack;
  const samples = pack.samples || [];
  const summary = pack.summary || {};
  const selected = samples.find((sample) => sample.customerId === selectedCustomerId) || samples[0];
  state.selectedAiInsightCustomerId = selected?.customerId || null;

  $('#ai-insight-status').textContent = `${formatNumber(samples.length)} 人`;
  $('#ai-insight-status').className = 'status-chip is-complete';
  $('#ai-insight-blocker').innerHTML = `
    <article>
      <span>当前阻塞点</span>
      <strong>H5 内容 Agent CTA 未同步</strong>
      <p>源 H5 草稿仍含预约/顾问动作型按钮；训练包已改为“信息型详情入口”。在同步完成前，H5 只能作为内部草稿和审核输入，不能对客发布或自动发送。</p>
    </article>
    <article>
      <span>影响范围</span>
      <strong>${formatNumber(summary.warnings?.h5CtaNeedsContentAgentSync || 0)} 人待同步</strong>
      <p>同时有 ${formatNumber(summary.warnings?.productClassificationReviewRequired || 0)} 人需要产品分类/话术复核，${formatNumber(summary.warnings?.yellowRiskCards || 0)} 人为黄灯风险。</p>
    </article>
    <article>
      <span>当前允许</span>
      <strong>训练评测与人工复核</strong>
      <p>自动发送 ${formatNumber(summary.riskAndBoundary?.autoSendAllowed || 0)}，对客发布 ${formatNumber(summary.riskAndBoundary?.customerFacingPublishAllowed || 0)}，远端写入 ${formatNumber(summary.riskAndBoundary?.remoteWriteAllowed || 0)}。</p>
    </article>
  `;
  $('#ai-insight-summary').innerHTML = `
    <article><span>样本</span><strong>${formatNumber(summary.sampleCustomers || samples.length)}</strong></article>
    <article><span>分支 Agent</span><strong>${formatNumber(summary.branchAgents?.length || 0)}</strong></article>
    <article><span>完全通过</span><strong>${formatNumber(summary.projectBookValidation?.pass || 0)}</strong></article>
    <article><span>带警告通过</span><strong>${formatNumber(summary.projectBookValidation?.passWithWarnings || 0)}</strong></article>
    <article><span>需修复</span><strong>${formatNumber(summary.projectBookValidation?.needsFix || 0)}</strong></article>
  `;
  $('#ai-insight-customer-list').innerHTML = samples.map((sample) => {
    const profile = sample.branchOutputs?.synthesis?.finalAiPortraitConsumptionModel || {};
    const verdict = sample.branchOutputs?.trainingEvaluation?.verdict;
    const risk = profile.riskAndReadiness?.riskLevel || 'unknown';
    const score = profile.opportunity?.score ?? sample.branchOutputs?.opportunityScoring?.opportunityScore;
    return `
      <button class="ai-insight-customer-button ${sample.customerId === state.selectedAiInsightCustomerId ? 'is-active' : ''}" data-customer-id="${escapeHtml(sample.customerId)}">
        <span>C${String(sample.rank || '').padStart(2, '0')} · RFM ${escapeHtml(sample.inputSnapshot?.rfmGrade || '')}</span>
        <strong>${escapeHtml(sample.customerId)}</strong>
        <small>
          <b>机会 ${formatNumber(score)}</b>
          <b>${escapeHtml(riskLevelLabel(risk))}</b>
          <b>${escapeHtml(aiVerdictLabel(verdict))}</b>
        </small>
      </button>
    `;
  }).join('');
  renderAiTrainingDetail(selected);
}

function renderAiTrainingDetail(sample) {
  if (!sample) {
    $('#ai-insight-detail').innerHTML = '<div class="empty">暂无训练样本。</div>';
    return;
  }
  const branches = sample.branchOutputs || {};
  const evidence = branches.evidenceReadiness || {};
  const profile = branches.consumerProfile || {};
  const projectCycle = branches.projectCycleRepurchase || {};
  const coreDriver = branches.coreMotivationDriver || {};
  const psychology = branches.psychologyModel || {};
  const lifecycle = branches.lifecycleDiagnosis || {};
  const scoring = branches.opportunityScoring || {};
  const content = branches.contentStrategy || {};
  const evaluation = branches.trainingEvaluation || {};
  const synthesis = branches.synthesis || {};
  const finalModel = synthesis.finalAiPortraitConsumptionModel || {};
  const driverAnalysis = coreDriver.driverAnalysis || finalModel.coreDriverSummary || {};
  const driverStrategy = coreDriver.recommendedStrategy || {};
  const driverBrief = coreDriver.advisorBrief || {};
  const verdict = evaluation.verdict;
  const warnings = evaluation.warnings || [];
  const issues = evaluation.issues || [];
  const concernLabels = (psychology.concernTags || []).map((item) => item.label || item.tag);
  const barrierLabels = (psychology.behaviorBarriers || []).map((item) => item.label || item.tag);
  const scoreBreakdown = scoring.scoreBreakdown || {};
  const evalChecks = evaluation.projectBookValidation?.checks || [];
  const warningText = [...warnings, ...issues].join('；') || '无阻断问题。';
  const projectCycleStandard = projectCycle.matchedProjectStandard || {};
  const projectCycleStatus = projectCycle.cycleStatus || {};
  const projectCycleRecommendation = projectCycle.recommendation || {};
  const projectCycleScoring = projectCycle.scoringImpact || {};

  $('#ai-insight-detail').innerHTML = `
    <div class="ai-detail-head">
      <div>
        <span>样本 ${escapeHtml(sample.sampleId)}</span>
        <h3>${escapeHtml(sample.customerId)}</h3>
        <p>${escapeHtml(finalModel.shortProfile || profile.privateAiProfile || '')}</p>
      </div>
      <div class="ai-detail-badges">
        <span class="status-chip ${aiVerdictClass(verdict)}">${escapeHtml(aiVerdictLabel(verdict))}</span>
        <span class="status-chip ${riskLevelClass(finalModel.riskAndReadiness?.riskLevel)}">${escapeHtml(riskLevelLabel(finalModel.riskAndReadiness?.riskLevel))}</span>
        <span class="status-chip is-indexed">机会 ${formatNumber(finalModel.opportunity?.score ?? scoring.opportunityScore)}</span>
      </div>
    </div>
    <div class="ai-detail-metrics">
      <article><span>真值</span><strong>${formatNumber(sample.inputSnapshot?.truthValueCount)}/${formatNumber(sample.inputSnapshot?.requirementCount)}</strong></article>
      <article><span>维养次数</span><strong>${formatNumber(sample.inputSnapshot?.maintenanceCount12m)}</strong></article>
      <article><span>超期</span><strong>${formatNumber(sample.inputSnapshot?.overdueDays)} 天</strong></article>
      <article><span>准备度</span><strong>${percentLabel(finalModel.riskAndReadiness?.dataReadinessScore ?? evidence.dataReadinessScore)}</strong></article>
    </div>
    <div class="ai-warning-strip">
      <strong>评测提示</strong>
      <span>${escapeHtml(warningText)}</span>
    </div>
    <div class="ai-conclusion-grid">
      ${renderAiConclusionCard({
        title: '个人 AI 画像与消费模型',
        badge: finalModel.consumptionModel?.maintenanceBand || '',
        conclusion: profile.privateAiProfile || finalModel.shortProfile || '',
        reasons: [
          ...(profile.knownSignals || []),
          `消费模型：${labelFromEntries(finalModel.consumptionModel || profile.consumptionModel || {})}`,
          `不确定性：${(profile.uncertainty || []).join('、') || '暂无'}`
        ],
        rawTitle: '数据库字段快照',
        raw: sample.inputSnapshot,
        workflow: profile.auditableWorkflow,
      })}
      ${projectCycle.branchAgentId ? renderAiConclusionCard({
        title: '项目复购周期与稳固判断',
        badge: projectCycleRecommendation.statusLabel || projectCycleStatus.repurchaseStatusLabel || '',
        conclusion: projectCycleRecommendation.summary || '',
        reasons: [
          `标准项目：${projectCycleStandard.standardProjectName || '待补'}；复购周期 ${projectCycleStandard.repurchaseCycleRaw || '待补'} 月；稳固 ${projectCycleStandard.stableTimesRaw || '待补'} 次；恢复期 ${projectCycleStandard.recoveryDaysRaw || '待补'} 天`,
          `复购判断：${projectCycleStatus.repurchaseStatusLabel || '待补'}；距上次 ${formatNumber(projectCycleStatus.daysSinceLastTreatment)} 天`,
          `恢复期判断：${projectCycleStatus.recoveryStatusLabel || '待补'}`,
          `稳固判断：${projectCycleStatus.stabilizationStatusLabel || '待补'}`,
          `后续参考：${(projectCycleRecommendation.followUpReference || []).join('、') || '待顾问复核'}`,
          `评分影响：${formatNumber(projectCycleScoring.previousScore)} -> ${formatNumber(projectCycleScoring.adjustedScore)}；${projectCycleScoring.priorityAfter || ''}`
        ],
        rawTitle: '项目周期静态标准',
        raw: projectCycle,
        workflow: projectCycle.auditableWorkflow,
      }) : ''}
      ${renderAiConclusionCard({
        title: '核心驱动因素',
        badge: driverAnalysis.primaryDriverScore != null ? `${formatNumber(driverAnalysis.primaryDriverScore)} 分` : '',
        conclusion: `${driverAnalysis.primaryDriverLabel || '待补主驱动'}为主；${driverAnalysis.secondaryDriverLabel || '待补次驱动'}为辅。`,
        reasons: [
          `她最在意什么：${driverBrief.whatSheCaresAbout || driverAnalysis.primaryDriverLabel || '待补'}`,
          `证据摘要：${(coreDriver.evidenceSummary || []).join('、') || '待补'}`,
          `判断可靠性：置信度 ${driverAnalysis.driverConfidence != null ? percentLabel(driverAnalysis.driverConfidence) : '待补'}，证据等级 ${driverAnalysis.evidenceLevel || '待补'}`,
          `为什么没回来：${driverBrief.whySheHasNotReturned || '待顾问校准'}`,
          `卡在哪一步：${driverAnalysis.journeyStage || '待补'}；行为偏差：${driverAnalysis.behaviorBias || '待补'}`,
          `该怎么沟通：${driverBrief.whatToSay || driverStrategy.interactionGoal || '待补'}`,
          `不能怎么沟通：${driverBrief.whatToAvoid || (coreDriver.displayBoundary?.forbiddenForCustomer || []).join('、') || '待补'}`
        ],
        rawTitle: '核心驱动因素分支输出',
        raw: coreDriver,
      })}
      ${renderAiConclusionCard({
        title: '消费心理与行为阻碍',
        badge: psychology.internalOnly ? '内部可见' : '',
        conclusion: `${concernLabels.join('、') || '待补关注点'}；${barrierLabels.join('、') || '待补阻碍'}`,
        reasons: [
          ...(psychology.concernTags || []).map((item) => `${item.label || item.tag}：${(item.evidence || []).join('、')}；沟通方向：${item.communicationDirection || ''}`),
          ...(psychology.behaviorBarriers || []).map((item) => `${item.label || item.tag}：${(item.evidence || []).join('、')}；干预：${item.intervention || ''}`),
          `对客禁止展示：${(psychology.forbiddenForCustomer || []).join('、') || '无'}`
        ],
        rawTitle: '心理分支结构化输出',
        raw: psychology,
      })}
      ${renderAiConclusionCard({
        title: '生命周期诊断',
        badge: lifecycle.lifecycleState?.label || '',
        conclusion: lifecycle.interactionObjective || lifecycle.lifecycleState?.objective || '',
        reasons: [
          lifecycle.whyNow,
          lifecycle.journeyStop,
          `下一步动作：${lifecycle.nextBestAction || ''}`,
          `消息角度：${(lifecycle.lifecycleState?.messageAngles || []).join('、')}`
        ],
        rawTitle: '生命周期分支输出',
        raw: lifecycle,
      })}
      ${renderAiConclusionCard({
        title: '机会评分',
        badge: `${formatNumber(scoring.opportunityScore)} 分`,
        conclusion: `${scoring.priorityLevel || finalModel.opportunity?.priority || ''}｜${scoring.priorityReason || finalModel.opportunity?.reason || ''}`,
        reasons: [
          `超期紧迫度：${formatNumber(scoreBreakdown.overdueUrgency)}`,
          `响应概率：${formatNumber(scoreBreakdown.responseProbability)}`,
          `价值潜力：${formatNumber(scoreBreakdown.valuePotential)}`,
          `静默风险：${formatNumber(scoreBreakdown.silentRisk)}`,
          `关系强度：${formatNumber(scoreBreakdown.relationshipStrength)}`,
          `学习价值：${formatNumber(scoreBreakdown.learningValue)}`
        ],
        rawTitle: '评分因子',
        raw: scoring,
      })}
      <details class="ai-conclusion-card">
        <summary>
          <span>机会评分细项</span>
          <strong>权重仍需由真实预约、到店和转化反馈继续校准</strong>
          <b>${escapeHtml(scoring.priorityLevel || '')}</b>
        </summary>
        <div class="ai-conclusion-body">
          <section>
            <h4>评分拆解</h4>
            <div class="ai-score-grid">${renderScoreBreakdown(scoreBreakdown)}</div>
          </section>
          ${renderAiJsonBlock('机会评分原始输出', scoring)}
        </div>
      </details>
      ${renderAiConclusionCard({
        title: '内容策略与 AIDA',
        badge: content.messageAngle || '',
        conclusion: content.advisorScriptBrief || '',
        reasons: [
          `Attention：${content.aidaStrategy?.attention || ''}`,
          `Interest：${content.aidaStrategy?.interest || ''}`,
          `Desire：${content.aidaStrategy?.desire || ''}`,
          `Action：${content.aidaStrategy?.action || ''}`,
          `禁用表达：${(content.forbiddenClaims || []).join('、')}`
        ],
        rawTitle: 'H5 信息型输入',
        raw: content.h5Input,
        workflow: content.auditableWorkflow,
      })}
      ${renderAiConclusionCard({
        title: '最终汇总合成',
        badge: synthesis.taskCardInput?.reviewLane || '',
        conclusion: synthesis.taskCardInput?.advisorFocus || finalModel.shortProfile || '',
        reasons: [
          `为什么现在：${synthesis.taskCardInput?.whyNow || ''}`,
          `互动目标：${synthesis.taskCardInput?.interactionObjective || ''}`,
          `证据摘要：${(synthesis.taskCardInput?.evidenceSummary || []).join('、')}`,
          `合并策略：${(synthesis.mergePolicy || []).join('；')}`
        ],
        rawTitle: '汇总输出',
        raw: synthesis,
      })}
      ${renderAiConclusionCard({
        title: '训练评测',
        badge: aiVerdictLabel(verdict),
        conclusion: `通过 ${formatNumber(evaluation.projectBookValidation?.passCount)} 项，警告 ${formatNumber(evaluation.projectBookValidation?.warningCount)} 项，问题 ${formatNumber(evaluation.projectBookValidation?.issueCount)} 项。`,
        reasons: evalChecks.map((check) => `${check.label}：${check.status}｜${check.note}`),
        rawTitle: '项目书五问与五步法检查',
        raw: evaluation,
      })}
      ${renderAiConclusionCard({
        title: '数据库原数据',
        badge: '完整快照',
        conclusion: '展示本地检查台已沉淀的客户字段、标题值、源 payload 与模型输入快照；仅系统密钥、密码、token、凭据脱敏。',
        reasons: [
          sample.inputSnapshot?.sourceBoundaries || '使用 analysis-db 中该客户可用字段、标题值和源 payload。',
          `证据状态：${labelFromEntries(evidence.evidenceStatus || {})}`,
          '内部页展示完整客户数据快照；不用于对客发布。'
        ],
        rawTitle: '训练输入与期望输出',
        raw: {
          inputSnapshot: sample.inputSnapshot,
          expectedOutput: sample.expectedOutput,
          forbidden: sample.forbidden,
        },
        workflow: evidence.auditableWorkflow,
      })}
    </div>
  `;
}

function renderDeliverableDraftArchive(archive) {
  const target = $('#deliverable-draft-archive');
  const status = $('#deliverable-draft-status');
  if (!target || !status) return;
  if (!archive) {
    status.textContent = '暂无';
    status.className = 'status-chip is-missing';
    target.innerHTML = '<div class="empty">暂无首客 H5 / 任务卡文字草稿存档。</div>';
    return;
  }
  const snapshot = archive.dataSnapshotInternal || {};
  const h5Screens = archive.h5Brief?.screens || [];
  const scripts = archive.advisorTaskCard?.scripts || [];
  const audit = archive.audit || {};
  const files = archive.deliverables || {};
  const analysisAddendum = archive.analysisAddendum20260619 || {};
  const cycleAddendum = archive.analysisAddendum20260621?.projectCycleRepurchase || {};
  const h5Redesign = archive.h5Brief?.redesignBasis20260619 || {};
  const taskAnalysis = archive.advisorTaskCard?.analysisBasis20260619 || {};
  const quantifiedAudit = audit.quantifiedAuditableReasoning || {};
  const base = '/lifecycle-system/首位客户可交付H5与任务卡_20260618';
  status.textContent = archive.advisorTaskCard?.reviewStatus || '已归档';
  status.className = 'status-chip is-complete';
  target.innerHTML = `
    <div class="deliverable-draft-head">
      <article>
        <span>客户</span>
        <strong>${escapeHtml(archive.customerCode || '')} · ${escapeHtml(archive.customerId || '')}</strong>
        <p>${escapeHtml(archive.advisorTaskCard?.objective || '')}</p>
      </article>
      <article>
        <span>生命周期</span>
        <strong>${escapeHtml(snapshot.lifecycleLabel || '')}</strong>
        <p>维养 ${formatNumber(snapshot.maintenanceCount12m)} 次 · 超期 ${formatNumber(snapshot.overdueDays)} 天 · ${escapeHtml(snapshot.riskLevel || '')}</p>
      </article>
      <article>
        <span>交付结论</span>
        <strong>${escapeHtml(audit.deliveryVerdict || '')}</strong>
        <p>顾客 H5 为竖屏三页；任务卡横屏优先并兼容竖屏。</p>
      </article>
    </div>
    <div class="deliverable-draft-grid">
      <section class="deliverable-draft-card is-wide">
        <div class="deliverable-card-title">
          <h3>项目书驱动的新增分析</h3>
          <span>量化可审计</span>
        </div>
        <div class="draft-analysis-grid">
          <article>
            <b>项目书角色</b>
            <p>${escapeHtml(analysisAddendum.projectBookRole || '')}</p>
          </article>
          <article>
            <b>核心驱动</b>
            <p>${escapeHtml(analysisAddendum.coreDriver ? `${analysisAddendum.coreDriver.primary} ${formatNumber(analysisAddendum.coreDriver.primaryScore)}分；${analysisAddendum.coreDriver.secondary} ${formatNumber(analysisAddendum.coreDriver.secondaryScore)}分。${analysisAddendum.coreDriver.advisorMeaning}` : '')}</p>
          </article>
          <article>
            <b>机会评分</b>
            <p>${escapeHtml(analysisAddendum.opportunityScoringAudit ? `${analysisAddendum.opportunityScoringAudit.priority} ${formatNumber(analysisAddendum.opportunityScoringAudit.score)}分｜${analysisAddendum.opportunityScoringAudit.formula}` : '')}</p>
          </article>
          ${cycleAddendum.summary ? `
            <article>
              <b>项目周期</b>
              <p>${escapeHtml(cycleAddendum.summary)}</p>
            </article>
          ` : ''}
        </div>
        <div class="draft-audit-list">
          ${(analysisAddendum.agentWorkflowSummary || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
        </div>
      </section>
      ${cycleAddendum.summary ? `
        <section class="deliverable-draft-card is-wide">
          <div class="deliverable-card-title">
            <h3>后续项目选择参考</h3>
            <span>复购周期/恢复期/稳固</span>
          </div>
          <div class="draft-analysis-grid">
            <article>
              <b>已到复购周期</b>
              <p>${escapeHtml((cycleAddendum.dueNow || []).join('；') || '暂无')}</p>
            </article>
            <article>
              <b>恢复期不应做</b>
              <p>${escapeHtml((cycleAddendum.blockedByRecovery || []).join('；') || '暂无')}</p>
            </article>
            <article>
              <b>做了但不稳固</b>
              <p>${escapeHtml((cycleAddendum.doneButNotStable || []).join('；') || '暂无')}</p>
            </article>
          </div>
          <div class="draft-audit-list">
            ${(cycleAddendum.advisorReference || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
          </div>
        </section>
      ` : ''}
      <section class="deliverable-draft-card is-wide">
        <div class="deliverable-card-title">
          <h3>顾客侧 H5 三屏草稿</h3>
          <span>信息型详情入口</span>
        </div>
        ${h5Redesign.customerVisibleGoal ? `
          <p><strong>重新设计目标：</strong>${escapeHtml(h5Redesign.customerVisibleGoal)}</p>
          <div class="draft-audit-list">
            ${(h5Redesign.projectBookMapping || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
          </div>
        ` : ''}
        <div class="draft-h5-screen-grid">
          ${h5Screens.map((screen) => `
            <article>
              <b>${escapeHtml(screen.step || '')}</b>
              <strong>${escapeHtml(screen.title || '')}</strong>
              <p>${escapeHtml(screen.body || screen.subtitle || screen.closing || '')}</p>
              ${screen.detailEntry ? `<small>${escapeHtml(screen.detailEntry)}</small>` : ''}
              ${screen.auditRationale ? `<em>${escapeHtml(screen.auditRationale)}</em>` : ''}
            </article>
          `).join('')}
        </div>
      </section>
      <section class="deliverable-draft-card">
        <div class="deliverable-card-title">
          <h3>顾问侧任务卡摘要</h3>
          <span>人工审核</span>
        </div>
        <p>${escapeHtml(archive.advisorTaskCard?.advisorBrief || '')}</p>
        ${taskAnalysis.coreDriverUse ? `<p><strong>核心驱动使用：</strong>${escapeHtml(taskAnalysis.coreDriverUse)}</p>` : ''}
        ${taskAnalysis.scoringUse ? `<p><strong>评分使用规则：</strong>${escapeHtml(taskAnalysis.scoringUse)}</p>` : ''}
        <ul>
          ${(archive.advisorTaskCard?.talkingPoints || []).map((point) => `<li>${escapeHtml(point)}</li>`).join('')}
        </ul>
        ${taskAnalysis.reviewChecklist?.length ? `
          <h4>审核清单</h4>
          <ul>${taskAnalysis.reviewChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        ` : ''}
      </section>
      <section class="deliverable-draft-card">
        <div class="deliverable-card-title">
          <h3>话术 A / B</h3>
          <span>低压力</span>
        </div>
        <div class="draft-script-list">
          ${scripts.map((script) => `
            <article>
              <b>${escapeHtml(script.variant || '')} · ${escapeHtml(script.angle || '')}</b>
              <p>${escapeHtml(script.text || '')}</p>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="deliverable-draft-card">
        <div class="deliverable-card-title">
          <h3>顾客侧禁止展示</h3>
          <span>合规</span>
        </div>
        <ul>
          ${(archive.visibilityRules?.forbiddenCustomerSurface || []).slice(0, 5).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </section>
      <section class="deliverable-draft-card">
        <div class="deliverable-card-title">
          <h3>量化可审计推理</h3>
          <span>从数据到结论</span>
        </div>
        <ul>
          ${(quantifiedAudit.dataToConclusion || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
        <div class="draft-audit-list">
          ${(quantifiedAudit.visibleScoringStandards || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
        </div>
      </section>
      <section class="deliverable-draft-card">
        <div class="deliverable-card-title">
          <h3>独立交付文件</h3>
          <span>打开预览</span>
        </div>
        <div class="deliverable-file-links">
          <a href="${base}/${encodeURIComponent(files.customerH5 || '')}" target="_blank" rel="noreferrer">顾客侧 H5 竖屏文件</a>
          <a href="${base}/${encodeURIComponent(files.advisorTaskCard || '')}" target="_blank" rel="noreferrer">顾问任务卡横屏/竖屏文件</a>
          <a href="${base}/${encodeURIComponent(files.reviewReport || '')}" target="_blank" rel="noreferrer">项目书审核报告</a>
        </div>
      </section>
    </div>
  `;
}

function riskLevelLabel(level) {
  if (level === 'red') return '红灯';
  if (level === 'yellow') return '黄灯';
  if (level === 'green') return '绿灯';
  return level || '待定';
}

function riskLevelClass(level) {
  if (level === 'red') return 'is-missing';
  if (level === 'yellow') return 'is-pending';
  if (level === 'green') return 'is-complete';
  return 'is-indexed';
}

function renderLifecycleOperations(
  reviewQueue,
  feedbackUnits,
  actionEvents = state.advisorActionEvents,
  outcomeEvents = state.interactionOutcomeEvents,
  feedbackLearningEvents = state.feedbackLearningEvents,
  lifecycleKpiSummary = state.lifecycleKpiSummary,
  lifecycleRuleCandidates = state.lifecycleRuleCandidates,
  advisorExecutionPack = state.advisorExecutionPack,
  manualSendGateQueue = state.manualSendGateQueue,
  manualSendEvents = state.manualSendEvents,
  postSendFollowupQueue = state.postSendFollowupQueue,
  nextRoundActionPlan = state.nextRoundActionPlan,
  adminTodoCenter = state.adminTodoCenter,
  adminTodoEvents = state.adminTodoEvents,
  adminTodoSourceSyncPlan = state.adminTodoSourceSyncPlan,
  adminSourceSyncEvents = state.adminSourceSyncEvents,
  adminSourceSyncExecutionEvents = state.adminSourceSyncExecutionEvents,
  mvpResultScorecard = state.mvpResultScorecard,
  realBusinessTruthBackfillPlan = state.realBusinessTruthBackfillPlan,
  productClassificationSeed = state.productClassificationSeed,
  productClassificationReviewQueue = state.productClassificationReviewQueue,
  productClassificationReviewEvents = state.productClassificationReviewEvents,
  productClassificationReviewExecutionPack = state.productClassificationReviewExecutionPack,
  productClassificationReviewImportContract = state.productClassificationReviewImportContract,
  productClassificationReviewImportReadinessReport = state.productClassificationReviewImportReadinessReport,
  productClassificationReviewDecisionGuide = state.productClassificationReviewDecisionGuide,
  productClassificationRecomputePlan = state.productClassificationRecomputePlan,
  productClassificationImpactPlan = state.productClassificationImpactPlan,
  lifecycleTraceabilityMatrix = state.lifecycleTraceabilityMatrix,
  adminCustomerDetailPack = state.adminCustomerDetailPack,
  h5PublishGateQueue = state.h5PublishGateQueue,
  h5PublishReviewEvents = state.h5PublishReviewEvents,
  h5PublishExecutionEvents = state.h5PublishExecutionEvents,
  h5EngagementEvents = state.h5EngagementEvents,
  h5FeedbackLearningBridge = state.h5FeedbackLearningBridge,
  h5FormalOutcomeEvents = state.h5FormalOutcomeEvents,
  h5PostFormalFollowupQueue = state.h5PostFormalFollowupQueue,
  h5PostFormalFollowupEvents = state.h5PostFormalFollowupEvents,
  h5NoConversionReviewQueue = state.h5NoConversionReviewQueue,
  h5NoConversionReviewEvents = state.h5NoConversionReviewEvents,
  productCopyReviewQueue = state.productCopyReviewQueue,
  productCopyReviewEvents = state.productCopyReviewEvents,
  gateRecalculationPlan = state.gateRecalculationPlan,
) {
  state.advisorReviewQueue = reviewQueue;
  state.feedbackTestUnits = feedbackUnits;
  if (actionEvents) state.advisorActionEvents = actionEvents;
  if (outcomeEvents) state.interactionOutcomeEvents = outcomeEvents;
  if (feedbackLearningEvents) state.feedbackLearningEvents = feedbackLearningEvents;
  if (lifecycleKpiSummary) state.lifecycleKpiSummary = lifecycleKpiSummary;
  if (lifecycleRuleCandidates) state.lifecycleRuleCandidates = lifecycleRuleCandidates;
  if (advisorExecutionPack) state.advisorExecutionPack = advisorExecutionPack;
  if (manualSendGateQueue) state.manualSendGateQueue = manualSendGateQueue;
  if (manualSendEvents) state.manualSendEvents = manualSendEvents;
  if (postSendFollowupQueue) state.postSendFollowupQueue = postSendFollowupQueue;
  if (nextRoundActionPlan) state.nextRoundActionPlan = nextRoundActionPlan;
  if (adminTodoCenter) state.adminTodoCenter = adminTodoCenter;
  if (adminTodoEvents) state.adminTodoEvents = adminTodoEvents;
  if (adminTodoSourceSyncPlan) state.adminTodoSourceSyncPlan = adminTodoSourceSyncPlan;
  if (adminSourceSyncEvents) state.adminSourceSyncEvents = adminSourceSyncEvents;
  if (adminSourceSyncExecutionEvents) state.adminSourceSyncExecutionEvents = adminSourceSyncExecutionEvents;
  if (mvpResultScorecard) state.mvpResultScorecard = mvpResultScorecard;
  if (realBusinessTruthBackfillPlan) state.realBusinessTruthBackfillPlan = realBusinessTruthBackfillPlan;
  if (productClassificationSeed) state.productClassificationSeed = productClassificationSeed;
  if (productClassificationReviewQueue) state.productClassificationReviewQueue = productClassificationReviewQueue;
  if (productClassificationReviewEvents) state.productClassificationReviewEvents = productClassificationReviewEvents;
  if (productClassificationReviewExecutionPack) state.productClassificationReviewExecutionPack = productClassificationReviewExecutionPack;
  if (productClassificationReviewImportContract) state.productClassificationReviewImportContract = productClassificationReviewImportContract;
  if (productClassificationReviewImportReadinessReport) state.productClassificationReviewImportReadinessReport = productClassificationReviewImportReadinessReport;
  if (productClassificationReviewDecisionGuide) state.productClassificationReviewDecisionGuide = productClassificationReviewDecisionGuide;
  if (productClassificationRecomputePlan) state.productClassificationRecomputePlan = productClassificationRecomputePlan;
  if (productClassificationImpactPlan) state.productClassificationImpactPlan = productClassificationImpactPlan;
  if (lifecycleTraceabilityMatrix) state.lifecycleTraceabilityMatrix = lifecycleTraceabilityMatrix;
  if (adminCustomerDetailPack) state.adminCustomerDetailPack = adminCustomerDetailPack;
  if (h5PublishGateQueue) state.h5PublishGateQueue = h5PublishGateQueue;
  if (h5PublishReviewEvents) state.h5PublishReviewEvents = h5PublishReviewEvents;
  if (h5PublishExecutionEvents) state.h5PublishExecutionEvents = h5PublishExecutionEvents;
  if (h5EngagementEvents) state.h5EngagementEvents = h5EngagementEvents;
  if (h5FeedbackLearningBridge) state.h5FeedbackLearningBridge = h5FeedbackLearningBridge;
  if (h5FormalOutcomeEvents) state.h5FormalOutcomeEvents = h5FormalOutcomeEvents;
  if (h5PostFormalFollowupQueue) state.h5PostFormalFollowupQueue = h5PostFormalFollowupQueue;
  if (h5PostFormalFollowupEvents) state.h5PostFormalFollowupEvents = h5PostFormalFollowupEvents;
  if (h5NoConversionReviewQueue) state.h5NoConversionReviewQueue = h5NoConversionReviewQueue;
  if (h5NoConversionReviewEvents) state.h5NoConversionReviewEvents = h5NoConversionReviewEvents;
  if (productCopyReviewQueue) state.productCopyReviewQueue = productCopyReviewQueue;
  if (productCopyReviewEvents) state.productCopyReviewEvents = productCopyReviewEvents;
  if (gateRecalculationPlan) state.gateRecalculationPlan = gateRecalculationPlan;
  const review = reviewQueue.summary || {};
  const feedback = feedbackUnits.summary || {};
  const actionSummary = state.advisorActionEvents?.summary || {};
  const recentEvents = state.advisorActionEvents?.events || [];
  const outcomeSummary = state.interactionOutcomeEvents?.summary || {};
  const recentOutcomes = state.interactionOutcomeEvents?.events || [];
  const learningSummary = state.feedbackLearningEvents?.summary || {};
  const kpiInteraction = state.lifecycleKpiSummary?.interactionKpis || {};
  const kpiPostSend = state.lifecycleKpiSummary?.postSendFollowupKpis || {};
  const ruleSummary = state.lifecycleRuleCandidates?.summary || {};
  const ruleRows = state.lifecycleRuleCandidates?.rules || [];
  const executionSummary = state.advisorExecutionPack?.summary || {};
  const sendGateSummary = state.manualSendGateQueue?.summary || {};
  const sendEventSummary = state.manualSendEvents?.summary || {};
  const recentSendEvents = state.manualSendEvents?.events || [];
  const followupSummary = state.postSendFollowupQueue?.summary || {};
  const followupRows = state.postSendFollowupQueue?.queue || [];
  const actionPlanSummary = state.nextRoundActionPlan?.summary || {};
  const actionPlanRows = state.nextRoundActionPlan?.actions || [];
  const todoSummary = state.adminTodoCenter?.summary || {};
  const todoRows = state.adminTodoCenter?.todos || [];
  const todoColumns = state.adminTodoCenter?.boardColumns || [];
  const todoEventSummary = state.adminTodoEvents?.summary || {};
  const recentTodoEvents = state.adminTodoEvents?.events || [];
  const todoEventByTodoId = new Map(recentTodoEvents.map((event) => [event.todoId, event]));
  const syncSummary = state.adminTodoSourceSyncPlan?.summary || {};
  const syncRows = state.adminTodoSourceSyncPlan?.syncItems || [];
  const sourceSyncEventSummary = state.adminSourceSyncEvents?.summary || {};
  const sourceSyncEvents = state.adminSourceSyncEvents?.events || [];
  const sourceSyncEventBySyncId = new Map(sourceSyncEvents.map((event) => [event.syncId, event]));
  const sourceSyncExecutionSummary = state.adminSourceSyncExecutionEvents?.summary || {};
  const sourceSyncExecutionEvents = state.adminSourceSyncExecutionEvents?.events || [];
  const sourceSyncExecutionBySourceEventId = new Map(sourceSyncExecutionEvents.map((event) => [event.sourceAdminSourceSyncEventId, event]));
  const mvpResultSummary = state.mvpResultScorecard?.summary || {};
  const mvpResultItems = state.mvpResultScorecard?.pdfResultItems || [];
  const realBusinessBackfillSummary = state.realBusinessTruthBackfillPlan?.summary || {};
  const realBusinessBackfillRequirements = state.realBusinessTruthBackfillPlan?.requirements || [];
  const realBusinessBackfillSqlTemplates = state.realBusinessTruthBackfillPlan?.sqlTemplates || [];
  const productClassificationSummary = state.productClassificationSeed?.summary || {};
  const productClassificationRows = state.productClassificationSeed?.observedProjects || [];
  const productClassificationSqlTemplates = state.productClassificationSeed?.sqlTemplates || [];
  const productClassificationReviewSummary = state.productClassificationReviewQueue?.summary || {};
  const productClassificationReviewRows = state.productClassificationReviewQueue?.reviewItems || [];
  const productClassificationReviewEventSummary = state.productClassificationReviewEvents?.summary || {};
  const productClassificationReviewEventRows = state.productClassificationReviewEvents?.events || [];
  const productClassificationReviewEventByQueueId = new Map(productClassificationReviewEventRows.map((event) => [event.reviewQueueId, event]));
  const productClassificationReviewExecutionSummary = state.productClassificationReviewExecutionPack?.summary || {};
  const productClassificationReviewExecutionRows = state.productClassificationReviewExecutionPack?.executionItems || [];
  const productClassificationReviewImportSummary = state.productClassificationReviewImportContract?.summary || {};
  const productClassificationReviewImportActions = state.productClassificationReviewImportContract?.allowedActions || [];
  const productClassificationReviewImportRows = state.productClassificationReviewImportContract?.templateRows || [];
  const productClassificationReviewImportReadinessSummary = state.productClassificationReviewImportReadinessReport?.summary || {};
  const productClassificationReviewImportReadinessRows = state.productClassificationReviewImportReadinessReport?.rowReadiness || [];
  const productClassificationReviewDecisionGuideSummary = state.productClassificationReviewDecisionGuide?.summary || {};
  const productClassificationReviewDecisionActions = state.productClassificationReviewDecisionGuide?.actionDictionary || [];
  const productClassificationReviewDecisionRows = state.productClassificationReviewDecisionGuide?.rowGuidance || [];
  const productClassificationRecomputeSummary = state.productClassificationRecomputePlan?.summary || {};
  const productClassificationRecomputeSteps = state.productClassificationRecomputePlan?.recomputeSteps || [];
  const productClassificationRecomputeGates = state.productClassificationRecomputePlan?.gateChecks || [];
  const productClassificationImpactSummary = state.productClassificationImpactPlan?.summary || {};
  const productClassificationImpactRows = state.productClassificationImpactPlan?.impactMatrix || [];
  const productClassificationImpactSqlRows = state.productClassificationImpactPlan?.sqlRegenerationPlan || [];
  const traceSummary = state.lifecycleTraceabilityMatrix?.summary || {};
  const traceRows = state.lifecycleTraceabilityMatrix?.matrix || [];
  const detailSummary = state.adminCustomerDetailPack?.summary || {};
  const detailRows = state.adminCustomerDetailPack?.customers || [];
  const h5GateSummary = state.h5PublishGateQueue?.summary || {};
  const h5GateRows = state.h5PublishGateQueue?.queue || [];
  const h5ReviewEventSummary = state.h5PublishReviewEvents?.summary || {};
  const h5ReviewEvents = state.h5PublishReviewEvents?.events || [];
  const h5ReviewEventByGateId = new Map(h5ReviewEvents.map((event) => [event.h5GateId, event]));
  const h5ExecutionSummary = state.h5PublishExecutionEvents?.summary || {};
  const h5ExecutionEvents = state.h5PublishExecutionEvents?.events || [];
  const h5ExecutionEventByReviewEventId = new Map(h5ExecutionEvents.map((event) => [event.sourceH5PublishReviewEventId, event]));
  const h5EngagementSummary = state.h5EngagementEvents?.summary || {};
  const h5EngagementRows = state.h5EngagementEvents?.events || [];
  const h5FeedbackBridgeSummary = state.h5FeedbackLearningBridge?.summary || {};
  const h5FeedbackBridgeRows = state.h5FeedbackLearningBridge?.rows || [];
  const h5FeedbackBridgeAngleRows = state.h5FeedbackLearningBridge?.byMessageAngle || [];
  const h5FormalOutcomeSummary = state.h5FormalOutcomeEvents?.summary || {};
  const h5FormalOutcomeRows = state.h5FormalOutcomeEvents?.events || [];
  const h5PostFormalFollowupSummary = state.h5PostFormalFollowupQueue?.summary || {};
  const h5PostFormalFollowupRows = state.h5PostFormalFollowupQueue?.queue || [];
  const h5PostFormalFollowupEventSummary = state.h5PostFormalFollowupEvents?.summary || {};
  const h5PostFormalFollowupEventRows = state.h5PostFormalFollowupEvents?.events || [];
  const h5NoConversionReviewSummary = state.h5NoConversionReviewQueue?.summary || {};
  const h5NoConversionReviewRows = state.h5NoConversionReviewQueue?.reviewItems || [];
  const h5NoConversionReasonTaxonomy = state.h5NoConversionReviewQueue?.reasonTaxonomy || [];
  const h5NoConversionReviewEventSummary = state.h5NoConversionReviewEvents?.summary || {};
  const h5NoConversionReviewEventRows = state.h5NoConversionReviewEvents?.events || [];
  const h5EngagementEventsByExecutionId = new Map();
  h5EngagementRows.forEach((event) => {
    const rows = h5EngagementEventsByExecutionId.get(event.sourceH5PublishExecutionEventId) || [];
    rows.push(event);
    h5EngagementEventsByExecutionId.set(event.sourceH5PublishExecutionEventId, rows);
  });
  const h5FormalOutcomeEventsByBridgeId = new Map();
  h5FormalOutcomeRows.forEach((event) => {
    const rows = h5FormalOutcomeEventsByBridgeId.get(event.sourceH5FeedbackBridgeEventId) || [];
    rows.push(event);
    h5FormalOutcomeEventsByBridgeId.set(event.sourceH5FeedbackBridgeEventId, rows);
  });
  const h5PostFormalFollowupEventsByFollowupId = new Map();
  h5PostFormalFollowupEventRows.forEach((event) => {
    const rows = h5PostFormalFollowupEventsByFollowupId.get(event.followupId) || [];
    rows.push(event);
    h5PostFormalFollowupEventsByFollowupId.set(event.followupId, rows);
  });
  const productReviewSummary = state.productCopyReviewQueue?.summary || {};
  const productReviewRows = state.productCopyReviewQueue?.queue || [];
  const productReviewEventSummary = state.productCopyReviewEvents?.summary || {};
  const productReviewEvents = state.productCopyReviewEvents?.events || [];
  const gateRecalcSummary = state.gateRecalculationPlan?.summary || {};
  const gateRecalcRows = state.gateRecalculationPlan?.recalculationItems || [];
  const productReviewEventByQueueId = new Map(productReviewEvents.map((event) => [event.reviewQueueId, event]));
  const sendGateByReviewId = new Map((state.manualSendGateQueue?.queue || []).map((item) => [item.reviewItemId, item]));
  const sendEventByGateId = new Map(recentSendEvents.map((event) => [event.gateId, event]));
  $('#lifecycle-ops-summary').innerHTML = `
    <article><span>待审核</span><strong>${formatNumber(review.total)}</strong></article>
    <article><span>绿灯</span><strong>${formatNumber(review.green)}</strong></article>
    <article><span>黄灯</span><strong>${formatNumber(review.yellow)}</strong></article>
    <article><span>测试单元</span><strong>${formatNumber(feedback.testUnits)}</strong></article>
    <article><span>已记录动作</span><strong>${formatNumber(actionSummary.totalEvents || 0)}</strong></article>
    <article><span>可人工发送</span><strong>${formatNumber(actionSummary.sendEligibleEvents || 0)}</strong></article>
    <article><span>结果事件</span><strong>${formatNumber(outcomeSummary.totalEvents || 0)}</strong></article>
    <article><span>预约/到店/转化</span><strong>${formatNumber(outcomeSummary.appointmentCreatedEvents || 0)}/${formatNumber(outcomeSummary.arrivedEvents || 0)}/${formatNumber(outcomeSummary.convertedEvents || 0)}</strong></article>
    <article><span>落库映射行</span><strong>${formatNumber(learningSummary.totalRows || 0)}</strong></article>
    <article><span>已合并结果</span><strong>${formatNumber(learningSummary.rowsWithOutcomeEvent || 0)}</strong></article>
    <article><span>映射待观察</span><strong>${formatNumber(learningSummary.rowsPendingOnly || 0)}</strong></article>
    <article><span>映射转化</span><strong>${formatNumber(learningSummary.convertedRows || 0)}</strong></article>
    <article><span>人工后响应率</span><strong>${formatNumber(kpiInteraction.responseRateAfterManualSend || 0)}%</strong></article>
    <article><span>人工后预约率</span><strong>${formatNumber(kpiInteraction.appointmentRateAfterManualSend || 0)}%</strong></article>
    <article><span>人工后到店/转化</span><strong>${formatNumber(kpiInteraction.arrivedEventsAfterManualSend || 0)}/${formatNumber(kpiInteraction.convertedEventsAfterManualSend || 0)}</strong></article>
    <article><span>高优先跟进</span><strong>${formatNumber(kpiPostSend.highPriorityFollowups || 0)}</strong></article>
    <article><span>规则候选</span><strong>${formatNumber(ruleSummary.totalRuleCandidates || 0)}</strong></article>
    <article><span>小批扩大</span><strong>${formatNumber(ruleSummary.expandSmallBatchRules || 0)}</strong></article>
    <article><span>含发送证据规则</span><strong>${formatNumber(ruleSummary.rulesWithManualSendEvidence || 0)}</strong></article>
    <article><span>含H5意向规则</span><strong>${formatNumber(ruleSummary.rulesWithH5AppointmentIntent || 0)}</strong></article>
    <article><span>待补H5正式结果</span><strong>${formatNumber(ruleSummary.rulesWaitingH5FormalOutcomeBackfill || 0)}</strong></article>
    <article><span>可发布规则</span><strong>${formatNumber(ruleSummary.publishableRules || 0)}</strong></article>
    <article><span>顾问执行包</span><strong>${formatNumber(executionSummary.totalCards || 0)}</strong></article>
    <article><span>话术/H5草稿</span><strong>${formatNumber(executionSummary.messageDrafts || 0)}/${formatNumber(executionSummary.h5Drafts || 0)}</strong></article>
    <article><span>自动发送</span><strong>${formatNumber(executionSummary.autoSendAllowedCards || 0)}</strong></article>
    <article><span>发送门禁</span><strong>${formatNumber(sendGateSummary.totalGates || 0)}</strong></article>
    <article><span>人工可发送</span><strong>${formatNumber(sendGateSummary.manualSendAllowed || 0)}</strong></article>
    <article><span>需复核/版本</span><strong>${formatNumber(sendGateSummary.needsProductOrCopyReview || 0)}/${formatNumber(sendGateSummary.needsVariantSelection || 0)}</strong></article>
    <article><span>人工发送确认</span><strong>${formatNumber(sendEventSummary.manualSendConfirmedEvents || 0)}</strong></article>
    <article><span>自动发送事件</span><strong>${formatNumber(sendEventSummary.automaticSendEvents || 0)}</strong></article>
    <article><span>发送后跟进</span><strong>${formatNumber(followupSummary.totalFollowups || 0)}</strong></article>
    <article><span>预约待到店</span><strong>${formatNumber(followupSummary.appointmentCreatedConfirmArrival || 0)}</strong></article>
    <article><span>自动二次触达</span><strong>${formatNumber((followupSummary.totalFollowups || 0) - (followupSummary.automaticSecondTouchBlocked || 0))}</strong></article>
    <article><span>下一轮行动</span><strong>${formatNumber(actionPlanSummary.totalActions || 0)}</strong></article>
    <article><span>高优先行动</span><strong>${formatNumber(actionPlanSummary.highPriorityActions || 0)}</strong></article>
    <article><span>结果/审核/复核</span><strong>${formatNumber(actionPlanSummary.resultBackfillActions || 0)}/${formatNumber(actionPlanSummary.advisorReviewActions || 0)}/${formatNumber(actionPlanSummary.productCopyReviewActions || 0)}</strong></article>
    <article><span>管理待办</span><strong>${formatNumber(todoSummary.totalTodos || 0)}</strong></article>
    <article><span>今日处理</span><strong>${formatNumber(todoSummary.todayTodos || 0)}</strong></article>
    <article><span>待办自动发送</span><strong>${formatNumber((todoSummary.totalTodos || 0) - (todoSummary.noAutoSendTodos || 0))}</strong></article>
    <article><span>待办写回</span><strong>${formatNumber(todoEventSummary.totalEvents || 0)}</strong></article>
    <article><span>完成/退回</span><strong>${formatNumber(todoEventSummary.completedEvents || 0)}/${formatNumber(todoEventSummary.returnedEvents || 0)}</strong></article>
    <article><span>源同步项</span><strong>${formatNumber(syncSummary.totalSyncItems || 0)}</strong></article>
    <article><span>自动应用patch</span><strong>${formatNumber(syncSummary.sourcePatchAutoApplyAllowed || 0)}</strong></article>
    <article><span>源同步H5发布</span><strong>${formatNumber(syncSummary.h5CustomerFacingPublishAllowedItems || 0)}</strong></article>
    <article><span>源同步复核</span><strong>${formatNumber(sourceSyncEventSummary.totalEvents || 0)}</strong></article>
    <article><span>复核通过/退回</span><strong>${formatNumber(sourceSyncEventSummary.approvedForManualBackendApplyEvents || 0)}/${formatNumber(sourceSyncEventSummary.returnedForMappingEvents || 0)}</strong></article>
    <article><span>源同步执行</span><strong>${formatNumber(sourceSyncExecutionSummary.totalEvents || 0)}</strong></article>
    <article><span>执行成功/失败</span><strong>${formatNumber(sourceSyncExecutionSummary.manualApplySucceededEvents || 0)}/${formatNumber(sourceSyncExecutionSummary.manualApplyFailedEvents || 0)}</strong></article>
    <article><span>MVP结果字段</span><strong>${formatNumber(mvpResultSummary.totalResultItems || 0)}</strong></article>
    <article><span>本地可填/缺真值</span><strong>${formatNumber(mvpResultSummary.repoLocalFilledItems || 0)}/${formatNumber(mvpResultSummary.missingRealBusinessTruth || 0)}</strong></article>
    <article><span>真实业务确认</span><strong>${formatNumber(mvpResultSummary.realBusinessOutcomeConfirmedItems || 0)}</strong></article>
    <article><span>真实补证要求</span><strong>${formatNumber(realBusinessBackfillSummary.backfillRequirements || 0)}</strong></article>
    <article><span>只读SQL模板</span><strong>${formatNumber(realBusinessBackfillSummary.sqlTemplates || 0)}</strong></article>
    <article><span>补证安全违规</span><strong>${formatNumber(Object.values(realBusinessBackfillSummary.safetyViolations || {}).reduce((sum, value) => sum + Number(value || 0), 0))}</strong></article>
    <article><span>项目分类规则</span><strong>${formatNumber(productClassificationSummary.totalRules || 0)}</strong></article>
    <article><span>项目命中/复核</span><strong>${formatNumber(productClassificationSummary.matchedExplicitScopeProjects || 0)}/${formatNumber(productClassificationSummary.reviewRequiredProjects || 0)}</strong></article>
    <article><span>分类复核队列</span><strong>${formatNumber(productClassificationReviewSummary.totalReviewItems || 0)}</strong></article>
    <article><span>分类复核写回</span><strong>${formatNumber(productClassificationReviewEventSummary.totalEvents || 0)}</strong></article>
    <article><span>分类影响门禁</span><strong>${escapeHtml(productClassificationImpactSummary.classificationGateStatus || '待生成')}</strong></article>
    <article><span>链路审计客户</span><strong>${formatNumber(traceSummary.totalCustomers || 0)}</strong></article>
    <article><span>链路安全违规</span><strong>${formatNumber((traceSummary.automaticSendAllowedCustomers || 0) + (traceSummary.remoteWriteAllowedCustomers || 0) + (traceSummary.sensitiveRawTextAllowedCustomers || 0) + (traceSummary.ruleAutoPublishAllowedCustomers || 0))}</strong></article>
    <article><span>单客详情</span><strong>${formatNumber(detailSummary.totalCustomers || 0)}</strong></article>
    <article><span>详情发布允许</span><strong>${formatNumber(detailSummary.customerFacingContentPublishAllowedCustomers || 0)}</strong></article>
    <article><span>H5门禁</span><strong>${formatNumber(h5GateSummary.totalH5Gates || 0)}</strong></article>
    <article><span>H5对客发布</span><strong>${formatNumber(h5GateSummary.customerFacingContentPublishAllowed || 0)}</strong></article>
    <article><span>H5复核写回</span><strong>${formatNumber(h5ReviewEventSummary.totalEvents || 0)}</strong></article>
    <article><span>H5发布执行前置</span><strong>${formatNumber(h5ReviewEventSummary.manualPublishExecutionAllowedEvents || 0)}</strong></article>
    <article><span>H5人工发布执行</span><strong>${formatNumber(h5ExecutionSummary.manualPublishExecutionConfirmedEvents || 0)}</strong></article>
    <article><span>H5自动发布事件</span><strong>${formatNumber(h5ExecutionSummary.automaticPublishEvents || 0)}</strong></article>
    <article><span>H5互动事件</span><strong>${formatNumber(h5EngagementSummary.totalEvents || 0)}</strong></article>
    <article><span>H5预约意向</span><strong>${formatNumber(h5EngagementSummary.appointmentIntentEvents || 0)}</strong></article>
    <article><span>H5学习桥接</span><strong>${formatNumber(h5FeedbackBridgeSummary.totalBridgeRows || 0)}</strong></article>
    <article><span>H5打开/点击率</span><strong>${formatNumber(h5FeedbackBridgeSummary.openRateByEligibleExecution || 0)}%/${formatNumber(h5FeedbackBridgeSummary.primaryClickRateByOpened || 0)}%</strong></article>
    <article><span>H5意向率</span><strong>${formatNumber(h5FeedbackBridgeSummary.appointmentIntentRateByOpened || 0)}%</strong></article>
    <article><span>H5结果补录</span><strong>${formatNumber(h5FormalOutcomeSummary.totalEvents || 0)}</strong></article>
    <article><span>H5正式预约/到店/转化</span><strong>${formatNumber(h5FormalOutcomeSummary.formalAppointmentCreatedEvents || 0)}/${formatNumber(h5FormalOutcomeSummary.arrivedEvents || 0)}/${formatNumber(h5FormalOutcomeSummary.convertedEvents || 0)}</strong></article>
    <article><span>H5到店转化跟进</span><strong>${formatNumber(h5PostFormalFollowupSummary.totalFollowups || 0)}</strong></article>
    <article><span>H5预约待到店/待转化</span><strong>${formatNumber(h5PostFormalFollowupSummary.formalAppointmentConfirmArrival || 0)}/${formatNumber(h5PostFormalFollowupSummary.arrivedNeedsConversionConfirmation || 0)}</strong></article>
    <article><span>H5跟进写回</span><strong>${formatNumber(h5PostFormalFollowupEventSummary.totalEvents || 0)}</strong></article>
    <article><span>H5跟进到店/转化</span><strong>${formatNumber(h5PostFormalFollowupEventSummary.arrivedEvents || 0)}/${formatNumber(h5PostFormalFollowupEventSummary.convertedEvents || 0)}</strong></article>
    <article><span>H5未转化复盘</span><strong>${formatNumber(h5NoConversionReviewSummary.totalReviewItems || 0)}</strong></article>
    <article><span>未转化原因枚举</span><strong>${formatNumber(h5NoConversionReviewSummary.reasonTaxonomyCount || 0)}</strong></article>
    <article><span>未转化原因写回</span><strong>${formatNumber(h5NoConversionReviewEventSummary.totalEvents || 0)}</strong></article>
    <article><span>产品/话术复核</span><strong>${formatNumber(productReviewSummary.totalReviewItems || 0)}</strong></article>
    <article><span>复核后自动发送</span><strong>${formatNumber(productReviewSummary.automaticSendAllowed || 0)}</strong></article>
    <article><span>复核写回</span><strong>${formatNumber(productReviewEventSummary.totalEvents || 0)}</strong></article>
    <article><span>待顾问最终确认</span><strong>${formatNumber(productReviewEventSummary.returnToAdvisorFinalConfirmEvents || 0)}</strong></article>
    <article><span>门禁重算</span><strong>${formatNumber(gateRecalcSummary.totalRecalculationItems || 0)}</strong></article>
    <article><span>重算后发送</span><strong>${formatNumber(gateRecalcSummary.manualSendAllowedAfterRecalc || 0)}</strong></article>
    <article><span>重算后H5发布</span><strong>${formatNumber(gateRecalcSummary.h5CustomerFacingPublishAllowedAfterRecalc || 0)}</strong></article>
  `;
  $('#advisor-review-list').innerHTML = reviewQueue.items.slice(0, 20).map((item) => {
    const sendGate = sendGateByReviewId.get(item.reviewItemId);
    const sendEvent = sendGate ? sendEventByGateId.get(sendGate.gateId) : null;
    return `
    <article class="advisor-review-item" data-review-item-id="${escapeHtml(item.reviewItemId)}">
      <div class="review-item-head">
        <span class="status-chip ${riskLevelClass(item.riskGate?.level)}">${riskLevelLabel(item.riskGate?.level)}</span>
        <strong>${escapeHtml(item.unifiedCustomerId)}</strong>
      </div>
      <p>${escapeHtml(item.advisorBrief)}</p>
      <div class="review-actions">${item.allowedActions.map((action) => `
        <button
          type="button"
          class="advisor-action-button"
          data-review-item-id="${escapeHtml(item.reviewItemId)}"
          data-action="${escapeHtml(action)}"
        >${escapeHtml(action)}</button>
      `).join('')}</div>
      ${sendGate ? `
        <div class="manual-send-gate">
          <span class="status-chip ${sendGate.manualSendAllowed ? 'is-complete' : 'is-pending'}">${escapeHtml(sendGate.gateStatus)}</span>
          <span>${escapeHtml(sendGate.nextAction || '')}</span>
          ${sendEvent ? `
            <strong>已确认人工发送 · ${escapeHtml(sendEvent.sendChannel)} · ${escapeHtml(sendEvent.messageSentAt)}</strong>
          ` : ''}
          ${sendGate.manualSendAllowed && !sendEvent ? `
            <button
              type="button"
              class="manual-send-button"
              data-gate-id="${escapeHtml(sendGate.gateId)}"
              data-send-channel="wechat_work"
            >确认企微人工发送</button>
          ` : ''}
        </div>
      ` : ''}
      <div class="review-action-status" id="review-action-status-${escapeHtml(item.reviewItemId)}"></div>
      ${sendGate ? `<div class="manual-send-status" id="manual-send-status-${escapeHtml(sendGate.gateId)}"></div>` : ''}
    </article>
  `;
  }).join('');
  $('#feedback-unit-list').innerHTML = feedbackUnits.units.slice(0, 12).map((unit) => `
    <article class="feedback-unit-item" data-test-unit-id="${escapeHtml(unit.testUnitId)}">
      <strong>${escapeHtml(unit.testUnitId)}</strong>
      <span>${escapeHtml(unit.messageVariant)} · ${escapeHtml(unit.messageAngle)} · ${escapeHtml(unit.customerResponse)}</span>
      <p>${escapeHtml(unit.triggerReason)}</p>
      <div class="outcome-actions">
        <button type="button" class="outcome-action-button" data-test-unit-id="${escapeHtml(unit.testUnitId)}" data-outcome-type="no_response">无响应</button>
        <button type="button" class="outcome-action-button" data-test-unit-id="${escapeHtml(unit.testUnitId)}" data-outcome-type="replied">已回复</button>
        <button type="button" class="outcome-action-button" data-test-unit-id="${escapeHtml(unit.testUnitId)}" data-outcome-type="positive_response">正向回复</button>
        <button type="button" class="outcome-action-button" data-test-unit-id="${escapeHtml(unit.testUnitId)}" data-outcome-type="appointment_created">已预约</button>
        <button type="button" class="outcome-action-button" data-test-unit-id="${escapeHtml(unit.testUnitId)}" data-outcome-type="arrived">已到店</button>
        <button type="button" class="outcome-action-button" data-test-unit-id="${escapeHtml(unit.testUnitId)}" data-outcome-type="maintenance_converted">维护转化</button>
      </div>
      <div class="outcome-action-status" id="outcome-action-status-${escapeHtml(unit.testUnitId)}"></div>
    </article>
  `).join('') + `
    <div class="advisor-event-log">
      <h4>最近顾问动作</h4>
      ${recentEvents.length ? recentEvents.slice(0, 8).map((event) => `
        <article>
          <strong>${escapeHtml(event.actionLabel)} · ${escapeHtml(event.reviewStatus)}</strong>
          <span>${escapeHtml(event.unifiedCustomerId)} · ${escapeHtml(event.selectedTestUnitId || '未选择测试单元')}</span>
          <p>${escapeHtml(event.learningResult || '')}</p>
        </article>
      `).join('') : '<div class="empty">尚未记录顾问动作。点击审核队列中的按钮后，会在这里生成本地反馈学习事件。</div>'}
    </div>
    <div class="outcome-event-log">
      <h4>最近互动结果</h4>
      ${recentOutcomes.length ? recentOutcomes.slice(0, 8).map((event) => `
        <article>
          <strong>${escapeHtml(event.outcomeLabel)} · ${escapeHtml(event.customerResponse)}</strong>
          <span>${escapeHtml(event.testUnitId)} · ${escapeHtml(event.unifiedCustomerId)}</span>
          <p>${escapeHtml(event.learningResult || '')}</p>
        </article>
      `).join('') : '<div class="empty">尚未记录互动结果。点击测试单元上的结果按钮后，会在这里生成本地结果事件。</div>'}
    </div>
    <div class="manual-send-event-log">
      <h4>最近人工发送确认</h4>
      ${recentSendEvents.length ? recentSendEvents.slice(0, 8).map((event) => `
        <article>
          <strong>${escapeHtml(event.sendChannel)} · ${escapeHtml(event.publishStatus)}</strong>
          <span>${escapeHtml(event.unifiedCustomerId)} · ${escapeHtml(event.selectedTestUnitId || '未选择测试单元')}</span>
          <p>人工确认：${escapeHtml(event.messageSentAt || '')}；自动发送：${event.automaticSendAllowed ? '允许' : '阻断'}</p>
        </article>
      `).join('') : '<div class="empty">尚未记录人工发送确认。只有门禁通过的任务卡才会出现确认按钮。</div>'}
    </div>
    <div class="post-send-followup-log">
      <h4>发送后跟进队列</h4>
      ${followupRows.length ? followupRows.slice(0, 8).map((item) => `
        <article>
          <strong>${escapeHtml(item.followupStatus)} · ${escapeHtml(item.priority)}</strong>
          <span>${escapeHtml(item.unifiedCustomerId)} · ${escapeHtml(item.selectedTestUnitId || '未选择测试单元')}</span>
          <p>${escapeHtml(item.nextAdvisorAction || '')}</p>
          <small>需回流：${escapeHtml((item.resultCaptureRequired || []).join('、'))}；自动二次触达：${item.automaticSecondTouchBlocked ? '阻断' : '允许'}</small>
        </article>
      `).join('') : '<div class="empty">尚未产生发送后跟进记录。人工发送确认后会进入这里。</div>'}
    </div>
    <div class="next-round-action-log">
      <h4>下一轮行动计划</h4>
      ${actionPlanRows.length ? actionPlanRows.slice(0, 10).map((item) => `
        <article>
          <strong>${escapeHtml(item.workstream)} · ${escapeHtml(item.priority)}</strong>
          <span>${escapeHtml(item.title || '')}</span>
          <p>${escapeHtml(item.nextAction || '')}</p>
          <small>${escapeHtml(item.unifiedCustomerId || item.ruleId || item.sourceId || '')}；自动发送：${item.noAutoSend ? '阻断' : '允许'}；远端写入：${item.remoteWriteAllowed ? '允许' : '阻断'}</small>
        </article>
      `).join('') : '<div class="empty">尚未生成下一轮行动计划。</div>'}
    </div>
    <div class="admin-todo-log">
      <h4>管理后台待办中心</h4>
      <div class="todo-column-summary">
        ${todoColumns.length ? todoColumns.map((column) => `
          <span>${escapeHtml(column.label)} ${formatNumber(column.count || 0)}</span>
        `).join('') : '<span>尚未生成看板分组</span>'}
      </div>
      ${todoRows.length ? todoRows.slice(0, 10).map((item) => `
        <article>
          <strong>${escapeHtml(item.lane)} · ${escapeHtml(item.priority)}</strong>
          <span>${escapeHtml(item.title || '')}</span>
          <p>${escapeHtml(item.description || '')}</p>
          <small>${escapeHtml(item.ownerLabel || item.ownerRole || '')}；入口：${escapeHtml(item.primaryCta || '')}；自动发送：${item.safety?.noAutoSend ? '阻断' : '允许'}；规则发布：${item.safety?.ruleAutoPublishAllowed ? '允许' : '阻断'}</small>
          ${todoEventByTodoId.has(item.todoId) ? `
            <small>最近写回：${escapeHtml(todoEventByTodoId.get(item.todoId).actionLabel)} · ${escapeHtml(todoEventByTodoId.get(item.todoId).nextTodoStatus)}</small>
          ` : ''}
          <div class="todo-actions">
            <button type="button" class="admin-todo-button" data-todo-id="${escapeHtml(item.todoId)}" data-action="completed">完成</button>
            <button type="button" class="admin-todo-button" data-todo-id="${escapeHtml(item.todoId)}" data-action="returned">退回补充</button>
            <button type="button" class="admin-todo-button" data-todo-id="${escapeHtml(item.todoId)}" data-action="keep_observing">继续观察</button>
          </div>
          <div class="admin-todo-status" id="admin-todo-status-${escapeHtml(item.todoId)}"></div>
        </article>
      `).join('') : '<div class="empty">尚未生成管理后台待办。</div>'}
      <div class="admin-todo-event-log">
        <h4>最近待办写回</h4>
        ${recentTodoEvents.length ? recentTodoEvents.slice(0, 8).map((event) => `
          <article>
            <strong>${escapeHtml(event.actionLabel)} · ${escapeHtml(event.nextTodoStatus)}</strong>
            <span>${escapeHtml(event.lane)} · ${escapeHtml(event.todoId)}</span>
            <p>${escapeHtml(event.learningResult || '')}</p>
          </article>
        `).join('') : '<div class="empty">尚未记录后台待办写回。点击待办按钮后，会在这里生成本地结构化事件。</div>'}
      </div>
      <div class="admin-source-sync-log">
        <h4>源事件同步计划</h4>
        ${syncRows.length ? syncRows.slice(0, 8).map((item) => {
          const syncEvent = sourceSyncEventBySyncId.get(item.syncId);
          return `
          <article>
            <strong>${escapeHtml(item.syncStatus)} · ${escapeHtml(item.syncAction)}</strong>
            <span>${escapeHtml(item.targetEntity)} · ${escapeHtml(item.targetId)}</span>
            <p>${escapeHtml(item.patchPreview?.recommendationAppend || item.patchPreview?.note || '')}</p>
            <small>自动应用 patch：${item.safety?.sourcePatchAutoApplyAllowed ? '允许' : '阻断'}；自动发送：${item.safety?.automaticSendAllowed ? '允许' : '阻断'}；H5 发布：${item.safety?.h5CustomerFacingPublishAllowed ? '允许' : '阻断'}；规则发布：${item.safety?.ruleAutoPublishAllowed ? '允许' : '阻断'}</small>
            ${syncEvent ? `<small>最近复核：${escapeHtml(syncEvent.actionLabel)} · ${escapeHtml(syncEvent.nextSyncReviewStatus)}</small>` : ''}
            <div class="admin-source-sync-actions">
              <button type="button" class="admin-source-sync-button" data-sync-id="${escapeHtml(item.syncId)}" data-sync-decision="approve_for_manual_backend_apply">批准人工落地</button>
              <button type="button" class="admin-source-sync-button" data-sync-id="${escapeHtml(item.syncId)}" data-sync-decision="return_for_mapping">退回补映射</button>
              <button type="button" class="admin-source-sync-button" data-sync-id="${escapeHtml(item.syncId)}" data-sync-decision="keep_pending_manual_sync">继续等待</button>
            </div>
            <div class="admin-source-sync-status" id="admin-source-sync-status-${escapeHtml(item.syncId)}"></div>
          </article>
        `;
        }).join('') : '<div class="empty">尚未生成源事件同步计划。</div>'}
        <div class="admin-source-sync-event-log">
          <h4>最近源同步人工确认</h4>
          <div class="admin-source-sync-event-summary">
            <span>写回 ${formatNumber(sourceSyncEventSummary.totalEvents || 0)}</span>
            <span>批准人工落地 ${formatNumber(sourceSyncEventSummary.approvedForManualBackendApplyEvents || 0)}</span>
            <span>退回补映射 ${formatNumber(sourceSyncEventSummary.returnedForMappingEvents || 0)}</span>
            <span>继续等待 ${formatNumber(sourceSyncEventSummary.keptPendingEvents || 0)}</span>
            <span>未复核 ${formatNumber(sourceSyncEventSummary.sourceSyncItemsWithoutDecision || 0)}</span>
            <span>自动 patch ${formatNumber(sourceSyncEventSummary.sourcePatchAutoApplyAllowedEvents || 0)}</span>
            <span>远端写入 ${formatNumber(sourceSyncEventSummary.remoteWriteAllowedEvents || 0)}</span>
          </div>
          ${sourceSyncEvents.length ? sourceSyncEvents.slice(0, 8).map((event) => `
            <article>
              <strong>${escapeHtml(event.actionLabel)} · ${escapeHtml(event.nextSyncReviewStatus)}</strong>
              <span>${escapeHtml(event.targetEntity)} · ${escapeHtml(event.targetId)}</span>
              <p>${escapeHtml(event.learningResult || '')}</p>
              <small>自动 patch：${event.sourcePatchAutoApplyAllowed ? '允许' : '阻断'}；远端写入：${event.remoteWriteAllowed ? '允许' : '阻断'}；自动发送：${event.automaticSendAllowed ? '允许' : '阻断'}；规则发布：${event.ruleAutoPublishAllowed ? '允许' : '阻断'}</small>
              ${sourceSyncExecutionBySourceEventId.has(event.eventId) ? `
                <small>执行结果：${escapeHtml(sourceSyncExecutionBySourceEventId.get(event.eventId).actionLabel)} · ${escapeHtml(sourceSyncExecutionBySourceEventId.get(event.eventId).nextExecutionStatus)}</small>
              ` : ''}
              ${event.syncDecision === 'approve_for_manual_backend_apply' && !sourceSyncExecutionBySourceEventId.has(event.eventId) ? `
                <div class="admin-source-sync-execution-actions">
                  <button type="button" class="admin-source-sync-execution-button" data-source-sync-event-id="${escapeHtml(event.eventId)}" data-execution-result="manual_apply_succeeded">记录人工落地成功</button>
                  <button type="button" class="admin-source-sync-execution-button" data-source-sync-event-id="${escapeHtml(event.eventId)}" data-execution-result="manual_apply_failed">记录人工落地失败</button>
                  <button type="button" class="admin-source-sync-execution-button" data-source-sync-event-id="${escapeHtml(event.eventId)}" data-execution-result="skip_keep_waiting">跳过继续等待</button>
                </div>
                <div class="admin-source-sync-execution-status" id="admin-source-sync-execution-status-${escapeHtml(event.eventId)}"></div>
              ` : ''}
            </article>
          `).join('') : '<div class="empty">尚未记录源同步人工确认。</div>'}
          <div class="admin-source-sync-execution-log">
            <h4>最近源同步人工落地执行结果</h4>
            <div class="admin-source-sync-execution-summary">
              <span>执行结果 ${formatNumber(sourceSyncExecutionSummary.totalEvents || 0)}</span>
              <span>已批准待执行 ${formatNumber(sourceSyncExecutionSummary.approvedSourceSyncEventsWithoutExecution || 0)}</span>
              <span>成功 ${formatNumber(sourceSyncExecutionSummary.manualApplySucceededEvents || 0)}</span>
              <span>失败 ${formatNumber(sourceSyncExecutionSummary.manualApplyFailedEvents || 0)}</span>
              <span>跳过等待 ${formatNumber(sourceSyncExecutionSummary.skippedWaitingEvents || 0)}</span>
              <span>自动 patch ${formatNumber(sourceSyncExecutionSummary.sourcePatchAutoApplyAllowedEvents || 0)}</span>
              <span>远端写入 ${formatNumber(sourceSyncExecutionSummary.remoteWriteAllowedEvents || 0)}</span>
            </div>
            ${sourceSyncExecutionEvents.length ? sourceSyncExecutionEvents.slice(0, 8).map((event) => `
              <article>
                <strong>${escapeHtml(event.actionLabel)} · ${escapeHtml(event.nextExecutionStatus)}</strong>
                <span>${escapeHtml(event.targetEntity)} · ${escapeHtml(event.targetId)}</span>
                <p>${escapeHtml(event.learningResult || '')}</p>
                <small>自动 patch：${event.sourcePatchAutoApplyAllowed ? '允许' : '阻断'}；远端写入：${event.remoteWriteAllowed ? '允许' : '阻断'}；自动发送：${event.automaticSendAllowed ? '允许' : '阻断'}；规则发布：${event.ruleAutoPublishAllowed ? '允许' : '阻断'}</small>
              </article>
            `).join('') : '<div class="empty">尚未记录源同步人工落地执行结果。</div>'}
          </div>
        </div>
      </div>
      <div class="mvp-result-scorecard-log">
        <h4>PDF MVP结果填报状态</h4>
        <div class="mvp-result-scorecard-summary">
          <span>结果字段 ${formatNumber(mvpResultSummary.totalResultItems || 0)}</span>
          <span>本地可填 ${formatNumber(mvpResultSummary.repoLocalFilledItems || 0)}</span>
          <span>缺真实业务真值 ${formatNumber(mvpResultSummary.missingRealBusinessTruth || 0)}</span>
          <span>真实业务确认 ${formatNumber(mvpResultSummary.realBusinessOutcomeConfirmedItems || 0)}</span>
          <span>候选池 ${formatNumber(mvpResultSummary.candidateSceneUsers || 0)}</span>
          <span>前20批次 ${formatNumber(mvpResultSummary.lifecycleBatchCustomers || 0)}</span>
          <span>AI简报 ${formatNumber(mvpResultSummary.aiBriefsGenerated || 0)}</span>
          <span>ROI待补 ${formatNumber((mvpResultItems || []).filter((item) => item.evidenceStatus === 'missing_real_business_truth').length)}</span>
        </div>
        ${mvpResultItems.length ? mvpResultItems.slice(0, 16).map((item) => `
          <article>
            <strong>${escapeHtml(item.label)} · ${escapeHtml(item.pdfSection || '')}</strong>
            <span>${formatMetricValue(item.value, item.unit)} · ${escapeHtml(item.evidenceStatus || '')}</span>
            <p>${escapeHtml(item.interpretation || '')}</p>
            <small>业务真值：${escapeHtml(item.businessTruthStatus || '')}；下一步：${escapeHtml(item.requiredToConfirm || '')}</small>
          </article>
        `).join('') : '<div class="empty">尚未生成 MVP 结果填报状态。运行 generate_mvp_result_scorecard.mjs 后会在这里展示。</div>'}
      </div>
      <div class="real-business-backfill-log">
        <h4>真实业务结果补证计划</h4>
        <div class="real-business-backfill-summary">
          <span>补证要求 ${formatNumber(realBusinessBackfillSummary.backfillRequirements || 0)}</span>
          <span>元数据可复核 ${formatNumber(realBusinessBackfillSummary.requirementsReadyForMetadataReview || 0)}</span>
          <span>live阻塞 ${formatNumber(realBusinessBackfillSummary.requirementsBlockedByLiveSource || 0)}</span>
          <span>SQL模板 ${formatNumber(realBusinessBackfillSummary.sqlTemplates || 0)}</span>
          <span>预约字段 ${formatNumber(realBusinessBackfillSummary.sourceMappedFieldCounts?.appointment || 0)}</span>
          <span>到店字段 ${formatNumber(realBusinessBackfillSummary.sourceMappedFieldCounts?.visit || 0)}</span>
          <span>订单/付款字段 ${formatNumber(realBusinessBackfillSummary.sourceMappedFieldCounts?.orderAndPayment || 0)}</span>
          <span>消耗字段 ${formatNumber(realBusinessBackfillSummary.sourceMappedFieldCounts?.consumption || 0)}</span>
        </div>
        ${realBusinessBackfillRequirements.length ? realBusinessBackfillRequirements.map((item) => `
          <article>
            <strong>${escapeHtml(item.id)} · ${escapeHtml(item.ownerAgent || '')}</strong>
            <span>${escapeHtml(item.kpiGroup || '')} · ${escapeHtml(item.readiness || '')}</span>
            <p>${escapeHtml(item.businessQuestion || '')}</p>
            <small>阻塞：${escapeHtml(item.blocker || '')}</small>
            <small>验收：${escapeHtml(item.acceptanceCriteria || '')}</small>
            <small>SQL：${escapeHtml(item.validationSqlId || '')}；安全：${escapeHtml(item.safetyBoundary || '')}</small>
          </article>
        `).join('') : '<div class="empty">尚未生成真实业务结果补证计划。</div>'}
        <div class="real-business-sql-summary">
          ${realBusinessBackfillSqlTemplates.length ? realBusinessBackfillSqlTemplates.map((item) => `
            <span>${escapeHtml(item.id)}</span>
          `).join('') : '<span>尚未生成只读 SQL 模板</span>'}
        </div>
      </div>
      <div class="product-classification-seed-log">
        <h4>项目分类种子与维护周期</h4>
        <div class="product-classification-seed-summary">
          <span>分类规则 ${formatNumber(productClassificationSummary.totalRules || 0)}</span>
          <span>当前项目 ${formatNumber(productClassificationSummary.observedProjectNames || 0)}</span>
          <span>显式命中 ${formatNumber(productClassificationSummary.matchedExplicitScopeProjects || 0)}</span>
          <span>维护类 ${formatNumber(productClassificationSummary.maintenanceProjects || 0)}</span>
          <span>抗衰类 ${formatNumber(productClassificationSummary.antiAgingProjects || 0)}</span>
          <span>需复核 ${formatNumber(productClassificationSummary.reviewRequiredProjects || 0)}</span>
        </div>
        ${productClassificationRows.length ? productClassificationRows.map((item) => `
          <article>
            <strong>${escapeHtml(item.projectName || '')}</strong>
            <span>${escapeHtml(item.productClassLabel || '')} · ${escapeHtml(item.classificationStatus || '')}</span>
            <p>${escapeHtml(item.reviewReason || '')}</p>
            <small>一级：${escapeHtml(item.primaryCategory || '-')}；二级：${escapeHtml((item.secondaryCategories || []).join('、') || '-')}；周期：${escapeHtml(item.cadenceRule || '-')}；复核：${item.reviewRequired ? '需要' : '不需要'}</small>
          </article>
        `).join('') : '<div class="empty">尚未生成项目分类种子。</div>'}
        <div class="product-classification-sql-summary">
          ${productClassificationSqlTemplates.length ? productClassificationSqlTemplates.map((item) => `
            <span>${escapeHtml(item.id)}</span>
          `).join('') : '<span>尚未生成项目分类 SQL 模板</span>'}
        </div>
        <div class="product-classification-review-log">
          <h4>项目分类复核队列</h4>
          <div class="product-classification-review-summary">
            <span>待复核 ${formatNumber(productClassificationReviewSummary.totalReviewItems || 0)}</span>
            <span>关联客户行 ${formatNumber(productClassificationReviewSummary.impactedCustomerRows || 0)}</span>
            <span>需源同步 ${formatNumber(productClassificationReviewSummary.sourceSyncRequiredItems || 0)}</span>
            <span>已写回 ${formatNumber(productClassificationReviewEventSummary.totalEvents || 0)}</span>
            <span>仍待复核 ${formatNumber(productClassificationReviewEventSummary.pendingReviewItems ?? productClassificationReviewSummary.pendingReviewItems ?? 0)}</span>
            <span>自动发送 ${formatNumber(productClassificationReviewEventSummary.automaticSendAllowedEvents || 0)}</span>
          </div>
          ${productClassificationReviewRows.length ? productClassificationReviewRows.map((item) => {
            const event = productClassificationReviewEventByQueueId.get(item.reviewQueueId);
            return `
            <article>
              <strong>${escapeHtml(item.projectName || '')}</strong>
              <span>${escapeHtml(item.currentProductClassLabel || '')} · ${escapeHtml(item.currentClassificationStatus || '')}</span>
              <p>${escapeHtml(item.currentReviewReason || '')}</p>
              <small>影响客户复核行：${formatNumber(item.impactedCustomerCount || 0)}；当前周期：${escapeHtml(item.currentCadenceRule || '-')}</small>
              ${event ? `<small>最近写回：${escapeHtml(event.actionLabel)} · ${escapeHtml(event.nextReviewStatus)}</small>` : ''}
              <div class="product-classification-review-actions">
                <button type="button" class="product-classification-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-review-action="confirm_as_maintenance">纳入维护类</button>
                <button type="button" class="product-classification-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-review-action="confirm_as_anti_aging">纳入抗衰类</button>
                <button type="button" class="product-classification-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-review-action="classify_as_integrated_skincare">另设整合护肤</button>
                <button type="button" class="product-classification-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-review-action="exclude_from_lifecycle_conversion">排除转化</button>
                <button type="button" class="product-classification-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-review-action="keep_review_required">继续待复核</button>
              </div>
              <div class="product-classification-review-status" id="product-classification-review-status-${escapeHtml(item.reviewQueueId)}"></div>
            </article>
          `;
          }).join('') : '<div class="empty">尚未生成项目分类复核队列。</div>'}
          <div class="product-classification-review-event-log">
            <h4>最近项目分类复核写回</h4>
            ${productClassificationReviewEventRows.length ? productClassificationReviewEventRows.slice(0, 8).map((event) => `
              <article>
                <strong>${escapeHtml(event.actionLabel)} · ${escapeHtml(event.resultProductClassLabel || '')}</strong>
                <span>${escapeHtml(event.projectName || '')}</span>
                <p>${escapeHtml(event.learningResult || '')}</p>
                <small>源同步：${event.sourceSyncRequired ? '需要' : '不需要'}；自动 patch：${event.sourcePatchAutoApplyAllowed ? '允许' : '阻断'}；远端写入：${event.remoteWriteAllowed ? '允许' : '阻断'}；规则发布：${event.ruleAutoPublishAllowed ? '允许' : '阻断'}</small>
              </article>
            `).join('') : '<div class="empty">尚未记录项目分类复核写回。</div>'}
          </div>
          <div class="product-classification-execution-log">
            <h4>项目分类复核人工执行包</h4>
            <div class="product-classification-execution-summary">
              <span>执行项 ${formatNumber(productClassificationReviewExecutionSummary.totalExecutionItems || 0)}</span>
              <span>待复核 ${formatNumber(productClassificationReviewExecutionSummary.pendingExecutionItems || 0)}</span>
              <span>P0 ${formatNumber(productClassificationReviewExecutionSummary.p0LinkedCustomerReviewItems || 0)}</span>
              <span>影响客户行 ${formatNumber(productClassificationReviewExecutionSummary.impactedCustomerRows || 0)}</span>
              <span>事件后源同步 ${formatNumber(productClassificationReviewExecutionSummary.sourceSyncItemsExpectedAfterEvents || 0)}</span>
              <span>自动 patch ${formatNumber(productClassificationReviewExecutionSummary.safetyViolations?.sourcePatchAutoApplyAllowed || 0)}</span>
            </div>
            ${productClassificationReviewExecutionRows.length ? productClassificationReviewExecutionRows.slice(0, 10).map((item) => `
              <article>
                <strong>${escapeHtml(item.priority || '')} · ${escapeHtml(item.projectName || '')}</strong>
                <span>${escapeHtml(item.pending ? '待人工复核' : '已写回')} · ${escapeHtml(item.currentProductClassLabel || '')}</span>
                <p>${escapeHtml(item.currentReviewReason || '')}</p>
                <small>影响客户复核行：${formatNumber(item.impactedCustomerCount || 0)}；固定动作：${escapeHtml((item.allowedActions || []).map((action) => action.label).join(' / ') || '-')}</small>
              </article>
            `).join('') : '<div class="empty">尚未生成项目分类复核人工执行包。</div>'}
          </div>
          <div class="product-classification-import-log">
            <h4>项目分类批量导入校验合同</h4>
            <div class="product-classification-import-summary">
              <span>模板行 ${formatNumber(productClassificationReviewImportSummary.templateRows || 0)}</span>
              <span>固定动作 ${formatNumber(productClassificationReviewImportSummary.allowedActionCount || 0)}</span>
              <span>必须 dry-run ${productClassificationReviewImportSummary.dryRunRequired ? '是' : '否'}</span>
              <span>批量写入 ${productClassificationReviewImportSummary.batchWriteAllowed ? '允许' : '阻断'}</span>
              <span>远端写入 ${productClassificationReviewImportSummary.remoteWriteAllowed ? '允许' : '阻断'}</span>
              <span>自动 patch ${productClassificationReviewImportSummary.sourcePatchAutoApplyAllowed ? '允许' : '阻断'}</span>
            </div>
            <div class="product-classification-import-actions">
              ${productClassificationReviewImportActions.length ? productClassificationReviewImportActions.map((action) => `
                <span>${escapeHtml(action.reviewAction)} · ${escapeHtml(action.label)}</span>
              `).join('') : '<span>暂无固定动作合同</span>'}
            </div>
            ${productClassificationReviewImportRows.length ? productClassificationReviewImportRows.slice(0, 6).map((item) => `
              <article>
                <strong>${escapeHtml(item.priority || '')} · ${escapeHtml(item.projectName || '')}</strong>
                <span>${escapeHtml(item.reviewQueueId || '')}</span>
                <p>影响客户复核行：${formatNumber(item.impactedCustomerCount || 0)}；dry-run：${String(item.dryRunOnly)}</p>
                <small>接口：/api/lifecycle/product-classification-review-events/batch-dry-run</small>
              </article>
            `).join('') : '<div class="empty">尚未生成批量导入校验合同。</div>'}
            <div class="product-classification-import-readiness-log">
              <h4>批量导入准备度</h4>
              <div class="product-classification-import-readiness-summary">
                <span>模板行 ${formatNumber(productClassificationReviewImportReadinessSummary.totalTemplateRows || 0)}</span>
                <span>可 dry-run ${formatNumber(productClassificationReviewImportReadinessSummary.readyForDryRunRows || 0)}</span>
                <span>未 ready ${formatNumber(productClassificationReviewImportReadinessSummary.notReadyForDryRunRows || 0)}</span>
                <span>缺动作 ${formatNumber(productClassificationReviewImportReadinessSummary.rowsMissingReviewAction || 0)}</span>
                <span>缺证据 ${formatNumber(productClassificationReviewImportReadinessSummary.rowsMissingEvidenceStatus || 0)}</span>
                <span>${escapeHtml(productClassificationReviewImportReadinessSummary.readinessGateStatus || '待生成')}</span>
              </div>
              ${productClassificationReviewImportReadinessRows.length ? productClassificationReviewImportReadinessRows.slice(0, 6).map((item) => `
                <article>
                  <strong>${escapeHtml(item.readinessStatus || '')} · ${escapeHtml(item.projectName || '')}</strong>
                  <span>${escapeHtml(item.reviewQueueId || '')}</span>
                  <p>${escapeHtml((item.issues || []).join('、') || '-')}</p>
                  <small>${escapeHtml((item.requiredFixes || []).join('；') || '-')}</small>
                </article>
              `).join('') : '<div class="empty">尚未生成批量导入准备度报告。</div>'}
            </div>
            <div class="product-classification-decision-guide-log">
              <h4>分类复核判定字典</h4>
              <div class="product-classification-decision-guide-summary">
                <span>待填报 ${formatNumber(productClassificationReviewDecisionGuideSummary.totalRows || 0)}</span>
                <span>固定动作 ${formatNumber(productClassificationReviewDecisionGuideSummary.allowedActionCount || 0)}</span>
                <span>证据状态 ${formatNumber(productClassificationReviewDecisionGuideSummary.evidenceStatusCount || 0)}</span>
                <span>当前可 dry-run ${formatNumber(productClassificationReviewDecisionGuideSummary.currentReadyForDryRunRows || 0)}</span>
                <span>批量写入 ${productClassificationReviewDecisionGuideSummary.batchWriteAllowed ? '允许' : '阻断'}</span>
              </div>
              <div class="product-classification-decision-action-list">
                ${productClassificationReviewDecisionActions.length ? productClassificationReviewDecisionActions.map((action) => `
                  <span>${escapeHtml(action.reviewAction || '')} · ${escapeHtml(action.label || '')} · ${escapeHtml(action.recommendedEvidenceStatus || '')}</span>
                `).join('') : '<span>暂无固定动作字典</span>'}
              </div>
              ${productClassificationReviewDecisionRows.length ? productClassificationReviewDecisionRows.slice(0, 6).map((item) => `
                <article>
                  <strong>${escapeHtml(item.suggestedReviewAction || '')} · ${escapeHtml(item.projectName || '')}</strong>
                  <span>${escapeHtml(item.suggestedEvidenceStatus || '')} · ${escapeHtml(item.suggestionConfidence || '')}</span>
                  <p>${escapeHtml(item.decisionReason || '')}</p>
                  <small>仅填报辅助，不自动写事件；候选：${escapeHtml((item.alternatives || []).join(' / ') || '-')}</small>
                </article>
              `).join('') : '<div class="empty">尚未生成分类复核判定字典。</div>'}
            </div>
          </div>
          <div class="product-classification-recompute-log">
            <h4>分类复核后重算编排</h4>
            <div class="product-classification-recompute-summary">
              <span>门禁 ${escapeHtml(productClassificationRecomputeSummary.currentGateStatus || '待生成')}</span>
              <span>可运行 ${formatNumber(productClassificationRecomputeSummary.runnableNowSteps || 0)}</span>
              <span>复核事件 ${formatNumber(productClassificationRecomputeSummary.reviewEvents || 0)}</span>
              <span>分类源同步 ${formatNumber(productClassificationRecomputeSummary.classificationSyncItems || 0)}</span>
              <span>已人工落地 ${formatNumber(productClassificationRecomputeSummary.executedClassificationSyncEvents || 0)}</span>
              <span>ROI缺口 ${formatNumber(productClassificationRecomputeSummary.mvpMissingRealBusinessTruthItems || 0)}</span>
            </div>
            ${productClassificationRecomputeSteps.length ? productClassificationRecomputeSteps.map((item) => `
              <article>
                <strong>${formatNumber(item.order)} · ${escapeHtml(item.stepId || '')}</strong>
                <span>${escapeHtml(item.ownerRole || '')} · ${item.canRunNow ? '当前可运行' : '等待前置'}</span>
                <p>${escapeHtml(item.currentStatus || '')}</p>
                <small>${escapeHtml(item.command || '')}</small>
              </article>
            `).join('') : '<div class="empty">尚未生成分类复核后重算编排计划。</div>'}
            <div class="product-classification-recompute-gates">
              ${productClassificationRecomputeGates.length ? productClassificationRecomputeGates.map((gate) => `
                <span>${escapeHtml(gate.gateId)} · ${escapeHtml(gate.status)}</span>
              `).join('') : '<span>暂无门禁检查</span>'}
            </div>
          </div>
          <div class="product-classification-impact-log">
            <h4>分类复核影响计划</h4>
            <div class="product-classification-impact-summary">
              <span>门禁 ${escapeHtml(productClassificationImpactSummary.classificationGateStatus || '待生成')}</span>
              <span>影响补证 ${formatNumber(productClassificationImpactSummary.impactedBackfillRequirements || 0)}</span>
              <span>待复核 ${formatNumber(productClassificationImpactSummary.pendingReviewItems || 0)}</span>
              <span>ROI缺口 ${formatNumber(productClassificationImpactSummary.mvpMissingRealBusinessTruthItems || 0)}</span>
              <span>自动 patch ${formatNumber(productClassificationImpactSummary.safetyViolations?.sourcePatchAutoApplyAllowed || 0)}</span>
            </div>
            ${productClassificationImpactRows.length ? productClassificationImpactRows.map((item) => `
              <article>
                <strong>${escapeHtml(item.label || '')}</strong>
                <span>${escapeHtml(item.currentStatus || '')} -> ${escapeHtml(item.nextStatus || '')}</span>
                <p>${escapeHtml(item.blocker || '')}</p>
                <small>解锁：${escapeHtml(item.unlockCondition || '')}</small>
              </article>
            `).join('') : '<div class="empty">尚未生成分类复核影响计划。</div>'}
            <div class="product-classification-impact-sql-summary">
              ${productClassificationImpactSqlRows.length ? productClassificationImpactSqlRows.map((item) => `
                <span>${escapeHtml(item.sqlTemplateId)} · ${escapeHtml(item.currentAction)}</span>
              `).join('') : '<span>尚未生成 SQL 重算计划</span>'}
            </div>
          </div>
        </div>
      </div>
      <div class="traceability-log">
        <h4>真值链路审计</h4>
        <div class="traceability-summary">
          <span>任务卡 ${formatNumber(traceSummary.customersWithAdvisorCards || 0)}</span>
          <span>测试单元 ${formatNumber(traceSummary.customersWithTestUnits || 0)}</span>
          <span>反馈行 ${formatNumber(traceSummary.customersWithFeedbackRows || 0)}</span>
          <span>顾问动作 ${formatNumber(traceSummary.customersWithAdvisorEvents || 0)}</span>
          <span>互动结果 ${formatNumber(traceSummary.customersWithOutcomeEvents || 0)}</span>
          <span>人工发送 ${formatNumber(traceSummary.customersWithManualSend || 0)}</span>
          <span>待办 ${formatNumber(traceSummary.customersWithTodos || 0)}</span>
          <span>规则候选 ${formatNumber(traceSummary.customersWithRuleCandidates || 0)}</span>
        </div>
        ${traceRows.length ? traceRows.slice(0, 8).map((item) => `
          <article>
            <strong>${escapeHtml(item.currentTraceStatus)} · ${escapeHtml(item.safety?.safetyStatus || '')}</strong>
            <span>${escapeHtml(item.unifiedCustomerId)} · ${escapeHtml(item.lifecycle?.lifecycleLabel || '')}</span>
            <p>真值 ${formatNumber(item.truth?.truthValueCount || 0)}/${formatNumber(item.truth?.requirementCount || 0)}；任务卡 ${formatNumber(item.generatedAssets?.advisorCardIds?.length || 0)}；测试单元 ${formatNumber(item.generatedAssets?.testUnitIds?.length || 0)}；反馈行 ${formatNumber(item.generatedAssets?.feedbackLearningEventIds?.length || 0)}</p>
            <small>顾问/结果/发送：${formatNumber(item.feedback?.advisorEventIds?.length || 0)}/${formatNumber(item.feedback?.outcomeEventIds?.length || 0)}/${formatNumber(item.feedback?.manualSendEventIds?.length || 0)}；自动发送：${item.safety?.automaticSendAllowed ? '允许' : '阻断'}；远端写入：${item.safety?.remoteWriteAllowed ? '允许' : '阻断'}</small>
          </article>
        `).join('') : '<div class="empty">尚未生成真值链路审计矩阵。</div>'}
      </div>
      <div class="customer-detail-log">
        <h4>单客户生命周期详情包</h4>
        <div class="customer-detail-summary">
          <span>详情 ${formatNumber(detailSummary.customersWithReadyDetail || 0)}</span>
          <span>H5 草稿 ${formatNumber(detailSummary.customersWithH5Draft || 0)}</span>
          <span>可人工发送 ${formatNumber(detailSummary.customersWithManualSendAllowed || 0)}</span>
          <span>已人工发送 ${formatNumber(detailSummary.customersWithManualSendConfirmed || 0)}</span>
          <span>发送后跟进 ${formatNumber(detailSummary.customersWithFollowup || 0)}</span>
          <span>后台待办 ${formatNumber(detailSummary.customersWithTodos || 0)}</span>
          <span>源同步 ${formatNumber(detailSummary.customersWithSourceSyncItems || 0)}</span>
          <span>发布允许 ${formatNumber(detailSummary.customerFacingContentPublishAllowedCustomers || 0)}</span>
        </div>
        ${detailRows.length ? detailRows.slice(0, 6).map((item) => `
          <article>
            <div>
              <strong>${escapeHtml(item.overview?.lifecycleState?.label || '')} · ${escapeHtml(item.advisorConsole?.reviewStatus || '')}</strong>
              <span>${escapeHtml(item.unifiedCustomerId)} · RFM ${escapeHtml(item.overview?.rfmGrade || '')} · 真值 ${formatNumber(item.overview?.truthValueCount || 0)}/${formatNumber(item.overview?.requirementCount || 0)}</span>
            </div>
            <p>${escapeHtml(item.privateCustomerProfile?.profile || '')}</p>
            <small>目标：${escapeHtml(item.advisorConsole?.interactionObjective || '')}</small>
            <small>门禁：${escapeHtml((item.executionState?.gates || []).map((gate) => gate.gateStatus).join('、') || '无')}；待办 ${formatNumber(item.managementTodo?.todos?.length || 0)}；规则候选 ${formatNumber(item.ruleAndSourceLearning?.ruleCandidates?.length || 0)}</small>
            <small>自动发送：${item.safety?.automaticSendAllowed ? '允许' : '阻断'}；远端写入：${item.safety?.remoteWriteAllowed ? '允许' : '阻断'}；对客发布：${item.safety?.customerFacingContentPublishAllowed ? '允许' : '阻断'}</small>
          </article>
        `).join('') : '<div class="empty">尚未生成单客户生命周期详情包。</div>'}
      </div>
      <div class="h5-publish-gate-log">
        <h4>H5 发布门禁队列</h4>
        <div class="h5-publish-gate-summary">
          <span>草稿 ${formatNumber(h5GateSummary.h5Drafts || 0)}</span>
          <span>内部预览 ${formatNumber(h5GateSummary.internalPreviewAllowed || 0)}</span>
          <span>人工发布复核 ${formatNumber(h5GateSummary.readyForManualPublishReview || 0)}</span>
          <span>待顾问审核 ${formatNumber(h5GateSummary.blockedUntilAdvisorReview || 0)}</span>
          <span>待产品/话术复核 ${formatNumber(h5GateSummary.blockedUntilProductCopyReview || 0)}</span>
          <span>待版本确认 ${formatNumber(h5GateSummary.blockedUntilVariantSelected || 0)}</span>
          <span>自动发布 ${formatNumber(h5GateSummary.automaticPublishAllowed || 0)}</span>
          <span>对客发布 ${formatNumber(h5GateSummary.customerFacingContentPublishAllowed || 0)}</span>
        </div>
        ${h5GateRows.length ? h5GateRows.slice(0, 6).map((item) => {
          const event = h5ReviewEventByGateId.get(item.h5GateId);
          return `
          <article>
            <strong>${escapeHtml(item.gateStatus)} · ${escapeHtml(item.lane || '')}</strong>
            <span>${escapeHtml(item.unifiedCustomerId)} · ${escapeHtml(item.lifecycleStateLabel || '')}</span>
            <p>${escapeHtml(item.h5Draft?.screen1 || '')}</p>
            <small>可人工发布复核：${item.publishReviewAllowed ? '是' : '否'}；内部预览：${item.previewAllowedInternalOnly ? '是' : '否'}；对客发布：${item.customerFacingContentPublishAllowed ? '允许' : '阻断'}</small>
            <small>前置：${escapeHtml((item.requiredBeforePublish || []).join('、'))}</small>
            ${event ? `<small>最近复核：${escapeHtml(event.actionLabel)} · ${escapeHtml(event.nextPublishReviewStatus)}</small>` : ''}
            ${item.publishReviewAllowed ? `
              <div class="h5-publish-review-actions">
                <button type="button" class="h5-publish-review-button" data-h5-gate-id="${escapeHtml(item.h5GateId)}" data-action="批准发布复核">批准发布复核</button>
                <button type="button" class="h5-publish-review-button" data-h5-gate-id="${escapeHtml(item.h5GateId)}" data-action="退回修改">退回修改</button>
                <button type="button" class="h5-publish-review-button" data-h5-gate-id="${escapeHtml(item.h5GateId)}" data-action="继续内部预览">继续内部预览</button>
              </div>
              <div class="h5-publish-review-status" id="h5-publish-review-status-${escapeHtml(item.h5GateId)}"></div>
            ` : ''}
          </article>
        `;
        }).join('') : '<div class="empty">尚未生成 H5 发布门禁队列。</div>'}
        <div class="h5-publish-review-event-log">
          <h4>最近 H5 发布复核写回</h4>
          <div class="h5-publish-review-summary">
            <span>写回 ${formatNumber(h5ReviewEventSummary.totalEvents || 0)}</span>
            <span>复核通过 ${formatNumber(h5ReviewEventSummary.approvedReviewEvents || 0)}</span>
            <span>退回修改 ${formatNumber(h5ReviewEventSummary.returnedForRevisionEvents || 0)}</span>
            <span>内部预览 ${formatNumber(h5ReviewEventSummary.internalPreviewKeptEvents || 0)}</span>
            <span>发布执行前置 ${formatNumber(h5ReviewEventSummary.manualPublishExecutionAllowedEvents || 0)}</span>
            <span>自动发布 ${formatNumber(h5ReviewEventSummary.automaticPublishAllowedEvents || 0)}</span>
            <span>对客发布 ${formatNumber(h5ReviewEventSummary.customerFacingContentPublishAllowedEvents || 0)}</span>
          </div>
          ${h5ReviewEvents.length ? h5ReviewEvents.slice(0, 8).map((event) => `
            <article>
              <strong>${escapeHtml(event.actionLabel)} · ${escapeHtml(event.nextPublishReviewStatus)}</strong>
              <span>${escapeHtml(event.unifiedCustomerId)} · ${escapeHtml(event.h5GateId)}</span>
              <p>${escapeHtml(event.learningResult || '')}</p>
              <small>发布执行前置：${event.manualPublishExecutionAllowed ? '允许' : '阻断'}；自动发布：${event.automaticPublishAllowed ? '允许' : '阻断'}；对客 H5：${event.customerFacingContentPublishAllowed ? '允许' : '阻断'}</small>
              ${h5ExecutionEventByReviewEventId.has(event.eventId) ? `
                <small>执行确认：${escapeHtml(h5ExecutionEventByReviewEventId.get(event.eventId).publishExecutionStatus)} · ${escapeHtml(h5ExecutionEventByReviewEventId.get(event.eventId).publishChannel)}</small>
              ` : ''}
              ${event.manualPublishExecutionAllowed && !h5ExecutionEventByReviewEventId.has(event.eventId) ? `
                <div class="h5-publish-execution-actions">
                  <button type="button" class="h5-publish-execution-button" data-h5-publish-review-event-id="${escapeHtml(event.eventId)}" data-publish-channel="advisor_wechat_private_link">确认人工发布执行</button>
                </div>
                <div class="h5-publish-execution-status" id="h5-publish-execution-status-${escapeHtml(event.eventId)}"></div>
              ` : ''}
            </article>
          `).join('') : '<div class="empty">尚未记录 H5 发布复核写回。</div>'}
        </div>
        <div class="h5-publish-execution-event-log">
          <h4>最近 H5 人工发布执行确认</h4>
          <div class="h5-publish-execution-summary">
            <span>执行事件 ${formatNumber(h5ExecutionSummary.totalEvents || 0)}</span>
            <span>人工确认 ${formatNumber(h5ExecutionSummary.manualPublishExecutionConfirmedEvents || 0)}</span>
            <span>本地对客发布记录 ${formatNumber(h5ExecutionSummary.customerFacingPublishRecordedEvents || 0)}</span>
            <span>自动发布 ${formatNumber(h5ExecutionSummary.automaticPublishEvents || 0)}</span>
            <span>远端写入 ${formatNumber(h5ExecutionSummary.remoteWriteAllowedEvents || 0)}</span>
            <span>敏感正文 ${formatNumber(h5ExecutionSummary.sensitiveRawTextAllowedEvents || 0)}</span>
          </div>
          ${h5ExecutionEvents.length ? h5ExecutionEvents.slice(0, 8).map((event) => `
            <article>
              <strong>${escapeHtml(event.publishExecutionStatus)} · ${escapeHtml(event.publishChannel)}</strong>
              <span>${escapeHtml(event.unifiedCustomerId)} · ${escapeHtml(event.h5GateId)}</span>
              <p>${escapeHtml(event.feedbackLearningEventPatch?.learning_result || '')}</p>
              <small>人工确认：${event.manualPublishExecutionConfirmed ? '是' : '否'}；自动发布：${event.automaticPublishAllowed ? '允许' : '阻断'}；远端写入：${event.remoteWriteAllowed ? '允许' : '阻断'}</small>
              ${(h5EngagementEventsByExecutionId.get(event.eventId) || []).length ? `
                <small>最近互动：${escapeHtml((h5EngagementEventsByExecutionId.get(event.eventId) || []).slice(0, 3).map((item) => item.engagementLabel).join('、'))}</small>
              ` : ''}
              <div class="h5-engagement-actions">
                <button type="button" class="h5-engagement-button" data-h5-publish-execution-event-id="${escapeHtml(event.eventId)}" data-engagement-type="h5_opened">已打开</button>
                <button type="button" class="h5-engagement-button" data-h5-publish-execution-event-id="${escapeHtml(event.eventId)}" data-engagement-type="primary_cta_clicked">主按钮点击</button>
                <button type="button" class="h5-engagement-button" data-h5-publish-execution-event-id="${escapeHtml(event.eventId)}" data-engagement-type="secondary_cta_clicked">次按钮点击</button>
                <button type="button" class="h5-engagement-button" data-h5-publish-execution-event-id="${escapeHtml(event.eventId)}" data-engagement-type="appointment_intent">预约意向</button>
                <button type="button" class="h5-engagement-button" data-h5-publish-execution-event-id="${escapeHtml(event.eventId)}" data-engagement-type="no_engagement_observed">暂无互动</button>
              </div>
              <div class="h5-engagement-status" id="h5-engagement-status-${escapeHtml(event.eventId)}"></div>
            </article>
          `).join('') : '<div class="empty">尚未记录 H5 人工发布执行确认。</div>'}
        </div>
        <div class="h5-engagement-event-log">
          <h4>最近 H5 发布后互动</h4>
          <div class="h5-engagement-summary">
            <span>互动 ${formatNumber(h5EngagementSummary.totalEvents || 0)}</span>
            <span>打开 ${formatNumber(h5EngagementSummary.openedEvents || 0)}</span>
            <span>主按钮 ${formatNumber(h5EngagementSummary.primaryCtaClickedEvents || 0)}</span>
            <span>次按钮 ${formatNumber(h5EngagementSummary.secondaryCtaClickedEvents || 0)}</span>
            <span>预约意向 ${formatNumber(h5EngagementSummary.appointmentIntentEvents || 0)}</span>
            <span>暂无互动 ${formatNumber(h5EngagementSummary.noEngagementObservedEvents || 0)}</span>
            <span>回复正文 ${formatNumber(h5EngagementSummary.customerReplyTextStoredEvents || 0)}</span>
          </div>
          ${h5EngagementRows.length ? h5EngagementRows.slice(0, 8).map((event) => `
            <article>
              <strong>${escapeHtml(event.engagementLabel)} · ${escapeHtml(event.engagementType)}</strong>
              <span>${escapeHtml(event.unifiedCustomerId)} · ${escapeHtml(event.selectedTestUnitId || '')}</span>
              <p>${escapeHtml(event.learningResult || '')}</p>
              <small>打开：${event.h5Opened ? '是' : '否'}；预约意向：${event.appointmentIntent ? '是' : '否'}；回复正文：${event.customerReplyTextStored ? '保存' : '不保存'}；远端写入：${event.remoteWriteAllowed ? '允许' : '阻断'}</small>
            </article>
          `).join('') : '<div class="empty">尚未记录 H5 发布后互动。</div>'}
        </div>
        <div class="h5-feedback-learning-bridge-log">
          <h4>H5 互动反馈学习桥接</h4>
          <div class="h5-feedback-learning-bridge-summary">
            <span>桥接行 ${formatNumber(h5FeedbackBridgeSummary.totalBridgeRows || 0)}</span>
            <span>可观测发布 ${formatNumber(h5FeedbackBridgeSummary.eligibleH5PublishExecutions || 0)}</span>
            <span>关联测试单元 ${formatNumber(h5FeedbackBridgeSummary.linkedTestUnits || 0)}</span>
            <span>打开率 ${formatNumber(h5FeedbackBridgeSummary.openRateByEligibleExecution || 0)}%</span>
            <span>主按钮点击率 ${formatNumber(h5FeedbackBridgeSummary.primaryClickRateByOpened || 0)}%</span>
            <span>预约意向率 ${formatNumber(h5FeedbackBridgeSummary.appointmentIntentRateByOpened || 0)}%</span>
            <span>需补正式结果 ${formatNumber(h5FeedbackBridgeSummary.formalOutcomeBackfillRequiredRows || 0)}</span>
            <span>回复正文 ${formatNumber(h5FeedbackBridgeSummary.customerReplyTextStoredRows || 0)}</span>
            <span>远端写入 ${formatNumber(h5FeedbackBridgeSummary.remoteWriteAllowedRows || 0)}</span>
          </div>
          ${h5FeedbackBridgeRows.length ? h5FeedbackBridgeRows.slice(0, 8).map((row) => {
            const formalOutcomeEvents = h5FormalOutcomeEventsByBridgeId.get(row.bridge_event_id) || [];
            return `
            <article>
              <strong>${escapeHtml(row.h5_engagement_label)} · ${escapeHtml(row.source_event_state)}</strong>
              <span>${escapeHtml(row.unified_customer_id)} · ${escapeHtml(row.test_unit_id || '')}</span>
              <p>${escapeHtml(row.message_variant || '')} · ${escapeHtml(row.message_angle || '')} · ${escapeHtml(row.learning_result || '')}</p>
              <small>打开：${row.h5_opened ? '是' : '否'}；点击：${row.h5_primary_cta_clicked || row.h5_secondary_cta_clicked ? '是' : '否'}；预约意向：${row.appointment_intent ? '是' : '否'}；正式结果补录：${row.formal_outcome_backfill_required ? '需要' : '暂不需要'}</small>
              <small>回复正文：${row.customer_reply_text_stored ? '保存' : '不保存'}；远端写入：${row.remote_write_allowed ? '允许' : '阻断'}；规则发布：${row.rule_auto_publish_allowed ? '允许' : '阻断'}</small>
              ${formalOutcomeEvents.length ? `
                <small>已补正式结果：${escapeHtml(formalOutcomeEvents.slice(0, 3).map((event) => event.outcomeLabel).join('、'))}</small>
              ` : ''}
              ${row.formal_outcome_backfill_required ? `
                <div class="h5-formal-outcome-actions">
                  <button type="button" class="h5-formal-outcome-button" data-bridge-event-id="${escapeHtml(row.bridge_event_id)}" data-formal-outcome-type="formal_appointment_created">正式预约</button>
                  <button type="button" class="h5-formal-outcome-button" data-bridge-event-id="${escapeHtml(row.bridge_event_id)}" data-formal-outcome-type="arrived_after_h5_intent">已到店</button>
                  <button type="button" class="h5-formal-outcome-button" data-bridge-event-id="${escapeHtml(row.bridge_event_id)}" data-formal-outcome-type="maintenance_converted_after_h5_intent">维护转化</button>
                  <button type="button" class="h5-formal-outcome-button" data-bridge-event-id="${escapeHtml(row.bridge_event_id)}" data-formal-outcome-type="no_formal_appointment_after_h5_intent">未成约</button>
                </div>
                <div class="h5-formal-outcome-status" id="h5-formal-outcome-status-${escapeHtml(row.bridge_event_id)}"></div>
              ` : ''}
            </article>
          `;
          }).join('') : '<div class="empty">尚未生成 H5 互动反馈学习桥接。</div>'}
          ${h5FeedbackBridgeAngleRows.length ? `
            <div class="h5-feedback-angle-list">
              ${h5FeedbackBridgeAngleRows.slice(0, 6).map((item) => `
                <span>${escapeHtml(item.messageAngle)} · 打开 ${formatNumber(item.openedEvents || 0)} · 点击 ${formatNumber(item.clickedEvents || 0)} · 意向 ${formatNumber(item.appointmentIntentEvents || 0)}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <div class="h5-formal-outcome-event-log">
          <h4>H5 正式结果补录</h4>
          <div class="h5-formal-outcome-summary">
            <span>事件 ${formatNumber(h5FormalOutcomeSummary.totalEvents || 0)}</span>
            <span>正式预约 ${formatNumber(h5FormalOutcomeSummary.formalAppointmentCreatedEvents || 0)}</span>
            <span>到店 ${formatNumber(h5FormalOutcomeSummary.arrivedEvents || 0)}</span>
            <span>转化 ${formatNumber(h5FormalOutcomeSummary.convertedEvents || 0)}</span>
            <span>未成约 ${formatNumber(h5FormalOutcomeSummary.noFormalAppointmentEvents || 0)}</span>
            <span>回复正文 ${formatNumber(h5FormalOutcomeSummary.customerReplyTextStoredEvents || 0)}</span>
            <span>远端写入 ${formatNumber(h5FormalOutcomeSummary.remoteWriteAllowedEvents || 0)}</span>
          </div>
          ${h5FormalOutcomeRows.length ? h5FormalOutcomeRows.slice(0, 8).map((event) => `
            <article>
              <strong>${escapeHtml(event.outcomeLabel)} · ${escapeHtml(event.formalOutcomeType)}</strong>
              <span>${escapeHtml(event.unifiedCustomerId)} · ${escapeHtml(event.selectedTestUnitId || '')}</span>
              <p>${escapeHtml(event.learningResult || '')}</p>
              <small>正式预约：${event.formalAppointmentCreated ? '是' : '否'}；到店：${event.arrived ? '是' : '否'}；转化：${escapeHtml(event.conversionType || '无')}；未成约：${event.noFormalAppointment ? '是' : '否'}</small>
              <small>回复正文：${event.customerReplyTextStored ? '保存' : '不保存'}；远端写入：${event.remoteWriteAllowed ? '允许' : '阻断'}；规则发布：${event.ruleAutoPublishAllowed ? '允许' : '阻断'}；自动二次触达：${event.automaticSecondTouchAllowed ? '允许' : '阻断'}</small>
            </article>
          `).join('') : '<div class="empty">尚未补录 H5 正式结果。</div>'}
        </div>
        <div class="h5-post-formal-followup-log">
          <h4>H5 正式结果后跟进</h4>
          <div class="h5-post-formal-followup-summary">
            <span>跟进 ${formatNumber(h5PostFormalFollowupSummary.totalFollowups || 0)}</span>
            <span>预约待到店 ${formatNumber(h5PostFormalFollowupSummary.formalAppointmentConfirmArrival || 0)}</span>
              <span>到店待转化 ${formatNumber(h5PostFormalFollowupSummary.arrivedNeedsConversionConfirmation || 0)}</span>
              <span>转化待复盘 ${formatNumber(h5PostFormalFollowupSummary.convertedNeedsRevenueOrRuleReview || 0)}</span>
              <span>到店未转化 ${formatNumber(h5PostFormalFollowupSummary.arrivedNoConversionReview || 0)}</span>
              <span>未到店复盘 ${formatNumber(h5PostFormalFollowupSummary.formalAppointmentNotArrivedReview || 0)}</span>
            <span>继续观察 ${formatNumber(h5PostFormalFollowupSummary.formalAppointmentKeepObserving || 0)}</span>
            <span>高优先级 ${formatNumber(h5PostFormalFollowupSummary.highPriority || 0)}</span>
            <span>已写回 ${formatNumber(h5PostFormalFollowupEventSummary.totalEvents || 0)}</span>
            <span>远端写入 ${formatNumber(h5PostFormalFollowupSummary.remoteWriteAllowedFollowups || 0)}</span>
            <span>规则发布 ${formatNumber(h5PostFormalFollowupSummary.ruleAutoPublishAllowedFollowups || 0)}</span>
          </div>
          ${h5PostFormalFollowupRows.length ? h5PostFormalFollowupRows.slice(0, 8).map((item) => {
            const followupEvents = h5PostFormalFollowupEventsByFollowupId.get(item.followupId) || [];
            return `
            <article>
              <strong>${escapeHtml(item.followupStatus)} · ${escapeHtml(item.priority || '')}</strong>
              <span>${escapeHtml(item.unifiedCustomerId)} · ${escapeHtml(item.selectedTestUnitId || '')}</span>
              <p>${escapeHtml(item.nextAdvisorAction || '')}</p>
              <small>正式预约：${item.formalAppointmentCreated ? '是' : '否'}；到店：${item.arrived ? '是' : '否'}；未到店：${item.noShowOrNotArrived ? '是' : '否'}；未转化：${item.noMaintenanceConversion ? '是' : '否'}；转化：${escapeHtml(item.conversionType || '无')}；自动二次触达：${item.automaticSecondTouchBlocked ? '阻断' : '允许'}</small>
              <small>回复正文：${item.customerReplyTextStored ? '保存' : '不保存'}；远端写入：${item.remoteWriteAllowed ? '允许' : '阻断'}；规则发布：${item.ruleAutoPublishAllowed ? '允许' : '阻断'}</small>
              ${followupEvents.length ? `<small>已写回：${escapeHtml(followupEvents.slice(0, 3).map((event) => event.actionLabel).join('、'))}</small>` : ''}
              <div class="h5-post-formal-followup-actions">
                <button type="button" class="h5-post-formal-followup-button" data-followup-id="${escapeHtml(item.followupId)}" data-followup-action-type="arrived_after_h5_appointment">已到店</button>
                <button type="button" class="h5-post-formal-followup-button" data-followup-id="${escapeHtml(item.followupId)}" data-followup-action-type="maintenance_converted_after_h5_appointment">维护转化</button>
                <button type="button" class="h5-post-formal-followup-button" data-followup-id="${escapeHtml(item.followupId)}" data-followup-action-type="maintenance_not_converted_after_h5_appointment">未转化</button>
                <button type="button" class="h5-post-formal-followup-button" data-followup-id="${escapeHtml(item.followupId)}" data-followup-action-type="not_arrived_after_h5_appointment">未到店</button>
                <button type="button" class="h5-post-formal-followup-button" data-followup-id="${escapeHtml(item.followupId)}" data-followup-action-type="keep_following_h5_appointment">继续观察</button>
              </div>
              <div class="h5-post-formal-followup-status" id="h5-post-formal-followup-status-${escapeHtml(item.followupId)}"></div>
            </article>
          `;
          }).join('') : '<div class="empty">尚未生成 H5 正式结果后跟进队列。</div>'}
          <div class="h5-post-formal-followup-event-log">
            <h5>H5 到店/转化跟进写回</h5>
            <div class="h5-post-formal-followup-event-summary">
              <span>事件 ${formatNumber(h5PostFormalFollowupEventSummary.totalEvents || 0)}</span>
              <span>到店 ${formatNumber(h5PostFormalFollowupEventSummary.arrivedEvents || 0)}</span>
              <span>转化 ${formatNumber(h5PostFormalFollowupEventSummary.convertedEvents || 0)}</span>
              <span>未转化 ${formatNumber(h5PostFormalFollowupEventSummary.noConversionEvents || 0)}</span>
              <span>未到店 ${formatNumber(h5PostFormalFollowupEventSummary.notArrivedEvents || 0)}</span>
              <span>继续观察 ${formatNumber(h5PostFormalFollowupEventSummary.keepFollowingEvents || 0)}</span>
              <span>源同步 ${formatNumber(h5PostFormalFollowupEventSummary.sourceSyncRequiredEvents || 0)}</span>
              <span>远端写入 ${formatNumber(h5PostFormalFollowupEventSummary.remoteWriteAllowedEvents || 0)}</span>
            </div>
            ${h5PostFormalFollowupEventRows.length ? h5PostFormalFollowupEventRows.slice(0, 8).map((event) => `
              <article>
                <strong>${escapeHtml(event.actionLabel)} · ${escapeHtml(event.followupActionType)}</strong>
                <span>${escapeHtml(event.unifiedCustomerId)} · ${escapeHtml(event.selectedTestUnitId || '')}</span>
                <p>${escapeHtml(event.learningResult || '')}</p>
                <small>到店：${event.arrived ? '是' : '否'}；未到店：${event.noShowOrNotArrived ? '是' : '否'}；未转化：${event.noMaintenanceConversion ? '是' : '否'}；转化：${escapeHtml(event.conversionType || '无')}；源同步：${event.sourceSyncRequired ? '需要' : '不需要'}</small>
                <small>回复正文：${event.customerReplyTextStored ? '保存' : '不保存'}；远端写入：${event.remoteWriteAllowed ? '允许' : '阻断'}；规则发布：${event.ruleAutoPublishAllowed ? '允许' : '阻断'}；自动二次触达：${event.automaticSecondTouchAllowed ? '允许' : '阻断'}</small>
              </article>
            `).join('') : '<div class="empty">尚未记录 H5 到店/转化跟进写回。</div>'}
          </div>
        </div>
        <div class="h5-no-conversion-review-log">
          <h4>H5 到店未转化原因复盘</h4>
          <div class="h5-no-conversion-review-summary">
            <span>复盘项 ${formatNumber(h5NoConversionReviewSummary.totalReviewItems || 0)}</span>
            <span>待补原因 ${formatNumber(h5NoConversionReviewSummary.pendingReasonCapture || 0)}</span>
            <span>关联未转化事件 ${formatNumber(h5NoConversionReviewSummary.linkedNoConversionEvents || 0)}</span>
            <span>关联学习行 ${formatNumber(h5NoConversionReviewSummary.linkedFeedbackLearningRows || 0)}</span>
            <span>原因枚举 ${formatNumber(h5NoConversionReviewSummary.reasonTaxonomyCount || 0)}</span>
            <span>回复正文 ${formatNumber(h5NoConversionReviewSummary.customerReplyTextStoredItems || 0)}</span>
            <span>远端写入 ${formatNumber(h5NoConversionReviewSummary.remoteWriteAllowedItems || 0)}</span>
            <span>自动二次触达 ${formatNumber(h5NoConversionReviewSummary.automaticSecondTouchAllowedItems || 0)}</span>
            <span>写回事件 ${formatNumber(h5NoConversionReviewEventSummary.totalEvents || 0)}</span>
            <span>已补原因 ${formatNumber(h5NoConversionReviewEventSummary.reasonCapturedEvents || 0)}</span>
          </div>
          ${h5NoConversionReasonTaxonomy.length ? `
            <div class="h5-no-conversion-reason-list">
              ${h5NoConversionReasonTaxonomy.map((reason) => `
                <span>${escapeHtml(reason.label)} · ${escapeHtml(reason.code)}</span>
              `).join('')}
            </div>
          ` : ''}
          ${h5NoConversionReviewRows.length ? h5NoConversionReviewRows.slice(0, 8).map((item) => `
            <article>
              <strong>${escapeHtml(item.noConversionReasonLabel || '')} · ${escapeHtml(item.status || '')}</strong>
              <span>${escapeHtml(item.unifiedCustomerId)} · ${escapeHtml(item.selectedTestUnitId || '')}</span>
              <p>${escapeHtml(item.nextLearningUse || '')}</p>
              <small>必填：${escapeHtml((item.requiredFields || []).join('、'))}</small>
              <small>原因可选：${escapeHtml((item.allowedReasonCodes || []).join('、'))}</small>
              <small>回复正文：${item.customerReplyTextStored ? '保存' : '不保存'}；远端写入：${item.remoteWriteAllowed ? '允许' : '阻断'}；自动二次触达：${item.automaticSecondTouchAllowed ? '允许' : '阻断'}；规则发布：${item.ruleAutoPublishAllowed ? '允许' : '阻断'}</small>
              <div class="h5-no-conversion-review-actions">
                ${(item.allowedReasonCodes || []).filter((code) => code !== 'pending_reason_capture').slice(0, 6).map((code) => `
                  <button type="button" class="h5-no-conversion-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-review-action="capture_no_conversion_reason" data-reason-code="${escapeHtml(code)}">${escapeHtml((h5NoConversionReasonTaxonomy.find((reason) => reason.code === code) || {}).label || code)}</button>
                `).join('')}
                <button type="button" class="h5-no-conversion-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-review-action="keep_manual_observation" data-reason-code="pending_reason_capture">继续观察</button>
                <button type="button" class="h5-no-conversion-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-review-action="return_to_advisor_review" data-reason-code="advisor_followup_gap">退回顾问复盘</button>
              </div>
              <div class="h5-no-conversion-review-status" id="h5-no-conversion-review-status-${escapeHtml(item.reviewQueueId)}"></div>
            </article>
          `).join('') : '<div class="empty">当前没有已写回的到店未转化复盘项；未转化动作能力已就绪，但尚未写入未转化事实。</div>'}
          <div class="h5-no-conversion-review-event-log">
            <h5>未转化原因复盘写回</h5>
            <div class="h5-no-conversion-review-event-summary">
              <span>事件 ${formatNumber(h5NoConversionReviewEventSummary.totalEvents || 0)}</span>
              <span>补原因 ${formatNumber(h5NoConversionReviewEventSummary.reasonCapturedEvents || 0)}</span>
              <span>继续观察 ${formatNumber(h5NoConversionReviewEventSummary.keepManualObservationEvents || 0)}</span>
              <span>退回复盘 ${formatNumber(h5NoConversionReviewEventSummary.returnToAdvisorReviewEvents || 0)}</span>
              <span>源同步 ${formatNumber(h5NoConversionReviewEventSummary.sourceSyncRequiredEvents || 0)}</span>
              <span>远端写入 ${formatNumber(h5NoConversionReviewEventSummary.remoteWriteAllowedEvents || 0)}</span>
            </div>
            ${h5NoConversionReviewEventRows.length ? h5NoConversionReviewEventRows.slice(0, 8).map((event) => `
              <article>
                <strong>${escapeHtml(event.actionLabel)} · ${escapeHtml(event.noConversionReasonLabel || '')}</strong>
                <span>${escapeHtml(event.unifiedCustomerId)} · ${escapeHtml(event.selectedTestUnitId || '')}</span>
                <p>${escapeHtml(event.learningResult || '')}</p>
                <small>动作：${escapeHtml(event.reviewAction || '')}；原因：${escapeHtml(event.noConversionReasonCode || '')}；下一状态：${escapeHtml(event.nextReviewStatus || '')}</small>
                <small>回复正文：${event.customerReplyTextStored ? '保存' : '不保存'}；远端写入：${event.remoteWriteAllowed ? '允许' : '阻断'}；自动二次触达：${event.automaticSecondTouchAllowed ? '允许' : '阻断'}；规则发布：${event.ruleAutoPublishAllowed ? '允许' : '阻断'}</small>
              </article>
            `).join('') : '<div class="empty">尚未记录 H5 到店未转化原因复盘写回。</div>'}
          </div>
        </div>
      </div>
      <div class="product-copy-review-log">
        <h4>产品/话术复核队列</h4>
        <div class="product-copy-review-summary">
          <span>复核项 ${formatNumber(productReviewSummary.totalReviewItems || 0)}</span>
          <span>产品分类 ${formatNumber(productReviewSummary.productClassificationUncertain || 0)}</span>
          <span>黄灯 ${formatNumber(productReviewSummary.yellowRiskGate || 0)}</span>
          <span>待顾问动作 ${formatNumber(productReviewSummary.advisorActionMissingAfterReview || 0)}</span>
          <span>话术版本 ${formatNumber(productReviewSummary.messageVariantsToReview || 0)}</span>
          <span>H5 草稿 ${formatNumber(productReviewSummary.h5DraftsToReview || 0)}</span>
          <span>风险词 ${formatNumber(productReviewSummary.copyRiskSignalItems || 0)}</span>
          <span>自动发送 ${formatNumber(productReviewSummary.automaticSendAllowed || 0)}</span>
          <span>写回 ${formatNumber(productReviewEventSummary.totalEvents || 0)}</span>
        </div>
        ${productReviewRows.length ? productReviewRows.slice(0, 8).map((item) => {
          const event = productReviewEventByQueueId.get(item.reviewQueueId);
          return `
          <article>
            <strong>${escapeHtml(item.reviewStatus)} · ${escapeHtml(item.productClass?.label || '')}</strong>
            <span>${escapeHtml(item.unifiedCustomerId)} · ${escapeHtml(item.lifecycleState?.label || '')}</span>
            <p>${escapeHtml(item.lastMaintenanceProject || '')}</p>
            <small>复核重点：${escapeHtml((item.reviewFocus || []).join('、'))}</small>
            <small>复核后：${escapeHtml(item.nextAllowedStateAfterHumanReview || '')}；人工发送：${item.safety?.manualSendAllowed ? '允许' : '阻断'}；对客 H5：${item.safety?.h5CustomerFacingPublishAllowed ? '允许' : '阻断'}</small>
            ${event ? `<small>最近写回：${escapeHtml(event.actionLabel)} · ${escapeHtml(event.nextReviewStatus)}</small>` : ''}
            <div class="product-copy-review-actions">
              <button type="button" class="product-copy-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-action="确认维护口径">确认维护口径</button>
              <button type="button" class="product-copy-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-action="退回改写">退回改写</button>
              <button type="button" class="product-copy-review-button" data-review-queue-id="${escapeHtml(item.reviewQueueId)}" data-action="维持黄灯">维持黄灯</button>
            </div>
            <div class="product-copy-review-status" id="product-copy-review-status-${escapeHtml(item.reviewQueueId)}"></div>
          </article>
        `;
        }).join('') : '<div class="empty">尚未生成产品/话术复核队列。</div>'}
        <div class="product-copy-review-event-log">
          <h4>最近产品/话术复核写回</h4>
          ${productReviewEvents.length ? productReviewEvents.slice(0, 8).map((event) => `
            <article>
              <strong>${escapeHtml(event.actionLabel)} · ${escapeHtml(event.nextReviewStatus)}</strong>
              <span>${escapeHtml(event.unifiedCustomerId)} · ${escapeHtml(event.reviewQueueId)}</span>
              <p>${escapeHtml(event.learningResult || '')}</p>
              <small>自动发送：${event.automaticSendAllowed ? '允许' : '阻断'}；人工发送：${event.manualSendAllowed ? '允许' : '阻断'}；对客 H5：${event.h5CustomerFacingPublishAllowed ? '允许' : '阻断'}</small>
            </article>
          `).join('') : '<div class="empty">尚未记录产品/话术复核写回。</div>'}
        </div>
        <div class="gate-recalculation-log">
          <h4>复核后门禁重算计划</h4>
          <div class="gate-recalculation-summary">
            <span>重算项 ${formatNumber(gateRecalcSummary.totalRecalculationItems || 0)}</span>
            <span>维持黄灯 ${formatNumber(gateRecalcSummary.keepYellowItems || 0)}</span>
            <span>等待顾问最终确认 ${formatNumber(gateRecalcSummary.waitingAdvisorFinalReviewItems || 0)}</span>
            <span>需改写 ${formatNumber(gateRecalcSummary.rewriteRequiredItems || 0)}</span>
            <span>仍阻断 ${formatNumber(gateRecalcSummary.blockedRecalculationItems || 0)}</span>
            <span>人工发送 ${formatNumber(gateRecalcSummary.manualSendAllowedAfterRecalc || 0)}</span>
            <span>H5 对客发布 ${formatNumber(gateRecalcSummary.h5CustomerFacingPublishAllowedAfterRecalc || 0)}</span>
            <span>自动 patch ${formatNumber(gateRecalcSummary.sourcePatchAutoApplyAllowed || 0)}</span>
          </div>
          ${gateRecalcRows.length ? gateRecalcRows.slice(0, 8).map((item) => `
            <article>
              <strong>${escapeHtml(item.recalculationStatus)} · ${escapeHtml(item.actionLabel || '')}</strong>
              <span>${escapeHtml(item.unifiedCustomerId)} · ${escapeHtml(item.lifecycleStateLabel || '')}</span>
              <p>${escapeHtml(item.recalculationDecision || '')}</p>
              <small>人工发送：${escapeHtml(item.manualSendCurrentStatus || '')} -> ${escapeHtml(item.manualSendNextStatus || '')}；H5：${escapeHtml(item.h5PublishCurrentStatus || '')} -> ${escapeHtml(item.h5PublishNextStatus || '')}</small>
              <small>前置：${escapeHtml((item.requiredBeforeRecalculation || []).join('、'))}</small>
              <small>自动发送：${item.safety?.automaticSendAllowed ? '允许' : '阻断'}；人工发送：${item.safety?.manualSendAllowed ? '允许' : '阻断'}；对客 H5：${item.safety?.h5CustomerFacingPublishAllowed ? '允许' : '阻断'}；自动 patch：${item.safety?.sourcePatchAutoApplyAllowed ? '允许' : '阻断'}</small>
            </article>
          `).join('') : '<div class="empty">尚未生成复核后门禁重算计划。</div>'}
        </div>
      </div>
    </div>
  `;
  const ruleCandidateTarget = $('#rule-candidate-list');
  if (ruleCandidateTarget) {
    ruleCandidateTarget.innerHTML = ruleRows.length ? ruleRows.slice(0, 8).map((rule) => `
      <article class="rule-candidate-item">
        <div class="rule-candidate-head">
          <span class="status-chip ${rule.candidateStatus === 'expand_small_batch' ? 'is-complete' : 'is-pending'}">${escapeHtml(rule.candidateStatus)}</span>
          <strong>${escapeHtml(rule.messageVariant)} · ${escapeHtml(rule.messageAngle)}</strong>
        </div>
        <span>${escapeHtml(rule.lifecycleState)} · ${escapeHtml(rule.productClass)} · ${escapeHtml(rule.evidenceStrength)} evidence · ${escapeHtml(rule.publishStatus)}</span>
        <div class="rule-candidate-metrics">
          <b>证据 ${formatNumber(rule.metrics?.observedRows || 0)}</b>
          <b>人工发 ${formatNumber(rule.metrics?.manualSentRows || 0)}</b>
          <b>跟进 ${formatNumber(rule.metrics?.postSendFollowupRows || 0)}</b>
          <b>H5意向 ${formatNumber(rule.metrics?.h5AppointmentIntentRows || 0)}</b>
          <b>H5补录 ${formatNumber(rule.metrics?.h5FormalOutcomeBackfillRequiredRows || 0)}</b>
          <b>预约 ${formatNumber(rule.metrics?.appointmentRows || 0)}</b>
          <b>到店 ${formatNumber(rule.metrics?.arrivedRows || 0)}</b>
          <b>转化 ${formatNumber(rule.metrics?.convertedRows || 0)}</b>
        </div>
        <p>${escapeHtml(rule.recommendation?.nextRoundStrategy || '')}</p>
      </article>
    `).join('') : '<div class="empty">尚未生成规则候选。</div>';
  }
}

async function loadLifecycleOperations() {
  if (state.advisorReviewQueue && state.feedbackTestUnits && state.advisorActionEvents && state.interactionOutcomeEvents && state.feedbackLearningEvents && state.lifecycleKpiSummary && state.lifecycleRuleCandidates && state.advisorExecutionPack && state.manualSendGateQueue && state.manualSendEvents && state.postSendFollowupQueue && state.nextRoundActionPlan && state.adminTodoCenter && state.adminTodoEvents && state.adminTodoSourceSyncPlan && state.adminSourceSyncEvents && state.adminSourceSyncExecutionEvents && state.mvpResultScorecard && state.realBusinessTruthBackfillPlan && state.productClassificationSeed && state.productClassificationReviewQueue && state.productClassificationReviewEvents && state.productClassificationReviewExecutionPack && state.productClassificationReviewImportContract && state.productClassificationReviewImportReadinessReport && state.productClassificationRecomputePlan && state.productClassificationImpactPlan && state.lifecycleTraceabilityMatrix && state.adminCustomerDetailPack && state.h5PublishGateQueue && state.h5PublishReviewEvents && state.h5PublishExecutionEvents && state.h5EngagementEvents && state.h5FeedbackLearningBridge && state.h5FormalOutcomeEvents && state.h5PostFormalFollowupQueue && state.h5PostFormalFollowupEvents && state.h5NoConversionReviewQueue && state.h5NoConversionReviewEvents && state.productCopyReviewQueue && state.productCopyReviewEvents && state.gateRecalculationPlan) return;
  try {
    const [reviewQueue, feedbackUnits, actionEvents, outcomeEvents, feedbackLearningEvents, lifecycleKpiSummary, lifecycleRuleCandidates, advisorExecutionPack, manualSendGateQueue, manualSendEvents, postSendFollowupQueue, nextRoundActionPlan, adminTodoCenter, adminTodoEvents, adminTodoSourceSyncPlan, adminSourceSyncEvents, adminSourceSyncExecutionEvents, mvpResultScorecard, realBusinessTruthBackfillPlan, productClassificationSeed, productClassificationReviewQueue, productClassificationReviewEvents, productClassificationReviewExecutionPack, productClassificationReviewImportContract, productClassificationReviewImportReadinessReport, productClassificationRecomputePlan, productClassificationImpactPlan, lifecycleTraceabilityMatrix, adminCustomerDetailPack, h5PublishGateQueue, h5PublishReviewEvents, h5PublishExecutionEvents, h5EngagementEvents, h5FeedbackLearningBridge, h5FormalOutcomeEvents, h5PostFormalFollowupQueue, h5PostFormalFollowupEvents, h5NoConversionReviewQueue, h5NoConversionReviewEvents, productCopyReviewQueue, productCopyReviewEvents, gateRecalculationPlan] = await Promise.all([
      api('/advisor_review_queue.v1.json').catch(() => api('/lifecycle-system/advisor_review_queue.v1.json')),
      api('/feedback_test_units.v1.json').catch(() => api('/lifecycle-system/feedback_test_units.v1.json')),
      api('/api/lifecycle/advisor-action-events').catch(() => api('/advisor_action_events.v1.json').catch(() => api('/lifecycle-system/advisor_action_events.v1.json'))),
      api('/api/lifecycle/interaction-outcome-events').catch(() => api('/interaction_outcome_events.v1.json').catch(() => api('/lifecycle-system/interaction_outcome_events.v1.json'))),
      api('/feedback_learning_events.v1.json').catch(() => api('/lifecycle-system/feedback_learning_events.v1.json')),
      api('/lifecycle_kpi_summary.v1.json').catch(() => api('/lifecycle-system/lifecycle_kpi_summary.v1.json')),
      api('/lifecycle_rule_candidates.v1.json').catch(() => api('/lifecycle-system/lifecycle_rule_candidates.v1.json')),
      api('/advisor_execution_pack.v1.json').catch(() => api('/lifecycle-system/advisor_execution_pack.v1.json')),
      api('/manual_send_gate_queue.v1.json').catch(() => api('/lifecycle-system/manual_send_gate_queue.v1.json')),
      api('/api/lifecycle/manual-send-events').catch(() => api('/manual_send_events.v1.json').catch(() => api('/lifecycle-system/manual_send_events.v1.json'))),
      api('/post_send_followup_queue.v1.json').catch(() => api('/lifecycle-system/post_send_followup_queue.v1.json')),
      api('/next_round_action_plan.v1.json').catch(() => api('/lifecycle-system/next_round_action_plan.v1.json')),
      api('/admin_todo_center.v1.json').catch(() => api('/lifecycle-system/admin_todo_center.v1.json')),
      api('/api/lifecycle/admin-todo-events').catch(() => api('/admin_todo_events.v1.json').catch(() => api('/lifecycle-system/admin_todo_events.v1.json'))),
      api('/admin_todo_source_sync_plan.v1.json').catch(() => api('/lifecycle-system/admin_todo_source_sync_plan.v1.json')),
      api('/api/lifecycle/admin-source-sync-events').catch(() => api('/admin_source_sync_events.v1.json').catch(() => api('/lifecycle-system/admin_source_sync_events.v1.json'))),
      api('/api/lifecycle/admin-source-sync-execution-events').catch(() => api('/admin_source_sync_execution_events.v1.json').catch(() => api('/lifecycle-system/admin_source_sync_execution_events.v1.json'))),
      api('/mvp_result_scorecard.v1.json').catch(() => api('/lifecycle-system/mvp_result_scorecard.v1.json')),
      api('/real_business_truth_backfill_plan.v1.json').catch(() => api('/lifecycle-system/real_business_truth_backfill_plan.v1.json')),
      api('/product_classification_seed.v1.json').catch(() => api('/lifecycle-system/product_classification_seed.v1.json')),
      api('/product_classification_review_queue.v1.json').catch(() => api('/lifecycle-system/product_classification_review_queue.v1.json')),
      api('/api/lifecycle/product-classification-review-events').catch(() => api('/product_classification_review_events.v1.json').catch(() => api('/lifecycle-system/product_classification_review_events.v1.json'))),
      api('/product_classification_review_execution_pack.v1.json').catch(() => api('/lifecycle-system/product_classification_review_execution_pack.v1.json')),
      api('/product_classification_review_import_contract.v1.json').catch(() => api('/lifecycle-system/product_classification_review_import_contract.v1.json')),
      api('/product_classification_review_import_readiness_report.v1.json').catch(() => api('/lifecycle-system/product_classification_review_import_readiness_report.v1.json')),
      api('/product_classification_recompute_plan.v1.json').catch(() => api('/lifecycle-system/product_classification_recompute_plan.v1.json')),
      api('/product_classification_impact_plan.v1.json').catch(() => api('/lifecycle-system/product_classification_impact_plan.v1.json')),
      api('/lifecycle_traceability_matrix.v1.json').catch(() => api('/lifecycle-system/lifecycle_traceability_matrix.v1.json')),
      api('/admin_customer_detail_pack.v1.json').catch(() => api('/lifecycle-system/admin_customer_detail_pack.v1.json')),
      api('/h5_publish_gate_queue.v1.json').catch(() => api('/lifecycle-system/h5_publish_gate_queue.v1.json')),
      api('/api/lifecycle/h5-publish-review-events').catch(() => api('/h5_publish_review_events.v1.json').catch(() => api('/lifecycle-system/h5_publish_review_events.v1.json'))),
      api('/api/lifecycle/h5-publish-execution-events').catch(() => api('/h5_publish_execution_events.v1.json').catch(() => api('/lifecycle-system/h5_publish_execution_events.v1.json'))),
      api('/api/lifecycle/h5-engagement-events').catch(() => api('/h5_engagement_events.v1.json').catch(() => api('/lifecycle-system/h5_engagement_events.v1.json'))),
      api('/h5_feedback_learning_bridge.v1.json').catch(() => api('/lifecycle-system/h5_feedback_learning_bridge.v1.json')),
      api('/api/lifecycle/h5-formal-outcome-events').catch(() => api('/h5_formal_outcome_events.v1.json').catch(() => api('/lifecycle-system/h5_formal_outcome_events.v1.json'))),
      api('/h5_post_formal_followup_queue.v1.json').catch(() => api('/lifecycle-system/h5_post_formal_followup_queue.v1.json')),
      api('/api/lifecycle/h5-post-formal-followup-events').catch(() => api('/h5_post_formal_followup_events.v1.json').catch(() => api('/lifecycle-system/h5_post_formal_followup_events.v1.json'))),
      api('/h5_no_conversion_review_queue.v1.json').catch(() => api('/lifecycle-system/h5_no_conversion_review_queue.v1.json')),
      api('/api/lifecycle/h5-no-conversion-review-events').catch(() => api('/h5_no_conversion_review_events.v1.json').catch(() => api('/lifecycle-system/h5_no_conversion_review_events.v1.json'))),
      api('/product_copy_review_queue.v1.json').catch(() => api('/lifecycle-system/product_copy_review_queue.v1.json')),
      api('/api/lifecycle/product-copy-review-events').catch(() => api('/product_copy_review_events.v1.json').catch(() => api('/lifecycle-system/product_copy_review_events.v1.json'))),
      api('/gate_recalculation_plan.v1.json').catch(() => api('/lifecycle-system/gate_recalculation_plan.v1.json')),
    ]);
    renderLifecycleOperations(reviewQueue, feedbackUnits, actionEvents, outcomeEvents, feedbackLearningEvents, lifecycleKpiSummary, lifecycleRuleCandidates, advisorExecutionPack, manualSendGateQueue, manualSendEvents, postSendFollowupQueue, nextRoundActionPlan, adminTodoCenter, adminTodoEvents, adminTodoSourceSyncPlan, adminSourceSyncEvents, adminSourceSyncExecutionEvents, mvpResultScorecard, realBusinessTruthBackfillPlan, productClassificationSeed, productClassificationReviewQueue, productClassificationReviewEvents, productClassificationReviewExecutionPack, productClassificationReviewImportContract, productClassificationReviewImportReadinessReport, productClassificationRecomputePlan, productClassificationImpactPlan, lifecycleTraceabilityMatrix, adminCustomerDetailPack, h5PublishGateQueue, h5PublishReviewEvents, h5PublishExecutionEvents, h5EngagementEvents, h5FeedbackLearningBridge, h5FormalOutcomeEvents, h5PostFormalFollowupQueue, h5PostFormalFollowupEvents, h5NoConversionReviewQueue, h5NoConversionReviewEvents, productCopyReviewQueue, productCopyReviewEvents, gateRecalculationPlan);
  } catch (error) {
    $('#lifecycle-ops-summary').innerHTML = `<div class="empty">审核/反馈队列读取失败：${escapeHtml(error.message)}</div>`;
  }
}

function renderLifecycleOperationsFromState() {
  renderLifecycleOperations(
    state.advisorReviewQueue,
    state.feedbackTestUnits,
    state.advisorActionEvents,
    state.interactionOutcomeEvents,
    state.feedbackLearningEvents,
    state.lifecycleKpiSummary,
    state.lifecycleRuleCandidates,
    state.advisorExecutionPack,
    state.manualSendGateQueue,
    state.manualSendEvents,
    state.postSendFollowupQueue,
    state.nextRoundActionPlan,
    state.adminTodoCenter,
    state.adminTodoEvents,
    state.adminTodoSourceSyncPlan,
    state.adminSourceSyncEvents,
    state.adminSourceSyncExecutionEvents,
    state.mvpResultScorecard,
    state.realBusinessTruthBackfillPlan,
    state.productClassificationSeed,
    state.productClassificationReviewQueue,
    state.productClassificationReviewEvents,
    state.productClassificationReviewExecutionPack,
    state.productClassificationReviewImportContract,
    state.productClassificationReviewImportReadinessReport,
    state.productClassificationRecomputePlan,
    state.productClassificationImpactPlan,
    state.lifecycleTraceabilityMatrix,
    state.adminCustomerDetailPack,
    state.h5PublishGateQueue,
    state.h5PublishReviewEvents,
    state.h5PublishExecutionEvents,
    state.h5EngagementEvents,
    state.h5FeedbackLearningBridge,
    state.h5FormalOutcomeEvents,
    state.h5PostFormalFollowupQueue,
    state.h5PostFormalFollowupEvents,
    state.h5NoConversionReviewQueue,
    state.h5NoConversionReviewEvents,
    state.productCopyReviewQueue,
    state.productCopyReviewEvents,
    state.gateRecalculationPlan,
  );
}

async function submitAdvisorAction(reviewItemId, action) {
  const statusTarget = document.getElementById(`review-action-status-${reviewItemId}`);
  if (statusTarget) statusTarget.textContent = '正在记录本地审核动作...';
  try {
    const result = await postApi('/api/lifecycle/advisor-action-events', { reviewItemId, action });
    state.advisorActionEvents = {
      ...(state.advisorActionEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.advisorActionEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`review-action-status-${reviewItemId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = `已记录：${result.event.actionLabel} · ${result.event.reviewStatus} · ${result.event.nextWorkflowState}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitInteractionOutcome(testUnitId, outcomeType) {
  const statusTarget = document.getElementById(`outcome-action-status-${testUnitId}`);
  if (statusTarget) statusTarget.textContent = '正在记录本地互动结果...';
  try {
    const result = await postApi('/api/lifecycle/interaction-outcome-events', { testUnitId, outcomeType });
    state.interactionOutcomeEvents = {
      ...(state.interactionOutcomeEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.interactionOutcomeEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`outcome-action-status-${testUnitId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = `已记录：${result.event.outcomeLabel} · ${result.event.customerResponse} · ${result.event.learningResult}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitManualSend(gateId, sendChannel) {
  const statusTarget = document.getElementById(`manual-send-status-${gateId}`);
  if (statusTarget) statusTarget.textContent = '正在记录人工发送确认...';
  try {
    const result = await postApi('/api/lifecycle/manual-send-events', { gateId, sendChannel });
    state.manualSendEvents = {
      ...(state.manualSendEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.manualSendEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`manual-send-status-${gateId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = result.duplicateIgnored
        ? `已存在人工发送确认：${result.event.messageSentAt}`
        : `已记录人工发送确认：${result.event.messageSentAt}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitAdminTodo(todoId, action) {
  const statusTarget = document.getElementById(`admin-todo-status-${todoId}`);
  if (statusTarget) statusTarget.textContent = '正在记录后台待办写回...';
  try {
    const result = await postApi('/api/lifecycle/admin-todo-events', { todoId, action });
    state.adminTodoEvents = {
      ...(state.adminTodoEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.adminTodoEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`admin-todo-status-${todoId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = `已记录：${result.event.actionLabel} · ${result.event.nextTodoStatus}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitAdminSourceSync(syncId, syncDecision) {
  const statusTarget = document.getElementById(`admin-source-sync-status-${syncId}`);
  if (statusTarget) statusTarget.textContent = '正在记录源同步人工确认...';
  try {
    const result = await postApi('/api/lifecycle/admin-source-sync-events', { syncId, syncDecision });
    state.adminSourceSyncEvents = {
      ...(state.adminSourceSyncEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.adminSourceSyncEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`admin-source-sync-status-${syncId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = result.duplicateIgnored
        ? `已存在源同步复核：${result.event.actionLabel} · ${result.event.nextSyncReviewStatus}`
        : `已记录源同步复核：${result.event.actionLabel} · ${result.event.nextSyncReviewStatus}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitAdminSourceSyncExecution(sourceSyncEventId, executionResult) {
  const statusTarget = document.getElementById(`admin-source-sync-execution-status-${sourceSyncEventId}`);
  if (statusTarget) statusTarget.textContent = '正在记录源同步人工落地执行结果...';
  try {
    const result = await postApi('/api/lifecycle/admin-source-sync-execution-events', {
      sourceSyncEventId,
      executionResult,
    });
    state.adminSourceSyncExecutionEvents = {
      ...(state.adminSourceSyncExecutionEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.adminSourceSyncExecutionEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`admin-source-sync-execution-status-${sourceSyncEventId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = result.duplicateIgnored
        ? `已存在执行结果：${result.event.actionLabel} · ${result.event.nextExecutionStatus}`
        : `已记录执行结果：${result.event.actionLabel} · ${result.event.nextExecutionStatus}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitProductCopyReview(reviewQueueId, action) {
  const statusTarget = document.getElementById(`product-copy-review-status-${reviewQueueId}`);
  if (statusTarget) statusTarget.textContent = '正在记录产品/话术复核写回...';
  try {
    const result = await postApi('/api/lifecycle/product-copy-review-events', { reviewQueueId, action });
    state.productCopyReviewEvents = {
      ...(state.productCopyReviewEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.productCopyReviewEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`product-copy-review-status-${reviewQueueId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = `已记录：${result.event.actionLabel} · ${result.event.nextReviewStatus}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitProductClassificationReview(reviewQueueId, reviewAction) {
  const statusTarget = document.getElementById(`product-classification-review-status-${reviewQueueId}`);
  if (statusTarget) statusTarget.textContent = '正在记录项目分类复核写回...';
  try {
    const result = await postApi('/api/lifecycle/product-classification-review-events', { reviewQueueId, reviewAction });
    state.productClassificationReviewEvents = {
      ...(state.productClassificationReviewEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.productClassificationReviewEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`product-classification-review-status-${reviewQueueId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = result.duplicateIgnored
        ? `已存在：${result.event.actionLabel} · ${result.event.nextReviewStatus}`
        : `已记录：${result.event.actionLabel} · ${result.event.nextReviewStatus}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitH5PublishReview(h5GateId, action) {
  const statusTarget = document.getElementById(`h5-publish-review-status-${h5GateId}`);
  if (statusTarget) statusTarget.textContent = '正在记录 H5 发布复核写回...';
  try {
    const result = await postApi('/api/lifecycle/h5-publish-review-events', { h5GateId, action });
    state.h5PublishReviewEvents = {
      ...(state.h5PublishReviewEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.h5PublishReviewEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`h5-publish-review-status-${h5GateId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = `已记录：${result.event.actionLabel} · ${result.event.nextPublishReviewStatus}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitH5PublishExecution(h5PublishReviewEventId, publishChannel) {
  const statusTarget = document.getElementById(`h5-publish-execution-status-${h5PublishReviewEventId}`);
  if (statusTarget) statusTarget.textContent = '正在记录 H5 人工发布执行...';
  try {
    const result = await postApi('/api/lifecycle/h5-publish-execution-events', {
      h5PublishReviewEventId,
      publishChannel,
    });
    state.h5PublishExecutionEvents = {
      ...(state.h5PublishExecutionEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.h5PublishExecutionEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`h5-publish-execution-status-${h5PublishReviewEventId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = result.duplicateIgnored
        ? `已存在执行确认：${result.event.publishExecutedAt}`
        : `已记录执行确认：${result.event.publishExecutedAt}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitH5Engagement(h5PublishExecutionEventId, engagementType) {
  const statusTarget = document.getElementById(`h5-engagement-status-${h5PublishExecutionEventId}`);
  if (statusTarget) statusTarget.textContent = '正在记录 H5 互动结果...';
  try {
    const result = await postApi('/api/lifecycle/h5-engagement-events', {
      h5PublishExecutionEventId,
      engagementType,
    });
    state.h5EngagementEvents = {
      ...(state.h5EngagementEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.h5EngagementEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`h5-engagement-status-${h5PublishExecutionEventId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = `已记录：${result.event.engagementLabel} · ${result.event.learningResult}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitH5FormalOutcome(bridgeEventId, formalOutcomeType) {
  const statusTarget = document.getElementById(`h5-formal-outcome-status-${bridgeEventId}`);
  if (statusTarget) statusTarget.textContent = '正在记录 H5 正式结果补录...';
  try {
    const result = await postApi('/api/lifecycle/h5-formal-outcome-events', {
      bridgeEventId,
      formalOutcomeType,
    });
    state.h5FormalOutcomeEvents = {
      ...(state.h5FormalOutcomeEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.h5FormalOutcomeEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`h5-formal-outcome-status-${bridgeEventId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = result.duplicateIgnored
        ? `已存在补录：${result.event.outcomeLabel}`
        : `已记录补录：${result.event.outcomeLabel} · ${result.event.learningResult}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitH5PostFormalFollowup(followupId, followupActionType) {
  const statusTarget = document.getElementById(`h5-post-formal-followup-status-${followupId}`);
  if (statusTarget) statusTarget.textContent = '正在记录 H5 到店/转化跟进...';
  try {
    const result = await postApi('/api/lifecycle/h5-post-formal-followup-events', {
      followupId,
      followupActionType,
    });
    state.h5PostFormalFollowupEvents = {
      ...(state.h5PostFormalFollowupEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.h5PostFormalFollowupEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`h5-post-formal-followup-status-${followupId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = result.duplicateIgnored
        ? `已存在写回：${result.event.actionLabel}`
        : `已记录写回：${result.event.actionLabel} · ${result.event.learningResult}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function submitH5NoConversionReview(reviewQueueId, reviewAction, noConversionReasonCode) {
  const statusTarget = document.getElementById(`h5-no-conversion-review-status-${reviewQueueId}`);
  if (statusTarget) statusTarget.textContent = '正在记录 H5 未转化原因复盘...';
  try {
    const result = await postApi('/api/lifecycle/h5-no-conversion-review-events', {
      reviewQueueId,
      reviewAction,
      noConversionReasonCode,
    });
    state.h5NoConversionReviewEvents = {
      ...(state.h5NoConversionReviewEvents || {}),
      summary: result.summary,
      events: [result.event, ...((state.h5NoConversionReviewEvents?.events || []).filter((event) => event.eventId !== result.event.eventId))],
    };
    renderLifecycleOperationsFromState();
    const nextStatusTarget = document.getElementById(`h5-no-conversion-review-status-${reviewQueueId}`);
    if (nextStatusTarget) {
      nextStatusTarget.textContent = result.duplicateIgnored
        ? `已存在复盘写回：${result.event.actionLabel} · ${result.event.noConversionReasonLabel}`
        : `已记录复盘写回：${result.event.actionLabel} · ${result.event.noConversionReasonLabel}`;
    }
  } catch (error) {
    if (statusTarget) statusTarget.textContent = `记录失败：${error.message}`;
  }
}

async function loadLifecycleBatch20() {
  if (state.lifecycleBatch20) return;
  try {
    const batch = await api('/lifecycle_batch20.v1.json').catch(() => api('/lifecycle-system/lifecycle_batch20.v1.json'));
    renderLifecycleBatch20(batch);
    loadDatabaseAnalysisTrainingPack();
    loadLatestLifecycleAgentRun();
    loadDeliverableDraftArchive();
    loadLifecycleOperations();
  } catch (error) {
    $('#lifecycle-batch20-summary').innerHTML = `<div class="empty">前 20 人批次读取失败：${escapeHtml(error.message)}</div>`;
    loadDatabaseAnalysisTrainingPack();
    loadLatestLifecycleAgentRun();
    loadDeliverableDraftArchive();
  }
}

async function loadLatestLifecycleAgentRun(options = {}) {
  if (!window.LifecycleAgentRenderers) return;
  const resultStatus = $('#deepseek-results-status');
  const h5Status = $('#deepseek-h5-status');
  try {
    [resultStatus, h5Status].filter(Boolean).forEach((status) => {
      status.textContent = '读取中';
      status.className = 'status-chip is-indexed';
    });
    const index = options.index || await api(`${DEEPSEEK_DS_RESULTS_API}/runs/latest`);
    const customerCode = options.customerCode || state.selectedDeepSeekRunCustomerCode || index.customers?.[0]?.customerCode || 'C01';
    const customer = await api(`${DEEPSEEK_DS_RESULTS_API}/runs/${encodeURIComponent(index.runId)}/customers/${encodeURIComponent(customerCode)}`);
    await ensureDatabaseAnalysisTrainingPackData();
    state.latestLifecycleAgentRunIndex = index;
    state.latestLifecycleAgentRun = customer;
    state.selectedDeepSeekRunCustomerCode = customerCode;
    renderDeepSeekSeparatedViews();
  } catch (error) {
    state.latestLifecycleAgentRunIndex = null;
    state.latestLifecycleAgentRun = null;
    [resultStatus, h5Status].filter(Boolean).forEach((status) => {
      status.textContent = '未接入';
      status.className = 'status-chip is-missing';
    });
    ['#deepseek-results-detail', '#deepseek-h5-detail'].forEach((selector) => {
      const target = $(selector);
      if (target) target.innerHTML = `<div class="empty">暂无 DS 生成版 DeepSeek 结果。请点击“启动”后读取本地 DS 抽取库生成结果。${escapeHtml(error.message || '')}</div>`;
    });
  }
}

function renderDeepSeekSeparatedViews() {
  renderDeepSeekRunSummary();
  renderDeepSeekRunCustomerLists();
  renderDeepSeekRunDetail();
  renderDeepSeekH5ReviewDetail();
}

async function ensureDatabaseAnalysisTrainingPackData() {
  if (state.databaseAnalysisTrainingPack) return state.databaseAnalysisTrainingPack;
  try {
    state.databaseAnalysisTrainingPack = await api('/database_analysis_training_samples.v1.json')
      .catch(() => api('/database-analysis-training/database_analysis_training_samples.v1.json'));
  } catch (error) {
    state.databaseAnalysisTrainingPack = null;
  }
  return state.databaseAnalysisTrainingPack;
}

function renderDeepSeekRunSummary() {
  const index = state.latestLifecycleAgentRunIndex || {};
  const run = state.latestLifecycleAgentRun || {};
  const identity = run.customerIdentity || {};
  const packSummary = state.databaseAnalysisTrainingPack?.summary || {};
  const counts = index.counts || {};
  const customers = index.customers || [];
  const generatedCount = customers.length || counts.requested || 0;
  const html = [
    ['数据源', '非 VIP 老客数据库（DS生成版）', index.scope?.sourcePolicy || '读取本地 DS 目标库，不使用旧 JSON 测试数据源。'],
    ['生成范围', `${formatNumber(generatedCount)} 人`, `新库中有多少客户就生成多少条分析内容；当前 completed ${formatNumber(counts.generated || generatedCount)}/${formatNumber(counts.requested || generatedCount)}。`],
    ['当前允许', '内部分析与人工复核', '自动发送 0，对客发布 0，远端写入 0。'],
    ['DeepSeek DS 批次', index.runId || '待读取', `${identity.customerCode || state.selectedDeepSeekRunCustomerCode || '待选'} · ${Object.keys(run.branchOutputs || {}).length}/10 分支 Agent`],
  ].map(([label, value, note]) => `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <p>${escapeHtml(note || '')}</p>
    </article>
  `).join('');
  ['#deepseek-results-summary', '#deepseek-h5-summary'].forEach((selector) => {
    const target = $(selector);
    if (target) target.innerHTML = html || '<div class="empty">暂无 DeepSeek 批次摘要。</div>';
  });
  const resultStatus = $('#deepseek-results-status');
  const h5Status = $('#deepseek-h5-status');
  [resultStatus, h5Status].filter(Boolean).forEach((status) => {
    status.textContent = `${identity.customerCode || 'C01'} · ${index.status || run.runMeta?.status || 'ready'}`;
    status.className = 'status-chip is-indexed';
  });
}

function renderDeepSeekRunCustomerLists() {
  const customers = state.latestLifecycleAgentRunIndex?.customers || [];
  const activeCode = state.selectedDeepSeekRunCustomerCode || state.latestLifecycleAgentRun?.customerIdentity?.customerCode;
  const html = customers.map((customer) => `
    <button class="ai-insight-customer-button ${customer.customerCode === activeCode ? 'is-active' : ''}" data-deepseek-run-customer="${escapeHtml(customer.customerCode)}">
      <span>${escapeHtml(customer.customerCode || '客户')} · ${escapeHtml(customer.status || '')}</span>
      <strong>${escapeHtml(customer.maskedCustomerId || customer.unifiedCustomerId || '')}</strong>
      <small>
        <b>分支 ${escapeHtml(customer.branchCount ?? 0)}/10</b>
        <b>${customer.advisorReviewRequired ? '顾问审核' : '免审核'}</b>
        <b>${customer.automaticPublishAllowed ? '可自动发布' : '自动发布禁止'}</b>
      </small>
    </button>
  `).join('') || '<div class="empty">暂无 DeepSeek 客户结果。</div>';
  ['#deepseek-results-customer-list', '#deepseek-h5-customer-list'].forEach((selector) => {
    const target = $(selector);
    if (target) target.innerHTML = html;
  });
  document.querySelectorAll('[data-deepseek-run-customer]').forEach((button) => {
    button.addEventListener('click', () => selectDeepSeekRunCustomer(button.dataset.deepseekRunCustomer));
  });
}

async function selectDeepSeekRunCustomer(customerCode) {
  if (!customerCode || customerCode === state.selectedDeepSeekRunCustomerCode) return;
  state.selectedDeepSeekRunCustomerCode = customerCode;
  await loadLatestLifecycleAgentRun({ customerCode, index: state.latestLifecycleAgentRunIndex });
}

function setDeepseekResultsButtons(disabled) {
  const runButton = $('#run-deepseek-results');
  const syncButton = $('#sync-deepseek-h5-review');
  const stopButton = $('#stop-deepseek-results');
  const clearButton = $('#clear-deepseek-results');
  const reloadButton = $('#reload-deepseek-results');
  if (runButton) runButton.disabled = disabled;
  if (syncButton) syncButton.disabled = disabled;
  if (stopButton) stopButton.disabled = !disabled;
  if (clearButton) clearButton.disabled = disabled;
  if (reloadButton) reloadButton.disabled = disabled;
}

function updateDeepseekResultsStream(message, tone = '') {
  const target = $('#deepseek-results-stream');
  if (!target) return;
  target.className = `run-status ${tone}`.trim();
  target.textContent = message || '等待读取 DS 生成版结果。';
}

function handleDeepseekResultsEvent(eventName, payload = {}) {
  const status = $('#deepseek-results-status');
  if (status) {
    status.textContent = payload.customerCode
      ? `${payload.customerCode} · ${payload.completed || 0}/${payload.total || 0}`
      : (payload.status || eventName || '运行中');
    status.className = eventName === 'error' ? 'status-chip is-missing' : 'status-chip is-indexed';
  }
  const message = payload.message || eventName;
  const countText = payload.total ? ` · ${formatNumber(payload.completed || 0)}/${formatNumber(payload.total)}` : '';
  updateDeepseekResultsStream(`${message}${countText}`, eventName === 'error' ? 'empty' : '');
  if (eventName === 'run_started' || eventName === 'customer_completed') {
    state.latestLifecycleAgentRunIndex = {
      ...(state.latestLifecycleAgentRunIndex || {}),
      runId: payload.runId || state.latestLifecycleAgentRunIndex?.runId,
      status: payload.status || 'running',
      counts: payload.counts || state.latestLifecycleAgentRunIndex?.counts || {},
      customers: payload.customerSummary
        ? [...(state.latestLifecycleAgentRunIndex?.customers || []).filter((item) => item.customerCode !== payload.customerSummary.customerCode), payload.customerSummary]
        : (state.latestLifecycleAgentRunIndex?.customers || []),
    };
    renderDeepSeekRunSummary();
    renderDeepSeekRunCustomerLists();
  }
}

async function runDeepseekResults() {
  if (state.deepseekResultsBusy) return;
  state.deepseekResultsBusy = true;
  state.deepseekResultsAbort = new AbortController();
  setDeepseekResultsButtons(true);
  updateDeepseekResultsStream('正在启动 DS 生成版 DeepSeek 分析。');
  try {
    const response = await fetch(`${DEEPSEEK_DS_RESULTS_API}/runs/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'deepseek_results_page_ds_scene1_start' }),
      signal: state.deepseekResultsAbort.signal,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || body.error || response.statusText);
    }
    await consumeDsExtractionStream(response, handleDeepseekResultsEvent);
    state.latestLifecycleAgentRun = null;
    state.latestLifecycleAgentRunIndex = null;
    state.selectedDeepSeekRunCustomerCode = null;
    await loadLatestLifecycleAgentRun();
  } catch (error) {
    if (error.name !== 'AbortError') {
      handleDeepseekResultsEvent('error', { message: `DS 生成版 DeepSeek 分析失败：${error.message}` });
    }
  } finally {
    state.deepseekResultsBusy = false;
    state.deepseekResultsAbort = null;
    setDeepseekResultsButtons(false);
  }
}

function stopDeepseekResults() {
  state.deepseekResultsAbort?.abort();
  state.deepseekResultsBusy = false;
  setDeepseekResultsButtons(false);
  updateDeepseekResultsStream('已停止当前浏览器连接；已落本地的 DS DeepSeek 结果保留。');
}

async function syncDeepseekResultsToH5Review() {
  if (state.deepseekResultsBusy) return;
  updateDeepseekResultsStream('开始同步 DS 生成结果到顾问任务&H5审核；完成后可在审核页查看全量任务卡与三屏 H5。');
  await runDeepseekResults();
  switchView('deepseek-h5-review');
}

async function clearDeepseekResults() {
  if (state.deepseekResultsBusy) return;
  setDeepseekResultsButtons(true);
  try {
    const response = await fetch(`${DEEPSEEK_DS_RESULTS_API}/clear`, { method: 'POST' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || payload.error || response.statusText);
    state.latestLifecycleAgentRun = null;
    state.latestLifecycleAgentRunIndex = null;
    state.selectedDeepSeekRunCustomerCode = null;
    renderDeepSeekSeparatedViews();
    updateDeepseekResultsStream('已清空本地 DS DeepSeek 生成版结果；DS 抽取校验源数据未删除，H5 审核页本地状态不受影响。');
  } catch (error) {
    handleDeepseekResultsEvent('error', { message: `清空失败：${error.message}` });
  } finally {
    setDeepseekResultsButtons(false);
  }
}

function deepSeekRunInputSnapshot(run) {
  return run?.inputSnapshot?.trainingInputSnapshot
    || run?.inputSnapshot?.lifecycleFacts
    || run?.inputSnapshot?.adminOverview
    || run?.inputSnapshot?.draftArchiveSnapshot
    || {};
}

function deepSeekFinalModel(run) {
  return run?.branchOutputs?.synthesis?.finalAiPortraitConsumptionModel || {};
}

function deepSeekNumberLabel(value, suffix = '') {
  if (value === null || value === undefined || value === '') return '待补';
  return `${formatNumber(value)}${suffix}`;
}

function deepSeekGeneratedText(run, branchKey) {
  return run?.branchOutputs?.[branchKey]?.deepseekGeneration?.generatedText || '';
}

function textIncludesAny(text, keywords) {
  const raw = String(text || '').toLowerCase();
  return keywords.some((keyword) => raw.includes(String(keyword).toLowerCase()));
}

function fallbackDemandClassification(input = {}) {
  const text = [input.lastMaintenanceProject, input.modelFinalSummary, input.sourceBoundaries].filter(Boolean).join(' ');
  if (textIncludesAny(text, ['热玛吉', '超声炮', '紧致', '年轻化', '抗衰', '提升'])) {
    return { primaryTypeCode: 'anti_aging', primaryTypeLabel: '抗衰型客户', businessGoal: '年度年轻化规划与医生评估', fallback: true };
  }
  if (textIncludesAny(text, ['轮廓', '鼻', '下巴', '形态', '审美'])) {
    return { primaryTypeCode: 'aesthetic', primaryTypeLabel: '美化型客户', businessGoal: '审美方案人工评估', fallback: true };
  }
  if (textIncludesAny(text, ['护肤', '修复', '维稳', '产品', '品牌'])) {
    return { primaryTypeCode: 'holistic_skincare', primaryTypeLabel: '整全护肤型客户', businessGoal: '医生视角护肤适配', fallback: true };
  }
  if (textIncludesAny(text, ['斑', '敏', '痘', '红斑', '炎症', '消炎', '问题肌', '治疗'])) {
    return { primaryTypeCode: 'treatment', primaryTypeLabel: '治疗型客户', businessGoal: '完成治疗路径', fallback: true };
  }
  return { primaryTypeCode: 'maintenance', primaryTypeLabel: '维养型客户', businessGoal: '恢复合理维养周期', fallback: true };
}

function fallbackLifecycleClassification(input = {}, demand = {}) {
  const overdueDays = Number(input.overdueDays ?? input.daysSinceLastMaintenance ?? 0);
  const maintenanceCount = Number(input.maintenanceCount12m ?? 0);
  let stage = { code: 'maintenance', label: '维养期', businessGoal: '建立长期维养习惯' };
  if (input.riskLevel === 'red') stage = { code: 'risk_do_not_disturb', label: '风险 / 勿扰期', businessGoal: '停止自动触达，交由人工判断' };
  else if (overdueDays >= 180) stage = { code: 'churn', label: '流失期', businessGoal: '低压唤醒，重新建立联系' };
  else if (demand.primaryTypeCode === 'treatment' && maintenanceCount >= 2 && maintenanceCount <= 3) stage = { code: 'consolidation', label: '稳固期', businessGoal: '推动完成关键疗程，防止中断' };
  else if (demand.primaryTypeCode === 'treatment') stage = { code: 'treatment_execution', label: '治疗执行期', businessGoal: '提醒按时回访，维持治疗连续性' };
  else if (maintenanceCount <= 1) stage = { code: 'trial', label: '尝鲜期', businessGoal: '建立信任，避免一次性流失' };
  return {
    primaryStage: {
      ...stage,
      definition: '旧批次缺少 DeepSeek 分类字段，页面按 step2.docx 规则做兜底展示；新生成批次以模型分类为准。',
    },
    advisorConfirmationRequired: true,
    evidence: ['旧批次兜底分类：建议重新生成以获得完整 P1/P2/P3/P4 证据矩阵。'],
    conflicts: [],
    fallback: true,
  };
}

function fallbackClassificationDominancePolicy(demandClassification, lifecycleClassification) {
  return {
    primaryAnchor: `${demandClassification.primaryTypeLabel || '诉求待判别'} × ${lifecycleClassification.primaryStage?.label || '阶段待判别'}`,
    rule: '所有分析维度如与分类结果冲突或重叠，以诉求类型和生命周期阶段分类为主。',
  };
}

function defaultH5CommunicationAngles(demandClassification, lifecycleClassification, hook = {}) {
  const stageLabel = lifecycleClassification.primaryStage?.label || '阶段待确认';
  const unconsumed = hook.unconsumedProjects && hook.unconsumedProjects !== '待顾问确认'
    ? hook.unconsumedProjects
    : '已购未消耗项目待顾问核查';
  if (demandClassification.primaryTypeCode === 'treatment') {
    return [
      {
        code: 'doctor_cycle',
        label: '医生建议周期角度',
        operatingFocus: '强调治疗连续性和医生建议周期。',
        script: `我看到你之前这个治疗路径已经有记录了，现在处在${stageLabel}。这次不是想让你临时加项目，主要是想帮你确认一下医生建议周期和下一次复查/治疗安排是否需要接上。`,
        h5Lead: '为什么现在适合确认治疗节奏',
      },
      {
        code: 'effect_consolidation',
        label: '效果巩固角度',
        operatingFocus: '把沟通重点放在巩固改善，不制造焦虑，也不承诺疗效。',
        script: '前面治疗已经有基础，很多人会在刚有变化时放松节奏。我们这次可以先帮你复盘目前稳定度，再看是否需要继续巩固。',
        h5Lead: '效果开始出现后，为什么更需要稳住节奏',
      },
      {
        code: 'unconsumed_treatment',
        label: '已购未消耗角度',
        operatingFocus: '若存在已购未消耗，把重点从买不买转成什么时候方便完成。',
        script: `${unconsumed}。如果你这边还有已购未完成的部分，我们可以先帮你核对清楚，不涉及重新购买，重点是看什么时候方便回来接上。`,
        h5Lead: '已购权益和后续安排核对',
      },
    ];
  }
  return [
    {
      code: 'season_weather',
      label: '天气季节角度',
      operatingFocus: '结合紫外线、天气或季节变化解释维养周期，不制造焦虑。',
      script: `最近这个阶段皮肤状态容易受天气和紫外线影响，你之前有维养基础，现在处在${stageLabel}。我们可以先做一次肤况复盘，看看节奏要不要轻轻接回来。`,
      h5Lead: '季节变化下的状态维护提醒',
    },
    {
      code: 'identity_scene',
      label: '身份场景角度',
      operatingFocus: '结合工作压力、出行、社交或身份场景做低压提醒。',
      script: '如果你最近工作、出行或者作息比较满，皮肤状态可能会比平时更容易波动。我们可以先帮你看一下近期状态，不急着决定项目。',
      h5Lead: '近期生活场景与肤况复盘',
    },
    {
      code: 'holiday_state',
      label: '节日前状态管理角度',
      operatingFocus: '围绕节前、活动前、重要见面前的状态管理，保持温和。',
      script: `${hook.benefitSummary || '如果有积分、余额或优惠，也可以先帮你核对'}。这次更适合先确认肤况和时间安排，看是否需要做一次轻维护。`,
      h5Lead: '节日前状态管理与权益核对',
    },
  ];
}

function deepSeekH5ReviewTaskCard(run) {
  const finalModel = deepSeekFinalModel(run);
  const input = deepSeekRunInputSnapshot(run);
  const snapshot = deepSeekDraftSnapshot(run);
  const content = run?.branchOutputs?.contentStrategy || {};
  const synthesisInput = run?.branchOutputs?.synthesis?.taskCardInput || {};
  const raw = run?.advisorTaskCard?.h5ReviewTaskCard
    || finalModel.h5ReviewTaskCard
    || content.h5ReviewTaskCard
    || synthesisInput.h5ReviewTaskCard;
  if (raw && typeof raw === 'object') return raw;

  const demandClassification = finalModel.demandClassification || input.demandClassification || fallbackDemandClassification(input);
  const lifecycleClassification = finalModel.lifecycleClassification || input.lifecycleClassification || fallbackLifecycleClassification(input, demandClassification);
  const lifecycleLabel = lifecycleClassification.primaryStage?.label || input.lifecycleState?.label || snapshot.lifecycleLabel || '阶段待确认';
  const demandLabel = demandClassification.primaryTypeLabel || '诉求待确认';
  const hook = {
    unconsumedProjects: '待顾问确认',
    points: '待顾问确认',
    balance: '待顾问确认',
    coupon: '待顾问确认',
  };
  hook.benefitSummary = `已购未消耗：${hook.unconsumedProjects}；积分：${hook.points}；余额：${hook.balance}；优惠：${hook.coupon}`;
  const angles = defaultH5CommunicationAngles(demandClassification, lifecycleClassification, hook);
  const selectedAngle = angles[0] || {};
  return {
    personalProfileBrief: finalModel.shortProfile || input.modelFinalSummary || `${demandLabel}，当前处于${lifecycleLabel}；建议由顾问先核查方案、权益和近期肤况。`,
    basicInfo: {
      customerCode: run?.customerIdentity?.customerCode || run?.runMeta?.customerCode || 'SAMPLE-DS-H5',
      maskedCustomerId: run?.customerIdentity?.maskedCustomerId || run?.customerIdentity?.unifiedCustomerId || '',
      rfmGrade: snapshot.rfmGrade || input.rfmGrade || '待补',
      doctor: run?.customerIdentity?.primaryDoctorName || snapshot.primaryDoctorName || '待补',
      advisor: run?.customerIdentity?.advisorName || snapshot.healthManagerName || '待补',
    },
    classification: {
      demandType: demandLabel,
      lifecycleStage: lifecycleLabel,
      classificationAnchor: `${demandLabel} × ${lifecycleLabel}`,
      dominancePolicy: '任务卡、沟通角度和 H5 预览均以分类主轴为准。',
    },
    planAndConsumption: {
      proposedOrTakenPlan: finalModel.customerFactLayer?.proposedPlan || snapshot.lastMaintenanceProject || input.lastMaintenanceProject || '待顾问确认',
      doctorOrPatientPlanSource: '旧批次兜底：建议重新生成获得标题级证据',
      consumptionFeatureSummary: finalModel.customerFactLayer?.consumptionHistory || `${input.maintenanceCount12m || 0} 次近 12 月维养；最近项目：${input.lastMaintenanceProject || '待补'}`,
      recentProject: input.lastMaintenanceProject || snapshot.lastMaintenanceProject || '待补',
      maintenanceCount12m: input.maintenanceCount12m || snapshot.maintenanceCount12m || 0,
      daysSinceLastMaintenance: input.daysSinceLastMaintenance || snapshot.daysSinceLastMaintenance || '待补',
      overdueDays: input.overdueDays || snapshot.overdueDays || '待补',
    },
    commercialHook: {
      title: demandClassification.primaryTypeCode === 'treatment' ? '让客户愿意回来完成治疗路径的抓手' : '让客户愿意回来做状态复盘的抓手',
      entryReason: selectedAngle.operatingFocus || '以分类主轴生成进店抓手。',
      ...hook,
      advisorUseOnly: true,
    },
    interactionGoal: {
      objective: lifecycleClassification.primaryStage?.businessGoal || input.interactionObjective || '顾问人工确认后决定下一步',
      advisorDecisionMode: '顾问可采纳、可反馈、可重新生成；不可直接修改生成内容。',
      feedbackPrompt: '请顾问判断：类型/阶段是否正确、抓手是否真实可用、是否适合发送。',
    },
    communicationAngles: angles,
    h5Preview: {
      screens: [
        {
          step: '01 / 03',
          title: `${demandLabel.replace('客户', '')}状态简报`,
          body: `根据现有记录，你现在处在${lifecycleLabel}。这次先帮你把近期状态和节奏梳理清楚。`,
          auditRationale: '第一屏只讲当前状态和为什么现在适合复盘，不展示内部评分。',
        },
        {
          step: '02 / 03',
          title: selectedAngle.h5Lead || '为什么现在值得关注',
          body: selectedAngle.operatingFocus || '',
          auditRationale: '第二屏承接沟通角度，解释回访理由。',
        },
        {
          step: '03 / 03',
          title: '下一步先由顾问帮你核对',
          body: demandClassification.primaryTypeCode === 'treatment'
            ? '先核对治疗进度、医生周期和已购未完成部分，再决定是否安排复查或继续疗程。'
            : '先核对近期肤况、时间安排和可用权益，再决定是否做一次轻维护。',
          auditRationale: '第三屏给出温和下一步，不自动预约、不强推购买。',
        },
      ],
      customerVisibleAllowed: ['上次治疗事实', '医生复诊建议', '近期肤况确认', '防晒保湿提醒', '由顾问协助整理给医生'],
      forbiddenCustomerSurface: ['RFM', '机会分', '风险灯', '流失期', '内部分类置信度', '消费金额', '心理标签', '自动发送'],
    },
    advisorSendScript: {
      selectedAngleCode: selectedAngle.code || '',
      selectedAngleLabel: selectedAngle.label || '',
      message: selectedAngle.script || '',
      sendBoundary: '只进入顾问人工审核，不自动发送给客户。',
    },
    advisorFeedback: {
      allowedActions: ['采纳', '重新生成', '反馈不采纳原因', '标记暂缓/勿扰'],
      canDirectEditGeneratedCopy: false,
      feedbackFields: ['类型阶段是否正确', '抓手是否真实可用', '话术角度是否合适', '是否适合发送', '需要补充的数据'],
    },
  };
}

function renderDeepSeekBusinessCategoryCard({ title, badge, conclusion, reasons = [] }) {
  return `
    <details class="ai-conclusion-card">
      <summary>
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(conclusion || '待 DeepSeek 生成')}</strong>
        ${badge ? `<b>${escapeHtml(badge)}</b>` : ''}
      </summary>
      <div class="ai-conclusion-body">
        <section>
          <h4>可复核摘要</h4>
          <ol>${renderAiReasonList(reasons.filter(Boolean))}</ol>
        </section>
      </div>
    </details>
  `;
}

function renderDeepSeekBriefConclusionFlow({ input, profile, finalModel, driverAnalysis, lifecycleState, scoring, opportunityScore, riskLevel, taskCardInput, modelAnalysis }) {
  const modelSteps = Array.isArray(modelAnalysis?.briefReasoningSteps) ? modelAnalysis.briefReasoningSteps.filter(Boolean) : [];
  if (modelSteps.length) {
    return `
      <section class="ai-brief-flow" aria-label="DeepSeek 模型简要思考过程">
        <div class="ai-brief-flow-head">
          <span>DeepSeek 模型简要思考过程</span>
          <strong>${escapeHtml(modelAnalysis.model || 'DeepSeek')}</strong>
        </div>
        <div class="ai-brief-flow-grid">
          ${modelSteps.map((step, index) => `
            <article>
              <b>${formatNumber(index + 1)}. ${escapeHtml(typeof step === 'string' ? '模型判断步骤' : (step.title || step.stage || '模型判断步骤'))}</b>
              <p>${escapeHtml(typeof step === 'string' ? step : (step.body || step.reason || step.inputFact || ''))}</p>
              ${typeof step === 'object' && (step.output || step.conclusion || step.evidence)
                ? `<small>${escapeHtml(step.output || step.conclusion || auditValueText(step.evidence))}</small>`
                : ''}
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }
  const consumptionModel = finalModel.consumptionModel || profile.consumptionModel || {};
  const lastProject = input.lastMaintenanceProject || '最近维护项目待补';
  const maintenanceCount = deepSeekNumberLabel(input.maintenanceCount12m, ' 次');
  const overdueDays = deepSeekNumberLabel(input.overdueDays ?? input.daysSinceLastMaintenance, ' 天');
  const primaryDriver = driverAnalysis.primaryDriverLabel || '核心驱动待补';
  const lifecycleLabel = lifecycleState.label || '生命周期待补';
  const demandClassification = finalModel.demandClassification || input.demandClassification || fallbackDemandClassification(input);
  const lifecycleClassification = finalModel.lifecycleClassification || input.lifecycleClassification || fallbackLifecycleClassification(input, demandClassification);
  const classificationDominancePolicy = finalModel.classificationDominancePolicy || fallbackClassificationDominancePolicy(demandClassification, lifecycleClassification);
  const interactionObjective = taskCardInput.interactionObjective || lifecycleState.objective || input.interactionObjective || '互动目标待补';
  const advisorFocus = taskCardInput.advisorFocus || finalModel.shortProfile || '顾问结论待补';
  const steps = [
    {
      title: '1. 读取安全结构化事实',
      body: `只使用本地结构化摘要：RFM ${input.rfmGrade || '待补'}、近 12 个月维养 ${maintenanceCount}、超期 ${overdueDays}、最近项目为${lastProject}。`,
      output: '不读取 ASR、沟通正文、病历正文或 NPS comment 原文。',
    },
    {
      title: '2. 先判诉求类型和生命周期',
      body: `依据 step2.docx 分类主轴，先判为${demandClassification.primaryTypeLabel || '诉求待判别'} × ${lifecycleClassification.primaryStage?.label || lifecycleLabel}；RFM、维养次数、超期天数只作辅助。`,
      output: `分类优先：${classificationDominancePolicy.rule || '冲突或重叠时以分类结果为主'}。本次目标：${interactionObjective}`,
    },
    {
      title: '3. 识别驱动与机会优先级',
      body: `结合维护历史、节奏中断和关系基础，判断以${primaryDriver}为主，机会评分为 ${formatNumber(opportunityScore)}。`,
      output: `风险灯为${riskLevelLabel(riskLevel)}，仍只允许进入人工审核。`,
    },
    {
      title: '4. 合成顾问可用结论',
      body: advisorFocus,
      output: `消息角度：${scoring.priorityLevel || finalModel.opportunity?.priority || input.opportunityPriority || '待补'}；不自动发送、不自动发布。`,
    },
  ];
  return `
    <section class="ai-brief-flow" aria-label="从拿到数据到得出结论简要说明">
      <div class="ai-brief-flow-head">
        <span>从拿到数据到得出结论</span>
        <strong>简要说明</strong>
      </div>
      <div class="ai-brief-flow-grid">
        ${steps.map((step) => `
          <article>
            <b>${escapeHtml(step.title)}</b>
            <p>${escapeHtml(step.body)}</p>
            <small>${escapeHtml(step.output)}</small>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderDeepSeekUserDataPanel(run, modelAnalysis) {
  const input = deepSeekRunInputSnapshot(run);
  const fullUserData = input.fullUserData || modelAnalysis?.rawModelJson?.userData || null;
  const evidence = modelAnalysis?.evidenceSummary || input.modelEvidenceSummary || [];
  const highlights = modelAnalysis?.userDataHighlights || input.modelUserDataHighlights || [];
  const displayedPolicy = run?.inputSnapshot?.displayedInternalDataPolicy || '展示该客户 DS 目标库可用字段、标题值和源 payload；系统密钥、密码、token、凭据除外。';
  return `
    <section class="ai-model-data-panel">
      <div class="ai-brief-flow-head">
        <span>用户数据库数据</span>
        <strong>模型输入与证据</strong>
      </div>
      <div class="ai-model-data-grid">
        <article>
          <h4>展示规则</h4>
          <p>${escapeHtml(displayedPolicy)}</p>
        </article>
        <article>
          <h4>证据摘要</h4>
          <ol>${renderAiReasonList(evidence.length ? evidence : ['DeepSeek 未返回独立证据摘要，详见下方完整用户数据。'])}</ol>
        </article>
        <article>
          <h4>用户数据重点</h4>
          <ol>${renderAiReasonList(highlights.length ? highlights : ['详见完整客户字段与 230 项标题值。'])}</ol>
        </article>
      </div>
      ${renderAiJsonBlock('完整用户数据快照', fullUserData || input)}
      ${modelAnalysis?.rawModelJson ? renderAiJsonBlock('DeepSeek 原始 JSON 结果', modelAnalysis.rawModelJson) : ''}
    </section>
  `;
}

function renderDeepSeekAiInsightMirror(run) {
  const identity = run.customerIdentity || {};
  const branches = run.branchOutputs || {};
  const input = deepSeekRunInputSnapshot(run);
  const evidence = branches.evidenceReadiness || {};
  const profile = branches.consumerProfile || {};
  const projectCycle = branches.projectCycleRepurchase || input.projectCycleRepurchase || {};
  const coreDriver = branches.coreMotivationDriver || {};
  const psychology = branches.psychologyModel || {};
  const lifecycle = branches.lifecycleDiagnosis || {};
  const scoring = branches.opportunityScoring || {};
  const content = branches.contentStrategy || {};
  const evaluation = branches.trainingEvaluation || {};
  const synthesis = branches.synthesis || {};
  const modelAnalysis = run.modelAnalysis || {};
  const finalModel = deepSeekFinalModel(run);
  const driverAnalysis = coreDriver.driverAnalysis || finalModel.coreDriverSummary || {};
  const demandClassification = finalModel.demandClassification || input.demandClassification || profile.demandClassification || fallbackDemandClassification(input);
  const lifecycleClassification = finalModel.lifecycleClassification || input.lifecycleClassification || lifecycle.lifecycleClassification || fallbackLifecycleClassification(input, demandClassification);
  const classificationDominancePolicy = finalModel.classificationDominancePolicy
    || synthesis.classificationDominancePolicy
    || lifecycle.classificationDominancePolicy
    || modelAnalysis.classificationDominancePolicy
    || fallbackClassificationDominancePolicy(demandClassification, lifecycleClassification);
  const verdict = evaluation.verdict || (run.runMeta?.validation?.valid ? 'pass_with_warnings' : 'needs_fix');
  const warningText = [
    ...(evaluation.warnings || []),
    ...(evaluation.issues || []),
  ].join('；') || '源 H5 草稿按钮仍偏预约/顾问动作口径，训练包已改为信息型详情入口，需同步 H5 内容 Agent。';
  const concernLabels = (psychology.concernTags || finalModel.psychologySummary?.concernTags || []).map((item) => item.label || item.tag || item);
  const barrierLabels = (psychology.behaviorBarriers || finalModel.psychologySummary?.behaviorBarriers || []).map((item) => item.label || item.tag || item);
  const scoreBreakdown = scoring.scoreBreakdown || {};
  const sampleId = `deepseek_${identity.customerCode || run.runMeta?.customerCode || 'customer'}`;
  const riskLevel = finalModel.riskAndReadiness?.riskLevel || run.inputSnapshot?.reviewFacts?.riskGate?.level || input.riskLevel;
  const opportunityScore = finalModel.opportunity?.score ?? scoring.opportunityScore ?? run.inputSnapshot?.draftArchiveSnapshot?.opportunityScore;
  const readiness = finalModel.riskAndReadiness?.dataReadinessScore ?? evidence.dataReadinessScore ?? input.dataReadinessScore;
  const truthValueCount = input.truthValueCount ?? evidence.truthValueCount;
  const requirementCount = input.requirementCount ?? evidence.requirementCount;
  const maintenanceCount = input.maintenanceCount12m;
  const overdueDays = input.overdueDays ?? input.daysSinceLastMaintenance;
  const customerId = identity.unifiedCustomerId || finalModel.customerId || '';
  const shortProfile = finalModel.shortProfile || profile.privateAiProfile || deepSeekGeneratedText(run, 'consumerProfile');
  const lifecycleState = lifecycle.lifecycleState || finalModel.lifecycleState || input.lifecycleState || {};
  const opportunityReason = scoring.priorityReason || finalModel.opportunity?.reason || '';
  const taskCardInput = synthesis.taskCardInput || {};

  return `
    <div class="ai-detail-head">
      <div>
        <span>样本 ${escapeHtml(sampleId)}</span>
        <h3>${escapeHtml(customerId)}</h3>
        <p>${escapeHtml(shortProfile)}</p>
      </div>
      <div class="ai-detail-badges">
        <span class="status-chip ${aiVerdictClass(verdict)}">${escapeHtml(aiVerdictLabel(verdict))}</span>
        <span class="status-chip ${riskLevelClass(riskLevel)}">${escapeHtml(riskLevelLabel(riskLevel))}</span>
        <span class="status-chip is-indexed">机会 ${formatNumber(opportunityScore)}</span>
      </div>
    </div>
    <div class="ai-detail-metrics">
      <article><span>诉求类型</span><strong>${escapeHtml(demandClassification.primaryTypeLabel || '待判别')}</strong></article>
      <article><span>阶段类型</span><strong>${escapeHtml(lifecycleClassification.primaryStage?.label || lifecycleState.label || '待判别')}</strong></article>
      <article><span>真值</span><strong>${deepSeekNumberLabel(truthValueCount)}/${deepSeekNumberLabel(requirementCount)}</strong></article>
      <article><span>维养次数</span><strong>${deepSeekNumberLabel(maintenanceCount)}</strong></article>
      <article><span>超期</span><strong>${deepSeekNumberLabel(overdueDays, ' 天')}</strong></article>
      <article><span>准备度</span><strong>${percentLabel(readiness)}</strong></article>
    </div>
    <div class="ai-warning-strip">
      <strong>评测提示</strong>
      <span>${escapeHtml(warningText)}</span>
    </div>
    <div class="ai-audit-contract">
      <article>
        <span>分类主轴</span>
        <strong>${escapeHtml(demandClassification.primaryTypeLabel || '诉求待判别')} × ${escapeHtml(lifecycleClassification.primaryStage?.label || lifecycleState.label || '阶段待判别')}</strong>
        <p>${escapeHtml(classificationDominancePolicy.rule || '依据 step2.docx：先判诉求类型和生命周期阶段，RFM 只作为消费属性辅助。')}</p>
      </article>
    </div>
    ${renderDeepSeekBriefConclusionFlow({ input, profile, finalModel, driverAnalysis, lifecycleState, scoring, opportunityScore, riskLevel, taskCardInput, modelAnalysis })}
    ${renderDeepSeekUserDataPanel(run, modelAnalysis)}
    <div class="ai-conclusion-grid">
      ${renderDeepSeekBusinessCategoryCard({
        title: '个人 AI 画像与消费模型',
        badge: finalModel.consumptionModel?.maintenanceBand || profile.consumptionModel?.maintenanceBand || '',
        conclusion: shortProfile,
        reasons: [
          `诉求类型：${demandClassification.primaryTypeLabel || '待判别'}`,
          `阶段类型：${lifecycleClassification.primaryStage?.label || lifecycleState.label || '待判别'}`,
          `分类优先：${classificationDominancePolicy.rule || '冲突或重叠时以分类结果为主'}`,
          ...(profile.knownSignals || []),
          `消费模型：${labelFromEntries(finalModel.consumptionModel || profile.consumptionModel || {})}`,
          `不确定性：${(profile.uncertainty || []).join('、') || '暂无'}`
        ],
      })}
      ${projectCycle.branchAgentId ? renderDeepSeekBusinessCategoryCard({
        title: '项目复购周期与稳固判断',
        badge: projectCycle.recommendation?.statusLabel || projectCycle.cycleStatus?.repurchaseStatusLabel || '',
        conclusion: projectCycle.recommendation?.summary || '',
        reasons: [
          `标准项目：${projectCycle.matchedProjectStandard?.standardProjectName || '待补'}`,
          `复购周期：${projectCycle.matchedProjectStandard?.repurchaseCycleRaw || '待补'} 月`,
          `恢复期：${projectCycle.matchedProjectStandard?.recoveryDaysRaw || '待补'} 天`,
          `稳固次数：${projectCycle.matchedProjectStandard?.stableTimesRaw || '待补'} 次`,
          `复购判断：${projectCycle.cycleStatus?.repurchaseStatusLabel || '待补'}；距上次 ${deepSeekNumberLabel(projectCycle.cycleStatus?.daysSinceLastTreatment, ' 天')}`,
          `恢复期判断：${projectCycle.cycleStatus?.recoveryStatusLabel || '待补'}`,
          `稳固判断：${projectCycle.cycleStatus?.stabilizationStatusLabel || '待补'}`,
          `顾问侧用法：${projectCycle.recommendation?.advisorUse || '待顾问复核'}`
        ],
      }) : ''}
      ${renderDeepSeekBusinessCategoryCard({
        title: '核心驱动因素',
        badge: driverAnalysis.primaryDriverScore != null ? `${formatNumber(driverAnalysis.primaryDriverScore)} 分` : '',
        conclusion: `${driverAnalysis.primaryDriverLabel || '待补主驱动'}为主；${driverAnalysis.secondaryDriverLabel || '待补次驱动'}为辅。`,
        reasons: [
          `分类主轴：${classificationDominancePolicy.primaryAnchor || `${demandClassification.primaryTypeLabel || '待判别'} × ${lifecycleClassification.primaryStage?.label || '待判别'}`}`,
          `分类优先：${classificationDominancePolicy.rule || '冲突或重叠时以分类结果为主'}`,
          driverAnalysis.modelSuggestedPrimaryDriverLabel ? `模型原建议驱动（辅助）：${driverAnalysis.modelSuggestedPrimaryDriverLabel}` : '',
          coreDriver.advisorBrief?.whatSheCaresAbout ? `她最在意什么：${coreDriver.advisorBrief.whatSheCaresAbout}` : '',
          coreDriver.advisorBrief?.whySheHasNotReturned ? `为什么没回来：${coreDriver.advisorBrief.whySheHasNotReturned}` : '',
          coreDriver.advisorBrief?.whatToSay ? `该怎么沟通：${coreDriver.advisorBrief.whatToSay}` : '',
          `判断可靠性：置信度 ${driverAnalysis.driverConfidence != null ? percentLabel(driverAnalysis.driverConfidence) : '待补'}，证据等级 ${driverAnalysis.evidenceLevel || '待补'}`,
        ],
      })}
      ${renderDeepSeekBusinessCategoryCard({
        title: '消费心理与行为阻碍',
        badge: psychology.internalOnly || finalModel.psychologySummary?.internalOnly ? '内部可见' : '',
        conclusion: `${concernLabels.join('、') || '待补关注点'}；${barrierLabels.join('、') || '待补阻碍'}`,
        reasons: [
          `分类主轴：${classificationDominancePolicy.primaryAnchor || `${demandClassification.primaryTypeLabel || '待判别'} × ${lifecycleClassification.primaryStage?.label || '待判别'}`}`,
          ...(psychology.concernTags || []).map((item) => `${item.label || item.tag}：${item.communicationDirection || (item.evidence || []).join('、')}`),
          ...(psychology.behaviorBarriers || []).map((item) => `${item.label || item.tag}：${item.intervention || (item.evidence || []).join('、')}`),
          `对客禁止展示：${(psychology.forbiddenForCustomer || []).join('、') || '心理偏差标签、内部置信度'}`
        ],
      })}
      ${renderDeepSeekBusinessCategoryCard({
        title: '生命周期诊断',
        badge: lifecycleClassification.primaryStage?.label || lifecycleState.label || '',
        conclusion: lifecycle.interactionObjective || lifecycleState.objective || input.interactionObjective || '',
        reasons: [
          `诉求类型：${demandClassification.primaryTypeLabel || '待判别'}`,
          `阶段定义：${lifecycleClassification.primaryStage?.definition || '待补'}`,
          `阶段目标：${lifecycleClassification.primaryStage?.businessGoal || lifecycleState.objective || '待补'}`,
          ...(lifecycleClassification.evidence || []),
          ...(lifecycleClassification.conflicts || []).map((item) => `冲突/缺失：${item}`),
          lifecycle.whyNow,
          lifecycle.journeyStop,
          `下一步动作：${lifecycle.nextBestAction || ''}`,
          `顾问确认：${lifecycleClassification.advisorConfirmationRequired ? '需要' : '暂不需要'}`,
          `消息角度：${(lifecycleState.messageAngles || []).join('、')}`
        ],
      })}
      ${renderDeepSeekBusinessCategoryCard({
        title: '机会评分',
        badge: opportunityScore != null ? `${formatNumber(opportunityScore)} 分` : '',
        conclusion: `${scoring.priorityLevel || finalModel.opportunity?.priority || input.opportunityPriority || ''}｜${opportunityReason}`,
        reasons: [
          `分类主轴：${classificationDominancePolicy.primaryAnchor || `${demandClassification.primaryTypeLabel || '待判别'} × ${lifecycleClassification.primaryStage?.label || '待判别'}`}`,
          `分类优先：${classificationDominancePolicy.rule || '冲突或重叠时以分类结果为主'}`,
          `超期紧迫度：${formatNumber(scoreBreakdown.overdueUrgency)}`,
          `响应概率：${formatNumber(scoreBreakdown.responseProbability)}`,
          `价值潜力：${formatNumber(scoreBreakdown.valuePotential)}`,
          `静默风险：${formatNumber(scoreBreakdown.silentRisk)}`,
          `关系强度：${formatNumber(scoreBreakdown.relationshipStrength)}`,
          `学习价值：${formatNumber(scoreBreakdown.learningValue)}`
        ],
      })}
      ${renderDeepSeekBusinessCategoryCard({
        title: '机会评分细项',
        badge: scoring.priorityLevel || finalModel.opportunity?.priority || input.opportunityPriority || '',
        conclusion: '权重仍需由真实预约、到店和转化反馈继续校准',
        reasons: Object.entries(scoreBreakdown).map(([key, value]) => `${key}：${formatNumber(value)}`),
      })}
      ${renderDeepSeekBusinessCategoryCard({
        title: '内容策略与 AIDA',
        badge: content.messageAngle || '',
        conclusion: content.advisorScriptBrief || deepSeekGeneratedText(run, 'contentStrategy') || '',
        reasons: [
          `分类主轴：${classificationDominancePolicy.primaryAnchor || `${demandClassification.primaryTypeLabel || '待判别'} × ${lifecycleClassification.primaryStage?.label || '待判别'}`}`,
          `分类优先：${classificationDominancePolicy.rule || '冲突或重叠时以分类结果为主'}`,
          content.modelSuggestedMessageAngle ? `模型原沟通角度（辅助）：${content.modelSuggestedMessageAngle}` : '',
          `Attention：${content.aidaStrategy?.attention || ''}`,
          `Interest：${content.aidaStrategy?.interest || ''}`,
          `Desire：${content.aidaStrategy?.desire || ''}`,
          `Action：${content.aidaStrategy?.action || ''}`,
          `禁用表达：${(content.forbiddenClaims || []).join('、') || '疗效承诺、强销售、自动预约'}`
        ],
      })}
      ${renderDeepSeekBusinessCategoryCard({
        title: '最终汇总合成',
        badge: taskCardInput.reviewLane || '',
        conclusion: taskCardInput.advisorFocus || finalModel.shortProfile || deepSeekGeneratedText(run, 'synthesis') || '',
        reasons: [
          `诉求类型：${taskCardInput.demandType || demandClassification.primaryTypeLabel || '待判别'}`,
          `生命周期阶段：${taskCardInput.lifecycleStage || lifecycleClassification.primaryStage?.label || '待判别'}`,
          `分类优先：${taskCardInput.classificationDominancePolicy || classificationDominancePolicy.rule || '冲突或重叠时以分类结果为主'}`,
          `为什么现在：${taskCardInput.whyNow || lifecycle.whyNow || ''}`,
          `互动目标：${taskCardInput.interactionObjective || lifecycle.interactionObjective || ''}`,
          `证据摘要：${(taskCardInput.evidenceSummary || profile.knownSignals || []).join('、')}`,
          `合并策略：${(synthesis.mergePolicy || []).join('；') || '十个分支结果合成为顾问审核输入'}`
        ],
      })}
      ${renderDeepSeekBusinessCategoryCard({
        title: '训练评测',
        badge: aiVerdictLabel(verdict),
        conclusion: `通过 ${formatNumber(evaluation.projectBookValidation?.passCount)} 项，警告 ${formatNumber(evaluation.projectBookValidation?.warningCount)} 项，问题 ${formatNumber(evaluation.projectBookValidation?.issueCount)} 项。`,
        reasons: (evaluation.projectBookValidation?.checks || []).map((check) => `${check.label}：${check.status}｜${check.note}`),
      })}
      ${renderDeepSeekBusinessCategoryCard({
        title: '数据库原数据',
        badge: '完整快照',
        conclusion: '展示本地检查台已沉淀的客户字段、230 项标题值、源 payload 与 DeepSeek 输入快照；仅系统密钥、密码、token、凭据脱敏。',
        reasons: [
          input.sourceBoundaries || '使用 analysis-db 中该客户可用字段、标题值和源 payload。',
          `模型：${modelAnalysis.model || run.runMeta?.modelName || 'DeepSeek'}`,
          `证据摘要：${(modelAnalysis.evidenceSummary || input.modelEvidenceSummary || []).join('、') || '见完整用户数据快照'}`
        ],
      })}
    </div>
  `;
}

function renderDeepSeekRunDetail() {
  const target = $('#deepseek-results-detail');
  if (!target) return;
  if (!state.latestLifecycleAgentRun) {
    target.innerHTML = '<div class="empty">请选择或读取一个 DeepSeek 生成结果。</div>';
    return;
  }
  target.innerHTML = renderDeepSeekAiInsightMirror(state.latestLifecycleAgentRun);
}

function deepSeekDraftSnapshot(run) {
  return run?.inputSnapshot?.draftArchiveSnapshot
    || run?.inputSnapshot?.reviewFacts
    || deepSeekRunInputSnapshot(run)
    || {};
}

function normalizeRiskValue(value) {
  if (value === '绿灯') return 'green';
  if (value === '黄灯') return 'yellow';
  if (value === '红灯') return 'red';
  return value || '';
}

function h5ReviewGateLabel(run) {
  const snapshot = deepSeekDraftSnapshot(run);
  const gate = run?.riskComplianceGate || {};
  const h5 = run?.h5Payload || {};
  const status = snapshot.reviewGateStatus || gate.gateStatus || h5.status || '';
  if (status === 'ready_for_h5_manual_publish_review') return '可发布复核';
  if (status === 'blocked_until_product_copy_review') return '待话术复核';
  if (status === 'blocked_until_message_variant_selected') return '待版本确认';
  if (status === 'blocked_until_advisor_review') return '待顾问审核';
  if (run?.advisorTaskCard?.reviewStatus === 'pending_advisor_review') return '待顾问审核';
  return snapshot.publishLane || status || '顾问人工审核';
}

function renderDeepSeekReviewMetric(label, value, note = '') {
  return `
    <article class="ds-h5-metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${note ? `<em>${escapeHtml(note)}</em>` : ''}
    </article>
  `;
}

function renderDeepSeekReviewList(items, className = 'ds-h5-list') {
  const rows = (items || []).filter(Boolean);
  if (!rows.length) return `<ul class="${className}"><li>待 DeepSeek 补全</li></ul>`;
  return `<ul class="${className}">${rows.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderDeepSeekReviewAnchorList(items) {
  const rows = (items || []).filter(Boolean);
  if (!rows.length) return renderDeepSeekReviewList(['最近项目、维护间隔、维养次数、结构化真值与门禁状态作为顾问核查锚点。']);
  return `<ul class="ds-h5-list">${rows.map((item) => `
    <li>
      <strong>${escapeHtml(item.label || item.key || '')}</strong>
      ${escapeHtml(item.value || '')}
      ${item.usage ? `<span>${escapeHtml(item.usage)}</span>` : ''}
    </li>
  `).join('')}</ul>`;
}

function deepSeekReviewScoreRows(run) {
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
  const breakdown = run?.branchOutputs?.opportunityScoring?.scoreBreakdown || {};
  return Object.entries(labels).map(([key, label]) => {
    const raw = Number(breakdown[key] ?? 0);
    const weight = weights[key] || 0;
    return { key, label, raw, weight, contribution: raw * weight };
  });
}

function deepSeekH5Screens(run) {
  const taskCard = deepSeekH5ReviewTaskCard(run);
  const taskScreens = taskCard?.h5Preview?.screens || [];
  if (taskScreens.length) return taskScreens;
  const screens = run?.h5Payload?.screens || [];
  if (screens.length) return screens;
  return [
    {
      step: '01 / 03',
      title: '这次提醒，和你的维养节奏有关',
      body: '距离上次护理已有一段时间，当前更适合先观察皮肤稳定度和节奏变化。',
      auditRationale: '用最近护理和间隔变长解释触达时机，不展示内部评分。',
    },
    {
      step: '02 / 03',
      title: '先看状态，再决定节奏',
      body: '观察皮肤微妙信号，是制定轻维护策略的第一步。',
      auditRationale: '把行动目标降为状态观察和维护认知，不要求客户立刻定项目。',
    },
    {
      step: '03 / 03',
      title: '你可以先看看这些细节',
      body: '以下内容用于帮助你理解当前维养节奏，不代表必须立刻安排项目。',
      auditRationale: '信息入口可作为 H5 点击事件和兴趣方向回流。',
    },
  ];
}

function renderDeepSeekH5Phone(run) {
  const snapshot = deepSeekDraftSnapshot(run);
  const taskCard = deepSeekH5ReviewTaskCard(run);
  const screens = deepSeekH5Screens(run);
  const first = screens[0] || {};
  const plan = taskCard.planAndConsumption || {};
  const project = treatmentShortName(plan.recentProject || snapshot.lastMaintenanceProject || first.primaryFact || '');
  return `
    <div class="ds-h5-phone">
      <div class="ds-h5-phone-top">
        <span><img class="ds-h5-logo" src="./assets/demo-wordmark.svg" alt="DEMO" /></span>
        <b>${escapeHtml(first.step || 'STEP 01 / 03')}</b>
      </div>
      <h3>${escapeHtml(first.title || '这次提醒，和你的维养节奏有关')}</h3>
      <p>${escapeHtml(first.body || first.subtitle || '')}</p>
      <div class="ds-h5-phone-visual">⌁</div>
      <div class="ds-h5-phone-facts">
        <article><span>最近一次护理</span><strong>${escapeHtml(project || '近期护理记录')}</strong></article>
        <article><span>类型阶段</span><strong>${escapeHtml(taskCard.classification?.classificationAnchor || '待确认')}</strong></article>
        <article><span>本次目的</span><strong>${escapeHtml(taskCard.interactionGoal?.objective || '顾问核对')}</strong></article>
      </div>
      <div class="ds-h5-phone-notice">${escapeHtml(first.notice || taskCard.advisorSendScript?.sendBoundary || '本次只做状态观察，不直接推荐复杂项目。')}</div>
      <button type="button">${escapeHtml(first.detailEntry || '查看为什么现在值得关注')} →</button>
      <small>由顾问为您整理 · </small>
      <div class="ds-h5-phone-tabs">
        ${screens.map((screen, index) => `<span class="${index === 0 ? 'is-active' : ''}">${String(index + 1).padStart(2, '0')}</span>`).join('')}
      </div>
    </div>
  `;
}

function renderDeepSeekH5ReviewMirror(run) {
  const identity = run.customerIdentity || {};
  const snapshot = deepSeekDraftSnapshot(run);
  const finalModel = deepSeekFinalModel(run);
  const card = run.advisorTaskCard || {};
  const h5 = run.h5Payload || {};
  const taskCard = deepSeekH5ReviewTaskCard(run);
  const plan = taskCard.planAndConsumption || {};
  const hook = taskCard.commercialHook || {};
  const classification = taskCard.classification || {};
  const angles = safeArray(taskCard.communicationAngles).slice(0, 3);
  const sendScript = taskCard.advisorSendScript || {};
  const feedback = taskCard.advisorFeedback || {};
  const customerId = identity.unifiedCustomerId || finalModel.customerId || '';
  const customerCode = identity.customerCode || run.runMeta?.customerCode || 'C--';
  const risk = normalizeRiskValue(snapshot.riskLevel || finalModel.riskAndReadiness?.riskLevel);
  const readiness = snapshot.dataReadinessScore ?? finalModel.riskAndReadiness?.dataReadinessScore;
  const screens = deepSeekH5Screens(run);
  const allowed = [
    '上次治疗事实',
    '医生复诊建议',
    '近期肤况确认',
    '防晒保湿提醒',
    '由顾问协助整理给医生',
  ];
  const forbidden = [
    'RFM',
    '机会分',
    '风险灯',
    '流失期',
    '内部分类置信度',
    '消费金额',
    '心理标签',
    '自动发送',
  ];
  const summaryCards = [
    ['任务卡', 'DS H5', '顾问审核'],
    ['诉求类型', classification.demandType || '待判别', '来自 step2'],
    ['当前阶段', classification.lifecycleStage || '待判别', '生命周期'],
    ['沟通角度', angles.length || 0, '三选一'],
    ['H5 预览', screens.length || 0, '私人简报'],
    ['合规约束', '可展示/不可展示', '顾问协助整理'],
  ];
  const actionLabels = safeArray(feedback.allowedActions).length
    ? safeArray(feedback.allowedActions)
    : ['采纳', '重新生成', '反馈不采纳原因', '标记暂缓/勿扰'];
  const basicMetrics = [
    ['客户 ID', customerId || taskCard.basicInfo?.maskedCustomerId || '待补', customerCode],
    ['诉求类型', classification.demandType || '待判别', '分类主轴'],
    ['当前阶段', classification.lifecycleStage || '待判别', '分类主轴'],
    ['方案/项目', plan.proposedOrTakenPlan || '待顾问确认', plan.doctorOrPatientPlanSource || ''],
    ['消费摘要', plan.consumptionFeatureSummary || '待补', '消费历史'],
    ['最近项目', plan.recentProject || snapshot.lastMaintenanceProject || '待补', `${plan.overdueDays || snapshot.overdueDays || '待补'} 天超期`],
  ];

  return `
    <div class="ds-h5-review-mirror">
      <div class="ds-h5-review-title">
        <div>
          <p class="eyebrow">DS H5 REVIEW TASK CARD</p>
          <h2>顾问任务卡与 H5 审核台</h2>
        </div>
        <span class="status-chip ${card.automaticSendAllowed ? 'is-missing' : 'is-complete'}">可采纳 · 可重生成 · 不可直接改写</span>
      </div>
      <div class="ds-h5-summary-grid">
        ${summaryCards.map(([label, value, note]) => `
          <article>
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
            <em>${escapeHtml(note)}</em>
          </article>
        `).join('')}
      </div>
      <div class="ds-h5-review-layout">
        <section class="ds-h5-main-card">
          <div class="ds-h5-section-title">
            <span>ADVISOR TASK CARD</span>
            <strong>DS 生成任务卡</strong>
            <b>${escapeHtml(h5ReviewGateLabel(run))}</b>
          </div>
          <section class="ds-h5-hero-card">
            <div>
              <p>${escapeHtml(customerCode)} · ${escapeHtml(classification.classificationAnchor || '诉求类型 × 生命周期阶段')} · 顾问快速核查</p>
              <h3>${escapeHtml(taskCard.personalProfileBrief || '人物画像简报待生成')}</h3>
              <span>${escapeHtml(classification.dominancePolicy || '任务卡、沟通角度和 H5 预览均以分类主轴为准。')}</span>
            </div>
            <div class="ds-h5-chip-stack">
              <span>${escapeHtml(card.reviewStatus || 'pending_advisor_review')}</span>
              <span>${escapeHtml(taskCard.basicInfo?.rfmGrade || snapshot.rfmGrade || 'RFM 待补')}</span>
              <span>顾问确认后才可进入下一步</span>
            </div>
          </section>

          <section class="ds-h5-section">
            <h4>客户基本信息与画像摘要</h4>
            <div class="ds-h5-task-metric-grid">
              ${basicMetrics.map(([label, value, note]) => renderDeepSeekReviewMetric(label, value, note)).join('')}
            </div>
          </section>

          <section class="ds-h5-section">
            <h4>进店抓手板块</h4>
            <div class="ds-h5-hook-board">
              <article class="is-primary">
                <span>抓手逻辑</span>
                <strong>${escapeHtml(hook.title || '回店抓手待生成')}</strong>
                <p>${escapeHtml(hook.entryReason || '待 DS 生成抓手理由')}</p>
              </article>
              <article><span>已购未消耗项目</span><strong>${escapeHtml(hook.unconsumedProjects || '待顾问确认')}</strong></article>
              <article><span>积分</span><strong>${escapeHtml(hook.points || '待顾问确认')}</strong></article>
              <article><span>余额</span><strong>${escapeHtml(hook.balance || '待顾问确认')}</strong></article>
              <article><span>优惠/权益</span><strong>${escapeHtml(hook.coupon || '待顾问确认')}</strong></article>
            </div>
          </section>

          <section class="ds-h5-section">
            <h4>互动目标与顾问动作</h4>
            <div class="ds-h5-goal-board">
              <article>
                <span>推荐互动目标</span>
                <strong>${escapeHtml(taskCard.interactionGoal?.objective || '待 DS 生成')}</strong>
                <p>${escapeHtml(taskCard.interactionGoal?.feedbackPrompt || '顾问确认后再进入下一步。')}</p>
              </article>
              <article>
                <span>顾问操作规则</span>
                <strong>${escapeHtml(taskCard.interactionGoal?.advisorDecisionMode || '可采纳、可反馈、可重新生成；不可直接修改')}</strong>
                <p>生成话术只读；顾问意见会作为反馈学习和重新生成输入。</p>
              </article>
              <div class="ds-h5-action-row">
                ${actionLabels.map((action) => `<button type="button">${escapeHtml(action)}</button>`).join('')}
              </div>
            </div>
          </section>

          <section class="ds-h5-section">
            <h4>推荐沟通角度 · 三选一</h4>
            <div class="ds-h5-angle-grid">
              ${angles.map((angle, index) => `
                <article class="${index === 0 ? 'is-selected' : ''}">
                  <span>${escapeHtml(`角度 ${index + 1}`)}</span>
                  <strong>${escapeHtml(angle.label || '待生成角度')}</strong>
                  <p>${escapeHtml(angle.operatingFocus || '')}</p>
                  <blockquote>${escapeHtml(angle.script || '')}</blockquote>
                  <button type="button">${index === 0 ? '已选为推荐' : '采纳此角度'}</button>
                </article>
              `).join('')}
            </div>
          </section>

          <section class="ds-h5-section">
            <h4>推荐发送话术</h4>
            <div class="ds-h5-readonly-script">
              <span>${escapeHtml(sendScript.selectedAngleLabel || angles[0]?.label || '推荐角度')}</span>
              <p>${escapeHtml(sendScript.message || angles[0]?.script || '待 DS 生成发送话术')}</p>
              <em>${escapeHtml(sendScript.sendBoundary || '只进入顾问人工审核，不自动发送给客户。')}</em>
            </div>
            <label class="ds-h5-feedback-label">
              <span>顾问反馈</span>
              <textarea aria-label="顾问反馈" placeholder="请记录：分类是否准确、抓手是否真实、是否适合发送、需要补充哪些数据。"></textarea>
            </label>
          </section>

          <section class="ds-h5-section">
            <h4>H5 预览与发送前核查</h4>
            <div class="ds-h5-map-grid">
              ${screens.map((screen) => `<article><span>${escapeHtml(screen.step || '')}</span><strong>${escapeHtml(screen.title || '')}</strong><p>${escapeHtml(screen.auditRationale || screen.subtitle || screen.body || '')}</p></article>`).join('')}
            </div>
          </section>

          <section class="ds-h5-section">
            <h4>H5 可展示 / 不得展示给顾客</h4>
            <div class="ds-h5-boundary-grid">
              <article><strong>H5 可展示</strong>${renderDeepSeekReviewList(allowed)}</article>
              <article class="is-danger"><strong>不得展示给顾客</strong>${renderDeepSeekReviewList(forbidden)}</article>
            </div>
          </section>
        </section>

        <aside class="ds-h5-side">
          <section class="ds-h5-side-card">
            <div class="ds-h5-section-title">
              <span>CUSTOMER VISIBLE H5</span>
              <strong>实时 H5 预览</strong>
              <b>${h5.status === 'not_published' ? '读取批量最终稿' : escapeHtml(h5.status || '内部预览')}</b>
            </div>
            ${renderDeepSeekH5Phone(run)}
          </section>
        </aside>
      </div>
    </div>
  `;
}

function renderDeepSeekH5ReviewDetail() {
  const target = $('#deepseek-h5-detail');
  if (!target) return;
  if (!state.latestLifecycleAgentRun) {
    target.innerHTML = '<div class="empty">请选择或读取一个顾问任务&H5审核对象。</div>';
    return;
  }
  target.innerHTML = renderDeepSeekH5ReviewMirror(state.latestLifecycleAgentRun);
}

async function loadDatabaseAnalysisTrainingPack() {
  if (state.databaseAnalysisTrainingPack) return;
  try {
    const pack = await api('/database_analysis_training_samples.v1.json')
      .catch(() => api('/database-analysis-training/database_analysis_training_samples.v1.json'));
    renderAiTrainingPack(pack);
  } catch (error) {
    $('#ai-insight-status').textContent = '读取失败';
    $('#ai-insight-status').className = 'status-chip is-missing';
    $('#ai-insight-detail').innerHTML = `<div class="empty">数据库分析训练样本包读取失败：${escapeHtml(error.message)}</div>`;
  }
}

async function loadDeliverableDraftArchive() {
  if (state.deliverableDraftArchive) return;
  try {
    const archive = await api('/lifecycle-system/首位客户可交付H5与任务卡_20260618/draft_archive_HIS_094fd2d2_20260618.json');
    state.deliverableDraftArchive = archive;
    renderDeliverableDraftArchive(archive);
  } catch (error) {
    const status = $('#deliverable-draft-status');
    const target = $('#deliverable-draft-archive');
    if (status) {
      status.textContent = '读取失败';
      status.className = 'status-chip is-missing';
    }
    if (target) target.innerHTML = `<div class="empty">首客交付草稿存档读取失败：${escapeHtml(error.message)}</div>`;
  }
}

async function loadLifecyclePayload(options = {}) {
  const force = Boolean(options.force);
  if (!force && state.lifecyclePayload && (IS_LIVE_ARCHIVE_MODE || state.chenSceneUserMdFixture) && state.profileStrategyCenterAnalysis) {
    renderLifecyclePayload(state.lifecyclePayload, state.chenSceneUserMdFixture, state.profileStrategyCenterAnalysis);
    return;
  }
  if (force) state.lifecyclePayload = null;
  try {
    const fixture = IS_LIVE_ARCHIVE_MODE ? null : await loadChenSceneUserMdFixture();
    let strategyCenterAnalysis = null;
    try {
      const strategyApiUrl = IS_LIVE_ARCHIVE_MODE ? '/api/profile-strategy-center/live' : `${PROFILE_STRATEGY_CENTER_API}?limit=10`;
      const strategyPayload = await api(strategyApiUrl);
      const analyses = strategyPayload.analyses || (strategyPayload.analysis ? [strategyPayload.analysis] : []);
      state.profileStrategyMethodology = strategyPayload.methodology || state.profileStrategyMethodology;
      state.profileStrategyMethodologyHistory = strategyPayload.history || state.profileStrategyMethodologyHistory;
      state.strategyRefreshGate = strategyPayload.strategyRefreshGate || state.strategyRefreshGate;
      if (!IS_LIVE_ARCHIVE_MODE) await loadProfileStrategyEvolutionCandidates();
      state.profileStrategyCenterAnalyses = analyses;
      if (IS_LIVE_ARCHIVE_MODE && !analyses.length) {
        // 实盘模式下没有真实 B1 画像结果时，绝不落回陈喜生样板叙事，直接展示空态。
        renderProfileStrategyMethodologyRoots(normalizeProfileStrategyMethodologyForUi(state.profileStrategyMethodology || {}));
        $('#ai-insight-status').textContent = '实盘暂无画像';
        $('#ai-insight-status').className = 'status-chip is-pending';
        $('#ai-insight-summary').innerHTML = '';
        $('#ai-insight-customer-list').innerHTML = '';
        $('#ai-insight-detail').innerHTML = '<div class="empty">当前实盘客户池尚无真实 B1 画像结果。请先在「用户全景档案（Agent 实盘）」页面抽取客户，并在实盘链路中触发画像分析。</div>';
        return;
      }
      const selectedCaseId = state.profileStrategyCenterSelectedCaseId;
      strategyCenterAnalysis = analyses.find((item) => item.sampleId === selectedCaseId) || analyses[0] || null;
      state.profileStrategyCenterAnalysis = strategyCenterAnalysis;
      state.profileStrategyCenterSelectedCaseId = strategyCenterAnalysis?.sampleId || null;
    } catch (strategyError) {
      console.warn('profile strategy center table fallback', strategyError);
      state.profileStrategyCenterAnalysis = null;
      state.profileStrategyCenterAnalyses = [];
    }
    const payload = {
      meta: {
        scope: fixture?.customer?.sceneName || (IS_LIVE_ARCHIVE_MODE ? '用户画像分析（Agent 实盘）' : '用户全景档案核验'),
        nonVipGate: 'RFM 非 A 作为非 VIP 前置筛选；本页只写本地策略中心调试表。',
        dataBoundary: '病例、医生诊断、皮肤检测报告优先；不足时输出不确定，需要顾问确认。',
      },
    };
    renderLifecyclePayload(payload, fixture, strategyCenterAnalysis);
  } catch (error) {
    const methodologyErrorHtml = `<div class="empty">生命周期方法论读取失败：${escapeHtml(error.message)}</div>`;
    $$('.profile-strategy-methodology-root').forEach((root) => {
      root.innerHTML = methodologyErrorHtml;
    });
    $('#ai-insight-detail').innerHTML = `<div class="empty">${IS_LIVE_ARCHIVE_MODE ? '实盘画像策略中心读取失败' : '样板生命周期分析读取失败'}：${escapeHtml(error.message)}</div>`;
  }
}

async function loadProfileStrategyEvolutionCandidates() {
  try {
    state.profileStrategyEvolutionCandidates = await api(PROFILE_STRATEGY_EVOLUTION_API);
  } catch (error) {
    console.warn('profile strategy evolution fallback', error);
    state.profileStrategyEvolutionCandidates = state.profileStrategyEvolutionCandidates || null;
  }
}

async function submitProfileStrategyEvolutionCandidateAction(action, candidateId) {
  if (!candidateId) return;
  try {
    await api(PROFILE_STRATEGY_EVOLUTION_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, candidateId, actor: 'profile_strategy_methodology_panel' }),
    });
    await loadProfileStrategyEvolutionCandidates();
    renderProfileStrategyMethodologyRoots(state.profileStrategyMethodology || {});
  } catch (error) {
    alert(`P5 候选处理失败：${error.message}`);
  }
}

async function loadProfileStrategyMethodologyOnly({ force = false } = {}) {
  if (state.profileStrategyMethodology && !force) {
    renderProfileStrategyMethodologyRoots(state.profileStrategyMethodology);
    return;
  }
  try {
    const [payload] = await Promise.all([
      api(PROFILE_STRATEGY_METHODOLOGY_API),
      loadProfileStrategyEvolutionCandidates(),
    ]);
    state.profileStrategyMethodology = payload.methodology || {};
    state.profileStrategyMethodologyHistory = payload.history || null;
    state.strategyRefreshGate = payload.strategyRefreshGate || null;
  } catch (error) {
    console.warn('profile methodology standalone fallback', error);
    state.profileStrategyMethodology = state.profileStrategyMethodology || {};
  }
  renderProfileStrategyMethodologyRoots(state.profileStrategyMethodology);
}

function initDsExtractionCheckState() {
  state.dsExtractionCheck = {
    runId: null,
    status: 'idle',
    total: 0,
    completed: 0,
    phaseId: 'build_database',
    activeApiBase: DS_EXTRACTION_PRIMARY_API,
    counts: { success: 0, failed: 0, needsReview: 0 },
    events: [{
      eventName: 'ui_ready',
      message: '空状态：等待从新空库建表，并从原始源拉取全量场景一客户做 DS 抽取校验。',
      at: new Date().toISOString(),
    }],
    customers: new Map(),
    audits: new Map(),
  };
  state.selectedDsExtractionCustomerCode = null;
  renderDsExtractionCheck();
}

function renderDsSourceConnectionStatus() {
  const target = $('#ds-source-connect-status');
  if (!target) return;
  const payload = state.dsSourceConnection;
  const hasExistingRun = Boolean(state.dsExtractionCheck?.runId || state.dsExtractionCheck?.customers?.size);
  if (!payload) {
    target.className = hasExistingRun ? 'run-status is-warning' : 'run-status empty is-warning';
    target.textContent = hasExistingRun
      ? '源库连接未检测：当前页面已载入本地 DS 抽取结果；如需重新从 HIS、企微/CRM、analysis-db 拉源，再点击“连接源库”检查。'
      : '源库连接未检测：点击“连接源库”可先检查 HIS、企微/CRM、analysis-db 三个只读源。';
    return;
  }
  const checks = payload.checks || [];
  const counts = payload.statusCounts || {};
  const hasUnconfigured = Number(counts.unconfigured || 0) > 0 || checks.some((item) => item.status === 'unconfigured');
  const hasFailed = Number(counts.failed || 0) > 0 || checks.some((item) => item.status === 'failed' || (!item.ok && item.status !== 'unconfigured'));
  const pieces = checks.map((item) => {
    const label = item.status === 'unconfigured' ? '未配置' : item.ok ? '通过' : '失败';
    const latency = item.latencyMs !== undefined ? ` ${item.latencyMs}ms` : '';
    return `${item.label || '源库'}=${label}${latency}`;
  });
  const toneClass = payload.ok ? 'is-ok' : (hasUnconfigured || hasExistingRun ? 'is-warning' : hasFailed ? 'is-error' : 'is-warning');
  target.className = `run-status ${toneClass}${!payload.ok && !hasExistingRun ? ' empty' : ''}`;
  target.textContent = `${payload.message || '源库连接检测完成'}${pieces.length ? ` · ${pieces.join(' · ')}` : ''}${!payload.ok && hasExistingRun ? ' · 当前仅影响重新启动全量抽取，不影响已落本地目标库的既有结果浏览。' : ''}`;
}

function dsExtractionCustomerCodeFromItem(item = {}) {
  if (item.customerCode) return item.customerCode;
  const index = item.itemIndex || item.rankNo || item.item_index || item.rank_no;
  if (index) return `DS${String(index).padStart(2, '0')}`;
  return item.unifiedCustomerId || item.customerId || 'DS??';
}

function getDsExtractionCustomer(customerCode, seed = {}) {
  if (!state.dsExtractionCheck) initDsExtractionCheckState();
  const key = customerCode || dsExtractionCustomerCodeFromItem(seed);
  if (!state.dsExtractionCheck.customers.has(key)) {
    state.dsExtractionCheck.customers.set(key, {
      customerCode: key,
      status: seed.status || seed.dsStatus || 'running',
      index: state.dsExtractionCheck.customers.size + 1,
      unifiedCustomerId: seed.unifiedCustomerId || seed.customerId || '',
      sourceCustomerId: seed.sourceCustomerId || '',
      customerNameMasked: seed.customerNameMasked || '',
      customerNameFull: seed.customerNameFull || '',
      advisorName: seed.advisorName || '',
      advisorSourceUserId: seed.advisorSourceUserId || '',
      advisorWecomMemberUserid: seed.advisorWecomMemberUserid || '',
      customerExternalUseridCandidate: seed.customerExternalUseridCandidate || '',
      customerExternalUseridHash: seed.customerExternalUseridHash || '',
      customerWechatUseridCandidate: seed.customerWechatUseridCandidate || '',
      advisorWecomConfidence: seed.advisorWecomConfidence || '',
      advisorWecomMatchStrategy: seed.advisorWecomMatchStrategy || '',
      primaryClinicName: seed.primaryClinicName || '',
      primaryDoctorName: seed.primaryDoctorName || '',
      healthManagerName: seed.healthManagerName || '',
      memberLevel: seed.memberLevel || '',
      sourceChannel: seed.sourceChannel || '',
      firstVisitDate: seed.firstVisitDate || '',
      lastVisitDate: seed.lastVisitDate || '',
      skinMaintenanceCount12m: seed.skinMaintenanceCount12m ?? '',
      lastSkinMaintenanceDate: seed.lastSkinMaintenanceDate || '',
      overdueMaintenanceDays: seed.overdueMaintenanceDays ?? '',
      rfmGrade: seed.rfmGrade || '',
      truthValueCount: seed.truthValueCount || 0,
      pendingValueCount: seed.pendingValueCount || 0,
      extractionResult: seed.extractionResult || null,
      validationResult: seed.validationResult || null,
      findings: seed.findings || seed.validationResult?.findings || [],
      truthRepairDraft: seed.truthRepairDraft || null,
      truthRepairTrace: seed.truthRepairTrace || [],
      truthRepairLoading: false,
    });
  }
  const customer = state.dsExtractionCheck.customers.get(key);
  customer.status = seed.status || seed.dsStatus || customer.status;
  customer.index = seed.itemIndex || seed.rankNo || seed.index || customer.index;
  customer.unifiedCustomerId = seed.unifiedCustomerId || seed.customerId || customer.unifiedCustomerId;
  customer.sourceCustomerId = seed.sourceCustomerId || customer.sourceCustomerId;
  customer.customerNameMasked = seed.customerNameMasked || customer.customerNameMasked;
  customer.customerNameFull = seed.customerNameFull || customer.customerNameFull;
  customer.advisorName = seed.advisorName || customer.advisorName;
  customer.advisorSourceUserId = seed.advisorSourceUserId || customer.advisorSourceUserId;
  customer.advisorWecomMemberUserid = seed.advisorWecomMemberUserid || customer.advisorWecomMemberUserid;
  customer.customerExternalUseridCandidate = seed.customerExternalUseridCandidate || customer.customerExternalUseridCandidate;
  customer.customerExternalUseridHash = seed.customerExternalUseridHash || customer.customerExternalUseridHash;
  customer.customerWechatUseridCandidate = seed.customerWechatUseridCandidate || customer.customerWechatUseridCandidate;
  customer.advisorWecomConfidence = seed.advisorWecomConfidence || customer.advisorWecomConfidence;
  customer.advisorWecomMatchStrategy = seed.advisorWecomMatchStrategy || customer.advisorWecomMatchStrategy;
  customer.primaryClinicName = seed.primaryClinicName || customer.primaryClinicName;
  customer.primaryDoctorName = seed.primaryDoctorName || customer.primaryDoctorName;
  customer.healthManagerName = seed.healthManagerName || customer.healthManagerName;
  customer.memberLevel = seed.memberLevel || customer.memberLevel;
  customer.sourceChannel = seed.sourceChannel || customer.sourceChannel;
  customer.firstVisitDate = seed.firstVisitDate || customer.firstVisitDate;
  customer.lastVisitDate = seed.lastVisitDate || customer.lastVisitDate;
  customer.skinMaintenanceCount12m = seed.skinMaintenanceCount12m ?? customer.skinMaintenanceCount12m;
  customer.lastSkinMaintenanceDate = seed.lastSkinMaintenanceDate || customer.lastSkinMaintenanceDate;
  customer.overdueMaintenanceDays = seed.overdueMaintenanceDays ?? customer.overdueMaintenanceDays;
  customer.rfmGrade = seed.rfmGrade || customer.rfmGrade;
  customer.truthValueCount = seed.truthValueCount ?? customer.truthValueCount;
  customer.pendingValueCount = seed.pendingValueCount ?? customer.pendingValueCount;
  customer.extractionResult = seed.extractionResult || customer.extractionResult;
  customer.validationResult = seed.validationResult || customer.validationResult;
  customer.findings = seed.findings || seed.validationResult?.findings || customer.findings || [];
  customer.truthRepairDraft = seed.truthRepairDraft || customer.truthRepairDraft;
  customer.truthRepairTrace = seed.truthRepairTrace || customer.truthRepairTrace || [];
  return customer;
}

async function consumeDsExtractionStream(response, handler) {
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
      const parsed = parseDsExtractionEvent(part);
      if (parsed) handler(parsed.event, parsed.data);
    }
  }
  if (buffer.trim()) {
    const parsed = parseDsExtractionEvent(buffer);
    if (parsed) handler(parsed.event, parsed.data);
  }
}

function parseDsExtractionEvent(chunk) {
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

function shouldFallbackDsExtractionApi(response) {
  return response.status === 404 || response.status === 405;
}

async function readDsExtractionError(response) {
  const body = await response.json().catch(() => ({}));
  return body.message || body.error || response.statusText;
}

async function apiWithDsExtractionFallback(suffix) {
  let fallbackError = null;
  for (const base of DS_EXTRACTION_API_BASES) {
    try {
      const payload = await api(`${base}${suffix}`);
      if (state.dsExtractionCheck) state.dsExtractionCheck.activeApiBase = base;
      return payload;
    } catch (error) {
      fallbackError = error;
      if (base === DS_EXTRACTION_PRIMARY_API && suffix === '/runs/latest') break;
      if (base !== DS_EXTRACTION_PRIMARY_API || !/404|not found|Cannot GET|未知|Not Found/i.test(error.message)) break;
    }
  }
  throw fallbackError;
}

async function openDsExtractionStream(payload) {
  let lastError = null;
  for (const base of DS_EXTRACTION_API_BASES) {
    const response = await fetch(`${base}/runs/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: state.dsExtractionAbort.signal,
    });
    if (response.ok) {
      if (state.dsExtractionCheck) state.dsExtractionCheck.activeApiBase = base;
      return response;
    }
    const message = await readDsExtractionError(response);
    lastError = new Error(message);
    if (base !== DS_EXTRACTION_PRIMARY_API || !shouldFallbackDsExtractionApi(response)) throw lastError;
  }
  throw lastError || new Error('DS 源流水线接口不可用。');
}

function normalizeDsExtractionPhase(value, eventName = '') {
  const raw = String(value || eventName || '').toLowerCase();
  if (/complete|completed|done|finish|完成/.test(raw)) return 'completed';
  if (/write|target|item_written|落表|写/.test(raw)) return 'write_target';
  if (/qwen|summary|总结|ds|deepseek|extract|model|抽取/.test(raw)) return 'ds_extract';
  if (/filter|select|scene|筛选/.test(raw)) return 'filter_scene1';
  if (/source|pull|read|load|candidate|拉源|原始源/.test(raw)) return 'pull_source';
  if (/database|table|schema|build|create|建库/.test(raw)) return 'build_database';
  return null;
}

function updateDsExtractionPhase(check, eventName, payload = {}) {
  const explicit = normalizeDsExtractionPhase(payload.phase || payload.stage || payload.pipelineStage || payload.phaseId, eventName);
  if (explicit) {
    check.phaseId = explicit;
    return;
  }
  if (eventName === 'ready') check.phaseId = 'build_database';
  if (eventName === 'run_started') check.phaseId = 'ds_extract';
  if (eventName === 'item_written') check.phaseId = 'write_target';
  if (eventName === 'done' || eventName === 'run_completed') check.phaseId = 'completed';
}

async function runDsExtractionCheck() {
  if (state.dsExtractionBusy) return;
  state.dsExtractionBusy = true;
  state.dsExtractionAbort = new AbortController();
  initDsExtractionCheckState();
  state.dsExtractionCheck.status = 'running';
  state.dsExtractionCheck.phaseId = 'build_database';
  state.dsExtractionCheck.events.unshift({
    eventName: 'start_clicked',
    message: '用户已点击按钮，开始全量 DS 源流水线校验。',
    at: new Date().toISOString(),
  });
  renderDsExtractionCheck();
  setDsExtractionButtons(true);
  try {
    const response = await openDsExtractionStream({
      actor: 'index_page_ds_scene1_source_pipeline_check',
      limit: DS_EXTRACTION_LIMIT,
      mode: 'full',
    });
    await consumeDsExtractionStream(response, handleDsExtractionEvent);
  } catch (error) {
    if (error.name !== 'AbortError') {
      handleDsExtractionEvent('error', { message: error.message });
    }
  } finally {
    state.dsExtractionBusy = false;
    state.dsExtractionAbort = null;
    setDsExtractionButtons(false);
  }
}

async function refreshDsExtractionCheck() {
  if (state.dsExtractionBusy) return;
  state.dsExtractionBusy = true;
  state.dsExtractionAbort = new AbortController();
  initDsExtractionCheckState();
  state.dsExtractionCheck.status = 'running';
  state.dsExtractionCheck.phaseId = 'build_database';
  state.dsExtractionCheck.events.unshift({
    eventName: 'refresh_clicked',
    message: '用户已点击更新现有客户：将按当前本地客户ID集合回刷最新信息，不重跑新的全量筛选池。',
    at: new Date().toISOString(),
  });
  renderDsExtractionCheck();
  setDsExtractionButtons(true);
  try {
    const response = await openDsExtractionStream({
      actor: 'index_page_ds_scene1_source_pipeline_refresh_existing_ids',
      mode: 'refresh_existing_ids',
      limit: 'all',
    });
    await consumeDsExtractionStream(response, handleDsExtractionEvent);
  } catch (error) {
    if (error.name !== 'AbortError') {
      handleDsExtractionEvent('error', { message: error.message });
    }
  } finally {
    state.dsExtractionBusy = false;
    state.dsExtractionAbort = null;
    setDsExtractionButtons(false);
  }
}

async function connectDsExtractionSources() {
  if (state.dsSourceConnectBusy || state.dsExtractionBusy) return;
  state.dsSourceConnectBusy = true;
  const button = $('#connect-ds-extraction-sources');
  if (button) {
    button.disabled = true;
    button.textContent = '连接中';
  }
  state.dsSourceConnection = {
    ok: false,
    message: '正在检测三库只读连接...',
    checks: [],
  };
  renderDsSourceConnectionStatus();
  try {
    const response = await fetch(`${DS_EXTRACTION_PRIMARY_API}/connect`);
    const payload = await response.json().catch(() => ({}));
    state.dsSourceConnection = {
      ok: Boolean(payload.ok),
      message: payload.message || (response.ok ? '源库连接检测完成。' : '源库连接检测失败。'),
      checks: payload.checks || [],
    };
    if (!state.dsExtractionCheck) initDsExtractionCheckState();
    state.dsExtractionCheck.events.unshift({
      eventName: 'source_connect_checked',
      message: state.dsSourceConnection.message,
      at: new Date().toISOString(),
    });
  } catch (error) {
    state.dsSourceConnection = {
      ok: false,
      message: `源库连接检测失败：${error.message}`,
      checks: [],
    };
  } finally {
    state.dsSourceConnectBusy = false;
    if (button) {
      button.disabled = false;
      button.textContent = '连接源库';
    }
    renderDsSourceConnectionStatus();
    renderDsExtractionCheck();
  }
}

async function stopDsExtractionCheck() {
  const check = state.dsExtractionCheck;
  const runId = check?.runId;
  if (check) {
    check.status = 'stopping';
    check.events.unshift({
      eventName: 'stop_requested',
      message: runId
        ? '正在通知服务端停止本次 DS 抽取；后续客户将不再读取、调用模型或写入目标库。'
        : '正在停止当前连接；尚未取得 runId，无法精确停止服务端 run。',
      at: new Date().toISOString(),
    });
    renderDsExtractionCheck();
  }
  let stopSucceeded = !runId;
  if (runId) {
    try {
      const response = await fetch(`${DS_EXTRACTION_PRIMARY_API}/runs/${encodeURIComponent(runId)}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: 'index_page_stop_ds_extraction_check',
          reason: 'manual_stop_button_requested',
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || '停止 DS 抽取失败');
      if (payload.run) {
        check.runId = payload.run.runId || check.runId;
        check.status = payload.run.status || payload.status || 'stopped';
        check.completed = payload.run.itemCount ?? check.completed;
      } else {
        check.status = payload.status || 'stopping';
      }
      check.events.unshift({
        eventName: payload.status === 'stopped' ? 'stopped' : 'stop_requested',
        message: payload.message || '服务端已收到停止请求。',
        at: new Date().toISOString(),
      });
      if (payload.run?.runId) {
        loadDsExtractionRunItems(payload.run.runId);
      }
      stopSucceeded = true;
    } catch (error) {
      check.status = 'running';
      check.events.unshift({
        eventName: 'stop_failed',
        message: `停止失败：${error.message}`,
        at: new Date().toISOString(),
      });
      renderDsExtractionCheck();
      setDsExtractionButtons(true);
      return;
    }
  }
  if (stopSucceeded) {
    state.dsExtractionAbort?.abort();
    state.dsExtractionBusy = false;
    setDsExtractionButtons(false);
  }
  renderDsExtractionCheck();
}

async function clearDsExtractionCheck() {
  if (state.dsExtractionBusy) return;
  const firstConfirm = window.confirm('清除结果会删除 analysis-db 目标库中已迁入的 DS 抽取客户、230 项信息点、run/items 和样本结果。是否继续？');
  if (!firstConfirm) return;
  const secondConfirm = window.confirm('请再次确认：这是持久化目标库数据删除操作，不只是清空页面展示。确认删除 DS 抽取结果？');
  if (!secondConfirm) return;
  setDsExtractionButtons(true);
  try {
    const response = await fetch(`${DS_EXTRACTION_PRIMARY_API}/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: state.overview?.dsMigration?.clearConfirmationToken || 'DELETE_DS_TARGET_DATA' }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || body.error || response.statusText);
    }
  } catch (error) {
    if (!state.dsExtractionCheck) initDsExtractionCheckState();
    state.dsExtractionCheck.events.unshift({
      eventName: 'clear_failed',
      message: `清除失败：${error.message}`,
      at: new Date().toISOString(),
    });
    renderDsExtractionCheck();
    setDsExtractionButtons(false);
    return;
  } finally {
    setDsExtractionButtons(false);
  }
  initDsExtractionCheckState();
  state.dsExtractionCheck.events.unshift({
    eventName: 'cleared',
    message: '页面结果和本地 DS 目标库结果已清除，回到新空库 + 原始源拉取前的空状态。',
    at: new Date().toISOString(),
  });
  renderDsExtractionCheck();
}

async function validateDsExtractionTitleAlignment() {
  if (state.dsExtractionBusy || state.dsTitleAlignmentBusy) return;
  if (!state.dsExtractionCheck?.runId) {
    if (!state.dsExtractionCheck) initDsExtractionCheckState();
    state.dsExtractionCheck.events.unshift({
      eventName: 'title_alignment_skipped',
      message: '暂无可检验的 run；请先完成一次抽取。',
      at: new Date().toISOString(),
    });
    renderDsExtractionCheck();
    return;
  }
  state.dsTitleAlignmentBusy = true;
  setDsExtractionButtons(true);
  try {
    const runId = state.dsExtractionCheck.runId;
    const response = await fetch(`${DS_EXTRACTION_PRIMARY_API}/runs/${encodeURIComponent(runId)}/title-alignment-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repair: true, sampleSize: 1 }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || payload.error || '标题一致性检验失败');
    const issueCount = (payload.reports || []).reduce((sum, report) => sum + Number(report.issueCount || 0), 0);
    state.dsExtractionCheck.events.unshift({
      eventName: 'title_alignment_checked',
      message: `标题一致性检验完成：抽检 ${payload.checkedCustomers || 0} 人，发现 ${issueCount} 项，修正 ${payload.repairedCount || 0} 项。`,
      at: new Date().toISOString(),
    });
    await loadDsExtractionRunItems(runId);
    const selected = Array.from(state.dsExtractionCheck.customers.values()).find((item) => item.customerCode === state.selectedDsExtractionCustomerCode);
    if (selected) {
      state.dsExtractionCheck.audits.delete(selected.unifiedCustomerId);
      await loadDsExtractionAuditForCustomer(selected);
    }
  } catch (error) {
    state.dsExtractionCheck.events.unshift({
      eventName: 'title_alignment_failed',
      message: error.message,
      at: new Date().toISOString(),
    });
    renderDsExtractionCheck();
  } finally {
    state.dsTitleAlignmentBusy = false;
    setDsExtractionButtons(false);
  }
}

function setDsExtractionButtons(disabled) {
  const connectButton = $('#connect-ds-extraction-sources');
  const refreshButton = $('#refresh-ds-extraction-check');
  const validateButton = $('#validate-ds-extraction-check');
  const runButton = $('#run-ds-extraction-check');
  const stopButton = $('#stop-ds-extraction-check');
  const clearButton = $('#clear-ds-extraction-check');
  if (connectButton) connectButton.disabled = disabled || state.dsSourceConnectBusy;
  if (refreshButton) refreshButton.disabled = disabled;
  if (validateButton) validateButton.disabled = disabled || state.dsTitleAlignmentBusy;
  if (runButton) runButton.disabled = disabled;
  if (stopButton) stopButton.disabled = !disabled;
  if (clearButton) clearButton.disabled = disabled;
}

function handleDsExtractionEvent(eventName, payload = {}) {
  if (!state.dsExtractionCheck) initDsExtractionCheckState();
  const check = state.dsExtractionCheck;
  const customerCode = dsExtractionCustomerCodeFromItem(payload.item || payload);
  const message = payload.message || eventName;
  check.events.unshift({
    eventName,
    message,
    customerCode: payload.unifiedCustomerId || payload.item?.unifiedCustomerId ? customerCode : '',
    at: new Date().toISOString(),
  });
  check.events = check.events.slice(0, 24);
  updateDsExtractionPhase(check, eventName, payload);
  if (payload.runId) check.runId = payload.runId;
  if (payload.requestedLimit) check.total = payload.requestedLimit;
  if (payload.selectedCount) check.total = payload.selectedCount;
  if (payload.total) check.total = payload.total;
  if (eventName === 'ready') check.status = 'ready';
  if (eventName === 'run_started') check.status = 'running';
  if (eventName === 'batch_prepared') {
    check.status = 'running';
    check.total = payload.stats?.selectedCount || payload.selectedCount || check.total;
  }
  if (eventName === 'phone_lookup_completed' || eventName === 'phone_batch_prepared') {
    check.status = 'running';
    check.total = payload.stats?.selectedCount || payload.selectedCount || check.total;
  }
  if (eventName === 'update_diff_completed') {
    check.status = payload.status || 'running';
    check.total = payload.stats?.qwenSelectedCount ?? payload.stats?.changedCount ?? check.total;
    check.completed = 0;
    check.counts.success = Number(payload.stats?.unchangedCount || 0);
  }
  if (eventName === 'run_stopped') check.status = 'stopped';
  if (eventName === 'run_completed' || eventName === 'done') check.status = payload.status || payload.run?.status || 'completed';
  if (eventName === 'error') check.status = 'failed';

  if (eventName === 'item_written') {
    const customer = getDsExtractionCustomer(customerCode, {
      itemIndex: payload.itemIndex,
      unifiedCustomerId: payload.unifiedCustomerId,
      customerNameMasked: payload.customerNameMasked,
      customerNameFull: payload.customerNameFull,
      advisorName: payload.advisorName,
      advisorSourceUserId: payload.advisorSourceUserId,
      customerExternalUseridCandidate: payload.customerExternalUseridCandidate,
      customerWechatUseridCandidate: payload.customerWechatUseridCandidate,
      rfmGrade: payload.rfmGrade,
      truthValueCount: payload.truthValueCount,
      pendingValueCount: payload.pendingValueCount,
      status: payload.status,
      extractionResult: payload.item?.extractionResult,
      validationResult: payload.item?.validationResult,
      findings: payload.findings,
    });
    if (payload.item?.extractionResult?.audit) {
      check.audits.set(customer.unifiedCustomerId, mapDsExtractionAudit(payload.item.extractionResult.audit));
    }
    check.completed = Math.max(check.completed, customer.index);
    const currentCustomers = Array.from(check.customers.values());
    check.counts.failed = currentCustomers.filter((item) => item.status === 'failed').length;
    check.counts.needsReview = currentCustomers.filter((item) => item.status === 'needs_manual_review' || item.status === 'passed_with_warnings').length;
    check.counts.success = currentCustomers.filter((item) => item.status === 'passed_internal_check').length;
    if (!state.selectedDsExtractionCustomerCode) {
      state.selectedDsExtractionCustomerCode = customer.customerCode;
      loadDsExtractionAuditForCustomer(customer);
    }
  }

  if ((eventName === 'done' || eventName === 'run_completed' || eventName === 'run_stopped') && payload.run) {
    check.runId = payload.run.runId || check.runId;
    check.status = payload.run.status || check.status;
    check.total = payload.run.itemCount || payload.run.requestedLimit || check.total;
    check.completed = payload.run.itemCount || check.completed;
    loadDsExtractionRunItems(payload.run.runId);
  }
  if (eventName === 'customer_qwen_completed') {
    check.completed = Math.max(check.completed, Number(payload.itemIndex || 0));
    check.counts.success = check.completed;
    refreshLiveArchiveCompletedCustomer(payload);
  }
  if (eventName === 'customer_qwen_failed') {
    check.completed = Math.max(check.completed, Number(payload.itemIndex || 0));
    check.counts.failed = (check.counts.failed || 0) + 1;
  }
  renderDsExtractionCheck();
}

async function loadDsExtractionRunItems(runId) {
  if (!runId) return;
  try {
    const payload = await apiWithDsExtractionFallback(`/runs/${encodeURIComponent(runId)}/items`);
    const check = state.dsExtractionCheck;
    check.runId = payload.run?.runId || runId;
    check.status = payload.run?.status || check.status;
    check.phaseId = isCompletedRunStatus(check.status) ? 'completed' : check.phaseId;
    check.total = payload.run?.itemCount || payload.run?.requestedLimit || payload.items?.length || check.total || 0;
    check.completed = payload.items?.length || check.completed || 0;
    check.counts = {
      failed: payload.items?.filter((item) => item.status === 'failed').length || 0,
      needsReview: payload.items?.filter((item) => item.status === 'needs_manual_review' || item.status === 'passed_with_warnings').length || 0,
      success: payload.items?.filter((item) => item.status === 'passed_internal_check').length || 0,
    };
    for (const item of payload.items || []) {
      const customer = getDsExtractionCustomer(dsExtractionCustomerCodeFromItem(item), item);
      if (item.extractionResult?.audit) check.audits.set(customer.unifiedCustomerId, mapDsExtractionAudit(item.extractionResult.audit));
    }
    renderDsExtractionCheck();
  } catch (error) {
    handleDsExtractionEvent('error', { message: `读取本地目标校验库失败：${error.message}` });
  }
}

async function loadLatestDsExtractionRun() {
  if (state.dsExtractionBusy) return;
  try {
    const latest = await apiWithDsExtractionFallback('/runs/latest');
    initDsExtractionCheckState();
    state.dsExtractionCheck.runId = latest.runId;
    state.dsExtractionCheck.status = latest.status;
    state.dsExtractionCheck.phaseId = isCompletedRunStatus(latest.status) ? 'completed' : 'write_target';
    state.dsExtractionCheck.total = latest.itemCount || latest.requestedLimit || 0;
    state.dsExtractionCheck.completed = latest.itemCount || 0;
    state.dsExtractionCheck.events.unshift({
      eventName: 'latest_loaded',
      message: `已读取最近一次本地校验 run：${latest.runId}`,
      at: new Date().toISOString(),
    });
    await loadDsExtractionRunItems(latest.runId);
  } catch {
    if (state.dsExtractionCheck) renderDsExtractionCheck();
  }
}

function shouldShowDsExtractionEmptyState(check) {
  return check.status === 'idle' && !check.runId && !check.customers.size;
}

function renderDsExtractionEmptyState(summary, list, detail) {
  summary.innerHTML = `
    <strong>0 个客户</strong>
    <span>从新空库 + 原始源拉取后，结果只写入本地 DS 目标校验库。</span>
  `;
  list.innerHTML = '<div class="empty">空状态：等待点击“启动全量抽取”后，从原始源拉取候选客户。</div>';
  detail.innerHTML = '<div class="empty">右侧将继续复用场景一档案核验 230 项结构；当前尚未选择客户。</div>';
}

async function loadDsExtractionAuditForCustomer(customer) {
  if (!customer?.unifiedCustomerId || !state.dsExtractionCheck) return;
  if (state.dsExtractionCheck.audits.has(customer.unifiedCustomerId)) return;
  if (customer.extractionResult?.audit) {
    state.dsExtractionCheck.audits.set(customer.unifiedCustomerId, mapDsExtractionAudit(customer.extractionResult.audit));
    renderDsExtractionCheck();
    return;
  }
  try {
    const audit = await api(`${state.dsExtractionCheck.activeApiBase}/customers/${encodeURIComponent(customer.unifiedCustomerId)}/audit`);
    state.dsExtractionCheck.audits.set(customer.unifiedCustomerId, mapDsExtractionAudit(audit));
    renderDsExtractionCheck();
  } catch (error) {
    customer.auditError = error.message;
    renderDsExtractionCheck();
  }
}

async function loadDsTruthRepairDraftForCustomer(customer) {
  const runId = state.dsExtractionCheck?.runId;
  const customerId = customer?.unifiedCustomerId || customer?.sourceCustomerId;
  if (!runId || !customerId || customer.truthRepairDraft || customer.truthRepairLoading) return;
  customer.truthRepairLoading = true;
  try {
    const payload = await api(`${DS_EXTRACTION_PRIMARY_API}/runs/${encodeURIComponent(runId)}/customers/${encodeURIComponent(customerId)}/truth-repair-draft`);
    customer.truthRepairDraft = payload.draft || null;
  } catch {
    customer.truthRepairDraft = null;
  } finally {
    customer.truthRepairLoading = false;
    renderDsExtractionCheck();
  }
}

async function runDsTruthRepairCheck(customerCode) {
  const check = state.dsExtractionCheck;
  const customer = check?.customers.get(customerCode);
  const runId = check?.runId;
  const customerId = customer?.unifiedCustomerId || customer?.sourceCustomerId;
  if (!check || !customer || !runId || !customerId || state.dsTruthRepairBusyCustomerId) return;
  state.dsTruthRepairBusyCustomerId = customerId;
  customer.truthRepairTrace = [{
    step: 'ready',
    status: 'running',
    message: '正在启动 DS 真值修正检验。',
    at: new Date().toISOString(),
  }];
  renderDsExtractionCheck();
  try {
    const response = await fetch(`${DS_EXTRACTION_PRIMARY_API}/runs/${encodeURIComponent(runId)}/customers/${encodeURIComponent(customerId)}/truth-repair/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'index_page_single_customer_truth_repair_button' }),
    });
    if (!response.ok) throw new Error(await readDsExtractionError(response));
    await consumeDsExtractionStream(response, (eventName, payload = {}) => {
      customer.truthRepairTrace = [{
        step: payload.step || eventName,
        status: payload.status || (eventName === 'error' ? 'failed' : 'running'),
        message: payload.message || eventName,
        at: new Date().toISOString(),
      }, ...(customer.truthRepairTrace || [])].slice(0, 20);
      if (payload.draft) customer.truthRepairDraft = payload.draft;
      if (payload.audit && customer.unifiedCustomerId) {
        check.audits.set(customer.unifiedCustomerId, mapDsExtractionAudit(payload.audit));
        customer.truthValueCount = payload.audit.summary?.truthValueCount ?? customer.truthValueCount;
        customer.pendingValueCount = payload.audit.summary?.pendingValueCount ?? customer.pendingValueCount;
      }
      if (eventName === 'result_written' && payload.status === 'completed') {
        customer.status = customer.pendingValueCount > 0 ? 'passed_with_warnings' : 'passed_internal_check';
      }
      renderDsExtractionCheck();
    });
  } catch (error) {
    customer.truthRepairTrace = [{
      step: 'error',
      status: 'failed',
      message: error.message,
      at: new Date().toISOString(),
    }, ...(customer.truthRepairTrace || [])].slice(0, 20);
  } finally {
    state.dsTruthRepairBusyCustomerId = null;
    renderDsExtractionCheck();
  }
}

function mapDsExtractionAudit(audit) {
  const next = cloneForUi(audit);
  const truthStatuses = new Set([
    'pilot20_remote_value_filled',
    'local_scene1_value_filled',
    'pilot20_wecom_value_filled',
    'pilot20_ai_file_index_filled',
    'pilot20_nps_value_filled',
    'pilot20_skin_metadata_index_filled',
    'pilot20_medical_metadata_index_filled',
    'pilot20_doctor_affiliation_filled',
    'pilot20_signature_photo_index_filled',
    'pilot20_consent_notice_index_filled',
    'ds_source_value_filled',
    'ds_scene1_truth_mirrored',
  ]);
  const summaryStatuses = new Set(['local_scene1_partial_summary']);
  const noRecordStatuses = new Set([
    'pilot20_remote_no_record',
    'pilot20_wecom_no_record',
    'pilot20_miniapp_no_record',
    'pilot20_signature_consent_no_record',
    'ds_source_no_record',
  ]);
  const pendingStatuses = new Set([
    'mapped_pending_value_extract',
    'archive_slot_prepared_pending_value',
    'ds_needs_review',
    'ds_pending_value_extract',
  ]);
  next.sections = (next.sections || []).map((section) => {
    const items = (section.items || []).map((item) => {
      const hasValue = Boolean(item.customerValue?.valueText);
      const valueStatus = item.customerValue?.valueStatus;
      let displayStatus = 'DS 未匹配';
      let valueKind = 'missing';
      let explanation = 'DS 未能匹配到该 confirm 条目，需要人工复核。';
      if (truthStatuses.has(valueStatus) || item.valueKind === 'truth') {
        displayStatus = 'DS 已抽取';
        valueKind = 'truth';
        explanation = 'DS 抽取校验已按同构章节识别该条结构化信息；下方保留原场景一核验结论用于对照。';
      } else if (summaryStatuses.has(valueStatus) || item.valueKind === 'summary') {
        displayStatus = 'DS 已抽取';
        valueKind = 'summary';
        explanation = 'DS 抽取校验已对齐原场景一摘要型真值，保留同构展示。';
      } else if (noRecordStatuses.has(valueStatus) || item.valueKind === 'no_record') {
        displayStatus = 'DS 候选源无记录';
        valueKind = 'no_record';
        explanation = 'DS 抽取校验识别为候选源无记录，与原场景一核验结果保持同构。';
      } else if (pendingStatuses.has(valueStatus) || item.valueKind === 'pending' || item.valueKind === 'indexed') {
        displayStatus = 'DS 待抽取';
        valueKind = 'pending';
        explanation = 'DS 抽取校验尚未得到可确认业务值，保留待抽取状态。';
      } else if (hasValue) {
        displayStatus = 'DS 已抽取';
        valueKind = 'truth';
        explanation = 'DS 抽取校验已返回具体文本值，按同构章节保留展示。';
      }
      return { ...item, displayStatus, valueKind, explanation };
    });
    return {
      ...section,
      items,
      filledValueCount: items.filter((item) => item.valueKind === 'truth').length,
      summaryValueCount: 0,
      noRecordCount: items.filter((item) => item.valueKind === 'no_record').length,
      pendingValueCount: items.filter((item) => item.valueKind === 'pending').length,
      missingCount: items.filter((item) => item.valueKind === 'missing').length,
    };
  });
  return next;
}

function cloneForUi(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function selectDsExtractionCustomer(customerCode) {
  state.selectedDsExtractionCustomerCode = customerCode;
  const customer = state.dsExtractionCheck?.customers.get(customerCode);
  if (customer) loadDsExtractionAuditForCustomer(customer);
  renderDsExtractionCheck();
}

function renderDsExtractionPhases(check) {
  const currentIndex = Math.max(0, DS_EXTRACTION_PHASES.findIndex((phase) => phase.id === check.phaseId));
  const completed = isCompletedRunStatus(check.status) || check.phaseId === 'completed';
  return DS_EXTRACTION_PHASES.map((phase, index) => {
    let className = 'ds-extraction-phase';
    if (completed || index < currentIndex) className += ' is-complete';
    if (!completed && index === currentIndex) className += check.status === 'failed' ? ' is-failed' : ' is-active';
    return `<span class="${className}">${escapeHtml(phase.label)}</span>`;
  }).join('');
}

function renderLiveExtractStatus() {
  const panel = $('#live-extract-status-panel');
  if (!panel) return;
  const title = $('#live-extract-status-title');
  const meta = $('#live-extract-status-meta');
  const fill = $('#live-extract-progress-fill');
  const phase = $('#live-extract-status-phase');
  const log = $('#live-extract-status-log');
  const completedList = $('#live-extract-completed-list');
  const check = state.dsExtractionCheck;
  if (!check) {
    panel.className = 'live-extract-status-panel live-archive-only is-idle';
    if (title) title.textContent = '抽取状态：待命';
    if (meta) meta.textContent = '未启动';
    if (fill) fill.style.width = '0%';
    if (phase) phase.textContent = '建库 · 拉源 · 筛选 · 规则直抽 · 写目标库';
    if (log) log.textContent = '点击按钮后会实时显示 runId、阶段、完成数和最近事件。';
    if (completedList) completedList.innerHTML = '';
    return;
  }
  const total = Number(check.total) || 0;
  const completed = Number(check.completed) || 0;
  const pct = Math.max(0, Math.min(100, total ? Math.round((completed / total) * 100) : 0));
  const phaseLabel = DS_EXTRACTION_PHASES.find((item) => item.id === check.phaseId)?.label || '待运行';
  const latestEvent = check.events?.[0];
  const tone = check.status === 'failed'
    ? 'is-error'
    : isCompletedRunStatus(check.status) || check.status === 'completed'
      ? 'is-complete'
      : check.status === 'running' || check.status === 'ready'
        ? 'is-running'
        : 'is-idle';
  panel.className = `live-extract-status-panel live-archive-only ${tone}`;
  if (title) title.textContent = `抽取状态：${formatRunStatus(check.status)}`;
  if (meta) meta.textContent = `${check.runId || '等待 runId'} · ${phaseLabel} · ${completed}/${total || '-'}`;
  if (fill) fill.style.width = `${pct}%`;
  if (phase) phase.textContent = `${phaseLabel} · 通过 ${check.counts?.success ?? 0} · 需复核 ${check.counts?.needsReview ?? 0} · 失败 ${check.counts?.failed ?? 0}`;
  if (log) log.textContent = latestEvent?.message || '等待运行。';
  if (completedList) {
    const completedCustomers = Array.from(state.liveArchiveCompletedCustomers.values())
      .sort((a, b) => String(b.completedAt || '').localeCompare(String(a.completedAt || '')))
      .slice(0, 6);
    completedList.innerHTML = completedCustomers.map((customer) => `
      <button class="live-completed-customer-button" type="button" data-live-completed-customer="${escapeHtml(customer.customerId)}" title="查看已完成档案">
        <strong>${escapeHtml(customer.customerName || customer.customerId)}</strong>
        <span>${escapeHtml(customer.phoneMasked || customer.customerId)}</span>
      </button>
    `).join('');
  }
}

function renderDsExtractionCheck() {
  const status = $('#ds-extraction-status');
  const panel = $('#ds-extraction-progress');
  const list = $('#ds-extraction-customer-list');
  const summary = $('#ds-extraction-list-summary');
  const detail = $('#ds-extraction-detail');
  if (!status || !panel || !list || !summary || !detail) return;
  renderDsSourceConnectionStatus();
  renderLiveExtractStatus();
  const check = state.dsExtractionCheck;
  if (!check) {
    status.className = 'run-status empty';
    status.textContent = DS_EXTRACTION_EMPTY_MESSAGE;
    panel.classList.add('is-hidden');
    renderDsExtractionEmptyState(summary, list, detail);
    return;
  }
  const total = Number(check.total) || 0;
  const completed = Number(check.completed) || 0;
  const pct = Math.max(0, Math.min(100, total ? Math.round((completed / total) * 100) : 0));
  if (shouldShowDsExtractionEmptyState(check)) {
    status.className = 'run-status empty';
    status.textContent = DS_EXTRACTION_EMPTY_MESSAGE;
    panel.classList.add('is-hidden');
    renderDsExtractionEmptyState(summary, list, detail);
    return;
  }
  status.className = check.status === 'failed' ? 'run-status empty' : 'run-status';
  const activeApi = check.activeApiBase === DS_EXTRACTION_PRIMARY_API ? 'source-pipeline' : 'extraction-fallback';
  status.textContent = `${check.runId || '等待启动'} · ${formatRunStatus(check.status)} · ${activeApi} · 已完成 ${completed}/${total} · 通过 ${check.counts?.success ?? 0} · 需复核 ${check.counts?.needsReview ?? 0} · 失败 ${check.counts?.failed ?? 0}`;
  panel.classList.remove('is-hidden');
  $('#ds-extraction-progress-fill').style.width = `${pct}%`;
  $('#ds-extraction-progress-label').textContent = `${completed} / ${total} · 失败 ${check.counts?.failed ?? 0} · 需复核 ${check.counts?.needsReview ?? 0}`;
  $('#ds-extraction-state').textContent = `${DS_EXTRACTION_PHASES.find((phase) => phase.id === check.phaseId)?.label || '待运行'} · ${formatRunStatus(check.status)}`;
  $('#ds-extraction-phases').innerHTML = renderDsExtractionPhases(check);
  $('#ds-extraction-log').textContent = check.events
    .slice(0, 12)
    .map((event) => `${formatTime(event.at)} ${event.customerCode ? `${event.customerCode} · ` : ''}${event.message}`)
    .join('\n') || '等待运行。';

  const customers = Array.from(check.customers.values()).sort((a, b) => a.index - b.index);
  summary.innerHTML = `
    <strong>${formatNumber(customers.length)} 个本地目标库客户结果</strong>
    <span>全量模式 · 从原始源拉取并筛选 · 不写远端库、不自动发送、不对客发布</span>
  `;
  list.innerHTML = customers.map((customer) => `
    <button class="customer-button scene-user-button ds-extraction-customer-button ${state.selectedDsExtractionCustomerCode === customer.customerCode ? 'is-active' : ''}" data-ds-extraction-customer="${escapeHtml(customer.customerCode)}">
      <strong>${escapeHtml(customer.customerCode)} · ${escapeHtml(dsExtractionStatusLabel(customer.status))}</strong>
      <code>${escapeHtml(customer.unifiedCustomerId || '等待客户ID')}</code>
      <span>${escapeHtml(customer.customerNameMasked || '本地 DS 目标校验库记录')}</span>
      <div class="scene-user-metrics">
        <b>RFM ${escapeHtml(customer.rfmGrade || '-')}</b>
        <b>真值 ${formatNumber(customer.truthValueCount)}/230</b>
        <b>待抽取 ${formatNumber(customer.pendingValueCount)}</b>
        <b>${escapeHtml(dsExtractionStatusLabel(customer.status))}</b>
      </div>
    </button>
  `).join('') || '<div class="empty">等待第一个客户返回。</div>';
  const active = check.customers.get(state.selectedDsExtractionCustomerCode) || customers[0];
  if (active && !state.selectedDsExtractionCustomerCode) state.selectedDsExtractionCustomerCode = active.customerCode;
  detail.innerHTML = active ? renderDsExtractionDetail(active, check) : '<div class="empty">请选择左侧返回客户查看同构档案核验结果；右侧结构继续复用场景一档案核验 230 项。</div>';
  if (active && active.unifiedCustomerId && !check.audits.has(active.unifiedCustomerId) && !active.auditError) {
    loadDsExtractionAuditForCustomer(active);
  }
  if (active && active.unifiedCustomerId) {
    loadDsTruthRepairDraftForCustomer(active);
  }
}

function renderDsExtractionDetail(customer, check) {
  const audit = customer.unifiedCustomerId ? check.audits.get(customer.unifiedCustomerId) : null;
  const findings = customer.findings || customer.validationResult?.findings || [];
  const identity = customer.truthRepairDraft?.identityRepair || {};
  const advisorName = customer.advisorName || identity.advisorName || audit?.summary?.advisorWecomBinding?.advisorName || '';
  const advisorUserId = customer.advisorWecomMemberUserid || customer.advisorSourceUserId || identity.advisorEnterpriseWechatUserid || audit?.summary?.advisorWecomBinding?.wecomMemberUserid || audit?.summary?.advisorWecomBinding?.advisorSourceUserId || '';
  const customerWechatId = customer.customerExternalUseridCandidate || customer.customerWechatUseridCandidate || audit?.summary?.advisorWecomBinding?.externalUseridCandidate || audit?.summary?.advisorWecomBinding?.wechatUseridCandidate || '';
  const titleName = identity.customerWechatName || identity.repairedFullName || customer.customerNameFull || customer.customerNameMasked || customer.unifiedCustomerId || customer.customerCode;
  const subName = [
    customer.customerNameFull && customer.customerNameFull !== titleName ? customer.customerNameFull : '',
    advisorName ? `顾问 ${advisorName}` : '',
    advisorUserId ? `顾问企微/源ID ${advisorUserId}` : '',
    customerWechatId ? `顾客企微/微信候选 ${customerWechatId}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
  return `
    <div class="user-file-head">
      <div>
        <p class="eyebrow">DS SCENE 1 EXTRACTION CHECK</p>
        <h3>${escapeHtml(titleName)}</h3>
        ${subName ? `<p class="ds-truth-repair-headline">${escapeHtml(subName)}</p>` : ''}
        <code>${escapeHtml(customer.unifiedCustomerId || customer.customerCode)}</code>
      </div>
      <span class="status-chip ${dsExtractionStatusClass(customer.status)}">${escapeHtml(dsExtractionStatusLabel(customer.status))}</span>
    </div>
    ${renderDsTruthRepairPanel(customer, check)}
    <div class="detail-grid user-file-grid">
      <div class="detail-item"><span>Run</span><strong>${escapeHtml(check.runId || '连接中')}</strong></div>
      <div class="detail-item"><span>客户序号</span><strong>${escapeHtml(customer.customerCode)}</strong></div>
      <div class="detail-item"><span>顾客姓名</span><strong>${escapeHtml(customer.customerNameFull || identity.repairedFullName || customer.customerNameMasked || '待补')}</strong></div>
      <div class="detail-item"><span>所属顾问</span><strong>${escapeHtml(advisorName || '待补')}</strong></div>
      <div class="detail-item"><span>顾问企微/源ID</span><strong>${escapeHtml(advisorUserId || '待补')}</strong></div>
      <div class="detail-item"><span>顾客微信/企微ID</span><strong>${escapeHtml(customerWechatId || customer.customerExternalUseridHash || '待补')}</strong></div>
      <div class="detail-item"><span>RFM 等级</span><strong>${escapeHtml(customer.rfmGrade || '待补')}</strong></div>
      <div class="detail-item"><span>会员等级</span><strong>${escapeHtml(customer.memberLevel || '待补')}</strong></div>
      <div class="detail-item"><span>门店</span><strong>${escapeHtml(customer.primaryClinicName || '待补')}</strong></div>
      <div class="detail-item"><span>所属医生</span><strong>${escapeHtml(customer.primaryDoctorName || '待补')}</strong></div>
      <div class="detail-item"><span>健康管理人</span><strong>${escapeHtml(customer.healthManagerName || '待补')}</strong></div>
      <div class="detail-item"><span>来源渠道</span><strong>${escapeHtml(customer.sourceChannel || '待补')}</strong></div>
      <div class="detail-item"><span>初诊 / 末诊</span><strong>${escapeHtml([customer.firstVisitDate, customer.lastVisitDate].filter(Boolean).join(' / ') || '待补')}</strong></div>
      <div class="detail-item"><span>最近维养</span><strong>${escapeHtml([customer.lastSkinMaintenanceDate, customer.skinMaintenanceCount12m ? `12M ${customer.skinMaintenanceCount12m}次` : ''].filter(Boolean).join(' · ') || '待补')}</strong></div>
      <div class="detail-item"><span>企微绑定状态</span><strong>${escapeHtml(customer.advisorWecomConfidence || customer.advisorWecomMatchStrategy || '待复核')}</strong></div>
      <div class="detail-item"><span>校验状态</span><strong>${escapeHtml(dsExtractionStatusLabel(customer.status))}</strong></div>
      <div class="detail-item"><span>真值信息点</span><strong>${formatNumber(customer.truthValueCount)}/230</strong></div>
      <div class="detail-item"><span>待抽取</span><strong>${formatNumber(customer.pendingValueCount)}</strong></div>
      <div class="detail-item"><span>本地目标库</span><strong>ds_scene1_extraction_check_items</strong></div>
      <div class="detail-item"><span>远端写入</span><strong>禁止</strong></div>
    </div>
    <div class="user-file-notice">
      <strong>本页复用“用户全景档案核验”的维度、分类、结果和详情样式。</strong>
      <span>DS 抽取校验结果来自本地目标校验库，明细维度按现有 230 项 confirm 档案核验结构展开；不写远端库、不自动发送、不对客发布。</span>
    </div>
    ${findings.length ? `
      <div class="user-file-notice ds-extraction-findings">
        <strong>DS 校验提示</strong>
        <span>${findings.map((item) => `${item.level || 'info'}：${item.code || item}`).map(escapeHtml).join('；')}</span>
      </div>
    ` : ''}
    ${customer.auditError ? `<div class="empty">读取同构 230 项详情失败：${escapeHtml(customer.auditError)}</div>` : ''}
    ${audit ? renderUserRequirementSections(audit) : '<div class="empty">正在读取同构 230 项详情...</div>'}
  `;
}

function renderDsTruthRepairPanel(customer, check) {
  const draft = customer.truthRepairDraft;
  const trace = customer.truthRepairTrace || draft?.processTrace || [];
  const busy = state.dsTruthRepairBusyCustomerId && state.dsTruthRepairBusyCustomerId === (customer.unifiedCustomerId || customer.sourceCustomerId);
  const summary = draft?.repairSummary || {};
  const identity = draft?.identityRepair || {};
  const stepsHtml = DS_TRUTH_REPAIR_STEPS.map((step) => {
    const hit = trace.find((item) => item.step === step.id);
    let className = 'ds-truth-step';
    if (hit?.status === 'completed') className += ' is-complete';
    else if (hit?.status === 'failed') className += ' is-failed';
    else if (hit || busy) className += ' is-active';
    return `<span class="${className}">${escapeHtml(step.label)}</span>`;
  }).join('');
  const repairs = (draft?.fieldRepairs || []).slice(0, 8);
  return `
    <section class="ds-truth-repair-panel">
      <div class="ds-truth-repair-top">
        <div>
          <strong>DS 真值修正检验</strong>
          <span>单客实时跑：读标题 -> 查 analysis-db -> DeepSeek 判定 -> 写入本地目标库 -> 完成校验</span>
        </div>
        <button class="primary-button ds-truth-repair-button" data-ds-truth-repair-customer="${escapeHtml(customer.customerCode)}" ${busy ? 'disabled' : ''}>${busy ? '检验中' : 'DS 真值修正检验'}</button>
      </div>
      <div class="ds-truth-steps">${stepsHtml}</div>
      ${draft ? `
        <div class="ds-truth-identity-grid">
          <div><span>客户微信名</span><strong>${escapeHtml(identity.customerWechatName || '待补')}</strong></div>
          <div><span>客户全名</span><strong>${escapeHtml(identity.repairedFullName || '待补')}</strong></div>
          <div><span>顾问名</span><strong>${escapeHtml(identity.advisorName || '待补')}</strong></div>
          <div><span>顾问企微</span><strong>${escapeHtml(identity.advisorEnterpriseWechatUserid || identity.advisorEnterpriseWechatNameStatus || '待补')}</strong></div>
        </div>
        <div class="ds-truth-summary">
          <span>修正候选 ${formatNumber(summary.totalRepairs)}</span>
          <span>已写入 ${formatNumber(summary.appliedCount)}</span>
          <span>高置信 ${formatNumber(summary.highConfidence)}</span>
          <span>中置信 ${formatNumber(summary.mediumConfidence)}</span>
          <span>状态 ${escapeHtml(draft.status || 'draft')}</span>
        </div>
        ${repairs.length ? `
          <div class="ds-truth-repair-list">
            ${repairs.map((item) => `
              <article>
                <code>${escapeHtml(item.requirementId || 'REQ')}</code>
                <strong>${escapeHtml(item.draftValue || '待补')}</strong>
                <span>${escapeHtml(item.problem || '')}</span>
              </article>
            `).join('')}
          </div>
        ` : ''}
      ` : '<p class="ds-truth-empty">尚未执行本地真值修正；点击按钮后会调用 DeepSeek，基于 analysis-db 本地 DS 目标库直接补全/修正 customer_requirement_values，不写远端业务库。</p>'}
      ${trace.length ? `
        <pre class="ds-truth-trace">${trace.slice(0, 8).map((item) => `${formatTime(item.at)} ${item.step || ''} · ${item.message || ''}`).map(escapeHtml).join('\n')}</pre>
      ` : ''}
    </section>
  `;
}

function dsExtractionStatusLabel(status) {
  const labels = {
    passed_internal_check: '通过',
    passed_with_warnings: '带警告',
    needs_manual_review: '需人工复核',
    failed: '失败',
    running: '运行中',
  };
  return labels[status] || formatRunStatus(status);
}

function dsExtractionStatusClass(status) {
  if (status === 'passed_internal_check') return 'is-complete';
  if (status === 'passed_with_warnings' || status === 'needs_manual_review' || status === 'running') return 'is-pending';
  if (status === 'failed') return 'is-missing';
  return 'is-indexed';
}

async function loadRequirementAudit(customerId = state.selectedCustomer) {
  const id = customerId || $('#requirement-customer-input').value.trim();
  if (id) $('#requirement-customer-input').value = id;
  const params = id ? `?customerId=${encodeURIComponent(id)}` : '';
  renderRequirementAudit(await api(`/api/requirement-audit${params}`));
}

function renderSearchResults(payload) {
  $('#search-results-panel').hidden = false;
  if (!payload.results.length) {
    $('#search-results').innerHTML = '<div class="empty">没有匹配结果</div>';
    return;
  }
  $('#search-results').innerHTML = payload.results.map((group) => `
    <div class="result-group">
      <strong><code>${group.tableName}</code> · ${group.dictionary?.businessName || ''}</strong>
      <table>
        <tbody>
          ${group.rows.map((row) => `
            <tr><td>${Object.entries(row).slice(0, 6).map(([k, v]) => `<b>${k}</b>: ${stringifyCell(v)}`).join('<br>')}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');
}

async function runGlobalSearch() {
  const q = $('#global-search').value.trim();
  if (!q) return;
  renderSearchResults(await api(`/api/search?q=${encodeURIComponent(q)}`));
}

async function loadOverview() {
  setHealth(false, '读取中');
  await loadLifecyclePayload();
  state.overview = await api('/api/overview');
  $('#db-subtitle').textContent = state.overview.database.businessName;
  renderKpis(state.overview);
  renderDsMigrationOverview(state.overview);
  renderBars($('#status-chart'), state.overview.charts.valueStatuses);
  renderBars($('#rfm-chart'), state.overview.charts.rfm);
  renderSections(state.overview.charts.sections);
  renderEntityList();
  renderDictionary();
  if (!state.selectedEntity) state.selectedEntity = 'customer_profile_snapshot';
  await loadTable(state.selectedEntity, 0);
  await renderCustomers();
  await loadRequirementAudit(state.selectedCustomer);
  const initialView = window.location.hash.replace('#', '');
  if (initialView && ALLOWED_MAIN_VIEWS.has(initialView) && document.getElementById(initialView)) switchView(initialView, false);
  setHealth(true, 'MySQL 已连接');
}

async function loadLiveArchiveOverview() {
  setHealth(false, '连接中');
  const initialView = window.location.hash.replace('#', '') || 'customers';
  const viewName = ALLOWED_MAIN_VIEWS.has(initialView) && document.getElementById(initialView)
    ? initialView
    : 'customers';
  $$('.nav-button').forEach((button) => button.classList.toggle('is-active', button.dataset.view === viewName));
  syncLiveArchiveNavState(viewName);
  $$('.view').forEach((view) => view.classList.toggle('is-active', view.id === viewName));
  try {
    if (viewName === 'customers') {
      await renderCustomers();
    } else if (viewName === 'lifecycle') {
      await loadLifecyclePayload();
    }
    await api(PHONE_BATCH_STATUS_API);
    setHealth(true, '内网已连接');
  } catch (error) {
    setHealth(false, '连接异常');
    showFloatingError(error.message);
  }
}

function bindEvents() {
  $$('.nav-button').forEach((button) => {
    button.addEventListener('click', () => {
      const viewName = button.dataset.view;
      if (IS_LIVE_ARCHIVE_MODE && ['customers', 'lifecycle'].includes(viewName)) {
        switchView(viewName);
        return;
      }
      switchView(viewName);
    });
  });
  if (IS_LIVE_ARCHIVE_MODE) {
    $$('.nav-link[href^="/?archiveSource=live#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const viewName = String(link.getAttribute('href') || '').split('#')[1] || 'customers';
        if (!ALLOWED_MAIN_VIEWS.has(viewName)) return;
        event.preventDefault();
        switchView(viewName);
      });
    });
  }
  $('#refresh-button').addEventListener('click', loadOverview);
  const resetProfileStrategyMethodology = () => {
    state.lifecyclePayload = null;
    state.lifecycleBatch20 = null;
    state.profileStrategyMethodology = null;
    state.databaseAnalysisTrainingPack = null;
    state.selectedAiInsightCustomerId = null;
    state.chenSceneUserMdFixture = null;
  };
  const reloadProfileStrategyMethodology = () => {
    resetProfileStrategyMethodology();
    loadProfileStrategyMethodologyOnly({ force: true });
  };
  const reloadLifecycle = () => {
    resetProfileStrategyMethodology();
    loadLifecyclePayload();
  };
  const profileStrategySyncButton = $('#open-profile-strategy-sync');
  if (profileStrategySyncButton) profileStrategySyncButton.hidden = !IS_LIVE_ARCHIVE_MODE;
  $('#reload-methodology')?.addEventListener('click', reloadProfileStrategyMethodology);
  $('#reload-lifecycle')?.addEventListener('click', reloadLifecycle);
  profileStrategySyncButton?.addEventListener('click', openProfileStrategySyncModal);
  $('#close-profile-strategy-sync')?.addEventListener('click', closeProfileStrategySyncModal);
  $('#reload-profile-strategy-sync-options')?.addEventListener('click', loadProfileStrategySyncOptions);
  $('#submit-profile-strategy-sync')?.addEventListener('click', submitProfileStrategySyncRequest);
  $$('input[name="profile-strategy-sync-mode"]').forEach((input) => {
    input.addEventListener('change', handleProfileStrategySyncModeChange);
  });
  $('#reload-deepseek-results')?.addEventListener('click', () => {
    state.latestLifecycleAgentRun = null;
    state.latestLifecycleAgentRunIndex = null;
    loadLatestLifecycleAgentRun();
  });
  $('#run-deepseek-results')?.addEventListener('click', runDeepseekResults);
  $('#sync-deepseek-h5-review')?.addEventListener('click', syncDeepseekResultsToH5Review);
  $('#stop-deepseek-results')?.addEventListener('click', stopDeepseekResults);
  $('#clear-deepseek-results')?.addEventListener('click', clearDeepseekResults);
  $('#reload-deepseek-h5-review')?.addEventListener('click', () => {
    state.latestLifecycleAgentRun = null;
    state.latestLifecycleAgentRunIndex = null;
    loadLatestLifecycleAgentRun();
  });
  $('#connect-ds-extraction-sources')?.addEventListener('click', connectDsExtractionSources);
  $('#refresh-ds-extraction-check')?.addEventListener('click', refreshDsExtractionCheck);
  $('#validate-ds-extraction-check')?.addEventListener('click', validateDsExtractionTitleAlignment);
  $('#run-ds-extraction-check')?.addEventListener('click', runDsExtractionCheck);
  $('#stop-ds-extraction-check')?.addEventListener('click', stopDsExtractionCheck);
  $('#clear-ds-extraction-check')?.addEventListener('click', clearDsExtractionCheck);
  $('#refresh-ds-v3-panorama')?.addEventListener('click', loadDsV3Panorama);
  $('#run-ds-v3-random')?.addEventListener('click', runDsV3RandomPanorama);
  $('#refresh-ds-profile-analysis')?.addEventListener('click', loadDsProfileAnalysis);
  $('#open-ds-profile-batch')?.addEventListener('click', openDsProfileBatchModal);
  $('#close-ds-profile-batch')?.addEventListener('click', closeDsProfileBatchModal);
  $('#reload-ds-profile-candidates')?.addEventListener('click', loadDsProfileCandidates);
  $('#ds-profile-include-existing')?.addEventListener('change', loadDsProfileCandidates);
  $('#run-ds-profile-selected')?.addEventListener('click', runSelectedDsProfileAnalysis);
  $('#refresh-rule-workbench')?.addEventListener('click', loadDsRuleWorkbench);
  $('#save-rule-workbench')?.addEventListener('click', saveDsRuleWorkbenchRule);
  $('#table-filter').addEventListener('input', renderEntityList);
  $('#table-search').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') loadTable(state.selectedEntity, 0);
  });
  $('#page-size').addEventListener('change', () => loadTable(state.selectedEntity, 0));
  $('#prev-page').addEventListener('click', () => loadTable(state.selectedEntity, Math.max(0, state.entityOffset - state.entityLimit)));
  $('#next-page').addEventListener('click', () => loadTable(state.selectedEntity, state.entityOffset + state.entityLimit));
  $('#load-customer').addEventListener('click', () => {
    handleCustomerLookup();
  });
  $('#live-extract-button')?.addEventListener('click', handleLiveArchiveExtract);
  $('#live-xizi-batch-button')?.addEventListener('click', handleXiziManagerBatchExtract);
  $('#live-xizi-update-button')?.addEventListener('click', () => handleXiziManagerBatchExtract({ mode: 'update_changed' }));
  $('#live-phone-extract-open')?.addEventListener('click', openLivePhoneExtractModal);
  $('#live-phone-extract-build')?.addEventListener('click', () => renderPhoneExtractFields($('#live-phone-extract-count')?.value || 1));
  $('#live-phone-extract-count')?.addEventListener('change', () => renderPhoneExtractFields($('#live-phone-extract-count')?.value || 1));
  $('#live-phone-extract-start')?.addEventListener('click', handleLivePhoneExtractStart);
  $$('[data-live-phone-modal-close]').forEach((button) => {
    button.addEventListener('click', closeLivePhoneExtractModal);
  });
  $('#live-extract-stop-button')?.addEventListener('click', handleLiveArchiveStopExtract);
  $('#customer-id-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') $('#load-customer').click();
  });
  $('#global-search').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') runGlobalSearch();
  });
  $('#global-search-button').addEventListener('click', runGlobalSearch);
  $('#load-requirement-audit').addEventListener('click', () => {
    const id = $('#requirement-customer-input').value.trim() || state.selectedCustomer;
    loadRequirementAudit(id);
  });
  $('#requirement-customer-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') $('#load-requirement-audit').click();
  });
  $('#requirement-filter').addEventListener('input', renderRequirementAuditList);
  $('#requirement-status-filter').addEventListener('change', renderRequirementAuditList);
  $('#close-search-results').addEventListener('click', () => {
    $('#search-results-panel').hidden = true;
  });
  $('#close-truth-detail').addEventListener('click', closeTruthDetail);
  $('#truth-detail-modal').addEventListener('click', (event) => {
    if (event.target.id === 'truth-detail-modal') closeTruthDetail();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.getElementById('profile-strategy-methodology-modal')) {
      closeProfileStrategyMethodologyModal();
      return;
    }
    if (event.key === 'Escape' && $('#profile-strategy-sync-modal') && !$('#profile-strategy-sync-modal').hidden) {
      closeProfileStrategySyncModal();
      return;
    }
    if (event.key === 'Escape' && $('#live-phone-extract-modal') && !$('#live-phone-extract-modal').classList.contains('is-hidden')) {
      closeLivePhoneExtractModal();
      return;
    }
    const archiveTimelineModal = document.querySelector('.customer-archive-timeline-modal');
    if (event.key === 'Escape' && archiveTimelineModal) {
      archiveTimelineModal.remove();
      return;
    }
    const customerChapterModal = document.querySelector('.customer-chapter-modal');
    if (event.key === 'Escape' && customerChapterModal) {
      closeCustomerChapterModal();
      return;
    }
    if (event.key === 'Escape' && !$('#truth-detail-modal').hidden) closeTruthDetail();
  });
  document.addEventListener('click', (event) => {
    if (event.target.id === 'profile-strategy-sync-modal') {
      closeProfileStrategySyncModal();
      return;
    }
    if (event.target.closest('[data-profile-methodology-edit]')) {
      openProfileStrategyMethodologyModal();
      return;
    }
    const methodologyTabBtn = event.target.closest('[data-methodology-tab]');
    if (methodologyTabBtn) {
      const tab = methodologyTabBtn.dataset.methodologyTab;
      if (tab && tab !== state.profileStrategyMethodologyTab) {
        state.profileStrategyMethodologyTab = tab;
        const panel = methodologyTabBtn.closest('.profile-strategy-methodology-panel');
        if (panel) {
          panel.querySelectorAll('[data-methodology-tab]').forEach((btn) => {
            const isActive = btn.dataset.methodologyTab === tab;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
          });
          panel.querySelectorAll('[data-methodology-pane]').forEach((pane) => {
            pane.classList.toggle('is-active', pane.dataset.methodologyPane === tab);
          });
        }
      }
      return;
    }
    if (event.target.closest('[data-profile-methodology-close]')) {
      closeProfileStrategyMethodologyModal();
      return;
    }
    if (event.target.closest('[data-profile-methodology-add-section]')) {
      addProfileMethodologyPsychologySection();
      return;
    }
    if (event.target.closest('[data-profile-methodology-save]')) {
      saveProfileStrategyMethodologyFromModal();
      return;
    }
    const profileEvolutionButton = event.target.closest('[data-profile-evolution-action]');
    if (profileEvolutionButton) {
      submitProfileStrategyEvolutionCandidateAction(
        profileEvolutionButton.dataset.profileEvolutionAction,
        profileEvolutionButton.dataset.candidateId,
      );
      return;
    }
    if (event.target.id === 'profile-strategy-methodology-modal') {
      closeProfileStrategyMethodologyModal();
      return;
    }
    const advisorButton = event.target.closest('.advisor-action-button');
    if (advisorButton) {
      submitAdvisorAction(advisorButton.dataset.reviewItemId, advisorButton.dataset.action);
      return;
    }
    const outcomeButton = event.target.closest('.outcome-action-button');
    if (outcomeButton) {
      submitInteractionOutcome(outcomeButton.dataset.testUnitId, outcomeButton.dataset.outcomeType);
      return;
    }
    const manualSendButton = event.target.closest('.manual-send-button');
    if (manualSendButton) {
      submitManualSend(manualSendButton.dataset.gateId, manualSendButton.dataset.sendChannel);
      return;
    }
    const adminTodoButton = event.target.closest('.admin-todo-button');
    if (adminTodoButton) {
      submitAdminTodo(adminTodoButton.dataset.todoId, adminTodoButton.dataset.action);
      return;
    }
    const adminSourceSyncButton = event.target.closest('.admin-source-sync-button');
    if (adminSourceSyncButton) {
      submitAdminSourceSync(adminSourceSyncButton.dataset.syncId, adminSourceSyncButton.dataset.syncDecision);
      return;
    }
    const adminSourceSyncExecutionButton = event.target.closest('.admin-source-sync-execution-button');
    if (adminSourceSyncExecutionButton) {
      submitAdminSourceSyncExecution(
        adminSourceSyncExecutionButton.dataset.sourceSyncEventId,
        adminSourceSyncExecutionButton.dataset.executionResult,
      );
      return;
    }
    const productCopyReviewButton = event.target.closest('.product-copy-review-button');
    if (productCopyReviewButton) {
      submitProductCopyReview(productCopyReviewButton.dataset.reviewQueueId, productCopyReviewButton.dataset.action);
      return;
    }
    const productClassificationReviewButton = event.target.closest('.product-classification-review-button');
    if (productClassificationReviewButton) {
      submitProductClassificationReview(
        productClassificationReviewButton.dataset.reviewQueueId,
        productClassificationReviewButton.dataset.reviewAction,
      );
      return;
    }
    const h5PublishReviewButton = event.target.closest('.h5-publish-review-button');
    if (h5PublishReviewButton) {
      submitH5PublishReview(h5PublishReviewButton.dataset.h5GateId, h5PublishReviewButton.dataset.action);
      return;
    }
    const h5PublishExecutionButton = event.target.closest('.h5-publish-execution-button');
    if (h5PublishExecutionButton) {
      submitH5PublishExecution(
        h5PublishExecutionButton.dataset.h5PublishReviewEventId,
        h5PublishExecutionButton.dataset.publishChannel,
      );
      return;
    }
    const h5EngagementButton = event.target.closest('.h5-engagement-button');
    if (h5EngagementButton) {
      submitH5Engagement(
        h5EngagementButton.dataset.h5PublishExecutionEventId,
        h5EngagementButton.dataset.engagementType,
      );
      return;
    }
    const h5FormalOutcomeButton = event.target.closest('.h5-formal-outcome-button');
    if (h5FormalOutcomeButton) {
      submitH5FormalOutcome(
        h5FormalOutcomeButton.dataset.bridgeEventId,
        h5FormalOutcomeButton.dataset.formalOutcomeType,
      );
      return;
    }
    const h5PostFormalFollowupButton = event.target.closest('.h5-post-formal-followup-button');
    if (h5PostFormalFollowupButton) {
      submitH5PostFormalFollowup(
        h5PostFormalFollowupButton.dataset.followupId,
        h5PostFormalFollowupButton.dataset.followupActionType,
      );
      return;
    }
    const h5NoConversionReviewButton = event.target.closest('.h5-no-conversion-review-button');
    if (h5NoConversionReviewButton) {
      submitH5NoConversionReview(
        h5NoConversionReviewButton.dataset.reviewQueueId,
        h5NoConversionReviewButton.dataset.reviewAction,
        h5NoConversionReviewButton.dataset.reasonCode,
      );
      return;
    }
    const dsExtractionCustomerButton = event.target.closest('.ds-extraction-customer-button');
    if (dsExtractionCustomerButton) {
      selectDsExtractionCustomer(dsExtractionCustomerButton.dataset.dsExtractionCustomer);
      return;
    }
    const liveCompletedCustomerButton = event.target.closest('[data-live-completed-customer]');
    if (liveCompletedCustomerButton) {
      selectCustomerArchiveCustomer(liveCompletedCustomerButton.dataset.liveCompletedCustomer);
      return;
    }
    const dsTruthRepairButton = event.target.closest('.ds-truth-repair-button');
    if (dsTruthRepairButton) {
      runDsTruthRepairCheck(dsTruthRepairButton.dataset.dsTruthRepairCustomer);
      return;
    }
    const deepseekRunCustomerButton = event.target.closest('[data-deepseek-run-customer]');
    if (deepseekRunCustomerButton) {
      selectDeepSeekRunCustomer(deepseekRunCustomerButton.dataset.deepseekRunCustomer);
      return;
    }
    const aiInsightCustomerButton = event.target.closest('.ai-insight-customer-button');
    if (aiInsightCustomerButton) {
      if (aiInsightCustomerButton.dataset.profileStrategyCaseId) {
        const selected = state.profileStrategyCenterAnalyses.find((item) => item.sampleId === aiInsightCustomerButton.dataset.profileStrategyCaseId);
        if (selected) {
          state.profileStrategyCenterSelectedCaseId = selected.sampleId;
          renderChenLifecycleAgentAnalysis(selected);
        }
        return;
      }
      if (aiInsightCustomerButton.dataset.chenLifecycleAgent) {
        if (state.chenSceneUserMdFixture) {
          renderChenLifecycleAgentAnalysis(state.profileStrategyCenterAnalysis || buildChenLifecycleAgentAnalysis(state.chenSceneUserMdFixture));
        }
        return;
      }
      if (state.databaseAnalysisTrainingPack) {
        renderAiTrainingPack(state.databaseAnalysisTrainingPack, aiInsightCustomerButton.dataset.customerId);
      }
      return;
    }
    const mdEvidenceButton = event.target.closest('.md-evidence-detail-button');
    const archiveRefButton = event.target.closest('.archive-ref-badge');
    if (archiveRefButton) {
      const pointId = archiveRefButton.dataset.archiveRef;
      const activeChapterModal = archiveRefButton.closest('.customer-chapter-modal');
      if (activeChapterModal) {
        const target = pointId
          ? activeChapterModal.querySelector(`[data-archive-point-ref="${CSS.escape(pointId)}"]`) || activeChapterModal.querySelector('.customer-chapter-row, .archive-block-summary')
          : activeChapterModal.querySelector('.customer-chapter-row, .archive-block-summary');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.classList.add('is-archive-ref-highlighted');
          window.setTimeout(() => target.classList.remove('is-archive-ref-highlighted'), 2000);
        }
        return;
      }
      const card = archiveRefButton.closest('.customer-chapter-card');
      if (card?.dataset?.customerChapterOpen && state.chenSceneUserMdFixture) {
        openCustomerChapterModal(state.chenSceneUserMdFixture, Number(card.dataset.customerChapterOpen || 0), pointId);
        return;
      }
      if (card && 'open' in card) card.open = true;
      const target = pointId
        ? document.querySelector(`[data-archive-point-ref="${CSS.escape(pointId)}"]`) || card?.querySelector('.customer-chapter-row, .archive-block-summary')
        : card?.querySelector('.customer-chapter-row, .archive-block-summary');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('is-archive-ref-highlighted');
        window.setTimeout(() => target.classList.remove('is-archive-ref-highlighted'), 2000);
      }
      return;
    }
    if (mdEvidenceButton) {
      const sourceMap = mdEvidenceButton.dataset.mdEvidenceScope === 'ds-v3'
        ? state.dsV3MdEvidenceDetails
        : state.mdEvidenceDetails;
      const item = sourceMap.get(mdEvidenceButton.dataset.mdEvidenceKey);
      if (item) renderMdEvidenceDetail(item);
      return;
    }
    const ruleWorkbenchButton = event.target.closest('.rule-workbench-rule-button');
    if (ruleWorkbenchButton) {
      selectDsRuleWorkbenchRule(ruleWorkbenchButton.dataset.ruleId);
      return;
    }
    const button = event.target.closest('.truth-detail-button');
    if (!button) return;
    const item = state.detailItems.get(button.dataset.detailKey);
    if (item) renderTruthDetail(item);
  });
}

bindEvents();
if (IS_LIVE_ARCHIVE_MODE) {
  document.body.classList.add('is-live-archive-customers');
  const eyebrow = document.querySelector('#customers .eyebrow');
  const heading = document.querySelector('#customers h2');
  if (eyebrow) eyebrow.textContent = 'SCENE 1 USER FILE CHECK · AGENT LIVE';
  if (heading) heading.textContent = '用户全景档案（Agent 实盘）';
  const lifecycleEyebrow = document.querySelector('#lifecycle .eyebrow');
  const lifecycleHeading = document.querySelector('#lifecycle h2');
  if (lifecycleEyebrow) lifecycleEyebrow.textContent = 'LIFECYCLE INTERACTION ENGINE · AGENT LIVE';
  if (lifecycleHeading) lifecycleHeading.textContent = '用户画像分析｜策略中心（Agent 实盘）';
}
window.addEventListener('storage', (event) => {
  if (event.key !== ADVISOR_ARCHIVE_DISPUTES_STORAGE_KEY) return;
  refreshAdvisorArchiveDisputesState();
  if (window.location.hash.replace('#', '') === 'customers' && state.selectedCustomer) {
    renderCustomers().catch((error) => showFloatingError(error.message));
  }
});
if (IS_LIVE_ARCHIVE_MODE) {
  window.addEventListener('hashchange', () => {
    const viewName = window.location.hash.replace('#', '') || 'customers';
    if (ALLOWED_MAIN_VIEWS.has(viewName) && document.getElementById(viewName)) {
      switchView(viewName, false);
    }
  });
}
const bootInitialView = window.location.hash.replace('#', '');
if (IS_LIVE_ARCHIVE_MODE) {
  loadLiveArchiveOverview().catch((error) => {
    setHealth(false, '连接异常');
    showFloatingError(error.message);
  });
} else {
  if (bootInitialView && ALLOWED_MAIN_VIEWS.has(bootInitialView) && document.getElementById(bootInitialView)) switchView(bootInitialView, false);
  loadOverview().catch((error) => {
    setHealth(false, '连接失败');
    loadLifecyclePayload();
    const initialView = window.location.hash.replace('#', '');
    if (initialView && ALLOWED_MAIN_VIEWS.has(initialView) && document.getElementById(initialView)) switchView(initialView, false);
    showFloatingError(error.message);
  });
}

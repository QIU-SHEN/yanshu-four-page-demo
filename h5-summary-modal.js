(function () {
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };

  var TEMPLATES = {
    visual_detection: { name: '肤况检测图谱卡', desc: '检测发现 / 六维肤况 / 医生建议' },
    text_review: { name: '皮肤状态复盘卡', desc: '用文字温和解释当前状态和复盘理由' },
    light_action_plan: { name: '轻量观察计划卡', desc: '给客户低压力的观察与下一步计划' }
  };

  var MOCK_FALLBACK = {
    customerId: '',
    customerName: '张三',
    templateType: 'visual_detection',
    copy: {
      reportTitle: '2025年12月1日 颜值报告',
      customerName: '张三',
      skinType: '混合偏干',
      doctorName: '江晓玲',
      showDoctor: true,
      diagnosisAdvice: '建议结合当前肤况做稳定观察和复盘，后续由顾问根据护理反馈调整维养节奏。',
      lastCareTitle: '超光子维护',
      currentPurposeTitle: '肤况确认'
    },
    cskin: {
      detectedAt: '2025-12-01',
      cskinRecordId: 'mock-cskin-20251201',
      radarScores: { redspot: 62, blackspot: 72, macula: 56, wrinkle: 58, pore: 62, porphyrin: 48 }
    },
    timeline: {
      lastTreatmentDate: '2025-10-31',
      recommendedReviewDate: '2025-11-30',
      today: '2025-12-01',
      overdueDays: 31,
      daysSinceLastVisit: 61,
      doctorAdviceDays: 30
    }
  };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function flat(payload) {
    return payload && payload.data ? payload.data : payload;
  }

  function normalizeDateLabel(value) {
    if (!value) return '';
    var raw = String(value).trim();
    var match = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (!match) return raw;
    return match[1] + '年' + Number(match[2]) + '月' + Number(match[3]) + '日';
  }

  function buildReportTitle(detectedAt) {
    var label = normalizeDateLabel(detectedAt);
    return label ? label + '颜值报告' : '颜值报告';
  }

  function normalizeReportTitle(value) {
    return String(value || '').replace(/\s+颜值报告$/, '颜值报告');
  }

  function renderReportTitle(value) {
    var title = normalizeReportTitle(value);
    var marker = '颜值报告';
    var index = title.indexOf(marker);
    if (index < 0) return esc(title);
    var datePart = title.slice(0, index).trim();
    return '<span class="h5-vd-title-date">' + esc(datePart) + '</span><span class="h5-vd-title-report">' + esc(marker) + '</span>';
  }

  function deriveRadarScores(data) {
    var source = (data && data.cskin && data.cskin.radarScores) || {};
    return {
      redspot: Number(source['红区'] || source.redspot || 60),
      blackspot: Number(source['黑斑'] || source.blackspot || 60),
      macula: Number(source['黄斑'] || source.macula || 45),
      wrinkle: Number(source['皱纹'] || source.wrinkle || 35),
      pore: Number(source['毛孔'] || source.pore || 50),
      porphyrin: Number(source['紫质'] || source.porphyrin || 25)
    };
  }

  var RK = window.H5ReviewKit;
  var iconSvg = RK ? RK.iconSvg : function () { return ''; };
  var renderRadarBlock = RK ? RK.renderCskinRadarBlock : function () { return ''; };
  var renderTimeline = RK ? RK.renderTreatmentTimelineSvg : function () { return ''; };
  var h5Footer = RK ? RK.h5Footer : function () { return '<footer class="h5-summary-generated-footer">由顾问为您整理 · 颜术</footer>'; };
  var html2canvasLoadPromise = null;
  var skinTypeAnalysisCache = new Map();

  var state = {
    open: false,
    customerId: '',
    customerName: '',
    cskinRecordId: '',
    template: 'visual_detection',
    data: null,
    copies: {
      visual_detection: null,
      text_review: {
        templateType: 'text_review',
        mainTitle: '最近皮肤状态，可以轻轻复盘一下了',
        subTitle: '基于你的过往维养记录整理',
        currentStatusSummary: '皮肤状态整体稳定，局部偶尔有状态变化。建议先做一次轻量复盘，确认当前阶段的重点是稳定还是调整。',
        observedSignals: ['肤色整体通透度尚可', '局部偶尔有轻微不适感', '需更关注换季过渡期的稳定'],
        whyNow: ['距离上次护理已过一段时间', '当前季节转换，皮肤状态可能有变化', '此时做状态确认不会带来过度护理的压力'],
        gentleSuggestion: '建议在接下来一两周做一次轻量状态复盘，由顾问帮助确认当前适合的护理方向。',
        bottomNote: '这不是项目推荐，而是一次轻量的状态确认'
      },
      light_action_plan: {
        templateType: 'light_action_plan',
        mainTitle: '给皮肤一个轻量观察计划',
        subTitle: '先看状态，再决定是否需要调整维养节奏',
        oneSentenceStatus: '当前皮肤整体状态稳定，适合进入一次低压力的观察期。',
        observationPoints: [
          { title: '肤色状态', text: '观察最近一两周肤色均匀度和光泽感的变化' },
          { title: '稳定程度', text: '留意换季期间是否有干燥、泛红或敏感加重' },
          { title: '护理反馈', text: '记录上次护理后的感受，看是否需要在下次做微调' }
        ],
        lightPlanSteps: [
          { stepTitle: '先观察', stepText: '自然观察 1~2 周，不急于做项目决策' },
          { stepTitle: '再复盘', stepText: '与顾问一起回看观察期的皮肤变化' },
          { stepTitle: '再决定', stepText: '根据观察结果决定是否调整维养节奏' }
        ],
        bottomNote: '不急着决定项目，先把当前状态看清楚'
      }
    },
    busy: false,
    skinTypeBusy: false,
    skinTypeAnalysisKey: '',
    message: '',
    messageType: '',
    lastSavedOutput: null,
    skinTypeTraceOpen: false
  };

  function ensureModalShell() {
    if ($('#h5-summary-modal')) return;
    var shell = document.createElement('section');
    shell.id = 'h5-summary-modal';
    shell.className = 'h5-summary-modal';
    shell.hidden = true;
    shell.setAttribute('role', 'dialog');
    shell.setAttribute('aria-modal', 'true');
    shell.setAttribute('aria-labelledby', 'h5-summary-title');
    shell.innerHTML = '' +
      '<div class="h5-summary-modal-mask" data-h5-summary-close></div>' +
      '<div class="h5-summary-dialog">' +
      '  <div class="h5-summary-head">' +
      '    <h3 id="h5-summary-title">生成客户 H5 总结图</h3>' +
      '    <button type="button" class="h5-summary-head-close" data-h5-summary-close>&times;</button>' +
      '  </div>' +
      '  <div class="h5-summary-tabs">' +
      '    <button class="h5-summary-tab is-active" data-template="visual_detection">肤况检测图谱卡<span class="h5-summary-tab-desc">检测发现 / 六维肤况 / 医生建议</span></button>' +
      '    <button class="h5-summary-tab" data-template="text_review">皮肤状态复盘卡<span class="h5-summary-tab-desc">文字温和解释当前状态</span></button>' +
      '    <button class="h5-summary-tab" data-template="light_action_plan">轻量观察计划卡<span class="h5-summary-tab-desc">低压力观察 / 下一步</span></button>' +
      '  </div>' +
      '  <div class="h5-summary-body">' +
      '    <div class="h5-summary-preview">' +
      '      <div class="h5-summary-phone">' +
      '        <div class="h5-summary-phone-topbar"><span><img src="./assets/yesskin-logo.png" alt="YESSKIN" /></span><span>STEP 01 / 01</span></div>' +
      '        <div class="h5-summary-phone-body" id="h5-summary-preview-body"></div>' +
      '        <div class="h5-summary-phone-footer">Privacy Policy · Terms</div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="h5-summary-editor" id="h5-summary-editor-area"></div>' +
      '  </div>' +
      '  <div class="h5-summary-actions">' +
      '    <span class="status-text" id="h5-summary-status"></span>' +
      '    <a class="h5-summary-download" id="h5-summary-download-link" href="#" download hidden>下载图片</a>' +
      '    <button type="button" data-h5-summary-close>关闭</button>' +
      '    <button type="button" class="primary" id="h5-summary-capture-btn">生成图片</button>' +
      '  </div>' +
      '</div>' +
      '<div class="h5-skin-trace-modal" id="h5-skin-trace-modal" hidden>' +
      '  <div class="h5-skin-trace-mask" data-skin-trace-close></div>' +
      '  <section class="h5-skin-trace-dialog" role="dialog" aria-modal="true" aria-labelledby="h5-skin-trace-title">' +
      '    <button type="button" class="h5-skin-trace-close" data-skin-trace-close>&times;</button>' +
      '    <div id="h5-skin-trace-content"></div>' +
      '  </section>' +
      '</div>';
    document.body.appendChild(shell);
  }

  function api(path, options) {
    return fetch(path, options).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok) throw new Error(body.error || body.message || '请求失败');
        return body;
      });
    });
  }

  function syncTemplateDefaultsFromData() {
    var vd = state.copies.visual_detection || {};
    var name = vd.customerName || state.customerName || '';
    if (name) {
      state.copies.text_review.mainTitle = name + '，最近皮肤状态可以复盘一下了';
      state.copies.light_action_plan.mainTitle = '给' + name + '的轻量观察计划';
      state.copies.light_action_plan.subTitle = name + '，先看状态，再决定是否需要调整维养节奏';
    }
  }

  function normalizeVisualDetectionCopy(rawData) {
    var data = flat(rawData) || {};
    var copy = Object.assign({}, data.copy || {});
    var detectedAt = (data.cskin && data.cskin.detectedAt) || copy.detectedAt || '';
    if (!copy.reportTitle) copy.reportTitle = buildReportTitle(detectedAt);
    copy.reportTitle = normalizeReportTitle(copy.reportTitle);
    if (!copy.customerName) copy.customerName = data.customerName || state.customerName || '';
    if (!copy.skinType) copy.skinType = '未记录';
    if (!copy.currentPurposeTitle) copy.currentPurposeTitle = '肤况确认';
    if (!copy.lastCareTitle) copy.lastCareTitle = '近期护理记录';
    if (!copy.diagnosisAdvice) copy.diagnosisAdvice = '建议结合当前肤况做稳定观察和复盘，后续由顾问根据护理反馈调整维养节奏。';
    copy.showDoctor = Boolean(copy.showDoctor && copy.doctorName);
    return copy;
  }

  function skinTypeRadarEvidence(data) {
    var cskin = (data && data.cskin) || {};
    var scores = cskin.radarScores || {};
    if (!scores || typeof scores !== 'object') return '';
    var parts = Object.keys(scores).map(function (label) {
      var score = Number(scores[label]);
      return Number.isFinite(score) ? (label + ' ' + Math.round(score)) : '';
    }).filter(Boolean);
    return parts.length ? ('CSKIN 六维检测：' + parts.join('、')) : '';
  }

  function uniqueSkinTypeInputs(values) {
    return safeArray(values).map(function (value) {
      return String(value || '').replace(/\s+/g, ' ').trim();
    }).filter(function (value, index, list) {
      return value && list.indexOf(value) === index;
    }).slice(0, 12);
  }

  function ensureSkinTypeTrace(data, copy) {
    if (!data || typeof data !== 'object') return {};
    var trace = Object.assign({}, data.skinTypeTrace || {});
    var inputs = safeArray(trace.inputTexts).slice();
    if (copy && copy.diagnosisAdvice) inputs.push(copy.diagnosisAdvice);
    var radarEvidence = skinTypeRadarEvidence(data);
    if (radarEvidence) inputs.push(radarEvidence);
    trace.inputTexts = uniqueSkinTypeInputs(inputs);
    trace.explicitSkinType = String(trace.explicitSkinType || '').trim();
    trace.output = String(trace.output || (copy && copy.skinType) || '未记录').trim();
    trace.outputSource = trace.outputSource || 'server_or_current_task_fallback';
    trace.prompt = trace.prompt || '请基于客户皮肤检测、医生诊断、画像摘要和已加载的任务证据，生成一个不超过 8 个字的客户可见肤况类型标签。显式肤质原值优先；没有原值时只做保守归纳，不编造油、干、敏。';
    trace.rules = safeArray(trace.rules).length ? safeArray(trace.rules) : [
      '显式皮肤类型 / 肤质原值优先。',
      '没有显式原值时，仅从检测、诊断和已审核摘要中做短标签归纳。',
      '不把需求类型、生命周期、性别、RFM 或其他内部标签当作皮肤类型。',
      '证据不足时输出“未记录”，不做医疗承诺。'
    ];
    data.skinTypeTrace = trace;
    return trace;
  }

  function normalizeSkinTypeLabel(value) {
    var text = String(value || '').trim()
      .replace(/^[“”"'`]+|[“”"'`]+$/g, '')
      .replace(/^(?:皮肤类型|肤质|肤况类型|输出标签)\s*[=:：-]\s*/i, '')
      .split(/[\n。；;]/)[0]
      .trim();
    if (!text) return '';
    return Array.from(text).slice(0, 8).join('');
  }

  function usableSkinTypeLabel(value) {
    var text = normalizeSkinTypeLabel(value);
    if (!text || text === '未记录') return '';
    if (/^(?:诉求待确认|阶段待确认|肤况待分析|肤况待确认|状态观察型|维养型客户|治疗型客户|整全护肤型客户|男|女|男性|女性)$/.test(text)) return '';
    if (/RFM|非\s*VIP|流失期|活跃期|生命周期/i.test(text)) return '';
    return text;
  }

  function conservativeSkinTypeValue(trace, copy) {
    return usableSkinTypeLabel(trace && trace.explicitSkinType)
      || usableSkinTypeLabel(copy && copy.skinType)
      || '肤况待确认';
  }

  function skinTypeEvidenceHash(value) {
    var text = String(value || '');
    var hash = 2166136261;
    for (var index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function currentSkinTypeAnalysisContext() {
    var data = state.data || {};
    var copy = state.copies.visual_detection || {};
    var trace = ensureSkinTypeTrace(data, copy);
    var inputs = uniqueSkinTypeInputs(trace.inputTexts);
    var explicit = String(trace.explicitSkinType || '').trim();
    var fallback = conservativeSkinTypeValue(trace, copy);
    var evidencePayload = {
      explicitSkinType: explicit,
      inputTexts: inputs,
      currentServerValue: String(copy.skinType || '').trim(),
      cskinRecordId: String((data.cskin && data.cskin.cskinRecordId) || state.cskinRecordId || '').trim()
    };
    return {
      data: data,
      copy: copy,
      trace: trace,
      inputs: inputs,
      explicit: explicit,
      fallback: fallback,
      cacheKey: [
        state.customerId || data.customerId || '',
        evidencePayload.cskinRecordId,
        skinTypeEvidenceHash(JSON.stringify(evidencePayload))
      ].join('::'),
      rawData: evidencePayload
    };
  }

  function cachedSkinTypeAnalysis(context) {
    if (skinTypeAnalysisCache.has(context.cacheKey)) return skinTypeAnalysisCache.get(context.cacheKey);
    var request = api('/api/backend/advisor-script/field-summaries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actor: 'h5_summary_skin_type_analysis',
        reviewItemId: (context.data.source && context.data.source.reviewItemId) || '',
        fieldKey: '皮肤类型',
        rule: [
          '输出一个客户可见的肤况类型短标签，不超过 8 个字。',
          '显式皮肤类型 / 肤质原值优先；没有原值时，只根据检测、诊断和画像摘要做保守归纳。',
          '不得把需求类型、客户类型、生命周期、性别、RFM 或内部标签当作皮肤类型。',
          '不得输出句子、解释或医疗承诺；证据不足时输出“未记录”。'
        ].join('\n'),
        rawData: context.rawData,
        fallbackSummary: context.fallback
      })
    }).then(function (payload) {
      var modelCall = payload.modelCall || {};
      var payloadLabel = usableSkinTypeLabel(payload.summary || (payload.fieldSummary && payload.fieldSummary.summary));
      var payloadSource = String(payload.summarySource || (payload.fieldSummary && payload.fieldSummary.summarySource) || '').trim();
      var outputSource = payloadLabel
        ? (payloadSource || (modelCall.status === 'generated' ? 'model' : 'advisor_field_summary_backend_fallback'))
        : (payloadSource === 'model'
          ? 'model_no_label_fallback'
          : (payloadSource || (modelCall.status === 'generated' ? 'model_invalid_fallback' : 'model_unavailable_fallback')));
      return {
        output: payloadLabel || context.fallback,
        outputSource: outputSource,
        modelCall: modelCall.status ? modelCall : { status: payloadLabel ? 'backend_fallback' : 'unknown' }
      };
    }).catch(function (error) {
      return {
        output: context.fallback,
        outputSource: 'model_failed_fallback',
        modelCall: { status: 'failed', message: String(error && error.message || error || '皮肤类型分析失败') }
      };
    });
    skinTypeAnalysisCache.set(context.cacheKey, request);
    return request;
  }

  function analyzeCurrentSkinType() {
    if (!state.data || !state.copies.visual_detection) return Promise.resolve(null);
    var context = currentSkinTypeAnalysisContext();
    if (!context.inputs.length && !context.explicit) {
      context.copy.skinType = context.fallback;
      context.trace.output = context.fallback;
      context.trace.outputSource = 'insufficient_evidence_fallback';
      context.trace.modelCall = { status: 'skipped_no_evidence', message: '当前未加载可用的皮肤检测、医生诊断或画像摘要。' };
      renderAll();
      return Promise.resolve(null);
    }
    state.skinTypeBusy = true;
    state.skinTypeAnalysisKey = context.cacheKey;
    state.message = '正在复用顾问页大模型分析皮肤类型...';
    state.messageType = '';
    renderAll();
    return cachedSkinTypeAnalysis(context).then(function (result) {
      if (state.skinTypeAnalysisKey !== context.cacheKey) return result;
      context.copy.skinType = result.output;
      context.trace.output = result.output;
      context.trace.outputSource = result.outputSource;
      context.trace.modelCall = result.modelCall;
      var modelGenerated = result.modelCall && result.modelCall.status === 'generated'
        && result.modelCall.outputAccepted !== false
        && result.outputSource === 'model';
      state.message = modelGenerated
        ? '皮肤类型已通过大模型分析生成，可继续编辑。'
        : '皮肤类型大模型分析未产生可用标签，已保留显式/服务端保守值。';
      state.messageType = modelGenerated ? 'is-success' : 'is-warning';
      return result;
    }).finally(function () {
      if (state.skinTypeAnalysisKey !== context.cacheKey) return;
      state.skinTypeBusy = false;
      renderAll();
    });
  }

  function applyIncomingData(rawData) {
    var data = flat(rawData) || {};
    state.data = data;
    state.customerId = data.customerId || state.customerId;
    state.customerName = data.customerName || state.customerName;
    state.cskinRecordId = (data.cskin && data.cskin.cskinRecordId) || state.cskinRecordId;
    state.copies.visual_detection = normalizeVisualDetectionCopy(data);
    ensureSkinTypeTrace(data, state.copies.visual_detection);
    syncTemplateDefaultsFromData();
  }

  function loadVDData() {
    state.busy = true;
    state.message = '';
    renderAll();
    var params = ['customerId=' + encodeURIComponent(state.customerId || '')];
    if (state.customerName) params.push('customerName=' + encodeURIComponent(state.customerName));
    if (state.cskinRecordId) params.push('cskinRecordId=' + encodeURIComponent(state.cskinRecordId));
    return api('/api/h5-summary/visual-detection/initial-data?' + params.join('&'))
      .then(function (payload) {
        applyIncomingData(payload);
        return analyzeCurrentSkinType();
      })
      .catch(function (error) {
        console.warn('[h5-summary-modal] initial-data fallback', error.message);
        applyIncomingData(MOCK_FALLBACK);
        state.message = '未取到实时数据，当前使用本地兜底样例。';
        state.messageType = 'is-warning';
      })
      .finally(function () {
        state.busy = false;
        renderAll();
      });
  }

  function normalizeOpenArgs(arg1, arg2, arg3) {
    if (typeof arg1 === 'object' && arg1) {
      return {
        customerId: arg1.customerId || '',
        customerName: arg1.customerName || '',
        cskinRecordId: arg1.cskinRecordId || '',
        initialData: arg1.initialData || null
      };
    }
    return {
      customerId: arg1 || '',
      customerName: arg2 || '',
      cskinRecordId: arg3 || '',
      initialData: null
    };
  }

  function open(arg1, arg2, arg3) {
    ensureModalShell();
    var payload = normalizeOpenArgs(arg1, arg2, arg3);
    state.customerId = payload.customerId;
    state.customerName = payload.customerName;
    state.cskinRecordId = payload.cskinRecordId;
    state.template = 'visual_detection';
    state.open = true;
    state.message = '';
    state.messageType = '';
    state.lastSavedOutput = null;
    state.skinTypeTraceOpen = false;
    state.skinTypeBusy = false;
    state.skinTypeAnalysisKey = '';
    if (payload.initialData) {
      applyIncomingData(payload.initialData);
      state.message = '已使用当前任务实时数据生成，可继续编辑。';
      state.messageType = 'is-success';
    }
    $('#h5-summary-modal').hidden = false;
    document.body.classList.add('h5-modal-open');
    renderAll();
    if (payload.initialData) analyzeCurrentSkinType();
    else loadVDData();
  }

  function close() {
    var modal = $('#h5-summary-modal');
    if (modal) modal.hidden = true;
    document.body.classList.remove('h5-modal-open');
    state.open = false;
    state.skinTypeTraceOpen = false;
  }

  function selectTemplate(type) {
    if (!TEMPLATES[type]) return;
    state.template = type;
    state.lastSavedOutput = null;
    renderAll();
  }

  function renderVD(copy, data) {
    var vd = copy || {};
    var cskin = (data && data.cskin) || {};
    var timeline = (data && data.timeline) || {};
    var overdue = Number(timeline.overdueDays || 0) > 0;
    var daysSince = timeline.daysSinceLastVisit || (timeline.lastTreatmentDate && timeline.today
      ? Math.floor((new Date(timeline.today) - new Date(timeline.lastTreatmentDate)) / 86400000)
      : 0);
    var timelineHtml = renderTimeline({
      lastVisitDate: timeline.lastTreatmentDate || cskin.detectedAt || '',
      today: timeline.today || new Date().toISOString().split('T')[0],
      daysSinceLastVisit: daysSince,
      doctorAdviceDays: timeline.doctorAdviceDays || 30
    });
    var radarHtml = renderRadarBlock(deriveRadarScores(data))
      .replace(/<p class="cskin-radar-source">[\s\S]*?<\/p>/, '')
      .replace(/依据：[^<]*/g, '');

    return '' +
      '<article class="h5-final-page h5-final-one h5-vd-final-card">' +
      '  <header class="h5-final-nav h5-vd-final-nav">' +
      '    <strong><img class="h5-final-logo" src="./assets/yesskin-logo.png" alt="YESSKIN 颜术" /></strong>' +
      '  </header>' +
      '  <section class="h5-final-hero h5-vd-report-hero">' +
      '    <h2>' + renderReportTitle(vd.reportTitle || buildReportTitle(cskin.detectedAt || '')) + '</h2>' +
      '    <div class="h5-vd-report-meta">' +
      '      <p><span>姓名：</span><strong>' + esc(vd.customerName || state.customerName || '') + '</strong></p>' +
      (vd.showDoctor ? '      <p class="h5-vd-doctor"><span>医生：</span><strong>' + esc(vd.doctorName || '') + '</strong></p>' : '') +
      '      <p><span>皮肤类型：</span><strong>' + esc(vd.skinType || '未记录') + '</strong></p>' +
      '    </div>' +
      '  </section>' +
      radarHtml +
      '  <section class="h5-vd-advice-stack">' +
      '    <section class="h5-vd-diagnosis-panel">' +
      '      <div class="h5-vd-diagnosis-title">诊断摘要</div>' +
      '      <p>' + esc(vd.diagnosisAdvice || '') + '</p>' +
      '    </section>' +
      '    <section class="h5-bento h5-vd-bento">' +
      '      <div class="h5-bento-card"><span>' + iconSvg('calendar_today') + ' 上次护理</span><strong>' + esc(vd.lastCareTitle || '') + '</strong></div>' +
      '      <div class="h5-bento-card"><span>' + iconSvg('monitoring') + ' 本次目的</span><strong>' + esc(vd.currentPurposeTitle || '肤况确认') + '</strong></div>' +
      '    </section>' +
      '  </section>' +
      '  <section class="h5-timeline-card" aria-label="治疗后时间轴">' +
      '    <div class="timeline-head">' +
      '      <span class="timeline-eyebrow">治疗后时间轴</span>' +
      '      <span class="timeline-tag">' + (overdue ? ('已逾期 ' + Number(timeline.overdueDays || 0) + ' 天') : '维养节奏内') + '</span>' +
      '    </div>' +
      timelineHtml +
      '  </section>' +
      h5Footer() +
      '</article>';
  }

  function renderTR(copy) {
    var tr = copy || {};
    return '' +
      '<div class="h5-tr-page">' +
      '  <header class="h5-final-nav"><strong><img src="./assets/yesskin-logo.png" alt="YESSKIN" style="height:16px"/></strong><span>STEP 01 / 01</span></header>' +
      '  <section class="h5-tr-hero"><h2>' + esc(tr.mainTitle) + '</h2><p>' + esc(tr.subTitle) + '</p></section>' +
      '  <div class="h5-tr-summary"><p>' + esc(tr.currentStatusSummary) + '</p></div>' +
      '  <div class="h5-tr-signals">' + safeArray(tr.observedSignals).map(function (item) {
        return '<div class="h5-tr-signal"><div class="h5-tr-signal-dot"></div><p>' + esc(item) + '</p></div>';
      }).join('') + '</div>' +
      '  <div class="h5-tr-why"><div class="h5-tr-why-title">为什么现在适合轻复盘</div>' + safeArray(tr.whyNow).map(function (item) {
        return '<div class="h5-tr-why-item">' + esc(item) + '</div>';
      }).join('') + '</div>' +
      '  <div class="h5-tr-suggestion"><p>' + esc(tr.gentleSuggestion) + '</p></div>' +
      h5Footer() +
      '</div>';
  }

  function renderLAP(copy) {
    var plan = copy || {};
    return '' +
      '<div class="h5-lap-page">' +
      '  <header class="h5-final-nav"><strong><img src="./assets/yesskin-logo.png" alt="YESSKIN" style="height:16px"/></strong><span>STEP 01 / 01</span></header>' +
      '  <section class="h5-lap-hero"><h2>' + esc(plan.mainTitle) + '</h2><p>' + esc(plan.subTitle) + '</p></section>' +
      '  <div class="h5-lap-status"><p>' + esc(plan.oneSentenceStatus) + '</p></div>' +
      '  <div class="h5-lap-points">' + safeArray(plan.observationPoints).map(function (item, index) {
        return '<div class="h5-lap-point"><div class="h5-lap-point-num">' + (index + 1) + '</div><div class="h5-lap-point-content"><h4>' + esc(item.title) + '</h4><p>' + esc(item.text) + '</p></div></div>';
      }).join('') + '</div>' +
      '  <div class="h5-lap-steps"><div class="h5-lap-steps-title">轻量三步计划</div>' + safeArray(plan.lightPlanSteps).map(function (item, index) {
        return '<div class="h5-lap-step"><div class="h5-lap-step-num">' + (index + 1) + '</div><div class="h5-lap-step-content"><strong>' + esc(item.stepTitle) + '</strong><span>' + esc(item.stepText) + '</span></div></div>';
      }).join('') + '</div>' +
      h5Footer() +
      '</div>';
  }

  function field(key, label, copy, kind) {
    var value = copy[key] || '';
    var labelHtml = key === 'skinType'
      ? '<button type="button" class="h5-summary-field-link" data-open-skin-type-trace>' + esc(label) + '<span>查看依据</span></button>'
      : '<label>' + esc(label) + '</label>';
    if (kind === 'textarea') return '<div class="h5-summary-field">' + labelHtml + '<textarea data-f="' + esc(key) + '" rows="3">' + esc(value) + '</textarea></div>';
    return '<div class="h5-summary-field">' + labelHtml + '<input data-f="' + esc(key) + '" value="' + esc(value) + '" /></div>';
  }

  function arrayField(key, label, copy) {
    return '<div class="h5-summary-field"><label>' + esc(label) + '</label>' + safeArray(copy[key]).map(function (value, index) {
      return '<input data-f="' + esc(key + '_' + index) + '" value="' + esc(value) + '" style="margin-bottom:4px" />';
    }).join('') + '</div>';
  }

  function observationFields(copy) {
    return safeArray(copy.observationPoints).map(function (_, index) {
      return '' +
        '<div class="h5-summary-field">' +
        '  <label>观察点' + (index + 1) + '标题</label><input data-f="op_' + index + '_t" />' +
        '  <label>内容</label><textarea data-f="op_' + index + '_x" rows="2"></textarea>' +
        '</div>';
    }).join('');
  }

  function stepFields(copy) {
    return safeArray(copy.lightPlanSteps).map(function (_, index) {
      return '' +
        '<div class="h5-summary-field">' +
        '  <label>步骤' + (index + 1) + '标题</label><input data-f="st_' + index + '_t" />' +
        '  <label>内容</label><input data-f="st_' + index + '_x" />' +
        '</div>';
    }).join('');
  }

  function renderEditor() {
    var copy = state.copies[state.template];
    if (!copy) return '<div class="h5-summary-empty">暂无编辑内容</div>';
    if (state.template === 'visual_detection') {
      return '' +
        '<h4>编辑文案</h4>' +
        field('reportTitle', '标题', copy) +
        field('customerName', '姓名', copy) +
        field('skinType', '皮肤类型', copy) +
        (copy.showDoctor ? field('doctorName', '医生', copy) : '') +
        field('diagnosisAdvice', '医生诊断及建议', copy, 'textarea') +
        field('lastCareTitle', '上次护理', copy) +
        field('currentPurposeTitle', '本次目的', copy);
    }
    if (state.template === 'text_review') {
      return '' +
        '<h4>编辑文案</h4>' +
        field('mainTitle', '主标题', copy) +
        field('subTitle', '副标题', copy) +
        field('currentStatusSummary', '状态摘要', copy, 'textarea') +
        arrayField('observedSignals', '观察信号', copy) +
        arrayField('whyNow', '现在适合轻复盘的原因', copy) +
        field('gentleSuggestion', '轻建议', copy, 'textarea') +
        field('bottomNote', '底部备注', copy);
    }
    return '' +
      '<h4>编辑文案</h4>' +
      field('mainTitle', '主标题', copy) +
      field('subTitle', '副标题', copy) +
      field('oneSentenceStatus', '一句话状态', copy, 'textarea') +
      observationFields(copy) +
      stepFields(copy) +
      field('bottomNote', '底部备注', copy);
  }

  function renderSkinTypeTrace() {
    ensureModalShell();
    var modal = $('#h5-skin-trace-modal');
    var content = $('#h5-skin-trace-content');
    if (!modal || !content) return;
    modal.hidden = !state.skinTypeTraceOpen;
    if (!state.skinTypeTraceOpen) {
      content.innerHTML = '';
      return;
    }
    var copy = state.copies.visual_detection || {};
    var trace = (state.data && state.data.skinTypeTrace) || {};
    var output = trace.output || copy.skinType || '未记录';
    var inputs = safeArray(trace.inputTexts);
    var rules = safeArray(trace.rules);
    var prompt = trace.prompt || '请基于客户皮肤检测、医生诊断、画像摘要和 230 项信息点，生成一个客户可见的短肤况类型标签。显式肤质原值优先；没有原值时只做保守归纳。';
    var explicit = trace.explicitSkinType || '';
    var inputsHtml = inputs.length
      ? '<ul class="h5-skin-trace-list">' + inputs.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>'
      : '<p class="h5-skin-trace-empty">暂无可追溯输入；当前可能来自手动编辑或本地兜底。</p>';
    var rulesHtml = rules.length
      ? '<ol class="h5-skin-trace-rules">' + rules.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ol>'
      : '<p class="h5-skin-trace-empty">暂无规则说明。</p>';
    content.innerHTML = '' +
      '<header class="h5-skin-trace-head">' +
      '  <span class="h5-skin-trace-kicker">皮肤类型总结依据</span>' +
      '  <h3 id="h5-skin-trace-title">当前总结：<strong>' + esc(output) + '</strong></h3>' +
      '  <p>这里展示接口本次返回的总结输入与规则。右侧输入框仍可手动修改客户可见文案。</p>' +
      '</header>' +
      '<section class="h5-skin-trace-block h5-skin-trace-result">' +
      '  <div><span>输出标签</span><strong>' + esc(output) + '</strong></div>' +
      '  <div><span>显式肤质原值</span><strong>' + esc(explicit || '未直接记录') + '</strong></div>' +
      '</section>' +
      '<section class="h5-skin-trace-block">' +
      '  <h4>总结输入</h4>' +
      inputsHtml +
      '</section>' +
      '<section class="h5-skin-trace-block">' +
      '  <h4>大致规则 / 提示词</h4>' +
      '  <div class="h5-skin-trace-prompt">' + esc(prompt) + '</div>' +
      rulesHtml +
      '</section>';
  }

  function syncEditor() {
    var copy = state.copies[state.template];
    if (!copy) return;
    if (state.template === 'visual_detection') {
      ['reportTitle', 'customerName', 'skinType', 'doctorName', 'diagnosisAdvice', 'lastCareTitle', 'currentPurposeTitle'].forEach(function (key) {
        var input = $('[data-f="' + key + '"]');
        if (input) copy[key] = input.value || '';
      });
      return;
    }
    if (state.template === 'text_review') {
      ['mainTitle', 'subTitle', 'currentStatusSummary', 'gentleSuggestion', 'bottomNote'].forEach(function (key) {
        var input = $('[data-f="' + key + '"]');
        if (input) copy[key] = input.value || '';
      });
      for (var i = 0; i < 3; i += 1) {
        var observed = $('[data-f="observedSignals_' + i + '"]');
        var whyNow = $('[data-f="whyNow_' + i + '"]');
        if (observed) copy.observedSignals[i] = observed.value || '';
        if (whyNow) copy.whyNow[i] = whyNow.value || '';
      }
      return;
    }
    ['mainTitle', 'subTitle', 'oneSentenceStatus', 'bottomNote'].forEach(function (key) {
      var input = $('[data-f="' + key + '"]');
      if (input) copy[key] = input.value || '';
    });
    for (var j = 0; j < 3; j += 1) {
      var opTitle = $('[data-f="op_' + j + '_t"]');
      var opText = $('[data-f="op_' + j + '_x"]');
      var stTitle = $('[data-f="st_' + j + '_t"]');
      var stText = $('[data-f="st_' + j + '_x"]');
      if (opTitle && copy.observationPoints[j]) copy.observationPoints[j].title = opTitle.value || '';
      if (opText && copy.observationPoints[j]) copy.observationPoints[j].text = opText.value || '';
      if (stTitle && copy.lightPlanSteps[j]) copy.lightPlanSteps[j].stepTitle = stTitle.value || '';
      if (stText && copy.lightPlanSteps[j]) copy.lightPlanSteps[j].stepText = stText.value || '';
    }
  }

  function fillEditorValues() {
    var copy = state.copies[state.template];
    if (!copy) return;
    if (state.template === 'visual_detection') {
      ['reportTitle', 'customerName', 'skinType', 'doctorName', 'diagnosisAdvice', 'lastCareTitle', 'currentPurposeTitle'].forEach(function (key) {
        var input = $('[data-f="' + key + '"]');
        if (input) input.value = copy[key] || '';
      });
      return;
    }
    if (state.template === 'text_review') {
      ['mainTitle', 'subTitle', 'currentStatusSummary', 'gentleSuggestion', 'bottomNote'].forEach(function (key) {
        var input = $('[data-f="' + key + '"]');
        if (input) input.value = copy[key] || '';
      });
      for (var i = 0; i < 3; i += 1) {
        var observed = $('[data-f="observedSignals_' + i + '"]');
        var whyNow = $('[data-f="whyNow_' + i + '"]');
        if (observed) observed.value = copy.observedSignals[i] || '';
        if (whyNow) whyNow.value = copy.whyNow[i] || '';
      }
      return;
    }
    ['mainTitle', 'subTitle', 'oneSentenceStatus', 'bottomNote'].forEach(function (key) {
      var input = $('[data-f="' + key + '"]');
      if (input) input.value = copy[key] || '';
    });
    for (var j = 0; j < 3; j += 1) {
      var opTitle = $('[data-f="op_' + j + '_t"]');
      var opText = $('[data-f="op_' + j + '_x"]');
      var stTitle = $('[data-f="st_' + j + '_t"]');
      var stText = $('[data-f="st_' + j + '_x"]');
      if (opTitle) opTitle.value = (copy.observationPoints[j] || {}).title || '';
      if (opText) opText.value = (copy.observationPoints[j] || {}).text || '';
      if (stTitle) stTitle.value = (copy.lightPlanSteps[j] || {}).stepTitle || '';
      if (stText) stText.value = (copy.lightPlanSteps[j] || {}).stepText || '';
    }
  }

  function bindEditorInputs() {
    var editor = $('#h5-summary-editor-area');
    $$('[data-f]', editor).forEach(function (node) {
      node.addEventListener('input', function () {
        syncEditor();
        renderPreviewOnly();
      });
    });
  }

  function loadScriptOnce(src) {
    return new Promise(function (resolve, reject) {
      var timer = window.setTimeout(function () {
        reject(new Error('截图组件加载超时'));
      }, 8000);
      function finish(callback) {
        window.clearTimeout(timer);
        callback();
      }
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        existing.addEventListener('load', function () { finish(resolve); }, { once: true });
        existing.addEventListener('error', function () { finish(function () { reject(new Error('截图组件加载失败')); }); }, { once: true });
        if (window.html2canvas) finish(resolve);
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = function () { finish(resolve); };
      script.onerror = function () {
        finish(function () { reject(new Error('截图组件加载失败')); });
      };
      document.head.appendChild(script);
    });
  }

  function ensureHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (!html2canvasLoadPromise) {
      html2canvasLoadPromise = loadScriptOnce('./vendor/html2canvas.min.js')
        .then(function () {
          if (!window.html2canvas) throw new Error('截图组件未初始化');
          return window.html2canvas;
        })
        .catch(function (error) {
          html2canvasLoadPromise = null;
          throw error;
        });
    }
    return html2canvasLoadPromise;
  }

  function inlineComputedStyles(sourceNode, targetNode) {
    if (!(sourceNode instanceof Element) || !(targetNode instanceof Element)) return;
    var computed = window.getComputedStyle(sourceNode);
    for (var i = 0; i < computed.length; i += 1) {
      var prop = computed[i];
      targetNode.style.setProperty(prop, computed.getPropertyValue(prop), computed.getPropertyPriority(prop));
    }
    if (sourceNode instanceof HTMLTextAreaElement) targetNode.textContent = sourceNode.value;
    if (sourceNode instanceof HTMLInputElement) targetNode.setAttribute('value', sourceNode.value);
    var sourceChildren = sourceNode.childNodes || [];
    var targetChildren = targetNode.childNodes || [];
    for (var j = 0; j < sourceChildren.length; j += 1) {
      inlineComputedStyles(sourceChildren[j], targetChildren[j]);
    }
  }

  function prepareForeignObjectClone(clone) {
    $$('img', clone).forEach(function (img) {
      var replacement = document.createElement('span');
      replacement.textContent = img.getAttribute('alt') || 'YESSKIN 颜术';
      replacement.setAttribute('style', img.getAttribute('style') || '');
      replacement.style.display = replacement.style.display || 'inline-flex';
      replacement.style.alignItems = 'center';
      replacement.style.color = replacement.style.color || '#5DB99D';
      replacement.style.fontWeight = replacement.style.fontWeight || '700';
      replacement.style.letterSpacing = replacement.style.letterSpacing || '0.04em';
      img.replaceWith(replacement);
    });
  }

  function captureWithHtml2Canvas(element) {
    return window.html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    }).then(function (canvas) {
      return canvas.toDataURL('image/png');
    });
  }

  function captureWithSvgForeignObject(element) {
    var rect = element.getBoundingClientRect();
    var width = Math.max(320, Math.ceil(rect.width));
    var height = Math.max(480, Math.ceil(rect.height));
    var clone = element.cloneNode(true);
    inlineComputedStyles(element, clone);
    prepareForeignObjectClone(clone);
    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    var wrapper = document.createElement('div');
    wrapper.appendChild(clone);
    var svg = '' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
      '  <foreignObject width="100%" height="100%">' + wrapper.innerHTML + '</foreignObject>' +
      '</svg>';
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        try {
          var canvas = document.createElement('canvas');
          canvas.width = width * 2;
          canvas.height = height * 2;
          var context = canvas.getContext('2d');
          context.scale(2, 2);
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, width, height);
          context.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/png'));
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = function () {
        reject(new Error('浏览器本地截图回退失败'));
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  function captureElementToPng(element) {
    return ensureHtml2Canvas()
      .then(function () {
        return captureWithHtml2Canvas(element);
      })
      .catch(function (error) {
        if (/截图组件|html2canvas|加载/.test(String(error && error.message || error))) {
          throw error;
        }
        console.warn('[h5-summary] html2canvas unavailable, fallback foreignObject', error);
        return captureWithSvgForeignObject(element);
      });
  }

  function savedImageFileName(record) {
    if (!record) return 'h5-summary.png';
    return record.imageFileName || ((record.id || 'h5-summary') + '.png');
  }

  function triggerSavedImageDownload(record) {
    if (!record || !(record.downloadUrl || record.imageUrl)) return;
    var link = document.createElement('a');
    link.href = record.downloadUrl || record.imageUrl;
    link.download = savedImageFileName(record);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function captureImage() {
    if (state.skinTypeBusy) {
      state.message = '皮肤类型仍在大模型分析中，完成后再生成图片。';
      state.messageType = 'is-warning';
      renderAll();
      return;
    }
    syncEditor();
    state.busy = true;
    state.message = '正在生成图片...';
    state.messageType = '';
    state.lastSavedOutput = null;
    renderAll();
    var element = $('#h5-summary-preview-body .h5-final-page, #h5-summary-preview-body .h5-tr-page, #h5-summary-preview-body .h5-lap-page') || $('#h5-summary-preview-body');
    if (!element) {
      state.busy = false;
      state.message = '未找到可截图区域';
      state.messageType = 'is-error';
      renderAll();
      return;
    }
    captureElementToPng(element)
      .then(function (imageBase64) {
        return api('/api/h5-summary/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: state.customerId,
            templateType: state.template,
            templateName: TEMPLATES[state.template].name,
            finalCopyJson: state.copies[state.template],
            imageBase64: imageBase64,
            source: 'h5_summary_modal'
          })
        });
      })
      .then(function (payload) {
        var record = payload.data || {};
        state.busy = false;
        state.lastSavedOutput = record;
        state.message = '图片已保存：' + (record.id || '保存成功') + ' · 点击右侧“下载图片”保存到本机';
        state.messageType = 'is-success';
        renderAll();
        triggerSavedImageDownload(record);
      })
      .catch(function (error) {
        state.busy = false;
        state.message = '生成失败：' + error.message;
        state.messageType = 'is-error';
        renderAll();
      });
  }

  function renderPreviewOnly() {
    ensureModalShell();
    var preview = $('#h5-summary-preview-body');
    if (preview) {
      if (state.template === 'visual_detection') {
        preview.innerHTML = state.data ? renderVD(state.copies.visual_detection, state.data) : '<div class="h5-summary-empty">正在读取肤况检测数据...</div>';
      } else if (state.template === 'text_review') {
        preview.innerHTML = renderTR(state.copies.text_review);
      } else {
        preview.innerHTML = renderLAP(state.copies.light_action_plan);
      }
    }
  }

  function renderAll() {
    ensureModalShell();
    var editor = $('#h5-summary-editor-area');
    var status = $('#h5-summary-status');
    var button = $('#h5-summary-capture-btn');
    var downloadLink = $('#h5-summary-download-link');
    $$('.h5-summary-tab').forEach(function (node) {
      node.classList.toggle('is-active', node.dataset.template === state.template);
    });

    renderPreviewOnly();
    if (editor) editor.innerHTML = renderEditor();
    if (status) {
      status.textContent = state.message || '';
      status.className = 'status-text ' + (state.messageType || '');
    }
    if (button) button.disabled = state.busy || state.skinTypeBusy;
    if (downloadLink) {
      var saved = state.lastSavedOutput;
      downloadLink.hidden = !saved || !(saved.downloadUrl || saved.imageUrl);
      if (saved) {
        downloadLink.href = saved.downloadUrl || saved.imageUrl || '#';
        downloadLink.download = savedImageFileName(saved);
        downloadLink.textContent = '下载图片';
      }
    }
    fillEditorValues();
    bindEditorInputs();
    renderSkinTypeTrace();
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-open-skin-type-trace]')) {
      state.skinTypeTraceOpen = true;
      renderSkinTypeTrace();
      return;
    }
    if (event.target.closest('[data-skin-trace-close]')) {
      state.skinTypeTraceOpen = false;
      renderSkinTypeTrace();
      return;
    }
    if (event.target.closest('[data-h5-summary-close]') || event.target.closest('.h5-summary-modal-mask')) {
      close();
      return;
    }
    var tab = event.target.closest('.h5-summary-tab');
    if (tab) {
      selectTemplate(tab.dataset.template);
      return;
    }
    if (event.target.closest('#h5-summary-capture-btn')) {
      captureImage();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && state.skinTypeTraceOpen) {
      state.skinTypeTraceOpen = false;
      renderSkinTypeTrace();
      return;
    }
    if (event.key === 'Escape' && state.open) close();
  });

  ensureModalShell();
  window.H5ThreeStyleSummaryModal = { open: open, close: close };
})();

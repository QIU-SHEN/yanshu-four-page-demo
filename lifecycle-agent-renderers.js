(function attachLifecycleAgentRenderers(global) {
  const branchLabels = {
    evidenceReadiness: '证据准备度',
    consumerProfile: '消费者画像',
    projectCycleRepurchase: '项目复购周期与稳固判断',
    coreMotivationDriver: '核心驱动因素',
    psychologyModel: '消费心理与行为阻碍',
    lifecycleDiagnosis: '生命周期诊断',
    opportunityScoring: '机会评分',
    contentStrategy: '内容策略与 AIDA',
    trainingEvaluation: '训练评测',
    synthesis: '最终汇总合成',
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeArray(value) {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined || value === '') return [];
    return [value];
  }

  function firstText(...values) {
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) return value.trim();
      if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    }
    return '';
  }

  function readablePrimitive(value) {
    if (value === null || value === undefined || value === '') return '待补';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) return value.map(readablePrimitive).filter(Boolean).join('、') || '待补';
    if (typeof value === 'object') {
      return Object.entries(value)
        .filter(([, item]) => item !== null && item !== undefined && item !== '')
        .map(([key, item]) => `${formatLabel(key)}：${readablePrimitive(item)}`)
        .join('；') || '待补';
    }
    return String(value);
  }

  function formatLabel(key) {
    const labels = {
      sourceKind: '来源',
      title: '标题',
      reviewStatus: '审核状态',
      gateStatus: '门禁状态',
      publishStatus: '发布状态',
      objective: '目标',
      advisorBrief: '顾问摘要',
      requiredDecision: '必须决策',
      manualGate: '人工门禁',
      automaticSendAllowed: '自动发送',
      automaticPublishAllowed: '自动发布',
      remoteDatabaseWriteAllowed: '远端写入',
      customerVisible: '顾客可见',
      customerVisibleAllowed: '顾客可见',
      internalPreviewAllowed: '内部预览',
      advisorReviewRequired: '顾问审核',
      h5PublishReviewRequired: 'H5 发布审核',
      hiddenReasoningExposed: '隐藏推理外显',
      sensitiveRawTextExposed: '敏感正文外显',
      branchAgentId: '分支 Agent',
      auditMode: '审计模式',
      chainOfThoughtPolicy: '推理展示策略',
    };
    return labels[key] || String(key).replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');
  }

  function renderEmpty(text, className = 'lifecycle-agent-empty') {
    return `<div class="${escapeHtml(className)}">${escapeHtml(text)}</div>`;
  }

  function renderPill(text, extraClass = '') {
    return `<span class="lifecycle-agent-pill ${escapeHtml(extraClass)}">${escapeHtml(text)}</span>`;
  }

  function renderMiniCard(label, value, extraClass = '') {
    return `
      <div class="lifecycle-agent-metric ${escapeHtml(extraClass)}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `;
  }

  function renderKeyValue(label, value) {
    return `
      <div class="lifecycle-agent-kv">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(readablePrimitive(value))}</strong>
      </div>
    `;
  }

  function renderList(items, options = {}) {
    const list = safeArray(items).filter((item) => item !== null && item !== undefined && item !== '');
    if (!list.length) return options.empty ? renderEmpty(options.empty) : '';
    const limit = options.limit || list.length;
    return `
      <${options.ordered ? 'ol' : 'ul'} class="lifecycle-agent-list ${escapeHtml(options.compact ? 'is-compact' : '')}">
        ${list.slice(0, limit).map((item) => `<li>${escapeHtml(readablePrimitive(item))}</li>`).join('')}
      </${options.ordered ? 'ol' : 'ul'}>
    `;
  }

  function renderSection(title, body, options = {}) {
    if (!body) return '';
    return `
      <section class="lifecycle-agent-section ${escapeHtml(options.className || '')}">
        <div class="lifecycle-agent-section-head">
          <h4>${escapeHtml(title)}</h4>
          ${options.badge ? `<span>${escapeHtml(options.badge)}</span>` : ''}
        </div>
        ${body}
      </section>
    `;
  }

  function summarizeBranch(branch) {
    const generated = firstText(
      branch?.deepseekGeneration?.generatedTextPreview,
      branch?.deepseekGeneration?.generatedText,
      branch?.summary,
      branch?.advisorBrief,
      branch?.whyNow,
      branch?.implementation,
      branch?.nextBestAction,
    );
    if (generated) return generated.replace(/\s+/g, ' ').slice(0, 260);
    const workflow = branch?.auditableWorkflow || {};
    return firstText(
      safeArray(workflow.conclusionTraces)[0]?.conclusion,
      safeArray(workflow.workflowSteps)[0]?.output,
      workflow.agentRole,
      workflow.agentLabel,
      '暂无摘要。'
    );
  }

  function renderLifecycleAgentRunSummary(run, options = {}) {
    if (!run) return renderEmpty('暂无 normalized lifecycle Agent run。', options.emptyClass || 'lifecycle-agent-empty');
    const identity = run.customerIdentity || {};
    const meta = run.runMeta || {};
    const safety = run.safetyBoundary || {};
    const totalBranches = Object.keys(branchLabels).length;
    const branchCount = Object.values(run.branchOutputs || {}).filter(Boolean).length;
    const workflowCount = Object.values(run.branchOutputs || {}).filter((branch) => branch?.auditableWorkflow).length;
    const publishAllowed = safety.automaticPublishAllowed === true;
    const sendAllowed = safety.automaticSendAllowed === true;
    const writeAllowed = safety.remoteDatabaseWriteAllowed === true;
    return `
      <section class="lifecycle-agent-shared">
        <div class="lifecycle-agent-title-row">
          <div>
            <p class="lifecycle-agent-eyebrow">${escapeHtml(meta.contractVersion || 'yesskin_lifecycle_agent_run.v1')}</p>
            <h3>${escapeHtml(options.title || 'Lifecycle Agent Run v1')} · ${escapeHtml(identity.customerCode || '未选客户')}</h3>
            <p>${escapeHtml(identity.maskedCustomerId || identity.unifiedCustomerId || '')}</p>
          </div>
          ${renderPill(meta.status || 'ready', 'is-status')}
        </div>
        <div class="lifecycle-agent-metrics">
          ${renderMiniCard('分支 Agent', `${branchCount}/${totalBranches}`)}
          ${renderMiniCard('可审计工作流', `${workflowCount}/${totalBranches}`)}
          ${renderMiniCard('顾问审核', safety.advisorReviewRequired === false ? '非必需' : '必需', 'is-warn')}
          ${renderMiniCard('自动发布', publishAllowed ? '允许' : '禁止', publishAllowed ? 'is-danger' : 'is-ok')}
          ${renderMiniCard('自动发送', sendAllowed ? '允许' : '禁止', sendAllowed ? 'is-danger' : 'is-ok')}
          ${renderMiniCard('远端写入', writeAllowed ? '允许' : '禁止', writeAllowed ? 'is-danger' : 'is-ok')}
        </div>
      </section>
    `;
  }

  function renderLifecycleAgentRunBranches(run, options = {}) {
    const branches = run?.branchOutputs || {};
    const rows = Object.entries(branchLabels).map(([key, label]) => {
      const branch = branches[key];
      if (!branch) {
        return `
          <article class="lifecycle-agent-branch is-missing">
            <div class="lifecycle-agent-card-head">
              <strong>${escapeHtml(label)}</strong>
              ${renderPill('缺失', 'is-danger')}
            </div>
            <p>当前 normalized run 未包含该分支。</p>
          </article>
        `;
      }
      const generation = branch.deepseekGeneration || {};
      const workflow = branch.auditableWorkflow || {};
      return `
        <article class="lifecycle-agent-branch">
          <div class="lifecycle-agent-card-head">
            <div>
              <strong>${escapeHtml(label)}</strong>
              <span>${escapeHtml(branch.branchAgentId || workflow.branchAgentId || key)}</span>
            </div>
            ${renderPill(generation.status || workflow.auditMode || 'ready', generation.fallbackUsed ? 'is-warn' : 'is-status')}
          </div>
          <p class="lifecycle-agent-copy">${escapeHtml(summarizeBranch(branch))}</p>
          ${renderWorkflowAudit(workflow, { compact: options.compact })}
        </article>
      `;
    });
    return rows.join('') || renderEmpty('暂无分支输出。');
  }

  function renderWorkflowAudit(workflow, options = {}) {
    if (!workflow || typeof workflow !== 'object') return renderEmpty('当前分支缺少 auditableWorkflow。');
    const alignment = workflow.projectBookAlignment || {};
    const inputData = workflow.inputData || {};
    return `
      <div class="lifecycle-agent-workflow">
        <div class="lifecycle-agent-workflow-grid">
          ${renderKeyValue('项目书步骤', alignment.steps || workflow.projectBookSteps || workflow.projectBookStep)}
          ${renderKeyValue('回答问题', alignment.questions || workflow.questions)}
          ${renderKeyValue('审计策略', workflow.chainOfThoughtPolicy || '展示可审计输入、规则、阈值、量化信号和结论摘要。')}
        </div>
        ${renderSubsection('输入字段与安全来源', `
          ${renderPillGroup(inputData.fields)}
          ${renderSourceLine('安全来源', inputData.safeSources)}
          ${renderSourceLine('排除来源', inputData.forbiddenRawSources)}
        `)}
        ${renderWorkflowSteps(workflow.workflowSteps, options)}
        ${renderRules(workflow.rulesAndStandards, options)}
        ${renderSignals(workflow.quantifiedSignals)}
        ${renderTraces(workflow.conclusionTraces)}
        ${renderDisplayBoundary(workflow.displayBoundary)}
        ${renderCalibration(workflow.calibration)}
      </div>
    `;
  }

  function renderSubsection(title, body) {
    if (!String(body || '').trim()) return '';
    return `
      <div class="lifecycle-agent-subsection">
        <h5>${escapeHtml(title)}</h5>
        ${body}
      </div>
    `;
  }

  function renderPillGroup(items) {
    const list = safeArray(items).filter(Boolean);
    if (!list.length) return '';
    return `<div class="lifecycle-agent-pill-row">${list.map((item) => renderPill(readablePrimitive(item))).join('')}</div>`;
  }

  function renderSourceLine(label, items) {
    const list = safeArray(items).filter(Boolean);
    if (!list.length) return '';
    return `<p class="lifecycle-agent-source"><b>${escapeHtml(label)}：</b>${escapeHtml(list.map(readablePrimitive).join('、'))}</p>`;
  }

  function renderWorkflowSteps(steps, options = {}) {
    const list = safeArray(steps);
    if (!list.length) return '';
    const limit = options.compact ? 3 : list.length;
    return renderSubsection('从输入到结论', `
      <div class="lifecycle-agent-step-grid">
        ${list.slice(0, limit).map((item, index) => `
          <article>
            <strong>${escapeHtml(item.stage || item.name || `${index + 1}. 工作步骤`)}</strong>
            ${item.input ? `<p><b>输入</b>${escapeHtml(readablePrimitive(item.input))}</p>` : ''}
            ${item.operation ? `<p><b>处理</b>${escapeHtml(readablePrimitive(item.operation))}</p>` : ''}
            ${item.output ? `<p><b>输出</b>${escapeHtml(readablePrimitive(item.output))}</p>` : ''}
          </article>
        `).join('')}
      </div>
    `);
  }

  function renderRules(rules, options = {}) {
    const list = safeArray(rules);
    if (!list.length) return '';
    const limit = options.compact ? 3 : list.length;
    return renderSubsection('规则与标准', `
      <div class="lifecycle-agent-step-grid">
        ${list.slice(0, limit).map((item) => `
          <article>
            <strong>${escapeHtml(item.rule || item.name || item.label || '规则')}</strong>
            ${item.standard ? `<p><b>标准</b>${escapeHtml(readablePrimitive(item.standard))}</p>` : ''}
            ${item.calculation ? `<p><b>计算</b>${escapeHtml(readablePrimitive(item.calculation))}</p>` : ''}
            ${item.result || item.output ? `<p><b>结果</b>${escapeHtml(readablePrimitive(item.result || item.output))}</p>` : ''}
          </article>
        `).join('')}
      </div>
    `);
  }

  function renderSignals(signals) {
    const list = safeArray(signals);
    if (!list.length) return '';
    return renderSubsection('量化信号', `
      <div class="lifecycle-agent-signal-grid">
        ${list.map((item) => `
          <div>
            <span>${escapeHtml(item.label || item.name || item.metric || '信号')}</span>
            <strong>${escapeHtml(item.value ?? item.score ?? '无')}</strong>
            <p>${escapeHtml(item.interpretation || item.reason || '')}</p>
          </div>
        `).join('')}
      </div>
    `);
  }

  function renderTraces(traces) {
    const list = safeArray(traces);
    if (!list.length) return '';
    return renderSubsection('结论路径', `
      <div class="lifecycle-agent-trace-list">
        ${list.map((item) => `
          <div>
            <span>${escapeHtml(item.input || item.evidence || item.signal || '输入')}</span>
            <strong>${escapeHtml([item.ruleHit || item.rule, item.conclusion].filter(Boolean).join(' -> ') || readablePrimitive(item))}</strong>
          </div>
        `).join('')}
      </div>
    `);
  }

  function renderDisplayBoundary(boundary) {
    if (!boundary || typeof boundary !== 'object') return '';
    return renderSubsection('显示边界', `
      <div class="lifecycle-agent-boundary-grid">
        ${Object.entries(boundary).map(([key, value]) => renderKeyValue(formatLabel(key), value)).join('')}
      </div>
    `);
  }

  function renderCalibration(calibration) {
    if (!calibration || typeof calibration !== 'object') return '';
    return renderSubsection('校准与复核', `
      <div class="lifecycle-agent-boundary-grid">
        ${Object.entries(calibration).map(([key, value]) => renderKeyValue(formatLabel(key), value)).join('')}
      </div>
    `);
  }

  function renderAdvisorTaskCard(run) {
    const card = run?.advisorTaskCard || {};
    if (!Object.keys(card).length) return renderEmpty('暂无顾问任务卡。');
    return `
      <article class="lifecycle-agent-deliverable">
        <div class="lifecycle-agent-card-head">
          <div>
            <strong>${escapeHtml(card.title || '顾问任务卡')}</strong>
            <span>${escapeHtml(card.reviewStatus || card.lane || '待审核')}</span>
          </div>
          ${renderPill(card.automaticSendAllowed ? '允许自动发送' : '禁止自动发送', card.automaticSendAllowed ? 'is-danger' : 'is-ok')}
        </div>
        <div class="lifecycle-agent-workflow-grid">
          ${renderKeyValue('互动目标', card.objective)}
          ${renderKeyValue('必须决策', card.requiredDecision)}
          ${renderKeyValue('人工门禁', card.manualGate)}
        </div>
        <p class="lifecycle-agent-copy">${escapeHtml(card.advisorBrief || '暂无顾问摘要。')}</p>
        <div class="lifecycle-agent-two-col">
          <div>
            <h5>沟通要点</h5>
            ${renderList(card.talkingPoints)}
          </div>
          <div>
            <h5>复核重点</h5>
            ${renderList(card.verifyFocus)}
          </div>
        </div>
        ${renderMessageVariants(card.messageVariants)}
        ${renderPillGroup(card.allowedAdvisorActions)}
      </article>
    `;
  }

  function renderMessageVariants(variants) {
    const list = safeArray(variants);
    if (!list.length) return '';
    return `
      <div class="lifecycle-agent-message-grid">
        ${list.map((item) => `
          <article>
            <span>${escapeHtml([item.variant, item.angle].filter(Boolean).join(' · ') || '话术')}</span>
            <p>${escapeHtml(item.text || readablePrimitive(item))}</p>
          </article>
        `).join('')}
      </div>
    `;
  }

  function renderH5Preview(run) {
    const h5 = run?.h5Payload || {};
    if (!Object.keys(h5).length) return renderEmpty('暂无 H5 payload。');
    const screens = safeArray(h5.screens);
    return `
      <article class="lifecycle-agent-deliverable">
        <div class="lifecycle-agent-card-head">
          <div>
            <strong>${escapeHtml(h5.title || 'H5 预览')}</strong>
            <span>${escapeHtml(h5.status || h5.format || '内部预览')}</span>
          </div>
          ${renderPill(h5.automaticPublishAllowed ? '允许自动发布' : '禁止自动发布', h5.automaticPublishAllowed ? 'is-danger' : 'is-ok')}
        </div>
        <p class="lifecycle-agent-copy">${escapeHtml(h5.format || '移动端 H5 内部预览，顾客侧发布必须经过人工门禁。')}</p>
        <div class="lifecycle-agent-phone-row">
          ${screens.map((screen, index) => renderH5Screen(screen, index)).join('')}
        </div>
        ${renderH5Visibility(h5.visibilityRules)}
      </article>
    `;
  }

  function renderH5Screen(screen, index) {
    const points = safeArray(screen.observationPoints).map((item) => item.label || item.title || readablePrimitive(item));
    const cards = safeArray(screen.detailCards).map((item) => item.title || item.description || readablePrimitive(item));
    return `
      <section class="lifecycle-agent-phone">
        <span>${escapeHtml(screen.step || `0${index + 1} / 03`)}</span>
        <h4>${escapeHtml(screen.title || 'H5 屏幕')}</h4>
        <p>${escapeHtml(screen.subtitle || screen.body || screen.primaryFact || '')}</p>
        ${screen.primaryFact ? `<strong>${escapeHtml(screen.primaryFact)}</strong>` : ''}
        ${screen.body ? `<p>${escapeHtml(screen.body)}</p>` : ''}
        ${points.length ? renderList(points, { compact: true }) : ''}
        ${screen.principle ? `<p>${escapeHtml(screen.principle)}</p>` : ''}
        ${cards.length ? renderList(cards, { compact: true }) : ''}
        ${screen.notice ? `<em>${escapeHtml(screen.notice)}</em>` : ''}
      </section>
    `;
  }

  function renderH5Visibility(rules) {
    if (!rules || typeof rules !== 'object') return '';
    return `
      <div class="lifecycle-agent-two-col">
        <div>
          <h5>顾客侧允许信息</h5>
          ${renderList(rules.customerVisibleAllowed, { limit: 6 })}
        </div>
        <div>
          <h5>顾客侧禁止外显</h5>
          ${renderList(rules.forbiddenCustomerSurface || rules.advisorOnly, { limit: 8 })}
        </div>
      </div>
    `;
  }

  function renderGateDetail(run) {
    const gate = run?.h5PublishGate || run?.riskComplianceGate || {};
    const safety = run?.safetyBoundary || {};
    if (!Object.keys(gate).length && !Object.keys(safety).length) return renderEmpty('暂无门禁详情。');
    return `
      <article class="lifecycle-agent-deliverable">
        <div class="lifecycle-agent-card-head">
          <div>
            <strong>人工门禁与安全边界</strong>
            <span>${escapeHtml(gate.gateStatus || gate.publishStatus || '待复核')}</span>
          </div>
          ${renderPill(gate.customerFacingContentPublishAllowed ? '可对客发布' : '仅内部预览', gate.customerFacingContentPublishAllowed ? 'is-warn' : 'is-status')}
        </div>
        <div class="lifecycle-agent-workflow-grid">
          ${renderKeyValue('H5 门禁', gate.h5GateId)}
          ${renderKeyValue('发布状态', gate.publishStatus)}
          ${renderKeyValue('人工发布', gate.manualPublishAllowed ? '允许' : '未允许')}
          ${renderKeyValue('自动发布', gate.automaticPublishAllowed ? '允许' : '禁止')}
          ${renderKeyValue('顾客可见', gate.customerFacingContentPublishAllowed ? '允许' : '禁止')}
          ${renderKeyValue('远端写入', safety.remoteDatabaseWriteAllowed ? '允许' : '禁止')}
        </div>
        <div class="lifecycle-agent-two-col">
          <div>
            <h5>当前原因</h5>
            ${renderList(gate.reasons)}
          </div>
          <div>
            <h5>发布前必须完成</h5>
            ${renderList(gate.requiredBeforePublish)}
          </div>
        </div>
        ${renderList(gate.forbiddenClaims || safety.forbiddenClaims, { empty: '暂无禁止声明。' })}
      </article>
    `;
  }

  function renderFeedbackLearning(run) {
    const unit = run?.feedbackLearningUnit || {};
    if (!Object.keys(unit).length) return '';
    const testUnit = unit.feedbackTestUnit || {};
    return `
      <article class="lifecycle-agent-deliverable">
        <div class="lifecycle-agent-card-head">
          <div>
            <strong>反馈学习单元</strong>
            <span>${escapeHtml(unit.unitId || 'feedback_learning_unit')}</span>
          </div>
          ${renderPill(`${safeArray(unit.events).length || unit.eventCount || 0} 条事件`, 'is-status')}
        </div>
        <div class="lifecycle-agent-workflow-grid">
          ${renderKeyValue('生命周期', testUnit.lifecycleState)}
          ${renderKeyValue('互动目标', testUnit.interactionObjective)}
          ${renderKeyValue('反馈行数', testUnit.feedbackRows || unit.eventCount)}
        </div>
        <h5>成功信号</h5>
        ${renderPillGroup(testUnit.successSignals)}
      </article>
    `;
  }

  function renderLifecycleAgentRunPanel(run, options = {}) {
    if (!run) return renderLifecycleAgentRunSummary(run, options);
    return `
      ${renderLifecycleAgentRunSummary(run, options)}
      ${renderSection(`${Object.keys(branchLabels).length} 分支 Agent 详情`, renderLifecycleAgentRunBranches(run, { compact: options.compactBranches }), { badge: 'auditableWorkflow' })}
      ${renderSection('顾问任务卡', renderAdvisorTaskCard(run), { badge: 'advisorTaskCard' })}
      ${renderSection('H5 预览', renderH5Preview(run), { badge: 'h5Payload' })}
      ${renderSection('门禁详情', renderGateDetail(run), { badge: 'riskComplianceGate' })}
      ${renderSection('反馈学习', renderFeedbackLearning(run), { badge: 'feedbackLearningUnit' })}
    `;
  }

  global.LifecycleAgentRenderers = {
    renderLifecycleAgentRunSummary,
    renderLifecycleAgentRunBranches,
    renderAdvisorTaskCard,
    renderH5Preview,
    renderGateDetail,
    renderFeedbackLearning,
    renderLifecycleAgentRunPanel,
  };
})(window);

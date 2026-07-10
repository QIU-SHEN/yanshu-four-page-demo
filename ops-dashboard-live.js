(function () {
  const { $, escapeHtml, compactText, formatDate, jsonFetch, chip } = window.P7Live;

  function displayMetric(metric) {
    if (!metric) return '数据积累中';
    return metric.displayValue || (metric.value ?? '数据积累中');
  }

  function metricCard(label, value, note) {
    return `
      <article class="metric-card">
        <b>${escapeHtml(label)}</b>
        <strong>${escapeHtml(value)}</strong>
        <span>${escapeHtml(note || '')}</span>
      </article>
    `;
  }

  function renderMetrics(pack) {
    $('#live-metrics').innerHTML = [
      metricCard('实盘客户数', pack.meta?.liveCustomerCount ?? 0, 'scope=live'),
      metricCard('回复率 D+30', displayMetric(pack.business?.replyRateD30), pack.business?.note || ''),
      metricCard('档案覆盖率', displayMetric(pack.dataQuality?.infoPointCoverageRate), 'A4 ready 口径'),
      metricCard('门禁积压', displayMetric(pack.risk?.gateBacklog), pack.risk?.severity || 'info'),
    ].join('');
  }

  function keyValueRows(items) {
    return Object.entries(items || {}).map(([key, value]) => `
      <p><strong>${escapeHtml(key)}：</strong>${escapeHtml(typeof value === 'object' ? JSON.stringify(value) : value)}</p>
    `).join('');
  }

  function renderPanels(pack) {
    $('#quality-panel').innerHTML = [
      keyValueRows({
        '信息点覆盖率': displayMetric(pack.dataQuality?.infoPointCoverageRate),
        'A3 完整度': displayMetric(pack.dataQuality?.blockSummaryCompleteness),
        '未解决冲突': displayMetric(pack.dataQuality?.unresolvedConflicts),
        'A4 来源事件': pack.dataQuality?.sourceEventCount ?? 0,
      }),
      `<div class="p7-live-meta">${chip(`等级分布 ${JSON.stringify(pack.dataQuality?.gradeDistribution || {})}`)}</div>`,
    ].join('');

    const angles = pack.strategy?.angleDistribution || {};
    $('#strategy-panel').innerHTML = [
      keyValueRows({
        '互动目标采纳率': displayMetric(pack.strategy?.interactionGoalAdoptionRate),
        '重新生成率': displayMetric(pack.strategy?.regenerationRate),
        '自定义角度占比': displayMetric(pack.strategy?.customAngleShare),
        'H5 人工修改率': displayMetric(pack.strategy?.h5ManualEditRate),
        '策略刷新事件': pack.strategy?.strategyRefreshEvents ?? 0,
      }),
      `<div class="p7-live-meta">${Object.entries(angles).map(([name, count]) => chip(`${name} ${count}`)).join('') || chip('角度数据积累中')}</div>`,
    ].join('');

    $('#risk-panel').innerHTML = keyValueRows({
      '门禁积压': displayMetric(pack.risk?.gateBacklog),
      '合规拒绝率': displayMetric(pack.risk?.complianceRejectRate),
      '合规拦截数': displayMetric(pack.risk?.complianceRejected),
      '风险等级': pack.risk?.severity || 'info',
    });
  }

  function renderInsights(pack) {
    const insights = pack.insights?.insights || [];
    $('#insight-panel').innerHTML = insights.map((item) => `
      <article class="p7-live-card">
        <div class="p7-live-meta">${chip(item.severity || 'info', item.severity === 'high' ? 'is-warn' : 'is-ok')}</div>
        <h4>${escapeHtml(item.panel || 'insight')}</h4>
        <p>${escapeHtml(item.finding || '')}</p>
        <p>${escapeHtml(item.suggestedAction || '')}</p>
      </article>
    `).join('') || '<div class="p7-live-empty">暂无洞察。</div>';
  }

  function renderTaskEvents(payload) {
    const tasks = payload.tasks || [];
    if (!tasks.length) {
      $('#live-customer-events').innerHTML = '<div class="p7-live-empty">暂无实盘任务事件。</div>';
      return;
    }
    $('#live-customer-events').innerHTML = `
      <table class="p7-live-table">
        <thead>
          <tr>
            <th>客户</th>
            <th>画像</th>
            <th>任务事件</th>
            <th>最近门禁</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.slice(0, 30).map((task) => `
            <tr>
              <td>
                <strong>${escapeHtml(task.maskedCustomerId || task.customerCode || task.unifiedCustomerId)}</strong>
                <div>${escapeHtml(task.unifiedCustomerId)}</div>
              </td>
              <td>${escapeHtml(task.demandType || '')} · ${escapeHtml(task.lifecycleStage || '')}</td>
              <td>
                ${(task.events || []).slice(0, 4).map((event) => `
                  <div>${escapeHtml(event.eventType)} · ${escapeHtml(formatDate(event.createdAt))}</div>
                `).join('') || '暂无'}
              </td>
              <td>${escapeHtml(compactText(task.latestH5?.gateStatus || task.latestGoal?.gateStatus || '待生成', 80))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  async function load() {
    $('#loading-state').hidden = false;
    const [pack, tasks] = await Promise.all([
      jsonFetch('/api/ops-dashboard/pack?scope=live'),
      jsonFetch('/api/p7/live/tasks'),
    ]);
    renderMetrics(pack);
    renderPanels(pack);
    renderInsights(pack);
    renderTaskEvents(tasks);
    $('#loading-state').textContent = `已刷新：${formatDate(pack.meta?.generatedAt)}`;
  }

  $('#reload-live-dashboard').addEventListener('click', () => {
    load().catch((error) => {
      $('#loading-state').textContent = `读取失败：${error.message}`;
    });
  });

  load().catch((error) => {
    $('#loading-state').textContent = `读取失败：${error.message}`;
  });
})();

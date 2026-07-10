/*
 * H5ReviewKit — shared, page-agnostic renderer for the "顾问任务&H5审核" advisor task card's
 * customer-visible H5 preview (CSKIN radar chart, treatment timeline, three H5 pages, detail
 * drill-down, customer-basic-info challenge rows). Extracted from review.js so review.html
 * (样板) and tasks-live.html (实盘) render byte-identical markup from different data sources.
 * Every function here is pure: it takes plain data in, returns an HTML string, and never reads
 * page-global state (no selectedArchive()/selectedReview()/state.*).
 */
(function () {
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
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

  function useRichClinicalPreviewText(text) {
    return /治疗|复诊|复盘|医生|诊断|CSKIN|皮秒|光子|水光|色斑|黄褐斑|敏感|屏障|抗衰|轮廓|维养/.test(String(text || ''));
  }

  const CSKIN_RADAR_AXES = [
    { key: 'redspot', label: '红斑' },
    { key: 'blackspot', label: '黑斑' },
    { key: 'macula', label: '黄斑' },
    { key: 'wrinkle', label: '皱纹' },
    { key: 'pore', label: '毛孔' },
    { key: 'porphyrin', label: '紫质' },
  ];

  const GENERIC_CSKIN_ESTIMATE = {
    redspot: 60,
    blackspot: 60,
    macula: 45,
    wrinkle: 35,
    pore: 50,
    porphyrin: 25,
  };

  const GENERIC_H5_DETAIL_CARDS = [
    {
      key: 'recent-care',
      tag: '短期',
      window: '本次',
      title: '近期状态确认',
      body: '先确认最近一次护理或面诊后的真实状态。',
      icon: 'visibility',
    },
    {
      key: 'rhythm',
      tag: '中期',
      window: '节奏窗口',
      title: '护理节奏回看',
      body: '结合本客户项目周期判断是否进入观察或复盘窗口。',
      icon: 'calendar_today',
    },
    {
      key: 'next-step',
      tag: '长期',
      window: '下一步',
      title: '顾问人工确认',
      body: '由顾问确认风险边界后，再决定是否进入人工触达。',
      icon: 'verified_user',
    },
  ];

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

  function h5Footer() {
    return `
      <footer class="h5-footer">
        <div>${iconSvg('verified_user')}<span>由顾问为您整理 · 颜术</span></div>
        <small>Privacy Policy · Terms</small>
      </footer>
    `;
  }

  function h5TitleMarkup(title, fallback) {
    return escapeHtml(title || fallback);
  }

  function h5LogoMarkup() {
    return '<img class="h5-final-logo" src="./assets/yesskin-logo.png" alt="YESSKIN 颜术" />';
  }

  function detailIdForCta(screen, pageIndex) {
    if (pageIndex === 0) return 'why-now';
    if (pageIndex === 1) {
      return String(screen?.detailEntry || '').includes('节奏') ? 'rhythm-guide' : 'observation-points';
    }
    return 'rhythm-guide';
  }

  function h5DetailEntries() {
    return [
      { id: 'rhythm-guide', icon: 'calendar_today', title: '维养节奏说明', description: '了解为什么维护类护理需要看阶段。' },
      { id: 'observation-points', icon: 'visibility', title: '近期状态观察点', description: '看看本阶段值得留意的变化。' },
      { id: 'basic-care', icon: 'wash', title: '基础护理建议', description: '日常可参考的温和护理方向。' },
      { id: 'faq', icon: 'help_outline', title: '常见问题', description: '关于护理间隔和状态观察的解答。' },
    ];
  }

  function h5DetailContent(detailId, ctx = {}) {
    const treatment = ctx.treatment || '上次护理项目';
    const base = {
      eyebrow: 'YESSKIN CARE RHYTHM',
      title: '维养节奏说明',
      intro: '这部分用于帮助你理解当前简报，不代表必须立刻安排项目。',
      cards: [],
      note: '如果后续想进一步了解，可由顾问根据当前状态为你补充说明。',
    };
    const content = {
      'why-now': {
        eyebrow: 'WHY NOW',
        title: '为什么现在值得关注',
        intro: `你曾经建立过一段比较稳定的护理节奏，最近一次记录为${treatment}。当护理间隔变长时，更适合先做状态观察，而不是马上决定复杂项目。`,
        cards: [
          { icon: 'calendar_today', title: '节奏发生变化', body: '近期更适合关注稳定度、干燥感和暗沉感，先判断皮肤状态是否有变化。' },
          { icon: 'visibility', title: '先看状态', body: '这份简报只做温和提醒和信息整理，不替代顾问面对面的状态判断。' },
          { icon: 'verified_user', title: '由顾问整理', body: '内容来自本地结构化审核结果，已经过滤内部评分、标签和敏感正文。' },
        ],
        note: '你可以先看完这份简报，再决定是否需要让顾问补充说明。',
      },
      'rhythm-guide': {
        eyebrow: 'CARE RHYTHM',
        title: '维养节奏怎么看',
        intro: '维护类护理更重视阶段观察。节奏不是越密越好，也不是一中断就需要补救，关键是先看当前状态是否稳定。',
        cards: [
          { icon: 'monitoring', title: '阶段观察', body: '先观察最近一段时间的肤色、干燥和稳定度，再判断是否需要继续轻维护。' },
          { icon: 'laps', title: '轻维护思路', body: '如果状态平稳，可以先延续基础护理；如果有波动，再由顾问协助做下一步判断。' },
          { icon: 'info', title: '不急着决定', body: '这次入口是信息说明，不设置自动预约，也不要求你马上选择项目。' },
        ],
        note: '适合先建立对维养节奏的理解，再根据当前状态做轻量判断。',
      },
      'observation-points': {
        eyebrow: 'OBSERVATION',
        title: '近期可以看哪些状态',
        intro: '你可以用很日常的方式做自我观察：不需要复杂设备，只看近期是否出现明显变化。',
        cards: [
          { icon: 'verified_user', title: '稳定度', body: '留意是否更容易泛红、紧绷、粗糙，或护肤后仍觉得不够稳定。' },
          { icon: 'water_drop', title: '干燥感', body: '洁面后是否更容易紧绷、局部起屑，或补水后很快又觉得干。' },
          { icon: 'wb_sunny', title: '暗沉感', body: '观察整体透亮度是否下降，局部肤色是否显得疲惫或不均匀。' },
        ],
        note: '如果某一项变化明显，可以在和顾问沟通时优先说明。',
      },
      'basic-care': {
        eyebrow: 'BASIC CARE',
        title: '基础护理先怎么做',
        intro: '当不确定是否要接续维护时，先把日常护理保持简单、温和、稳定，会更利于观察真实状态。',
        cards: [
          { icon: 'wash', title: '温和清洁', body: '减少过度清洁和频繁更换产品，先保持洁面步骤稳定。' },
          { icon: 'water_drop', title: '基础保湿', body: '优先关注舒适度和持续滋润感，不急着叠加过多功能型产品。' },
          { icon: 'verified_user', title: '减少刺激', body: '近期如果状态波动，先避免密集尝试新步骤，让顾问有更清晰的判断依据。' },
        ],
        note: '以上为日常护理说明，不构成诊断或治疗建议。',
      },
      faq: {
        eyebrow: 'FAQ',
        title: '常见问题',
        intro: '这些问题用于帮助你理解这份简报的边界：它是信息整理，不是销售页。',
        cards: [
          { icon: 'help_outline', title: '需要立刻安排项目吗？', body: '不需要。这份 H5 的目的只是帮助你先理解当前节奏和观察点。' },
          { icon: 'visibility', title: '为什么没有复杂建议？', body: '因为当前更适合先看状态，再由顾问根据你的反馈补充说明。' },
          { icon: 'info', title: '顾问会看到什么？', body: '顾问侧会看到更完整的审核信息，但顾客侧不会展示内部评分、标签或敏感正文。' },
        ],
        note: '如果还有疑问，可以让顾问基于当前状态继续解释。',
      },
    };
    return content[detailId] || base;
  }

  function renderH5DetailPanel(detailId, ctx = {}) {
    const detail = h5DetailContent(detailId, ctx);
    return `
      <article class="h5-detail-panel">
        <header class="h5-detail-nav">
          <button type="button" class="h5-detail-back" data-h5-detail-close>
            ${iconSvg('arrow_back')}
            <span>返回</span>
          </button>
          <strong>${h5LogoMarkup()}</strong>
          <button type="button" class="h5-detail-close" data-h5-detail-close aria-label="关闭详情">
            ${iconSvg('close')}
          </button>
        </header>
        <section class="h5-detail-hero">
          <span>${escapeHtml(detail.eyebrow)}</span>
          <h2>${escapeHtml(detail.title)}</h2>
          <p>${escapeHtml(detail.intro)}</p>
        </section>
        <section class="h5-secondary-list">
          ${detail.cards.map((card) => `
            <article class="h5-secondary-card">
              <div class="h5-secondary-icon">${iconSvg(card.icon || 'info')}</div>
              <div>
                <h3>${escapeHtml(card.title)}</h3>
                <p>${escapeHtml(card.body)}</p>
              </div>
            </article>
          `).join('')}
        </section>
        <section class="h5-detail-note">
          ${iconSvg('verified_user')}
          <p>${escapeHtml(detail.note)}</p>
        </section>
        <button type="button" class="h5-detail-continue" data-h5-detail-close>
          继续查看简报 ${iconSvg('arrow_forward')}
        </button>
        ${h5Footer()}
      </article>
    `;
  }

  function renderCskinRadarSvg(values) {
    const cx = 120;
    const cy = 100;
    const radius = 58;
    const axes = CSKIN_RADAR_AXES;
    const angles = axes.map((_, i) => (-90 + 60 * i) * (Math.PI / 180));
    const ringSteps = [0.25, 0.5, 0.75, 1];
    const ringMarkup = ringSteps
      .map((step) => {
        const points = angles
          .map((a) => `${(cx + radius * step * Math.cos(a)).toFixed(2)},${(cy + radius * step * Math.sin(a)).toFixed(2)}`)
          .join(' ');
        return `<polygon class="radar-grid" points="${points}" />`;
      })
      .join('');
    const axisMarkup = angles
      .map((a) => {
        const x = (cx + radius * Math.cos(a)).toFixed(2);
        const y = (cy + radius * Math.sin(a)).toFixed(2);
        return `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" />`;
      })
      .join('');
    const valuePoints = axes
      .map((axis, i) => {
        const v = Math.max(0, Math.min(100, Number(values?.[axis.key] || 0))) / 100;
        const x = (cx + radius * v * Math.cos(angles[i])).toFixed(2);
        const y = (cy + radius * v * Math.sin(angles[i])).toFixed(2);
        return `${x},${y}`;
      })
      .join(' ');
    const vertexMarkup = axes
      .map((axis, i) => {
        const v = Math.max(0, Math.min(100, Number(values?.[axis.key] || 0))) / 100;
        const x = (cx + radius * v * Math.cos(angles[i])).toFixed(2);
        const y = (cy + radius * v * Math.sin(angles[i])).toFixed(2);
        return `<circle class="radar-vertex" cx="${x}" cy="${y}" r="2.6" />`;
      })
      .join('');
    const labelMarkup = axes
      .map((axis, i) => {
        const lr = radius + 14;
        const x = (cx + lr * Math.cos(angles[i])).toFixed(2);
        const y = (cy + lr * Math.sin(angles[i])).toFixed(2);
        const v = Number(values?.[axis.key] || 0);
        return `<text class="radar-label" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${escapeHtml(axis.label)} ${v}</text>`;
      })
      .join('');
    return `
      <svg viewBox="0 0 240 200" class="cskin-radar-svg" aria-label="CSKIN 六维肤况雷达图">
        ${ringMarkup}
        ${axisMarkup}
        <polygon class="radar-value" points="${valuePoints}" />
        ${vertexMarkup}
        ${labelMarkup}
      </svg>
    `;
  }

  function renderTreatmentTimelineSvg(cfg) {
    const total = Math.max(cfg.daysSinceLastVisit, cfg.doctorAdviceDays + 60);
    const w = 260;
    const trackY = 30;
    const xFor = (d) => 14 + (w - 28) * (d / total);
    const x0 = xFor(0);
    const x1 = xFor(cfg.doctorAdviceDays);
    const x2 = xFor(cfg.daysSinceLastVisit);
    return `
      <svg viewBox="0 0 ${w} 60" class="treatment-timeline-svg" aria-label="治疗后时间轴">
        <line class="tt-track" x1="14" y1="${trackY}" x2="${w - 14}" y2="${trackY}" />
        <line class="tt-track-done" x1="${x0}" y1="${trackY}" x2="${x2}" y2="${trackY}" />
        <g>
          <circle class="tt-node-past" cx="${x0}" cy="${trackY}" r="5" />
          <text class="tt-tick" x="${x0}" y="${trackY - 10}" text-anchor="middle">治疗</text>
          <text class="tt-tick-date" x="${x0}" y="${trackY + 18}" text-anchor="middle">${escapeHtml(cfg.lastVisitDate)}</text>
        </g>
        <g>
          <circle class="tt-node-target" cx="${x1}" cy="${trackY}" r="5" />
          <text class="tt-tick" x="${x1}" y="${trackY - 10}" text-anchor="middle">建议复诊</text>
          <text class="tt-tick-date" x="${x1}" y="${trackY + 18}" text-anchor="middle">+${cfg.doctorAdviceDays} 天</text>
        </g>
        <g>
          <circle class="tt-node-now" cx="${x2}" cy="${trackY}" r="6" />
          <text class="tt-tick-now" x="${x2}" y="${trackY - 10}" text-anchor="middle">今天</text>
          <text class="tt-tick-date" x="${x2}" y="${trackY + 18}" text-anchor="middle">${(cfg.daysSinceLastVisit - cfg.doctorAdviceDays) > 0 ? `逾期 ${cfg.daysSinceLastVisit - cfg.doctorAdviceDays} 天` : `距建议复诊还有 ${cfg.doctorAdviceDays - cfg.daysSinceLastVisit} 天`}</text>
        </g>
      </svg>
    `;
  }

  function renderCskinRadarBlock(values) {
    return `
      <section class="h5-cskin-radar" aria-label="CSKIN 检测发现">
        <div class="cskin-radar-head">
          <span>检测发现</span>
          <small>CSKIN 六维肤况</small>
        </div>
        ${renderCskinRadarSvg(values)}
        <p class="cskin-radar-source">依据：医生面诊摘要 · 非 CSKIN 仪器原值</p>
      </section>
    `;
  }

  function renderGaugeRow(row) {
    const totalSegs = 5;
    const filled = Math.max(0, Math.min(totalSegs, row.tier));
    const segs = Array.from({ length: totalSegs })
      .map((_, i) => `<span class="gauge-seg${i < filled ? ` is-on tone-${row.tone}` : ''}"></span>`)
      .join('');
    return `
      <li class="h5-gauge-row tone-${row.tone}">
        <div class="gauge-label">
          <span>${escapeHtml(row.label)}</span>
          <span class="gauge-tier">${escapeHtml(row.tierLabel)}</span>
        </div>
        <div class="gauge-bar" aria-label="${escapeHtml(row.label)} ${escapeHtml(row.tierLabel)}">${segs}</div>
      </li>
    `;
  }

  function buildPlanTiers(cards) {
    const list = safeArray(cards);
    const mapped = list.length
      ? list.map((card, index) => ({
        key: `card_${index}`,
        tag: index === 0 ? '短期' : index === 1 ? '中期' : '长期',
        window: card.body || card.description || '待顾问确认',
        title: card.title || `建议 ${index + 1}`,
        body: card.description || card.body || '由顾问结合当前情况补充说明。',
        icon: ['verified_user', 'water_drop', 'monitoring'][index] || 'article',
      }))
      : GENERIC_H5_DETAIL_CARDS;
    return mapped.slice(0, 3);
  }

  // config shape: { customerName, doctorName, advisorName, lastVisitDate, treatmentLabel,
  //   daysSinceLastVisit, overdueDaysOverride, evidenceText, diagnosisText, doctorTipsCandidates,
  //   planDetailCards, cskinIndicesOverride }
  function buildClinicalPreviewConfig(input = {}) {
    const evidenceText = String(input.evidenceText || '');
    const adviceDays = 30;
    const daysSince = Number(input.daysSinceLastVisit || 0);
    const overdueDays = Number(
      input.overdueDaysOverride != null ? input.overdueDaysOverride : (daysSince ? Math.max(0, daysSince - adviceDays) : 0),
    );
    const hasPigment = /斑|色沉|黄褐斑|日光|暗沉|肤色/.test(evidenceText);
    const hasSensitive = /敏感|泛红|红斑|屏障|刺痛|不适/.test(evidenceText);
    const hasPore = /毛孔|出油|闭口|痘/.test(evidenceText);
    const hasWrinkle = /皱纹|细纹|松弛|抗衰|轮廓|下颌/.test(evidenceText);
    const heuristicIndices = {
      redspot: hasSensitive ? 62 : 42,
      blackspot: hasPigment ? 72 : 38,
      macula: hasPigment ? 56 : 35,
      wrinkle: hasWrinkle ? 58 : 34,
      pore: hasPore ? 62 : 44,
      porphyrin: hasPore ? 48 : 28,
    };
    const indices = input.cskinIndicesOverride || heuristicIndices;
    const statusGauges = [
      { label: hasPigment ? '色斑稳定性' : '肤况稳定性', tier: hasPigment ? 4 : 3, tone: hasPigment ? 'warn' : 'ok', tierLabel: hasPigment ? '需关注' : '偏稳定' },
      { label: hasSensitive ? '屏障敏感度' : '维养节奏', tier: hasSensitive ? 4 : 3, tone: hasSensitive ? 'warn' : 'ok', tierLabel: hasSensitive ? '偏敏感' : '可观察' },
      { label: hasWrinkle ? '轮廓状态' : '复盘节奏', tier: overdueDays > 0 ? 5 : 3, tone: overdueDays > 0 ? 'risk' : 'ok', tierLabel: overdueDays > 0 ? '已逾期' : '可复盘' },
    ];
    const doctorTips = safeArray(input.doctorTipsCandidates).filter(Boolean).slice(0, 3);
    return {
      customerName: input.customerName || '',
      doctorName: input.doctorName || '医生',
      advisorName: input.advisorName || '',
      lastVisitDate: input.lastVisitDate || '近期',
      daysSinceLastVisit: daysSince || adviceDays,
      doctorAdviceDays: adviceDays,
      overdueDays,
      treatmentLabel: input.treatmentLabel || '近期护理记录',
      diagnosis: input.diagnosisText || evidenceText || '本次仅依据当前客户结构化档案整理，具体肤况需由顾问和医生复核。',
      statusGauges,
      doctorTips: doctorTips.length ? doctorTips : ['先确认近期肤况，再决定是否需要复盘或调整节奏。'],
      planTiers: buildPlanTiers(input.planDetailCards),
      cskinIndices: indices,
    };
  }

  function renderH5PageOneChen(screen, config) {
    const indices = config.cskinIndices || GENERIC_CSKIN_ESTIMATE;
    return `
      <article class="h5-final-page h5-final-one">
        <header class="h5-final-nav">
          <strong>${h5LogoMarkup()}</strong>
          <span>STEP 01 / 03</span>
        </header>
        <section class="h5-final-hero compact">
          <h2>${escapeHtml(screen?.title || '上次色斑治疗复盘')}</h2>
          <p>${escapeHtml(config.lastVisitDate)} ${escapeHtml(config.doctorName)} 医生面诊 · ${escapeHtml(config.treatmentLabel)}。建议 1 个月节点复盘。</p>
        </section>
        ${renderCskinRadarBlock(indices)}
        <section class="h5-timeline-card" aria-label="治疗后时间轴">
          <div class="timeline-head">
            <span class="timeline-eyebrow">治疗后时间轴</span>
            <span class="timeline-tag">${(config.daysSinceLastVisit - config.doctorAdviceDays) > 0 ? `已逾期 ${config.daysSinceLastVisit - config.doctorAdviceDays} 天` : '维养节奏内'}</span>
          </div>
          ${renderTreatmentTimelineSvg(config)}
        </section>
        <section class="h5-bento">
          <div class="h5-bento-card">
            <span>${iconSvg('calendar_today')} 上次护理</span>
            <strong>${escapeHtml(config.treatmentLabel)}</strong>
          </div>
          <div class="h5-bento-card">
            <span>${iconSvg('monitoring')} 本次目的</span>
            <strong>肤况确认</strong>
          </div>
        </section>
        <button class="h5-primary-cta" type="button" data-h5-detail="why-now">查看这次复盘依据 ${iconSvg('arrow_forward')}</button>
        ${h5Footer()}
      </article>
    `;
  }

  function renderH5PageOneGeneric(screen, config) {
    const treatment = screen?.primaryFact ? treatmentShortName(screen.primaryFact) : config.treatmentLabel;
    return `
      <article class="h5-final-page h5-final-one">
        <header class="h5-final-nav">
          <strong>${h5LogoMarkup()}</strong>
          <span>STEP 01 / 03</span>
        </header>
        <section class="h5-final-hero">
          <h2>${h5TitleMarkup(screen.title, '这次提醒，和你的维养节奏有关')}</h2>
          <p>${escapeHtml(screen.body || screen.subtitle || '')}</p>
        </section>
        <div class="h5-orbit-visual">
          <div class="h5-orbit-ring">${iconSvg('analytics')}</div>
        </div>
        <section class="h5-bento">
          <div class="h5-bento-card wide">
            <span>${iconSvg('calendar_today')} 最近一次护理</span>
            <strong>${escapeHtml(treatment)}</strong>
          </div>
          <div class="h5-bento-card">
            <span>${iconSvg('laps')} 节奏状态</span>
            <strong>进入观察窗口</strong>
          </div>
          <div class="h5-bento-card">
            <span>${iconSvg('monitoring')} 本次目的</span>
            <strong>状态观察</strong>
          </div>
        </section>
        <div class="h5-notice">${iconSvg('info')}<span>${escapeHtml(screen.notice || '本次只做状态观察，不直接推荐复杂项目。')}</span></div>
        <button class="h5-primary-cta" type="button" data-h5-detail="${detailIdForCta(screen, 0)}">${escapeHtml(screen.detailEntry || '查看这次提醒依据')} ${iconSvg('arrow_forward')}</button>
        ${h5Footer()}
      </article>
    `;
  }

  function renderH5PageOne(screen, config, isRich) {
    return isRich ? renderH5PageOneChen(screen, config) : renderH5PageOneGeneric(screen, config);
  }

  function renderH5PageTwoChen(screen, config) {
    return `
      <article class="h5-final-page h5-final-two">
        <header class="h5-final-nav">
          <strong>${h5LogoMarkup()}</strong>
          <span>STEP 02 / 03</span>
        </header>
        <section class="h5-final-hero compact">
          <h2>${escapeHtml(screen?.title || '肤况诊断与医生提醒')}</h2>
          <p>${escapeHtml(config.doctorName)} 医生面诊摘要整理。供回看，不代替医疗结论。</p>
        </section>
        <section class="h5-diagnosis-card">
          <span class="h5-diagnosis-eyebrow">诊断摘要</span>
          <p>${escapeHtml(config.diagnosis)}</p>
        </section>
        <section class="h5-gauge-card" aria-label="本次需关注的状态">
          <div class="gauge-card-head">
            <span class="gauge-card-eyebrow">本次关注</span>
            <span class="gauge-card-legend"><i class="legend-dot tone-ok"></i>稳定<i class="legend-dot tone-warn"></i>关注<i class="legend-dot tone-risk"></i>逾期</span>
          </div>
          <ul class="h5-gauge-list">
            ${config.statusGauges.map(renderGaugeRow).join('')}
          </ul>
        </section>
        <section class="h5-tip-list" aria-label="医生提醒">
          <span class="h5-tip-list-eyebrow">医生提醒</span>
          <ol>
            ${config.doctorTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join('')}
          </ol>
        </section>
        <button class="h5-primary-cta" type="button" data-h5-detail="rhythm-guide">查看复盘节奏说明 ${iconSvg('arrow_forward')}</button>
        ${h5Footer()}
      </article>
    `;
  }

  function renderH5PageTwoGeneric(screen) {
    const points = safeArray(screen.observationPoints);
    const icons = ['water_drop', 'wb_sunny', 'verified_user'];
    return `
      <article class="h5-final-page h5-final-two">
        <header class="h5-final-nav">
          <strong>${h5LogoMarkup()}</strong>
          <span>STEP 02 / 03</span>
        </header>
        <section class="h5-cream-visual" aria-label="肌肤状态观察视觉区">
          <div class="cream-ripple"></div>
          <div class="cream-drop"></div>
        </section>
        <section class="h5-final-hero compact">
          <h2>${h5TitleMarkup(screen.title, '先看状态，再决定节奏')}</h2>
          <p>${escapeHtml(screen.subtitle || screen.body || '')}</p>
        </section>
        <section class="h5-observation-list">
          ${points.map((point, index) => `
            <article class="h5-observation-final">
              <div>${iconSvg(icons[index] || 'spa')}</div>
              <section>
                <h3>${escapeHtml(point.label)}</h3>
                <p>${escapeHtml(point.description)}</p>
              </section>
            </article>
          `).join('')}
        </section>
        <div class="h5-special-advice">
          <span>${iconSvg('tips_and_updates')} SPECIAL ADVICE</span>
          <strong>${escapeHtml(screen.principle || '先观察、再决定，比盲目补救更重要。')}</strong>
        </div>
        <button class="h5-primary-cta" type="button" data-h5-detail="${detailIdForCta(screen, 1)}">${escapeHtml(screen.detailEntry || '查看如何判断当前状态')} ${iconSvg('arrow_forward')}</button>
        ${h5Footer()}
      </article>
    `;
  }

  function renderH5PageTwo(screen, config, isRich) {
    return isRich ? renderH5PageTwoChen(screen, config) : renderH5PageTwoGeneric(screen);
  }

  function renderH5PageThreeChen(screen, config) {
    const tiers = config.planTiers;
    const tierTrackSvg = `
      <svg viewBox="0 0 280 32" class="plan-track-svg" aria-hidden="true">
        <line x1="20" y1="16" x2="260" y2="16" class="plan-track-line" />
        ${tiers
          .map((_, i) => {
            const x = 20 + (240 * i) / (tiers.length - 1);
            const isFirst = i === 0;
            return `<circle cx="${x}" cy="16" r="${isFirst ? 7 : 5}" class="plan-track-node${isFirst ? ' is-current' : ''}" />`;
          })
          .join('')}
      </svg>
    `;
    return `
      <article class="h5-final-page h5-final-three">
        <header class="h5-final-nav">
          <strong>${h5LogoMarkup()}</strong>
          <span>STEP 03 / 03</span>
        </header>
        <section class="h5-final-hero compact">
          <h2>${escapeHtml(screen.title || `建议下一步 · By ${config.doctorName} 医生`)}</h2>
          <p>三段节奏由 ${escapeHtml(config.doctorName)} 医生面诊整理；是否执行以您和顾问 ${escapeHtml(config.advisorName)} 沟通为准。</p>
        </section>
        <section class="h5-plan-track" aria-label="复盘节奏时间轴">
          ${tierTrackSvg}
          <div class="plan-track-labels">
            ${tiers
              .map(
                (t, i) => `
              <div class="plan-track-label${i === 0 ? ' is-current' : ''}">
                <span class="track-tag">${escapeHtml(t.tag)}</span>
                <span class="track-window">${escapeHtml(t.window)}</span>
              </div>
            `,
              )
              .join('')}
          </div>
        </section>
        <section class="h5-plan-cards">
          ${tiers
            .map(
              (tier, i) => `
            <article class="h5-plan-card${i === 0 ? ' is-current' : ''}">
              <div class="plan-card-icon">${iconSvg(tier.icon)}</div>
              <div class="plan-card-body">
                <strong>${escapeHtml(tier.title)}</strong>
                <p>${escapeHtml(tier.body)}</p>
              </div>
            </article>
          `,
            )
            .join('')}
        </section>
        <button class="h5-primary-cta" type="button" id="h5-book-now">立即预约状态复盘 ${iconSvg('arrow_forward')}</button>
        <p class="h5-closing-note">不便预约可由顾问 ${escapeHtml(config.advisorName)} 再补充说明。</p>
        ${h5Footer()}
      </article>
    `;
  }

  function renderH5PageThreeGeneric(screen) {
    const cards = safeArray(screen.detailCards);
    const detailEntries = h5DetailEntries();
    return `
      <article class="h5-final-page h5-final-three">
        <header class="h5-final-nav">
          <strong>${h5LogoMarkup()}</strong>
          <span>STEP 03 / 03</span>
        </header>
        <section class="h5-final-hero compact">
          <h2>${h5TitleMarkup(screen.title, '你可以先看看这些细节')}</h2>
          <div class="h5-title-rule"></div>
          <p>${escapeHtml(screen.subtitle || screen.body || '')}</p>
        </section>
        <section class="h5-detail-list-final">
          ${cards.map((card, index) => `
            <button type="button" class="h5-detail-row" data-h5-detail="${escapeHtml(detailEntries[index]?.id || 'rhythm-guide')}">
              <span class="h5-detail-icon">${iconSvg(detailEntries[index]?.icon || 'article')}</span>
              <span>
                <strong>${escapeHtml(card.title)}</strong>
                <small>${escapeHtml(card.description)}</small>
              </span>
              ${iconSvg('chevron_right')}
            </button>
          `).join('')}
        </section>
        <section class="h5-studio-visual">
          <div class="studio-shelf"></div>
          <div class="studio-bottle one"></div>
          <div class="studio-bottle two"></div>
        </section>
        <p class="h5-closing-note">${escapeHtml(screen.closing || '如果后续想进一步了解，可由顾问根据当前状态再说明。')}</p>
        ${h5Footer()}
      </article>
    `;
  }

  function renderH5PageThree(screen, config, isRich) {
    return isRich ? renderH5PageThreeChen(screen, config) : renderH5PageThreeGeneric(screen);
  }

  function renderCustomerBasicChallengeRows(fields) {
    return fields.map((field, index) => `
      <article class="customer-basic-challenge-row">
        <div class="customer-basic-challenge-current">
          <span>${escapeHtml(field.group)}</span>
          <strong>${escapeHtml(field.label)}</strong>
          <p>${escapeHtml(field.value)}</p>
          ${field.group === '权益/抓手' ? renderAdvisorMissingBlockBadge(field.value) : ''}
        </div>
        <label class="h5-booking-field">
          <span>质疑说明</span>
          <textarea
            rows="2"
            data-basic-challenge-index="${index}"
            placeholder="例如：该信息已变化、与顾问掌握情况不一致，或需要数据核查员复核来源"
          ></textarea>
        </label>
      </article>
    `).join('');
  }

  window.H5ReviewKit = {
    escapeHtml,
    iconSvg,
    treatmentShortName,
    useRichClinicalPreviewText,
    detailIdForCta,
    h5DetailEntries,
    h5DetailContent,
    renderH5DetailPanel,
    h5Footer,
    h5TitleMarkup,
    h5LogoMarkup,
    CSKIN_RADAR_AXES,
    GENERIC_CSKIN_ESTIMATE,
    GENERIC_H5_DETAIL_CARDS,
    renderCskinRadarSvg,
    renderTreatmentTimelineSvg,
    renderCskinRadarBlock,
    renderGaugeRow,
    buildPlanTiers,
    buildClinicalPreviewConfig,
    renderH5PageOne,
    renderH5PageTwo,
    renderH5PageThree,
    renderCustomerBasicChallengeRows,
    renderAdvisorMissingBlockBadge,
    hasAdvisorMissingSignal,
  };
})();

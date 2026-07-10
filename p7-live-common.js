(function () {
  const forbiddenPatterns = [/保证/g, /根治/g, /病史/g, /金额/g, /余额/g, /身份证/g, /手机号/g, /RFM/g, /评分/g, /风险/g, /置信度/g];

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $$(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function compactText(value, max = 120) {
    const text = String(value ?? '').replace(/\s+/g, ' ').trim();
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  }

  function formatDate(value) {
    if (!value) return '暂无';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString('zh-CN', { hour12: false });
  }

  async function jsonFetch(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.message || payload.error || `HTTP ${response.status}`);
      error.payload = payload;
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  function postJson(url, body) {
    return jsonFetch(url, { method: 'POST', body: JSON.stringify(body || {}) });
  }

  async function readSsePost(url, body, handlers = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'text/event-stream', 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    if (!response.ok || !response.body) {
      const text = await response.text().catch(() => '');
      throw new Error(text || `HTTP ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    const emit = (raw) => {
      const eventName = raw.match(/^event:\s*(.+)$/m)?.[1]?.trim() || 'message';
      const dataText = raw
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .join('\n');
      if (!dataText) return;
      let payload = dataText;
      try {
        payload = JSON.parse(dataText);
      } catch (_error) {
        payload = { message: dataText };
      }
      handlers.onEvent?.(eventName, payload);
      handlers[eventName]?.(payload);
    };
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';
      parts.forEach((part) => emit(part));
    }
    if (buffer.trim()) emit(buffer);
  }

  function metricCard(label, value, note = '') {
    return `
      <article class="kpi">
        <div class="label">${escapeHtml(label)}</div>
        <div class="value">${escapeHtml(value)}</div>
        <div class="note">${escapeHtml(note)}</div>
      </article>
    `;
  }

  function chip(label, tone = '') {
    return `<span class="p7-live-chip ${tone}">${escapeHtml(label)}</span>`;
  }

  function safetyChips(boundary = {}) {
    return [
      `automaticSendAllowed=${boundary.automaticSendAllowed === false ? 'false' : String(boundary.automaticSendAllowed)}`,
      `remoteWriteAllowed=${boundary.remoteWriteAllowed === false ? 'false' : String(boundary.remoteWriteAllowed)}`,
      `customerFacingPublishAllowed=${boundary.customerFacingPublishAllowed === false ? 'false' : String(boundary.customerFacingPublishAllowed)}`,
    ].map((item) => chip(item, item.endsWith('false') ? 'is-ok' : 'is-warn')).join('');
  }

  function scanForbidden(value) {
    const text = typeof value === 'string' ? value : JSON.stringify(value || {});
    const hits = [];
    forbiddenPatterns.forEach((pattern) => {
      pattern.lastIndex = 0;
      if (pattern.test(text)) hits.push(pattern.source);
    });
    return Array.from(new Set(hits));
  }

  function logLine(root, message) {
    if (!root) return;
    const next = `[${new Date().toLocaleTimeString('zh-CN', { hour12: false })}] ${message}`;
    root.textContent = root.textContent ? `${next}\n${root.textContent}` : next;
  }

  window.P7Live = {
    $,
    $$,
    escapeHtml,
    compactText,
    formatDate,
    jsonFetch,
    postJson,
    readSsePost,
    metricCard,
    chip,
    safetyChips,
    scanForbidden,
    logLine,
  };
})();

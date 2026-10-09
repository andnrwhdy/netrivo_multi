const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');

async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let sequence = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  };
  return {
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() { socket.close(); }
  };
}

async function main() {
  const chromePath = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ].find((candidate) => fs.existsSync(candidate));
  if (!chromePath) throw new Error('Chrome or Edge is required for this browser check.');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'netrivo-dashboard-'));
  const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=9238', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  let version;
  for (let i = 0; i < 50; i++) {
    try { version = await (await fetch('http://127.0.0.1:9238/json/version')).json(); break; } catch { await new Promise((r) => setTimeout(r, 100)); }
  }
  if (!version) throw new Error('Browser debugging endpoint did not start.');
  const browser = await connect(version.webSocketDebuggerUrl);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const targets = await (await fetch('http://127.0.0.1:9238/json/list')).json();
  const page = await connect(targets.find((target) => target.id === targetId).webSocketDebuggerUrl);
  const evaluate = async (expression) => {
    const result = await page.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  try {
    await page.send('Page.enable');
    await page.send('Page.navigate', { url: pathToFileURL(path.resolve('index.html')).href });
    for (let i = 0; i < 50 && !(await evaluate('document.readyState === "complete"')); i++) await new Promise((r) => setTimeout(r, 100));
    assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.header-actions-modern a'), (link) => link.textContent.trim())`), ['Game', 'About', 'Evaluasi', 'Mulai Belajar']);
    assert.equal(await evaluate(`document.querySelector('#about').getAttribute('aria-labelledby')`), 'about-title');
    assert.equal(await evaluate(`document.querySelectorAll('.dashboard-outcome-card').length`), 4);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.platform-band'), '::before').animationName`), 'platform-grid-scan');
    for (const width of [1440, 768, 390, 320]) {
      await page.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
      const layout = await evaluate(`({width: innerWidth, content: document.documentElement.scrollWidth, hero: document.querySelector('.netrivo-hero').getBoundingClientRect().width, columns: getComputedStyle(document.querySelector('.course-overview-panel')).gridTemplateColumns.split(' ').length})`);
      assert.ok(layout.content <= layout.width + 1, `horizontal overflow at ${width}px: ${JSON.stringify(layout)}`);
      assert.equal(layout.columns, width >= 900 ? 3 : width > 680 ? 2 : 1);
      if (width === 1440) {
        const nav = await evaluate(`({logo: document.querySelector('.netrivo-logo').getBoundingClientRect().left, right: document.documentElement.clientWidth - document.querySelector('.header-actions-modern').getBoundingClientRect().right})`);
        assert.ok(nav.logo <= 40 && nav.right <= 40, `navbar should align to page edges: ${JSON.stringify(nav)}`);
        assert.equal(await evaluate(`getComputedStyle(document.querySelector('.netrivo-header')).borderBottomLeftRadius`), '24px');
        assert.notEqual(await evaluate(`getComputedStyle(document.querySelectorAll('[data-playlist-video]')[1]).transform`), 'none');
      }
      if (width === 390) assert.equal(await evaluate(`getComputedStyle(document.querySelectorAll('[data-playlist-video]')[1]).transform`), 'none');
    }
    await evaluate(`sessionStorage.setItem('netrivoProgressV6', JSON.stringify(['pengantar-konsep','pengantar-topologi','pengantar-latihan']))`);
    await page.send('Page.reload');
    for (let i = 0; i < 50 && !(await evaluate('document.readyState === "complete"')); i++) await new Promise((r) => setTimeout(r, 100));
    assert.equal(await evaluate(`document.querySelector('[data-dashboard-percent]').textContent`), '25%');
    assert.equal(await evaluate(`document.querySelectorAll('.dashboard-course-status, .course-card-content small, .hero-visual-caption').length`), 0);
    assert.equal(await evaluate(`document.querySelector('[data-dashboard-next]').textContent`), 'Lanjutkan: Cisco Networking');
    await evaluate(`document.querySelector('.course-evaluation-button').click()`);
    assert.equal(await evaluate(`document.querySelector('[data-evaluation-dialog]').open`), true);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.evaluation-confirmation-panel')).borderTopWidth`), '0px');
    assert.equal(await evaluate(`document.querySelector('[data-start-evaluation]').getAttribute('href')`), 'quiz.html?mode=langsung');
    await evaluate(`sessionStorage.setItem('netrivoProgressV6', JSON.stringify(['pengantar-konsep','pengantar-topologi','cisco-pengenalan','cisco-router','cisco-switch','cisco-routing','mikrotik-pengenalan','mikrotik-winbox','mikrotik-routeros']))`);
    for (const [file, questionCount] of [['latihan-pengantar.html', 5], ['latihan-cisco.html', 5], ['latihan-mikrotik.html', 6]]) {
      await page.send('Page.navigate', { url: pathToFileURL(path.resolve(file)).href });
      for (let i = 0; i < 50 && !(await evaluate(`location.pathname.endsWith('/${file}') && !!document.querySelector('.lesson-practice')`)); i++) await new Promise((r) => setTimeout(r, 100));
      for (const width of [1440, 390]) {
        await page.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
        const practice = await evaluate(`({sidebar: getComputedStyle(document.querySelector('.module-sidebar')).display, columns: getComputedStyle(document.querySelector('.module-shell')).gridTemplateColumns.split(' ').length, cardBorder: getComputedStyle(document.querySelector('.lesson-practice')).borderTopWidth, intro: document.querySelectorAll('.lesson-practice .lesson-reading-intro, .module-content-head').length, questions: document.querySelectorAll('.practice-question-block').length, overflow: document.documentElement.scrollWidth > innerWidth + 1})`);
        assert.notEqual(practice.sidebar, 'none', `${file}: lesson sidebar should remain visible`);
        assert.equal(practice.columns, width === 1440 ? 2 : 1, `${file}: lesson layout should remain intact`);
        assert.equal(practice.cardBorder, '0px', `${file}: practice should flow without an outer card`);
        assert.equal(practice.intro, 0, `${file}: practice should begin with the questions`);
        assert.equal(practice.questions, questionCount, `${file}: questions should remain available`);
        assert.equal(practice.overflow, false, `${file}: no horizontal overflow at ${width}px`);
      }
    }
    console.log('PASS: dashboard and three practice pages, responsive layout, progress, and evaluation dialog.');
  } finally {
    page.close();
    await browser.send('Target.closeTarget', { targetId });
    browser.close();
    chrome.kill();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });

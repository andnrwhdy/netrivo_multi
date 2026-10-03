const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

// Run against an isolated Chrome launched with --remote-debugging-port=9237.
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
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
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
  const version = await (await fetch('http://127.0.0.1:9237/json/version')).json();
  const browser = await connect(version.webSocketDebuggerUrl);
  let page;
  const openPage = async () => {
    const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
    const targets = await (await fetch('http://127.0.0.1:9237/json/list')).json();
    const client = await connect(targets.find(target => target.id === targetId).webSocketDebuggerUrl);
    await client.send('Page.enable');
    return { ...client, targetId };
  };
  const evaluate = async expression => {
    const result = await page.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const waitFor = async expression => {
    for (let i = 0; i < 100; i++) {
      try { if (await evaluate(expression)) return; } catch {}
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    throw new Error('Timed out: ' + expression);
  };
  const navigate = async file => {
    await page.send('Page.navigate', { url: pathToFileURL(path.resolve(file)).href });
    await waitFor(`location.pathname.endsWith('/${file}') && document.readyState === 'complete'`);
  };
  const reload = async () => {
    await page.send('Page.reload');
    await waitFor(`document.readyState === 'complete'`);
  };
  try {
    page = await openPage();
    await navigate('index.html');
    await evaluate(`sessionStorage.clear(); localStorage.setItem('netrivoProgressV6', JSON.stringify(['pengantar-konsep']));`);
    await evaluate(`document.querySelector('.evaluation-nav-button').click()`);
    await waitFor(`document.querySelector('[data-evaluation-dialog]').open`);
    assert.equal(await evaluate(`document.querySelector('[data-evaluation-dialog]').getAttribute('aria-labelledby')`), 'evaluation-dialog-title');
    assert.equal(await evaluate(`document.querySelector('[data-study-material]').getAttribute('href')`), 'materi.html');
    assert.equal(await evaluate(`document.querySelector('[data-start-evaluation]').getAttribute('href')`), 'quiz.html?mode=langsung');
    assert.equal(await evaluate(`Array.from(document.querySelectorAll('.evaluation-confirmation p')).map(node => node.textContent.trim()).join(' ')`), 'Apakah Anda ingin mempelajari keseluruhan materi terlebih dahulu sebelum memulai evaluasi? Anda dapat memilih Pelajari Materi untuk memahami materi secara lengkap, atau Mulai Evaluasi jika sudah siap mengerjakan soal.');
    await evaluate(`document.querySelector('[data-evaluation-close]').click()`);
    await waitFor(`!document.querySelector('[data-evaluation-dialog]').open`);
    for (const width of [1365, 390]) {
      await page.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
      await evaluate(`document.querySelector('.course-evaluation-action').scrollIntoView({ block: 'center', behavior: 'instant' })`);
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true);
      const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(os.tmpdir(), `netrivo-evaluation-button-${width}.png`), Buffer.from(data, 'base64'));
      await evaluate(`document.querySelector('.platform-band').scrollIntoView({ block: 'start', behavior: 'instant' })`);
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true);
      const platformShot = await page.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(os.tmpdir(), `netrivo-platform-grid-${width}.png`), Buffer.from(platformShot.data, 'base64'));
    }
    await page.send('Emulation.clearDeviceMetricsOverride');
    await evaluate(`document.querySelector('.course-evaluation-button').click()`);
    await waitFor(`document.querySelector('[data-evaluation-dialog]').open`);
    await new Promise(resolve => setTimeout(resolve, 250));
    for (const [width, height] of [[1365, 900], [390, 844]]) {
      await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 390 });
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true);
      assert.equal(await evaluate(`(() => { const rect = document.querySelector('.evaluation-confirmation-panel').getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight; })()`), true);
      assert.equal(await evaluate(`(() => { const panel = document.querySelector('.evaluation-confirmation-panel').getBoundingClientRect(); const actions = document.querySelector('.evaluation-dialog-actions').getBoundingClientRect(); return actions.right <= panel.right && panel.right - actions.right <= 40; })()`), true);
      const modalShot = await page.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(os.tmpdir(), `netrivo-evaluation-dialog-${width}.png`), Buffer.from(modalShot.data, 'base64'));
    }
    await page.send('Emulation.clearDeviceMetricsOverride');
    await evaluate(`document.querySelector('[data-start-evaluation]').click()`);
    await waitFor(`location.search === '?mode=langsung' && !!document.querySelector('[data-answers] button')`);
    assert.equal(await evaluate(`document.querySelector('[data-quiz-lock]').hidden`), true);
    assert.equal(await evaluate(`document.querySelector('[data-reset-session]')`), null);
    assert.equal(await evaluate(`document.querySelector('.evaluation-dashboard-button').getAttribute('href')`), 'index.html');
    assert.equal(await evaluate(`document.querySelector('.evaluation-review-button').getAttribute('href')`), 'materi.html');
    assert.equal(await evaluate(`NetrivoSession.read('netrivoProgressV6', []).length`), 0);
    assert.equal(await evaluate(`document.querySelector('[data-question-number]').textContent`), 'Pertanyaan 01');
    const initialDirectOrder = await evaluate(`questionOrder.slice()`);
    for (const [width, height] of [[1920, 1080], [390, 844], [320, 720]]) {
      await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 390 });
      const layout = await evaluate(`(() => {
        const rect = selector => document.querySelector(selector).getBoundingClientRect();
        const brand = rect('.evaluation-brand');
        const header = rect('.evaluation-header');
        const navCluster = rect('.evaluation-nav-cluster');
        const dashboardRow = rect('.evaluation-dashboard-row');
        const shell = rect('.evaluation-shell');
        const actions = rect('.evaluation-header-actions');
        const dashboard = rect('.evaluation-dashboard-button');
        const review = rect('.evaluation-review-button');
        const heading = rect('.quiz-heading-row .eyebrow');
        const counter = rect('.quiz-heading-row .quiz-counter');
        return {
          overflow: document.documentElement.scrollWidth > window.innerWidth,
          separated: header.bottom <= dashboardRow.top + 1 && dashboardRow.bottom <= shell.top + 1,
          dashboardBelowHeader: dashboard.top >= header.bottom,
          brandCentered: Math.abs((brand.left + brand.width / 2) - (navCluster.left + navCluster.width / 2)) <= 1,
          headerItemsOverlap: navCluster.right > actions.left,
          reviewWithinHeader: review.top >= header.top && review.right <= header.right && review.bottom <= header.bottom,
          headingOverlap: heading.right > counter.left,
          cardRight: rect('.quiz-card').right,
          viewport: window.innerWidth
        };
      })()`);
      assert.equal(layout.overflow, false, `evaluation must not overflow at ${width}px`);
      assert.equal(layout.separated, true, `navigation and evaluation content must be separated at ${width}px`);
      assert.equal(layout.dashboardBelowHeader, true, `dashboard link must sit below the white header at ${width}px`);
      assert.equal(layout.brandCentered, true, `brand must be centered in its navigation area at ${width}px`);
      assert.equal(layout.headerItemsOverlap, false, `header controls must not overlap at ${width}px`);
      assert.equal(layout.reviewWithinHeader, true, `review button must stay inside the white header at ${width}px`);
      assert.equal(layout.headingOverlap, false, `evaluation heading must not overlap at ${width}px`);
      assert.ok(layout.cardRight <= layout.viewport, `quiz card must fit at ${width}px`);
      const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(os.tmpdir(), `netrivo-evaluation-layout-${width}.png`), Buffer.from(data, 'base64'));
    }
    await page.send('Emulation.clearDeviceMetricsOverride');
    for (let i = 0; i < 15; i++) {
      await evaluate(`document.querySelectorAll('[data-answers] button')[questions[currentQuestion].answer].click(); document.querySelector('[data-next]').click()`);
    }
    await waitFor(`location.pathname.endsWith('/hasil.html') && document.querySelector('[data-score]')?.textContent === '100'`);
    assert.equal(await evaluate(`document.querySelector('[data-retry-quiz]').getAttribute('href')`), 'quiz.html?mode=langsung');
    await evaluate(`document.querySelector('[data-retry-quiz]').click()`);
    await waitFor(`location.pathname.endsWith('/quiz.html') && !!document.querySelector('[data-answers] button')`);
    assert.equal(await evaluate('currentQuestion'), 0);
    assert.equal(await evaluate(`document.querySelector('[data-next]').disabled`), true);
    assert.notDeepEqual(await evaluate(`questionOrder.slice()`), initialDirectOrder, 'a new evaluation must use a different question order');
    await evaluate(`sessionStorage.clear()`);
    await navigate('materi.html');
    assert.deepEqual(await evaluate('readProgress().size'), 0, 'legacy progress must be ignored');
    assert.deepEqual(await evaluate("NetrivoSession.read('netrivoVisitedLessons', [])"), ['pengantar-konsep']);
    await evaluate(`document.querySelector('.module-next-step').scrollIntoView()`);
    await waitFor(`!document.querySelector('[data-complete-lesson]').disabled`);
    await evaluate(`document.querySelector('[data-complete-lesson]').click()`);
    await waitFor(`location.pathname.endsWith('/topologi.html') && !!document.querySelector('[data-reset-session]')`);
    assert.equal(await evaluate(`readProgress().has('pengantar-konsep')`), true);
    await evaluate(`document.querySelector('[data-lesson-video]').dispatchEvent(new Event('ended'))`);
    await reload();
    assert.equal(await evaluate(`document.querySelector('[data-complete-lesson]').disabled`), false, 'video completion survives reload');
    await evaluate(`document.querySelector('[data-complete-lesson]').click()`);
    await waitFor(`location.pathname.endsWith('/latihan-pengantar.html') && !!document.querySelector('[data-multi-option]')`);
    await evaluate(`document.querySelector('[data-question-index="0"][data-multi-option="1"]').click()`);
    await navigate('index.html');
    await navigate('latihan-pengantar.html');
    assert.equal(await evaluate(`document.querySelector('[data-question-index="0"][data-multi-option="1"]').classList.contains('selected-choice')`), true);
    assert.equal(await evaluate(`document.querySelector('[data-question-index="0"][data-multi-option="0"]').disabled`), true);
    await evaluate(`for (let q = 1; q < 5; q++) document.querySelector('[data-question-index="' + q + '"][data-multi-option="0"]').click()`);
    await reload();
    assert.equal(await evaluate(`document.querySelector('[data-complete-lesson]').dataset.action`), 'retry');
    await evaluate(`document.querySelector('[data-complete-lesson]').click()`);
    assert.deepEqual(await evaluate(`NetrivoSession.read('netrivoPractice:pengantar-latihan', {}).answers`), [null, null, null, null, null]);
    await evaluate(`NetrivoSession.write('netrivoProgressV6', Object.keys(lessons))`);
    await navigate('quiz.html');
    const failedAttemptOrder = await evaluate(`questionOrder.slice()`);
    for (let i = 0; i < 15; i++) {
      await evaluate(`document.querySelectorAll('[data-answers] button')[0].click(); document.querySelector('[data-next]').click()`);
    }
    await reload();
    assert.equal(await evaluate(`document.querySelector('[data-next]').dataset.mode`), 'retry');
    await evaluate(`document.querySelector('[data-next]').click()`);
    assert.equal(await evaluate('currentQuestion'), 0);
    assert.equal(await evaluate(`document.querySelector('[data-next]').disabled`), true);
    assert.notDeepEqual(await evaluate(`questionOrder.slice()`), failedAttemptOrder, 'retry must reshuffle the questions');
    await evaluate(`document.querySelectorAll('[data-answers] button')[questions[0].answer].click(); document.querySelector('[data-next]').click()`);
    await reload();
    assert.equal(await evaluate('currentQuestion'), 1);
    assert.equal(await evaluate('answers[0]'), await evaluate('questions[0].answer'));
    for (let i = 1; i < 15; i++) {
      await evaluate(`document.querySelectorAll('[data-answers] button')[questions[currentQuestion].answer].click(); document.querySelector('[data-next]').click()`);
    }
    await waitFor(`location.pathname.endsWith('/hasil.html') && document.querySelector('[data-score]')?.textContent === '100'`);
    await reload();
    assert.equal(await evaluate(`document.querySelector('[data-score]').textContent`), '100');
    await evaluate(`sessionStorage.setItem('extra-test-key', 'clear me'); document.querySelector('[data-reset-session]').click()`);
    await waitFor(`location.pathname.endsWith('/index.html') && document.readyState === 'complete'`);
    assert.equal(await evaluate('sessionStorage.length'), 0, 'reset clears every session key');
    await navigate('quiz.html');
    assert.equal(await evaluate(`document.querySelector('[data-quiz-lock]').hidden`), false);
    await navigate('materi.html');
    await evaluate(`sessionStorage.setItem('tab-marker', 'old tab')`);
    await browser.send('Target.closeTarget', { targetId: page.targetId });
    page.close();
    page = await openPage();
    await navigate('materi.html');
    assert.equal(await evaluate(`sessionStorage.getItem('tab-marker')`), null);
    assert.equal(await evaluate('readProgress().size'), 0);
    for (const width of [1365, 390, 320]) {
      await page.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true);
      const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(os.tmpdir(), `netrivo-session-${width}.png`), Buffer.from(data, 'base64'));
    }
    await navigate('quiz.html');
    assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true, 'quiz header fits mobile');
    console.log('PASS: navigation, refresh, read/video status, locked answers, retry, quiz score, reset, new tab and responsive layout.');
  } finally {
    page?.close();
    await browser.send('Browser.close');
    browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });

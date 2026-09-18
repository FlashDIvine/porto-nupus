import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();

    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  async send(method, params = {}) {
    await this.ready;
    const msgId = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  console.log('=== STARTING GALLERY MOBILE ERGONOMICS & LIGHTBOX VERIFICATION ===\n');

  if (!fs.existsSync('public/verification-evidence')) {
    fs.mkdirSync('public/verification-evidence', { recursive: true });
  }

  let serverProc = null;
  try {
    await new Promise((res, rej) => {
      const req = http.get('http://127.0.0.1:3000/gallery', (r) => {
        if (r.statusCode === 200) res(true);
        else rej(new Error('Status: ' + r.statusCode));
      });
      req.on('error', rej);
    });
    console.log('Next.js server is already running on port 3000.');
  } catch {
    console.log('Starting Next.js server (npm run start) on port 3000...');
    serverProc = spawn('npm', ['run', 'start'], { stdio: 'inherit' });
    let ready = false;
    for (let i = 0; i < 30; i++) {
      await wait(1000);
      try {
        ready = await new Promise((res) => {
          http.get('http://127.0.0.1:3000/gallery', (r) => res(r.statusCode === 200)).on('error', () => res(false));
        });
        if (ready) {
          console.log('Next.js server is ready!\n');
          break;
        }
      } catch {}
    }
    if (!ready) throw new Error('Next.js server failed to start within 30 seconds');
  }

  console.log('Launching headless Brave browser with remote debugging on 9222...');
  const browserProc = spawn(
    '/opt/brave.com/brave/brave',
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--user-data-dir=/tmp/brave-gallery-test-' + Date.now(),
    ],
    { stdio: 'ignore' }
  );

  try {
    let versionData = null;
    for (let i = 0; i < 25; i++) {
      await wait(300);
      try {
        versionData = await getJson('http://127.0.0.1:9222/json/version');
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch {}
    }

    if (!versionData) throw new Error('Could not connect to Brave remote debugging port');
    console.log('Connected to Brave CDP:', versionData.Browser);

    const list = await getJson('http://127.0.0.1:9222/json/list');
    let target = list.find((t) => t.type === 'page');
    if (!target) {
      target = await getJson('http://127.0.0.1:9222/json/new?http://127.0.0.1:3000/gallery');
    }

    const cdp = new CdpClient(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    // =========================================================================
    // TEST 1: iPhone Standard Viewport (375x812) - Layout Order & Masonry
    // =========================================================================
    console.log('\n--- TEST 1: iPhone Standard Viewport (375x812) & Layout Hierarchy ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });

    console.log('Navigating to http://127.0.0.1:3000/gallery ...');
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/gallery' });
    await wait(2500);

    const layoutCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('h1');
        const filter = document.querySelector('[role="tablist"]');
        const masonry = document.querySelector('.columns-2');
        const cards = Array.from(document.querySelectorAll('[role="button"][aria-label*="karya"]'));
        const navbar = document.querySelector('header');
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;

        const headerRect = header ? header.getBoundingClientRect() : null;
        const filterRect = filter ? filter.getBoundingClientRect() : null;
        const navbarRect = navbar ? navbar.getBoundingClientRect() : null;

        const cardRects = cards.map((c, i) => {
          const r = c.getBoundingClientRect();
          return { index: i, left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
        });
        const leftPositions = [...new Set(cardRects.map(r => r.left))].sort((a, b) => a - b);

        return {
          docWidth,
          scrollWidth,
          noHorizontalOverflow: scrollWidth <= docWidth + 1,
          headerFound: !!header,
          headerIsAboveFilter: headerRect && filterRect ? headerRect.top < filterRect.top : false,
          filterFound: !!filter,
          masonryFound: !!masonry,
          cardCount: cards.length,
          distinctColumns: leftPositions.length,
          leftPositions,
          navbarBottom: navbarRect ? Math.round(navbarRect.bottom) : null,
          filterTop: filterRect ? Math.round(filterRect.top) : null,
        };
      })()`,
      returnByValue: true,
    });

    console.log('Initial Layout Check (iPhone 375px):', JSON.stringify(layoutCheck.result.value, null, 2));

    if (!layoutCheck.result.value.noHorizontalOverflow) {
      throw new Error(`Horizontal overflow detected! scrollWidth=${layoutCheck.result.value.scrollWidth} > clientWidth=${layoutCheck.result.value.docWidth}`);
    }
    if (!layoutCheck.result.value.headerIsAboveFilter) {
      throw new Error('Editorial Header must be placed ABOVE the filter bar in the visual hierarchy');
    }
    if (layoutCheck.result.value.distinctColumns !== 2) {
      throw new Error(`Expected 2 distinct columns on mobile, found: ${layoutCheck.result.value.distinctColumns}`);
    }

    // Scroll down 220px to verify sticky filter clearance below navbar
    console.log('Scrolling down 220px to verify sticky filter clearance below navbar...');
    await cdp.send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 220, behavior: 'instant' });`,
    });
    await wait(600);

    const stickyCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const filterBar = document.querySelector('[role="tablist"]')?.closest('.sticky');
        const navbar = document.querySelector('header');
        const fRect = filterBar ? filterBar.getBoundingClientRect() : null;
        const nRect = navbar ? navbar.getBoundingClientRect() : null;

        return {
          navbarBottom: nRect ? Math.round(nRect.bottom) : null,
          filterBarTop: fRect ? Math.round(fRect.top) : null,
          clearance: fRect && nRect ? Math.round(fRect.top - nRect.bottom) : null,
          noOverlap: fRect && nRect ? fRect.top >= nRect.bottom : false,
        };
      })()`,
      returnByValue: true,
    });

    console.log('Sticky Filter Clearance Check:', JSON.stringify(stickyCheck.result.value, null, 2));

    if (!stickyCheck.result.value.noOverlap) {
      throw new Error(`Sticky filter overlaps navbar! filterBarTop=${stickyCheck.result.value.filterBarTop} < navbarBottom=${stickyCheck.result.value.navbarBottom}`);
    }

    // Capture Screenshot (a): 01_gallery_mobile_masonry_state.png
    console.log('Capturing Screenshot (a): 01_gallery_mobile_masonry_state.png ...');
    const shotA = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      'public/verification-evidence/01_gallery_mobile_masonry_state.png',
      Buffer.from(shotA.data, 'base64')
    );

    // =========================================================================
    // TEST 2: Category Filter Reactive State & Exact Count Match
    // =========================================================================
    console.log('\n--- TEST 2: Category Filter Reactive State & Exact Count Match ---');
    const filterClick = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const targetTab = tabs.find(t => t.textContent.includes('Branding'));
        if (targetTab) {
          targetTab.click();
          return { clicked: true, name: targetTab.textContent.trim() };
        }
        return { clicked: false };
      })()`,
      returnByValue: true,
    });

    console.log('Clicked Category Tab:', filterClick.result.value);
    if (!filterClick.result.value.clicked) {
      throw new Error('Could not find Branding category filter tab');
    }
    await wait(700); // Allow Framer Motion exit animation and layout to complete

    const filterResult = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('[role="button"][aria-label*="karya"]'));
        const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
        return {
          activeTab: activeTab ? activeTab.textContent.trim() : null,
          filteredCardCount: cards.length,
        };
      })()`,
      returnByValue: true,
    });

    console.log('Filter State Result:', filterResult.result.value);
    if (filterResult.result.value.filteredCardCount !== 2) {
      throw new Error(`Expected exactly 2 cards for Branding category, got ${filterResult.result.value.filteredCardCount}`);
    }

    // Capture Screenshot (c): 03_gallery_category_filtered.png
    console.log('Capturing Screenshot (c): 03_gallery_category_filtered.png ...');
    const shotC = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      'public/verification-evidence/03_gallery_category_filtered.png',
      Buffer.from(shotC.data, 'base64')
    );

    // Reset filter to All
    console.log('Resetting filter to All Works...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        if (tabs[0]) tabs[0].click();
      })()`,
    });
    await wait(500);

    // =========================================================================
    // TEST 3: Tap Card & Open Lightbox With Collapsible Metadata Drawer
    // =========================================================================
    console.log('\n--- TEST 3: Tap Card & Open Interactive Lightbox ---');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const firstCard = document.querySelector('[role="button"][aria-label*="karya"]');
        if (firstCard) {
          firstCard.scrollIntoView({ behavior: 'instant', block: 'center' });
          firstCard.click();
        }
      })()`,
    });
    await wait(1000);

    const lightboxInspection = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const root = document.querySelector('.yarl__root');
        const counter = document.querySelector('.yarl__counter');
        const caption = document.querySelector('.yarl__custom_caption');
        const collapseBtn = caption ? caption.querySelector('button[aria-label*="Sembunyikan"]') : null;
        const caseStudyLink = caption ? caption.querySelector('a[href*="/project/"]') : null;
        const slide = document.querySelector('.yarl__slide_current, .yarl__slide');
        const img = slide ? slide.querySelector('img') : null;

        // Check computed background of container
        const container = document.querySelector('.yarl__container');
        const bg = container ? window.getComputedStyle(container).backgroundColor : null;

        return {
          open: !!root,
          counter: counter ? counter.textContent.trim() : null,
          hasCaption: !!caption,
          hasCollapseBtn: !!collapseBtn,
          hasCaseStudyLink: !!caseStudyLink,
          imgFound: !!img,
          bgColor: bg,
        };
      })()`,
      returnByValue: true,
    });

    console.log('Lightbox Inspection:', JSON.stringify(lightboxInspection.result.value, null, 2));

    if (!lightboxInspection.result.value.open) {
      throw new Error('Lightbox did not open upon card click');
    }
    if (!lightboxInspection.result.value.hasCaption) {
      throw new Error('Lightbox bottom caption drawer not found');
    }

    // Wait for slide image to load
    await cdp.send('Runtime.evaluate', {
      expression: `new Promise(resolve => {
        const img = document.querySelector('.yarl__slide_current img, .yarl__slide img');
        if (!img || img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 4000);
      })`,
      awaitPromise: true,
    });
    await wait(600);

    // Capture Screenshot (b): 02_gallery_mobile_lightbox_active.png
    console.log('Capturing Screenshot (b): 02_gallery_mobile_lightbox_active.png ...');
    const shotB = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      'public/verification-evidence/02_gallery_mobile_lightbox_active.png',
      Buffer.from(shotB.data, 'base64')
    );

    // Test Collapsible Detail Drawer
    console.log('Testing collapse toggle in lightbox caption...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label*="Sembunyikan"]');
        if (btn) btn.click();
      })()`,
    });
    await wait(400);

    const collapsedCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const expandBtn = document.querySelector('button[aria-label*="Tampilkan detail"]');
        return { isCollapsed: !!expandBtn };
      })()`,
      returnByValue: true,
    });
    console.log('Caption Collapsed Status:', collapsedCheck.result.value);
    if (!collapsedCheck.result.value.isCollapsed) {
      throw new Error('Caption did not collapse upon toggle click');
    }

    // Expand back
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const expandBtn = document.querySelector('button[aria-label*="Tampilkan detail"]');
        if (expandBtn) expandBtn.click();
      })()`,
    });
    await wait(400);

    // Test Next Slide Navigation
    console.log('Testing Next slide navigation and counter increment...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const nextBtn = document.querySelector('.yarl__navigation_next, button[aria-label*="Next"]');
        if (nextBtn) nextBtn.click();
        else window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      })()`,
    });
    await wait(600);

    const nextCounter = await cdp.send('Runtime.evaluate', {
      expression: `document.querySelector('.yarl__counter')?.textContent.trim()`,
      returnByValue: true,
    });
    console.log('Counter after Next Slide:', nextCounter.result.value);
    if (nextCounter.result.value !== '2 / 5') {
      throw new Error(`Expected counter to advance to "2 / 5", got "${nextCounter.result.value}"`);
    }

    // Test Lightbox Dismissal
    console.log('Dismissing lightbox...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.querySelector('.yarl__button[aria-label*="Close"]');
        if (closeBtn) closeBtn.click();
        else window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      })()`,
    });
    await wait(600);

    const closed = await cdp.send('Runtime.evaluate', {
      expression: `!document.querySelector('.yarl__root')`,
      returnByValue: true,
    });
    if (!closed.result.value) {
      throw new Error('Lightbox failed to close');
    }
    console.log('Lightbox closed cleanly.');

    // =========================================================================
    // TEST 4: Android Standard Viewport (412x915)
    // =========================================================================
    console.log('\n--- TEST 4: Android Standard Viewport (412x915) ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 412,
      height: 915,
      deviceScaleFactor: 2.625,
      mobile: true,
    });
    await wait(500);

    const androidMetrics = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const cards = Array.from(document.querySelectorAll('[role="button"][aria-label*="karya"]'));
        const cardRects = cards.map(c => {
          const r = c.getBoundingClientRect();
          return { left: Math.round(r.left), width: Math.round(r.width) };
        });
        const distinctCols = [...new Set(cardRects.map(r => r.left))].length;

        return {
          docWidth,
          scrollWidth,
          noOverflow: scrollWidth <= docWidth + 1,
          cardCount: cards.length,
          distinctCols,
        };
      })()`,
      returnByValue: true,
    });

    console.log('Android Viewport Metrics:', JSON.stringify(androidMetrics.result.value, null, 2));
    if (!androidMetrics.result.value.noOverflow) {
      throw new Error('Android viewport has horizontal overflow');
    }
    if (androidMetrics.result.value.distinctCols !== 2) {
      throw new Error('Expected 2 distinct columns on Android viewport');
    }

    console.log('\n============================================================');
    console.log('>>> ALL VERIFICATION SUITE CHECKS PASSED FLAWLESSLY! <<<');
    console.log('============================================================\n');

    cdp.close();
  } finally {
    browserProc.kill();
    if (serverProc) serverProc.kill();
  }
}

run().catch((err) => {
  console.error('\nVerification FAILED:', err);
  process.exit(1);
});

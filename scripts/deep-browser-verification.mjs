import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
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
    this.events = new Map();

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
  console.log('Launching headless Brave browser with remote debugging on 9222...');
  const browserProc = spawn('/opt/brave.com/brave/brave', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--user-data-dir=/tmp/brave-test-profile-' + Date.now(),
  ], { stdio: 'ignore' });

  try {
    let versionData = null;
    for (let i = 0; i < 20; i++) {
      await wait(300);
      try {
        versionData = await getJson('http://127.0.0.1:9222/json/version');
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch {}
    }

    if (!versionData) throw new Error('Could not connect to Brave remote debugging port');
    console.log('Connected to Brave CDP:', versionData.Browser);

    // Create a new target page
    const list = await getJson('http://127.0.0.1:9222/json/list');
    let target = list.find(t => t.type === 'page');
    if (!target) {
      target = await getJson('http://127.0.0.1:9222/json/new?http://127.0.0.1:3000');
    }

    const cdp = new CdpClient(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log('\n--- TEST 1: iPhone Standard Viewport (375x812) ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });

    console.log('Navigating to http://127.0.0.1:3000 ...');
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
    await wait(2500); // Allow Turbopack hydration

    // Check DOM scroll height and mobile boundary
    const evalRes1 = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const carousel = document.querySelector('.max-h-\\\\[440px\\\\]');
        const mobileContainer = document.querySelector('.block.md\\\\:hidden');
        const desktopContainer = document.querySelector('.hidden.md\\\\:grid');
        const dock = document.querySelector('[aria-label="Mobile Dock Navigation"]');
        const filter = document.querySelector('[role="tablist"]');
        const gallery = document.getElementById('gallery');
        
        return {
          carouselFound: !!carousel,
          carouselHeight: carousel ? carousel.offsetHeight : 0,
          mobileVisible: mobileContainer ? window.getComputedStyle(mobileContainer).display !== 'none' : false,
          desktopHidden: desktopContainer ? window.getComputedStyle(desktopContainer).display === 'none' : false,
          dockFound: !!dock,
          filterFound: !!filter,
          documentScrollHeight: document.documentElement.scrollHeight,
          galleryOffsetHeight: gallery ? gallery.offsetHeight : 0,
        };
      })()`,
      returnByValue: true,
    });

    console.log('Mobile Viewport Metrics:', evalRes1.result.value);
    if (!evalRes1.result.value.carouselFound) throw new Error('Carousel not found on mobile');
    if (evalRes1.result.value.carouselHeight > 440) throw new Error(`Carousel height ${evalRes1.result.value.carouselHeight} exceeds 440px constraint`);
    if (!evalRes1.result.value.mobileVisible) throw new Error('Mobile container is not visible on 375px');
    // Capture Screenshot A: Initial carousel state with filter and dock
    console.log('Scrolling to gallery section...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const gallery = document.getElementById('gallery');
        if (gallery) {
          gallery.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      })()`,
    });
    await wait(800);

    console.log('Capturing Screenshot A: Mobile Carousel State...');
    const shotA = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('public/verification-evidence/01_mobile_carousel_state.png', Buffer.from(shotA.data, 'base64'));

    // Check filter interaction: click a specific category pill
    console.log('\n--- TEST 2: Filter Interaction (Client-Side State) ---');
    const filterClickRes = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const targetTab = tabs.find(t => t.textContent.includes('Branding') || t.textContent.includes('Typography'));
        if (targetTab) {
          targetTab.click();
          return { clicked: true, name: targetTab.textContent.trim() };
        }
        return { clicked: false };
      })()`,
      returnByValue: true,
    });
    console.log('Clicked category tab:', filterClickRes.result.value);
    await wait(600);

    const countAfterFilter = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const slides = document.querySelectorAll('.flex-\\\\[0_0_86\\\\%\\\\]');
        return { slideCount: slides.length };
      })()`,
      returnByValue: true,
    });
    console.log('Slides visible after category filter:', countAfterFilter.result.value);

    // Reset filter to All
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        if (tabs[0]) tabs[0].click();
      })()`,
    });
    await wait(400);

    // TEST 3: Embla Carousel Swipe / Next Button
    console.log('\n--- TEST 3: Carousel Navigation & Counter ---');
    const prevCounter = await cdp.send('Runtime.evaluate', {
      expression: `document.querySelector('.inline-flex.font-mono .text-\\\\[\\\\#E26D5C\\\\].font-semibold')?.textContent`,
      returnByValue: true,
    });
    console.log('Initial Counter:', prevCounter.result.value);

    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const nextBtn = document.querySelector('button[aria-label="Slide berikutnya"]');
        if (nextBtn && !nextBtn.disabled) {
          nextBtn.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true,
    });
    await wait(500);

    const nextCounter = await cdp.send('Runtime.evaluate', {
      expression: `document.querySelector('.inline-flex.font-mono .text-\\\\[\\\\#E26D5C\\\\].font-semibold')?.textContent`,
      returnByValue: true,
    });
    console.log('Counter after clicking Next:', nextCounter.result.value);

    // TEST 4: Tap Project Card to Open Bottom Sheet Drawer (Vaul)
    console.log('\n--- TEST 4: Tap Card & Open Vaul Bottom Sheet Drawer ---');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('[role="button"][aria-label*="detail proyek"]');
        if (card) {
          card.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true,
    });
    await wait(1000); // Allow drawer spring animation

    const drawerCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const drawerContent = document.querySelector('[data-vaul-drawer]');
        const drawerTitle = document.querySelector('[data-vaul-drawer] h2, [data-vaul-drawer] [role="heading"]');
        const liveDemo = Array.from(document.querySelectorAll('[data-vaul-drawer] a')).find(a => a.textContent.includes('Live Demo') || a.textContent.includes('Demo'));
        const sourceCode = Array.from(document.querySelectorAll('[data-vaul-drawer] a')).find(a => a.textContent.includes('Source Code'));
        const impactChips = document.querySelectorAll('[data-vaul-drawer] .bg-white\\\\/8');
        const metrics = document.querySelectorAll('[data-vaul-drawer] .grid-cols-2 > div, [data-vaul-drawer] .grid-cols-3 > div');
        const challenges = document.querySelectorAll('[data-vaul-drawer] .bg-white\\\\/\\\\[0\\\\.03\\\\]');
        
        return {
          drawerFound: !!drawerContent,
          title: drawerTitle ? drawerTitle.textContent.trim() : null,
          hasLiveDemo: !!liveDemo,
          hasSourceCode: !!sourceCode,
          impactChipsCount: impactChips.length,
          metricsCount: metrics.length,
          challengesCount: challenges.length,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Drawer Elements Verified:', drawerCheck.result.value);
    if (!drawerCheck.result.value.drawerFound) throw new Error('Bottom sheet drawer failed to open on mobile card tap');

    // Capture Screenshot C: Opened project case study drawer
    console.log('Capturing Screenshot C: Opened Drawer State...');
    const shotC = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('public/verification-evidence/02_mobile_project_drawer.png', Buffer.from(shotC.data, 'base64'));

    // Close the drawer by clicking the close button
    console.log('Closing drawer via close button...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.querySelector('button[aria-label="Tutup detail proyek"]');
        if (closeBtn) closeBtn.click();
      })()`,
    });
    await wait(600);

    // Scroll to bottom to inspect mobile floating dock visibility and footer clearance
    console.log('\n--- TEST 5: Mobile Floating Dock Visibility & Clearance ---');
    await cdp.send('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.body.scrollHeight);`,
    });
    await wait(500);

    const shotB = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('public/verification-evidence/03_mobile_bottom_dock.png', Buffer.from(shotB.data, 'base64'));

    // TEST 6: Desktop Viewport (1280x800) & Ambient Spotlight
    console.log('\n--- TEST 6: Desktop Viewport (1280x800) & Ambient Spotlight ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
    await wait(2500);

    const desktopCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const mobile = Array.from(document.querySelectorAll('div')).find(el => el.className.includes('block') && el.className.includes('md:hidden'));
        const desktop = Array.from(document.querySelectorAll('div')).find(el => el.className.includes('hidden') && el.className.includes('md:grid'));
        const cards = desktop ? desktop.querySelectorAll('.group') : [];
        return {
          mobileHidden: mobile ? window.getComputedStyle(mobile).display === 'none' : true,
          desktopVisible: desktop ? window.getComputedStyle(desktop).display !== 'none' : false,
          desktopCardCount: cards.length,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Desktop Boundary Metrics:', desktopCheck.result.value);
    if (!desktopCheck.result.value.desktopVisible) throw new Error('Desktop bento is not visible on desktop viewport');
    if (!desktopCheck.result.value.mobileHidden) throw new Error('Mobile carousel should be hidden on desktop');

    // Test ambient spotlight tracking on desktop card
    console.log('Dispatching mousemove event over desktop Bento card...');
    const spotlightCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const desktop = Array.from(document.querySelectorAll('div')).find(el => el.className.includes('hidden') && el.className.includes('md:grid'));
        const firstCard = desktop ? desktop.querySelector('.group') : null;
        if (!firstCard) return { error: 'No desktop card found' };
        firstCard.scrollIntoView({ behavior: 'instant', block: 'center' });
        const r = firstCard.getBoundingClientRect();
        
        // Dispatch mousemove event directly on the card
        const evt = new MouseEvent('mousemove', {
          clientX: r.left + 75,
          clientY: r.top + 75,
          bubbles: true,
          cancelable: true,
        });
        firstCard.dispatchEvent(evt);
        
        const styleX = firstCard.style.getPropertyValue('--x');
        const styleY = firstCard.style.getPropertyValue('--y');
        return {
          styleX,
          styleY,
          hasDynamicVars: !!(styleX && styleY),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Spotlight Dynamic Coordinates Result:', spotlightCheck.result.value);
    if (!spotlightCheck.result.value.hasDynamicVars) throw new Error('Ambient spotlight did not set dynamic --x and --y variables');

    // TEST 7: Collapsible Archive Directory Modal
    console.log('\n--- TEST 7: Collapsible Archive Directory Modal ---');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const archiveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Archive') || b.textContent.includes('Arsip'));
        if (archiveBtn) archiveBtn.click();
      })()`,
    });
    await wait(600);

    const archiveModalCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const rows = dialog ? dialog.querySelectorAll('tbody tr') : [];
        return {
          dialogOpen: !!dialog,
          rowCount: rows.length,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Archive Directory Modal Result:', archiveModalCheck.result.value);
    if (!archiveModalCheck.result.value.dialogOpen) throw new Error('Archive modal failed to open');
    if (archiveModalCheck.result.value.rowCount === 0) throw new Error('Archive modal table is empty');

    const shotArchive = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('public/verification-evidence/04_archive_modal.png', Buffer.from(shotArchive.data, 'base64'));

    console.log('\n============================================================');
    console.log('>>> ALL DEEP BROWSER & COMPONENT VERIFICATION TESTS PASSED! <<<');
    console.log('============================================================\n');

    cdp.close();
  } finally {
    browserProc.kill();
  }
}

run().catch(err => {
  console.error('\nDeep Verification FAILED with error:', err);
  process.exit(1);
});

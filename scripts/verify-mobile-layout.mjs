import http from 'node:http';

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

async function runVerification() {
  console.log('=== STARTING AUTOMATED VIEWPORT & COMPONENT VERIFICATION ===\n');

  const { status, html } = await fetchHtml('http://127.0.0.1:3000');
  console.log(`[1] Server Response Status: ${status} (Expected: 200)`);
  if (status !== 200) throw new Error(`Unexpected status code ${status}`);

  // 1. Verify Taxonomy Filter
  const hasFilter = html.includes('role="tablist"') && (html.includes('Semua Karya') || html.includes('All Works'));
  console.log(`[2] Sticky Taxonomy Filter present: ${hasFilter ? 'PASS' : 'FAIL'}`);
  if (!hasFilter) throw new Error('Sticky Taxonomy Filter not found in DOM');

  // Check sticky positioning
  const isSticky = html.includes('sticky top-16');
  console.log(`[3] Taxonomy Filter sticky boundary positioning: ${isSticky ? 'PASS' : 'FAIL'}`);
  if (!isSticky) throw new Error('Filter is not sticky');

  // 2. Verify Mobile Carousel Container Constraints (< 768px)
  const hasMobileBlock = html.includes('block md:hidden');
  const hasMaxHConstraint = html.includes('max-h-[440px]');
  console.log(`[4] Mobile container (<768px) isolated via "block md:hidden": ${hasMobileBlock ? 'PASS' : 'FAIL'}`);
  console.log(`[5] Vertical height constrained to max 440px: ${hasMaxHConstraint ? 'PASS' : 'FAIL'}`);
  if (!hasMobileBlock || !hasMaxHConstraint) throw new Error('Mobile viewport constraints missing');

  // 3. Verify Embla Carousel Slide Viewport
  const hasEmblaSlides = html.includes('flex-[0_0_86%]') || html.includes('touch-pan-y');
  console.log(`[6] Touch-optimized snap slider layout: ${hasEmblaSlides ? 'PASS' : 'FAIL'}`);
  if (!hasEmblaSlides) throw new Error('Embla snap carousel layout missing');

  // 4. Verify Desktop Bento Grid Boundary (>= 768px)
  const hasDesktopBento = html.includes('hidden md:grid');
  console.log(`[7] Desktop Bento Grid isolated via "hidden md:grid": ${hasDesktopBento ? 'PASS' : 'FAIL'}`);
  if (!hasDesktopBento) throw new Error('Desktop bento isolation missing');

  // 5. Verify Floating Thumb-Zone Navigation Dock
  const hasFloatingDock = html.includes('Mobile Dock Navigation') || (html.includes('fixed bottom-5') && html.includes('md:hidden'));
  console.log(`[8] Floating Thumb-Zone Navigation Dock present: ${hasFloatingDock ? 'PASS' : 'FAIL'}`);
  if (!hasFloatingDock) throw new Error('Mobile Floating Dock missing');

  // 6. Verify Instant Copy Email Interaction & Tooltip
  const hasCopyInteraction = html.includes('Salin Alamat Email') || html.includes('Copy Email');
  console.log(`[9] Instant Copy Email interaction mounted: ${hasCopyInteraction ? 'PASS' : 'FAIL'}`);
  if (!hasCopyInteraction) throw new Error('Copy email button missing');

  // 7. Verify Collapsible Directory ("View Full Archive")
  const hasArchiveTrigger = html.includes('Lihat Semua Arsip') || html.includes('View Full Archive');
  console.log(`[10] Collapsible Archive Directory trigger present: ${hasArchiveTrigger ? 'PASS' : 'FAIL'}`);
  if (!hasArchiveTrigger) throw new Error('Archive directory trigger missing');

  console.log('\n=== ALL 10 ARCHITECTURAL & COMPONENT VERIFICATION TESTS PASSED ===');
}

runVerification().catch(err => {
  console.error('\nVerification FAILED:', err);
  process.exit(1);
});

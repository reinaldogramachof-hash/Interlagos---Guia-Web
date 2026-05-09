import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const SCREENSHOTS_DIR = '../audit-screenshots';
mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const browser = await chromium.launch({ headless: false, slowMo: 400 });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

// Capturar erros de console
page.on('console', msg => {
  if (msg.type() === 'error') console.log('[CONSOLE ERROR]', msg.text().slice(0, 100));
});

async function shot(name) {
  await page.screenshot({ path: join(SCREENSHOTS_DIR, name + '.png'), fullPage: false });
  console.log('   [SHOT]', name + '.png');
}
async function shotFull(name) {
  await page.screenshot({ path: join(SCREENSHOTS_DIR, name + '.png'), fullPage: true });
  console.log('   [SHOT FULL]', name + '.png');
}

try {
  console.log('=== PASSO 1: Home ===');
  await page.goto('http://localhost:5173/interlagos/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await shot('01-home');

  console.log('\n=== PASSO 2: Login ===');
  // Clicar no botão "Entrar" (não no SVG genérico)
  const entrarBtn = page.locator('button:has-text("Entrar")').first();
  const isVisible = await entrarBtn.isVisible();
  console.log('   Botao Entrar visivel:', isVisible);

  if (isVisible) {
    await entrarBtn.click();
    await page.waitForTimeout(1500);
    await shot('02-login-modal');

    const emailInput = page.locator('input[type="email"]').first();
    const emailVisible = await emailInput.isVisible().catch(() => false);
    console.log('   Input email visivel:', emailVisible);

    if (emailVisible) {
      await emailInput.fill('premium@teste.com');
      await page.waitForTimeout(300);

      const pwdInput = page.locator('input[type="password"]').first();
      const pwdVisible = await pwdInput.isVisible().catch(() => false);
      if (pwdVisible) {
        await pwdInput.fill('Teste1234');
        await page.waitForTimeout(300);
        await shot('03-login-filled');

        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click();
          console.log('   Login submetido, aguardando...');
          await page.waitForTimeout(5000);
          await shot('04-after-login');
        }
      } else {
        console.log('   Campo senha nao visivel — tentando Magic Link?');
        // App pode usar Magic Link — tentar submeter só com email
        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(3000);
          await shot('04-magic-link-sent');
        }
      }
    } else {
      console.log('   Modal sem email input — capturando o que foi aberto');
      await shot('04-login-state');
    }
  }

  console.log('\n=== PASSO 3: Navegar para Vitrine ===');
  const vitrineBtn = page.locator('button:has-text("Vitrine")').first();
  if (await vitrineBtn.isVisible()) {
    await vitrineBtn.click();
    await page.waitForTimeout(2000);
    await shot('05-vitrine-view');
    await shotFull('05-vitrine-view-full');
  } else {
    console.log('   Vitrine nao encontrada, capturando estado atual');
    await shot('05-current-state');
  }

  console.log('\n=== PASSO 4: Abrir loja na VitrineTab ===');
  // A VitrineTab mostra cards de lojas — clicar no primeiro
  // Baseado na estrutura: NeighborhoodFeed ou VitrineTab
  const storeCards = page.locator('[class*="cursor-pointer"]');
  const count = await storeCards.count();
  console.log('   Elementos cursor-pointer:', count);

  if (count > 0) {
    const firstCard = storeCards.first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await page.waitForTimeout(2000);
      await shot('06-store-opened');
    }
  }

  // Verificar se abriu um modal ou view de loja
  console.log('   Verificando se modal/view de loja abriu...');
  await shotFull('06-store-state');

  console.log('\n=== PASSO 5: Scroll e captura da loja ===');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await shot('07-store-top');

  await page.evaluate(() => window.scrollTo(0, 220));
  await page.waitForTimeout(400);
  await shot('07-store-hero-bottom');

  await page.evaluate(() => window.scrollTo(0, 440));
  await page.waitForTimeout(400);
  await shot('07-store-profile-section');

  await page.evaluate(() => window.scrollTo(0, 660));
  await page.waitForTimeout(400);
  await shot('07-store-products-top');

  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  await shot('07-store-products-mid');

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(400);
  await shot('07-store-products-bottom');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await shot('07-store-bottom-cta');

  // Full page da loja
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await shotFull('08-store-fullpage');

  console.log('\n=== PASSO 6: Navegar para Comércios (MerchantsView) ===');
  await page.goto('http://localhost:5173/interlagos/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const comerciosBtn = page.locator('button:has-text("Comércios")').first();
  if (await comerciosBtn.isVisible()) {
    await comerciosBtn.click();
    await page.waitForTimeout(2000);
    await shot('09-comercios-view');
    await shotFull('09-comercios-view-full');

    // Tentar abrir um comerciante
    const merchantCard = page.locator('[class*="cursor-pointer"]').first();
    if (await merchantCard.isVisible()) {
      await merchantCard.click();
      await page.waitForTimeout(2000);
      await shot('10-merchant-detail');
      await shotFull('10-merchant-detail-full');
    }
  }

  console.log('\n=== PASSO 7: Painel do Comerciante ===');
  await page.goto('http://localhost:5173/interlagos/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Listar todos os botoes para encontrar "Minha Loja" ou similar
  const allBtns = await page.locator('button').all();
  console.log('   Botoes disponiveis:');
  for (const btn of allBtns) {
    const text = await btn.textContent().catch(() => '');
    const t = text?.trim();
    if (t) console.log('     -', t.slice(0, 60));
  }

  // Tentar acessar painel merchant
  const merchantPanelSelectors = [
    'button:has-text("Minha Loja")',
    'button:has-text("Painel")',
    'button:has-text("Comerciante")',
    'button:has-text("Loja")',
  ];

  for (const sel of merchantPanelSelectors) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      console.log('   Abrindo painel com:', sel);
      await el.click();
      await page.waitForTimeout(2000);
      break;
    }
  }

  await shotFull('11-merchant-panel');

  // Tentar tab Vitrine/Customizar no painel
  const tabs = ['Vitrine', 'Customizar', 'Aparência', 'Design', 'Loja', 'Sobre'];
  for (const tab of tabs) {
    const el = page.locator(`button:has-text("${tab}")`).first();
    if (await el.isVisible().catch(() => false)) {
      console.log('   Clicando em tab:', tab);
      await el.click();
      await page.waitForTimeout(1500);
      await shotFull(`12-panel-tab-${tab.toLowerCase()}`);
      break;
    }
  }

  console.log('\n=== AUDITORIA CONCLUIDA ===');
  console.log('Pasta: audit-screenshots/');

} catch (err) {
  console.error('\nERRO:', err.message);
  await page.screenshot({ path: join(SCREENSHOTS_DIR, 'ERROR.png') }).catch(() => {});
}

console.log('\nBrowser aberto por 20 segundos para inspecao manual...');
await page.waitForTimeout(20000);
await browser.close();

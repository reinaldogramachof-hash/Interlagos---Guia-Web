import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const SCREENSHOTS_DIR = 'audit-screenshots';
mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const browser = await chromium.launch({ headless: false, slowMo: 300 });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14 viewport

try {
  console.log('1. Abrindo app...');
  await page.goto('http://localhost:5173/interlagos/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(SCREENSHOTS_DIR, '01-home.png'), fullPage: false });
  console.log('   Screenshot 01-home.png capturado');

  // Procurar botão de login - inspecionar o que está na tela
  console.log('2. Tentando login...');

  // Capturar HTML para debug
  const pageTitle = await page.title();
  console.log('   Page title:', pageTitle);

  // Verificar elementos disponíveis
  const buttons = await page.locator('button').all();
  console.log('   Botões encontrados:', buttons.length);
  for (const btn of buttons.slice(0, 10)) {
    const text = await btn.textContent().catch(() => '');
    const ariaLabel = await btn.getAttribute('aria-label').catch(() => '');
    if (text || ariaLabel) console.log('   -', text?.trim() || ariaLabel);
  }

  // Tentar localizar botão de login/perfil
  const loginSelectors = [
    'button:has-text("Entrar")',
    'button:has-text("Login")',
    'button:has-text("Perfil")',
    '[data-testid="login"]',
    'button svg + span',
  ];

  let loggedIn = false;
  for (const sel of loginSelectors) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      console.log('   Clicando em:', sel);
      await el.click();
      await page.waitForTimeout(1500);
      break;
    }
  }

  await page.screenshot({ path: join(SCREENSHOTS_DIR, '02-login-attempt.png'), fullPage: false });
  console.log('   Screenshot 02-login-attempt.png capturado');

  // Verificar se modal de login apareceu
  const emailInput = page.locator('input[type="email"]').first();
  if (await emailInput.isVisible().catch(() => false)) {
    console.log('   Modal de login detectado, preenchendo...');
    await emailInput.fill('premium@teste.com');
    const pwdInput = page.locator('input[type="password"]').first();
    if (await pwdInput.isVisible().catch(() => false)) {
      await pwdInput.fill('Teste1234');
      await page.screenshot({ path: join(SCREENSHOTS_DIR, '02b-login-form.png'), fullPage: false });

      const submitBtn = page.locator('button[type="submit"]').first();
      if (await submitBtn.isVisible().catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(4000);
        console.log('   Login submetido');
      }
    }
  } else {
    console.log('   Modal de login nao detectado. Verificando estado atual...');
    // Pode já estar logado ou o fluxo é diferente
  }

  await page.screenshot({ path: join(SCREENSHOTS_DIR, '03-after-login.png'), fullPage: false });
  console.log('   Screenshot 03-after-login.png capturado');

  // Navegar para a aba Vitrine / Merchants
  console.log('3. Navegando para Vitrine...');

  // Inspecionar a navegação
  const navButtons = await page.locator('nav button, [role="navigation"] button, .bottom-nav button, footer button').all();
  console.log('   Nav buttons encontrados:', navButtons.length);
  for (const btn of navButtons) {
    const text = await btn.textContent().catch(() => '');
    const label = await btn.getAttribute('aria-label').catch(() => '');
    console.log('   Nav:', text?.trim() || label);
  }

  // Tentar tabs de navegação
  const vitrineSelectors = [
    'button:has-text("Vitrine")',
    'button:has-text("Lojas")',
    'button:has-text("Comerciantes")',
    'button:has-text("Merchants")',
  ];

  for (const sel of vitrineSelectors) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      console.log('   Clicando em vitrine:', sel);
      await el.click();
      await page.waitForTimeout(2000);
      break;
    }
  }

  await page.screenshot({ path: join(SCREENSHOTS_DIR, '04-vitrine-list.png'), fullPage: true });
  console.log('   Screenshot 04-vitrine-list.png capturado');

  // Tentar abrir uma loja
  console.log('4. Tentando abrir uma loja...');

  // Procurar cards de comerciante
  const cardSelectors = [
    '[class*="merchant-card"]',
    '[class*="MerchantCard"]',
    '.cursor-pointer',
    '[class*="card"] button',
    'article',
    '[data-merchant]',
  ];

  for (const sel of cardSelectors) {
    const cards = await page.locator(sel).all();
    if (cards.length > 0) {
      console.log(`   Encontrado ${cards.length} cards com: ${sel}`);
      await cards[0].click().catch(() => {});
      await page.waitForTimeout(2000);
      break;
    }
  }

  await page.screenshot({ path: join(SCREENSHOTS_DIR, '05-store-open.png'), fullPage: false });
  console.log('   Screenshot 05-store-open.png capturado');

  // Scroll para ver mais conteúdo
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(SCREENSHOTS_DIR, '06-store-scroll1.png'), fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(SCREENSHOTS_DIR, '07-store-scroll2.png'), fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(SCREENSHOTS_DIR, '08-store-scroll3.png'), fullPage: false });

  // Fullpage
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(SCREENSHOTS_DIR, '09-store-fullpage.png'), fullPage: true });
  console.log('   Screenshot 09-store-fullpage.png capturado');

  // Verificar sticky CTA no bottom
  console.log('5. Verificando sticky CTA...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(SCREENSHOTS_DIR, '10-store-bottom.png'), fullPage: false });
  console.log('   Screenshot 10-store-bottom.png capturado');

  // Voltar ao topo e inspecionar elementos
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Tentar acessar CustomizeTab no painel do comerciante
  console.log('6. Tentando acessar painel do comerciante...');
  await page.goBack().catch(() => {});
  await page.waitForTimeout(1500);

  // Procurar botão de acesso ao painel
  const panelSelectors = [
    'button:has-text("Minha Loja")',
    'button:has-text("Painel")',
    'button:has-text("Dashboard")',
    'button:has-text("Gerenciar")',
    '[aria-label*="merchant"]',
    '[aria-label*="painel"]',
  ];

  for (const sel of panelSelectors) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      console.log('   Abrindo painel:', sel);
      await el.click();
      await page.waitForTimeout(2000);
      break;
    }
  }

  await page.screenshot({ path: join(SCREENSHOTS_DIR, '11-merchant-panel.png'), fullPage: true });
  console.log('   Screenshot 11-merchant-panel.png capturado');

  // Também capturar o modal de loja diretamente via URL se possível
  console.log('7. Tentando navegar para VitrineTab...');
  await page.goto('http://localhost:5173/interlagos/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Capturar estado final da home
  await page.screenshot({ path: join(SCREENSHOTS_DIR, '12-home-final.png'), fullPage: true });

  console.log('\n=== TODOS OS SCREENSHOTS CAPTURADOS ===');
  console.log('Pasta:', SCREENSHOTS_DIR);
  console.log('Total: 12 screenshots');

} catch (err) {
  console.error('ERRO:', err.message);
  await page.screenshot({ path: join(SCREENSHOTS_DIR, 'ERROR-state.png'), fullPage: false });
}

// Manter browser aberto por 20 segundos para inspeção
console.log('\nBrowser ficará aberto por 20 segundos para inspeção...');
await page.waitForTimeout(20000);
await browser.close();

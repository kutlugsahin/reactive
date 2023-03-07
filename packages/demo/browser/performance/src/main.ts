import { exec, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { setTimeout } from 'node:timers/promises';
import puppeteer, { Browser, Page } from 'puppeteer';

let browser!: Browser;
let page!: Page;


const demo = process.argv[2];

async function runBrowser() {
  const precess =exec(`nx run demo-browser-${demo}:preview --configuration=production`);
  await setTimeout(5000);
  return precess
}

const distFolder = path.resolve(cwd(), `dist/packages/browser/performance/output/${demo}`);

async function find(selector) {
  await page.waitForSelector(selector);
  return await page.$(selector);
}

async function runTest() {
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.goto('http://localhost:4300');

  page.on('console', async (msg) =>
    console[msg.type()](...(await Promise.all(msg.args().map((arg) => arg.jsonValue()))))
  );

  await page.waitForSelector('#node-0');


  await page.tracing.start({ path: path.resolve(distFolder, 'trace.json'), screenshots: true });


  (await find(`#node-0 .caret`)).click();

  (await find('#node-0-0')).click();

  (await find('#row-0-0-0')).click();

  await page.waitForSelector('#row-0-0-0.selected');

  (await find('#row-0-0-1')).click();

  await page.waitForSelector('#row-0-0-1.selected');

  await type('#input-name-0-0-1');

  if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder, { recursive: true });
  }

  await page.screenshot({ path: path.resolve(distFolder, 'final.jpg') });

  await page.tracing.stop();
}

async function type(to, text = 'test') {
  const rowSelector = to.replace('input-name', 'row');

  await page.focus(to);

  for (const ch of text) {
    const value = (await page.evaluate((el) => el.value, await page.$(to))) + ch;

    await page.keyboard.type(ch);

    await page.waitForFunction(
      ({ value, rowSelector }) => {
        const column = document.querySelector(rowSelector + ' .name');

        return column.innerHTML === value;
      },
      {},
      { value, rowSelector }
    );
  }
}

async function run() {
  const server = await runBrowser();

  try {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await runTest();
  } catch (error) {
    console.error(error);
    server.kill();
  } finally {
    await browser.close();
    console.log('---> completed! <---')
    process.exit(1);
  }
}

run();

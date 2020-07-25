const puppeteer = require('puppeteer')
const fs = require('fs');
const URL = 'http://localhost:3000/maintenance'

const saveCssToFile = (criticalCSS) => {
  fs.writeFileSync(".-text.css", criticalCSS);
}

const main = async () => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()

  await page.coverage.startCSSCoverage()
  await page.goto(URL, {waitUntil: 'load'})

  const cssCoverage = await page.coverage.stopCSSCoverage()

  let criticalCSS = ''
  for (const entry of cssCoverage) {
    for (const range of entry.ranges) {
      criticalCSS += entry.text.slice(range.start, range.end) + "\n"
    }
  }

  saveCssToFile(criticalCSS);

  await page.close()
  await browser.close()
}

main();

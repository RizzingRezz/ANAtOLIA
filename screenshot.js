const puppeteer = require('puppeteer');

// Créer une fonction sleep pour ajouter une pause
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function logWithTimestamp(message) {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] ${message}`);
}

(async () => {
  while (true) {
    try {
      // Lancer un navigateur headless
      const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
      logWithTimestamp("Browser launched");
      // Ouvrir une nouvelle page
      const page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });

      await page.authenticate({ username: 'admin', password: '49n7e5292aa7nxp8ny8ujuz59jm64e42' });

      // Go to global Map
      await page.goto('https://anatolia.oca.eu/grafana/d/FwXVr2xVk/global-map?orgId=1&refresh=1m');
      await sleep(3000);
      await page.screenshot({ path: '/data/folder_website/screenshot/globalMap.png' });
      logWithTimestamp("Screen global done");

      // Calern dashboard
      await page.goto('https://anatolia.oca.eu/grafana/d/vPezfAsVz/calern_data?orgId=1&refresh=10s');
      await sleep(3000);
      await page.evaluate(() => {
        document.body.style.zoom = '0.8'; // Unzoom to get full content of the page
      });
      await sleep(3000);
      await page.screenshot({ path: '/data/folder_website/screenshot/calernData.png' });
      await page.evaluate(() => {
        document.body.style.zoom = '1'; // back to normal value
      })
      await page.goto('https://anatolia.oca.eu/grafana/d/tDMX0AsVz/anatolia-board-calern?orgId=1&refresh=1m');
      await sleep(3000);
      await page.screenshot({ path: '/data/folder_website/screenshot/calernDashboard.png' });
      logWithTimestamp("Screen calern done");

      // Cebreros dashboard
      await page.goto('https://anatolia.oca.eu/grafana/d/2_tMthx4z/cebreros_data?orgId=1&refresh=5s');
      await sleep(3000);
      await page.screenshot({ path: '/data/folder_website/screenshot/cebrerosData.png' });
      await page.goto('https://anatolia.oca.eu/grafana/d/x-9MJeg4z/anatolia-board-cebreros?orgId=1&refresh=1m');
      await sleep(3000);
      await page.screenshot({ path: '/data/folder_website/screenshot/cebrerosDashboard.png' });
      logWithTimestamp("Screen cebreros done");

      // Catane dashboard
      await page.goto('https://anatolia.oca.eu/grafana/d/A2dkb0sVz/catane_data?orgId=1&refresh=10s');
      await sleep(3000);
      await page.screenshot({ path: '/data/folder_website/screenshot/cataneData.png' });
      await page.goto('https://anatolia.oca.eu/grafana/d/QcQl0AsVz/anatolia-board-catane?orgId=1&refresh=1m');
      await sleep(3000);
      await page.screenshot({ path: '/data/folder_website/screenshot/cataneDashboard.png' });
      logWithTimestamp("Screen catane done");
      
      // Fermer le navigateur
      await browser.close();

      logWithTimestamp("Browser closed");

      // Attendre 5 minutes avant la prochaine itération
      await sleep(5 * 60 * 1000); // 5 minutes en millisecondes
    } catch (error) {
      logWithTimestamp(error);
    }
  }
})();

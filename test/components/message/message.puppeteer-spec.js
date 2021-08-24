const chalk = require('chalk');
describe('Message Puppeteer Tests', () => {
    describe('Message x button Tests', () => {
        const url = 'http://localhost:4000/components/message/test-close-btn.html?theme=classic&mode=light&layout=nofrills';
        beforeAll(async () => {
            await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
            console.log(chalk.cyan("Message x button Tests"));
        });

        it('should not have errors', async () => {
            checkforErrors;
        });

        it('should show the title', async () => {
            await expect(page.title()).resolves.toMatch('IDS Enterprise');
        });

        it('should show have close button on message, similar to Modal', async () => {
            await page.waitForSelector('#huge-title');
            await page.click('#huge-title');
            expect(await page.waitForSelector('.btn-icon.btn-close', { visible: true }));
            const el = await page.$eval('.btn-icon.btn-close', element => element.innerHTML);
            console.log(`Message value: ${chalk.cyan(el)}`);
            expect(el).toContain('<use href="#icon-close"></use>');
            await page.click('.btn-icon.btn-close');
            const Xbtn = await page.evaluate(() => { return !!document.querySelector('.btn-icon.btn-close') })
            if (Xbtn) { console.log(`x button: ${chalk.cyan('is still Visilbe')}`); }
            expect(Xbtn).toBeFalsy;
            await page.click('#huge-title');
            expect(await page.waitForSelector('.btn-icon.btn-close', { visible: true }));
            if (Xbtn) { console.log(`x button: ${chalk.cyan('is still Visilbe')}`); }
        });
    });
    async function checkforErrors() {
        page.on('error', function (err) {
            const theTempValue = err.toString();
            console.log(`Error: ${theTempValue}`);
        });
    }
    describe('Message Long Title Tests', () => {
        const url = 'http://localhost:4000/components/message/test-long-title.html?theme=classic&mode=light&layout=nofrills';
        beforeAll(async () => {
            await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
            console.log(chalk.cyan("Message Long Title Tests"));
        });
        it('should not have errors', async () => {
            checkforErrors;
        });

        it('should show the title', async () => {
            await expect(page.title()).resolves.toMatch('IDS Enterprise');
        });

        it('should show have modal that resizes toward max-width if the message text is long', async () => {
            await page.waitForSelector('#huge-title');
            await page.click('#huge-title');
            expect(await page.waitForSelector('#message-title', { visible: true }));
            expect(await page.waitForSelector('#message-text', { visible: true }));
            const msgTitle = await page.$('#message-title');
            const titleboundingBox = await msgTitle.boundingBox();
            console.log(`boundingBox value: ${chalk.cyan(titleboundingBox)}`);
            const msgText = await page.$('#message-text');
            const textboundingBox = await msgText.boundingBox();
            console.log(`boundingBox value: ${chalk.cyan(textboundingBox)}`);
            const titleWidth = await page.evaluate(() => {
                const msgtitle = document.querySelector('#message-title');
                return JSON.parse(JSON.stringify(getComputedStyle(msgtitle).width));
            });
            const textWidth = await page.evaluate(() => {
                const textWidth = document.querySelector('#message-text');
                return JSON.parse(JSON.stringify(getComputedStyle(textWidth).width));
            });
            expect(titleWidth).toEqual(textWidth);
            console.log(`titleWidth value: ${chalk.cyan(titleWidth)}`);
            console.log(`textWidth value: ${chalk.cyan(textWidth)}`);
        });
    });
});

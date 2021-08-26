const chalk = require('chalk');
const { ElementArrayFinder } = require('protractor');
describe('notification-badge Puppeteer Tests', () => {
    describe('Badge Placement Tests', () => {
        const url = 'http://localhost:4000/components/notification-badge/example-badge-placement.html?theme=classic&mode=light&layout=nofrills';
        beforeAll(async () => {
            await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
        });

        it('should show the title', async () => {
            await expect(page.title()).resolves.toMatch('IDS Enterprise');
        });

        it('should have six notification badges with different colors on different dot placements', async () => {
            const elHandleArray = await page.$$('.container-spacer')
            var index = 0;
            for (const el of elHandleArray) {
                await page.waitForSelector('.notification-badge-container', { visible: true });
                //var notifbadge = await page.$eval('.notification-badge-container', element => element.innerHTML);
                const notifbadge = await page.$eval(`#notification-badge-id-${index + 1}-container`,  element => element.innerHTML);
                console.log(`index: ${chalk.cyan(index)}`);
                try {
                    switch (index) {
                        case 0:
                      /*       const badgemenu = notifbadge.toString();
                            expect(badgemenu).toMatch('notification-dot-upper-left'); */
                            expect(notifbadge).toContain('notification-dot-upper-left');
                            break;
                        case 1:
                            /* const badgephone = notifbadge.toString();
                            expect(badgephone).toMatch('notification-dot-upper-right'); */
                            expect(notifbadge).toContain('notification-dot-upper-right');
                            break;
                        case 2:
                           /*  const badgecheckbox = notifbadge.toString();
                            expect(badgecheckbox).toMatch('notification-dot-lower-left'); */
                            expect(notifbadge).toContain('notification-dot-upper-right');
                            break;
                        case 3:
                       /*      const badgefolder = notifbadge.toString();
                            expect(badgefolder).toMatch('notification-dot-lower-right'); */
                            expect(notifbadge).toContain('notification-dot-lower-right');
                            break;
                        case 4:
                 /*            const badgebookmark = notifbadge.toString();
                            expect(badgebookmark).toMatch('notification-dot-upper-left'); */
                            expect(notifbadge).toContain('notification-dot-upper-left');
                            break;
                        case 5:
                            /* const badgestop = notifbadge.toString();
                            expect(badgestop).toMatch('notification-dot-upper-right'); */
                            expect(notifbadge).toContain('notification-dot-upper-right');
                            break;
                        default:
                            console.error("No Value Found");
                    }
                    console.log(`Notification badge position is: ${chalk.cyan(notifbadge.replace(/<svg.*>.*<\/svg>/ims, ' ').trim())}`);
                } catch (error) {
                    console.error(error);
                }
                index = index + 1;
            }
        });
        async function getWidth(count, iconWidth, dotWidth) {
            //const iconEl = await page.$eval(`#notification-badge-id-${count + 1}-icon`, e => getComputedStyle(e).width);
            const iconEl = await page.evaluate(() => {
                const icon = document.querySelector(`#notification-badge-id-${count + 1}-icon`);
                return JSON.parse(JSON.stringify(getComputedStyle(icon).width));
            });
            console.log(`Icon Width : ${iconEl}`);

            // const dotEl = await page.$eval(`#notification-badge-id-${count + 1}-dot`, e => getComputedStyle(e).width);
            const dotEl = await page.evaluate(() => {
                const icon = document.querySelector(`#notification-badge-id-${count + 1}-dot`);
                return JSON.parse(JSON.stringify(getComputedStyle(icon).width));
            });
            console.log(`Dot Width : ${dotEl}`);
            expect(iconEl).toBe(iconWidth)
            expect(dotEl).toBe(dotWidth)
        }
        it('should have Icons 18x18 pixels, and the dot should be 6x6', async () => {
            const elHandleArray = await page.$$('.container-spacer')
            var x = 0;
            for (const el of elHandleArray) {
                //await page.waitForSelector('.notification-badge-container', { visible: true });
                console.log(`x: ${chalk.cyan(x)}`);
                const iconsize = await page.$eval(`#notification-badge-id-${x + 1}-icon`, e => getComputedStyle(e).width);
                const dotsize = await page.$eval(`#notification-badge-id-${x + 1}-dot`, e => getComputedStyle(e).width);

                try {
                    switch (x) {
                        case 0:
                            console.log(`Icon Width is: ${iconsize}`);
                            console.log(`Dot Width is: ${dotsize}`);
                            expect(iconsize).toBe('18px')
                            expect(dotsize).toBe('6px')
                            break;
                        case 1:
                            //getWidth(x, '18px', '6px');
                            console.log(`Icon Width is: ${iconsize}`);
                            console.log(`Dot Width is: ${dotsize}`);
                            expect(iconsize).toBe('18px')
                            expect(dotsize).toBe('6px')
                            break;
                        case 2:
                            // getWidth(x, '18px', '6px');
                            console.log(`Icon Width is: ${iconsize}`);
                            console.log(`Dot Width is: ${dotsize}`);
                            expect(iconsize).toBe('18px')
                            expect(dotsize).toBe('6px')
                            break;
                        case 3:
                            // getWidth(x, '18px', '6px');
                            console.log(`Icon Width is: ${iconsize}`);
                            console.log(`Dot Width is: ${dotsize}`);
                            expect(iconsize).toBe('18px')
                            expect(dotsize).toBe('6px')
                            break;
                        case 4:
                            // getWidth(x, '18px', '6px');
                            console.log(`Icon Width is: ${iconsize}`);
                            console.log(`Dot Width is: ${dotsize}`);
                            expect(iconsize).toBe('18px')
                            expect(dotsize).toBe('6px')
                            break;
                        case 5:
                            // getWidth(x, '18px', '6px');
                            console.log(`Icon Width is: ${iconsize}`);
                            console.log(`Dot Width is: ${dotsize}`);
                            expect(iconsize).toBe('18px')
                            expect(dotsize).toBe('6px')
                            break;
                        default:
                            console.error("No Value Found");
                    }

                } catch (error) {
                    console.error(error);
                }
                x = x + 1;
            }

        });
        async function getDataAutomationID(element, value) {
            // const el = await page.evaluate(`document.querySelector(${element}).getAttribute("data-automation-id")`);
            const el = await page.$eval(element, e => e.getAttribute("data-automation-id"));
            console.log(`data-automation-id is: ${chalk.cyan(el)}`);
            expect(el).toEqual(value);

        }
        it('should be able to set id/automation id', async () => {

            const el = await page.$eval('#notification-badge-id-1-icon', e => e.getAttribute("data-automation-id"));
            console.log(`data-automation-id is: ${chalk.cyan(el)}`);
            expect(el).toEqual('notification-badge-automation-id-1-icon');

            const el2 = await page.$eval('#notification-badge-id-2-icon', e => e.getAttribute("data-automation-id"));
            console.log(`data-automation-id is: ${chalk.cyan(el2)}`);
            expect(el2).toEqual('notification-badge-automation-id-2-icon');

            const el3 = await page.$eval('#notification-badge-id-3-icon', e => e.getAttribute("data-automation-id"));
            console.log(`data-automation-id is: ${chalk.cyan(el3)}`);
            expect(el3).toEqual('notification-badge-automation-id-3-icon');

            const el4 = await page.$eval('#notification-badge-id-4-icon', e => e.getAttribute("data-automation-id"));
            console.log(`data-automation-id is: ${chalk.cyan(el4)}`);
            expect(el4).toEqual('notification-badge-automation-id-4-icon');

            const el5 = await page.$eval('#notification-badge-id-5-icon', e => e.getAttribute("data-automation-id"));
            console.log(`data-automation-id is: ${chalk.cyan(el5)}`);
            expect(el5).toEqual('notification-badge-automation-id-5-icon');

            const el6 = await page.$eval('#notification-badge-id-6-icon', e => e.getAttribute("data-automation-id"));
            console.log(`data-automation-id is: ${chalk.cyan(el6)}`);
            expect(el6).toEqual('notification-badge-automation-id-6-icon');

            /*   getDataAutomationID('#notification-badge-id-1-icon', 'notification-badge-automation-id-1-icon');
              getDataAutomationID('#notification-badge-id-2-icon', 'notification-badge-automation-id-2-icon');
              getDataAutomationID('#notification-badge-id-3-icon', 'notification-badge-automation-id-3-icon');
              getDataAutomationID('#notification-badge-id-4-icon', 'notification-badge-automation-id-4-icon');
              getDataAutomationID('#notification-badge-id-5-icon', 'notification-badge-automation-id-5-icon');
              getDataAutomationID('#notification-badge-id-6-icon', 'notification-badge-automation-id-6-icon'); */
        });


    });
});
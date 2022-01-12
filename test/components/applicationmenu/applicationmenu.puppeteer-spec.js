const dragAndDrop = require('./drag-and-drop')

describe('when dragging and dropping todo', () => {

  const url = 'http://localhost:4000/components/applicationmenu/example-resizable-menu';
  beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

   it('should change order on DOM', async () => {
      const firstTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[0].id);
      const secondTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[1].id);

      dragAndDrop(firstTodo, secondTodo);

      const newFirstTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[0].id);
      const newSecondTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[1].id);

      expect(newFirstTodo).toEqual(secondTodo)
      expect(newSecondTodo).toEqual(firstTodo)
   });
});

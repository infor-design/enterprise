const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Tree example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should select on click', async () => {
    const link = await element.all(by.css('a[role="treeitem"]')).first();

    expect(await link.getAttribute('class')).not.toContain('is-selected');
    await link.click();

    expect(await link.getAttribute('class')).toContain('is-selected');
  });

  it('Should deselect selected-node and select on click', async () => {
    expect(await element.all(by.css('a[role="treeitem"]')).get(0).getAttribute('class')).not.toContain('is-selected');
    await element.all(by.css('a[role="treeitem"]')).get(0).click();

    expect(await element.all(by.css('a[role="treeitem"]')).get(0).getAttribute('class')).toContain('is-selected');
    await element.all(by.css('a[role="treeitem"]')).get(1).click();

    expect(await element.all(by.css('a[role="treeitem"]')).get(0).getAttribute('class')).not.toContain('is-selected');
  });

  it('Should toggle open/close on click', async () => {
    expect(await element.all(by.css('.tree li.folder')).get(0).getAttribute('class')).toContain('is-open');
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('href')).toContain('#icon-open-folder');
    await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).click();

    expect(await element.all(by.css('.tree li.folder')).get(0).getAttribute('class')).not.toContain('is-open');
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('href')).toContain('#icon-closed-folder');
    await browser.driver.sleep(config.sleep);
    await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).click();

    expect(await element.all(by.css('.tree li.folder')).get(0).getAttribute('class')).toContain('is-open');
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('href')).toContain('#icon-open-folder');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const link = await element.all(by.css('a[role="treeitem"]')).first();
      await link.click();

      const containerEl = await element(by.css('.two-column'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'tree-index')).toEqual(0);
    });
  }
});

describe('Tree badges tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-badges');
  });

  it('Should show badges with tree nodes', async () => {
    expect(await element.all(by.css('.tree li a[role="treeitem"] .tree-badge')).count()).toBe(5);
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"] .tree-badge')).count()).toBe(4);
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"] .tree-badge.round')).count()).toBe(3);
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"] .tree-badge.info')).count()).toBe(2);
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"] .tree-badge.alert')).count()).toBe(1);
    expect(await element.all(by.css('.tree li a[role="treeitem"] .tree-badge.good')).count()).toBe(0);
  });
});

describe('Tree custom folder icons tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-custom-folders');
  });

  it('Should show custom folder icon', async () => {
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('href')).toContain('#icon-user-folder-open');
  });
});

describe('Tree plus minus folder icons tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-plus-minus-folders');
  });

  it('Should show plus minus folder icon', async () => {
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('href')).toContain('#icon-plusminus-folder-open');
    await element.all(by.css('.tree li.folder a[role="treeitem"]')).first().click();

    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('href')).toContain('#icon-plusminus-folder-closed');
  });
});

describe('Tree Ajax data tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-ajax');
  });

  it('Should load Ajax data node on click', async () => {
    expect(await element.all(by.css('.tree li')).count()).toBe(3);
    await element.all(by.css('.tree li.folder a[role="treeitem"]')).first().click();
    await browser.driver.sleep(2500);

    expect(await element.all(by.css('.tree li')).count()).toBe(5);
  });
});

describe('Tree context menu tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-context-menu');
  });

  it('Should load context menu on right click', async () => {
    expect(await element.all(by.css('.popupmenu-wrapper #tree-popupmenu')).count()).toBe(0);
    await browser.actions().click(element.all(by.css('.tree a[role="treeitem"]')).first(), protractor.Button.RIGHT).perform();

    expect(await element.all(by.css('.popupmenu-wrapper #tree-popupmenu')).count()).toBe(1);
  });
});

describe('Tree select by id tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-select-by-id');
  });

  it('Should select node by id', async () => {
    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(1);
    expect(await element(by.id('node6')).getAttribute('class')).toContain('is-selected');
  });
});

describe('Tree select-multiple tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-select-multiple');
  });

  it('Should select multiple nodes', async () => {
    expect(await element.all(by.css('.tree li a[role="treeitem"] .tree-checkbox')).count()).toBe(44);
    expect(await element.all(by.css('.tree li.is-partial a[role="treeitem"] .tree-checkbox')).count()).toBe(8);
    expect(await element.all(by.css('.tree li.is-selected a[role="treeitem"] .tree-checkbox')).count()).toBe(1);

    expect(await element.all(by.css('.tree li')).first().getAttribute('class')).not.toContain('is-selected');
    await element.all(by.css('.tree li a[role="treeitem"]')).first().click();

    expect(await element.all(by.css('.tree li')).first().getAttribute('class')).toContain('is-selected');

    expect(await element.all(by.css('.tree li')).get(1).getAttribute('class')).not.toContain('is-selected');
    await element.all(by.css('.tree li a[role="treeitem"]')).get(1).click();

    expect(await element.all(by.css('.tree li')).get(1).getAttribute('class')).toContain('is-selected');
    expect(await element.all(by.css('.tree li.is-selected a[role="treeitem"] .tree-checkbox')).count()).toBe(3);
  });

  it('Should expand independently', async () => {
    let visibleNodes = await element.all(by.css('.tree li')).filter(node => node.isDisplayed());

    expect(visibleNodes.length).toEqual(13);
    const testNode = await element(by.css(('#leadership svg')));
    await browser.actions().mouseMove(testNode).perform();
    await browser.actions().click(testNode).perform();
    await browser.driver.sleep(config.sleep);
    visibleNodes = await element.all(by.css('.tree li')).filter(node => node.isDisplayed());

    expect(visibleNodes.length).toEqual(9);
  });

  it('Should select all children nodes', async () => {
    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(1);

    await element.all(by.css('.tree li.folder')).get(2).all(by.css('a[role="treeitem"]')).get(0)
      .click();

    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(33);
  });

  it('Should set selected or partial on parent nodes', async () => {
    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(1);
    await element.all(by.css('.tree li.folder')).get(2).all(by.css('a[role="treeitem"] .icon-tree')).get(0)
      .click();

    expect(await element.all(by.css('.tree li.folder')).get(2).getAttribute('class')).toContain('is-open');
    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(1);
    await element.all(by.css('.tree li.folder')).get(2).all(by.css('a[role="treeitem"]')).get(1)
      .click();

    expect(await element.all(by.css('.tree li.folder')).get(2).getAttribute('class')).not.toContain('is-selected');
    expect(await element.all(by.css('.tree li.folder')).get(2).getAttribute('class')).toContain('is-partial');
    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(2);
    await element.all(by.css('.tree li.folder')).get(2).all(by.css('a[role="treeitem"]')).get(1)
      .click();

    expect(await element.all(by.css('.tree li.folder')).get(2).getAttribute('class')).not.toContain('is-selected');
    expect(await element.all(by.css('.tree li.folder')).get(2).getAttribute('class')).not.toContain('is-partial');
    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(1);
    await element.all(by.css('.tree li.folder')).get(2).all(by.css('a[role="treeitem"]')).get(0)
      .click();

    expect(await element.all(by.css('.tree li.folder')).get(2).getAttribute('class')).toContain('is-selected');
    expect(await element.all(by.css('.tree li.folder')).get(2).getAttribute('class')).not.toContain('is-partial');
    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(33);
  });

  it('Should not select disabled node with parent nodes', async () => {
    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(1);
    expect(await element.all(by.css('.tree li.folder')).get(0).getAttribute('class')).toContain('is-partial');
    expect(await element.all(by.css('.tree li.folder')).get(0).getAttribute('class')).not.toContain('is-selected');
    expect(await element.all(by.css('.tree li.folder')).get(0).all(by.css('a[role="treeitem"].is-disabled')).count()).toBe(1);
    await element.all(by.css('.tree li.folder')).get(0).all(by.css('a[role="treeitem"]')).get(0)
      .click();

    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(0);
    await element.all(by.css('.tree li.folder')).get(0).all(by.css('a[role="treeitem"]')).get(0)
      .click();

    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(5);
    expect(await element.all(by.css('.tree li.folder')).get(0).getAttribute('class')).toContain('is-partial');
    expect(await element.all(by.css('.tree li.folder')).get(0).getAttribute('class')).not.toContain('is-selected');
    expect(await element.all(by.css('.tree li.folder')).get(0).all(by.css('a[role="treeitem"].is-disabled')).count()).toBe(1);
  });
});

describe('Tree disable all nodes test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-disable');
  });

  it('Should not detect any non-disabled tree nodes', async () => {
    const count = await element.all(by.css('.tree li a[role="treeitem"]')).count();

    await element(by.id('disable')).click();

    expect(await element.all(by.css('.tree li a[role="treeitem"].is-disabled')).count()).toBe(count);
  });
});

describe('Tree enable all nodes test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-enable');
  });

  it('Should not detect any disabled tree nodes', async () => {
    await element(by.id('enable')).click();

    expect(await element.all(by.css('.tree li a[role="treeitem"].is-disabled')).count()).toBe(0);
  });
});

describe('Tree preserve and restore all nodes test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-preserve-restore');
  });

  it('Should preserve and restore enablement states of all nodes', async () => {
    const countDisabled = await element.all(by.css('.tree li a[role="treeitem"].is-disabled')).count();
    const countTotal = await element.all(by.css('.tree li a[role="treeitem"]')).count();

    await element(by.id('preserve')).click();
    await element(by.id('restore')).click();

    expect(await element.all(by.css('.tree li a[role="treeitem"].is-disabled')).count()).toEqual(countDisabled);
    expect(await element.all(by.css('.tree li a[role="treeitem"]')).count()).toEqual(countTotal);
  });
});

describe('Tree dropdown tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-dropdown');
  });

  it('Should display dropdown in tree node', async () => {
    expect(await element.all(by.css('.tree li select.dropdown')).count()).toBeGreaterThan(0);
  });
});

describe('Tree insert new node above another node tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-add-node-inbetween-node');
  });

  it('Should insert new node before another node', async () => {
    expect(await element.all(by.css('.tree li.folder li.folder ul.folder')).get(0).all(by.css('a[role="treeitem"]')).count()).toBe(3);
    await element(by.id('node6')).click();

    expect(await element.all(by.css('.tree li.folder li.folder ul.folder')).get(0).all(by.css('a[role="treeitem"]')).count()).toBe(4);
    expect(await element.all(by.css('.tree li.folder ul.folder li.folder')).count()).toBe(1);
    await element(by.id('node7')).click();

    expect(await element.all(by.css('.tree li.folder ul.folder li.folder')).count()).toBe(2);
  });
});

describe('Tree custom icon tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-custom-icon');
  });

  it('Should display custom icon for leaf node', async () => {
    expect(await element.all(by.css('.tree li.folder li.folder ul.folder')).get(0).all(by.css('a[role="treeitem"] .icon-tree use')).get(2)
      .getAttribute('href')).toContain('#icon-star-filled');

    expect(await element.all(by.css('.tree li.folder li.folder ul.folder')).get(0).all(by.css('a[role="treeitem"] .icon-tree use')).get(3)
      .getAttribute('href')).toContain('#icon-next-page');
  });
});

describe('Tree checkbox tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-checkbox-particular-node');
  });

  it('Should display checkbox for particular node', async () => {
    expect(await element.all(by.css('.tree li.folder.is-open a[role="treeitem"]')).count()).toBe(10);
    expect(await element.all(by.css('.tree li.folder.is-open ul.folder.is-open a[role="treeitem"] .tree-checkbox')).count()).toBe(2);
  });
});

describe('Tree update and remove node tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-update-node-with-children');
  });
  const sel = { nodes: '.tree li a[role="treeitem"]' };
  sel.new2 = `${sel.nodes}#new2`;
  sel.lineMgr = `${sel.nodes}#line-mgr`;

  it('Should update node', async () => {
    expect(await element.all(by.css(sel.nodes)).count()).toBe(6);
    expect(await element.all(by.css(sel.lineMgr)).count()).toBe(0);
    await element(by.id('btn-update-node')).click();

    expect(await element.all(by.css(sel.nodes)).count()).toBe(7);
    expect(await element.all(by.css(sel.lineMgr)).count()).toBe(1);
  });

  it('Should remove node', async () => {
    expect(await element.all(by.css(sel.nodes)).count()).toBe(6);
    expect(await element.all(by.css(sel.new2)).count()).toBe(1);
    await element(by.id('btn-remove-node')).click();

    expect(await element.all(by.css(sel.nodes)).count()).toBe(5);
    expect(await element.all(by.css(sel.new2)).count()).toBe(0);
  });
});

describe('Tree expand target tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-expand-target');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should toggle by clicked on icon only', async () => {
    const link = await element(by.id('node2'));
    const icon = await link.element(by.css('.icon-tree'));
    const text = await link.element(by.css('.tree-text'));

    expect(await link.getAttribute('class')).not.toContain('is-selected');
    await icon.click();

    expect(await link.getAttribute('class')).not.toContain('is-selected');
    await text.click();

    expect(await link.getAttribute('class')).toContain('is-selected');
  });
});

describe('Tree toggle icon and children count tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-toggle-icon-and-count');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should toggle by clicked on icon only and show children count', async () => {
    const link = await element(by.id('node2'));
    const iconTreeUse = await link.element(by.css('.icon-tree use'));
    const iconExpandTarget = await link.element(by.css('.icon-expand-target'));
    const text = await link.element(by.css('.tree-text'));
    const childrenCount = await link.element(by.css('.tree-children-count-text'));
    const ul = await element(by.css('#node2 + ul'));

    expect(await childrenCount.getText()).toEqual('3');
    expect(await iconTreeUse.getAttribute('href')).toEqual('#icon-cloud');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).toContain('is-open');
    await iconExpandTarget.click();
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('3');
    expect(await iconTreeUse.getAttribute('href')).toEqual('#icon-cloud');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).not.toContain('is-open');
    await text.click();
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('3');
    expect(await iconTreeUse.getAttribute('href')).toEqual('#icon-cloud');
    expect(await link.getAttribute('class')).toContain('is-selected');
    expect(await ul.getAttribute('class')).not.toContain('is-open');
  });
});

describe('Tree toggle icon and children count async tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-toggle-icon-and-count-ajax');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should toggle by clicked on icon only and show children async count', async () => {
    const link = await element(by.id('node2'));
    const iconExpandTarget = await link.element(by.css('.icon-expand-target'));
    const text = await link.element(by.css('.tree-text'));
    const childrenCount = await link.element(by.css('.tree-children-count-text'));
    const ul = await element(by.css('#node2 + ul'));

    expect(await childrenCount.getText()).toEqual('3');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).not.toContain('is-open');
    expect(await ul.all(by.css('li')).count()).toEqual(0);

    await iconExpandTarget.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#node2 + ul.is-open'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('3');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).toContain('is-open');
    expect(await ul.all(by.css('li')).count()).toEqual(4);
    expect(await element(by.css('#new2 .tree-children-count-text')).getText()).toEqual('1');
    expect(await element(by.css('#new3 .tree-children-count-text')).getText()).toEqual('3');
    await text.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#node2 + ul.is-open'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('3');
    expect(await link.getAttribute('class')).toContain('is-selected');
    expect(await ul.getAttribute('class')).toContain('is-open');
  });
});

describe('Tree toggle icon and children count markup tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-toggle-icon-and-count-markup');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should toggle by clicked on icon only and show children markup count', async () => {
    const link = await element(by.id('public'));
    const iconExpandTarget = await link.element(by.css('.icon-expand-target'));
    const text = await link.element(by.css('.tree-text'));
    const childrenCount = await link.element(by.css('.tree-children-count-text'));
    const ul = await element(by.css('#public + ul'));

    expect(await childrenCount.getText()).toEqual('1');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).toContain('is-open');
    await iconExpandTarget.click();
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('1');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).not.toContain('is-open');
    await text.click();
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('1');
    expect(await link.getAttribute('class')).toContain('is-selected');
    expect(await ul.getAttribute('class')).not.toContain('is-open');
  });
});

describe('Tree toggle icon and children count edit auto tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-toggle-icon-and-count-edit-auto');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should toggle by clicked on icon only and show children edit auto count', async () => {
    const link = await element(by.id('public'));
    const iconExpandTarget = await link.element(by.css('.icon-expand-target'));
    const text = await link.element(by.css('.tree-text'));
    const childrenCount = await link.element(by.css('.tree-children-count-text'));
    const ul = await element(by.css('#public + ul'));

    expect(await childrenCount.getText()).toEqual('1');
    expect(await element(by.css('#leadership .tree-children-count-text')).getText()).toEqual('4');
    expect(await element(by.css('#new1 .tree-children-count-text')).getText()).toEqual('2');
    expect(await element(by.css('#new2 .tree-children-count-text')).getText()).toEqual('3');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).toContain('is-open');
    await iconExpandTarget.click();
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('1');
    expect(await element(by.css('#new1 .tree-children-count-text')).getText()).toEqual('2');
    expect(await element(by.css('#new2 .tree-children-count-text')).getText()).toEqual('3');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).not.toContain('is-open');
    await text.click();
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('1');
    expect(await element(by.css('#new1 .tree-children-count-text')).getText()).toEqual('2');
    expect(await element(by.css('#new2 .tree-children-count-text')).getText()).toEqual('3');
    expect(await link.getAttribute('class')).toContain('is-selected');
    expect(await ul.getAttribute('class')).not.toContain('is-open');
  });
});

describe('Tree toggle icon and children count edit manually tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/test-toggle-icon-and-count-edit-manually');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should toggle by clicked on icon only and show children edit manually count', async () => {
    const link = await element(by.id('public'));
    const iconExpandTarget = await link.element(by.css('.icon-expand-target'));
    const text = await link.element(by.css('.tree-text'));
    const childrenCount = await link.element(by.css('.tree-children-count-text'));
    const ul = await element(by.css('#public + ul'));

    expect(await childrenCount.getText()).toEqual('1');
    expect(await element(by.css('#leadership .tree-children-count-text')).getText()).toEqual('4');
    expect(await element(by.css('#new1 .tree-children-count-text')).getText()).toEqual('2');
    expect(await element(by.css('#new2 .tree-children-count-text')).getText()).toEqual('3');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).toContain('is-open');
    await iconExpandTarget.click();
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('1');
    expect(await element(by.css('#new1 .tree-children-count-text')).getText()).toEqual('2');
    expect(await element(by.css('#new2 .tree-children-count-text')).getText()).toEqual('3');
    expect(await link.getAttribute('class')).not.toContain('is-selected');
    expect(await ul.getAttribute('class')).not.toContain('is-open');
    await text.click();
    await browser.driver.sleep(config.sleep);

    expect(await childrenCount.getText()).toEqual('1');
    expect(await element(by.css('#new1 .tree-children-count-text')).getText()).toEqual('2');
    expect(await element(by.css('#new2 .tree-children-count-text')).getText()).toEqual('3');
    expect(await link.getAttribute('class')).toContain('is-selected');
    expect(await ul.getAttribute('class')).not.toContain('is-open');
  });
});

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Tree example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-index?nofrills=true');
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
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('xlink:href')).toContain('#icon-open-folder');
    await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).click();

    expect(await element.all(by.css('.tree li.folder')).get(0).getAttribute('class')).not.toContain('is-open');
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('xlink:href')).toContain('#icon-closed-folder');
    await browser.driver.sleep(config.sleep);
    await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).click();

    expect(await element.all(by.css('.tree li.folder')).get(0).getAttribute('class')).toContain('is-open');
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('xlink:href')).toContain('#icon-open-folder');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const link = await element.all(by.css('a[role="treeitem"]')).first();
      await link.click();

      const containerEl = await element(by.id('maincontent'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'tree-index')).toEqual(0);
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
    expect(await element.all(by.css('.tree li a[role="treeitem"] .tree-badge.good')).count()).toBe(1);
  });
});

describe('Tree custom folder icons tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-custom-folders');
  });

  it('Should show custom folder icon', async () => {
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('xlink:href')).toContain('#icon-user-folder-open');
  });
});

describe('Tree plus minus folder icons tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-plus-minus-folders');
  });

  it('Should show plus minus folder icon', async () => {
    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('xlink:href')).toContain('#icon-plusminus-folder-open');
    await element.all(by.css('.tree li.folder a[role="treeitem"]')).first().click();

    expect(await element.all(by.css('.tree li.folder a[role="treeitem"]')).get(0).element(by.css('.icon-tree use')).getAttribute('xlink:href')).toContain('#icon-plusminus-folder-closed');
  });
});

describe('Tree Ajax data tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-ajax');
  });

  it('Should load Ajax data node on click', async () => {
    expect(await element.all(by.css('.tree li')).count()).toBe(2);
    await element.all(by.css('.tree li.folder a[role="treeitem"]')).first().click();
    await browser.driver.sleep(2500);

    expect(await element.all(by.css('.tree li')).count()).toBe(4);
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
    await utils.setPage('/components/tree/example-select-by-id');
  });

  it('Should select node by id', async () => {
    expect(await element.all(by.css('.tree li.is-selected')).count()).toBe(1);
    expect(await element(by.id('node6')).getAttribute('class')).toContain('is-selected');
  });
});

describe('Tree destroy invoke tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-destroy');
  });

  it('Should destroy tree', async () => {
    expect(await element.all(by.css('.tree li')).count()).toBe(2);
    await element(by.id('destroy')).click();

    expect(await element.all(by.css('.tree li')).count()).toBe(0);
  });

  it('Should invoke tree', async () => {
    expect(await element.all(by.css('.tree li')).count()).toBe(2);
    await element(by.id('destroy')).click();

    expect(await element.all(by.css('.tree li')).count()).toBe(0);
    await element(by.id('invoke')).click();

    expect(await element.all(by.css('.tree li')).count()).toBe(2);
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
    await utils.setPage('/components/tree/example-preserve-restore');
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

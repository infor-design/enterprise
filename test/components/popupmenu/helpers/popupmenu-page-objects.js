const PopupMenuPageObject = function () {
  this.openSingleSelect = async function () {
    const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
    await buttonTriggerEl.sendKeys(protractor.Key.SPACE);
    return buttonTriggerEl;
  };
};

module.exports = new PopupMenuPageObject();

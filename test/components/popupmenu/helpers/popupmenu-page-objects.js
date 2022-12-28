const PopupMenuPageObject = function () {
  this.openSingleSelect = async function () {
    // eslint-disable-next-line no-undef
    const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
    await buttonTriggerEl.sendKeys('SPACE');
    return buttonTriggerEl;
  };
};

module.exports = new PopupMenuPageObject();

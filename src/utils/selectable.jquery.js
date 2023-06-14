/**
 * Make a group of objects selectable
 * @param {function} settings if ever needed
 * @returns {void}
 */
$.fn.selectable = function () {
  const allElems = this;
  allElems.hideFocus();

  allElems.on('click', (e) => {
    allElems.removeClass('is-selected');
    $(e.currentTarget).toggleClass('is-selected');
  });
  return this;
};

const widgetUtils = {};

/**
 * Moves the last custom action in the button action popupmenu
 * if the card/widget is 360 and below, and hides the last custom action in its previous position.
 * @param {jQuery} element - The card/widget element.
 * @param {jQuery} header - The card header element.
 * @returns {void}
 */
widgetUtils.moveLastCustomAction = function (element, header) {
  const card = element;
  const cardWidth = card.width();
  const btnControlId = card.find('.widget-header-section.more .btn-actions').attr('aria-controls');
  const hasHeaderMenu = header?.find('.popupmenu').length > 0;
  let popupmenu;

  if (hasHeaderMenu) {
    popupmenu = header.find('.popupmenu').first();
  } else {
    popupmenu = $(`.popupmenu-wrapper #${btnControlId}`);
  }
  const customActionButtons = card.find('.widget-header-section.custom-action button');

  if (cardWidth <= 368 && customActionButtons.length > 1) {
    const lastButton = customActionButtons.last();
    const newLi = $('<li>');
    const newLiA = $('<a>');

    newLiA.append(lastButton.children());
    newLi.append(newLiA);
    popupmenu.prepend(newLi);
    lastButton.addClass('d-none');
  } else if (cardWidth > 368 && customActionButtons.not('.d-none').length <= 1) {
    const lastButton = customActionButtons.last();
    lastButton.removeClass('d-none');
    const newLi = popupmenu.find('li').first();
    const newLiA = newLi.find('a');

    popupmenu.addClass('has-icons');
    lastButton.removeClass('d-none');
    newLiA.children().appendTo(lastButton);
    newLi.remove();
  }
};

export { widgetUtils };

import { utils } from '../../utils/utils';

import { Tag } from './tag';

// Component Name
const COMPONENT_NAME = 'tagcollection';

// Default Tag Options
const TAG_LIST_DEFAULTS = {

};

/**
* Creates a collection of Tag Components and controls their rendering/value setting process.
* @class Tag
* @param {string} element The component element.
* @param {string} settings The component settings.
*/
function TagList(element, settings) {
  this.settings = utils.mergeSettings(element, settings, TAG_LIST_DEFAULTS);

  this.element = $(element);
  this.init();
}

TagList.prototype = {

  init() {
    let tags = [];
    if (Array.isArray(this.settings.tags)) {
      tags = this.settings.tags;
    }
    this.tags = new Set(tags);
  },

  /**
   * Adds a new tag to the collection
   * @param {Tag|object} tagObj an incoming Tag Component instance, or object representing tag data.
   * @returns {Tag} the newly formed tag object.
   */
  add(tagObj) {
    let tag;
    if (!(tagObj instanceof Tag)) {
      tag = new Tag(tagObj);
    } else {
      tag = tagObj;
    }

    this.tags.add(tag);
  },

  /**
   * Removes a tag from the collection
   * @param {Tag|object} tagObj an incoming Tag Component instance, or object representing tag data.
   * @returns {Tag} a reference to the removed tag.
   */
  remove(tagObj) {
    this.tags.remove(tagObj);
  },



};

export { TagList, COMPONENT_NAME };

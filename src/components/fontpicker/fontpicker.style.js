import { xssUtils } from '../../utils/xss';

// Valid supported tagNames for applying fonts.
const validTagNames = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'div'];

/**
 * Defines a style that can be used inside a Fontpicker component
 * @class FontPickerStyle
 * @param {string} id a unique identifying string for this Fontpicker style. This value should be unique when compared to other styles within the same fontpicker.
 * @param {string} displayName the human-readable name for the Fontpicker style.
 * @param {string} [tagName='p'] a string representing a valid HTML tag to use for this style. Defaults to "span".
 * @param {string} [className=''] a string containing a valid CSS class selector to append to the tag.
 * @param {CSSStyleDeclaration} [styleProps] valid CSS props to add to the fontpicker style.
 */
// eslint-disable-next-line default-param-last
function FontPickerStyle(id, displayName, tagName = 'p', className = '', styleProps) {
  // 'id' is required.
  if (!id || typeof id !== 'string' || !displayName.length) {
    throw new Error('"id" property must be defined and unique.');
  }
  this.id = id;

  // `displayName` is required.
  if (!displayName || typeof displayName !== 'string' || !displayName.length) {
    throw new Error('"displayName" property must be defined.');
  }
  this.displayName = displayName;

  // `tagName` is required, but defaults to `p`
  tagName = tagName.toLowerCase();
  if (validTagNames.indexOf(tagName) === -1) {
    tagName = 'p';
  }
  this.tagName = tagName;

  if (typeof className === 'string' && className.length) {
    this.className = className;
  }

  if (styleProps instanceof CSSStyleDeclaration) {
    this.styleProps = styleProps;
  }

  return this;
}

FontPickerStyle.prototype = {

  /**
   * @param {string} content text content to be styled.
   * @returns {string} containing the content surrounded in this style's format.
   */
  render(content) {
    // Sanitize incoming content
    content = xssUtils.stripHTML(content);

    return `<${this.tagName}>${content}</${this.tagName}>`;
  }

};

export default FontPickerStyle;

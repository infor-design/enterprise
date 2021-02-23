import { Tag } from '../../../src/components/tag/tag';
import { cleanup } from '../../helpers/func-utils';

const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let tagEl;
let tagAPI;

describe('Tag API (as span)', () => {
  beforeEach(() => {
    tagEl = null;
    tagAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);

    tagEl = document.createElement('span');
    tagEl.classList.add('tag');
    document.body.appendChild(tagEl);
  });

  afterEach(() => {
    if (tagAPI) {
      tagAPI.destroy();
    }
    cleanup(['.tag', '.svg-icons', '.row']);
  });

  it('should initialize', () => {
    tagEl.insertAdjacentHTML('afterbegin', '<span class="tag-content">This is a Tag!</span>');
    tagAPI = new Tag(tagEl);

    expect(tagAPI.element.querySelector('.tag-content')).toBeDefined();
    expect(tagAPI.element.querySelector('.tag-content').innerText).toEqual('This is a Tag!');
  });

  it('can be dismissible', () => {
    tagEl.insertAdjacentHTML('afterbegin', '<span class="tag-content">This is a Tag!</span>');
    tagAPI = new Tag(tagEl, {
      dismissible: true
    });

    expect(tagAPI.element.querySelector('.btn-dismissible')).toBeDefined();
  });

  it('can be a hyperlink if defined with an anchor', () => {
    tagEl.insertAdjacentHTML('afterbegin', '<a href="#" class="tag-content">This is a Tag!</a>');
    tagAPI = new Tag(tagEl);

    expect(tagAPI.element.querySelector('a')).toBeDefined();
    expect(tagAPI.element.querySelector('a').getAttribute('href')).toEqual('#');
  });

  it('can be a hyperlnk if defined with an `href` setting', () => {
    tagEl.insertAdjacentHTML('afterbegin', '<span class="tag-content">This is a Tag!</span>');
    tagAPI = new Tag(tagEl, {
      href: 'https://infor.com'
    });

    expect(tagAPI.element.querySelector('.tag-content').tagName).toEqual('A');
    expect(tagAPI.element.querySelector('.tag-content').getAttribute('href')).toEqual('https://infor.com');
  });

  it('should remain a hyperlink if invoked as a hyperlink/anchor with no "href" attribute', () => {
    tagEl.insertAdjacentHTML('afterbegin', '<a class="tag-content">This is a Tag!</a>');
    tagAPI = new Tag(tagEl);

    expect(tagAPI.element.querySelector('.tag-content').tagName).toEqual('A');
    expect(tagAPI.element.querySelector('a').getAttribute('href')).toEqual(null);
  });

  it('can change its "style" when updating', () => {
    tagEl.insertAdjacentHTML('afterbegin', '<a class="tag-content">This is a Tag!</a>');
    tagAPI = new Tag(tagEl, {
      style: 'info'
    });

    expect(tagAPI.element.classList.contains('info')).toBeTruthy();

    tagAPI.updated({
      style: 'error'
    });

    expect(tagAPI.element.classList.contains('info')).toBeFalsy();
    expect(tagAPI.element.classList.contains('error')).toBeTruthy();

    // 'default' doesn't render a CSS class
    tagAPI.updated({
      style: 'default'
    });

    expect(tagAPI.element.classList.contains('error')).toBeFalsy();
    expect(tagAPI.element.classList.contains('default')).toBeFalsy();
  });
});

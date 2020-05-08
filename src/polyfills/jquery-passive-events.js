/**
 * Polyfills passive event support in jQuery
 * This eliminates a ton of console warnings when doing scrolling.
 * - https://github.com/jquery/jquery/issues/2871
 * - https://github.com/infor-design/enterprise/issues/414
 */
jQuery.event.special.touchstart = {
  setup(_, ns, handle) {
    this.addEventListener('touchstart', handle, {
      passive: true
    });
  }
};
jQuery.event.special.mousewheel = {
  setup(_, ns, handle) {
    this.addEventListener('mousewheel', handle, {
      passive: true
    });
  }
};

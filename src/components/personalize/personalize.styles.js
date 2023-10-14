import { colorUtils } from '../../utils/color';

function personalizeStyles(colors) {
  const baseColorObj = colorUtils.hexToRgb(colors.base);
  const hyperlinkColorObj = colorUtils.hexToRgb(colors.hyperlinkText);

  return `
.is-personalizable ::selection {
  background: ${colors.selection} !important;
}

.is-personalizable .header::selection {
  background-color: ${colors.darker} !important;
}

.is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled),
.btn-primary:not(:disabled):not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane).is-personalizable {
  background-color: ${colors.btnPrimaryColor};
  border-color: ${colors.btnPrimaryColor};
}

.header.is-personalizable .buttonset .searchfield-wrapper.is-open button:not(.close) {
  background-color: ${colors.contrast};
  color: ${colors.darkest} !important;
}

.header.is-personalizable .buttonset .searchfield-wrapper.is-open button.go-button:hover {
  background-color: ${colors.secondaryButtonHover} !important;
  color: ${colors.darkest} !important;
}

html.theme-classic-dark .is-personalizable .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled {
  color: #888B94 !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) {
  background-color: ${colors.lighter};
  border-color: ${colors.lighter};
}

html[class*="new-"] .is-personalizable:not(.header) .btn-secondary:not(:disabled):not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane),
html[class*="new-"] .is-personalizable:not(.header) .btn-secondary:not(:disabled):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane) svg.icon,
html[class*="new-"] .is-personalizable:not(.header) .btn-secondary.btn-menu:not(:disabled):not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane),
html[class*="new-"] .is-personalizable:not(.header) .btn-secondary.btn-menu:not(:disabled):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane) svg.icon  {
  border-color: ${colors.btnSecondaryBorderColor};
  color: ${colors.btnSecondaryBorderColor};
}

html.theme-new-dark .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) svg.icon {
  border-color: ${colors.lighter};
  color: ${colors.lighter};
}

html.theme-classic-dark .is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled {
  background-color: ${colors.baseDisabled} !important;
  border-color: ${colors.baseDisabled} !important;
}

html[class*="theme-classic-"]:not(.theme-classic-dark) .is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled,
html[class*="theme-classic-"]:not(.theme-classic-dark) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane).is-personalizable:disabled {
  color: ${colors.baseDisabledText};
  background-color: ${colors.baseDisabled};
  border-color: ${colors.baseDisabled};
}

.is-personalizable:not(.header) .btn-link:not(:disabled):hover {
  background-color: ${colors.lightestPalette};
}

html[class*="new-"] .is-personalizable:not(.header) .btn-menu:not(.btn-secondary):not([disabled]):not(:disabled):hover {
  background-color: ${colors.lightestPalette};
}

.is-personalizable:not(.header) .btn-link:not(:disabled),
.btn-link.is-personalizable:not(:disabled),
.is-personalizable:not(.header) .btn-menu:not(.btn-secondary):not([disabled]):not(:disabled) {
  color: ${colors.btnLinkColor};
}

.is-personalizable:not(.header) .btn-link:not(:disabled) .icon,
.btn-link.is-personalizable:not(:disabled) .icon,
.is-personalizable:not(.header) .btn-menu:not(.btn-secondary):not([disabled]):not(:disabled) .icon {
  color: ${colors.btnLinkColor} !important;
}

.is-personalizable:not(.header) .btn-menu:not(.btn-secondary):not(.hide-focus):focus {
  box-shadow: ${colors.btnBoxShadow};
}

html.theme-new-dark .is-personalizable:not(.header) .btn-link:not(:disabled),
html.theme-new-dark .btn-link.is-personalizable:not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-link:not(:disabled) .icon,
html.theme-new-dark .btn-link.is-personalizable:not(:disabled) .icon {
  color: ${colors.lighter};
}

html.theme-new-dark .is-personalizable:not(.header) .btn-link:not(:disabled):hover,
html.theme-new-dark .btn-link.is-personalizable:not(:disabled):hover,
html.theme-new-dark .is-personalizable:not(.header) .btn-link:not(:disabled):hover .icon,
html.theme-new-dark .btn-link.is-personalizable:not(:disabled):hover .icon,
html.theme-new-dark .is-personalizable:not(.header) .btn-menu.is-open:not(.btn-secondary):not([disabled]):not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-menu:not(.btn-secondary):not([disabled]):not(:disabled):hover,
html.theme-new-dark .is-personalizable:not(.header) .btn-menu:not(.btn-secondary):not([disabled]):not(:disabled):hover .icon {
  color: ${colors.lightest};
}

.is-personalizable button.is-pressed,
button.is-personalizable.is-pressed {
  color: ${colors.base};
}

.is-personalizable button.is-pressed .icon,
button.is-personalizable.is-pressed .icon {
  color: ${colors.base};
}

.is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
.btn-primary.is-personalizable:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.btnPrimaryColorHover};
  border-color: ${colors.btnPrimaryColorHover};
}

html.theme-new-dark .is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.lightest};
  border-color: ${colors.lightest};
}

html[class*="new-"]:not(.theme-new-dark) .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
html[class*="new-"]:not(.theme-new-dark) .is-personalizable:not(.header) .btn-secondary.btn-menu.is-open:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) {
  background-color: ${colors.lightestPalette};
}

html.theme-new-dark .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-secondary.btn-menu:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-secondary.btn-menu.is-open:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) {
  color: ${colors.lightest} !important;
  border-color: ${colors.lightest} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-secondary.btn-menu.is-open:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) .icon {
  color: ${colors.lightest} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-secondary.btn-menu:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-secondary.btn-menu.is-open:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-secondary.btn-menu.is-open:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) {
  background-color: #28282A;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) svg.icon {
  color: ${colors.lightest};
}

html[class*="new-"] .is-personalizable:not(.header):not(.hero-widget) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.btnTertiaryBgHoverColor};
  color: ${colors.btnTertiaryHoverColor};
}

html.theme-new-dark .is-personalizable:not(.hero-widget) .btn-tertiary:not:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
html.theme-new-dark .is-personalizable .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) svg.icon,
html.theme-new-dark .is-personalizable .btn-link:hover:not(:disabled),
html.theme-new-dark .is-personalizable .btn-link:hover:not(:disabled) svg.icon,
html.theme-new-dark .is-personalizable:not(.header) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) svg.icon,
html.theme-new-dark .is-personalizable:not(.header) .btn-link:hover:not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-link:hover:not(:disabled) svg.icon {
  color: ${colors.lightest};
}

html[class*="new-"] .is-personalizable .btn-tertiary:hover:not(:disabled):not(.close):not(.btn-filter):not(.personalize-actionable):not(.destructive) svg.icon {
  color: ${colors.btnTertiaryHoverColor};
}

html.theme-new-dark .is-personalizable:not(.hero-widget) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled),
html.theme-new-dark .is-personalizable:not(.hero-widget) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) svg.icon {
  color: ${colors.contrast} !important;
}

html.theme-new-dark .is-personalizable:not(.hero-widget) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) svg.icon {
  color: ${colors.contrast} !important;
}

button.is-personalizable button:focus:not(.hide-focus),
.is-personalizable a.btn:focus:not(.hide-focus),
a.btn.is-personalizable:focus:not(.hide-focus),
.is-personalizable a.btn-menu:focus:not(.hide-focus),
a.btn-menu.is-personalizable:focus:not(.hide-focus),
.is-personalizable a.btn-icon:focus:not(.hide-focus),
a.btn-icon.is-personalizable:focus:not(.hide-focus),
.is-personalizable a.btn-tertiary:focus:not(.hide-focus),
a.btn-tertiary.is-personalizable:focus:not(.hide-focus),
.is-personalizable a.btn-close:focus:not(.hide-focus),
a.btn-close.is-personalizable:focus:not(.hide-focus) {
  box-shadow: 0 0 0 2px transparent,
    0 0 0 1px ${colors.base},
    0 0 4px 2px rgba(${baseColorObj.r}, ${baseColorObj.g}, ${baseColorObj.b}, 0.3) !important;
}

.is-personalizable:not(.hero-widget) .btn-menu:not(.btn-primary):not(.btn-secondary).is-open,
.btn-menu:not(.btn-primary):not(.btn-secondary).is-personalizable.is-open,
.btn-actions:not(.btn-primary):not(.btn-secondary).is-personalizable.is-open {
  color: ${colors.btnMenu};
}

.is-personalizable:not(.hero-widget) .btn-menu:not(.btn-primary):not(.btn-secondary).is-open .icon,
.btn-menu:not(.btn-primary):not(.btn-secondary).is-personalizable.is-open .icon,
.btn-actions:not(.btn-primary):not(.btn-secondary).is-personalizable.is-open .icon {
  color: ${colors.btnMenu};
}

.is-personalizable:not(.application-menu) .btn-actions:not(.btn-primary):not(.btn-secondary).is-open .icon {
  color: ${colors.btnActionsHoverColor};
}

.is-personalizable .hyperlink:not(.today),
.hyperlink:not(.today).is-personalizable {
  color: ${colors.hyperlinkText} !important;
  opacity: 0.8;
}

.is-personalizable .hyperlink:not(.today):hover,
.hyperlink:not(.today).is-personalizable:hover {
  color: ${colors.hyperlinkTextHover} !important;
}

.is-personalizable .hyperlink:not(.today):focus:not(.hide-focus),
.hyperlink:not(.today).is-personalizable:focus:not(.hide-focus) {
  border-color: ${colors.hyperlinkText};
  box-shadow: 0 0 4px 3px rgba(${hyperlinkColorObj.r}, ${hyperlinkColorObj.g}, ${hyperlinkColorObj.b}, 0.3);
}

.is-personalizable button:not(.btn-monthyear-pane):not(.btn-editor) svg.ripple-effect,
button:not(.btn-monthyear-pane):not(.btn-editor).is-personalizable svg.ripple-effect,
.is-personalizable a svg.ripple-effect,
a.is-personalizable svg.ripple-effect {
  background-color: ${colors.base} !important;
}

.is-personalizable .btn-primary svg.ripple-effect,
.btn-primary.is-personalizable svg.ripple-effect,
.is-personalizable .btn-secondary svg.ripple-effect,
.btn-secondary.is-personalizable svg.ripple-effect {
  background-color: ${colors.contrast} !important;
  border-color: ${colors.contrast} !important;
}

.is-personalizable .count-container .instance-count svg.icon {
  background-color: ${colors.base} !important;
}

.is-personalizable.has-more-button.tab-container.horizontal {
  &::after {
    background-image:
      linear-gradient(to left,
        rgba($header-bg-color, 1),
        rgba($header-bg-color, 0));
    height: 39px;
  }
}

.tab-container.module-tabs.is-personalizable {
  border-top: 1px solid ${colors.tabBorderColor};
  border-bottom: 1px solid ${colors.tabBorderColor};
}

.tab-container.is-personalizable.header-tabs:not(.alternate) .tab-focus-indicator.is-visible,
.tab-container.personalize-header.header-tabs:not(.alternate) .tab-focus-indicator.is-visible,
.tab-container.is-personalizable.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled).is-selected,
.tab-container.personalize-header.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled).is-selected,
.header.is-personalizable .tab-container.header-tabs:not(.alternate) .tab-focus-indicator.is-visible,
.header.is-personalizable .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab.is-selected,
.personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab.is-selected:not(.is-disabled),
.personalize-header.tab-container.header-tabs:not(.alternate) .tab-focus-indicator.is-visible {
  border-color: ${colors.headerTabsSelectedTextColor} !important;
  box-shadow: ${colors.tabFocusBoxShadow} !important;
}

.header.is-personalizable .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled).is-selected {
  box-shadow: none !important;
}

.tab-container.is-personalizable.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled),
.tab-container.is-personalizable.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled),
.header.is-personalizable .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled):not(.is-selected),
.personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled) {
  color: ${colors.contrast};
  background-color: ${colors.tabHoverColor};
  border-bottom: 4px solid ${colors.contrast};
}

.module-tabs.is-personalizable .tab:not(:first-child) {
  border-left: 1px solid ${colors.tabDivider} !important;
}

.module-tabs.is-personalizable {
  background-color: ${colors.darker} !important;
}

.module-tabs.is-personalizable .tab.is-selected {
  background-color: ${colors.tabSelectedColor} !important;
  color: ${colors.moduleTabsSelectedTextColor} !important;
}

.module-tabs.is-personalizable .tab:not(.is-selected) {
  background-color: ${colors.tabColor} !important;
}

.module-tabs.is-personalizable .tab {
  color: ${colors.contrast};
}

.tab-container.module-tabs.is-personalizable .tab.dismissible svg.close {
  color: ${colors.tabCloseInactiveColor};
}

.tab-container.module-tabs.is-personalizable .tab.dismissible svg.close:hover {
  color: ${colors.tabCloseHoverColor};
}

.is-personalizable.tab-container.module-tabs .tab-more,
.is-personalizable.tab-container.module-tabs .add-tab-button {
  color: ${colors.contrast};
}

.tab-container.vertical.is-personalizable > .tab-list-container > .tab-list > .tab.is-selected {
  background-color: ${colors.tabVerticalSelectedColor} !important;
}

.tab-container.vertical.is-personalizable > .tab-list-container > .tab-list > .tab a {
  font-weight: ${colors.tabTextWeight} !important;
}

.tab-container.vertical.is-personalizable > .tab-list-container > .tab-list > .tab.is-selected a {
  color: ${colors.tabVerticalSelectedTextColor} !important;
  font-weight: ${colors.tabTextSelectedWeight} !important;
}

.tab-container.vertical.is-personalizable > .tab-list-container > .tab-list > .tab:not(.is-disabled):hover {
  background-color: ${colors.tabVerticalHoverColor} !important;
}

.tab-container.vertical.is-personalizable > .tab-list-container > .tab-list > .tab.is-selected:hover {
  background-color: ${colors.tabVerticalSelectedColor} !important;
}

.tab-container.vertical.is-personalizable > .tab-list-container > .tab-list > .tab:not(.is-disabled):hover a {
  color: ${colors.tabHoverTextColor} !important;
}

.tab-container.vertical.is-personalizable > .tab-list-container > .tab-list > .tab.is-selected:hover a {
  color: ${colors.tabVerticalSelectedTextColor} !important;
}

.tab-container.module-tabs.is-personalizable .tab-focus-indicator.is-visible:is(.is-selected),
.tab-container.vertical.is-personalizable .tab-focus-indicator.is-visible:is(.is-selected) {
  border-color: transparent !important;
  box-shadow: none !important;
}

.tab-container.module-tabs.is-personalizable .tab-focus-indicator.is-visible:not(.is-selected) {
  border-color: ${colors.tabFocusIndicator} !important;
  box-shadow: ${colors.tabFocusBoxShadow} !important;
}

.tab-container.vertical.is-personalizable .tab-focus-indicator.is-visible:not(.is-selected) {
  border-color: ${colors.tabFocusIndicatorVert} !important;
  box-shadow: ${colors.tabFocusBoxShadowVert} !important;
}

.builder-header.is-personalizable {
  background-color: ${colors.lighter};
}

.header.is-personalizable {
  background-color: ${colors.tabHeaderColor};
  border-bottom: 1px solid ${colors.headerTabBorder};
}

.scrollable-flex-header .breadcrumb {
  background-color: ${colors.base};
}

.header.is-personalizable.has-tabs .tab-container.header-tabs:not(.alternate) {
  background-color: ${colors.tabHeaderColor};
}

.header.is-personalizable .title {
  color: ${colors.contrast} !important;
}

.header.is-personalizable h1,
.header.is-personalizable h2,
.header.is-personalizable h3 {
  color: ${colors.headerTextColor} !important;
}

.object-count.personalize-text {
  color: ${colors.contrast} !important;
}

.header.is-personalizable button svg.ripple-effect {
  background-color: ${colors.contrast} !important;
}

.header.is-personalizable button:not(:disabled),
.header.is-personalizable button:not(:disabled):not(.close) .icon,
.header.is-personalizable button:not(:disabled) .app-header.icon > span,
.subheader.is-personalizable button:not(:disabled):not(.searchfield-category-button),
.subheader.is-personalizable button:not(:disabled):not(.searchfield-category-button) .icon,
.subheader.is-personalizable button:not(:disabled):not(.searchfield-category-button) .app-header.icon > span,
.is-personalizable .personalize-subheader button:not(:disabled),
.is-personalizable .personalize-subheader button:not(:disabled):not(.close):not(.notification-close) .icon,
.is-personalizable .personalize-subheader button:not(:disabled) .app-header.icon > span  {
  color: ${colors.headerIconColor} !important;
}

.header .flex-toolbar [class^='btn']:hover:not(:disabled):not(.close):not(.btn-filter):not(.personalize-actionable),
.header .flex-toolbar [class^='btn']:hover:not(:disabled):not(.close):not(.btn-filter):not(.personalize-actionable) svg.icon {
  color: ${colors.btnHoverColor} !important;
}

html[class*="theme-new"] .header.is-personalizable button:not(.close):not(:disabled):hover .icon {
  color: ${colors.btnTertiaryHoverColor} !important;
}

html[class*="-dark"] .is-personalizable .personalize-subheader button:not(:disabled),
html[class*="-dark"] .is-personalizable .subheader button:not(:disabled),
html[class*="-dark"] .is-personalizable .personalize-subheader button:not(:disabled) .icon,
html[class*="-dark"] .is-personalizable .subheader button:not(:disabled) .icon {
  color: #ffff !important;
}

.header.is-personalizable button:not(:disabled) .app-header.icon > span,
.is-personalizable .personalize-subheader button:not(:disabled) .app-header.icon > span {
  background-color: ${colors.contrast} !important;
  opacity: .8;
}

.header.is-personalizable:not(.has-alternate-tabs) .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled):hover {
  border-bottom: 4px solid ${colors.contrast};
}

html[class*="theme-new"] .header.is-personalizable:not(.has-alternate-tabs) .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled):hover {
  border-bottom: 2px solid ${colors.headerTabsTextColor};
}

html[class*="theme-new"] .header.is-personalizable:not(.has-alternate-tabs) .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:is(.is-selected):not(.is-disabled):hover {
  background-color: transparent;
}

.header.is-personalizable .tab-container.horizontal > .tab-list-container .tab:not(.is-disabled):hover {
  border-bottom: 4px solid ${colors.base};
}

.header.is-personalizable .searchfield-wrapper.has-categories button.btn-icon:not(:disabled):hover,
.header.is-personalizable .searchfield-wrapper.has-categories button:not(.searchfield-category-button):not(:disabled):hover .icon {
  background-color: ${colors.contrast} !important;
}

html[class*="theme-new-"] .header.is-personalizable button:not(:disabled):hover .app-header.icon > span,
html[class*="theme-new-"] .header.is-personalizable .toolbar [class^='btn']:hover:not(.go-button):not(.close):not(.searchfield-category-button):not([disabled]),
html[class*="theme-new-"] .subheader.is-personalizable button:not(.go-button):not(.close):not(.searchfield-category-button):not(:disabled):hover,
html[class*="theme-new-"] .subheader.is-personalizable button:not(:disabled):hover .app-header.icon > span,
html[class*="theme-new-"] .subheader.is-personalizable .toolbar [class^='btn']:hover:not(.go-button):not(.close):not(.searchfield-category-button):not([disabled]),
html[class*="theme-new-"] .personalize-subheader button:not(.go-button):not(.close):not(.searchfield-category-button):not(:disabled):hover,
html[class*="theme-new-"] .personalize-subheader button:not(:disabled):hover .app-header.icon > span,
html[class*="theme-new-"] .personalize-subheader .toolbar [class^='btn']:hover:not(.go-button):not(.close):not(.searchfield-category-button):not([disabled]) {
  color: ${colors.btnTertiaryHoverColor} !important;
  background-color: ${colors.btnTertiaryBgHoverColor} !important;
  opacity: 1;
}

html[class*="theme-new-"] .header.is-personalizable button:not(.go-button):not(.close):not(.searchfield-category-button):not(:disabled):hover {
  background-color: ${colors.btnTertiaryBgHoverColor} !important;
  color: ${colors.btnTertiaryHoverColor} !important;
}

.header .flex-toolbar [class^='btn'][disabled] {
  color: ${colors.btnDisabledColor};
}

.header.is-personalizable .buttonset .searchfield-wrapper.non-collapsible.toolbar-searchfield-wrapper.has-categories .btn-icon.close:hover {
  background-color: ${colors.contrast} !important;
}

html.theme-new-dark .header.is-personalizable .buttonset .searchfield-wrapper.non-collapsible.toolbar-searchfield-wrapper.has-categories .btn-icon.close,
html.theme-new-dark .header.is-personalizable .buttonset .searchfield-wrapper.non-collapsible.toolbar-searchfield-wrapper.has-categories .btn-icon.close svg.close,
html.theme-classic-dark .header.is-personalizable .buttonset .searchfield-wrapper.non-collapsible.toolbar-searchfield-wrapper.has-categories .btn-icon.close,
html.theme-classic-dark .header.is-personalizable .buttonset .searchfield-wrapper.non-collapsible.toolbar-searchfield-wrapper.has-categories .btn-icon.close svg.close {
  background-color: transparent !important;
}

.header.is-personalizable button:not(:disabled) .app-header.icon > span {
  background-color: ${colors.contrast} !important;
  opacity: 1;
}

.header.is-personalizable .go-button.is-personalizable {
  background-color: ${colors.lightest};
  border-color:${colors.lightest};
  color: ${colors.contrast};
}

.header.is-personalizable.has-tabs .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab.is-selected:not(.is-disabled),
.personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab.is-selected:not(.is-disabled) {
  color: ${colors.headerTabsSelectedTextColor} !important;
  opacity: 1;
}

.header.is-personalizable .flex-toolbar .has-collapse-button .collapse-button {
  background-color: transparent;
  border-color: ${colors.borderActiveSearchHeader};
}

.header.is-personalizable .flex-toolbar .has-collapse-button .collapse-button:focus:not(.hide-focus) {
  box-shadow: none !important;
  border-color: ${colors.borderActiveSearchHeader};
}

html.theme-new-dark .header.is-personalizable.has-tabs .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab.is-selected:not(.is-disabled) {
  color: ${colors.contrast} !important;
}

.header.is-personalizable .tab-container.header-tabs:not(.alternate) .tab-more::before,
.tab-container.is-personalizable.header-tabs:not(.alternate) .tab-more::before {
  background-color: ${colors.contrast};
}

.is-personalizable .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled),
.header.is-personalizable .tab-container.header-tabs:not(.alternate) .tab-more svg.icon,
.tab-container.is-personalizable .tab-more svg.icon,
.is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled),
.personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled)  {
  color: ${colors.contrast} !important;
  opacity: .8;
}

html.theme-new-dark .personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled),
html.theme-classic-dark .personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled) {
  color: #fff !important;
  opacity: .8;
}

.header.is-personalizable.has-tabs .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab,
.is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab,
.personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab {
  color: ${colors.contrast} !important;
  opacity: .8;
}

.header.is-personalizable.has-tabs .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled):not(.is-selected),
.is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled),
.personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled) {
  color: ${colors.contrast} !important;
  opacity: 1;
}

html.theme-new-dark .header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab:hover:not(.is-disabled),
.is-personalizable.tab-container.header-tabs > .tab-list-container .tab:hover:not(.is-disabled)  {
  color: ${colors.contrast} !important;
  opacity: 1;
}

html[class*="theme-new-"] .header.is-personalizable.has-tabs .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled),
html[class*="theme-new-"] .is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled),
html[class*="theme-new-"] .personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled) {
  opacity: 1;
}

.is-personalizable .count-container .instance-count .count {
  border-color: ${colors.contrast} !important;
  color: ${colors.contrast} !important;
}

html[class*="theme-new-"] .is-personalizable .count-container .instance-count .title {
  color: ${colors.contrast} !important;
}

html.theme-classic-dark .is-personalizable .count-container .instance-count .count {
  border-color: ${colors.subtext} !important;
  color: ${colors.subtext} !important;
}

.header.is-personalizable .page-title {
  color: ${colors.contrast};
}

.header.is-personalizable .flex-toolbar [class^='btn'][disabled] .icon,
.header.is-personalizable .btn:not(.searchfield-category-button)[disabled] span {
  color: ${colors.btnDisabledColor};
}

.header.is-personalizable button:not(:disabled),
.subheader.is-personalizable button:not(:disabled):not(.searchfield-category-button) {
  color: ${colors.contrast};
}

.header.is-personalizable  .flex-toolbar [class^='btn']:focus:not(.hide-focus) .icon {
  color: ${colors.contrast} !important;
}

.header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab:hover:not(.is-disabled)::before {
  background-color: ${colors.contrast};
}

.header.is-personalizable.has-tabs .animated-bar {
  background-color: ${colors.contrast};
}

.header.is-personalizable.has-tabs .tab-list-container .tab.is-selected:not(.is-disabled):hover::before {
  background-color: ${colors.contrast} !important;
}

.header.is-personalizable .buttonset .toolbar-searchfield-wrapper:not(.is-open) svg.icon:not(.close),
.header.is-personalizable .toolbar-searchfield-wrapper:not(.is-open) .icon:not(.close),
.header .toolbar-searchfield-wrapper .searchfield,
.masthead .toolbar-searchfield-wrapper .searchfield,
.header.is-personalizable .toolbar [class^='btn']:focus .icon {
  color: ${colors.contrast};
}

.header .toolbar [class^='btn']:hover:not(.go-button):not(.close):not(.searchfield-category-button) {
  background-color: ${colors.base};
}

.header.alabaster .toolbar [class^='btn']:hover:not(.go-button):not(.searchfield-category-button) {
  background-color: #E6F1FD !important;
}

.personalize-subheader.scrollable-flex-header .breadcrumb:not(.alternate) .hyperlink,
.personalize-subheader..scrollable-flex-header .breadcrumb:not(.alternate) .breadcrumb-text,
.personalize-subheader.scrollable-flex-header .breadcrumb:not(.alternate) .hyperlink,
.personalize-subheader.scrollable-flex-header .breadcrumb:not(.alternate) .breadcrumb-list li::after,
.personalize-subheader.scrollable-flex-header .breadcrumb:not(.alternate) ol li::after {
  color: ${colors.contrast};
}

.personalize-subheader.scrollable-flex-header .breadcrumb .hyperlink:focus:not([disabled]) {
  border: 1px solid ${colors.contrast};
}

.personalize-subheader.scrollable-flex-header .breadcrumb:not(.alternate) .hyperlink:hover:not([disabled]) {
  border-bottom: 1px solid ${colors.contrast};
}

.header .toolbar-searchfield-wrapper.active.has-focus .searchfield {
  border-color: ${colors.borderActiveSearchHeader};
}

.header .toolbar-searchfield-wrapper.active.has-focus {
  box-shadow: ${colors.shadowActiveSearchHeader};
}

html[class*="-dark"] .header .toolbar-searchfield-wrapper.active.has-focus .searchfield {
  border-color: ${colors.contrast};
}

.header.is-personalizable .btn-actions:not(.btn-primary):not(.btn-secondary).is-open .icon,
.header.is-personalizable .wizard-header .tick,
.header.is-personalizable .wizard-header .tick .label,
.header.is-personalizable .wizard-header a.tick:hover:not(.current):not(.is-disabled):not([disabled]) .label {
  color: ${colors.contrast};
}

.header.is-personalizable .wizard-header .tick:focus .label {
  border-color: ${colors.lighter};
}

.header.is-personalizable .wizard-header .tick.current::before {
  border-color: ${colors.light};
  border-color: ${colors.contrast};
}

.is-personalizable .personalize-text {
  color: ${colors.contrast};
}

html[class*='classic-'] .is-personalizable .tab-container.header-tabs.alternate > .tab-list-container .tab.is-selected:not(.is-disabled) {
  border-color: ${colors.contrast};
}

.tab-container.header-tabs.alternate > .tab-list-container .tab.is-disabled {
  color: ${colors.contrast};
  opacity: 0.6;
}

.is-personalizable .tab-container.header-tabs > .tab-list-container .tab.is-disabled {
  color: ${colors.contrast};
  opacity: 0.6;
}

.is-personalizable .label + .personalize-text.data {
  color: ${colors.contrast};
}

.header.is-personalizable .wizard-header .tick::after {
  background-color: ${colors.base};
  border: 2px solid ${colors.contrast};
}

.header.is-personalizable .wizard-header .bar,
.header.is-personalizable .wizard-header .tick.complete {
  background-color: ${colors.darkest};
}

.header.is-personalizable .wizard-header .tick.complete::after,
.header.is-personalizable .wizard-header .completed-range {
  background-color: ${colors.contrast};
}

.header.is-personalizable .wizard-header .tick.complete .label {
  color: ${colors.contrast};
}

.header.is-personalizable .wizard-header .tick.current {
  box-shadow: none;
}
.header.is-personalizable .wizard-header .tick.current::after {
  background-color: ${colors.contrast};
  border-color: ${colors.contrast};
}

.subheader.is-personalizable .go-button.is-personalizable {
  background-color: ${colors.dark};
  border-color: ${colors.dark};
  color: ${colors.contrast};
}

.subheader.is-personalizable .go-button.is-personalizable:not(.hide-focus) {
  box-shadow: 0 0 0 1px #FAFAFA, 0 0 0 2px ${colors.darkest}, 0 0 4px 2px rgba(41, 41, 41, 0.3);
}

.is-personalizable .breadcrumb .hyperlink,
.breadcrumb.is-personalizable .hyperlink {
  color: ${colors.theme.text};
}
.is-personalizable .breadcrumb .hyperlink:hover,
.breadcrumb.is-personalizable .hyperlink:hover {
  color: ${colors.theme.text};
}
.is-personalizable .breadcrumb .hyperlink:focus:not(.hide-focus),
.breadcrumb.is-personalizable .hyperlink:focus:not(.hide-focus) {
  box-shadow: none;
}
.is-personalizable .breadcrumb .hyperlink[disabled],
.breadcrumb.is-personalizable .hyperlink[disabled],
.is-personalizable .breadcrumb .hyperlink[disabled]:hover,
.breadcrumb.is-personalizable .hyperlink[disabled]:hover {
  color: ${colors.theme.disabledText};
}

.is-personalizable .scrollable-flex-header .breadcrumb:not(.alternate),
.scrollable-flex-header.is-personalizable .breadcrumb:not(.alternate) {
  background-color: ${colors.base};
}
.is-personalizable .scrollable-flex-header .breadcrumb.truncated:not(.alternate) .breadcrumb-list::before,
.scrollable-flex-header.is-personalizable .breadcrumb.truncated:not(.alternate) .breadcrumb-list::before {
  background-image: linear-gradient(to right, ${colors.base}, ${colorUtils.hexToRgba(colors.base, 0)});
}
html[dir='rtl'] .is-personalizable .scrollable-flex-header .breadcrumb.truncated:not(.alternate) .breadcrumb-list::before,
html[dir='rtl'] .scrollable-flex-header.is-personalizable .breadcrumb.truncated:not(.alternate) .breadcrumb-list::before {
  background-image: linear-gradient(to right, ${colorUtils.hexToRgba(colors.base, 0)}, ${colors.base});
}
.is-personalizable .scrollable-flex-header .breadcrumb:not(.alternate) .hyperlink,
.scrollable-flex-header.is-personalizable .breadcrumb:not(.alternate) .hyperlink {
  color: ${colors.contrast};
}
.is-personalizable .scrollable-flex-header .breadcrumb:not(.alternate) .hyperlink:hover,
.scrollable-flex-header.is-personalizable .breadcrumb:not(.alternate) .hyperlink:hover  {
  color: ${colors.contrast};
}

.is-personalizable .scrollable-flex-header .breadcrumb:not(.alternate) .btn-actions.is-open .icon,
.scrollable-flex-header.is-personalizable .breadcrumb:not(.alternate) .btn-actions.is-open .icon {
  color: ${colors.contrast};
}
.is-personalizable .scrollable-flex-header .breadcrumb:not(.alternate) .btn-actions:focus:not(.hide-focus),
.scrollable-flex-header.is-personalizable .breadcrumb:not(.alternate) .btn-actions:focus:not(.hide-focus) {
  box-shadow: 0 0 0 2px transparent, 0 0 0 1px ${colors.contrast}, 0 0 1px 2px ${colorUtils.hexToRgba(colors.contrast, 0.3)} !important;
}

.module-tabs.is-personalizable .tab-more {
  border-left-color: ${colors.tabDivider} !important;
}

.module-tabs.is-personalizable .tab-more.is-open {
  background-color: ${colors.hover} !important;
}

.module-tabs.is-personalizable .tab-more.is-selected {
  background-color: ${colors.base} !important;
}

.header .toolbar > .toolbar-searchfield-wrapper.active .searchfield {
  background-color: ${colors.hover} !important;
  border-bottom-color: ${colors.hover} !important;
}

.header .toolbar > .toolbar-searchfield-wrapper.active .searchfield-category-button {
  background-color: ${colors.hover} !important;
  border-bottom-color: ${colors.hover} !important;
}

.subheader.is-personalizable {
  background-color: ${colors.lighter} !important;
}

.builder .sidebar .header {
  border-right: 1px solid ${colors.hover} !important;
}

.module-tabs.is-personalizable .tab:not(.is-selected):hover,
.module-tabs.is-personalizable .tab-more:hover {
  background-color: ${colors.tabHoverColor} !important;
  color: ${colors.contrast};
}

.is-personalizable.tab-container.module-tabs .tab .icon {
  color: ${colors.contrast};
}

.module-tabs.has-toolbar.is-personalizable .tab-list-container + .toolbar {
  border-left-color: ${colors.darkest} !important;
}

.module-tabs.is-personalizable [class^="btn"] {
  background-color: transparent;
  color: ${colors.contrast} !important;
}

.module-tabs.is-personalizable .tab.is-disabled {
  background-color: ${colors.darker} !important;
  color: ${colors.contrast} !important;
}

.module-tabs.is-personalizable .tab.is-disabled > svg {
  fill: ${colors.contrast} !important;
}

.module-tabs.is-personalizable .add-tab-button {
  border-left-color: ${colors.darkest} !important;
}

.module-tabs.is-personalizable .add-tab-button:hover {
  background-color: ${colors.darker} !important;
}

.module-tabs.is-personalizable .toolbar-searchfield-wrapper > .searchfield {
  color: ${colors.contrast};
}

.module-tabs.is-personalizable .toolbar-searchfield-wrapper > svg {
  fill: ${colors.contrast} !important;
}

.header.is-personalizable .toolbar [class^='btn'][disabled],
.header.is-personalizable .toolbar [class^='btn'][disabled] .icon,
.header.is-personalizable .toolbar [class^='btn'][disabled] span {
  color: ${colors.btnDisabledColor};
}

.header .toolbar [class^='btn']:focus:not(.hide-focus):not(.collapse-button) {
  border-color: ${colors.contrast};
}

.is-personalizable .tab-container.header-tabs:not(.alternate)::before,
.is-personalizable.tab-container.header-tabs:not(.alternate)::before {
  background-image: linear-gradient(to right, ${colors.base} , ${colorUtils.hexToRgba(colors.base, 0)}) !important;
}

html[dir='rtl'] .is-personalizable .tab-container.header-tabs:not(.alternate)::before,
html[dir='rtl'] .is-personalizable.tab-container.header-tabs:not(.alternate)::before {
  background-image: linear-gradient(to left, ${colors.base}, ${colorUtils.hexToRgba(colors.base, 0)}) !important;
}

.is-personalizable .tab-container.header-tabs:not(.alternate)::after,
.is-personalizable.tab-container.header-tabs:not(.alternate)::after {
  background-image: linear-gradient(to right, ${colorUtils.hexToRgba(colors.base, 0)}, ${colors.base}) !important;
}

html[dir='rtl'] .is-personalizable .tab-container.header-tabs:not(.alternate)::after,
html[dir='rtl'] .is-personalizable.tab-container.header-tabs:not(.alternate)::after {
  background-image: linear-gradient(to left, ${colorUtils.hexToRgba(colors.base, 0)}, ${colors.base}) !important;
}

.is-personalizable.header .section-title {
  color: ${colors.contrast};
}

.is-personalizable.header button.application-menu-trigger:hover:not(:disabled) .icon.app-header.go-back > span {
  background-color: ${colors.contrast} !important;
}

.is-personalizable .tab-container.header-tabs:not(.alternate),
.is-personalizable.tab-container.header-tabs:not(.alternate) {
  border-bottom-color: ${colors.tabBottomBorderColor};
}

.tab-container.is-personalizable.module-tabs .tab a {
  font-weight: ${colors.tabTextWeight} !important;
}

.tab-container.is-personalizable.module-tabs .tab.is-selected a {
  font-weight: ${colors.tabTextSelectedWeight} !important;
}

html[class*="-dark"] .is-personalizable .btn-tertiary:not(.destructive):not(:disabled):hover,
html[class*="-dark"] .is-personalizable .btn-link:not(:disabled):hover,
html[class*="-dark"] .is-personalizable:not(.header) .btn-menu:not(.btn-secondary):not(:disabled):hover,
html[class*="-dark"] .is-personalizable:not(.header) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: #28282A;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-pane .accordion-header {
  border: 1px solid ${colors.lighter};
}

html[class*="theme-new-"] .application-menu.is-personalizable button:focus:not(.hide-focus),
html[class*="theme-new-"] .application-menu.is-personalizable .hyperlink:focus:not(.hide-focus)::after {
  border-color: ${colors.contrast} !important;
  box-shadow: none !important;
}

.application-menu.is-personalizable .accordion-header.has-filtered-children > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.has-filtered-children.is-focused {
  color: ${colors.contrast} !important;
}

html[dir='rtl'] .application-menu.is-personalizable {
  background-color: ${colors.lighter};
  border-left: ${colors.light};
}

html[class*="theme-new-"] .application-menu.is-personalizable button svg.ripple-effect {
  background-color: ${colors.contrast} !important;
}

html[class*="theme-new"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-focused.is-expanded {
  border-color: transparent !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded.is-focused::before {
  border-color: ${colors.contrast} !important;
}

.is-personalizable.tab-container {
  background-color: ${colors.tabColor} !important;
}

.is-personalizable.tab-container.vertical,
.is-personalizable.tab-container.vertical > .tab-list-container {
  background-color: ${colors.tabVerticalColor} !important;
}

.is-personalizable.tab-container.vertical {
  border-right: 1px solid ${colors.verticalTabBorder} !important;
}

.is-personalizable .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab-list .tab.is-disabled,
.is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab-list .tab.is-disabled {
  opacity: .4;
}

html[class*="theme-classic-"] .is-personalizable .tab-container .tab-list-container .tab-list .tab.is-disabled,
html[class*="theme-classic-"] .tab-container.is-personalizable .tab-list-container .tab-list .tab.is-disabled {
  opacity: .4 !important;
}

.is-personalizable .personalize-header:not(.header-tabs.alternate) {
  background-color: ${colors.base} !important;
}

.is-personalizable .personalize-subheader {
  background-color: ${colors.lighter} !important;
}

.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb {
  background-color: ${colors.lighter};
}

.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb.truncated .breadcrumb-list::before,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb.truncated ol::before {
  background-image: linear-gradient(to right, ${colors.lighter}, ${colors.lighter}80);
}

.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .hyperlink,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .btn-actions .icon,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .breadcrumb-overflow-container::after,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .breadcrumb-list li::after,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb ol li::after  {
  color: ${colors.contrast} !important;
}

.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .hyperlink:hover {
  border-bottom: 1px solid ${colors.contrast}
}

.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb {
  background-color: ${colors.lighter};
}

.is-personalizable .section-wizard {
  background-color: ${colors.lighter} !important;
}

.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb.truncated .breadcrumb-list::before,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb.truncated ol::before {
  background-image: linear-gradient(to right, ${colors.lighter}, ${colors.lighter}80);
}

.is-personalizable .section-wizard {
  background-color: ${colors.lighter} !important;
}

.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .hyperlink,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .btn-actions .icon,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .breadcrumb-overflow-container::after,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .breadcrumb-list li::after,
.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb ol li::after  {
  color: ${colors.contrast};
}

.is-personalizable .section-wizard {
  background-color: ${colors.lighter} !important;
}

.is-personalizable .personalize-subheader  p:not(.notification-text),
.personalize-subheader.is-personalizable p:not(.notification-text) {
  color: ${colors.contrast} !important;
}

.is-personalizable .personalize-subheader  h1,
.personalize-subheader.is-personalizable h1,
.is-personalizable .personalize-subheader h2,
.personalize-subheader.is-personalizable h2 {
  color: ${colors.contrast} !important;
}

html[class*="-dark"] .is-personalizable .personalize-subheader h1,
html[class*="-dark"] .is-personalizable .personalize-subheader h2 {
  color: #fff !important;
}

html[class*="-dark"] .is-personalizable .subheader h1,
html[class*="-dark"] .is-personalizable .subheader h2 {
  color: #fff !important;
}

.is-personalizable .personalize-subheader button:not(.notification-close) .icon:not(.notification-icon),
.personalize-subheader.is-personalizable button:not(.notification-close) .icon:not(.notification-icon) {
  color: ${colors.contrast} !important;
}

.is-personalizable .personalize-subheader .toolbar-searchfield-wrapper.active.is-open *,
.personalize-subheader.is-personalizable .toolbar-searchfield-wrapper.active.is-open * {
  color: ${colors.theme.text} !important;
}

.is-personalizable .personalize-actionable,
.is-personalizable .personalize-actionable svg,
.is-personalizable .personalize-actionable .icon,
.is-personalizable .personalize-header .personalize-chart-targeted .label,
.is-personalizable .personalize-header .info-message .icon,
.is-personalizable .personalize-header .info-message p,
.is-personalizable .personalize-header .btn-icon .icon {
  color: ${colors.contrast} !important;
}

html[class*="theme-new-"] .is-personalizable .personalize-actionable:hover:not([disabled]):not(.personalize-actionable-disabled):not(a) ,
html[class*="theme-new-"] .is-personalizable .personalize-actionable:hover:not([disabled]):not(.personalize-actionable-disabled) svg,
html[class*="theme-new-"] .is-personalizable .personalize-actionable:hover:not([disabled]):not(.personalize-actionable-disabled) .icon  {
  color: ${colors.btnHoverColor} !important;
  opacity: 1;
}

html[class*="theme-new-"] .is-personalizable .personalize-actionable:hover:not([disabled]):not(.personalize-actionable-disabled):not(a) {
  color: ${colors.btnHoverColor} !important;
  background-color: ${colors.btnBgHoverColor};
  opacity: 1;
}

.is-personalizable .btn-icon.personalize-actionable {
  height: 34px;
  width: 34px;
}

html[class*="theme-new-"] .is-personalizable .btn-icon.personalize-actionable:hover:not([disabled]) {
  background-color: ${colors.btnBgHoverColor} !important;
}

.is-personalizable .personalize-actionable.is-focused:not(.hide-focus),
.is-personalizable .personalize-actionable:focus:not(.hide-focus) {
  border-color: ${colors.btnFocusBorderColor} !important;
  box-shadow: 0 0 4px 3px rgba(255, 255, 255, 0.2);
}

.is-personalizable .personalize-actionable.hyperlink:focus:not(.hide-focus)::after {
  border-color: ${colors.contrast} !important;
  opacity: 1;
  box-shadow: 0 0 4px 3px rgba(255, 255, 255, 0.2);
}

.is-personalizable .personalize-vertical-border {
  border-color: ${colors.light};
}

.is-personalizable .personalize-horizontal-top-border {
  border-top: 1px solid: ${colors.darkest};
}

.is-personalizable .personalize-chart-targeted .total.bar {
  background-color: ${colors.btnDisabledColor};
}

.is-personalizable .personalize-chart-targeted .chart-percent-text,
.is-personalizable .personalize-chart-targeted .label {
  color: ${colors.contrast};
}

.is-personalizable .info-message,
.is-personalizable .info-message .icon,
.is-personalizable .info-message p {
  color: ${colors.contrast} !important;
}

.is-personalizable .personalize-actionable-disabled,
.is-personalizable .personalize-actionable-disabled:hover {
  opacity: .4 !important;
  cursor: default;
}

.subheader.is-personalizable .toolbar [class^='btn']:focus:not(.hide-focus),
.subheader.is-personalizable .flex-toolbar [class^='btn']:focus:not(.hide-focus) {
  box-shadow: ${colors.focusBoxShadow};
}

.header.is-personalizable .toolbar [class^='btn']:focus:not(.hide-focus),
.header.is-personalizable .flex-toolbar [class^='btn']:focus:not(.hide-focus) {
  box-shadow: ${colors.focusBoxShadow}
}

html.theme-new-dark .header.alabaster.is-personalizable .flex-toolbar [class^='btn']:focus:not(.hide-focus) .icon {
  color: #fff !important;
}

html.theme-new-dark .header.alabaster.is-personalizable .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled),
html.theme-new-dark .header.alabaster.is-personalizable .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) svg.icon {
  color: #fff !important;
}

html[class*="theme-new-"]:not(.theme-new-dark) .header.alabaster.is-personalizable button:not(:disabled) {
  color: #000 !important;
}

html[class*="theme-new-"]:not(.theme-new-dark) .header.alabaster.is-personalizable .flex-toolbar [class^='btn'][disabled] span,
html[class*="theme-new-"]:not(.theme-new-dark) .header.alabaster.is-personalizable .flex-toolbar [class^='btn'][disabled] .icon {
  color: #C5C5C9 !important;
}

html[class*="theme-classic-"]:not(.theme-classic-dark) .header.alabaster.is-personalizable .flex-toolbar [class^='btn'][disabled] span,
html[class*="theme-classic-"]:not(.theme-classic-dark) .header.alabaster.is-personalizable .flex-toolbar [class^='btn'][disabled] .icon {
  color: #888B94 !important;
}

html[class*="theme-classic-"]:not(.theme-classic-dark) .header.alabaster.is-personalizable button:not(:disabled) {
  color: #000 !important;
}

html[class*="theme-new-"]:not(.theme-new-dark) .alabaster.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .btn-actions .icon,
html[class*="theme-new-"]:not(.theme-new-dark) .alabaster.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .hyperlink,
html[class*="theme-new-"]:not(.theme-new-dark) .alabaster.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .breadcrumb-overflow-container::after,
html[class*="theme-new-"]:not(.theme-new-dark) .alabaster.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb .breadcrumb-list li::after,
html[class*="theme-new-"]:not(.theme-new-dark) .alabaster.header.is-personalizable + .page-container .scrollable-flex-header.personalize-subheader .breadcrumb ol li::after {
  color: #000 !important;
}
`;
}

export { personalizeStyles };

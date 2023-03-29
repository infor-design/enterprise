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

.is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane),
.btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane).is-personalizable {
  background-color: ${colors.base} !important;
  border-color: ${colors.base} !important;
}

.header.is-personalizable .buttonset .searchfield-wrapper.is-open button {
  background-color: ${colors.contrast};
  color: ${colors.darkest} !important;
}
.header.is-personalizable .buttonset .searchfield-wrapper.is-open button.go-button:hover {
  background-color: ${colors.secondaryButtonHover} !important;
  color: ${colors.darkest} !important;
}

.header.is-personalizable .buttonset .searchfield-wrapper.is-open svg,
.header .toolbar .buttonset .searchfield-wrapper.non-collapsible.toolbar-searchfield-wrapper.has-categories.has-go-button.has-close-icon-button.is-open button.searchfield-category-button svg.icon {
  color: ${colors.darkest} !important;
}

html.theme-classic-dark .is-personalizable .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled {
  color: #888B94 !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) {
  background-color: ${colors.darkNewButton} !important;
  border-color: ${colors.darkNewButton} !important;
}

html[class*="new-"] .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane),
html[class*="new-"] .is-personalizable:not(.header) .btn-secondary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane) svg.icon  {
  border-color: ${colors.base} !important;
  color: ${colors.darkest} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) svg.icon {
  border-color: ${colors.darkNewButton} !important;
  color: ${colors.darkNewButton} !important;
}

html.theme-classic-dark .is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled {
  background-color: ${colors.baseDisabled} !important;
  border-color: ${colors.baseDisabled} !important;
}

.is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled,
.btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane).is-personalizable:disabled {
  color: ${colors.contrast} !important;
  background-color: ${colors.baseDisabled} !important;
  border-color: ${colors.baseDisabled} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled {
  color: ${colors.darkNewButtonTextDisabled} !important;
  background-color: ${colors.darkNewButtonDisabled} !important;
  border-color: ${colors.darkNewButtonDisabled} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled svg.icon {
  color: ${colors.darkNewButtonTextDisabled} !important;
}

html[class*="new-"] .is-personalizable:not(.header) .btn-secondary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled,
html[class*="new-"] .is-personalizable:not(.header) .btn-secondary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane).is-personalizable:disabled svg.icon,
html[class*="new-"] .is-personalizable:not(.header) .btn-secondary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled svg.icon {
  border-color: ${colors.baseDisabled} !important;
  color: ${colors.baseDisabled} !important;
}

html[class*="new-contrast"] .is-personalizable:not(.header) .btn-secondary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled {
  background-color: #fff;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-secondary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled {
  border-color: ${colors.darkNewButtonTextDisabled} !important;
  background-color: ${colors.darkNewButtonDisabled} !important;
  color: ${colors.darkNewButtonTextDisabled} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-secondary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled svg.icon {
  color: ${colors.darkNewButtonTextDisabled} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-tertiary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled,
html.theme-new-dark .is-personalizable:not(.header) .btn-link:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled {
  background-color: ${colors.darkNewButtonDisabled} !important;
  color: ${colors.darkNewButtonTextDisabled} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-tertiary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled svg.icon {
  color: ${colors.darkNewButtonTextDisabled} !important;
}

.is-personalizable:not(.header) .btn-link:not(:disabled),
.btn-link.is-personalizable:not(:disabled) {
  color: ${colors.light} !important;
}

.is-personalizable:not(.header) .btn-link:not(:disabled):hover {
  background-color: ${colors.secondaryButtonHover} !important;
}

.is-personalizable:not(.header) .btn-link:not(:disabled) .icon,
.btn-link.is-personalizable:not(:disabled) .icon {
  color: ${colors.light} !important;
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
  background-color: ${colors.darker} !important;
  border-color: ${colors.darker} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.darkNewButtonHover} !important;
  border-color: ${colors.darkNewButtonHover} !important;
}

html[class*="new-"] .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.secondaryButtonHover} !important;
}

html.theme-new-dark .is-personalizable:not(.header) .btn-secondary:not(.go-button):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.darkNewButtonLighterHover} !important;
  color: ${colors.darkNewButtonHover} !important;
  border-color: ${colors.darkNewButtonHover} !important;
}

html[class*="new-"] .is-personalizable:not(.header) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.secondaryButtonHover} !important;
  color: ${colors.lightest};
}

html.theme-new-dark .is-personalizable:not(.hero-widget) .btn-tertiary:not:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
html.theme-new-dark .is-personalizable .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) svg.icon,
html.theme-new-dark .is-personalizable .btn-link:hover:not(:disabled),
html.theme-new-dark .is-personalizable .btn-link:hover:not(:disabled) svg.icon,
html.theme-new-dark .is-personalizable:not(.header) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) svg.icon,
html.theme-new-dark .is-personalizable:not(.header) .btn-link:hover:not(:disabled),
html.theme-new-dark .is-personalizable:not(.header) .btn-link:hover:not(:disabled) svg.icon {
  background-color: ${colors.darkNewButtonLighterHover} !important;
  color: ${colors.darkNewButtonHover} !important;
}

html[class*="new-"] .is-personalizable .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) svg {
  color: ${colors.lightest};
}

html.theme-new-dark .is-personalizable .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled),
html.theme-new-dark .is-personalizable .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) svg.icon {
  color: ${colors.contrast} !important;
}

html.theme-new-dark .is-personalizable:not(.hero-widget) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):not(:disabled) svg.icon {
  color: ${colors.contrast} !important;
}

.is-personalizable:not(.header) .btn-primary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
.btn-primary.is-personalizable:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.darker} !important;
  border-color: ${colors.darker} !important;
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

.is-personalizable .btn-primary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):focus:not(.hide-focus),
.btn-primary.is-personalizable button:focus:not(.hide-focus),
.is-personalizable .btn-secondary:focus:not(.hide-focus),
.btn-secondary.is-personalizable button:focus:not(.hide-focus) {
  box-shadow: 0 0 0 2px ${colors.theme.bg},
    0 0 0 3px ${colors.base},
    0 0 4px 2px rgba(${baseColorObj.r}, ${baseColorObj.g}, ${baseColorObj.b}, 0.3);
}

.is-personalizable .btn-menu:not(.btn-primary):not(.btn-secondary).is-open,
.btn-menu:not(.btn-primary):not(.btn-secondary).is-personalizable.is-open,
.is-personalizable .btn-actions:not(.btn-primary):not(.btn-secondary).is-open,
.btn-actions:not(.btn-primary):not(.btn-secondary).is-personalizable.is-open {
  color: ${colors.base};
}

.is-personalizable .btn-menu:not(.btn-primary):not(.btn-secondary).is-open .icon,
.btn-menu:not(.btn-primary):not(.btn-secondary).is-personalizable.is-open .icon,
.is-personalizable .btn-actions:not(.btn-primary):not(.btn-secondary).is-open .icon,
.btn-actions:not(.btn-primary):not(.btn-secondary).is-personalizable.is-open .icon {
  color: ${colors.base};
}

.is-personalizable .hyperlink:not(.today),
.hyperlink:not(.today).is-personalizable {
  color: ${colors.hyperlinkText} !important;
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

.is-personalizable .count-container .instance-count .count,
.is-personalizable .count-container .instance-count .title {
  color: ${colors.contrast} !important;
}

.is-personalizable .count-container .instance-count .count {
  border-color: ${colors.contrast} !important;
}

.tab-container.module-tabs.is-personalizable {
  border-top: 1px solid ${colors.darkest} !important;
  border-bottom: 1px solid ${colors.darkest} !important;
}

.tab-container.is-personalizable.header-tabs:not(.alternate) .tab-focus-indicator.is-visible,
.tab-container.personalize-header.header-tabs:not(.alternate) .tab-focus-indicator.is-visible,
.tab-container.is-personalizable.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled).is-selected,
.tab-container.personalize-header.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled).is-selected,
.header.is-personalizable .tab-container.header-tabs:not(.alternate) .tab-focus-indicator.is-visible,
.header.is-personalizable .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab.is-selected,
.personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab.is-selected:not(.is-disabled),
.personalize-header.tab-container.header-tabs:not(.alternate) .tab-focus-indicator.is-visible,
.header.is-personalizable .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled).is-selected {
  border-color: ${colors.contrast} !important;
}

.tab-container.is-personalizable.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled),
.tab-container.is-personalizable.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled),
.header.is-personalizable .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled),
.personalize-header.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled) {
  color: ${colors.contrast};
  background-color: ${colors.darker};
  border-bottom: 4px solid ${colors.contrast};
}

.module-tabs.is-personalizable .tab:not(:first-child) {
  border-left: 1px solid ${colors.darkest} !important;
}

.module-tabs.is-personalizable {
  background-color: ${colors.darker} !important;
}

.module-tabs.is-personalizable .tab.is-selected {
  background-color: ${colors.base} !important;
}

.tab-container.vertical.is-personalizable > .tab-list-container > .tab-list > .tab.is-selected {
  background-color: ${colors.base} !important;
}

.tab-container.vertical.is-personalizable .tab-focus-indicator.is-visible {
  border-color: ${colors.base} !important;
  box-shadow: 0 0 4px 3px rgba(${baseColorObj.r}, ${baseColorObj.g}, ${baseColorObj.b}, 0.3);
}

.accordion.panel .accordion-header.is-selected {
  color: ${colors.contrast} !important;
}

.builder-header.is-personalizable{
  background-color: ${colors.lighter};
}

.header.is-personalizable {
  background-color: ${colors.base};
}

.header.is-personalizable.has-tabs .tab-container.header-tabs:not(.alternate) {
  background-color: ${colors.base};
}

.header.is-personalizable .title {
  color: ${colors.contrast};
}

.header.is-personalizable h1,
.header.is-personalizable h2,
.header.is-personalizable h3 {
  color: ${colors.contrast};
}

.object-count.personalize-text {
  color: ${colors.contrast};
}

.header.is-personalizable button svg.ripple-effect {
  background-color: ${colors.contrast} !important;
}

.header.is-personalizable button:not(:disabled),
.header.is-personalizable button:not(:disabled) .icon,
.header.is-personalizable button:not(:disabled) .app-header.icon > span,
.is-personalizable .personalize-subheader button:not(:disabled),
.is-personalizable .personalize-subheader button:not(:disabled) .icon,
.is-personalizable .personalize-subheader button:not(:disabled) .app-header.icon > span  {
  color: ${colors.contrast} !important;
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

.header.is-personalizable .tab-container.horizontal > .tab-list-container .tab:not(.is-disabled):hover {
  border-bottom: 4px solid ${colors.base};
}

.header.is-personalizable .searchfield-wrapper.has-categories button.btn-icon:not(:disabled):hover,
.header.is-personalizable .searchfield-wrapper.has-categories button:not(.searchfield-category-button):not(:disabled):hover .icon {
  background-color: ${colors.contrast} !important;
}

.header.is-personalizable button:not(.go-button):not(.searchfield-category-button):not(:disabled):hover,
.header.is-personalizable button:not(:disabled):hover .app-header.icon > span,
.header.is-personalizable .toolbar [class^='btn']:hover:not(.go-button):not(.searchfield-category-button):not([disabled]) {
  color: ${colors.contrast};
  background-color: ${colors.darker} !important;
  opacity: 1;
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

.header.is-personalizable button:not(.searchfield-category-button):not(:disabled):hover .icon {
  background-color: transparent !important;
}

html.theme-new-dark .header.alabaster.is-personalizable {
  background-color: #606066 !important;
}

html.theme-classic-dark .header.alabaster.is-personalizable {
  background-color: #50535A !important;
}

html.theme-classic-dark .header.alabaster.is-personalizable .title h1 {
  color: #fff;
}

html.theme-classic-dark .header.alabaster.is-personalizable button:not(:disabled) .icon {
  color: rgba(255, 255, 255, 0.7) !important;
}

html.theme-classic-dark .header.alabaster.is-personalizable button:not(:disabled):hover .icon {
  color: #fff !important;
}

html.theme-classic-dark .header.alabaster.is-personalizable .toolbar [class^='btn']:hover:not(.go-button):not(.searchfield-category-button):not([disabled]) {
  background-color: #313236 !important;
}

html.theme-new-dark .header.alabaster.is-personalizable .title h1 {
  color: #ffffff;
}

html.theme-new-dark .header.alabaster.is-personalizable button:not(:disabled) .icon {
  color: #ffffff !important;
}

html.theme-new-dark .header.alabaster.is-personalizable .personalize-actionable:focus:not(.hide-focus) {
  border-color: #ffffff !important;
}

html.theme-new-dark .header.alabaster.is-personalizable button:not(.go-button):not(.searchfield-category-button):not(:disabled):hover,
html.theme-new-dark .header.alabaster.is-personalizable button:not(:disabled):hover .app-header.icon > span,
html.theme-new-dark .header.alabaster.is-personalizable .toolbar [class^='btn']:hover:not(.go-button):not(.searchfield-category-button):not([disabled]) {
  background-color: #47474C !important;
}

html.theme-new-dark .header.alabaster.is-personalizable button:not(.searchfield-category-button):not(:disabled):hover .icon {
  background-color: transparent !important;
}

.header.alabaster.is-personalizable button:not(.go-button):not(.searchfield-category-button):not(:disabled):hover,
.header.alabaster.is-personalizable button:not(:disabled):hover .app-header.icon > span,
.header.alabaster.is-personalizable .toolbar [class^='btn']:hover:not(.go-button):not(.searchfield-category-button):not([disabled]) {
  background-color: #E6F1FD !important;
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
  color: ${colors.contrast} !important;
  opacity: 1;
}

//xxxx

.header.is-personalizable .flex-toolbar .has-collapse-button .collapse-button {
  background-color: transparent;
  border-color: ${colors.contrast};
}

.header.is-personalizable .flex-toolbar .has-collapse-button .collapse-button:focus:not(.hide-focus) {
  box-shadow: none !important;
  border-color: ${colors.contrast};
}

.header .toolbar-searchfield-wrapper.has-collapse-button:not(.is-open) .searchfield {
  color: ${colors.contrast};
}

html.theme-new-dark .header.is-personalizable.has-tabs .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab.is-selected:not(.is-disabled),
.header.is-personalizable .flex-toolbar .toolbar-searchfield-wrapper.has-collapse-button:not(.is-open) > svg.icon:not(.icon-error) {
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

html.theme-new-dark .header.alabaster + .page-container .is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab {
  color: #ffffff !important;
}

html.theme-new-dark .header.alabaster + .page-container .is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled) {
  opacity: 0.8;
}

html.theme-new-dark .header.alabaster + .page-container .is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled):hover {
  opacity: 1;
}

html.theme-new-dark .header.alabaster + .page-container .is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled).is-selected {
  border-color: #fff !important;
}

html.theme-new-dark .header.alabaster + .page-container .tab-container.header-tabs:not(.alternate) {
  border-bottom: 1px solid #3E3E42 !important;
}

html.theme-new-dark .header.alabaster + .page-container .is-personalizable .hyperlink:not(.today),
html.theme-new-dark .header.alabaster + .page-container .hyperlink:not(.today).is-personalizable {
  color: #55A3F3 !important;
}

html.theme-new-dark .header.alabaster + .page-container .is-personalizable .hyperlink:hover:not([disabled]) {
  color: #1C86EF !important;
}

html.theme-new-dark .header.alabaster + .page-container .tab-container.is-personalizable.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled), .tab-container.is-personalizable.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled) {
  background-color: transparent;
  border-color: #fff;
}

html.theme-new-dark .header.alabaster + .page-container .tab-container.is-personalizable.header-tabs:not(.alternate) .tab-focus-indicator.is-visible {
  border-color: #fff !important;
}

html.theme-new-contrast:not(.theme-new-dark) .header.alabaster + .page-container .hyperlink:not([disabled]),
html.theme-new-contrast:not(.theme-new-dark) .header.alabaster + .page-container .hyperlink:not(.today).is-personalizable {
  color: #004A99 !important;
}

html.theme-new-contrast:not(.theme-new-dark) .header.alabaster + .page-container .hyperlink:hover:not([disabled]),
html.theme-new-contrast:not(.theme-new-dark) .header.alabaster + .page-container .hyperlink:not(.today).is-personalizable:hover {
  color: #003876 !important;
}

html.theme-classic-contrast .header.alabaster + .page-container .hyperlink:not(.today).is-personalizable,
html.theme-classic-contrast .header.alabaster + .page-container .hyperlink:not(.today).personalize-actionable {
  color: #55A3F3 !important;
  opacity: 1;
}

html.theme-classic-contrast .header.alabaster + .page-container .hyperlink:not(.today).is-personalizable:hover,
html.theme-classic-contrast .header.alabaster + .page-container .hyperlink:not(.today).personalize-actionable:hover {
  color: #003876 !important;
}

html.theme-new-light .header.alabaster + .page-container .is-personalizable .hyperlink:not(.today),
html.theme-new-light .header.alabaster + .page-container  .hyperlink:not(.today).is-personalizable {
  color: #0072ED !important;
  opacity: 1;
}

html.theme-new-light .header.alabaster + .page-container .is-personalizable .hyperlink:not(.today):hover,
html.theme-new-light .header.alabaster + .page-container  .hyperlink:not(.today).is-personalizable:hover {
  color: #0054B1 !important;
}

.header.is-personalizable.has-tabs .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:hover:not(.is-disabled),
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

.header.is-personalizable .page-title {
  color: ${colors.contrast};
}

.header.is-personalizable .flex-toolbar [class^='btn'][disabled] .icon,
.header.is-personalizable .btn:not(.searchfield-category-button)[disabled] span {
  color: rgba(255, 255, 255, 0.3) !important;
}

.header.is-personalizable button:not(:disabled) {
  color: #fff !important;
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

.header.is-personalizable .toolbar-searchfield-wrapper:not(.non-collapsible):not(.is-open) .icon:not(.close),
.header .toolbar-searchfield-wrapper .searchfield,
.masthead .toolbar-searchfield-wrapper .searchfield,
.header.is-personalizable .toolbar [class^='btn']:focus .icon {
  color: ${colors.contrast};
}

html[class*="-dark"] .header.alabaster.is-personalizable .toolbar-searchfield-wrapper:not(.non-collapsible):not(.is-open) .icon:not(.close),
html[class*="-dark"] .header.alabaster .toolbar-searchfield-wrapper .searchfield {
  color: #ffffff;
}

.header .toolbar [class^='btn']:hover:not(.go-button):not(.searchfield-category-button) {
  background-color: ${colors.base};
}

.header.alabaster .toolbar [class^='btn']:hover:not(.go-button):not(.searchfield-category-button) {
  background-color: #E6F1FD !important;
}

html[class*="-dark"] .header.alabaster .toolbar [class^='btn']:hover:not(.go-button):not(.searchfield-category-button) {
  background-color: #47474C !important;
}

.header .toolbar-searchfield-wrapper.active .searchfield:focus {
  border-color: ${colors.contrast};
}

.header.is-personalizable .btn-actions:not(.btn-primary):not(.btn-secondary).is-open .icon,
.header.is-personalizable .wizard-header .tick,
.header.is-personalizable .wizard-header .tick .label,
.header.is-personalizable .wizard-header a.tick:hover:not(.current):not(.is-disabled):not([disabled]) .label {
  color: ${colors.contrast};
}

.header.is-personalizable .wizard-header .tick:focus .label,
.header.is-personalizable .wizard-header .tick.current::before {
  border-color: ${colors.light};
}

.is-personalizable.hero-widget .hero-footer .hero-footer-nav-title {
  color: #ffffff;
}

html[class*='new-'] .is-personalizable.hero-widget .hero-header .toolbar .buttonset .btn-tertiary.btn-menu:not(:disabled):hover,
html[class*='new-'] .is-personalizable.hero-widget .hero-header .toolbar .buttonset .btn-tertiary.btn-menu:not(:disabled):hover svg.icon,
html[class*='new-'] .is-personalizable.hero-widget .hero-header .toolbar .buttonset .btn-tertiary.btn-menu:not(:disabled).is-open svg.icon {
  background-color: transparent;
  color: ${colors.contrast};
}

.header.is-personalizable .wizard-header .bar,
.header.is-personalizable .wizard-header .tick.current::after,
.header .wizard-header .tick::after,
.header.is-personalizable .wizard-header .tick.complete {
  background-color: ${colors.darkest};
}

.header.is-personalizable .wizard-header .tick.complete::after,
.header.is-personalizable .wizard-header .completed-range,
.header.is-personalizable .wizard-header .tick.current {
  background-color: ${colors.contrast};
}

.header.is-personalizable .wizard-header .tick.complete .label {
  color: ${colors.contrast};
}

.subheader.is-personalizable .go-button.is-personalizable {
  background-color: ${colors.dark};
  border-color: ${colors.dark};
  color: ${colors.contrast};
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
  border-left-color: ${colors.darkest} !important;
}

.module-tabs.is-personalizable .tab-more:hover {
  background-color: ${colors.hover} !important;
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

.module-tabs.is-personalizable .tab:hover {
  background-color: ${colors.darker} !important;
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
  color: rgba(255, 255, 255, 0.3) !important;
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

.is-personalizable .tab-container.header-tabs:not(.alternate),
.is-personalizable.tab-container.header-tabs:not(.alternate) {
  border-bottom-color: ${colors.base};
}

.hero-widget.is-personalizable {
  background-color: ${colors.darkestPalette};
}

.hero-widget.is-personalizable .hero-content .circlepager.is-active .controls .control-button.is-active::before,
.hero-widget.is-personalizable .hero-content .circlepager.is-active .controls .control-button.is-active:hover::before {
  background-color: #fff;
  border-color: #fff;
}

.hero-widget.is-personalizable .hero-content .circlepager.is-active .controls .control-button:hover::before,
.hero-widget.is-personalizable .hero-content .circlepager.is-active .controls .control-button::before {
  border-color: #fff;
}

.hero-widget.is-personalizable .hero-bottom {
  background-color: ${colors.base};
}

.hero-widget.is-personalizable .hero-footer .hero-footer-nav li::before {
  color: ${colors.light};
}

.hero-widget.is-personalizable .chart-container .arc {
  stroke: ${colors.lighter};
}

.hero-widget.is-personalizable .chart-container .bar {
  stroke: ${colors.lighter};
}

.hero-widget.is-personalizable .chart-container.line-chart .dot {
  stroke: ${colors.lighter};
}

.hero-widget.is-personalizable .count-container .instance-count svg.icon {
  background-color: ${colors.darkestPalette} !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable button .icon,
html[class*="theme-new-"] .application-menu.is-personalizable button span,
html[class*="theme-new-"] .application-menu.is-personalizable .hyperlink {
  color: ${colors.contrast} !important;
}

html[class*="-dark"] .is-personalizable .btn-tertiary:not(:disabled):hover,
html[class*="-dark"] .is-personalizable .btn-link:not(:disabled):hover,
html[class*="-dark"] .is-personalizable:not(.header) .btn-tertiary:not(.destructive):not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: #3E3E42 !important;
}

.is-personalizable.hero-widget .hero-bottom .hero-footer .hero-footer-nav a.btn-tertiary:not(:disabled):hover {
  border-radius: 0;
  border-bottom: 4px solid ${colors.contrast};
  background-color: ${colors.darker};
  color: ${colors.contrast} !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable button:not(:disabled):hover .icon,
html[class*="theme-new-"] .application-menu.is-personalizable button:not(:disabled):hover span,
html[class*="theme-new-"] .application-menu.is-personalizable .hyperlink:hover {
  color: ${colors.contrast};
  opacity: 1;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel {
  background-color: ${colors.lighter};
}

html[class*="theme-new-"] .application-menu.is-personalizable .name-xl,
html[class*="theme-new-"] .application-menu.is-personalizable .name,
html[class*="theme-new-"] .application-menu.is-personalizable .accordion-heading {
  color: ${colors.contrast};
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel .accordion-header {
  background-color: ${colors.lighter} !important;
  border: 1px solid transparent !important;
  color: ${colors.contrast};
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel .accordion-header .icon {
  color: ${colors.contrast} !important;
}

.application-menu.is-personalizable .btn-icon:focus:not(.hide-focus) {
  box-shadow: 0 0 0 2px transparent,
    0 0 0 1px ${colors.lighter},
    0 0 2px 1px ${colors.lighter};
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected {
  background-color: ${colors.base} !important;
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected:hover {
  border-bottom-color: ${colors.dark} !important;
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected:hover > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected .icon {
  color: ${colors.contrast} !important;
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected button .icon.plus-minus::before,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected button .icon.plus-minus::after {
  background-color: ${colors.contrast};
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-focused:not(.hide-focus) {
  border: 1px solid ${colors.contrast} !important;
  box-shadow: none !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-pane {
  background-color: ${colors.lighter};
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-pane .accordion-header {
  border: 1px solid ${colors.lighter};
}

html[class*="theme-new-"] .application-menu.is-personalizable button:focus:not(.hide-focus),
html[class*="theme-new-"] .application-menu.is-personalizable .hyperlink:focus:not(.hide-focus)::after {
  border-color: ${colors.contrast} !important;
  box-shadow: none !important;
}

html[class*="theme-new-"] .application-menu .application-menu-header button:hover,
html[class*="theme-new-"] .application-menu .application-menu-footer button:hover {
  background-color: ${colors.base} !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .searchfield-wrapper .searchfield {
  color: ${colors.contrast} !important;
}

.application-menu.is-personalizable .accordion-header.has-filtered-children > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.has-filtered-children.is-focused {
  color: ${colors.contrast} !important;
}

.application-menu.is-personalizable .searchfield-wrapper .searchfield::placeholder {
  color: ${colors.contrast};
  opacity: .5;
}

.application-menu.is-personalizable .searchfield-wrapper .icon {
  color: ${colors.contrast};
  opacity: .8;
}

.application-menu.is-personalizable .searchfield-wrapper.active .icon {
  color: ${colors.contrast};
  opacity: 1;
}

.application-menu.is-personalizable .application-menu-switcher-panel,
.application-menu.is-personalizable .application-menu-switcher-panel .accordion.panel,
.application-menu.is-personalizable .application-menu-switcher-panel .accordion.panel .accordion-header {
  background-color: ${colors.base} !important;
  border-top-color: transparent;
}

.application-menu.is-personalizable .application-menu-switcher-panel .accordion.panel .accordion-header:hover {
  background-color: ${colors.darkest} !important;
}

.application-menu.is-personalizable .application-menu-switcher-panel .accordion-heading {
  border-top-color: ${colors.darkest};
}

.application-menu.is-personalizable .searchfield-wrapper {
  background-color: ${colors.base};
  border-bottom: none !important;
}

html[dir='rtl'] .application-menu.is-personalizable {
  background-color: ${colors.lighter};
  border-left: ${colors.light};
}

html[class*="theme-new-"] .application-menu.is-personalizable button svg.ripple-effect {
  background-color: ${colors.contrast} !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable {
  background-color: ${colors.lighter};
  border-right: ${colors.light};
}

html[class*="theme-new-"] .application-menu.is-personalizable .application-menu-header {
  background-color: ${colors.lighter};
  border-bottom-color: ${colors.light};
}

html[class*="theme-new-"] .application-menu.is-personalizable .application-menu-footer {
  background-color: ${colors.lighter};
  border-top-color: ${colors.light};
}

html[class*="theme-new-"] .application-menu.is-personalizable .searchfield-wrapper {
  background-color: ${colors.dark};
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header {
  background-color: transparent !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header:hover {
  background-color: ${colors.darkest} !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header.is-selected {
  background-color: ${colors.darkest} !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header .icon.plus-minus::before {
  background-color: ${colors.subtext};
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header .icon.plus-minus::after {
  background-color: ${colors.subtext};
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-pane {
  background-color: transparent !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-pane .accordion-header {
  color: ${colors.subtext};
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded {
  background-color: ${colors.dark} !important;
  color: ${colors.subtext} !important;
}

html[class*="theme-new"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-focused:not(.hide-focus):not(.is-expanded) {
  border-color: ${colors.contrast} !important;
}

html[class*="theme-new"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-focused.is-expanded {
  border-color: transparent !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded.is-selected::before {
  background-color: ${colors.darker} !important;
  border-color: ${colors.darker} !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded.is-focused::before {
  border-color: ${colors.contrast} !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded + .accordion-pane {
  background-color: ${colors.dark} !important;
}

html[class*="theme-new-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded:hover::before {
  border-color: ${colors.darkest} !important;
  background-color: ${colors.darkest} !important;
}

.is-personalizable.tab-container {
  background-color: ${colors.base} !important;
}

html.theme-new-dark .header.alabaster + .page-container .is-personalizable.tab-container {
  background-color: #606066 !important;
}

.is-personalizable .tab-container.header-tabs:not(.alternate) > .tab-list-container .tab-list .tab.is-disabled,
.is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab-list .tab.is-disabled {
  opacity: .6;
}

html[class*="theme-classic-"] .is-personalizable .tab-container .tab-list-container .tab-list .tab.is-disabled,
html[class*="theme-classic-"] .tab-container.is-personalizable .tab-list-container .tab-list .tab.is-disabled {
  opacity: .4 !important;
}

.is-personalizable .personalize-header:not(.header-tabs.alternate) {
  background-color: ${colors.base} !important;
}

html[class*="-dark"] .header.alabaster + .is-personalizable .personalize-header {
  background-color: #606066 !important;
}

.is-personalizable .personalize-subheader {
  background-color: ${colors.lighter} !important;
}

html[class*="-dark"] .is-personalizable .personalize-subheader:not(.amber):not(.azure):not(.amber):not(.amethyst):not(.emerald):not(.graphite):not(.ruby):not(.slate):not(.turquoise) {
  background-color: #77777C !important;
}

html[class*="-dark"] .is-personalizable .subheader:not(.amber):not(.azure):not(.amber):not(.amethyst):not(.emerald):not(.graphite):not(.ruby):not(.slate):not(.turquoise) {
  background-color: #77777C !important;
}

.is-personalizable .personalize-subheader  p,
.personalize-subheader.is-personalizable p {
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

.is-personalizable .personalize-subheader  .icon,
.personalize-subheader.is-personalizable .icon {
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
  color: ${colors.text} !important;
  opacity: .8;
}

.is-personalizable .personalize-actionable:hover:not([disabled]),
.is-personalizable .personalize-actionable:hover:not([disabled]) svg,
.is-personalizable .personalize-actionable:hover:not([disabled]) .icon  {
  color: ${colors.contrast} !important;
  opacity: 1;
}

.header.alabaster + .content.personalize-header .is-personalizable .personalize-text {
  color: #fff;
}

html.theme-new-dark .header.alabaster + .page-container .is-personalizable .personalize-header {
  background-color: #606066 !important;
}

html.theme-classic-dark .header.alabaster + .page-container .is-personalizable .personalize-header {
  background-color: #50535A !important;
}

html.theme-classic-dark header.alabaster + .page-container .is-personalizable .personalize-header,
html.theme-classic-dark header.alabaster + .page-container .is-personalizable.tab-container {
  background-color: #50535A !important;
  border-bottom-color: #414247;
}

html.theme-classic-dark header.alabaster + .page-container .is-personalizable.tab-container.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled) {
  color: #fff !important;
}

html.theme-classic-dark .header.alabaster + .page-container .tab-container.header-tabs > .tab-list-container .tab.is-disabled {
  color: rgba(255, 255, 255, 0.8) !important;
}

html.theme-classic-dark .header.alabaster + .page-container .tab-container.is-personalizable.header-tabs:not(.alternate) > .tab-list-container .tab:not(.is-disabled).is-selected,
html.theme-classic-dark .header.alabaster + .page-container .tab-container.is-personalizable.header-tabs:not(.alternate) .tab-focus-indicator.is-visible {
  border-color: #fff !important;
}

html.theme-classic-dark .header.alabaster + .page-container .is-personalizable .personalize-actionable {
  color: #55A3F3 !important;
}

html.theme-classic-dark .header.alabaster + .page-container .hyperlink:not(.today).is-personalizable {
  opacity: 0.8 !important;
}

html.theme-classic-light .header.alabaster + .page-container .hyperlink:not(.today).is-personalizable {
  opacity: 0.8 !important;
}

html.theme-classic-light .header.alabaster + .page-container .hyperlink:not(.today).is-personalizable:hover {
  opacity: 1 !important;
}

html.theme-classic-dark .header.alabaster + .page-container .hyperlink:not(.today).is-personalizable:hover {
  opacity: 1 !important;
}

html.theme-classic-light .header.alabaster + .page-container .is-personalizable .personalize-actionable {
  color: #55A3F3 !important;
}

.header.alabaster + .is-personalizable .personalize-actionable:hover:not([disabled]) {
  color: #000 !important;
}

.is-personalizable .personalize-actionable.is-focused:not(.hide-focus),
.is-personalizable .personalize-actionable:focus:not(.hide-focus) {
  border-color: ${colors.contrast} !important;
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
  background-color: rgba(255, 255, 255, .8);
}

.is-personalizable .personalize-chart-targeted .chart-percent-text,
.is-personalizable .personalize-chart-targeted .label {
  color: ${colors.text};
}

.is-personalizable .info-message,
.is-personalizable .info-message .icon,
.is-personalizable .info-message p {
  color: ${colors.text} !important;
}

.is-personalizable .personalize-actionable-disabled,
.is-personalizable .personalize-actionable-disabled:hover {
  opacity: .4 !important;
  cursor: default;
}

.hero-widget.is-personalizable .hero-header .chart-container .arc,
.hero-widget.is-personalizable .hero-header .chart-container .bar,
.hero-widget.is-personalizable .hero-header .chart-container.line-chart .dot,
.hero-widget.is-personalizable .hero-content .chart-container .arc,
.hero-widget.is-personalizable .hero-content .chart-container .bar,
.hero-widget.is-personalizable .hero-content .chart-container.line-chart .dot,
.hero-widget.is-personalizable .hero-footer .chart-container .arc,
.hero-widget.is-personalizable .hero-footer .chart-container .bar,
.hero-widget.is-personalizable .hero-footer .chart-container.line-chart .dot {
    stroke: ${colors.lighter} !important;
}

.hero-widget.is-personalizable .hero-header .chart-container text,
.hero-widget.is-personalizable .hero-content .chart-container text,
.hero-widget.is-personalizable .hero-footer .chart-container text {
    fill: ${colors.text} !important;
}

.hero-widget.is-personalizable .hero-header .chart-container .chart-legend-item-text,
.hero-widget.is-personalizable .hero-content .chart-container .chart-legend-item-text,
.hero-widget.is-personalizable .hero-footer .chart-container .chart-legend-item-text {
  color: ${colors.text};
  fill: ${colors.text};
}

.hero-widget.is-personalizable .hero-header .title,
.hero-widget.is-personalizable .hero-content .title,
.hero-widget.is-personalizable .hero-footer .title {
  color: ${colors.subtext};
}

.hero-widget.is-personalizable .hero-header .btn-tertiary,
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span,
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary),
.hero-widget.is-personalizable .hero-content .btn-tertiary,
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span,
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary),
.hero-widget.is-personalizable .hero-footer .btn-tertiary,
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span,
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary),
.hero-widget.is-personalizable .hero-header .btn-tertiary .icon,
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span .icon,
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary) .icon,
.hero-widget.is-personalizable .hero-content .btn-tertiary .icon,
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span .icon,
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary) .icon,
.hero-widget.is-personalizable .hero-footer .btn-tertiary .icon,
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span .icon,
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary) .icon
 {
  color: ${colors.subtext};
}

.hero-widget.is-personalizable .hero-header .btn-tertiary:hover,
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span:hover,
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary):hover,
.hero-widget.is-personalizable .hero-content .btn-tertiary:hover,
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span:hover,
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary):hover,
.hero-widget.is-personalizable .hero-footer .btn-tertiary:hover,
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span:hover,
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary):hover,
.hero-widget.is-personalizable .hero-header .btn-tertiary:hover .icon,
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span:hover .icon,
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary):hover .icon,
.hero-widget.is-personalizable .hero-content .btn-tertiary:hover .icon,
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span:hover .icon,
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary):hover .icon,
.hero-widget.is-personalizable .hero-footer .btn-tertiary:hover .icon,
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span:hover .icon,
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary):hover .icon
 {
  color: ${colors.text};
}

.hero-widget.is-personalizable .hero-header .btn-tertiary:focus:not(.hide-focus),
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span:focus:not(.hide-focus),
.hero-widget.is-personalizable .hero-header .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary):focus:not(.hide-focus),
.hero-widget.is-personalizable .hero-content .btn-tertiary:focus:not(.hide-focus),
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span:focus:not(.hide-focus),
.hero-widget.is-personalizable .hero-content .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary):focus:not(.hide-focus),
.hero-widget.is-personalizable .hero-footer .btn-tertiary:focus:not(.hide-focus),
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary).is-open span:focus:not(.hide-focus),
.hero-widget.is-personalizable .hero-footer .btn-menu:not(.btn):not(.btn-primary):not(.btn-secondary):not(.btn-tertiary):focus:not(.hide-focus) {
  box-shadow: 0 0 0 2px transparent,
    0 0 0 0 ${colors.subtext},
    0 0 2px 1px ${colors.subtext};
}

.subheader.is-personalizable .toolbar [class^='btn']:focus:not(.hide-focus),
.subheader.is-personalizable .flex-toolbar [class^='btn']:focus:not(.hide-focus) {
  box-shadow: 0 0 0 2px transparent,
    0 0 0 1px ${colors.subtext},
    0 0 2px 1px ${colors.subtext};
}

.header.is-personalizable:not(.alabaster) .toolbar [class^='btn']:focus:not(.hide-focus),
.header.is-personalizable .flex-toolbar [class^='btn']:focus:not(.hide-focus) {
  box-shadow: 0 0 0 2px transparent,
  0 0 0 0 ${colors.subtext},
  0 0 2px 1px ${colors.subtext} !important;
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
  color: #B7B7BA !important;
}

html[class*="theme-classic-"]:not(.theme-classic-dark) .header.alabaster.is-personalizable .flex-toolbar [class^='btn'][disabled] span,
html[class*="theme-classic-"]:not(.theme-classic-dark) .header.alabaster.is-personalizable .flex-toolbar [class^='btn'][disabled] .icon {
  color: #888B94 !important;
}

html[class*="theme-classic-"]:not(.theme-classic-dark) .header.alabaster.is-personalizable button:not(:disabled) {
  color: #000 !important;
}

/*
.tooltip.is-personalizable {
  background-color: ${colors.darkest};
  border-color: ${colors.darkest};
}
.tooltip.is-personalizable .chart-swatch .swatch-row div {
  border-bottom-color: ${colors.darkest};
}
.tooltip.is-personalizable,
.tooltip.is-personalizable p,
.tooltip.is-personalizable .chart-swatch .swatch-row span,
.tooltip.is-personalizable .chart-swatch .swatch-row b {
  color: ${colors.tooltipText};
}
.tooltip.is-personalizable.top .arrow::after {
  border-top-color: ${colors.darkest};
}
.tooltip.is-personalizable.right .arrow::after {
  border-right-color: ${colors.darkest};
}
.tooltip.is-personalizable.bottom .arrow::after {
  border-bottom-color: ${colors.darkest};
}
.tooltip.is-personalizable.left .arrow::after {
  border-left-color: ${colors.darkest};
}
*/
    `;
}

export { personalizeStyles };

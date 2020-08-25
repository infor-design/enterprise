import { colorUtils } from '../../utils/color';

function personalizeStyles(colors) {
  const baseColorObj = colorUtils.hexToRgb(colors.base);
  const hyperlinkColorObj = colorUtils.hexToRgb(colors.hyperlinkText);

  return `

.is-personalizable ::selection {
  background: ${colors.selection} !important
}

.is-personalizable .btn-primary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane),
.btn-primary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane).is-personalizable {
  background-color: ${colors.base} !important;
  border-color: ${colors.base} !important;
}

.is-personalizable .btn-primary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):disabled,
.btn-primary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane).is-personalizable:disabled {
  background-color: ${colors.baseDisabled} !important;
  border-color: ${colors.baseDisabled} !important;
}

.is-personalizable .btn-link:not(:disabled),
.btn-link.is-personalizable:not(:disabled) {
  color: ${colors.light} !important;
}

.is-personalizable .btn-link:not(:disabled) .icon,
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

.is-personalizable .btn-primary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
.btn-primary.is-personalizable:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.darker} !important;
  border-color: ${colors.darker} !important;
}

.is-personalizable .btn-primary:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled),
.btn-primary.is-personalizable:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):hover:not(:disabled) {
  background-color: ${colors.darker} !important;
  border-color: ${colors.darker} !important;
}

.is-personalizable button:not(.is-select):not(.is-select-month-pane):not(.is-cancel):not(.is-cancel-month-pane):focus:not(.hide-focus),
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
    0 0 4px 2px rgba(${baseColorObj.r}, ${baseColorObj.g}, ${baseColorObj.b}, 0.3);
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
  color: ${colors.hyperlinkText}
}
.is-personalizable .hyperlink:not(.today):hover,
.hyperlink:not(.today).is-personalizable:hover {
  color: ${colors.hyperlinkTextHover};
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

.tab-container.module-tabs.is-personalizable {
  border-top: 1px solid ${colors.darkest} !important;
  border-bottom: 1px solid ${colors.darkest} !important;
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
  background-color: ${colors.lighter} !important;
  color: ${colors.contrast} !important;
}

.builder-header.is-personalizable{
  background-color: ${colors.lighter};
}

.header.is-personalizable {
  background-color: ${colors.base};
}

.header.is-personalizable .title {
  color: ${colors.contrast};
}

.header.is-personalizable h1 {
  color: ${colors.contrast};
}

.header.is-personalizable button svg.ripple-effect {
  background-color: ${colors.contrast} !important;
}

.header.is-personalizable button:not(:disabled),
.header.is-personalizable button:not(:disabled) .icon,
.header.is-personalizable button:not(:disabled) .app-header.icon > span {
  color: ${colors.contrast} !important;
  opacity: .8;
}

.header.is-personalizable .header.is-personalizable button:not(:disabled) .app-header.icon > span {
  background-color: ${colors.contrast} !important;
  opacity: .8;
}

.header.is-personalizable button:not(:disabled):hover,
.header.is-personalizable button:not(:disabled):hover .icon,
.header.is-personalizable button:not(:disabled):hover .app-header.icon > span,
.header.is-personalizable .toolbar [class^='btn']:hover:not([disabled]) {
  color: ${colors.contrast} !important;
  opacity: 1;
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

.header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab.is-selected:not(.is-disabled) {
  color: ${colors.contrast} !important;
}

.header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab,
.is-personalizable.tab-container.header-tabs > .tab-list-container .tab  {
  color: ${colors.contrast} !important;
  opacity: .8;
}

.header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab:hover:not(.is-disabled),
.is-personalizable.tab-container.header-tabs > .tab-list-container .tab:hover:not(.is-disabled)  {
  color: ${colors.contrast} !important;
  opacity: 1;
}

html[class*="theme-uplift-"] .header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab,
html[class*="theme-uplift-"] .is-personalizable.tab-container.header-tabs > .tab-list-container .tab  {
  opacity: 1;
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
  background-color: transparent !important;
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
  color: ${colors.contrast} !important;
}

.module-tabs.is-personalizable .toolbar-searchfield-wrapper > svg {
  fill: ${colors.contrast} !important;
}

.is-personalizable .tab-container.header-tabs:not(.alternate)::before,
.is-personalizable.tab-container.header-tabs:not(.alternate)::before {
  background-image: linear-gradient(to right, ${colors.dark} , ${colorUtils.hexToRgba(colors.dark, 0)}) !important;
}

.is-personalizable .tab-container.header-tabs:not(.alternate)::after,
.is-personalizable.tab-container.header-tabs:not(.alternate)::after {
  background-image: linear-gradient(to right, ${colorUtils.hexToRgba(colors.dark, 0)}, ${colors.dark}) !important;
}

.hero-widget.is-personalizable {
  background-color: ${colors.lighter};
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

html[class*="theme-uplift-"] .application-menu.is-personalizable button .icon,
html[class*="theme-uplift-"] .application-menu.is-personalizable button span,
html[class*="theme-uplift-"] .application-menu.is-personalizable .hyperlink {
  color: ${colors.contrast} !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable button:not(:disabled):hover .icon,
html[class*="theme-uplift-"] .application-menu.is-personalizable button:not(:disabled):hover span,
html[class*="theme-uplift-"] .application-menu.is-personalizable .hyperlink:hover {
  color: ${colors.contrast};
  opacity: 1;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel {
  background-color: ${colors.lighter};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .name-xl,
html[class*="theme-uplift-"] .application-menu.is-personalizable .name,
html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion-heading {
  color: ${colors.contrast};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel .accordion-header {
  background-color: ${colors.lighter} !important;
  border: 1px solid transparent !important;
  color: ${colors.contrast};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel .accordion-header .icon {
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

.application-menu.is-personalizable .accordion.panel .accordion-header.is-focused:not(.hide-focus) {
  border: 1px solid ${colors.contrast} !important;
  box-shadow: none !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-pane {
  background-color: ${colors.lighter};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-pane .accordion-header {
  border: 1px solid ${colors.lighter};
}

.application-menu.is-personalizable .accordion.panel.inverse .accordion-header .icon.plus-minus::before,
.application-menu.is-personalizable .accordion.panel.inverse .accordion-header .icon.plus-minus::after {
  background-color: ${colors.contrast};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable button:focus:not(.hide-focus),
html[class*="theme-uplift-"] .application-menu.is-personalizable .hyperlink:focus:not(.hide-focus)::after {
  border-color: ${colors.contrast} !important;
  box-shadow: none !important;
}

html[class*="theme-uplift-"] .application-menu .application-menu-header button:hover,
html[class*="theme-uplift-"] .application-menu .application-menu-footer button:hover {
  background-color: ${colors.base} !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .searchfield-wrapper .searchfield {
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

html[class*="theme-uplift-"] .application-menu.is-personalizable button svg.ripple-effect {
  background-color: ${colors.contrast} !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable {
  background-color: ${colors.lighter};
  border-right: ${colors.light};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .application-menu-header {
  background-color: ${colors.lighter};
  border-bottom-color: ${colors.light};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .application-menu-footer {
  background-color: ${colors.lighter};
  border-top-color: ${colors.light};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .searchfield-wrapper {
  background-color: ${colors.dark};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header {
  background-color: transparent !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header:hover {
  background-color: ${colors.darkest} !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header.is-selected {
  background-color: ${colors.darkest} !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header .icon.plus-minus::before {
  background-color: ${colors.subtext};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-header .icon.plus-minus::after {
  background-color: ${colors.subtext};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-pane {
  background-color: transparent !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse .accordion-pane .accordion-header {
  color: ${colors.subtext};
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded {
  background-color: ${colors.dark} !important;
  color: ${colors.subtext} !important;
}

html[class*="theme-uplift"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-focused:not(.hide-focus):not(.is-expanded) {
  border-color: ${colors.contrast} !important;
}

html[class*="theme-uplift"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-focused.is-expanded {
  border-color: transparent !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded.is-selected::before {
  background-color: ${colors.darker} !important;
  border-color: ${colors.darker} !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded.is-focused::before {
  border-color: ${colors.contrast} !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded + .accordion-pane {
  background-color: ${colors.dark} !important;
}

html[class*="theme-uplift-"] .application-menu.is-personalizable .accordion.panel.inverse > .accordion-header.is-expanded:hover::before {
  border-color: ${colors.darkest} !important;
  background-color: ${colors.darkest} !important;
}

.is-personalizable .personalize-header,
.is-personalizable.tab-container {
  background-color: ${colors.dark} !important;
}

.is-personalizable .personalize-subheader {
  background-color: ${colors.lighter} !important;
}

.is-personalizable .personalize-text {
  color: ${colors.contrast} !important;
}

.is-personalizable .personalize-actionable,
.is-personalizable .personalize-actionable svg {
  color: ${colors.contrast};
  opacity: .8;
}

.is-personalizable .personalize-actionable:hover:not([disabled]),
.is-personalizable .personalize-actionable:hover:not([disabled]) svg {
  color: ${colors.contrast};
  opacity: 1;
}

.is-personalizable .personalize-actionable.is-focused:not(.hide-focus),
.is-personalizable .personalize-actionable:focus:not(.hide-focus) {
  border-color: ${colors.contrast};
  box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2);
}

.is-personalizable .personalize-actionable.hyperlink:focus:not(.hide-focus)::after {
  border-color: ${colors.contrast};
  opacity: 1;
  box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2);
}

.is-personalizable .personalize-vertical-border {
  border-color: ${colors.light};
}

.is-personalizable .personalize-horizontal-bottom-border {
  border-bottom: 1px solid ${colors.darkest};
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

.hero-widget.is-personalizable .hero-header .chart-container .axis path, .chart-container .axis line,
.hero-widget.is-personalizable .hero-header .chart-container .axis .tick0 line {
  stroke: ${colors.subtext} !important;
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
    0 0 0 1px ${colors.subtext},
    0 0 2px 1px ${colors.subtext};
}

.header.is-personalizable .toolbar [class^='btn']:focus:not(.hide-focus),
.header.is-personalizable .flex-toolbar [class^='btn']:focus:not(.hide-focus),
.subheader.is-personalizable .toolbar [class^='btn']:focus:not(.hide-focus),
.subheader.is-personalizable .flex-toolbar [class^='btn']:focus:not(.hide-focus) {
  box-shadow: 0 0 0 2px transparent,
    0 0 0 1px ${colors.subtext},
    0 0 2px 1px ${colors.subtext};
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

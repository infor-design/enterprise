import { colorUtils } from '../../utils/color';

function personalizeStyles(colors) {
  return `

.tab-container.module-tabs.is-personalizable {
  border-top: 1px solid ${colors.darkest} !important;
  border-bottom: 1px solid ${colors.darkest} !important;
}

.module-tabs.is-personalizable .tab:not(:first-child) {
  border-left: 1px solid ${colors.light} !important;
}

.module-tabs.is-personalizable {
  background-color: ${colors.darker} !important;
}

.module-tabs.is-personalizable .tab.is-selected {
  background-color: ${colors.base} !important;
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

.module-tabs.is-personalizable .tab-more {
  border-left: ${colors.light} !important;
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
  background-color: ${colors.hover} !important;
}

.module-tabs.has-toolbar.is-personalizable .tab-list-container + .toolbar {
  border-left: ${colors.light} !important;
}

.module-tabs.is-personalizable [class^="btn"] {
  background-color: ${colors.darker} !important;
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
  border-left: ${colors.light} !important;
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
  background-image: linear-gradient(to right, ${colors.base} , ${colorUtils.hexToRgba(colors.base, 0)}) !important;
}

.is-personalizable .tab-container.header-tabs:not(.alternate)::after,
.is-personalizable.tab-container.header-tabs:not(.alternate)::after {
  background-image: linear-gradient(to right, ${colorUtils.hexToRgba(colors.base, 0)}, ${colors.base}) !important;
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

.application-menu.is-personalizable {
  background-color: ${colors.lighter};
  border-right: ${colors.light};
}

.application-menu.is-personalizable .application-menu-header {
  background-color: ${colors.lighter};
  border-bottom-color: ${colors.light};
}

.application-menu.is-personalizable .application-menu-footer {
  background-color: ${colors.lighter};
  border-top-color: ${colors.light};
}

.application-menu.is-personalizable button .icon,
.application-menu.is-personalizable button span,
.application-menu.is-personalizable .hyperlink {
  color: ${colors.contrast} !important;
}

.application-menu.is-personalizable button:not(:disabled):hover .icon,
.application-menu.is-personalizable button:not(:disabled):hover span,
.application-menu.is-personalizable .hyperlink:hover {
  color: ${colors.contrast};
  opacity: 1;
}

.application-menu.is-personalizable .accordion.panel {
  background-color: ${colors.lighter};
}

.application-menu.is-personalizable .name-xl,
.application-menu.is-personalizable .name,
.application-menu.is-personalizable .accordion-heading {
  color: ${colors.contrast};
}

.application-menu.is-personalizable .accordion.panel .accordion-header {
  background-color: ${colors.lighter} !important;
  border: 1px solid transparent !important;
  color: ${colors.contrast};
}

.application-menu.is-personalizable .accordion.panel .accordion-header .icon {
  color: ${colors.contrast} !important;
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected {
  background-color: ${colors.base} !important;
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected:hover > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected .icon {
  color: ${colors.contrast} !important;
}

.application-menu.is-personalizable .accordion.panel .accordion-header:hover {
  background-color: ${colors.base} !important;
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-focused:not(.hide-focus) {
  border: 1px solid ${colors.contrast} !important;
  box-shadow: none !important;
}

.application-menu.is-personalizable .accordion.panel.inverse .accordion-pane {
  background-color: ${colors.lighter} !important;
}

.application-menu.is-personalizable .accordion.panel.inverse .accordion-pane .accordion-header {
  border: 1px solid ${colors.lighter};
}

.application-menu.is-personalizable .accordion.panel.inverse .accordion-header .icon.plus-minus::before,
.application-menu.is-personalizable .accordion.panel.inverse .accordion-header .icon.plus-minus::after {
  background-color: ${colors.contrast};
}

.application-menu.is-personalizable button:focus:not(.hide-focus),
.application-menu.is-personalizable .hyperlink:focus:not(.hide-focus)::after {
  border-color: ${colors.contrast} !important;
  box-shadow: none !important;
}

.application-menu .application-menu-header button:hover,
.application-menu .application-menu-footer button:hover {
  background-color: ${colors.base} !important;
}

.application-menu.is-personalizable .searchfield-wrapper .searchfield {
  color: ${colors.contrast} !important;
}

.application-menu.is-personalizable .accordion-header.has-filtered-children > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.has-filtered-children.is-focused {
  color: ${colors.contrast} !important;
}

.application-menu.is-personalizable .searchfield-wrapper .searchfield::placeholder {
  color: ${colors.contrast};
  opacity: .8;
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

.is-personalizable .personalize-header,
.is-personalizable.tab-container {
  background-color: ${colors.base} !important;;
}

.is-personalizable .personalize-subheader {
  background-color: ${colors.lighter} !important;;
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
    `;
}

export { personalizeStyles };

function personalizeStyles(colors) {
  return `
.tab-container.module-tabs.is-personalizable {
  border-top: 1px solid ${colors.horizontalBorder} !important;
  border-bottom: 1px solid ${colors.horizontalBorder} !important;
}

.module-tabs.is-personalizable .tab:not(:first-child) {
  border-left: 1px solid ${colors.verticalBorder} !important;
}

.module-tabs.is-personalizable {
  background-color: ${colors.inactive} !important;
}

.module-tabs.is-personalizable .tab.is-selected {
  background-color: ${colors.header} !important;
}

.accordion.panel .accordion-header.is-selected {
  background-color: ${colors.subheader} !important;
  color: ${colors.text} !important;
}

.builder-header.is-personalizable{
  background-color: ${colors.subheader};
}

.header.is-personalizable {
  background-color: ${colors.header};
}

.header.is-personalizable .title {
  color: ${colors.text};
}

.header.is-personalizable h1 {
  color: ${colors.text};
}

.header.is-personalizable button:not(:disabled),
.header.is-personalizable button:not(:disabled) .icon,
.header.is-personalizable button:not(:disabled) .app-header.icon > span {
  color: ${colors.text} !important;
  opacity: .8;
}

.header.is-personalizable .header.is-personalizable button:not(:disabled) .app-header.icon > span {
  background-color: ${colors.text} !important;
  opacity: .8;
}

.header.is-personalizable button:not(:disabled):hover,
.header.is-personalizable button:not(:disabled):hover .icon,
.header.is-personalizable button:not(:disabled):hover .app-header.icon > span,
.header.is-personalizable .toolbar [class^='btn']:hover:not([disabled]) {
  color: ${colors.text} !important;
  opacity: 1;
}

.header.is-personalizable button:not(:disabled) .app-header.icon > span {
  background-color: ${colors.text} !important;
  opacity: 1;
}

.header.is-personalizable .go-button.is-personalizable {
  background-color: ${colors.btnColorHeader};
  border-color:${colors.btnColorHeader};
  color: ${colors.text};
}

.header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab.is-selected:not(.is-disabled) {
  color: ${colors.text} !important;
}

.header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab {
  color: ${colors.text} !important;
  opacity: .8;
}

.header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab:hover:not(.is-disabled) {
  color: ${colors.text} !important;
  opacity: 1;
}

.header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab:hover:not(.is-disabled)::before {
  background-color: ${colors.text};
}

.header.is-personalizable.has-tabs .animated-bar {
  background-color: ${colors.text};
}

.header.is-personalizable.has-tabs .tab-list-container .tab.is-selected:not(.is-disabled):hover::before {
  background-color: ${colors.text} !important;
}

.subheader.is-personalizable .go-button.is-personalizable {
  background-color: ${colors.btnColorSubheader};
  border-color: ${colors.btnColorSubheader};
  color: ${colors.text};
}

.module-tabs.is-personalizable .tab-more {
  border-left: ${colors.verticalBorder} !important;
}

.module-tabs.is-personalizable .tab-more:hover {
  background-color: ${colors.hover} !important;
}

.module-tabs.is-personalizable .tab-more.is-open {
  background-color: ${colors.hover} !important;
}

.module-tabs.is-personalizable .tab-more.is-selected {
  background-color: ${colors.header} !important;
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
  background-color: ${colors.subheader} !important;
}

.builder .sidebar .header {
  border-right: 1px solid ${colors.hover} !important;
}

.module-tabs.is-personalizable .tab:hover {
  background-color: ${colors.hover} !important;
}

.module-tabs.has-toolbar.is-personalizable .tab-list-container + .toolbar {
  border-left: ${colors.verticalBorder} !important;
}

.module-tabs.is-personalizable [class^="btn"] {
  background-color: ${colors.inactive} !important;
  color: ${colors.text} !important;
}

.module-tabs.is-personalizable .tab.is-disabled {
  background-color: ${colors.inactive} !important;
  color: ${colors.text} !important;
}

.module-tabs.is-personalizable .tab.is-disabled > svg {
  fill: ${colors.text} !important;
}

.module-tabs.is-personalizable .add-tab-button {
  border-left: ${colors.verticalBorder} !important;
}

.module-tabs.is-personalizable .add-tab-button:hover {
  background-color: ${colors.inactive} !important;
}

.module-tabs.is-personalizable .toolbar-searchfield-wrapper > .searchfield {
  color: ${colors.text} !important;
}

.module-tabs.is-personalizable .toolbar-searchfield-wrapper > svg {
  fill: ${colors.text} !important;
}

.is-personalizable .tab-container.header-tabs::before {
  background-image: linear-gradient(to right, ${colors.header} , rgba(37, 120, 169, 0));
}

.is-personalizable .tab-container.header-tabs::after {
  background-image: linear-gradient(to right, rgba(37, 120, 169, 0), ${colors.header});
}

.hero-widget.is-personalizable {
  background-color: ${colors.subheader};
}

.hero-widget.is-personalizable .hero-bottom {
  background-color: ${colors.header};
}

.hero-widget.is-personalizable .hero-footer .hero-footer-nav li::before {
  color: ${colors.verticalBorder};
}

.hero-widget.is-personalizable .chart-container .arc {
  stroke: ${colors.subheader};
}

.hero-widget.is-personalizable .chart-container .bar {
  stroke: ${colors.subheader};
}

.hero-widget.is-personalizable .chart-container.line-chart .dot {
  stroke: ${colors.subheader};
}

.application-menu.is-personalizable {
  background-color: ${colors.subheader};
  border-right: ${colors.verticalBorder};
}

.application-menu.is-personalizable .application-menu-header {
  background-color: ${colors.subheader};
  border-bottom-color: ${colors.verticalBorder};
}

.application-menu.is-personalizable .application-menu-footer {
  background-color: ${colors.subheader};
  border-top-color: ${colors.verticalBorder};
}

.application-menu.is-personalizable button .icon,
.application-menu.is-personalizable button span,
.application-menu.is-personalizable .hyperlink {
  color: ${colors.text};
  opacity: 0.8;
}

.application-menu.is-personalizable button:not(:disabled):hover .icon,
.application-menu.is-personalizable button:not(:disabled):hover span,
.application-menu.is-personalizable .hyperlink:hover {
  color: ${colors.text};
  opacity: 1;
}

.application-menu.is-personalizable .accordion.panel {
  background-color: ${colors.header};
}

.application-menu.is-personalizable .name-xl,
.application-menu.is-personalizable .name,
.application-menu.is-personalizable .accordion-heading {
  color: ${colors.text};
}

.application-menu.is-personalizable .accordion.panel .accordion-header {
  background-color: ${colors.header};
  border-bottom-color: transparent;
  color: ${colors.text};
  opacity: .8;
}

.application-menu.is-personalizable .accordion.panel .accordion-header .icon {
  color: ${colors.text} !important;
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected:hover > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.is-selected .icon {
  color: ${colors.text} !important;
}

.application-menu.is-personalizable .accordion.panel .accordion-header:hover {
  opacity: 1;
}

.application-menu.is-personalizable .accordion.panel .accordion-header.is-focused:not(.hide-focus) {
  border-color: ${colors.text};
  opacity: 1;
  box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2);
}

.accordion.panel.inverse .accordion-pane.is-expanded + .accordion-header:not(.is-focused):not(.is-selected), .accordion.panel.inverse .accordion-pane.is-expanded + .accordion-content {
  border-color: ${colors.verticalBorder};
}

.application-menu.is-personalizable button:focus:not(.hide-focus),
.application-menu.is-personalizable .hyperlink:focus:not(.hide-focus)::after {
  border-color: ${colors.text};
  opacity: 1;
  box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2);
}

.application-menu.is-personalizable .application-menu-switcher-panel {
  border-top-color: ${colors.horizontalBorder};
}

.application-menu.is-personalizable .application-menu-switcher-panel .accordion-heading {
  border-top-color: ${colors.horizontalBorder};
}

.application-menu.is-personalizable .searchfield-wrapper {
  background-color: ${colors.header};
  border-bottom: 1px solid ${colors.horizontalBorder};
}

.application-menu.is-personalizable .searchfield-wrapper .searchfield {
  color: ${colors.text} !important;
}

.application-menu.is-personalizable .accordion-header.has-filtered-children > a,
.application-menu.is-personalizable .accordion.panel .accordion-header.has-filtered-children.is-focused {
  color: ${colors.text} !important;
}

.application-menu.is-personalizable .searchfield-wrapper .searchfield::placeholder {
  color: ${colors.text};
  opacity: .8;
}

.application-menu.is-personalizable .searchfield-wrapper .icon {
  color: ${colors.text};
  opacity: .8;
}

.application-menu.is-personalizable .searchfield-wrapper.active .icon {
  color: ${colors.text};
  opacity: 1;
}

.is-personalizable .personalize-header {
  background-color: ${colors.header};
}

.is-personalizable .personalize-subheader {
  background-color: ${colors.subheader};
}

.is-personalizable .personalize-text {
  color: ${colors.text};
}

.is-personalizable .personalize-actionable,
.is-personalizable .personalize-actionable svg {
  color: ${colors.text};
  opacity: .8;
}

.is-personalizable .personalize-actionable:hover:not([disabled]),
.is-personalizable .personalize-actionable:hover:not([disabled]) svg {
  color: ${colors.text};
  opacity: 1;
}

.is-personalizable .personalize-actionable.is-focused:not(.hide-focus),
.is-personalizable .personalize-actionable:focus:not(.hide-focus) {
  border-color: ${colors.text};
  box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2);
}

.is-personalizable .personalize-actionable.hyperlink:focus:not(.hide-focus)::after {
  border-color: ${colors.text};
  opacity: 1;
  box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2);
}

.is-personalizable .personalize-vertical-border {
  border-color: ${colors.verticalBorder};
}

.is-personalizable .personalize-horizontal-bottom-border {
  border-bottom: 1px solid ${colors.horizontalBorder};
}

.is-personalizable .personalize-horizontal-top-border {
  border-top: 1px solid: ${colors.horizontalBorder};
}

.is-personalizable .personalize-chart-targeted {
  background-color: rgba(255, 255, 255, .9);
}

.is-personalizable .personalize-chart-targeted .bar {
  height: 23px !important;
}

.is-personalizable .personalize-chart-targeted .chart-percent-text {
  color: ${colors.text};
}

.is-personalizable .personalize-chart-targeted .completed {
  margin-left: 1px;
  margin-top: -22px;
}

.is-personalizable .personalize-actionable-disabled,
.is-personalizable .personalize-actionable-disabled:hover {
  opacity: .4 !important;
  cursor: default;
}
    `;
}

export { personalizeStyles };

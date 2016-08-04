declare namespace SoHo {
  interface ButtonOptions {
  }

  class Button {
    destroy(): void;
  }

  interface ToastOptions {
    title: string;
    message: string;
    position?: 'top right' | 'top left' | 'bottom left' | 'bottom right';
    audibleOnly?: boolean;
    progressBar?: boolean;
    timeout?: number;
  }

  class Toast {
    show(): void;
  }

  interface ApplicationMenuOptions {
    /** can be 'tablet' (+720), 'desktop' + (1024), or 'large' (+1280); */
    breakpoint?: 'phablet' | 'tablet' | 'desktop' | 'large';

    /** If true, will automatically open the Application Menu when a large screen-width breakpoint is met. */
    openOnLarge?: boolean;

    /** An Array of jQuery-wrapped elements that are able to open/close this nav menu. */
    triggers?: JQuery[];
  }

  class ApplicationMenu {
    openMenu(noFocus?: boolean): void;
    closeMenu(): void;
    modifyTriggers(triggers: JQuery[], remove: boolean, norebuild: boolean): void;
  }

  interface BusyIndicatorOptions {
    /** makes the element that Busy Indicator is invoked on unusable while it's displayed. */
    blockUI?: boolean;

    /** Custom Text To Show or Will Show Localized Loading.... */
    text?: string;

    /** number in miliseconds to pass before the markup is displayed.  If 0, displays immediately. */
    delay?: number;

    /** fires the 'complete' trigger at a certain timing interval.  If 0, goes indefinitely. */
    timeToComplete?: number;

    /** fires the 'close' trigger at a certain timing interval.  If 0, goes indefinitely. */
    timeToClose?: number;
  }

  interface BusyIndicator {
    activate(): void;
    close(): void;
  }

  interface ToolbarOptions {
    /** Will always attempt to right-align the contents of the toolbar. */
    rightAligned?: boolean;

    /** Total amount of buttons that can be present, not including the More button */
    maxVisibleButtons?: number;
  }

  class Toolbar {
  }
}

declare interface JQuery {
  button(option?: SoHo.ButtonOptions): JQuery;
  data(key: 'button'): SoHo.Button;

  toast(options?: SoHo.ToastOptions): JQuery;
  data(key: 'toast'): SoHo.Toast;

  applicationmenu(options?: SoHo.ApplicationMenuOptions): JQuery;
  data(key: 'applicationmenu'): SoHo.ApplicationMenu;

  busyindicator(options?: SoHo.BusyIndicatorOptions): JQuery;
  data(key: 'busyindicator'): SoHo.ApplicationMenu;

  toolbar(options?: SoHo.ToolbarOptions): JQuery;
  data(key: 'toolbar'): SoHo.Toolbar;

  tabs(): JQuery;

  initialize(locale: string): JQuery;
  personalize(): JQuery;
}

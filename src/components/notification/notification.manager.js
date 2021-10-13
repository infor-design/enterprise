function hasNotificationAPI(obj) {
  return obj !== undefined && obj.element instanceof $ && typeof obj.destroy === 'function';
}

function NotificationManager() {
  this.notifications = [];
  return this;
}

NotificationManager.prototype = {
  /**
   * Register notification in manager
   * @param {any} api Notification API
   * @returns {void}
   */
  register(api) {
    if (!hasNotificationAPI(api)) {
      throw new Error('The provided object has no Notification API, and cannot be registered.');
    }

    const hasInstance = this.notifications.filter(thisAPI => $(thisAPI.element).is(api)) > 0;
    if (!hasInstance) {
      this.notifications.push(api);
    }
  },

  /**
   * Unregister notification in manager
   * @param {any} api Notification API
   */
  unregister(api) {
    if (!hasNotificationAPI(api)) {
      throw new Error('The provided object has no Notification API, and cannot be registered.');
    }

    const index = this.notifications.findIndex(thisAPI => $(thisAPI.element).is(api));
    if (index >= 0) {
      this.notifications.splice(index, 1);
    }
  },

  /**
   * Close notification
   * @param {string} id ID of notification
   */
  closeById(id) {
    if (this.notifications.length > 0) {
      const index = this.notifications.findIndex(notification => notification.settings.id === id);
      if (index >= 0) {
        this.close(this.notifications[index]);
        this.notifications.splice(index, 1);
      }
    }
  },

  /**
   * Close the latest notification in the list
   */
  closeLatest() {
    if (this.notifications.length > 0) {
      this.close(this.notifications.pop());
    }
  },

  /**
   * Close all notifications
   */
  closeAll() {
    while (this.notifications.length > 0) {
      this.close(this.notifications.pop());
    }
  },

  /**
   * Close notification API
   * @private
   * @param {any} api Notification api
   */
  close(api) {
    const element = api.element;
    api.close();

    if (element && this.notifications.length > 0) {
      element.data('notification', this.notifications[0]);
    }
  }
};

const notificationManager = new NotificationManager();
export { notificationManager };

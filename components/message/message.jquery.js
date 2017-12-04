import { Message } from './message';


/**
 * jQuery Component Wrapper for Messages
 */
$.fn.message = function(settings) {
  // Support Chaining and Init the Control or Set Settings
  return this.each(function() {
    new Message(this, settings);
  });
};

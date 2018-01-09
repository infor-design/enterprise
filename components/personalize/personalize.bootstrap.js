import { theme, Personalize, COMPONENT_NAME } from './personalize';

/**
 * Setup a single instance of the Personalization system on the HTML tag.
 * Personalization is top-level.
 */
var personalization = new Personalize(document.documentElement, {
  theme: theme
});

export { personalization, COMPONENT_NAME };

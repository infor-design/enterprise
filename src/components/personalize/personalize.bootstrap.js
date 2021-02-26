import { Personalize, COMPONENT_NAME } from './personalize';

// Handle incoming settings from `SohoConfig`
let instanceSettings = {
  theme: 'theme-new-light'
};

if (typeof window.SohoConfig === 'object' && typeof window.SohoConfig.personalize === 'object') {
  instanceSettings = window.SohoConfig.personalize;
}

/**
 * Setup a single instance of the Personalization system on the HTML tag.
 * Personalization is top-level.
 */
const personalization = new Personalize(document.documentElement, instanceSettings);

export { personalization, COMPONENT_NAME };

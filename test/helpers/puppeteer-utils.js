/**
 * Pause page animation
 */
global.pauseAnimations = async () => {
  await page.addStyleTag({
    content: `*,
              *::after,
              *::before {
                transition-delay: 0s !important;
                transition-duration: 0s !important;
                animation-delay: -0.0001s !important;
                animation-duration: 0s !important;
                animation-play-state: paused !important;
                caret-color: transparent !important;
              }`
  });
};

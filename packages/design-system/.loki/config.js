module.exports = {
  configurations: {
    'chrome.laptop': {
      target: 'chrome.docker',
      width: 1366,
      height: 768,
    },
    'chrome.mobile': {
      target: 'chrome.docker',
      width: 375,
      height: 812,
    },
  },
  chromeDockerImage: 'loki/chrome:stable',
  storybookUrl: 'file:./storybook-static',
  storybookStaticBuildDir: './storybook-static',
  diffingEngine: 'resemblejs',
  threshold: 0.1,
  chromeLoadTimeout: 60000,
  chromeNavigationTimeout: 60000,
  chromeSelector: '.sb-show-main',
};

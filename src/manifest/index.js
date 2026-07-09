const pkg = require('../../package.json');

const devMatches = [
  'https://github.com/*',
  'https://gitlab.com/*',
  'https://gitea.com/*',
  'https://try.gitea.io/*',
  'https://try.gogs.io/*',
  '*://gitee.com/*',
];

const prodMatches = ['http://*/*', 'https://*/*'];

let csp = "script-src 'self' 'unsafe-eval'; object-src 'self'";

if (process.env.NODE_ENV === 'production') {
  csp = "script-src 'self'; object-src 'self'";
}

const manifestInput = {
  '__chrome|opera__manifest_version': 3,
  __firefox__manifest_version: 2,
  name: '__MSG_name__',
  short_name: 'Git Master',
  version: pkg.version,
  default_locale: 'en',
  icons: {
    16: 'assets/icons/favicon-16.png',
    32: 'assets/icons/favicon-32.png',
    48: 'assets/icons/favicon-48.png',
    128: 'assets/icons/favicon-128.png',
  },

  description: '__MSG_pluginDesc__',
  homepage_url: 'https://github.com/ineo6/git-master',

  permissions: ['tabs', 'activeTab', 'storage', 'alarms', 'webRequest', 'webNavigation'],
  '__chrome|opera__host_permissions': ['*://*.github.com/*', 'https://api.github.com/*'],
  __firefox__permissions: ['*://*.github.com/*', 'tabs', 'activeTab', 'storage', 'alarms', 'webRequest', 'webNavigation', 'https://api.github.com/*'],

  optional_permissions: ['notifications'],
  '__chrome|opera__optional_host_permissions': ['<all_urls>'],
  __firefox__optional_permissions: ['<all_urls>', 'notifications'],

  '__chrome|opera__web_accessible_resources': [
    {
      resources: ['*.woff2', '*.png', '*.gif', 'inject.js'],
      matches: ['<all_urls>'],
    },
  ],
  __firefox__web_accessible_resources: ['*.woff2', '*.png', '*.gif', 'inject.js'],

  '__chrome|opera__content_security_policy': {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
  __firefox__content_security_policy: csp,

  '__chrome|firefox__author': 'neo',
  __opera__developer: {
    name: 'neo',
  },

  __firefox__applications: {
    gecko: { id: 'arklove@qq.com' },
  },

  __chrome__minimum_chrome_version: '88',
  __opera__minimum_opera_version: '36',

  '__chrome|opera__action': {
    default_popup: 'popup.html',
    default_icon: {
      16: 'assets/icons/favicon-16.png',
      32: 'assets/icons/favicon-32.png',
      48: 'assets/icons/favicon-48.png',
      128: 'assets/icons/favicon-128.png',
    },
    default_title: 'GitMaster',
  },

  __firefox__browser_action: {
    default_popup: 'popup.html',
    default_icon: {
      16: 'assets/icons/favicon-16.png',
      32: 'assets/icons/favicon-32.png',
      48: 'assets/icons/favicon-48.png',
      128: 'assets/icons/favicon-128.png',
    },
    default_title: 'GitMaster',
    browser_style: false,
  },

  '__chrome|opera__options_page': 'options.html',

  options_ui: {
    page: 'options.html',
    open_in_tab: true,
  },

  '__chrome|opera__background': {
    service_worker: 'js/background.bundle.js',
  },

  __firefox__background: {
    scripts: ['js/background.bundle.js'],
  },

  content_scripts: [
    {
      run_at: 'document_start',
      matches: process.env.NODE_ENV === 'production' ? prodMatches : devMatches,
      js: ['js/contentScript.bundle.js'],
      css: ['css/contentScript.css'],
    },
  ],
};

module.exports = manifestInput;

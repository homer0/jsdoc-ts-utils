const packageJson = require('./package.json');

module.exports = {
  source: {
    include: ['./src'],
    includePattern: '.js$'
  },
  plugins: [
    'docdash/nativeTypesPlugin',
    './src',
    'plugins/markdown',
  ],
  templates: {
    cleverLinks: true,
    default: {
      includeDate: false
    }
  },
  opts: {
    recurse: true,
    destination: './docs',
    readme: 'README.md',
    template: 'node_modules/docdash'
  },
  docdash: {
    title: packageJson.name,
    meta: {
      title: `${packageJson.name} docs`,
    },
    sectionOrder: [
      'Classes',
    ],
    collapse: true,
    menu: {
      'GitHub': {
        href: `https://github.com/${packageJson.repository}`,
        target: '_blank',
      },
    },
  },
};

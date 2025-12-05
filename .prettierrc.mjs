import base from '@homer0/prettier-config' with { type: 'json' };

const config = {
  ...base,
  plugins: ['@homer0/prettier-plugin-jsdoc'],
};

export default config;

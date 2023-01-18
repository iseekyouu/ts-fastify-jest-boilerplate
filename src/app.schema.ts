export const configSchema: object = {
  type: 'object',
  required: [
    'HOST',
    'PORT',
    'NODE_ENV',
    'ALLOWED_ORIGINS',
  ],
  properties: {
    HOST: {
      type: 'string',
      default: '0.0.0.0',
    },
    PORT: {
      type: 'string',
      default: 3000,
    },
    NODE_ENV: {
      type: 'string',
      default: 'development',
    },
    ALLOWED_ORIGINS: {
      type: 'string',
      default: 'http://localhost:5001, http://new.mp.dev.local:5001',
    },
  },
};

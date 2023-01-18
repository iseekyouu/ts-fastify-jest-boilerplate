import { buildApp } from '../src/app';

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {};
}

async function build() {
  const app = await buildApp(config());
  await app.ready();

  return app;
}

export {
  config,
  build,
};

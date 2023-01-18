import { AppOptions, buildApp } from './app';

const options: AppOptions = {
  logger: true,
};

const bootstrap = async () => {
  const app = await buildApp(options);

  try {
    const res = await app.listen({
      port: app.config.PORT || 3000,
      host: app.config.HOST,
    });

    app.log.info('Server starterd at', res);

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
void bootstrap();

import { AppOptions, buildApp } from './app';

const options: AppOptions = {
};

const bootstrap = async () => {
  const app = await buildApp(options);

  try {
    const res = await app.listen({
      port: app.config.PORT || 3000,
      host: app.config.HOST,
    });

    console.log('Server starterd at', res);

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
void bootstrap();

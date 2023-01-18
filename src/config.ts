import { envSchema, EnvSchemaData } from 'env-schema';
import { configSchema } from './app.schema';

export type ConfigData = EnvSchemaData;

export function getConfig() {
  const path = __dirname + '/.env';

  return envSchema({
    schema: configSchema,
    dotenv: { path },
  });
}

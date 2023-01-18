import Fastify, {
  FastifyError,
  FastifyInstance,
  FastifyServerOptions,
} from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyHealthcheck from 'fastify-healthcheck';
import fastifyCors from '@fastify/cors';
import metricsPlugin from 'fastify-metrics';
import prom from 'prom-client';
import fastifySwagger from '@fastify/swagger';
import sensible from '@fastify/sensible';
import { configSchema } from './app.schema';

export type AppOptions = Partial<FastifyServerOptions>;
type AppBuilder = (options: AppOptions) => Promise<FastifyInstance>;

interface AppError extends FastifyError {
  statusCode: number,
}

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      HOST: string,
      PORT: number,
      NODE_ENV: string,
      ALLOWED_ORIGINS: string,
    },
  }
}

export const buildApp: AppBuilder = async (options) => {
  const fastify = Fastify(options);

  // schema with env overrider
  await fastify.register(fastifyEnv, {
    dotenv: true,
    schema: configSchema,
    confKey: 'config',
  });

  // extends http statuses
  fastify.register(sensible);

  // prometheus
  prom.register.clear();

  // /metrics endpoint
  fastify.register(metricsPlugin, {
    endpoint: '/metrics',
    defaultMetrics: { enabled: false },
    routeMetrics: {
      enabled: true,
      groupStatusCodes: false,
      routeBlacklist: [
        '/metrics',
      ],
    },
  });

  // cors
  fastify.register(fastifyCors, {
    origin: fastify.config.ALLOWED_ORIGINS.split(', '),
    credentials: true,
  });

  // /health endpoint
  fastify.register(fastifyHealthcheck);

  fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Swagger',
        description: 'Swaggers docs',
        version: '1.0.0',
      },
      host: '127.0.0.1:3000',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });


  fastify.setErrorHandler(async (error: AppError, request, reply) => {
    const { statusCode, message } = error;

    if (statusCode === 400 || error.validation) {
      fastify.log.info(error);
      return reply.status(statusCode || 400).send(message);
    }

    fastify.log.error(error);
    await reply.status(500).send('something went wrong');
  });

  return fastify;
};

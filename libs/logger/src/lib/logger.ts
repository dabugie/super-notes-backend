import * as appInsights from 'applicationinsights';
import pino, { DestinationStream } from 'pino';
import { Options } from 'pino-http';
import { ApplicationInsightsStream } from './applicationInsightsStream';
import { Request } from 'express';

const USE_APP_INSIGHTS = process.env.USE_APPLICATION_INSIGHTS === 'true';
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

let loggerOptions: Options | DestinationStream | [Options, DestinationStream] =
  {
    customProps: () => ({
      context: 'HTTP',
    }),
    customSuccessMessage: () => {
      return 'Request Completed';
    },
    useLevel: 'trace',
    level: LOG_LEVEL,
  };

if (USE_APP_INSIGHTS) {
  console.log('Using Application Insights');
  appInsights
    .setup(process.env.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true)
    .start();

  appInsights.defaultClient.context.tags[
    appInsights.defaultClient.context.keys.cloudRole
  ] = 'Backend API';

  loggerOptions = {
    ...loggerOptions,
    stream: new ApplicationInsightsStream(),
  };
} else {
  console.log('Using Console Logging');
  loggerOptions = {
    ...loggerOptions,
    transport: {
      target: 'pino-pretty',
      options: {
        ignore: 'pid,hostname',
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss.l',
      },
    },
    customProps: (req: Request) => {
      return {
        correlationId: req.headers['x-correlation-id'],
      };
    },
  };
}

export const logger = loggerOptions;
export const pinoLogger = pino(loggerOptions);

export default logger;

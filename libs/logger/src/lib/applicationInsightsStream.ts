import * as appInsights from 'applicationinsights';

export class ApplicationInsightsStream {
  write(msg: string) {
    const log = JSON.parse(msg);
    switch (log.level) {
      case 'debug':
        appInsights.defaultClient.trackTrace({
          message: log.msg,
          severity: appInsights.Contracts.SeverityLevel.Verbose,
          properties: log,
        });
        break;
      case 'info':
        appInsights.defaultClient.trackTrace({
          message: log.msg,
          severity: appInsights.Contracts.SeverityLevel.Information,
          properties: log,
        });
        break;
      case 'warn':
        appInsights.defaultClient.trackTrace({
          message: log.msg,
          severity: appInsights.Contracts.SeverityLevel.Warning,
          properties: log,
        });
        break;
      case 'error':
        appInsights.defaultClient.trackException({
          exception: new Error(log.msg),
          properties: log,
        });
        break;
      default:
        appInsights.defaultClient.trackTrace({
          message: log.msg,
          properties: log,
        });
        break;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { HttpService as AxiosService } from '@nestjs/axios';
import { LoggerService } from '@common/logger/logger.service';
import * as dayjs from 'dayjs';
import duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

@Injectable()
export class HttpService {
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly axiosService: AxiosService,
    private logService: LoggerService
  ) {
    this._onModuleInit();
  }

  private _onModuleInit() {
    // Initialize Axios instance from HttpService
    this.axiosInstance = this.axiosService.axiosRef;

    // Add request and response interceptors
    this.axiosInstance.interceptors.request.use(
      config => {
        config.headers['Request-Start-Time'] = Date.now();
        return config;
      },
      error => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      response => {
        const startTime = response.config.headers['Request-Start-Time'];
        if (startTime) {
          let responseTime = dayjs.duration(Date.now() - startTime || 0);
          this.logService.info(`AXIOS ${response.config.method}-${response.config.url}`, {
            path: response.config.url,
            reqBody: JSON.stringify(response?.config?.data || {}),
            requestHeaders: JSON.stringify(response?.config?.headers || {}),
            resBody: JSON.stringify(response?.data),
            methode: response.config.method,
            query: '',
            responseTime: responseTime.asMilliseconds(),
            responseCode: response.status,
            ip: '',
            userAgent: '',
            requestTime: +startTime,
            context: 'INFO',
            files: ''
          });
        }
        return response;
      },
      error => {
        const startTime = error.config?.headers['Request-Start-Time'];
        if (startTime) {
          let responseTime = dayjs.duration(Date.now() - startTime || 0);
          this.logService.error(`AXIOS ERROR ${error.config.method}-${error.config.url}`, {
            path: error.config.url,
            trace: error.stack,
            reqBody: JSON.stringify(error?.config?.data || {}),
            requestHeaders: JSON.stringify(error?.config?.headers || {}),
            resBody: JSON.stringify(error?.response?.data),
            methode: error.config.method,
            query: '',
            responseTime: responseTime.asMilliseconds(),
            responseCode: error?.response?.status,
            ip: '',
            userAgent: '',
            requestTime: startTime,
            files: '',
            context: 'ERROR'
          });
        }
        return Promise.reject(error);
      }
    );
  }

  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

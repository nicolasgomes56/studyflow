import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';

type ApiErrorPayload = {
  message?: string;
};

type RetryConfig = {
  retries?: number;
  retryDelayMs?: number;
  retryStatusCodes?: number[];
};

type ToastConfig = {
  showErrorToast?: boolean;
  errorTitle?: string;
};

export type ApiRequestConfig = AxiosRequestConfig & {
  meta?: RetryConfig &
    ToastConfig & {
      retryCount?: number;
      toastId?: string;
    };
};

const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 500;
const DEFAULT_RETRY_STATUS_CODES = [408, 425, 429, 500, 502, 503, 504];

class ApiClient {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public get client() {
    return this.instance;
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use((config) => this.applyRequestDefaults(config));
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorPayload>) => this.handleResponseError(error)
    );
  }

  private async handleResponseError(error: AxiosError<ApiErrorPayload>) {
    if (this.shouldRetryRequest(error)) {
      return this.retryRequest(error);
    }

    const requestConfig = error.config as ApiRequestConfig | undefined;
    const shouldShowToast = requestConfig?.meta?.showErrorToast ?? true;
    const title = requestConfig?.meta?.errorTitle ?? 'Erro na requisicao';

    if (shouldShowToast) {
      toast.error(title, {
        id: requestConfig?.meta?.toastId,
        description: this.getErrorMessage(error),
      });
    }

    return Promise.reject(error);
  }

  private applyRequestDefaults(config: InternalAxiosRequestConfig) {
    const requestConfig = config as InternalAxiosRequestConfig & ApiRequestConfig;

    requestConfig.meta = {
      retries: DEFAULT_RETRIES,
      retryDelayMs: DEFAULT_RETRY_DELAY_MS,
      retryStatusCodes: DEFAULT_RETRY_STATUS_CODES,
      showErrorToast: true,
      errorTitle: 'Erro na requisicao',
      ...requestConfig.meta,
    };

    return requestConfig;
  }

  private shouldRetryRequest(error: AxiosError<ApiErrorPayload>) {
    const config = error.config as ApiRequestConfig | undefined;
    const status = error.response?.status;

    if (!config?.meta) return false;
    if (!config.method || config.method.toLowerCase() === 'post') return false;

    const retries = config.meta.retries ?? DEFAULT_RETRIES;
    const retryCount = config.meta.retryCount ?? 0;

    if (retryCount >= retries) return false;
    if (!status) return true;

    const retryStatusCodes = config.meta.retryStatusCodes ?? DEFAULT_RETRY_STATUS_CODES;
    return retryStatusCodes.includes(status);
  }

  private async retryRequest(error: AxiosError<ApiErrorPayload>) {
    const config = error.config as ApiRequestConfig;
    config.meta = config.meta ?? {};
    config.meta.retryCount = (config.meta.retryCount ?? 0) + 1;

    const baseDelay = config.meta.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
    const retryDelay = baseDelay * 2 ** (config.meta.retryCount - 1);

    await this.wait(retryDelay);
    return this.instance(config);
  }

  private getErrorMessage(error: AxiosError<ApiErrorPayload>) {
    return error.response?.data?.message ?? error.message ?? 'Erro inesperado ao comunicar com a API';
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const apiClient = new ApiClient();
export const api = apiClient.client;

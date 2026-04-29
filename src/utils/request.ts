import { api } from '@/lib/axios';
import type { AxiosRequestConfig, Method } from 'axios';

// Interface base para refletir o Result Pattern do C#
export interface ResultPattern<T> {
  result: T;
}

export async function request<TResult, TRequest = unknown>(
  method: Method, // Substituímos o type manual pelo tipo nativo do Axios
  url: string,
  payload?: TRequest, // Renomeado para payload para fazer mais sentido semanticamente
  config?: AxiosRequestConfig,
): Promise<TResult> {
  // Identifica se é um método que aceita corpo na requisição
  const isBodyMethod = ['post', 'put', 'patch'].includes(method.toLowerCase());

  // Desestruturamos diretamente o "data" da resposta do Axios
  const { data } = await api.request<ResultPattern<TResult>>({
    method,
    url,
    data: isBodyMethod ? payload : undefined,
    params: !isBodyMethod ? payload : undefined,
    ...config, // Permite sobrescrever qualquer config caso necessário
  });

  // Retorna o "result" garantindo o padrão, ou faz o fallback seguro se vier fora do padrão
  return data?.result ?? (data as unknown as TResult);
}
import handleError from "./error-handler";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions<T = unknown> {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  authToken?: string;
  body?: T;
  formData?: boolean;
}

const fetcher = async <TResponse = unknown, TRequest = unknown>(
  url: string,
  options: RequestOptions<TRequest> = {}
): Promise<TResponse> => {
  const token = options.authToken;

  const headers: Record<string, string> = {
    ...(options.formData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${apiBaseUrl}${url}`, {
    method: options.method || "GET",
    headers,
    body: options.formData
      ? (options.body as BodyInit)
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });

  const responseBody = await res.json();

  if (!res.ok) {
    handleError(responseBody);
  }

  return responseBody;
};

export const getRequest = <T>(url: string, options?: RequestOptions): Promise<T> =>
  fetcher<T>(url, { method: "GET", ...options });

export const postRequest = <TResponse, TRequest>(
  url: string,
  body: TRequest,
  options?: Omit<RequestOptions<TRequest>, "body" | "method">
): Promise<TResponse> =>
  fetcher<TResponse, TRequest>(url, { method: "POST", body, ...options });

export const putRequest = <TResponse, TRequest>(
  url: string,
  body: TRequest,
  options?: Omit<RequestOptions<TRequest>, "body" | "method">
): Promise<TResponse> =>
  fetcher<TResponse, TRequest>(url, { method: "PUT", body, ...options });

export const deleteRequest = <TRequest>(
  url: string,
  body?: TRequest,
  options?: RequestOptions
): Promise<TRequest> =>
  fetcher<TRequest>(url, { method: "DELETE", body, ...options });

export interface User {
  id: number;
  email: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.code = body.code;
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let body: ApiErrorBody = {
      code: "unknown",
      message: "Something went wrong",
    };
    try {
      body = await response.json();
    } catch {
      // ignore
    }
    throw new ApiError(response.status, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export function register(email: string, password: string): Promise<User> {
  return request<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string): Promise<User> {
  return request<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout(): Promise<void> {
  return request<void>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function me(): Promise<User> {
  return request<User>("/api/auth/me");
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Неверный email или пароль",
  email_taken: "Этот email уже зарегистрирован",
  validation_error: "Неверные данные для входа",
  unauthorized: "Требуется авторизация",
};

export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    return MESSAGES[err.code] ?? err.message;
  }
  return "Что-то пошло не так";
}

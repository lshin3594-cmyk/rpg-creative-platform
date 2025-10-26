import func2url from '../../backend/func2url.json';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HTTPMethod;
  headers?: Record<string, string>;
  body?: any;
}

class APIClient {
  private baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getURL(functionName: keyof typeof func2url): string {
    const url = func2url[functionName];
    if (!url) {
      throw new Error(`Function URL not found: ${functionName}`);
    }
    return url;
  }

  async request<T = any>(
    functionName: keyof typeof func2url,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = this.getURL(functionName);
    const { method = 'POST', headers = {}, body } = options;

    const token = this.getAuthToken();
    const finalHeaders = { ...this.baseHeaders, ...headers };
    
    if (token) {
      finalHeaders['X-Auth-Token'] = token;
    }

    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  get<T = any>(functionName: keyof typeof func2url, headers?: Record<string, string>) {
    return this.request<T>(functionName, { method: 'GET', headers });
  }

  post<T = any>(functionName: keyof typeof func2url, body?: any, headers?: Record<string, string>) {
    return this.request<T>(functionName, { method: 'POST', body, headers });
  }

  put<T = any>(functionName: keyof typeof func2url, body?: any, headers?: Record<string, string>) {
    return this.request<T>(functionName, { method: 'PUT', body, headers });
  }

  delete<T = any>(functionName: keyof typeof func2url, body?: any, headers?: Record<string, string>) {
    return this.request<T>(functionName, { method: 'DELETE', body, headers });
  }
}

export const api = new APIClient();
export default api;
import { useEffect, useState } from 'react';

export function useSSE<T>(url: string, token?: string): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${url}`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event): void => {
      setData(JSON.parse(event.data));
    };

    eventSource.onerror = (err): void => {
      console.warn('SSE connection lost, retrying...', err);
    };

    return (): void => eventSource.close();
  }, [url, token]);

  return data;
}
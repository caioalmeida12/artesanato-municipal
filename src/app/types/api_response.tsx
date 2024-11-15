export type APIResponse<T> = Promise<{ success: false; message: string; } | { success: true; response: T[]; }>
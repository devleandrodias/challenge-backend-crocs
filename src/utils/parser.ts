export function parseObjToString<T>(data: T): string {
  return JSON.stringify(data);
}

export function parseStringToObj<T>(data: string): T {
  return JSON.parse(data) as T;
}

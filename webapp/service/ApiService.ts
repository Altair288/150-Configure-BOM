export default class ApiService {
  public static async get<T>(path: string): Promise<T> {
    const response = await fetch(path, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    return (await response.json()) as T;
  }
}

export class QueryBuilder<T extends Record<string, any>> {
  private params: URLSearchParams;

  constructor(baseQuery?: Partial<T>) {
    this.params = new URLSearchParams();
    if (baseQuery) {
      this.addMultiple(baseQuery);
    }
  }

  public add(key: keyof T, value: T[keyof T]): this {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v: any) =>
          this.params.append(key as string, this.valueToString(v))
        );
      } else {
        this.params.append(key as string, this.valueToString(value));
      }
    }
    return this;
  }

  public addMultiple(queryParams: Partial<T>): this {
    Object.entries(queryParams).forEach(([key, value]) => {
      this.add(key as keyof T, value);
    });
    return this;
  }

  public remove(key: keyof T): this {
    this.params.delete(key as string);
    return this;
  }

  public has(key: keyof T): boolean {
    return this.params.has(key as string);
  }

  public get(key: keyof T): string | null {
    return this.params.get(key as string);
  }

  public getAll(key: keyof T): string[] {
    return this.params.getAll(key as string);
  }

  public toString(): string {
    return this.params.toString();
  }

  public toObject(): Partial<T> {
    const result: Partial<T> = {};
    this.params.forEach((value, key) => {
      if (this.params.getAll(key).length > 1) {
        (result as any)[key] = this.params.getAll(key);
      } else {
        (result as any)[key] = value;
      }
    });
    return result;
  }

  private valueToString(value: any): string {
    if (typeof value === "boolean") {
      return value.toString();
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  }
}

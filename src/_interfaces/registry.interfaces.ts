export interface ISearchOptions<T> {
  uuid?: string;
  where?: Partial<T>;
}

export interface IRegistry<T> {
  insert(value: T): string;
  find(findOptions?: ISearchOptions<T>): T[] | undefined;
  findOne(findOptions?: ISearchOptions<T>): T | undefined;
  findUuid(findOptions?: ISearchOptions<T>): string;
  delete(findOptions: ISearchOptions<T>): boolean;
}

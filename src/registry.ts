import { v4 as generateUuid } from 'uuid';
import { IRegistry, ISearchOptions } from './_interfaces/registry.interfaces';

export class Registry<T> implements IRegistry<T> {
  private readonly _registry: Map<string, T>;

  constructor() {
    this._registry = new Map<string, T>();
  }

  public insert(value: T): string {
    const uuid: string = generateUuid();
    this._registry.set(uuid, value);
    return uuid;
  }

  public find(findOptions?: ISearchOptions<T>): T[] | undefined {
    const matchingEntries: T[] = [];
    if (findOptions === undefined || (findOptions.uuid === undefined && findOptions.where === undefined))
      return Array.from(this._registry.values());
    this._registry.forEach((value: T, key: string) => {
      const uuid: string | undefined = findOptions.uuid;
      if(uuid === undefined) {
        if (this.isMatching(value, findOptions.where))
          matchingEntries.push(value);
        return;
      } else {
        if(key === uuid)
          matchingEntries.push(value);
      }
    });
    return matchingEntries;
  }

  public findOne(findOptions?: ISearchOptions<T>): T | undefined {
    let matchingEntry: T | undefined = undefined;
    if (findOptions === undefined || (findOptions.uuid === undefined && findOptions.where === undefined))
      return this._registry.size >= 1 ? Array.from(this._registry.values())[0] : undefined;
    this._registry.forEach((value: T, key: string) => {
      if(matchingEntry !== undefined)
        return;
      const uuid: string | undefined = findOptions.uuid;
      if(uuid === undefined) {
        if (this.isMatching(value, findOptions.where))
          matchingEntry = value;
        return;
      } else {
        if(key === uuid)
          matchingEntry = value;
      }
    });
    return matchingEntry;
  }

  public findUuid(findOptions: ISearchOptions<T>): string {
    let matchingEntry: string | undefined = 'invalid-uuid';
    if (findOptions.uuid === undefined && findOptions.where === undefined)
      return matchingEntry;
    this._registry.forEach((value: T, key: string) => {
      const uuid: string | undefined = findOptions.uuid;
      if(uuid === undefined) {
        if (this.isMatching(value, findOptions.where))
          matchingEntry = key;
        return;
      } else {
        if(key === uuid)
          matchingEntry = key;
      }
    });
    return matchingEntry;
  }

  public delete(findOptions: ISearchOptions<T>): boolean {
    const entries: T[] | undefined = this.find(findOptions);
    let deletedEntries = 0;
    if (entries === undefined || entries.length === 0)
      return false;
    entries.forEach((value: T) => {
      let uuid: string | undefined = findOptions.uuid;
      if(uuid === undefined)
        uuid = this.findUuid(findOptions)
      this._registry.delete(uuid)
      deletedEntries++;
    });
    return entries.length !== 0 && entries.length === deletedEntries;
  }

  private isMatching(target: any, condition: any): boolean {
    let neededMatchingProps = 0;
    let matchingProps = 0;
    for (const prop in condition) {
      neededMatchingProps++;
      if (target[prop] === condition[prop])
      matchingProps++;
    }
    if (matchingProps === neededMatchingProps)
      return true;
    return false;
  }
}

import { InMemoryRedirectStoreOptions } from './InMemoryRedirectStoreOptions';
import { Redirect } from '../../domain/Redirect';
import { RedirectStore } from '../RedirectStore';
import { RedirectType } from '../../domain/RedirectType';
import * as errors from '../../errors';

class InMemoryRedirectStore implements RedirectStore {
  private redirects: Partial<Record<string, Redirect>>;

  private statistics: Partial<Record<string, number[]>>;

  // eslint-disable-next-line no-empty-pattern
  public constructor ({}: InMemoryRedirectStoreOptions) {
    this.redirects = {};
    this.statistics = {};
  }

  // eslint-disable-next-line class-methods-use-this
  public async initialize (): Promise<void> {
    // Intentionally left blank.
  }

  public async getAll (): Promise<Redirect[]> {
    return Object.values(this.redirects as Record<string, Redirect>);
  }

  public async getByKey ({ key }: {
    key: string;
  }): Promise<Redirect> {
    const redirect = this.redirects[key];

    if (!redirect) {
      throw new errors.RedirectNotFound();
    }

    return redirect;
  }

  public async add ({ key, url, type }: {
    key: string;
    url: string;
    type: RedirectType;
  }): Promise<void> {
    if (this.redirects[key]) {
      throw new errors.RedirectAlreadyExists();
    }

    const redirect = { key, url, type };

    this.redirects[key] = redirect;
  }

  public async edit ({ key, url }: {
    key: string;
    url: string;
  }): Promise<void> {
    if (!this.redirects[key]) {
      throw new errors.RedirectNotFound();
    }

    this.redirects[key]!.url = url;
  }

  public async remove ({ key }: {
    key: string;
  }): Promise<void> {
    if (!this.redirects[key]) {
      throw new errors.RedirectNotFound();
    }

    Reflect.deleteProperty(this.redirects, key);
    Reflect.deleteProperty(this.statistics, key);
  }

  public async record ({ key, timestamp }: {
    key: string;
    timestamp: number;
  }): Promise<void> {
    this.statistics[key] ??= [];
    this.statistics[key]!.push(timestamp);
  }

  public async getStatisticsFor ({ key, from, to }: {
    key: string;
    from: number;
    to: number;
  }): Promise<number[]> {
    if (!this.statistics[key]) {
      return [];
    }

    return this.statistics[key]!.filter(
      (timestamp): boolean => from <= timestamp && timestamp <= to
    );
  }

  public async destroy (): Promise<void> {
    this.redirects = {};
    this.statistics = {};
  }
}

export { InMemoryRedirectStore };

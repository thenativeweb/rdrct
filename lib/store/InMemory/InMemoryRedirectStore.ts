import { InMemoryRedirectStoreOptions } from './InMemoryRedirectStoreOptions';
import { Redirect } from '../../domain/Redirect';
import { RedirectStore } from '../RedirectStore';
import { RedirectType } from '../../domain/RedirectType';
import * as errors from '../../errors';

class InMemoryRedirectStore implements RedirectStore {
  private redirects: Partial<Record<string, Redirect>>;

  // eslint-disable-next-line no-empty-pattern
  public constructor ({}: InMemoryRedirectStoreOptions) {
    this.redirects = {};
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
  }

  public async destroy (): Promise<void> {
    this.redirects = {};
  }
}

export { InMemoryRedirectStore };

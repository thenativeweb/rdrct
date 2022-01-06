import crypto from 'crypto';
import { InMemoryRedirectStoreOptions } from './InMemoryRedirectStoreOptions';
import { Redirect } from '../../domain/Redirect';
import { RedirectStore } from '../RedirectStore';
import { RedirectType } from '../../domain/RedirectType';
import * as errors from '../../errors';

class InMemoryRedirectStore implements RedirectStore {
  private readonly redirects: Partial<Record<string, Redirect>>;

  // eslint-disable-next-line no-empty-pattern
  public constructor ({}: InMemoryRedirectStoreOptions) {
    this.redirects = {
      tnw: { id: crypto.randomUUID(), key: 'tnw', type: 'temporary', url: 'https://www.thenativeweb.io' }
    };
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
  }): Promise<string> {
    if (this.redirects[key]) {
      throw new errors.RedirectAlreadyExists();
    }

    const id = crypto.randomUUID();
    const redirect = { id, key, url, type };

    this.redirects[key] = redirect;

    return id;
  }

  public async remove ({ key }: {
    key: string;
  }): Promise<void> {
    if (!this.redirects[key]) {
      throw new errors.RedirectNotFound();
    }

    Reflect.deleteProperty(this.redirects, key);
  }
}

export { InMemoryRedirectStore };

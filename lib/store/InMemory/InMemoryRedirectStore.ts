import crypto from 'crypto';
import { InMemoryRedirectStoreOptions } from './InMemoryRedirectStoreOptions';
import { Redirect } from '../../domain/Redirect';
import { RedirectStore } from '../RedirectStore';
import * as errors from '../../errors';

class InMemoryRedirectStore implements RedirectStore {
  private readonly redirects: Redirect[];

  // eslint-disable-next-line no-empty-pattern
  public constructor ({}: InMemoryRedirectStoreOptions) {
    this.redirects = [
      { id: crypto.randomUUID(), key: 'tnw', type: 'temporary', url: 'https://www.thenativeweb.io' }
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  public async initialize (): Promise<void> {
    // Intentionally left blank.
  }

  public async getByKey ({ key }: {
    key: string;
  }): Promise<Redirect> {
    const redirect = this.redirects.find(
      (candidate): boolean => candidate.key === key
    );

    if (!redirect) {
      throw new errors.RedirectNotFound();
    }

    return redirect;
  }
}

export { InMemoryRedirectStore };

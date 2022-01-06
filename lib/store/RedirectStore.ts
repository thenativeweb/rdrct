import { Redirect } from '../domain/Redirect';
import { RedirectType } from '../domain/RedirectType';

interface RedirectStore {
  initialize: () => Promise<void>;

  getAll: () => Promise<Redirect[]>;

  getByKey: ({ key }: {
    key: string;
  }) => Promise<Redirect>;

  add: ({ key, url, type }: {
    key: string;
    url: string;
    type: RedirectType;
  }) => Promise<string>;

  remove: ({ key }: {
    key: string;
  }) => Promise<void>;
}

export { RedirectStore };

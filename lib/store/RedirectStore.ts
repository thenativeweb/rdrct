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
  }) => Promise<void>;

  edit: ({ key, url }: {
    key: string;
    url: string;
  }) => Promise<void>;

  remove: ({ key }: {
    key: string;
  }) => Promise<void>;

  record: ({ key, timestamp }: {
    key: string;
    timestamp: number;
  }) => Promise<void>;

  getStatisticsFor: ({ key, from, to }: {
    key: string;
    from: number;
    to: number;
  }) => Promise<number[]>;

  getStatisticsForAll: ({ from, to }: {
    from: number;
    to: number;
  }) => Promise<number[]>;

  destroy: () => Promise<void>;
}

export { RedirectStore };

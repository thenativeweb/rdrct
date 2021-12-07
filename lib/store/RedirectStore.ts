import { Redirect } from '../domain/Redirect';

interface RedirectStore {
  initialize: () => Promise<void>;

  getByKey: ({ key }: {
    key: string;
  }) => Promise<Redirect>;
}

export { RedirectStore };

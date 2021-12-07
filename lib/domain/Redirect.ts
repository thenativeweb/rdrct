import { RedirectType } from './RedirectType';

interface Redirect {
  id: string;
  key: string;
  url: string;
  type: RedirectType;
}

export { Redirect };

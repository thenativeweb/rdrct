import { RedirectType } from './RedirectType';

const getStatusCode = function ({ type }: {
  type: RedirectType;
}): number {
  switch (type) {
    case 'permanent': {
      return 301;
    }
    case 'temporary': {
      return 307;
    }
    default: {
      throw new Error('Invalid redirect type.');
    }
  }
};

export { getStatusCode };

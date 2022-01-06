import { RedirectStore } from '../store/RedirectStore';
import { RequestHandler } from 'express';

const getRedirects = function ({ redirectStore }: {
  redirectStore: RedirectStore;
}): RequestHandler {
  return async function (req, res): Promise<void> {
    const redirects = await redirectStore.getAll();

    res.json(redirects);
  };
};

export { getRedirects };

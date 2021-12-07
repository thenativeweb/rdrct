import { flaschenpost } from 'flaschenpost';
import { getStatusCode } from '../domain/getStatusCode';
import { RedirectStore } from '../store/RedirectStore';
import { RequestHandler } from 'express';

const logger = flaschenpost.getLogger();

const getRedirect = function ({ redirectStore }: {
  redirectStore: RedirectStore;
}): RequestHandler {
  return async function (req, res): Promise<void> {
    const { key } = req.params;
    let redirect;

    try {
      redirect = await redirectStore.getByKey({ key });
    } catch {
      logger.warn('Redirect not found.', { key });

      return res.status(404).end();
    }

    const statusCode = getStatusCode({ type: redirect.type });

    logger.info('Redirecting ...', { redirect });
    res.redirect(statusCode, redirect.url);
  };
};

export { getRedirect };

import { flaschenpost } from 'flaschenpost';
import { getStatusCode } from '../domain/getStatusCode';
import { RedirectStore } from '../store/RedirectStore';
import { RequestHandler } from 'express';
import { JsonSchema, Parser } from 'validate-value';

const logger = flaschenpost.getLogger();

const getRedirect = function ({ redirectStore }: {
  redirectStore: RedirectStore;
}): RequestHandler {
  const schemaRequestParameters: JsonSchema = {
    type: 'object',
    properties: {
      key: { type: 'string', minLength: 1 }
    },
    required: [ 'key' ],
    additionalProperties: false
  };

  const parserRequestParameters = new Parser(schemaRequestParameters);

  return async function (req, res): Promise<void> {
    try {
      parserRequestParameters.parse(req.params).unwrapOrThrow();
    } catch (ex: unknown) {
      logger.warn('Failed to parse request parameters.', { ex });
      res.status(400).json({ message: (ex as Error).message });

      return;
    }

    const { key } = req.params;
    let redirect;

    try {
      redirect = await redirectStore.getByKey({ key });
    } catch {
      logger.warn('Redirect not found.', { key });
      res.status(404).json({});

      return;
    }

    const statusCode = getStatusCode({ type: redirect.type });

    logger.info('Redirecting...', { redirect });
    res.redirect(statusCode, redirect.url);

    const timestamp = Date.now();

    await redirectStore.record({ key, timestamp });
  };
};

export { getRedirect };

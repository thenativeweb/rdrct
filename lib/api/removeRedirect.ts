import { flaschenpost } from 'flaschenpost';
import { RedirectStore } from '../store/RedirectStore';
import { RequestHandler } from 'express';
import { JsonSchema, Parser } from 'validate-value';

const logger = flaschenpost.getLogger();

const removeRedirect = function ({ redirectStore }: {
  redirectStore: RedirectStore;
}): RequestHandler {
  const schemaRequestBody: JsonSchema = {
    type: 'object',
    properties: {
      key: { type: 'string', minLength: 1 }
    },
    required: [ 'key' ],
    additionalProperties: false
  };

  const parserRequestBody = new Parser(schemaRequestBody);

  return async function (req, res): Promise<void> {
    try {
      parserRequestBody.parse(req.body).unwrapOrThrow();
    } catch (ex: unknown) {
      logger.warn('Failed to parse request body.', { ex });
      res.status(400).json({ message: (ex as Error).message });

      return;
    }

    const { key } = req.body;

    try {
      await redirectStore.remove({ key });
    } catch {
      logger.warn('Redirect not found.', { key });
      res.status(404).json({});

      return;
    }

    logger.info('Removed redirect.', { key });
    res.status(200).json({});
  };
};

export { removeRedirect };

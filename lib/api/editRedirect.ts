import { flaschenpost } from 'flaschenpost';
import { RedirectStore } from '../store/RedirectStore';
import { RequestHandler } from 'express';
import { JsonSchema, Parser } from 'validate-value';

const logger = flaschenpost.getLogger();

const editRedirect = function ({ redirectStore }: {
  redirectStore: RedirectStore;
}): RequestHandler {
  const schemaRequestBody: JsonSchema = {
    type: 'object',
    properties: {
      key: { type: 'string', minLength: 1 },
      url: { type: 'string', minLength: 1, format: 'uri' }
    },
    required: [ 'key', 'url' ],
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

    const { key, url } = req.body;

    let id;

    try {
      id = await redirectStore.edit({ key, url });
    } catch {
      logger.warn('Redirect not found.', { key });
      res.status(404).end();

      return;
    }

    logger.info('Edited redirect.', { id, key, url });
    res.status(200).json({ id });
  };
};

export { editRedirect };

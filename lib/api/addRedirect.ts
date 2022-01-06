import { flaschenpost } from 'flaschenpost';
import { RedirectStore } from '../store/RedirectStore';
import { RequestHandler } from 'express';
import { JsonSchema, Parser } from 'validate-value';

const logger = flaschenpost.getLogger();

const addRedirect = function ({ redirectStore }: {
  redirectStore: RedirectStore;
}): RequestHandler {
  const schemaRequestBody: JsonSchema = {
    type: 'object',
    properties: {
      key: { type: 'string', minLength: 1 },
      url: { type: 'string', minLength: 1, format: 'uri' },
      type: { type: 'string', enum: [ 'permanent', 'temporary' ]}
    },
    required: [ 'key', 'url', 'type' ],
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

    const { key, url, type } = req.body;

    let id;

    try {
      id = await redirectStore.add({ key, url, type });
    } catch {
      logger.warn('Redirect already exists.', { key });
      res.status(409).end();

      return;
    }

    logger.info('Added redirect.', { id, key, url, type });
    res.status(200).json({ id });
  };
};

export { addRedirect };

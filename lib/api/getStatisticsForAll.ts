import { flaschenpost } from 'flaschenpost';
import { RedirectStore } from '../store/RedirectStore';
import { RequestHandler } from 'express';
import { JsonSchema, Parser } from 'validate-value';

const logger = flaschenpost.getLogger();

const getStatisticsForAll = function ({ redirectStore }: {
  redirectStore: RedirectStore;
}): RequestHandler {
  const schemaRequestQueryString: JsonSchema = {
    type: 'object',
    properties: {
      from: { type: 'number', minimum: 0 },
      to: { type: 'number', maximum: Number.MAX_SAFE_INTEGER }
    },
    required: [],
    additionalProperties: false
  };

  const parserRequestQueryString = new Parser(schemaRequestQueryString);

  return async function (req, res): Promise<void> {
    let from,
        to;

    try {
      from = Number(req.query.from ?? 0);
      to = Number(req.query.to ?? Number.MAX_SAFE_INTEGER);

      parserRequestQueryString.parse({ from, to }).unwrapOrThrow();
    } catch (ex: unknown) {
      logger.warn('Failed to parse request parameters.', { ex });
      res.status(400).json({ message: (ex as Error).message });

      return;
    }

    const statistics = await redirectStore.getStatisticsForAll({ from, to });

    res.json(statistics);
  };
};

export { getStatisticsForAll };

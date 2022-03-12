import { flaschenpost } from 'flaschenpost';
import { RedirectStore } from '../store/RedirectStore';
import { RequestHandler } from 'express';
import { JsonSchema, Parser } from 'validate-value';

const logger = flaschenpost.getLogger();

const getStatisticsFor = function ({ redirectStore }: {
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

  const schemaRequestQueryString: JsonSchema = {
    type: 'object',
    properties: {
      from: { type: 'number', minimum: 0 },
      to: { type: 'number', maximum: Number.MAX_SAFE_INTEGER }
    },
    required: [],
    additionalProperties: false
  };

  const parserRequestParameters = new Parser(schemaRequestParameters);
  const parserRequestQueryString = new Parser(schemaRequestQueryString);

  return async function (req, res): Promise<void> {
    let from,
        to;

    try {
      parserRequestParameters.parse(req.params).unwrapOrThrow();

      from = Number(req.query.from ?? 0);
      to = Number(req.query.to ?? Number.MAX_SAFE_INTEGER);

      parserRequestQueryString.parse({ from, to }).unwrapOrThrow();
    } catch (ex: unknown) {
      logger.warn('Failed to parse request parameters.', { ex });
      res.status(400).json({ message: (ex as Error).message });

      return;
    }

    const { key } = req.params;
    const statistics = await redirectStore.getStatisticsFor({ key, from, to });

    res.json(statistics);
  };
};

export { getStatisticsFor };

import { flaschenpost } from 'flaschenpost';
import { getApi } from '../api/getApi';
import http from 'http';
import { InMemoryRedirectStore } from '../store/InMemory';
import { processenv } from 'processenv';

const logger = flaschenpost.getLogger();

const redirectStore = new InMemoryRedirectStore({});

const api = getApi({ redirectStore });

const server = http.createServer(api);
const port = processenv('PORT', 3_000);

server.listen(port, (): void => {
  logger.info('Server started.', { port });
});

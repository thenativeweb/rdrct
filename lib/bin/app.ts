import { flaschenpost } from 'flaschenpost';
import { getApi } from '../api/getApi';
import { getConfiguration } from '../configuration/getConfiguration';
import http from 'http';
import { InMemoryRedirectStore } from '../store/InMemory';

const logger = flaschenpost.getLogger();
const configuration = getConfiguration();

const redirectStore = new InMemoryRedirectStore({});

const api = getApi({ configuration, redirectStore });
const server = http.createServer(api);

server.listen(configuration.api.port, (): void => {
  logger.info('Server started.', { port: configuration.api.port });
});

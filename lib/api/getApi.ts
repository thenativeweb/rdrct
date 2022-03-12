import { addRedirect } from './addRedirect';
import basicAuth from 'express-basic-auth';
import { Configuration } from '../configuration/Configuration';
import cors from 'cors';
import { editRedirect } from './editRedirect';
import { getRedirect } from './getRedirect';
import { getRedirects } from './getRedirects';
import { getStatisticsFor } from './getStatisticsFor';
import { getStatisticsForAll } from './getStatisticsForAll';
import { RedirectStore } from '../store/RedirectStore';
import { removeRedirect } from './removeRedirect';
import express, { Application } from 'express';

const getApi = function ({ configuration, redirectStore }: {
  configuration: Configuration;
  redirectStore: RedirectStore;
}): Application {
  const api = express();

  api.get('/:key', getRedirect({ redirectStore }));

  api.use(cors());
  api.use(basicAuth({
    users: {
      [configuration.api.credentials.username]:
        configuration.api.credentials.password
    }
  }));
  api.use(express.json());

  api.post('/api/add-redirect', addRedirect({ redirectStore }));
  api.post('/api/edit-redirect', editRedirect({ redirectStore }));
  api.post('/api/remove-redirect', removeRedirect({ redirectStore }));
  api.get('/api/redirects', getRedirects({ redirectStore }));
  api.get('/api/statistics', getStatisticsForAll({ redirectStore }));
  api.get('/api/statistics/:key', getStatisticsFor({ redirectStore }));

  return api;
};

export { getApi };

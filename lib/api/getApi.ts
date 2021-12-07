import cors from 'cors';
import { getRedirect } from './getRedirect';
import { RedirectStore } from '../store/RedirectStore';
import express, { Application } from 'express';

const getApi = function ({ redirectStore }: {
  redirectStore: RedirectStore;
}): Application {
  const api = express();

  api.use(cors());
  api.get('/:key', getRedirect({ redirectStore }));

  return api;
};

export { getApi };

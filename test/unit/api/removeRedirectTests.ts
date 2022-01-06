import { assert } from 'assertthat';
import { Configuration } from '../../../lib/configuration/Configuration';
import { CustomError } from 'defekt';
import { getApi } from '../../../lib/api/getApi';
import { InMemoryRedirectStore } from '../../../lib/store/InMemory/InMemoryRedirectStore';
import { RedirectStore } from '../../../lib/store/RedirectStore';
import supertest from 'supertest';
import * as errors from '../../../lib/errors';

suite('removeRedirect', (): void => {
  let configuration: Configuration;
  let redirectStore: RedirectStore;

  setup(async (): Promise<void> => {
    configuration = {
      api: {
        port: 3_000,
        credentials: { username: 'jane.doe', password: 'secret' }
      }
    };

    redirectStore = new InMemoryRedirectStore({});
    await redirectStore.initialize();
  });

  test('removes the given redirect.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    await supertest(api).
      post('/api/add-redirect').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      ).
      set('content-type', 'application/json').
      send({
        key: 'tnw',
        url: 'https://www.thenativeweb.io',
        type: 'temporary'
      });

    const { statusCode } = await supertest(api).
      post('/api/remove-redirect').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      ).
      set('content-type', 'application/json').
      send({ key: 'tnw' });

    assert.that(statusCode).is.equalTo(200);

    await assert.that(async (): Promise<void> => {
      await redirectStore.getByKey({ key: 'tnw' });
    }).is.throwingAsync<CustomError>((ex): boolean => ex.code === errors.RedirectNotFound.code);
  });

  test('requires authorization.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode } = await supertest(api).
      post('/api/remove-redirect').
      set('content-type', 'application/json').
      send({ key: 'tnw' });

    assert.that(statusCode).is.equalTo(401);
  });

  test('returns a 404 if a redirect with the given key could not be found.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode } = await supertest(api).
      post('/api/remove-redirect').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      ).
      set('content-type', 'application/json').
      send({ key: 'tnw' });

    assert.that(statusCode).is.equalTo(404);
  });
});

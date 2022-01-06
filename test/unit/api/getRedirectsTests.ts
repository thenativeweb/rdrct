import { assert } from 'assertthat';
import { Configuration } from '../../../lib/configuration/Configuration';
import { getApi } from '../../../lib/api/getApi';
import { InMemoryRedirectStore } from '../../../lib/store/InMemory/InMemoryRedirectStore';
import { RedirectStore } from '../../../lib/store/RedirectStore';
import supertest from 'supertest';

suite('getRedirects', (): void => {
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

  test('returns a list of redirects.', async (): Promise<void> => {
    await redirectStore.add({
      key: 'tnw',
      url: 'https://www.thenativeweb.io',
      type: 'temporary'
    });

    const api = getApi({ configuration, redirectStore });

    const { statusCode, body } = await supertest(api).
      get('/api/redirects').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      );

    assert.that(statusCode).is.equalTo(200);
    assert.that(body).is.equalTo([
      { key: 'tnw', url: 'https://www.thenativeweb.io', type: 'temporary' }
    ]);
  });

  test('returns an empty list if no redirects have been added.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode, body } = await supertest(api).
      get('/api/redirects').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      );

    assert.that(statusCode).is.equalTo(200);
    assert.that(body).is.equalTo([]);
  });

  test('requires authorization.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode } = await supertest(api).
      get('/api/redirects');

    assert.that(statusCode).is.equalTo(401);
  });
});

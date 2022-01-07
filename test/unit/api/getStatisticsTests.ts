import { assert } from 'assertthat';
import { Configuration } from '../../../lib/configuration/Configuration';
import { getApi } from '../../../lib/api/getApi';
import { InMemoryRedirectStore } from '../../../lib/store/InMemory/InMemoryRedirectStore';
import { RedirectStore } from '../../../lib/store/RedirectStore';
import { setTimeout } from 'timers/promises';
import supertest from 'supertest';

suite('getStatistics', (): void => {
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

  test('returns a list of timestamps for the desired redirect.', async (): Promise<void> => {
    await redirectStore.add({
      key: 'tnw',
      url: 'https://www.thenativeweb.io',
      type: 'temporary'
    });

    const api = getApi({ configuration, redirectStore });

    await supertest(api).get('/tnw');
    await supertest(api).get('/tnw');
    await supertest(api).get('/tnw');

    const { statusCode, body } = await supertest(api).
      get('/api/statistics/tnw').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      );

    assert.that(statusCode).is.equalTo(200);
    assert.that(body.length).is.equalTo(3);
  });

  test('returns an empty list if no redirects have taken place.', async (): Promise<void> => {
    await redirectStore.add({
      key: 'tnw',
      url: 'https://www.thenativeweb.io',
      type: 'temporary'
    });

    const api = getApi({ configuration, redirectStore });

    const { statusCode, body } = await supertest(api).
      get('/api/statistics/tnw').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      );

    assert.that(statusCode).is.equalTo(200);
    assert.that(body).is.equalTo([]);
  });

  test('returns a list of timestamps for the desired redirect in the given time frame.', async (): Promise<void> => {
    await redirectStore.add({
      key: 'tnw',
      url: 'https://www.thenativeweb.io',
      type: 'temporary'
    });

    const api = getApi({ configuration, redirectStore });

    await supertest(api).get('/tnw');

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    await setTimeout(100);
    await supertest(api).get('/tnw');

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    await setTimeout(100);
    await supertest(api).get('/tnw');

    const { statusCode, body } = await supertest(api).
      get('/api/statistics/tnw').
      query({
        from: Date.now() - 50,
        to: Date.now() + 50
      }).
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      );

    assert.that(statusCode).is.equalTo(200);
    assert.that(body.length).is.equalTo(1);
  });

  test('requires authorization.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode } = await supertest(api).
      get('/api/statistics/tnw');

    assert.that(statusCode).is.equalTo(401);
  });
});

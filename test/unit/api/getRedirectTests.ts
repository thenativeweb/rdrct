import { assert } from 'assertthat';
import { Configuration } from '../../../lib/configuration/Configuration';
import { getApi } from '../../../lib/api/getApi';
import { InMemoryRedirectStore } from '../../../lib/store/InMemory/InMemoryRedirectStore';
import { RedirectStore } from '../../../lib/store/RedirectStore';
import supertest from 'supertest';

suite('getRedirect', (): void => {
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

  test('redirects to the configured url.', async (): Promise<void> => {
    await redirectStore.add({
      key: 'tnw',
      url: 'https://www.thenativeweb.io',
      type: 'temporary'
    });

    const api = getApi({ configuration, redirectStore });

    const { statusCode, header } = await supertest(api).
      get('/tnw');

    assert.that(statusCode).is.equalTo(307);
    assert.that(header.location).is.not.undefined();
    assert.that(header.location).is.equalTo('https://www.thenativeweb.io');
  });

  test('returns a 404 if the requested redirect could not be found.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode } = await supertest(api).
      get('/tnw');

    assert.that(statusCode).is.equalTo(404);
  });
});

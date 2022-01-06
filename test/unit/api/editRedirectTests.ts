import { assert } from 'assertthat';
import { Configuration } from '../../../lib/configuration/Configuration';
import { getApi } from '../../../lib/api/getApi';
import { InMemoryRedirectStore } from '../../../lib/store/InMemory/InMemoryRedirectStore';
import { RedirectStore } from '../../../lib/store/RedirectStore';
import supertest from 'supertest';

suite('editRedirect', (): void => {
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

  test('edits the given redirect.', async (): Promise<void> => {
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
        url: 'https://www.tnw.io',
        type: 'temporary'
      });

    const { statusCode } = await supertest(api).
      post('/api/edit-redirect').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      ).
      set('content-type', 'application/json').
      send({
        key: 'tnw',
        url: 'https://www.thenativeweb.io'
      });

    assert.that(statusCode).is.equalTo(200);

    const redirect = await redirectStore.getByKey({ key: 'tnw' });

    assert.that(redirect.url).is.equalTo('https://www.thenativeweb.io');
  });

  test('requires authorization.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode } = await supertest(api).
      post('/api/edit-redirect').
      set('content-type', 'application/json').
      send({
        key: 'tnw',
        url: 'https://www.thenativeweb.io'
      });

    assert.that(statusCode).is.equalTo(401);
  });

  test('returns a 404 if a redirect with the given key could not be found.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode } = await supertest(api).
      post('/api/edit-redirect').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      ).
      set('content-type', 'application/json').
      send({
        key: 'tnw',
        url: 'https://www.thenativeweb.io'
      });

    assert.that(statusCode).is.equalTo(404);
  });

  test('returns a 400 if the url is not absolute.', async (): Promise<void> => {
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

    const { statusCode, body } = await supertest(api).
      post('/api/edit-redirect').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      ).
      set('content-type', 'application/json').
      send({
        key: 'tnw',
        url: 'www.thenativeweb.io'
      });

    assert.that(statusCode).is.equalTo(400);
    assert.that(body).is.equalTo({
      message: 'Value does not satisfy format: uri (at value.url).'
    });
  });
});

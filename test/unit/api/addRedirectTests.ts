import { assert } from 'assertthat';
import { Configuration } from '../../../lib/configuration/Configuration';
import { getApi } from '../../../lib/api/getApi';
import { InMemoryRedirectStore } from '../../../lib/store/InMemory/InMemoryRedirectStore';
import { RedirectStore } from '../../../lib/store/RedirectStore';
import supertest from 'supertest';

suite('addRedirect', (): void => {
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

  test('adds the given redirect.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode } = await supertest(api).
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

    assert.that(statusCode).is.equalTo(200);

    await assert.that(async (): Promise<void> => {
      await redirectStore.getByKey({ key: 'tnw' });
    }).is.not.throwingAsync();
  });

  test('requires authorization.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode } = await supertest(api).
      post('/api/add-redirect').
      set('content-type', 'application/json').
      send({
        key: 'tnw',
        url: 'https://www.thenativeweb.io',
        type: 'temporary'
      });

    assert.that(statusCode).is.equalTo(401);
  });

  test('returns a 409 if a redirect with the given key already exists.', async (): Promise<void> => {
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

    assert.that(statusCode).is.equalTo(409);
  });

  test('returns a 400 if the url is not absolute.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode, body } = await supertest(api).
      post('/api/add-redirect').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      ).
      set('content-type', 'application/json').
      send({
        key: 'tnw',
        url: 'www.thenativeweb.io',
        type: 'temporary'
      });

    assert.that(statusCode).is.equalTo(400);
    assert.that(body).is.equalTo({
      message: 'Value does not satisfy format: uri (at value.url).'
    });
  });

  test('returns a 400 if the type is invalid.', async (): Promise<void> => {
    const api = getApi({ configuration, redirectStore });

    const { statusCode, body } = await supertest(api).
      post('/api/add-redirect').
      auth(
        configuration.api.credentials.username,
        configuration.api.credentials.password
      ).
      set('content-type', 'application/json').
      send({
        key: 'tnw',
        url: 'https://www.thenativeweb.io',
        type: 'invalid-type'
      });

    assert.that(statusCode).is.equalTo(400);
    assert.that(body).is.equalTo({
      message: 'No enum match (invalid-type), expects: permanent, temporary (at value.type).'
    });
  });
});

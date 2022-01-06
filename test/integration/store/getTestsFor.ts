import { assert } from 'assertthat';
import { CustomError } from 'defekt';
import { RedirectStore } from '../../../lib/store/RedirectStore';
import * as errors from '../../../lib/errors';

const getTestsFor = function ({ createRedirectStore }: {
  createRedirectStore: () => Promise<RedirectStore>;
}): void {
  let redirectStore: RedirectStore;

  // eslint-disable-next-line mocha/no-top-level-hooks
  setup(async (): Promise<void> => {
    redirectStore = await createRedirectStore();
  });

  // eslint-disable-next-line mocha/no-top-level-hooks
  teardown(async (): Promise<void> => {
    await redirectStore.destroy();
  });

  suite('add', (): void => {
    test('adds a new redirect.', async (): Promise<void> => {
      await redirectStore.add({
        key: 'tnw',
        url: 'https://www.thenativeweb.io',
        type: 'temporary'
      });

      const redirect = await redirectStore.getByKey({ key: 'tnw' });

      assert.that(redirect.url).is.equalTo('https://www.thenativeweb.io');
    });

    test('throws if a redirect with the given key already exists.', async (): Promise<void> => {
      await redirectStore.add({
        key: 'tnw',
        url: 'https://www.thenativeweb.io',
        type: 'temporary'
      });

      await assert.that(async (): Promise<void> => {
        await redirectStore.add({
          key: 'tnw',
          url: 'https://www.thenativeweb.io',
          type: 'temporary'
        });
      }).is.throwingAsync<CustomError>((ex): boolean => ex.code === errors.RedirectAlreadyExists.code);
    });
  });

  suite('edit', (): void => {
    test('throws if a redirect with the given key does not exist.', async (): Promise<void> => {
      await assert.that(async (): Promise<void> => {
        await redirectStore.edit({
          key: 'tnw',
          url: 'https://www.thenativeweb.io'
        });
      }).is.throwingAsync<CustomError>((ex): boolean => ex.code === errors.RedirectNotFound.code);
    });

    test('changes the url of the redirect to the given one.', async (): Promise<void> => {
      await redirectStore.add({
        key: 'tnw',
        url: 'https://www.tnw.io',
        type: 'temporary'
      });

      await redirectStore.edit({
        key: 'tnw',
        url: 'https://www.thenativeweb.io'
      });

      const redirect = await redirectStore.getByKey({ key: 'tnw' });

      assert.that(redirect.url).is.equalTo('https://www.thenativeweb.io');
    });
  });

  suite('remove', (): void => {
    test('throws if a redirect with the given key does not exist.', async (): Promise<void> => {
      await assert.that(async (): Promise<void> => {
        await redirectStore.remove({ key: 'tnw' });
      }).is.throwingAsync<CustomError>((ex): boolean => ex.code === errors.RedirectNotFound.code);
    });

    test('removes the given redirect.', async (): Promise<void> => {
      await redirectStore.add({
        key: 'tnw',
        url: 'https://www.tnw.io',
        type: 'temporary'
      });

      await redirectStore.remove({ key: 'tnw' });

      await assert.that(async (): Promise<void> => {
        await redirectStore.getByKey({ key: 'tnw' });
      }).is.throwingAsync<CustomError>((ex): boolean => ex.code === errors.RedirectNotFound.code);
    });
  });

  suite('getByKey', (): void => {
    test('throws if a redirect with the given key does not exist.', async (): Promise<void> => {
      await assert.that(async (): Promise<void> => {
        await redirectStore.getByKey({ key: 'tnw' });
      }).is.throwingAsync<CustomError>((ex): boolean => ex.code === errors.RedirectNotFound.code);
    });

    test('returns the requested redirect.', async (): Promise<void> => {
      await redirectStore.add({
        key: 'tnw',
        url: 'https://www.thenativeweb.io',
        type: 'temporary'
      });

      const redirect = await redirectStore.getByKey({ key: 'tnw' });

      assert.that(redirect.url).is.equalTo('https://www.thenativeweb.io');
    });
  });

  suite('getAll', (): void => {
    test('returns an empty list for an empty store.', async (): Promise<void> => {
      const redirects = await redirectStore.getAll();

      assert.that(redirects).is.equalTo([]);
    });

    test('returns a list of all redirects.', async (): Promise<void> => {
      await redirectStore.add({
        key: 'tnw',
        url: 'https://www.thenativeweb.io',
        type: 'temporary'
      });

      const redirects = await redirectStore.getAll();

      assert.that(redirects).is.equalTo([
        { key: 'tnw', url: 'https://www.thenativeweb.io', type: 'temporary' }
      ]);
    });
  });
};

// eslint-disable-next-line mocha/no-exports
export { getTestsFor };

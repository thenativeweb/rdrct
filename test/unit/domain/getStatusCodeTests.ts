import { assert } from 'assertthat';
import { getStatusCode } from '../../../lib/domain/getStatusCode';

suite('getStatusCode', (): void => {
  test('returns 301 for permanent redirects.', async (): Promise<void> => {
    const statusCode = getStatusCode({ type: 'permanent' });

    assert.that(statusCode).is.equalTo(301);
  });

  test('returns 307 for temporary redirects.', async (): Promise<void> => {
    const statusCode = getStatusCode({ type: 'temporary' });

    assert.that(statusCode).is.equalTo(307);
  });
});

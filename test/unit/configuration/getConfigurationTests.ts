import { assert } from 'assertthat';
import { getConfiguration } from '../../../lib/configuration/getConfiguration';
import { nodeenv } from 'nodeenv';

suite('getConfiguration', (): void => {
  test('returns 3000 as default port.', async (): Promise<void> => {
    const restore = nodeenv({
      /* eslint-disable @typescript-eslint/naming-convention */
      API_USERNAME: 'jane.doe',
      API_PASSWORD: 'secret'
      /* eslint-enable @typescript-eslint/naming-convention */
    });

    const configuration = getConfiguration();

    assert.that(configuration.api.port).is.equalTo(3_000);
    restore();
  });
});

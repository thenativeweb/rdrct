import { getTestsFor } from './getTestsFor';
import { InMemoryRedirectStore } from '../../../lib/store/InMemory/InMemoryRedirectStore';
import { RedirectStore } from '../../../lib/store/RedirectStore';

suite('InMemory', (): void => {
  getTestsFor({
    async createRedirectStore (): Promise<RedirectStore> {
      const redirectStore = new InMemoryRedirectStore({});

      await redirectStore.initialize();

      return redirectStore;
    }
  });
});

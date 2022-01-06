import { Configuration } from './Configuration';
import { processenv } from 'processenv';
import * as errors from '../errors';

const getConfiguration = function (): Configuration {
  const port = processenv('API_PORT', 3_000) as number;
  const username = processenv('API_USERNAME') as string;
  const password = processenv('API_PASSWORD') as string;

  if (!username) {
    throw new errors.UsernameNotSet();
  }
  if (!password) {
    throw new errors.PasswordNotSet();
  }

  const configuration = {
    api: {
      port,
      credentials: {
        username,
        password
      }
    }
  };

  return configuration;
};

export { getConfiguration };

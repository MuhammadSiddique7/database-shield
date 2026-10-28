import { ShieldClient } from './client/ShieldClient';
import { ShieldOptions } from './types';

let instance: ShieldClient | null = null;

export const initialize = (options: ShieldOptions): ShieldClient => {
  if (!instance) {
    instance = new ShieldClient(options);
  }
  return instance;
};

export const getClient = (): ShieldClient => {
  if (!instance) {
    throw new Error('Database Shield SDK is not initialized. Call initialize() first.');
  }
  return instance;
};

// Export middleware directly for convenience
export const middleware = () => {
  return getClient().middleware();
};

export * from './types';
export { ShieldClient };
export { PostgresWrapper } from './database/PostgresWrapper';
export { MySQLWrapper } from './database/MySQLWrapper';
export { MongoWrapper } from './database/MongoWrapper';
export { SQLiteWrapper } from './database/SQLiteWrapper';

const Shield = {
  initialize,
  getClient,
  middleware,
};

export default Shield;

import { ShieldClient } from '../client/ShieldClient';

export class PostgresWrapper {
  private client: any;
  private shield: ShieldClient;

  constructor(pgClient: any, shield: ShieldClient) {
    this.client = pgClient;
    this.shield = shield;
  }

  // Intercept the query method
  public async query(text: string | any, values?: any[]): Promise<any> {
    const queryString = typeof text === 'string' ? text : text.text;
    
    // Analyze with Shield
    await this.shield.analyzeQuery(queryString, 'PostgreSQL');
    
    // Execute original query if shield allows
    return this.client.query(text, values);
  }

  // Pass through other methods
  public async connect(): Promise<void> {
    if (this.client.connect) {
      return this.client.connect();
    }
  }

  public async end(): Promise<void> {
    if (this.client.end) {
      return this.client.end();
    }
  }
}

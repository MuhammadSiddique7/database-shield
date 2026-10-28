import { ShieldClient } from '../client/ShieldClient';

export class MySQLWrapper {
  private connection: any;
  private shield: ShieldClient;

  constructor(mysqlConnection: any, shield: ShieldClient) {
    this.connection = mysqlConnection;
    this.shield = shield;
  }

  // Intercept the query method
  public query(sql: string | any, values?: any, cb?: any): any {
    const queryString = typeof sql === 'string' ? sql : sql.sql;
    
    // Determine callback position
    let callback = cb;
    if (typeof values === 'function') {
      callback = values;
    }

    // Wrap in promise for async interception
    this.shield.analyzeQuery(queryString, 'MySQL').then(() => {
      // Execute original query
      if (typeof values === 'function') {
         this.connection.query(sql, callback);
      } else {
         this.connection.query(sql, values, callback);
      }
    }).catch((err) => {
      if (callback) {
        callback(err, null, null);
      } else {
        throw err;
      }
    });
  }

  public end(callback?: any): void {
    if (this.connection.end) {
      this.connection.end(callback);
    }
  }
}

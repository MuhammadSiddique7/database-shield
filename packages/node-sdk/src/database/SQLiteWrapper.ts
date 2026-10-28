import { ShieldClient } from '../client/ShieldClient';

export class SQLiteWrapper {
  private db: any;
  private shield: ShieldClient;

  constructor(sqliteDb: any, shield: ShieldClient) {
    this.db = sqliteDb;
    this.shield = shield;
  }

  public all(sql: string, params: any, callback?: any): this {
    let cb = callback;
    let p = params;
    if (typeof params === 'function') {
      cb = params;
      p = [];
    }

    this.shield.analyzeQuery(sql, 'SQLite').then(() => {
      this.db.all(sql, p, cb);
    }).catch((err) => {
      if (cb) cb(err);
      else throw err;
    });

    return this;
  }
  
  public run(sql: string, params: any, callback?: any): this {
    let cb = callback;
    let p = params;
    if (typeof params === 'function') {
      cb = params;
      p = [];
    }

    this.shield.analyzeQuery(sql, 'SQLite').then(() => {
      this.db.run(sql, p, cb);
    }).catch((err) => {
      if (cb) cb(err);
      else throw err;
    });

    return this;
  }

  public close(callback?: any) {
    this.db.close(callback);
  }
}

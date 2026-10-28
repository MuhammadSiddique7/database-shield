import { ShieldClient } from '../client/ShieldClient';

export class MongoWrapper {
  private collection: any;
  private shield: ShieldClient;

  constructor(mongoCollection: any, shield: ShieldClient) {
    this.collection = mongoCollection;
    this.shield = shield;
  }

  public async find(query: any, options?: any): Promise<any> {
    const queryString = JSON.stringify(query);
    await this.shield.analyzeQuery(queryString, 'MongoDB');
    return this.collection.find(query, options);
  }

  public async insertOne(doc: any, options?: any): Promise<any> {
    const queryString = JSON.stringify(doc);
    await this.shield.analyzeQuery(queryString, 'MongoDB');
    return this.collection.insertOne(doc, options);
  }

  public async updateOne(filter: any, update: any, options?: any): Promise<any> {
    const queryString = JSON.stringify({ filter, update });
    await this.shield.analyzeQuery(queryString, 'MongoDB');
    return this.collection.updateOne(filter, update, options);
  }

  // Additional methods can be proxied similarly...
}

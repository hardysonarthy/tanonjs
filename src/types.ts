interface BaseNode {
  type: string;
  description?: string;
  outputParams?: Record<string, unknown>;
  allowFail: false;
}

interface MongoConfig {
  connectionString?: string;
}

interface ApiNode extends BaseNode {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: Record<string, string>;
  params?: Record<string, string>;
}

interface MongoNode extends BaseNode {
  config?: MongoConfig;
  collectionName: string;
  find: Record<string, unknown>;
  findOne: Record<string, unknown>;
  project?: Record<string, unknown>;
  aggregation?: Record<string, unknown>[];
}

interface Pipeline {
  env: Record<string, unknown>;
  config: Config;
  description?: string;
  sequence: (ApiNode | MongoNode)[];
}

interface Config {
  debugMode: false;
  output: 'none' | 'json' | 'yaml' | undefined;
  defaults?: {
    mongo?: MongoConfig;
  };
}

export type { BaseNode, ApiNode, MongoNode, Pipeline };

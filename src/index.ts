import axios, { isAxiosError } from 'axios';
import { NODE_TYPES } from './constants';
import type { ApiNode, MongoNode, Pipeline } from './types';
import replacer from './util/replacer';

async function main() {
  const jsonFlagIndex = process.argv.findIndex((key) => key === '-json');
  let jsonSrc: string | undefined;

  if (jsonFlagIndex > 0) {
    const jsonPathIndex = jsonFlagIndex + 1;
    jsonSrc = process.argv.at(jsonPathIndex);
    if (jsonPathIndex < 2 && !jsonSrc) {
      throw Error('Please provide a valid file path.');
    }
    if (!jsonSrc) {
      jsonSrc = '../pipeline.json';
    }
  }

  const json: Pipeline = require(jsonSrc ?? '../pipeline.json');
  if (json.description) {
    console.info(json.description);
  }
  let artifacts: Record<string, unknown> = {
    ...json.env,
  };

  for await (const node of json.sequence) {
    switch (node.type) {
      case NODE_TYPES.API:
        {
          const apiNode = node as ApiNode;
          console.log(`Calling ${apiNode.method} ${apiNode.url}`);
          try {
            const response: Response = await axios({
              url: replacer(artifacts, apiNode.url),
              method: apiNode.method,
              data: apiNode.body,
              params: apiNode.params,
            });
            console.log(response.status);
            console.table(response.headers);
            console.log('body');
            console.table(response.body);

            const tempResponse: Record<string, unknown> = {
              status: response.status,
              headers: response.headers,
              body: response.body,
            };

            if (node.outputParams) {
              for (const [key, value] of Object.entries(node.outputParams)) {
                if (value === 1 || value === true) {
                  artifacts[key] = tempResponse[key];
                }
              }
              continue;
            }

            artifacts = {
              ...artifacts,
              ...tempResponse,
            };
          } catch (error) {
            if (isAxiosError(error)) {
              console.error(error.config?.url);
              console.error(error.message);
              console.error(error.response?.data);
            }

            if (node.allowFail) {
              continue;
            }
            process.exit(1);
          }
        }
        break;
      case NODE_TYPES.MONGO:
        {
          const mongoNode = node as MongoNode;
          if (mongoNode.config?.connectionString) {
          }
        }
        break;
    }
  }
}

main();

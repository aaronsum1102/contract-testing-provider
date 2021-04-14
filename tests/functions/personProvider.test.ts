import dotenv from "dotenv";
dotenv.config();

import { createPerson } from "../../src/functions/personProvider";
import {
  MessageProviderPact,
  PactMessageProviderOptions,
} from "@pact-foundation/pact";

describe("Provider test", () => {
  const testTimeout = 20000;
  const option: PactMessageProviderOptions = {
    logLevel: "info",
    messageProviders: {
      "A request for person": () =>
        Promise.resolve(createPerson("test", "asd", 30)),
    },
    provider: "person-provider",
    enablePending: true,
    pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    consumerVersionSelectors: [
      {
        tag: "master",
        latest: true,
      },
      {
        tag: process.env.CONSUMER_BRANCH,
        latest: true,
      },
    ],
    publishVerificationResult: process.env.CI == "true",
    providerVersion: process.env.CI == "true" && process.env.CI_VERSION,
    providerVersionTags: process.env.GIT_BRANCH ? [process.env.GIT_BRANCH] : [],
  };

  it(
    "Sent a person",
    async () => {
      const messageProvider = new MessageProviderPact(option);
      await expect(messageProvider.verify()).resolves.not.toThrow();
    },
    testTimeout
  );
});

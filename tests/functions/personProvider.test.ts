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
    messageProviders: {
      "A request for person": () =>
        Promise.resolve(createPerson("test", "asd", 30)),
    },
    provider: "person-provider",
    providerVersion: process.env.CI == "true" && process.env.CI_VERSION,
    pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    publishVerificationResult: process.env.CI == "true",
    logLevel: "info",
    consumerVersionTags:
      process.env.CI == "true" ? [process.env.CONSUMER_VERSION_TAGS] : ["dev"],
    providerVersionTags:
      process.env.CI == "true" ? [process.env.PROVIDER_VERSION_TAGS] : ["dev"],
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

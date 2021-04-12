import dotenv from "dotenv";
dotenv.config();

import { createPerson } from "../../src/functions/personProvider";
import {
  MessageProviderPact,
  PactMessageProviderOptions,
} from "@pact-foundation/pact";
import childProcess from "child_process";

describe("Provider test", () => {
  const gitHash = childProcess.execSync("git rev-parse HEAD").toString().trim();
  const testTimeout = 20000;
  const option: PactMessageProviderOptions = {
    messageProviders: {
      "A request for person": () =>
        Promise.resolve(createPerson("test", "asd")),
    },
    provider: "person-provider",
    providerVersion: gitHash,
    pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    publishVerificationResult: process.env.CI == "true",
    logLevel: "info",
    consumerVersionTags:
      process.env.CI == "true"
        ? [
            "dev",
            "staging",
            "prod",
            "master",
            process.env.CONSUMER_VERSION_TAGS,
          ]
        : ["dev", "staging", "prod"],
    providerVersionTags:
      process.env.CI == "true"
        ? [
            "dev",
            "staging",
            "prod",
            "master",
            process.env.CONSUMER_VERSION_TAGS,
          ]
        : ["dev", "staging", "prod"],
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

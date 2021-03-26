import { SNS } from "aws-sdk";
import lambdaLog from "lambda-log";

interface Person {
  firstName: string;
  lastName: string;
}

export const createPerson = (firstName: string, lastName: string): Person => ({
  firstName,
  lastName,
});

export const handler = async (event) => {
  lambdaLog.options.meta.event = event;
  lambdaLog.info("Send person event");

  const parameters = createPerson("Test", "Testsson");
  const snsMessage: SNS.PublishInput = {
    Subject: "A request for person",
    Message: JSON.stringify(parameters),
    TopicArn: "arn:aws:sns:eu-north-1:286643423608:pact-poc",
  };
  try {
    await new SNS({ apiVersion: "2010-03-31" }).publish(snsMessage).promise();
    lambdaLog.info("Sucessfully sent message", { snsMessage });
  } catch (error) {
    lambdaLog.info("Fail to sent message", { error });
  }
};

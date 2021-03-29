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
  lambdaLog.info("Send person event", { event });

  const parameters = createPerson("Test", "Testsson");
  const snsMessage: SNS.PublishInput = {
    Subject: "A request for person",
    Message: JSON.stringify(parameters),
    TopicArn: process.env.PERSON_TOPIC_ARN,
  };
  try {
    await new SNS({ apiVersion: "2010-03-31" }).publish(snsMessage).promise();
    lambdaLog.info("Sucessfully sent message", { snsMessage });
  } catch (error) {
    lambdaLog.info("Fail to sent message", { error });
  }
};

import { SNS } from "aws-sdk";
import lambdaLog from "lambda-log";

interface Person {
  firstName: string;
  lastName: string;
  age: number;
}

export const createPerson = (
  firstName: string,
  lastName: string,
  age: number
): Person => ({
  firstName,
  lastName,
  age,
});

export const handler = async (event) => {
  let statusCode = 200;
  let message: string;

  lambdaLog.info("Send person event", { event });

  const parameters = createPerson("Test", "Testsson", 21);
  const snsMessage: SNS.PublishInput = {
    Subject: "A request for person",
    Message: JSON.stringify(parameters),
    TopicArn: process.env.PERSON_TOPIC_ARN,
  };

  try {
    await new SNS({ apiVersion: "2010-03-31" }).publish(snsMessage).promise();
    lambdaLog.info("Sucessfully sent message", { snsMessage });
    message = "Person created!";
  } catch (error) {
    lambdaLog.info("Fail to sent message", { error });

    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

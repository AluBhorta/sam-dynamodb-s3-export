import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

export const handler = async (event, context) => {
  try {
    console.log("event", JSON.stringify(event));
    console.log("context", JSON.stringify(context));

    const tableName = process.env.DYNAMODB_TABLE;
    if (!tableName) {
      throw Error(
        `failed to get the following env vars: DYNAMODB_TABLE`
      );
    }

    await insertMockDataToTable(tableName);
  } catch (error) {
    console.log("error", error);
    throw error
  }
};

async function insertMockDataToTable(tableName) {
  const input = {
    Item: {
      id: { S: uuidv4() },
      createdAt: { S: new Date().toISOString() },
    },
    TableName: tableName,
    ReturnConsumedCapacity: "TOTAL",
  };
  console.log("PutItemCommandInput", input);
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  const command = new PutItemCommand(input);
  const response = await client.send(command);
  console.log("PutItemCommandOutput", response);
}

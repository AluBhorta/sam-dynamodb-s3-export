import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const handler = async (event, context) => {
  try {
    console.log("event", JSON.stringify(event));
    console.log("context", JSON.stringify(context));

    const tableName = process.env.DYNAMODB_TABLE;
    const bucketName = process.env.S3_BUCKET;
    if (!tableName || !bucketName) {
      throw Error(
        `failed to get the following env vars: S3_BUCKET, DYNAMODB_TABLE`
      );
    }

    const data = await getTableData(tableName);
    await uploadJsonToS3(bucketName, data);
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

async function getTableData(tableName) {
  const input = { TableName: tableName };
  console.log("ScanCommandInput", input);
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  const command = new ScanCommand(input);
  const response = await client.send(command);
  console.log("ScanCommandOutput", response);
  return JSON.stringify(response.Items);
}

async function uploadJsonToS3(bucketName, data) {
  const input = {
    Body: data,
    Bucket: bucketName,
    Key: `export-${new Date().toISOString()}.json`,
  };
  console.log("PutObjectCommandInput", input);
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new PutObjectCommand(input);
  const response = await client.send(command);
  console.log("PutObjectCommandOutput", response);
}

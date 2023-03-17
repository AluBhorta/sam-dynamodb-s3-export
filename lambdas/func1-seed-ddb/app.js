
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb"),
  { DynamoDB } = require("@aws-sdk/client-dynamodb");
const response = require("cfn-response");

const docClient = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));
  var params = {
    TableName: event.ResourceProperties.DynamoTableName,
    Item: {
      id: "abc123",
      name: "jon doe",
    },
  };
  docClient.put(params, function (err, data) {
    if (err) {
      response.send(event, context, "FAILED", {});
    } else {
      console.log("data", data);
      response.send(event, context, "SUCCESS", {});
    }
  });
};

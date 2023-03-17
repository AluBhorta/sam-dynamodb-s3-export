# sam-dynamodb-s3-export

Serverless app built on AWS SAM with Github CI/CD to demonstrate how to export DynamoDB table data to S3 on a schedule.

## prerequisites 🗒️

- [aws cli](https://aws.amazon.com/cli/)
- [sam cli](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

## getting started 🚀

### initialize

build the app:

```sh
sam build
```

deploy the app (substitute `$YOUR_GITHUB_USER_OR_ORG` with your Github username or org):

```sh
sam deploy \
  --parameter-overrides ParameterKey=GitHubOrg,ParameterValue=$YOUR_GITHUB_USER_OR_ORG
```

- copy the IAMRoleForPipeline ARN's **Value** outputted by the cloudformation stack
- then add it as a secret named `PIPELINE_IAM_ROLE` to your github repo. this role will be used by Github Actions for CI/CD and to interact with AWS on your behalf.

NOTE: consider changing the default parameters of [template.yaml](./template.yaml) for ease of use, so that you don't have to specify `--parameter-overrides` everytime you deploy locally.

### make changes

once the app is initially deployed, and the role arn is added as a secret to the repo - Github Actions will take care of CI/CD. checkout the [pipeline file](/.github/workflows/pipeline.yaml) for further details.

try changing the [template.yaml](./template.yaml) or lambda functions and push the code to see for yourself!

### clean up

delete all files in the s3 bucket used to store exported data (name of bucket outputted in cfn stack as `ExportedDataS3Bucket`):

```sh
aws s3 rm s3://$ExportedDataS3Bucket --recursive
```

delete the sam app/stack: 🧹

```sh
sam delete
```

voila! all clean and tidy.

## further references 🔗

### permissions: Github OIDC and IAM roles

follow the links below to learn more about how Github Actions securely interact with AWS:

- https://github.com/aws-actions/configure-aws-credentials
- https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services

warning: the `IAMRoleForPipeline` role is currently given `AdministratorAccess` for simplicity. for further security, you should modify it to only allow least privilege access.

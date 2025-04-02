import { S3Client } from "@aws-sdk/client-s3";
import config from "config";
import { Config } from "types/config";

const appConfig: Config = config.get("app");

const s3Client = new S3Client({
  credentials: {
    accessKeyId: appConfig.awsAccessKeyId,
    secretAccessKey: appConfig.awsSecretAccessKey,
  },
  region: appConfig.awsRegion,
});

export default s3Client;

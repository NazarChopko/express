interface Config {
  port: number;
  secretKey: string;
  awsSecretAccessKey: string;
  awsAccessKeyId: string;
  awsRegion: string;
  awsBucketName: string;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  smtpPort: number;
  clientUrl: string;
}

export type { Config };

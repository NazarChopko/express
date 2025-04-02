// @ts-ignore
export default {
  app: {
    port: process.env.PORT || 8008,
    secretKey: process.env.SECRET_KEY,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsRegion: process.env.AWS_REGION,
    awsBucketName: process.env.AWS_BUCKET_NAME,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpSecure: Number(process.env.SMTP_PORT) !== 587,
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    clientUrl: process.env.CLIENT_URL,
  },
};

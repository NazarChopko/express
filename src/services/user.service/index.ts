import ApiError from "../../exception";
import prisma from "../../../prismaClient";
import bcrypt from "bcrypt";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import config from "config";
import { v4 as uuidv4 } from "uuid";
import { type Config } from "types/config";
import s3Client from "../../awsClient";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { PassThrough, Readable } from "stream";

const appConfig: Config = config.get("app");
const salt = 10;
class UserService {
  generateAccessToken(id: string, email: string) {
    const payload = { id, email };
    return jwt.sign(payload, appConfig.secretKey, { expiresIn: "1h" });
  }

  generateRefreshToken(id: string, email: string) {
    const payload = { id, email };
    return jwt.sign(payload, appConfig.secretKey, { expiresIn: "240h" });
  }
  async registration(userData: { email: string; password: string }) {
    const { email, password } = userData;
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw ApiError.badRequest("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    if (!newUser) {
      throw ApiError.internal("Registration error");
    }

    return { message: "User was successfuly registrated" };
  }

  async login(userData: { email: string; password: string }) {
    const { email, password } = userData;
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      throw ApiError.badRequest("User was not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      throw ApiError.badRequest("Invalid password");
    }
    const id = uuidv4();
    const token = this.generateAccessToken(id, userData.email);
    const refreshToken = this.generateRefreshToken(id, userData.email);
    return { token, refreshToken };
  }

  async getUser(email: string) {
    if (!email) {
      throw ApiError.internal("Somethink went wrong!");
    }
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        userInfo: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw ApiError.internal("User was not found");
    }
    return user;
  }

  async setRefreshAndAccessTokens(refreshToken: string) {
    if (!refreshToken) throw ApiError.badRequest("You dont have refresh token");
    const { id, email } = jwt.verify(refreshToken, appConfig.secretKey) as { id: string; email: string };

    const accessToken = this.generateAccessToken(id, email);
    const newRefreshToken = this.generateRefreshToken(id, email);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async updateUser(req: Request) {
    const { email, id } = req.user;
    const { address, userName } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true, email: true, userInfo: true },
    });

    if (!existingUser) {
      throw ApiError.badRequest("User was not found");
    }
    let awsFolderName = existingUser.userInfo?.userImage;

    if (req.file) {
      if (awsFolderName) {
        const deleteParams = {
          Bucket: appConfig.awsBucketName,
          Key: awsFolderName,
        };
        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
      }

      const extention = req.file?.originalname.split(".").pop();
      awsFolderName = `dev/uploads/avatars/${Date.now()}.${extention}`;

      const params = {
        Bucket: appConfig.awsBucketName,
        Key: awsFolderName,
        Body: req.file?.buffer,
        ContentType: req.file?.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
    }

    return await prisma.user.update({
      where: { id: id },
      data: {
        userInfo: existingUser.userInfo
          ? { update: { userImage: awsFolderName, address, userName } }
          : { create: { userImage: awsFolderName, address: address || null, userName: userName || null } },
      },
      select: { id: true, email: true, userInfo: true, createdAt: true, updatedAt: true },
    });
  }

  async downloadFile(fileName: string) {
    const checkFileOnS3 = async (fileName: string) => {
      const params = {
        Bucket: appConfig.awsBucketName,
        Key: `dev/uploads/files/${fileName}`,
      };

      try {
        const command = new HeadObjectCommand(params);
        await s3Client.send(command);
        return true;
      } catch (error) {
        return false;
      }
    };

    const getFileFromS3 = async (fileName: string) => {
      const params = {
        Bucket: appConfig.awsBucketName,
        Key: `dev/uploads/files/${fileName}`,
      };

      const command = new GetObjectCommand(params);
      const { Body } = await s3Client.send(command);

      if (!Body) {
        throw ApiError.internal("Body doens't exist");
      }

      return { Body };
    };
    const fileExists = await checkFileOnS3(fileName);

    if (!fileExists) {
      throw ApiError.internal("File not found on aws");
    }
    return await getFileFromS3(fileName);
  }
}

export default new UserService();

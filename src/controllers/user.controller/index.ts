import { Request, Response, NextFunction } from "express";
import ApiError from "../../exception";
import userService from "../../services/user.service";
import { Readable } from "stream";
import archiver from "archiver";
import fs from "fs";
import path from "path";

class UserController {
  async signup(req: Request, res: Response) {
    return await userService.registration(req.body);
  }

  async login(req: Request, res: Response) {
    const { token, refreshToken } = await userService.login(req.body);
    res.cookie("refreshToken", refreshToken, { maxAge: 864000000 });
    return { token };
  }

  async getUser(req: Request, res: Response) {
    return await userService.getUser(req.user.email || "");
  }

  async refreshToken(req: Request, res: Response) {
    const tokens = await userService.setRefreshAndAccessTokens(req.cookies.refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, { maxAge: 864000000 });
    return { accessToken: tokens.accessToken };
  }

  async updateUser(req: Request, res: Response) {
    return await userService.updateUser(req);
  }

  async downloadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { Body } = await userService.downloadFile(req.params.fileName);

      if (!Body) {
        res.status(404).send("Stream doesnt exist");
        return;
      }
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
      });
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(req.params.fileName)}.zip"`);
      res.setHeader("Content-Type", "application/zip");
      archive.pipe(res);
      archive.append(Body as Readable, { name: req.params.fileName });
      archive.finalize();

      // (Body as Readable).pipe(res);
    } catch (error) {
      next(ApiError.internal("Something went wrong when streaming file!"));
    }
  }

  async getVideos(req: Request, res: Response) {
    const videoPath = path.resolve("static", "files", "video.mp4"); // Шлях до відеофайлу

    fs.stat(videoPath, (err, stats) => {
      if (err) {
        return res.status(404).send("Video not found");
      }

      const range = req.headers.range;
      if (!range) {
        res.status(400).send("Range header required");
        return;
      }

      const videoSize = stats.size;
      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

      const videoStream = fs.createReadStream(videoPath, { start, end });

      res.setHeader("Content-Range", `bytes ${start}-${end}/${videoSize}`);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Length", end - start + 1);
      res.setHeader("Content-Type", "video/mp4");

      videoStream.pipe(res);

      videoStream.on("error", err => {
        res.status(500).send("Error streaming video");
      });
    });
  }
}

export default new UserController();

import express from "express";
import { validateUser, validateUserInfo } from "../../middlewares/user-validate-middleware";
import authMiddleware from "../../middlewares/auth-middleware";
import checkValidationResult from "../../middlewares/check-validation-result-middleware";
import userController from "../../controllers/user.controller";
import tryCatch from "../../middlewares/try-catch-middleware";
import multer from "multer";

const router = express.Router();

router.post("/signup", validateUser, checkValidationResult, tryCatch(userController.signup));
router.post("/login", validateUser, checkValidationResult, tryCatch(userController.login));
router.get("/current-user", authMiddleware, tryCatch(userController.getUser));
router.get("/refresh-token", tryCatch(userController.refreshToken));
router.post(
  "/user/set-avatar",
  authMiddleware,
  multer().single("avatar"),
  validateUserInfo,
  checkValidationResult,
  tryCatch(userController.updateUser),
);
router.get("/download/:fileName", userController.downloadFile);
router.get("/video", userController.getVideos);

export default router;

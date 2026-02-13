import { Router } from "express";
import userService from "./user.services";
import { authentication } from "../../Middleware/authentication.middleware";
import { TokenTypeEnum } from "../../Utils/security/token";
import { RoleEnum } from "../../DB/Models/user.model";
import { validation } from "../../Middleware/validation.middleware";
import { logoutSchema } from "./user.validation";
import { cloudFileUpload, fileValidation, StorageEnum } from "../../Utils/Multer/cloud.multer";

const router: Router = Router();

router.get(
  "/profile",
  authentication(TokenTypeEnum.ACCESS, [RoleEnum.USER]),
  userService.getProfile
);

router.post(
  "/logout",
  authentication(
    TokenTypeEnum.ACCESS,
    [RoleEnum.USER],
  ),
  validation(logoutSchema),
  userService.logout
);

router.patch(
  "/profile-image",
  authentication({
    tokenType: TokenTypeEnum.ACCESS,
    accessRoles: [RoleEnum.USER]
  }),
  cloudFileUpload({
    validation: fileValidation.images,
    storageApproch: StorageEnum.MEMORY,
    maxSizeMB: 3,
  }).single("attachments"),
  userService.profileImage
);

router.patch(
  "/cover-image",
  authentication({
    tokenType: TokenTypeEnum.ACCESS,
    accessRoles: [RoleEnum.USER],
  }),
  cloudFileUpload({
    validation: fileValidation.images,
    storageApproch: StorageEnum.MEMORY,
    maxSizeMB: 6,
  }).array("attachments", 5),
  userService.coverImages
);
export default router;

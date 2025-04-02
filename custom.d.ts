import { User } from "./src/types/user";

// namespace NodeJS {
//   interface ProcessEnv {
//     PORT: number;
//     SECRET_KEY: string;
//     DATABASE_URL: string;
//   }
// }

// namespace Express {
//   export interface Request {
//     user: User;
//   }
// }

// declare module "express-serve-static-core" {
//   interface Request {
//     user: User;
//   }
// }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      SECRET_KEY: string;
      DATABASE_URL: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_REGION: string;
      AWS_BUCKET_NAME: string;
    }
  }

  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

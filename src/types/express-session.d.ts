// src/types/express-session.d.ts

import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string; // Adding userId as an optional property
  }
}

declare module "express-serve-static-core" {
  interface Request {
    session: SessionData & { userId?: string }; // Extend Request interface to include userId
  }
}

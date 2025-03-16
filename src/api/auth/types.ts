import { PgClient } from "../../pg";
import { JsonMiddleware } from "../middleware";

export type AuthMiddlewareHandler = (client: PgClient) => JsonMiddleware;
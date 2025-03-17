import { PgClient } from "../../pg";
import { JsonMiddleware } from "../middleware";

export type AuthMiddlewareHandler = (client: InstanceType<typeof PgClient>) => JsonMiddleware;
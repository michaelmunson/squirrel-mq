import { DefaultOptions } from "./types";

export const DEFAULT = <D extends keyof DefaultOptions>(value:D) : DefaultOptions[D] => value;

import mitt from "mitt";
import type { AppEvents } from "./types";

export const emitter = mitt<AppEvents>();

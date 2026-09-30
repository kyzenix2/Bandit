import { tokenConfig } from "../config/tokenConfig.js";
import { resolveToken } from "../utils/tokenLinks.js";
import { mountPage } from "./sections.js";

const view = resolveToken(tokenConfig);
mountPage(document.querySelector("#app"), view);

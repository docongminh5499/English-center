import {
  chainMatch,
  isPageRequest,
  csp,
  strictDynamic,
} from "@next-safe/middleware";
import { Url, SocketBaseUrl } from "./helpers/constants";


const securityMiddleware = [
  csp({
    directives: {
      "default-src": ["none"],
      "connect-src": ["self", Url.baseUrl, SocketBaseUrl],
      "img-src": ["self", "data:", Url.baseUrl],
      "font-src": ["self", "https://fonts.google.com", Url.baseUrl],
      "frame-ancestors": ["none"],
      "form-action": ["self", Url.baseUrl],
      "object-src": ["none"],
      "base-uri": ["none"],
    },
  }),
  strictDynamic(),
];

export default chainMatch(isPageRequest)(...securityMiddleware);
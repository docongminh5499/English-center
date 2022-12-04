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
      "default-src": ["self"],
      "connect-src": ["self", Url.baseUrl, SocketBaseUrl, "https://www.paypal.com/sdk/js", "https://www.sandbox.paypal.com"],
      "img-src": ["self", "data:", Url.baseUrl],
      "font-src": ["self", "https://fonts.google.com", Url.baseUrl],
      "frame-src": ["https://www.sandbox.paypal.com/"],
      "form-action": ["self", Url.baseUrl],
      "object-src": ["none"],
      "base-uri": ["none"],
      "style-src": ["self", "unsafe-inline"],
      "script-src": ["self", "https://www.paypal.com/", Url.baseUrl]
    },
  }),
];

export default chainMatch(isPageRequest)(...securityMiddleware);
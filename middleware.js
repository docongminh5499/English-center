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
      "connect-src": ["self", Url.baseUrl, SocketBaseUrl, "https://www.paypal.com/sdk/js", "https://www.sandbox.paypal.com"],
      "img-src": ["self", "data:", Url.baseUrl],
      "font-src": ["self", "https://fonts.google.com", Url.baseUrl],
      "frame-src": ["https://www.sandbox.paypal.com/"],
      "form-action": ["self", Url.baseUrl],
      "object-src": ["none"],
      "base-uri": ["none"],
    },
  }),
  strictDynamic(),
];

export default chainMatch(isPageRequest)(...securityMiddleware);
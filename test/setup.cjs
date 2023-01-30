const { Response, Headers, Request } = require("whatwg-fetch");

global.Response = Response;
global.Headers = Headers;
global.Request = Request;

global.EVICTION_INTERVAL = 1000 * 0.5;
jest.setTimeout(10000);

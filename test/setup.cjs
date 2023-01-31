const { Response, Headers, Request } = require("whatwg-fetch");

global.Response = Response;
global.Headers = Headers;
global.Request = Request;

jest.setTimeout(10000);

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const jsdom = require("jsdom");
const { Response, Headers, Request } = require("whatwg-fetch");

global.Response = Response;
global.Headers = Headers;
global.Request = Request;

const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html>`, { url: "http://localhost" });
global.window = dom.window;

jest.setTimeout(10000);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebscokets = initWebscokets;
const ws_1 = __importDefault(require("ws"));
const ws_2 = require("../lib/ws/ws");
function initWebscokets(server) {
    const wss = new ws_1.default.Server({ server: server });
    wss.on('connection', function connection(ws) {
        console.log("Connected to the websockets......");
        ws.on('message', (jsonString, isBinary) => __awaiter(this, void 0, void 0, function* () {
            yield (0, ws_2.handleClientReq)(ws, wss, jsonString, isBinary);
        }));
        ws.on('close', function close() {
        });
    });
}

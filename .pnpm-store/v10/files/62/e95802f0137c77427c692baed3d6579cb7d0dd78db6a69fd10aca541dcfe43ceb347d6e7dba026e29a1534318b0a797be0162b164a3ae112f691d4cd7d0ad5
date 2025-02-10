"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
if (process.env.PRODUCT !== 'ext') {
    throw 'Cant use outputchannels outside of VSCode context';
}
var stream_1 = require("stream");
var vscode_1 = require("vscode");
var factory_1 = __importDefault(require("./factory"));
var outputChannel = vscode_1.window.createOutputChannel(process.env.DISPLAY_NAME || 'SQLTools');
var writableStream = new stream_1.Writable({
    write: function (chunk, _, done) {
        outputChannel.append(chunk.toString(chunk.encoding || 'utf8'));
        done();
    },
    writev: function (chunks, done) {
        chunks.forEach(function (i) { return outputChannel.append(i.chunk.toString(i.encoding || 'utf8')); });
        done();
    }
});
var logger = factory_1["default"]({}, writableStream);
logger.clear = outputChannel.clear.bind(outputChannel);
logger.outputChannel = outputChannel;
logger.show = function () { return outputChannel.show(); };
exports["default"] = logger;

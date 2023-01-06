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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var http_1 = require("http");
var fs_1 = require("fs");
var host = 'localhost';
var port = 8080;
var srcPath;
var srcName;
function split(arg) {
    var range = arg.range, name = arg.name;
    return new Promise(function (resolve, reject) {
        (0, child_process_1.exec)("ffmpeg -ss ".concat(range.from, " -to ").concat(range.to, " -i \"").concat(srcPath, "\\").concat(srcName, "\" -c copy \"").concat(srcPath, "\\").concat(name, ".mp4\""), function (err, stdout, stderr) {
            if (err) {
                console.log('child process ends with errors');
                reject({ isSuccess: false, message: err.message });
            }
            else {
                console.log('child process ends without errors');
                resolve({ isSuccess: true, message: stdout });
            }
        });
    });
}
function setSrc(path) {
    var slashSplited = path.split('\\');
    var filename = slashSplited.pop();
    srcPath = slashSplited.join('\\');
    srcName = filename;
    return "".concat(srcPath, "\\").concat(srcName);
}
function parseInjection(arg, modeFlg) {
    var matchBkName = arg.raw.match(/\*.+\*/g);
    var matchBkMs = arg.raw.match(/[0-9]+=[0-9]+/g);
    var isEven = (matchBkName.length % 2) === 0;
    var loopSize = modeFlg === 'range'
        ? isEven
            ? matchBkName.length / 2
            : Math.floor(matchBkName.length / 2)
        : matchBkName.length;
    var bkNameArr = [];
    var bkMsArr = [];
    if (modeFlg === 'range') {
        for (var i = 0; i < loopSize; ++i) {
            bkNameArr.push(matchBkName.slice(i * 2, (i * 2) + 2));
        }
        if (!isEven) {
            bkNameArr.push([matchBkName[matchBkName.length - 1]]);
        }
        for (var i = 0; i < loopSize; ++i) {
            bkMsArr.push(matchBkMs.slice(i * 2, (i * 2) + 2));
        }
        if (!isEven) {
            bkMsArr.push([matchBkMs[matchBkMs.length - 1]]);
        }
    }
    else {
        for (var i = 0; i < loopSize; ++i) {
            bkNameArr.push([matchBkName[i]]);
            bkMsArr.push([matchBkMs[i]]);
        }
    }
    var out = [];
    for (var i = 0; i < loopSize; ++i) {
        out.push({
            nameArr: bkNameArr[i],
            msArr: bkMsArr[i]
        });
    }
    return out;
}
var server = (0, http_1.createServer)(function (request, response) {
    switch (request.url) {
        case '/api/split': {
            request.on('data', function (chunk) { return __awaiter(void 0, void 0, void 0, function () {
                var parsed, childRes, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parsed = JSON.parse(chunk.toString());
                            response.setHeader('Access-Control-Allow-Origin', '*');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, split(parsed)];
                        case 2:
                            childRes = _a.sent();
                            response.write(JSON.stringify({
                                isSuccess: true,
                                message: childRes.message
                            }));
                            return [3 /*break*/, 5];
                        case 3:
                            err_1 = _a.sent();
                            response.write(JSON.stringify({
                                isSuccess: false,
                                message: err_1.message
                            }));
                            return [3 /*break*/, 5];
                        case 4:
                            response.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            break;
        }
        case '/api/setSrc': {
            request.on('data', function (chunk) {
                var path = chunk.toString();
                var fullPath = setSrc(path);
                response.setHeader('Access-Control-Allow-Origin', '*');
                response.write(JSON.stringify({
                    isSuccess: true,
                    message: fullPath
                }));
                response.end();
            });
            break;
        }
        case '/api/parseInjection': {
            request.on('data', function (chunk) {
                response.setHeader('Access-Control-Allow-Origin', '*');
                var path = chunk.toString();
                (0, fs_1.readFile)(path, 'utf16le', function (err, raw) {
                    if (err) {
                        response.write(JSON.stringify({
                            isSuccess: false,
                            message: "Failed to open the given file ".concat(path.split('\\').pop())
                        }));
                    }
                    else {
                        var out = '';
                        var parsed = parseInjection({ raw: raw, out: out }, 'range');
                        response.write(JSON.stringify({
                            isSuccess: true,
                            message: JSON.stringify(parsed)
                        }));
                    }
                    response.end();
                });
            });
            break;
        }
    }
});
server.listen(port, host, function () {
    console.log("nodejs is listening ".concat(host, ":").concat(port));
});

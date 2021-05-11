"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tempFile = "parsers/temp.txt";
const __dirname = path_1.default.resolve();
const url = "https://eda.ru/recepty";
const amountParserFileName = "parsers/parseEdaRAmount.py";
async function checkEdaRAmount() {
    const response = await axios_1.default.get(url);
    const data = response.data;
    fs_1.default.writeFile(path_1.default.join(__dirname, tempFile), data, (e) => {
        if (e)
            throw e;
    });
    const python = child_process_1.spawn("python", [amountParserFileName, tempFile]);
    return await new Promise((resolve) => {
        python.stdout.on("data", (res) => {
            fs_1.default.unlink(path_1.default.join(__dirname, tempFile), (e) => {
                if (e)
                    throw e;
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const amount = res.toString();
            resolve(String(parseInt(amount)));
        });
    });
}
exports.default = checkEdaRAmount;

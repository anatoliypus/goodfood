"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getenv_1 = __importDefault(require("getenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    constructor() {
        this.repository = typeorm_1.getRepository(User_1.User);
        this.jwtKey = getenv_1.default.string("JWT");
    }
    // Если ошибка работы с БД, то void
    // Если пароли совпали — возвращается AuthResponseData, иначе пустой объект
    async createJWT(data) {
        const user = await this.repository.findOne({ email: data.email });
        if (!user) {
            throw new Error("404");
        }
        const passwordResult = await bcrypt_1.default.compare(data.password, user.password);
        if (!passwordResult) {
            throw new Error("403");
        }
        const expiresAt = 2 * 3600;
        const token = jsonwebtoken_1.default.sign({
            email: data.email,
            userId: user.id,
        }, this.jwtKey, { expiresIn: expiresAt });
        return {
            token,
            expiresAt,
        };
    }
    decodeToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtKey);
            return decoded;
        }
        catch {
            return null;
        }
    }
}
exports.default = AuthService;

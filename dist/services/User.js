"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.repository = typeorm_1.getRepository(User_1.User);
    }
    async find(id) {
        try {
            return await this.repository.findOne({ id });
        }
        catch (e) {
            console.error(e);
        }
    }
    // если пользователь успешно создался, то возвращает true, иначе false
    async create(createProps) {
        try {
            const salt = await bcrypt_1.default.genSalt(10);
            await this.repository.insert({
                email: createProps.email,
                password: await bcrypt_1.default.hash(createProps.password, salt),
                firstName: createProps.firstName,
                lastName: createProps.lastName,
                excluded_ingredients: [],
                wishlist: [],
            });
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    // если пользователь с таким email уже существент, то возвращает true, иначе false
    async checkIfExists(email) {
        const user = await this.repository.findOne({ email });
        return user !== undefined;
    }
    async update(id, data) {
        const user = await this.find(id);
        if (!user) {
            return false;
        }
        const newData = {
            id,
            tags: data.tags,
            types: data.shotTypes,
        };
        try {
            await this.repository.save(newData);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
}
exports.default = UserService;

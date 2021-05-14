"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getenv_1 = __importDefault(require("getenv"));
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const Recipes_1 = require("../models/Recipes");
const Categories_1 = require("../models/Categories");
const Ingredients_1 = require("../models/Ingredients");
async function initializeDBConnection() {
    const connection = await typeorm_1.createConnection({
        type: "mysql",
        url: getenv_1.default.string("DB_CON_STRING"),
        logging: getenv_1.default.string("NODE_ENV", "development") === "production" ? ["error"] : true,
        synchronize: getenv_1.default.string("NODE_ENV", "development") !== "production",
        entities: [User_1.User, Recipes_1.Recipes, Categories_1.Categories, Ingredients_1.Ingredients],
        charset: "UTF8_GENERAL_CI",
    });
    console.log("Database connection established");
    return connection;
}
exports.default = initializeDBConnection;

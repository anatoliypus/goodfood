"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipes = void 0;
const typeorm_1 = require("typeorm");
const stringCharset = "utf8";
let Recipes = class Recipes {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Recipes.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        charset: stringCharset,
    }),
    __metadata("design:type", String)
], Recipes.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        charset: stringCharset,
    }),
    __metadata("design:type", String)
], Recipes.prototype, "url", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        charset: stringCharset,
    }),
    __metadata("design:type", String)
], Recipes.prototype, "cook_time", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        charset: stringCharset,
    }),
    __metadata("design:type", String)
], Recipes.prototype, "ingredients_amount", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-json",
        charset: stringCharset,
    }),
    __metadata("design:type", Array)
], Recipes.prototype, "steps", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-array",
        charset: stringCharset,
    }),
    __metadata("design:type", Array)
], Recipes.prototype, "ingredients", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-array",
        charset: stringCharset,
    }),
    __metadata("design:type", Array)
], Recipes.prototype, "images", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-array",
        charset: stringCharset,
    }),
    __metadata("design:type", Array)
], Recipes.prototype, "categories", void 0);
Recipes = __decorate([
    typeorm_1.Entity({ engine: "InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci" })
], Recipes);
exports.Recipes = Recipes;

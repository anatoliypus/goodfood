"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Recipes_1 = require("../models/Recipes");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const parseProductsFileName = path_1.default.resolve(process.cwd(), "parsers", "parseEdaProducts.py");
const parseProductCardFileName = path_1.default.resolve(process.cwd(), "parsers", "parseEdaProductCard.py");
const tempFile = path_1.default.resolve(__dirname, "temp.txt");
const url = "http://eda.ru/recepty";
const pageLimit = 3;
class DataService {
    constructor() {
        this.repository = typeorm_1.getRepository(Recipes_1.Recipes);
    }
    // главная функция для парса с Eda.ru
    async parseEda() {
        await this.repository.createQueryBuilder().delete().execute();
        let i = 1;
        let j = 1;
        // цикл по страницам с рецептами
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const pageUrl = url + "?page=" + String(i); // шаблон для получения ссылки на запрос с query параметром
            if (pageLimit && i > pageLimit)
                break;
            ++i;
            const productsFromPage = await getProducts(pageUrl); // возвращает коллекцию с рецептами на странице
            if (!productsFromPage)
                break;
            // цикл по рецептам в полученной коллекции
            for (const product of productsFromPage) {
                const productCard = await getProductCard(product.url); // получает объект с рецептом
                if (productCard) {
                    // отправляет полученный рецепт в базу
                    const insertObj = {
                        id: j,
                        title: product.title,
                        url: product.url,
                        cook_time: product.time,
                        ingredients_amount: product.ingredientsAmount,
                        steps: productCard.steps,
                        ingredients: productCard.ings,
                        images: productCard.imgs,
                        categories: productCard.ctgrs,
                    };
                    j++;
                    await this.repository.insert(insertObj);
                }
            }
        }
        // удаляет временный файл
        fs_1.default.unlink(tempFile, (e) => {
            if (e)
                throw e;
        });
        console.log("Parsing completed");
    }
    async getData(amount, offset, search) {
        try {
            let data;
            if (search) {
                data = await this.repository
                    .createQueryBuilder("recipes")
                    .where("recipes.title LIKE :search", { search: `%${search}%` })
                    .skip(offset)
                    .take(amount)
                    .getMany();
            }
            else {
                data = await this.repository.createQueryBuilder("recipes").skip(offset).take(amount).getMany();
            }
            return data;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    async getRecipesAmount() {
        try {
            const amount = await this.repository.count();
            return amount;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
}
exports.default = DataService;
// получает объект с рецептом
async function getProductCard(url) {
    const productCardQuery = await axios_1.default.get(url, { timeout: 2500 });
    const html = productCardQuery.data;
    const productCardJSON = await processProductCard(html);
    if (!productCardJSON) {
        return null;
    }
    try {
        const productCard = JSON.parse(productCardJSON);
        return productCard;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
// возвращает коллекцию с рецептами на странице
async function getProducts(url) {
    try {
        const response = await axios_1.default.get(url);
        const data = response.data;
        const result = await processAllProducts(data);
        if (!result)
            return null;
        const productsFromPage = JSON.parse(result);
        return productsFromPage;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
// создает процесс с питоном, парсит страницу с продуктами
function processAllProducts(data) {
    fs_1.default.writeFile(path_1.default.resolve(__dirname, tempFile), data, (e) => {
        if (e)
            throw e;
    });
    const python = child_process_1.spawn("python", [parseProductsFileName, tempFile]);
    return new Promise((resolve) => {
        python.stdout.on("data", (r) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            resolve(r.toString());
        });
        python.stderr.on("data", (e) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            console.log(e);
            resolve(null);
        });
    });
}
// создает процесс с питоном, парсит карточку продукта
function processProductCard(data) {
    fs_1.default.writeFile(path_1.default.resolve(__dirname, tempFile), data, (e) => {
        if (e)
            throw e;
    });
    const python = child_process_1.spawn("python", [parseProductCardFileName, tempFile]);
    return new Promise((resolve) => {
        python.stdout.on("data", (r) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            resolve(r.toString());
        });
        python.stderr.on("data", (e) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            console.log(e.toString());
            resolve(null);
        });
    });
}

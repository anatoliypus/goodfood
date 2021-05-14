import {getRepository, Repository} from "typeorm";
import {Recipes} from "../models/Recipes";
import {spawn} from "child_process";
import fs from "fs";
import path from "path";
import got from "got";
import {Categories} from "../models/Categories";

interface ProductCard {
  steps: string[];
  ings: string[];
  imgs: string[];
  ctgrs: string[];
}

interface Product {
  title: string;
  url: string;
  time: string;
  ingredientsAmount: string;
}

const parseProductsFileName = path.resolve(process.cwd(), "parsers", "parseEdaProducts.py");
const parseProductCardFileName = path.resolve(process.cwd(), "parsers", "parseEdaProductCard.py");
const tempFile = path.resolve(__dirname, "temp.txt");
const url = "https://eda.ru/recepty";
const pageLimit = 2;

export default class DataService {
  private readonly repository: Repository<Recipes>;
  private readonly categories: Repository<Categories>;
  constructor() {
    this.repository = getRepository<Recipes>(Recipes);
    this.categories = getRepository<Categories>(Categories);
  }
  // главная функция для парса с Eda.ru
  async parseEda(): Promise<void> {
    await this.repository.createQueryBuilder().delete().execute();
    let i = 1;
    const categoriesCollection: string[] = [];
    // цикл по страницам с рецептами
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const pageUrl = url + "?page=" + String(i); // шаблон для получения ссылки на запрос с query параметром
      if (pageLimit && i > pageLimit) break;
      ++i;

      const productsFromPage = await getProducts(pageUrl); // возвращает коллекцию с рецептами на странице
      if (!productsFromPage) break;

      // цикл по рецептам в полученной коллекции
      for (const product of productsFromPage) {
        const productCard = await getProductCard(product.url); // получает объект с рецептом
        if (productCard) {
          for (const el of productCard.ctgrs) {
            if (!categoriesCollection.includes(el)) {
              categoriesCollection.push(el);
            }
          }
          // отправляет полученный рецепт в базу
          const insertObj = {
            title: product.title,
            url: product.url,
            cook_time: product.time,
            ingredients_amount: product.ingredientsAmount,
            steps: productCard.steps,
            ingredients: productCard.ings,
            images: productCard.imgs,
            categories: productCard.ctgrs,
          };
          await this.repository.insert(insertObj);
        }
      }
    }

    for (const el of categoriesCollection) {
      await this.categories.insert({
        category: el,
      });
    }

    // удаляет временный файл
    fs.unlink(tempFile, (e) => {
      if (e) throw e;
    });
    console.log("Parsing completed");
  }
  async getData(
    amount: number,
    offset: number,
    search?: string | undefined,
    categories?: string[] | undefined,
    ingredients?: string[] | undefined,
  ): Promise<Recipes[] | null> {
    try {
      const data = this.repository.createQueryBuilder("recipes");
      if (search) {
        data.where("recipes.title LIKE :search", {search: `%${search}%`});
      }
      if (categories && categories.length) {
        categories = categories.filter((el) => {
          return el != "#";
        });
        const sql = "JSON_CONTAINS(recipes.categories, :categories)";
        const params = {categories: JSON.stringify(categories)};
        if (search) {
          data.andWhere(sql, params);
        } else {
          data.where(sql, params);
        }
      }
      if (ingredients && ingredients.length) {
        if (!search && !categories) {
          data.where(`recipes.ingredients LIKE '%${ingredients[0]}%'`);
          ingredients.splice(0, 1);
        }
        for (const el of ingredients) {
          data.andWhere(`recipes.ingredients LIKE '%${el}%'`);
        }
      }
      const result = await data.skip(offset).take(amount).getMany();
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async getRecipesAmount(): Promise<number | null> {
    try {
      const amount = await this.repository.count();
      return amount;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async getCategories(): Promise<string[] | null> {
    try {
      const data = await this.categories.createQueryBuilder("categories").select("categories.category").getMany();
      const collection: string[] = [];
      for (const el of data) {
        collection.push(el.category);
      }
      return collection;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

// получает объект с рецептом
async function getProductCard(url: string): Promise<ProductCard | null> {
  const productCardQuery = await got(url, {timeout: 1000});
  const html = productCardQuery.body;
  const productCardJSON = await processProductCard(html);
  if (!productCardJSON) {
    return null;
  }
  try {
    const productCard = JSON.parse(productCardJSON) as ProductCard;
    return productCard;
  } catch (e) {
    console.log(e);
    return null;
  }
}

// возвращает коллекцию с рецептами на странице
async function getProducts(url: string): Promise<Product[] | null> {
  try {
    const response = await got(url);
    const data = response.body;
    const result = await processAllProducts(data);
    if (!result) return null;
    const productsFromPage = JSON.parse(result) as Product[];
    return productsFromPage;
  } catch (e) {
    console.log(e);
    return null;
  }
}

// создает процесс с питоном, парсит страницу с продуктами
function processAllProducts(data: string): Promise<string | null> {
  fs.writeFile(path.resolve(__dirname, tempFile), data, (e) => {
    if (e) throw e;
  });
  const python = spawn("python", [parseProductsFileName, tempFile]);
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
function processProductCard(data: string): Promise<string | null> {
  fs.writeFile(path.resolve(__dirname, tempFile), data, (e) => {
    if (e) throw e;
  });
  const python = spawn("python", [parseProductCardFileName, tempFile]);
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

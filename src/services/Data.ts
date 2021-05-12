import {getRepository, Repository} from "typeorm";
import {Recipes} from "../models/Recipes";
import {spawn} from "child_process";
import fs from "fs";
import path from "path";
import axios from "axios";

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
const url = "http://eda.ru/recepty";
const pageLimit = 3;

export default class DataService {
  private readonly repository: Repository<Recipes>;
  constructor() {
    this.repository = getRepository<Recipes>(Recipes);
  }
  // главная функция для парса с Eda.ru
  async parseEda(): Promise<void> {
    await this.repository.createQueryBuilder().delete().execute();
    let i = 1;
    let j = 1;
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
    fs.unlink(tempFile, (e) => {
      if (e) throw e;
    });
    console.log("Parsing completed");
  }
  async getData(amount: number, offset: number, search?: string | undefined): Promise<Recipes[] | null> {
    try {
      let data;
      if (search) {
        data = await this.repository
          .createQueryBuilder("recipes")
          .where("recipes.title LIKE :search", {search: `%${search}%`})
          .skip(offset)
          .take(amount)
          .getMany();
      } else {
        data = await this.repository.createQueryBuilder("recipes").skip(offset).take(amount).getMany();
      }
      return data;
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
}

// получает объект с рецептом
async function getProductCard(url: string): Promise<ProductCard | null> {
  const productCardQuery = await axios.get(url, {timeout: 2500});
  const html = productCardQuery.data as string;
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
    const response = await axios.get(url);
    const data = response.data as string;
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

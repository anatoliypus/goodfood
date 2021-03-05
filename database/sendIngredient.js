import config from './config.js'
import chalk from 'chalk'

export default function sendIngredient(connection, ingredient) {
    connection.query(
        `INSERT INTO ${
            config.tableName
        } (title, url, cook_time, ingredients_amount, steps_arr_json, ingredients_arr_json, images_arr_json, categories_arr_json)
         VALUES ('${ingredient.title}', '${ingredient.url}', '${
            ingredient.time
        }', '${ingredient.ingredientsAmount}', '${JSON.stringify(
            ingredient.steps
        )}', '${JSON.stringify(ingredient.ings)}', '${JSON.stringify(
            ingredient.imgs
        )}', '${JSON.stringify(ingredient.ctgrs)}')`,
        (e) => {
            if (e) console.log(chalk.red('Error while pushing to db'))
        }
    )
}

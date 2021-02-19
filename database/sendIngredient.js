import config from './config.js'

export default function sendIngredient(connection, ingredient, card) {
    connection.query(
        `INSERT INTO ${
            config.tableName
        } (title, url, cook_time, ingredients_amount, steps_arr_json, ingredients_arr_json, images_arr_json, categories_arr_json)
         VALUES ('${ingredient.title}', '${ingredient.url}', '${
            ingredient.time
        }', '${ingredient.ingredientsAmount}', '${JSON.stringify(
            card.steps
        )}', '${JSON.stringify(card.ings)}', '${JSON.stringify(
            card.imgs
        )}', '${JSON.stringify(card.ctgrs)}')`,
        (e) => {
            if (e) throw e
        }
    )
}

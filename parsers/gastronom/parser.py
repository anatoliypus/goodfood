import requests
import json
from bs4 import BeautifulSoup
import sys

def beautyString(str):
    while str.find('\n') != -1:
        str = str.replace('\n', '')
    while str.find('\r') != -1:
        str = str.replace('\r', '')
    str = str.strip();
    return str

def productCardParse(url, soup, category): # Парсит рецепт
    ing = []
    steps = []

    if soup.find(class_ = 'recipe__title'):
        title = soup.find(class_ = 'recipe__title').text
    else:
        title = soup.find(class_ = 'text__title').text
    time = 'none'
    for params in soup.find_all(class_ = 'recipe__summary-list-des recipe__summary-list-des_big'):
        if params.has_attr('itemprop') and params['itemprop'] == 'totalTime':
            time = params.text
    for cookSteps in soup.find_all(class_ = 'recipe__step-text'):
        steps.append(cookSteps.text)
        steps[len(steps) - 1] = beautyString(steps[len(steps) - 1])
    for recipeListPart in soup.find_all(class_= 'recipe__ingredient'):
        ing.append(recipeListPart.text)

    res = {
        "category": category,
        "title": title,
        "url": url,
        "ingredientsAmount": str(len(ing)),
        "time": time,
        "steps": steps,
        "ingredients": ing
        }
    return res

сollection = []


def productListParse(pageNumber, url): # Парсит список рецептов по категории
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    currPageNum = 1
    if soup.find(class_ = 'pagination__arrow-next'):
        while soup.find(class_ = 'pagination__arrow-next')['href'] != '#' and currPageNum < pageNumber:
            currPageNum += 1
            r = requests.get('https://www.gastronom.ru' + soup.find(class_ = 'pagination__arrow-next')['href'])
            soup = BeautifulSoup(r.text, 'html.parser')
        if pageNumber == currPageNum:
            category = soup.find(class_ = '-title_narrow group-main-title').text
            for productCardPage in soup.find(class_ = 'archive col-md-12 col-sm-12').find_all(class_ = 'material-anons__like-box'):
                p = requests.get('https://www.gastronom.ru' + productCardPage.a['href'])
                pSoup = BeautifulSoup(p.text, 'html.parser')
                if not pSoup.find(class_ = '-title -title_no-border'):
                    productCard = productCardParse('https://www.gastronom.ru' + productCardPage.a['href'], pSoup, category)
                    сollection.append(productCard)
                    # print(productCardPage.a['href']) # Выводит ссылку на рецепт
            currPageNum += 1
            r = requests.get('https://www.gastronom.ru' + soup.find(class_ = 'pagination__arrow-next')['href'])
            soup = BeautifulSoup(r.text, 'html.parser')
    else:
        if pageNumber == currPageNum:
            category = soup.find(class_ = '-title_narrow group-main-title').text
            with open('result.txt', 'a', encoding='utf-8') as output_file:
                for productCardPage in soup.find(class_ = 'archive col-md-12 col-sm-12').find_all(class_ = 'material-anons__like-box'):
                    p = requests.get('https://www.gastronom.ru' + productCardPage.a['href'])
                    pSoup = BeautifulSoup(p.text, 'html.parser')
                    if not pSoup.find(class_ = '-title -title_no-border'):
                        productCard = productCardParse('https://www.gastronom.ru' + productCardPage.a['href'], pSoup, category)
                        сollection.append(productCard)
                        # print(productCardPage.a['href']) # Выводит ссылку на рецепт

    # print('End of list')

def bakeryParse(pageNumber, url): # Парсит список выпечки
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    for productCategory in soup.find(class_ = 'archive col-md-12 col-sm-12').find_all(class_ = 'material-anons__title'):
        if not productCategory.find('span'):
            # print('>>>>>', productCategory.text) # Выводит категорию (выпечка)
            productListParse(pageNumber, 'https://www.gastronom.ru' + productCategory['href'])

def categoryParse(pageNumber, url): # Парсит список категорий
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    for productCategory in soup.find_all(class_ = 'col-catalog__title'):
        if not productCategory.find('span'):
            # print('>>>>>', productCategory.text) # Выводит категорию
            if productCategory.a['href'] == '/recipe/group/1142/vypechka':
                bakeryParse(pageNumber, 'https://www.gastronom.ru/recipe/group/1142/vypechka-recepty')
            else:
                productListParse(pageNumber, 'https://www.gastronom.ru' + productCategory.a['href'])

def globalParse(pageNumber):
    categoryParse(pageNumber, 'https://www.gastronom.ru/catalog')
    with open(sys.argv[2], 'a', encoding='utf-8') as output_file:
        output_file.write(json.dumps({"list": сollection}, sort_keys = True, indent = 4, ensure_ascii = False)) # Вместо этого нужно вставить сувалку в базу данных

def main():
    globalParse(int(sys.argv[1])) # В аргументе номер обрабатываемой страниы по каждой категории. Если такой страницы нет коллекция останется пустой

if __name__ == '__main__':
    main()
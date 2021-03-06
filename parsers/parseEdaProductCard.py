from bs4 import BeautifulSoup
import json
import sys

f = open(sys.argv[1], 'r', encoding='utf8')
data = f.read()
f.close()
soup = BeautifulSoup(data, 'html.parser')

steps = []
ingredients = []
imgs = []
categories = []

for ing in soup.find('div', class_="ingredients-list__content").find_all('p', class_='ingredients-list__content-item'):
    ingName = ing.find('span', class_='content-item__name').find('span').string.strip()
    ingAmount = ing.find('span', class_='content-item__measure').string.strip()
    ing = ingName + ' ' + ingAmount
    ingredients.append(ing)

for el in soup.find_all('span', class_='instruction__description'):
    for span in el.find_all('span'):
        if span.has_attr('itemprop') and span['itemprop'] == 'text':
            steps.append(span.string)

imgs.append(soup.find('div', class_='js-recipe-cover-img').img['src'])

for el in soup.find('ul', class_='breadcrumbs').find_all('a'):
    categories.append(el.string)

if len(steps) == 0:
    for el in soup.find_all('span', class_='instruction__description'):
        steps.append(el.contents[3].strip())
            
res = {
    'steps': steps,
    'ings': ingredients,
    'imgs': imgs,
    'ctgrs': categories
}

print(json.JSONEncoder(ensure_ascii=False).encode(res))
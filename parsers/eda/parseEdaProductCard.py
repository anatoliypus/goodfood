from bs4 import BeautifulSoup
import json
import sys

f = open(sys.argv[1], 'r')
data = f.read()
soup = BeautifulSoup(data, 'html.parser')

steps = []
ingredients = []
imgs = []
categories = []

for ing in soup.find_all('p', class_='ingredients-list__content-item'):
    ingName = ing.find('span', class_='content-item__name').find('span').string.strip()
    ingAmount = ing.find('span', class_='content-item__measure').string.strip()
    ing = {
        'nm': ingName,
        'am': ingAmount
    }
    ingredients.append(ing)

for el in soup.find_all('span', class_='instruction__description'):
    for span in el.find_all('span'):
        if span.has_attr('itemprop') and span['itemprop'] == 'text':
            steps.append(span.string)

for el in soup.find_all('div', class_='photo-list-preview'):
    imgs.append(el.img['src'])

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
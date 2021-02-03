from bs4 import BeautifulSoup
import json
import sys

f = open(sys.argv[1], 'r')
data = f.read()
soup = BeautifulSoup(data, 'html.parser')

steps = []
ingredients = []

ingBlock = soup.find('div', class_='ingredients-list__content')
for ing in ingBlock.find_all('span', class_='js-tooltip-ingredient'):
    ingredients.append(ing.string.strip())

for el in soup.find_all('span', class_='instruction__description'):
    for span in el.find_all('span'):
        if span.has_attr('itemprop') and span['itemprop'] == 'text':
            steps.append(span.string)

if len(steps) == 0:
    for el in soup.find_all('span', class_='instruction__description'):
        steps.append(el.contents[3].strip())
            
res = {
    'steps': steps,
    'ingredients': ingredients
}

print(json.JSONEncoder(ensure_ascii=False).encode(res))
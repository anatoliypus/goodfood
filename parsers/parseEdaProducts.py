from bs4 import BeautifulSoup
import json
import sys

f = open(sys.argv[1], 'r', encoding='utf8')
data = f.read()
f.close()
soup = BeautifulSoup(data, 'html.parser')
collection = []
urlFirstpart = 'https://eda.ru/'

for el in soup.find_all('div', class_='horizontal-tile__content'):
    title = el.h3.a.span.string.strip()
    url = el.h3.a['href']
    specs = el.find('div', class_='horizontal-tile__item-specifications')
    timeTag = specs.find('span', class_='prep-time')
    ingredientsAmount = specs.find('div', class_='inline-dropdown').contents[0].strip()
    if timeTag:
        time = timeTag.contents[2].strip()
        productDict = {'title': title, 'url': urlFirstpart + url, 'time': time, 'ingredientsAmount': ingredientsAmount}
        collection.append(productDict)

print(json.JSONEncoder(ensure_ascii=False).encode(collection).strip())
import json
from bs4 import BeautifulSoup
import sys

f = open(sys.argv[1], 'r', encoding='utf8')
data = f.read()
soup = BeautifulSoup(data, 'html.parser')

el = soup.find('span', class_='tag-selector__recipe-count');
print(el.string)

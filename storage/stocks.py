import requests
from bs4 import BeautifulSoup
import json
import sys
import os

def extract_data_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    dataList = []
    
    for category_div in soup.find_all('div', class_='column-type7 wmargin'):
        stock_rows = category_div.find_all('div', class_='w-clearfix w-inline-block comp-row')
        for stock_row in stock_rows:
            stock_data = {}
            stock_data['code'] = stock_row.find('div', class_='comp-cell _04 vtable').find('a').text.strip()
            stock_data['name'] = stock_row.find('div', class_='comp-cell _14 vtable').find('a').text.strip()
            dataList.append(stock_data)
    return dataList

# URL'den HTML içeriği çekmek için
def fetch_html_from_url(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    else:
        raise Exception(f"Failed to fetch the URL. Status code: {response.status_code}")

# URL'yi buraya ekleyin
url = sys.argv[1]

try:
    html_content = fetch_html_from_url(url)
    json_data = extract_data_from_html(html_content)
    
    # Path
    storage_dir = 'storage'
    os.makedirs(storage_dir, exist_ok=True) 
    file_path = os.path.join(storage_dir, 'stocks.json') 
    
    # JSON verisini bir dosyaya kaydedin
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=4, ensure_ascii=False)
    
    print("Data successfully extracted and saved to stocks.json")
except Exception as e:
    print(f"An error occurred: {e}")
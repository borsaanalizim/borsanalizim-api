import requests
from bs4 import BeautifulSoup
import json
import sys
import os

def extract_data_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    dataList = []
    
    for category_div in soup.find_all('div', class_='column-type1 wide vtable offset'):
        category_name = category_div.find('div', class_='vcell').text.strip()
        stocks = []
        table = category_div.find_next_sibling('div', class_='column-type7 wmargin')
        stock_rows = table.find_all('div', class_='w-clearfix w-inline-block comp-row')
        stock_rows_even = table.find_all('div', class_='w-clearfix w-inline-block comp-row even')
        for stock_row in stock_rows:
            stock_data = {}
            code_element = stock_row.find('div', class_='comp-cell _02 vtable')
            name_element = stock_row.find('div', class_='comp-cell _03 vtable')
            
            if code_element and name_element:  # Her iki element de bulunuyorsa
                stock_data['code'] = code_element.find('a').text.strip()
                stock_data['name'] = name_element.find('a').text.strip()
                stocks.append(stock_data)
        for stock_row in stock_rows_even:
            stock_data = {}
            code_element = stock_row.find('div', class_='comp-cell _02 vtable')
            name_element = stock_row.find('div', class_='comp-cell _03 vtable')
            
            if code_element and name_element:  # Her iki element de bulunuyorsa
                stock_data['code'] = code_element.find('a').text.strip()
                stock_data['name'] = name_element.find('a').text.strip()
                stocks.append(stock_data)
        
        # Sıralama işlemi
        stocks.sort(key=lambda x: x['code'])  # 'code' parametresine göre sıralama
        dataList.append({'category': category_name, 'stocks': stocks})
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
    file_path = os.path.join(storage_dir, 'stocksInSectors.json') 
    
    # JSON verisini bir dosyaya kaydedin
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=4, ensure_ascii=False)
    
    print("Data successfully extracted and saved to stocksInSectors.json")
except Exception as e:
    print(f"An error occurred: {e}")
import requests
from bs4 import BeautifulSoup
import json
import sys
import os

def extract_data_from_html(html_content):

    soup = BeautifulSoup(html_content, 'html.parser')

    index_type_a_list = soup.find_all('a', class_='w-inline-block sub-leftresultbox')

    dataList = []

    for index_type_a in index_type_a_list:
        data = {}
        
        data['code'] = index_type_a.find_all('div', class_='type-normal')[1].text.strip()
        data['name'] = index_type_a.find_all('div', class_='type-normal')[0].text.strip()
        dataList.append(data)
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
    file_path = os.path.join(storage_dir, 'indexes.json') 

    # JSON verisini belirtilen dosya yoluna kaydedin
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=4, ensure_ascii=False)
    
    print("Data successfully extracted and saved to indexes.json")
except Exception as e:
    print(f"An error occurred: {e}")
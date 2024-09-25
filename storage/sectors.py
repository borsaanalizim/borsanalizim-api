import requests
from bs4 import BeautifulSoup
import json
import sys
import os

def extract_data_from_html(html_content):

    soup = BeautifulSoup(html_content, 'html.parser')

    index_type_a_list = soup.find_all('a', class_='column-typeHeader')

    dataList = []

    for main_category in index_type_a_list:
        main_category_id = main_category.get('id')
        main_category_name = main_category.find('div', class_='vcell').text.strip()
        category_data = {
          "mainCategory": main_category_name
        }
        sub_categories = []
        for sub_category in soup.find_all('a', class_='sec-leftresultbox'):
          sub_category_id = sub_category.get('id')
          if sub_category_id.startswith(main_category_id):
            sub_category_name = sub_category.find('div', class_='type-normal bold').text.strip()
            sub_categories.append(sub_category_name)

        category_data["subCategories"] = sub_categories
        dataList.append(category_data)
        
    return dataList

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
    file_path = os.path.join(storage_dir, 'sectors.json') 
    
    # JSON verisini bir dosyaya kaydedin
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=4, ensure_ascii=False)
    
    print("Data successfully extracted and saved to sectors.json")
except Exception as e:
    print(f"An error occurred: {e}")
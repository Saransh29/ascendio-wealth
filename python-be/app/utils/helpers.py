import requests
from bs4 import BeautifulSoup

def get_article_text(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        article_text = ' '.join([p.get_text() for p in soup.find_all('p')])
        return article_text
    except Exception as e:
        print(f"Error in get_article_text for {url}: {str(e)}")
        return "Error retrieving article text."

import sys
import requests
import json
from bs4 import BeautifulSoup


def main():

    # git link available in argv[1]
    git_link = sys.argv[1]

    try:
        response = requests.get(git_link)
        soup = BeautifulSoup(response.text, "html.parser")

        repo_name = soup.find(class_='repohead').find(
            'strong', attrs={"itemprop": "name"}).find('a')['href'][1:].split('/')

        star_count = soup.find(class_='pagehead-actions').find_all(
            'li')[1].find(class_="js-social-count")['aria-label'].split(' ')[0]

        response_obj = {
            'repository': repo_name,
            'star': star_count
        }
        sys.stdout.write(json.JSONEncoder().encode(response_obj))

    except:
        response_obj = {
            'error': "Invalid URL supplied"
        }
        sys.stderr.write(json.JSONEncoder().encode(response_obj))
        sys.exit(1)


if __name__ == "__main__":
    main()

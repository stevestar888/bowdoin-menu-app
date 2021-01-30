import requests

#20200908 20200908
date = '20210116'
meal = 'dinner'

r1 = requests.post("https://apps.bowdoin.edu/orestes/api.jsp", data={'un': 48, 'date': date, 'meal': meal, 'tra': "guide"})
r2 = requests.post("https://apps.bowdoin.edu/orestes/api.jsp", data={'un': 49, 'date': date, 'meal': meal, 'tra': "guide"})

print(r1.text)
print(r2.text)




# from urllib.parse import urlencode
# from urllib.request import Request, urlopen

# url = 'https://apps.bowdoin.edu/orestes/api.jsp' # Set destination URL here
# post_fields = {'un': 48, 'date': '20210131', 'meal': 'dinner', 'tra': "guide"}     # Set POST fields here

# request = Request(url, urlencode(post_fields).encode())
# json = urlopen(request).read().decode()
# print(json)
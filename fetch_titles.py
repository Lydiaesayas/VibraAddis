import urllib.request
import re

urls = [
    'https://www.instagram.com/reel/DY5MIqPAxq0/?igsh=MWIwc3VlMTZoanR2eQ==',
    'https://www.instagram.com/reel/DZkqq5WKxZI/?igsh=MWs0MDVvZ2dvZDA3ag==',
    'https://www.instagram.com/reel/DZRP5fUomFB/?igsh=MjVpMTZvZ2pjOHpk',
    'https://www.instagram.com/reel/DY86A2zMGCF/?igsh=cnM3Zzc5ZnA5cHMy',
    'https://www.instagram.com/reel/DZkuTN1M3ua/?igsh=dHl4a3d5cnh0NzZ4',
    'https://www.instagram.com/reel/DZaYexcMH3b/?igsh=NHp5MXdxOWVzZXp3',
    'https://www.tiktok.com/@blackroselounge/video/7640807706382667026',
    'https://www.instagram.com/p/DZXv8TPDLeb/?igsh=MTJzeTE4ZmttZ3l6Mg==',
    'https://www.instagram.com/reel/DY9Hio5I43m/?igsh=MnU5bDRzaTFiemty',
    'https://www.instagram.com/reel/DYrwus3iih1/?igsh=ejRjODA3amQwYW4x',
    'https://www.instagram.com/reel/DDi0yAGo94i/?igsh=MWtrZGQzY3F6eXFnag==',
    'https://www.instagram.com/reel/DXaDIXXiDOt/?igsh=MWxhMGpxeGdvNW5uMw==',
    'https://www.instagram.com/reel/DYlJr3Jq_OQ/?igsh=MTYxbGp1d2NhYzVmMg==',
    'https://www.instagram.com/p/DZG9ybggGLa/?igsh=cm9qNnk1d3Rzejdl',
    'https://www.instagram.com/p/DBLTngNoMoX/?igsh=aDk4c2E5cnpvYXBv',
    'https://www.instagram.com/reel/DXj3oMMjRWv/?igsh=NTVrOHdnMHUxMGpx',
    'https://www.instagram.com/p/DYhuttxDjYM/?igsh=N2lycXRyYmNlZWxw',
    'https://www.instagram.com/reel/CyYAa1EIMWb/?igsh=OTJ3aTZuZDYwc2R1',
    'https://www.instagram.com/reel/DY71j5WCWLJ/?igsh=d3U2Y2lqazlwMjhr',
    'https://www.instagram.com/reel/DYkQq0HgNyl/?igsh=MWJscnBrYWs2bTVxaw==',
    'https://www.instagram.com/reel/DZGTwdrtL5N/?igsh=MWp4aHFoazFxczRuZA==',
    'https://www.instagram.com/reel/DRzlTsUjDfS/?igsh=a25waXVzcTVmbzNn',
    'https://www.instagram.com/reel/DY4I_n2s6XM/?igsh=MWN3dHJjaGh1cDFuMg==',
    'https://www.instagram.com/stories/thecageaddis/3910915784969429919',
    'https://www.instagram.com/reel/DZD0QTLgRy-/?igsh=aTdkZ2p2dm1qbzh5'
]

for i, url in enumerate(urls):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8')
        title = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
        print(f'{i+1}. {title.group(1) if title else "No title"}')
    except Exception as e:
        print(f'{i+1}. Error: {e}')

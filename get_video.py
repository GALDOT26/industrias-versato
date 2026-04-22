import urllib.request, re, json

url = 'https://www.vizzano.com.br/es/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    
    # Looking for Elementor background videos or any video links
    links = re.findall(r'https?://[^\s"\']+?\.mp4', html)
    print("MP4 Links:", set(links))
    
    # Looking for iframe srcs
    iframes = re.findall(r'<iframe[^>]+src=["\']([^"\']+)["\']', html)
    print("Iframes:", set(iframes))
    
    # Look for any JSON or settings containing "video"
    # Just grab all URLs and filter them
    all_urls = re.findall(r'https?://[^\s"\']+', html)
    video_related = [u for u in all_urls if 'video' in u.lower() or 'youtube' in u.lower() or 'vimeo' in u.lower()]
    print("Video-related URLs:", set(video_related))
except Exception as e:
    print("Error:", e)

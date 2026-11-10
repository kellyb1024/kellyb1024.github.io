import re, time
t=open('index.template.html',encoding='utf-8').read()
ring=open('ring.html',encoding='utf-8').read()
strip_imgs=['assets/strip/hw-home.jpg','assets/booth/0016.jpg','assets/shots/gw-m.jpg','assets/brand/tempus/lb2.jpg','assets/brand/burock/shark.png','assets/brand/cozy/c2.jpg','assets/shots/a4e-m.jpg','assets/brand/burock/site-m.jpg','assets/brand/tempus/fwg1.jpg','assets/shots/sunic-d.jpg','assets/strip/hw-chat.jpg','assets/brand/burock/sheet_Seagull.jpg','assets/brand/tempus/ss05.jpg','assets/strip/hw-scrap.jpg','assets/brand/burock/mackerel.png','assets/brand/tempus/lb5.jpg','assets/brand/burock/seagull.png','assets/brand/tempus/fwg5.jpg']
strip=''.join(f'<img src="{s}" alt="" height="150" loading="lazy">' for s in strip_imgs*2)
v=str(int(time.time()))
out=t.replace('{{RING}}',ring).replace('{{STRIP}}',strip)
for f in ['style.css','main.js','fitphone.js','base.css','base.js','light.css','swipe.js']:
    out=out.replace('"'+f+'"','"'+f+'?v='+v+'"').replace("'"+f+"'","'"+f+'?v='+v+"'")
open('index.html','w',encoding='utf-8').write(out)

# 케이스 상세 페이지 (cases/*.html 조각 → 최상위 html)
import glob, os
head=t[:t.index('<body')]
for part in sorted(glob.glob('cases/*.html')):
    name=os.path.splitext(os.path.basename(part))[0]
    body=open(part,encoding='utf-8').read()
    title=re.search(r'<!-- title: (.*?) -->',body).group(1)
    body=re.sub(r'<!-- title: .*? -->\n','',body)
    h=head.replace('<title>배경진 Kyungjin Bae — Product Designer</title>',f'<title>{title}, 배경진</title>')
    h=h.replace('content="배경진 Kyungjin Bae, Product Designer"',f'content="{title}, 배경진 Kyungjin Bae"',1)
    h=h.replace('content="https://kellyb1024.github.io/"',f'content="https://kellyb1024.github.io/{name}.html"',1)
    page=(h+'<body data-lens="design" class="case-page">\n'
      '  <header class="bar">\n    <a class="wordmark" href="index.html">배경진 <span>Kyungjin Bae</span></a>\n'
      '    <nav aria-label="주요 메뉴">\n      <a href="index.html#index-title">프로젝트</a>\n      <a href="index.html#experience">이력</a>\n'
      '      <a class="bar-action" href="index.html#contact">연락하기</a>\n    </nav>\n  </header>\n'
      f'  <main id="top" class="case-main">\n    <a class="case-back" href="index.html#{name}">메인으로 돌아가기</a>\n'+body+
      '  </main>\n  <script src="base.js"></script>\n  <script src="main.js"></script>\n  <script src="fitphone.js"></script><script src="swipe.js"></script>\n</body>\n</html>\n')
    for f in ['style.css','main.js','fitphone.js','base.css','base.js','light.css','swipe.js']:
        page=page.replace('"'+f+'"','"'+f+'?v='+v+'"').replace("'"+f+"'","'"+f+'?v='+v+"'")
    open(name+'.html','w',encoding='utf-8').write(page)

import re, time, glob, os
strip_imgs=['assets/strip/hw-home.jpg','assets/booth/0016.jpg','assets/shots/gw-m.jpg','assets/brand/tempus/lb2.jpg','assets/brand/burock/shark.png','assets/brand/cozy/c2.jpg','assets/shots/a4e-m.jpg','assets/brand/burock/site-m.jpg','assets/brand/tempus/fwg1.jpg','assets/shots/sunic-d.jpg','assets/strip/hw-chat.jpg','assets/brand/burock/sheet_Seagull.jpg','assets/brand/tempus/ss05.jpg','assets/strip/hw-scrap.jpg','assets/brand/burock/mackerel.png','assets/brand/tempus/lb5.jpg','assets/brand/burock/seagull.png','assets/brand/tempus/fwg5.jpg']
strip=''.join(f'<img src="{s}" alt="" height="150" loading="lazy">' for s in strip_imgs*2)
v=str(int(time.time()))
FILES=['style.css','main.js','fitphone.js','base.css','base.js','light.css','swipe.js','brand.css']
def ver(s):
    for f in FILES:
        s=s.replace('"'+f+'"','"'+f+'?v='+v+'"').replace("'"+f+"'","'"+f+'?v='+v+"'")
    return s
def up(s):
    # en/ 폴더용: 공용 에셋, CSS, JS 경로 앞에 ../
    return re.sub(r'((?:src|href|poster)=")(assets/|(?:base|style|brand|light)\.css|(?:main|base|fitphone|swipe)\.js)', r'\1../\2', s)

LANG={
 'ko':dict(tpl='index.template.html', ring='ring.html', cases='cases', out='',
   title_old='<title>배경진 Kyungjin Bae — Product Designer</title>', title_new='<title>{t}, 배경진</title>',
   og_old='content="배경진 Kyungjin Bae, Product Designer"', og_new='content="{t}, 배경진 Kyungjin Bae"',
   url_old='content="https://kellyb1024.github.io/"', url_new='content="https://kellyb1024.github.io/{n}.html"',
   word='배경진 <span>Kyungjin Bae</span>', nav='주요 메뉴', proj='프로젝트', exp='이력', contact='연락하기',
   mail='%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%EB%A5%BC%20%EB%B3%B4%EA%B3%A0%20%EC%97%B0%EB%9D%BD%EB%93%9C%EB%A0%A4%EC%9A%94',
   back='메인으로 돌아가기', other='en/{n}.html', other_index='en/', other_label='EN', other_lang='en'),
 'en':dict(tpl='i18n/en/index.template.html', ring='i18n/en/ring.html', cases='i18n/en/cases', out='en/',
   title_old='<title>Kyungjin Bae, Product Designer</title>', title_new='<title>{t}, Kyungjin Bae</title>',
   og_old='content="Kyungjin Bae, Product Designer"', og_new='content="{t}, Kyungjin Bae"',
   url_old='content="https://kellyb1024.github.io/en/"', url_new='content="https://kellyb1024.github.io/en/{n}.html"',
   word='Kyungjin Bae <span>배경진</span>', nav='Main menu', proj='Projects', exp='Experience', contact='Contact',
   mail='Reaching%20out%20about%20your%20portfolio',
   back='Back to main', other='../{n}.html', other_index='../', other_label='KO', other_lang='ko'),
}

for lang,L in LANG.items():
    fix=(up if lang=='en' else (lambda s:s))
    if L['out']: os.makedirs(L['out'],exist_ok=True)
    t=open(L['tpl'],encoding='utf-8').read().replace('{{KO}}',L['other_index'])
    ring=open(L['ring'],encoding='utf-8').read()
    out=t.replace('{{RING}}',ring).replace('{{STRIP}}',strip)
    open(L['out']+'index.html','w',encoding='utf-8').write(fix(ver(out)))
    head=t[:t.index('<body')]
    for part in sorted(glob.glob(L['cases']+'/*.html')):
        name=os.path.splitext(os.path.basename(part))[0]
        body=open(part,encoding='utf-8').read()
        title=re.search(r'<!-- title: (.*?) -->',body).group(1)
        body=re.sub(r'<!-- title: .*? -->\n','',body)
        h=head.replace(L['title_old'],L['title_new'].format(t=title))
        h=h.replace(L['og_old'],L['og_new'].format(t=title),1)
        h=h.replace(L['url_old'],L['url_new'].format(n=name),1)
        other=L['other'].format(n=name)
        page=(h+'<body data-lens="design" class="case-page">\n'
          f'  <header class="bar">\n    <a class="wordmark" href="index.html">{L["word"]}</a>\n'
          f'    <nav aria-label="{L["nav"]}">\n      <a href="index.html#index-title">{L["proj"]}</a>\n      <a href="index.html#experience">{L["exp"]}</a>\n'
          f'      <a class="lang" href="{other}" lang="{L["other_lang"]}" hreflang="{L["other_lang"]}">{L["other_label"]}</a>\n'
          f'      <a class="bar-action" href="mailto:jinnykj0218@gmail.com?subject={L["mail"]}">{L["contact"]}</a>\n    </nav>\n  </header>\n'
          f'  <main id="top" class="case-main">\n    <a class="case-back" href="index.html#{name}">{L["back"]}</a>\n'+body+
          '  </main>\n  <script src="base.js"></script>\n  <script src="main.js"></script>\n  <script src="fitphone.js"></script><script src="swipe.js"></script>\n</body>\n</html>\n')
        open(L['out']+name+'.html','w',encoding='utf-8').write(fix(ver(page)))

# 브랜드 스토리 (영문): i18n/en/*.html → en/*.html
for name in ['burock','tempus','cozy','whynot']:
    s=open(f'i18n/en/{name}.html',encoding='utf-8').read().replace('{{KO}}',f'../{name}.html')
    open(f'en/{name}.html','w',encoding='utf-8').write(up(ver(s)))

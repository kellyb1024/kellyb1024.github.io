import re, time
t=open('index.template.html',encoding='utf-8').read()
ring=open('ring.html',encoding='utf-8').read()
strip_imgs=['assets/strip/hw-home.jpg','assets/booth/0016.jpg','assets/shots/gw-m.jpg','assets/brand/tempus/lb2.jpg','assets/brand/burock/shark.png','assets/brand/cozy/c2.jpg','assets/shots/a4e-m.jpg','assets/brand/burock/site-m.jpg','assets/brand/tempus/fwg1.jpg','assets/shots/sunic-d.jpg','assets/strip/hw-chat.jpg','assets/brand/burock/sheet_Seagull.jpg','assets/brand/tempus/ss05.jpg','assets/strip/hw-scrap.jpg','assets/brand/burock/mackerel.png','assets/brand/tempus/lb5.jpg','assets/brand/burock/seagull.png','assets/brand/tempus/fwg5.jpg']
strip=''.join(f'<img src="{s}" alt="" height="150" loading="lazy">' for s in strip_imgs*2)
v=str(int(time.time()))
out=t.replace('{{RING}}',ring).replace('{{STRIP}}',strip)
for f in ['style.css','main.js','fitphone.js','base.css','base.js','light.css']:
    out=out.replace('"'+f+'"','"'+f+'?v='+v+'"').replace("'"+f+"'","'"+f+'?v='+v+"'")
open('index.html','w',encoding='utf-8').write(out)

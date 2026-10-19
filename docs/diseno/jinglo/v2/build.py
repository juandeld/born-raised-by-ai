#!/usr/bin/env python3
"""Inlines images/audio and hand-cut edges into a single self-contained landing.html."""
import re,base64,random,os
here=os.path.dirname(os.path.abspath(__file__))
pub=os.path.join(here,"../../../../apps/web/public")
FILL={"night":"#13233f","paper":"#e9dcbd"}
def uri(path,mime): return f"data:{mime};base64,"+base64.b64encode(open(path,"rb").read()).decode()
def edge_h(seed,fill,cls,cut_top=True,n=26):
    r=random.Random(seed);pts=[];x=0
    W=1200
    d="M0 34 L0 %d "%(10+r.random()*10)
    while x<W:
        w=W/n*(.6+r.random()*.8);y=3+r.random()*20
        d+="Q %d %d %d %d "%(x+w/2,y-8-r.random()*8,x+w,6+r.random()*16);x+=w
    d+="L1200 34 Z"
    return f'<svg class="edge {cls}" viewBox="0 0 1200 34" preserveAspectRatio="none" fill="{fill}" aria-hidden="true"><path d="{d}"/></svg>'
def edge_v(seed,fill):
    r=random.Random(seed);H=1200;d="M0 0 ";y=0
    while y<H:
        h=H/26*(.6+r.random()*.8);x=3+r.random()*20
        d+="Q %d %d %d %d "%(x-8-r.random()*8,y+h/2,6+r.random()*16,y+h);y+=h
    d+="L0 %d Z"%H
    return f'<svg class="edge v" viewBox="0 0 34 1200" preserveAspectRatio="none" fill="{fill}" aria-hidden="true"><path d="{d}" transform="translate(0 0) scale(1 1)"/></svg>'
s=open(os.path.join(here,"src/landing.src.html")).read()
s=re.sub(r"\{\{img:(\w+)\}\}",lambda m:uri(f"{pub}/jinglo/{m[1]}.webp","image/webp"),s)
s=s.replace("{{audio}}",uri(f"{pub}/audio/jinglo-santa-es.mp3","audio/mpeg"))
def E(m):
    seed,col,pos=m[1],m[2],m[3]
    if seed=="hero": return edge_h(1,FILL[col],"h")+edge_v(2,FILL[col])
    if pos=="rtl": return edge_h(seed,FILL[col],"b")
    return edge_h(seed,FILL[col],"top")
s=re.sub(r"\{\{edge:(\w+):(\w+):(\w+)\}\}",E,s)
open(os.path.join(here,"landing.html"),"w").write(s)
print(len(s)//1024,"KB")

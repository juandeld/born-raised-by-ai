from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys
F='/home/claude/jinglo/fonts/'
W,H=720,1280
nombre=sys.argv[1] if len(sys.argv)>1 else 'Sofía'
logro=sys.argv[2] if len(sys.argv)>2 else 'aprendió a andar en bicicleta'

def gold_text(txt, font, size, center, out, glow=True, maxw=520):
    f=ImageFont.truetype(F+font,size)
    d=ImageDraw.Draw(Image.new('L',(1,1)))
    while d.textlength(txt,font=f)>maxw and size>40:
        size-=4; f=ImageFont.truetype(F+font,size)
    img=Image.new('RGBA',(W,H),(0,0,0,0))
    mask=Image.new('L',(W,H),0); md=ImageDraw.Draw(mask)
    md.text(center,txt,font=f,fill=255,anchor='mm')
    # gold gradient
    grad=Image.new('RGBA',(W,H))
    gd=ImageDraw.Draw(grad)
    y0=center[1]-size; y1=center[1]+size
    for y in range(H):
        t=min(1,max(0,(y-y0)/max(1,(y1-y0))))
        c=(int(246-60*t),int(214-80*t),int(120-70*t),255)
        gd.line([(0,y),(W,y)],fill=c)
    if glow:
        g=mask.filter(ImageFilter.GaussianBlur(10))
        glowimg=Image.new('RGBA',(W,H),(255,200,90,0)); glowimg.putalpha(g.point(lambda v:int(v*0.55)))
        img=Image.alpha_composite(img,glowimg)
    shadow=Image.new('RGBA',(W,H),(60,35,10,0)); shadow.putalpha(mask.filter(ImageFilter.GaussianBlur(2)).point(lambda v:int(v*0.6)))
    img=Image.alpha_composite(img,shadow.transform((W,H),Image.AFFINE,(1,0,-2,0,1,-3)))
    txtl=grad.copy(); txtl.putalpha(mask)
    img=Image.alpha_composite(img,txtl)
    img.save(out)

# 1) name on the book page (V1-03)
gold_text(nombre,'pinyon-script.ttf',120,(352,520),'ov/nombre.png',maxw=470)

# 2) handwriting on the letter (V1-05): graphite/blue, child-family hand
img=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
f=ImageFont.truetype(F+'caveat.ttf',46)
lines=['Querido Santa:', f'{nombre} {logro.split(" ",2)[0]} {logro.split(" ",2)[1] if len(logro.split())>1 else ""}'.strip(), ' '.join(logro.split()[2:])+'. ♥' if len(logro.split())>2 else '♥']
# smarter wrap
words=(f'{nombre} {logro}.').split()
wrapped=[];cur=''
for w in words:
    t=(cur+' '+w).strip()
    if d.textlength(t,font=f)>400: wrapped.append(cur); cur=w
    else: cur=t
wrapped.append(cur)
lines=['Querido Santa:']+wrapped
y=568
for i,l in enumerate(lines):
    d.text((214+ (8 if i else 0), y), l, font=f, fill=(38,52,92,235), anchor='ls')
    y+=62
img=img.filter(ImageFilter.GaussianBlur(0.6))
img.save('ov/carta.png')

# 3) closing title (V1-09)
gold_text(f'¡Feliz Navidad,','great-vibes.ttf',92,(360,560),'ov/titulo1.png',maxw=620)
gold_text(f'{nombre}!','great-vibes.ttf',120,(360,680),'ov/titulo2.png',maxw=600)
t1=Image.open('ov/titulo1.png'); t2=Image.open('ov/titulo2.png')
Image.alpha_composite(t1,t2).save('ov/titulo.png')
print('ok')

import subprocess, os, glob
C='/home/claude/jinglo/clips/'; V='/home/claude/jinglo/voz/tramos/'
def clip(p): return glob.glob(C+p+'-*.mp4')[0]
def run(cmd): subprocess.run(cmd, check=True)
os.makedirs('seg',exist_ok=True)
AMB=0.18  # ambient level from the generated clips (fire crackle)
VF='scale=720:1280,fps=24,format=yuv420p'

def seg(name, src, ss, dur, voices=(), overlays=(), extra_v='', slow=None, freeze=0):
    """voices: [(wav, start)], overlays: [(png, t_in, t_out or None)]"""
    inputs=['-ss',str(ss),'-t',str(dur),'-i',clip(src)]
    for w,_ in voices: inputs+=['-i',V+w]
    for o,_,_ in overlays: inputs+=['-loop','1','-i','ov/'+o]
    fc=[]; vlabel='[0:v]'
    v=f'{vlabel}{VF}'
    if slow: v+=f',setpts={slow}*PTS'
    if freeze: v+=f',tpad=stop_mode=clone:stop_duration={freeze}'
    if extra_v: v+=','+extra_v
    fc.append(v+'[v0]'); cur='v0'
    total=dur*(slow or 1)+freeze
    nv=len(voices)
    for k,(o,tin,tout) in enumerate(overlays):
        idx=1+nv+k
        fade=f'fade=in:st={tin}:d=0.9:alpha=1'
        if tout: fade+=f',fade=out:st={tout}:d=0.6:alpha=1'
        fc.append(f'[{idx}:v]format=rgba,{fade}[o{k}]')
        fc.append(f'[{cur}][o{k}]overlay=0:0:shortest=1[v{k+1}]'); cur=f'v{k+1}'
    # audio
    a=f'[0:a]aresample=44100,aformat=channel_layouts=stereo,volume={AMB}'
    if slow: a+=f',atempo={1/slow:.4f}'
    a+=f',apad=whole_dur={total}[amb]'
    fc.append(a); mix=['[amb]']
    for k,(w,st) in enumerate(voices):
        fc.append(f'[{1+k}:a]aresample=44100,aformat=channel_layouts=stereo,adelay={int(st*1000)}:all=1,apad=whole_dur={total}[vo{k}]'); mix.append(f'[vo{k}]')
    fc.append(''.join(mix)+f'amix=inputs={len(mix)}:normalize=0:duration=first,atrim=0:{total}[a]')
    run(['ffmpeg','-hide_banner','-loglevel','error','-y',*inputs,'-filter_complex',';'.join(fc),
         '-map',f'[{cur}]','-map','[a]','-t',f'{total}','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',
         '-c:a','aac','-b:a','192k','-ar','44100',f'seg/{name}.mp4'])
    print(name, total)

seg('01','652f3d0f',0,7.4,[('T1.wav',0.0)])
seg('02','920d4361',0.3,6.4,[('T2.wav',0.0)])
seg('03','ae0a218f',0,8.0,[('T3a-aver.wav',0.4),('T3b-nombre.wav',3.7)],[('nombre.png',3.6,None)])
seg('04','4f3dc75f',0,4.2)
seg('05','fe4aeb22',0,8.0,[('T4.wav',0.5)])
seg('06','371713da',0,8.0,[('T5a-carta.wav',0.3),('T5b-logro.wav',2.8),('T6.wav',7.4)],[('carta.png',3.0,None)],freeze=2.6)
# 07: second book take, slow the book-up part so T7 fits behind the book
seg('07a','020ee288',0,4.4,[('T7.wav',0.15)],slow=1.72)
seg('07b','020ee288',4.4,3.6)
seg('08','625e8c87',1.6,3.2)
seg('09','9bf6ba58',0,8.0,[('T8.wav',0.2)],[('titulo.png',5.4,None)],
    extra_v="eq=brightness='if(gte(t,5.0),-0.18*min(1,(t-5.0)/0.8),0)':eval=frame")

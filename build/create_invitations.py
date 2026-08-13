from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import qrcode, cv2
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

root = Path(__file__).resolve().parents[1]
out = root / "docs" / "invitations"
out.mkdir(parents=True, exist_ok=True)
photo_path = root / "docs" / "media" / "talent-night" / "hero-folkloric-dancers.webp"
url = "https://avellenemaria.github.io/family-home-evening-garner-2/"
bold = Path("C:/Windows/Fonts/seguibl.ttf")
semi = Path("C:/Windows/Fonts/seguisb.ttf")
regular = Path("C:/Windows/Fonts/segoeui.ttf")

qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=14, border=4)
qr.add_data(url); qr.make(fit=True)
qr_img = qr.make_image(fill_color="#183d36", back_color="white").convert("RGB")
qr_img.save(out / "talent-night-qr.png")

def font(path, size): return ImageFont.truetype(str(path), size)
def fit_text(draw, text, box_width, path, start, minimum=20):
    size=start
    while size>minimum:
        f=font(path,size)
        if draw.textbbox((0,0),text,font=f)[2] <= box_width: return f
        size-=2
    return font(path,minimum)
def centered(draw, text, y, f, fill, width):
    box=draw.textbbox((0,0),text,font=f); draw.text(((width-(box[2]-box[0]))/2,y),text,font=f,fill=fill)

def design(width, height, dest, print_mode=False):
    cream="#fff6e5"; coral="#d94f3d"; gold="#f4b942"; teal="#1f6f65"; ink="#203a34"
    im=Image.new("RGB",(width,height),cream); d=ImageDraw.Draw(im)
    margin=int(width*.06); photo_h=int(height*.39)
    with Image.open(photo_path) as p:
        p=ImageOps.fit(p.convert("RGB"),(width,photo_h),method=Image.Resampling.LANCZOS,centering=(.5,.52))
        im.paste(p,(0,0))
    d.rectangle((0,0,width,int(height*.055)),fill=coral)
    centered(d,"RAMA GARNER 2 PRESENTA",int(height*.014),font(semi,int(width*.025)),"white",width)
    overlay=Image.new("RGBA",(width,int(photo_h*.48)),(23,52,46,185)); im.paste(overlay,(0,photo_h-overlay.height),overlay)
    y=int(photo_h*.58)
    centered(d,"NOCHE DE TALENTOS",y,font(bold,int(width*.065)),"white",width); y+=int(width*.073)
    centered(d,"DE LA COMUNIDAD",y,font(bold,int(width*.065)),gold,width); y+=int(width*.072)
    centered(d,"Community Talent Night",y,font(semi,int(width*.032)),"white",width)
    content_y=photo_h+int(height*.025)
    centered(d,"¡Ven a compartir tu talento o disfruta del espectáculo!",content_y,fit_text(d,"¡Ven a compartir tu talento o disfruta del espectáculo!",width-2*margin,semi,int(width*.034)),coral,width)
    content_y+=int(height*.036)
    centered(d,"Come share your talent or enjoy the show!",content_y,font(regular,int(width*.023)),"#5c6f69",width)
    content_y+=int(height*.052)
    centered(d,"LUNES, 14 DE SEPTIEMBRE DE 2026",content_y,fit_text(d,"LUNES, 14 DE SEPTIEMBRE DE 2026",width-2*margin,bold,int(width*.038)),ink,width)
    content_y+=int(height*.038)
    centered(d,"Monday, September 14, 2026",content_y,font(regular,int(width*.024)),"#5c6f69",width)
    content_y+=int(height*.046)
    centered(d,"6:30 PM–8:00 PM",content_y,font(bold,int(width*.048)),teal,width)
    content_y+=int(height*.055)
    centered(d,"1433 AVERSBORO RD  •  GARNER, NC 27529",content_y,fit_text(d,"1433 AVERSBORO RD  •  GARNER, NC 27529",width-2*margin,bold,int(width*.032)),ink,width)
    content_y+=int(height*.048)
    centered(d,"TODAS LAS EDADES SON BIENVENIDAS",content_y,fit_text(d,"TODAS LAS EDADES SON BIENVENIDAS",width-2*margin,bold,int(width*.031)),coral,width)
    content_y+=int(height*.034)
    centered(d,"All ages welcome",content_y,font(regular,int(width*.022)),"#5c6f69",width)
    content_y+=int(height*.042)
    centered(d,"Invita a tu familia, amigos y vecinos.",content_y,font(semi,int(width*.027)),ink,width)
    content_y+=int(height*.032)
    centered(d,"Bring your family, friends, and neighbors.",content_y,font(regular,int(width*.021)),"#5c6f69",width)
    qr_size=int(width*(.22 if print_mode else .205)); qr_scaled=qr_img.resize((qr_size,qr_size),Image.Resampling.NEAREST)
    bottom=int(height*.965); qx=width-margin-qr_size; qy=bottom-qr_size
    im.paste(qr_scaled,(qx,qy))
    left=margin; label_y=qy+int(qr_size*.15)
    d.text((left,label_y),"DETALLES E INSCRIPCIÓN",font=font(bold,int(width*.032)),fill=teal)
    d.text((left,label_y+int(height*.034)),"Details & Sign-up",font=font(regular,int(width*.021)),fill="#5c6f69")
    short="avellenemaria.github.io/\nfamily-home-evening-garner-2/"
    d.multiline_text((left,label_y+int(height*.071)),short,font=font(semi,int(width*.020)),fill=ink,spacing=4)
    d.rectangle((0,height-int(height*.018),width,height),fill=gold)
    im.save(out/dest,quality=95,dpi=(300,300))

design(1080,1350,"talent-night-digital-1080x1350.png")
design(1200,1800,"talent-night-print-4x6.png",True)

pdf=out/"talent-night-print-4x6.pdf"
c=canvas.Canvas(str(pdf),pagesize=(4*inch,6*inch)); c.drawImage(str(out/"talent-night-print-4x6.png"),0,0,4*inch,6*inch); c.showPage(); c.save()
sheet=out/"talent-night-print-sheet-letter.pdf"
c=canvas.Canvas(str(sheet),pagesize=letter)
for x in (.25*inch,4.25*inch): c.drawImage(str(out/"talent-night-print-4x6.png"),x,2.5*inch,4*inch,6*inch)
c.setStrokeColorRGB(.65,.65,.65); c.setDash(3,3); c.line(4.25*inch,.3*inch,4.25*inch,10.7*inch); c.showPage(); c.save()

text=("🎉 *NOCHE DE TALENTOS DE LA COMUNIDAD*\nCommunity Talent Night\n\n"
      "📅 Lunes, 14 de septiembre de 2026 / Monday, September 14, 2026\n"
      "🕡 6:30 PM–8:00 PM\n📍 1433 Aversboro Rd, Garner, NC 27529\n\n"
      "¡Todas las edades son bienvenidas! Invita a tu familia, amigos y vecinos.\n"
      "All ages welcome! Bring your family, friends, and neighbors.\n\n"
      "Detalles e inscripción / Details & sign-up:\n"+url+"\n")
(out/"talent-night-text-invitation.txt").write_text(text,encoding="utf-8")

decoded,_,_=cv2.QRCodeDetector().detectAndDecode(cv2.imread(str(out/"talent-night-qr.png")))
assert decoded==url, (decoded,url)
print("QR verified:",decoded)

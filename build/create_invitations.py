from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

root = Path(__file__).resolve().parents[1]
out = root / "docs" / "invitations"
out.mkdir(parents=True, exist_ok=True)
photo_path = root / "docs" / "media" / "talent-night" / "hero-folkloric-dancers.webp"
url = "https://avellenemaria.github.io/family-home-evening-garner-2/"
display_url = "avellenemaria.github.io/\nfamily-home-evening-garner-2/"
bold = Path("C:/Windows/Fonts/seguibl.ttf")
semi = Path("C:/Windows/Fonts/seguisb.ttf")
regular = Path("C:/Windows/Fonts/segoeui.ttf")

qr_path = out / "talent-night-qr.png"
if not qr_path.exists():
    raise FileNotFoundError("Expected the verified QR asset at " + str(qr_path))
qr_img = Image.open(qr_path).convert("RGB")


def form_header():
    width, height = 1600, 400
    with Image.open(photo_path) as source:
        image = ImageOps.fit(source.convert("RGB"), (width, height), Image.Resampling.LANCZOS, centering=(.5, .43))
    shade = Image.new("RGBA", (width, height), (23, 55, 48, 150))
    image.paste(shade, (0, 0), shade)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 28, height), fill="#d94f3d")
    draw.text((82, 78), "NOCHE DE TALENTOS", font=font(bold, 86), fill="white")
    draw.text((82, 172), "DE LA COMUNIDAD", font=font(bold, 76), fill="#f4b942")
    draw.text((86, 278), "Community Talent Night", font=font(semi, 40), fill="white")
    image.save(out / "talent-night-google-form-header.png", quality=95)


def font(path, size):
    return ImageFont.truetype(str(path), size)


def centered(draw, text, y, face, fill, width):
    box = draw.textbbox((0, 0), text, font=face)
    draw.text(((width - (box[2] - box[0])) / 2, y), text, font=face, fill=fill)


def fit(draw, text, max_width, path, start, minimum):
    for size in range(start, minimum - 1, -2):
        face = font(path, size)
        if draw.textbbox((0, 0), text, font=face)[2] <= max_width:
            return face
    return font(path, minimum)


def design(width, height, destination, print_mode=False):
    cream, coral, gold, teal, ink, gray = "#fff6e5", "#d94f3d", "#f4b942", "#1f6f65", "#203a34", "#536963"
    image = Image.new("RGB", (width, height), cream)
    draw = ImageDraw.Draw(image)
    margin = int(width * .065)
    photo_h = int(height * .36)

    with Image.open(photo_path) as source:
        photo = ImageOps.fit(source.convert("RGB"), (width, photo_h), Image.Resampling.LANCZOS, centering=(.5, .48))
        image.paste(photo, (0, 0))
    draw.rectangle((0, 0, width, int(height * .05)), fill=coral)
    centered(draw, "RAMA GARNER 2 PRESENTA", int(height * .012), font(semi, int(width * .026)), "white", width)
    overlay = Image.new("RGBA", (width, int(photo_h * .55)), (20, 49, 43, 202))
    image.paste(overlay, (0, photo_h - overlay.height), overlay)

    title_size = int(width * (.077 if print_mode else .072))
    title_second_size = int(width * (.068 if print_mode else .064))
    english_size = int(width * (.035 if print_mode else .033))
    y = int(photo_h * .52)
    centered(draw, "NOCHE DE TALENTOS", y, font(bold, title_size), "white", width)
    y += int(width * .088)
    centered(draw, "DE LA COMUNIDAD", y, font(bold, title_second_size), gold, width)
    y += int(width * .078)
    centered(draw, "Community Talent Night", y, font(semi, english_size), "white", width)

    date_size = int(width * (.043 if print_mode else .040))
    detail_size = int(width * (.040 if print_mode else .037))
    time_size = int(width * (.058 if print_mode else .053))
    body_size = int(width * (.037 if print_mode else .034))
    english_body_size = int(width * (.030 if print_mode else .027))
    url_size = int(width * (.032 if print_mode else .028))
    y = photo_h + int(height * .025)
    centered(draw, "LUNES, 14 DE SEPTIEMBRE DE 2026", y, fit(draw, "LUNES, 14 DE SEPTIEMBRE DE 2026", width - 2 * margin, bold, date_size, 38), ink, width)
    y += int(height * .037)
    centered(draw, "Monday, September 14, 2026", y, font(regular, english_body_size), gray, width)
    y += int(height * .046)
    centered(draw, "6:30 PM–8:00 PM", y, font(bold, time_size), teal, width)
    y += int(height * .056)
    centered(draw, "1433 AVERSBORO RD", y, font(bold, detail_size), ink, width)
    y += int(height * .034)
    centered(draw, "GARNER, NC 27529", y, font(semi, detail_size), ink, width)
    y += int(height * .048)
    centered(draw, "¡TODOS SON BIENVENIDOS!", y, font(bold, body_size), coral, width)
    y += int(height * .034)
    centered(draw, "All are welcome!", y, font(regular, english_body_size), gray, width)
    y += int(height * .05)
    participation = "PRESENTACIÓN EN VIVO  •  EXHIBICIÓN DE TALENTOS  •  TALENTO CULINARIO"
    centered(draw, participation, y, fit(draw, participation, width - 2 * margin, semi, int(width * .026), 24), ink, width)

    qr_size = int(width * .245)
    qr_scaled = qr_img.resize((qr_size, qr_size), Image.Resampling.NEAREST)
    bottom = height - int(height * .036)
    qx, qy = width - margin - qr_size, bottom - qr_size
    image.paste(qr_scaled, (qx, qy))
    label_y = qy + int(qr_size * .08)
    draw.text((margin, label_y), "REGÍSTRATE O APRENDE MÁS:", font=font(bold, body_size), fill=teal)
    draw.text((margin, label_y + int(height * .04)), "Sign up or learn more:", font=font(regular, english_body_size), fill=gray)
    draw.multiline_text((margin, label_y + int(height * .085)), display_url, font=font(semi, url_size), fill=ink, spacing=int(height * .006))
    draw.rectangle((0, height - int(height * .016), width, height), fill=gold)
    image.save(out / destination, quality=95, dpi=(300, 300))

    return {
        "title_px": title_size,
        "date_px": date_size,
        "details_px": detail_size,
        "body_px": body_size,
        "url_px": url_size,
    }


design(1080, 1350, "talent-night-digital-1080x1350.png")
metrics = design(1200, 1800, "talent-night-print-4x6.png", True)
form_header()

card_pdf = out / "talent-night-print-4x6.pdf"
pdf_tmp = root / "tmp" / "pdfs"
pdf_tmp.mkdir(parents=True, exist_ok=True)
card_tmp = pdf_tmp / "talent-night-print-4x6.tmp.pdf"
c = canvas.Canvas(str(card_tmp), pagesize=(4 * inch, 6 * inch))
c.drawImage(str(out / "talent-night-print-4x6.png"), 0, 0, 4 * inch, 6 * inch)
c.showPage()
c.save()
card_tmp.replace(card_pdf)

sheet_pdf = out / "talent-night-print-sheet-letter.pdf"
sheet_tmp = pdf_tmp / "talent-night-print-sheet-letter.tmp.pdf"
c = canvas.Canvas(str(sheet_tmp), pagesize=letter)
for x in (.25 * inch, 4.25 * inch):
    c.drawImage(str(out / "talent-night-print-4x6.png"), x, 2.5 * inch, 4 * inch, 6 * inch)
c.setStrokeColorRGB(.65, .65, .65)
c.setDash(3, 3)
c.line(4.25 * inch, .3 * inch, 4.25 * inch, 10.7 * inch)
c.showPage()
c.save()
sheet_tmp.replace(sheet_pdf)

text = (
    "NOCHE DE TALENTOS DE LA COMUNIDAD\nCommunity Talent Night\n\n"
    "Lunes, 14 de septiembre de 2026\nMonday, September 14, 2026\n"
    "6:30 PM–8:00 PM\n1433 Aversboro Rd\nGarner, NC 27529\n\n"
    "¡Todos son bienvenidos!\nAll are welcome!\n\n"
    "Presentación en vivo • Exhibición de talentos • Talento culinario\n\n"
    "Regístrate o aprende más:\n" + url + "\n"
)
(out / "talent-night-text-invitation.txt").write_text(text, encoding="utf-8")

points = {key: round(value * 72 / 300, 1) for key, value in metrics.items()}
print("QR payload:", url)
print("4x6 print typography (points):", points)

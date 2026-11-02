"""Gera o PDF do relatório para a Mari a partir de um HTML deste modelo.

Uso: python3 render.py <entrada.html> <saida.pdf>
Requer playwright + Chromium. Falha se algum bloco invadir o rodapé.
"""
import os, sys
from playwright.sync_api import sync_playwright

src, out = sys.argv[1], sys.argv[2]
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto("file://" + os.path.abspath(src))
    pg.wait_for_timeout(2500)  # Google Fonts
    folgas = pg.evaluate("""[...document.querySelectorAll('.page')].map(pg => {
        const f = pg.querySelector('.foot'); if (!f) return null;
        let m = 0; pg.querySelectorAll(':scope > *:not(.foot)').forEach(e => { m = Math.max(m, e.getBoundingClientRect().bottom) });
        return Math.round(f.getBoundingClientRect().top - m) })""")
    fontes = pg.evaluate("document.fonts.check('12px \"Playfair Display\"')")
    pg.pdf(path=out, format="A4", print_background=True)
    b.close()
print("folga até o rodapé (px) por página:", folgas, "| fontes:", fontes)
if any(f is not None and f < 8 for f in folgas):
    sys.exit("ERRO: conteúdo invadindo o rodapé — encurtar texto ou espaçamentos")

r"""
extrair_texto.py
----------------
Extrai o texto puro de páginas web e salva cada página em um arquivo .txt
(ou .md, veja SALVAR_EM_MARKDOWN) dentro de docs\texto-do-site, usando o
TÍTULO da página como nome do arquivo.

Como usar (na raiz do projeto, com o ambiente virtual ativado):

    python scripts\extrair_texto.py
        -> o script pede as URLs no terminal

    python scripts\extrair_texto.py https://site1.com https://site2.com/pagina
        -> usa as URLs passadas direto no comando
"""

import html as html_lib
import re
import sys
import urllib.request
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

try:
    import trafilatura
except ImportError:
    print("ERRO: a biblioteca 'trafilatura' não está instalada.")
    print("Ative o ambiente virtual e rode:  pip install -r requirements.txt")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Configurações
# ---------------------------------------------------------------------------

# Pasta de saída: <raiz do projeto>\docs\texto-do-site
# Calculada a partir da localização deste script, então funciona mesmo que
# o comando seja executado de outra pasta.
PASTA_SAIDA = Path(__file__).resolve().parent.parent / "docs" / "texto-do-site"

# Se True, cada arquivo começa com Título, URL e data da extração.
# Mude para False se quiser só o texto, sem cabeçalho.
INCLUIR_CABECALHO = True

# Se True, salva em Markdown (.md), mantendo a hierarquia dos títulos das
# seções (# Título, ## Subtítulo...). Se False, salva em texto puro (.txt).
SALVAR_EM_MARKDOWN = False

# Tamanho máximo do nome do arquivo (sem a extensão)
TAMANHO_MAX_NOME = 100

# Abaixo disso, o script avisa que a página pode depender de JavaScript
MINIMO_CARACTERES_AVISO = 300

USER_AGENT_NAVEGADOR = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/128.0 Safari/537.36"
)

NOMES_RESERVADOS_WINDOWS = {
    "CON", "PRN", "AUX", "NUL",
    *(f"COM{i}" for i in range(1, 10)),
    *(f"LPT{i}" for i in range(1, 10)),
}


# ---------------------------------------------------------------------------
# Entrada de URLs
# ---------------------------------------------------------------------------

def separar_urls(texto: str) -> list[str]:
    """Aceita várias URLs na mesma linha, separadas por espaço, vírgula ou ponto e vírgula."""
    return [parte for parte in re.split(r"[\s,;]+", texto) if parte]


def pedir_urls() -> list[str]:
    print("Cole as URLs que deseja extrair (uma por linha ou várias na mesma linha).")
    print("Quando terminar, aperte Enter em uma linha vazia.\n")
    urls = []
    while True:
        try:
            linha = input("URL: ").strip()
        except EOFError:
            break
        if not linha:
            break
        urls.extend(separar_urls(linha))
    return urls


def normalizar_url(url: str) -> str:
    """Remove aspas/sinais soltos e adiciona https:// se estiver faltando."""
    url = url.strip().strip("\"'<>")
    if not re.match(r"^https?://", url, re.IGNORECASE):
        url = "https://" + url
    return url


# ---------------------------------------------------------------------------
# Download e extração
# ---------------------------------------------------------------------------

def baixar_html(url: str) -> str | None:
    """Baixa o HTML da página. Tenta primeiro pelo trafilatura e, se falhar,
    tenta de novo se identificando como um navegador comum."""
    html = trafilatura.fetch_url(url)
    if html:
        return html
    try:
        requisicao = urllib.request.Request(url, headers={"User-Agent": USER_AGENT_NAVEGADOR})
        with urllib.request.urlopen(requisicao, timeout=30) as resposta:
            charset = resposta.headers.get_content_charset() or "utf-8"
            return resposta.read().decode(charset, errors="replace")
    except Exception as erro:
        print(f"   Falha ao baixar: {erro}")
        return None


def extrair_texto(html: str, url: str) -> str | None:
    """Extrai o conteúdo principal da página, sem menus, rodapés e afins."""
    texto = trafilatura.extract(
        html,
        url=url,
        favor_recall=True,      # landing pages têm muitos blocos curtos; evita cortar seções
        include_tables=True,
        include_comments=False,
        output_format="markdown" if SALVAR_EM_MARKDOWN else "txt",
        include_formatting=SALVAR_EM_MARKDOWN,
    )
    if not texto:
        # Plano B: pega todo o texto visível da página, mesmo com um pouco de ruído
        texto = trafilatura.html2txt(html)
    return texto.strip() if texto else None


def obter_titulo(html: str, url: str) -> str:
    """Usa o título da página (o que aparece na aba do navegador).
    Se não houver, tenta os metadados; em último caso, usa o endereço."""
    titulo = ""
    encontrado = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    if encontrado:
        titulo = html_lib.unescape(encontrado.group(1))
    if not titulo.strip():
        try:
            metadados = trafilatura.extract_metadata(html, default_url=url)
            if metadados and metadados.title:
                titulo = metadados.title
        except Exception:
            pass
    if not titulo.strip():
        partes = urlparse(url)
        titulo = (partes.netloc + partes.path).strip("/")
    return " ".join(titulo.split())


# ---------------------------------------------------------------------------
# Nome e gravação do arquivo
# ---------------------------------------------------------------------------

def nome_de_arquivo(titulo: str) -> str:
    """Transforma o título em um nome de arquivo válido no Windows."""
    nome = re.sub(r"[:/\\|]", " - ", titulo)          # separadores comuns em títulos
    nome = re.sub(r'[<>"?*\x00-\x1f]', "", nome)      # caracteres proibidos no Windows
    nome = re.sub(r"\s+", " ", nome)
    nome = re.sub(r"(?:\s*-\s*){2,}", " - ", nome)     # evita "A - - B"
    nome = nome.strip(" .-")
    if len(nome) > TAMANHO_MAX_NOME:                   # corta sem quebrar palavras
        nome = nome[:TAMANHO_MAX_NOME]
        if " " in nome:
            nome = nome.rsplit(" ", 1)[0]
    nome = nome.rstrip(" .-")
    if not nome:
        nome = "pagina-sem-titulo"
    if nome.split(".")[0].upper() in NOMES_RESERVADOS_WINDOWS:
        nome = "_" + nome
    return nome


def url_gravada_no_arquivo(caminho: Path) -> str | None:
    """Lê a linha 'URL: ...' do cabeçalho de um arquivo já existente."""
    try:
        with caminho.open(encoding="utf-8") as arquivo:
            for _ in range(5):
                linha = arquivo.readline()
                if linha.startswith("URL: "):
                    return linha[5:].strip()
    except Exception:
        pass
    return None


def caminho_do_arquivo(nome: str, url: str) -> Path:
    """Se já existir um arquivo com o mesmo nome:
    - vindo da MESMA URL  -> sobrescreve (atualiza a extração);
    - vindo de OUTRA URL  -> cria 'Nome (2).txt', 'Nome (3).txt'...
    (a comparação usa o cabeçalho; com INCLUIR_CABECALHO = False, sempre numera)"""
    extensao = ".md" if SALVAR_EM_MARKDOWN else ".txt"
    candidato = PASTA_SAIDA / f"{nome}{extensao}"
    contador = 2
    while candidato.exists():
        if url_gravada_no_arquivo(candidato) == url:
            return candidato
        candidato = PASTA_SAIDA / f"{nome} ({contador}){extensao}"
        contador += 1
    return candidato


def salvar(caminho: Path, titulo: str, url: str, texto: str) -> None:
    linhas = []
    if INCLUIR_CABECALHO:
        linhas += [
            f"Título: {titulo}",
            f"URL: {url}",
            f"Extraído em: {datetime.now():%d/%m/%Y %H:%M}",
            "",
            "=" * 60,
            "",
        ]
    linhas.append(texto)
    caminho.write_text("\n".join(linhas) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# Programa principal
# ---------------------------------------------------------------------------

def main() -> None:
    PASTA_SAIDA.mkdir(parents=True, exist_ok=True)

    urls_digitadas = [u for arg in sys.argv[1:] for u in separar_urls(arg)] or pedir_urls()
    urls = list(dict.fromkeys(normalizar_url(u) for u in urls_digitadas))  # remove repetidas

    if not urls:
        print("Nenhuma URL informada. Nada a fazer.")
        return

    print(f"\n{len(urls)} URL(s) para processar.")
    print(f"Salvando em: {PASTA_SAIDA}\n")

    salvos, falhas = [], []
    for i, url in enumerate(urls, start=1):
        print(f"[{i}/{len(urls)}] {url}")
        try:
            html = baixar_html(url)
            if not html:
                falhas.append(url)
                continue

            texto = extrair_texto(html, url)
            if not texto:
                print("   Não foi possível extrair texto desta página.")
                falhas.append(url)
                continue

            titulo = obter_titulo(html, url)
            caminho = caminho_do_arquivo(nome_de_arquivo(titulo), url)
            salvar(caminho, titulo, url, texto)
            salvos.append(caminho)

            caracteres = f"{len(texto):,}".replace(",", ".")
            print(f"   OK -> {caminho.name} ({caracteres} caracteres)")
            if len(texto) < MINIMO_CARACTERES_AVISO:
                print("   Aviso: pouco texto extraído. A página pode carregar o conteúdo via JavaScript.")
        except Exception as erro:
            print(f"   Erro inesperado: {erro}")
            falhas.append(url)

    print("\n" + "-" * 60)
    print(f"Concluído: {len(salvos)} salvo(s), {len(falhas)} com falha.")
    if falhas:
        print("URLs com falha:")
        for url in falhas:
            print(f"   - {url}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nCancelado pelo usuário.")

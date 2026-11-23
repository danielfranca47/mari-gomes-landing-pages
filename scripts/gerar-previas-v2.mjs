// Gera as 6 prévias <slug>-v2/index.html a partir de <slug>/index.html + noindex + trava -v2 + bloco AD ATTRIBUTION.
// Uso: node scripts/gerar-previas-v2.mjs [--ref <commit>]   (o padrão lê o <slug>/index.html do disco)
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const slugs = ['holistic-energy-massage-en', 'holistic-energy-massage-nl', 'relaxation-massage-en', 'relaxation-massage-nl', 'couples-massage-en', 'couples-massage-nl'];
const ref = process.argv.includes('--ref') ? process.argv[process.argv.indexOf('--ref') + 1] : null;
const bloco = fs.readFileSync(new URL('./atribuicao-bloco.html', import.meta.url), 'utf8');
const LEAD = `document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
  link.addEventListener('click', function () {
    gtag('event', 'conversion', { 'send_to': 'AW-18036442650/9rp5CIvso6QcEJqMuZhD' });
  });
});`;
const LEAD_V2 = `// Prévia -v2: sem conversão de lead (teste da Mari não pode gerar conversão falsa). Removido na promoção.
if (!/-v2\\//.test(location.pathname)) {
document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
  link.addEventListener('click', function () {
    gtag('event', 'conversion', { 'send_to': 'AW-18036442650/9rp5CIvso6QcEJqMuZhD' });
  });
});
}`;
for (const slug of slugs) {
  const src = ref ? execFileSync('git', ['show', `${ref}:${slug}/index.html`], { encoding: 'utf8', maxBuffer: 1 << 26 }) : fs.readFileSync(`${slug}/index.html`, 'utf8');
  let out = src;
  const vp = '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  if (out.split(vp).length !== 2) throw new Error('viewport ' + slug);
  out = out.replace(vp, vp + '<meta name="robots" content="noindex, nofollow">\n');
  if (out.split(LEAD).length !== 2) throw new Error('lead ' + slug);
  out = out.replace(LEAD, LEAD_V2);
  const end = '</script>\n\n</body>';
  if (!out.endsWith(end + '\n</html>\n')) throw new Error('fim ' + slug);
  out = out.replace(end + '\n</html>\n', '</script>\n' + bloco + '\n</body>\n</html>\n');
  fs.mkdirSync(`${slug}-v2`, { recursive: true });
  fs.writeFileSync(`${slug}-v2/index.html`, out);
  console.log('ok ' + slug + '-v2');
}

// Script do Google Ads (Ferramentas > Ações em massa > Scripts).
// Só LÊ a conta e escreve na planilha trafego-mari-google-ads. Não altera nada no Ads.
// Agendado: semanal, segunda 06:00. Fonte da verdade deste código: trafego/scripts/export-planilha.js
var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1aDwuKMrForp9dLlJwntHZ0RELydmjafpqgWamyj8JM4/edit';

function main() {
  var ss = SpreadsheetApp.openByUrl(SHEET_URL);
  dump(ss, 'campanhas_dia',
    ['data', 'campanha', 'status', 'impressoes', 'cliques', 'custo_eur', 'conversoes'],
    "SELECT segments.date, campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
    "FROM campaign WHERE segments.date DURING LAST_30_DAYS AND metrics.impressions > 0",
    function (r) { return [r.segments.date, r.campaign.name, r.campaign.status, n(r.metrics.impressions), n(r.metrics.clicks), n(r.metrics.costMicros) / 1e6, n(r.metrics.conversions)]; });
  dump(ss, 'grupos',
    ['campanha', 'grupo', 'status', 'impressoes', 'cliques', 'custo_eur', 'conversoes'],
    "SELECT campaign.name, ad_group.name, ad_group.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
    "FROM ad_group WHERE segments.date DURING LAST_7_DAYS AND campaign.status = 'ENABLED'",
    function (r) { return [r.campaign.name, r.adGroup.name, r.adGroup.status, n(r.metrics.impressions), n(r.metrics.clicks), n(r.metrics.costMicros) / 1e6, n(r.metrics.conversions)]; });
  dump(ss, 'anuncios',
    ['campanha', 'grupo', 'anuncio_id', 'titulo_1', 'status', 'aprovacao', 'politicas', 'url_final'],
    "SELECT campaign.name, ad_group.name, ad_group_ad.ad.id, ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.status, " +
    "ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.policy_topic_entries, ad_group_ad.ad.final_urls " +
    "FROM ad_group_ad WHERE ad_group_ad.status != 'REMOVED'",
    function (r) {
      var a = r.adGroupAd, ad = a.ad || {}, ps = a.policySummary || {};
      var h = (ad.responsiveSearchAd && ad.responsiveSearchAd.headlines) || [];
      var topics = (ps.policyTopicEntries || []).map(function (t) { return t.topic + ' (' + t.type + ')'; }).join('; ');
      return [r.campaign.name, r.adGroup.name, String(ad.id), h.length ? h[0].text : '', a.status, ps.approvalStatus || '', topics, (ad.finalUrls || []).join(' ')];
    });
  dump(ss, 'termos',
    ['termo', 'tipo_correspondencia', 'campanha', 'grupo', 'impressoes', 'cliques', 'custo_eur', 'conversoes'],
    "SELECT search_term_view.search_term, segments.search_term_match_type, campaign.name, ad_group.name, " +
    "metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM search_term_view WHERE segments.date DURING LAST_7_DAYS",
    function (r) { return [r.searchTermView.searchTerm, r.segments.searchTermMatchType, r.campaign.name, r.adGroup.name, n(r.metrics.impressions), n(r.metrics.clicks), n(r.metrics.costMicros) / 1e6, n(r.metrics.conversions)]; });
  var log = ss.getSheetByName('execucao') || ss.insertSheet('execucao');
  log.clear();
  log.getRange(1, 1, 2, 2).setValues([['atualizado_em', 'periodo'], [new Date().toISOString(), 'campanhas_dia: 30 dias; demais: 7 dias']]);
}

function dump(ss, name, header, query, mapRow) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clear();
  var out = [header];
  var it = AdsApp.search(query);
  while (it.hasNext()) { out.push(mapRow(it.next())); }
  sh.getRange(1, 1, out.length, header.length).setValues(out);
}

function n(x) { return Number(x || 0); }

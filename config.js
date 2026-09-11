const CONFIG = {
  // =====================================================
  // WHATSAPP
  // =====================================================

  whatsappGroupUrl:
    "https://chat.whatsapp.com/SEU_LINK_DO_GRUPO",


  // =====================================================
  // META PIXEL
  // =====================================================

  metaPixelId:
    "SEU_PIXEL_ID",


  // =====================================================
  // OCUPAÇÃO DO GRUPO
  // Use apenas números reais
  // =====================================================

  // =====================================================
// OCUPAÇÃO VISUAL DO GRUPO
// Use uma porcentagem coerente com a ocupação real
// =====================================================

occupancyPercentage: 87,

enableScarcityBar: true,

scarcityMessages: {

  normal:
    "O grupo está recebendo novas pessoas agora.",

  high:
    "O grupo está ficando cheio. Entre antes de perder os próximos achadinhos.",

  critical:
    "Quase cheio. Garanta sua entrada enquanto o grupo ainda está aberto."

},


  // =====================================================
  // BARRA DE ESCASSEZ
  // =====================================================

  enableScarcityBar: true,


  // =====================================================
  // TEXTOS DINÂMICOS
  // =====================================================

  scarcityMessages: {
    normal:
      "Entre agora para não perder os próximos achadinhos.",

    high:
      "O grupo já está com mais de 80% das vagas preenchidas.",

    critical:
      "O grupo está quase cheio. Entre enquanto ainda há espaço."
  },


  // =====================================================
  // RASTREAMENTO
  // =====================================================

  tracking: {
    enableMetaPixel: true,

    enableCustomEvents: true,

    enableUtmCapture: true
  },


  // =====================================================
  // DEBUG
  // Deixe false quando publicar
  // =====================================================

  debug: false
};

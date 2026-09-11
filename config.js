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

  currentMembers: 842,

  maxMembers: 1024,


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

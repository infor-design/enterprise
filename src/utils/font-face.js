// Add Font Faces to the page for the theme
const fontFaceTag = document.querySelector('#ids-font-face');
if (!fontFaceTag) {
  if (!window.SohoConfig) {
    window.SohoConfig = {};
  }
  if (!window.SohoConfig.fontPath) {
    window.SohoConfig.fontPath = '/fonts';
  }
  if (!window.SohoConfig.fontName) {
    window.SohoConfig.fontName = 'Source Sans Pro';
  }
  if (!window.SohoConfig.fontFileName) {
    window.SohoConfig.fontFileName = 'SourceSans3-VariableFont_wght.ttf';
  }
  if (!window.SohoConfig.arabicFontName) {
    window.SohoConfig.arabicFontName = 'Mada';
  }
  if (!window.SohoConfig.arabicFontFileName) {
    window.SohoConfig.arabicFontFileName = 'Mada-VariableFont_wght.ttf';
  }
  if (!window.SohoConfig.hebrewFontName) {
    window.SohoConfig.hebrewFontName = 'Assistant';
  }
  if (!window.SohoConfig.hebrewFontFileName) {
    window.SohoConfig.hebrewFontFileName = 'Assistant-VariableFont_wght.ttf';
  }
  if (!window.SohoConfig.hinduFontName) {
    window.SohoConfig.hinduFontName = 'Noto Sans';
  }
  if (!window.SohoConfig.hinduFontFileName) {
    window.SohoConfig.hinduFontFileName = 'NotoSans-VariableFont_wdth,wght.ttf';
  }
  if (!window.SohoConfig.japaneseFontName) {
    window.SohoConfig.japaneseFontName = 'Noto Sans JP';
  }
  if (!window.SohoConfig.japaneseFontFileName) {
    window.SohoConfig.japaneseFontFileName = 'NotoSansJP-VariableFont_wght.ttf';
  }
  if (!window.SohoConfig.koreanFontName) {
    window.SohoConfig.koreanFontName = 'Noto Sans KR';
  }
  if (!window.SohoConfig.koreanFontFileName) {
    window.SohoConfig.koreanFontFileName = 'NotoSansKR-VariableFont_wght.ttf';
  }
  if (!window.SohoConfig.thaiFontName) {
    window.SohoConfig.thaiFontName = 'Noto Sans Thai';
  }
  if (!window.SohoConfig.thaiFontFileName) {
    window.SohoConfig.thaiFontFileName = 'NotoSansThai-VariableFont_wdth,wght.ttf';
  }
  if (!window.SohoConfig.chineseFontName) {
    window.SohoConfig.chineseFontName = 'Noto Sans SC';
  }
  if (!window.SohoConfig.chineseFontFileName) {
    window.SohoConfig.chineseFontFileName = 'NotoSansSC-VariableFont_wght.ttf';
  }
  if (!window.SohoConfig.taiwanFontName) {
    window.SohoConfig.taiwanFontName = 'Noto Sans TC';
  }
  if (!window.SohoConfig.taiwanFontFileName) {
    window.SohoConfig.taiwanFontFileName = 'NotoSansTC-VariableFont_wght.ttf';
  }

  if (!window.SohoConfig.noFontFace) {
    const style = `<style>
      @font-face {
        font-family: '${window.SohoConfig.fontName}';
        font-optical-sizing: auto;
        font-weight: 100 900;
        src:
          url('${window.SohoConfig.fontPath}/${window.SohoConfig.fontFileName}') format('truetype');
      }

      @font-face {
        font-family: '${window.SohoConfig.arabicFontName}';
        font-optical-sizing: auto;
        font-weight: 100 900;
        src:
          url('${window.SohoConfig.fontPath}/${window.SohoConfig.arabicFontFileName}') format('truetype');
      }

      @font-face {
        font-family: '${window.SohoConfig.hebrewFontName}';
        font-optical-sizing: auto;
        font-weight: 100 900;
        src:
          url('${window.SohoConfig.fontPath}/${window.SohoConfig.hebrewFontFileName}') format('truetype');
      }

      @font-face {
        font-family: '${window.SohoConfig.hinduFontName}';
        font-optical-sizing: auto;
        font-weight: 100 900;
        src:
          url('${window.SohoConfig.fontPath}/${window.SohoConfig.hinduFontFileName}') format('truetype');
      }

      @font-face {
        font-family: '${window.SohoConfig.japaneseFontName}';
        font-optical-sizing: auto;
        font-weight: 100 900;
        src:
          url('${window.SohoConfig.fontPath}/${window.SohoConfig.japaneseFontFileName}') format('truetype');
      }

      @font-face {
        font-family: '${window.SohoConfig.koreanFontName}';
        font-optical-sizing: auto;
        font-weight: 100 900;
        src:
          url('${window.SohoConfig.fontPath}/${window.SohoConfig.koreanFontFileName}') format('truetype');
      }

      @font-face {
        font-family: '${window.SohoConfig.thaiFontName}';
        font-optical-sizing: auto;
        font-weight: 100 900;
        src:
          url('${window.SohoConfig.fontPath}/${window.SohoConfig.thaiFontFileName}') format('truetype');
      }

      @font-face {
        font-family: '${window.SohoConfig.chineseFontName}';
        font-optical-sizing: auto;
        font-weight: 100 900;
        src:
          url('${window.SohoConfig.fontPath}/${window.SohoConfig.chineseFontFileName}') format('truetype');
      }

      @font-face {
        font-family: '${window.SohoConfig.taiwanFontName}';
        font-optical-sizing: auto;
        font-weight: 100 900;
        src:
          url('${window.SohoConfig.fontPath}/${window.SohoConfig.taiwanFontFileName}') format('truetype');
      }
    </style>`;
    document.querySelector('head').insertAdjacentHTML('beforeend', style);
  }
}

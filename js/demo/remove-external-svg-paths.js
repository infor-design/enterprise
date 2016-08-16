// Remove External SVG paths
// NOTE:  USED FOR SOHO XI DEMO PURPOSES ONLY!
// DO NOT USE THIS CODE IN YOUR APPLICATIONS.
//
// This code helps demonstrate a deprecated method of using SVG icons that would
// inline the SVG into the page's HTML.  The express.js server will call this Javascript
// to remove the external paths that exist in all the icons' <use> tags in this project, causing them to
// be searched for in the current document instead of externally.
//
// See http://jira/browse/SOHO-3932

var useTagList = document.getElementsByTagName('use');

function removeExternalSVGPath(useElem) {
  var xlinkHref = useElem.getAttribute('xlink:href');

  if (xlinkHref.indexOf('#') < 1) {
    return;
  }

  var externalPath = xlinkHref.substring(0, xlinkHref.indexOf('#'));
  useElem.setAttribute('xlink:href', xlinkHref.replace(externalPath, ''));
}

for (var i = 0; i < useTagList.length; i++) {
  removeExternalSVGPath(useTagList[i]);
}

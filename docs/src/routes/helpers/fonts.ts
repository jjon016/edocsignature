import { FontTypes } from '@edoccoding/common';
import path from 'path';
export const getFontbyName = (fontname: FontTypes) => {
  if (fontname == FontTypes.AnkeCallig) {
    return path.join(__dirname, 'fonts', 'ankecallig-fg.ttf');
  }
  if (fontname == FontTypes.BlackJack) {
    return path.join(__dirname, 'fonts', 'black_jack.ttf');
  }
  if (fontname == FontTypes.DancingScript) {
    return path.join(__dirname, 'fonts', 'Dancing Script.ttf');
  }
  if (fontname == FontTypes.GradeCursive) {
    return path.join(__dirname, 'fonts', 'gradecursive.ttf');
  }
  if (fontname == FontTypes.HoneyScriptLight) {
    return path.join(__dirname, 'fonts', 'HoneyScript-Light.ttf');
  }
  return path.join(__dirname, 'fonts', 'Allura-Regular.ttf');
};

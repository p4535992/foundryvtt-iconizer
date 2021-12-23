import { i18n } from '../index';
import { VTTAIconizer } from './VTTAIconizerApi';

export const VTTA_ICONIZER_MODULE_NAME = 'vtta-iconizer';

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
    throw new Error('Canvas Is Not Initialized');
  }
  return canvas;
}

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game Is Not Initialized');
  }
  return game;
}

export function getAPI(): any {
  if (!getGame()[VTTAIconizer.API]) {
    throw new Error('API Is Not Initialized');
  }
  return getGame()[VTTAIconizer.API];
}

export const registerSettings = function () {
  getGame().settings.register(VTTA_ICONIZER_MODULE_NAME, 'replacement-policy', {
    name: `${VTTA_ICONIZER_MODULE_NAME}.replacement-policy.name`,
    hint: `${VTTA_ICONIZER_MODULE_NAME}.replacement-policy.hint`,
    scope: 'world',
    config: true,
    type: Number,
    default: 0,
    choices: {
      0: `${VTTA_ICONIZER_MODULE_NAME}.replacement-policy.0`,
      1: `${VTTA_ICONIZER_MODULE_NAME}.replacement-policy.1`,
      2: `${VTTA_ICONIZER_MODULE_NAME}.replacement-policy.2`,
    },
  });

  getGame().settings.register(VTTA_ICONIZER_MODULE_NAME, 'icon-database-policy', {
    name: `${VTTA_ICONIZER_MODULE_NAME}.icon-database-policy.name`,
    hint: `${VTTA_ICONIZER_MODULE_NAME}.icon-database-policy.hint`,
    scope: 'world',
    config: true,
    type: Number,
    default: 0,
    choices: {
      0: `${VTTA_ICONIZER_MODULE_NAME}.icon-database-policy.0`,
      1: `${VTTA_ICONIZER_MODULE_NAME}.icon-database-policy.1`,
      2: `${VTTA_ICONIZER_MODULE_NAME}.icon-database-policy.2`,
    },
  });

  getGame().settings.register(VTTA_ICONIZER_MODULE_NAME, 'base-dictionary', {
    name: `${VTTA_ICONIZER_MODULE_NAME}.base-dictionary.name`,
    hint: `${VTTA_ICONIZER_MODULE_NAME}.base-dictionary.hint`,
    scope: 'world',
    config: true,
    type: String,
    choices: {
      'foundry-icons.json': `Foundry Icons`,
      'wow-icons.json': `World of Warcraft icons (offline, local icons)`,
      'wowhead-icons.json': `World of Warcraft icons (online, wowhead.com)`,
    },
    default: 'foundry-icons.json',
  });

  // Relabeling "icon directory" to "icon prefix" setting
  getGame().settings.register(VTTA_ICONIZER_MODULE_NAME, 'icon-directory', {
    name: `${VTTA_ICONIZER_MODULE_NAME}.icon-prefix.name`,
    hint: `${VTTA_ICONIZER_MODULE_NAME}.icon-prefix.hint`,
    scope: 'world',
    config: true,
    type: String,
    default: 'iconizer',
  });

  // Submitting icons is a todo
  // getGame().settings.register("vtta-iconizer", "share-missing-icons", {
  //   name: "vtta-iconizer.share-missing-icons.name",
  //   hint: "vtta-iconizer.share-missing-icons.hint",
  //   scope: "world",
  //   config: true,
  //   type: Boolean,
  //   default: false,
  // });
};

import { log, warn } from '../index';
import utils from './utilt';
import { getGame, VTTA_ICONIZER_MODULE_NAME } from './settings';

export const readyHooks = async () => {
  // check for failed registered settings
  let hasErrors = false;

  for (const s of getGame().settings.settings.values()) {
    if (s.module !== VTTA_ICONIZER_MODULE_NAME) {
      continue;
    }
    try {
      getGame().settings.get(s.module, s.key);
    } catch (err) {
      hasErrors = true;
      ui.notifications?.info(`${s.module} | Erroneous module settings found, resetting to default.`);
      getGame().settings.set(s.module, s.key, s.default);
    }
  }

  if (hasErrors) {
    ui.notifications?.warn('Please review the module settings to re-adjust them to your desired configuration.');
  }

  const iconData = new Map();
  const iconDatabasePolicy = getGame().settings.get(VTTA_ICONIZER_MODULE_NAME, 'icon-database-policy');

  // load the base dictionary
  if (iconDatabasePolicy === 0 || iconDatabasePolicy === 1) {
    const basePath = ROUTE_PREFIX ? `/${ROUTE_PREFIX}` : '';
    const path = `${basePath}/modules/${VTTA_ICONIZER_MODULE_NAME}/data/${getGame().settings.get(
      VTTA_ICONIZER_MODULE_NAME,
      'base-dictionary',
    )}`;

    const fileExists = await utils.serverFileExists(path);
    if (fileExists) {
      const response = await fetch(path, { method: 'GET' });

      const json = await response.json();
      json.forEach((data) => {
        iconData.set(data.name.toLowerCase(), data.icon);
      });
    }
  }

  // load the custom icon database (if there is any)
  if (iconDatabasePolicy === 1 || iconDatabasePolicy === 2) {
    const prefix = <string>getGame().settings.get(VTTA_ICONIZER_MODULE_NAME, 'icon-directory');
    console.log('Prefix is: ' + prefix);
    if (prefix.indexOf('http') === 0) {
      console.log('starting with http');
      const path = `${getGame().settings.get(VTTA_ICONIZER_MODULE_NAME, 'icon-directory')}/icons.json`;
      try {
        const response = await fetch(path, { method: 'GET' });
        const json = await response.json();
        json.forEach((data) => {
          iconData.set(data.name.toLowerCase(), data.icon);
        });
      } catch (error) {
        console.log(error);
        console.log('Error loading custom dictionary from ' + path);
      }
    } else {
      const path = `/${getGame().settings.get(VTTA_ICONIZER_MODULE_NAME, 'icon-directory')}/icons.json`;
      const fileExists = await utils.serverFileExists(path);
      if (fileExists) {
        const response = await fetch(path, { method: 'GET' });
        const json = await response.json();
        json.forEach((data) => {
          iconData.set(data.name.toLowerCase(), data.icon);
        });
      }
    }
  }

  /**
   * Replaces the icon if the name changed and if the game settings allow that
   */
  const replaceIcon = (options: any) => {
    log(options);
    // if there is no name change here, just continue
    if (!options || !options.name) {
      return options;
    }
    const REPLACEMENT_POLICY_REPLACE_ALL = 0;
    const REPLACEMENT_POLICY_REPLACE_DEFAULT = 1;
    const REPLACEMENT_POLICY_REPLACE_NONE = 2;

    const replacementPolicy = getGame().settings.get(VTTA_ICONIZER_MODULE_NAME, 'replacement-policy');

    // stop right here if we should not replace anything
    if (replacementPolicy === REPLACEMENT_POLICY_REPLACE_NONE) return;

    if (
      replacementPolicy === REPLACEMENT_POLICY_REPLACE_ALL ||
      (replacementPolicy === REPLACEMENT_POLICY_REPLACE_DEFAULT &&
        (!options.img || options.img.toLowerCase().indexOf('mystery-man') !== -1))
    ) {
      let name = options.name
        .toLowerCase()
        .replace(/\([^)]*\)/g, '')
        .trim();
      let newIcon = iconData.get(name);
      if (!newIcon) {
        // Issue https://github.com/VTTAssets/vtta-iconizer/issues/7
        name = name.replace("'", '’');
        newIcon = iconData.get(name);
      }

      if (newIcon !== undefined) {
        // accept absolute references to icons and do not prefix with the icon directory
        if (newIcon.startsWith('/') || newIcon.indexOf('://') === 0 || newIcon.indexOf('http') === 0) {
          options.img = newIcon;
        } else {
          // online references by wowhead-icons.json
          const baseDictionary = getGame().settings.get(VTTA_ICONIZER_MODULE_NAME, 'base-dictionary');
          if (baseDictionary === 'wowhead-icons.json') {
            options.img = 'https://wow.zamimg.com/images/wow/icons/large' + '/' + newIcon;
          } else {
            options.img = getGame().settings.get(VTTA_ICONIZER_MODULE_NAME, 'icon-directory') + '/' + newIcon;
          }
        }
      } else {
        if (replacementPolicy === 0) {
          //options.img = "icons/svg/mystery-man.svg";
        }
      }
      log('Post-processing');
      log(options);
    } else {
      log('Not replacing icon');
    }

    return options;
  };

  // Hook on the item create events to replace the icon
  Hooks.on('preCreateItem', (createData, options, userId) => {
    console.log('preCreateItem');
    let opts = {
      name: createData.name,
      img: createData.img,
    };
    opts = replaceIcon(opts);

    createData.data._source.img = opts.img;
  });

  Hooks.on('preUpdateItem', (entity, updateData, options, userId) => {
    //Hooks.on("preUpdateItem", (createData, options) => {
    log('preUpdateItem');
    if (!updateData.img) {
      updateData.img = entity.img;
    }
    updateData = replaceIcon(updateData);
  });

  Hooks.on('preCreateOwnedItem', (createData, options, userId) => {
    //Hooks.on("preCreateOwnedItem", (parent, createData, options) => {
    options = replaceIcon(options);
    console.log('+++++++++++++++++++++++++++++++++++++++');
    console.log("preCreateOwnedItem almost finished, let's check if that item came from a Foundry import:");
    console.log(options);

    // console.log("Options.flags?" + options.flags);
    // if (
    //   options.flags &&
    //   options.flags.vtta &&
    //   options.flags.vtta.dndbeyond &&
    //   options.flags.vtta.dndbeyond.type &&
    //   (options.img === undefined ||
    //     options.img.toLowerCase() === "icons/svg/mystery-man.svg")
    // ) {
    //   submitItem(options.name, options.type, options.flags.vtta.dndbeyond.type);
    // }
    console.log('preCreateOwnedItem finshed');
  });

  Hooks.on('preUpdateOwnedItem', (entity, updateData, options, userId) => {
    //Hooks.on("preUpdateOwnedItem", (parent, createData, options) => {
    log('preUpdateOwnedItem');
    if (!options.img) {
      const item = entity.getEmbeddedEntity('OwnedItem', options._id);
      if (item) {
        options.img = item.img;
      }
    }
    options = replaceIcon(options);
  });

  document.addEventListener('queryIcon', (event: any) => {
    if (event.detail && event.detail.name) {
      const response = replaceIcon({ name: event.detail.name });
      document.dispatchEvent(new CustomEvent('deliverIcon', response));
      log('queryIcon');
      log(response);
    }
  });

  document.addEventListener('queryIcons', (event: any) => {
    if (event.detail && event.detail.names && Array.isArray(event.detail.names)) {
      const response: any[] = [];
      for (const name of event.detail.names) {
        const result = replaceIcon(name);
        response.push(replaceIcon(name));
      }

      document.dispatchEvent(new CustomEvent('deliverIcon', { detail: response }));
    }
  });
};

export const setupHooks = () => {
  //
};

export const initHooks = () => {
  warn('Init Hooks processing');
  // log('Init');
  // const debug = false;
  // if (!CONFIG.debug.vtta) {
  //   CONFIG.debug.vtta = { iconizer: debug };
  // } else {
  //   CONFIG.debug.vtta.iconizer = debug;
  // }
};

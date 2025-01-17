# Iconizer (ex VTTA Iconizer)

# THIS MODULE IS ABANDONED USE INSTEAD [Token Variant Art](https://github.com/Aedif/TokenVariants) WITH THE NE JSON SOURCE FEATURE

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-iconizer/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ficonizer&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=iconizer)

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-iconizer%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-iconizer%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ficonizer%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/iconizer/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-iconizer/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/iconizer/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/iconizer/)

### If you want to buy me a coffee [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/p4535992)

Adds a toggle to GM's token control menu, that allows them to ignore the vision of tokens. This makes it possible to see the entire map while moving tokens with vision around.

By default disables the vision limitation when dragging a token as a GM (Useful for not show the map to player when you move some token on the map).

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-iconizer/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### Features

**Disclaimer:** I strongly advise to use icons that you have actually licensed, and urge you not to redistribute any icons that you are not allowed to redistribute.

Having icons is a must. You can use the icons that are coming with Foundry, get other icons using the Unity Asset Store or watch the Humble Bundle for suitable packages.

What I did, and what the default database references are the icons from the game World of Warcraft, which I played close to 12 years. You can download icon sets on sites like wowinterface.com, including a tool that converts the internally used BLP format to PNG:

- [Icon Set](https://www.wowinterface.com/downloads/info24559-CleanIcons-ThinFanUpdate.html)
- [Converter BLP to PNG](https://www.wowinterface.com/downloads/info22128-BLPNGConverter.html)

Download one of the icon sets from wowinterface.com, unzip them into a directory and convert the BLP files into PNG files. Copy or move those PNG icons directly into the configure icon directory (see below).

Alternatively, you can create a custom database using icons of your choice, please see the custom database format and file location below.

**Note** that you can still overwrite your custom items with a dictionary that you create (see below). Your user-defined dictionary takes precedence over the DDB Bridge one.

## Configuration

### Icon replacement policy

Three settings are available:

- Replace all icons - All icons are replaced by an entry in the icon database. If there isn't an entry for this item in the database, the default icon (mystery man) will be used instead
- Replace only default icons - The icon will be replaced only if the current icon is the default icon (mystery man)
- Do not replace any icons - No icons will be replaced. You better uninstall this module ;)

### Icon database policy

Defines which databases are queried when selecting an icon. You can choose between using the pre-defined database only, using your custom database only or using both at the same time. When using both databases, entries in your custom database take precedence, allowing you to overwrite entries in the predefined database

### Icon directory

Sets the icon directory where you are storing your icons. It is relative to the Foundry `/Data` directory, please do not add a leading or trailing slash to this path.

Examples:

- `img/icons` references to `[Foundry]/Data/img/icons`
- `icons` references to `[Foundry]/Data/icons`
- `` references to `[Foundry]/Data` - probably not recommended

### Creating a custom database

Create a file called `icons.json` in the icon directory and adjust the Icon database policy to use your new database exclusively or additionally to the default database.

The file format is as follows:

```
[
    {
        "name":"Mace, +3",
        "icon":"INV_Mace_2h_DraenorCrafted_D_01_C_Horde.png"
    },
    {
        "name":"Flame Tongue Longsword",
        "icon":"inv_sword_1h_artifactfelomelorn_d_02.png"
    }
]
```

The lookup is based on a name referencing an icon. The matches are made case-insensitive.

Just add all the entries you want to change, save the file and reload your world. The entries in your user-defined file have priority and will overwrite everything in the base directory.


## Known Issue\Limitation

## Api

# Build

## Install all packages

```bash
npm install
```
## npm build scripts

### build

will build the code and copy all necessary assets into the dist folder and make a symlink to install the result into your foundry data; create a
`foundryconfig.json` file with your Foundry Data path.

```json
{
  "dataPath": "~/.local/share/FoundryVTT/"
}
```

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run-script build
```

### NOTE:

You don't need to build the `foundryconfig.json` file you can just copy the content of the `dist` folder on the module folder under `modules` of Foundry

### build:watch

`build:watch` will build and watch for changes, rebuilding automatically.

```bash
npm run-script build:watch
```

### clean

`clean` will remove all contents in the dist folder (but keeps the link from build:install).

```bash
npm run-script clean
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

### package

`package` generates a zip file containing the contents of the dist folder generated previously with the `build` command. Useful for those who want to manually load the module or want to create their own release

```bash
npm run-script package
```

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-iconizer/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).


## License

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).


## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

# Changelog

## [1.0.5]

### Added

- Compatibility for Foundry VTT v0.4.4 and higher
- Enabling or disable via CONFIG: `CONFIG.debug.vtta.iconizer = TRUE|FALSE` enables or disables debug logging in the console.log. Defaults to `false`

### Removed

- Compatibility for Foundry VTT v0.4.3 and lower

### Fixed

- Fixed bugs regarding changing icons only when the default icon is currently set (which wasn't working very well - it now does ;))

## [1.0.4] - 2020-01-02

### Added

- Multiple Icons (Thanks @tposney for contributing!)

- Used [Azzurite's Settings Extender](https://gitlab.com/foundry-azzurite/settings-extender) to simplify configuration

## [1.0.3] - 2019-20-21

### Changed

- Removing parts in paranthesis when looking up a suitable icon
- Added Event Handler for other modules to query for suitable icons based on a { name: 'name' } query

## [1.0.2] - 2019-20-11

### Added

- Included the vast icon database previously only available for Patreons into the initial re-release, see /vtta-tokeniuzer/data/icons.json. Please feel free to hit me up with any changes and additions for this database! While I do provide a massive jumpstart and a big incentive to use this database, it would be awesome if the community could complete the missing icons together!

### Changed

- Initial re-release for Foundry v0.4.0
- Rewrote the whole module as ES6 module for easier maintenance in the future

### Deprecated

### Removed

- Support for Foundry v0.3.9 and prior
import { getAPI, getGame, VTTA_ICONIZER_MODULE_NAME } from "./settings";

export let vttaIconizerSocket;

Hooks.once('ready', async () => {
  if (!getGame().modules.get('socketlib')?.active) {
    Hooks.once('socketlib.ready', () => {
      //@ts-ignore
      vttaIconizerSocket = socketlib.registerModule(VTTA_ICONIZER_MODULE_NAME);
      // vttaIconizerSocket.register('isReachable', _socketIsReachable);
    });
  }
});

// export function _socketIsReachable(token: Token, placeableObject: PlaceableObject, userId?: string): boolean {
//   return getAPI().isReachable(token, placeableObject, userId);
// }

// export function isReachable(token: Token, placeableObject: PlaceableObject, userId: string): boolean {
//   return vttaIconizerSocket.executeAsGM(_socketIsReachable, token, placeableObject, userId).then((reachable) => reachable);
// }

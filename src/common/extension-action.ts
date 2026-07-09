import { browser } from 'webextension-polyfill-ts';

export default function getExtensionAction(): any {
  const api = browser as any;

  return api.action || api.browserAction;
}

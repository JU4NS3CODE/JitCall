import { registerPlugin } from '@capacitor/core';

import type { CallmePluginPlugin } from './definitions';

const CallmePlugin = registerPlugin<CallmePluginPlugin>('CallmePlugin', {
  web: () => import('./web').then((m) => new m.CallmePluginWeb()),
});

export * from './definitions';
export { CallmePlugin };

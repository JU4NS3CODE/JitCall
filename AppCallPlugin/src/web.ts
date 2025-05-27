import { WebPlugin } from '@capacitor/core';

import type { CallmePluginPlugin } from './definitions';

export class CallmePluginWeb extends WebPlugin implements CallmePluginPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
  async testPluginMethod(options: { msg: string; }): Promise<{ value: string; }> {
      alert(options.msg);
      return {value:options.msg}
  }
}

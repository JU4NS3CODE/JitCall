declare module "@capacitor/core"{
  interface PluginRegistry {
    CallmePlugin: CallmePluginPlugin;
  }
}


export interface CallmePluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  testPluginMethod(options:{msg: string}): Promise<{ value: string}>;
}

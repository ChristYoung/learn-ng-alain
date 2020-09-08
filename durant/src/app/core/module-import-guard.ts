// https://angular.io/guide/styleguide#style-04-12
// 确保 核心模块等 只被加载一次
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
  }
}

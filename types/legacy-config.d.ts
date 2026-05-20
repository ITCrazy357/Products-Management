declare module "../config/system.js" {
  const systemConfig: { prefixAdmin: string };
  export = systemConfig;
}

declare module "../config/database.js" {
  function connect(): Promise<void>;
  export { connect };
  export default { connect };
}



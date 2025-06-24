export enum ServiceMode {
  Singleton = 0,
  Scoped = 1,
}

export interface ServiceOptions {
  builder?: any;
  mode?: ServiceMode;
}
/**
 * @deprecated
 */
export class ServiceProvider {
  private static instance: ServiceProvider;

  private instancesMemoryStore: { [key: string]: any } = {};
  private registerMemoryStore: { [key: string]: ServiceOptions } = {};

  private constructor() {}

  public RegisterService<TService>(serviceType: string, registerOptions?: ServiceOptions) {
    if (this.registerMemoryStore[serviceType]) return;
    if (!registerOptions) return;
    this.registerMemoryStore[serviceType] = registerOptions;
  }
  public GetService<TService>(serviceType: new () => TService) {
    const typeName = serviceType.name;
    const registration: ServiceOptions = this.registerMemoryStore[typeName];
    if (!registration) throw Error(`ServiceProvider has not registered service called: ${typeName}`);

    switch (registration.mode) {
      case ServiceMode.Singleton:
        const serviceInstance: TService = this.instancesMemoryStore[typeName];
        if (serviceInstance) return serviceInstance as TService;
        const newServiceInstance = registration.builder ? registration.builder() : new serviceType();
        this.instancesMemoryStore[typeName] = newServiceInstance;
        return newServiceInstance as TService;
      default:
        return new serviceType();
    }
  }

  public static GetInstance() {
    if (!ServiceProvider.instance) {
      ServiceProvider.instance = new ServiceProvider();
    }
    return ServiceProvider.instance;
  }
  public static GetScoped<TServiceService>(serviceType: new () => TServiceService, builder?: () => TServiceService) {
    if (builder) return builder();
    return new serviceType();
  }
}

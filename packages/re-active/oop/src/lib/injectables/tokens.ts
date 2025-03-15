import type { InjectionToken } from 'tsyringe';

const providerPropsSymbol = Symbol('ProviderProps');
export const Props: InjectionToken = providerPropsSymbol;

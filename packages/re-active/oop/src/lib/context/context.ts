import { createContext } from 'react';
import { container, DependencyContainer } from 'tsyringe';

export const Context = createContext<DependencyContainer>(container);

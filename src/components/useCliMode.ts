import { createContext, useContext } from "react";

export interface CliModeContextType {
  cliMode: boolean;
  toggleCliMode: () => void;
}

export const CliModeContext = createContext<CliModeContextType>({
  cliMode: false,
  toggleCliMode: () => {},
});

export function useCliMode() {
  return useContext(CliModeContext);
}

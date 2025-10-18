import React, { useMemo, useState } from "react";
import {
  RegisterFlowContext,
  type RegisterCredentials,
  emptySelections,
  type PreferencesSelections,
} from "./registerFlowInternal.ts";

export const RegisterFlowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [credentials, setCredentialsState] = useState<RegisterCredentials | null>(
    null
  );
  const [selections, setSelections] = useState<PreferencesSelections>(
    emptySelections
  );

  const setCredentials = (c: RegisterCredentials) => setCredentialsState(c);
  const updateSelections = (partial: Partial<PreferencesSelections>) =>
    setSelections((prev: PreferencesSelections) => ({ ...prev, ...partial }));
  const reset = () => {
    setCredentialsState(null);
    setSelections(emptySelections);
  };

  const value = useMemo(
    () => ({ credentials, selections, setCredentials, updateSelections, reset }),
    [credentials, selections]
  );

  return (
    <RegisterFlowContext.Provider value={value}>
      {children}
    </RegisterFlowContext.Provider>
  );
};

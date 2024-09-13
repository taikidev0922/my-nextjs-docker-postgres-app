"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

export enum ScreenActionMode {
  ReadOnly = "READ_ONLY",
  RegistAndEditAndDelete = "REGIST_AND_EDIT_AND_DELETE",
}

export const screenActionModeLabels: Record<ScreenActionMode, string> = {
  [ScreenActionMode.ReadOnly]: "参照",
  [ScreenActionMode.RegistAndEditAndDelete]: "登録・編集・削除",
};

export const screenActionModeColors: Record<ScreenActionMode, string> = {
  [ScreenActionMode.ReadOnly]: "bg-blue-100",
  [ScreenActionMode.RegistAndEditAndDelete]: "bg-green-100",
};

const editableScreenActionModes = [ScreenActionMode.RegistAndEditAndDelete];

type ChangeCallback = (
  prevMode: ScreenActionMode,
  newMode: ScreenActionMode
) => void;

type ScreenActionModeContextType = {
  screenActionMode: ScreenActionMode;
  setScreenActionMode: (mode: ScreenActionMode) => void;
  isReadOnly: boolean;
  isEditable: boolean;
  onChangeScreenActionMode: (callback: ChangeCallback) => void;
};

const ScreenActionModeContext = createContext<
  ScreenActionModeContextType | undefined
>(undefined);

export const ScreenActionModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [screenActionMode, setScreenActionModeState] =
    useState<ScreenActionMode>(ScreenActionMode.ReadOnly);
  const [changeCallback, setChangeCallback] = useState<ChangeCallback | null>(
    null
  );

  const setScreenActionMode = useCallback(
    (newMode: ScreenActionMode) => {
      setScreenActionModeState((prevMode) => {
        if (changeCallback) {
          changeCallback(prevMode, newMode);
        }
        return newMode;
      });
    },
    [changeCallback]
  );

  const onChangeScreenActionMode = useCallback((callback: ChangeCallback) => {
    setChangeCallback(() => callback);
  }, []);

  const isReadOnly = screenActionMode === ScreenActionMode.ReadOnly;
  const isEditable = editableScreenActionModes.includes(screenActionMode);

  return (
    <ScreenActionModeContext.Provider
      value={{
        screenActionMode,
        setScreenActionMode,
        isReadOnly,
        isEditable,
        onChangeScreenActionMode,
      }}
    >
      {children}
    </ScreenActionModeContext.Provider>
  );
};

export const useScreenActionMode = () => {
  const context = useContext(ScreenActionModeContext);
  if (context === undefined) {
    throw new Error(
      "useScreenActionMode must be used within a ScreenActionModeProvider"
    );
  }
  return context;
};

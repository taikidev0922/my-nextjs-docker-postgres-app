"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

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
  onUpdate: (handler: () => void) => void;
  onClickUpdate: () => void;
};

const ScreenActionModeContext = createContext<ScreenActionModeContextType>({
  screenActionMode: ScreenActionMode.ReadOnly,
  setScreenActionMode: () => {},
  isReadOnly: true,
  isEditable: false,
  onChangeScreenActionMode: () => {},
  onUpdate: () => {},
  onClickUpdate: () => {},
});

export const ScreenActionModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [screenActionMode, setScreenActionModeState] =
    useState<ScreenActionMode>(ScreenActionMode.ReadOnly);
  const [changeCallback, setChangeCallback] = useState<ChangeCallback | null>(
    null
  );
  const [updateHandler, setUpdateHandler] = useState<(() => void) | null>(null);

  function setScreenActionMode(newMode: ScreenActionMode) {
    setScreenActionModeState((prevMode) => {
      if (changeCallback) {
        changeCallback(prevMode, newMode);
      }
      return newMode;
    });
  }

  function onClickUpdate() {
    if (updateHandler) {
      updateHandler();
    }
  }

  function onChangeScreenActionMode(callback: ChangeCallback) {
    setChangeCallback(() => callback);
  }

  function onUpdate(handler: () => void) {
    setUpdateHandler(() => handler);
  }

  const isReadOnly = screenActionMode === ScreenActionMode.ReadOnly;
  const isEditable = editableScreenActionModes.includes(screenActionMode);

  const contextValue: ScreenActionModeContextType = {
    screenActionMode,
    setScreenActionMode,
    isReadOnly,
    isEditable,
    onChangeScreenActionMode,
    onUpdate,
    onClickUpdate,
  };

  return (
    <ScreenActionModeContext.Provider value={contextValue}>
      {children}
    </ScreenActionModeContext.Provider>
  );
};

export const useScreenActionMode = () => {
  const context = useContext(ScreenActionModeContext);
  if (!context) {
    throw new Error(
      "useScreenActionMode must be used within a ScreenActionModeProvider"
    );
  }
  return context;
};

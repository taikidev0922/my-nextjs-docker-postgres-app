"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// スクリーンアクションモードのEnum
export enum ScreenActionMode {
  ReadOnly = "READ_ONLY",
  RegistAndEditAndDelete = "REGIST_AND_EDIT_AND_DELETE",
}

// Enumの値とラベルのマッピング
export const screenActionModeLabels: Record<ScreenActionMode, string> = {
  [ScreenActionMode.ReadOnly]: "参照",
  [ScreenActionMode.RegistAndEditAndDelete]: "登録・編集・削除",
};

// 操作種別に応じた背景色の定義
export const screenActionModeColors: Record<ScreenActionMode, string> = {
  [ScreenActionMode.ReadOnly]: "bg-blue-100",
  [ScreenActionMode.RegistAndEditAndDelete]: "bg-green-100",
};

// コンテキストの作成
type ScreenActionModeContextType = {
  screenActionMode: ScreenActionMode;
  setScreenActionMode: React.Dispatch<React.SetStateAction<ScreenActionMode>>;
};

const ScreenActionModeContext = createContext<
  ScreenActionModeContextType | undefined
>(undefined);

// プロバイダーコンポーネント
export const ScreenActionModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [screenActionMode, setScreenActionMode] = useState<ScreenActionMode>(
    ScreenActionMode.ReadOnly
  );

  return (
    <ScreenActionModeContext.Provider
      value={{ screenActionMode, setScreenActionMode }}
    >
      {children}
    </ScreenActionModeContext.Provider>
  );
};

// カスタムフック
export const useScreenActionMode = () => {
  const context = useContext(ScreenActionModeContext);
  if (context === undefined) {
    throw new Error(
      "useScreenActionMode must be used within a ScreenActionModeProvider"
    );
  }
  return context;
};

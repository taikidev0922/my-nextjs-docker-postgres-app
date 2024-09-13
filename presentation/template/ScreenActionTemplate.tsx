"use client";

import React from "react";
import {
  useScreenActionMode,
  ScreenActionMode,
  screenActionModeLabels,
  screenActionModeColors,
} from "@/presentation/hooks/useScreenActionMode";
import { Button } from "../components/Button";

export function ScreenActionTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { screenActionMode, setScreenActionMode, isEditable } =
    useScreenActionMode();

  return (
    <>
      <div
        className={`p-4 shadow-sm transition-colors duration-300 border-b border-gray-300 ${screenActionModeColors[screenActionMode]}`}
      >
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            {Object.entries(screenActionModeLabels).map(([mode, label]) => (
              <label key={mode} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  name="mode"
                  value={mode}
                  checked={screenActionMode === mode}
                  onChange={() => setScreenActionMode(mode as ScreenActionMode)}
                />
                <span className="ml-2 text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          <Button variant="success" disabled={!isEditable}>
            更新
          </Button>
        </div>
      </div>
      {children}
    </>
  );
}

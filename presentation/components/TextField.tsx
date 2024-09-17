import React from "react";
import { ComboBox } from "@mescius/wijmo.react.input";
import { Controller, Control } from "react-hook-form";

interface TextFieldProps {
  name: string;
  label: string;
  control: Control;
}

export default function TextField({ name, label, control }: TextFieldProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ComboBox
            id={name}
            textChanged={(sender) => {
              field.onChange(sender.text);
            }}
          />
        )}
      />
    </div>
  );
}

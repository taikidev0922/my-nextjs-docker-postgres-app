import React, { useCallback } from "react";
import { Controller, Control } from "react-hook-form";
import { ComboBox as WjComboBox } from "@mescius/wijmo.react.input";
import { ComboBox as WjComboBoxType } from "@mescius/wijmo.input";
import { isEqual } from "lodash";

interface ComboBoxProps {
  name: string;
  label: string;
  itemsSource: {
    label: string;
    value: string | boolean | number | undefined;
  }[];
  control: Control;
}

const ComboBox = React.memo(
  ({ name, label, itemsSource, control }: ComboBoxProps) => {
    const handleTextChanged = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sender: WjComboBoxType, onChange: (value: any) => void) => {
        setTimeout(() => {
          onChange(sender.selectedValue);
        });
      },
      []
    );

    return (
      <div className="flex flex-col">
        <label htmlFor={name}>{label}</label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <WjComboBox
              id={name}
              itemsSource={itemsSource}
              displayMemberPath="label"
              selectedValuePath="value"
              selectedValue={field.value}
              textChanged={(sender) =>
                handleTextChanged(sender, field.onChange)
              }
            />
          )}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.name === nextProps.name &&
      prevProps.label === nextProps.label &&
      isEqual(prevProps.itemsSource, nextProps.itemsSource) &&
      prevProps.control === nextProps.control
    );
  }
);

ComboBox.displayName = "ComboBox";

export default ComboBox;

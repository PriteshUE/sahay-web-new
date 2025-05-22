/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalenderIcon } from "../../Icons";

// Your custom Calendar Icon component (if you have one)

interface DateTimePickerProps {
  control?: any;
  fieldName?: string;
  rules?: any;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  control,
  fieldName,
  rules,
}) => {
  // If both `control` and `fieldName` are provided, use Controller from react-hook-form
  if (control && fieldName) {
    return (
      <div>
        <Controller
          control={control}
          name={fieldName}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <div>
              {/* DatePicker integrated with react-hook-form */}
              <DatePicker
                {...field}
                selected={field.value ? new Date(field.value) : null} // Convert ISO string to Date object
                onChange={(date: Date | null) => {
                  if (date) {
                    field.onChange(date.toISOString()); // Store as ISO string
                  } else {
                    field.onChange(null); // Handle null case
                  }
                }}
                showTimeSelect
                timeIntervals={15} // Time intervals for the time picker (15 minutes)
                timeCaption="Time"
                className="w-full outline-none border border-dark-600/70 focus:ring-1 focus:ring-dark-700 focus:border-dark-700 rounded input-number-arrow-none"
                wrapperClassName="w-full"
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Please Select Date and Time"
                showIcon
                icon={
                  <span className="block w-4 pointer-events-none mt-1">
                    <CalenderIcon />
                  </span>
                }
                customInput={
                  <div>
                    <input
                      {...field}
                      readOnly
                      value={
                        field.value
                          ? new Date(field.value).toLocaleString()
                          : ""
                      } // Ensure date is shown correctly
                      className="w-full cursor-pointer outline-none border border-dark-600/70 focus:ring-1 focus:ring-dark-700 focus:border-dark-700 rounded p-1"
                    />
                  </div>
                }
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
              )}
            </div>
          )}
        />
      </div>
    );
  }
};

export default DateTimePicker;

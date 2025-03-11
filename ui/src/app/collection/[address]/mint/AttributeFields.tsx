"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash } from "lucide-react";

interface AttributeFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
}

export function AttributeFields({ control, name }: AttributeFieldsProps) {
  // Use React Hook Form's useFieldArray to handle the attributes array
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Add a new empty attribute
  const addAttribute = () => {
    append({ trait_type: "", value: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel className="text-base">NFT Attributes (Optional)</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAttribute}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Attribute
        </Button>
      </div>

      <div className="space-y-4">
        {fields.length === 0 && (
          <div className="text-sm text-gray-500 rounded-lg border p-4 text-center bg-gray-50">
            No attributes added yet. Attributes help make your NFT more unique.
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start">
            <FormField
              control={control}
              name={`${name}.${index}.trait_type`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm">Trait Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${name}.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm">Value</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Blue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 mt-8"
              onClick={() => remove(index)}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

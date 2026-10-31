import { createContext, useContext, type HTMLAttributes, type LabelHTMLAttributes, type ReactNode } from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";

/** react-hook-form's provider: <Form {...form}><form onSubmit={form.handleSubmit(...)}> */
export const Form = FormProvider;

const FieldContext = createContext<{ name: string }>({ name: "" });

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FieldContext.Provider>
  );
}

export function FormItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export function FormLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium", className)} {...props} />;
}

export function FormControl({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function FormDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-muted-foreground", className)} {...props} />;
}

export function FormMessage({ className, children }: { className?: string; children?: ReactNode }) {
  const { name } = useContext(FieldContext);
  const { getFieldState, formState } = useFormContext();
  const error = name ? getFieldState(name, formState).error : undefined;
  const message = error?.message ?? children;
  if (!message) return null;
  return <p className={cn("text-xs font-medium text-destructive", className)}>{String(message)}</p>;
}

export default Form;

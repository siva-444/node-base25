import { useForm } from "react-hook-form";
import type {
  SubmitHandler,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

export type FormProps = {
  defaultValues?: FieldValues;
  onSubmit: SubmitHandler<FieldValues>;
  children: (methods: UseFormReturn<FieldValues>) => React.ReactNode;
};

export function Form({ defaultValues, onSubmit, children }: FormProps) {
  const methods = useForm<FieldValues>({ defaultValues });
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>{children(methods)}</form>
  );
}

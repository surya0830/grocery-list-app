import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormState {
  [key: string]: {
    value: any;
    error: string | null;
    touched: boolean;
  };
}

interface UseFormOptions {
  initialValues: { [key: string]: any };
  validationRules?: ValidationRules;
  onSubmit: (values: { [key: string]: any }) => void;
}

export const useForm = ({ initialValues, validationRules = {}, onSubmit }: UseFormOptions) => {
  const [formState, setFormState] = useState<FormState>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
      return acc;
    }, {} as FormState)
  );

  const validateField = useCallback(
    (name: string, value: any): string | null => {
      const rule = validationRules[name];
      if (!rule) return null;

      if (rule.required && !value) {
        return rule.message;
      }

      if (rule.minLength && value.length < rule.minLength) {
        return rule.message;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message;
      }

      if (rule.custom && !rule.custom(value)) {
        return rule.message;
      }

      return null;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (name: string, value: any) => {
      setFormState((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: validateField(name, value),
        },
      }));
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setFormState((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          touched: true,
          error: validateField(name, prev[name].value),
        },
      }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(() => {
    const values = Object.keys(formState).reduce((acc, key) => {
      acc[key] = formState[key].value;
      return acc;
    }, {} as { [key: string]: any });

    const errors = Object.keys(formState).reduce((acc, key) => {
      const error = validateField(key, formState[key].value);
      if (error) {
        acc[key] = error;
      }
      return acc;
    }, {} as { [key: string]: string });

    if (Object.keys(errors).length === 0) {
      onSubmit(values);
    } else {
      setFormState((prev) =>
        Object.keys(prev).reduce((acc, key) => {
          acc[key] = {
            ...prev[key],
            error: errors[key] || null,
            touched: true,
          };
          return acc;
        }, {} as FormState)
      );
    }
  }, [formState, validateField, onSubmit]);

  const resetForm = useCallback(() => {
    setFormState(
      Object.keys(initialValues).reduce((acc, key) => {
        acc[key] = {
          value: initialValues[key],
          error: null,
          touched: false,
        };
        return acc;
      }, {} as FormState)
    );
  }, [initialValues]);

  const setFieldValue = useCallback((name: string, value: any) => {
    handleChange(name, value);
  }, [handleChange]);

  const setFieldError = useCallback((name: string, error: string | null) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      },
    }));
  }, []);

  return {
    values: Object.keys(formState).reduce((acc, key) => {
      acc[key] = formState[key].value;
      return acc;
    }, {} as { [key: string]: any }),
    errors: Object.keys(formState).reduce((acc, key) => {
      acc[key] = formState[key].error;
      return acc;
    }, {} as { [key: string]: string | null }),
    touched: Object.keys(formState).reduce((acc, key) => {
      acc[key] = formState[key].touched;
      return acc;
    }, {} as { [key: string]: boolean }),
    isValid: Object.values(formState).every((field) => !field.error),
    isDirty: Object.values(formState).some((field) => field.touched),
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
}; 
import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../useForm';

describe('useForm', () => {
  const mockOnSubmit = jest.fn();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
    password: {
      required: true,
      minLength: 8,
      message: 'Password must be at least 8 characters long',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with provided values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({
      email: null,
      password: null,
    });
    expect(result.current.touched).toEqual({
      email: false,
      password: false,
    });
  });

  it('should validate required fields', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.errors).toEqual({
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters long',
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate email format', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.handleChange('email', 'invalid-email');
    });

    expect(result.current.errors.email).toBe('Please enter a valid email address');
  });

  it('should validate password length', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.handleChange('password', 'short');
    });

    expect(result.current.errors.password).toBe('Password must be at least 8 characters long');
  });

  it('should call onSubmit when form is valid', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.errors).toEqual({
      email: null,
      password: null,
    });
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should mark fields as touched on blur', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.handleBlur('email');
    });

    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.password).toBe(false);
  });

  it('should reset form to initial values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({
      email: null,
      password: null,
    });
    expect(result.current.touched).toEqual({
      email: false,
      password: false,
    });
  });

  it('should set field value programmatically', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('should set field error programmatically', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.setFieldError('email', 'Custom error message');
    });

    expect(result.current.errors.email).toBe('Custom error message');
  });
}); 
import type { ComponentPropsWithRef, ReactNode } from 'react';

const classes = (...names: (string | undefined)[]) => names.filter(Boolean).join(' ') || undefined;

type Messages = { id: string; label: string; hint?: string; error?: string };
function fieldState({ id, label, hint, error }: Messages, description?: string) {
  if (!id?.trim() || /\s/.test(id) || !label?.trim()) {
    throw new Error('RevaCSS fields require a unique nonempty ID without whitespace and a label.');
  }
  return [...new Set([...(description?.split(/\s+/).filter(Boolean) ?? []),
    ...(hint ? [`${id}-hint`] : []), ...(error ? [`${id}-error`] : [])])].join(' ') || undefined;
}

export type FieldProps = Omit<ComponentPropsWithRef<'div'>, 'id'> & Messages;
export function Field({ id, label, hint, error, children, className, ...attributes }: FieldProps) {
  fieldState({ id, label, hint, error });
  return <div {...attributes} className={classes('form-group', className)}>
    <label htmlFor={id}>{label}</label>{children}
    {hint && <small id={`${id}-hint`}>{hint}</small>}
    {error && <small id={`${id}-error`} className="field-error">{error}</small>}
  </div>;
}

export type LayoutProps = ComponentPropsWithRef<'div'> & {
  mainId: string; skipLabel?: string; header?: ReactNode; footer?: ReactNode;
};
export function Layout({ mainId, skipLabel = 'Skip to content', header, footer, children, ...attributes }: LayoutProps) {
  if (!mainId?.trim() || /\s/.test(mainId)) throw new Error('Layout requires a unique nonempty mainId without whitespace.');
  return <div {...attributes}>
    <a className="skip-link" href={`#${mainId}`}>{skipLabel}</a>{header}
    <main id={mainId} className="container" tabIndex={-1}>{children}</main>{footer}
  </div>;
}

export type ButtonProps = ComponentPropsWithRef<'button'>;
export function Button({ type = 'button', ...attributes }: ButtonProps) {
  return <button {...attributes} type={type} />;
}
export type LinkProps = ComponentPropsWithRef<'a'> & { href: string };
export function Link({ className, ...attributes }: LinkProps) {
  return <a {...attributes} className={classes('button', className)} />;
}
export type CardProps = ComponentPropsWithRef<'article'> & { header?: ReactNode; footer?: ReactNode };
export function Card({ className, header, footer, children, ...attributes }: CardProps) {
  return <article {...attributes} className={classes('card', className)}>
    {header != null && <header>{header}</header>}{children}{footer != null && <footer>{footer}</footer>}
  </article>;
}
export type AlertProps = ComponentPropsWithRef<'div'>;
export function Alert({ className, ...attributes }: AlertProps) {
  return <div {...attributes} className={classes('alert', className)} />;
}
export type DisclosureProps = ComponentPropsWithRef<'details'> & { summary: ReactNode };
export function Disclosure({ summary, children, ...attributes }: DisclosureProps) {
  return <details {...attributes}><summary>{summary}</summary>{children}</details>;
}

type TextInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'date' | 'datetime-local' | 'month' | 'week' | 'time';
export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'id' | 'type' | 'children'> & Messages & { type?: TextInputType };
const inputTypes: readonly string[] = ['text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date', 'datetime-local', 'month', 'week', 'time'];
export function Input({ id, label, hint, error, type = 'text', 'aria-describedby': description, 'aria-invalid': invalid, ...attributes }: InputProps) {
  if (!inputTypes.includes(type)) throw new Error('Use native choice/file/hidden controls rather than the text-like Input wrapper.');
  const describedBy = fieldState({ id, label, hint, error }, description);
  return <Field id={id} label={label} hint={hint} error={error}>
    <input {...attributes} id={id} type={type} aria-describedby={describedBy} aria-invalid={error ? true : invalid} />
  </Field>;
}
export type SelectProps = Omit<ComponentPropsWithRef<'select'>, 'id'> & Messages;
export function Select({ id, label, hint, error, 'aria-describedby': description, 'aria-invalid': invalid, ...attributes }: SelectProps) {
  const describedBy = fieldState({ id, label, hint, error }, description);
  return <Field id={id} label={label} hint={hint} error={error}>
    <select {...attributes} id={id} aria-describedby={describedBy} aria-invalid={error ? true : invalid} />
  </Field>;
}
export type TextareaProps = Omit<ComponentPropsWithRef<'textarea'>, 'id' | 'children'> & Messages;
export function Textarea({ id, label, hint, error, 'aria-describedby': description, 'aria-invalid': invalid, ...attributes }: TextareaProps) {
  const describedBy = fieldState({ id, label, hint, error }, description);
  return <Field id={id} label={label} hint={hint} error={error}>
    <textarea {...attributes} id={id} aria-describedby={describedBy} aria-invalid={error ? true : invalid} />
  </Field>;
}

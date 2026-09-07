import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "quiet" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-fg hover:bg-accent disabled:opacity-40",
  ghost:
    "border border-border bg-surface text-fg hover:bg-raised disabled:opacity-40",
  quiet: "bg-transparent text-muted hover:text-fg hover:bg-raised disabled:opacity-40",
  danger: "bg-bad/20 text-bad hover:bg-bad/30 disabled:opacity-40",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ className, variant = "primary", type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium tracking-wide transition-colors duration-150",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
});

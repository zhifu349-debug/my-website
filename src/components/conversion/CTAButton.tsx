interface CTAButtonProps {
  href: string;
  text: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CTAButton({
  href,
  text,
  variant = "primary",
  size = "md",
  className = "",
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-secondary focus:ring-primary",
    secondary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <a
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {text}
    </a>
  );
}

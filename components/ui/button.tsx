"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Every button is a pill, matching the navbar: one radius for the whole site, set here only.
// No shadows: the primary button swaps from black to white with a light grey outline on hover.
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground hover:bg-background hover:text-foreground hover:border-neutral-300 dark:hover:border-neutral-700",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "bg-background  hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-10 px-6 has-[>svg]:px-5",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// A server-rendered child (e.g. next-intl's Link from a server component) reaches this
// client component as a lazy reference, sometimes nested. Radix Slot only unwraps one
// level and then fails to find the element, so resolve every level first.
const REACT_LAZY = Symbol.for("react.lazy");
type Lazy = { $$typeof: symbol; _payload: PromiseLike<React.ReactNode> };
const isLazy = (node: React.ReactNode): node is React.ReactNode & Lazy =>
  typeof node === "object" && node !== null && (node as Partial<Lazy>).$$typeof === REACT_LAZY;
const useResolvedChild = (node: React.ReactNode) => {
  while (isLazy(node)) node = React.use(node._payload);
  return node;
};

// Pulled toward the cursor while the pointer is inside the zone around the button.
const MAGNET_STRENGTH = 0.35;

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const children = useResolvedChild(props.children);
  const targetRef = React.useRef<HTMLElement>(null);

  const onMouseMove = (event: React.MouseEvent<HTMLSpanElement>) => {
    const target = targetRef.current;
    if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH;
    const y = (event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH;
    target.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseLeave = () => {
    if (targetRef.current) targetRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <span
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-flex w-fit p-3 -m-3"
    >
      <Comp
        ref={targetRef as React.Ref<HTMLButtonElement>}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size }),
          "transition-[transform,background-color,box-shadow,color] duration-150 ease-out",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    </span>
  );
}

export { Button, buttonVariants };

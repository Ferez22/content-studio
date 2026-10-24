import React from "react";

export const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="text-2xl md:text-3xl font-display font-bold tracking-tight mt-12 mb-4"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="text-xl font-display font-bold mt-8 mb-3" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p
      className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 my-4 leading-relaxed"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul
      className="list-disc pl-6 my-4 flex flex-col gap-2 text-base md:text-lg text-neutral-600 dark:text-neutral-300"
      {...props}
    />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      className="list-decimal pl-6 my-4 flex flex-col gap-2 text-base md:text-lg text-neutral-600 dark:text-neutral-300"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-black dark:text-white" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="underline underline-offset-4 hover:text-black dark:hover:text-white"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  h4: (props: React.ComponentProps<"h4">) => (
    <h4 className="text-lg font-display font-bold mt-6 mb-2" {...props} />
  ),
  em: (props: React.ComponentProps<"em">) => <em className="italic" {...props} />,
  hr: () => <hr className="my-10 border-neutral-200 dark:border-neutral-800" />,
  // Markdown images: ![Alt text](/blog/<slug>/image.png). Files go in public/blog/<slug>/.
  img: ({ alt, ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      loading="lazy"
      className="my-8 w-full rounded-2xl border border-neutral-200 dark:border-neutral-800"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="my-6 overflow-x-auto rounded-2xl bg-neutral-950 dark:bg-neutral-900 border border-transparent dark:border-neutral-800 p-5 text-sm leading-relaxed text-neutral-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[0.9em] font-mono"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 my-6 italic text-neutral-600 dark:text-neutral-300"
      {...props}
    />
  ),
};

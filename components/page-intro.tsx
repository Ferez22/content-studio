import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";

export const PageIntro = ({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) => {
  return (
    <section className="pt-10 md:pt-20 lg:pt-32">
      <Container>
        <Heading as="h1">{title}</Heading>
        {intro && <Subheading className="py-8">{intro}</Subheading>}
        {children}
      </Container>
    </section>
  );
};

"use client";

import Container from "@/components/Container";
import { FormBGManager } from "@/components/FormBGManager";
import { H2 } from "@/styles/Type";


export default function ErrorBoundary({error}: any) {

  return (<Container>
    <FormBGManager />
    <H2>Couldn't submit your memory</H2>
    <pre>{JSON.stringify(error, null, 2)}</pre>
  </Container>)
}

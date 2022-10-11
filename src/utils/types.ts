import { PropsWithChildren } from "react";

export type Empty = Record<string, never>;

export type ChildrenProps = PropsWithChildren<Empty>;

import { CSSObject } from "@emotion/react";
import { HTMLAttributes, ReactNode, RefObject } from "react";

export type ChildrenProps = { children?: ReactNode };

export type CSSProps = { css?: CSSObject };

export type RefProps<T> = { ref?: RefObject<T> };

export type BaseProps<T> = CSSProps &
	RefProps<T> &
	RefProps<T> &
	Omit<HTMLAttributes<T>, "children">;

export type BasePropsWithChildren<T> = BaseProps<T> & ChildrenProps;

export type OverrideUnion<B, O> = O & Pick<B, Exclude<keyof B, keyof O>>;

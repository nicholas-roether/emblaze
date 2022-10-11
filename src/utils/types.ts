import { CSSObject } from "@emotion/react";
import { HTMLAttributes, ReactNode, RefObject } from "react";

export type ChildrenProps = { children?: ReactNode };

export type CSSProps = { css?: CSSObject };

export type RefProps<T> = { ref?: RefObject<T> };

export type BaseProps<T> = CSSProps &
	RefProps<T> &
	RefProps<T> &
	HTMLAttributes<T>;

export type BasePropsWithChilren<T> = BaseProps<T> & ChildrenProps;

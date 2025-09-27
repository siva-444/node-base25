import * as React from "react";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";
import JoyLink, { type LinkProps as JoyLinkProps } from "@mui/joy/Link";

export interface RouterJoyLinkProps
  extends Omit<JoyLinkProps, "component" | "href">,
    Pick<RouterLinkProps, "to" | "replace" | "state"> {
  children: React.ReactNode;
}

export default function Link(props: RouterJoyLinkProps) {
  const { to, replace, state, children, ...joyProps } = props;
  return (
    <JoyLink
      {...joyProps}
      component={RouterLink}
      to={to}
      replace={replace}
      state={state}
    >
      {children}
    </JoyLink>
  );
}

// Usage example:
// <Link to="/docs">Read doc</Link>

import React, { type PropsWithChildren } from "react";
import { Link } from "react-router";

type NavItemProps = PropsWithChildren & {
  link: string;
};

const NavItem = ({ children, link }: NavItemProps) => {
  return (
    <Link to={link} aria-current="page" className="hover:bg-secondary/80 rounded-md p-2 block sm:text-xl">
      {children}
    </Link>
  );
};

export default NavItem;

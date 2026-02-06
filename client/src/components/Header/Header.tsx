import { Outlet } from "react-router";
import NavBar from "../navbar";
import NavItem from "../navbar/NavItem";

const Header = () => {
  return (
    <div className="font-casual text-textcolor">
      <div className="flex flex-col items-center py-8 relative">
        <h1 id="title" className="text-4xl font-cursive mb-4">
          Ysabel & Steve
        </h1>
        <NavBar>
          <NavItem link="/">Home</NavItem>
          <NavItem link="#">Wedding Party</NavItem>
          <NavItem link="#">Schedule</NavItem>
          <NavItem link="/photos">Photos</NavItem>
          <NavItem link="#">Registry</NavItem>
          <NavItem link="#">FAQs</NavItem>
          <NavItem link="/rsvp">RSVP</NavItem>
        </NavBar>
      </div>
      <Outlet />
    </div>
  );
};

export default Header;

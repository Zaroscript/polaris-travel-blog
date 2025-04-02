import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons";
import './Sidebar.css';

type SidebarProps = {
  activePath: string;
};

const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
  return (
    <Nav className="flex-column p-2 p-lg-5">
      <Nav.Item>
        <Nav.Link as={Link} to="/settings/" active={activePath === "/settings/"} className="fw-bold">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          Account Settings
        </Nav.Link>
      </Nav.Item>
      
      <Nav.Item>
        <Nav.Link as={Link} to="/settings/notification" active={activePath === "/settings/notification"} className="fw-bold">
          <FontAwesomeIcon icon={faBell} className="me-2" />
          Notification
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
export default Sidebar;
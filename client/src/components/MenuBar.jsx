import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

import { authContext } from "../context/auth";

function MenuBar() {
    const pathname = window.location.pathname;
    // TODO როცა დავრეგისტრირდები home pageზე გადმოსვლისას home ღილაკს არ ააქტიურებს
    const path = pathname === "/" ? "HOME" : pathname.substring(1);
    const [activeItem, setActiveItem] = useState(path.toUpperCase());
    const { userData, logout } = useContext(authContext);

    const onLogOut = () => logout();
    const handleItemClick = (e, { name }) => setActiveItem(name);

    const menuBar = userData ? (
        <Menu pointing secondary size="massive" color="teal">
            <Menu.Item name={userData.username} active as={Link} to="/" />
            <Menu.Menu position="right">
                <Menu.Item name="LOGOUT" onClick={onLogOut} />
            </Menu.Menu>
        </Menu>
    ) : (
        <Menu pointing secondary size="massive" color="teal">
            <Menu.Item name="HOME" active={activeItem === "HOME"} onClick={handleItemClick} as={Link} to="/" />
            <Menu.Menu position="right">
                <Menu.Item
                    name="LOGIN"
                    active={activeItem === "LOGIN"}
                    onClick={handleItemClick}
                    as={Link}
                    to="/login"
                />
                <Menu.Item
                    name="REGISTER"
                    active={activeItem === "REGISTER"}
                    onClick={handleItemClick}
                    as={Link}
                    to="/register"
                />
            </Menu.Menu>
        </Menu>
    );

    return menuBar;
}
export default MenuBar;

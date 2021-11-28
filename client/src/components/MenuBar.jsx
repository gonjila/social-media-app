import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

function MenuBar() {
    const pathname = window.location.pathname;
    // TODO როცა დავრეგისტრირდები home pageზე გადმოსვლისას home ღილაკს არ ააქტიურებს
    const path = pathname === "/" ? "HOME" : pathname.substring(1);
    const [activeItem, setActiveItem] = useState(path.toUpperCase());

    const handleItemClick = (e, { name }) => setActiveItem(name);

    return (
        <div>
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
        </div>
    );
}
export default MenuBar;

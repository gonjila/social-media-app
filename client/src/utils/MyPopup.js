import { Popup } from "semantic-ui-react";

function MyPopup({ content, children }) {
    return <Popup content={content} inverted trigger={children}></Popup>;
}

export default MyPopup;

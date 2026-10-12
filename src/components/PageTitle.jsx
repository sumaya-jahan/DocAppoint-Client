import { useEffect } from "react";

const PageTitle = ({ title }) => {
    useEffect(() => {
        document.title = `${title} | DocAppoint`;
    }, [title]);

    return null;
};

export default PageTitle;
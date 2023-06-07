// importing modules 
import FadeLoader from "react-spinners/FadeLoader";


function Loader() {

    // css styles for the spinner container 
    const cssStyles = {
        display: "flex",
        justifyContent: "Center",
        alignItems: "Center",
        width: "100%",
        height: "100vh"
    }

    return (
        <div style={cssStyles}>
            <FadeLoader
                color="#ADE4DB"
                loading={true}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}

export default Loader;
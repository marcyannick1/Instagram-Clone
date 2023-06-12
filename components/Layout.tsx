import { Box } from "@chakra-ui/react";
import React from "react";
import Nav from "./Nav/Nav";
import { CSSProperties } from "react";

export default function Layout({ children, style, loggedInUser } :any) {
    return (
        <>
            <Nav loggedInUser={loggedInUser}/>
            <Box ml="245" style={style as CSSProperties}>{children}</Box>
        </>
    );
}

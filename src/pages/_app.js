import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import "../styles/globals.css";

// Create a dark theme
const theme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#90caf9",
		},
		secondary: {
			main: "#f48fb1",
		},
		background: {
			default: "#1a1a1a",
			paper: "#262626",
		},
	},
});

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<meta name='viewport' content='initial-scale=1, width=device-width' />
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
				/>
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}

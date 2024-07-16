import { Inter } from "next/font/google";
import "./globals.css"
import 'bootstrap/dist/css/bootstrap.css';
import { GoogleOAuthProvider } from "@react-oauth/google"
import React from "react"
import BootstrapClient from "./util/BootStrapClient";
const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "Recruit Rogers",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId='814132104319-g4fpovbih48qv56lptufcv1pi2ldifcq.apps.googleusercontent.com'>
          <React.StrictMode>
            {children}
          </React.StrictMode>
        </GoogleOAuthProvider>
        <BootstrapClient />
      </body>
    </html>
  );
}

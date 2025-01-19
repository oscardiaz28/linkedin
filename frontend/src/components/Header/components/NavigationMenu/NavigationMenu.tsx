import { NavLink } from "react-router-dom"
import classes from './NavigationMenu.module.scss'
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type NavigationMenuProps = {
  count: number,
  setShowProfileMenu: Dispatch<SetStateAction<boolean>>,
  setShowNavigationMenu: Dispatch<SetStateAction<boolean>>
};

export const NavigationMenu = ({ count, setShowProfileMenu, setShowNavigationMenu }: NavigationMenuProps) => {
  return (
    <ul className={classes.ul}>
        <li>
        <NavLink
            to="/"
            className={({ isActive }) => (isActive ? classes.active : "")}
            onClick={() => {
            setShowProfileMenu(false);
            if (window.innerWidth <= 1080) {
                setShowNavigationMenu(false);
            }
            }}
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24"
            height="24"
            focusable="false"
            >
            <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
            </svg>
            <span>Home</span>
        </NavLink>
        </li>
        <li className={classes.network}>
        <NavLink
            onClick={() => {
            setShowProfileMenu(false);
            if (window.innerWidth <= 1080) {
                setShowNavigationMenu(false);
            }
            }}
            to="/network"
            className={({ isActive }) => (isActive ? classes.active : "")}
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            focusable="false"
            >
            <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
            </svg>
            <div>
            <span>Network</span>
            </div>
        </NavLink>
        </li>
        <li className={classes.messaging}>
        <NavLink
            onClick={() => {
            setShowProfileMenu(false);
            if (window.innerWidth <= 1080) {
                setShowNavigationMenu(false);
            }
            }}
            to="/messaging"
            className={({ isActive }) => (isActive ? classes.active : "")}
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            focusable="false"
            >
            <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
            </svg>
            <div>
            <span>Messaging</span>
            </div>
        </NavLink>
        </li>
        <li className={classes.notifications}>
        <NavLink
            onClick={() => {
            setShowProfileMenu(false);
            if (window.innerWidth <= 1080) {
                setShowNavigationMenu(false);
            }
            }}
            to="/notifications"
            className={({ isActive }) => (isActive ? classes.active : "")}
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            focusable="false"
            >
            <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
            </svg>
            <div>
                { count > 0 ? (
                    <span className={classes.badge}>{count}</span>
                ) : null }
                <span>Notications</span>
            </div>
        </NavLink>
        </li>
    </ul>
  );
};


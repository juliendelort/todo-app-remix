import { NavLink } from '@remix-run/react';

export const NavLinks = ({ countAll, countCompleted, countActive }) => (
    <>
        <NavLink to="/" >All ({countAll})</NavLink>
        <NavLink to="/active">Active ({countActive})</NavLink>
        <NavLink to="/completed">Completed ({countCompleted})</NavLink>
    </>
);

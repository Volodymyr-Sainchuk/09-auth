"use client";

import Link from "next/link";
import css from "./AuthNavigation.module.css";

interface AuthNavigationProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout: () => void;
}

export default function AuthNavigation({ isAuthenticated, userEmail, onLogout }: AuthNavigationProps) {
  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{userEmail}</p>
          <button className={css.logoutButton} onClick={onLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}

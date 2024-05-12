import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Icon } from "@iconify/react";

import useMediaQuery from "../utils/useMediaQuery";

import styles from "../styles/header.module.css";

const Header: React.FC = () => {
  const router = useRouter();
  const isBreakpoint = useMediaQuery(800);
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let right = null;

  if (status === "loading") {
    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className={styles.right}>
        <Link className={styles.menuBtn} href="/api/auth/signin">
          {isBreakpoint ? <Icon icon="mdi:sign-in-variant" /> : "Log in"}
        </Link>
      </div>
    );
  }

  if (session) {
    right = (
      <div className={styles.right}>
        <Link
          className={`${styles.menuBtn} ${isActive("/mine") && styles.active}`}
          href="/mine"
        >
          {isBreakpoint ? <Icon icon="fa6-solid:list-ul" /> : "My Recipes"}
        </Link>
        <Link
          className={`${styles.menuBtn} ${
            isActive("/create") && styles.active
          }`}
          href="/create"
        >
          {isBreakpoint ? <Icon icon="ic:outline-create" /> : "Create"}
        </Link>
        <button className={styles.menuBtn} onClick={() => signOut()}>
          {isBreakpoint ? <Icon icon="mdi:logout" /> : "Log out"}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.navi}>
      <div className="left">
        <Link
          href="/"
          className={`${styles.homeBtn} ${isActive("/") && styles.active}`}
        >
          <Icon icon="ph:bowl-food" />
        </Link>
      </div>
      {right}
    </div>
    // <nav className={styles.navi}>
    //   <div className="left">
    //     {/* <button className={styles.homeBtn} onClick={() => Router.push("/")}> */}
    //     <Icon icon="ph:bowl-food" />
    //     {/* <Icon icon="ph:bowl-food" /> */}
    //     {/* </button> */}
    //     {/* <Link href="/" className={styles.homeBtn}>
    //   <Icon icon="ph:bowl-food" />
    //   </Link> */}
    //   </div>
    //   {right}
    // </nav>
  );
};

export default Header;

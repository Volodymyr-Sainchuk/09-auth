"use client";

import css from "./Profile.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

export default function ProfileClient() {
  const { user } = useAuthStore();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username || "Unknown"}</p>
          <p>Email: {user?.email || "Unknown"}</p>
        </div>
      </div>
    </main>
  );
}

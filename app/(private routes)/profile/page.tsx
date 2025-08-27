import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api/serverApi";
import type { User } from "@/types/user";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page with account details and settings.",
};

export default async function ProfilePage() {
  const user: User | null = await getCurrentUser();

  if (!user) {
    return <p>User not found or not logged in.</p>;
  }

  return (
    <main className={css.container}>
      <div className={css.profileCard}>
        {user.avatar && (
          <Image src={user.avatar} alt={`${user.username} avatar`} width={120} height={120} className={css.avatar} />
        )}
        <h1 className={css.username}>{user.username}</h1>
        <p className={css.email}>{user.email}</p>

        <Link href="/profile/edit" className={css.editLink}>
          Edit Profile
        </Link>
      </div>
    </main>
  );
}

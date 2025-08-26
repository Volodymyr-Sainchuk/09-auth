import { Metadata } from "next";
import ProfileClient from "./profileClient";
import { getCurrentUser } from "@/lib/api/serverApi";
import type { User } from "@/types/user";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page with account details and settings.",
};

export default async function ProfilePage() {
  const user: User | null = await getCurrentUser();

  if (!user) {
    return <p>User not found or not logged in.</p>;
  }

  return <ProfileClient user={user} />;
}

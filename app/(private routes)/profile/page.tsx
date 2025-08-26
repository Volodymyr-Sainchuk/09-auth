import { Metadata } from "next";
import ProfileClient from "./profileClient";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page with account details and settings.",
};

export default async function ProfilePage() {
  return <ProfileClient />;
}

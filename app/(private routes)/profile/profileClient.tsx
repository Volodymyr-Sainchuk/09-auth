import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user";

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  return (
    <div>
      <Image src={user.avatar} alt={user.username} width={100} height={100} />
      <h1>{user.username}</h1>
      <p>{user.email}</p>
      <Link href="/profile/edit">Edit Profile</Link>
    </div>
  );
}

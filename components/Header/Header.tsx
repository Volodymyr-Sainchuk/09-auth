"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import css from "./Header.module.css";
import TagsMenu, { Tag } from "../TagsMenu/TagsMenu";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import { useAuthStore } from "@/lib/store/authStore";

interface HeaderProps {
  tags: Tag[];
}

export default function Header({ tags }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag") || "All";
  const { isAuthenticated, logout, user } = useAuthStore();

  function handleSelectTag(tagName: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (tagName === "All") {
      params.delete("tag");
    } else {
      const tag = tags.find((t) => t.name === tagName);
      if (tag) params.set("tag", tag.id);
    }

    router.push(`/notes/?${params.toString()}`);
  }

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation" className={css.nav}>
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <TagsMenu tags={tags} selectedTag={selectedTag} onSelectTag={handleSelectTag} />
          </li>

          <AuthNavigation
            isAuthenticated={isAuthenticated}
            userEmail={user?.email}
            onLogout={() => {
              logout();
              router.push("/sign-in");
            }}
          />
        </ul>
      </nav>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./page.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { updateUser, getSession } from "@/lib/api/clientApi";
import axios, { AxiosError } from "axios";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const me = user ?? (await getSession());
        if (!me) {
          console.error("User not found");
          router.push("/login");
          return;
        }

        setUser(me);
        setUsername(me.username ?? "");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div>Loading...</div>;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      if (!user) return;

      const updatedUser = await updateUser({ username });
      setUser(updatedUser);
      setUsername(updatedUser.username ?? "");
      router.push("/profile");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 409) {
          alert("Цей username вже зайнятий. Спробуйте інший.");
        } else {
          console.error("Failed to update user:", axiosErr);
          alert("Помилка при збереженні профілю.");
        }
      } else {
        console.error("Unexpected error:", err);
        alert("Помилка при збереженні профілю.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    router.push("/profile");
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {/* Avatar */}
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user?.email ?? "Not found"}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className={css.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

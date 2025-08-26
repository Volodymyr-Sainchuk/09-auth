import { Suspense } from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Notes from "./Notes.client";
import { fetchNotesServer, type FetchNotesResponse } from "@/lib/api/serverApi";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function FilteredNotesPage({ params }: Props) {
  const slug = (await params).slug || [];
  const tag = slug.length > 0 ? slug[0] : "All";

  const queryClient = new QueryClient();
  const queryTag = tag === "All" ? undefined : tag;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let data: FetchNotesResponse;

  try {
    if (!token) {
      console.warn("Token not found. Fetching notes as guest.");
      data = { notes: [], totalPages: 1 };
    } else {
      data = await fetchNotesServer({ query: "", page: 1, perPage: 12, tag: queryTag }, token);
    }
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    data = { notes: [], totalPages: 1 };
  }

  const cacheTagKey = tag === "All" ? "" : tag;
  queryClient.setQueryData(["notes", "", 1, cacheTagKey], data);

  return (
    <Suspense>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Notes initialData={data} initialTag={tag} />
      </HydrationBoundary>
    </Suspense>
  );
}

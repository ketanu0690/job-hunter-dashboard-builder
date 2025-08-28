import { CoreApiResponse } from "@/shared/types/APIResponse";
import { APIHelper } from "@/shared/utils/axios";
import { useQuery } from "@tanstack/react-query";

// --------- Types ----------
export interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  enclosure: string;
  content: string;
  contentImage: string | null;
}

const fetchMediumPosts = async (
  userId: string,
  limit: number = 10
): Promise<MediumPost[]> => {
  const res = await APIHelper.get<CoreApiResponse<MediumPost[]>>(
    `${"https://localhost:7296"}/api/medium/${userId}`
  );
  return res.data ?? [];
};

// --------- TanStack Hook ----------
export const useMediumPosts = (userId?: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["mediumPosts", userId, limit],
    queryFn: () => fetchMediumPosts(userId!, limit),
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};

import { useEffect, useState } from "react";
import { MoreHorizontal, LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

/* ----------------------------- Medium Section ----------------------------- */
function useMediumIntegration(onIntegrated: (username: string) => void) {
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (user?.metaData?.medium_username) {
      setUsername(user.metaData.medium_username as string);
    }
  }, [user]);

  const connect = async () => {
    if (!input) return;
    const { error } = await supabase.auth.updateUser({
      data: { medium_username: input },
    });
    if (error) throw error;
    setUsername(input);
    onIntegrated(input);
    setInput("");
  };

  const disconnect = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { medium_username: null },
    });
    if (error) throw error;
    setUsername(null);
    onIntegrated("");
  };

  return { username, input, setInput, connect, disconnect };
}

/* ----------------------------- Reddit Section ----------------------------- */
function useRedditIntegration(onIntegrated: (username: string) => void) {
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (user?.metaData?.reddit_username) {
      setUsername(user.metaData.reddit_username as string);
    }
  }, [user]);

  const connect = async () => {
    if (!input) return;
    const { error } = await supabase.auth.updateUser({
      data: { reddit_username: input },
    });
    if (error) throw error;
    setUsername(input);
    onIntegrated(input);
    setInput("");
  };

  const disconnect = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { reddit_username: null },
    });
    if (error) throw error;
    setUsername(null);
    onIntegrated("");
  };

  return { username, input, setInput, connect, disconnect };
}

/* ----------------------------- Main Component ----------------------------- */
export default function IntegrationMenu({
  onIntegrated,
}: {
  onIntegrated: (username: string) => void;
}) {
  const medium = useMediumIntegration(onIntegrated);
  const reddit = useRedditIntegration(onIntegrated);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent transition"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 max-h-96 overflow-y-auto rounded-xl border bg-popover p-2 shadow-lg"
        align="end"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
          Integrations
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Medium */}
        {medium.username ? (
          <div className="flex justify-between items-center px-2 py-1">
            <span className="text-sm">Medium (@{medium.username})</span>
            <Button size="icon" variant="ghost" onClick={medium.disconnect}>
              <LogOut className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="px-2 py-1 flex gap-2">
            <Input
              placeholder="Medium username"
              value={medium.input}
              onChange={(e) => medium.setInput(e.target.value)}
              className="h-8 text-black"
            />
            <Button size="sm" onClick={medium.connect} disabled={!medium.input}>
              Connect
            </Button>
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Reddit */}
        {reddit.username ? (
          <div className="flex justify-between items-center px-2 py-1">
            <span className="text-sm">Reddit (u/{reddit.username})</span>
            <Button size="icon" variant="ghost" onClick={reddit.disconnect}>
              <LogOut className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="px-2 py-1 flex gap-2">
            <Input
              placeholder="Reddit username"
              value={reddit.input}
              onChange={(e) => reddit.setInput(e.target.value)}
              className="h-8 text-black"
            />
            <Button size="sm" onClick={reddit.connect} disabled={!reddit.input}>
              Connect
            </Button>
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Other Platforms */}
        <DropdownMenuItem
          onClick={() => alert("LinkedIn integration TBD")}
          className="cursor-pointer rounded-md hover:bg-accent"
        >
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => alert("Twitter integration TBD")}
          className="cursor-pointer rounded-md hover:bg-accent"
        >
          Twitter (X)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

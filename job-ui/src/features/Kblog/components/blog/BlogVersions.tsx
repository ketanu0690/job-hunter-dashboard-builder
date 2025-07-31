import React from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { History } from "lucide-react";
import { Blog } from "@/types/blog";
import { formatDistanceToNow } from "date-fns";
import { useBlogStore } from "@/stores/blogStore";
import { useToast } from "@/hooks/use-toast";

interface BlogVersionsProps {
  blogId: string;
}

const BlogVersions: React.FC<BlogVersionsProps> = ({ blogId }) => {
  const { toast } = useToast();
  const { getBlogVersions, restoreVersion } = useBlogStore();
  const versions = getBlogVersions(blogId);

  const handleRestore = (versionIndex: number) => {
    restoreVersion(blogId, versionIndex);
    toast({
      title: "Version restored",
      description: "The selected version has been restored successfully.",
    });
  };

  if (versions.length === 0) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <History className="h-4 w-4" />
          Version History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          {versions.length === 0 ? (
            <p className="text-muted-foreground">
              No version history available.
            </p>
          ) : (
            versions.map((version, index) => (
              <Card key={version.versionId || index} className="glass-card">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm flex justify-between items-center">
                    <span>Version {versions.length - index}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(version.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-sm font-medium mb-1 truncate">
                    {version.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {version.excerpt || version.content.substring(0, 100)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleRestore(index)}
                  >
                    Restore This Version
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BlogVersions;

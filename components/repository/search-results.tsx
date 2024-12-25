"use client";

import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
interface Match {
  id: string;
  content: string;
  similarity: number;
}

interface SearchResult {
  filepath: string;
  type: string;
  repositoryName: string;
  matches: Match[];
}

interface SearchResultsProps {
  results: Array<{
    id: string;
    filepath: string;
    type: string;
    repositoryName: string;
    content: string;
    similarity: number;
  }>;
}

export function SearchResults({ results }: SearchResultsProps) {
  const groupedResults = results.reduce((acc, result) => {
    const key = result.filepath;
    if (!acc[key]) {
      acc[key] = {
        filepath: result.filepath,
        type: result.type,
        repositoryName: result.repositoryName,
        matches: [],
      };
    }
    acc[key].matches.push({
      id: result.id,
      content: result.content,
      similarity: result.similarity,
    });
    return acc;
  }, {} as Record<string, SearchResult>);

  const uniqueFiles = Object.values(groupedResults);

  if (uniqueFiles.length > 0) {
    console.log("uniqueFiles[0].matches is ", uniqueFiles[0].matches);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Results</h3>
        <span className="text-xs text-muted-foreground">
          {uniqueFiles.length} files with matches
        </span>
      </div>
      <div className="space-y-3">
        {uniqueFiles.map((file) => (
          <div
            key={file.filepath}
            className="group cursor-pointer rounded-lg border border-border/50 bg-secondary/50 p-4 transition-all hover:bg-accent hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {file.filepath.split("/").pop()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {file.matches.length}{" "}
                    {file.matches.length === 1 ? "match" : "matches"}
                  </span>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {file.type}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {file.filepath}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

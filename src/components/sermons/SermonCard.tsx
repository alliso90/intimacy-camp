"use client";

import { motion } from "framer-motion";
import { Download, Video, Music, Calendar, User, Play } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useState } from "react";

interface SermonCardProps {
  sermon: {
    _id: string;
    title: string;
    description: string;
    speaker: string;
    date: string;
    videoUrl?: string;
    audioUrl?: string;
    category: string;
    views: number;
    downloads: number;
  };
}

export function SermonCard({ sermon }: SermonCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (url: string, type: 'video' | 'audio') => {
    try {
      setIsDownloading(true);

      // Track download in background
      fetch(`/api/sermons/${sermon._id}/download`, { method: 'POST' });

      // Trigger actual download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sermon.title}_${sermon.speaker}_${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden border-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="relative p-0 aspect-video bg-gradient-to-br from-green-400/20 to-blue-500/20 flex items-center justify-center overflow-hidden">
          {sermon.videoUrl ? (
            <Video className="w-16 h-16 text-green-600/40" />
          ) : (
            <Music className="w-16 h-16 text-blue-600/40" />
          )}
          <Badge className="absolute top-4 right-4 capitalize font-semibold" variant="secondary">
            {sermon.category}
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4" />
            <span>{new Date(sermon.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
          </div>

          <CardTitle className="text-xl font-bold mb-2 line-clamp-2 hover:text-green-600 transition-colors">
            {sermon.title}
          </CardTitle>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
            <User className="w-4 h-4" />
            <span className="font-medium">{sermon.speaker}</span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
            {sermon.description}
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-wrap gap-2">
          {sermon.videoUrl && (
            <Button
              type="button"
              className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700"
              onClick={() => handleDownload(sermon.videoUrl!, 'video')}
              disabled={isDownloading}
            >
              <Video className="w-4 h-4 mr-2" />
              Watch
            </Button>
          )}
          {sermon.audioUrl && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 min-w-[120px] border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => handleDownload(sermon.audioUrl!, 'audio')}
              disabled={isDownloading}
            >
              <Music className="w-4 h-4 mr-2" />
              Listen
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

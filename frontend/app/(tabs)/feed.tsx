/**
 * Home Feed Screen - TikTok-style vertical video feed
 * Displays full-screen posts with video, product info, and interactions
 */

import { VideoFeed } from '@/components/VideoFeed';
import { StyleSheet } from 'react-native';

export default function FeedScreen() {
  return <VideoFeed />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const YouTubePlayer = ({ videoId }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&controls=1`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: embedUrl }}
        javaScriptEnabled
        domStorageEnabled
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={["*"]}
        userAgent="Mozilla/5.0 (Linux; Android 10; Mobile)"
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default YouTubePlayer;

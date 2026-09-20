package uz.otabekruziev.pixelhellrun.hardcore;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.widget.TextView;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

public final class MainActivity extends Activity {
 private WebView game;
 @Override public void onCreate(Bundle state) {
  super.onCreate(state);
  getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
  getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
  try {
   game = new WebView(this);
   game.setBackgroundColor(0xff050508);
   WebSettings settings = game.getSettings();
   settings.setJavaScriptEnabled(true);
   settings.setDomStorageEnabled(true);
   settings.setMediaPlaybackRequiresUserGesture(true);
   settings.setAllowFileAccess(false);
   settings.setAllowContentAccess(false);
   settings.setBlockNetworkLoads(true);
   settings.setSupportZoom(false);
   settings.setBuiltInZoomControls(false);
   settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
   game.setWebViewClient(new WebViewClient() {
    @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) { return true; }
    @Override public boolean shouldOverrideUrlLoading(WebView view, String url) { return true; }
   });
   setContentView(game);
   try (InputStream source = getAssets().open("game.html"); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
    byte[] buffer = new byte[8192];
    int count;
    while ((count = source.read(buffer)) != -1) output.write(buffer, 0, count);
    String html = new String(output.toByteArray(), StandardCharsets.UTF_8);
    game.loadDataWithBaseURL("https://hellrun.invalid/", html, "text/html", null, "https://hellrun.invalid/");
   }
   fullscreen();
  } catch (Exception error) {
   TextView message = new TextView(this);
   message.setPadding(32, 32, 32, 32);
   message.setText("O‘yinni ochib bo‘lmadi. Android System WebView’ni yangilang va qayta urinib ko‘ring.");
   message.setTextColor(0xffffcccc);
   message.setBackgroundColor(0xff050508);
   setContentView(message);
  }
 }
 private void fullscreen() {
  getWindow().getDecorView().setSystemUiVisibility(
   View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN |
   View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
   View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
 }
 @Override public void onWindowFocusChanged(boolean focused) { super.onWindowFocusChanged(focused); if (focused) fullscreen(); }
 @Override protected void onPause() {
  if (game != null) { game.evaluateJavascript("typeof pauseGame==='function' && pauseGame()", null); game.onPause(); game.pauseTimers(); }
  super.onPause();
 }
 @Override protected void onResume() {
  super.onResume();
  if (game != null) { game.resumeTimers(); game.onResume(); }
  fullscreen();
 }
 @Override public void onBackPressed() {
  if (game == null) { finish(); return; }
  game.evaluateJavascript("typeof nativeBack==='function' && nativeBack()", value -> {
   if (!"true".equals(value)) game.evaluateJavascript("typeof I18n!=='undefined' ? I18n.nativeDialog() : null", labels -> {
    String title="Exit the game?", leave="Exit", stay="Stay";
    try { JSONObject translated=new JSONObject(labels);title=translated.getString("title");leave=translated.getString("exit");stay=translated.getString("stay"); } catch (Exception ignored) {}
    new AlertDialog.Builder(this).setTitle(title)
     .setPositiveButton(leave, (dialog, which) -> finish()).setNegativeButton(stay, null).show();
   });
  });
 }
 @Override protected void onDestroy() { if (game != null) { game.destroy(); game = null; } super.onDestroy(); }
}

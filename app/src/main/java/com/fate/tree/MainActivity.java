package com.fate.tree;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;
import android.webkit.*;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;
import java.io.OutputStream;

public class MainActivity extends Activity {
    private static final int REQ_FILE = 1, REQ_SAVE = 2;
    private WebView wv;
    private ValueCallback<Uri[]> chooser;
    private String pendText = "", pendMime = "application/json", pendDone = "Library saved";

    public class Bridge {
        // Library export (unchanged behaviour).
        @JavascriptInterface public void saveText(String name, String text) {
            startSave(name, "application/json", text, "Library saved");
        }
        // Any text file made in Create (an app as .html, a document as .txt).
        @JavascriptInterface public void saveFile(String name, String mime, String text) {
            startSave(name, (mime == null || mime.isEmpty()) ? "text/plain" : mime, text, "File saved");
        }
    }

    private void startSave(final String name, final String mime, String text, String done) {
        pendText = text == null ? "" : text;
        pendMime = mime;
        pendDone = done;
        runOnUiThread(new Runnable() {
            @Override public void run() {
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType(mime);
                i.putExtra(Intent.EXTRA_TITLE, name);
                startActivityForResult(i, REQ_SAVE);
            }
        });
    }

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        wv = new WebView(this);
        wv.setBackgroundColor(0xFF05080A);
        setContentView(wv);
        WebSettings s = wv.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        wv.addJavascriptInterface(new Bridge(), "FateApp");
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        wv.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if ("appassets.androidplatform.net".equals(u.getHost())) return loader.shouldInterceptRequest(u);
                String sc = u.getScheme();
                if ("data".equals(sc) || "blob".equals(sc)) return null;
                return new WebResourceResponse("text/plain", "utf-8", new ByteArrayInputStream(new byte[0]));
            }
        });
        wv.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView w, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (chooser != null) chooser.onReceiveValue(null);
                chooser = cb;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("*/*");
                if (p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                try { startActivityForResult(Intent.createChooser(i, "Choose files"), REQ_FILE); }
                catch (Exception e) { chooser = null; return false; }
                return true;
            }
        });
        if (b != null) wv.restoreState(b);
        else wv.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    @Override protected void onActivityResult(int req, int res, Intent data) {
        if (req == REQ_FILE && chooser != null) {
            chooser.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(res, data));
            chooser = null;
        } else if (req == REQ_SAVE) {
            if (res == RESULT_OK && data != null && data.getData() != null) {
                try (OutputStream o = getContentResolver().openOutputStream(data.getData())) {
                    o.write(pendText.getBytes("UTF-8"));
                    Toast.makeText(this, pendDone, Toast.LENGTH_SHORT).show();
                } catch (Exception e) { Toast.makeText(this, "Save failed", Toast.LENGTH_LONG).show(); }
            }
            pendText = "";
        } else super.onActivityResult(req, res, data);
    }

    @Override protected void onSaveInstanceState(Bundle b) { super.onSaveInstanceState(b); wv.saveState(b); }
    @Override public void onBackPressed() { moveTaskToBack(true); }
    @Override protected void onDestroy() { wv.destroy(); super.onDestroy(); }
}

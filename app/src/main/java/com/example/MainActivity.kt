package com.example

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()

    setContent {
      MyApplicationTheme {
        Scaffold(
          modifier = Modifier.fillMaxSize(),
          contentWindowInsets = WindowInsets(0, 0, 0, 0)
        ) { _ ->
          ColorSpinMatchGameScreen()
        }
      }
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun ColorSpinMatchGameScreen() {
  val context = LocalContext.current
  val webView = remember {
    WebView(context).apply {
      layoutParams = ViewGroup.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
      )
      setBackgroundColor(android.graphics.Color.parseColor("#050b14"))
      isVerticalScrollBarEnabled = false
      isHorizontalScrollBarEnabled = false
      overScrollMode = WebView.OVER_SCROLL_NEVER

      settings.apply {
        javaScriptEnabled = true
        domStorageEnabled = true
        databaseEnabled = true
        allowFileAccess = true
        mediaPlaybackRequiresUserGesture = false
        useWideViewPort = true
        loadWithOverviewMode = true
        cacheMode = WebSettings.LOAD_NO_CACHE
        displayZoomControls = false
        builtInZoomControls = false
        setSupportZoom(false)
      }

      webChromeClient = WebChromeClient()
      webViewClient = object : WebViewClient() {
        override fun onPageFinished(view: WebView?, url: String?) {
          super.onPageFinished(view, url)
        }
      }

      loadUrl("file:///android_asset/index.html")
    }
  }

  BackHandler {
    // Send ESC key event or trigger back in game
    webView.evaluateJavascript(
      """
      (function() {
        const modal = document.querySelector('.modal-overlay.active');
        if (modal) {
          modal.classList.remove('active');
          return true;
        }
        const game = document.getElementById('screen-game');
        if (game && game.classList.contains('active')) {
          const btnBack = document.getElementById('btn-game-back');
          if (btnBack) btnBack.click();
          return true;
        }
        const select = document.getElementById('screen-level-select');
        if (select && select.classList.contains('active')) {
          const homeBtn = document.querySelector('.nav-back-btn');
          if (homeBtn) homeBtn.click();
          return true;
        }
        return false;
      })()
      """.trimIndent()
    ) { handled ->
      if (handled != "true") {
        (context as? ComponentActivity)?.finish()
      }
    }
  }

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color(0xFF050B14))
      .windowInsetsPadding(WindowInsets.safeDrawing)
  ) {
    AndroidView(
      modifier = Modifier.fillMaxSize(),
      factory = { webView }
    )
  }
}

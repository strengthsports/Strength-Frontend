// services/tokenMonitor.ts
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { AppState, AppStateStatus } from "react-native";
import { AppDispatch } from "~/reduxStore";
import {
  initializeAuth,
  refreshAccessToken,
} from "~/reduxStore/slices/user/authSlice";
import { getExpiry, getRToken } from "~/utils/secureStore";

class TokenMonitor {
  private readonly BUFFER_TIME = 60 * 60 * 1000; // 1hour(prod), 30seconds(dev)
  private readonly CHECK_INTERVAL = 15 * 60 * 1000; // Reduced to 15min(prod), 1min(dev) checks when active

  private refreshTimer: NodeJS.Timeout | null = null;
  private appStateSubscription: { remove: () => void } | null = null;
  private currentDispatch: AppDispatch | null = null;
  private isRefreshing = false;
  private lastRefreshTime = 0;

  public start(dispatch: AppDispatch) {
    this.currentDispatch = dispatch;
    this.cleanup();

    // Setup app state listener
    this.appStateSubscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange
    );

    // Initial check and start periodic monitoring
    this.scheduleRefreshCheck();
  }

  public stop() {
    this.cleanup();
  }

  private cleanup() {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    if (this.appStateSubscription) this.appStateSubscription.remove();
    this.isRefreshing = false;
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      this.scheduleRefreshCheck();
    } else {
      if (this.refreshTimer) clearTimeout(this.refreshTimer);
    }
  };

  private scheduleRefreshCheck = () => {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);

    this.checkAndRefreshToken().then(() => {
      // Schedule next check every minute for active app
      if (AppState.currentState === "active") {
        this.refreshTimer = setTimeout(
          this.scheduleRefreshCheck,
          this.CHECK_INTERVAL
        );
      }
    });
  };

  private checkAndRefreshToken = async () => {
    if (!this.currentDispatch || this.isRefreshing) return;

    try {
      const expiresAt = await getExpiry();
      const refreshToken = await getRToken("refreshToken");

      if (!expiresAt || !refreshToken) {
        router.replace("/login");
        return;
      }

      const expirationTime = parseInt(expiresAt);
      const currentTime = Date.now();

      // Refresh if within buffer time or already expired
      if (currentTime >= expirationTime - this.BUFFER_TIME) {
        if (currentTime - this.lastRefreshTime < this.BUFFER_TIME) {
          return; // Avoid refreshing too frequently
        }

        this.isRefreshing = true;
        console.log("Initiating silent token refresh...");

        await this.currentDispatch(refreshAccessToken(refreshToken)).unwrap();
        await this.currentDispatch(initializeAuth()).unwrap();

        this.lastRefreshTime = Date.now();
        console.log("Token silently refreshed at:", new Date().toISOString());
      }
    } catch (error) {
      console.error("Silent refresh failed:", error);
      if (error instanceof Error && error.message.includes("401")) {
        router.replace("/login");
      }
    } finally {
      this.isRefreshing = false;
    }
  };
}

export const tokenMonitor = new TokenMonitor();

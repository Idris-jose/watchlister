package com.joseidris.watchlister;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetData")
public class WidgetDataPlugin extends Plugin {

    public static final String PREFS_NAME = "WatchlisterWidgetPrefs";

    @PluginMethod
    public void updateWidgetData(PluginCall call) {
        Context context = getContext();
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        // Streak data
        editor.putInt("streak_current", call.getInt("streakCurrent", 0));
        editor.putFloat("streak_hours_remaining", call.getFloat("streakHoursRemaining", 0f));

        // Watchlist stats
        editor.putInt("watchlist_count", call.getInt("watchlistCount", 0));
        editor.putInt("watched_count", call.getInt("watchedCount", 0));
        editor.putInt("diary_count", call.getInt("diaryCount", 0));

        // Next up film (stored as JSON string)
        String nextUpTitle = call.getString("nextUpTitle", "");
        String nextUpPriority = call.getString("nextUpPriority", "");
        String nextUpYear = call.getString("nextUpYear", "");
        String nextUpType = call.getString("nextUpType", "");
        editor.putString("next_up_title", nextUpTitle);
        editor.putString("next_up_priority", nextUpPriority);
        editor.putString("next_up_year", nextUpYear);
        editor.putString("next_up_type", nextUpType);

        editor.apply();

        // Trigger all widgets to refresh
        requestWidgetUpdate(context, StreakWidget.class);
        requestWidgetUpdate(context, StatsWidget.class);
        requestWidgetUpdate(context, NextUpWidget.class);

        call.resolve();
    }

    private void requestWidgetUpdate(Context context, Class<?> widgetClass) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, widgetClass));
        if (ids.length > 0) {
            Intent intent = new Intent(context, widgetClass);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
            context.sendBroadcast(intent);
        }
    }
}

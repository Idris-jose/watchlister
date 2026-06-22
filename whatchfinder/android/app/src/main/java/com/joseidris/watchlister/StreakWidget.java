package com.joseidris.watchlister;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class StreakWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(
                    WidgetDataPlugin.PREFS_NAME, Context.MODE_PRIVATE);

            int streak = prefs.getInt("streak_current", 0);
            float hoursRemaining = prefs.getFloat("streak_hours_remaining", 0f);
            boolean hasSynced = prefs.contains("streak_current");

            for (int id : appWidgetIds) {
                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_streak);

                // Flame emoji based on streak length
                String flameText;
                if (streak == 0) flameText = "\uD83D\uDCA4"; // 💤
                else if (streak < 3) flameText = "\uD83C\uDF31"; // 🌱
                else if (streak < 7) flameText = "\uD83D\uDD25"; // 🔥
                else if (streak < 14) flameText = "\uD83D\uDD25\uD83D\uDD25"; // 🔥🔥
                else flameText = "\u26A1"; // ⚡

                views.setTextViewText(R.id.streak_emoji, flameText);
                views.setTextViewText(R.id.streak_number, String.valueOf(streak));
                views.setTextViewText(R.id.streak_day_label, "DAY STREAK");

                // Status message
                String statusMsg;
                if (!hasSynced) {
                    statusMsg = "Open Watchlister to sync";
                } else if (streak == 0) {
                    statusMsg = "Log a film to start your streak!";
                } else {
                    int hrs = (int) hoursRemaining;
                    if (hrs < 12) {
                        statusMsg = "\u26A0\uFE0F " + hrs + "h left \u2014 watch something!";
                    } else {
                        statusMsg = hrs + "h to keep your streak alive";
                    }
                }
                views.setTextViewText(R.id.streak_status, statusMsg);

                appWidgetManager.updateAppWidget(id, views);
            }
        } catch (Exception e) {
            // Prevent widget from crashing entirely
        }
    }
}

package com.joseidris.watchlister;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class StatsWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(
                    WidgetDataPlugin.PREFS_NAME, Context.MODE_PRIVATE);

            int watchlistCount = prefs.getInt("watchlist_count", 0);
            int watchedCount = prefs.getInt("watched_count", 0);
            int diaryCount = prefs.getInt("diary_count", 0);
            int total = watchlistCount + watchedCount;
            int pct = total > 0 ? (int) ((watchedCount / (float) total) * 100) : 0;

            for (int id : appWidgetIds) {
                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_stats);

                views.setTextViewText(R.id.stats_watchlist_count, String.valueOf(watchlistCount));
                views.setTextViewText(R.id.stats_watched_count, String.valueOf(watchedCount));
                views.setTextViewText(R.id.stats_diary_count, String.valueOf(diaryCount));
                views.setTextViewText(R.id.stats_percent, pct + "%");
                views.setTextViewText(R.id.stats_percent_label, "of your list watched");

                appWidgetManager.updateAppWidget(id, views);
            }
        } catch (Exception e) {
            // Prevent widget from crashing entirely
        }
    }
}

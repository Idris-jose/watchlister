package com.joseidris.watchlister;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class NextUpWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        SharedPreferences prefs = context.getSharedPreferences(
                WidgetDataPlugin.PREFS_NAME, Context.MODE_PRIVATE);

        String title = prefs.getString("next_up_title", "");
        String priority = prefs.getString("next_up_priority", "medium");
        String year = prefs.getString("next_up_year", "");
        String type = prefs.getString("next_up_type", "Film");

        for (int id : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_nextup);

            if (title == null || title.isEmpty()) {
                views.setTextViewText(R.id.nextup_title, "Nothing queued");
                views.setTextViewText(R.id.nextup_meta, "Add films to your watchlist!");
                views.setTextViewText(R.id.nextup_priority_badge, "");
            } else {
                views.setTextViewText(R.id.nextup_title, title);

                String meta = type;
                if (year != null && !year.isEmpty()) meta = year + " · " + meta;
                views.setTextViewText(R.id.nextup_meta, meta);

                String priorityLabel;
                switch (priority.toLowerCase()) {
                    case "high":   priorityLabel = "🔴 Must Watch"; break;
                    case "low":    priorityLabel = "🔵 Someday";    break;
                    default:       priorityLabel = "🟡 Up Next";    break;
                }
                views.setTextViewText(R.id.nextup_priority_badge, priorityLabel);
            }

            appWidgetManager.updateAppWidget(id, views);
        }
    }
}

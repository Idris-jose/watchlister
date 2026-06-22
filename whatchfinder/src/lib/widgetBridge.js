import { registerPlugin } from '@capacitor/core';

/**
 * Bridge to the native WidgetDataPlugin.
 * Call `syncWidgetData(data)` whenever watchlist/diary data changes
 * to keep home screen widgets up-to-date.
 */
const WidgetData = registerPlugin('WidgetData');

/**
 * Syncs current app state to Android home screen widgets.
 * Safe to call on web (no-ops when plugin isn't available).
 *
 * @param {object} params
 * @param {number} params.streakCurrent
 * @param {number} params.streakHoursRemaining
 * @param {number} params.watchlistCount
 * @param {number} params.watchedCount
 * @param {number} params.diaryCount
 * @param {string} [params.nextUpTitle]
 * @param {string} [params.nextUpPriority]
 * @param {string} [params.nextUpYear]
 * @param {string} [params.nextUpType]
 */
export async function syncWidgetData(params) {
  try {
    await WidgetData.updateWidgetData({
      streakCurrent: params.streakCurrent ?? 0,
      streakHoursRemaining: params.streakHoursRemaining ?? 0,
      watchlistCount: params.watchlistCount ?? 0,
      watchedCount: params.watchedCount ?? 0,
      diaryCount: params.diaryCount ?? 0,
      nextUpTitle: params.nextUpTitle ?? '',
      nextUpPriority: params.nextUpPriority ?? 'medium',
      nextUpYear: params.nextUpYear ?? '',
      nextUpType: params.nextUpType ?? 'Film',
    });
  } catch (e) {
    // Silently ignore on web / iOS — plugin only exists on Android
  }
}

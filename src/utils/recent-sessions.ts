import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const RECENT_SESSIONS_KEY = '@calmmind/recent_sessions_v1';
const MAX_RECENT_ITEMS = 5;

export type RecentSessionItem = {
  id: string;
  mode: 'breathe' | 'meditate';
  timestamp: number;
};

/** Default starter practice for new installs when no session has been completed yet. */
export const DEFAULT_RECENT_SESSION: RecentSessionItem = {
  id: 'coherent',
  mode: 'breathe',
  timestamp: Date.now(),
};

/** Load the list of recently practiced techniques from on-device local storage. */
export async function getRecentSessions(): Promise<RecentSessionItem[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/** Record a technique as recently used. Deduplicates and keeps the latest up to 5 items. */
export async function saveRecentSession(id: string, mode: 'breathe' | 'meditate'): Promise<void> {
  try {
    const current = await getRecentSessions();
    const filtered = current.filter((item) => item.id !== id);
    const updated: RecentSessionItem[] = [
      { id, mode, timestamp: Date.now() },
      ...filtered,
    ].slice(0, MAX_RECENT_ITEMS);

    await AsyncStorage.setItem(RECENT_SESSIONS_KEY, JSON.stringify(updated));
  } catch {
    // Fail silently without disrupting user session
  }
}

/** Hook to observe the latest recent session on the Home screen. */
export function useRecentSession() {
  const [recentList, setRecentList] = useState<RecentSessionItem[]>([]);
  const [recent, setRecent] = useState<RecentSessionItem>(DEFAULT_RECENT_SESSION);
  const [isNewUser, setIsNewUser] = useState(true);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await getRecentSessions();
    setRecentList(list);
    if (list.length > 0) {
      setRecent(list[0]);
      setIsNewUser(false);
    } else {
      setRecent(DEFAULT_RECENT_SESSION);
      setIsNewUser(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    void getRecentSessions().then((list) => {
      if (!active) return;
      setRecentList(list);
      if (list.length > 0) {
        setRecent(list[0]);
        setIsNewUser(false);
      } else {
        setRecent(DEFAULT_RECENT_SESSION);
        setIsNewUser(true);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return { recent, recentList, isNewUser, loading, refresh };
}

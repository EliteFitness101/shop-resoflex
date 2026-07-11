// use-personalization — single query hook that pulls the operator's
// health profile, today's log, and today's tasks, then derives
// scores + ranked recommendations. Reuses existing server functions.
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getHealthProfile, getTodayLog, listTodayTasks } from "@/lib/chatb2k.functions";
import {
  computeScores,
  rankSKUs,
  suggestBundleTier,
  topRecommendation,
  type PersonaProfile,
  type PersonaLog,
  type PersonaTask,
} from "@/lib/personalization";

export function usePersonalization() {
  const { user, loading: authLoading } = useAuth();
  const getProfile = useServerFn(getHealthProfile);
  const getLog = useServerFn(getTodayLog);
  const getTasks = useServerFn(listTodayTasks);

  const enabled = !!user && !authLoading;

  const profile = useQuery({
    queryKey: ["personalization", "profile", user?.id],
    queryFn: () => getProfile() as Promise<PersonaProfile | null>,
    enabled,
    staleTime: 5 * 60_000,
  });
  const log = useQuery({
    queryKey: ["personalization", "log", user?.id],
    queryFn: () => getLog() as Promise<PersonaLog | null>,
    enabled,
    staleTime: 60_000,
  });
  const tasks = useQuery({
    queryKey: ["personalization", "tasks", user?.id],
    queryFn: () => getTasks() as Promise<PersonaTask[]>,
    enabled,
    staleTime: 60_000,
  });

  return useMemo(() => {
    const p = profile.data ?? null;
    const l = log.data ?? null;
    const t = tasks.data ?? null;
    const scores = computeScores(p, l, t);
    const hasProfile = !!p;
    const recommendation = hasProfile ? topRecommendation(p) : null;
    const ranked = hasProfile ? rankSKUs(p, { limit: 6 }) : [];
    const bundleTier = suggestBundleTier(p);
    return {
      isAuthed: !!user,
      isLoading: authLoading || profile.isLoading || log.isLoading || tasks.isLoading,
      hasProfile,
      profile: p,
      log: l,
      tasks: t,
      scores,
      recommendation,
      ranked,
      bundleTier,
    };
  }, [user, authLoading, profile.data, profile.isLoading, log.data, log.isLoading, tasks.data, tasks.isLoading]);
}

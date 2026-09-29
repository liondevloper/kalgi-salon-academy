import { useSyncExternalStore } from "react";
import { useMutation, useQuery, type OptionalRestArgsOrSkip } from "convex/react";
import type { FunctionArgs, FunctionReference, FunctionReturnType } from "convex/server";

const KEY = "kalgi-admin-token";
const listeners = new Set<() => void>();

const subscribe = (cb: () => void): (() => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const read = (): string | null => localStorage.getItem(KEY);

export function setAdminToken(token: string | null): void {
  if (token) localStorage.setItem(KEY, token);
  else localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

export function useAdminToken(): string | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

type WithoutToken<A> = Omit<A, "token">;

// Reactive admin query: waits until the password session token exists
export function useAdminQuery<F extends FunctionReference<"query", "public">>(
  ref: F,
  args: WithoutToken<FunctionArgs<F>>,
): FunctionReturnType<F> | undefined {
  const token = useAdminToken();
  const full = { ...args, token: token ?? "" } as FunctionArgs<F>;
  const rest = [token ? full : "skip"] as unknown as OptionalRestArgsOrSkip<F>;
  return useQuery(ref, ...rest);
}

export function useAdminMutation<F extends FunctionReference<"mutation", "public">>(
  ref: F,
): (args: WithoutToken<FunctionArgs<F>>) => Promise<FunctionReturnType<F>> {
  const token = useAdminToken();
  const run = useMutation(ref);
  return (args) => run({ ...args, token: token ?? "" } as FunctionArgs<F>);
}

import useSWR, { mutate, SWRConfiguration } from "swr";

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

export const useTokens = (token: string | null) => {
  const { data, error, mutate } = useSWR(
    () => (token ? ["/api/user/tokens", token] : null),
    fetcher
  );

  return {
    update: mutate,
    tokens: data,
    isLoading: !error && !data,
    isError: error,
  };
};
export const useToken = (token: string | null, key: string) => {
  const { data, error } = useSWR(
    () => (token && key ? [`/api/user/tokens/${key}`, token] : null),
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    token: data,
    isTokenLoading: !error && !data,
    isTokenError: error,
  };
};
export const useUsage = (token: string | null, zone: string) => {
  const { data, error } = useSWR(
    () => (token ? [`/api/user/usage?zone=${zone}`, token] : null),
    fetcher
  );

  return {
    usage: data,
    isLoading: !error && !data,
    isError: error,
  };
};
export const useLogs = (
  token: string | null,
  params: string,
  options: SWRConfiguration
) => {
  const { data, error } = useSWR(
    () => (token ? [`/api/user/logs${params}`, token] : null),
    fetcher,
    options
  );
  return {
    logs: data,
    isLoadingLogs: !error && !data,
    isErrorLogs: error,
  };
};
export const usePreferences = (token: string | null) => {
  const { data, error } = useSWR(
    () => (token ? [`/api/user/preferences`, token] : null),
    fetcher
  );
  return {
    preferences: data,
    isLoading: !error && !data,
    isError: error,
  };
};
export const usePresets = (token: string | null) => {
  const { data, error } = useSWR(
    () => (token ? [`/api/user/presets`, token] : null),
    fetcher
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

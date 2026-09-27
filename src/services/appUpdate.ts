import ERDEAxios from "./ERDEAxios";

export type AppUpdateKind = "ota" | "build";

export interface AppUpdateInfo {
  version: string | null;
  kind: AppUpdateKind;
  storeUrl: string | null;
}

export async function fetchAppUpdate(): Promise<AppUpdateInfo> {
  const { data } = await ERDEAxios.get<AppUpdateInfo>("/setting/app-update");
  return {
    version: typeof data?.version === "string" && data.version.trim() ? data.version.trim() : null,
    kind: data?.kind === "build" ? "build" : "ota",
    storeUrl:
      typeof data?.storeUrl === "string" && data.storeUrl.trim() ? data.storeUrl.trim() : null,
  };
}

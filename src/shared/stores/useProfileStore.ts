import { create } from "zustand";

export interface PublicProfile {
  bio: string;
  whatsapp: string;
  stacks: string[];
  avatarUrl: string | null;
  cvUrl: string | null;
}

type FetchStatus = "idle" | "loading" | "success" | "error";

interface ProfileState {
  profile: PublicProfile | null;
  status: FetchStatus;
  fetchProfile: (force?: boolean) => Promise<void>;
}

let inFlightRequest: Promise<void> | null = null;

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  status: "idle",
  fetchProfile: async (force = false) => {
    const { status } = get();
    if (!force && (status === "loading" || status === "success")) {
      return inFlightRequest ?? Promise.resolve();
    }

    if (inFlightRequest && !force) {
      return inFlightRequest;
    }

    set({ status: "loading" });

    inFlightRequest = fetch(`${import.meta.env.VITE_API_URL}/api/profile`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao carregar perfil público.");
        const data: PublicProfile = await res.json();
        set({ profile: data, status: "success" });
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do perfil público:", err);
        set({ status: "error" });
      })
      .finally(() => {
        inFlightRequest = null;
      });

    return inFlightRequest;
  },
}));

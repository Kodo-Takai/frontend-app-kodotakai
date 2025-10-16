import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetProfilesQuery, useUpdateProfileMutation } from "../redux/api/profileApi";
import type { RootState } from "../redux/store";
import type { ProfileUpdateRequest } from "../redux/api/profileApi";
import{ decodeJwt } from "../utils/jwt";

export const useProfile = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const payload = useMemo(() => decodeJwt(token), [token]);
  const profileIdFromToken = payload?.profileId as string | undefined;

  const { data: profiles, isFetching, error } = useGetProfilesQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const currentProfile = useMemo(() => {
    if (!profiles || profiles.length === 0) return undefined;
    if (profileIdFromToken)
      return profiles.find((p) => p.id === profileIdFromToken);
    if (payload?.email) return profiles.find((p) => p.email === payload.email);
    return profiles[0];
  }, [profiles, profileIdFromToken, payload]);

  const saveProfile = async (id: string, body: ProfileUpdateRequest) => {
    try {
      await updateProfile({ id, body }).unwrap();
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err; 
    }
  };

  return {
    currentProfile,
    isFetching,
    isUpdating,
    error,
    saveProfile,
  };
};
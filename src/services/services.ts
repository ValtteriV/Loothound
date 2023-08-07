import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/tauri';
import { fetchStashes, getSingleStash } from '../api/api';
import { getProfiles } from '../api/db';
import { CreateProfilePayload } from '../components/ProfileModal';

export const useFetchStashes = () => useQuery(['stashes'], fetchStashes);

export const useAddProfile = () => {
	const queryClient = useQueryClient();

	return useMutation(
		(values: CreateProfilePayload) => invoke('plugin:sql|create_profile', values),
		{
			onSuccess: () => queryClient.invalidateQueries(['profiles']),
		}
	);
};

export const useGetSingleStash = (stashId: string, options: Record<string, any>) =>
	useQuery(['stash'], () => getSingleStash(stashId), options);

export const useGetProfiles = () => useQuery(['profiles'], getProfiles);
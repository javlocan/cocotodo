/* import { useSocket } from "@/lib/SocketProvider/SocketProvider";


export const useUpdateProject = ({
  projectId,
  apiUrl,
  paramKey,
  paramValue,
}: any) => {
  const { isConnected, socket } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
   
    const res = await fetch();
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
 */

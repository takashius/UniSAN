import {
  Register,
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import { Account, LoginResponse, Login, Image, Recovery } from "../types";

export const useLogin = (): UseMutationResult<
  LoginResponse,
  unknown,
  Login
> => {
  return useMutation<LoginResponse, unknown, Login>({
    mutationFn: async (data: Login) => {
      const response = await ERDEAxios.post("/user/login", data);
      return response.data;
    },
  });
};

export const useAccount = (): UseQueryResult<Account, Error> => {
  return useQuery<Account, Error>({
    queryKey: ["myAccount"],
    retry: false,
    enabled: false,
    queryFn: () => {
      return ERDEAxios.get<Account>("/user/account").then(
        (response) => response.data
      );
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await ERDEAxios.post("/user/logout");
      return response.data;
    },
  });
};

export const useRegister = (): UseMutationResult<any, unknown, Register> => {
  return useMutation<any, unknown, Register>({
    mutationFn: async (data: Register) => {
      const response = await ERDEAxios.post("/user/register", data);
      return response.data;
    },
  });
};

export const useRecoveryOne = () => {
  return useMutation({
    mutationFn: (email: String) => {
      return ERDEAxios.get("/user/recovery/" + email);
    },
  });
};

export const useRecoveryTwo = () => {
  return useMutation({
    mutationFn: (data: Recovery) => {
      return ERDEAxios.post("/user/recovery", data);
    },
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: Image) => {
      localStorage.setItem("contentType", "true");
      var formData = new FormData();
      formData.append("image", data.image);
      formData.append("imageType", data.imageType);
      return ERDEAxios.post("/company/upload", formData);
    },
    onSuccess: () => {
      localStorage.removeItem("contentType");
      queryClient.invalidateQueries({ queryKey: ["myAccount"] });
    },
    onError: (error) => {
      console.log("error useUploadImage", error);
      localStorage.removeItem("contentType");
    },
  });

  return mutation;
};

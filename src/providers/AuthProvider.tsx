import React, { createContext, useCallback, useContext } from "react";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";


type AuthContextProps = {
  user: unknown;
  isLoading: boolean;
  isError: boolean;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextProps | undefined >(undefined);


export const AuthProvider = ({ children } : { children : React.ReactNode } ) => {

    const { getUser } = useAuth()
    const getToken = useCallback(() => {
        return sessionStorage.getItem("TOKEN");
    },[]);
    const key = ["users", "me"]


     const {
       data: user,
       isLoading,
       isError,
     } = useQuery({
       queryKey: key,
       queryFn: () => getUser(getToken()!),
       enabled : !!getToken()
     });
    


    return (
        <AuthContext.Provider value={{ user, isLoading, isError, getToken}}>
            {children}
        </AuthContext.Provider>
    )

}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    const authContext = useContext(AuthContext)
    if(!authContext){
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return authContext
}
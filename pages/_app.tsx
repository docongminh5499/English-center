import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CustomAppProps } from "../interfaces/app.interface";
import { useAuth } from "../stores/Auth";
import { ToastContainer } from "react-toastify";
import { UserRole } from "../helpers/constants";
import { usePrevious } from "../helpers/usePrevious";
import { MantineProvider } from '@mantine/core';
import LoadingScreen from "../components/pageComponents/LoadingScreen";
import ModalContainer from "../components/commons/ModalContainer";

function MyApp({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();
  const [authState, authAction] = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const prevUserRole = usePrevious(authState.role);

  useEffect(() => {
    const hideContent = async () => authorized && setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);
    return () => router.events.off('routeChangeStart', hideContent);
  }, []);

  useEffect(() => {
    authCheck();
  }, [router.asPath]);

  useEffect(() => {
    if (prevUserRole === undefined) authCheck();
    else if (authState.role === undefined) authCheck();
  }, [authState]);

  function authCheck() {
    if (authState.role === undefined)
      return authAction.loadUserFromLocalStorage();
    if (!Component.allowUsers) return setAuthorized(true);

    // Guest handler
    if (authState.role == UserRole.GUEST) {
      if (Component.allowUsers.includes(authState.role))
        return setAuthorized(true);
      else {
        setAuthorized(false);
        return router.push({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        });
      }
    }
    // Other actor hander
    if (!Component.allowUsers.includes(authState.role)) {
      setAuthorized(false);
      return router.push({ pathname: "/not-found" });
    }
    if (authState.expireTime && Date.now() >= authState.expireTime * 1000) {
      setAuthorized(false);
      authAction.logOut();
      return router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    }
    setAuthorized(true);
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {authorized && (
        <>
          <Component {...pageProps} />
          <ModalContainer />
          <ToastContainer
            style={{ fontSize: "1.6rem" }}
            theme="colored"
            hideProgressBar={true}
            closeButton={true}
          />
        </>
      )}
      {!authorized && <LoadingScreen />}
    </MantineProvider>
  );
}

export default MyApp;

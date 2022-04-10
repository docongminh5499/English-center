import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CustomAppProps } from "../interfaces/app.interface";
import { useAuth } from "../stores/Auth";
import { ToastProvider } from "react-toast-notifications";
import { UserRole } from "../helpers/constants";
import LoadingScreen from "../components/pageComponents/LoadingScreen";
import { usePrevious } from "../helpers/usePrevious";

function MyApp({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();
  const [authState, authAction] = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const prevUserRole = usePrevious(authState.role);

  useEffect(() => {
    const hideContent = async () => authorized && setAuthorized(false);
    hideContent().then(() => {
      authCheck();
      return true;
    });
  }, [router.asPath]);

  useEffect(() => {
    if (prevUserRole === undefined) authCheck();
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
      return router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    }
    setAuthorized(true);
  }

  return (
    <ToastProvider>
      {authorized && (
        <>
          <Component {...pageProps} />
          <div className="modal-container"></div>
        </>
      )}
      {!authorized && <LoadingScreen />}
    </ToastProvider>
  );
}

export default MyApp;

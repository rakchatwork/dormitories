import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

// Components
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
// import privateRoute from "../router/private";
import superAdminRoute from "../router/private/superAdmin";
import managerRoute from "../router/private/manager";
import staffRoute from "../router/private/staff";

// Type
import { TRouter } from "../types/router";
import { useAppDispatch } from "../store/store";
import { AUTH_VERIFY } from "../service/api/auth";
import { signout } from "../store/slices/authSlice";
import { useHistory } from "react-router-dom";

const PrivateContent = () => {
  const [rediretPath, setRedirectPath] = useState<string>("");
  // "superAdmin" | "manager" | "staff" | 'renter';
  const { role } = useSelector((state: any) => state.auth);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = () => {
    if (role === "superAdmin") {
      setRedirectPath("/dormitory");
    } else {
      setRedirectPath("/dashboard");
    }
  };

  return (
    <div>
      <div>
        <BrowserRouter>
          <Switch>
            {role === "superAdmin" ? (
              <>
                {superAdminRoute.map((item: TRouter, index: number) => (
                  <Route
                    key={index}
                    exact={item.exact}
                    path={item.path}
                    render={(props: any) => {
                      const { ContentComponent } = item;
                      return (
                        <div className="private-container" key={index}>
                          <Sidebar />
                          <div className="private-body-container">
                            <Navbar />
                            <ContentComponent {...props} />
                          </div>
                        </div>
                      );
                    }}
                  />
                ))}
                <Route
                  exact
                  component={() => <Redirect from="/" to={rediretPath} />}
                />
              </>
            ) : role === "manager" ? (
              <>
                {managerRoute.map((item: TRouter, index: number) => (
                  <Route
                    key={index}
                    exact={item.exact}
                    path={item.path}
                    render={(props: any) => {
                      const { ContentComponent } = item;
                      return (
                        <div className="private-container" key={index}>
                          <Sidebar />
                          <div className="private-body-container">
                            <Navbar />
                            <ContentComponent {...props} />
                          </div>
                        </div>
                      );
                    }}
                  />
                ))}
                <Route
                  exact
                  component={() => <Redirect from="/" to={rediretPath} />}
                />
              </>
            ) : (
              <>
                {staffRoute.map((item: TRouter, index: number) => (
                  <Route
                    key={index}
                    exact={item.exact}
                    path={item.path}
                    render={(props: any) => {
                      const { ContentComponent } = item;
                      return (
                        <div className="private-container" key={index}>
                          <Sidebar />
                          <div className="private-body-container">
                            <Navbar />
                            <ContentComponent {...props} />
                          </div>
                        </div>
                      );
                    }}
                  />
                ))}
                <Route
                  exact
                  component={() => <Redirect from="/" to={rediretPath} />}
                />
              </>
            )}
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default PrivateContent;

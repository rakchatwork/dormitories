import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

// Router
import publicRoute from "../router/public";

// Type
import { TRouter } from "../types/router";

const PublicContent = () => {
  return (
    <div>
      <div>
        <BrowserRouter>
          <Switch>
            {publicRoute.map((item: TRouter, index: number) => (
              <Route
                key={index}
                exact={item.exact}
                path={item.path}
                render={(props: any) => {
                  const { ContentComponent } = item;

                  return (
                    <div className="public-container">
                      <ContentComponent {...props} />
                    </div>
                  );
                }}
              />
            ))}
            <Route exact component={() => <Redirect from="/" to="/login" />} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default PublicContent;

import { useEffect } from "react";
import { CssBaseline, Box, Backdrop, CircularProgress } from "@mui/material";
import { Route, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { useSelector } from "react-redux";
import Header from "./Header";
import ProtecedRoute from "./components/ProtecedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ModalContainer from "./components/Modal/ModalContainer";
import "./App.css";

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

const NotFoundPage = () => {
  return <div>I am Not Found Page</div>;
};

const Loading = () => {
  const { spinning } = useSelector(state => state.mask);
  return (
    <Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={spinning}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

function App() {
  return (
    <>
      <CssBaseline />
      <Loading />
      <Box
        component="div"
        sx={{
          // height: "fill-available",
          display: "flex",
          flexDirection: "column"
          // height: "100vh",
          // minHeight: "100vh"
        }}
      >
        {/* Header */}
        <Header />
        {/* Content */}
        <Box component="main" sx={{ height: "auto", px: 2, py: 1, mt: 7 }}>
          <Router history={history}>
            <Switch>
              <Route path={"/Login"} component={Login} />
              <ProtecedRoute path={"/"} component={Home} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </Box>
      </Box>
      <ModalContainer />
    </>
  );
}

export default App;

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
import { useMutation } from "react-query";
import { activityMemberService } from "./services";
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
  const {
    data: statistics,
    mutate: getStatistics,
    isLoading: getStatisticsLoading
  } = useMutation(() => activityMemberService.statistics());

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  return (
    <>
      <CssBaseline />
      <Loading />
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <Header statistics={statistics} />
        {/* Content */}
        <Box component="main" sx={{ height: "auto", px: 2, py: 1, mt: 7 }}>
          <Router history={history}>
            <Switch>
              <Route path={"/Login"} component={Login} />
              <ProtecedRoute
                path={"/"}
                component={Home}
                componentProps={{ getStatistics: getStatistics }}
              />
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

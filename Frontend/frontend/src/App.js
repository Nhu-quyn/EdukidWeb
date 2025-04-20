import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { routes } from "./routes";
import { useSelector } from "react-redux";
// Lấy thông tin người dùng từ Redux

// // Component kiểm tra quyền truy cập
// const PrivateRoute = ({ children, isLogged, isAdmin }) => {
//   if (!isLogged) {
//     return <Navigate to="/" />;
//   }

//   if (isAdmin && !isLogged) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };
const PrivateRoute = ({ children, isLogged, isAdminOnly }) => {
  const user = useSelector((state) => state.user?.user);
  const isAdmin = user?.isAdmin;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const user = useSelector((state) => state.user?.user);

  // Kiểm tra xem người dùng có đăng nhập hay không
  const isLogged = !!user;
  console.log(user);
  // Kiểm tra xem người dùng có quyền Admin hay không
  const isAdmin = user?.isAdmin;
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const isPrivate = route.isLogged || route.isAdmin;

            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  isPrivate ? (
                    <PrivateRoute isAdminOnly={route.isAdmin}>
                      <Page />
                    </PrivateRoute>
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;

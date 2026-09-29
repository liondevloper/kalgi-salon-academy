import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import SiteRoutes, { RootRedirect } from "./pages/site-routes.tsx";
import PreviewPage from "./pages/preview/page.tsx";
import AdminRoutes from "./pages/admin/routes.tsx";
import NotFound from "./pages/NotFound.tsx";

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/:locale/*" element={<SiteRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}

import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import SiteRoutes, { RootRedirect } from "./pages/site-routes.tsx";
import PreviewPage from "./pages/preview/page.tsx";
import AdminRoutes from "./pages/admin/routes.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin has no language prefix, so /en/admin/... is sent to /admin/...
function LocaleAdminRedirect() {
  const { "*": rest } = useParams();
  const { search } = useLocation();
  return <Navigate to={`/admin${rest ? `/${rest}` : ""}${search}`} replace />;
}

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/:locale/admin/*" element={<LocaleAdminRedirect />} />
          <Route path="/:locale/*" element={<SiteRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}

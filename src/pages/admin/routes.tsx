import { Route, Routes } from "react-router-dom";
import AdminLayout from "./layout.tsx";
import DashboardPage from "./dashboard/page.tsx";
import BookingsPage from "./bookings/page.tsx";
import EnquiriesPage from "./enquiries/page.tsx";
import ContentPage from "./content/page.tsx";
import SettingsPage from "./settings/page.tsx";
import SectionsPage from "./sections/page.tsx";
import ThemePage from "./theme/page.tsx";
import MediaPage from "./media/page.tsx";
import AccessPage from "./access/page.tsx";
import NotFound from "../NotFound.tsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="enquiries" element={<EnquiriesPage />} />
        <Route path="content/:kind" element={<ContentPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="sections" element={<SectionsPage />} />
        <Route path="theme" element={<ThemePage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="access" element={<AccessPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

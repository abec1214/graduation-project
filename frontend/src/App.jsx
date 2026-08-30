// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import Reservations from "./pages/Reservations";

import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";

import ReservationDetail from "./pages/ReservationDetail";
import ReservationInfo from "./pages/ReservationInfo";

import RecordNew from "./pages/RecordNew";
import RecordCreate from "./pages/RecordCreate"; // ← 予約作成ページとして使う
import VisitEdit from "./pages/VisitEdit";
import RecordEdit from "./pages/RecordEdit";
import RecordDetail from "./pages/RecordDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* トップページはダッシュボード */}
          <Route index element={<Dashboard />} />

          {/* 施術記録 */}
          <Route path="records" element={<Records />} />

          {/* ダッシュボード */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* 予約管理一覧 */}
          <Route path="reservations" element={<Reservations />} />

          {/* ★ 新規予約作成ページ（RecordCreate を統合） */}
          <Route path="reservations/create" element={<RecordCreate />} />

          {/* 顧客一覧 */}
          <Route path="customers" element={<Customers />} />

          {/* 顧客詳細ページ */}
          <Route path="customers/:customerId" element={<CustomerDetail />} />

          {/* 新規顧客登録 */}
          <Route path="customers/new" element={<RecordNew />} />

          {/* 施術履歴 編集ページ */}
          <Route path="visits/:id/edit" element={<VisitEdit />} />

          {/* カルテ編集ページ */}
          <Route
            path="customers/:customerId/records/:recordId/edit"
            element={<RecordEdit />}
          />

          {/* 予約詳細ページ */}
          <Route
            path="reservations/:reservationId"
            element={<ReservationInfo />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

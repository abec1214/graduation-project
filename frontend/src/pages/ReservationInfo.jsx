// src/pages/ReservationInfo.jsx
import { useParams } from "react-router-dom";

export default function ReservationInfo() {
  const { reservationId } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">予約詳細</h1>
      <p>予約ID: {reservationId}</p>
      {/* ここに予約内容を後で追加 */}
    </div>
  );
}

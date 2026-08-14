// src/data/reservations.js

export let reservations = [
  {
    id: 1,
    patientId: 1,
    name: "山田太郎",
    kana: "ヤマダ タロウ",
    date: "2026-07-18 14:00",
    count: 24,
  },
  {
    id: 2,
    patientId: 2,
    name: "佐藤花子",
    kana: "サトウ ハナコ",
    date: "2026-07-22 10:00",
    count: 12,
  },
  {
    id: 3,
    patientId: 3,
    name: "田中美咲",
    kana: "タナカ ミサキ",
    date: "2026-07-15 16:00",
    count: 36,
  },
];

// 予約追加
export function addReservation(newReservation) {
  const newId =
    reservations.length === 0
      ? 1
      : Math.max(...reservations.map((reservation) => reservation.id)) + 1;

  reservations = [
    ...reservations,
    {
      id: newId,
      ...newReservation,
    },
  ];
}

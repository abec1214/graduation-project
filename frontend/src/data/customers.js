// src/data/customers.js

export let customers = [
  {
    id: 1,
    name: "山田太郎",
    birthday: "1990-03-15",
    gender: "男性",
    job: "デスクワーク（IT企業）",
    nextReservation: "",
    lastVisit: "2026-07-29",

    history: [
      { date: "2026-07-29", menu: "スポーツマッサージ・60分" },
      { date: "2026-07-15", menu: "スウェーデンマッサージ・90分" },
    ],

    memo: "肩こりが強い。週1ペース推奨。",
  },
];

// -------------------------
// 顧客基本情報の更新
// -------------------------
export function updateCustomer(id, updatedData) {
  customers = customers.map((c) =>
    c.id === id ? { ...c, ...updatedData } : c,
  );
}

// -------------------------
// 顧客削除
// -------------------------
export function deleteCustomer(id) {
  customers = customers.filter((c) => c.id !== id);
}

// -------------------------
// 施術履歴追加
// -------------------------
export function addHistory(customerId, newHistory) {
  customers = customers.map((c) =>
    c.id === customerId ? { ...c, history: [...c.history, newHistory] } : c,
  );
}

// -------------------------
// 施術履歴編集
// -------------------------
export function updateHistory(customerId, index, updatedHistory) {
  customers = customers.map((c) =>
    c.id === customerId
      ? {
          ...c,
          history: c.history.map((h, i) => (i === index ? updatedHistory : h)),
        }
      : c,
  );
}

// -------------------------
// 施術履歴削除
// -------------------------
export function deleteHistory(customerId, index) {
  customers = customers.map((c) =>
    c.id === customerId
      ? { ...c, history: c.history.filter((_, i) => i !== index) }
      : c,
  );
}

// -------------------------
// カルテメモ更新
// -------------------------
export function updateMemo(customerId, newMemo) {
  customers = customers.map((c) =>
    c.id === customerId ? { ...c, memo: newMemo } : c,
  );
}

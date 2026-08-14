import { useParams, Link } from "react-router-dom";
import Layout from "../layouts/Layout";

export default function VisitDetail() {
  const { customerId, visitId } = useParams();

  // 仮データ（あとでDB接続）
  const visit = {
    id: visitId,
    visit_date: "2026-07-10",
    memo: "フェイシャル施術",
    staff: "",
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">来店履歴詳細</h2>

      <p className="mb-2">顧客ID: {customerId}</p>
      <p className="mb-4">来店履歴ID: {visitId}</p>

      <div className="bg-white shadow p-4 rounded space-y-2 mb-6">
        <p>
          <strong>来店日:</strong> {visit.visit_date}
        </p>
        <p>
          <strong>メモ:</strong> {visit.memo}
        </p>
        <p>
          <strong>担当者:</strong> {visit.staff}
        </p>
      </div>

      {/* 編集ボタン */}
      <Link
        to={`/customers/${customerId}/visits/${visitId}/edit`}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
      >
        編集する
      </Link>

      {/* 🔥 削除ボタン（一覧へ戻る処理付き） */}
      <button
        onClick={() => {
          if (!confirm("本当にこの来店履歴を削除しますか？")) return;

          console.log("削除する来店履歴ID:", visitId);
          alert("来店履歴を削除しました（仮）");

          // 一覧へ戻る
          window.location.href = `/customers/${customerId}/visits`;
        }}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        削除する
      </button>
    </Layout>
  );
}

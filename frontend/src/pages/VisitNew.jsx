import { useParams } from "react-router-dom";
import Layout from "../layouts/Layout";

export default function VisitNew() {
  const { customerId } = useParams();

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">来店履歴を追加</h2>

      <p className="mb-4">顧客ID: {customerId}</p>

      <form className="bg-white shadow p-4 rounded space-y-4">
        <div>
          <label className="block mb-1 font-bold">来店日</label>
          <input type="date" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block mb-1 font-bold">メモ</label>
          <textarea
            className="border p-2 rounded w-full"
            rows="4"
            placeholder="施術内容・気になった点など"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-bold">担当者</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="例：歩夢"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          登録する
        </button>
      </form>
    </Layout>
  );
}

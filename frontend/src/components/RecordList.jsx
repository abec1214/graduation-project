export default function RecordList({ records, onSelect }) {
  // 顧客ごとに最新の記録だけ抽出
  const latestRecords = records.reduce((acc, record) => {
    const existing = acc.find((r) => r.name === record.name);

    if (!existing) {
      acc.push(record);
    } else {
      const existingDate = new Date(existing.date);
      const newDate = new Date(record.date);

      if (newDate > existingDate) {
        existing.id = record.id;
        existing.type = record.type;
        existing.pressure = record.pressure;
        existing.date = record.date;
        existing.allergy = record.allergy;
      }
    }

    return acc;
  }, []);

  return (
    <div className="space-y-3">
      {latestRecords.map((r) => (
        <div
          key={r.id}
          onClick={() => onSelect(r)}
          className="p-4 bg-white rounded-md shadow hover:bg-[#f0ede6] cursor-pointer"
        >
          <p className="text-gray-900 font-semibold">{r.name}</p>
          <p className="text-sm text-gray-700">{r.type}</p>
          <p className="text-xs text-gray-600">圧: {r.pressure}</p>
          <p className="text-xs text-gray-500">{r.date}</p>
        </div>
      ))}
    </div>
  );
}

'use client';

export default function Pagination(props: {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}) {
  const { currentPage, totalPages, onChangePage } = props;

  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(totalPages - 4, currentPage - 2));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

  return (
    <div className="flex justify-center mt-8">
      <div className="flex gap-2">
        <button
          onClick={() => onChangePage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChangePage(p)}
            className={`px-3 py-2 text-sm border rounded-lg ${
              currentPage === p
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onChangePage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  );
}

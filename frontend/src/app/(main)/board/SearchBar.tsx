import { FaFilter, FaSearch } from "react-icons/fa";

export default function SearchBar(props: {
    value: string;
    onChange: (v: string) => void;
    onToggleFilters: () => void;
    onSubmit: () => void;
}) {
    const { value, onChange, onToggleFilters, onSubmit } = props;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="flex gap-4 mb-4"
        >
            <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="제목, 내용, 지역으로 검색..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <button
                type="button"
                onClick={onToggleFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 hover:cursor-pointer"
            >
                <FaFilter className="w-4 h-4" />
                필터
            </button>
        </form>
    );
}

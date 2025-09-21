type Props = {
    options: string[];
    selected: string;
    onChange: (option: string) => void;
};

export default function SegmentedControl({ options, selected, onChange }: Props) {
    const selectedIndex = options.indexOf(selected);
    
    return (
        <div className="relative flex rounded-lg overflow-hidden w-full max-w-md mx-auto bg-[#E6E6E7] ">
            <div
                className="absolute top-1 bottom-1 w-1/3 bg-white rounded-md shadow transition-transform duration-300 ease-out"
                style={{
                    transform: `translateX(${selectedIndex * 98.5}%)`,
                    marginLeft: "2px",
                    marginRight: "2px",
                }}
            />

            {options.map((option, idx) => (
                <div key={option} className="relative flex-1">
                    <button
                        onClick={() => onChange(option)}
                        className={`relative w-full h-full px-4 py-2 text-sm font-medium z-10
                            ${selected === option ? "text-gray-900" : "text-gray-500"}`}
                    >
                        {option}
                    </button>

                    {idx < options.length - 1 &&
                    idx !== selectedIndex - 1 &&
                    idx !== selectedIndex && ( 
                        <div className="absolute right-0 top-2 bottom-2 w-px bg-gray-300 z-0" />
                    )}
                </div>
            ))}
        </div>
    );
}
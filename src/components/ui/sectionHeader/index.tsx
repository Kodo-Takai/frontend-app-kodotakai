type Props = {
    title: string;
};

export default function SectionHeader({ title }: Props) {
    return (
        <h3 className="text-ml font-bold text-gray-800 mt-6 mb-4">
            {title}
        </h3>
    );
}
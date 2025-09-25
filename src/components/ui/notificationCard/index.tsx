type Props = {
    title: string;
    description?: string;
    isRead: boolean;
    imageUrl?: string;
};

export default function NotificationCard({
    title,
    description,
    isRead,
    imageUrl,
}: Props) {
    return (
        <div className="flex items-center space-x-3 p-4 bg-white rounded-3xl shadow-[0_0_13px_0_rgba(0,0,0,0.09)] mb-5">
            <div
                className={`w-2 h-2 rounded-full mr-5 ${
                    isRead ? 'bg-[#D0D0D0]' : 'bg-[#DC1217]'
                }`}
            />

            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#D0D0D0]">
                    </div>
                )}
            </div>
            
            <div className="flex-1">
                <p className="text-sm font-semibold text-[#00324A]">{title}</p>
                {description && (
                    <p className="text-sm text-[#acacac]">{description}</p>
                )}
            </div>
        </div>
    );
}
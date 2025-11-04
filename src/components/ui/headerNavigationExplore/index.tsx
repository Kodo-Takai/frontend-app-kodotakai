import { useNavigate } from "react-router-dom";

interface HeaderNavigationExploreProps {
  onBackClick?: () => void;
  onNotificationsClick?: () => void;
}

export default function HeaderNavigationExplore({
  onBackClick,
  onNotificationsClick,
}: HeaderNavigationExploreProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate("/explorar");
    }
  };

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    } else {
      navigate("/notifications");
    }
  };

  return (
    <div className="flex flex-row items-center justify-between gap-4 w-full mt-5">
      <div className="flex items-center justify-start flex-1">
        <button
          onClick={handleBackClick}
          className="w-10 h-10 bg-black/55 hover:bg-black/70 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
        >
          <img
            src="/icons/white-arrow-left.svg"
            alt="Regresar"
            className="w-5 h-5 filter brightness-0 invert"
          />
        </button>
      </div>

      <div className="flex items-center justify-center flex-1">
        <h1 className="text-white text-2xl font-normal text-center">Explora</h1>
      </div>

      <div className="flex items-center justify-end flex-1">

      </div>
    </div>
  );
}

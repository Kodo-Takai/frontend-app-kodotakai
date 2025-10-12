import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { AgendaItem } from '../../../redux/slice/agendaSlice';

interface MoveDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AgendaItem;
  onMoveDestination: (id: string, newDate: Date, newTime: string) => void;
}

const MoveDestinationModal: React.FC<MoveDestinationModalProps> = ({
  isOpen,
  onClose,
  item,
  onMoveDestination,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date(item.scheduledDate));
  const [selectedTime, setSelectedTime] = useState(item.scheduledTime);

  // Prevenir scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup: restaurar scroll cuando el componente se desmonta
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMoveDestination(item.id, selectedDate, selectedTime);
    onClose();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  return (
    <div className="mb-5 fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-[#fffff9] rounded-2xl p-6 w-[80%] mx-4 shadow-2xl">

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-black text-[#151A00] tracking-[-1px]">MOVER</h2>
              <p className="text-sm text-[#151A00]">Agenda en otro momento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <span className="text-[#BACB2C] text-lg font-bold">×</span>
          </button>
        </div>

        <div className="mb-3">
          <img
            src={item.image}
            alt={item.destinationName}
            className="w-full h-30 object-cover rounded-xl"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-extrabold text-black uppercase mb-2 leading-5">
            {item.destinationName}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            {item.location}
          </p>
          {item.placeData?.rating && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="flex items-center gap-1">
                <span className="text-[#BACB2C]">★</span>
                <span className="text-sm font-medium">{item.placeData.rating}</span>
                {item.placeData.user_ratings_total && (
                  <span className="text-xs text-gray-500">
                    ({item.placeData.user_ratings_total} reseñas)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-black min-w-[60px]">
              Día:
            </label>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#BACB2C] w-full max-w-full"
                min={format(new Date(), 'yyyy-MM-dd')}
              />

            </div>
          </div>


          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-black min-w-[120px]">
              Hora postergada:
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#B8F261]"
            />
          </div>


          <button
            type="submit"
            className="w-full py-3 text-xl px-4 bg-[#BACB2C] text-black rounded-xl font-medium hover:bg-[#A8E251] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Editar
          </button>
        </form>
      </div>
    </div>
  );
};

export default MoveDestinationModal;

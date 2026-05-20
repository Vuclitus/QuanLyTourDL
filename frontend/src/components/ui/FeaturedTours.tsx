import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

interface Tour {
  id: number;
  name: string;
  bookings: number;
  max_participants: number;
  price: string;
  rating: number;
  image: string;
}

export function FeaturedTours({ data = [] }: { data?: Tour[] }) {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Tour nổi bật</h3>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-all">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-all">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
            Chưa có tour nổi bật
          </div>
        ) : (
          data.map((tour) => {
            const isFull = tour.bookings >= tour.max_participants;
            return (
              <Link 
                href={`/admin/tours/${tour.id}`}
                key={tour.id} 
                className="flex gap-4 p-3 rounded-[20px] border border-gray-50 group cursor-pointer dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900 transition-all bg-gray-50/30 dark:bg-gray-800/20"
              >
                <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={tour.image} 
                    alt={tour.name}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isFull ? 'grayscale' : ''}`}
                  />
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-white/90 rounded-md text-[10px] font-black dark:bg-gray-900/90 dark:text-gray-100">
                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    {tour.rating.toFixed(1)}
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="font-black text-xs text-gray-900 truncate dark:text-gray-100 mb-1">{tour.name}</h4>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isFull ? 'text-red-500' : 'text-gray-400'}`}>
                        {isFull ? 'Đã hết chỗ' : `${tour.bookings} Đặt chỗ`}
                      </span>
                    </div>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">{tour.price}</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

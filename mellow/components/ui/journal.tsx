import React from 'react';

interface Journal {
  EntryID: string;
  Title: string;
  Emoji: string;
}

interface RecordsProps {
  journals: Journal[];
}

const Records: React.FC<RecordsProps> = ({ journals }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-8">
             {journals.map((journal) => (
               <div
                 key={journal.EntryID}
                 className="flex flex-col items-center justify-center p-10 rounded-lg shadow-lg"
                 style={{ width: '250px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
               >
                 {/* Emoji container */}
                 <div className="w-20 h-20 flex items-center justify-center rounded mb-4" >
                   <span className="text-5xl">{journal.Emoji}</span>
                 </div>
                 {/* Title */}
                 <span className="text-md font-bold text-gray-700">
                   {journal.Title}
                 </span>
               </div>
             ))}
           </div>
  )
};

export default Records;

import React from 'react';
import { CheckCircle2, Clock, Calendar, FlaskConical, Cpu, FileCheck } from 'lucide-react';
import { format } from 'date-fns';

const steps = [
  { status: 'Booked', title: 'Appointment Booked', desc: 'Slot booked & payment completed', icon: Calendar },
  { status: 'Confirmed', title: 'Booking Confirmed', desc: 'Verified by diagnostic team', icon: CheckCircle2 },
  { status: 'Sample Collected', title: 'Sample Collected', desc: 'Phlebotomist collected sample', icon: FlaskConical },
  { status: 'Processing', title: 'Lab Processing', desc: 'Sample analyzing in laboratory', icon: Cpu },
  { status: 'Report Ready', title: 'Report Finalized', desc: 'Verified by pathologist & available', icon: FileCheck },
];

const Timeline = ({ currentStatus, statusHistory = [] }) => {
  const statusOrder = ['Booked', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const getHistoryItem = (statusName) => {
    return statusHistory.find((h) => h.status === statusName);
  };

  return (
    <div className="py-4">
      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-8">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const historyItem = getHistoryItem(step.status);
          const IconComp = step.icon;

          return (
            <div key={step.status} className="relative pl-6 md:pl-8 group">
              {/* Timeline Dot / Icon Node */}
              <div
                className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-md scale-110'
                    : isDone
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                <IconComp className="w-4 h-4" />
              </div>

              {/* Content Card */}
              <div
                className={`p-4 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-teal-50/60 border border-teal-200 shadow-sm'
                    : isDone
                    ? 'bg-white border border-slate-200/80'
                    : 'bg-slate-50/50 border border-slate-100 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4
                    className={`font-semibold text-base ${
                      isCurrent
                        ? 'text-teal-900'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {historyItem && (
                    <span className="inline-flex items-center text-xs text-slate-500 font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {format(new Date(historyItem.updatedAt), 'MMM dd, yyyy • hh:mm a')}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-1">{step.desc}</p>

                {historyItem?.note && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs text-slate-600 italic flex items-center gap-1.5">
                    <span className="font-semibold not-italic text-slate-700">Note:</span> {historyItem.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;

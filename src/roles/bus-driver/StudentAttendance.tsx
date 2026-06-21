import { useMemo, useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import TabGroup from '../../components/shared/TabGroup';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

export default function StudentAttendance() {
  const config = roleConfigs['bus-driver'];
  const { user } = useAuth();
  const { students, attendance, getDriverByUserId, upsertAttendanceRecord } = useData();
  const driver = getDriverByUserId(user?.id ?? '');
  const passengers = useMemo(
    () => students.filter((s) => s.busId === driver?.busId),
    [students, driver?.busId]
  );

  const [activeType, setActiveType] = useState<'boarding' | 'dropOff'>('boarding');
  const today = new Date().toISOString().split('T')[0];
  const recordType = activeType === 'boarding' ? 'boarding' as const : 'drop-off' as const;

  const attendanceList = useMemo(
    () =>
      passengers.map((student) => {
        const record = attendance.find(
          (a) =>
            a.studentId === student.id &&
            a.date === today &&
            a.type === recordType
        );
        return {
          studentId: student.id,
          studentName: student.name,
          status: record?.status ?? null,
        };
      }),
    [passengers, attendance, today, recordType]
  );

  const markAttendance = (studentId: string, status: 'present' | 'absent') => {
    const student = passengers.find((s) => s.id === studentId);
    if (!student) return;

    upsertAttendanceRecord({
      studentId,
      studentName: student.name,
      date: today,
      type: recordType,
      status,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const presentCount = attendanceList.filter((a) => a.status === 'present').length;
  const absentCount = attendanceList.filter((a) => a.status === 'absent').length;
  const unmarkedCount = attendanceList.length - presentCount - absentCount;

  return (
    <div className="page-shell">
      <PageHeader
        badge={config.title}
        title="Student Attendance"
        description="Attendance saves automatically when you mark each student"
      />

      <TabGroup
        tabs={[
          { id: 'boarding', label: 'Boarding' },
          { id: 'dropOff', label: 'Drop-off' },
        ]}
        activeTab={activeType}
        onChange={(id) => setActiveType(id as 'boarding' | 'dropOff')}
        accentClass={config.navActive}
      />

      <div className="flex flex-wrap gap-2">
        <StatusBadge status="present" className="!text-sm" />
        <span className="self-center text-sm font-semibold text-slate-600">{presentCount}</span>
        <StatusBadge status="absent" className="!text-sm" />
        <span className="self-center text-sm font-semibold text-slate-600">{absentCount}</span>
        <span className="badge bg-slate-100 text-slate-600 ring-1 ring-slate-200">
          Unmarked: {unmarkedCount}
        </span>
      </div>

      <Card title={`Mark ${activeType === 'boarding' ? 'Boarding' : 'Drop-off'} Attendance`}>
        <div className="space-y-3">
          {attendanceList.map((entry) => (
            <div
              key={entry.studentId}
              className="card-interactive flex flex-col gap-3 !p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-semibold text-slate-900">{entry.studentName}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => markAttendance(entry.studentId, 'present')}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    entry.status === 'present'
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => markAttendance(entry.studentId, 'absent')}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    entry.status === 'absent'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

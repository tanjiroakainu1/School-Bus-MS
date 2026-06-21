import { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import FormField from '../../components/shared/FormField';
import AlertBanner from '../../components/shared/AlertBanner';
import EmptyState from '../../components/shared/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

export default function StudentInformation() {
  const config = roleConfigs['parent-guardian'];
  const { user } = useAuth();
  const { students, updateStudent } = useData();
  const myStudents = students.filter((s) => s.parentId === user?.id);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ pickupPoint: '', dropOffPoint: '' });
  const [saved, setSaved] = useState(false);

  const startEdit = (studentId: string) => {
    const student = myStudents.find((s) => s.id === studentId);
    if (student) {
      setEditingId(studentId);
      setEditForm({ pickupPoint: student.pickupPoint, dropOffPoint: student.dropOffPoint });
    }
  };

  const handleSave = (studentId: string) => {
    updateStudent(studentId, editForm);
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Student Information"
        description="View and update your children's information"
        badge={config.title}
      />

      {saved && (
        <AlertBanner type="success" message="Student information updated successfully!" />
      )}

      {myStudents.length === 0 ? (
        <Card>
          <EmptyState
            icon="👤"
            title="No students linked"
            description="No children are associated with your account."
          />
        </Card>
      ) : (
        <div className="content-grid">
          {myStudents.map((student) => (
            <Card key={student.id} interactive>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.accentBg} text-lg font-bold ${config.accent}`}>
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{student.name}</h3>
                    <p className="text-sm text-slate-500">Grade: {student.grade}</p>
                  </div>
                </div>
                {editingId !== student.id && (
                  <button onClick={() => startEdit(student.id)} className="btn-secondary text-xs">
                    Edit
                  </button>
                )}
              </div>

              {editingId === student.id ? (
                <div className="mt-5 space-y-4">
                  <FormField label="Pickup Point">
                    <input
                      type="text"
                      value={editForm.pickupPoint}
                      onChange={(e) => setEditForm({ ...editForm, pickupPoint: e.target.value })}
                      className="input-field"
                    />
                  </FormField>
                  <FormField label="Drop-off Point">
                    <input
                      type="text"
                      value={editForm.dropOffPoint}
                      onChange={(e) => setEditForm({ ...editForm, dropOffPoint: e.target.value })}
                      className="input-field"
                    />
                  </FormField>
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(student.id)} className="btn-primary text-xs">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary text-xs">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className={`rounded-xl border ${config.accentBorder} ${config.accentBg} p-4`}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pickup Point</p>
                    <p className="mt-1 font-semibold text-slate-900">{student.pickupPoint}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Drop-off Point</p>
                    <p className="mt-1 font-semibold text-slate-900">{student.dropOffPoint}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

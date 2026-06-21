import { useState } from 'react';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import SearchInput from '../../components/shared/SearchInput';
import FormField from '../../components/shared/FormField';
import AlertBanner from '../../components/shared/AlertBanner';
import EmptyState from '../../components/shared/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

const gradeOptions = ['Pre-K', 'Kindergarten', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const emptyForm = {
  name: '',
  grade: '1st',
  pickupPoint: '',
  dropOffPoint: '',
};

export default function StudentInformation() {
  const config = roleConfigs['parent-guardian'];
  const { user } = useAuth();
  const { students, addStudent, updateStudent, deleteStudent } = useData();
  const myStudents = students.filter((s) => s.parentId === user?.id);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const filtered = myStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.grade.toLowerCase().includes(search.toLowerCase()) ||
      s.pickupPoint.toLowerCase().includes(search.toLowerCase()) ||
      s.dropOffPoint.toLowerCase().includes(search.toLowerCase())
  );

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (studentId: string) => {
    const student = myStudents.find((s) => s.id === studentId);
    if (!student) return;
    setEditingId(studentId);
    setForm({
      name: student.name,
      grade: student.grade,
      pickupPoint: student.pickupPoint,
      dropOffPoint: student.dropOffPoint,
    });
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError('Student name is required.');
      return;
    }
    if (!form.pickupPoint.trim() || !form.dropOffPoint.trim()) {
      setError('Pickup and drop-off points are required.');
      return;
    }
    if (!user) return;

    if (editingId) {
      updateStudent(editingId, {
        name: form.name.trim(),
        grade: form.grade,
        pickupPoint: form.pickupPoint.trim(),
        dropOffPoint: form.dropOffPoint.trim(),
      });
      showSuccess('Student information updated successfully!');
    } else {
      addStudent({
        name: form.name.trim(),
        grade: form.grade,
        parentId: user.id,
        pickupPoint: form.pickupPoint.trim(),
        dropOffPoint: form.dropOffPoint.trim(),
      });
      showSuccess('Student added successfully!');
    }

    closeModal();
  };

  const handleDelete = (studentId: string) => {
    deleteStudent(studentId);
    showSuccess('Student removed successfully.');
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Student Information"
        description="Manage your children's profiles and pickup details"
        badge={config.title}
        action={
          <button onClick={openAddModal} className="btn-primary">
            + Add Student
          </button>
        }
      />

      {success && <AlertBanner type="success" message={success} />}
      {error && !isModalOpen && <AlertBanner type="warning" message={error} />}

      <div className="filter-bar">
        <p className="text-sm font-medium text-slate-500">
          {filtered.length} student{filtered.length !== 1 ? 's' : ''}
        </p>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search students..."
          className="w-full sm:max-w-xs"
        />
      </div>

      <Card noPadding={filtered.length > 0}>
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="👤"
              title={search ? 'No students found' : 'No students linked'}
              description={
                search
                  ? 'Try adjusting your search terms.'
                  : 'Add a student to manage their pickup and drop-off details.'
              }
            />
            {!search && (
              <div className="mt-4 flex justify-center">
                <button onClick={openAddModal} className="btn-primary">
                  + Add Student
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="table-shell hidden border-0 shadow-none sm:block">
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Grade</th>
                      <th>Pickup Point</th>
                      <th>Drop-off Point</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((student) => (
                      <tr key={student.id}>
                        <td className="font-semibold text-slate-900">{student.name}</td>
                        <td className="text-slate-600">{student.grade}</td>
                        <td className="text-slate-600">{student.pickupPoint}</td>
                        <td className="text-slate-600">{student.dropOffPoint}</td>
                        <td>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => openEditModal(student.id)}
                              className={`text-sm font-semibold ${config.accent} transition hover:opacity-80`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="text-sm font-semibold text-red-600 transition hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-card-list p-4 2xs:p-5">
              {filtered.map((student) => (
                <div key={student.id} className="mobile-card-item">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.accentBg} text-sm font-bold ${config.accent}`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="text-sm text-slate-500">Grade: {student.grade}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm">
                    <div className={`rounded-lg border ${config.accentBorder} ${config.accentBg} px-3 py-2`}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pickup</span>
                      <p className="font-medium text-slate-900">{student.pickupPoint}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Drop-off</span>
                      <p className="font-medium text-slate-900">{student.dropOffPoint}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => openEditModal(student.id)}
                      className={`text-sm font-semibold ${config.accent} transition hover:opacity-80`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-sm font-semibold text-red-600 transition hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Student' : 'Add Student'}
      >
        <div className="space-y-4">
          {error && <AlertBanner type="warning" message={error} />}

          <FormField label="Student Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Emma Smith"
            />
          </FormField>

          <FormField label="Grade">
            <select
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="input-field"
            >
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Pickup Point" hint="Where the bus picks up your child">
            <input
              type="text"
              value={form.pickupPoint}
              onChange={(e) => setForm({ ...form, pickupPoint: e.target.value })}
              className="input-field"
              placeholder="e.g. Oak St"
            />
          </FormField>

          <FormField label="Drop-off Point" hint="Where your child is dropped off">
            <input
              type="text"
              value={form.dropOffPoint}
              onChange={(e) => setForm({ ...form, dropOffPoint: e.target.value })}
              className="input-field"
              placeholder="e.g. Main Campus"
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={closeModal} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary">
              {editingId ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

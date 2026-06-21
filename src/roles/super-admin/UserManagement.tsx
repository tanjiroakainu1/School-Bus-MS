import { useState } from 'react';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import TabGroup from '../../components/shared/TabGroup';
import SearchInput from '../../components/shared/SearchInput';
import EmptyState from '../../components/shared/EmptyState';
import FormField from '../../components/shared/FormField';
import AlertBanner from '../../components/shared/AlertBanner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import type { UserRole } from '../../types';

const config = roleConfigs['super-admin'];

const roleLabels: Record<UserRole, string> = {
  'super-admin': 'Super Admin',
  'transportation-manager': 'Transportation Manager',
  'bus-driver': 'Bus Driver',
  'parent-guardian': 'Parent / Guardian',
};

const gradeOptions = ['Pre-K', 'Kindergarten', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const emptyUserForm = { name: '', email: '', role: 'bus-driver' as UserRole };
const emptyStudentForm = { name: '', grade: '1st', parentId: '', pickupPoint: '', dropOffPoint: '' };

export default function UserManagement() {
  const { registeredUsers, addAccountByAdmin, updateAccountRole, deleteAccount } = useAuth();
  const { students, addStudent, updateStudent, deleteStudent } = useData();

  const [activeTab, setActiveTab] = useState<'users' | 'students'>('users');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState(emptyUserForm);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState(emptyStudentForm);

  const parents = registeredUsers.filter((u) => u.role === 'parent-guardian');

  const getParentName = (parentId: string) =>
    registeredUsers.find((u) => u.id === parentId)?.name ?? 'Unknown parent';

  const filteredUsers = registeredUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStudents = students.filter((s) => {
    const parentName = getParentName(s.parentId).toLowerCase();
    const query = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.grade.toLowerCase().includes(query) ||
      s.pickupPoint.toLowerCase().includes(query) ||
      s.dropOffPoint.toLowerCase().includes(query) ||
      parentName.includes(query)
    );
  });

  const tabs = [
    { id: 'users', label: 'Users', count: registeredUsers.length },
    { id: 'students', label: 'Students', count: students.length },
  ];

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAddUser = () => {
    const result = addAccountByAdmin(userForm.name, userForm.email, userForm.role);
    if (!result.success) {
      setError(result.error ?? 'Could not add user.');
      return;
    }
    setError('');
    setUserForm(emptyUserForm);
    setIsUserModalOpen(false);
    showSuccess('User added successfully!');
  };

  const handleDeleteUser = (id: string) => {
    students.filter((s) => s.parentId === id).forEach((s) => deleteStudent(s.id));
    deleteAccount(id);
    showSuccess('User deleted successfully.');
  };

  const openAddStudentModal = () => {
    setEditingStudentId(null);
    setStudentForm({ ...emptyStudentForm, parentId: parents[0]?.id ?? '' });
    setError('');
    setIsStudentModalOpen(true);
  };

  const openEditStudentModal = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    setEditingStudentId(studentId);
    setStudentForm({
      name: student.name,
      grade: student.grade,
      parentId: student.parentId,
      pickupPoint: student.pickupPoint,
      dropOffPoint: student.dropOffPoint,
    });
    setError('');
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setEditingStudentId(null);
    setStudentForm(emptyStudentForm);
    setError('');
  };

  const handleSaveStudent = () => {
    if (!studentForm.name.trim()) {
      setError('Student name is required.');
      return;
    }
    if (!studentForm.parentId) {
      setError('A parent/guardian must be assigned.');
      return;
    }
    if (!studentForm.pickupPoint.trim() || !studentForm.dropOffPoint.trim()) {
      setError('Pickup and drop-off points are required.');
      return;
    }

    const payload = {
      name: studentForm.name.trim(),
      grade: studentForm.grade,
      parentId: studentForm.parentId,
      pickupPoint: studentForm.pickupPoint.trim(),
      dropOffPoint: studentForm.dropOffPoint.trim(),
    };

    if (editingStudentId) {
      updateStudent(editingStudentId, payload);
      showSuccess('Student updated successfully!');
    } else {
      addStudent(payload);
      showSuccess('Student added successfully!');
    }

    closeStudentModal();
  };

  const handleDeleteStudent = (studentId: string) => {
    deleteStudent(studentId);
    showSuccess('Student deleted successfully.');
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id as 'users' | 'students');
    setSearch('');
    setError('');
  };

  return (
    <div className="page-shell">
      <PageHeader
        badge="Super Admin"
        title="User & Role Management"
        description="Manage system users, roles, and student records"
        action={
          activeTab === 'users' ? (
            <button onClick={() => { setError(''); setIsUserModalOpen(true); }} className="btn-primary">
              + Add User
            </button>
          ) : (
            <button
              onClick={openAddStudentModal}
              className="btn-primary"
              disabled={parents.length === 0}
            >
              + Add Student
            </button>
          )
        }
      />

      {success && <AlertBanner type="success" message={success} />}
      {error && !isUserModalOpen && !isStudentModalOpen && <AlertBanner type="warning" message={error} />}

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleTabChange}
        accentClass={config.navActive}
      />

      <div className="filter-bar">
        <p className="text-sm font-medium text-slate-500">
          {activeTab === 'users'
            ? `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''}`
            : `${filteredStudents.length} student${filteredStudents.length !== 1 ? 's' : ''}`}
        </p>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={activeTab === 'users' ? 'Search users...' : 'Search students...'}
          className="w-full sm:max-w-xs"
        />
      </div>

      {activeTab === 'users' ? (
        <Card noPadding={filteredUsers.length > 0}>
          {filteredUsers.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon="👥"
                title="No users found"
                description={search ? 'Try adjusting your search terms.' : 'Add a user to get started.'}
              />
            </div>
          ) : (
            <>
              <div className="table-shell hidden border-0 shadow-none sm:block">
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="font-semibold text-slate-900">{user.name}</td>
                          <td className="text-slate-600">{user.email}</td>
                          <td>
                            <select
                              value={user.role}
                              onChange={(e) => updateAccountRole(user.id, e.target.value as UserRole)}
                              className="input-field max-w-[200px]"
                            >
                              {Object.entries(roleLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-sm font-semibold text-red-600 transition hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mobile-card-list p-4 2xs:p-5">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="mobile-card-item">
                    <div className="mb-3">
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <FormField label="Role">
                      <select
                        value={user.role}
                        onChange={(e) => updateAccountRole(user.id, e.target.value as UserRole)}
                        className="input-field"
                      >
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </FormField>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="mt-3 text-sm font-semibold text-red-600 transition hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      ) : (
        <Card noPadding={filteredStudents.length > 0}>
          {filteredStudents.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon="🎓"
                title={search ? 'No students found' : 'No students registered'}
                description={
                  search
                    ? 'Try adjusting your search terms.'
                    : 'Students added by parents or admins will appear here.'
                }
              />
              {!search && parents.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <button onClick={openAddStudentModal} className="btn-primary">
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
                        <th>Parent / Guardian</th>
                        <th>Pickup Point</th>
                        <th>Drop-off Point</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="font-semibold text-slate-900">{student.name}</td>
                          <td className="text-slate-600">{student.grade}</td>
                          <td className="text-slate-600">{getParentName(student.parentId)}</td>
                          <td className="text-slate-600">{student.pickupPoint}</td>
                          <td className="text-slate-600">{student.dropOffPoint}</td>
                          <td>
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                onClick={() => openEditStudentModal(student.id)}
                                className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
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
                {filteredStudents.map((student) => (
                  <div key={student.id} className="mobile-card-item">
                    <div className="mb-3">
                      <p className="font-semibold text-slate-900">{student.name}</p>
                      <p className="text-sm text-slate-500">
                        Grade: {student.grade} • Parent: {getParentName(student.parentId)}
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
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
                        onClick={() => openEditStudentModal(student.id)}
                        className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
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
      )}

      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Add New User">
        <div className="space-y-4">
          {error && isUserModalOpen && <AlertBanner type="warning" message={error} />}
          <FormField label="Name">
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="input-field"
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="input-field"
            />
          </FormField>
          <FormField label="Role">
            <select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
              className="input-field"
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FormField>
          <p className="text-xs text-slate-500">Default password: demo123</p>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsUserModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAddUser} className="btn-primary">Add User</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isStudentModalOpen}
        onClose={closeStudentModal}
        title={editingStudentId ? 'Edit Student' : 'Add Student'}
      >
        <div className="space-y-4">
          {error && isStudentModalOpen && <AlertBanner type="warning" message={error} />}

          <FormField label="Student Name">
            <input
              type="text"
              value={studentForm.name}
              onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Emma Smith"
            />
          </FormField>

          <FormField label="Grade">
            <select
              value={studentForm.grade}
              onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
              className="input-field"
            >
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Parent / Guardian">
            <select
              value={studentForm.parentId}
              onChange={(e) => setStudentForm({ ...studentForm, parentId: e.target.value })}
              className="input-field"
            >
              {parents.length === 0 ? (
                <option value="">No parent accounts available</option>
              ) : (
                parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>{parent.name}</option>
                ))
              )}
            </select>
          </FormField>

          <FormField label="Pickup Point">
            <input
              type="text"
              value={studentForm.pickupPoint}
              onChange={(e) => setStudentForm({ ...studentForm, pickupPoint: e.target.value })}
              className="input-field"
              placeholder="e.g. Oak St"
            />
          </FormField>

          <FormField label="Drop-off Point">
            <input
              type="text"
              value={studentForm.dropOffPoint}
              onChange={(e) => setStudentForm({ ...studentForm, dropOffPoint: e.target.value })}
              className="input-field"
              placeholder="e.g. Main Campus"
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={closeStudentModal} className="btn-secondary">Cancel</button>
            <button onClick={handleSaveStudent} className="btn-primary" disabled={parents.length === 0}>
              {editingStudentId ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

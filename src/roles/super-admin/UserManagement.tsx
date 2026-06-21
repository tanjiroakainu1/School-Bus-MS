import { useState } from 'react';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import SearchInput from '../../components/shared/SearchInput';
import EmptyState from '../../components/shared/EmptyState';
import FormField from '../../components/shared/FormField';
import AlertBanner from '../../components/shared/AlertBanner';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

const roleLabels: Record<UserRole, string> = {
  'super-admin': 'Super Admin',
  'transportation-manager': 'Transportation Manager',
  'bus-driver': 'Bus Driver',
  'parent-guardian': 'Parent / Guardian',
};

export default function UserManagement() {
  const { registeredUsers, addAccountByAdmin, updateAccountRole, deleteAccount } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'bus-driver' as UserRole });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const filtered = registeredUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    const result = addAccountByAdmin(form.name, form.email, form.role);
    if (!result.success) {
      setError(result.error ?? 'Could not add user.');
      return;
    }
    setError('');
    setForm({ name: '', email: '', role: 'bus-driver' });
    setIsModalOpen(false);
  };

  return (
    <div className="page-shell">
      <PageHeader
        badge="Super Admin"
        title="User & Role Management"
        description="Manage system users and assign roles"
        action={
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            + Add User
          </button>
        }
      />

      {error && <AlertBanner type="warning" message={error} />}

      <div className="filter-bar">
        <p className="text-sm font-medium text-slate-500">
          {filtered.length} user{filtered.length !== 1 ? 's' : ''}
        </p>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search users..."
          className="w-full sm:max-w-xs"
        />
      </div>

      <Card noPadding={filtered.length > 0}>
        {filtered.length === 0 ? (
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
                    {filtered.map((user) => (
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
                            onClick={() => deleteAccount(user.id)}
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
              {filtered.map((user) => (
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
                    onClick={() => deleteAccount(user.id)}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New User">
        <div className="space-y-4">
          <FormField label="Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
            />
          </FormField>
          <FormField label="Role">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
              className="input-field"
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FormField>
          <p className="text-xs text-slate-500">Default password: demo123</p>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAddUser} className="btn-primary">Add User</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

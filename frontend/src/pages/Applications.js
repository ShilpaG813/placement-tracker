import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const Applications = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState({
    company: '', role: '', type: 'Intern', cgpaCutoff: '',
    status: 'Applied', notes: '', stipend: '',
    rounds: [{ roundName: '', result: 'Pending' }]
  });

  const headers = { Authorization: `Bearer ${token}` };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications', { headers });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:5000/api/applications', form, { headers });
    showToast('Application added successfully!', 'success');
    setShowForm(false);
    setForm({
      company: '', role: '', type: 'Intern', cgpaCutoff: '',
      status: 'Applied', notes: '', stipend: '',
      rounds: [{ roundName: '', result: 'Pending' }]
    });
    fetchApplications();
  } catch (err) {
    showToast('Failed to add application!', 'error');
  }
};

const handleDelete = (id) => {
  setConfirmDelete(id);
};

const confirmDeleteApp = async () => {
  try {
    await axios.delete(`http://localhost:5000/api/applications/${confirmDelete}`, { headers });
    showToast('Application deleted!', 'success');
    setConfirmDelete(null);
    fetchApplications();
  } catch (err) {
    showToast('Failed to delete!', 'error');
  }
};

const handleStatusChange = async (id, status) => {
  try {
    await axios.put(`http://localhost:5000/api/applications/${id}`, { status }, { headers });
    showToast('Status updated!', 'success');
    fetchApplications();
  } catch (err) {
    showToast('Failed to update!', 'error');
  }
};

  const addRound = () => {
    setForm({ ...form, rounds: [...form.rounds, { roundName: '', result: 'Pending' }] });
  };

  const updateRound = (index, field, value) => {
    const updated = [...form.rounds];
    updated[index][field] = value;
    setForm({ ...form, rounds: updated });
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Selected': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const filtered = applications
    .filter(app => filterStatus === 'All' || app.status === filterStatus)
    .filter(app =>
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
        >
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {/* Add Application Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 text-gray-700">New Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>Intern</option>
                  <option>Full-time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Applied</option>
                  <option>Pending</option>
                  <option>Selected</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CGPA Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.cgpaCutoff}
                  onChange={(e) => setForm({ ...form, cgpaCutoff: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
                <input
                  type="text"
                  placeholder="e.g. 25000/month"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.stipend}
                  onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {/* Rounds */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Interview Rounds</label>
                <button type="button" onClick={addRound} className="text-blue-600 text-sm hover:underline">
                  + Add Round
                </button>
              </div>
              {form.rounds.map((round, index) => (
                <div key={index} className="grid grid-cols-2 gap-3 mb-2">
                  <input
                    type="text"
                    placeholder="Round name (e.g. OA, Technical)"
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={round.roundName}
                    onChange={(e) => updateRound(index, 'roundName', e.target.value)}
                  />
                  <select
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={round.result}
                    onChange={(e) => updateRound(index, 'result', e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Pass</option>
                    <option>Fail</option>
                  </select>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Save Application
            </button>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search company or role..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Applied</option>
          <option>Pending</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg">No applications yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <div key={app._id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{app.company}</h3>
                  <p className="text-gray-500">{app.role} • {app.type}</p>
                  {app.stipend && <p className="text-green-600 text-sm mt-1">💰 {app.stipend}</p>}
                  {app.cgpaCutoff && <p className="text-gray-400 text-sm">CGPA Cutoff: {app.cgpaCutoff}</p>}
                  {app.notes && <p className="text-gray-500 text-sm mt-2">📝 {app.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className={`text-sm px-3 py-1 rounded-full font-semibold border-0 cursor-pointer ${statusColor(app.status)}`}
                  >
                    <option>Applied</option>
                    <option>Pending</option>
                    <option>Selected</option>
                    <option>Rejected</option>
                  </select>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              {/* Rounds */}
              {app.rounds && app.rounds.length > 0 && app.rounds[0].roundName && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {app.rounds.map((round, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded-full font-medium
                        ${round.result === 'Pass' ? 'bg-green-100 text-green-700' :
                          round.result === 'Fail' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'}`}
                    >
                      {round.roundName}: {round.result}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {confirmDelete && (
  <ConfirmModal
    message="This will permanently delete this application."
    onConfirm={confirmDeleteApp}
    onCancel={() => setConfirmDelete(null)}
  />
)}
    </div>
    
  );
};

export default Applications;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const Reminders = () => {
  const { token } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const { showToast } = useToast();
const [confirmDelete, setConfirmDelete] = useState(null);
const [editForm, setEditForm] = useState({
  company: '', role: '', roundType: '', interviewDate: '', notes: ''
});
  const [form, setForm] = useState({
    company: '', role: '', roundType: '', interviewDate: '', notes: ''
  });

  const headers = { Authorization: 'Bearer ' + token };

  const fetchReminders = async () => {
    try {
      const res = await axios.get('https://placement-tracker-backend-76cz.onrender.com/api/reminders', { headers });
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchReminders(); }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formattedDate = new Date(form.interviewDate);

    await axios.post(
      'https://placement-tracker-backend-76cz.onrender.com/api/reminders',
      { ...form, interviewDate: formattedDate },
      { headers }
    );

    showToast('Reminder added!', 'success');
    setShowForm(false);
    setForm({ company: '', role: '', roundType: '', interviewDate: '', notes: '' });
    fetchReminders();
  } catch (err) {
    console.error(err);
  }
};
const handleDelete = (id) => {
  setConfirmDelete(id);
};

const confirmDeleteReminder = async () => {
  try {
    await axios.delete('https://placement-tracker-backend-76cz.onrender.com/api/reminders/' + confirmDelete, { headers });
    showToast('Reminder deleted!', 'success');
    setConfirmDelete(null);
    fetchReminders();
  } catch (err) {
    showToast('Failed to delete!', 'error');
  }
};

  const getDaysLeft = (date) => {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const interview = new Date(date);
  const interviewMidnight = new Date(interview.getFullYear(), interview.getMonth(), interview.getDate());
  const diff = Math.round((interviewMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
  return diff;
};

  const getDaysLeftColor = (days) => {
    if (days < 0) return 'bg-gray-100 text-gray-500';
    if (days === 0) return 'bg-red-100 text-red-700';
    if (days <= 2) return 'bg-orange-100 text-orange-700';
    if (days <= 7) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getDaysLeftText = (days) => {
    if (days < 0) return 'Past';
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow!';
    return days + ' days left';
  };

const upcoming = reminders.filter(r => new Date(r.interviewDate) > new Date());
const past = reminders.filter(r => new Date(r.interviewDate) <= new Date());

  const handleEdit = (reminder) => {
  setEditId(reminder._id);
  setEditForm({
    company: reminder.company,
    role: reminder.role,
    roundType: reminder.roundType,
    interviewDate: new Date(reminder.interviewDate).toISOString().slice(0, 16),
    notes: reminder.notes || ''
  });
};

const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const formattedDate = new Date(editForm.interviewDate);

    await axios.put(
      'https://placement-tracker-backend-76cz.onrender.com/api/reminders/' + editId,
      { ...editForm, interviewDate: formattedDate },
      { headers }
    );

    setEditId(null);
    fetchReminders();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Interview Reminders</h1>
          <p className="text-gray-500 text-sm mt-1">
            You will get email reminders — 1 day before, 2 hours before, and 30 mins before each interview
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
        >
          {showForm ? 'Cancel' : '+ Add Reminder'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-700">New Reminder</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Round Type</label>
                <select
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.roundType}
                  onChange={(e) => setForm({ ...form, roundType: e.target.value })}
                >
                  <option value="">Select round</option>
                  <option>Online Assessment</option>
                  <option>Technical Round 1</option>
                  <option>Technical Round 2</option>
                  <option>HR Round</option>
                  <option>Manager Round</option>
                  <option>Group Discussion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.interviewDate}
                  onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                rows="2"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Save Reminder
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : reminders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🔔</p>
          <p className="text-lg">No reminders yet. Add your first one!</p>
        </div>
      ) : (
        <div>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 mb-3">
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map(reminder => {
                  const days = getDaysLeft(reminder.interviewDate);
                  return (
                  <div key={reminder._id} className={`rounded-xl shadow-sm p-5 border ${
  days === 0 ? 'bg-green-200 border-green-400' :
  days === 1 ? 'bg-green-100 border-green-300' :
  days <= 7 ? 'bg-green-50 border-green-200' :
  'bg-green-50 border-green-100'
}`}>
  {editId === reminder._id ? (
    <form onSubmit={handleUpdate} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editForm.company}
            onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Round Type</label>
          <select
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editForm.roundType}
            onChange={(e) => setEditForm({ ...editForm, roundType: e.target.value })}
          >
            <option value="">Select round</option>
            <option>Online Assessment</option>
            <option>Technical Round 1</option>
            <option>Technical Round 2</option>
            <option>HR Round</option>
            <option>Manager Round</option>
            <option>Group Discussion</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
          <input
            type="datetime-local"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editForm.interviewDate}
            onChange={(e) => setEditForm({ ...editForm, interviewDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          rows="2"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={editForm.notes}
          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm">
          Save
        </button>
        <button type="button" onClick={() => setEditId(null)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold text-sm">
          Cancel
        </button>
      </div>
    </form>
  ) : (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-lg font-bold text-gray-800">{reminder.company}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getDaysLeftColor(days)}`}>
            {getDaysLeftText(days)}
          </span>
        </div>
        <p className="text-gray-500">{reminder.role} - {reminder.roundType}</p>
        {/* <p className="text-gray-400 text-sm mt-1"> */}
        <p className="text-gray-800 text-sm mt-1 font-semibold">
          {new Date(reminder.interviewDate).toLocaleString('en-IN', {
            dateStyle: 'full', timeStyle: 'short'
          })}
        </p>
        {reminder.notes && (
          <p className="text-gray-500 text-sm mt-1">Note: {reminder.notes}</p>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => handleEdit(reminder)}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(reminder._id)}
          className="text-red-400 hover:text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  )}
</div>
                  );
                })}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-500 mb-3">Past ({past.length})</h2>
              <div className="space-y-3">
                {past.map(reminder => (
                <div key={reminder._id} className="bg-red-50 rounded-xl p-5 border border-red-400 flex justify-between items-start opacity-100">
                    <div>
                      <h3 className="text-lg font-bold text-gray-600">{reminder.company}</h3>
                      <p className="text-gray-600">{reminder.role} - {reminder.roundType}</p>
                      <p className="text-gray-600 text-sm mt-1 font-semibold">
                        {new Date(reminder.interviewDate).toLocaleString('en-IN', {
                          dateStyle: 'full', timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(reminder._id)}
                      className="text-red-300 hover:text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {confirmDelete && (
  <ConfirmModal
    message="This will permanently delete this reminder."
    onConfirm={confirmDeleteReminder}
    onCancel={() => setConfirmDelete(null)}
  />
  )}
    </div>
  );
};

export default Reminders;
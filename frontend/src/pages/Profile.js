import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { token, user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [form, setForm] = useState({
    name: '', cgpa: '', branch: '', skills: '', resume: ''
  });

  const headers = { Authorization: 'Bearer ' + token };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('https://placement-tracker-backend-76cz.onrender.com/api/profile', { headers });
        setProfileData(res.data);
        setForm({
          name: res.data.name || '',
          cgpa: res.data.cgpa || '',
          branch: res.data.branch || '',
          skills: res.data.skills ? res.data.skills.join(', ') : '',
          resume: res.data.resume || ''
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        cgpa: parseFloat(form.cgpa),
        branch: form.branch,
        skills: form.skills.split(',').map(function(s) { return s.trim(); }).filter(Boolean),
        resume: form.resume
      };
      const res = await axios.put('https://placement-tracker-backend-76cz.onrender.com/api/profile', payload, { headers });
      setProfileData(res.data);
      login({ ...user, name: res.data.name }, token);
      setEditing(false);
      setSuccess(true);
      setTimeout(function() { setSuccess(false); }, 3000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{profileData.name}</h1>
              <p className="text-gray-500">{profileData.email}</p>
            </div>
          </div>
          <button
            onClick={function() { setEditing(!editing); }}
            className={editing
              ? 'px-4 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'px-4 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700'
            }
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
            Profile updated successfully!
          </div>
        )}

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={function(e) { setForm({ ...form, name: e.target.value }); }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.branch}
                  onChange={function(e) { setForm({ ...form, branch: e.target.value }); }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  max="10"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.cgpa}
                  onChange={function(e) { setForm({ ...form, cgpa: e.target.value }); }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                placeholder="Python, SQL, React, MongoDB"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.skills}
                onChange={function(e) { setForm({ ...form, skills: e.target.value }); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link (Google Drive or any public link)</label>
              <input
                type="text"
                placeholder="https://drive.google.com/..."
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.resume}
                onChange={function(e) { setForm({ ...form, resume: e.target.value }); }}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Branch</p>
                <p className="text-lg font-semibold text-gray-800">
                  {profileData.branch ? profileData.branch : 'Not set'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">CGPA</p>
                <p className="text-lg font-semibold text-gray-800">
                  {profileData.cgpa ? profileData.cgpa : 'Not set'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profileData.skills && profileData.skills.length > 0 ? (
                  profileData.skills.map(function(skill, i) {
                    return (
                      <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-sm">No skills added</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Resume</p>
              {profileData.resume ? (
                <a>
                  href={profileData.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm font-medium"
                
                  View Resume
                </a>
              ) : (
                <p className="text-gray-400 text-sm">No resume link added</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
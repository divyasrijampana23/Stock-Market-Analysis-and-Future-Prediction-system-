import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User"
  });
  const limit = 5;
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/admin/users?search=${search}&page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data.users || []);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [search, page]);

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.is_admin ? "Admin" : "User"
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...formData,
        is_admin: formData.role === "Admin"
      };
      await axios.put(
        `http://localhost:8000/api/admin/users/${editingUser}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewInputChange = (e) => {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    const payload = {
      username: newUserData.username,
      email: newUserData.email,
      password: newUserData.password,
      is_admin: newUserData.role === "Admin"
    };

    try {
      await axios.post("http://localhost:8000/api/admin/users", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create user", err);
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel - Manage Users</h2>

      <button onClick={() => setShowCreateModal(true)} className="create-btn">+ Add User</button>

      {showCreateModal && (
        <div className="modal">
          <h3>Create New User</h3>
          <input type="text" name="username" placeholder="Username" onChange={handleNewInputChange} />
          <input type="email" name="email" placeholder="Email" onChange={handleNewInputChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleNewInputChange} />
          <select name="role" onChange={handleNewInputChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          <button onClick={handleCreateUser} className="save-btn">Create</button>
          <button onClick={() => setShowCreateModal(false)} className="cancel-btn">Cancel</button>
        </div>
      )}

      <input
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-search"
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  {editingUser === u.id ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  ) : (
                    u.username
                  )}
                </td>
                <td>
                  {editingUser === u.id ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td>
                  {editingUser === u.id ? (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  ) : (
                    u.is_admin ? "Admin" : "User"
                  )}
                </td>
                <td>
                  {editingUser === u.id ? (
                    <>
                      <button onClick={handleUpdate} className="save-btn">Save</button>
                      <button onClick={() => setEditingUser(null)} className="cancel-btn">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(u)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(u.id)} className="delete-btn">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AdminPanel;

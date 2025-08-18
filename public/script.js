document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const userList = document.getElementById('user-list');
    const editModal = document.getElementById('edit-modal');
    const closeModal = document.querySelector('.close-button');
    const editForm = document.getElementById('edit-form');
    const editUserId = document.getElementById('edit-user-id');
    const editName = document.getElementById('edit-name');
    const editEmail = document.getElementById('edit-email');

    const createUserListItem = (user) => {
        const li = document.createElement('li');
        li.dataset.userId = user._id;
        li.innerHTML = `
            <span>${user.name} (${user.email})</span>
            <div class="user-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        li.querySelector('.edit-btn').addEventListener('click', () => openEditModal(user));
        li.querySelector('.delete-btn').addEventListener('click', () => handleDelete(user._id));

        return li;
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();
            userList.innerHTML = '';
            users.forEach(user => {
                const li = createUserListItem(user);
                userList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const openEditModal = (user) => {
        editUserId.value = user._id;
        editName.value = user.name;
        editEmail.value = user.email;
        editModal.style.display = 'block';
    };

    const closeEditModal = () => {
        editModal.style.display = 'none';
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
            if (response.ok) {
                document.querySelector(`li[data-user-id="${userId}"]`).remove();
            } else {
                alert('Failed to delete user.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    document.getElementById('add-user-btn').addEventListener('click', async () => {
        const addUserButton = document.getElementById('add-user-btn');
        addUserButton.disabled = true;
        addUserButton.textContent = 'Adding...';
        document.getElementById('add-user-error').textContent = '';

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });

            if (response.ok) {
                userForm.reset();
                fetchUsers();
            } else {
                const errorData = await response.json();
                document.getElementById('add-user-error').textContent = errorData.error;
            }
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            addUserButton.disabled = false;
            addUserButton.textContent = 'Add User';
        }
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveButton = editForm.querySelector('button[type="submit"]');
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';
        document.getElementById('edit-user-error').textContent = '';

        const userId = editUserId.value;
        const name = editName.value;
        const email = editEmail.value;

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                const li = document.querySelector(`li[data-user-id="${userId}"]`);
                li.querySelector('span').textContent = `${updatedUser.name} (${updatedUser.email})`;
                closeEditModal();
            } else {
                const errorData = await response.json();
                document.getElementById('edit-user-error').textContent = errorData.error;
            }
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = 'Save Changes';
        }
    });

    closeModal.addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    fetchUsers();
});
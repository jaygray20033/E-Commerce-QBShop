import { Table, Button, Container } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './UserListScreen.css';

const UserListScreen = () => {
  const { t } = useLanguage();
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container className='user-list-container'>
      <div className='admin-section-header'>
        <h1 className='admin-section-title'>{t.users}</h1>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className='admin-table-wrapper'>
          <Table striped hover responsive className='admin-users-table'>
            <thead>
              <tr>
                <th>{t.id}</th>
                <th>{t.name}</th>
                <th>{t.email}</th>
                <th>{t.isAdmin}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className='admin-table-row'
                >
                  <td className='user-id-cell'>
                    {user._id.substring(0, 8)}...
                  </td>
                  <td className='user-name-cell'>{user.name}</td>
                  <td className='user-email-cell'>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td className='admin-status-cell'>
                    {user.isAdmin ? (
                      <span className='admin-badge'>
                        <FaCheck className='admin-icon' /> Admin
                      </span>
                    ) : (
                      <span className='user-badge'>
                        <FaTimes className='user-icon' /> User
                      </span>
                    )}
                  </td>
                  <td className='action-buttons-cell'>
                    {!user.isAdmin && (
                      <div className='action-buttons'>
                        <Button
                          as={Link}
                          to={`/admin/user/${user._id}/edit`}
                          className='btn-edit'
                          title='Edit user'
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          className='btn-delete'
                          onClick={() => deleteHandler(user._id)}
                          title='Delete user'
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default UserListScreen;

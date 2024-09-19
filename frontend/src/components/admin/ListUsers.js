import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import {
  useDeleteuserMutation,
  useGetAdminUsersQuery,
} from "../../redux/api/userApi";
import AdminLayout from "../layout/AdminLayout";

const ListUsers = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();

  const [
    deleteUser,
    { error: deleteError, isLoading: isDeleteLoading, isSuccess },
  ] = useDeleteuserMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("User Deleted");
    }
  }, [error, deleteError, isSuccess]);

  const deleteUserHandler = (id) => {
    deleteUser(id);
  };

  const setUsers = () => {
    const users = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.users?.forEach((user) => {
      if (user && user._id) {
        users.rows.push({
          id: user._id,
          name: user?.name,
          email: user?.email,
          role: user?.role,
          actions: (
            <>
              <Link
                to={`/admin/users/${user?._id}`}
                className="btn btn-outline-primary"
              >
                <i className="fa fa-pencil"></i>
              </Link>

              <button
                className="btn btn-outline-danger ms-2"
                onClick={() => deleteUserHandler(user?._id)}
                disabled={isDeleteLoading}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      }
    });

    return users;
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      {" "}
      <div>
        <h1 className="my-5">{data?.users?.length} Users</h1>
        <MDBDataTable
          data={setUsers()}
          className="px-3"
          bordered
          striped
          hover
        />
      </div>
    </AdminLayout>
  );
};

export default ListUsers;

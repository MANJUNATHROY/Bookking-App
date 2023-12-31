import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch"
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([])
  console.log(path)
  const dataUser = useFetch(`https://bookking-app-manjunathroy.onrender.com/server/${path}`,
    {
      Headers: {
        token: JSON.parse(localStorage.getItem("user")).token
      },
    }
  );
  const data = dataUser.data;
  console.log(data)
  const loading = dataUser.loading;

  useEffect(() => {
    setList(data);
  }, [data]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://bookking-app-manjunathroy.onrender.com/server/${path}/${id}`,
        {
          headers: {
            token: JSON.parse(localStorage.getItem("user")).token
          },
        }
      )
      setList(list.filter((item) => item._id !== id));

    } catch (err) {
      console.log(err)
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;

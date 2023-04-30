import React, { useEffect } from 'react';
import { Table } from 'antd';
import {BiEdit} from "react-icons/bi";
import {AiFillDelete} from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { getAllBrands } from '../features/brand/brandSlice';
import { Link } from 'react-router-dom';
const columns = [
    {
      title: 'SNo',
      dataIndex: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];
 
const Brandlist = () => {
  //Calling the dispatch function to fetch data from database
  const dispatch = useDispatch();
  useEffect(() => {
    //calling the getAllBrands  asyncthunk function
    dispatch(getAllBrands());
  },[]);
const brandState = useSelector((state) => state.brand.brands);
const data1 = [];
  for (let i = 0; i < brandState.length; i++) {
    data1.push({
      key: i + 1,
      name: brandState[i].title,
      action: (
        <>
        <Link className="fs-3 text-danger" to ='/'>
          <BiEdit/>
        </Link>
        <Link  className="ms-3 fs-3 text-danger" to ='/'>
          <AiFillDelete/>
        </Link> 
        </>
      ),
    });
  }
  console.log(data1);
  return (
    <div>
    <h3 className="mb-4" title>Brands</h3>
    <div>
    <Table columns={columns} dataSource={data1} />
    </div>
    </div>
  );
};

export default Brandlist;
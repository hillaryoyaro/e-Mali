import React, { useEffect } from 'react';
import { Table } from 'antd';
import {AiFillDelete} from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEnquiries } from '../features/enquiry/enquirySlice';
const columns = [
    {
      title: 'SNo',
      dataIndex: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];
  
const Enquiries = () => {
  //Calling the dispatch function and pass blank dependencie inside useEffect
  const dispatch = useDispatch();
    useEffect(() => {
      //Calling getAllEnquiries inside dispatch function
      dispatch(getAllEnquiries());
    },[]);
  const enquiryState = useSelector((state) => state.enquiry.enquiries);
  const data1 = [];
  if (enquiryState){
    for (let i = 0; i < enquiryState.length; i++) {
      data1.push({
        key: i + 1,
        name: enquiryState[i].name,
        email: enquiryState[i].email,
        mobile: enquiryState[i].mobile,
        date: enquiryState[i].createdAt,
        Status: (
          <>
          <select className="form-control form-select" name="">
            <option value="">Set status</option>
          </select>
          </>
        ),
        action: (
          <>
          <Link  className="ms-3 fs-3 text-danger" to ='/'>
            <AiFillDelete/>
          </Link> 
          </>
        ),
      });
    }
  
  }
  return (
    <div>
        <h3 className="mb-4" title>Enquiries</h3>
        <div>
        <Table columns={columns} dataSource={data1} />
        </div>
    </div>
  );
};

export default Enquiries;
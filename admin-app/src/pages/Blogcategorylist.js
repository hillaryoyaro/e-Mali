import React, { useEffect } from 'react';
import { Table } from 'antd';
import {BiEdit} from "react-icons/bi";
import {AiFillDelete} from "react-icons/ai";

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../features/blogCategory/blogCategorySlice';
const columns = [
    {
      title: 'SNo',
      dataIndex: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];

const Blogcategorylist = () => {
    //Calling the dispatch function and passing black dependencies
  const dispatch = useDispatch();
    useEffect(() => {
      //calling getAllCategories inside the dispatch to fetch data from the database
      dispatch(getAllCategories());
    },[]);
    //creating object for state
    const blogCategoryState = useSelector((state) => state.blogCategory.blogCategories); 
    console.log(blogCategoryState);
    const data1 = [];
    for (let i = 0; i < blogCategoryState.length; i++) {
      data1.push({
        key: i + 1,
        name: blogCategoryState[i].title,
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
        <h3 className="mb-4" title>Blog Categories </h3>
        <div>
        <Table columns={columns} dataSource={data1} />
        </div>
    </div>
  );
};

export default Blogcategorylist;
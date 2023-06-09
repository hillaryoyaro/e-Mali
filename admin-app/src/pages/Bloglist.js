import React, { useEffect } from 'react';
import { Table } from 'antd';
import {BiEdit} from "react-icons/bi";
import {AiFillDelete} from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '../features/blogs/blogSlice';
const columns = [
    {
      title: 'SNo',
      dataIndex: 'key',
    },
    {
      title: 'Title',
      dataIndex: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];

const Bloglist = () => {
  //Calling the dispatch function and passing blank dependencie
  const dispatch = useDispatch();
  useEffect(() => {
    //calling getAllBlogs inside the dispatch
    dispatch(getAllBlogs());
  },[]);
  const getBlogState = useSelector((state) => state.blog.blogs);
  const data1 = [];
  for (let i = 0; i < getBlogState.length; i++) {
    data1.push({
      key: i + 1,
      name: getBlogState[i].title,
      category: getBlogState[i].category,
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
  
  return (
    <div>
        <h3 className="mb-4" title>Blog List</h3>
        <div>
        <Table columns={columns} dataSource={data1} />
        </div>
    </div>
  );
};
export default Bloglist;
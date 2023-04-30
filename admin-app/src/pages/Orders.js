import React, { useEffect } from 'react'
import { Table } from 'antd';
import {BiEdit} from "react-icons/bi";
import {AiFillDelete} from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../features/order/orderSlice';
import moment from 'moment'
const columns = [
  {
    title: 'SNo',
    dataIndex: 'key',
  },
  {
    title: 'Customer info',
    dataIndex: 'customer',
  },
  {
    title: 'Products',
    dataIndex: 'products',
  },
  {
    title: 'Date',
    dataIndex: 'date'
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Total',
    dataIndex: 'amount'
  }
  ,
  {
    title: 'Action',
    dataIndex: 'action',
  },
  ];


const Orders = () => {
   //Calling the dispatch function and pass blank dependencie inside useEffect
   const dispatch = useDispatch();
   useEffect(() => {
     //Calling getAllColors inside dispatch and passing black dependencie
     dispatch(getAllOrders());
   },[]);
   //definining the orderState using useSelector
   const orderState = useSelector((state) => state.order.orders);
   console.log(orderState);
   const data1 = [];
   //use of if  to handle "cannot read property 'length' of undefined" error
   if (orderState) {
    for (let i = 0; i < orderState.length; i++) {
      data1.push({
        key: orderState[i]._id,
        customer: orderState[i].orderedBy.firstname + " " + orderState[i].orderedBy.lastname,
        products: orderState[i].products.map((i) => {
          return (
            <>
              <ul>
                <li>
                {i.product.title}
                </li>
              </ul>
            </>
          );
        }),
        date: moment(orderState[i].createdAt).format('MMMM Do YYYY, h:mm:ss a'),
        status: orderState[i].orderStatus,
        amount: orderState[i].paymentIntent.amount,
        action: (
          <>
            <Link className=' fs-3 ' to="/"> 
              <BiEdit/> 
            </Link>
            <Link className='ms-3 fs-3 text-danger' to="/">
              <AiFillDelete/>
            </Link>
          </>),
      });
    }
   }
  return (
    <div>
        <h3 className="mb-4" title>Orders</h3>
        <div>
        <Table columns={columns} dataSource={data1} />
        </div>
    </div>
  );
};

export default Orders;
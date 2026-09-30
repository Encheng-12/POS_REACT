import React from 'react';
import { useState, useEffect } from "react";
import {
  Avatar,
  List,
} from "antd";
import { PlusOutlined, TagFilled } from "@ant-design/icons";
import CategoryTable from '../components/CategoryTable';

function CategoryPage() {
  return (
    <>
        <CategoryTable />
    </>
  );
}

export default CategoryPage;

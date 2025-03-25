import React, { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { debounce } from "lodash";

const SearchContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;
const StyleSearch = styled(Input)`
  width: 100%;
  max-width: 400px;
  height: 40px;
  margin: 0 auto;
`;

const InputSearch = ({ placeholder = "Tìm kiếm...", onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = debounce((e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  }, 300);

  return (
    <SearchContainer>
      <StyleSearch
        prefix={<SearchOutlined />}
        placeholder={placeholder}
        onChange={handleChange}
        allowClear
      />
    </SearchContainer>
  );
};

export default InputSearch;

import { Col, Flex, Row, Slider } from 'antd';
import React from 'react';
import { useGetAllCategoriesQuery } from '../../redux/features/management/categoryApi';
import { useGetAllBrandsQuery } from '../../redux/features/management/brandApi';

interface ProductManagementFilterProps {
  query: { name: string; category: string; brand: string; limit: number };
  setQuery: React.Dispatch<
    React.SetStateAction<{ name: string; category: string; brand: string; limit: number }>
  >;
}

const ProductManagementFilter = ({ query, setQuery }: ProductManagementFilterProps) => {
  const { data: categories } = useGetAllCategoriesQuery(undefined);
  const { data: brands } = useGetAllBrandsQuery(undefined);

  return (
    <div className="product-filter">
      <div className="filter-header">
        <h3>Filter Products</h3>
        <p>Search and filter product inventory</p>
      </div>

      <Flex>
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={{ span: 24 }} md={{ span: 8 }}>
            <div className="filter-item">
              <label className="filter-label">Price Range</label>
              <Slider
                range
                step={100}
                max={20000}
                defaultValue={[1000, 5000]}
                onChange={(value) => {
                  setQuery((prev) => ({
                    ...prev,
                    minPrice: value[0],
                    maxPrice: value[1],
                  }));
                }}
              />
            </div>
          </Col>

          <Col xs={{ span: 24 }} md={{ span: 8 }}>
            <div className="filter-item">
              <label className="filter-label">Search Product</label>
              <input
                type="text"
                value={query.name}
                className="input-field filter-input"
                placeholder="Search by Product Name"
                onChange={(e) => setQuery((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </Col>

          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <div className="filter-item">
              <label className="filter-label">Category</label>
              <select
                name="category"
                className="input-field filter-input"
                defaultValue={query.category}
                onChange={(e) => setQuery((prev) => ({ ...prev, category: e.target.value }))}
                onBlur={(e) => setQuery((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                {categories?.data?.map((category: { _id: string; name: string }) => (
                  <option value={category._id} key={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </Col>

          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <div className="filter-item">
              <label className="filter-label">Brand</label>
              <select
                name="Brand"
                className="input-field filter-input"
                defaultValue={query.brand}
                onChange={(e) => setQuery((prev) => ({ ...prev, brand: e.target.value }))}
                onBlur={(e) => setQuery((prev) => ({ ...prev, brand: e.target.value }))}
              >
                <option value="">All Brands</option>
                {brands?.data?.map((brand: { _id: string; name: string }) => (
                  <option value={brand._id} key={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </Col>
        </Row>
      </Flex>
    </div>
  );
};

export default ProductManagementFilter;
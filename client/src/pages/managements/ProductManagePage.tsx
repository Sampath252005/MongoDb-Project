import { DeleteFilled, EditFilled } from '@ant-design/icons';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Col, Flex, Modal, Pagination, Row, Table, Tag } from 'antd';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  useAddStockMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from '../../redux/features/management/productApi';
import { ICategory, IProduct } from '../../types/product.types';
import ProductManagementFilter from '../../components/query-filters/ProductManagementFilter';
import CustomInput from '../../components/CustomInput';
import toastMessage from '../../lib/toastMessage';
import { useGetAllCategoriesQuery } from '../../redux/features/management/categoryApi';
import { useGetAllSellerQuery } from '../../redux/features/management/sellerApi';
import { useGetAllBrandsQuery } from '../../redux/features/management/brandApi';
import { useCreateSaleMutation } from '../../redux/features/management/saleApi';
import { SpinnerIcon } from '@phosphor-icons/react';

const ProductManagePage = () => {
  const [current, setCurrent] = useState(1);
  const [query, setQuery] = useState({
    name: '',
    category: '',
    brand: '',
    limit: 10,
  });

  const { data: products, isFetching } = useGetAllProductsQuery(query);

  const onChange: PaginationProps['onChange'] = (page) => {
    setCurrent(page);
  };

  const tableData = products?.data?.map((product: IProduct) => ({
    key: product._id,
    name: product.name,
    category: product.category,
    categoryName: product.category.name,
    price: product.price,
    stock: product.stock,
    seller: product?.seller,
    sellerName: product?.seller?.name || 'DELETED SELLER',
    brand: product.brand,
    size: product.size,
    description: product.description,
  }));

  const columns: TableColumnsType<any> = [
    {
      title: 'Product Name',
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => <span className="product-name-cell">{name}</span>,
    },
    {
      title: 'Category',
      key: 'categoryName',
      dataIndex: 'categoryName',
      align: 'center',
      render: (categoryName: string) => <Tag color="blue">{categoryName}</Tag>,
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      render: (price: number) => <span className="price-cell">${price}</span>,
    },
    {
      title: 'Stock',
      key: 'stock',
      dataIndex: 'stock',
      align: 'center',
      render: (stock: number) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>{stock}</Tag>
      ),
    },
    {
      title: 'Purchase From',
      key: 'sellerName',
      dataIndex: 'sellerName',
      align: 'center',
      render: (sellerName: string) => {
        if (sellerName === 'DELETED SELLER') return <Tag color="red">{sellerName}</Tag>;
        return <Tag color="green">{sellerName}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'x',
      align: 'center',
      render: (item) => {
        return (
          <div className="table-actions">
            <SellProductModal product={item} />
            <AddStockModal product={item} />
            <UpdateProductModal product={item} />
            <DeleteProductModal id={item.key} />
          </div>
        );
      },
      width: '1%',
    },
  ];

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Product Management</h1>
        <p>Manage products, stock, sales and product updates</p>
      </div>

      <div className="filter-card">
        <ProductManagementFilter query={query} setQuery={setQuery} />
      </div>

      <div className="table-card">
        <Table
          size="middle"
          loading={isFetching}
          columns={columns}
          dataSource={tableData}
          pagination={false}
          scroll={{ x: true }}
        />
      </div>

      <Flex justify="center" style={{ marginTop: '1rem' }}>
        <Pagination
          current={current}
          onChange={onChange}
          defaultPageSize={query.limit}
          total={products?.meta?.total}
        />
      </Flex>
    </div>
  );
};

/**
 * Sell Product Modal
 */
const SellProductModal = ({ product }: { product: IProduct & { key: string } }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const [saleProduct, { isLoading }] = useCreateSaleMutation();

  const onSubmit = async (data: FieldValues) => {
    const payload = {
      product: product.key,
      productName: product.name,
      productPrice: product.price,
      quantity: Number(data.quantity),
      buyerName: data.buyerName,
      date: data.date,
    };
    try {
      const res = await saleProduct(payload).unwrap();
      if (res.statusCode === 201) {
        toastMessage({ icon: 'success', text: res.message });
        reset();
        handleCancel();
      }
    } catch (error: any) {
      handleCancel();
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} type="primary" className="table-btn sell-btn">
        Sell
      </Button>

      <Modal
        title="Sell Product"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <CustomInput
            name="buyerName"
            label="Buyer Name"
            errors={errors}
            required={true}
            register={register}
            type="text"
          />
          <CustomInput
            name="date"
            label="Selling date"
            errors={errors}
            required={true}
            register={register}
            type="date"
          />
          <CustomInput
            name="quantity"
            label="Quantity"
            errors={errors}
            required={true}
            register={register}
            type="number"
          />
          <Flex justify="center" style={{ marginTop: '1rem' }}>
            <Button htmlType="submit" type="primary" disabled={isLoading} className="modal-submit-btn">
              {isLoading && <SpinnerIcon className="spin" weight="bold" />}
              Sell Product
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

/**
 * Add Stock Modal
 */
const AddStockModal = ({ product }: { product: IProduct & { key: string } }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmit, register, reset } = useForm();
  const [addToStock, { isLoading }] = useAddStockMutation();

  const onSubmit = async (data: FieldValues) => {
    const payload = {
      stock: Number(data.stock),
      seller: product.seller,
    };

    try {
      const res = await addToStock({ id: product.key, payload }).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        reset();
        handleCancel();
      }
    } catch (error: any) {
      handleCancel();
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} type="primary" className="table-btn stock-btn">
        Add Stock
      </Button>

      <Modal
        title="Add Product to Stock"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <CustomInput name="stock" label="Add Stock" register={register} type="number" />
          <Flex justify="center" style={{ marginTop: '1rem' }}>
            <Button htmlType="submit" type="primary" disabled={isLoading} className="modal-submit-btn">
              {isLoading && <SpinnerIcon className="spin" weight="bold" />}
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

/**
 * Update Product Modal
 */
const UpdateProductModal = ({ product }: { product: IProduct & { key: string } }) => {
  const [updateProduct] = useUpdateProductMutation();
  const { data: categories } = useGetAllCategoriesQuery(undefined);
  const { data: sellers, isLoading: isSellerLoading } = useGetAllSellerQuery(undefined);
  const { data: brands } = useGetAllBrandsQuery(undefined);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: product.name,
      price: product.price,
      seller: product?.seller?._id,
      category: product.category._id,
      brand: product.brand?._id,
      description: product.description,
      size: product.size,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await updateProduct({ id: product.key, payload: data }).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        reset();
        handleCancel();
      }
    } catch (error: any) {
      handleCancel();
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} type="primary" className="table-btn-small edit-btn">
        <EditFilled />
      </Button>

      <Modal
        title="Update Product Info"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <CustomInput
            name="name"
            errors={errors}
            label="Name"
            register={register}
            required={true}
          />

          <CustomInput
            errors={errors}
            label="Price"
            type="number"
            name="price"
            register={register}
            required={true}
          />

          <Row className="form-row">
            <Col xs={{ span: 23 }} lg={{ span: 6 }}>
              <label htmlFor="Size" className="label">
                Seller
              </label>
            </Col>
            <Col xs={{ span: 23 }} lg={{ span: 18 }}>
              <select
                disabled={isSellerLoading}
                {...register('seller', { required: true })}
                className={`input-field ${errors['seller'] ? 'input-field-error' : ''}`}
              >
                <option value="">Select Seller*</option>
                {sellers?.data.map((item: ICategory) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <Row className="form-row">
            <Col xs={{ span: 23 }} lg={{ span: 6 }}>
              <label htmlFor="Size" className="label">
                Category
              </label>
            </Col>
            <Col xs={{ span: 23 }} lg={{ span: 18 }}>
              <select
                {...register('category', { required: true })}
                className={`input-field ${errors['category'] ? 'input-field-error' : ''}`}
              >
                <option value="">Select Category*</option>
                {categories?.data.map((item: ICategory) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <Row className="form-row">
            <Col xs={{ span: 23 }} lg={{ span: 6 }}>
              <label htmlFor="Size" className="label">
                Brand
              </label>
            </Col>
            <Col xs={{ span: 23 }} lg={{ span: 18 }}>
              <select
                {...register('brand')}
                className={`input-field ${errors['brand'] ? 'input-field-error' : ''}`}
              >
                <option value="">Select brand</option>
                {brands?.data.map((item: ICategory) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <CustomInput label="Description" name="description" register={register} />

          <Row className="form-row">
            <Col xs={{ span: 23 }} lg={{ span: 6 }}>
              <label htmlFor="Size" className="label">
                Size
              </label>
            </Col>
            <Col xs={{ span: 23 }} lg={{ span: 18 }}>
              <select className="input-field" {...register('size')}>
                <option value="">Select Product Size</option>
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </Col>
          </Row>

          <Flex justify="center" style={{ marginTop: '1rem' }}>
            <Button htmlType="submit" type="primary" className="modal-submit-btn">
              Update
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

/**
 * Delete Product Modal
 */
const DeleteProductModal = ({ id }: { id: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteProduct] = useDeleteProductMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteProduct(id).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        handleCancel();
      }
    } catch (error: any) {
      handleCancel();
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <>
      <Button onClick={showModal} type="primary" className="table-btn-small delete-btn">
        <DeleteFilled />
      </Button>

      <Modal
        title="Delete Product"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
      >
        <div className="delete-modal-content">
          <h2>Are you sure you want to delete this product?</h2>
          <h4>You won&apos;t be able to revert it.</h4>

          <div className="delete-modal-actions">
            <Button onClick={handleCancel} type="primary" className="cancel-btn">
              Cancel
            </Button>

            <Button onClick={() => handleDelete(id)} type="primary" className="confirm-delete-btn">
              Yes! Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductManagePage;
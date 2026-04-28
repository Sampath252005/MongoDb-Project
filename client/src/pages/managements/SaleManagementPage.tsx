import { DeleteFilled, EditFilled } from '@ant-design/icons';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Flex, Modal, Pagination, Table, Tag } from 'antd';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import SearchInput from '../../components/SearchInput';
import toastMessage from '../../lib/toastMessage';
import { useDeleteSaleMutation, useGetAllSaleQuery } from '../../redux/features/management/saleApi';
import { IProduct } from '../../types/product.types';
import { ITableSale } from '../../types/sale.type';
import formatDate from '../../utils/formatDate';

const SaleManagementPage = () => {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: '',
  });

  const { data, isFetching } = useGetAllSaleQuery(query);

  const onChange: PaginationProps['onChange'] = (page) => {
    setQuery((prev) => ({ ...prev, page: page }));
  };

  const tableData = data?.data?.map((sale: ITableSale) => ({
    key: sale._id,
    productName: sale.productName,
    productPrice: sale.productPrice,
    buyerName: sale.buyerName,
    quantity: sale.quantity,
    totalPrice: sale.totalPrice,
    date: formatDate(sale.date),
  }));

  const columns: TableColumnsType<any> = [
    {
      title: 'Product Name',
      key: 'productName',
      dataIndex: 'productName',
      render: (productName: string) => <span className="product-name-cell">{productName}</span>,
    },
    {
      title: 'Product Price',
      key: 'productPrice',
      dataIndex: 'productPrice',
      align: 'center',
      render: (price: number) => <span className="price-cell">${price}</span>,
    },
    {
      title: 'Buyer Name',
      key: 'buyerName',
      dataIndex: 'buyerName',
      align: 'center',
      render: (buyerName: string) => <Tag color="blue">{buyerName}</Tag>,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'center',
      render: (quantity: number) => <Tag color="green">{quantity}</Tag>,
    },
    {
      title: 'Total Price',
      key: 'totalPrice',
      dataIndex: 'totalPrice',
      align: 'center',
      render: (totalPrice: number) => <span className="price-cell">${totalPrice}</span>,
    },
    {
      title: 'Selling Date',
      key: 'date',
      dataIndex: 'date',
      align: 'center',
      render: (date: string) => <span className="date-cell">{date}</span>,
    },
    {
      title: 'Action',
      key: 'x',
      align: 'center',
      render: (item) => {
        return (
          <div className="table-actions">
            <UpdateModal product={item} />
            <DeleteModal id={item.key} />
          </div>
        );
      },
      width: '1%',
    },
  ];

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Sales Management</h1>
        <p>View sold products, buyers, revenue and sales records</p>
      </div>

      <div className="filter-card">
        <Flex justify="end" style={{ gap: 8 }}>
          <SearchInput setQuery={setQuery} placeholder="Search Sold Products..." />
        </Flex>
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
          current={query.page}
          onChange={onChange}
          defaultPageSize={query.limit}
          total={data?.meta?.total}
        />
      </Flex>
    </div>
  );
};

/**
 * Update Modal
 */
const UpdateModal = ({ product }: { product: IProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmit } = useForm();

  const onSubmit = (data: FieldValues) => {
    console.log({ product, data });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // ! Remove the first return to work on this component
  return;

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
          <h1>Working on it...!!!</h1>
          <Button htmlType="submit" type="primary" className="modal-submit-btn">
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
};

/**
 * Delete Modal
 */
const DeleteModal = ({ id }: { id: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSale] = useDeleteSaleMutation();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSale(id).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
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
      <Button onClick={showModal} type="primary" className="table-btn-small delete-btn">
        <DeleteFilled />
      </Button>

      <Modal
        title="Delete Sale Record"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
      >
        <div className="delete-modal-content">
          <h2>Are you sure you want to delete this sale?</h2>
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

export default SaleManagementPage;
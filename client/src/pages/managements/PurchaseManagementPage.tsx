import { DeleteFilled, EditFilled } from '@ant-design/icons';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Flex, Modal, Pagination, Table, Tag } from 'antd';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  useDeletePurchaseMutation,
  useGetAllPurchasesQuery,
} from '../../redux/features/management/purchaseApi';
import { IProduct } from '../../types/product.types';
import { IPurchase } from '../../types/purchase.types';
import formatDate from '../../utils/formatDate';
import toastMessage from '../../lib/toastMessage';
import SearchInput from '../../components/SearchInput';

const PurchaseManagementPage = () => {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: '',
  });

  const { data, isFetching } = useGetAllPurchasesQuery(query);

  const onChange: PaginationProps['onChange'] = (page) => {
    setQuery((prev) => ({ ...prev, page: page }));
  };

  const tableData = data?.data?.map((purchase: IPurchase) => ({
    key: purchase._id,
    sellerName: purchase.sellerName,
    productName: purchase.productName,
    price: purchase.unitPrice,
    quantity: purchase.quantity,
    totalPrice: purchase.totalPrice,
    due: purchase.totalPrice - purchase.paid,
    date: formatDate(purchase.createdAt),
  }));

  const columns: TableColumnsType<any> = [
    {
      title: 'Seller Name',
      key: 'sellerName',
      dataIndex: 'sellerName',
      render: (sellerName: string) => <Tag color="blue">{sellerName}</Tag>,
    },
    {
      title: 'Product Name',
      key: 'productName',
      dataIndex: 'productName',
      render: (productName: string) => (
        <span className="product-name-cell">{productName}</span>
      ),
    },
    {
      title: 'Price(per unit)',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      render: (price: number) => <span className="price-cell">${price}</span>,
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
      render: (totalPrice: number) => (
        <span className="price-cell">${totalPrice}</span>
      ),
    },
    {
      title: 'Due',
      key: 'due',
      dataIndex: 'due',
      align: 'center',
      render: (due: number) => (
        <Tag color={due > 0 ? 'orange' : 'green'}>${due}</Tag>
      ),
    },
    {
      title: 'Date',
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
        <h1>Purchase Management</h1>
        <p>Track supplier purchases, quantities, payments and dues</p>
      </div>

      <div className="filter-card">
        <Flex justify="end" style={{ gap: 8 }}>
          <SearchInput setQuery={setQuery} placeholder="Search Purchase..." />
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
    console.log({ data, product });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // ! This is not complete, need to complete this to make it work

  return (
    <>
      <Button onClick={showModal} type="primary" className="table-btn-small edit-btn">
        <EditFilled />
      </Button>

      <Modal
        title="Update Purchase Info"
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
  const [deletePurchase] = useDeletePurchaseMutation();

  const handleDelete = async (id: string) => {
    try {
      const res = await deletePurchase(id).unwrap();
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
        title="Delete Purchase"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
      >
        <div className="delete-modal-content">
          <h2>Are you sure you want to delete this purchase?</h2>
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

export default PurchaseManagementPage;